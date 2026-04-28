"use client";

import {
  type ButtonHTMLAttributes,
  forwardRef,
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

export type ChatPanelVariant = "collapsed" | "expanded";
export type ChatPanelSurface = "default" | "welcome";
export type ChatMessageRole = "assistant" | "user" | "representative";

type ChatPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: ChatPanelVariant;
  surface?: ChatPanelSurface;
};

type ChatHeaderProps = HTMLAttributes<HTMLElement> & {
  variant?: ChatPanelVariant;
  onClose?: () => void;
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

const panelWidthClasses: Record<ChatPanelVariant, string> = {
  collapsed:
    "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-collapsed-max)] md:w-[min(100%,var(--design-layout-panel-collapsed-width))] md:rounded-lg",
  expanded:
    "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-expanded-max)] md:w-[min(100%,var(--design-layout-panel-expanded-width))] md:rounded-xl",
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
const COMPOSER_TEXTAREA_EMPTY_HEIGHT = 24;
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
        "h-[var(--design-layout-mobile-panel-height)] w-[var(--design-layout-mobile-panel-width)] max-w-full rounded-none text-text shadow-raised transition-[width,border-radius] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:h-[var(--design-layout-panel-height)]",
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
  className,
  onClose,
  onVariantToggle,
  transparent = false,
  showAiMark = true,
  aiMarkClassName,
  ...props
}: ChatHeaderProps) {
  return (
    <header
      {...props}
      className={cx(
        "flex h-[var(--design-layout-panel-header-height)] shrink-0 items-center justify-between pl-[calc(var(--design-spacing-lg)+env(safe-area-inset-left))] pr-[calc(var(--design-spacing-md)+env(safe-area-inset-right))] transition-[background-color,border-color] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:pl-xl md:pr-md",
        transparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border-faint bg-background",
        className,
      )}
    >
      {showAiMark ? (
        <Icon
          name="signal-ai"
          size="medium"
          label="AI Concierge"
          className={cx("text-ai-icon", aiMarkClassName)}
        />
      ) : (
        <span aria-hidden="true" />
      )}
      <div className="flex items-center gap-0 [--design-layout-ghost-icon-button-medium-width:40px]">
        <span className="hidden md:inline-flex">
          <GhostIconButton
            label={headerActionLabel[variant]}
            icon={headerActionIcon[variant]}
            size="medium"
            onClick={onVariantToggle}
          />
        </span>
        <GhostIconButton
          label="Close chat"
          icon="close"
          size="medium"
          onClick={onClose}
        />
      </div>
    </header>
  );
}

export function ChatThread({
  timestamp = "Today 1:00 PM",
  className,
  children,
  ...props
}: ChatThreadProps) {
  return (
    <div
      {...props}
      className={cx(
        "flex w-full max-w-[var(--design-layout-panel-content-max)] flex-col gap-xl",
        className,
      )}
    >
      {timestamp ? (
        <p className="text-center text-body-xs text-text-meta">{timestamp}</p>
      ) : null}
      <div className="flex flex-col gap-lg">{children}</div>
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
          "flex min-h-0 flex-1 justify-center overflow-y-auto px-lg py-panel-padding md:p-panel-padding",
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

  return (
    <div
      {...props}
      className={cx(
        "chat-message-enter flex w-full",
        isUser && "justify-end",
        className,
      )}
    >
      <div
        className={cx(
          hasRepresentativeMeta && "flex max-w-full flex-col gap-md",
        )}
      >
        <div
          className={cx(
            "break-words text-body-sm-open text-text",
            isUser &&
              "w-fit max-w-[min(100%,27.5rem)] rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-ai-background-soft px-xxl py-panel-padding",
            isRepresentative &&
              "w-fit max-w-[min(100%,27.5rem)] rounded-br-lg rounded-tl-lg rounded-tr-lg bg-background-neutral-soft px-xxl py-panel-padding",
            !isUser &&
              !isRepresentative &&
              "max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] pr-sm",
          )}
        >
          {children}
        </div>
        {hasRepresentativeMeta ? (
          <div className="flex items-center gap-md text-body-xs text-text-meta">
            <Entity
              size={24}
              src={avatarSrc}
              label={avatarLabel ?? authorName ?? "Hiring specialist"}
            />
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-xs">
              {authorName ? <span>{authorName}</span> : null}
              {timestamp ? <span>{timestamp}</span> : null}
            </div>
          </div>
        ) : null}
      </div>
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
        "inline-flex max-w-full shrink-0 select-none items-center rounded-md border border-border-faint bg-background p-md text-left font-sans text-body-sm text-text outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:bg-background-transparent-hover active:bg-background-transparent-active focus-visible:ring-4 focus-visible:ring-neutral-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:bg-background-disabled disabled:text-text-disabled md:max-w-[301px]",
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
  title = "Talk to a hiring specialist",
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
        "flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background py-xl pl-xl pr-md",
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
      className={cx(
        "flex min-h-[var(--design-layout-composer-height)] shrink-0 items-end justify-center px-lg pb-[calc(var(--design-spacing-lg)+env(safe-area-inset-bottom))] md:px-panel-padding md:pb-panel-padding",
        className,
      )}
    >
      <div
        ref={composerRef}
        className={cx(
          "grid w-full border border-border-faint bg-background pl-lg pr-md transition-[border-color,border-radius,padding] duration-150 ease-out hover:border-border-hover focus-within:border-border-hover",
          isMultiline
            ? "grid grid-cols-1 gap-sm rounded-[28px] py-[10px]"
            : "h-[var(--design-layout-composer-height)] grid-cols-[minmax(0,1fr)_auto] items-center gap-xs rounded-round py-0",
          variant === "expanded" &&
            "max-w-[var(--design-layout-panel-content-max)]",
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
            "min-w-0 resize-none bg-transparent text-body-md-open text-text outline-none placeholder:text-text-disabled",
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
  onVariantToggle,
}: {
  variant?: ChatPanelVariant;
  className?: string;
  onClose?: () => void;
  onVariantToggle?: () => void;
}) {
  return (
    <ChatPanel variant={variant} className={className}>
      <ChatHeader
        variant={variant}
        onClose={onClose}
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
          <ChatMessage>A specialist can narrow the setup fast.</ChatMessage>
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
