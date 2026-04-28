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
  RecommendationCard,
  type ChatPanelVariant,
} from "@/components/chat";
import { Button } from "@/components/primitives/button";
import { useReviewShellState } from "@/components/review-shell";
import {
  STARTER_PROMPTS,
  buildInitialAssistantResponse,
  flowReviews,
  type FlowReviewAvailabilityStep,
  type FlowReviewId,
  type FlowReviewRecommendationStep,
  type FlowReviewResourcesStep,
  type FlowReviewStep,
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
  kind: "message";
  id: string;
  role: "assistant" | "user";
  content: string;
  status: "thinking" | "streaming" | "complete";
}>;

type ConciergeRecommendation = Readonly<{
  id: string;
  kind: "recommendation";
  step: FlowReviewRecommendationStep;
}>;

type ConciergeResources = Readonly<{
  id: string;
  kind: "resources";
  step: FlowReviewResourcesStep;
}>;

type ConciergeAvailability = Readonly<{
  id: string;
  kind: "availability";
  step: FlowReviewAvailabilityStep;
}>;

type ConciergeThreadItem =
  | ConciergeMessage
  | ConciergeRecommendation
  | ConciergeResources
  | ConciergeAvailability;

type ConciergeSurface =
  | ConciergeRecommendation
  | ConciergeResources
  | ConciergeAvailability;

type PendingAssistantResponse = Readonly<{
  id: string;
  text: string;
  surfaceAfter?: ConciergeSurface;
}>;

const THINKING_DELAY_MS = 650;
const INITIAL_LIVE_SCRIPT_INDEX = 0;

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

function isMessageItem(item: ConciergeThreadItem): item is ConciergeMessage {
  return item.kind === "message";
}

function selectLiveFlowId(userMessage: string): FlowReviewId {
  const message = userMessage.toLowerCase();

  if (message.includes("sales") || message.includes("contact")) {
    return "medium";
  }

  if (message.includes("recruiter") || message.includes("features")) {
    return "low";
  }

  return "high";
}

function createSurfaceItem(
  id: string,
  step: FlowReviewStep,
): ConciergeSurface | null {
  if (step.kind === "recommendation") {
    return { id, kind: "recommendation", step };
  }

  if (step.kind === "resources") {
    return { id, kind: "resources", step };
  }

  if (step.kind === "availability") {
    return { id, kind: "availability", step };
  }

  return null;
}

function getNextScriptedAssistantTurn({
  flowId,
  currentStepIndex,
  createSurfaceId,
}: {
  flowId: FlowReviewId;
  currentStepIndex: number;
  createSurfaceId: () => string;
}): Readonly<{
  content: string;
  nextStepIndex: number;
  surfaceAfter?: ConciergeSurface;
}> {
  const steps = flowReviews[flowId].steps;
  const assistantStepIndex = steps.findIndex(
    (step, index) =>
      index > currentStepIndex &&
      step.kind === "message" &&
      step.role === "assistant",
  );

  if (assistantStepIndex < 0) {
    return {
      content:
        "The best next step is above. You can use that card to keep going from here.",
      nextStepIndex: currentStepIndex,
    };
  }

  const assistantStep = steps[assistantStepIndex];
  if (
    !assistantStep ||
    assistantStep.kind !== "message" ||
    assistantStep.role !== "assistant"
  ) {
    return {
      content:
        "The best next step is above. You can use that card to keep going from here.",
      nextStepIndex: currentStepIndex,
    };
  }

  const nextStep = steps[assistantStepIndex + 1];
  const surfaceAfter =
    nextStep && nextStep.kind !== "message"
      ? createSurfaceItem(createSurfaceId(), nextStep)
      : null;

  return {
    content: assistantStep.content,
    nextStepIndex: surfaceAfter ? assistantStepIndex + 1 : assistantStepIndex,
    ...(surfaceAfter ? { surfaceAfter } : {}),
  };
}

