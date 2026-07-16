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
export const CHAT_ASSISTANT_THINKING_SWEEP_MS = 1800;
export const CHAT_ASSISTANT_THINKING_DELAY_MS =
  CHAT_ASSISTANT_THINKING_SWEEP_MS;
export const CHAT_ASSISTANT_STREAM_CHUNK_FADE_MS = 180;
export const CHAT_ASSISTANT_STREAM_CHUNK_DELAY_MS = 150;
export const CHAT_ASSISTANT_VOICE_STREAM_DELAY_SCALE = 3;
const CHAT_ASSISTANT_STREAM_WORDS_PER_CHUNK = 4;
const CHAT_ASSISTANT_STREAM_TARGET_MAX_UPDATES = 20;
const CHAT_PANEL_VIEW_TRANSITION_CLASS = "chat-panel-view-transition";
const CHAT_RESPONSE_RUNWAY_SELECTOR = "[data-chat-response-runway]";
const CHAT_ANCHOR_STATE_ATTRIBUTE = "data-chat-anchor-state";
const CHAT_ANCHOR_HIDDEN_ATTRIBUTE = "data-chat-anchor-hidden";
const CHAT_THINKING_MESSAGE_SELECTOR = ".chat-thinking-message";
const CHAT_LATEST_CONTENT_THRESHOLD_PX = 8;
const CHAT_MESSAGE_ANCHOR_TOLERANCE_PX = 2;
const CHAT_MESSAGE_ANCHOR_DURATION_MS = CHAT_PANEL_TRAY_TRANSITION_MS;

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
  streamDelayScale?: number;
  thinkingDelayMs?: number;
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

function normalizeViewTransitionClassNames(
  classNames: string | ReadonlyArray<string>,
) {
  return typeof classNames === "string" ? [classNames] : [...classNames];
}

export function startClassedViewTransition(
  callback: () => void,
  classNames: string | ReadonlyArray<string> = [],
): boolean {
  if (!supportsViewTransitions()) {
    return false;
  }

  const transitionClassNames = normalizeViewTransitionClassNames(classNames);

  if (transitionClassNames.length > 0) {
    document.documentElement.classList.add(...transitionClassNames);
  }

  const transition = (document as ViewTransitionDocument).startViewTransition(
    callback,
  );

  const clearTransitionClass = () => {
    if (transitionClassNames.length > 0) {
      document.documentElement.classList.remove(...transitionClassNames);
    }
  };

  transition.finished.then(clearTransitionClass, clearTransitionClass);

  return true;
}

export function startChatPanelViewTransition(callback: () => void): boolean {
  return startClassedViewTransition(
    callback,
    CHAT_PANEL_VIEW_TRANSITION_CLASS,
  );
}

