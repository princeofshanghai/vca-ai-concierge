"use client";

import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  forwardRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  type KeyboardEvent,
  type MouseEvent,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import {
  GhostIconButton,
  type GhostIconButtonSize,
} from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName, type IconSize } from "@/components/primitives/icon";
import { OverlayButtonIcon } from "@/components/primitives/overlay-button-icon";
import { Pill } from "@/components/primitives/pill";
import { PresenceBadge } from "@/components/primitives/presence-badge";
import { TextArea } from "@/components/primitives/text-area";

import {
  CHAT_ASSISTANT_STREAM_WORD_FADE_MS,
  splitIntoStreamChunks,
  type ChatMessageStreamStatus,
} from "./chat-motion";

export type ChatPanelVariant = "collapsed" | "expanded";
export type ChatPanelSurface = "default" | "welcome";
export type ChatMessageRole = "assistant" | "user" | "representative";
export type ChatComposerVoiceState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking";
export type ChatHeaderIdentity =
  | {
      type: "ai";
      title?: ReactNode;
      icon?: ReactNode;
    }
  | {
      type: "representative";
      name: string;
      role: string;
      avatarSrc?: string;
      avatarLabel?: string;
    };

type RepresentativeChatHeaderIdentity = Extract<
  ChatHeaderIdentity,
  { type: "representative" }
>;

type ChatPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: ChatPanelVariant;
  surface?: ChatPanelSurface;
};

type ChatTrayProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  variant?: ChatPanelVariant;
  identity?: ChatHeaderIdentity | null;
  title?: ReactNode;
  badge?: boolean;
  badgeLabel?: string;
  actionSize?: GhostIconButtonSize;
  onOpen?: () => void;
  onClose?: () => void;
  onVariantToggle?: () => void;
  openActionPosition?: "before-variant" | "after-variant" | "after-close";
  showCloseAction?: boolean;
};

type ChatHeaderProps = HTMLAttributes<HTMLElement> & {
  variant?: ChatPanelVariant;
  identity?: ChatHeaderIdentity | null;
  title?: ReactNode;
  centerContent?: ReactNode;
  actionSize?: GhostIconButtonSize;
  backLabel?: string;
  backIcon?: IconName;
  backIconSize?: IconSize;
  onClose?: () => void;
  onBack?: () => void;
  onDockToggle?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  dockActionPosition?: "before-variant" | "after-variant";
  showCloseAction?: boolean;
  transparent?: boolean;
  showAiMark?: boolean;
  // Optional class applied to the AI mark icon. Used by the concierge
  // experience to attach a `view-transition-name` so the mark can morph
  // between the welcome screen and the chat header.
  aiMarkClassName?: string;
};

type ChatComposerProps = HTMLAttributes<HTMLDivElement> & {
  variant?: ChatPanelVariant;
  inputProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "className"
  >;
  onSend?: () => void;
  onStopResponse?: () => void;
  onVoiceInterrupt?: () => void;
  onVoiceListen?: () => void;
  onVoiceModeExit?: () => void;
  onVoiceModeStart?: () => void;
  sendDisabled?: boolean;
  sendLoading?: boolean;
  isResponding?: boolean;
  showAttachAction?: boolean;
  attachTooltip?: string;
  showTopDivider?: boolean;
  showVoiceMode?: boolean;
  voiceModeActive?: boolean;
  voiceState?: ChatComposerVoiceState;
  voiceTranscript?: string;
};

type ChatThreadProps = HTMLAttributes<HTMLDivElement> & {
  timestamp?: string | null;
  showAiDisclaimer?: boolean;
  aiDisclaimerHref?: string;
};

type ChatBodyProps = HTMLAttributes<HTMLDivElement> & {
  showJumpToLatest?: boolean;
  onJumpToLatest?: () => void;
};

type ChatMessageProps = HTMLAttributes<HTMLDivElement> & {
  role?: ChatMessageRole;
  authorName?: string;
  avatarLabel?: string;
  avatarSrc?: string;
  timestamp?: string;
  streamStatus?: ChatMessageStreamStatus;
  streamText?: string;
};

type ChatResponseAttachmentProps = HTMLAttributes<HTMLDivElement> & {
  gap?: "sm" | "md";
};

export type PromptVisualState =
  | "default"
  | "hover"
  | "active"
  | "focus-visible";

export type PromptProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  prompt: string;
  children?: ReactNode;
  onPromptSelect?: (prompt: string) => void;
  showNativeTooltip?: boolean;
  visualState?: PromptVisualState;
};

type RecommendationCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  description?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
};

export type ChatMessageFeedbackValue = "thumbs-up" | "thumbs-down";

export type ChatInlineFeedbackTone = "positive" | "neutral";

type ChatInlineFeedbackProps = HTMLAttributes<HTMLDivElement> & {
  tone?: ChatInlineFeedbackTone;
};

export type ChatFeedbackReason =
  | "inaccurate"
  | "confusing"
  | "not-what-im-looking-for"
  | "inappropriate-or-harmful"
  | "something-else";

type ChatFeedbackReasonOption = Readonly<{
  value: ChatFeedbackReason;
  label: string;
}>;

type ChatMessageFeedbackProps = HTMLAttributes<HTMLDivElement> & {
  value?: ChatMessageFeedbackValue | null;
  disabled?: boolean;
  timestamp?: string;
  onValueChange?: (value: ChatMessageFeedbackValue) => void;
};

type ChatFeedbackReasonChipsProps = HTMLAttributes<HTMLDivElement> & {
  value?: ChatFeedbackReason | null;
  values?: ReadonlyArray<ChatFeedbackReason>;
  disabled?: boolean;
  options?: ReadonlyArray<ChatFeedbackReasonOption>;
  onValueChange?: (value: ChatFeedbackReason) => void;
  onValuesChange?: (values: ReadonlyArray<ChatFeedbackReason>) => void;
};

type ChatFeedbackSubmission = Readonly<{
  rating: ChatMessageFeedbackValue;
  reasons: ReadonlyArray<ChatFeedbackReason>;
  comment: string;
}>;

export type ChatEndFeedbackRating = 1 | 2 | 3 | 4 | 5;

export type ChatEndFeedbackSubmission = Readonly<{
  rating: ChatEndFeedbackRating | null;
  comment: string;
}>;

type ChatMessageFeedbackFlowProps = HTMLAttributes<HTMLDivElement> & {
  timestamp?: string;
  onSubmitFeedback?: (submission: ChatFeedbackSubmission) => void;
};

type ChatEndFeedbackScreenProps = HTMLAttributes<HTMLDivElement> & {
  onBackToChat: () => void;
  onEndChat: (submission: ChatEndFeedbackSubmission) => void;
};

