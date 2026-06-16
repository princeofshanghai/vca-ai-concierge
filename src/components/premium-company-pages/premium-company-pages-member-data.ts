import type { SduiReactionIconType } from "@/components/primitives/reaction-icon";

import {
  PCP_ASSET_ROOT,
  pcpAdminPersona,
  pcpCompanyProfile,
  pcpProofSnippets,
  pcpVcaScenario,
} from "./persona";

export const pageTabs = [
  "Home",
  "About",
  "Posts",
  "Services",
  "Jobs",
  "Life",
  "People",
  "Insights",
];

export const companyMetadata = [
  pcpCompanyProfile.industry,
  pcpCompanyProfile.location,
  pcpCompanyProfile.followers,
  pcpCompanyProfile.employees,
];

export const sideJobs = [
  "Benefits Implementation Consultant",
  "Carrier Integrations Lead",
  "Product Designer, Admin Experience",
];

export const promotedJobs = [
  "Senior Customer Success Manager, Enterprise",
  "Product Marketing Lead, Benefits Platform",
  "Solutions Consultant, Carrier Partnerships",
];

export const affiliatedPages = [
  "Velora Invoicing",
  "Velora for Small Business",
  "Velora for Influencers",
] as const;

export const overviewHighlights = [
  {
    title: "Top 10 HR platforms to watch",
    date: "January 2025",
    image: "top-10-hr-platforms.png",
  },
  {
    title: "Winner - Most Innovative HR Startups",
    date: "June 2024",
    image: "innovative-startups.png",
  },
];

export type VisitorPostData = Readonly<{
  body: string;
  comments: string;
  id: string;
  image: string;
  imageAlt: string;
  linkMeta?: string;
  linkTitle?: string;
  reactions: string;
  reactionTypes: ReadonlyArray<SduiReactionIconType>;
  reposts?: string;
  title: string;
}>;

export type VisitorProductData = Readonly<{
  body: string;
  id: string;
  image?: string;
  imageAlt?: string;
  title: string;
  type: string;
}>;

export type VcaPostDetail = Readonly<{
  body: ReadonlyArray<string>;
  commentLabel: string;
  dateLabel: string;
  engagement: string;
  image?: string;
  imageAlt: string;
  title: string;
}>;

export const posts: ReadonlyArray<VisitorPostData> = [
  {
    body: "A 12,000-employee retailer simplified carrier coordination before open enrollment by keeping eligibility cleanup, carrier files, and employee communications in one workflow.",
    comments: `${pcpProofSnippets.postCommentCount} comments`,
    id: "carrier-coordination",
    image: "post-customer-conversation.jpg",
    imageAlt: "Two professionals discussing work on a laptop",
    reactions: pcpProofSnippets.postEngagement,
    reactionTypes: ["like", "empathy", "interest"],
    reposts: "76 reposts",
    title: pcpProofSnippets.postTitle,
  },
  {
    body: "If every carrier, plan, and employee population has a different tracker, your team needs a system that keeps decisions, files, and communications in one place.",
    comments: "1 comment",
    id: "workflow-signs",
    image: "post-image-2.png",
    imageAlt: "Benefits administrators reviewing open enrollment tasks",
    linkMeta: pcpCompanyProfile.name,
    linkTitle: "Three signs your benefits workflow has outgrown spreadsheets",
    reactions: "37",
    reactionTypes: ["like"],
    title: "Three signs your benefits workflow has outgrown spreadsheets.",
  },
  {
    body: "Open enrollment readiness starts before plan changes are announced. Here is how benefits teams can keep eligibility, carrier files, and employee communications aligned.",
    comments: "18 comments",
    id: "readiness-checklist",
    image: "post-lightbulb-idea.png",
    imageAlt: "Hand holding a lightbulb against a colorful background",
    reactions: "216",
    reactionTypes: ["like", "praise", "interest"],
    reposts: "9 reposts",
    title: "Open enrollment readiness checklist for enterprise HR teams.",
  },
];

