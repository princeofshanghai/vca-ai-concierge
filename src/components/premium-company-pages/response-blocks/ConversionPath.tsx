import type { HTMLAttributes, ReactNode } from "react";

import {
  DataCardHeader,
  DataCardSection,
  DataCardShell,
  DataMetricSummary,
} from "./DataCard";
import {
  MetricDelta,
  type MetricTone,
} from "./Metric";

export type ConversionPathStep = Readonly<{
  delta?: ReactNode;
  deltaContext?: ReactNode;
  detail?: ReactNode;
  label: ReactNode;
  tone?: MetricTone;
  value: ReactNode;
}>;

export type ConversionPathProps = HTMLAttributes<HTMLElement> & {
  context?: ReactNode;
  steps: ReadonlyArray<ConversionPathStep>;
  summaryLabel?: ReactNode;
  summaryValue?: ReactNode;
  title?: ReactNode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ConversionPath({
  className,
  context,
  steps,
  summaryLabel,
  summaryValue,
  title,
  ...props
}: ConversionPathProps) {
  const hasHeader = Boolean(title || context);
  const hasSummary = Boolean(summaryValue || summaryLabel);

  return (
    <DataCardShell
      {...props}
      block="ConversionPath"
      className={className}
    >
      <DataCardHeader context={context} title={title} />
      {hasSummary ? (
        <DataMetricSummary
          className={hasHeader ? "mt-xl" : ""}
          label={summaryLabel}
          value={summaryValue}
        />
      ) : null}
      <DataCardSection className={cx(hasSummary ? "mt-lg" : "")}>
        <ol className="divide-y divide-border-faint">
          {steps.map((step, index) => {
            const {
              delta,
              deltaContext,
              detail,
              label,
              tone = "neutral",
              value,
            } = step;
            const showDelta = Boolean(delta || deltaContext);

            return (
              <li
                className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-lg py-md first:pt-0 last:pb-0"
                key={`${String(label)}-${index}`}
              >
                <div className="min-w-0">
                  <p className="text-control-sm text-text">{label}</p>
                  {detail ? (
                    <p className="mt-xxs text-body-xs text-text-meta">
                      {detail}
                    </p>
                  ) : null}
                </div>
                <div className="min-w-0 text-right">
                  <p className="text-control-md text-text">{value}</p>
                  {showDelta ? (
                    <MetricDelta
                      className="mt-xxs justify-end whitespace-nowrap"
                      delta={delta}
                      deltaContext={deltaContext}
                      tone={tone}
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </DataCardSection>
    </DataCardShell>
  );
}
