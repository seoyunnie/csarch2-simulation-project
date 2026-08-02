import { Table, Title } from "@mantine/core";
import type { JSX } from "react";

import type { CacheBlock } from "@/simulation/cache.ts";

export interface CacheTableProps {
  blocks: readonly CacheBlock[];
  blockCount: number;
}

export function CacheTable({ blocks, blockCount: blockCnt }: Readonly<CacheTableProps>): JSX.Element {
  // oxlint-disable-next-line unicorn/prefer-spread
  const paddedBlocks = blocks.concat(Array.from({ length: blockCnt - blocks.length }));

  return (
    <div>
      <Title mb="md" order={2}>
        Cache Table
      </Title>

      <Table mb="sm" style={{ whiteSpace: "nowrap", width: "1%" }} withColumnBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Block</Table.Th>
            <Table.Th>Memory Block</Table.Th>
            <Table.Th>Age</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {paddedBlocks.map((block, idx) => (
            // oxlint-disable-next-line react/no-array-index-key
            <Table.Tr key={idx}>
              <Table.Td>{idx}</Table.Td>
              {block === undefined ? (
                <>
                  <Table.Td />
                  <Table.Td />
                </>
              ) : (
                <>
                  <Table.Td>{block.memoryBlock}</Table.Td>
                  <Table.Td>{block.age}</Table.Td>
                </>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
}