type ChatFeedbackReasonPanelProps = HTMLAttributes<HTMLDivElement> & {
  values: ReadonlyArray<ChatFeedbackReason>;
  comment: string;
  onValuesChange: (values: ReadonlyArray<ChatFeedbackReason>) => void;
  onCommentChange: (comment: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const defaultFeedbackReasonOptions: ReadonlyArray<ChatFeedbackReasonOption> = [
  { value: "inaccurate", label: "Inaccurate" },
  { value: "confusing", label: "Confusing" },
  {
    value: "not-what-im-looking-for",
    label: "Not what I'm looking for",
  },
  {
    value: "inappropriate-or-harmful",
    label: "Inappropriate or harmful",
  },
  { value: "something-else", label: "Something else" },
];

const endFeedbackRatings: ReadonlyArray<
  Readonly<{
    value: ChatEndFeedbackRating;
    label: string;
  }>
> = [
  { value: 1, label: "Very dissatisfied" },
  { value: 2, label: "Dissatisfied" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Satisfied" },
  { value: 5, label: "Very satisfied" },
];

const panelWidthClasses: Record<ChatPanelVariant, string> = {
  collapsed:
    "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-collapsed-max)] md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-collapsed-height))] md:w-[min(100%,var(--design-layout-panel-collapsed-width))] md:rounded-panel",
  expanded:
    "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-expanded-max)] md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(100%,var(--design-layout-panel-expanded-width))] md:rounded-panel",
};

const headerActionIcon: Record<ChatPanelVariant, IconName> = {
  collapsed: "maximize",
  expanded: "minimize",
};

const headerActionLabel: Record<ChatPanelVariant, string> = {
  collapsed: "Expand chat",
  expanded: "Collapse chat",
};

const promptStateClasses: Partial<
  Record<Exclude<PromptVisualState, "default">, string>
> = {
  hover:
    "bg-background-transparent-hover shadow-[inset_0_0_0_1px_var(--color-border-faint)]",
  active: "bg-background-transparent-active",
  "focus-visible": "ring-4 ring-neutral-focus-ring",
};

const COMPOSER_SINGLE_LINE_HEIGHT = 28;
const COMPOSER_TEXTAREA_EMPTY_HEIGHT = 21;
const VOICE_MODE_TOOLTIP = "Voice mode is WIP in this prototype.";
const ATTACH_TOOLTIP = "Attaching files is not in scope yet.";
const AI_DISCLAIMER_HREF =
  "https://www.linkedin.com/help/linkedin/answer/a1665456";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function readPixelValue(element: Element, propertyName: string) {
  return (
    Number.parseFloat(getComputedStyle(element).getPropertyValue(propertyName)) ||
    0
  );
}

function getTextareaValueText(
  value:
    | TextareaHTMLAttributes<HTMLTextAreaElement>["value"]
    | TextareaHTMLAttributes<HTMLTextAreaElement>["defaultValue"],
) {
  if (Array.isArray(value)) {
    return value.join("");
  }

  return value === undefined || value === null ? "" : String(value);
}

function measureTextareaHeight(
  textarea: HTMLTextAreaElement,
  width: number,
  maxHeight: number,
) {
  const previousHeight = textarea.style.height;
  const previousWidth = textarea.style.width;

  textarea.style.width = `${width}px`;
  textarea.style.height = "auto";

  const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

  textarea.style.width = previousWidth;
  textarea.style.height = previousHeight;

  return nextHeight;
}

export function ChatPanel({
  variant = "collapsed",
  surface = "default",
  className,
  children,
  ...props
}: ChatPanelProps) {
  return (
    <section
      {...props}
      className={cx(
        "h-[var(--design-layout-mobile-panel-height)] w-[var(--design-layout-mobile-panel-width)] max-w-full rounded-none text-text shadow-raised-faint transition-[width,height,border-radius] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none",
        panelWidthClasses[variant],
        className,
      )}
    >
      <div
        data-surface={surface}
        className={cx(
          "relative flex h-full flex-col overflow-hidden rounded-[inherit] border border-border-faint bg-background pt-[env(safe-area-inset-top)] transition-[background-color] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:pt-0",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function ChatTray({
  variant = "collapsed",
  identity,
  title = "Contact sales",
  badge = false,
  badgeLabel = "New activity",
  actionSize = "medium",
  className,
  onOpen,
  onClose,
  onVariantToggle,
  openActionPosition = "before-variant",
  showCloseAction = true,
  "aria-controls": ariaControls,
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHasPopup,
  "aria-label": ariaLabel,
  ...props
}: ChatTrayProps) {
  const badgeIndicator = badge ? (
    <Badge role="status" tone="alert" size="large" label={badgeLabel} />
  ) : null;
  const openAction = (
    <GhostIconButton
      label="Open chat"
      icon="chevron-up"
      size={actionSize}
      onClick={onOpen}
    />
  );
  const variantAction = onVariantToggle ? (
    <span className="hidden md:inline-flex">
      <GhostIconButton
        label={headerActionLabel[variant]}
        icon={headerActionIcon[variant]}
        size={actionSize}
        onClick={onVariantToggle}
      />
    </span>
  ) : null;

  return (
    <div
      {...props}
      className={cx(
        "inline-flex h-[var(--design-layout-chat-tray-height)] w-[min(100%,var(--design-layout-chat-tray-width))] items-center gap-md rounded-t-md rounded-b-none border border-b-0 border-border-faint bg-background px-lg py-0 text-left text-text shadow-raised-faint transition-[background-color,border-color,box-shadow] duration-[var(--design-motion-duration-fast)] ease-standard motion-reduce:transition-none",
        className,
      )}
    >
      <button
        type="button"
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHasPopup}
        aria-label={ariaLabel ?? "Open AI Concierge chat"}
        className="group flex min-w-0 flex-1 items-center gap-xs rounded-xs text-left outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
        onClick={onOpen}
      >
        {identity?.type === "representative" ? (
          <>
            <RepresentativeAvatar identity={identity} />
            <span className="min-w-0 inline-flex items-center gap-sm">
              <span className="min-w-0 truncate text-heading-md text-text">
                {identity.name}
              </span>
              {badgeIndicator}
            </span>
          </>
        ) : (
          <>
            {identity?.type === "ai" && identity.icon ? (
              <span
                aria-hidden="true"
                className="inline-flex shrink-0 items-center justify-center"
              >
                {identity.icon}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center justify-center text-ai-icon">
                <Icon name="signal-ai" size="small" label="AI Concierge" />
              </span>
            )}
            <span className="min-w-0 inline-flex flex-1 items-center gap-sm">
              <span className="min-w-0 truncate text-heading-md text-text">
                {identity?.type === "ai" ? (identity.title ?? title) : title}
              </span>
              {badgeIndicator}
            </span>
          </>
        )}
      </button>
      <div className="flex shrink-0 items-center -space-x-xs">
        {openActionPosition === "before-variant" ? openAction : null}
        {variantAction}
        {openActionPosition === "after-variant" ? openAction : null}
        {showCloseAction ? (
          <GhostIconButton
            label="Close chat"
            icon="close"
            size={actionSize}
            onClick={onClose}
          />
        ) : null}
        {openActionPosition === "after-close" ? openAction : null}
      </div>
    </div>
  );
}

function RepresentativeAvatar({
  identity,
}: Readonly<{ identity: RepresentativeChatHeaderIdentity }>) {
  return (
    <span className="relative inline-flex size-8 shrink-0">
      <Entity
        size={32}
        src={identity.avatarSrc}
        label={identity.avatarLabel ?? `${identity.name}, ${identity.role}`}
      />
      <PresenceBadge
        className="absolute -right-xs -bottom-xs bg-background"
        label="Online and available"
        presence="active"
        size="small"
      />
    </span>
  );
}

function VoiceModeButton({ onClick }: Readonly<{ onClick?: () => void }>) {
  if (onClick) {
    return (
      <ButtonIcon
        label="Start voice mode"
        icon="voice"
        size="small"
        touchTarget={false}
        onClick={onClick}
      />
    );
  }

  return (
    <span className="group relative inline-flex shrink-0">
      <span
        role="button"
        aria-disabled="true"
        aria-label={VOICE_MODE_TOOLTIP}
        className="inline-flex size-[var(--design-layout-compact-action-height)] shrink-0 select-none items-center justify-center rounded-full bg-transparent font-sans outline-none"
      >
        <span className="inline-flex size-[var(--design-layout-compact-action-height)] shrink-0 items-center justify-center rounded-round border border-transparent bg-action text-on-action transition-[background-color] duration-150 ease-out group-hover:bg-action-hover">
          <Icon name="voice" size="small" />
        </span>
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+var(--design-spacing-sm))] right-0 z-20 max-w-[13rem] rounded-xs bg-text px-sm py-xs text-left text-body-xs text-background opacity-0 shadow-raised transition-opacity duration-150 ease-out group-hover:opacity-100"
      >
        {VOICE_MODE_TOOLTIP}
      </span>
    </span>
  );
}

function VoiceWaveform({
  state,
}: Readonly<{ state: ChatComposerVoiceState }>) {
  const tone = state === "speaking" ? "agent" : "user";

  return (
    <span
      aria-hidden="true"
      data-state={state}
      data-tone={tone}
      className="chat-voice-waveform"
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className="chat-voice-waveform-bar"
          style={{ "--chat-voice-bar-index": index } as CSSProperties}
        />
      ))}
    </span>
  );
}

function getVoiceStatusLabel(state: ChatComposerVoiceState) {
  switch (state) {
    case "listening":
      return "Listening";
    case "thinking":
      return "Thinking";
    case "speaking":
      return "Speaking";
    default:
      return "Voice mode on";
  }
}

function getVoiceActionLabel(state: ChatComposerVoiceState) {
  if (state === "speaking") {
    return "Tap to interrupt";
  }

  if (state === "idle") {
    return "Start listening";
  }

  return getVoiceStatusLabel(state);
}

function ComposerAttachButton({
  tooltip = ATTACH_TOOLTIP,
}: {
  tooltip?: string;
}) {
  function handleAttachClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  return (
    <span className="group relative inline-flex shrink-0">
      <GhostIconButton
        label="Add attachment"
        icon="add"
        size="small"
        touchTarget={false}
        aria-disabled="true"
        onClick={handleAttachClick}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+var(--design-spacing-sm))] left-0 z-20 max-w-[13rem] rounded-xs bg-text px-sm py-xs text-left text-body-xs text-background opacity-0 shadow-raised transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {tooltip}
      </span>
    </span>
  );
}

