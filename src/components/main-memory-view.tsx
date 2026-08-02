import { Slider, Text, Title } from "@mantine/core";
import type { Dispatch, JSX, SetStateAction } from "react";

import type { CacheTraceEntry } from "@/simulation/trace.ts";

export interface MainMemoryViewProps {
  memoryBlocks: readonly number[];

  trace: readonly CacheTraceEntry[];
  traceIndex: number;

  setTraceIndex: Dispatch<SetStateAction<number>>;
}

export function MainMemoryView({
  memoryBlocks: memBlocks,
  setTraceIndex,
  trace,
  traceIndex: traceIdx,
}: Readonly<MainMemoryViewProps>): JSX.Element {
  return (
    <div>
      <Title mb="xs" order={2}>
        Main Memory Block Sequence
      </Title>

      <Text mb="sm">{memBlocks.slice(0, traceIdx + 1).join(" → ")}</Text>

      <Text>Replay cache snapshots</Text>
      <Slider
        disabled={trace.length === 0}
        label={(val) => `Read ${val}`}
        marks={trace.map((_, i) => ({ value: i + 1 }))}
        max={trace.length}
        min={1}
        onChange={(val) => {
          setTraceIndex(val - 1);
        }}
        step={1}
        value={traceIdx + 1}
      />
    </div>
  );
}
