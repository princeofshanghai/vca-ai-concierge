"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type UIEvent,
} from "react";
import { flushSync } from "react-dom";

import {
  CHAT_ASSISTANT_THINKING_DELAY_MS,
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatInlineFeedback,
  ChatMessage,
  ChatMessageFeedbackFlow,
  ChatPanel,
  ChatThinkingMessage,
  ChatThread,
  Prompt,
  RecommendationCard,
  getStreamDelay,
  prefersReducedMotion,
  splitIntoStreamChunks,
  supportsViewTransitions,
  type ChatMessageStreamStatus,
  type ChatPanelVariant,
} from "@/components/chat";
import {
  SchedulePanel,
  ScheduledSpecialistCard,
  type BookedMeeting,
  type HighValueRecommendationState,
} from "@/components/flow-review";
import { Button } from "@/components/primitives/button";
import { useReviewShellState } from "@/components/review-shell";
import { HIRING_CONCIERGE_TITLE } from "@/lib/concierge-copy";
import {
  STARTER_PROMPTS,
  buildInitialAssistantResponse,
  flowReviews,
  shouldShowFlowReviewMessageFeedback,
  type FlowReviewAvailabilityStep,
  type FlowReviewId,
  type FlowReviewRecommendationStep,
  type FlowReviewResourcesStep,
  type FlowReviewStep,
} from "@/lib/conversation-flows";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

import { OnboardingScreen, type OnboardingResult } from "./onboarding-screen";

type ConciergePanelProps = Readonly<{
  variant?: ChatPanelVariant;
  className?: string;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  onConversationStart?: () => void;
  onSidePanelOpenChange?: (open: boolean) => void;
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
  status: ChatMessageStreamStatus;
  feedbackEligible?: boolean;
  responseStopped?: boolean;
}>;

type ConciergeInlineFeedback = Readonly<{
  id: string;
  kind: "inline-feedback";
  tone: "neutral";
  content: string;
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
  | ConciergeInlineFeedback
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

const INITIAL_LIVE_SCRIPT_INDEX = 0;
const MATCHING_DELAY_MS = 900;

function isMessageItem(item: ConciergeThreadItem): item is ConciergeMessage {
  return item.kind === "message";
}

function createResponseStoppedFeedback(id: string): ConciergeInlineFeedback {
  return {
    id,
    kind: "inline-feedback",
    tone: "neutral",
    content: "Response stopped.",
  };
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
  feedbackEligible?: boolean;
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
    feedbackEligible: shouldShowFlowReviewMessageFeedback(assistantStep),
    ...(surfaceAfter ? { surfaceAfter } : {}),
  };
}

