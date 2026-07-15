import {
  getChatResponseFeedbackPolicy,
  type ChatAssistantResponsePurpose,
} from "@/components/chat/chat-response";

export const STARTER_PROMPTS = [
  "How can LinkedIn help me hire?",
  "How can I contact the sales team?",
  "What are the key features of LinkedIn Recruiter?",
] as const;

export type StarterPrompt = (typeof STARTER_PROMPTS)[number];

export type LeadContext = Readonly<{
  firstName: string;
  company: string;
}>;

export type FlowReviewId = "high" | "medium" | "low";
export type MediumAvailabilityMode = "available" | "unavailable" | "failed";

export type FlowReviewMessageRole = "assistant" | "user" | "representative";

export type FlowReviewMessageStep = Readonly<{
  id: string;
  kind: "message";
  role: FlowReviewMessageRole;
  content: string;
  showStarterPromptsAfter?: boolean;
  responsePurpose?: ChatAssistantResponsePurpose;
}>;

export type FlowReviewRecommendationStep = Readonly<{
  id: string;
  kind: "recommendation";
  title: string;
  description?: string;
  primaryAction: string;
  secondaryAction?: string;
}>;

export type FlowReviewResource = Readonly<{
  title: string;
  description: string;
  actionLabel: string;
}>;

export type FlowReviewResourcesStep = Readonly<{
  id: string;
  kind: "resources";
  resources: ReadonlyArray<FlowReviewResource>;
}>;

export type FlowReviewAvailabilityVariant = Readonly<{
  id: string;
  label: string;
  message: string;
  role?: FlowReviewMessageRole;
  title: string;
  primaryAction: string;
  secondaryAction?: string;
  responsePurpose?: ChatAssistantResponsePurpose;
}>;

export type FlowReviewAvailabilityStep = Readonly<{
  id: string;
  kind: "availability";
  variants: ReadonlyArray<FlowReviewAvailabilityVariant>;
}>;

export type FlowReviewStep =
  | FlowReviewMessageStep
  | FlowReviewRecommendationStep
  | FlowReviewResourcesStep
  | FlowReviewAvailabilityStep;

export type FlowReview = Readonly<{
  id: FlowReviewId;
  label: string;
  title: string;
  description: string;
  steps: ReadonlyArray<FlowReviewStep>;
}>;

export const FLOW_REVIEW_NAV_ITEMS: ReadonlyArray<
  Readonly<{ id: string; href: string; label: string }>
> = [
  {
    id: "high",
    href: "/internal/flows/high",
    label: "High intent (static)",
  },
  {
    id: "medium-available",
    href: "/internal/flows/medium/available",
    label: "Medium intent · SDR available (static)",
  },
  {
    id: "medium-unavailable",
    href: "/internal/flows/medium/unavailable",
    label: "Medium intent · SDR unavailable (static)",
  },
  {
    id: "medium-failed",
    href: "/internal/flows/medium/failed",
    label: "Medium intent · SDR connection failed (static)",
  },
  { id: "low", href: "/internal/flows/low", label: "Low intent (static)" },
];

export function buildInitialAssistantResponse(lead: LeadContext): string {
  return `Hi ${lead.firstName}. I can help you understand which LinkedIn hiring solution fits ${lead.company} and what the next step should be.`;
}

