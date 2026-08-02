import { Code, ScrollArea, Title } from "@mantine/core";
import type { JSX } from "react";

import { type CacheTraceEntry, formatTrace } from "@/simulation/trace.ts";

export interface TraceLogProps {
  trace: readonly CacheTraceEntry[];
  traceIndex: number;
}

export function TraceLog({ trace, traceIndex: traceIdx }: Readonly<TraceLogProps>): JSX.Element {
  return (
    <div>
      <Title mb="xs" order={3}>
        Trace Log
      </Title>

      <ScrollArea.Autosize mah={200} mb="sm" offsetScrollbars type="always">
        <Code block mih="100%">
          {trace
            .slice(0, traceIdx + 1)
            .map((e) => formatTrace(e))
            // oxlint-disable-next-line unicorn/no-array-reverse
            .reverse()
            .join("\n\n")}
        </Code>
      </ScrollArea.Autosize>
    </div>
  );
}
