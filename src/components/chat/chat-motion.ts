"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export const CHAT_PANEL_TRANSITION_MS = 240;
export const CHAT_PANEL_TRAY_TRANSITION_MS = 320;
export const CHAT_ASSISTANT_THINKING_DELAY_MS = 650;
export const CHAT_ASSISTANT_STREAM_WORD_FADE_MS = 180;
const CHAT_PANEL_VIEW_TRANSITION_CLASS = "chat-panel-view-transition";

export type ChatPanelPresence = "closed" | "entering" | "open" | "exiting";
export type ChatMessageStreamStatus = "thinking" | "streaming" | "complete";

type UseChatLatestMessageAnchorOptions<Element extends HTMLElement> = Readonly<{
  scrollRef: RefObject<Element | null>;
  anchorKey?: unknown;
  contentKey?: unknown;
  topOffset?: number;
}>;

type UseChatPanelPresenceOptions = Readonly<{
  closeTransitionMs?: number;
  initialOpen?: boolean;
  onBeforeOpen?: () => void;
  onBeforeClose?: () => void;
}>;

type ChatAssistantStreamResponse = Readonly<{
  id: string;
  text: string;
}>;

type UseChatAssistantStreamOptions<
  Response extends ChatAssistantStreamResponse,
> = Readonly<{
  pendingResponse: Response | null;
  onStreamStart: (response: Response) => void;
  onStreamText: (response: Response, visibleText: string) => void;
  onComplete: (response: Response) => void;
}>;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function supportsViewTransitions(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  if (prefersReducedMotion()) {
    return false;
  }

  return "startViewTransition" in document;
}

type ViewTransition = Readonly<{
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}>;

type ViewTransitionDocument = Document & {
  startViewTransition: (callback: () => void) => ViewTransition;
};

export function startChatPanelViewTransition(callback: () => void): boolean {
  if (!supportsViewTransitions()) {
    return false;
  }

  document.documentElement.classList.add(CHAT_PANEL_VIEW_TRANSITION_CLASS);

  const transition = (document as ViewTransitionDocument).startViewTransition(
    callback,
  );

  const clearTransitionClass = () => {
    document.documentElement.classList.remove(CHAT_PANEL_VIEW_TRANSITION_CLASS);
  };

  transition.finished.then(clearTransitionClass, clearTransitionClass);

  return true;
}

export function splitIntoStreamChunks(text: string): Array<string> {
  return text.match(/\S+\s*/g) ?? [text];
}

export function getStreamDelay(chunk: string): number {
  const trimmed = chunk.trim();

  if (/[.!?]$/.test(trimmed)) {
    return 140;
  }

  if (/[,;:]$/.test(trimmed)) {
    return 80;
  }

  return 48;
}

function hasHiddenLatestContent(element: HTMLElement): boolean {
  return element.scrollHeight - element.clientHeight - element.scrollTop > 8;
}

function getLatestUserMessage(element: HTMLElement): HTMLElement | null {
  const userMessages = element.querySelectorAll<HTMLElement>(
    '[data-chat-message-role="user"]',
  );

  return userMessages[userMessages.length - 1] ?? null;
}

function getScrollTopForElement({
  element,
  scrollContainer,
  topOffset,
}: {
  element: HTMLElement;
  scrollContainer: HTMLElement;
  topOffset: number;
}) {
  const containerRect = scrollContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return Math.max(
    0,
    scrollContainer.scrollTop + elementRect.top - containerRect.top - topOffset,
  );
}

