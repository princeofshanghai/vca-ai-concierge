"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

import { Entity } from "@/components/primitives/entity";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon } from "@/components/primitives/icon";
import { Tag, type TagTone } from "@/components/primitives/tag";

import { pcpCompanyProfile } from "./persona";
import {
  VELORA_LOGO_TILE_BACKGROUND_CLASS,
  VELORA_LOGO_TILE_BACKGROUND_STYLE,
} from "./velora-logo-styles";

type InsightCardType =
  | "anomaly"
  | "opportunity"
  | "lead-tier-1"
  | "strong-fit-tier-2"
  | "competitive"
  | "audience-fit";

type InsightCardVisual =
  | Readonly<{
      kind: "avatar" | "company-logo";
      label: string;
      src?: string;
    }>
  | Readonly<{
      alt: string;
      kind: "post-thumbnail";
      src: string;
    }>
  | Readonly<{
      kind: "avatar-pair";
      primary: InsightCardAvatarVisual;
      secondary: InsightCardAvatarVisual;
    }>;

type InsightCardAvatarVisual = Readonly<{
  label: string;
  src?: string;
}>;

type InsightCardSignal = Readonly<{
  tone: "behavioral" | "profile";
  text: string;
}>;

export type InsightCardAction = Readonly<{
  href?: string;
  id: string;
  kind: "ask-ai" | "link";
  label: string;
  onSelect?: () => void;
}>;

export type InsightCardProps = Readonly<{
  action: InsightCardAction;
  active?: boolean;
  className?: string;
  dismissLabel?: string;
  evidence: ReactNode;
  headline: ReactNode;
  onDismiss: () => void;
  signal?: InsightCardSignal;
  type: InsightCardType;
  visual?: InsightCardVisual;
}>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isVeloraLogo(visual: InsightCardVisual) {
  return (
    visual.kind === "company-logo" &&
    (visual.src === pcpCompanyProfile.logoSrc ||
      visual.label === pcpCompanyProfile.name)
  );
}

function getSignalTone(tone: InsightCardSignal["tone"]): TagTone {
  return tone === "behavioral" ? "caution" : "supportive-4";
}

function renderVisual(visual: InsightCardVisual) {
  if (visual.kind === "post-thumbnail") {
    return (
      <Image
        alt={visual.alt}
        className="size-10 shrink-0 rounded-xs object-cover"
        height={40}
        src={visual.src}
        width={40}
      />
    );
  }

  if (visual.kind === "avatar-pair") {
    return (
      <span
        aria-label={`${visual.primary.label} and ${visual.secondary.label}`}
        className="relative block size-12 shrink-0 self-center"
        role="img"
      >
        <span className="absolute right-0 top-0 block">
          <Entity className="ring-2 ring-background" size={32} src={visual.secondary.src} />
        </span>
        <span className="absolute bottom-0 left-0 block">
          <Entity className="ring-2 ring-background" size={40} src={visual.primary.src} />
        </span>
      </span>
    );
  }

  return (
    <Entity
      className={
        isVeloraLogo(visual) ? VELORA_LOGO_TILE_BACKGROUND_CLASS : undefined
      }
      label={visual.label}
      shape={visual.kind === "company-logo" ? "square" : "circle"}
      size={40}
      src={visual.src}
      style={isVeloraLogo(visual) ? VELORA_LOGO_TILE_BACKGROUND_STYLE : undefined}
    />
  );
}

function InlineAction({ action }: Readonly<{ action: InsightCardAction }>) {
  return (
    <span className="inline-flex items-center gap-xxs align-[-0.125em] font-semibold text-action transition-colors group-hover:text-action-hover">
      {action.kind === "ask-ai" ? (
        <Icon
          aria-hidden="true"
          className="shrink-0 [&&]:size-4"
          name="signal-ai"
          size="small"
        />
      ) : null}
      <span>{action.label}</span>
    </span>
  );
}

export function InsightCard({
  action,
  active = false,
  className,
  dismissLabel = "Dismiss insight",
  evidence,
  headline,
  onDismiss,
  signal,
  type,
  visual,
}: InsightCardProps) {
  const router = useRouter();

  function handleAction() {
    action.onSelect?.();

    if (action.href) {
      router.push(action.href);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleAction();
  }

  function handleDismiss(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onDismiss();
  }

  const cardBody = (
    <>
      {visual ? (
        <div className="flex min-w-0 items-start gap-sm">
          {renderVisual(visual)}
          <div className="min-w-0 flex-1">
            <h3 className="text-control-md text-text">{headline}</h3>
            <p className="mt-xs text-body-sm text-text">
              {evidence} <InlineAction action={action} />
            </p>
            {signal ? (
              <Tag
                className="mt-sm"
                size="small"
                tone={getSignalTone(signal.tone)}
              >
                {signal.text}
              </Tag>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-control-md text-text">{headline}</h3>
          <p className="mt-xs text-body-sm text-text">
            {evidence} <InlineAction action={action} />
          </p>
          {signal ? (
            <Tag
              className="mt-sm"
              size="small"
              tone={getSignalTone(signal.tone)}
            >
              {signal.text}
            </Tag>
          ) : null}
        </>
      )}
    </>
  );

  return (
    <article
      aria-label={`${headline} ${action.label}`}
      className={cx(
        "group relative w-full cursor-pointer rounded-xs border bg-background px-lg py-[16px] pr-xxl text-left outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:shadow-raised-soft focus-visible:ring-4 focus-visible:ring-action-focus-ring",
        active
          ? "border-action bg-surface-tint shadow-[inset_4px_0_0_var(--color-action)]"
          : "border-border-faint",
        className,
      )}
      data-insight-card-type={type}
      onClick={handleAction}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="min-w-0 py-xxs">
        {cardBody}
      </div>
      <GhostIconButton
        className="absolute right-xs top-xs"
        icon="close"
        label={dismissLabel}
        onClick={handleDismiss}
        size="small"
        touchTarget={false}
      />
    </article>
  );
}

export type {
  InsightCardSignal,
  InsightCardType,
  InsightCardVisual,
};