export const vcaCaseStudyPostDetail: VcaPostDetail = {
  body: pcpProofSnippets.postBody,
  commentLabel: pcpProofSnippets.postCommentLabel,
  dateLabel: pcpProofSnippets.postDateLabel,
  engagement: pcpProofSnippets.postEngagement,
  image: pcpProofSnippets.postImage,
  imageAlt: pcpProofSnippets.postImageAlt,
  title: pcpProofSnippets.postTitle,
};

export const vcaReadinessPostDetail: VcaPostDetail = {
  body: [
    "Open enrollment readiness starts before plan changes are announced. Velora helps teams keep benefits tasks, employee communications, carrier files, and launch deadlines aligned before employees begin making plan decisions.",
    "Teams can use the same workflow to see what is ready, what needs review, and where employees may need clearer next steps.",
  ],
  commentLabel: "18 comments",
  dateLabel: "June 10, 2026",
  engagement: "216",
  image: "open-enrollment-readiness-checklist.png",
  imageAlt: "Hand using a stylus to check off an open enrollment checklist",
  title: "Open enrollment readiness checklist for enterprise HR teams",
};

export const visitorProducts: ReadonlyArray<VisitorProductData> = [
  {
    body: "Give employees one place to compare plans, enroll in benefits, update dependents, and see what needs attention before deadlines.",
    id: "velora-dashboard",
    image: "velora-dashboard-product.png",
    imageAlt: "Velora Dashboard product preview",
    title: "Velora Dashboard",
    type: "Employee benefits portal",
  },
  {
    body: "Help company admins monitor enrollment progress, carrier readiness, employee questions, and benefits operations trends in one view.",
    id: "velora-analytics",
    image: "service-dashboard-preview.png",
    imageAlt: "Velora Analytics product preview",
    title: "Velora Analytics",
    type: "Admin analytics workspace",
  },
  {
    body: "Keep employees informed with timely reminders, clear next steps, and answers to common benefits questions during enrollment windows.",
    id: "velora-guidance",
    title: "Velora Guidance",
    type: "Employee communications",
  },
] as const;

export const services = [
  {
    title: "Open enrollment command center",
    type: "Benefits workflow",
    body: "Coordinate plan changes, employee communications, carrier readiness, and enrollment progress without recreating the same tracker every week.",
    image: "service-whiteboard-session.png",
  },
  {
    title: "Carrier connection management",
    type: "Integrations workflow",
    body: "See which carrier files are validated, which exceptions need review, and which plan updates are ready before enrollment opens.",
    image: "service-dashboard-preview.png",
  },
  {
    title: "Eligibility change tracking",
    type: "HR operations",
    body: "Give HR teams a shared view of population changes, seasonal workers, dependent updates, and exceptions by plan and location.",
    image: "hero-cover-1.png",
  },
];

export const serviceKeywords = [
  "Benefits Administration",
  "Open Enrollment",
  "Carrier Integrations",
  "HR Operations",
  "Employee Benefits",
];

export const leaders = [
  {
    name: pcpAdminPersona.name,
    role: "Marketing Manager",
    followers: "8,412 followers",
    image: pcpAdminPersona.avatarSrc,
  },
  {
    name: "Avery Chen",
    role: "Head of Carrier Integrations",
    followers: "3,284 followers",
    image: `${PCP_ASSET_ROOT}/avatar-2.png`,
  },
  {
    name: "Marcus Lee",
    role: "Benefits Implementation Lead",
    followers: "2,981 followers",
    image: `${PCP_ASSET_ROOT}/avatar-3.png`,
  },
  {
    name: "Ari Kim",
    role: "Product Design Lead",
    followers: "1,946 followers",
    image: `${PCP_ASSET_ROOT}/avatar-1.png`,
  },
];

export type LeaderPostData = Readonly<{
  author: string;
  avatar: string;
  body: string;
  commentCount: string;
  image: string | null;
  linkMeta?: string;
  linkTitle?: string;
  reactionCount: string;
  reactionTypes: ReadonlyArray<SduiReactionIconType>;
}>;