function StopAnsweringIcon() {
  return (
    <span
      aria-hidden="true"
      className="composer-stop-icon relative inline-flex size-[var(--design-layout-compact-action-height)] shrink-0 items-center justify-center text-text-primary"
    >
      <svg
        className="composer-stop-ring absolute inset-0 size-full"
        viewBox="0 0 32 32"
        fill="none"
      >
        <circle
          className="composer-stop-ring-arc"
          cx="16"
          cy="16"
          r="12.5"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="block size-[10px] bg-current" />
    </span>
  );
}

export function ChatHeader({
  variant = "collapsed",
  identity,
  title,
  centerContent,
  actionSize = "medium",
  className,
  backLabel = "Back",
  backIcon = "arrow-left",
  backIconSize,
  onClose,
  onBack,
  onDockToggle,
  onMinimizeToTray,
  onVariantToggle,
  dockActionPosition = "before-variant",
  showCloseAction = true,
  transparent = false,
  showAiMark = true,
  aiMarkClassName,
  ...props
}: ChatHeaderProps) {
  const headerIdentity: ChatHeaderIdentity | null =
    identity ?? (showAiMark ? ({ type: "ai", title } as const) : null);
  const dockAction =
    onDockToggle || onMinimizeToTray ? (
      <GhostIconButton
        label="Dock chat to tray"
        icon="chevron-down"
        size={actionSize}
        onClick={onDockToggle ?? onMinimizeToTray}
      />
    ) : null;
  const variantAction = onVariantToggle ? (
    <span className="hidden md:inline-flex">
      <GhostIconButton
        label={headerActionLabel[variant]}
        icon={headerActionIcon[variant]}
        size={actionSize}
        onClick={onVariantToggle}
      />
    </span>
  ) : null;

  const backAction = onBack ? (
    <GhostIconButton
      label={backLabel}
      icon={backIcon}
      iconSize={backIconSize}
      size="medium"
      onClick={onBack}
    />
  ) : null;

  return (
    <header
      {...props}
      className={cx(
        "relative flex h-[var(--design-layout-panel-header-height)] shrink-0 items-center justify-between pl-[calc(var(--design-spacing-xxl)+env(safe-area-inset-left))] pr-[calc(var(--design-spacing-lg)+env(safe-area-inset-right))] transition-[background-color,border-color] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:pl-xxl md:pr-lg",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border-faint bg-background",
        className,
      )}
    >
      {centerContent ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          {centerContent}
        </div>
      ) : null}
      {backAction ? (
        backAction
      ) : headerIdentity?.type === "ai" ? (
        <div className="flex min-w-0 items-center gap-sm">
          {headerIdentity.icon ? (
            <span
              aria-hidden="true"
              className={cx(
                "inline-flex shrink-0 items-center justify-center",
                aiMarkClassName,
              )}
            >
              {headerIdentity.icon}
            </span>
          ) : showAiMark ? (
            <Icon
              name="signal-ai"
              size="small"
              label="AI Concierge"
              className={cx("shrink-0 text-ai-icon", aiMarkClassName)}
            />
          ) : null}
          {headerIdentity.title ? (
            <span className="min-w-0 truncate text-heading-md text-text">
              {headerIdentity.title}
            </span>
          ) : null}
        </div>
      ) : headerIdentity?.type === "representative" ? (
        <div className="flex min-w-0 items-center gap-sm">
          <RepresentativeAvatar identity={headerIdentity} />
          <span className="min-w-0 truncate text-heading-md text-text">
            {headerIdentity.name}
          </span>
        </div>
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="flex items-center gap-0">
        {dockActionPosition === "before-variant" ? dockAction : null}
        {variantAction}
        {dockActionPosition === "after-variant" ? dockAction : null}
        {showCloseAction ? (
          <GhostIconButton
            label="Close chat"
            icon="close"
            size={actionSize}
            onClick={onClose}
          />
        ) : null}
      </div>
    </header>
  );
}

export function ChatThread({
  timestamp = null,
  showAiDisclaimer = true,
  aiDisclaimerHref = AI_DISCLAIMER_HREF,
  className,
  children,
  ...props
}: ChatThreadProps) {
  const topNotice = timestamp ? (
    <p className="pb-lg pt-xl text-body-xs text-text-meta">
      {timestamp}
    </p>
  ) : showAiDisclaimer ? (
    <p className="pb-lg pt-xl text-body-xs text-text-meta">
      This AI-powered chat may make mistakes.{" "}
      <a
        href={aiDisclaimerHref}
        target="_blank"
        rel="noreferrer"
        className="text-action transition-colors duration-150 ease-out hover:text-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring active:text-action-active"
      >
        Learn more
      </a>
    </p>
  ) : null;

  return (
    <div
      {...props}
      className={cx(
        "flex w-full max-w-[var(--design-layout-panel-content-max)] flex-col px-xxl",
        className,
      )}
    >
      {topNotice}
      <div className={cx("flex flex-col gap-xxl pb-sm", !topNotice && "pt-xl")}>
        {children}
      </div>
    </div>
  );
}

export const ChatBody = forwardRef<HTMLDivElement, ChatBodyProps>(
  function ChatBody(
    {
      className,
      children,
      showJumpToLatest = false,
      onJumpToLatest,
      style,
      ...props
    },
    ref,
  ) {
    const body = (
      <div
        {...props}
        ref={ref}
        className={cx(
          "flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-x-hidden overflow-y-auto",
          className,
        )}
        style={{ overflowAnchor: "none", ...style }}
      >
        {children}
      </div>
    );

    if (!onJumpToLatest) {
      return body;
    }

    return (
      <div className="relative flex min-h-0 min-w-0 flex-1">
        {body}
        {showJumpToLatest ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-md z-20 flex justify-center">
            <OverlayButtonIcon
              className="pointer-events-auto"
              color="white"
              icon="arrow-down"
              label="Jump to latest message"
              onClick={() => onJumpToLatest()}
              size="small"
            />
          </div>
        ) : null}
      </div>
    );
  },
);

