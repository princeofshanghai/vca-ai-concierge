"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const CHAT_PANEL_TRANSITION_MS = 240;
export const CHAT_ASSISTANT_THINKING_DELAY_MS = 650;
export const CHAT_ASSISTANT_STREAM_WORD_FADE_MS = 180;
const CHAT_PANEL_VIEW_TRANSITION_CLASS = "chat-panel-view-transition";

export type ChatPanelPresence = "closed" | "entering" | "open" | "exiting";
export type ChatMessageStreamStatus = "thinking" | "streaming" | "complete";

type UseChatPanelPresenceOptions = Readonly<{
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
    }, CHAT_PANEL_TRANSITION_MS);
  }, [clearTimers, onBeforeClose, presence]);

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