function ResourceCards({ step }: { step: FlowReviewResourcesStep }) {
  return (
    <div className="chat-recommendation-enter flex w-full">
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

function isScheduledSpecialistRecommendation(
  step: FlowReviewRecommendationStep,
) {
  return step.id === "high-recommendation-card";
}

function isScheduledSpecialistAvailability(step: FlowReviewAvailabilityStep) {
  return (
    step.variants.length === 1 &&
    step.variants[0]?.id === "medium-scheduled"
  );
}

export function ConciergePanel({
  variant = "collapsed",
  className,
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  onConversationStart,
  onSidePanelOpenChange,
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
  const [scheduledSpecialistState, setScheduledSpecialistState] =
    useState<HighValueRecommendationState>("initial");
  const [bookedMeeting, setBookedMeeting] = useState<BookedMeeting | null>(
    null,
  );
  const [hasChatBodyScrolled, setHasChatBodyScrolled] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(0);

  const phase: "onboarding" | "chat" = lead ? "chat" : "onboarding";
  const isSchedulePanelOpen = scheduledSpecialistState === "scheduling";
  const shellVariant = variant;
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
    (
      text: string,
      options: Readonly<{
        surfaceAfter?: ConciergeSurface;
        feedbackEligible?: boolean;
      }> = {},
    ) => {
      const { surfaceAfter, feedbackEligible } = options;
      const id = createMessageId("assistant");

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          kind: "message",
          id,
          role: "assistant",
          content: "",
          status: "thinking",
          feedbackEligible,
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
    }, shouldReduceMotion ? 0 : CHAT_ASSISTANT_THINKING_DELAY_MS);

    return () => {
      window.clearTimeout(thinkingTimer);
      if (streamTimer !== null) {
        window.clearTimeout(streamTimer);
      }
    };
  }, [pendingAssistantResponse]);

  useEffect(() => {
    return () => {
      onSidePanelOpenChange?.(false);
    };
  }, [onSidePanelOpenChange]);

  useEffect(() => {
    if (scheduledSpecialistState !== "matching") {
      return;
    }

    const matchingTimer = window.setTimeout(() => {
      setScheduledSpecialistState("matched");
    }, MATCHING_DELAY_MS);

    return () => {
      window.clearTimeout(matchingTimer);
    };
  }, [scheduledSpecialistState]);

  useEffect(() => {
    const chatBody = chatBodyRef.current;

    if (!chatBody) {
      return;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
    setHasChatBodyScrolled(chatBody.scrollTop > 0);
  }, [messages, isSchedulePanelOpen]);

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
        setScheduledSpecialistState("initial");
        setBookedMeeting(null);
        onSidePanelOpenChange?.(false);
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
    [createMessageId, onConversationStart, onSidePanelOpenChange],
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
      queueAssistantResponse(nextTurn.content, {
        surfaceAfter: nextTurn.surfaceAfter,
        feedbackEligible: nextTurn.feedbackEligible,
      });
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

  const handleStopAssistantResponse = useCallback(() => {
    if (!pendingAssistantResponse) {
      return;
    }

    const { id } = pendingAssistantResponse;
    const stoppedFeedback = createResponseStoppedFeedback(
      createMessageId("response-stopped"),
    );

    setPendingAssistantResponse(null);
    setMessages((currentMessages) =>
      currentMessages.flatMap((message) => {
        if (!isMessageItem(message) || message.id !== id) {
          return [message];
        }

        return message.content.trim().length === 0
          ? [stoppedFeedback]
          : [
              {
                ...message,
                status: "complete" as const,
                feedbackEligible: false,
                responseStopped: true,
              },
            ];
      }),
    );
  }, [createMessageId, pendingAssistantResponse]);

  const handleStarterPromptSelect = useCallback(
    (prompt: string) => {
      submitUserMessage(prompt);
    },
    [submitUserMessage],
  );

  const handleFindConsultant = useCallback(() => {
    setScheduledSpecialistState("matching");
  }, []);

  const handleCancelMatching = useCallback(() => {
    setScheduledSpecialistState("initial");
  }, []);

  const handleOpenSchedulePanel = useCallback(() => {
    setScheduledSpecialistState("scheduling");
    onSidePanelOpenChange?.(true);
  }, [onSidePanelOpenChange]);

  const handleBackToChat = useCallback(() => {
    setScheduledSpecialistState("matched");
    onSidePanelOpenChange?.(false);
  }, [onSidePanelOpenChange]);

  const handleBookMeeting = useCallback(
    (meeting: BookedMeeting) => {
      setBookedMeeting(meeting);
      setScheduledSpecialistState("booked");
      onSidePanelOpenChange?.(false);
    },
    [onSidePanelOpenChange],
  );

  function handleChatBodyScroll(event: UIEvent<HTMLDivElement>) {
    const nextHasScrolled = event.currentTarget.scrollTop > 0;

    setHasChatBodyScrolled((currentHasScrolled) =>
      currentHasScrolled === nextHasScrolled
        ? currentHasScrolled
        : nextHasScrolled,
    );
  }

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

  function shouldShowMessageFeedback(
    message: ConciergeThreadItem,
    index: number,
  ) {
    return (
      lead !== null &&
      hasUserMessages &&
      isMessageItem(message) &&
      message.role === "assistant" &&
      message.status === "complete" &&
      message.feedbackEligible === true &&
      !shouldShowStarterPrompts(message, index)
    );
  }

  function renderThreadItem(message: ConciergeThreadItem, index: number) {
    const showFeedback = shouldShowMessageFeedback(message, index);
    const showStarterPrompts = shouldShowStarterPrompts(message, index);
    const showStoppedFeedback =
      isMessageItem(message) && message.responseStopped === true;
    const timestamp = getPrototypeMessageTimestamp(index);

    if (message.kind === "inline-feedback") {
      return (
        <ChatInlineFeedback key={message.id} tone={message.tone}>
          {message.content}
        </ChatInlineFeedback>
      );
    }

    if (message.kind === "recommendation") {
      if (isScheduledSpecialistRecommendation(message.step)) {
        return (
          <ScheduledSpecialistCard
            key={`${message.id}-${scheduledSpecialistState}`}
            state={scheduledSpecialistState}
            bookedMeeting={bookedMeeting}
            onBookTime={handleFindConsultant}
            onCancelMatching={handleCancelMatching}
            onScheduleCall={handleOpenSchedulePanel}
          />
        );
      }

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
      if (isScheduledSpecialistAvailability(message.step)) {
        return (
          <ScheduledSpecialistCard
            key={`${message.id}-${scheduledSpecialistState}`}
            state={scheduledSpecialistState}
            bookedMeeting={bookedMeeting}
            onBookTime={handleFindConsultant}
            onCancelMatching={handleCancelMatching}
            onScheduleCall={handleOpenSchedulePanel}
          />
        );
      }

      return <AvailabilityCard key={message.id} step={message.step} />;
    }

    if (message.status === "thinking") {
      return <ChatThinkingMessage key={message.id} />;
    }

    const messageNode = (
      <ChatMessage
        role={message.role}
        aria-busy={message.status === "streaming" || undefined}
        timestamp={message.role === "user" ? timestamp : undefined}
      >
        {message.content}
      </ChatMessage>
    );

    if (showStarterPrompts || showFeedback || showStoppedFeedback) {
      return (
        <div key={message.id} className="flex flex-col items-start">
          {messageNode}
          {showStarterPrompts ? (
            <div className="chat-message-enter mt-md flex w-full">
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
          {showFeedback ? (
            <ChatMessageFeedbackFlow className="mt-sm" timestamp={timestamp} />
          ) : null}
          {showStoppedFeedback ? (
            <ChatInlineFeedback className="mt-sm" tone="neutral">
              Response stopped.
            </ChatInlineFeedback>
          ) : null}
        </div>
      );
    }

    return <Fragment key={message.id}>{messageNode}</Fragment>;
  }

  const thread = lead ? (
    <ChatThread aria-live="polite" aria-busy={isAssistantBusy || undefined}>
      {messages.map(renderThreadItem)}
      {isSchedulePanelOpen ? (
        <div aria-hidden="true" className="h-lg shrink-0" />
      ) : null}
    </ChatThread>
  ) : null;

  return (
    <ChatPanel
      variant={shellVariant}
      surface={phase === "onboarding" ? "welcome" : "default"}
      className={[isSchedulePanelOpen && "md:!w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <ChatHeader
        variant={variant}
        title={phase === "chat" ? HIRING_CONCIERGE_TITLE : undefined}
        onClose={onClose}
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
        transparent={phase === "onboarding"}
        showAiMark={phase === "chat"}
        aiMarkClassName="concierge-ai-mark"
      />

      {lead ? (
        isSchedulePanelOpen ? (
          <div
            data-chat-variant={variant}
            className="chat-schedule-layout min-h-0 flex-1"
          >
            <div className="hidden min-h-0 min-w-0 border-r border-border-faint md:flex">
              <ChatBody
                ref={chatBodyRef}
                onScroll={handleChatBodyScroll}
                className={
                  variant === "collapsed"
                    ? "chat-schedule-history [--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-collapsed-max)]"
                    : "chat-schedule-history"
                }
              >
                {thread}
              </ChatBody>
            </div>
            <SchedulePanel onBack={handleBackToChat} onBook={handleBookMeeting} />
          </div>
        ) : (
          <>
            <ChatBody ref={chatBodyRef} onScroll={handleChatBodyScroll}>
              {thread}
            </ChatBody>
            <ChatComposer
              variant={variant}
              showTopDivider={hasChatBodyScrolled}
              isResponding={isAssistantBusy}
              onStopResponse={handleStopAssistantResponse}
              inputProps={{
                value: draft,
                onChange: handleDraftChange,
                autoFocus: true,
              }}
              onSend={handleSendMessage}
              sendDisabled={draft.trim().length === 0 || isAssistantBusy}
            />
          </>
        )
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
