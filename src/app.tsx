import {
  Affix,
  AppShell,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
  Transition,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import { ArrowLineUpIcon, type IconWeight, PlayIcon } from "@phosphor-icons/react";
import { type JSX, useState } from "react";

import { CacheTable } from "./components/cache-table.tsx";
import { MainMemoryView } from "./components/main-memory-view.tsx";
import { SimulationSummary, type SimulationSummaryProps } from "./components/simulation-summary.tsx";
import { TraceLog } from "./components/trace-log.tsx";
import { Cache, ReadPolicy, ReplacementAlgorithm } from "./simulation/cache.ts";
import { MAIN_MEMORY_BLOCK_COUNT } from "./simulation/memory.ts";
import type { CacheTraceEntry } from "./simulation/trace.ts";
import { isPowerOfTwo } from "./utils/number.ts";

const ICON_WEIGHT: IconWeight = "bold";

export function App(): JSX.Element {
  const [memBlocks, setMemBlocks] = useState<number[]>([]);
  const [cache, setCache] = useState<Cache>(
    new Cache(ReadPolicy.NonLoadThrough, ReplacementAlgorithm.LRU, Cache.MINIMUM_BLOCK_SIZE, Cache.MINIMUM_BLOCK_COUNT),
  );

  const [trace, setTrace] = useState<CacheTraceEntry[]>([]);
  const [traceIdx, setTraceIdx] = useState(0);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      memoryBlocks: "",
      readPolicy: ReadPolicy.NonLoadThrough,
      replacementAlgorithm: ReplacementAlgorithm.LRU,
      blockSize: Cache.MINIMUM_BLOCK_SIZE,
      blockCount: Cache.MINIMUM_BLOCK_COUNT,
    },
    validate: {
      memoryBlocks: (val) => {
        if (val.length === 0) {
          return "Enter at least one memory block";
        }

        // oxlint-disable-next-line prefer-named-capture-group
        if (!/^\d+(,\d+)*$/u.test(val)) {
          return "Invalid list format";
        }

        const maxVal = MAIN_MEMORY_BLOCK_COUNT - 1;

        for (const num of val.split(",")) {
          if (Number(num.trim()) > maxVal) {
            return `Memory block "${num}" is larger than ${maxVal}`;
          }
        }
      },
      blockSize: (val) => (isPowerOfTwo(val) ? null : "Block size must be a power of 2"),
      blockCount: (val) => (isPowerOfTwo(val) ? null : "Block size must be a power of 2"),
    },
  });

  const handleSubmit = form.onSubmit((vals) => {
    const newMemBlocks = vals.memoryBlocks.split(",").map(Number);
    const newCache = new Cache(vals.readPolicy, vals.replacementAlgorithm, vals.blockSize, vals.blockCount);

    const newTrace: CacheTraceEntry[] = [];

    for (const block of newMemBlocks) {
      const res = newCache.read(block);

      newTrace.push({
        memoryBlock: block,
        result: res,
        snapshot: newCache.snapshot(),
      });
    }

    setMemBlocks(newMemBlocks);
    setCache(newCache);

    setTrace(newTrace);
    setTraceIdx(newTrace.length - 1);
  });

  const currSnapshot = trace[traceIdx]?.snapshot;
  const simulationSummary = {
    accessCount: currSnapshot?.accessCount ?? 0,
    hitCount: currSnapshot?.hitCount ?? 0,
    missCount: currSnapshot?.missCount ?? 0,

    hitRate: currSnapshot?.hitRate ?? 0,
    missRate: currSnapshot?.missRate ?? 0,

    averageAccessTime: currSnapshot?.averageAccessTime ?? 0,
    totalAccessTime: currSnapshot?.totalAccessTime ?? 0,
  } satisfies SimulationSummaryProps;

  const [isConfigOpened, { toggle: handleConfigToggle }] = useDisclosure();
  const [scrollPos, scrollTo] = useWindowScroll();

  return (
    <AppShell
      header={{ height: { base: "10rem", xs: "5rem" } }}
      navbar={{ width: 400, breakpoint: "sm", collapsed: { mobile: !isConfigOpened } }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group h="100%">
          <Burger hiddenFrom="sm" onClick={handleConfigToggle} opened={isConfigOpened} size="sm" />

          <Title>Cache Memory Simulator</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          <Title order={2}>Configure</Title>

          <Divider />

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                description={`Coma-separated list of memory block IDs (0-${MAIN_MEMORY_BLOCK_COUNT - 1})`}
                key={form.key("memoryBlocks")}
                label="Memory blocks"
                withAsterisk
                {...form.getInputProps("memoryBlocks")}
              />
              <Select
                allowDeselect={false}
                data={[
                  { label: "Load-through", value: ReadPolicy.LoadThrough },
                  { label: "Non-load-through", value: ReadPolicy.NonLoadThrough },
                ]}
                key={form.key("readPolicy")}
                label="Read policy"
                withAlignedLabels
                {...form.getInputProps("readPolicy")}
              />
              <Select
                allowDeselect={false}
                data={[
                  { label: "Least Recently Used (LRU)", value: ReplacementAlgorithm.LRU },
                  { label: "Most Recently Used (MRU)", value: ReplacementAlgorithm.MRU },
                ]}
                key={form.key("replacementAlgorithm")}
                label="Replacement Algorithm"
                withAlignedLabels
                {...form.getInputProps("replacementAlgorithm")}
              />
              <NumberInput
                allowDecimal={false}
                key={form.key("blockSize")}
                label="Block size"
                min={Cache.MINIMUM_BLOCK_SIZE}
                {...form.getInputProps("blockSize")}
              />
              <NumberInput
                allowDecimal={false}
                key={form.key("blockCount")}
                label="Block count"
                min={Cache.MINIMUM_BLOCK_COUNT}
                {...form.getInputProps("blockCount")}
              />

              <Button color="green" leftSection={<PlayIcon weight="fill" />} mt="md" type="submit">
                Run
              </Button>
            </Stack>
          </form>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>
          <Stack>
            <MainMemoryView memoryBlocks={memBlocks} setTraceIndex={setTraceIdx} trace={trace} traceIndex={traceIdx} />

            <Divider />

            <CacheTable blockCount={cache.blockCount} blocks={currSnapshot?.blocks ?? []} />
            <TraceLog trace={trace} traceIndex={traceIdx} />

            <Divider />

            <SimulationSummary {...simulationSummary} />
          </Stack>
        </Container>

        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition mounted={scrollPos.y > 0} transition="slide-up">
            {(style) => (
              <Button
                leftSection={<ArrowLineUpIcon weight={ICON_WEIGHT} />}
                onClick={() => {
                  scrollTo({ y: 0 });
                }}
                style={style}
              >
                Scroll to top
              </Button>
            )}
          </Transition>
        </Affix>
      </AppShell.Main>
    </AppShell>
  );
}
