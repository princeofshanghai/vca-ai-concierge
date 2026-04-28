"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatPanel,
  ChatThinkingMessage,
  ChatThread,
  Prompt,
  type ChatPanelVariant,
} from "@/components/chat";
import { useReviewShellState } from "@/components/review-shell";
import {
  STARTER_PROMPTS,
  buildFollowUpAssistantResponse,
  buildInitialAssistantResponse,
} from "@/lib/conversation-flows";

import { OnboardingScreen, type OnboardingResult } from "./onboarding-screen";

type ConciergePanelProps = Readonly<{
  variant?: ChatPanelVariant;
  className?: string;
  onClose?: () => void;
  onVariantToggle?: () => void;
  onConversationStart?: () => void;
  confirmationDialog?: ReactNode;
}>;

type ViewTransitionDocument = Document & {
  startViewTransition: (callback: () => void) => unknown;
};

type ConciergeMessage = Readonly<{
  id: string;
  role: "assistant" | "user";
  content: string;
  status: "thinking" | "streaming" | "complete";
}>;

type PendingAssistantResponse = Readonly<{
  id: string;
  text: string;
}>;

const THINKING_DELAY_MS = 650;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function supportsViewTransitions(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  if (prefersReducedMotion()) {
    return false;
  }
  return "startViewTransition" in document;
}

function splitIntoStreamChunks(text: string): Array<string> {
  return text.match(/\S+\s*/g) ?? [text];
}

function getStreamDelay(chunk: string): number {
  const trimmed = chunk.trim();

  if (/[.!?]$/.test(trimmed)) {
    return 180;
  }

  if (/[,;:]$/.test(trimmed)) {
    return 100;
  }

  return 42;
}