export function buildFollowUpAssistantResponse(
  userMessage: string,
  lead: LeadContext,
): string {
  const message = userMessage.toLowerCase();

  if (
    message.includes("sales") ||
    message.includes("contact") ||
    message.includes("sales team")
  ) {
    return "I can help with that. To connect you with the right sales consultant, it helps to understand what kind of hiring you are trying to solve for. Roughly how many roles are you hiring for?";
  }

  if (message.includes("compare") || message.includes("recruiter")) {
    return "Recruiter is built for teams that need deeper sourcing, recruiting workflows, and support for ongoing hiring. It tends to be strongest when the hiring is consistent or specialized. Are you looking at it for ongoing hiring or one immediate role?";
  }

  if (
    message.includes("hire") ||
    message.includes("hiring") ||
    message.includes("fast") ||
    message.includes("faster") ||
    message.includes("quick") ||
    message.includes("ramp")
  ) {
    return `LinkedIn can help in a few different ways, from lighter tools for direct hiring to Recruiter + Hiring Assistant for teams hiring at scale. For ${lead.company}, the right fit depends on what you are hiring for and how urgent it is. What has changed that is making hiring harder right now?`;
  }

  if (
    message.includes("fit") ||
    message.includes("solution") ||
    message.includes("team")
  ) {
    return "Happy to help. The right fit usually depends on hiring volume, urgency, and whether a recruiting team owns sourcing. What kinds of roles are you hiring for right now?";
  }

  return `That helps. To narrow the right fit for ${lead.company}, I would start with the roles you need most. What kinds of roles are you hiring for right now?`;
}

export function shouldShowFlowReviewMessageFeedback(
  step: FlowReviewMessageStep,
) {
  if (step.role !== "assistant") {
    return false;
  }

  const responsePurpose =
    step.responsePurpose ??
    (step.showStarterPromptsAfter ? "welcome" : "answer");

  return getChatResponseFeedbackPolicy(responsePurpose) === "rateable";
}

const sharedWelcomeStep: FlowReviewMessageStep = {
  id: "welcome",
  kind: "message",
  role: "assistant",
  content: buildInitialAssistantResponse({
    firstName: "Jamie",
    company: "Northstar Health",
  }),
  responsePurpose: "welcome",
  showStarterPromptsAfter: true,
};

