import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";

export type AudienceFitAvatar = Readonly<{
  label?: string;
  src?: string;
}>;

export type AudienceFitSegment = Readonly<{
  detail?: ReactNode;
  label: ReactNode;
  value: ReactNode;
}>;

export type AudienceFitProps = HTMLAttributes<HTMLElement> & {
  actionLabel?: ReactNode;
  avatars?: ReadonlyArray<AudienceFitAvatar>;
  onActionSelect?: () => void;
  segments: ReadonlyArray<AudienceFitSegment>;
  summary?: ReactNode;
  title?: ReactNode;
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

export function AudienceFit({
  actionLabel = "Go to Who's visited my page",
  avatars,
  className,
  onActionSelect,
  segments,
  summary,
  title = "Visitors",
  ...props
}: AudienceFitProps) {
  return (
    <article
      {...props}
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-xl text-text shadow-raised-faint",
        className,
      )}
      data-response-block="AudienceFit"
    >
      <div className="min-w-0">
        <h3 className="text-control-md text-text">{title}</h3>
        <div className="mt-md">
          <AudienceAvatars avatars={avatars} />
        </div>
        {summary ? (
          <p className="mt-sm text-body-sm text-text">{summary}</p>
        ) : null}
      </div>
      <dl className="mt-xl divide-y divide-border-faint border-t border-border-faint">
        {segments.map((segment, index) => (
          <div
            className="flex min-w-0 items-start justify-between gap-lg py-md first:pt-lg last:pb-0"
            key={`${String(segment.label)}-${index}`}
          >
            <div className="min-w-0">
              <dt className="text-body-sm text-text">{segment.label}</dt>
              {segment.detail ? (
                <dd className="mt-xxs text-body-xs text-text-meta">
                  {segment.detail}
                </dd>
              ) : null}
            </div>
            <dd className="shrink-0 text-control-sm text-text">
              {segment.value}
            </dd>
          </div>
        ))}
      </dl>
      <Button
        className="mt-xl"
        onClick={onActionSelect}
        size="small"
        variant="secondary"
      >
        {actionLabel}
      </Button>
    </article>
  );
}
