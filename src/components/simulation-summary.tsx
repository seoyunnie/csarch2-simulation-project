import { DataList, Title } from "@mantine/core";
import { Fraction } from "fraction.js";
import type { JSX } from "react";

export interface SimulationSummaryProps {
  accessCount: number;
  hitCount: number;
  missCount: number;

  hitRate: number;
  missRate: number;

  averageAccessTime: number;
  totalAccessTime: number;
}

const NUMBER_FORMATTER_LOCALE = "en-US";
const NUMBER_FORMATTER_OPTIONS = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
} satisfies Intl.NumberFormatOptions;

const DECIMAL_FORMATTER = new Intl.NumberFormat(NUMBER_FORMATTER_LOCALE, NUMBER_FORMATTER_OPTIONS);
const PERCENT_FORMATTER = new Intl.NumberFormat(NUMBER_FORMATTER_LOCALE, {
  ...NUMBER_FORMATTER_OPTIONS,
  style: "percent",
});

export function SimulationSummary({
  accessCount,
  averageAccessTime,
  hitCount,
  hitRate,
  missCount,
  missRate,
  totalAccessTime,
}: Readonly<SimulationSummaryProps>): JSX.Element {
  return (
    <div>
      <Title mb="md" order={2}>
        Summary
      </Title>

      <DataList withDivider>
        <DataList.Item>
          <DataList.ItemLabel>Total memory access count</DataList.ItemLabel>
          <DataList.ItemValue>{accessCount}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Cache hit count</DataList.ItemLabel>
          <DataList.ItemValue>{hitCount}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Cache miss count</DataList.ItemLabel>
          <DataList.ItemValue>{missCount}</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Cache hit rate</DataList.ItemLabel>
          <DataList.ItemValue>
            {new Fraction(hitRate).toFraction()} ({PERCENT_FORMATTER.format(hitRate)})
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Cache miss rate</DataList.ItemLabel>
          <DataList.ItemValue>
            {new Fraction(missRate).toFraction()} ({PERCENT_FORMATTER.format(missRate)})
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Average memory access time</DataList.ItemLabel>
          <DataList.ItemValue>{DECIMAL_FORMATTER.format(averageAccessTime)} ms</DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Total memory access time</DataList.ItemLabel>
          <DataList.ItemValue>{totalAccessTime} ms</DataList.ItemValue>
        </DataList.Item>
      </DataList>
    </div>
  );
}
