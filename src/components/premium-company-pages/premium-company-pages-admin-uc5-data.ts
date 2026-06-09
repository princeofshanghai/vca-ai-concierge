import type { IconName } from "@/components/primitives/icon";

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

export const adminUc5InsightOrder: ReadonlyArray<AdminUc5InsightId> = [
  "post-amplification",
  "follower-growth",
  "visitor-demographics",
];

export const adminUc5Insights: Record<AdminUc5InsightId, AdminUc5Insight> = {
  "post-amplification": {
    id: "post-amplification",
    icon: "analytics",
    label: "One post is worth amplifying",
    value: "4.2% engagement rate - only 180 impressions",
    query: "Tell me more about this post.",
    followUps: [
      {
        prompt: "Why this post?",
        response:
          "Because the early signal is strong. People who saw the post engaged with it at 4.2%, well above the Page average, but only 180 people saw it. That makes it a good candidate to review for more reach.",
      },
      {
        prompt: "Who would this reach?",
        response:
          "The strongest audience fit is restaurant group marketers, digital ordering leads, and operators at 20-50 employee restaurant teams. They are already showing up in your visitor data.",
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
    label: "Follower growth is up this month",
    value: "312 visitors - 18 points vs last month",
    query: "Show me follower growth this month.",
    followUps: [
      {
        prompt: "How does this compare to last quarter?",
        response:
          "Last quarter averaged 274 visitors per month, so this month is 14% higher. New followers are also pacing ahead of last quarter's weekly average by 9 followers.",
      },
      {
        prompt: "Which posts drove the most follows?",
        response:
          "The delivery promotion checklist drove the most follows, followed by the menu rollout post. Both converted because they named a restaurant marketing ops pain point directly.",
      },
    ],
  },
  "visitor-demographics": {
    id: "visitor-demographics",
    icon: "analytics",
    label: "Delivery promo content is pulling the right audience",
    value: "64% of engaged visitors match multi-location restaurant teams",
    query: "Who is visiting Velora's Page?",
    followUps: [
      {
        prompt: "Are these the right people for Velora?",
        response:
          "Yes. The strongest visitor groups look like the people Velora is built to help: restaurant group marketers, digital ordering leads, and operators managing menu, delivery, and local campaign complexity.",
      },
      {
        prompt: "How do I reach more of them?",
        response:
          "Post more operator-facing online ordering scenarios and boost the Northline Kitchen Group story to marketing and operations leads at 20-50 employee restaurant teams.",
      },
    ],
  },
  "content-engagement": {
    id: "content-engagement",
    icon: "popular-content",
    label: "One post is outperforming its reach",
    value: "Northline story: strong engagement - modest impressions",
    query: "What should I do with this high-engagement post?",
    followUps: [
      {
        prompt: "Why did the top post perform better?",
        response:
          "It led with a concrete operational risk: delivery app promotions creating inconsistent menus and hard-to-read performance. That makes the problem obvious before readers need to understand Velora.",
      },
      {
        prompt: "What should I post next?",
        response:
          "Turn Cheri's question into a short post: 'Which locations are losing repeat orders after a delivery promo ends?' Pair it with a simple before-and-after workflow.",
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
          "Draft angle: 'How Northline Kitchen Group kept delivery menus consistent across six locations.' Lead with Cheri's delivery promotion question, then explain location-level campaign reporting in one visual example.",
      },
      {
        prompt: "Which leads need a reply?",
        response:
          "Cheri Sparks needs the fastest reply because she is high intent and unreplied. Priya Shah is next because POS and menu exports are a concrete buying question.",
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
    tone: "positive",
  },
  {
    label: "New followers",
    value: "37",
    changeValue: "8%",
    changeContext: "vs last week",
    tone: "positive",
  },
  {
    label: "Follower total",
    value: "6,842",
    changeValue: "37",
    changeContext: "this week",
    tone: "positive",
  },
];

export const adminUc5DemographicGroups: ReadonlyArray<AdminUc5BarGroup> = [
  {
    label: "Company size",
    rows: [
      { label: "20-50 employees", percentage: 62 },
      { label: "51-200 employees", percentage: 24 },
    ],
  },
  {
    label: "Job function",
    rows: [
      { label: "Marketing and operations", percentage: 65 },
      { label: "Digital ordering", percentage: 18 },
    ],
  },
  {
    label: "Industry",
    rows: [
      { label: "Restaurants", percentage: 58 },
      { label: "Hospitality technology", percentage: 16 },
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
      { label: "Manager / Director", percentage: 55 },
      { label: "Owner / Operator", percentage: 21 },
    ],
  },
];

export const adminUc5TopPosts: ReadonlyArray<AdminUc5PostPerformance> = [
  {
    title: "How restaurant teams keep delivery menus consistent across locations",
    impressions: "1,688",
    desktop: 32,
    mobile: 68,
  },
  {
    title: "Restaurant ops win: one launch calendar for every location",
    impressions: "1,204",
    desktop: 41,
    mobile: 59,
  },
  {
    title: "Which location loses repeat orders after a delivery promo ends?",
    impressions: "936",
    desktop: 27,
    mobile: 73,
  },
];

export const adminUc5LowPosts: ReadonlyArray<AdminUc5PostPerformance> = [
  {
    title: "Velora product update: menu rules",
    impressions: "214",
    desktop: 52,
    mobile: 48,
  },
  {
    title: "June release notes for campaign workflow admins",
    impressions: "168",
    desktop: 61,
    mobile: 39,
  },
];

export const adminUc5CompetitorRows: ReadonlyArray<AdminUc5CompetitorRow> = [
  {
    company: "Velora",
    postsPerWeek: "2",
    newFollowers: "37",
    commentsPerDay: "11",
    highlight: true,
  },
  {
    company: "Toast",
    postsPerWeek: "5",
    newFollowers: "82",
    commentsPerDay: "18",
  },
  {
    company: "Popmenu",
    postsPerWeek: "4",
    newFollowers: "64",
    commentsPerDay: "14",
  },
  {
    company: "Owner.com",
    postsPerWeek: "3",
    newFollowers: "29",
    commentsPerDay: "7",
  },
];

export const adminUc5Leads: ReadonlyArray<AdminUc5Lead> = [
  {
    name: "Cheri Sparks",
    company: "Brightframe Kitchen Group",
    summary: "Asked how to measure delivery promotions across locations.",
    status: "High intent",
    replyNeeded: true,
  },
  {
    name: "Priya Shah",
    company: "North Pier Restaurants",
    summary: "Asked whether Velora supports POS and menu exports.",
    status: "Awaiting reply",
    replyNeeded: true,
  },
  {
    name: "Maya Patel",
    company: "Northline Kitchen Group",
    summary: "Shared a positive multi-location campaign workflow story.",
    status: "Replied",
  },
];

export const adminUc5SynthesisRecommendation =
  "Popmenu is posting customer stories 3x a week. You have a strong one in your inbox from Cheri Sparks. Want me to draft it?";

export const adminUc5PrototypeFallback =
  "This prototype is scripted for the four performance reporting prompts. Choose a digest item or prompt chip to see the compact report.";
