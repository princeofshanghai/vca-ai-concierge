import type { HTMLAttributes, ReactNode } from "react";

import {
  MetricDelta,
  type MetricTone,
} from "./Metric";

export type DataCardShellProps = HTMLAttributes<HTMLElement> & {
  block: string;
  children: ReactNode;
};

export type DataCardHeaderProps = Readonly<{
  className?: string;
  context?: ReactNode;
  title?: ReactNode;
}>;

export type DataMetricSummaryProps = Readonly<{
  className?: string;
  delta?: ReactNode;
  deltaContext?: ReactNode;
  label?: ReactNode;
  tone?: MetricTone;
  value?: ReactNode;
}>;

export type DataCardSectionProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DataCardShell({
  block,
  children,
  className,
  ...props
}: DataCardShellProps) {
  return (
    <article
      {...props}
      data-response-block={block}
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-xl text-left text-text shadow-raised-faint",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function DataCardHeader({
  className,
  context,
  title,
}: DataCardHeaderProps) {
  if (!title && !context) {
    return null;
  }

  return (
    <header className={cx("min-w-0", className)}>
      {title ? <h3 className="text-control-md text-text">{title}</h3> : null}
      {context ? (
        <p className="mt-xxs text-body-sm text-text-meta">{context}</p>
      ) : null}
    </header>
  );
}

export function DataMetricSummary({
  className,
  delta,
  deltaContext,
  label,
  tone = "neutral",
  value,
}: DataMetricSummaryProps) {
  const hasDelta = Boolean(delta || deltaContext);

  if (!value && !label && !hasDelta) {
    return null;
  }

  return (
    <div className={cx("min-w-0", className)}>
      {value ? (
        <p className="text-heading-xl tracking-normal text-text">{value}</p>
      ) : null}
      {label ? (
        <p
          className={cx(
            "max-w-[18rem] text-body-sm text-text-meta",
            value ? "mt-xxs" : "",
          )}
        >
          {label}
        </p>
      ) : null}
      {hasDelta ? (
        <MetricDelta
          className="mt-xs"
          delta={delta}
          deltaContext={deltaContext}
          tone={tone}
        />
      ) : null}
    </div>
  );
}

export function DataCardSection({
  children,
  className,
}: DataCardSectionProps) {
  return (
    <div className={cx("mt-xl border-t border-border-faint pt-lg", className)}>
      {children}
    </div>
  );
}

export function DataCardFooter({
  children,
  className,
}: DataCardSectionProps) {
  return (
    <footer
      className={cx("mt-xl border-t border-border-faint pt-lg", className)}
    >
      {children}
    </footer>
  );
}
