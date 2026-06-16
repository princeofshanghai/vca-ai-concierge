import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";

import { MetricDelta, type MetricTone } from "./Metric";

export type AudienceFitAvatar = Readonly<{
  label?: string;
  src?: string;
}>;

export type AudienceFitSegment = Readonly<{
  detail?: ReactNode;
  label: ReactNode;
  value: ReactNode;
  valueTone?: "default" | "positive" | "negative";
}>;

export type AudienceFitProps = HTMLAttributes<HTMLElement> & {
  actionLabel?: ReactNode;
  actionVariant?: "button" | "link";
  avatars?: ReadonlyArray<AudienceFitAvatar>;
  metricLabel?: ReactNode;
  metricValue?: ReactNode;
  onActionSelect?: () => void;
  segments: ReadonlyArray<AudienceFitSegment>;
  summary?: ReactNode;
  title?: ReactNode;
  trend?: ReactNode;
  trendContext?: ReactNode;
  trendDelta?: ReactNode;
  trendTone?: MetricTone;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function AudienceAvatars({
  avatars = [],
}: Readonly<{ avatars?: ReadonlyArray<AudienceFitAvatar> }>) {
  const visibleAvatars = avatars.slice(0, 3);

  return (
    <div className="flex shrink-0 items-center" aria-hidden={!avatars.length}>
      {visibleAvatars.map((avatar, index) => (
        <Entity
          className={cx(index === 0 ? "" : "-ml-sm", "ring-2 ring-background")}
          key={`${avatar.src ?? avatar.label ?? "avatar"}-${index}`}
          label={avatar.label}
          size={32}
          src={avatar.src}
        />
      ))}
    </div>
  );
}

function getValueToneClass(tone: AudienceFitSegment["valueTone"]) {
  if (tone === "positive") {
    return "text-positive";
  }

  if (tone === "negative") {
    return "text-negative";
  }

  return "text-text";
}

export function AudienceFit({
  actionLabel = "Go to Who's visited my page",
  actionVariant = "button",
  avatars,
  className,
  metricLabel,
  metricValue,
  onActionSelect,
  segments,
  summary,
  title = "Visitors",
  trend,
  trendContext,
  trendDelta,
  trendTone = "neutral",
  ...props
}: AudienceFitProps) {
  const hasMetricTrend = trendDelta || trendContext;
  const hasMetricSummary =
    metricValue || metricLabel || trend || hasMetricTrend;

  return (
    <article
      {...props}
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-xl text-text shadow-raised-faint",
        className,
      )}
      data-response-block="AudienceFit"
    >
      {hasMetricSummary ? (
        <div className="min-w-0">
          {title ? (
            <h3 className="text-control-md text-text">{title}</h3>
          ) : null}
          <div className={cx("flex items-start gap-sm", title ? "mt-md" : "")}>
            {metricValue ? (
              <p className="shrink-0 text-heading-xl tracking-normal text-text">
                {metricValue}
              </p>
            ) : null}
            <div className="min-w-0 pt-[3px]">
              {metricLabel ? (
                <p className="max-w-[220px] text-body-sm text-text-meta">
                  {metricLabel}
                </p>
              ) : null}
              {hasMetricTrend ? (
                <MetricDelta
                  className="mt-xs"
                  delta={trendDelta}
                  deltaContext={trendContext}
                  tone={trendTone}
                />
              ) : trend ? (
                <p className="mt-xs text-body-xs text-text-meta">{trend}</p>
              ) : null}
            </div>
          </div>
          {summary ? (
            <p className="mt-md text-body-sm text-text">{summary}</p>
          ) : null}
        </div>
      ) : (
        <div className="min-w-0">
          <h3 className="text-control-md text-text">{title}</h3>
          <div className="mt-md">
            <AudienceAvatars avatars={avatars} />
          </div>
          {summary ? (
            <p className="mt-sm text-body-sm text-text">{summary}</p>
          ) : null}
        </div>
      )}
      <dl className="mt-xl divide-y divide-border-faint border-t border-border-faint">
        {segments.map((segment, index) => (
          <div
            className="flex min-w-0 items-start justify-between gap-lg py-lg first:pt-lg last:pb-0"
            key={`${String(segment.label)}-${index}`}
          >
            <div className="min-w-0">
              <dt className="text-control-sm text-text">{segment.label}</dt>
              {segment.detail ? (
                <dd className="mt-xxs text-body-sm text-text-meta">
                  {segment.detail}
                </dd>
              ) : null}
            </div>
            <dd
              className={cx(
                "shrink-0 text-control-sm",
                getValueToneClass(segment.valueTone),
              )}
            >
              {segment.value}
            </dd>
          </div>
        ))}
      </dl>
      {actionVariant === "link" ? (
        <button
          className="mt-lg inline-flex items-center gap-xs text-control-sm text-action transition-colors duration-150 ease-out hover:text-action-hover hover:underline hover:underline-offset-2"
          onClick={onActionSelect}
          type="button"
        >
          <span>{actionLabel}</span>
          <Icon name="arrow-right" size="small" />
        </button>
      ) : (
        <Button
          className="mt-xl"
          onClick={onActionSelect}
          size="small"
          variant="secondary"
        >
          {actionLabel}
        </Button>
      )}
    </article>
  );
}
