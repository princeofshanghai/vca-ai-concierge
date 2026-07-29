import type { IconName } from "@/components/primitives/icon";

import {
  pcpCompanyProfile,
  pcpCompetitorNames,
  pcpProofSnippets,
  pcpVisitorPersona,
} from "./persona";
import { pcpAdminContentPerformanceFixture } from "./premium-company-pages-admin-content-fixture";

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
    value: `${pcpAdminContentPerformanceFixture.posts.arborOpenEnrollment.engagementRateLabel} engagement rate - ${pcpAdminContentPerformanceFixture.posts.arborOpenEnrollment.impressionsLabel} impressions`,
    query: "Tell me more about this open enrollment post.",
    followUps: [
      {
        prompt: "Why this post?",
        response: `Because the signal is strong. People who saw the Arbor Retail Group post engaged with it at ${pcpAdminContentPerformanceFixture.posts.arborOpenEnrollment.engagementRateLabel}, well above the Page average, and it reached ${pcpAdminContentPerformanceFixture.posts.arborOpenEnrollment.impressionsLabel} impressions. That makes it a good candidate to review for more reach.`,
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
    value: "8,740 visitors - down 18% vs last month",
    query: "Why did follower growth drop this month?",
    followUps: [
      {
        prompt: "How does this compare to last quarter?",
        response:
          "Last quarter averaged 10,800 visitors per month, so this month is down 19%. The drop appears tied to a posting gap after the open enrollment readiness post, not a loss of relevance with the audience.",
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
    label: "Tracked competitors are gaining followers faster",
    value: "All 3 gained more new followers than Velora",
    query: "Why are competitors gaining followers faster?",
    followUps: [],
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
    value: "8,740",
    changeValue: "18%",
    changeContext: "vs last month",
    tone: "negative",
  },
  {
    label: "New followers",
    value: "420",
    changeValue: "11%",
    changeContext: "vs last month",
    tone: "negative",
  },
  {
    label: "Follower total",
    value: "86,420",
    changeValue: "420",
    changeContext: "this month",
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
    impressions:
      pcpAdminContentPerformanceFixture.posts.arborOpenEnrollment
        .impressionsLabel,
    desktop: 32,
    mobile: 68,
  },
  {
    title: "Carrier file readiness checklist for open enrollment",
    impressions:
      pcpAdminContentPerformanceFixture.posts.carrierReadiness
        .impressionsLabel,
    desktop: 41,
    mobile: 59,
  },
  {
    title: "How HR teams keep employee communications aligned by population",
    impressions:
      pcpAdminContentPerformanceFixture.posts.midYearMigration.impressionsLabel,
    desktop: 27,
    mobile: 73,
  },
];

export const adminUc5LowPosts: ReadonlyArray<AdminUc5PostPerformance> = [
  {
    title: "Velora product update: eligibility rules",
    impressions: "4.2K",
    desktop: 52,
    mobile: 48,
  },
  {
    title: "June release notes for benefits workflow admins",
    impressions: "3.8K",
    desktop: 61,
    mobile: 39,
  },
];

export const adminUc5CompetitorRows: ReadonlyArray<AdminUc5CompetitorRow> = [
  {
    company: pcpCompanyProfile.name,
    postsPerWeek: "2",
    newFollowers: "420",
    commentsPerDay: "21",
    highlight: true,
  },
  {
    company: pcpCompetitorNames[0],
    postsPerWeek: "5",
    newFollowers: "1,280",
    commentsPerDay: "162",
  },
  {
    company: pcpCompetitorNames[1],
    postsPerWeek: "4",
    newFollowers: "940",
    commentsPerDay: "121",
  },
  {
    company: pcpCompetitorNames[2],
    postsPerWeek: "3",
    newFollowers: "610",
    commentsPerDay: "66",
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
