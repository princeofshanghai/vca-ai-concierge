import type { HTMLAttributes, ReactNode } from "react";

import {
  type MetricTone,
} from "./Metric";
import {
  DataCardHeader,
  DataCardSection,
  DataCardShell,
  DataMetricSummary,
} from "./DataCard";
import {
  TrendChart,
  type TrendAnnotation,
  type TrendAxisTicks,
} from "./Trend";

export type MetricWithTrendProps = HTMLAttributes<HTMLElement> & {
  annotation: TrendAnnotation;
  axisTicks: TrendAxisTicks;
  delta?: ReactNode;
  deltaContext?: ReactNode;
  title: ReactNode;
  tone?: MetricTone;
  unit?: ReactNode;
  value?: ReactNode;
  values: ReadonlyArray<number>;
};

export function MetricWithTrend({
  annotation,
  axisTicks,
  className,
  delta,
  deltaContext,
  title,
  tone = "neutral",
  unit,
  value,
  values,
  ...props
}: MetricWithTrendProps) {
  return (
    <DataCardShell
      {...props}
      block="MetricWithTrend"
      className={className}
    >
      <DataCardHeader title={title} />
      <DataMetricSummary
        className="mt-lg"
        delta={delta}
        deltaContext={deltaContext}
        label={unit}
        tone={tone}
        value={value}
      />
      <DataCardSection>
        <TrendChart
          annotation={annotation}
          axisTicks={axisTicks}
          values={values}
        />
      </DataCardSection>
    </DataCardShell>
  );
}