export function ChatThinkingMessage({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx(
        "chat-message-enter flex w-full",
        className,
      )}
    >
      <div
        role="status"
        aria-label="AI Concierge is thinking"
        className="text-body-sm-open text-text-meta"
      >
        <span className="chat-thinking-text">Thinking</span>
      </div>
    </div>
  );
}

function ChatStreamingText({ text }: Readonly<{ text: string }>) {
  return (
    <>
      {splitIntoStreamChunks(text).map((chunk, index) => (
        <span
          key={index}
          className="chat-stream-word"
          style={{
            animationDuration: `${CHAT_ASSISTANT_STREAM_WORD_FADE_MS}ms`,
          }}
        >
          {chunk}
        </span>
      ))}
    </>
  );
}

export function ChatMessage({
  role = "assistant",
  authorName,
  avatarLabel,
  avatarSrc,
  timestamp,
  streamStatus,
  streamText,
  className,
  children,
  ...props
}: ChatMessageProps) {
  const isUser = role === "user";
  const isRepresentative = role === "representative";
  const hasRepresentativeMeta =
    isRepresentative && Boolean(authorName || timestamp);
  const hasStandaloneTimestamp = Boolean(timestamp) && !hasRepresentativeMeta;

  return (
    <div
      {...props}
      data-chat-message-role={role}
      className={cx(
        "chat-message-enter flex w-full",
        isUser && "justify-end",
        className,
      )}
    >
      <div
        className={cx(
          isUser && "flex w-full flex-col items-end",
          hasStandaloneTimestamp && !isUser && "flex flex-col items-start",
          hasRepresentativeMeta && "flex max-w-full flex-col gap-md",
        )}
      >
        <div
          className={cx(
            "break-words text-body-sm-open text-text",
            isUser &&
              "w-fit max-w-[min(100%,24.5rem)] rounded-bl-md rounded-tl-md rounded-tr-md bg-ai-background-strong p-xl",
            isRepresentative &&
              "w-fit max-w-[min(100%,24.5rem)] rounded-br-md rounded-tl-md rounded-tr-md bg-background-neutral-soft p-xl",
            !isUser &&
              !isRepresentative &&
              "max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] pr-sm",
          )}
        >
          {role === "assistant" &&
          streamStatus === "streaming" &&
          streamText !== undefined ? (
            <ChatStreamingText text={streamText} />
          ) : (
            children
          )}
        </div>
        {hasRepresentativeMeta ? (
          <div className="flex items-center gap-sm text-body-xs text-text-meta">
            <RepresentativeMessageAvatar
              label={avatarLabel ?? authorName ?? "Human representative"}
              src={avatarSrc}
            />
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-xs">
              {authorName ? <span>{authorName}</span> : null}
              {timestamp ? <span>{timestamp}</span> : null}
            </div>
          </div>
        ) : null}
        {hasStandaloneTimestamp ? (
          <span className="pt-xs text-body-xs text-text-meta">{timestamp}</span>
        ) : null}
      </div>
    </div>
  );
}

function RepresentativeMessageAvatar({
  label,
  src,
}: Readonly<{
  label: string;
  src?: string;
}>) {
  return (
    <span className="relative inline-flex size-6 shrink-0">
      <Entity size={24} src={src} label={label} />
      <PresenceBadge
        className="absolute -right-xs -bottom-xs bg-background"
        label="Online and available"
        presence="active"
        size="small"
      />
    </span>
  );
}

