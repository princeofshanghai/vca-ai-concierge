import type { HTMLAttributes, ReactNode } from "react";

import { Icon } from "@/components/primitives/icon";

import {
  DataCardHeader,
  DataCardShell,
} from "./DataCard";

export type MetricTone = "positive" | "negative" | "neutral";

export type MetricItem = Readonly<{
  value?: ReactNode;
  label: ReactNode;
  unit?: ReactNode;
  delta?: ReactNode;
  deltaContext?: ReactNode;
  tone?: MetricTone;
}>;

export type MetricProps = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
  items: ReadonlyArray<MetricItem>;
};

const toneClasses: Record<MetricTone, string> = {
  positive: "text-positive",
  negative: "text-negative",
  neutral: "text-text-meta",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function MetricValue({
  className,
  unit,
  value,
}: Readonly<{
  className?: string;
  unit?: ReactNode;
  value?: ReactNode;
}>) {
  if (!value && !unit) {
    return null;
  }

  return (
    <span
      className={cx(
        "inline-flex min-w-0 flex-wrap items-baseline gap-xs",
        className,
      )}
    >
      {value ? (
        <span className="text-heading-xl text-text">{value}</span>
      ) : null}
      {unit ? <span className="text-body-xs text-text-meta">{unit}</span> : null}
    </span>
  );
}

export function MetricDelta({
  className,
  delta,
  deltaContext,
  tone = "neutral",
}: Readonly<{
  className?: string;
  delta?: ReactNode;
  deltaContext?: ReactNode;
  tone?: MetricTone;
}>) {
  const showTrendIcon = tone === "positive" || tone === "negative";

  if (!delta && !deltaContext) {
    return null;
  }

  return (
    <span
      className={cx(
        "flex min-w-0 items-center gap-xxs text-body-xs",
        className,
      )}
    >
      {showTrendIcon ? (
        <Icon
          aria-hidden="true"
          className={toneClasses[tone]}
          name={tone === "positive" ? "caret-up" : "caret-down"}
          size="small"
        />
      ) : null}
      {delta ? (
        <span className={cx("font-semibold", toneClasses[tone])}>
          {delta}
        </span>
      ) : null}
      {deltaContext ? (
        <span className="min-w-0 text-text-meta">{deltaContext}</span>
      ) : null}
    </span>
  );
}

export function Metric({ title, items, className, ...props }: MetricProps) {
  return (
    <DataCardShell
      {...props}
      block="Metric"
      className={className}
    >
      <DataCardHeader title={title} />
      <div className={cx("divide-y divide-border-faint", title ? "mt-xl" : "")}>
        {items.map((item, index) => {
          const {
            value,
            label,
            unit,
            delta,
            deltaContext,
            tone = "neutral",
          } = item;
          const showValue = Boolean(value || unit);
          const showDelta = Boolean(delta || deltaContext);

          return (
            <div
              key={`${String(label)}-${index}`}
              className="flex min-w-0 items-start justify-between gap-xl py-md first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                {showValue ? (
                  <p>
                    <MetricValue unit={unit} value={value} />
                  </p>
                ) : null}
                <p
                  className={cx(
                    "text-body-sm text-text-meta",
                    showValue ? "mt-xxs" : "",
                  )}
                >
                  {label}
                </p>
              </div>
              {showDelta ? (
                <MetricDelta
                  className="shrink-0 whitespace-nowrap pt-xs text-right"
                  delta={delta}
                  deltaContext={deltaContext}
                  tone={tone}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </DataCardShell>
  );
}
