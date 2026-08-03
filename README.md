# CSARCH2 Simulation Project: Cache Memory Simulator (Machine 6)

> **Course:** CSARCH2 – Computer Organization and Architecture   
> **Academic Term:** 3rd Term, AY 2025–2026   
> **Machine Assignment:** Machine 6 – Fully Associative (FA) + LRU vs. Fully Associative (FA) + MRU 

---

## Project Overview
This project is an interactive, web-based **Cache Memory Simulator** built with **React**, **TypeScript**, and **Mantine UI**[cite: 1, 2, 3]. It models memory hierarchy behavior, cache line allocations, block age tracking, and performance statistics for a **Fully Associative Cache** operating under **Least Recently Used (LRU)** and **Most Recently Used (MRU)** replacement algorithms[cite: 1, 2]. The application supports both **Load-Through** and **Non-Load-Through** memory read policies[cite: 1, 2].

### Project Links
* **Live Web Application:** `[Insert Live Deployment Link Here]` 
* **Video Demonstration (YouTube):** `[Insert 5-8 Minute Video Walkthrough Link Here]` 
* **GitHub Repository:** `[Insert Public GitHub Repository URL]` 

---

## System Specifications & Parameters

| Specification | Value / Configuration | Architectural Description |
| :--- | :--- | :--- |
| **Main Memory Size** | **1024 Blocks** (Fixed)  | Valid block address range from 0 to 1023[cite: 1, 2]. |
| **Cache Mapping** | **Fully Associative (FA)**  | Any main memory block can reside in any cache line . |
| **Cache Block Count (n)** | Parameterized (Default: **4**, Min: **4**)[cite: 1, 2] | Number of cache lines available; must be a power of 2[cite: 1, 2]. |
| **Block Size** | Parameterized (Default: **2 words**, Min: **2**)[cite: 1, 2] | Number of words per block; must be a power of 2[cite: 1, 2]. |
| **Replacement Algorithms** | **LRU** vs. **MRU**[cite: 1, 2] | **LRU**: Evicts the block unused for the longest time[cite: 1, 2].<br>**MRU**: Evicts the block accessed most recently[cite: 1, 2]. |
| **Read Policies** | **Load-Through** vs. **Non-Load-Through**[cite: 1, 2] | **Load-Through**: CPU receives word directly during block fetch .<br>**Non-Load-Through**: Full block loaded into cache before CPU read . |

---

## User Interface & System Features

1. **Configuration Sidebar Panel (`App.tsx`):**
   * Comma-separated Main Memory Block ID input field (validated for values 0–1023)[cite: 2].
   * Selectable **Read Policy** (`Load-through` vs. `Non-load-through`)[cite: 2].
   * Selectable **Replacement Algorithm** (`Least recently used` vs. `Most recently used`)[cite: 2].
   * Numeric inputs for **Block Size** and **Block Count** with real-time power-of-two validation[cite: 2].

2. **Main Memory Sequence & Interactive Replay (`MainMemoryView.tsx`):**
   * Visual breadcrumb displaying the executed memory block sequence[cite: 5].
   * Interactive step-by-step replay slider allowing full temporal inspection of cache states at any point in execution[cite: 1, 5].

3. **Visual Cache Table (`CacheTable.tsx`):**
   * Displays line indices (0 to n-1), stored Main Memory Block IDs, and current line **Age** values[cite: 4].

4. **Execution Trace Log (`TraceLog.tsx`):**
   * Real-time auto-scrolling log documenting cache hits, misses, line allocations, and block evictions[cite: 1, 7].

5. **Statistical Performance Summary (`SimulationSummary.tsx`):**
   * Total Memory Access Count[cite: 1, 6]
   * Cache Hit Count & Cache Miss Count[cite: 1, 6]
   * Cache Hit Rate & Miss Rate rendered as simplified fractions and formatted percentages[cite: 1, 6]
   * Average Memory Access Time (AMAT) and Total Memory Access Time[cite: 1, 6]

---

## Detailed Analysis Write-Up (Page 3 Requirement)

This section presents a comparative performance evaluation between **Fully Associative + LRU** and **Fully Associative + MRU** across the three standard test cases with n = 4 cache blocks and a block size of 2 words.

---

### Test Case Performance Comparison (n = 4)

#### 1. Test Case A: Sequential Access Sequence
* **Access Pattern:** Access up to 2n cache blocks sequentially, repeated two times.
* **Input Sequence (n = 4):** `0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7` (16 total accesses).

* **Fully Associative + LRU Analysis:**
  * **First Iteration (`0–7`):** Accesses `0, 1, 2, 3` result in 4 cold misses, filling cache lines 0–3. Accessing `4, 5, 6, 7` triggers continuous replacement. Because LRU evicts the oldest line, block `4` evicts `0`, `5` evicts `1`, `6` evicts `2`, and `7` evicts `3`.
  * **Second Iteration (`0–7`):** When accessing `0` again, block `0` was evicted right before. Eviction loops cyclically (`0` evicts `4`, `1` evicts `5`, etc.).
  * **Result:** **0 Hits, 16 Misses (Hit Rate: 0.0%)**. LRU suffers from 100% thrashing because the working set size (8) exceeds cache capacity (4).