export function ChatResponseBlock({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx(
        "chat-response-block flex w-full flex-col items-start",
        className,
      )}
    />
  );
}

export function ChatResponseAttachment({
  gap = "md",
  className,
  style,
  children,
  ...props
}: ChatResponseAttachmentProps) {
  const gapValue =
    gap === "sm" ? "var(--spacing-sm)" : "var(--spacing-md)";

  return (
    <div
      {...props}
      className={cx("chat-response-attachment w-full", className)}
      style={
        {
          "--chat-response-attachment-gap": gapValue,
          ...style,
        } as CSSProperties
      }
    >
      <div className="chat-response-attachment-inner">{children}</div>
    </div>
  );
}

export function ChatMessageFeedback({
  value = null,
  disabled = false,
  timestamp,
  onValueChange,
  className,
  ...props
}: ChatMessageFeedbackProps) {
  const isPositive = value === "thumbs-up";
  const isNegative = value === "thumbs-down";

  return (
    <div
      {...props}
      role="group"
      aria-label="Rate this response"
      className={cx(
        "chat-message-enter -ml-sm flex h-[var(--design-layout-ghost-icon-button-touch-height)] w-fit items-center gap-sm",
        className,
      )}
    >
      <span className="flex items-center">
        <GhostIconButton
          label="Thumbs up"
          icon={isPositive ? "thumbs-up-fill" : "thumbs-up-outline"}
          size="small"
          disabled={disabled}
          aria-pressed={isPositive}
          onClick={() => onValueChange?.("thumbs-up")}
        />
        <GhostIconButton
          label="Thumbs down"
          icon={isNegative ? "thumbs-down-fill" : "thumbs-down-outline"}
          size="small"
          disabled={disabled}
          aria-pressed={isNegative}
          onClick={() => onValueChange?.("thumbs-down")}
        />
      </span>
      {timestamp ? (
        <span className="whitespace-nowrap text-body-xs text-text-meta">
          {timestamp}
        </span>
      ) : null}
    </div>
  );
}