export function splitIntoStreamChunks(text: string): Array<string> {
  const words = text.match(/\S+\s*/g);

  if (!words) {
    return [text];
  }

  const chunks: Array<string> = [];
  let currentChunk = "";
  let currentWordCount = 0;

  words.forEach((word, index) => {
    currentChunk += word;
    currentWordCount += 1;

    const trimmedWord = word.trim();
    const remainingWordCount = words.length - index - 1;
    const endsSentence = /[.!?](?:["')\]]+)?$/.test(trimmedWord);
    const endsClause = /[,;:](?:["')\]]+)?$/.test(trimmedWord);
    const reachedTarget =
      currentWordCount >= CHAT_ASSISTANT_STREAM_WORDS_PER_CHUNK;
    const hasEnoughWordsForClause =
      currentWordCount >= CHAT_ASSISTANT_STREAM_WORDS_PER_CHUNK - 1;
    const hasNearbyBoundary = words
      .slice(index + 1, index + 3)
      .some((nextWord) => /[.!?,;:](?:["')\]]+)?$/.test(nextWord.trim()));
    const wouldLeaveTinyFinalChunk =
      remainingWordCount > 0 &&
      remainingWordCount < CHAT_ASSISTANT_STREAM_WORDS_PER_CHUNK;
    const shouldFlush =
      remainingWordCount === 0 ||
      endsSentence ||
      (endsClause && hasEnoughWordsForClause) ||
      (reachedTarget && !hasNearbyBoundary && !wouldLeaveTinyFinalChunk) ||
      (currentWordCount >= CHAT_ASSISTANT_STREAM_WORDS_PER_CHUNK + 2 &&
        !wouldLeaveTinyFinalChunk);

    if (!shouldFlush) {
      return;
    }

    chunks.push(currentChunk);
    currentChunk = "";
    currentWordCount = 0;
  });

  return chunks;
}

export function getStreamDelay(chunk: string): number {
  const trimmed = chunk.trim();

  if (/[.!?](?:["')\]]+)?$/.test(trimmed)) {
    return CHAT_ASSISTANT_STREAM_CHUNK_DELAY_MS + 18;
  }

  if (/[,;:](?:["')\]]+)?$/.test(trimmed)) {
    return CHAT_ASSISTANT_STREAM_CHUNK_DELAY_MS + 8;
  }

  return CHAT_ASSISTANT_STREAM_CHUNK_DELAY_MS;
}

function getResponseRunway(element: HTMLElement): HTMLElement | null {
  return element.querySelector<HTMLElement>(CHAT_RESPONSE_RUNWAY_SELECTOR);
}

function getRealContentBottom(element: HTMLElement): number {
  const runway = getResponseRunway(element);

  if (!runway) {
    return element.scrollHeight;
  }

  const containerRect = element.getBoundingClientRect();
  const runwayRect = runway.getBoundingClientRect();

  return element.scrollTop + runwayRect.top - containerRect.top;
}

function setResponseRunwayHeight(element: HTMLElement, height: number) {
  const runway = getResponseRunway(element);

  if (!runway) {
    return;
  }

  const nextHeight = Math.max(0, Math.ceil(height));

  if (Math.abs(runway.getBoundingClientRect().height - nextHeight) <= 0.5) {
    return;
  }

  runway.style.height = `${nextHeight}px`;
}

function setAnchorMoving(element: HTMLElement, isMoving: boolean) {
  const thinkingMessages = element.querySelectorAll<HTMLElement>(
    CHAT_THINKING_MESSAGE_SELECTOR,
  );

  if (isMoving) {
    element.setAttribute(CHAT_ANCHOR_STATE_ATTRIBUTE, "moving");

    thinkingMessages.forEach((message) => {
      message.style.visibility = "hidden";
      message.setAttribute(CHAT_ANCHOR_HIDDEN_ATTRIBUTE, "true");
    });

    return;
  }

  element.removeAttribute(CHAT_ANCHOR_STATE_ATTRIBUTE);

  thinkingMessages.forEach((message) => {
    if (message.hasAttribute(CHAT_ANCHOR_HIDDEN_ATTRIBUTE)) {
      message.style.removeProperty("visibility");
      message.removeAttribute(CHAT_ANCHOR_HIDDEN_ATTRIBUTE);
    }
  });
}

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

function hasHiddenLatestContent(element: HTMLElement): boolean {
  const visibleBottom = element.scrollTop + element.clientHeight;

  return (
    getRealContentBottom(element) - visibleBottom >
    CHAT_LATEST_CONTENT_THRESHOLD_PX
  );
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
  const transform = window.getComputedStyle(element).transform;
  let animatedTranslateY = 0;

  if (transform && transform !== "none") {
    try {
      animatedTranslateY = new DOMMatrixReadOnly(transform).m42;
    } catch {
      animatedTranslateY = 0;
    }
  }

  return Math.max(
    0,
    scrollContainer.scrollTop +
      elementRect.top -
      animatedTranslateY -
      containerRect.top -
      topOffset,
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
  const latestUserMessageRef = useRef<HTMLElement | null>(null);
  const shouldPreserveAnchorRef = useRef(false);
  const isApplyingAnchorRef = useRef(false);
  const anchorStartFrameRef = useRef<number | null>(null);
  const anchorAnimationFrameRef = useRef<number | null>(null);

  const clearAnchorMotion = useCallback(() => {
    if (anchorStartFrameRef.current !== null) {
      window.cancelAnimationFrame(anchorStartFrameRef.current);
      anchorStartFrameRef.current = null;
    }

    if (anchorAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(anchorAnimationFrameRef.current);
      anchorAnimationFrameRef.current = null;
    }

    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      setAnchorMoving(scrollContainer, false);
    }

    isApplyingAnchorRef.current = false;
  }, [scrollRef]);

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

      shouldPreserveAnchorRef.current = false;
      clearAnchorMotion();

      window.requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: Math.max(
            0,
            getRealContentBottom(scrollContainer) - scrollContainer.clientHeight,
          ),
          behavior: prefersReducedMotion() ? "auto" : behavior,
        });
        window.requestAnimationFrame(updateHasLatestBelow);
      });
    },
    [clearAnchorMotion, scrollRef, updateHasLatestBelow],
  );

  const syncResponseRunway = useCallback(
    ({
      reposition,
      behavior = "auto",
    }: {
      reposition: boolean;
      behavior?: ScrollBehavior;
    }) => {
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
      const requiredRunwayHeight = Math.max(
        0,
        desiredScrollTop +
          scrollContainer.clientHeight -
          getRealContentBottom(scrollContainer),
      );

      setResponseRunwayHeight(scrollContainer, requiredRunwayHeight);

      if (reposition) {
        scrollContainer.scrollTo({
          top: desiredScrollTop,
          behavior: prefersReducedMotion() ? "auto" : behavior,
        });
      }

      updateHasLatestBelow();

      return true;
    },
    [scrollRef, topOffset, updateHasLatestBelow],
  );

  const anchorLatestUserMessage = useCallback(() => {
    const scrollContainer = scrollRef.current;
    const latestUserMessage = scrollContainer
      ? getLatestUserMessage(scrollContainer)
      : null;

    if (!scrollContainer || !latestUserMessage) {
      clearAnchorMotion();
      updateHasLatestBelow();
      return false;
    }

    clearAnchorMotion();
    shouldPreserveAnchorRef.current = true;
    isApplyingAnchorRef.current = true;
    setAnchorMoving(scrollContainer, true);

    const didAnchor = syncResponseRunway({
      reposition: false,
    });

    if (!didAnchor) {
      shouldPreserveAnchorRef.current = false;
      clearAnchorMotion();
      return false;
    }

    latestUserMessageRef.current = latestUserMessage;
    anchorStartFrameRef.current = window.requestAnimationFrame(() => {
      anchorStartFrameRef.current = null;

      const targetScrollTop = getScrollTopForElement({
        element: latestUserMessage,
        scrollContainer,
        topOffset,
      });
      const startScrollTop = scrollContainer.scrollTop;
      const scrollDistance = targetScrollTop - startScrollTop;

      const finishAnchorMotion = () => {
        anchorAnimationFrameRef.current = null;
        isApplyingAnchorRef.current = false;
        setAnchorMoving(scrollContainer, false);
        updateHasLatestBelow();
      };

      if (
        prefersReducedMotion() ||
        Math.abs(scrollDistance) <= CHAT_MESSAGE_ANCHOR_TOLERANCE_PX
      ) {
        scrollContainer.scrollTop = targetScrollTop;
        finishAnchorMotion();
        return;
      }

      let animationStartTime: number | null = null;

      const animateAnchor = (timestamp: number) => {
        animationStartTime ??= timestamp;

        const progress = Math.min(
          1,
          (timestamp - animationStartTime) / CHAT_MESSAGE_ANCHOR_DURATION_MS,
        );
        scrollContainer.scrollTop =
          startScrollTop + scrollDistance * easeOutCubic(progress);

        if (progress >= 1) {
          scrollContainer.scrollTop = targetScrollTop;
          finishAnchorMotion();
          return;
        }

        anchorAnimationFrameRef.current =
          window.requestAnimationFrame(animateAnchor);
      };

      anchorAnimationFrameRef.current =
        window.requestAnimationFrame(animateAnchor);
    });

    return true;
  }, [
    clearAnchorMotion,
    scrollRef,
    syncResponseRunway,
    topOffset,
    updateHasLatestBelow,
  ]);

  const handleScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;

    if (
      scrollContainer &&
      latestAnchorKeyRef.current !== undefined &&
      shouldPreserveAnchorRef.current &&
      !isApplyingAnchorRef.current
    ) {
      const latestUserMessage = getLatestUserMessage(scrollContainer);

      if (latestUserMessage) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const messageRect = latestUserMessage.getBoundingClientRect();
        const visualTop = messageRect.top - containerRect.top;

        if (
          Math.abs(visualTop - topOffset) >
          CHAT_MESSAGE_ANCHOR_TOLERANCE_PX
        ) {
          shouldPreserveAnchorRef.current = false;
        }
      }
    }

    updateHasLatestBelow();
  }, [scrollRef, topOffset, updateHasLatestBelow]);

  useLayoutEffect(() => {
    if (anchorKey === undefined || anchorKey === null) {
      latestAnchorKeyRef.current = undefined;
      latestUserMessageRef.current = null;
      shouldPreserveAnchorRef.current = false;
      clearAnchorMotion();
      const scrollContainer = scrollRef.current;

      if (scrollContainer) {
        setResponseRunwayHeight(scrollContainer, 0);
      }

      updateHasLatestBelow();
      return;
    }

    if (latestAnchorKeyRef.current === anchorKey) {
      return;
    }

    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      isApplyingAnchorRef.current = true;
      setAnchorMoving(scrollContainer, true);
    }

    const frame = window.requestAnimationFrame(() => {
      if (anchorLatestUserMessage()) {
        latestAnchorKeyRef.current = anchorKey;
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [
    anchorKey,
    anchorLatestUserMessage,
    clearAnchorMotion,
    scrollRef,
    updateHasLatestBelow,
  ]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      syncResponseRunway({
        reposition: false,
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [contentKey, syncResponseRunway]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer) {
      return;
    }

    let syncFrame: number | null = null;
    const scheduleLayoutSync = () => {
      if (syncFrame !== null) {
        return;
      }

      syncFrame = window.requestAnimationFrame(() => {
        syncFrame = null;

        const latestUserMessage = getLatestUserMessage(scrollContainer);

        if (
          anchorKey !== undefined &&
          anchorKey !== null &&
          latestAnchorKeyRef.current === anchorKey &&
          latestUserMessage &&
          latestUserMessage !== latestUserMessageRef.current
        ) {
          anchorLatestUserMessage();
          return;
        }

        syncResponseRunway({
          reposition:
            shouldPreserveAnchorRef.current &&
            !isApplyingAnchorRef.current,
        });
      });
    };
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleLayoutSync);
    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(() => {
            if (
              scrollContainer.getAttribute(CHAT_ANCHOR_STATE_ATTRIBUTE) ===
              "moving"
            ) {
              setAnchorMoving(scrollContainer, true);
            }

            if (scrollContainer.firstElementChild) {
              resizeObserver?.observe(scrollContainer.firstElementChild);
            }

            scheduleLayoutSync();
          });

    resizeObserver?.observe(scrollContainer);

    if (scrollContainer.firstElementChild) {
      resizeObserver?.observe(scrollContainer.firstElementChild);
    }

    mutationObserver?.observe(scrollContainer, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      if (syncFrame !== null) {
        window.cancelAnimationFrame(syncFrame);
      }
    };
  }, [anchorKey, anchorLatestUserMessage, scrollRef, syncResponseRunway]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer) {
      return;
    }

    const releasePreservedAnchor = () => {
      shouldPreserveAnchorRef.current = false;
      clearAnchorMotion();
    };

    scrollContainer.addEventListener("wheel", releasePreservedAnchor, {
      passive: true,
    });
    scrollContainer.addEventListener("touchstart", releasePreservedAnchor, {
      passive: true,
    });
    scrollContainer.addEventListener("pointerdown", releasePreservedAnchor, {
      passive: true,
    });
    scrollContainer.addEventListener("keydown", releasePreservedAnchor);

    return () => {
      scrollContainer.removeEventListener("wheel", releasePreservedAnchor);
      scrollContainer.removeEventListener("touchstart", releasePreservedAnchor);
      scrollContainer.removeEventListener("pointerdown", releasePreservedAnchor);
      scrollContainer.removeEventListener("keydown", releasePreservedAnchor);
    };
  }, [clearAnchorMotion, scrollRef]);

  useEffect(() => clearAnchorMotion, [clearAnchorMotion]);

  return {
    hasLatestBelow,
    handleScroll,
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
    const chunksPerUpdate = Math.max(
      1,
      Math.ceil(chunks.length / CHAT_ASSISTANT_STREAM_TARGET_MAX_UPDATES),
    );
    let streamTimer: number | null = null;
    let visibleText = "";
    let index = 0;
    const streamDelayScale = Math.max(0.25, response.streamDelayScale ?? 1);

    const thinkingTimer = window.setTimeout(() => {
      if (shouldReduceMotion) {
        onComplete(response);
        return;
      }

      onStreamStart(response);

      function streamNextChunk() {
        const nextChunks = chunks.slice(index, index + chunksPerUpdate);

        if (nextChunks.length === 0) {
          onComplete(response);
          return;
        }

        visibleText += nextChunks.join("");
        index += nextChunks.length;

        onStreamText(response, visibleText);

        const lastChunk = nextChunks[nextChunks.length - 1] ?? "";
        const nextDelay =
          index >= chunks.length
            ? CHAT_ASSISTANT_STREAM_CHUNK_FADE_MS
            : getStreamDelay(lastChunk);

        streamTimer = window.setTimeout(
          streamNextChunk,
          nextDelay * streamDelayScale,
        );
      }

      streamNextChunk();
    },
    shouldReduceMotion
      ? 0
      : Math.max(
          0,
          response.thinkingDelayMs ?? CHAT_ASSISTANT_THINKING_DELAY_MS,
        ));

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
