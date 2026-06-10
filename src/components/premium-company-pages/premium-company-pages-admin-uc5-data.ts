import type { IconName } from "@/components/primitives/icon";

import {
  pcpCompanyProfile,
  pcpCompetitorNames,
  pcpProofSnippets,
  pcpVisitorPersona,
} from "./persona";

export type AdminUc5InsightId =
  | "post-amplification"
  | "follower-growth"
  | "visitor-demographics"
  | "content-engagement"
  | "weekly-synthesis";

export type AdminUc5Tone = "positive" | "negative" | "neutral";

export type AdminUc5FollowUp = Readonly<{
  prompt: string;
  response: string;
  primary?: boolean;
}>;

export type AdminUc5Insight = Readonly<{
  id: AdminUc5InsightId;
  icon: IconName;
  label: string;
  value: string;
  query: string;
  followUps: ReadonlyArray<AdminUc5FollowUp>;
}>;

export type AdminUc5Metric = Readonly<{
  label: string;
  value: string;
  changeValue: string;
  changeContext: string;
  tone: AdminUc5Tone;
}>;

export type AdminUc5BarDatum = Readonly<{
  label: string;
  percentage: number;
}>;

export type AdminUc5BarGroup = Readonly<{
  label: string;
  rows: ReadonlyArray<AdminUc5BarDatum>;
}>;

export type AdminUc5PostPerformance = Readonly<{
  title: string;
  impressions: string;
  desktop: number;
  mobile: number;
}>;

export type AdminUc5CompetitorRow = Readonly<{
  company: string;
  postsPerWeek: string;
  newFollowers: string;
  commentsPerDay: string;
  highlight?: boolean;
}>;

export type AdminUc5Lead = Readonly<{
  name: string;
  company: string;
  summary: string;
  status: string;
  replyNeeded?: boolean;
}>;

export const adminUc5Insights: Record<AdminUc5InsightId, AdminUc5Insight> = {
  "post-amplification": {
    id: "post-amplification",
    icon: "analytics",
    label: "Open enrollment content is worth amplifying",
    value: "4.8% engagement rate - only 240 impressions",
    query: "Tell me more about this open enrollment post.",
    followUps: [
      {
        prompt: "Why this post?",
        response:
          "Because the early signal is strong. People who saw the migration-readiness post engaged with it at 4.8%, well above the Page average, but only 240 people saw it. That makes it a good candidate to review for more reach.",
      },
      {
        prompt: "Who would this reach?",
        response:
          "The strongest audience fit is HR, benefits, and people operations leaders at enterprise companies. They are already showing up in your visitor data around open enrollment and migration content.",
      },
      {
        prompt: "Explore boost options",
        response:
          "You could review a small boost for this post, but I would start by checking the audience, budget, and duration before launching anything. The safer first step is to preview who it would reach.",
      },
    ],
  },
  "follower-growth": {
    id: "follower-growth",
    icon: "people",
    label: "Follower growth dropped this month",
    value: "312 visitors - down 18 points vs last month",
    query: "Why did follower growth drop this month?",
    followUps: [
      {
        prompt: "How does this compare to last quarter?",
        response:
          "Last quarter averaged 384 visitors per month, so this month is down 19%. The drop appears tied to a posting gap after the open enrollment readiness post, not a loss of relevance with the audience.",
      },
      {
        prompt: "Which posts drove the most follows?",
        response:
          "The open enrollment readiness post drove the most follows, followed by the carrier file checklist. Both converted because they named benefits operations pain points directly.",
      },
      {
        prompt: "What should I do this week?",
        response:
          "Post a short follow-up on phased migration readiness, then reuse Cheri's question as a benefits-leader prompt. That keeps the narrative close to the buying conversation already happening in your inbox.",
      },
    ],
  },
  "visitor-demographics": {
    id: "visitor-demographics",
    icon: "analytics",
    label: "Benefits leaders are finding your Page",
    value: "68% of engaged visitors are HR Director+",
    query: "Who is visiting Velora's Page?",
    followUps: [
      {
        prompt: "Are these the right people for Velora?",
        response:
          "Yes. The strongest visitor groups look like the people Velora is built to help: HR, benefits, and people operations leaders managing carrier complexity, eligibility cleanup, and open enrollment readiness.",
      },
      {
        prompt: "How do I reach more of them?",
        response:
          "Post more open enrollment and carrier-readiness scenarios, then consider boosting the Arbor Retail Group proof to HR and benefits leaders at large employers.",
      },
    ],
  },
  "content-engagement": {
    id: "content-engagement",
    icon: "popular-content",
    label: "One post is outperforming its reach",
    value: "Arbor proof: strong engagement - modest impressions",
    query: "What should I do with this high-engagement post?",
    followUps: [
      {
        prompt: "Why did the top post perform better?",
        response:
          "It led with a concrete operational risk: switching benefits systems before open enrollment without a clear carrier-readiness plan. That makes the problem obvious before readers need to understand Velora.",
      },
      {
        prompt: "What should I post next?",
        response:
          "Turn Cheri's question into a short post: 'What breaks first when benefits teams migrate mid-year?' Pair it with a simple readiness checklist.",
      },
    ],
  },
  "weekly-synthesis": {
    id: "weekly-synthesis",
    icon: "starburst",
    label: "Your weekly summary is ready",
    value: "3 things to act on this week",
    query: "Summarize the top things I should act on this week.",
    followUps: [
      {
        prompt: "Draft the Cheri Sparks customer story",
        primary: true,
        response:
          `Draft angle: '${pcpProofSnippets.caseStudyTitle}.' Lead with Cheri's mid-year migration question, then explain eligibility cleanup, carrier readiness, and employee communications in one visual example.`,
      },
      {
        prompt: "Which leads need a reply?",
        response:
          "Cheri Sparks needs the fastest reply because she is high intent and unreplied. Priya Shah is next because carrier file readiness is a concrete buying question.",
      },
    ],
  },
};

