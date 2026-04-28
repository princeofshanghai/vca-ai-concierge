export type PremiumSurveyStep = "use-case" | "goals" | "plans";

export type PremiumUseCaseOptionId = "personal" | "job" | "other";

export type PremiumGoalOptionId =
  | "land-job"
  | "advance-career"
  | "expand-network"
  | "new-leads"
  | "hire"
  | "other";

export type PremiumSignalFlowId = "low" | "medium" | "high";

export type PremiumConversationMessage = Readonly<{
  id: string;
  kind: "message";
  role: "assistant" | "user";
  content: string;
}>;

export type PremiumConversationRecommendation = Readonly<{
  id: string;
  kind: "product-recommendation";
  planId: "business-suite";
}>;

export type PremiumConversationStep =
  | PremiumConversationMessage
  | PremiumConversationRecommendation;

export type PremiumConversationFlow = Readonly<{
  id: PremiumSignalFlowId;
  label: string;
  title: string;
  surveyStep: PremiumSurveyStep;
  selectedUseCaseOption: PremiumUseCaseOptionId;
  selectedGoalOptions: ReadonlyArray<PremiumGoalOptionId>;
  steps: ReadonlyArray<PremiumConversationStep>;
}>;

export const premiumSignalFlowIds = ["low", "medium", "high"] as const;

export const premiumSignalFlowNavItems: ReadonlyArray<
  Readonly<{ id: PremiumSignalFlowId; href: string; label: string }>
> = [
  { id: "low", href: "/premium/flows/low", label: "Low signal" },
  { id: "medium", href: "/premium/flows/medium", label: "Medium signal" },
  { id: "high", href: "/premium/flows/high", label: "High signal" },
];

export function isPremiumSignalFlowId(
  value: string,
): value is PremiumSignalFlowId {
  return premiumSignalFlowIds.includes(value as PremiumSignalFlowId);
}

export const premiumConversationFlows: Readonly<
  Record<PremiumSignalFlowId, PremiumConversationFlow>
> = {
  low: {
    id: "low",
    label: "Low signal",
    title: "Low Signal Flow",
    surveyStep: "use-case",
    selectedUseCaseOption: "other",
    selectedGoalOptions: [],
    steps: [
      {
        id: "low-assistant-welcome",
        kind: "message",
        role: "assistant",
        content:
          "Hi Alex, I can help you figure out whether Premium is worth it and which plan fits. What are you hoping it helps with right now?",
      },
      {
        id: "low-user-goals",
        kind: "message",
        role: "user",
        content:
          "Mostly customers and visibility. I'm running a small startup, and hiring might matter later.",
      },
      {
        id: "low-assistant-pattern",
        kind: "message",
        role: "assistant",
        content:
          "Got it. That sounds less like job search and more like company growth across sales, marketing, and light hiring.",
      },
      {
        id: "low-user-not-job-search",
        kind: "message",
        role: "user",
        content: "Exactly. I do not want something that only helps me get hired.",
      },
      {
        id: "low-assistant-recommend",
        kind: "message",
        role: "assistant",
        content:
          "Then I would look at Business Suite. It is the strongest fit when one person is wearing sales, marketing, and hiring hats.",
      },
      {
        id: "low-user-business",
        kind: "message",
        role: "user",
        content: "Would regular Business be enough?",
      },
      {
        id: "low-assistant-tradeoff",
        kind: "message",
        role: "assistant",
        content:
          "Business is useful for networking and research. Business Suite adds prospect suggestions, client insights, post boosts, 30 InMails, and job promotions, which fits your founder use case better.",
      },
      {
        id: "low-business-suite-card",
        kind: "product-recommendation",
        planId: "business-suite",
      },
    ],
  },
  medium: {
    id: "medium",
    label: "Medium signal",
    title: "Medium Signal Flow",
    surveyStep: "goals",
    selectedUseCaseOption: "job",
    selectedGoalOptions: ["expand-network", "new-leads", "hire"],
    steps: [
      {
        id: "medium-assistant-welcome",
        kind: "message",
        role: "assistant",
        content:
          "Hey Alex, I can use what you've shared so far: this looks more like business growth than job search. Want help narrowing Business vs. Business Suite?",
      },
      {
        id: "medium-user-growth",
        kind: "message",
        role: "user",
        content:
          "Yes. I mainly need customers and visibility, but hiring may come up later.",
      },
      {
        id: "medium-assistant-frame",
        kind: "message",
        role: "assistant",
        content:
          "Helpful. I would separate the need into two buckets: networking and research, or broader company growth.",
      },
      {
        id: "medium-assistant-suite",
        kind: "message",
        role: "assistant",
        content:
          "That makes Business Suite the better fit. Business helps with people browsing, profile credibility, and company insights. Business Suite adds more active growth tools.",
      },
      {
        id: "medium-user-active",
        kind: "message",
        role: "user",
        content: "What makes it more active?",
      },
      {
        id: "medium-assistant-active",
        kind: "message",
        role: "assistant",
        content:
          "Daily prospect suggestions and client insights help with customer development. Monthly post boosts and 30 InMails help with reach. Monthly job promotions keep hiring in the same plan.",
      },
      {
        id: "medium-assistant-recommend",
        kind: "message",
        role: "assistant",
        content:
          "If you only wanted research, Business could be enough. For your mix of customers, visibility, and hiring, I would recommend Business Suite.",
      },
      {
        id: "medium-business-suite-card",
        kind: "product-recommendation",
        planId: "business-suite",
      },
    ],
  },
  high: {
    id: "high",
    label: "High signal",
    title: "High Signal Flow",
    surveyStep: "plans",
    selectedUseCaseOption: "job",
    selectedGoalOptions: ["expand-network", "new-leads", "hire"],
    steps: [
      {
        id: "high-assistant-welcome",
        kind: "message",
        role: "assistant",
        content:
          "Hi Alex, based on what you've shared, I would recommend Business Suite. It covers your customer, visibility, and hiring needs in one plan.",
      },
      {
        id: "high-user-business",
        kind: "message",
        role: "user",
        content: "Why that over Business?",
      },
      {
        id: "high-assistant-business",
        kind: "message",
        role: "assistant",
        content:
          "Business is strong if you mostly need unlimited people browsing, profile customizations, a custom call to action, and company insights.",
      },
      {
        id: "high-assistant-suite",
        kind: "message",
        role: "assistant",
        content:
          "Business Suite fits better when the work spans selling, marketing, and hiring. That matches a 10-person startup founder more closely.",
      },
      {
        id: "high-user-career",
        kind: "message",
        role: "user",
        content: "And Career is probably not for me?",
      },
      {
        id: "high-assistant-career",
        kind: "message",
        role: "assistant",
        content:
          "Right. Career is best when the main goal is getting hired: top applicant insights, top choice jobs, and messaging hiring managers. Your goal is company growth.",
      },
      {
        id: "high-assistant-wrap",
        kind: "message",
        role: "assistant",
        content:
          "Business Suite gives you prospect suggestions and client insights, post boosts with 30 InMails, and monthly job promotions in one plan.",
      },
      {
        id: "high-business-suite-card",
        kind: "product-recommendation",
        planId: "business-suite",
      },
    ],
  },
};
