"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type UIEvent,
} from "react";

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
  useChatAssistantStream,
  type ChatMessageStreamStatus,
  type ChatPanelVariant,
} from "@/components/chat";
import { PREMIUM_CONCIERGE_TITLE } from "@/lib/concierge-copy";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

import {
  premiumHighSignalPostRecommendationPromptIds,
  premiumHighSignalWelcomeMessage,
  premiumLowSignalWelcomeMessage,
  premiumPostRecommendationPromptIds,
  premiumPromptLabels,
  premiumPromptRowsBySurveyStep,
  type PremiumConversationFlow,
  type PremiumConversationStep,
  type PremiumLiveMode,
  type PremiumPromptId,
  type PremiumSurveyStep,
} from "./premium-concierge-flows";
import { PremiumProductRecommendationCard } from "./premium-product-recommendation-card";
import type { PremiumPlanId } from "./premium-plan-data";

type PremiumLiveMessage = Readonly<{
  id: string;
  kind: "message";
  role: "assistant" | "user";
  content: string;
  status: ChatMessageStreamStatus;
  feedbackEligible?: boolean;
  responseStopped?: boolean;
}>;

type PremiumLiveRecommendation = Readonly<{
  id: string;
  kind: "product-recommendation";
  planId: PremiumPlanId;
}>;

type PremiumLiveInlineFeedback = Readonly<{
  id: string;
  kind: "inline-feedback";
  tone: "neutral";
  content: string;
}>;

type PremiumLiveItem =
  | PremiumLiveMessage
  | PremiumLiveRecommendation
  | PremiumLiveInlineFeedback;

type PremiumScriptedResponse = Readonly<{
  messages: ReadonlyArray<string>;
  recommendationPlanId?: PremiumPlanId;
  nextPrompts?: ReadonlyArray<PremiumPromptId> | null;
}>;

type PremiumTypedIntent =
  | "business-growth"
  | "career"
  | "compare"
  | "features"
  | "hiring"
  | "mismatch"
  | "trial"
  | "unsure"
  | "general";

type PremiumPendingAssistantResponse = Readonly<{
  id: string;
  text: string;
  remainingMessages: ReadonlyArray<PremiumLiveMessage>;
  recommendation?: PremiumLiveRecommendation;
  nextPrompts?: ReadonlyArray<PremiumPromptId> | null;
}>;

function getLiveWelcomeMessage(liveMode: PremiumLiveMode) {
  return liveMode === "high-signal"
    ? premiumHighSignalWelcomeMessage
    : premiumLowSignalWelcomeMessage;
}

function getLiveWelcomeId(
  context: PremiumSurveyStep,
  liveMode: PremiumLiveMode,
) {
  return `live-welcome-${liveMode}-${context}`;
}

function getInitialLiveMessage(
  context: PremiumSurveyStep,
  liveMode: PremiumLiveMode,
): PremiumLiveMessage {
  return {
    id: getLiveWelcomeId(context, liveMode),
    kind: "message",
    role: "assistant",
    content: "",
    status: "thinking",
  };
}

function getInitialPendingAssistantResponse(
  context: PremiumSurveyStep,
  liveMode: PremiumLiveMode,
): PremiumPendingAssistantResponse {
  if (liveMode === "high-signal") {
    return {
      id: getLiveWelcomeId(context, liveMode),
      text: getLiveWelcomeMessage(liveMode),
      remainingMessages: [],
      recommendation: {
        id: `live-recommendation-${liveMode}-${context}`,
        kind: "product-recommendation",
        planId: "business-suite",
      },
      nextPrompts: premiumHighSignalPostRecommendationPromptIds,
    };
  }

  return {
    id: getLiveWelcomeId(context, liveMode),
    text: getLiveWelcomeMessage(liveMode),
    remainingMessages: [],
    nextPrompts: premiumPromptRowsBySurveyStep[context],
  };
}

function getPromptLabel(promptId: PremiumPromptId) {
  return premiumPromptLabels[promptId];
}

function renderPremiumMessageContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);

  if (parts.length === 1) {
    return content;
  }

  return parts.map((part, index) => {
    const strongMatch = part.match(/^\*\*(.*)\*\*$/);

    if (strongMatch) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold">
          {strongMatch[1]}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function buildPremiumPromptResponse({
  liveMode,
  promptId,
}: {
  liveMode: PremiumLiveMode;
  promptId: PremiumPromptId;
}): PremiumScriptedResponse {
  if (promptId === "free-trial") {
    return {
      messages: [
        "The page shows a 1-month free trial, and you can cancel anytime. I would still pick the plan around what you want Premium to help with first, so the trial tests the right thing.",
      ],
      nextPrompts: [
        "help-pick-plan",
        "premium-features",
        "compare-career-business",
      ],
    };
  }

  if (promptId === "help-pick-plan") {
    return {
      messages: [
        "Absolutely. Since Premium plans are built for different outcomes, what would make Premium feel worth it for you right now?",
      ],
      nextPrompts: null,
    };
  }

  if (promptId === "premium-features") {
    return {
      messages: [
        "Premium features depend on the plan. Career is for job search, Business is for research and networking, and Business Suite is for customer growth, visibility, and light hiring. What are you hoping Premium helps with most?",
      ],
      nextPrompts: null,
    };
  }

  if (promptId === "mixed-goals") {
    return {
      messages: [
        "That is common. If the main goal is getting hired, Career is the cleaner fit. If it is business growth, visibility, or customers, Business or Business Suite becomes more relevant. Which goal matters most this month?",
      ],
      nextPrompts: null,
    };
  }

  if (promptId === "compare-career-business") {
    return {
      messages: [
        "Career is strongest when the main goal is getting hired or advancing your own career. Business is stronger when you are researching people, growing your network, and building professional credibility.",
      ],
      nextPrompts: ["free-trial", "mixed-goals", "help-pick-plan"],
    };
  }

  if (promptId === "compare-business-suite") {
    return {
      messages: [
        "Business helps with research, networking, profile credibility, and company insights. Business Suite goes further for active growth: client suggestions, client insights, post boosts, 30 InMails, and job promotions.",
      ],
      nextPrompts: ["why-business-suite", "is-business-enough"],
    };
  }

  if (promptId === "difference-business-suite") {
    return {
      messages: [
        "Business is best when you mainly want research, networking, profile credibility, and company insights. Business Suite adds more active growth tools: client suggestions, post boosts, more InMails, and job promotions.",
      ],
      nextPrompts: ["why-business-suite", "recommendation-mismatch"],
    };
  }

  if (promptId === "why-business-suite") {
    return {
      messages: [
        "Business Suite includes daily prospect suggestions and client insights for finding customers, monthly post boosts and 30 InMails for visibility, and monthly job promotions for light hiring support.",
      ],
      nextPrompts:
        liveMode === "high-signal"
          ? ["difference-business-suite", "recommendation-mismatch"]
          : ["compare-business-suite", "is-business-enough"],
    };
  }

  if (promptId === "is-business-enough") {
    return {
      messages: [
        "Business may be enough if you mainly want research, networking, profile credibility, and company insights. I would choose Business Suite if you expect to actively find customers, expand reach, and support hiring from the same plan.",
      ],
      nextPrompts: ["why-business-suite", "compare-business-suite"],
    };
  }

  if (promptId === "recommendation-mismatch") {
    return {
      messages: [
        "Got it. Tell me what feels off, and I can recalibrate the recommendation.",
      ],
      nextPrompts: null,
    };
  }

  return {
    messages: [
      "I would keep the decision anchored on the outcome: Business is better for research and networking, while Business Suite is better for customer growth, visibility, and light hiring in one plan.",
    ],
    nextPrompts: null,
  };
}

function getPremiumTypedIntent(message: string): PremiumTypedIntent {
  const normalizedMessage = message.toLowerCase();

  if (/\b(trial|free|cancel|price|cost|pay|billing)\b/.test(normalizedMessage)) {
    return "trial";
  }

  if (
    /\b(feature|features|include|included|inmail|inmails|boost|boosts|insight|insights)\b/.test(
      normalizedMessage,
    )
  ) {
    return "features";
  }

  if (/\b(compare|difference|versus| vs |which plan)\b/.test(normalizedMessage)) {
    return "compare";
  }

  if (
    /\b(wrong|off|not right|doesn't|doesnt|don't|dont|not really|no\b|mismatch)\b/.test(
      normalizedMessage,
    )
  ) {
    return "mismatch";
  }

  if (
    /\b(job|jobs|career|hired|hiring manager|recruiter|interview|application|applying)\b/.test(
      normalizedMessage,
    )
  ) {
    return "career";
  }

  if (/\b(hire|hiring|applicant|candidate|candidates|recruit)\b/.test(normalizedMessage)) {
    return "hiring";
  }

  if (
    /\b(client|clients|customer|customers|lead|leads|sales|sell|selling|visibility|brand|network|networking|business|growth)\b/.test(
      normalizedMessage,
    )
  ) {
    return "business-growth";
  }

  if (/\b(not sure|unsure|help|recommend|pick|choose|confused)\b/.test(normalizedMessage)) {
    return "unsure";
  }

  return "general";
}

function buildPremiumTypedResponse({
  hasRecommendation,
  message,
  liveMode,
  typedTurnCount,
}: {
  hasRecommendation: boolean;
  message: string;
  liveMode: PremiumLiveMode;
  typedTurnCount: number;
}): PremiumScriptedResponse {
  const intent = getPremiumTypedIntent(message);

  if (intent === "trial") {
    return {
      messages: [
        "Yes. The page shows a 1-month free trial, and you can cancel anytime. I would use the trial to test the plan against the outcome you care about most, not just the feature list.",
      ],
      nextPrompts: hasRecommendation
        ? premiumPostRecommendationPromptIds
        : ["help-pick-plan", "premium-features", "compare-career-business"],
    };
  }

  if (intent === "features") {
    return {
      messages: [
        "Premium features vary by plan. Career is more job-search focused, Business is stronger for research and networking, and Business Suite adds customer growth, visibility, and light hiring tools.",
      ],
      nextPrompts: hasRecommendation
        ? premiumPostRecommendationPromptIds
        : ["help-pick-plan", "compare-career-business", "free-trial"],
    };
  }

  if (intent === "compare") {
    return {
      messages: [
        "The simplest split is this: Career helps most when the goal is getting hired, Business helps with research and networking, and Business Suite is the better fit when you also want customer growth, visibility, or hiring support.",
      ],
      nextPrompts: hasRecommendation
        ? ["why-business-suite", "is-business-enough"]
        : ["help-pick-plan", "free-trial", "premium-features"],
    };
  }

  if (hasRecommendation && (intent === "mismatch" || intent === "career")) {
    return {
      messages: [
        "Got it. If this is mainly about your own job search or career move, I would recalibrate away from Business Suite and look at Career first.",
        "Career is the cleaner fit for getting hired and messaging hiring managers without paying for business growth tools you may not need.",
      ],
      recommendationPlanId: "career",
      nextPrompts: ["compare-career-business", "free-trial", "premium-features"],
    };
  }

  if (liveMode === "high-signal" && hasRecommendation) {
    return {
      messages: [
        "Thanks, that helps. I would use Business Suite if clients, visibility, or light hiring are part of the goal. If those are not the right priorities, I would step back and recalibrate around what you actually want Premium to help with.",
      ],
      nextPrompts: [
        "help-pick-plan",
        "premium-features",
        "difference-business-suite",
      ],
    };
  }

  if (!hasRecommendation && intent === "career") {
    return {
      messages: [
        "That points more toward Career than Business Suite. Career is designed around getting hired, finding stronger-fit jobs, and reaching hiring managers.",
        "One useful check: is this mostly about your own job search, or are you also trying to grow a business or hire people?",
      ],
      nextPrompts: ["compare-career-business", "free-trial", "premium-features"],
    };
  }

  if (!hasRecommendation && intent === "mismatch") {
    return {
      messages: [
        "Got it. I won't assume the plan yet.",
        "Tell me what feels off, and I can narrow the recommendation around the outcome you actually care about.",
      ],
      nextPrompts: ["help-pick-plan", "premium-features", "free-trial"],
    };
  }

  if (!hasRecommendation && typedTurnCount === 0) {
    if (intent === "unsure" || intent === "general") {
      return {
        messages: [
          "Totally okay. I would start with the outcome, not the plan names.",
          "What would make Premium feel worth it right now: getting hired, growing your network, finding clients, or hiring?",
        ],
        nextPrompts: ["compare-career-business", "free-trial", "premium-features"],
      };
    }

    return {
      messages: [
        intent === "hiring"
          ? "Nice, that helps. Hiring is one of the reasons Business Suite may be relevant here."
          : "Nice, that helps. Customers and visibility are exactly the kinds of goals Premium can support.",
        "Before I pick a plan, one quick question: do you expect hiring to matter soon too?",
      ],
      nextPrompts: null,
    };
  }

  if (!hasRecommendation) {
    if (intent === "career") {
      return {
        messages: [
          "Great, that gives me enough to make a call.",
          "I'd recommend Career because your need sounds centered on your own job search, not customer growth or hiring.",
          "Good news: **you can start with the 1-month free trial**, so you can test whether it actually supports that goal before committing.",
        ],
        recommendationPlanId: "career",
        nextPrompts: ["compare-career-business", "free-trial", "premium-features"],
      };
    }

    return {
      messages: [
        "Great, that gives me enough to make a call.",
        "I'd recommend Business Suite because it fits the full mix: finding customers, growing visibility, and keeping hiring support nearby.",
        "Good news: **you can start with the 1-month free trial**, so you can test whether it actually supports those goals before committing.",
      ],
      recommendationPlanId: "business-suite",
      nextPrompts: premiumPostRecommendationPromptIds,
    };
  }

  if (typedTurnCount === 0) {
    return {
      messages: [
        "That makes sense. The cleanest next step is to use the trial to test whether Business Suite actually supports the outcomes you care about before committing.",
      ],
      nextPrompts: premiumPostRecommendationPromptIds,
    };
  }

  return {
    messages: [
      "I would keep the decision anchored on the outcome: if you mainly need career momentum, look at Career; if you need business growth across customers and visibility, Business Suite remains the stronger fit.",
    ],
    nextPrompts: null,
  };
}

function isPremiumLiveMessage(
  item: PremiumLiveItem,
): item is PremiumLiveMessage {
  return item.kind === "message";
}

function createResponseStoppedFeedback(id: string): PremiumLiveInlineFeedback {
  return {
    id,
    kind: "inline-feedback",
    tone: "neutral",
    content: "Response stopped.",
  };
}

function PremiumPromptRow({
  prompts,
  readOnly = false,
  animated = true,
  onPromptSelect,
}: Readonly<{
  prompts: ReadonlyArray<PremiumPromptId>;
  readOnly?: boolean;
  animated?: boolean;
  onPromptSelect?: (promptId: PremiumPromptId) => void;
}>) {
  return (
    <div
      className={[animated && "chat-message-enter", "flex w-full"]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex max-w-[33rem] flex-wrap gap-sm pr-sm">
        {prompts.map((promptId) => {
          const label = getPromptLabel(promptId);

          return (
            <Prompt
              key={promptId}
              prompt={label}
              aria-disabled={readOnly || undefined}
              tabIndex={readOnly ? -1 : undefined}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                if (!readOnly) {
                  onPromptSelect?.(promptId);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function PremiumConciergePanel({
  variant = "collapsed",
  className,
  context = "use-case",
  flow,
  liveMode = "low-signal",
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  showCloseAction = true,
}: Readonly<{
  variant?: ChatPanelVariant;
  className?: string;
  context?: PremiumSurveyStep;
  flow?: PremiumConversationFlow;
  liveMode?: PremiumLiveMode;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  showCloseAction?: boolean;
}>) {
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const liveItemIdRef = useRef(0);
  const previousContextRef = useRef(context);
  const previousLiveModeRef = useRef(liveMode);
  const [draft, setDraft] = useState("");
  const [liveItems, setLiveItems] = useState<ReadonlyArray<PremiumLiveItem>>(
    () => (flow ? [] : [getInitialLiveMessage(context, liveMode)]),
  );
  const [activePrompts, setActivePrompts] = useState<
    ReadonlyArray<PremiumPromptId> | null
  >(null);
  const [pendingAssistantResponse, setPendingAssistantResponse] =
    useState<PremiumPendingAssistantResponse | null>(() =>
      flow ? null : getInitialPendingAssistantResponse(context, liveMode),
    );
  const [hasLiveInteracted, setHasLiveInteracted] = useState(false);
  const [hasRecommendation, setHasRecommendation] = useState(false);
  const [typedTurnCount, setTypedTurnCount] = useState(0);
  const [hasChatBodyScrolled, setHasChatBodyScrolled] = useState(false);
  const isAssistantBusy =
    pendingAssistantResponse !== null ||
    liveItems.some(
      (item) =>
        isPremiumLiveMessage(item) &&
        item.role === "assistant" &&
        (item.status === "thinking" || item.status === "streaming"),
    );
  const composerPlaceholder = "Send a message";

  const createLiveItemId = useCallback((prefix: string) => {
    liveItemIdRef.current += 1;
    return `${prefix}-${liveItemIdRef.current}`;
  }, []);

  const appendScriptedResponse = useCallback(
    ({
      response,
      userMessage,
    }: {
      response: PremiumScriptedResponse;
      userMessage: string;
    }) => {
      const [firstAssistantMessage = "", ...remainingAssistantMessages] =
        response.messages;
      const assistantId = createLiveItemId("live-assistant");
      const remainingMessages = remainingAssistantMessages.map(
        (content): PremiumLiveMessage => ({
          id: createLiveItemId("live-assistant"),
          kind: "message",
          role: "assistant",
          content,
          status: "complete",
        }),
      );
      const recommendation = response.recommendationPlanId
        ? ({
            id: createLiveItemId("live-recommendation"),
            kind: "product-recommendation",
            planId: response.recommendationPlanId,
          } satisfies PremiumLiveRecommendation)
        : undefined;
      const nextItems: Array<PremiumLiveItem> = [
        {
          id: createLiveItemId("live-user"),
          kind: "message",
          role: "user",
          content: userMessage,
          status: "complete",
        },
        {
          id: assistantId,
          kind: "message",
          role: "assistant",
          content: "",
          status: "thinking",
        },
      ];

      setLiveItems((currentItems) => [...currentItems, ...nextItems]);
      setActivePrompts(null);
      setPendingAssistantResponse({
        id: assistantId,
        text: firstAssistantMessage,
        remainingMessages,
        recommendation,
        nextPrompts: response.nextPrompts ?? null,
      });
    },
    [createLiveItemId],
  );

  useEffect(() => {
    if (
      flow ||
      hasLiveInteracted ||
      (previousContextRef.current === context &&
        previousLiveModeRef.current === liveMode)
    ) {
      return;
    }

    previousContextRef.current = context;
    previousLiveModeRef.current = liveMode;
    setDraft("");
    setLiveItems([getInitialLiveMessage(context, liveMode)]);
    setActivePrompts(null);
    setHasRecommendation(false);
    setTypedTurnCount(0);
    setPendingAssistantResponse(
      getInitialPendingAssistantResponse(context, liveMode),
    );
  }, [context, flow, hasLiveInteracted, liveMode]);

  const handlePromptSelect = useCallback(
    (promptId: PremiumPromptId) => {
      const response = buildPremiumPromptResponse({ liveMode, promptId });

      setDraft("");
      setHasLiveInteracted(true);
      setActivePrompts(null);
      appendScriptedResponse({
        response,
        userMessage: getPromptLabel(promptId),
      });
    },
    [appendScriptedResponse, liveMode],
  );

  const handleDraftChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setDraft(event.currentTarget.value);
    },
    [],
  );

  const handleSendMessage = useCallback(() => {
    const userMessage = draft.trim();

    if (!userMessage || isAssistantBusy) {
      return;
    }

    const response = buildPremiumTypedResponse({
      hasRecommendation,
      message: userMessage,
      liveMode,
      typedTurnCount,
    });

    setDraft("");
    setHasLiveInteracted(true);
    setTypedTurnCount((currentCount) => currentCount + 1);
    appendScriptedResponse({ response, userMessage });
  }, [
    appendScriptedResponse,
    draft,
    hasRecommendation,
    isAssistantBusy,
    liveMode,
    typedTurnCount,
  ]);

  const handleStopAssistantResponse = useCallback(() => {
    if (!pendingAssistantResponse) {
      return;
    }

    const { id } = pendingAssistantResponse;
    const stoppedFeedback = createResponseStoppedFeedback(
      createLiveItemId("response-stopped"),
    );

    setPendingAssistantResponse(null);
    setActivePrompts(null);
    setLiveItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (!isPremiumLiveMessage(item) || item.id !== id) {
          return [item];
        }

        return item.content.trim().length === 0
          ? [stoppedFeedback]
          : [
              {
                ...item,
                status: "complete" as const,
                feedbackEligible: false,
                responseStopped: true,
              },
            ];
      }),
    );
  }, [createLiveItemId, pendingAssistantResponse]);

  const completePendingAssistantResponse = useCallback(
    (response: PremiumPendingAssistantResponse) => {
      const {
        id,
        text,
        remainingMessages,
        recommendation,
        nextPrompts,
      } = response;

      setLiveItems((currentItems) => {
        const completedItems = currentItems.map((item) =>
          isPremiumLiveMessage(item) && item.id === id
            ? { ...item, content: text, status: "complete" as const }
            : item,
        );

        return [
          ...completedItems,
          ...remainingMessages,
          ...(recommendation ? [recommendation] : []),
        ];
      });
      if (recommendation) {
        setHasRecommendation(true);
      }
      setActivePrompts(nextPrompts ?? null);
      setPendingAssistantResponse(null);
    },
    [],
  );

  const handleAssistantStreamStart = useCallback(
    (response: PremiumPendingAssistantResponse) => {
      setLiveItems((currentItems) =>
        currentItems.map((item) =>
          isPremiumLiveMessage(item) && item.id === response.id
            ? { ...item, content: "", status: "streaming" }
            : item,
        ),
      );
    },
    [],
  );

  const handleAssistantStreamText = useCallback(
    (response: PremiumPendingAssistantResponse, visibleText: string) => {
      setLiveItems((currentItems) =>
        currentItems.map((item) =>
          isPremiumLiveMessage(item) && item.id === response.id
            ? { ...item, content: visibleText, status: "streaming" }
            : item,
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
    const chatBody = chatBodyRef.current;

    if (!chatBody) {
      return;
    }

    chatBody.scrollTo({ top: chatBody.scrollHeight });
    setHasChatBodyScrolled(chatBody.scrollTop > 0);
  }, [activePrompts, context, flow, hasLiveInteracted, liveItems]);

  function handleChatBodyScroll(event: UIEvent<HTMLDivElement>) {
    const nextHasScrolled = event.currentTarget.scrollTop > 0;

    setHasChatBodyScrolled((currentHasScrolled) =>
      currentHasScrolled === nextHasScrolled
        ? currentHasScrolled
        : nextHasScrolled,
    );
  }

  function renderConversationStep(step: PremiumConversationStep, index: number) {
    const attachedPromptStep = flow?.steps[index + 1];
    const attachedPrompts =
      attachedPromptStep?.kind === "prompt-row" ? attachedPromptStep.prompts : null;

    if (step.kind === "prompt-row") {
      return null;
    }

    if (step.kind === "product-recommendation") {
      const recommendationCard = (
        <PremiumProductRecommendationCard planId={step.planId} />
      );

      if (attachedPrompts) {
        return (
          <ChatResponseBlock key={step.id}>
            {recommendationCard}
            <ChatResponseAttachment>
              <PremiumPromptRow
                prompts={attachedPrompts}
                readOnly
                animated={false}
              />
            </ChatResponseAttachment>
          </ChatResponseBlock>
        );
      }

      return (
        <ChatResponseBlock key={step.id}>{recommendationCard}</ChatResponseBlock>
      );
    }

    const showFeedback = step.role === "assistant";
    const timestamp = getPrototypeMessageTimestamp(index);
    const messageNode = (
      <ChatMessage role={step.role} timestamp={showFeedback ? undefined : timestamp}>
        {renderPremiumMessageContent(step.content)}
      </ChatMessage>
    );

    return (
      <ChatResponseBlock key={step.id}>
        {messageNode}
        {attachedPrompts ? (
          <ChatResponseAttachment>
            <PremiumPromptRow
              prompts={attachedPrompts}
              readOnly
              animated={false}
            />
          </ChatResponseAttachment>
        ) : null}
        {showFeedback ? (
          <ChatResponseAttachment gap="sm">
            <ChatMessageFeedbackFlow timestamp={timestamp} />
          </ChatResponseAttachment>
        ) : null}
      </ChatResponseBlock>
    );
  }

  function renderLiveItem(
    item: PremiumLiveItem,
    index: number,
    attachedPrompts: ReadonlyArray<PremiumPromptId> | null = null,
  ) {
    if (item.kind === "product-recommendation") {
      const recommendationCard = (
        <PremiumProductRecommendationCard planId={item.planId} />
      );

      if (attachedPrompts) {
        return (
          <ChatResponseBlock key={item.id}>
            {recommendationCard}
            <ChatResponseAttachment>
              <PremiumPromptRow
                prompts={attachedPrompts}
                animated={false}
                onPromptSelect={handlePromptSelect}
              />
            </ChatResponseAttachment>
          </ChatResponseBlock>
        );
      }

      return (
        <ChatResponseBlock key={item.id}>{recommendationCard}</ChatResponseBlock>
      );
    }

    if (item.kind === "inline-feedback") {
      return (
        <ChatInlineFeedback key={item.id} tone={item.tone}>
          {item.content}
        </ChatInlineFeedback>
      );
    }

    if (item.status === "thinking") {
      return <ChatThinkingMessage key={item.id} />;
    }

    const showStoppedFeedback = item.responseStopped === true;
    const showFeedback =
      item.role === "assistant" &&
      item.status === "complete" &&
      item.feedbackEligible !== false &&
      !showStoppedFeedback;
    const timestamp = getPrototypeMessageTimestamp(index);

    const messageNode = (
      <ChatMessage
        role={item.role}
        aria-busy={item.status === "streaming" || undefined}
        streamStatus={item.status}
        streamText={item.content}
        timestamp={item.role === "user" ? timestamp : undefined}
      >
        {renderPremiumMessageContent(item.content)}
      </ChatMessage>
    );

    return (
      <ChatResponseBlock key={item.id}>
        {messageNode}
        {attachedPrompts ? (
          <ChatResponseAttachment>
            <PremiumPromptRow
              prompts={attachedPrompts}
              animated={false}
              onPromptSelect={handlePromptSelect}
            />
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

  return (
    <ChatPanel variant={variant} className={className}>
      <ChatHeader
        variant={variant}
        title={PREMIUM_CONCIERGE_TITLE}
        onClose={onClose}
        dockActionPosition="after-variant"
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
        showCloseAction={showCloseAction}
      />
      <ChatBody ref={chatBodyRef} onScroll={handleChatBodyScroll}>
        {flow ? (
          <ChatThread aria-label={`${flow.label} transcript`}>
            {flow.steps.map(renderConversationStep)}
          </ChatThread>
        ) : (
          <ChatThread
            aria-live="polite"
            aria-busy={isAssistantBusy || undefined}
            aria-label="Live Premium Concierge conversation"
          >
            {liveItems.map((item, index) =>
              renderLiveItem(
                item,
                index,
                activePrompts?.length &&
                  !isAssistantBusy &&
                  index === liveItems.length - 1
                  ? activePrompts
                  : null,
              ),
            )}
          </ChatThread>
        )}
      </ChatBody>
      <ChatComposer
        variant={variant}
        showTopDivider={hasChatBodyScrolled}
        isResponding={isAssistantBusy}
        onStopResponse={handleStopAssistantResponse}
        inputProps={{
          value: draft,
          disabled: Boolean(flow) || isAssistantBusy,
          placeholder: composerPlaceholder,
          onChange: handleDraftChange,
        }}
        onSend={handleSendMessage}
        sendDisabled={
          Boolean(flow) ||
          isAssistantBusy ||
          draft.trim() === ""
        }
        showVoiceMode={false}
      />
    </ChatPanel>
  );
}
