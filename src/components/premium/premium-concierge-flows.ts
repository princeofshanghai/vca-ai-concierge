import type { PremiumPlanId } from "./premium-plan-data";

export type PremiumSurveyStep = "use-case" | "goals" | "plans";

export type PremiumUseCaseOptionId = "personal" | "job" | "other";

export type PremiumGoalOptionId =
  | "land-job"
  | "advance-career"
  | "expand-network"
  | "new-leads"
  | "hire"
  | "other";

export type PremiumReviewFlowId = "low" | "high";

export type PremiumLiveMode = "low-signal" | "high-signal";

export type PremiumPromptId =
  | "free-trial"
  | "help-pick-plan"
  | "premium-features"
  | "mixed-goals"
  | "compare-career-business"
  | "compare-business-suite"
  | "why-business-suite"
  | "is-business-enough"
  | "difference-business-suite"
  | "recommendation-mismatch";

export type PremiumConversationMessage = Readonly<{
  id: string;
  kind: "message";
  role: "assistant" | "user";
  content: string;
}>;

export type PremiumConversationRecommendation = Readonly<{
  id: string;
  kind: "product-recommendation";
  planId: PremiumPlanId;
}>;

export type PremiumConversationPromptRow = Readonly<{
  id: string;
  kind: "prompt-row";
  prompts: ReadonlyArray<PremiumPromptId>;
}>;

export type PremiumConversationStep =
  | PremiumConversationMessage
  | PremiumConversationRecommendation
  | PremiumConversationPromptRow;

export type PremiumConversationFlow = Readonly<{
  id: PremiumReviewFlowId;
  label: string;
  title: string;
  surveyStep: PremiumSurveyStep;
  selectedUseCaseOption: PremiumUseCaseOptionId;
  selectedGoalOptions: ReadonlyArray<PremiumGoalOptionId>;
  initialChatOpen?: boolean;
  conciergeNudge?: string;
  steps: ReadonlyArray<PremiumConversationStep>;
}>;

export const premiumReviewFlowIds = [
  "low",
  "high",
] as const;

export const premiumLowSignalWelcomeMessage =
  "Hi Alex, happy to help you explore Premium. I can answer questions, compare plans, or help you find the best fit for what you're trying to do. What would you like to start with?";

export const premiumHighSignalWelcomeMessage =
  "Hi Alex, based on the LinkedIn context I'm seeing here, I'd point you toward Business Suite. It's built for finding clients and growing visibility, which seem to be your priorities. Does that match what you're after?";

export const premiumPromptLabels: Readonly<Record<PremiumPromptId, string>> = {
  "free-trial": "Is there a free trial?",
  "help-pick-plan": "Help me pick the right plan",
  "premium-features": "What features do I get with Premium?",
  "mixed-goals": "I have mixed goals",
  "compare-career-business": "Compare Career and Business",
  "compare-business-suite": "Compare Business and Business Suite?",
  "why-business-suite": "What features are included in Business Suite?",
  "is-business-enough": "Is Business enough for me?",
  "difference-business-suite": "Difference between Business and Business Suite?",
  "recommendation-mismatch": "This doesn't sound right.",
};

export const premiumPostRecommendationPromptIds = [
  "why-business-suite",
  "compare-business-suite",
  "is-business-enough",
] as const satisfies ReadonlyArray<PremiumPromptId>;

export const premiumHighSignalPostRecommendationPromptIds = [
  "why-business-suite",
  "difference-business-suite",
  "recommendation-mismatch",
] as const satisfies ReadonlyArray<PremiumPromptId>;

export const premiumLiveModeNavItems: ReadonlyArray<
  Readonly<{ id: PremiumLiveMode; href: string; label: string }>
> = [
  {
    id: "low-signal",
    href: "/premium",
    label: "Low signal (interactive)",
  },
  {
    id: "high-signal",
    href: "/premium/live/high",
    label: "High signal (interactive)",
  },
];

export const premiumPromptRowsBySurveyStep: Readonly<
  Record<PremiumSurveyStep, ReadonlyArray<PremiumPromptId>>
