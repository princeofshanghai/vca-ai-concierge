import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon, type IconName } from "@/components/primitives/icon";

export type PersonCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actionIcon?: IconName;
  actionLabel?: ReactNode;
  avatarSrc?: string;
  followers?: ReactNode;
  headline: ReactNode;
  name: ReactNode;
  onAction?: () => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PersonCard({
  actionIcon = "add",
  actionLabel = "Follow",
  avatarSrc,
  className,
  followers,
  headline,
  name,
  onAction,
  ...props
}: PersonCardProps) {
  const nameText = typeof name === "string" ? name : undefined;

  return (
    <article
      {...props}
      data-response-block="PersonCard"
      className={cx(
        "flex w-[176px] shrink-0 snap-start flex-col items-center rounded-md border border-ai-border bg-background p-lg text-center text-text shadow-raised-faint sm:w-[188px]",
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
        {followers ? (
          <p className="mt-sm text-body-xs text-text-meta">{followers}</p>
        ) : null}
      </div>
      <Button
        aria-label={nameText ? `${String(actionLabel)} ${nameText}` : undefined}
        className="mt-lg w-full"
        leadingIcon={<Icon name={actionIcon} size="small" />}
        onClick={onAction}
        size="small"
        variant="secondary"
      >
        {actionLabel}
      </Button>
    </article>
  );
}
