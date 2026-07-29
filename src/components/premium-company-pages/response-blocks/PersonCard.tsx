import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon, type IconName } from "@/components/primitives/icon";
import { Tag, type TagTone } from "@/components/primitives/tag";

export type PersonCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actionIcon?: IconName | null;
  actionLabel?: ReactNode;
  actionTrailingIcon?: IconName | null;
  avatarSrc?: string;
  detail?: ReactNode;
  followers?: ReactNode;
  headline: ReactNode;
  name: ReactNode;
  onAction?: () => void;
  tag?: ReactNode;
  tagTone?: TagTone;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PersonCard({
  actionIcon = "add",
  actionLabel = "Follow",
  actionTrailingIcon,
  avatarSrc,
  className,
  detail,
  followers,
  headline,
  name,
  onAction,
  tag,
  tagTone = "default",
  ...props
}: PersonCardProps) {
  const nameText = typeof name === "string" ? name : undefined;
  const shouldShowExternalActionIcon =
    typeof actionLabel === "string" &&
    actionLabel.toLocaleLowerCase() === "view profile";
  const resolvedActionTrailingIcon =
    actionTrailingIcon === undefined && shouldShowExternalActionIcon
      ? "link-external"
      : actionTrailingIcon;

  return (
    <article
      {...props}
      data-response-block="PersonCard"
      className={cx(
        "flex w-[var(--response-entity-card-width,100%)] max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] shrink-0 snap-start flex-col items-center rounded-md border border-ai-border bg-background p-lg text-center text-text shadow-raised-faint [--response-entity-card-rail-width:200px]",
        className,
      )}
    >
      <Entity label={nameText} size={80} src={avatarSrc} />
      <div className="mt-lg flex min-h-[104px] w-full flex-1 flex-col items-center">
        <p className="line-clamp-2 max-w-full text-control-md text-text">
          {name}
        </p>
        <p className="mt-xxs line-clamp-3 text-body-xs text-text-meta">
          {headline}
        </p>
        {detail ? (
          <p className="mt-sm line-clamp-3 text-body-xs text-text-meta">
            {detail}
          </p>
        ) : null}
        {followers ? (
          <p className="mt-sm text-body-xs text-text-meta">{followers}</p>
        ) : null}
        {tag ? (
          <Tag className="mt-sm max-w-full" size="small" tone={tagTone}>
            {tag}
          </Tag>
        ) : null}
      </div>
      <Button
        aria-label={nameText ? `${String(actionLabel)} ${nameText}` : undefined}
        className="mt-lg w-full"
        leadingIcon={
          actionIcon ? <Icon name={actionIcon} size="small" /> : undefined
        }
        onClick={onAction}
        size="small"
        trailingIcon={
          resolvedActionTrailingIcon ? (
            <Icon name={resolvedActionTrailingIcon} size="small" />
          ) : undefined
        }
        variant="secondary"
      >
        {actionLabel}
      </Button>
    </article>
  );
}
