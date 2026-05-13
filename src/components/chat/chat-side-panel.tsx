"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from "react";

import { Icon } from "@/components/primitives/icon";

export type ChatSidePanelInitialScrollPosition = "top" | "footer";

export type ChatSidePanelProps = Readonly<{
  children: ReactNode;
  onBack: () => void;
  backLabel?: ReactNode;
  footer?: ReactNode;
  initialScrollPosition?: ChatSidePanelInitialScrollPosition;
  className?: string;
  contentClassName?: string;
  footerClassName?: string;
}>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ChatSidePanel({
  children,
  onBack,
  backLabel = "Back to chat",
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
          "chat-side-panel-x shrink-0 border-b bg-background-neutral-soft pb-xxl pt-lg transition-colors duration-150 ease-out",
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