export const flowReviews: Readonly<Record<FlowReviewId, FlowReview>> = {
  high: {
    id: "high",
    label: "High",
    title: "High Flow",
    description:
      "A large-volume, urgent hiring conversation that commits to a sales consultant meeting for Recruiter + Hiring Assistant.",
    steps: [
      sharedWelcomeStep,
      {
        id: "high-user-starter",
        kind: "message",
        role: "user",
        content: STARTER_PROMPTS[0],
      },
      {
        id: "high-assistant-pressure",
        kind: "message",
        role: "assistant",
        content:
          "LinkedIn can help in a few different ways, from lighter tools for direct hiring to Recruiter + Hiring Assistant for teams hiring at scale. The right fit depends on what you are hiring for and how urgent it is. What has changed that is making hiring harder right now?",
      },
      {
        id: "high-user-volume",
        kind: "message",
        role: "user",
        content:
          "We just closed funding and need to hire around 40 roles over the next two quarters.",
      },
      {
        id: "high-assistant-priority",
        kind: "message",
        role: "assistant",
        content:
          "That is a meaningful ramp. For that kind of volume, I would look closely at whether your team needs deeper sourcing support rather than just more applicants. Which roles are most important to fill first?",
      },
      {
        id: "high-user-priority",
        kind: "message",
        role: "user",
        content:
          "Clinical operations and senior engineering. We have recruiters, but sourcing is taking too long.",
      },
      {
        id: "high-assistant-timeline",
        kind: "message",
        role: "assistant",
        content:
          "That points toward Recruiter + Hiring Assistant, especially since you already have a recruiting team and specialized roles. It can help teams work through sourcing and recruiting workflows more efficiently. When do the first hires need to be in seat?",
      },
      {
        id: "high-user-timeline",
        kind: "message",
        role: "user",
        content: "Ideally in six weeks.",
      },
      {
        id: "high-assistant-stakeholders",
        kind: "message",
        role: "assistant",
        content:
          "Six weeks makes this more of a hiring plan than a product browse. A sales consultant can help pressure-test how Recruiter + Hiring Assistant would support the first wave. Who would need to be involved in that conversation?",
      },
      {
        id: "high-user-stakeholders",
        kind: "message",
        role: "user",
        content:
          "I lead talent acquisition, and I would bring in our VP of People before we make a decision.",
      },
      {
        id: "high-assistant-recommendation",
        kind: "message",
        role: "assistant",
        content:
          "That is the right context to bring into a sales consultant conversation. You have urgent volume, specialized roles, an existing recruiting team, and stakeholders who need confidence in the plan. I am going to match you with a sales consultant who can help shape the first-wave Recruiter + Hiring Assistant plan.",
      },
      {
        id: "high-recommendation-card",
        kind: "recommendation",
        title: "Speak with a sales consultant",
        description:
          "15 min. We will match you with someone who can help plan your first hiring wave.",
        primaryAction: "Book a time",
      },
    ],
  },
  medium: {
    id: "medium",
    label: "Medium",
    title: "Medium Flow",
    description:
      "A smaller team hiring conversation that recommends Hiring Pro and shows sales consultant handoff outcomes.",
    steps: [
      sharedWelcomeStep,
      {
        id: "medium-user-starter",
        kind: "message",
        role: "user",
        content: STARTER_PROMPTS[1],
      },
      {
        id: "medium-assistant-volume",
        kind: "message",
        role: "assistant",
        content:
          "I can help with that. To get you to the right sales consultant, it helps to know what kind of hiring you are trying to solve for. Roughly how many roles are you hiring for?",
      },
      {
        id: "medium-user-roles",
        kind: "message",
        role: "user",
        content:
          "Maybe five roles this quarter. A few department leaders are hiring directly.",
      },
      {
        id: "medium-assistant-timeline",
        kind: "message",
        role: "assistant",
        content:
          "Got it. That sounds more like a lighter hiring motion than a full recruiting platform evaluation. Are you trying to move on those roles soon?",
      },
      {
        id: "medium-user-timeline",
        kind: "message",
        role: "user",
        content: "Yes, ideally this month.",
      },
      {
        id: "medium-assistant-ownership",
        kind: "message",
        role: "assistant",
        content:
          "Then Hiring Pro may be the better place to start. It is built for people who need qualified candidates without standing up a full recruiting process. Are those managers doing most of the sourcing themselves?",
      },
      {
        id: "medium-user-ownership",
        kind: "message",
        role: "user",
        content: "Yes. We do not have a dedicated recruiter for these roles.",
      },
      {
        id: "medium-assistant-fit",
        kind: "message",
        role: "assistant",
        content:
          "That helps. In that case, I would not start by pushing you into a heavy enterprise setup. I would focus on whether Hiring Pro can help those managers get to a qualified shortlist faster.",
      },
      {
        id: "medium-user-sales",
        kind: "message",
        role: "user",
        content:
          "That sounds right. I would still like to talk to someone before we pick a path.",
      },
      {
        id: "medium-assistant-recommendation",
        kind: "message",
        role: "assistant",
        content:
          "Makes sense. Since this is near-term hiring but lighter than an enterprise recruiting setup, the useful next step is a sales consultant who can confirm whether Hiring Pro fits and help your managers start cleanly.",
      },
      {
        id: "medium-availability",
        kind: "availability",
        variants: [
          {
            id: "medium-live",
            label: "If someone is available now",
            role: "representative",
            message:
              "Hi Jamie, I saw you are looking at Hiring Pro for manager-led hiring this month. I can help you confirm the fit.",
            title: "A sales consultant is available now",
            primaryAction: "Chat now",
          },
          {
            id: "medium-scheduled",
            label: "Scheduled sales consultant handoff",
            message:
              "I can help you pick a time with a sales consultant who can walk through Hiring Pro for your manager-led roles.",
            title: "Speak with a sales consultant",
            primaryAction: "Book a time",
          },
        ],
      },
    ],
  },
  low: {
    id: "low",
    label: "Low",
    title: "Low Flow",
    description:
      "A one-off hiring conversation that recommends helpful self-serve resources as the best next step.",
    steps: [
      sharedWelcomeStep,
      {
        id: "low-user-starter",
        kind: "message",
        role: "user",
        content: STARTER_PROMPTS[2],
      },
      {
        id: "low-assistant-compare",
        kind: "message",
        role: "assistant",
        content:
          "Recruiter is built for teams that need deeper sourcing, recruiting workflows, and support for ongoing hiring. It is usually strongest when hiring is consistent or specialized. Are you looking at it for ongoing hiring or one immediate role?",
      },
      {
        id: "low-user-context",
        kind: "message",
        role: "user",
        content:
          "Mostly one customer support role right now.",
      },
      {
        id: "low-assistant-resource",
        kind: "message",
        role: "assistant",
        content:
          "For one role, Recruiter may be more than you need. Hiring Pro or job posting resources may be a lighter way to start. Is this a one-off need, or the start of a bigger hiring plan?",
      },
      {
        id: "low-user-future",
        kind: "message",
        role: "user",
        content: "Probably one-off for now, but we may grow later.",
      },
      {
        id: "low-assistant-paced",
        kind: "message",
        role: "assistant",
        content:
          "That is a good reason to learn the options without jumping into a sales consultant conversation too early. I would help you compare the lighter path first, then come back to Recruiter if hiring becomes more recurring.",
      },
      {
        id: "low-user-direct",
        kind: "message",
        role: "user",
        content: "Can I just review options and move at my own pace?",
      },
      {
        id: "low-assistant-next-step",
        kind: "message",
        role: "assistant",
        content:
          "Yes. For where you are now, self-serve resources are the better fit. They will help you understand Hiring Pro, posting a job, and when Recruiter becomes worth a closer look.",
      },
      {
        id: "low-user-too-early",
        kind: "message",
        role: "user",
        content: "I do not want to waste anyone's time if we are too early.",
      },
      {
        id: "low-assistant-final",
        kind: "message",
        role: "assistant",
        content:
          "You are not too early to explore; you are just early for a sales handoff. For one role, the best next step is to review the lighter hiring resources now and come back when Northstar's hiring plan gets more complex.",
      },
      {
        id: "low-resources",
        kind: "resources",
        resources: [
          {
            title: "Explore Hiring Pro",
            description: "See how a lighter hiring tool can support a few roles.",
            actionLabel: "View Hiring Pro",
          },
          {
            title: "Post a job",
            description: "Start with a single role and move at your own pace.",
            actionLabel: "Start a job post",
          },
          {
            title: "Compare hiring products",
            description: "Review the broader LinkedIn hiring solution lineup.",
            actionLabel: "Compare products",
          },
        ],
      },
    ],
  },
};

const mediumAvailabilityVariantId: Record<MediumAvailabilityMode, string> = {
  available: "medium-live",
  unavailable: "medium-scheduled",
  failed: "medium-live",
};

export function getMediumFlowReview(
  availability: MediumAvailabilityMode,
): FlowReview {
  const variantId = mediumAvailabilityVariantId[availability];
  const isAvailable = availability === "available";
  const isFailed = availability === "failed";

  return {
    ...flowReviews.medium,
    title: isAvailable
      ? "Medium Flow - Available"
      : isFailed
        ? "Medium Flow - Connection Failed"
        : "Medium Flow - Unavailable",
    description: isAvailable
      ? "A smaller team hiring conversation where a sales consultant is available now."
      : isFailed
        ? "A smaller team hiring conversation where a live handoff fails and scheduling is the fallback."
        : "A smaller team hiring conversation where the next step is a scheduled sales consultant call.",
    steps: flowReviews.medium.steps.map((step) => {
      if (step.kind !== "availability") {
        return step;
      }

      return {
        ...step,
        variants: step.variants.filter((variant) => variant.id === variantId),
      };
    }),
  };
}
