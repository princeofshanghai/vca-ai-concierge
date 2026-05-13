"use client";

import {
  type ButtonHTMLAttributes,
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
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import { Pill } from "@/components/primitives/pill";
import { TextArea } from "@/components/primitives/text-area";

export type ChatPanelVariant = "collapsed" | "expanded";
export type ChatPanelSurface = "default" | "welcome";
export type ChatMessageRole = "assistant" | "user" | "representative";
export type ChatHeaderIdentity =
  | {
      type: "ai";
      title?: ReactNode;
    }
  | {
      type: "representative";
      name: string;
      role: string;
      avatarSrc?: string;
      avatarLabel?: string;
    };

type ChatPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: ChatPanelVariant;
  surface?: ChatPanelSurface;
};

type ChatTrayProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  identity?: ChatHeaderIdentity | null;
  title?: ReactNode;
  badge?: boolean;
  badgeLabel?: string;
};

type ChatHeaderProps = HTMLAttributes<HTMLElement> & {
  variant?: ChatPanelVariant;
  identity?: ChatHeaderIdentity | null;
  title?: ReactNode;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
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
  sendDisabled?: boolean;
  sendLoading?: boolean;
  showTopDivider?: boolean;
  showVoiceMode?: boolean;
};

type ChatThreadProps = HTMLAttributes<HTMLDivElement> & {
  timestamp?: string | null;
};

type ChatMessageProps = HTMLAttributes<HTMLDivElement> & {
  role?: ChatMessageRole;
  authorName?: string;
  avatarLabel?: string;
  avatarSrc?: string;
  timestamp?: string;
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
  visualState?: PromptVisualState;
};

type RecommendationCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  description?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
};

export type ChatMessageFeedbackValue = "thumbs-up" | "thumbs-down";

type ChatInlineFeedbackTone = "positive";

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