export const leaderPosts: ReadonlyArray<LeaderPostData> = [
  {
    author: pcpAdminPersona.name,
    avatar: pcpAdminPersona.avatarSrc,
    body: "Growing teams usually hit the same challenge: work moves faster than visibility. The best systems make it easy to see what needs attention before small issues become big ones.",
    commentCount: "36",
    image: null,
    reactionCount: "1,284",
    reactionTypes: ["like", "empathy", "interest"],
  },
  {
    author: "Avery Chen",
    avatar: `${PCP_ASSET_ROOT}/avatar-2.png`,
    body: "Good integrations should make work feel simpler, not heavier. The goal is fewer handoffs, clearer ownership, and less time spent chasing updates.",
    commentCount: "18",
    image: "product-image-2.png",
    reactionCount: "864",
    reactionTypes: ["like", "praise", "interest"],
  },
  {
    author: "Marcus Lee",
    avatar: `${PCP_ASSET_ROOT}/avatar-3.png`,
    body: "The best teams do not just track activity. They look for patterns: what is getting easier, where people get stuck, and what to improve next.",
    commentCount: "24",
    image: "product-image-1.png",
    linkTitle: "A simple way to measure what's working",
    linkMeta: "Velora on LinkedIn - 7min...",
    reactionCount: "942",
    reactionTypes: ["like", "empathy", "praise"],
  },
];

export const mainJobOpenings = [
  "Benefits Implementation Consultant",
  "Carrier Integrations Lead",
];

export const newsletters = [
  {
    title: "The Benefits Operations Brief",
    meta: "Weekly - 2,674 subscribers",
    body: "Weekly notes for HR and benefits leaders managing open enrollment, carrier readiness, and employee communications.",
  },
  {
    title: "Open Enrollment Field Notes",
    meta: "Monthly - 1,204 subscribers",
    body: "Practical lessons from enterprise benefits teams coordinating plan changes, eligibility exceptions, and carrier partners.",
  },
  {
    title: "Benefits Leader Signals",
    meta: "Monthly - 894 subscribers",
    body: "A concise readout of enrollment patterns, migration risks, and questions HR leaders are asking.",
  },
];

export const footerLinkColumns = [
  ["About", "Community Guidelines", "Privacy & Terms", "Sales Solution", "Safety Center"],
  ["Accessibility", "Careers", "Ad Choices", "Mobile"],
  ["Talent Solutions", "Marketing Solutions", "Advertising", "Small Business"],
];

export type VcaShellMode = "tray" | "fab" | "fab-icon";
export type VcaMemberIntent = "buyer" | "job-seeker";
export type PremiumCompanyPagesMemberStory = "default" | "live-support";
export type VcaVisitorPromptId = keyof typeof pcpVcaScenario.pageExplorerPrompts;

const pageExplorerPromptEntries = Object.entries(
  pcpVcaScenario.pageExplorerPrompts,
) as Array<[VcaVisitorPromptId, string]>;
const VCA_PRODUCT_QUESTION_KEYWORDS = [
  "enroll",
  "employee",
  "benefit",
  "self-service",
  "self service",
  "dashboard",
  "product",
] as const;
const VCA_OPEN_ENROLLMENT_READINESS_KEYWORDS = [
  "open enrollment",
  "enrollment readiness",
  "get ready",
  "prepare",
  "readiness",
] as const;
const vcaVisitorPromptKeywordRoutes: ReadonlyArray<
  Readonly<{
    id: VcaVisitorPromptId;
    keywords: ReadonlyArray<string>;
  }>
> = [
  {
    id: "people",
    keywords: ["people", "leader", "founder"],
  },
  {
    id: "jobs",
    keywords: [
      "job",
      "role",
      "career",
      "hiring",
      "position",
      "opening",
      "opportunit",
      "apply",
    ],
  },
  {
    id: "posts",
    keywords: ["post", "proof", "case study", "recent"],
  },
  {
    id: "fit",
    keywords: ["relevant", "right for me", "fit"],
  },
  {
    id: "difference",
    keywords: ["different", "differenti", "unique", "why velora"],
  },
  {
    id: "overview",
    keywords: ["what should", "what does", "overview"],
  },
];

