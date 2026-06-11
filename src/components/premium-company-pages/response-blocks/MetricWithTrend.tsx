import type { HTMLAttributes, ReactNode } from "react";

import {
  MetricDelta,
  MetricValue,
  type MetricTone,
} from "./Metric";
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
    <article
      {...props}
      data-response-block="MetricWithTrend"
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-xl text-text shadow-raised-faint",
        className,
      )}
    >
      <h3 className="text-control-md text-text">{title}</h3>
      <div className="mt-md flex min-w-0 flex-wrap items-baseline gap-sm">
        <MetricValue unit={unit} value={value} />
        <MetricDelta
          delta={delta}
          deltaContext={deltaContext}
          tone={tone}
        />
      </div>
      <div className="mt-xl">
        <TrendChart
          annotation={annotation}
          axisTicks={axisTicks}
          values={values}
        />
      </div>
    </article>
  );
}
