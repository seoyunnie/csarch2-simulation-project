# CSARCH2 Simulation Project

A web-based Cache Memory simulator built for **Machine 6: Fully Associative (FA) + LRU vs. Fully Associative (FA) + MRU**.

- **Live demo:** https://seoyunnie.github.io/csarch2-simulation-project
- **Video walkthrough:** _[Add YouTube link here]_

## Simulation Specifications

The simulator implements a fully associative cache (any memory block can occupy any cache block; there is no set indexing), with the following parameters exposed in the UI:

| Parameter | Constraint | Default used in this write-up |
| --- | --- | --- |
| Main memory size | Fixed | 1024 blocks (indices `0`–`1023`) |
| Block size | Power of 2, minimum 2 words | **16 words** |
| Number of cache blocks (`n`) | Power of 2, minimum 4 | **8 blocks** |
| Read policy | Parameterized | **Non-load-through** (fixed for this comparison) |
| Replacement algorithm | Parameterized | **LRU** vs **MRU** (the variable being compared) |

Timing model (per access):

- `hitTime = ACCESS_TIME × blockSize` = `1 × 16` = **16 ms**
- `missTime = ACCESS_TIME + MEMORY_ACCESS_TIME × blockSize (+ ACCESS_TIME × blockSize` for non-load-through`)` = **177 ms**
- `missPenalty = ACCESS_TIME + MEMORY_ACCESS_TIME × blockSize (+ ACCESS_TIME` for non-load-through`)` = **162 ms**
- `Average Access Time (AMAT) = hitRate × ACCESS_TIME + missRate × missPenalty`

With `n = 8`, the three required test sequences below were generated and replayed through both replacement algorithms.

## Analysis Write-up

### Test Case A — Sequential sequence

**Pattern:** blocks `0` to `2n − 1` (16 blocks), repeated twice — 32 accesses total.

```
0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15, 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
```

| Metric | FA + LRU | FA + MRU |
| --- | --- | --- |
| Accesses | 32 | 32 |
| Hits | 0 | 8 |
| Misses | 32 | 24 |
| Hit rate | 0/32 (0%) | 8/32 = 1/4 (25%) |
| Miss rate | 32/32 (100%) | 24/32 = 3/4 (75%) |
| Average access time | 162 ms | 121.75 ms |
| Total access time | 5,664 ms | 4,376 ms |

Because the working set (16 distinct blocks) is exactly `2n`, twice the cache capacity, LRU hits its classic pathological case: every eviction target is the oldest block, so by the time the loop wraps back to block `0` in the second pass, the entire first-round working set has already been flushed out in the same order it entered. The result is a **0% hit rate — pure cache thrashing**, sometimes called "sequential flooding." MRU handles this pattern noticeably better: it always evicts the *most* recently inserted block, which — for a strictly increasing sequential stream — accidentally leaves a handful of older entries resident long enough to be reused, producing a 25% hit rate and a lower average access time.

### Test Case B — Mid-repeat blocks

**Pattern:** `0..n−1`, then `0..2n−1` twice, then reversed `n−1..0`, then `2n−1..0` twice — 80 accesses total.

```
0,1,2,3,4,5,6,7,
0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
7,6,5,4,3,2,1,0,
15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0,
15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0
```

| Metric | FA + LRU | FA + MRU |
| --- | --- | --- |
| Accesses | 80 | 80 |
| Hits | 8 | 37 |
| Misses | 72 | 43 |
| Hit rate | 8/80 = 1/10 (10%) | 37/80 (46.25%) |
| Miss rate | 72/80 = 9/10 (90%) | 43/80 (53.75%) |
| Average access time | 145.9 ms | 87.5375 ms |
| Total access time | 12,872 ms | 8,203 ms |

This pattern mixes a short loop (`0..n-1`) with a longer one (`0..2n-1`) and then reverses both directions. LRU still struggles (10% hit rate) because each `0..2n-1` pass is, again, twice the cache capacity, so the front half of every pass evicts the back half of the previous one before it can be reused. MRU benefits much more here (46.25% hit rate): once a short `n`-length sub-run repeats or reverses direction, the blocks it needs are frequently the *least* recently touched ones — precisely the ones MRU tends to protect from eviction. This test case shows the largest gap between the two algorithms, both in hit rate and in total access time (roughly a 36% reduction in total time for MRU).

### Test Case C — Random sequence

**Pattern:** 64 uniformly random accesses over the full `0–1023` address range (fixed seed, reproducible):

```
1003,314,495,837,521,355,75,784,1020,844,470,968,911,992,642,254,
484,312,790,885,661,798,806,668,463,75,334,210,770,103,285,67,
644,949,356,217,1,697,828,49,611,719,959,37,578,923,601,862,
472,267,269,529,736,312,96,876,445,914,149,13,189,775,436,748
```

| Metric | FA + LRU | FA + MRU |
| --- | --- | --- |
| Accesses | 64 | 64 |
| Hits | 0 | 1 |
| Misses | 64 | 63 |
| Hit rate | 0/64 (0%) | 1/64 (1.5625%) |
| Miss rate | 64/64 (100%) | 63/64 (98.4375%) |
| Average access time | 162 ms | 159.48 ms |
| Total access time | 11,328 ms | 11,167 ms |

With addresses drawn uniformly from a 1024-block address space and only 8 cache blocks, there is essentially no temporal or spatial locality for either algorithm to exploit — the odds of any given block repeating within a 64-access window are low by construction. Both algorithms therefore perform close to their theoretical worst case (near-0% hit rate). MRU's one incidental hit is a coincidence of this particular random draw, not a structural advantage; over more trials both algorithms would be expected to converge toward 0% hit rate on truly random, locality-free traffic.

### Comparison and conclusion

Across all three test cases, **FA + MRU outperformed FA + LRU** in both hit rate and total/average access time. This is not a general statement about MRU being "better" than LRU — it is a direct consequence of how these specific test cases were constructed:

- Test Cases A and B are deliberately **cyclic access patterns whose working set is larger than the cache** (`2n` unique blocks against `n` cache blocks). This is the textbook worst case for LRU: because LRU always evicts the block that hasn't been touched in the longest time, and every block in a `2n`-length cyclic loop is "least recently used" at some fixed offset, LRU ends up evicting exactly the block that is about to be reused on every single iteration — hence the recurring 0%–10% hit rates. MRU, by evicting the *most* recently used block instead, is the standard textbook counter-strategy for exactly this kind of loop-larger-than-cache reference pattern, which is why it recovers a meaningfully higher hit rate on both.
- Test Case C removes locality altogether, and — as expected — the choice of replacement algorithm stops mattering much; both converge toward a near-total miss rate because there is no locality for either policy to exploit.

In a real workload (one that follows normal temporal locality, where recently used data tends to be reused soon and working sets are usually smaller than the cache), LRU is typically the stronger general-purpose policy, and MRU is the pathological case instead. These three test cases simply happen to expose the opposite: cyclic streams whose reuse distance is longer than the cache can hold, which is precisely the scenario MRU-style replacement was designed to handle well. The simulator's read policy (load-through vs. non-load-through) only affects miss latency, not hit/miss outcomes, so it does not change which algorithm "wins" for a given access pattern — it only scales the total/average access time.