* **Fully Associative + MRU Analysis:**
  * **First Iteration (`0–7`):** Accesses `0, 1, 2, 3` fill cache lines 0–3 (4 misses). Upon accessing `4`, MRU evicts block `3` (the most recently accessed block). Subsequent accesses `5, 6, 7` repeatedly evict the newly placed top slot (evicting `4`, `5`, `6`). Cache holds `[0, 1, 2, 7]`.
  * **Second Iteration (`0–7`):** Accesses to `0`, `1`, and `2` hit directly in cache because MRU preserved the older baseline blocks. Access `3` misses and replaces `2`. Accesses `4, 5, 6` miss, while access `7` hits again.
  * **Result:** **4 Hits, 12 Misses (Hit Rate: 25.0%)**. MRU outperforms LRU on cyclic sequences exceeding cache capacity by preserving early working set items.

---

#### 2. Test Case B: Mid-Repeat Blocks Sequence
* **Input Sequence (n = 4):** `0, 1, 2, 3, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0, 7, 6, 5, 4, 3, 2, 1, 0` (40 total accesses).

* **Comparative Behavior Analysis:**
  * **Short-Loop Locality (`0,1,2,3` repeated):** **LRU excels.** When sub-sequences repeat within capacity n, LRU achieves a **100% hit rate** during those localized bursts because all n items are retained in order.
  * **Large Sequential Loops (`0–7` and `7–0`):** **LRU thrashes**, incurring consecutive misses. Conversely, **MRU preserves localized set anchors** (e.g., retaining blocks `0, 1, 2` while cycling through blocks `3–7` in a single cache line slot).
  * **Reversed Pattern (`3,2,1,0`):** When reversing immediately after a cycle, LRU retains the most recent end of the sequence (`3, 2`), capturing early hits, whereas MRU retains distant start anchors.
  * **Overall Verdict:** LRU delivers higher hit density during localized temporal bursts, while MRU provides higher hit consistency during large looping patterns.

---

#### 3. Test Case C: Random Access Sequence
* **Input Sequence:** Generate a random sequence of 64 block accesses (block indices within 0 to 1023).

* **Comparative Behavior Analysis:**
  * Because main memory size (1024 blocks) is significantly larger than cache capacity (4 blocks), the probability of temporal re-reference in a uniform random distribution is low (~0.39%) .
  * **LRU** slightly edges out MRU if immediate re-references occur, as LRU keeps recent blocks alive longer.
  * **MRU** discards the most recently fetched block on the very next miss, preventing newly fetched random blocks from cluttering the cache.
  * **Overall Verdict:** Both algorithms approach the theoretical lower hit bound on purely random workloads, with LRU slightly favoring temporal clusters.

---

### Policy Comparison Matrix

| Metric / Scenario | Fully Associative + LRU | Fully Associative + MRU |
| :--- | :--- | :--- |
| **Cyclic Sequences (> n)** | Severe Thrashing (0% Hit Rate) | Retains n-1 elements (Higher Hit Rate) |
| **Localized Temporal Bursts** | Optimal (100% Hit Rate within n) | Suboptimal (Evicts recently reused items) |
| **Random Workloads** | Low Hit Rate (~Capacity/Memory) | Low Hit Rate |
| **Hardware / Logic Overhead** | Higher (Tracks full age history) | Lower (Tracks most recent access pointer) |

---

### Read Policy Impact: Load-Through vs. Non-Load-Through

1. **Non-Load-Through Policy:**
   * On a cache miss, the entire memory block must be transferred from Main Memory into the Cache line **before** the CPU receives the requested word .
   * **Access Time Calculation:** Access Time (miss) = Cache Time + Block Transfer Time.
   * Results in higher penalty per miss and higher Average Memory Access Time (AMAT)[cite: 1, 6].

2. **Load-Through Policy:**
   * On a cache miss, the requested word is forwarded **directly to the CPU** simultaneously as the full block is fetched into the cache .
   * **Access Time Calculation:** Access Time (miss) = Cache Time + Word Transfer Time (where Word Transfer Time << Block Transfer Time).
   * Significantly reduces AMAT on workloads with high miss rates (such as Test Case A under LRU or Test Case C)[cite: 1, 6].

---

## Instructions for Running Locally

### Prerequisites
* **Node.js** (v18.0 or higher)
* **npm** or **pnpm** / **yarn**

### Installation & Launch Steps

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/your-username/cache-simulator.git](https://github.com/your-username/cache-simulator.git)
   cd cache-simulator