> = {
  "use-case": ["help-pick-plan", "free-trial", "premium-features"],
  goals: ["free-trial", "mixed-goals", "compare-career-business"],
  plans: ["free-trial", "why-business-suite", "compare-business-suite"],
};

export const premiumReviewFlowNavItems: ReadonlyArray<
  Readonly<{ id: PremiumReviewFlowId; href: string; label: string }>
> = [
  {
    id: "low",
    href: "/premium/flows/low",
    label: "Low signal (static screen)",
  },
  {
    id: "high",
    href: "/premium/flows/high",
    label: "High signal (static screen)",
  },
];

export function isPremiumReviewFlowId(
  value: string,
): value is PremiumReviewFlowId {
  return premiumReviewFlowIds.includes(value as PremiumReviewFlowId);
}

export const premiumConversationFlows: Readonly<
  Record<PremiumReviewFlowId, PremiumConversationFlow>
> = {
  low: {
    id: "low",
    label: "Low signal (static screen)",
    title: "Low Signal Flow",
    surveyStep: "use-case",
    selectedUseCaseOption: "other",
    selectedGoalOptions: [],
    steps: [
      {
        id: "low-assistant-welcome",
        kind: "message",
        role: "assistant",
        content: premiumLowSignalWelcomeMessage,
      },
      {
        id: "low-welcome-prompts",
        kind: "prompt-row",
        prompts: premiumPromptRowsBySurveyStep["use-case"],
      },
      {
        id: "low-user-plan-help",
        kind: "message",
        role: "user",
        content: "Help me pick the right plan",
      },
      {
        id: "low-assistant-follow-up",
        kind: "message",
        role: "assistant",
        content:
          "Absolutely. Since Premium plans are built for different outcomes, what would make Premium feel worth it for you right now?",
      },
      {
        id: "low-user-goals",
        kind: "message",
        role: "user",
        content:
          "I'm trying to find customers and build visibility for my startup.",
      },
      {
        id: "low-assistant-goals-reflection",
        kind: "message",
        role: "assistant",
        content:
          "Nice, that helps. Customers and visibility are exactly the kinds of goals Premium can support.",
      },
      {
        id: "low-assistant-hiring-follow-up",
        kind: "message",
        role: "assistant",
        content:
          "Before I pick a plan, one quick question: do you expect hiring to matter soon too?",
      },
      {
        id: "low-user-hiring",
        kind: "message",
        role: "user",
        content:
          "Hiring is relevant. We're small now, but I may need to promote roles or find candidates later.",
      },
      {
        id: "low-assistant-recommendation-ready",
        kind: "message",
        role: "assistant",
        content: "Great, that gives me enough to make a call.",
      },
      {
        id: "low-assistant-recommendation-fit",
        kind: "message",
        role: "assistant",
        content:
          "I'd recommend Business Suite because it fits the full mix: finding customers, growing visibility, and keeping hiring support nearby.",
      },
      {
        id: "low-assistant-trial-good-news",
        kind: "message",
        role: "assistant",
        content:
          "Good news: **you can start with the 1-month free trial**, so you can test whether it actually supports those goals before committing.",
      },
      {
        id: "low-business-suite-card",
        kind: "product-recommendation",
        planId: "business-suite",
      },
      {
        id: "low-card-prompts",
        kind: "prompt-row",
        prompts: premiumPostRecommendationPromptIds,
      },
    ],
  },
  high: {
    id: "high",
    label: "High signal (static screen)",
    title: "High Signal Flow",
    surveyStep: "goals",
    selectedUseCaseOption: "job",
    selectedGoalOptions: ["expand-network", "new-leads", "hire"],
    steps: [
      {
        id: "high-assistant-welcome",
        kind: "message",
        role: "assistant",
        content: premiumHighSignalWelcomeMessage,
      },
      {
        id: "high-business-suite-card",
        kind: "product-recommendation",
        planId: "business-suite",
      },
      {
        id: "high-card-prompts",
        kind: "prompt-row",
        prompts: premiumHighSignalPostRecommendationPromptIds,
      },
    ],
  },
};