export function ChatInlineFeedback({
  tone = "positive",
  className,
  children = "Thank you for the feedback.",
  ...props
}: ChatInlineFeedbackProps) {
  const toneStyle: Record<
    ChatInlineFeedbackTone,
    { iconName: IconName; className: string }
  > = {
    positive: {
      iconName: "signal-success",
      className: "text-checked",
    },
    neutral: {
      iconName: "signal-notice",
      className: "text-text-meta",
    },
  };
  const { iconName, className: toneClassName } = toneStyle[tone];

  return (
    <div
      {...props}
      role="status"
      aria-live="polite"
      className={cx(
        "chat-message-enter inline-flex max-w-full items-center gap-xs text-body-sm",
        toneClassName,
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        name={iconName}
        size="small"
        className="shrink-0"
      />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

export function ChatFeedbackReasonChips({
  value = null,
  values,
  disabled = false,
  options = defaultFeedbackReasonOptions,
  onValueChange,
  onValuesChange,
  className,
  ...props
}: ChatFeedbackReasonChipsProps) {
  const selectedValues = values ?? (value ? [value] : []);

  function handleValueToggle(optionValue: ChatFeedbackReason) {
    const isSelected = selectedValues.includes(optionValue);
    const nextValues = isSelected
      ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
      : [...selectedValues, optionValue];

    onValueChange?.(optionValue);
    onValuesChange?.(nextValues);
  }

  return (
    <div
      {...props}
      role="group"
      aria-label="Feedback reasons"
      className={cx(
        "chat-feedback-reason-chips chat-message-enter flex max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] flex-wrap gap-xs",
        className,
      )}
    >
      {options.map((option) => {
        const checked = selectedValues.includes(option.value);

        return (
          <Pill
            key={option.value}
            checked={checked}
            disabled={disabled}
            className="chat-feedback-reason-chip"
            trailingIcon={
              <Icon name={checked ? "check" : "add"} size="small" />
            }
            onClick={() => handleValueToggle(option.value)}
          >
            {option.label}
          </Pill>
        );
      })}
    </div>
  );
}

export function ChatFeedbackReasonPanel({
  values,
  comment,
  onValuesChange,
  onCommentChange,
  onClose,
  onSubmit,
  className,
  ...props
}: ChatFeedbackReasonPanelProps) {
  const showCommentField = values.length > 0;

  return (
    <section
      {...props}
      className={cx(
        "chat-message-enter flex w-full max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] flex-col gap-xl rounded-md bg-background-neutral-soft p-xl text-text",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-lg">
        <h3 className="max-w-[18rem] text-heading-md text-text">
          What didn&apos;t you like about this response? (Optional)
        </h3>
        <GhostIconButton
          label="Close feedback"
          icon="close"
          size="medium"
          className="-mr-sm -mt-sm"
          onClick={onClose}
        />
      </div>

      <ChatFeedbackReasonChips
        values={values}
        onValuesChange={onValuesChange}
        className="max-w-none"
      />

      {showCommentField ? (
        <TextArea
          className="chat-message-enter"
          aria-label="Describe your feedback"
          placeholder="Please describe your feedback."
          size="small"
          value={comment}
          onChange={(event) => onCommentChange(event.currentTarget.value)}
        />
      ) : null}

      <Button variant="secondary" className="w-full" onClick={onSubmit}>
        Submit feedback
      </Button>
    </section>
  );
}

export function ChatEndFeedbackScreen({
  onBackToChat,
  onEndChat,
  className,
  ...props
}: ChatEndFeedbackScreenProps) {
  const [rating, setRating] = useState<ChatEndFeedbackRating | null>(null);
  const [comment, setComment] = useState("");
  const selectedRatingLabel =
    endFeedbackRatings.find((option) => option.value === rating)?.label ??
    "Select a rating";

  function handleEndChat() {
    onEndChat({ rating, comment });
  }

  function handleRatingClick(nextRating: ChatEndFeedbackRating) {
    setRating((currentRating) =>
      currentRating === nextRating ? null : nextRating,
    );
  }

  return (
    <section
      {...props}
      className={cx(
        "flex min-h-0 flex-1 flex-col bg-background text-text",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-xxl py-xxxl">
        <div className="flex w-full max-w-[336px] flex-col items-center text-center">
          <h2 className="text-heading-xl text-text">
            How satisfied are you with the chat experience?
          </h2>
          <p className="mt-lg text-body-md-open text-text-meta">
            {selectedRatingLabel}
          </p>

          <div
            role="radiogroup"
            aria-label="Rate the chat experience"
            className="mt-md flex items-center justify-center gap-md"
          >
            {endFeedbackRatings.map((option) => {
              const checked = rating === option.value;
              const filled = rating !== null && option.value <= rating;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  aria-label={
                    checked
                      ? `Remove ${option.label} rating, ${option.value} out of 5`
                      : `${option.label}, ${option.value} out of 5`
                  }
                  className={cx(
                    "inline-flex size-9 items-center justify-center rounded-xs outline-none transition-[color,transform] duration-150 ease-out hover:scale-105 focus-visible:ring-4 focus-visible:ring-action-focus-ring",
                    filled
                      ? "text-premium-brand hover:text-premium-brand active:text-premium-brand"
                      : "text-icon hover:text-icon-hover active:text-icon-active",
                  )}
                  onClick={() => handleRatingClick(option.value)}
                >
                  <Icon
                    name={filled ? "star-fill" : "star-outline"}
                    size="medium"
                  />
                </button>
              );
            })}
          </div>

          <TextArea
            aria-label="Share feedback"
            className="mt-lg"
            textareaClassName="min-h-[128px]"
            placeholder="Please share your feedback to help us improve"
            size="small"
            value={comment}
            onChange={(event) => setComment(event.currentTarget.value)}
          />

          <div className="mt-xl flex w-full flex-col-reverse gap-sm sm:flex-row sm:justify-center">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={onBackToChat}
            >
              Back to chat
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleEndChat}>
              {rating ? "Submit and end chat" : "End chat"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ChatMessageFeedbackFlow({
  timestamp,
  onSubmitFeedback,
  className,
  ...props
}: ChatMessageFeedbackFlowProps) {
  const [value, setValue] = useState<ChatMessageFeedbackValue | null>(null);
  const [reasonValues, setReasonValues] = useState<
    ReadonlyArray<ChatFeedbackReason>
  >([]);
  const [comment, setComment] = useState("");
  const [isReasonPanelOpen, setIsReasonPanelOpen] = useState(false);
  const [submittedValue, setSubmittedValue] =
    useState<ChatMessageFeedbackValue | null>(null);
  const reasonPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReasonPanelOpen) {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      reasonPanelRef.current?.scrollIntoView({
        block: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [isReasonPanelOpen]);

  function handleFeedbackValueChange(nextValue: ChatMessageFeedbackValue) {
    setValue(nextValue);
    setSubmittedValue(null);

    if (nextValue === "thumbs-up") {
      setReasonValues([]);
      setComment("");
      setIsReasonPanelOpen(false);
      setSubmittedValue("thumbs-up");
      onSubmitFeedback?.({ rating: "thumbs-up", reasons: [], comment: "" });
      return;
    }

    setIsReasonPanelOpen(true);
  }

  function handleReasonValuesChange(nextValues: ReadonlyArray<ChatFeedbackReason>) {
    setReasonValues(nextValues);

    if (nextValues.length === 0) {
      setComment("");
    }
  }

  function handleCloseReasonPanel() {
    setValue(null);
    setReasonValues([]);
    setComment("");
    setIsReasonPanelOpen(false);
    setSubmittedValue(null);
  }

  function handleSubmitReasonPanel() {
    setIsReasonPanelOpen(false);
    setSubmittedValue("thumbs-down");
    onSubmitFeedback?.({
      rating: "thumbs-down",
      reasons: reasonValues,
      comment,
    });
  }

  return (
    <div {...props} className={cx("flex flex-col items-start gap-xs", className)}>
      <ChatMessageFeedback
        value={value}
        disabled={submittedValue !== null}
        timestamp={timestamp}
        onValueChange={handleFeedbackValueChange}
      />
      {submittedValue ? <ChatInlineFeedback /> : null}
      {isReasonPanelOpen ? (
        <div ref={reasonPanelRef} className="w-full">
          <ChatFeedbackReasonPanel
            values={reasonValues}
            comment={comment}
            onValuesChange={handleReasonValuesChange}
            onCommentChange={setComment}
            onClose={handleCloseReasonPanel}
            onSubmit={handleSubmitReasonPanel}
          />
        </div>
      ) : null}
    </div>
  );
}

export function Prompt({
  prompt,
  children,
  className,
  onClick,
  onPromptSelect,
  showNativeTooltip = true,
  visualState = "default",
  type,
  title,
  "aria-label": ariaLabel,
  ...props
}: PromptProps) {
  const label = children ?? prompt;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);

    if (!event.defaultPrevented) {
      onPromptSelect?.(prompt);
    }
  }

  return (
    <button
      {...props}
      type={type ?? "button"}
      title={showNativeTooltip ? (title ?? prompt) : undefined}
      aria-label={ariaLabel ?? `Send message: ${prompt}`}
      data-visual-state={visualState}
      className={cx(
        "inline-flex min-w-0 max-w-full select-none items-center rounded-md border border-border-faint bg-background p-md text-left font-sans text-body-sm text-text outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:bg-background-transparent-hover hover:shadow-[inset_0_0_0_1px_var(--color-border-faint)] active:bg-background-transparent-active focus-visible:ring-4 focus-visible:ring-neutral-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-background-disabled disabled:text-text-disabled md:max-w-[var(--design-layout-panel-collapsed-width)]",
        visualState !== "default" && promptStateClasses[visualState],
        className,
      )}
      onClick={handleClick}
    >
      <span className="min-w-0 flex-1 whitespace-normal break-words">
        {label}
      </span>
    </button>
  );
}

export function RecommendationCard({
  title = "Speak with a sales consultant",
  description,
  primaryAction = "Chat live now",
  secondaryAction,
  className,
  ...props
}: RecommendationCardProps) {
  return (
    <article
      {...props}
      className={cx(
        "chat-recommendation-enter flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background py-xl pl-xl pr-md",
        className,
      )}
    >
      <div className="space-y-xs">
        <p className="text-heading-md text-text">{title}</p>
        {description ? (
          <p className="text-body-sm-open text-text-meta">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-sm">
        <Button size="small" className="px-pill-padding-inline">
          {primaryAction}
        </Button>
        {secondaryAction ? (
          <Button
            size="small"
            variant="secondary"
            className="px-pill-padding-inline"
          >
            {secondaryAction}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function ChatComposer({
  variant = "collapsed",
  className,
  inputProps,
  onSend,
  onStopResponse,
  onVoiceInterrupt,
  onVoiceListen,
  onVoiceModeExit,
  onVoiceModeStart,
  sendDisabled = false,
  sendLoading = false,
  isResponding = false,
  showAttachAction = true,
  attachTooltip = ATTACH_TOOLTIP,
  showTopDivider = false,
  showVoiceMode = true,
  voiceModeActive = false,
  voiceState = "idle",
  voiceTranscript = "",
  ...props
}: ChatComposerProps) {
  const composerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const actionControlsRef = useRef<HTMLDivElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);
  const [composerSurfaceHeight, setComposerSurfaceHeight] = useState<
    number | null
  >(null);
  const isTextareaControlled = inputProps?.value !== undefined;
  const [uncontrolledComposerText, setUncontrolledComposerText] = useState(
    () => getTextareaValueText(inputProps?.defaultValue),
  );
  const composerText = isTextareaControlled
    ? getTextareaValueText(inputProps?.value)
    : uncontrolledComposerText;
  const hasComposerText = composerText.trim().length > 0;
  const isSendDisabled = sendDisabled || inputProps?.disabled || sendLoading;
  const canSend = hasComposerText && !isSendDisabled;
  const shouldShowSendButton = !showVoiceMode || hasComposerText || sendLoading;
  const voiceStatusLabel = getVoiceStatusLabel(voiceState);
  const voiceActionLabel = getVoiceActionLabel(voiceState);

  const getComposerContentWidth = useCallback(
    (textarea: HTMLTextAreaElement) => {
      const composer = composerRef.current;

      if (!composer) {
        return textarea.clientWidth;
      }

      const styles = getComputedStyle(composer);

      return Math.max(
        0,
        composer.clientWidth -
          Number.parseFloat(styles.paddingLeft) -
          Number.parseFloat(styles.paddingRight),
      );
    },
    [],
  );

  const getSingleLineTextareaWidth = useCallback(
    (textarea: HTMLTextAreaElement) => {
      const contentWidth = getComposerContentWidth(textarea);
      const attachActionWidth = showAttachAction
        ? readPixelValue(textarea, "--design-layout-compact-action-height")
        : 0;
      const actionsWidth =
        actionControlsRef.current?.getBoundingClientRect().width ?? 0;
      const singleLineGap = readPixelValue(textarea, "--design-spacing-sm");
      const gapCount = Number(showAttachAction) + Number(actionsWidth > 0);

      return Math.max(
        0,
        contentWidth -
          attachActionWidth -
          actionsWidth -
          singleLineGap * gapCount,
      );
    },
    [getComposerContentWidth, showAttachAction],
  );

  const resizeTextarea = useCallback(
    (textarea: HTMLTextAreaElement) => {
      const composerHeight =
        readPixelValue(textarea, "--design-layout-composer-height") || 56;

      if (textarea.value.length === 0) {
        textarea.style.height = `${COMPOSER_TEXTAREA_EMPTY_HEIGHT}px`;
        setIsMultiline(false);
        setComposerSurfaceHeight(composerHeight);
        return;
      }

      const maxHeight =
        Number.parseInt(
          getComputedStyle(textarea).getPropertyValue(
            "--design-layout-composer-input-max-height",
          ),
          10,
        ) || 144;

      const singleLineWidth = getSingleLineTextareaWidth(textarea);
      const contentWidth = getComposerContentWidth(textarea);
      const singleLineHeight = measureTextareaHeight(
        textarea,
        singleLineWidth,
        maxHeight,
      );
      const nextIsMultiline = singleLineHeight > COMPOSER_SINGLE_LINE_HEIGHT;
      const nextHeight = measureTextareaHeight(
        textarea,
        nextIsMultiline ? contentWidth : singleLineWidth,
        maxHeight,
      );
      const composer = composerRef.current;
      const composerStyles = composer ? getComputedStyle(composer) : null;
      const compactActionHeight = readPixelValue(
        textarea,
        "--design-layout-compact-action-height",
      );
      const multilineGap = readPixelValue(textarea, "--design-spacing-sm");
      const multilineBlockPadding = multilineGap * 2;
      const composerBorder =
        Number.parseFloat(composerStyles?.borderTopWidth ?? "") +
          Number.parseFloat(composerStyles?.borderBottomWidth ?? "") || 2;
      const nextComposerSurfaceHeight = nextIsMultiline
        ? nextHeight +
          compactActionHeight +
          multilineGap +
          multilineBlockPadding +
          composerBorder
        : composerHeight;

      textarea.style.height = `${nextHeight}px`;
      setIsMultiline(nextIsMultiline);
      setComposerSurfaceHeight(nextComposerSurfaceHeight);
    },
    [getComposerContentWidth, getSingleLineTextareaWidth],
  );

  function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    resizeTextarea(event.currentTarget);

    if (!isTextareaControlled) {
      setUncontrolledComposerText(event.currentTarget.value);
    }

    inputProps?.onChange?.(event);
  }

  function handleTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    inputProps?.onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    if (canSend) {
      onSend?.();
    }
  }

  useLayoutEffect(() => {
    if (textareaRef.current) {
      resizeTextarea(textareaRef.current);
    }
  }, [
    inputProps?.defaultValue,
    inputProps?.value,
    resizeTextarea,
    sendLoading,
    showVoiceMode,
    voiceModeActive,
  ]);

  return (
    <div
      {...props}
      data-chat-variant={variant}
      className={cx(
        "flex min-h-[var(--design-layout-composer-height)] shrink-0 border-t px-xxl pb-[calc(var(--design-spacing-xxl)+env(safe-area-inset-bottom))] pt-lg transition-colors duration-150 ease-out md:px-xxl md:pb-xxl md:pt-lg",
        voiceModeActive
          ? "flex-col items-center justify-end gap-sm"
          : "items-end justify-center",
        showTopDivider ? "border-border-faint" : "border-transparent",
        className,
      )}
    >
      {isResponding && !voiceModeActive ? (
        <button
          type="button"
          className="grid h-[var(--design-layout-composer-height)] w-full max-w-[var(--design-layout-panel-content-max)] cursor-pointer grid-cols-1 items-center justify-items-end rounded-round border border-border-subtle bg-background px-md py-xs text-left shadow-raised-faint outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-subtle-hover focus-visible:border-border-subtle-active focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          onClick={onStopResponse}
        >
          <span className="inline-flex h-[var(--design-layout-composer-stop-action-height)] items-center gap-xs rounded-round pl-sm pr-0 text-body-sm-open text-text-meta">
            <span>Stop answering</span>
            <StopAnsweringIcon />
          </span>
        </button>
      ) : (
        <>
          {voiceModeActive ? (
            <div className="flex w-full max-w-[var(--design-layout-panel-content-max)] items-center gap-sm rounded-sm border border-[color-mix(in_srgb,var(--color-caution)_34%,transparent)] bg-[color-mix(in_srgb,var(--figma-color-caution-color-background-caution-soft)_82%,white)] px-md py-sm text-body-sm-open font-medium text-caution shadow-raised-faint">
              <Icon
                name="signal-caution"
                size="small"
                className="shrink-0"
              />
              <span>This is WIP (dont build)</span>
            </div>
          ) : null}
          <div
            ref={composerRef}
            style={
              voiceModeActive
                ? undefined
                : ({
                    height:
                      composerSurfaceHeight === null
                        ? "var(--design-layout-composer-height)"
                        : `${composerSurfaceHeight}px`,
                  } as CSSProperties)
            }
            className={cx(
              "relative grid w-full max-w-[var(--design-layout-panel-content-max)] border border-border-subtle bg-background px-md shadow-raised-faint transition-[height,border-color,box-shadow] duration-150 ease-out hover:border-border-subtle-hover focus-within:border-border-subtle-active",
              voiceModeActive
                ? "min-h-[112px] grid-cols-1 gap-sm rounded-md py-sm"
                : isMultiline
                  ? "grid-cols-1 gap-sm rounded-md py-sm"
                  : cx(
                      "items-center gap-sm rounded-round py-xs",
                      showAttachAction
                        ? "grid-cols-[auto_minmax(0,1fr)_auto]"
                        : "grid-cols-[minmax(0,1fr)_auto]",
                    ),
            )}
          >
            {voiceModeActive ? (
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-md">
                  <button
                    type="button"
                    aria-label={voiceActionLabel}
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-round outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
                    onClick={() => {
                      if (voiceState === "speaking") {
                        onVoiceInterrupt?.();
                        return;
                      }

                      onVoiceListen?.();
                    }}
                  >
                    <VoiceWaveform state={voiceState} />
                  </button>
                  <div className="min-w-0">
                    <p className="text-body-xs text-text-meta">
                      {voiceStatusLabel}
                    </p>
                    <p
                      aria-live={voiceState === "listening" ? "polite" : "off"}
                      className={cx(
                        "mt-xxs min-h-[20px] break-words text-body-sm-open text-text",
                        voiceTranscript.trim().length === 0 &&
                          "text-text-disabled",
                      )}
                    >
                      {voiceTranscript.trim().length > 0
                        ? voiceTranscript
                        : voiceState === "idle"
                          ? "Ready when you are."
                          : " "}
                    </p>
                  </div>
                  <div className="flex items-center gap-xs">
                    {voiceState === "speaking" ? (
                      <button
                        type="button"
                        className="inline-flex h-8 shrink-0 items-center rounded-round px-sm text-body-xs text-action outline-none transition-[background-color,color] duration-150 ease-out hover:bg-action-background-transparent-hover hover:text-action-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
                        onClick={onVoiceInterrupt}
                      >
                        Tap to interrupt
                      </button>
                    ) : null}
                    <GhostIconButton
                      label="Exit voice mode"
                      icon="close"
                      size="small"
                      touchTarget={false}
                      onClick={onVoiceModeExit}
                    />
                  </div>
                </div>
            ) : null}
            {showAttachAction && !isMultiline && !voiceModeActive ? (
              <div className="flex shrink-0 items-center">
                <ComposerAttachButton tooltip={attachTooltip} />
              </div>
            ) : null}
            <textarea
              {...inputProps}
              ref={textareaRef}
              rows={1}
              aria-label={inputProps?.["aria-label"] ?? "Message"}
              placeholder={inputProps?.placeholder ?? "Send a message"}
              onChange={handleTextareaChange}
              onKeyDown={handleTextareaKeyDown}
              className={cx(
                "min-w-0 resize-none bg-transparent text-body-sm-open text-text outline-none placeholder:text-text-disabled",
                "max-h-[var(--design-layout-composer-input-max-height)]",
                (!showAttachAction || voiceModeActive) && "pl-xs",
                isMultiline || voiceModeActive
                  ? "w-full overflow-y-auto"
                  : "overflow-hidden",
              )}
            />
            <div
              className={cx(
                "flex shrink-0 items-center gap-sm",
                (isMultiline || voiceModeActive) &&
                  (!voiceModeActive && showAttachAction
                    ? "w-full justify-between justify-self-stretch"
                    : "w-full justify-end justify-self-stretch"),
              )}
            >
              {isMultiline && showAttachAction && !voiceModeActive ? (
                <ComposerAttachButton tooltip={attachTooltip} />
              ) : null}
              <div
                ref={actionControlsRef}
                className="flex shrink-0 items-center gap-sm"
              >
                {shouldShowSendButton ? (
                  <ButtonIcon
                    label="Send message"
                    icon="arrow-up"
                    size="small"
                    touchTarget={false}
                    disabled={isSendDisabled}
                    loading={sendLoading}
                    onClick={onSend}
                  />
                ) : !voiceModeActive && showVoiceMode ? (
                  <VoiceModeButton onClick={onVoiceModeStart} />
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ChatPanelPreview({
  variant = "collapsed",
  className,
  title,
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  dockActionPosition,
  showCloseAction = true,
  showMinimizeToTrayAction = false,
}: {
  variant?: ChatPanelVariant;
  className?: string;
  title?: string;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  dockActionPosition?: "before-variant" | "after-variant";
  showCloseAction?: boolean;
  showMinimizeToTrayAction?: boolean;
}) {
  const minimizeToTrayHandler = onMinimizeToTray
    ? onMinimizeToTray
    : showMinimizeToTrayAction
      ? () => {}
      : undefined;

  return (
    <ChatPanel variant={variant} className={className}>
      <ChatHeader
        variant={variant}
        title={title}
        onClose={onClose}
        dockActionPosition={dockActionPosition}
        onMinimizeToTray={minimizeToTrayHandler}
        onVariantToggle={onVariantToggle}
        showCloseAction={showCloseAction}
      />
      <ChatBody>
        <ChatThread>
          <ChatMessage>I can help compare hiring options quickly.</ChatMessage>
          <div className="flex flex-wrap gap-sm">
            <Prompt prompt="We need to ramp hiring fast this quarter." />
            <Prompt prompt="Help me compare Recruiter and Hiring Pro." />
          </div>
          <ChatMessage role="user">
            We need to ramp hiring fast this quarter.
          </ChatMessage>
          <ChatMessage>A sales consultant can narrow the setup fast.</ChatMessage>
          <ChatMessage role="user">
            We want the fastest path to launch.
          </ChatMessage>
          <ChatMessage>{`Here's the quickest next step.`}</ChatMessage>
          <RecommendationCard />
        </ChatThread>
      </ChatBody>
      <ChatComposer variant={variant} />
    </ChatPanel>
  );
}
