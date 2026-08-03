# Cache Memory Machine (Machine 6)

A simulator for cache using fully associative mapping and least or most recently used replacement algorithms.

## Video Walkthrough

## Test Cases

### Simulator Configuration

|             | Least recently used | Most recently used |
| :---------- | :-----------------: | :----------------: |
| Read policy |  Non-load-through   |  Non-load-through  |
| Block size  |          2          |         2          |
| Block count |          4          |         4          |

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