export function ConciergePanel({
  variant = "collapsed",
  className,
  onClose,
  onVariantToggle,
  onConversationStart,
  confirmationDialog,
}: ConciergePanelProps) {
  const { isSignedIn } = useReviewShellState();
  const [lead, setLead] = useState<OnboardingResult | null>(null);
  const [messages, setMessages] = useState<ReadonlyArray<ConciergeMessage>>(
    [],
  );
  const [draft, setDraft] = useState("");
  const [pendingAssistantResponse, setPendingAssistantResponse] =
    useState<PendingAssistantResponse | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(0);

  const phase: "onboarding" | "chat" = lead ? "chat" : "onboarding";
  const hasUserMessages = messages.some((message) => message.role === "user");
  const isAssistantBusy =
    pendingAssistantResponse !== null ||
    messages.some(
      (message) =>
        message.status === "thinking" || message.status === "streaming",
    );

  const createMessageId = useCallback((prefix: string) => {
    const id = `${prefix}-${nextMessageIdRef.current}`;
    nextMessageIdRef.current += 1;
    return id;
  }, []);

  const queueAssistantResponse = useCallback(
    (text: string) => {
      const id = createMessageId("assistant");

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id,
          role: "assistant",
          content: "",
          status: "thinking",
        },
      ]);
      setPendingAssistantResponse({ id, text });
    },
    [createMessageId],
  );

  useEffect(() => {
    if (!pendingAssistantResponse) {
      return;
    }

    const { id, text } = pendingAssistantResponse;
    const shouldReduceMotion = prefersReducedMotion();
    const chunks = splitIntoStreamChunks(text);
    let streamTimer: number | null = null;
    let visibleText = "";
    let index = 0;

    const thinkingTimer = window.setTimeout(() => {
      if (shouldReduceMotion) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === id
              ? { ...message, content: text, status: "complete" }
              : message,
          ),
        );
        setPendingAssistantResponse(null);
        return;
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === id
            ? { ...message, content: "", status: "streaming" }
            : message,
        ),
      );

      function streamNextChunk() {
        const nextChunk = chunks[index];

        if (!nextChunk) {
          setMessages((currentMessages) =>
            currentMessages.map((message) =>
              message.id === id
                ? { ...message, content: text, status: "complete" }
                : message,
            ),
          );
          setPendingAssistantResponse(null);
          return;
        }

        visibleText += nextChunk;
        index += 1;

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === id
              ? { ...message, content: visibleText, status: "streaming" }
              : message,
          ),
        );

        streamTimer = window.setTimeout(
          streamNextChunk,
          getStreamDelay(nextChunk),
        );
      }

      streamNextChunk();
    }, shouldReduceMotion ? 0 : THINKING_DELAY_MS);

    return () => {
      window.clearTimeout(thinkingTimer);
      if (streamTimer !== null) {
        window.clearTimeout(streamTimer);
      }
    };
  }, [pendingAssistantResponse]);

  useEffect(() => {
    const chatBody = chatBodyRef.current;

    if (!chatBody) {
      return;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }, [messages]);

  // Submitting the onboarding form swaps the welcome content for the chat
  // thread. We trigger a View Transition so the AI mark morphs from the
  // centered welcome position to its place in the header, while the body
  // cross-fades. Falls back to an instant swap on browsers without support
  // and when the user prefers reduced motion.
  const handleOnboardingSubmit = useCallback(
    (result: OnboardingResult) => {
      const assistantId = createMessageId("assistant");
      const enterChat = () => {
        onConversationStart?.();
        setLead(result);
        setDraft("");
        setMessages([
          {
            id: assistantId,
            role: "assistant",
            content: "",
            status: "thinking",
          },
        ]);
        setPendingAssistantResponse({
          id: assistantId,
          text: buildInitialAssistantResponse(result),
        });
      };

      if (!supportsViewTransitions()) {
        enterChat();
        return;
      }
      (document as ViewTransitionDocument).startViewTransition(() => {
        flushSync(enterChat);
      });
    },
    [createMessageId, onConversationStart],
  );

  const handleDraftChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(event.currentTarget.value);
    },
    [],
  );

  const submitUserMessage = useCallback(
    (messageText: string) => {
      const text = messageText.trim();

      if (!lead || text.length === 0 || isAssistantBusy) {
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId("user"),
          role: "user",
          content: text,
          status: "complete",
        },
      ]);
      setDraft("");
      queueAssistantResponse(buildFollowUpAssistantResponse(text, lead));
    },
    [createMessageId, isAssistantBusy, lead, queueAssistantResponse],
  );

  const handleSendMessage = useCallback(() => {
    submitUserMessage(draft);
  }, [draft, submitUserMessage]);

  const handleStarterPromptSelect = useCallback(
    (prompt: string) => {
      submitUserMessage(prompt);
    },
    [submitUserMessage],
  );

  function shouldShowStarterPrompts(
    message: ConciergeMessage,
    index: number,
  ) {
    if (!lead || isAssistantBusy) {
      return false;
    }

    return (
      index === 0 &&
      !hasUserMessages &&
      message.role === "assistant" &&
      message.status === "complete"
    );
  }

  return (
    <ChatPanel
      variant={variant}
      surface={phase === "onboarding" ? "welcome" : "default"}
      className={className}
    >
      <ChatHeader
        variant={variant}
        onClose={onClose}
        onVariantToggle={onVariantToggle}
        transparent={phase === "onboarding"}
        showAiMark={phase === "chat"}
        aiMarkClassName="concierge-ai-mark"
      />

      {lead ? (
        <>
          <ChatBody ref={chatBodyRef}>
            <ChatThread
              aria-live="polite"
              aria-busy={isAssistantBusy || undefined}
            >
              {messages.map((message, index) => (
                <Fragment key={message.id}>
                  {message.status === "thinking" ? (
                    <ChatThinkingMessage />
                  ) : (
                    <ChatMessage
                      role={message.role}
                      aria-busy={message.status === "streaming" || undefined}
                    >
                      {message.content}
                    </ChatMessage>
                  )}
                  {shouldShowStarterPrompts(message, index) ? (
                    <div className="chat-message-enter flex w-full">
                      <div className="flex max-w-[33rem] flex-wrap gap-sm pr-sm">
                        {STARTER_PROMPTS.map((prompt) => (
                          <Prompt
                            key={prompt}
                            prompt={prompt}
                            onPromptSelect={handleStarterPromptSelect}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </ChatThread>
          </ChatBody>
          <ChatComposer
            variant={variant}
            inputProps={{
              value: draft,
              onChange: handleDraftChange,
              autoFocus: true,
            }}
            onSend={handleSendMessage}
            sendDisabled={draft.trim().length === 0 || isAssistantBusy}
          />
        </>
      ) : (
        // Re-key on the demo preset so toggling between signed-in and
        // signed-out in the review shell remounts the screen with fresh
        // state instead of stacking runtime overrides.
        <OnboardingScreen
          key={isSignedIn ? "signed-in" : "signed-out"}
          isSignedIn={isSignedIn}
          onSubmit={handleOnboardingSubmit}
        />
      )}
      {confirmationDialog}
    </ChatPanel>
  );
}