export const vcaOpeningPrompts = pcpVcaScenario.visitorPrompts;
export const VCA_JOB_SEEKER_QUESTION =
  "Would my HR operations background be a fit for the Benefits Implementation Consultant role?";
export const VCA_JOB_SEEKER_CHIP = "Would my HR ops background be a fit?";
export const vcaJobSeekerPrompts = [
  VCA_JOB_SEEKER_CHIP,
  "What does this role own?",
  "Is this role remote?",
];
export const VCA_POST_RESPONSE = pcpVcaScenario.pageExplorerResponses.posts;
export const VCA_PRODUCT_RESPONSE =
  "Yes. Velora Dashboard is designed for employee self-service during benefits enrollment.\n\nEmployees can compare plans, enroll in coverage, update dependents, and track deadline-related next steps from one guided workspace. That means they can answer common enrollment questions without waiting for an HR admin to point them to the right place.\n\nYou can review the product details on the Velora Dashboard product page or learn more on Velora's website.\n\nThis product looks like the best match for what you're asking about.";
export const VCA_PRODUCT_RESPONSE_HIGHLIGHTS = [
  "Velora Dashboard",
  "employee self-service",
  "compare plans, enroll in coverage, update dependents",
  "track deadline-related next steps",
  "one guided workspace",
] as const;
export const VCA_PRODUCT_RESPONSE_LINKS = [
  {
    label: "Velora Dashboard product page",
    href: "#velora-dashboard-product",
  },
  {
    label: "Velora's website",
    href: "#velora-website",
  },
] as const;
export const VCA_PRODUCT_POST_RESPONSE =
  "Open enrollment readiness usually comes down to making sure the right tasks are visible before employees start choosing plans.\n\nVelora's Page has a related Page post about preparing for enrollment by keeping benefits tasks, employee communications, carrier coordination, and launch deadlines in one workflow.\n\nThat can help you understand how Velora supports the work around enrollment, not just the employee-facing enrollment step.\n\nHere is the related post.";
export const VCA_PRODUCT_POST_RESPONSE_LINKS = [
  {
    label: "related Page post",
    href: "#open-enrollment-readiness-post",
  },
] as const;
export const VCA_JOB_SEEKER_RESPONSE =
  "Yes - your HR operations background sounds relevant, especially if you've helped employees, benefits partners, or internal teams through setup, troubleshooting, and process changes. These roles connect customer conversations, benefits workflow setup, and cross-functional product feedback so HR teams get clear answers quickly.";
export const VCA_JOB_PROOF_INTRO =
  "These roles look closest to what you're describing:";
