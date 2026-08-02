import { isPowerOfTwo } from "../utils/number.ts";
import { MAIN_MEMORY_BLOCK_COUNT, MEMORY_ACCESS_TIME } from "./memory.ts";

export const ReadPolicy = {
  LoadThrough: "load-through",
  NonLoadThrough: "non-load-through",
} as const;
export type ReadPolicy = (typeof ReadPolicy)[keyof typeof ReadPolicy];

export const ReplacementAlgorithm = {
  LRU: "lru",
  MRU: "mru",
} as const;
export type ReplacementAlgorithm = (typeof ReplacementAlgorithm)[keyof typeof ReplacementAlgorithm];

export interface CacheBlock {
  memoryBlock: number;
  age: number;
}

export interface CacheReadResult {
  isHit: boolean;
  cacheBlock: number;
  evictedMemoryBlock?: number;
  accessTime: number;
}

export class Cache {
  static readonly MINIMUM_BLOCK_SIZE = 2;
  static readonly MINIMUM_BLOCK_COUNT = 4;

  static readonly ACCESS_TIME = 1;

  readonly blockSize: number;
  readonly #blocks: CacheBlock[] = [];
  readonly blockCount: number;

  readonly readPolicy: ReadPolicy;
  readonly replacementAlgorithm: ReplacementAlgorithm;

  readonly #missPenalty: number;

  readonly #hitTime: number;
  readonly #missTime: number;

  #hitCount = 0;
  #missCount = 0;

  constructor(
    readPolicy: ReadPolicy,
    replacementAlgo: ReplacementAlgorithm,
    blockSize = Cache.MINIMUM_BLOCK_SIZE,
    blockCnt = Cache.MINIMUM_BLOCK_COUNT,
  ) {
    if (blockSize < Cache.MINIMUM_BLOCK_SIZE || !isPowerOfTwo(blockSize)) {
      throw new RangeError("Cache block size is out of range");
    }

    if (blockCnt < Cache.MINIMUM_BLOCK_COUNT || !isPowerOfTwo(blockCnt)) {
      throw new RangeError("Cache block count is out of range");
    }

    this.blockSize = blockSize;
    this.blockCount = blockCnt;

    this.readPolicy = readPolicy;
    this.replacementAlgorithm = replacementAlgo;

    this.#missPenalty = Cache.ACCESS_TIME + MEMORY_ACCESS_TIME * blockSize;

    this.#hitTime = Cache.ACCESS_TIME * blockSize;
    this.#missTime = Cache.ACCESS_TIME + MEMORY_ACCESS_TIME * blockSize;

    if (readPolicy === ReadPolicy.NonLoadThrough) {
      this.#missPenalty += Cache.ACCESS_TIME;

      this.#missTime += Cache.ACCESS_TIME * this.blockSize;
    }
  }

  get blocks(): readonly CacheBlock[] {
    return this.#blocks;
  }

  get hitCount(): number {
    return this.#hitCount;
  }

  get missCount(): number {
    return this.#missCount;
  }

  get accessCount(): number {
    return this.#hitCount + this.#missCount;
  }

  get hitRate(): number {
    const { accessCount } = this;

    return accessCount === 0 ? 0 : this.#hitCount / accessCount;
  }

  get missRate(): number {
    const { accessCount } = this;

    return accessCount === 0 ? 0 : this.#missCount / accessCount;
  }

  get totalAccessTime(): number {
    return this.#hitCount * this.#hitTime + this.#missCount * this.#missTime;
  }

  get averageAccessTime(): number {
    if (this.accessCount === 0) {
      return 0;
    }

    return this.hitRate * Cache.ACCESS_TIME + this.missRate * this.#missPenalty;
  }

  #findBlock(memBlock: number): number {
    return this.#blocks.findIndex((b) => b.memoryBlock === memBlock);
  }

  #findLRUBlock(): number {
    let lruIdx = 0;

    for (let i = 1; i < this.#blocks.length; i++) {
      if (this.#blocks[i].age > this.#blocks[lruIdx].age) {
        lruIdx = i;
      }
    }

    return lruIdx;
  }

  #findMRUBlock(): number {
    let mruIdx = 0;

    for (let i = 1; i < this.#blocks.length; i++) {
      if (this.#blocks[i].age < this.#blocks[mruIdx].age) {
        mruIdx = i;
      }
    }

    return mruIdx;
  }

  #increaseAges(): void {
    for (const block of this.#blocks) {
      block.age++;
    }
  }

  read(memBlock: number): CacheReadResult {
    if (memBlock < 0 || memBlock > MAIN_MEMORY_BLOCK_COUNT) {
      throw new RangeError("Memory block index is out of bounds");
    }

    const hitIdx = this.#findBlock(memBlock);

    if (hitIdx !== -1) {
      this.#hitCount++;

      this.#increaseAges();

      this.#blocks[hitIdx].age = 0;

      return {
        isHit: true,
        cacheBlock: hitIdx,
        accessTime: this.#hitTime,
      };
    }

    this.#missCount++;

    this.#increaseAges();

    const newBlock = { memoryBlock: memBlock, age: 0 } satisfies CacheBlock;

    if (this.#blocks.length < this.blockCount) {
      const newBlockIdx = this.#blocks.push(newBlock) - 1;

      return {
        isHit: false,
        cacheBlock: newBlockIdx,
        accessTime: this.#missTime,
      };
    }

    const newBlockIdx =
      this.replacementAlgorithm === ReplacementAlgorithm.LRU ? this.#findLRUBlock() : this.#findMRUBlock();

    const { memoryBlock: evictedMemoryBlock } = this.#blocks[newBlockIdx];

    this.#blocks[newBlockIdx] = newBlock;

    return {
      isHit: false,
      cacheBlock: newBlockIdx,
      evictedMemoryBlock,
      accessTime: this.#missTime,
    };
  }
}
