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
  | "competitor-growth"
  | "weekly-synthesis";

export type AdminUc5Tone = "positive" | "negative" | "neutral";

export type AdminUc5FollowUp = Readonly<{
  prompt: string;
  response: string;
  primary?: boolean;
}>;

export type AdminUc5InsightSelection = Readonly<{
  id: AdminUc5InsightId;
  prompt: string;
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
          "Because the early signal is strong. People who saw the Arbor Retail Group post engaged with it at 4.8%, well above the Page average, but only 240 people saw it. That makes it a good candidate to review for more reach.",
      },
      {
        prompt: "Who would this reach?",
        response:
          "The strongest audience fit is Human Resources visitors at Director+ seniority from enterprise companies. They are already showing up in your visitor data across Insurance, Hospital & Health Care, and Retail companies.",
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
          "Post a short follow-up on carrier coordination, then reference the Arbor Retail Group post Cheri viewed. That keeps the narrative close to the Page engagement already happening in your inbox.",
      },
    ],
  },
  "visitor-demographics": {
    id: "visitor-demographics",
    icon: "analytics",
    label: "Your Page is reaching more relevant visitors",
    value: "64% of visitors match your target audience",
    query: "Show insights about my page visitors",
    followUps: [
      {
        prompt: "Are these the right people for Velora?",
        response:
          "Yes. The strongest visitor groups match Velora's target audience using LinkedIn demographic fields: Human Resources job function, Director+ seniority, Insurance and Hospital & Health Care industries, and 10,001+ employee companies.",
      },
      {
        prompt: "How do I reach more of them?",
        response:
          "Post more content for Human Resources leaders at large employers, then consider boosting the Arbor Retail Group proof to Director+ audiences in Insurance, Hospital & Health Care, and Retail.",
      },
    ],
  },
  "content-engagement": {
    id: "content-engagement",
    icon: "popular-content",
    label: "Carrier coordination content is resonating",
    value: "Top 2 posts focus on carrier readiness and eligibility cleanup",
    query: "What content is resonating most?",
    followUps: [
      {
        prompt: "Show the top posts",
        response:
          "The Arbor Retail Group proof and the carrier file readiness checklist are the clearest signals. Both turn benefits operations into a concrete workflow problem before asking readers to learn more about Velora.",
      },
      {
        prompt: "Break down by audience",
        response:
          "The strongest engagement is coming from Human Resources visitors at Director+ seniority. The content appears to resonate most with visitors from large Insurance, Hospital & Health Care, and Retail companies.",
      },
      {
        prompt: "What themes are emerging?",
        response:
          "The emerging theme is operational clarity. Posts that make complex benefits coordination feel specific and manageable are outperforming broader Page updates.",
      },
    ],
  },
  "competitor-growth": {
    id: "competitor-growth",
    icon: "company",
    label: `${pcpCompetitorNames[0]} is gaining followers faster`,
    value: "82 new followers this month vs Velora's 29",
    query: `Why is ${pcpCompetitorNames[0]} gaining followers faster than us?`,
    followUps: [
      {
        prompt: "What should we post next?",
        response: `Post a concise carrier-readiness checklist this week, then follow with a customer proof point. Keep the angle practical and deadline-driven so it competes with the open enrollment content already working for ${pcpCompetitorNames[0]}.`,
      },
      {
        prompt: "Compare recent posts",
        response: `${pcpCompetitorNames[0]} is winning on cadence and checklist-style packaging. Velora's strongest posts are more specific to benefits operations, so the opportunity is to publish more often without losing that sharper point of view.`,
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
        prompt: "Draft the Cheri Sparks follow-up",
        primary: true,
        response:
          `Draft angle: '${pcpProofSnippets.postTitle}.' Lead with the Arbor Retail Group post Cheri viewed, then explain eligibility cleanup, carrier readiness, and employee communications in one visual example.`,
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
      { label: "Human Resources", percentage: 46 },
      { label: "Operations", percentage: 22 },
    ],
  },
  {
    label: "Industry",
    rows: [
      { label: "Retail", percentage: 31 },
      { label: "Hospital & Health Care", percentage: 18 },
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
      { label: "Director", percentage: 44 },
      { label: "VP", percentage: 24 },
    ],
  },
];

export const adminUc5TopPosts: ReadonlyArray<AdminUc5PostPerformance> = [
  {
    title: pcpProofSnippets.postTitle,
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
    summary: "Viewed the Arbor Retail Group post and asked whether Velora is relevant.",
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
    summary: "Shared a positive open enrollment coordination story.",
    status: "Replied",
  },
];

export const adminUc5SynthesisRecommendation =
  `${pcpCompetitorNames[0]} is posting open enrollment operations stories 3x a week. You have a strong one in your inbox from Cheri Sparks. Want me to draft it?`;

export const adminUc5PrototypeFallback =
  "This prototype is scripted for the four performance reporting prompts. Choose a digest item or prompt chip to see the compact report.";
