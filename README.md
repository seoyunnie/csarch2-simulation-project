# Cache Memory Machine (Machine 6)

An interactive web simulator for cache using fully associative mapping and least or most recently used replacement
algorithms.

## Simulator Specifications and Parameters

| Specification    |       Value       |
| :--------------- | :---------------: |
| Mapping function | Fully associative |
| Main Memory Size |    1024 blocks    |

| Parameter             |      Value       |
| :-------------------- | :--------------: |
| Replacement algorithm |    LRU vs MRU    |
| Block size            |        2         |
| Block count           |        4         |
| Read policy           | Non-load-through |

## Test Cases

### a. Sequential Sequence

<div align="center">
  <img alt="LRU test screenshot" src="./docs/images/sequential-sequence-lru.png" width="45%" />
  <img alt="MRU test screenshot" src="./docs/images/sequential-sequence-mru.png" width="45%" />
</div>

### b. Mid-Repeat Blocks

<div align="center">
  <img alt="LRU test screenshot" src="./docs/images/mid-repeat-blocks-lru.png" width="45%" />
  <img alt="MRU test screenshot" src="./docs/images/mid-repeat-blocks-mru.png" width="45%" />
</div>

### c. Random Sequence

<div align="center">
  <img alt="LRU test screenshot" src="./docs/images/random-sequence-lru.png" width="45%" />
  <img alt="MRU test screenshot" src="./docs/images/random-sequence-mru.png" width="45%" />
</div>

## Video Walkthrough
