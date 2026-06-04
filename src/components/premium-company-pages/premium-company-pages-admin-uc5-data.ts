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
  analyticsLabel: string;
  followUps: ReadonlyArray<AdminUc5FollowUp>;
}>;

export type AdminUc5Metric = Readonly<{
  label: string;
  value: string;
  change: string;
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
    value: "4.2% engagement rate - only 180 impressions - posted 3 days ago",
    query: "One post is worth amplifying.",
    analyticsLabel: "View full Content analytics",
    followUps: [
      {
        prompt: "Why boost this post?",
        response:
          "Because the early signal is strong. People who saw the post engaged with it at 4.2%, well above the Page average, but only 180 people saw it. Boosting helps give proven content a fairer chance.",
      },
      {
        prompt: "What audience should I boost to?",
        response:
          "Start with small agency owners, creative directors, and operations leads at 1-20 person creative and marketing services firms. They are already showing up in your visitor data.",
      },
    ],
  },
  "follower-growth": {
    id: "follower-growth",
    icon: "people",
    label: "Follower growth is up this month",
    value: "312 visitors - +18 ppt vs last month",
    query: "Show me follower growth this month.",
    analyticsLabel: "View full Followers analytics",
    followUps: [
      {
        prompt: "How does this compare to last quarter?",
        response:
          "Last quarter averaged 274 visitors per month, so this month is 14% higher. New followers are also pacing ahead of last quarter's weekly average by 9 followers.",
      },
      {
        prompt: "Which posts drove the most follows?",
        response:
          "The late-payment case study drove the most follows, followed by the contractor payout spreadsheet post. Both converted because they named an agency-owner pain point directly.",
      },
    ],
  },
  "visitor-demographics": {
    id: "visitor-demographics",
    icon: "analytics",
    label: "Your page is attracting agency decision-makers",
    value: "Top visitors include founders, creative directors, and operators",
    query: "Who is visiting Velora's Page?",
    analyticsLabel: "View full Visitors analytics",
    followUps: [
      {
        prompt: "Are these the right people for Velora?",
        response:
          "Yes. The strongest visitor groups look like the people Velora is built to help: small agency owners, creative directors, and operators managing contractor payment complexity.",
      },
      {
        prompt: "How do I reach more of them?",
        response:
          "Post more founder-facing payment scenarios and boost the Studio Northline story to agency owners at 1-20 person creative and marketing services firms.",
      },
    ],
  },
  "content-engagement": {
    id: "content-engagement",
    icon: "popular-content",
    label: "See how viewers engage with your content",
    value: "Top post: 1,688 impressions - mostly mobile",
    query: "Which posts are performing best this week?",
    analyticsLabel: "View full Content analytics",
    followUps: [
      {
        prompt: "Why did the top post perform better?",
        response:
          "It led with a concrete operational risk: late clients creating late contractor payouts. That makes the problem obvious before readers need to understand Velora.",
      },
      {
        prompt: "What should I post next?",
        response:
          "Turn Cheri's question into a short post: 'If one client pays late, should every contractor payout pause?' Pair it with a simple before-and-after workflow.",
      },
    ],
  },
  "weekly-synthesis": {
    id: "weekly-synthesis",
    icon: "starburst",
    label: "Your weekly summary is ready",
    value: "3 things to act on this week",
    query: "Summarize the top things I should act on this week.",
    analyticsLabel: "View full Leads analytics",
    followUps: [
      {
        prompt: "Draft the Cheri Sparks customer story",
        primary: true,
        response:
          "Draft angle: 'How an 8-person creative agency keeps contractor payouts clear when clients pay late.' Lead with Cheri's late-payment question, then explain conditional payment schedules in one visual example.",
      },
      {
        prompt: "Which leads need a reply?",
        response:
          "Cheri Sparks needs the fastest reply because she is high intent and unreplied. Priya Shah is next because QuickBooks exports are a concrete buying question.",
      },
    ],
  },
};

export const adminUc5FollowerMetrics: ReadonlyArray<AdminUc5Metric> = [
  {
    label: "Visitors",
    value: "312",
    change: "+18 ppt MoM",
    tone: "positive",
  },
  {
    label: "New followers",
    value: "37",
    change: "+8% WoW",
    tone: "positive",
  },
  {
    label: "Follower total",
    value: "6,842",
    change: "+37 this week",
    tone: "positive",
  },
];

export const adminUc5DemographicGroups: ReadonlyArray<AdminUc5BarGroup> = [
  {
    label: "Company size",
    rows: [
      { label: "1-10 employees", percentage: 62 },
      { label: "11-50 employees", percentage: 24 },
    ],
  },
  {
    label: "Job function",
    rows: [
      { label: "Founders and creative directors", percentage: 65 },
      { label: "Operations", percentage: 18 },
    ],
  },
  {
    label: "Industry",
    rows: [
      { label: "Creative and marketing services", percentage: 58 },
      { label: "Financial services software", percentage: 16 },
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
      { label: "Owner / C-suite", percentage: 55 },
      { label: "Director", percentage: 21 },
    ],
  },
];

export const adminUc5TopPosts: ReadonlyArray<AdminUc5PostPerformance> = [
  {
    title: "What late client payments do to contractor trust",
    impressions: "1,688",
    desktop: 32,
    mobile: 68,
  },
  {
    title: "Agency ops win: replacing the payment spreadsheet",
    impressions: "1,204",
    desktop: 41,
    mobile: 59,
  },
  {
    title: "Which payout becomes risky if this client invoice is late?",
    impressions: "936",
    desktop: 27,
    mobile: 73,
  },
];

export const adminUc5LowPosts: ReadonlyArray<AdminUc5PostPerformance> = [
  {
    title: "Velora product update: payout settings",
    impressions: "214",
    desktop: 52,
    mobile: 48,
  },
  {
    title: "June release notes for payment workflow admins",
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
    company: "FreshBooks",
    postsPerWeek: "5",
    newFollowers: "82",
    commentsPerDay: "18",
  },
  {
    company: "QuickBooks",
    postsPerWeek: "4",
    newFollowers: "64",
    commentsPerDay: "14",
  },
  {
    company: "Wave",
    postsPerWeek: "3",
    newFollowers: "29",
    commentsPerDay: "7",
  },
];

export const adminUc5Leads: ReadonlyArray<AdminUc5Lead> = [
  {
    name: "Cheri Sparks",
    company: "Brightframe Studio",
    summary: "Asked how late client payments affect contractor payouts.",
    status: "High intent",
    replyNeeded: true,
  },
  {
    name: "Priya Shah",
    company: "North Pier Studio",
    summary: "Asked whether Velora supports QuickBooks exports.",
    status: "Awaiting reply",
    replyNeeded: true,
  },
  {
    name: "Maya Patel",
    company: "Studio Northline",
    summary: "Shared a positive agency ops workflow story.",
    status: "Replied",
  },
];

export const adminUc5SynthesisRecommendation =
  "FreshBooks is posting customer stories 3x a week. You have a strong one in your inbox from Cheri Sparks. Want me to draft it?";

export const adminUc5PrototypeFallback =
  "This prototype is scripted for the four performance reporting prompts. Choose a digest item or prompt chip to see the compact report.";
