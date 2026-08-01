import { dedent } from "strip-indent";

import type { CacheBlock, CacheReadResult } from "./cache.ts";

export interface CacheTraceEntry {
  memoryBlock: number;
  result: CacheReadResult;
  cacheBlocks: readonly CacheBlock[];
}

export function formatTrace(entry: Readonly<CacheTraceEntry>): string {
  const cache = entry.cacheBlocks.map((b) => b.memoryBlock).join(", ");

  if (entry.result.isHit) {
    return dedent(`
      Reading memory block ${entry.memoryBlock}.
      Cache hit.
      Found in cache block ${entry.result.cacheBlock}
      Access completed in ${entry.result.accessTime} ms
      Cache: [${cache}]
    `);
  }

  if (entry.result.evictedMemoryBlock !== undefined) {
    return dedent(`
      Reading memory block ${entry.memoryBlock}.
      Cache miss.
      Evicted memory block ${entry.result.evictedMemoryBlock}
      Loaded into cache block ${entry.result.cacheBlock}
      Access completed in ${entry.result.accessTime} ms
      Cache: [${cache}]
    `);
  }

  return dedent(`
    Reading memory block ${entry.memoryBlock}.
    Cache miss.
    Loaded into cache block ${entry.result.cacheBlock}
    Access completed in ${entry.result.accessTime} ms
    Cache: [${cache}]
  `);
}