export const vcaJobOpenings = [
  {
    title: "Benefits Implementation Consultant",
    location: pcpCompanyProfile.location,
    posted: "2 days ago",
    employmentType: "Full-time",
    applyClicks: "20 people clicked apply",
    alumni: "1,412 school alumni work here",
    summary:
      "Help enterprise HR teams set up benefits workflows, enrollment milestones, and customer launch plans.",
    about:
      "Velora helps HR teams manage open enrollment, carrier readiness, eligibility changes, and employee communications in one workflow. The Benefits Implementation team works closely with customers, product, and integration partners to make complex launch questions feel clear and actionable.",
  },
  {
    title: "Carrier Integrations Lead",
    location: pcpCompanyProfile.location,
    posted: "1 week ago",
    employmentType: "Full-time",
    applyClicks: "14 people clicked apply",
    alumni: "1,412 school alumni work here",
    summary:
      "Own carrier readiness workflows across file validation, exceptions, and partner coordination.",
    about:
      "This role leads the connective tissue between Velora customers, carrier partners, and internal product teams. You would help define how file readiness, exception handling, and carrier decisions stay visible before enrollment opens.",
  },
  {
    title: "Product Designer, Admin Experience",
    location: pcpCompanyProfile.location,
    posted: "3 days ago",
    employmentType: "Full-time",
    applyClicks: "9 people clicked apply",
    alumni: "1,412 school alumni work here",
    summary:
      "Design admin workflows for benefits teams managing enrollment, eligibility, and carrier coordination.",
    about:
      "The Admin Experience team designs the workspace HR and benefits leaders use to understand plan changes, population updates, and open enrollment progress. This role focuses on making complex operational states easy to scan and act on.",
  },
] as const;
export type VcaJobOpening = (typeof vcaJobOpenings)[number];
export const VCA_CASE_STUDY_RETURN_PROMPT = pcpVcaScenario.caseStudyReturnPrompt;
export const VCA_DRAFT_INTRO_PROMPT = "Draft message";
const VCA_HANDOFF_OFFER = pcpVcaScenario.handoffOffer;
const VCA_HANDOFF_MESSAGE = pcpVcaScenario.handoffMessage;
const VCA_PRODUCT_HANDOFF_OFFER =
  "I can't confirm carrier setup details from Velora's Page alone.\n\nThat usually depends on your current carriers, eligibility file process, data format, and implementation timeline. Velora may support carrier coordination workflows, but the exact setup would need someone from their team to confirm.\n\nYou can send Velora a message, or I can draft a short message with the right context so their team can answer directly.";
const VCA_PRODUCT_HANDOFF_MESSAGE =
  "Hi Rose - I'm exploring whether Velora Dashboard could help employees enroll in benefits on their own. I'm also curious whether it can work with our current carrier file and eligibility setup. Would love to connect with someone who can share more detail.";
export const LIVE_SUPPORT_CONNECT_DELAY_MS = 900;
export const PCP_LIVE_SUPPORT_AGENT = {
  name: "Maya R.",
  role: "Velora live support",
  timestamp: "9:37 PM",
  message: "How can I help you?",
} as const;

function normalizeVcaPromptText(prompt: string) {
  return prompt.trim().toLowerCase();
}

function hasPromptKeyword(
  normalizedPrompt: string,
  keywords: ReadonlyArray<string>,
) {
  return keywords.some((keyword) => normalizedPrompt.includes(keyword));
}

export function isVcaProductQuestion(prompt: string | null | undefined) {
  if (!prompt) {
    return false;
  }

  const normalizedPrompt = normalizeVcaPromptText(prompt);

  return hasPromptKeyword(normalizedPrompt, VCA_PRODUCT_QUESTION_KEYWORDS);
}

export function isVcaOpenEnrollmentReadinessQuestion(
  prompt: string | null | undefined,
) {
  if (!prompt) {
    return false;
  }

  const normalizedPrompt = normalizeVcaPromptText(prompt);

  return hasPromptKeyword(
    normalizedPrompt,
    VCA_OPEN_ENROLLMENT_READINESS_KEYWORDS,
  );
}

export function getVcaHandoffOffer(visitorQuestion: string | null) {
  return isVcaProductQuestion(visitorQuestion)
    ? VCA_PRODUCT_HANDOFF_OFFER
    : VCA_HANDOFF_OFFER;
}

export function getVcaHandoffMessage(visitorQuestion: string | null) {
  return isVcaProductQuestion(visitorQuestion)
    ? VCA_PRODUCT_HANDOFF_MESSAGE
    : VCA_HANDOFF_MESSAGE;
}

export function getVcaVisitorPromptId(prompt: string): VcaVisitorPromptId | null {
  const normalizedPrompt = normalizeVcaPromptText(prompt);
  const matchedEntry = pageExplorerPromptEntries.find(
    ([, label]) => normalizeVcaPromptText(label) === normalizedPrompt,
  );

  if (matchedEntry) {
    return matchedEntry[0];
  }

  return (
    vcaVisitorPromptKeywordRoutes.find((route) =>
      hasPromptKeyword(normalizedPrompt, route.keywords),
    )?.id ?? null
  );
}
