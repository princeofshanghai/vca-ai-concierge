"use client";

import {
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
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatInlineFeedback,
  ChatMessage,
  ChatMessageFeedbackFlow,
  ChatPanel,
  ChatResponseAttachment,
  ChatResponseBlock,
  ChatThinkingMessage,
  ChatThread,
  Prompt,
  RecommendationCard,
  type ChatComposerVoiceState,
  type ChatPanelVariant,
} from "@/components/chat/chat-ui";
import { ChatSidePanelLayout } from "@/components/chat/chat-side-panel";
import {
  startClassedViewTransition,
  useChatAssistantStream,
  useChatLatestMessageAnchor,
  type ChatMessageStreamStatus,
} from "@/components/chat/chat-motion";
import {
  SchedulePanel,
  ScheduledSpecialistCard,
  type BookedMeeting,
  type HighValueRecommendationState,
} from "@/components/flow-review/flow-review-chat-panel";
import { Button } from "@/components/primitives/button";
import { IdleSessionPrompt } from "@/components/primitives/idle-session-prompt";
import { InterimLoadingState } from "@/components/primitives/interim-loading-state";
import { useReviewShellState } from "@/components/review-shell/review-shell-state";
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

import {
  EntryLixChoiceScreen,
  EntryLixLeadFormScreen,
  EntryLixSuccessScreen,
} from "./entry-lix-test-screen";
import { OnboardingScreen, type OnboardingResult } from "./onboarding-screen";

export type ContactSalesEntry = "default" | "lix-test";

type ConciergePanelProps = Readonly<{
  contactSalesEntry?: ContactSalesEntry;
  variant?: ChatPanelVariant;
  className?: string;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  dockActionPosition?: "before-variant" | "after-variant";
  showCloseAction?: boolean;
  showHeaderAiMark?: boolean;
  onConversationStart?: () => void;
  onSessionEnd?: () => void;
  onUnreadActivity?: () => void;
  onSidePanelOpenChange?: (open: boolean) => void;
  confirmationDialog?: ReactNode;
  endFeedbackScreen?: ReactNode;
}>;

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
  streamDelayScale?: number;
  voicePlaybackText?: string;
}>;

type EntryLixStep = "choice" | "chat" | "form" | "success";
type VoiceModeState = "off" | ChatComposerVoiceState;

type ConciergePhase =
  | "entry-choice"
  | "entry-form"
  | "entry-success"
  | "onboarding"
  | "preparing"
  | "chat";

const INITIAL_LIVE_SCRIPT_INDEX = 0;
const MATCHING_DELAY_MS = 900;
const PREPARING_CHAT_DELAY_MS = 1200;
const IDLE_PROMPT_DELAY_MS = 45000;
const IDLE_SESSION_SECONDS = 8 * 60 + 22;
const ENTRY_LIX_FALLBACK_LEAD: OnboardingResult = {
  firstName: "there",
  lastName: "",
  workEmail: "",
  phoneNumber: "",
  company: "your company",
};
const VOICE_USER_TRANSCRIPTS = [
  "We need to hire about 40 roles in the next two quarters.",
  "Actually, can I talk to someone who can help us plan this?",
] as const;
const VOICE_AGENT_RESPONSES = [
  {
    text:
      "You are describing an urgent, high-volume hiring ramp. I can match you with a sales consultant who can help shape the first-wave plan.",
    spokenText:
      "You are describing an urgent, high-volume hiring ramp. I can match you with a sales consultant who can help shape the first-wave plan.",
  },
  {
    text:
      "Absolutely. I will set up a short conversation with a sales consultant who can help you pressure-test the hiring plan.",
    spokenText:
      "Absolutely. I will set up a short conversation with a sales consultant who can help you pressure-test the hiring plan.",
  },
] as const;
const VOICE_TEXT_STREAM_DELAY_SCALE = 2.8;

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

function formatIdleTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const liveFlowKeywordRoutes: ReadonlyArray<
  Readonly<{
    flowId: FlowReviewId;
    keywords: ReadonlyArray<string>;
  }>
> = [
  {
    flowId: "medium",
    keywords: ["sales", "contact"],
  },
  {
    flowId: "low",
    keywords: ["recruiter", "features"],
  },
];

