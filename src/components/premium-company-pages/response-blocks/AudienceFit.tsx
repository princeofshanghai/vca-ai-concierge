import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";

import {
  DataCardFooter,
  DataCardHeader,
  DataCardSection,
  DataCardShell,
  DataMetricSummary,
} from "./DataCard";
import { type MetricTone } from "./Metric";

export type AudienceFitAvatar = Readonly<{
  label?: string;
  src?: string;
}>;

export type AudienceFitSegment = Readonly<{
  detail?: ReactNode;
  dimension?: ReactNode;
  label: ReactNode;
  value?: ReactNode;
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
    <DataCardShell
      {...props}
      block="AudienceFit"
      className={className}
    >
      {title ? <DataCardHeader title={title} /> : null}
      {hasMetricSummary ? (
        <div className={cx("min-w-0", title ? "mt-lg" : "")}>
          <DataMetricSummary
            delta={trendDelta}
            deltaContext={trendContext}
            label={metricLabel}
            tone={trendTone}
            value={metricValue}
          />
          {!hasMetricTrend && trend ? (
            <p className="mt-xs text-body-xs text-text-meta">{trend}</p>
          ) : null}
          {summary ? (
            <p className="mt-md text-body-sm text-text">{summary}</p>
          ) : null}
        </div>
      ) : (
        <div className={cx("min-w-0", title ? "mt-lg" : "")}>
          <div>
            <AudienceAvatars avatars={avatars} />
          </div>
          {summary ? (
            <p className="mt-sm text-body-sm text-text">{summary}</p>
          ) : null}
        </div>
      )}
      <DataCardSection className="pt-sm">
        <dl className="divide-y divide-border-faint">
          {segments.map((segment, index) => {
            const hasValue =
              segment.value !== null &&
              segment.value !== undefined &&
              segment.value !== "";

            return (
              <div
                className={cx(
                  "flex min-w-0 items-start gap-lg py-md first:pt-md last:pb-0",
                  hasValue ? "justify-between" : "",
                )}
                key={`${String(segment.label)}-${index}`}
              >
                <div className="min-w-0">
                  {segment.dimension ? (
                    <dt className="text-body-xs text-text-meta">
                      {segment.dimension}
                    </dt>
                  ) : null}
                  <dt
                    className={cx(
                      "text-control-sm text-text",
                      segment.dimension ? "mt-xxs" : "",
                    )}
                  >
                    {segment.label}
                  </dt>
                  {segment.detail ? (
                    <dd className="mt-xxs text-body-sm text-text-meta">
                      {segment.detail}
                    </dd>
                  ) : null}
                </div>
                {hasValue ? (
                  <dd
                    className={cx(
                      "shrink-0 text-control-sm",
                      getValueToneClass(segment.valueTone),
                    )}
                  >
                    {segment.value}
                  </dd>
                ) : null}
              </div>
            );
          })}
        </dl>
      </DataCardSection>
      {actionVariant === "link" ? (
        <DataCardFooter>
          <button
            className="inline-flex items-center gap-xs text-control-sm text-action transition-colors duration-150 ease-out hover:text-action-hover hover:underline hover:underline-offset-2"
            onClick={onActionSelect}
            type="button"
          >
            <span>{actionLabel}</span>
            <Icon name="arrow-right" size="small" />
          </button>
        </DataCardFooter>
      ) : (
        <DataCardFooter>
          <Button
            onClick={onActionSelect}
            size="small"
            variant="secondary"
          >
            {actionLabel}
          </Button>
        </DataCardFooter>
      )}
    </DataCardShell>
  );
}