type ChatMessageFeedbackFlowProps = HTMLAttributes<HTMLDivElement> & {
  timestamp?: string;
  onSubmitFeedback?: (submission: ChatFeedbackSubmission) => void;
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

const panelWidthClasses: Record<ChatPanelVariant, string> = {
  collapsed:
    "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-collapsed-max)] md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-collapsed-height))] md:w-[min(100%,var(--design-layout-panel-collapsed-width))] md:rounded-md",
  expanded:
    "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-expanded-max)] md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(100%,var(--design-layout-panel-expanded-width))] md:rounded-md",
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
  hover: "bg-background-transparent-hover",
  active: "bg-background-transparent-active",
  "focus-visible": "ring-4 ring-neutral-focus-ring",
};

const COMPOSER_SINGLE_LINE_HEIGHT = 28;
const COMPOSER_TEXTAREA_EMPTY_HEIGHT = 21;
const VOICE_MODE_TOOLTIP = "Voice mode is WIP in this prototype.";

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
        "h-[var(--design-layout-mobile-panel-height)] w-[var(--design-layout-mobile-panel-width)] max-w-full rounded-none text-text shadow-raised transition-[width,height,border-radius] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none",
        panelWidthClasses[variant],
        className,
      )}
    >
      <div
        className={cx(
          "relative flex h-full flex-col overflow-hidden rounded-[inherit] border border-border-faint pt-[env(safe-area-inset-top)] transition-[background-color] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:pt-0",
          surface === "welcome"
            ? "bg-gradient-to-b from-background to-surface-tint"
            : "bg-background",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function ChatTray({
  identity,
  title = "Contact sales",
  badge = false,
  badgeLabel = "New activity",
  className,
  type,
  ...props
}: ChatTrayProps) {
  return (
    <button
      {...props}
      type={type ?? "button"}
      className={cx(
        "group inline-flex min-h-16 w-[min(100%,var(--design-layout-panel-collapsed-width))] items-center gap-md rounded-t-md rounded-b-none border border-b-0 border-border-faint bg-background px-xl py-md text-left text-text shadow-[0_-4px_16px_rgba(0,0,0,0.18),0_0_1px_rgba(140,140,140,0.2)] outline-none transition-[background-color,border-color,box-shadow] duration-[var(--design-motion-duration-fast)] ease-standard hover:border-border-hover hover:bg-background focus-visible:ring-4 focus-visible:ring-action-focus-ring motion-reduce:transition-none",
        className,
      )}
    >
      {identity?.type === "representative" ? (
        <span className="flex min-w-0 flex-1 items-center gap-sm">
          <Entity
            size={32}
            src={identity.avatarSrc}
            label={
              identity.avatarLabel ?? `${identity.name}, ${identity.role}`
            }
          />
          <span className="flex min-w-0 flex-col gap-0">
            <span className="min-w-0 truncate text-body-md font-semibold text-text">
              {identity.name}
            </span>
            <span className="min-w-0 truncate text-body-xs text-text-meta">
              {identity.role}
            </span>
          </span>
        </span>
      ) : (
        <>
          <span className="relative inline-flex size-6 shrink-0 items-center justify-center text-ai-icon">
            <Icon name="signal-ai" size="medium" />
            {badge ? (
              <span
                role="status"
                aria-label={badgeLabel}
                className="absolute -right-xxs -top-xxs size-[10px] rounded-round border-2 border-background bg-action"
              />
            ) : null}
          </span>
          <span className="min-w-0 flex-1 truncate text-heading-lg text-text">
            {identity?.type === "ai" ? (identity.title ?? title) : title}
          </span>
        </>
      )}
      <span
        aria-hidden="true"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-round text-icon transition-colors duration-150 ease-out group-hover:bg-background-transparent-hover"
      >
        <Icon name="chevron-up" size="small" />
      </span>
    </button>
  );
}

function VoiceModePlaceholderButton() {
  return (
    <span className="group relative inline-flex shrink-0">
      <span
        role="button"
        aria-disabled="true"
        aria-label={VOICE_MODE_TOOLTIP}
        className="inline-flex size-[var(--design-layout-compact-action-height)] shrink-0 select-none items-center justify-center rounded-full bg-transparent font-sans outline-none"
      >
        <span className="inline-flex size-[var(--design-layout-compact-action-height)] shrink-0 items-center justify-center rounded-round border border-transparent bg-action text-on-action transition-[background-color] duration-150 ease-out group-hover:bg-action-hover">
          <Icon name="audio-lines" size="small" />
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

export function ChatHeader({
  variant = "collapsed",
  identity,
  title,
  className,
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  transparent = false,
  showAiMark = true,
  aiMarkClassName,
  ...props
}: ChatHeaderProps) {
  const headerIdentity =
    identity ?? (showAiMark ? ({ type: "ai", title } as const) : null);

  return (
    <header
      {...props}
      className={cx(
        "flex h-[var(--design-layout-panel-header-height)] shrink-0 items-center justify-between pl-[calc(var(--design-spacing-xxl)+env(safe-area-inset-left))] pr-[calc(var(--design-spacing-lg)+env(safe-area-inset-right))] transition-[background-color,border-color] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:pl-xxl md:pr-lg",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border-faint bg-background",
        className,
      )}
    >
      {headerIdentity?.type === "ai" ? (
        <div className="flex min-w-0 items-center gap-sm">
          <Icon
            name="signal-ai"
            size="medium"
            label="AI Concierge"
            className={cx("shrink-0 text-ai-icon", aiMarkClassName)}
          />
          {headerIdentity.title ? (
            <span className="min-w-0 truncate text-heading-lg text-text">
              {headerIdentity.title}
            </span>
          ) : null}
        </div>
      ) : headerIdentity?.type === "representative" ? (
        <div className="flex min-w-0 items-center gap-sm">
          <Entity
            size={32}
            src={headerIdentity.avatarSrc}
            label={
              headerIdentity.avatarLabel ??
              `${headerIdentity.name}, ${headerIdentity.role}`
            }
          />
          <div className="flex min-w-0 flex-col gap-0">
            <span className="min-w-0 truncate text-body-md font-semibold text-text">
              {headerIdentity.name}
            </span>
            <span className="min-w-0 truncate text-body-xs text-text-meta">
              {headerIdentity.role}
            </span>
          </div>
        </div>
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="flex items-center gap-0">
        <span className="hidden md:inline-flex">
          <GhostIconButton
            label={headerActionLabel[variant]}
            icon={headerActionIcon[variant]}
            size="medium"
            onClick={onVariantToggle}
          />
        </span>
        {onMinimizeToTray ? (
          <GhostIconButton
            label="Minimize chat to tray"
            icon="chevron-down"
            size="medium"
            onClick={onMinimizeToTray}
          />
        ) : (
          <GhostIconButton
            label="Close chat"
            icon="close"
            size="medium"
            onClick={onClose}
          />
        )}
      </div>
    </header>
  );
}

export function ChatThread({
  timestamp = "Today",
  className,
  children,
  ...props
}: ChatThreadProps) {
  return (
    <div
      {...props}
      className={cx(
        "flex w-full max-w-[var(--design-layout-panel-content-max)] flex-col gap-0 px-xxl",
        className,
      )}
    >
      {timestamp ? (
        <p className="pb-sm pt-xl text-center text-body-xs text-text-meta">
          {timestamp}
        </p>
      ) : null}
      <div className="flex flex-col gap-0">{children}</div>
    </div>
  );
}

export const ChatBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function ChatBody({ className, children, ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={cx(
          "flex min-h-0 flex-1 justify-center overflow-y-auto",
          className,
        )}
      >
        {children}
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
        "chat-message-enter flex w-full py-lg",
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

export function ChatMessage({
  role = "assistant",
  authorName,
  avatarLabel,
  avatarSrc,
  timestamp,
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
      className={cx(
        "chat-message-enter flex w-full",
        isUser && "justify-end",
        "py-lg",
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
              "w-fit max-w-[min(100%,24.5rem)] rounded-bl-md rounded-tl-md rounded-tr-md bg-ai-background-soft p-xl",
            isRepresentative &&
              "w-fit max-w-[min(100%,24.5rem)] rounded-br-md rounded-tl-md rounded-tr-md bg-background-neutral-soft p-xl",
            !isUser &&
              !isRepresentative &&
              "max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] pr-sm",
          )}
        >
          {children}
        </div>
        {hasRepresentativeMeta ? (
          <div className="flex items-center gap-sm text-body-xs text-text-meta">
            <Entity
              size={24}
              src={avatarSrc}
              label={avatarLabel ?? authorName ?? "Human representative"}
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
  const iconName = tone === "positive" ? "signal-success" : "signal-success";

  return (
    <div
      {...props}
      role="status"
      aria-live="polite"
      className={cx(
        "chat-message-enter inline-flex max-w-full items-center gap-xs text-body-sm text-checked",
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
        "chat-feedback-reason-chips chat-message-enter flex max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] flex-wrap gap-x-sm gap-y-xs",
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
      title={title ?? prompt}
      aria-label={ariaLabel ?? `Send message: ${prompt}`}
      data-visual-state={visualState}
      className={cx(
        "inline-flex max-w-full shrink-0 select-none items-center rounded-md border border-border-faint bg-background p-md text-left font-sans text-body-sm text-text outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:bg-background-transparent-hover active:bg-background-transparent-active focus-visible:ring-4 focus-visible:ring-neutral-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-background-disabled disabled:text-text-disabled md:max-w-[var(--design-layout-panel-collapsed-width)]",
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
  sendDisabled = false,
  sendLoading = false,
  showTopDivider = false,
  showVoiceMode = true,
  ...props
}: ChatComposerProps) {
  const composerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);
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
      const actionsWidth =
        actionsRef.current?.getBoundingClientRect().width ?? 0;
      const singleLineGap = readPixelValue(textarea, "--design-spacing-xs");

      return Math.max(0, contentWidth - actionsWidth - singleLineGap);
    },
    [getComposerContentWidth],
  );

  const resizeTextarea = useCallback(
    (textarea: HTMLTextAreaElement) => {
      if (textarea.value.length === 0) {
        textarea.style.height = `${COMPOSER_TEXTAREA_EMPTY_HEIGHT}px`;
        setIsMultiline(false);
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

      textarea.style.height = `${nextHeight}px`;
      setIsMultiline(nextIsMultiline);
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
  }, [inputProps?.defaultValue, inputProps?.value, resizeTextarea]);

  return (
    <div
      {...props}
      data-chat-variant={variant}
      className={cx(
        "flex min-h-[var(--design-layout-composer-height)] shrink-0 items-end justify-center border-t px-xxl pb-[calc(var(--design-spacing-xxl)+env(safe-area-inset-bottom))] pt-lg transition-colors duration-150 ease-out md:px-xxl md:pb-xxl md:pt-lg",
        showTopDivider ? "border-border-faint" : "border-transparent",
        className,
      )}
    >
      <div
        ref={composerRef}
        className={cx(
          "grid w-full max-w-[var(--design-layout-panel-content-max)] border border-border-faint bg-background pl-lg pr-md transition-[border-color,border-radius,padding] duration-150 ease-out hover:border-border-hover focus-within:border-border-hover",
          isMultiline
            ? "grid grid-cols-1 gap-sm rounded-md py-[10px]"
            : "h-[var(--design-layout-composer-height)] grid-cols-[minmax(0,1fr)_auto] items-center gap-sm rounded-round py-xs",
        )}
      >
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
            isMultiline ? "w-full overflow-y-auto" : "overflow-hidden",
          )}
        />
        <div
          ref={actionsRef}
          className={cx(
            "flex shrink-0 items-center gap-sm",
            isMultiline && "justify-end justify-self-end",
          )}
        >
          {showVoiceMode ? (
            <GhostIconButton
              label="Use microphone"
              icon="microphone-fill"
              size="small"
              touchTarget={false}
            />
          ) : null}
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
          ) : showVoiceMode ? (
            <VoiceModePlaceholderButton />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ChatPanelPreview({
  variant = "collapsed",
  className,
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  showMinimizeToTrayAction = false,
}: {
  variant?: ChatPanelVariant;
  className?: string;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
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
        onClose={onClose}
        onMinimizeToTray={minimizeToTrayHandler}
        onVariantToggle={onVariantToggle}
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