function ResourceCards({ step }: { step: FlowReviewResourcesStep }) {
  return (
    <div className="chat-message-enter flex w-full">
      <div className="flex w-full max-w-[33rem] flex-col gap-md pr-sm">
        {step.resources.map((resource) => (
          <article
            key={resource.title}
            className="flex min-w-0 flex-col gap-md rounded-md border border-border-faint bg-background p-lg"
          >
            <div className="space-y-xs">
              <h2 className="text-heading-md text-text">{resource.title}</h2>
              <p className="text-body-xs text-text-meta">
                {resource.description}
              </p>
            </div>
            <Button
              size="small"
              variant="secondary"
              className="mt-auto w-fit px-pill-padding-inline"
            >
              {resource.actionLabel}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function AvailabilityCard({ step }: { step: FlowReviewAvailabilityStep }) {
  const variant = step.variants[0];

  if (!variant) {
    return null;
  }

  return (
    <RecommendationCard
      title={variant.title}
      primaryAction={variant.primaryAction}
      secondaryAction={variant.secondaryAction}
    />
  );
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
  const [messages, setMessages] = useState<ReadonlyArray<ConciergeThreadItem>>(
    [],
  );
  const [draft, setDraft] = useState("");
  const [pendingAssistantResponse, setPendingAssistantResponse] =
    useState<PendingAssistantResponse | null>(null);
  const [liveFlowId, setLiveFlowId] = useState<FlowReviewId | null>(null);
  const [liveStepIndex, setLiveStepIndex] = useState(
    INITIAL_LIVE_SCRIPT_INDEX,
  );
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(0);

  const phase: "onboarding" | "chat" = lead ? "chat" : "onboarding";
  const hasUserMessages = messages.some(
    (message) => isMessageItem(message) && message.role === "user",
  );
  const isAssistantBusy =
    pendingAssistantResponse !== null ||
    messages.some(
      (message) =>
        isMessageItem(message) &&
        (message.status === "thinking" || message.status === "streaming"),
    );

  const createMessageId = useCallback((prefix: string) => {
    const id = `${prefix}-${nextMessageIdRef.current}`;
    nextMessageIdRef.current += 1;
    return id;
  }, []);

  const queueAssistantResponse = useCallback(
    (text: string, surfaceAfter?: ConciergeSurface) => {
      const id = createMessageId("assistant");

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          kind: "message",
          id,
          role: "assistant",
          content: "",
          status: "thinking",
        },
      ]);
      setPendingAssistantResponse({ id, text, surfaceAfter });
    },
    [createMessageId],
  );

  useEffect(() => {
    if (!pendingAssistantResponse) {
      return;
    }

    const { id, text, surfaceAfter } = pendingAssistantResponse;
    const shouldReduceMotion = prefersReducedMotion();
    const chunks = splitIntoStreamChunks(text);
    let streamTimer: number | null = null;
    let visibleText = "";
    let index = 0;

    function completePendingAssistantResponse() {
      setMessages((currentMessages) => {
        const completedMessages = currentMessages.map((message) =>
          isMessageItem(message) && message.id === id
            ? { ...message, content: text, status: "complete" as const }
            : message,
        );

        return surfaceAfter
          ? [...completedMessages, surfaceAfter]
          : completedMessages;
      });
      setPendingAssistantResponse(null);
    }

    const thinkingTimer = window.setTimeout(() => {
      if (shouldReduceMotion) {
        completePendingAssistantResponse();
        return;
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          isMessageItem(message) && message.id === id
            ? { ...message, content: "", status: "streaming" }
            : message,
        ),
      );

      function streamNextChunk() {
        const nextChunk = chunks[index];

        if (!nextChunk) {
          completePendingAssistantResponse();
          return;
        }

        visibleText += nextChunk;
        index += 1;

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            isMessageItem(message) && message.id === id
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
        setLiveFlowId(null);
        setLiveStepIndex(INITIAL_LIVE_SCRIPT_INDEX);
        setMessages([
          {
            kind: "message",
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
          kind: "message",
          id: createMessageId("user"),
          role: "user",
          content: text,
          status: "complete",
        },
      ]);
      setDraft("");
      const nextFlowId = liveFlowId ?? selectLiveFlowId(text);
      const nextTurn = getNextScriptedAssistantTurn({
        flowId: nextFlowId,
        currentStepIndex: liveFlowId ? liveStepIndex : INITIAL_LIVE_SCRIPT_INDEX,
        createSurfaceId: () => createMessageId("surface"),
      });

      setLiveFlowId(nextFlowId);
      setLiveStepIndex(nextTurn.nextStepIndex);
      queueAssistantResponse(nextTurn.content, nextTurn.surfaceAfter);
    },
    [
      createMessageId,
      isAssistantBusy,
      lead,
      liveFlowId,
      liveStepIndex,
      queueAssistantResponse,
    ],
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
    message: ConciergeThreadItem,
    index: number,
  ) {
    if (!lead || isAssistantBusy) {
      return false;
    }

    return (
      isMessageItem(message) &&
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
              {messages.map((message, index) => {
                if (message.kind === "recommendation") {
                  return (
                    <RecommendationCard
                      key={message.id}
                      title={message.step.title}
                      description={message.step.description}
                      primaryAction={message.step.primaryAction}
                      secondaryAction={message.step.secondaryAction}
                    />
                  );
                }

                if (message.kind === "resources") {
                  return <ResourceCards key={message.id} step={message.step} />;
                }

                if (message.kind === "availability") {
                  return (
                    <AvailabilityCard key={message.id} step={message.step} />
                  );
                }

                return (
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
                );
              })}
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