export function useChatLatestMessageAnchor<Element extends HTMLElement>({
  scrollRef,
  anchorKey,
  contentKey,
  topOffset = 8,
}: UseChatLatestMessageAnchorOptions<Element>) {
  const [hasLatestBelow, setHasLatestBelow] = useState(false);
  const latestAnchorKeyRef = useRef<unknown>(undefined);

  const updateHasLatestBelow = useCallback(() => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer) {
      setHasLatestBelow(false);
      return;
    }

    setHasLatestBelow((currentValue) => {
      const nextValue = hasHiddenLatestContent(scrollContainer);

      return currentValue === nextValue ? currentValue : nextValue;
    });
  }, [scrollRef]);

  const scrollToLatest = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const scrollContainer = scrollRef.current;

      if (!scrollContainer) {
        return;
      }

      window.requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: prefersReducedMotion() ? "auto" : behavior,
        });
        window.requestAnimationFrame(updateHasLatestBelow);
      });
    },
    [scrollRef, updateHasLatestBelow],
  );

  const anchorLatestUserMessage = useCallback(() => {
    const scrollContainer = scrollRef.current;
    const latestUserMessage = scrollContainer
      ? getLatestUserMessage(scrollContainer)
      : null;

    if (!scrollContainer || !latestUserMessage) {
      updateHasLatestBelow();
      return false;
    }

    const desiredScrollTop = getScrollTopForElement({
      element: latestUserMessage,
      scrollContainer,
      topOffset,
    });
    const maxScrollTop = Math.max(
      0,
      scrollContainer.scrollHeight - scrollContainer.clientHeight,
    );

    scrollContainer.scrollTo({
      top: Math.min(desiredScrollTop, maxScrollTop),
      behavior: "auto",
    });
    updateHasLatestBelow();

    return true;
  }, [scrollRef, topOffset, updateHasLatestBelow]);

  useLayoutEffect(() => {
    if (anchorKey === undefined || anchorKey === null) {
      latestAnchorKeyRef.current = undefined;
      updateHasLatestBelow();
      return;
    }

    if (latestAnchorKeyRef.current === anchorKey) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (anchorLatestUserMessage()) {
        latestAnchorKeyRef.current = anchorKey;
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [anchorKey, anchorLatestUserMessage, updateHasLatestBelow]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      updateHasLatestBelow();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [contentKey, updateHasLatestBelow]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer || typeof ResizeObserver === "undefined") {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      updateHasLatestBelow();
    });

    resizeObserver.observe(scrollContainer);

    if (scrollContainer.firstElementChild) {
      resizeObserver.observe(scrollContainer.firstElementChild);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollRef, updateHasLatestBelow]);

  return {
    hasLatestBelow,
    handleScroll: updateHasLatestBelow,
    scrollToLatest,
  };
}

export function useChatAssistantStream<
  Response extends ChatAssistantStreamResponse,
>({
  pendingResponse,
  onStreamStart,
  onStreamText,
  onComplete,
}: UseChatAssistantStreamOptions<Response>) {
  useEffect(() => {
    if (!pendingResponse) {
      return;
    }

    const response = pendingResponse;
    const shouldReduceMotion = prefersReducedMotion();
    const chunks = splitIntoStreamChunks(response.text);
    let streamTimer: number | null = null;
    let visibleText = "";
    let index = 0;

    const thinkingTimer = window.setTimeout(() => {
      if (shouldReduceMotion) {
        onComplete(response);
        return;
      }

      onStreamStart(response);

      function streamNextChunk() {
        const nextChunk = chunks[index];

        if (!nextChunk) {
          onComplete(response);
          return;
        }

        visibleText += nextChunk;
        index += 1;

        onStreamText(response, visibleText);

        streamTimer = window.setTimeout(
          streamNextChunk,
          getStreamDelay(nextChunk),
        );
      }

      streamNextChunk();
    }, shouldReduceMotion ? 0 : CHAT_ASSISTANT_THINKING_DELAY_MS);

    return () => {
      window.clearTimeout(thinkingTimer);
      if (streamTimer !== null) {
        window.clearTimeout(streamTimer);
      }
    };
  }, [onComplete, onStreamStart, onStreamText, pendingResponse]);
}

export function useChatPanelPresence({
  closeTransitionMs = CHAT_PANEL_TRANSITION_MS,
  initialOpen = false,
  onBeforeOpen,
  onBeforeClose,
}: UseChatPanelPresenceOptions = {}) {
  const [presence, setPresence] = useState<ChatPanelPresence>(() =>
    initialOpen ? "open" : "closed",
  );
  const openAnimationFrameRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (openAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(openAnimationFrameRef.current);
      openAnimationFrameRef.current = null;
    }

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const open = useCallback(() => {
    if (presence === "entering" || presence === "open") {
      return;
    }

    clearTimers();
    onBeforeOpen?.();
    setPresence("entering");

    openAnimationFrameRef.current = window.requestAnimationFrame(() => {
      openAnimationFrameRef.current = window.requestAnimationFrame(() => {
        openAnimationFrameRef.current = null;
        setPresence("open");
      });
    });
  }, [clearTimers, onBeforeOpen, presence]);

  const close = useCallback(() => {
    if (presence === "closed" || presence === "exiting") {
      return;
    }

    clearTimers();
    onBeforeClose?.();

    if (prefersReducedMotion()) {
      setPresence("closed");
      return;
    }

    setPresence("exiting");
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      setPresence("closed");
    }, closeTransitionMs);
  }, [clearTimers, closeTransitionMs, onBeforeClose, presence]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  return {
    presence,
    isMounted: presence !== "closed",
    isOpen: presence === "entering" || presence === "open",
    isInteractive: presence === "open",
    open,
    close,
  };
}