function selectLiveFlowId(userMessage: string): FlowReviewId {
  const message = userMessage.toLowerCase();
  const route = liveFlowKeywordRoutes.find(({ keywords }) =>
    keywords.some((keyword) => message.includes(keyword)),
  );

  return route?.flowId ?? "high";
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

function getVoiceModeRecommendationStep(): FlowReviewRecommendationStep | null {
  const step = flowReviews.high.steps.find(
    (flowStep) => flowStep.id === "high-recommendation-card",
  );

  return step?.kind === "recommendation" ? step : null;
}

function getInterruptedAssistantText(fullText: string, visibleText: string) {
  const visibleLength = Math.min(visibleText.length, fullText.length);
  const nextWordStart = fullText.slice(visibleLength).search(/\S/);
  const partialStart =
    nextWordStart < 0 ? visibleLength : visibleLength + nextWordStart;
  const partialEnd = Math.min(fullText.length, partialStart + 4);
  const nextText = fullText.slice(0, Math.max(visibleLength, partialEnd));

  return nextText.trimEnd();
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
  contactSalesEntry = "default",
  variant = "collapsed",
  className,
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  dockActionPosition,
  showCloseAction = true,
  showHeaderAiMark = true,
  onConversationStart,
  onSessionEnd,
  onUnreadActivity,
  onSidePanelOpenChange,
  confirmationDialog,
  endFeedbackScreen,
}: ConciergePanelProps) {
  const { isSignedIn } = useReviewShellState();
  const [entryLixStep, setEntryLixStep] = useState<EntryLixStep>(() =>
    contactSalesEntry === "lix-test" ? "choice" : "chat",
  );
  const [lead, setLead] = useState<OnboardingResult | null>(null);
  const [preparingLead, setPreparingLead] =
    useState<OnboardingResult | null>(null);
  const [messages, setMessages] = useState<ReadonlyArray<ConciergeThreadItem>>(
    [],
  );
  const [draft, setDraft] = useState("");
  const [voiceModeState, setVoiceModeState] =
    useState<VoiceModeState>("off");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceTurnIndex, setVoiceTurnIndex] = useState(0);
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
  const [latestUserMessageAnchorKey, setLatestUserMessageAnchorKey] = useState<
    string | null
  >(null);
  const [isIdlePromptOpen, setIsIdlePromptOpen] = useState(false);
  const [idleRemainingSeconds, setIdleRemainingSeconds] = useState(
    IDLE_SESSION_SECONDS,
  );
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(0);
  const voiceCompletionTimerRef = useRef<number | null>(null);
  const voicePlaybackTimerRef = useRef<number | null>(null);
  const voiceTranscriptTimerRef = useRef<number | null>(null);

  const phase: ConciergePhase = lead
    ? "chat"
    : preparingLead
      ? "preparing"
      : contactSalesEntry === "lix-test" && entryLixStep === "choice"
        ? "entry-choice"
        : contactSalesEntry === "lix-test" && entryLixStep === "form"
          ? "entry-form"
          : contactSalesEntry === "lix-test" && entryLixStep === "success"
            ? "entry-success"
            : "onboarding";
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
  const isVoiceModeActive = voiceModeState !== "off";
  const visibleVoiceState: ChatComposerVoiceState =
    voiceModeState === "off" ? "idle" : voiceModeState;
  const {
    hasLatestBelow,
    handleScroll: handleLatestScroll,
    scrollToLatest,
  } = useChatLatestMessageAnchor({
    scrollRef: chatBodyRef,
    anchorKey: latestUserMessageAnchorKey,
    contentKey: messages,
  });

  const createMessageId = useCallback((prefix: string) => {
    const id = `${prefix}-${nextMessageIdRef.current}`;
    nextMessageIdRef.current += 1;
    return id;
  }, []);

  const clearVoiceTimers = useCallback(() => {
    if (voiceTranscriptTimerRef.current !== null) {
      window.clearInterval(voiceTranscriptTimerRef.current);
      voiceTranscriptTimerRef.current = null;
    }

    if (voiceCompletionTimerRef.current !== null) {
      window.clearTimeout(voiceCompletionTimerRef.current);
      voiceCompletionTimerRef.current = null;
    }

    if (voicePlaybackTimerRef.current !== null) {
      window.clearTimeout(voicePlaybackTimerRef.current);
      voicePlaybackTimerRef.current = null;
    }
  }, []);

  const stopVoicePlayback = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (typeof window.speechSynthesis !== "undefined") {
      window.speechSynthesis.cancel();
    }

    if (voicePlaybackTimerRef.current !== null) {
      window.clearTimeout(voicePlaybackTimerRef.current);
      voicePlaybackTimerRef.current = null;
    }
  }, []);

  const finishVoicePlayback = useCallback(() => {
    setVoiceModeState((currentState) =>
      currentState === "speaking" ? "idle" : currentState,
    );
  }, []);

  const startVoicePlayback = useCallback(
    (text: string) => {
      stopVoicePlayback();

      if (typeof window === "undefined") {
        return;
      }

      if (
        typeof window.speechSynthesis !== "undefined" &&
        typeof window.SpeechSynthesisUtterance !== "undefined"
      ) {
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.rate = 1.03;
        utterance.pitch = 1;
        utterance.onend = finishVoicePlayback;
        utterance.onerror = finishVoicePlayback;
        window.speechSynthesis.speak(utterance);
        return;
      }

      voicePlaybackTimerRef.current = window.setTimeout(
        finishVoicePlayback,
        Math.max(2200, text.split(/\s+/).length * 260),
      );
    },
    [finishVoicePlayback, stopVoicePlayback],
  );

  const queueAssistantResponse = useCallback(
    (
      text: string,
      options: Readonly<{
        surfaceAfter?: ConciergeSurface;
        feedbackEligible?: boolean;
        streamDelayScale?: number;
        voicePlaybackText?: string;
      }> = {},
    ) => {
      const {
        surfaceAfter,
        feedbackEligible,
        streamDelayScale,
        voicePlaybackText,
      } = options;
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
      setPendingAssistantResponse({
        id,
        text,
        surfaceAfter,
        streamDelayScale,
        voicePlaybackText,
      });
    },
    [createMessageId],
  );

  const completePendingAssistantResponse = useCallback(
    (response: PendingAssistantResponse) => {
      const { id, text, surfaceAfter } = response;

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
      onUnreadActivity?.();
    },
    [onUnreadActivity],
  );

  const handleAssistantStreamStart = useCallback(
    (response: PendingAssistantResponse) => {
      if (response.voicePlaybackText) {
        setVoiceModeState("speaking");
        startVoicePlayback(response.voicePlaybackText);
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          isMessageItem(message) && message.id === response.id
            ? { ...message, content: "", status: "streaming" }
            : message,
        ),
      );
    },
    [startVoicePlayback],
  );

  const handleAssistantStreamText = useCallback(
    (response: PendingAssistantResponse, visibleText: string) => {
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          isMessageItem(message) && message.id === response.id
            ? { ...message, content: visibleText, status: "streaming" }
            : message,
        ),
      );
    },
    [],
  );

  useChatAssistantStream({
    pendingResponse: pendingAssistantResponse,
    onStreamStart: handleAssistantStreamStart,
    onStreamText: handleAssistantStreamText,
    onComplete: completePendingAssistantResponse,
  });

  useEffect(() => {
    return () => {
      clearVoiceTimers();
      stopVoicePlayback();
    };
  }, [clearVoiceTimers, stopVoicePlayback]);

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
    handleLatestScroll();
  }, [handleLatestScroll, isSchedulePanelOpen]);

  const resetIdleSession = useCallback(() => {
    setIsIdlePromptOpen(false);
    setIdleRemainingSeconds(IDLE_SESSION_SECONDS);
  }, []);

  const endIdleSession = useCallback(() => {
    resetIdleSession();
    if (onSessionEnd) {
      onSessionEnd();
      return;
    }

    onClose?.();
  }, [onClose, onSessionEnd, resetIdleSession]);

  useEffect(() => {
    if (!lead || isIdlePromptOpen || isAssistantBusy || isSchedulePanelOpen) {
      return;
    }

    const idleTimer = window.setTimeout(() => {
      setIdleRemainingSeconds(IDLE_SESSION_SECONDS);
      setIsIdlePromptOpen(true);
    }, IDLE_PROMPT_DELAY_MS);

    return () => {
      window.clearTimeout(idleTimer);
    };
  }, [
    draft,
    isAssistantBusy,
    isIdlePromptOpen,
    isSchedulePanelOpen,
    lead,
    messages,
  ]);

  useEffect(() => {
    if (!isIdlePromptOpen) {
      return;
    }

    const countdownTimer = window.setInterval(() => {
      setIdleRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(countdownTimer);
          window.setTimeout(endIdleSession, 0);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(countdownTimer);
    };
  }, [endIdleSession, isIdlePromptOpen]);

  const startChat = useCallback(
    (result: OnboardingResult) => {
      const assistantId = createMessageId("assistant");

      resetIdleSession();
      clearVoiceTimers();
      stopVoicePlayback();
      setLead(result);
      setPreparingLead(null);
      setDraft("");
      setVoiceModeState("off");
      setVoiceTranscript("");
      setVoiceTurnIndex(0);
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
    },
    [
      createMessageId,
      clearVoiceTimers,
      onSidePanelOpenChange,
      resetIdleSession,
      stopVoicePlayback,
    ],
  );

  // The prototype keeps a brief interim state after "Start chat" so async
  // setup feels intentional before the thread appears.
  useEffect(() => {
    if (!preparingLead) {
      return;
    }

    const preparingTimer = window.setTimeout(() => {
      if (
        !startClassedViewTransition(() => {
          flushSync(() => startChat(preparingLead));
        })
      ) {
        startChat(preparingLead);
      }
    }, PREPARING_CHAT_DELAY_MS);

    return () => {
      window.clearTimeout(preparingTimer);
    };
  }, [preparingLead, startChat]);

  const handleOnboardingSubmit = useCallback(
    (result: OnboardingResult) => {
      onConversationStart?.();
      resetIdleSession();

      if (
        !startClassedViewTransition(() => {
          flushSync(() => setPreparingLead(result));
        })
      ) {
        setPreparingLead(result);
      }
    },
    [onConversationStart, resetIdleSession],
  );

  const handleEntryLixChatWithAi = useCallback(() => {
    onConversationStart?.();
    setEntryLixStep("chat");
  }, [onConversationStart]);

  const handleEntryLixFillOutForm = useCallback(() => {
    setEntryLixStep("form");
  }, []);

  const handleEntryLixBackToChoice = useCallback(() => {
    setEntryLixStep("choice");
  }, []);

  const handleEntryLixFormSubmit = useCallback(() => {
    setEntryLixStep("success");
  }, []);

  const handleEntryLixSuccessChatWithAi = useCallback(() => {
    handleOnboardingSubmit(ENTRY_LIX_FALLBACK_LEAD);
  }, [handleOnboardingSubmit]);

  const handleEntryLixSuccessDone = useCallback(() => {
    if (onSessionEnd) {
      onSessionEnd();
      return;
    }

    onClose?.();
  }, [onClose, onSessionEnd]);

  const handleDraftChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(event.currentTarget.value);
    },
    [],
  );

  const submitVoiceTranscript = useCallback(
    (transcript: string, turnIndex: number) => {
      if (!lead || transcript.trim().length === 0) {
        return;
      }

      const userMessageId = createMessageId("user");
      const response =
        VOICE_AGENT_RESPONSES[
          Math.min(turnIndex, VOICE_AGENT_RESPONSES.length - 1)
        ];
      const recommendationStep = getVoiceModeRecommendationStep();
      const surfaceAfter = recommendationStep
        ? ({
            id: createMessageId("surface"),
            kind: "recommendation",
            step: recommendationStep,
          } satisfies ConciergeRecommendation)
        : undefined;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          kind: "message",
          id: userMessageId,
          role: "user",
          content: transcript.trim(),
          status: "complete",
        },
      ]);
      setLatestUserMessageAnchorKey(userMessageId);
      setLiveFlowId("high");
      setLiveStepIndex(flowReviews.high.steps.length - 1);
      setVoiceModeState("thinking");
      setVoiceTurnIndex((currentTurnIndex) =>
        Math.max(currentTurnIndex, turnIndex + 1),
      );
      queueAssistantResponse(response.text, {
        feedbackEligible: true,
        streamDelayScale: VOICE_TEXT_STREAM_DELAY_SCALE,
        surfaceAfter,
        voicePlaybackText: response.spokenText,
      });
    },
    [createMessageId, lead, queueAssistantResponse],
  );

  const startVoiceListening = useCallback(
    (turnIndex = voiceTurnIndex) => {
      if (!lead) {
        return;
      }

      clearVoiceTimers();
      stopVoicePlayback();
      setVoiceModeState("listening");
      setVoiceTranscript("");

      const transcript =
        VOICE_USER_TRANSCRIPTS[
          Math.min(turnIndex, VOICE_USER_TRANSCRIPTS.length - 1)
        ];
      const words = transcript.split(" ");
      let wordIndex = 0;

      voiceTranscriptTimerRef.current = window.setInterval(() => {
        wordIndex += 1;
        setVoiceTranscript(words.slice(0, wordIndex).join(" "));

        if (wordIndex >= words.length) {
          if (voiceTranscriptTimerRef.current !== null) {
            window.clearInterval(voiceTranscriptTimerRef.current);
            voiceTranscriptTimerRef.current = null;
          }

          voiceCompletionTimerRef.current = window.setTimeout(() => {
            voiceCompletionTimerRef.current = null;
            submitVoiceTranscript(transcript, turnIndex);
          }, 420);
        }
      }, 155);
    },
    [
      clearVoiceTimers,
      lead,
      stopVoicePlayback,
      submitVoiceTranscript,
      voiceTurnIndex,
    ],
  );

  const handleVoiceModeStart = useCallback(() => {
    setVoiceModeState("listening");
    startVoiceListening();
  }, [startVoiceListening]);

  const handleVoiceModeExit = useCallback(() => {
    clearVoiceTimers();
    stopVoicePlayback();
    setVoiceModeState("off");
    setVoiceTranscript("");
  }, [clearVoiceTimers, stopVoicePlayback]);

  const handleVoiceInterrupt = useCallback(() => {
    clearVoiceTimers();
    stopVoicePlayback();

    if (pendingAssistantResponse) {
      const { id, text } = pendingAssistantResponse;

      setPendingAssistantResponse(null);
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          isMessageItem(message) && message.id === id
            ? {
                ...message,
                content: getInterruptedAssistantText(text, message.content),
                status: "complete" as const,
                feedbackEligible: false,
              }
            : message,
        ),
      );
    }

    startVoiceListening();
  }, [
    clearVoiceTimers,
    pendingAssistantResponse,
    startVoiceListening,
    stopVoicePlayback,
  ]);

  const submitUserMessage = useCallback(
    (messageText: string) => {
      const text = messageText.trim();

      if (!lead || text.length === 0 || isAssistantBusy) {
        return;
      }

      const userMessageId = createMessageId("user");

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          kind: "message",
          id: userMessageId,
          role: "user",
          content: text,
          status: "complete",
        },
      ]);
      setLatestUserMessageAnchorKey(userMessageId);
      setDraft("");
      const nextFlowId = liveFlowId ?? selectLiveFlowId(text);
      const nextTurn = getNextScriptedAssistantTurn({
        flowId: nextFlowId,
        currentStepIndex: liveFlowId ? liveStepIndex : INITIAL_LIVE_SCRIPT_INDEX,
        createSurfaceId: () => createMessageId("surface"),
      });

      setLiveFlowId(nextFlowId);
      setLiveStepIndex(nextTurn.nextStepIndex);
      if (isVoiceModeActive) {
        setVoiceModeState("thinking");
      }
      queueAssistantResponse(nextTurn.content, {
        surfaceAfter: nextTurn.surfaceAfter,
        feedbackEligible: nextTurn.feedbackEligible,
        ...(isVoiceModeActive
          ? {
              streamDelayScale: VOICE_TEXT_STREAM_DELAY_SCALE,
              voicePlaybackText: nextTurn.content,
            }
          : {}),
      });
    },
    [
      createMessageId,
      isAssistantBusy,
      isVoiceModeActive,
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
    handleLatestScroll();

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
        streamStatus={message.status}
        streamText={message.content}
        timestamp={message.role === "user" ? timestamp : undefined}
      >
        {message.content}
      </ChatMessage>
    );

    return (
      <ChatResponseBlock key={message.id}>
        {messageNode}
        {showStarterPrompts ? (
          <ChatResponseAttachment>
            <div className="flex max-w-[33rem] flex-wrap gap-sm pr-sm">
              {STARTER_PROMPTS.map((prompt) => (
                <Prompt
                  key={prompt}
                  prompt={prompt}
                  onPromptSelect={handleStarterPromptSelect}
                />
              ))}
            </div>
          </ChatResponseAttachment>
        ) : null}
        {showFeedback ? (
          <ChatResponseAttachment gap="sm">
            <ChatMessageFeedbackFlow timestamp={timestamp} />
          </ChatResponseAttachment>
        ) : null}
        {showStoppedFeedback ? (
          <ChatResponseAttachment gap="sm">
            <ChatInlineFeedback tone="neutral">Response stopped.</ChatInlineFeedback>
          </ChatResponseAttachment>
        ) : null}
      </ChatResponseBlock>
    );
  }

  const thread = lead ? (
    <ChatThread aria-live="polite" aria-busy={isAssistantBusy || undefined}>
      {messages.map(renderThreadItem)}
      {isSchedulePanelOpen ? (
        <div aria-hidden="true" className="h-lg shrink-0" />
      ) : null}
    </ChatThread>
  ) : null;
  const showEntryLixBackAction =
    contactSalesEntry === "lix-test" &&
    (phase === "entry-form" || phase === "onboarding");

  return (
    <ChatPanel
      variant={shellVariant}
      surface={
        phase === "chat" || phase === "preparing" ? "default" : "welcome"
      }
      className={[isSchedulePanelOpen && "md:!w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <ChatHeader
        variant={variant}
        title={phase === "chat" ? HIRING_CONCIERGE_TITLE : undefined}
        backLabel="Back to contact options"
        backIcon={showEntryLixBackAction ? "arrow-left" : undefined}
        backIconSize={showEntryLixBackAction ? "small" : undefined}
        onClose={onClose}
        onBack={showEntryLixBackAction ? handleEntryLixBackToChoice : undefined}
        dockActionPosition={dockActionPosition}
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
        showCloseAction={showCloseAction}
        transparent={phase !== "chat" && phase !== "preparing"}
        showAiMark={phase === "chat" && showHeaderAiMark}
        aiMarkClassName="concierge-ai-mark"
      />

      {endFeedbackScreen ? (
        endFeedbackScreen
      ) : lead ? (
        isSchedulePanelOpen ? (
          <ChatSidePanelLayout
            chatBodyRef={chatBodyRef}
            history={thread}
            onChatBodyScroll={handleChatBodyScroll}
            onJumpToLatest={scrollToLatest}
            sidePanel={
              <SchedulePanel
                onBack={handleBackToChat}
                onBook={handleBookMeeting}
              />
            }
            showJumpToLatest={hasLatestBelow}
            variant={variant}
          />
        ) : (
          <>
            <ChatBody
              ref={chatBodyRef}
              onJumpToLatest={scrollToLatest}
              onScroll={handleChatBodyScroll}
              showJumpToLatest={hasLatestBelow}
            >
              {thread}
            </ChatBody>
            <ChatComposer
              variant={variant}
              showTopDivider={hasChatBodyScrolled}
              isResponding={isAssistantBusy}
              onStopResponse={handleStopAssistantResponse}
              onVoiceInterrupt={handleVoiceInterrupt}
              onVoiceListen={startVoiceListening}
              onVoiceModeExit={handleVoiceModeExit}
              onVoiceModeStart={handleVoiceModeStart}
              showAttachAction={false}
              inputProps={{
                value: draft,
                onChange: handleDraftChange,
                autoFocus: true,
              }}
              onSend={handleSendMessage}
              sendDisabled={
                draft.trim().length === 0 || isAssistantBusy
              }
              voiceModeActive={isVoiceModeActive}
              voiceState={visibleVoiceState}
              voiceTranscript={voiceTranscript}
            />
          </>
        )
      ) : phase === "preparing" ? (
        <InterimLoadingState
          title="Your AI assistant is getting ready"
        />
      ) : phase === "entry-choice" ? (
        <EntryLixChoiceScreen
          onChatWithAi={handleEntryLixChatWithAi}
          onFillOutForm={handleEntryLixFillOutForm}
        />
      ) : phase === "entry-form" ? (
        <EntryLixLeadFormScreen onSubmit={handleEntryLixFormSubmit} />
      ) : phase === "entry-success" ? (
        <EntryLixSuccessScreen
          onChatWithAi={handleEntryLixSuccessChatWithAi}
          onDone={handleEntryLixSuccessDone}
        />
      ) : (
        // Re-key on the demo preset so toggling between signed-in and
        // signed-out in the review shell remounts the screen with fresh
        // state instead of stacking runtime overrides.
        <OnboardingScreen
          key={isSignedIn ? "signed-in" : "signed-out"}
          headline={
            contactSalesEntry === "lix-test" ? "Before we begin" : undefined
          }
          isSignedIn={isSignedIn}
          onSubmit={handleOnboardingSubmit}
          showAiMark={contactSalesEntry !== "lix-test"}
          subcopy={contactSalesEntry === "lix-test" ? null : undefined}
        />
      )}
      {lead && isIdlePromptOpen && !endFeedbackScreen ? (
        <IdleSessionPrompt
          title="Still there?"
          description="Your hiring chat will close soon."
          timeRemaining={`${formatIdleTime(idleRemainingSeconds)} remaining`}
          primaryActionLabel="Continue chat"
          secondaryActionLabel="End chat"
          onPrimaryAction={resetIdleSession}
          onSecondaryAction={endIdleSession}
        />
      ) : null}
      {confirmationDialog}
    </ChatPanel>
  );
}