export const adminUc5FollowerMetrics: ReadonlyArray<AdminUc5Metric> = [
  {
    label: "Visitors",
    value: "312",
    changeValue: "18 points",
    changeContext: "vs last month",
    tone: "negative",
  },
  {
    label: "New followers",
    value: "29",
    changeValue: "11%",
    changeContext: "vs last week",
    tone: "negative",
  },
  {
    label: "Follower total",
    value: "48,218",
    changeValue: "29",
    changeContext: "this week",
    tone: "positive",
  },
];

export const adminUc5DemographicGroups: ReadonlyArray<AdminUc5BarGroup> = [
  {
    label: "Company size",
    rows: [
      { label: "10,001+ employees", percentage: 54 },
      { label: "5,001-10,000 employees", percentage: 22 },
    ],
  },
  {
    label: "Job function",
    rows: [
      { label: "Human resources", percentage: 46 },
      { label: "Benefits operations", percentage: 22 },
    ],
  },
  {
    label: "Industry",
    rows: [
      { label: "Retail", percentage: 31 },
      { label: "Healthcare", percentage: 18 },
    ],
  },
  {
    label: "Location",
    rows: [
      { label: "United States", percentage: 72 },
      { label: "Canada", percentage: 9 },
    ],
  },
  {
    label: "Seniority",
    rows: [
      { label: "Director+", percentage: 68 },
      { label: "VP / CHRO", percentage: 24 },
    ],
  },
];

export const adminUc5TopPosts: ReadonlyArray<AdminUc5PostPerformance> = [
  {
    title: "What benefits teams should validate before a mid-year migration",
    impressions: "1,688",
    desktop: 32,
    mobile: 68,
  },
  {
    title: "Carrier file readiness checklist for open enrollment",
    impressions: "1,204",
    desktop: 41,
    mobile: 59,
  },
  {
    title: "How HR teams keep employee communications aligned by population",
    impressions: "936",
    desktop: 27,
    mobile: 73,
  },
];

export const adminUc5LowPosts: ReadonlyArray<AdminUc5PostPerformance> = [
  {
    title: "Velora product update: eligibility rules",
    impressions: "214",
    desktop: 52,
    mobile: 48,
  },
  {
    title: "June release notes for benefits workflow admins",
    impressions: "168",
    desktop: 61,
    mobile: 39,
  },
];

export const adminUc5CompetitorRows: ReadonlyArray<AdminUc5CompetitorRow> = [
  {
    company: pcpCompanyProfile.name,
    postsPerWeek: "2",
    newFollowers: "29",
    commentsPerDay: "11",
    highlight: true,
  },
  {
    company: pcpCompetitorNames[0],
    postsPerWeek: "5",
    newFollowers: "82",
    commentsPerDay: "18",
  },
  {
    company: pcpCompetitorNames[1],
    postsPerWeek: "4",
    newFollowers: "64",
    commentsPerDay: "14",
  },
  {
    company: pcpCompetitorNames[2],
    postsPerWeek: "3",
    newFollowers: "41",
    commentsPerDay: "7",
  },
];

export const adminUc5Leads: ReadonlyArray<AdminUc5Lead> = [
  {
    name: pcpVisitorPersona.name,
    company: pcpVisitorPersona.company,
    summary: "Asked whether Velora can support a mid-year benefits migration.",
    status: "High intent",
    replyNeeded: true,
  },
  {
    name: "Priya Shah",
    company: "Calico Health Network",
    summary: "Asked whether Velora supports carrier file validation.",
    status: "Awaiting reply",
    replyNeeded: true,
  },
  {
    name: "Dana Kim",
    company: "Arbor Retail Group",
    summary: "Shared a positive open enrollment migration story.",
    status: "Replied",
  },
];

export const adminUc5SynthesisRecommendation =
  `${pcpCompetitorNames[0]} is posting benefits migration stories 3x a week. You have a strong one in your inbox from Cheri Sparks. Want me to draft it?`;

export const adminUc5PrototypeFallback =
  "This prototype is scripted for the four performance reporting prompts. Choose a digest item or prompt chip to see the compact report.";
