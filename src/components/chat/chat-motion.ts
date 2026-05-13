"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const CHAT_PANEL_TRANSITION_MS = 240;
export const CHAT_ASSISTANT_THINKING_DELAY_MS = 650;

export type ChatPanelPresence = "closed" | "entering" | "open" | "exiting";
export type ChatMessageStreamStatus = "thinking" | "streaming" | "complete";

type UseChatPanelPresenceOptions = Readonly<{
  initialOpen?: boolean;
  onBeforeOpen?: () => void;
  onBeforeClose?: () => void;
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

export function splitIntoStreamChunks(text: string): Array<string> {
  return text.match(/\S+\s*/g) ?? [text];
}

export function getStreamDelay(chunk: string): number {
  const trimmed = chunk.trim();

  if (/[.!?]$/.test(trimmed)) {
    return 180;
  }

  if (/[,;:]$/.test(trimmed)) {
    return 100;
  }

  return 42;
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
