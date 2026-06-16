"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

import { getButtonClassName } from "@/components/primitives/button";
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
  primaryAction?: TodayActionCardInlineAction;
  visual?: ReactNode;
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

function renderPrimaryAction(action: TodayActionCardInlineAction) {
  const className = getButtonClassName({
    className: "mt-md self-start sm:ml-lg sm:mt-0 sm:self-center",
    size: "small",
  });

  if (action.href) {
    return (
      <Link className={className} href={action.href} onClick={action.onSelect}>
        {action.label}
      </Link>
    );
  }

  return (
    <button className={className} onClick={action.onSelect} type="button">
      {action.label}
    </button>
  );
}

function renderBadge(badge: TodayActionCardBadge) {
  return (
    <div className="flex items-center gap-xs text-control-sm text-text">
      {badge.tone === "premium" ? <PremiumChipSmall /> : null}
      <span className="font-medium">{badge.label}</span>
    </div>
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
  primaryAction,
  visual,
}: TodayActionCardProps) {
  if (badge && visual) {
    return (
      <article
        className={cx(
          "group relative flex w-full min-w-0 flex-col gap-sm rounded-xs border border-border-faint bg-background px-lg py-lg pr-xxl text-left outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:shadow-raised-soft focus-within:ring-4 focus-within:ring-action-focus-ring sm:pr-[72px]",
          className,
        )}
      >
        {renderBadge(badge)}
        <div className="flex min-w-0 items-start gap-md">
          <div className="flex size-6 shrink-0 items-center justify-center">
            {visual}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-control-md text-text">{headline}</h3>
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
        </div>
        {primaryAction ? renderPrimaryAction(primaryAction) : null}
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

  return (
    <article
      className={cx(
        "group relative flex w-full rounded-xs border border-border-faint bg-background px-lg py-[16px] pr-xxl text-left outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:shadow-raised-soft focus-within:ring-4 focus-within:ring-action-focus-ring",
        visual
          ? "min-h-[96px] flex-row items-center gap-md py-lg sm:pr-[72px]"
          : primaryAction
          ? "flex-col gap-md sm:flex-row sm:items-center sm:pr-[72px]"
          : "items-center",
        className,
      )}
    >
      {visual ? (
        <div className="flex shrink-0 items-center justify-center">
          {visual}
        </div>
      ) : null}
      <div className="min-w-0 flex-1 py-xxs">
        {badge ? renderBadge(badge) : null}
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
      {primaryAction ? renderPrimaryAction(primaryAction) : null}
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
