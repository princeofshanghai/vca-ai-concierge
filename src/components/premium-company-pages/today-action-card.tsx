"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";

type TodayActionCardBadge = Readonly<{
  label: string;
  tone?: "premium";
}>;

type TodayActionCardInlineAction = Readonly<{
  href?: string;
  label: string;
  onSelect?: MouseEventHandler<HTMLElement>;
}>;

export type TodayActionCardProps = Readonly<{
  badge?: TodayActionCardBadge;
  className?: string;
  description: ReactNode;
  dismissLabel: string;
  headline: ReactNode;
  inlineAction?: TodayActionCardInlineAction;
  onDismiss: () => void;
}>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function renderInlineAction(action: TodayActionCardInlineAction) {
  const className =
    "font-semibold text-action transition-colors hover:text-action-hover";

  if (action.href) {
    return (
      <Link className={className} href={action.href} onClick={action.onSelect}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      className={className}
      onClick={action.onSelect}
      type="button"
    >
      {action.label}
    </button>
  );
}

export function TodayActionCard({
  badge,
  className,
  description,
  dismissLabel,
  headline,
  inlineAction,
  onDismiss,
}: TodayActionCardProps) {
  return (
    <article
      className={cx(
        "group relative flex w-full items-center rounded-xs border border-border-faint bg-background px-lg py-[16px] pr-xxl text-left outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:shadow-raised-soft focus-within:ring-4 focus-within:ring-action-focus-ring",
        className,
      )}
    >
      <div className="min-w-0 flex-1 py-xxs">
        {badge ? (
          <div className="flex items-center gap-xs text-control-sm text-text">
            {badge.tone === "premium" ? (
              <PremiumChipSmall />
            ) : null}
            <span>{badge.label}</span>
          </div>
        ) : null}
        <h3 className={cx("text-control-md text-text", badge ? "mt-sm" : "")}>
          {headline}
        </h3>
        <p className="mt-xs text-body-sm text-text">
          {description}
          {inlineAction ? (
            <>
              {" "}
              {renderInlineAction(inlineAction)}
            </>
          ) : null}
        </p>
      </div>
      <GhostIconButton
        className="absolute right-xs top-xs"
        icon="close"
        label={dismissLabel}
        onClick={onDismiss}
        size="small"
        touchTarget={false}
      />
    </article>
  );
}
