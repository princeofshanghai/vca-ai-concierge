import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";

export type CompanyCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actionLabel?: ReactNode;
  followers?: ReactNode;
  industry: ReactNode;
  logoSrc?: string;
  name: ReactNode;
  onAction?: () => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CompanyCard({
  actionLabel = "Follow",
  className,
  followers,
  industry,
  logoSrc,
  name,
  onAction,
  ...props
}: CompanyCardProps) {
  const nameText = typeof name === "string" ? name : undefined;

  return (
    <article
      {...props}
      data-response-block="CompanyCard"
      className={cx(
        "flex w-[var(--response-entity-card-width,100%)] max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] shrink-0 snap-start flex-col items-center rounded-md border border-ai-border bg-background p-lg text-center text-text shadow-raised-faint [--response-entity-card-rail-width:176px] sm:[--response-entity-card-rail-width:188px]",
        className,
      )}
    >
      <Entity label={nameText} shape="square" size={80} src={logoSrc} />
      <div className="mt-lg flex min-h-[104px] w-full flex-1 flex-col items-center">
        <p className="line-clamp-2 max-w-full text-control-md text-text">
          {name}
        </p>
        <p className="mt-xxs line-clamp-3 text-body-xs text-text-meta">
          {industry}
        </p>
        {followers ? (
          <p className="mt-sm text-body-xs text-text-meta">{followers}</p>
        ) : null}
      </div>
      <Button
        aria-label={nameText ? `${String(actionLabel)} ${nameText}` : undefined}
        className="mt-lg w-full"
        leadingIcon={<Icon name="add" size="small" />}
        onClick={onAction}
        size="small"
        variant="secondary"
      >
        {actionLabel}
      </Button>
    </article>
  );
}
