"use client";

import {
  useEffect,
  useRef,
  useState,
  type Ref,
  type ReactNode,
  type UIEvent,
  type UIEventHandler,
} from "react";

import { Icon } from "@/components/primitives/icon";

import { ChatBody, type ChatPanelVariant } from "./chat-ui";

export type ChatSidePanelInitialScrollPosition = "top" | "footer";

export type ChatSidePanelLayoutProps = Readonly<{
  chatBodyRef?: Ref<HTMLDivElement>;
  chatBodyClassName?: string;
  history: ReactNode;
  onChatBodyScroll?: UIEventHandler<HTMLDivElement>;
  onJumpToLatest?: () => void;
  sidePanel: ReactNode;
  showJumpToLatest?: boolean;
  variant?: ChatPanelVariant;
  className?: string;
}>;

export type ChatSidePanelProps = Readonly<{
  children: ReactNode;
  onBack: () => void;
  backLabel?: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  initialScrollPosition?: ChatSidePanelInitialScrollPosition;
  className?: string;
  contentClassName?: string;
  footerClassName?: string;
}>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ChatSidePanelLayout({
  chatBodyRef,
  chatBodyClassName,
  className,
  history,
  onChatBodyScroll,
  onJumpToLatest,
  sidePanel,
  showJumpToLatest,
  variant = "collapsed",
}: ChatSidePanelLayoutProps) {
  return (
    <div
      data-chat-variant={variant}
      className={cx("chat-side-panel-layout min-h-0 flex-1", className)}
    >
      <div className="hidden min-h-0 min-w-0 border-r border-border-faint md:flex">
        <ChatBody
          ref={chatBodyRef}
          onScroll={onChatBodyScroll}
          onJumpToLatest={onJumpToLatest}
          showJumpToLatest={showJumpToLatest}
          className={cx(
            "chat-side-panel-history",
            variant === "collapsed" &&
              "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-collapsed-max)]",
            chatBodyClassName,
          )}
        >
          {history}
        </ChatBody>
      </div>
      {sidePanel}
    </div>
  );
}

export function ChatSidePanel({
  children,
  onBack,
  backLabel = "Back to chat",
  headerActions,
  footer,
  initialScrollPosition = "top",
  className,
  contentClassName,
  footerClassName,
}: ChatSidePanelProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (initialScrollPosition !== "footer") {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      const panel = scrollRef.current;

      if (!panel) {
        return;
      }

      panel.scrollTop = panel.scrollHeight;
      setHasScrolled(panel.scrollTop > 0);
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [initialScrollPosition]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const nextHasScrolled = event.currentTarget.scrollTop > 0;

    setHasScrolled((currentHasScrolled) =>
      currentHasScrolled === nextHasScrolled
        ? currentHasScrolled
        : nextHasScrolled,
    );
  }

  return (
    <aside
      className={cx(
        "flex h-full min-h-0 min-w-0 flex-col bg-background-neutral-soft",
        className,
      )}
    >
      <div
        className={cx(
          "chat-side-panel-x flex h-16 shrink-0 items-center justify-between gap-md border-b bg-background-neutral-soft transition-colors duration-150 ease-out",
          hasScrolled ? "border-border-faint" : "border-transparent",
        )}
      >
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[48px] items-center gap-sm rounded-xs text-control-sm text-text-meta outline-none transition-colors duration-150 ease-out hover:text-text focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
        >
          <Icon name="arrow-left" size="small" />
          <span>{backLabel}</span>
        </button>
        {headerActions ? (
          <div className="flex shrink-0 items-center gap-xs">
            {headerActions}
          </div>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="chat-side-panel-x min-h-0 flex-1 overflow-y-auto pb-[48px]"
      >
        <div className={contentClassName}>{children}</div>
        {footer ? <div className={footerClassName}>{footer}</div> : null}
      </div>
    </aside>
  );
}
