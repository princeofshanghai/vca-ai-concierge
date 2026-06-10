"use client";

import { type CSSProperties } from "react";

import { Entity } from "@/components/primitives/entity";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon } from "@/components/primitives/icon";

import {
  PCP_ASSET_ROOT,
  PCP_MEMBER_ASSET_ROOT,
  pcpAdminScenario,
  pcpCompanyProfile,
  pcpVisitorPersona,
} from "./persona";

const VELORA_LOGO_AVATAR_RADIUS_CLASS = "rounded-sm";
const VELORA_LOGO_TILE_BACKGROUND_CLASS = "bg-[#ACF5B3]";
const VELORA_LOGO_TILE_BACKGROUND_STYLE = {
  backgroundColor: "#ACF5B3",
};

type GlobalInboxThread = Readonly<{
  id: string;
  name: string;
  detail: string;
  time: string;
  avatar: string;
  active?: boolean;
  selected?: boolean;
}>;

const globalInboxThreads: ReadonlyArray<GlobalInboxThread> = [
  {
    id: "velora",
    name: pcpCompanyProfile.name,
    detail: "Cheri: Hi Rose - I lead HR for...",
    time: "Jun 1",
    avatar: "velora-logo.png",
    selected: true,
  },
  {
    id: "cheri",
    name: pcpVisitorPersona.name,
    detail: pcpAdminScenario.inboxThreadPreview,
    time: "4:48 PM",
    avatar: `${PCP_ASSET_ROOT}/${pcpVisitorPersona.avatar}`,
    active: true,
  },
  {
    id: "jordan",
    name: "Priya Shah",
    detail: "Can Velora validate carrier files before...",
    time: "May 29",
    avatar: `${PCP_ASSET_ROOT}/avatar-3.png`,
  },
  {
    id: "nicole",
    name: "Dana Kim",
    detail: "The open enrollment checklist helped our...",
    time: "May 27",
    avatar: `${PCP_ASSET_ROOT}/avatar-2.png`,
    active: true,
  },
  {
    id: "james",
    name: "Luis Romero",
    detail: "We need a clearer way to track...",
    time: "May 27",
    avatar: `${PCP_ASSET_ROOT}/avatar-2.png`,
  },
  {
    id: "steven",
    name: "Diana Lin",
    detail: "Are you hiring benefits implementation specialists?",
    time: "May 25",
    avatar: `${PCP_ASSET_ROOT}/avatar-3.png`,
  },
  {
    id: "amanda",
    name: "Amanda Liu",
    detail: "Do you support eligibility exception reporting?",
    time: "May 13",
    avatar: `${PCP_ASSET_ROOT}/avatar-1.png`,
    active: true,
  },
] as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${PCP_MEMBER_ASSET_ROOT}/${path}`;
}

function GlobalInboxAvatar({
  active = false,
  className,
  label,
  shape = "circle",
  size = 40,
  src,
  style,
}: Readonly<{
  active?: boolean;
  className?: string;
  label: string;
  shape?: "circle" | "square";
  size?: 32 | 40;
  src: string;
  style?: CSSProperties;
}>) {
  return (
    <span className="relative inline-flex shrink-0">
      <Entity
        className={className}
        label={label}
        shape={shape}
        size={size}
        src={src}
        style={style}
      />
      {active ? (
        <span
          aria-label="Active"
          className="absolute -bottom-xxs -right-xxs size-3 rounded-round border-2 border-background bg-positive"
          role="status"
        />
      ) : null}
    </span>
  );
}

export function GlobalInboxTray({
  isExpanded,
  onOpenVeloraThread,
  onToggle,
  profileLabel = pcpVisitorPersona.name,
  profileSrc = pcpVisitorPersona.memberAvatar,
}: Readonly<{
  isExpanded: boolean;
  onOpenVeloraThread?: () => void;
  onToggle: () => void;
  profileLabel?: string;
  profileSrc?: string;
}>) {
  return (
    <aside
      aria-label="Messaging inbox"
      className={cx(
        "pcp-global-messaging-surface fixed bottom-0 right-6 z-50 hidden w-[288px] flex-col overflow-hidden rounded-t-sm border border-b-0 border-border-faint bg-background text-text shadow-raised-faint-upward transition-[height] duration-[var(--design-motion-duration-moderate)] ease-emphasized md:flex",
        isExpanded
          ? "h-[min(calc(100dvh_-_96px),690px)]"
          : "h-[var(--design-layout-chat-tray-height,48px)]",
      )}
    >
      <div className="flex min-h-[var(--design-layout-chat-tray-height,48px)] items-center gap-sm border-b border-border-faint px-lg">
        <button
          aria-expanded={isExpanded}
          className="group flex min-w-0 flex-1 items-center gap-sm rounded-xs text-left outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          onClick={onToggle}
          type="button"
        >
          <GlobalInboxAvatar
            active
            label={profileLabel}
            size={32}
            src={assetSrc(profileSrc)}
          />
          <span className="min-w-0 truncate text-heading-md text-text">
            Messaging
          </span>
        </button>
        <div className="flex shrink-0 items-center -space-x-xs">
          <GhostIconButton
            icon="overflow-web-ios"
            label="More messaging actions"
            size="small"
          />
          <GhostIconButton
            icon="compose"
            label="Compose message"
            size="small"
          />
          <GhostIconButton
            icon={isExpanded ? "chevron-down" : "chevron-up"}
            label={isExpanded ? "Collapse messaging" : "Expand messaging"}
            onClick={onToggle}
            size="small"
          />
        </div>
      </div>

      {isExpanded ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <button
            className="flex min-h-[48px] items-center justify-between border-b border-border-faint px-lg text-left text-control-md text-text outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
            type="button"
          >
            <span>More inboxes</span>
            <Icon className="text-icon" name="caret" size="small" />
          </button>

          <div className="border-b border-border-faint px-lg py-sm">
            <div className="flex h-10 items-center gap-sm rounded-xs bg-background-neutral-soft px-md text-text-meta">
              <Icon name="search" size="small" />
              <span className="min-w-0 flex-1 truncate text-body-sm">
                Search messages
              </span>
              <Icon name="overflow-android" size="small" />
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-border-faint text-center text-control-sm">
            <button
              aria-selected="true"
              className="border-b-2 border-positive px-md py-md text-positive outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              role="tab"
              type="button"
            >
              Focused
            </button>
            <button
              aria-selected="false"
              className="border-b-2 border-transparent px-md py-md text-text-meta outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
              role="tab"
              type="button"
            >
              Other
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {globalInboxThreads.map((thread) => (
              <button
                className={cx(
                  "flex w-full items-start gap-sm border-b border-border-faint px-md py-sm text-left outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring",
                  thread.selected && "bg-action-background-transparent-hover",
                )}
                key={thread.name}
                onClick={
                  thread.id === "velora" ? onOpenVeloraThread : undefined
                }
                type="button"
              >
                <GlobalInboxAvatar
                  active={thread.active}
                  className={
                    thread.id === "velora"
                      ? cx(
                          VELORA_LOGO_TILE_BACKGROUND_CLASS,
                          VELORA_LOGO_AVATAR_RADIUS_CLASS,
                        )
                      : undefined
                  }
                  label={thread.name}
                  shape={thread.id === "velora" ? "square" : "circle"}
                  src={assetSrc(thread.avatar)}
                  style={
                    thread.id === "velora"
                      ? VELORA_LOGO_TILE_BACKGROUND_STYLE
                      : undefined
                  }
                />
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-baseline justify-between gap-sm">
                    <span className="truncate text-control-sm text-text">
                      {thread.name}
                    </span>
                    <span className="shrink-0 text-body-xs text-text-meta">
                      {thread.time}
                    </span>
                  </span>
                  <span className="mt-xxs block truncate text-body-sm text-text-meta">
                    {thread.detail}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
