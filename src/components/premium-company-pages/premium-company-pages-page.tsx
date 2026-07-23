"use client";

import Image from "next/image";
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import { startClassedViewTransition } from "@/components/chat/chat-motion";
import {
  ChatEndFeedbackScreen,
  Prompt,
  type ChatPanelVariant,
} from "@/components/chat/chat-ui";
import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import { IntentPrefetchLink } from "@/components/primitives/intent-prefetch-link";
import { Pill } from "@/components/primitives/pill";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";
import {
  SduiReactionIcon,
  type SduiReactionIconType,
} from "@/components/primitives/reaction-icon";
import { TabItemHorizontal } from "@/components/primitives/tab-item-horizontal";
import { Tag } from "@/components/primitives/tag";
import { TextArea } from "@/components/primitives/text-area";

import {
  PCP_ASSET_ROOT,
  pcpAdminPersona,
  pcpAdminScenario,
  pcpCompanyProfile,
  pcpCompetitorNames,
  pcpProofSnippets,
  pcpVcaScenario,
  pcpVisitorPersona,
} from "./persona";
import {
  ADMIN_SETTINGS_HREF,
  assistantColorOptions,
  assistantDefaultColor,
  defaultKnowledgeLinks,
  premiumRailItems,
  primaryRailItems,
  railItemHrefs,
  secondaryRailItems,
  settingsRows,
  type AssistantColorOption,
  type SettingsRowData,
} from "./premium-company-pages-admin-data";
import { GlobalInboxTray } from "./global-inbox-tray";
import {
  InsightCard,
  type InsightCardType,
  type InsightCardVisual,
} from "./insight-card";
import {
  ADMIN_UC5_SELF_INITIATED_PROMPTS,
  AdminPerformanceDigestCard,
  AdminUc5AgentPanel,
  buildAdminUc5PrototypeFallbackTurn,
  type AdminUc5SelfInitiatedView,
  type AdminUc5ThreadTurn,
} from "./premium-company-pages-admin-uc5";
import {
  type AdminUc5FollowUp,
  type AdminUc5InsightId,
  type AdminUc5InsightSelection,
} from "./premium-company-pages-admin-uc5-data";
import { FabPromptStack } from "./fab-prompt-stack";
import { TodayActionCard } from "./today-action-card";
import { useHorizontalCarousel } from "./use-horizontal-carousel";
import { VcaFab } from "./vca-fab";

const ASSET_ROOT = PCP_ASSET_ROOT;

type PerformanceCardData = Readonly<{
  title: string;
  value?: string;
  delta?: string;
  deltaMeta?: string;
  deltaTone?: "negative" | "positive";
  label?: string;
  premium?: boolean;
}>;

type InboxThreadData = Readonly<{
  name: string;
  role: string;
  topic: string;
  snippet: string;
  timestamp: string;
  avatar: string;
  selected?: boolean;
  vca?: boolean;
}>;

type AnalyticsTabId =
  | "content"
  | "visitors"
  | "followers"
  | "search-appearances"
  | "competitors"
  | "leads"
  | "newsletters";

type AnalyticsTrendTone = "negative" | "positive";

type AnalyticsHighlightData = Readonly<{
  label: string;
  tone?: AnalyticsTrendTone;
  value: string;
  delta: string;
}>;

type ContentEngagementRowData = Readonly<{
  title: string;
  postedBy: string;
  date: string;
  boostEstimate?: string;
  reactions: string;
  comments: string;
  reposts: string;
  follows: string;
  engagementRate: string;
}>;

type AnalyticsInsightCardData = Readonly<{
  dismissLabel: string;
  evidence: string;
  headline: string;
  insightId: AdminUc5InsightId;
  question: string;
  type: InsightCardType;
  visual?: InsightCardVisual;
}>;

type VisitorHighlightData = Readonly<{
  label: string;
  value: string;
  delta: string;
  tone: AnalyticsTrendTone;
}>;

type VisitorProfileData = Readonly<{
  name: string;
  headline: string;
  location: string;
  detail: string;
  shown: string;
  avatar: string;
}>;

type VisitorDemographicRowData = Readonly<{
  label: string;
  count: string;
  percentage: string;
  barPercent: number;
}>;

type CompetitorHighlightData = Readonly<{
  label: string;
  value: string;
  delta: string;
  tone: AnalyticsTrendTone;
  context: string;
}>;

type CompetitorGrowthMetricData = Readonly<{
  value: string;
  delta: string;
  tone: AnalyticsTrendTone;
}>;

type CompetitorGrowthRowData = Readonly<{
  rank: number;
  company: string;
  followers: string;
  isYou?: boolean;
  newFollowers: CompetitorGrowthMetricData;
  posts: CompetitorGrowthMetricData;
  comments: CompetitorGrowthMetricData;
  commentsPerDay: CompetitorGrowthMetricData;
  reactions: CompetitorGrowthMetricData;
}>;

type CompetitorPostData = Readonly<{
  company: string;
  timestamp: string;
  body: string;
  title: string;
  meta: string;
  image: string;
  imageAlt: string;
  reactions: string;
  comments: string;
}>;

type CompetitiveTipData = Readonly<{
  title: string;
  description: string;
  action: string;
  illustration: string;
}>;

type RecentPostBaseData = Readonly<{
  body: string;
  comments: string;
  id: string;
  metric: string;
  reactionTypes?: ReadonlyArray<SduiReactionIconType>;
  reactions: string;
  timestamp: string;
}>;

type RecentImagePostData = RecentPostBaseData &
  Readonly<{
    image: string;
    imageAlt: string;
    kind: "image";
    linkMeta?: string;
    linkTitle?: string;
  }>;

type RecentKudosPostData = RecentPostBaseData &
  Readonly<{
    illustrationAlt: string;
    illustrationSrc: string;
    kind: "kudos";
    recipient: string;
  }>;

type RecentVideoPostData = RecentPostBaseData &
  Readonly<{
    caption: string;
    image: string;
    imageAlt: string;
    kind: "video";
    liveTime: string;
    timeLabel: string;
  }>;

type RecentEmptyPostData = Readonly<{
  buttonLabel: string;
  id: string;
  illustrationAlt: string;
  illustrationSrc: string;
  kind: "empty";
  message: string;
}>;

type RecentPostData =
  | RecentEmptyPostData
  | RecentImagePostData
  | RecentKudosPostData
  | RecentVideoPostData;

type PremiumCompanyPagesAdminStory =
  | "current-state"
  | "current"
  | "old";

type AnalyticsContextualPrompt =
  | Readonly<{
      insightId: AdminUc5InsightId;
      label: string;
      type: "insight";
    }>
  | Readonly<{
      label: string;
      type: "self-initiated";
      view: AdminUc5SelfInitiatedView;
    }>;

type AnalyticsContextualPromptHandlers = Readonly<{
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
  onSelfInitiatedViewSelect: (
    view: AdminUc5SelfInitiatedView,
    prompt?: string,
  ) => void;
}>;

type AnalyticsContextualPromptSlotProps =
  Partial<AnalyticsContextualPromptHandlers> &
    Readonly<{
      contextualPrompts?: ReadonlyArray<AnalyticsContextualPrompt>;
      flush?: boolean;
      presentation?: "dashboard" | "default";
      showDivider?: boolean;
    }>;

const performanceCards: Array<PerformanceCardData> = [
  {
    title: "Who visited your Page",
    label: "Premium insight",
    premium: true,
  },
  {
    title: "Search appearances",
    value: "2,640",
    delta: "15%",
    deltaMeta: "last 7 days",
    deltaTone: "negative",
  },
  {
    title: "New followers",
    value: "420",
    delta: "8%",
    deltaMeta: "last 7 days",
    deltaTone: "positive",
  },
  {
    title: "Page visitors",
    value: "4,280",
    delta: "15%",
    deltaMeta: "last 7 days",
    deltaTone: "negative",
  },
  {
    title: "Post impressions",
    value: "38.4K",
    delta: "15%",
    deltaMeta: "last 7 days",
    deltaTone: "positive",
  },
  {
    title: "Visitors from audiences",
    value: "18.4K",
    label: "Premium insight",
    premium: true,
  },
];

const currentStandardPerformanceCards: ReadonlyArray<PerformanceCardData> = [
  {
    title: "Search appearances",
    value: "2,640",
    delta: "15%",
    deltaTone: "negative",
  },
  {
    title: "Followers",
    value: "420",
    delta: "8%",
    deltaTone: "positive",
  },
  {
    title: "Post impressions",
    value: "38.4K",
    delta: "15%",
    deltaTone: "positive",
  },
  {
    title: "Page visitors",
    value: "4,280",
    delta: "15%",
    deltaTone: "negative",
  },
];

const currentPremiumPerformanceCards: ReadonlyArray<PerformanceCardData> = [
  {
    title: "Who visited your Page",
    premium: true,
  },
  {
    title: "Visits from audiences",
    value: "18.4K",
    premium: true,
  },
  {
    title: "Leaders engagement",
    value: "8.5K",
    delta: "7.4%",
    deltaTone: "positive",
    premium: true,
  },
  {
    title: "Content engagers",
    value: "97",
    delta: "4.8%",
    deltaTone: "positive",
    premium: true,
  },
];
const PERFORMANCE_CARDS_VISIBLE_COUNT = 4;

const recentPosts: ReadonlyArray<RecentPostData> = [
  {
    body: "What benefits teams should validate before a mid-year platform migration: eligibility data, carrier file readiness, employee communications, and open enrollment timing.",
    id: "migration-readiness",
    kind: "image",
    metric: "Get up to 52K more impressions by boosting",
    image: "recent-post-checklist.png",
    imageAlt: "Checklist illustration with a red check mark and pencil",
    linkTitle: "Benefits migration readiness checklist",
    linkMeta: "veloracloud.com",
    reactions: "1,248",
    comments: "146 Comments",
    reactionTypes: ["interest", "like"],
    timestamp: "5d ago",
  },
  {
    body: "It has been awesome to see the growth our customers have experienced in the last 10 years, while keeping benefits support simple.",
    id: "kudos-aarti",
    illustrationAlt: "People celebrating a workplace kudos moment",
    illustrationSrc: "/assets/sdui/illustrations/illustration.svg",
    kind: "kudos",
    metric: "Get up to 48K more impressions by boosting",
    recipient: "Aarti Korapati",
    reactions: "2,840",
    comments: "318 Comments",
    reactionTypes: ["interest", "like", "praise"],
    timestamp: "1w ago",
  },
  {
    body: "Best practices for measuring results: start with one goal, track the same metrics weekly, and compare changes against a clear baseline.",
    id: "operating-question",
    kind: "image",
    metric: "Get up to 35K more impressions by boosting",
    image: "recent-post-analytics-results.png",
    imageAlt: "3D analytics dashboard with charts and data visualizations",
    reactions: "1,760",
    comments: "204 Comments",
    reactionTypes: ["empathy", "interest", "praise"],
    timestamp: "2w ago",
  },
  {
    body: "We worked with Veno for a few years on this project and one thing we will never forget is how quickly their team rallied around employee experience.",
    caption: "The best way to learn something new is",
    comments: "86 Comments",
    id: "live-demo-video",
    image: "member/post-image-2.png",
    imageAlt: "Video preview for a Velora customer story",
    kind: "video",
    liveTime: "5:30 PM",
    metric: "Get up to 42K more impressions by boosting",
    reactions: "940",
    reactionTypes: ["interest", "like", "maybe", "praise"],
    timeLabel: "0:50 / 3:17",
    timestamp: "3w ago",
  },
  {
    buttonLabel: "Start a post",
    id: "all-caught-up",
    illustrationAlt: "Notepad illustration",
    illustrationSrc: "/assets/sdui/illustrations/notepad-large.svg",
    kind: "empty",
    message: "All caught up. Pages that post 2x a week grow 5x faster.",
  },
];

const vcaLeadBrief = {
  buyer: pcpVisitorPersona.name,
  role: `${pcpVisitorPersona.title} at ${pcpVisitorPersona.company}`,
  avatar: pcpVisitorPersona.avatar,
  companyContext: pcpVisitorPersona.companyContext,
  need: pcpVisitorPersona.evaluationNeed,
  signals:
    "Viewed Velora's Arbor Retail Group post and explored whether Velora is relevant for HR and benefits operations",
  proofShown: pcpProofSnippets.caseStudyShort,
  outcome: `Sent ${pcpAdminPersona.firstName} a drafted message through Velora`,
  sentMessage: pcpVcaScenario.handoffMessage,
  intentSummary: pcpAdminScenario.leadSummary,
  intentTags: pcpVisitorPersona.intentTags,
  suggestedReply: pcpAdminScenario.suggestedReply,
  suggestedPrep: pcpAdminScenario.suggestedPrep,
};

const inboxThreads: ReadonlyArray<InboxThreadData> = [
  {
    name: vcaLeadBrief.buyer,
    role: vcaLeadBrief.role,
    topic: "Velora Page post follow-up",
    snippet: pcpAdminScenario.inboxThreadPreview,
    timestamp: "4:48 PM",
    avatar: vcaLeadBrief.avatar,
    selected: true,
    vca: true,
  },
  {
    name: "Dana Kim",
    role: "VP of People Operations at Arbor Retail Group",
    topic: "Services",
    snippet: "Rose: Glad the migration readiness view helped your team.",
    timestamp: "4:44 PM",
    avatar: "avatar-1.png",
  },
  {
    name: "Priya Shah",
    role: "Director of Benefits at Calico Health Network",
    topic: "Other",
    snippet: "Priya: Does Velora support carrier file validation?",
    timestamp: "May 31",
    avatar: "avatar-3.png",
  },
  {
    name: "Luis Romero",
    role: "People Operations Lead at Grove Health",
    topic: "Service request",
    snippet: "Luis: We need a clearer way to track eligibility exceptions...",
    timestamp: "May 21",
    avatar: "avatar-2.png",
  },
  {
    name: "Diana Lin",
    role: "Benefits Manager at Lin Manufacturing",
    topic: "Careers",
    snippet: "Diana: Are you hiring benefits implementation specialists?",
    timestamp: "Mar 30",
    avatar: "avatar-1.png",
  },
];

const analyticsTabs: ReadonlyArray<Readonly<{
  id: AnalyticsTabId;
  label: string;
}>> = [
  { id: "content", label: "Content" },
  { id: "visitors", label: "Visitors" },
  { id: "followers", label: "Followers" },
  { id: "search-appearances", label: "Search appearances" },
  { id: "competitors", label: "Competitors" },
  { id: "leads", label: "Leads" },
  { id: "newsletters", label: "Newsletters" },
];

const analyticsHighlights: ReadonlyArray<AnalyticsHighlightData> = [
  {
    label: "Impressions",
    tone: "negative",
    value: "64,800",
    delta: "18.4%",
  },
  {
    label: "Reactions",
    value: "3,420",
    delta: "12.7%",
  },
  {
    label: "Comments",
    value: "640",
    delta: "9.3%",
  },
  {
    label: "Reposts",
    value: "216",
    delta: "15.6%",
  },
];

const VISITOR_ANALYTICS_DATE_RANGE = "May 11, 2026 - Jun 9, 2026";

const visitorHighlights: ReadonlyArray<VisitorHighlightData> = [
  {
    label: "Page views",
    value: "8,740",
    delta: "28%",
    tone: "positive",
  },
  {
    label: "Unique visitors",
    value: "3,180",
    delta: "20.2%",
    tone: "negative",
  },
  {
    label: "Custom button clicks",
    value: "126",
    delta: "33%",
    tone: "negative",
  },
];

const visitorProfiles: ReadonlyArray<VisitorProfileData> = [
  {
    name: pcpVisitorPersona.name,
    headline: `${pcpVisitorPersona.title} at ${pcpVisitorPersona.company}`,
    location: "United States",
    detail: "Works in Human Resources industry",
    shown: "Shown just now",
    avatar: pcpVisitorPersona.avatar,
  },
  {
    name: "Priya Shah",
    headline: "Director of Benefits at Calico Health Network",
    location: "United States",
    detail: "Works in Healthcare industry",
    shown: "Shown 2 days ago",
    avatar: "avatar-3.png",
  },
  {
    name: "Dana Kim",
    headline: "VP of People Operations at Arbor Retail Group",
    location: "United States",
    detail: "Works in Retail industry",
    shown: "Shown 4 days ago",
    avatar: "avatar-2.png",
  },
];

const visitorDemographics: ReadonlyArray<VisitorDemographicRowData> = [
  {
    label: "Human Resources",
    count: "1,323",
    percentage: "41.6",
    barPercent: 100,
  },
  {
    label: "Operations",
    count: "684",
    percentage: "21.5",
    barPercent: 52,
  },
  {
    label: "Information Technology",
    count: "175",
    percentage: "5.5",
    barPercent: 13,
  },
  {
    label: "Product Management",
    count: "143",
    percentage: "4.5",
    barPercent: 11,
  },
  {
    label: "Business Development",
    count: "124",
    percentage: "3.9",
    barPercent: 9,
  },
  {
    label: "Marketing",
    count: "118",
    percentage: "3.7",
    barPercent: 9,
  },
];

const COMPETITOR_ANALYTICS_DATE_RANGE = "May 11, 2026 - Jun 9, 2026";

const competitorHighlights: ReadonlyArray<CompetitorHighlightData> = [
  {
    label: "Comments on posts",
    value: "640",
    delta: "61%",
    tone: "negative",
    context: "vs competitors",
  },
  {
    label: "New followers",
    value: "420",
    delta: "67%",
    tone: "negative",
    context: "vs competitors",
  },
];

const competitorGrowthRows: ReadonlyArray<CompetitorGrowthRowData> = [
  {
    rank: 1,
    company: pcpCompetitorNames[0],
    followers: "128K followers",
    newFollowers: { value: "1,280", delta: "24%", tone: "positive" },
    posts: { value: "22", delta: "83.3%", tone: "positive" },
    comments: { value: "4,850", delta: "18.7%", tone: "positive" },
    commentsPerDay: { value: "162", delta: "63.6%", tone: "positive" },
    reactions: { value: "42.8K", delta: "32.4%", tone: "positive" },
  },
  {
    rank: 2,
    company: pcpCompetitorNames[1],
    followers: "104K followers",
    newFollowers: { value: "940", delta: "12.5%", tone: "positive" },
    posts: { value: "18", delta: "50%", tone: "positive" },
    comments: { value: "3,620", delta: "6.8%", tone: "positive" },
    commentsPerDay: { value: "121", delta: "27.3%", tone: "positive" },
    reactions: { value: "31.6K", delta: "18.6%", tone: "positive" },
  },
  {
    rank: 3,
    company: pcpCompetitorNames[2],
    followers: "91K followers",
    newFollowers: { value: "610", delta: "7.3%", tone: "positive" },
    posts: { value: "15", delta: "25%", tone: "positive" },
    comments: { value: "1,980", delta: "28.8%", tone: "negative" },
    commentsPerDay: { value: "66", delta: "36.4%", tone: "negative" },
    reactions: { value: "18.4K", delta: "9.2%", tone: "positive" },
  },
  {
    rank: 4,
    company: pcpCompanyProfile.name,
    followers: pcpCompanyProfile.followers,
    isYou: true,
    newFollowers: { value: "420", delta: "64.6%", tone: "negative" },
    posts: { value: "12", delta: "45.5%", tone: "negative" },
    comments: { value: "640", delta: "73.3%", tone: "negative" },
    commentsPerDay: { value: "21", delta: "38.9%", tone: "negative" },
    reactions: { value: "9.2K", delta: "73%", tone: "negative" },
  },
];

const competitorPosts: ReadonlyArray<CompetitorPostData> = [
  {
    company: pcpCompetitorNames[0],
    timestamp: "posted this - 1w",
    body:
      "Open enrollment gets easier when carrier file readiness, eligibility cleanup, and employee communications are checked before October.",
    title: "5 things benefits teams should lock down before enrollment opens",
    meta: "Checklist - 8 min read",
    image: "member/post-image-2.png",
    imageAlt: "Open enrollment planning post preview",
    reactions: "8,420",
    comments: "640 comments - 218 reposts",
  },
  {
    company: pcpCompetitorNames[1],
    timestamp: "posted this - 2w",
    body:
      "Benefits teams do not need another tracker. They need one place to see which carrier files are ready, blocked, or waiting on follow-up.",
    title: "Carrier readiness scorecard for distributed HR teams",
    meta: "Document - 6 pages",
    image: "feed-post-content.png",
    imageAlt: "Benefits analytics post preview",
    reactions: "6,780",
    comments: "512 comments - 174 reposts",
  },
  {
    company: pcpCompetitorNames[2],
    timestamp: "posted this - 3w",
    body:
      "Seasonal worker enrollment windows can break when eligibility rules live outside the benefits operations workflow.",
    title: "How people teams support seasonal enrollment without spreadsheets",
    meta: "Case study - 5 min read",
    image: "member/post-image-1.png",
    imageAlt: "Benefits operations dashboard post preview",
    reactions: "4,260",
    comments: "288 comments - 96 reposts",
  },
];

const competitiveTips: ReadonlyArray<CompetitiveTipData> = [
  {
    title: "Grow your audience",
    description:
      "Increase reach by inviting relevant prospects to follow your Page.",
    action: "Invite to follow",
    illustration: "invite-large.svg",
  },
  {
    title: "Drive more engagement",
    description:
      "Posting at least 3x a week can help significantly increase engagement.",
    action: "Start a post",
    illustration: "rocket-large.svg",
  },
  {
    title: "Follow peer Pages",
    description:
      "Get inspiration, join conversations, and get in front of more audiences.",
    action: "Find Pages to follow",
    illustration: "article-stack-large.svg",
  },
];

const contentEngagementRows: ReadonlyArray<ContentEngagementRowData> = [
  {
    title: "How Arbor prepared 12,000 employees for open enrollment",
    postedBy: pcpAdminPersona.name,
    date: "6/8/2026",
    boostEstimate: "Get up to 120,000 more impressions by boosting this post.",
    reactions: "1,240",
    comments: "146",
    reposts: "64",
    follows: "118",
    engagementRate: "8.2%",
  },
  {
    title: "Carrier file readiness checklist for enterprise benefits teams",
    postedBy: "Velora",
    date: "6/6/2026",
    reactions: "980",
    comments: "112",
    reposts: "46",
    follows: "94",
    engagementRate: "7.1%",
  },
  {
    title: "What breaks first when benefits teams migrate mid-year?",
    postedBy: pcpAdminPersona.name,
    date: "6/3/2026",
    boostEstimate: "Get up to 84,000 more impressions by boosting this post.",
    reactions: "720",
    comments: "84",
    reposts: "31",
    follows: "58",
    engagementRate: "6.3%",
  },
  {
    title: "Eligibility cleanup should not require five spreadsheets",
    postedBy: "Velora",
    date: "5/30/2026",
    reactions: "540",
    comments: "62",
    reposts: "24",
    follows: "42",
    engagementRate: "5.2%",
  },
];

const visitorAnalyticsInsightCards: ReadonlyArray<AnalyticsInsightCardData> = [
  {
    dismissLabel: "Dismiss audience insight",
    evidence:
      "64% of visitors match your target audience by function, seniority, and industry.",
    headline: "Your page is reaching more relevant visitors",
    insightId: "visitor-demographics",
    question: "Is my Page reaching more relevant visitors?",
    type: "audience-fit",
    visual: {
      kind: "avatar-pair",
      primary: {
        label: "Priya Shah",
        src: assetSrc("avatar-3.png"),
      },
      secondary: {
        label: "Dana Kim",
        src: assetSrc("avatar-2.png"),
      },
    },
  },
];

const contentAnalyticsInsightCards: ReadonlyArray<AnalyticsInsightCardData> = [
  {
    dismissLabel: "Dismiss content engagement insight",
    evidence:
      "Your top 2 posts by engagement both focus on carrier readiness and eligibility cleanup.",
    headline: "Carrier coordination content is resonating",
    insightId: "content-engagement",
    question: "What content is resonating most?",
    type: "opportunity",
    visual: {
      alt: "Carrier coordination post preview",
      kind: "post-thumbnail",
      src: assetSrc("member/post-image-1.png"),
    },
  },
];

const competitorAnalyticsInsightCards: ReadonlyArray<AnalyticsInsightCardData> = [
  {
    dismissLabel: "Dismiss competitor growth insight",
    evidence: "1,280 new followers this month vs. Velora's 420.",
    headline: `${pcpCompetitorNames[0]} is pulling ahead in follower growth`,
    insightId: "competitor-growth",
    question: `Why is ${pcpCompetitorNames[0]} gaining followers faster than us?`,
    type: "competitive",
    visual: {
      kind: "company-logo",
      label: pcpCompetitorNames[0],
    },
  },
];

const wipContentPromptRows: ReadonlyArray<AnalyticsContextualPrompt> = [
  {
    label: "What should I post next?",
    type: "self-initiated",
    view: "next-focus",
  },
];

const wipContentHighlightsPromptRows: ReadonlyArray<AnalyticsContextualPrompt> =
  [
    {
      label: "Why are post impressions down?",
      type: "self-initiated",
      view: "post-impressions",
    },
  ];

const wipVisitorHighlightsPromptRows: ReadonlyArray<AnalyticsContextualPrompt> =
  [
    {
      label: "How can I get more custom button clicks?",
      type: "self-initiated",
      view: "custom-button-clicks",
    },
  ];

const wipVisitorDemographicsPromptRows: ReadonlyArray<AnalyticsContextualPrompt> =
  [
    {
      label: "How can I reach more visitors like this?",
      type: "self-initiated",
      view: "visitor-audience",
    },
  ];

const dashboardVisitorPromptRows: ReadonlyArray<AnalyticsContextualPrompt> = [
  {
    label: "Which visitors look most relevant?",
    type: "self-initiated",
    view: "relevant-visitors",
  },
  {
    label: "What kinds of visitors am I attracting?",
    type: "self-initiated",
    view: "visitor-audience",
  },
];

const wipCompetitorGrowthPromptRows: ReadonlyArray<AnalyticsContextualPrompt> =
  [
    {
      insightId: "competitor-growth",
      label: "Why are competitors gaining followers faster?",
      type: "insight",
    },
  ];

const wipCompetitorPostsPromptRows: ReadonlyArray<AnalyticsContextualPrompt> = [
  {
    label: "What should I post next?",
    type: "self-initiated",
    view: "next-focus",
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${ASSET_ROOT}/${path}`;
}

function getRailItemHrefForStory(
  label: string,
  story: PremiumCompanyPagesAdminStory,
) {
  const href = railItemHrefs[label];

  if (!href) {
    return href;
  }

  if (story === "old") {
    if (label === "Dashboard") {
      return "/premium-company-pages/admin/old";
    }

    if (label === "Analytics") {
      return "/premium-company-pages/admin/old/analytics";
    }
  }

  if (story === "current-state") {
    if (label === "Dashboard") {
      return "/premium-company-pages/admin/current-state";
    }

    if (label === "Analytics") {
      return "/premium-company-pages/admin/current-state/analytics";
    }
  }

  return href;
}

function ContextualAiPromptRow({
  flush = false,
  onInsightSelect,
  onSelfInitiatedViewSelect,
  presentation = "default",
  prompts,
  showDivider = true,
}: AnalyticsContextualPromptHandlers &
  Readonly<{
    flush?: boolean;
    presentation?: "dashboard" | "default";
    prompts: ReadonlyArray<AnalyticsContextualPrompt>;
    showDivider?: boolean;
  }>) {
  if (prompts.length === 0) {
    return null;
  }

  function handlePromptSelect(prompt: string) {
    const selectedPrompt = prompts.find((item) => item.label === prompt);

    if (!selectedPrompt) {
      return;
    }

    if (selectedPrompt.type === "insight") {
      onInsightSelect({
        id: selectedPrompt.insightId,
        prompt: selectedPrompt.label,
      });

      return;
    }

    onSelfInitiatedViewSelect(selectedPrompt.view, selectedPrompt.label);
  }

  return (
    <div
      className={cx(
        showDivider && "border-t border-border-faint",
        flush ? "px-0 py-0" : "px-lg py-md",
      )}
    >
      <div className="flex flex-wrap items-start gap-sm">
        {prompts.map((prompt) => (
          <Prompt
            className={cx(
              "md:max-w-none",
              presentation === "dashboard" &&
                "min-h-[56px] !rounded-sm !p-lg",
            )}
            key={prompt.label}
            onPromptSelect={handlePromptSelect}
            prompt={prompt.label}
          >
            <span className="inline-flex min-w-0 items-center gap-xs">
              <Icon
                aria-hidden="true"
                className="shrink-0 text-premium-inbug [&&]:size-4"
                name="signal-ai"
                size="small"
              />
              <span
                className={cx(
                  "min-w-0",
                  presentation === "dashboard"
                    ? "font-normal"
                    : "font-semibold",
                )}
              >
                {prompt.label}
              </span>
            </span>
          </Prompt>
        ))}
      </div>
    </div>
  );
}

function ContextualAiPromptSlot({
  contextualPrompts,
  flush,
  onInsightSelect,
  onSelfInitiatedViewSelect,
  presentation,
  showDivider,
}: AnalyticsContextualPromptSlotProps) {
  if (
    !contextualPrompts?.length ||
    !onInsightSelect ||
    !onSelfInitiatedViewSelect
  ) {
    return null;
  }

  return (
    <ContextualAiPromptRow
      flush={flush}
      onInsightSelect={onInsightSelect}
      onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
      presentation={presentation}
      prompts={contextualPrompts}
      showDivider={showDivider}
    />
  );
}

function PremiumMark({
  label,
  showText = false,
}: Readonly<{ label?: string; showText?: boolean }>) {
  if (!showText || !label) {
    return <PremiumChipSmall label={label} />;
  }

  return (
    <span className="inline-flex items-center gap-xs text-control-sm font-medium text-text">
      <PremiumChipSmall label={label} />
      <span>{label}</span>
    </span>
  );
}

function CompanyPremiumBug() {
  return (
    <Icon
      aria-hidden="true"
      className="shrink-0 text-premium-inbug"
      name="linked-in-bug"
      size="medium"
    />
  );
}

function NewFeatureTag() {
  return (
    <Tag
      className="!bg-ai-background-soft !text-action"
      size="small"
    >
      New
    </Tag>
  );
}

function InlineAction({ children }: Readonly<{ children: string }>) {
  return (
    <button
      className="font-semibold text-action hover:underline"
      type="button"
    >
      {children}
    </button>
  );
}

function RailSection({
  items,
  activeItem,
  onItemSelect,
  story,
  withPremiumIcon = false,
}: Readonly<{
  items: ReadonlyArray<string | { label: string; icon?: IconName }>;
  activeItem?: string;
  onItemSelect?: (label: string) => void;
  story: PremiumCompanyPagesAdminStory;
  withPremiumIcon?: boolean;
}>) {
  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const icon = typeof item === "string" ? undefined : item.icon;
        const active = activeItem === label;
        const href = getRailItemHrefForStory(label, story);
        const itemClassName = cx(
          "flex min-h-10 w-full items-center gap-sm px-xxl py-sm text-left text-control-md transition-colors hover:bg-background-transparent-hover",
          active
            ? "border-l-2 border-positive pl-[22px] text-positive"
            : "text-label",
        );
        const itemContent = (
          <>
            {withPremiumIcon && label === "Premium features" ? (
              <PremiumMark label="Premium" />
            ) : icon ? (
              <Icon name={icon} size="small" />
            ) : null}
            <span>{label}</span>
          </>
        );

        if (href) {
          return (
            <IntentPrefetchLink
              aria-current={active ? "page" : undefined}
              className={itemClassName}
              href={href}
              key={label}
            >
              {itemContent}
            </IntentPrefetchLink>
          );
        }

        return (
          <button
            key={label}
            className={itemClassName}
            onClick={() => onItemSelect?.(label)}
            type="button"
          >
            {itemContent}
          </button>
        );
      })}
    </div>
  );
}

function PageRail({
  activeItem,
  onOpenAssistant,
  story,
}: Readonly<{
  activeItem: string;
  onOpenAssistant: () => void;
  story: PremiumCompanyPagesAdminStory;
}>) {
  return (
    <aside className="overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="relative p-lg pt-stack">
        <div className="absolute inset-x-0 top-0 h-[96px] overflow-hidden">
          <Image
            alt=""
            className="object-cover object-center"
            fill
            sizes="240px"
            src={pcpCompanyProfile.coverSrc}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0))",
            }}
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-xs bg-premium-brand" />
        <span className="absolute right-sm top-md text-control-sm text-white">
          Premium
        </span>

        <div className="relative flex items-start justify-between">
          <Entity
            className="border-2 border-white bg-[#ACF5B3]"
            label={pcpCompanyProfile.name}
            shape="square"
            size={80}
            src={pcpCompanyProfile.logoSrc}
            style={{ backgroundColor: "#ACF5B3", height: 72, width: 72 }}
          />
          <ButtonIcon
            className="mt-sm"
            icon="edit"
            label="Edit cover"
            size="small"
            variant="tertiary"
          />
        </div>

        <div className="mt-lg">
          <div className="flex items-center gap-xs">
            <h2 className="text-heading-lg text-text">
              {pcpCompanyProfile.name}
            </h2>
            <CompanyPremiumBug />
            <Icon
              className="text-text-meta"
              name="verified"
              size="medium"
              label="Verified"
            />
          </div>
          <p className="mt-xxs text-supportive-s-strong text-text-meta">
            {pcpCompanyProfile.followers}
          </p>
        </div>

        <div className="mt-lg flex flex-col items-start gap-md">
          <Button leadingIcon={<Icon name="add" />} size="small">
            Create
          </Button>
          <Button
            className="!border-border !text-label"
            leadingIcon={<Icon name="visibility" />}
            size="small"
            variant="tertiary"
          >
            View as member
          </Button>
        </div>
      </div>

      <RailSection
        activeItem={activeItem}
        items={primaryRailItems}
        story={story}
      />
      <div className="mx-xxl my-sm h-px bg-border-faint" />
      <RailSection items={secondaryRailItems} story={story} />
      <div className="mx-xxl my-sm h-px bg-border-faint" />
      <RailSection
        items={premiumRailItems}
        onItemSelect={(label) => {
          if (label === "Chat with assistant") {
            onOpenAssistant();
          }
        }}
        story={story}
        withPremiumIcon
      />
    </aside>
  );
}

function AvatarPile() {
  return (
    <div className="flex items-center">
      {["avatar-2.png", "avatar-1.png", "avatar-3.png"].map((avatar, index) => (
        <Entity
          key={avatar}
          className={cx(
            index > 0 && "-ml-sm",
            "relative border border-background",
          )}
          label=""
          size={32}
          src={`${ASSET_ROOT}/${avatar}`}
          style={{ zIndex: index + 1 }}
        />
      ))}
      <span className="relative z-10 -ml-sm inline-flex size-8 items-center justify-center rounded-round border border-border-faint bg-background text-supportive-s text-text-meta">
        +99
      </span>
    </div>
  );
}

function PerformanceCard({
  title,
  value,
  delta,
  deltaMeta,
  deltaTone,
  label,
  premium,
}: PerformanceCardData) {
  return (
    <article className="flex min-h-[106px] min-w-0 flex-col justify-start rounded-sm border border-border-faint bg-background p-md">
      {title === "Who visited your Page" ? <AvatarPile /> : null}
      {value ? (
        <p className="text-heading-xl tracking-normal text-text">{value}</p>
      ) : null}
      <h3
        className={cx("text-control-sm text-action", value ? "mt-xxs" : "mt-xs")}
      >
        {title}
      </h3>
      {delta ? (
        <p
          className={cx(
            "mt-xs flex flex-wrap items-center gap-xs text-supportive-s",
            deltaTone === "positive" ? "text-positive" : "text-negative",
          )}
        >
          <span className="inline-flex items-center gap-[1px]">
            <Icon
              aria-hidden="true"
              className="shrink-0"
              name={deltaTone === "positive" ? "caret-up" : "caret-down"}
              size="small"
            />
            <span className="font-semibold">{delta}</span>
          </span>
          {deltaMeta ? (
            <span className="text-text-meta">{deltaMeta}</span>
          ) : null}
        </p>
      ) : null}
      {label ? (
        <p className="mt-xs flex items-center gap-xs text-supportive-s text-text-meta">
          {premium ? <PremiumMark label="Premium" /> : null}
          {label}
        </p>
      ) : null}
    </article>
  );
}

function GroupedPerformanceMetric({
  title,
  value,
  delta,
  deltaTone,
}: PerformanceCardData) {
  return (
    <article className="min-w-0">
      {title === "Who visited your Page" ? <AvatarPile /> : null}
      {value ? (
        <div className="flex min-w-0 flex-wrap items-end gap-sm">
          <p className="text-heading-xl tracking-normal text-text">{value}</p>
          {delta ? (
            <span
              className={cx(
                "inline-flex items-center gap-[1px] text-control-sm",
                deltaTone === "positive" ? "text-positive" : "text-negative",
              )}
            >
              <Icon
                aria-hidden="true"
                className="shrink-0"
                name={deltaTone === "positive" ? "caret-up" : "caret-down"}
                size="small"
              />
              <span>{delta}</span>
            </span>
          ) : null}
        </div>
      ) : null}
      <h3
        className={cx(
          "text-control-sm text-action",
          value ? "mt-xs" : "mt-md",
        )}
      >
        {title}
      </h3>
    </article>
  );
}

function GroupedPerformanceMetrics({
  items,
  premium = false,
}: Readonly<{
  items: ReadonlyArray<PerformanceCardData>;
  premium?: boolean;
}>) {
  return (
    <section className="rounded-sm border border-border-faint bg-background px-xl py-xxl">
      {premium ? (
        <div className="flex items-center gap-sm text-body-md text-text-meta">
          <PremiumChipSmall />
          <span>Exclusive Premium insights</span>
        </div>
      ) : null}
      <div
        className={cx(
          "grid gap-x-xl gap-y-xxl sm:grid-cols-2 xl:grid-cols-4",
          premium && "mt-xxl",
        )}
      >
        {items.map((item) => (
          <GroupedPerformanceMetric key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

function CarouselControls({
  canGoNext = true,
  canGoPrevious = false,
  nextLabel,
  onNext,
  onPrevious,
  previousLabel,
}: Readonly<{
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  nextLabel: string;
  onNext?: () => void;
  onPrevious?: () => void;
  previousLabel: string;
}>) {
  return (
    <div className="flex gap-xs">
      <ButtonIcon
        disabled={!canGoPrevious}
        icon="chevron-left"
        label={previousLabel}
        onClick={onPrevious}
        size="small"
        touchTarget={false}
        variant="tertiary"
      />
      <ButtonIcon
        disabled={!canGoNext}
        icon="chevron-right"
        label={nextLabel}
        onClick={onNext}
        size="small"
        touchTarget={false}
        variant="tertiary"
      />
    </div>
  );
}

const defaultPostReactionTypes: ReadonlyArray<SduiReactionIconType> = [
  "like",
  "praise",
  "interest",
];
const RECENT_POST_CARD_SCROLL_STEP_FALLBACK = 381;

function getPostBodyPreview(body: string) {
  const maxLength = 112;

  if (body.length <= maxLength) {
    return body;
  }

  const trimmedBody = body.slice(0, maxLength);
  const lastSpaceIndex = trimmedBody.lastIndexOf(" ");

  return trimmedBody.slice(0, lastSpaceIndex > 0 ? lastSpaceIndex : maxLength);
}

function ReactionSummary({
  comments,
  reactionTypes = defaultPostReactionTypes,
  reactions,
}: Readonly<{
  comments: string;
  reactionTypes?: ReadonlyArray<SduiReactionIconType>;
  reactions: string;
}>) {
  return (
    <div className="flex items-center gap-xs text-supportive-s text-text-meta">
      <span className="flex items-center" aria-hidden="true">
        {reactionTypes.map((reaction, index) => (
          <SduiReactionIcon
            className={cx(index > 0 && "-ml-[6px]")}
            decorative
            key={reaction}
            ring
            size="xsmall"
            type={reaction}
          />
        ))}
      </span>
      <span>{reactions}</span>
      <span aria-hidden="true">&middot;</span>
      <span>{comments}</span>
    </div>
  );
}

function RecentPostBoostHeader({ metric }: Readonly<{ metric: string }>) {
  return (
    <div
      className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-md border-b border-border-faint px-md py-sm"
      style={{
        backgroundColor:
          "var(--figma-color-container-color-background-container-tint, #F9FAFB)",
      }}
    >
      <span className="inline-flex min-w-0 items-start gap-xs text-supportive-s-strong text-text">
        <span className="line-clamp-2 min-w-0">{metric}</span>
        <Icon
          className="mt-xxs shrink-0 text-text-meta"
          name="question"
          size="small"
        />
      </span>
      <Button size="small" variant="secondary">
        Boost
      </Button>
    </div>
  );
}

function RecentPostAuthor({ timestamp }: Readonly<{ timestamp: string }>) {
  return (
    <div className="flex items-start gap-sm">
      <Entity
        className="bg-[#ACF5B3]"
        label={pcpCompanyProfile.name}
        shape="square"
        size={40}
        src={pcpCompanyProfile.logoSrc}
        style={{ backgroundColor: "#ACF5B3" }}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-control-sm text-text">{pcpCompanyProfile.name}</h3>
        <p className="text-supportive-s text-text-meta">
          {pcpCompanyProfile.followers}
        </p>
        <p className="text-supportive-s text-text-meta">{timestamp}</p>
      </div>
      <Icon className="text-text-meta" name="overflow-web-ios" size="medium" />
    </div>
  );
}

function RecentPostBody({ body }: Readonly<{ body: string }>) {
  const bodyPreview = getPostBodyPreview(body);

  return (
    <p className="mt-md min-h-[36px] shrink-0 text-body-sm text-text">
      <span className="line-clamp-2">
        {bodyPreview}{" "}
        <button
          className="font-semibold text-text-meta transition-colors hover:text-action hover:underline"
          type="button"
        >
          ...see more
        </button>
      </span>
    </p>
  );
}

function RecentImagePostContent({ post }: Readonly<{ post: RecentImagePostData }>) {
  const hasLinkPreview = Boolean(post.linkTitle);

  return (
    <>
      <div
        className={cx(
          "-mx-md mt-sm w-[calc(100%_+_(var(--spacing-md)_*_2))] shrink-0 overflow-hidden",
          hasLinkPreview ? "h-[220px]" : "h-[270px]",
        )}
      >
        <Image
          alt={post.imageAlt}
          className="size-full object-cover"
          height={386}
          src={assetSrc(post.image)}
          width={514}
        />
      </div>
      {post.linkTitle ? (
        <div className="-mx-md min-h-[52px] w-[calc(100%_+_(var(--spacing-md)_*_2))] bg-background-neutral-soft px-md py-sm">
          <p className="text-control-sm text-text">{post.linkTitle}</p>
          {post.linkMeta ? (
            <p className="text-body-xs text-text-meta">{post.linkMeta}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function RecentKudosPostContent({
  post,
}: Readonly<{ post: RecentKudosPostData }>) {
  return (
    <>
      <div className="-mx-md mt-sm flex h-[270px] w-[calc(100%_+_(var(--spacing-md)_*_2))] shrink-0 flex-col items-center overflow-hidden bg-background pb-md text-center">
        <Image
          alt={post.illustrationAlt}
          className="h-[186px] w-full object-cover"
          height={186}
          src={post.illustrationSrc}
          unoptimized
          width={375}
        />
        <div className="mt-md flex w-full flex-col items-center gap-sm">
          <p className="text-control-sm text-text-meta">Kudos</p>
          <p className="text-control-md text-text">{post.recipient}</p>
        </div>
      </div>
    </>
  );
}

function RecentVideoPostContent({
  post,
}: Readonly<{ post: RecentVideoPostData }>) {
  return (
    <>
      <div className="relative mt-sm h-[272px] shrink-0 overflow-hidden bg-text">
        <Image
          alt={post.imageAlt}
          className="size-full object-cover opacity-85"
          height={386}
          src={assetSrc(post.image)}
          width={514}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />
        <div className="absolute left-sm top-sm inline-flex items-center gap-xxs rounded-xs bg-scrim px-sm py-xxs text-supportive-s-strong text-on-action">
          <Icon aria-hidden="true" name="video-camera" size="small" />
          <span>Live today</span>
          <span aria-hidden="true">&middot;</span>
          <span>{post.liveTime}</span>
        </div>
        <div className="absolute left-md right-md top-[140px] rounded-xs bg-scrim px-md py-sm text-center text-control-md text-on-action">
          {post.caption}
        </div>
        <div className="absolute inset-x-0 bottom-0 px-md pb-md text-on-action">
          <div className="mb-sm h-1 rounded-round bg-white/30">
            <div className="h-full w-1/2 rounded-round bg-on-action" />
          </div>
          <div className="flex items-center justify-between gap-md">
            <div className="flex min-w-0 items-center gap-sm">
              <Icon aria-hidden="true" name="play" size="medium" />
              <Icon aria-hidden="true" name="volume-medium" size="medium" />
              <span className="text-body-sm text-on-action">
                {post.timeLabel}
              </span>
            </div>
            <Icon aria-hidden="true" name="fullscreen-enter" size="medium" />
          </div>
        </div>
      </div>
    </>
  );
}

function RecentEmptyPostCard({ post }: Readonly<{ post: RecentEmptyPostData }>) {
  return (
    <article
      className="flex h-[492px] w-[365px] shrink-0 snap-start flex-col justify-between rounded-sm border border-border-faint bg-background p-md"
      data-recent-post-card
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-md text-center">
        <Image
          alt={post.illustrationAlt}
          className="size-16"
          height={64}
          src={post.illustrationSrc}
          unoptimized
          width={64}
        />
        <p className="mt-lg max-w-[250px] text-body-sm text-text">
          {post.message}
        </p>
      </div>
      <Button
        className="w-full"
        leadingIcon={<Icon name="add" />}
        size="small"
        variant="secondary"
      >
        {post.buttonLabel}
      </Button>
    </article>
  );
}

function PostCard({ post }: Readonly<{ post: RecentPostData }>) {
  if (post.kind === "empty") {
    return <RecentEmptyPostCard post={post} />;
  }

  return (
    <article
      className="flex h-[492px] w-[365px] shrink-0 snap-start flex-col overflow-hidden rounded-sm border border-border-faint bg-background"
      data-recent-post-card
    >
      <RecentPostBoostHeader metric={post.metric} />
      <div className="flex min-h-0 flex-1 flex-col px-md py-md">
        <RecentPostAuthor timestamp={post.timestamp} />
        <RecentPostBody body={post.body} />
        {post.kind === "image" ? <RecentImagePostContent post={post} /> : null}
        {post.kind === "kudos" ? <RecentKudosPostContent post={post} /> : null}
        {post.kind === "video" ? <RecentVideoPostContent post={post} /> : null}
        <div className="mt-auto pt-sm">
          <ReactionSummary
            comments={post.comments}
            reactions={post.reactions}
            reactionTypes={post.reactionTypes}
          />
        </div>
      </div>
    </article>
  );
}

function InboxFilterPill({
  active = false,
  label,
  showChevron = true,
}: Readonly<{
  active?: boolean;
  label: string;
  showChevron?: boolean;
}>) {
  return (
    <button
      aria-pressed={active}
      className={cx(
        "inline-flex h-9 items-center gap-xs rounded-round border px-md text-control-sm transition-colors",
        active
          ? "border-positive bg-positive text-on-checked hover:bg-positive-hover"
          : "border-border-subtle bg-background text-label hover:border-border-subtle-hover hover:bg-background-transparent-hover",
      )}
      type="button"
    >
      <span>{label}</span>
      {showChevron ? (
        <Icon
          aria-hidden="true"
          className={active ? "text-on-checked" : "text-text-meta"}
          name="chevron-down"
          size="small"
        />
      ) : null}
    </button>
  );
}

function InboxSearchField() {
  return (
    <label className="flex h-11 min-w-0 flex-1 items-center gap-sm rounded-xs bg-surface-tint px-md text-body-md text-text-meta sm:max-w-[360px]">
      <Icon className="shrink-0 text-icon" name="search" size="medium" />
      <span className="sr-only">Search messages</span>
      <input
        className="min-w-0 flex-1 bg-transparent p-0 text-body-md text-text outline-none placeholder:text-text-meta"
        placeholder="Search messages"
        type="search"
      />
    </label>
  );
}

function InboxThreadListItem({
  thread,
}: Readonly<{ thread: InboxThreadData }>) {
  return (
    <button
      aria-current={thread.selected ? "true" : undefined}
      className={cx(
        "grid min-h-[104px] w-full grid-cols-[64px_minmax(0,1fr)_auto] gap-md border-b border-border-faint px-md py-md text-left transition-colors hover:bg-background-transparent-hover",
        thread.selected &&
          "border-l-4 border-l-positive bg-surface-tint pl-[12px] hover:bg-surface-tint",
      )}
      type="button"
    >
      <Entity
        className="mt-xxs shrink-0"
        label={thread.name}
        size={64}
        src={assetSrc(thread.avatar)}
      />
      <span className="min-w-0">
        <span className="flex min-w-0 items-center gap-xs">
          <span className="truncate text-heading-sm text-text">
            {thread.name}
          </span>
          {thread.vca ? (
            <span className="inline-flex shrink-0 items-center text-ai-icon">
              <Icon name="signal-ai" size="small" />
            </span>
          ) : null}
        </span>
        <span className="mt-xxs block truncate text-control-sm text-text">
          {thread.topic}
        </span>
        <span className="mt-xxs block line-clamp-2 text-body-sm-open text-text-meta">
          {thread.snippet}
        </span>
      </span>
      <span className="mt-xs shrink-0 text-body-sm text-text">
        {thread.timestamp}
      </span>
    </button>
  );
}

function InboxProfileHeader() {
  return (
    <div className="space-y-lg border-b border-border-faint px-lg py-xl">
      <Entity
        label={vcaLeadBrief.buyer}
        size={96}
        src={assetSrc(vcaLeadBrief.avatar)}
      />
      <div>
        <h2 className="text-heading-lg text-text">{vcaLeadBrief.buyer}</h2>
        <p className="text-body-md text-text">
          {vcaLeadBrief.role}
        </p>
        <p className="mt-xs text-body-md text-text-meta">
          Velora Page post follow-up
        </p>
      </div>
      <VcaInboxContextStrip />
    </div>
  );
}

function TodayDivider() {
  return (
    <div className="flex items-center gap-lg py-md">
      <span className="h-px flex-1 bg-border-faint" />
      <span className="text-label-xs uppercase text-text-meta">
        Today
      </span>
      <span className="h-px flex-1 bg-border-faint" />
    </div>
  );
}

function VcaInboxContextStrip() {
  return (
    <div className="rounded-sm border border-ai-border bg-background p-lg">
      <div className="flex items-start justify-between gap-md">
        <div className="min-w-0">
          <div className="flex items-center gap-sm">
            <Icon className="shrink-0 text-ai-icon" name="signal-ai" size="medium" />
            <h3 className="min-w-0 text-[16px] font-semibold leading-6 text-text">
              Cheri is a{" "}
              <span className="text-action">high-intent lead</span>
            </h3>
          </div>
          <p className="mt-md text-[14px] font-normal leading-5 text-text">
            {vcaLeadBrief.intentSummary}
          </p>
        </div>
        <Icon
          aria-hidden="true"
          className="mt-xs shrink-0 text-action"
          name="chevron-up"
          size="medium"
        />
      </div>

      <div className="mt-lg flex flex-wrap gap-sm">
        {vcaLeadBrief.intentTags.map((tag) => (
          <Pill
            aria-disabled="true"
            className="pointer-events-none !h-8 cursor-default [&>span]:!min-h-8 [&>span]:px-sm [&>span]:text-body-sm"
            key={tag}
            tabIndex={-1}
          >
            {tag}
          </Pill>
        ))}
      </div>
    </div>
  );
}

export function PremiumCompanyPagesInboxContextStripPreview() {
  return <VcaInboxContextStrip />;
}

function InboxMessage() {
  return (
    <div className="flex items-start gap-sm">
      <Entity
        className="mt-xxs shrink-0"
        label={vcaLeadBrief.buyer}
        size={40}
        src={assetSrc(vcaLeadBrief.avatar)}
      />
      <div className="min-w-0 flex-1">
        <p className="text-body-md text-text">
          <span className="font-semibold">{vcaLeadBrief.buyer}</span>{" "}
          <span className="text-[12px] text-text-meta">&middot; 4:48 PM</span>
        </p>
        <div className="mt-sm max-w-[34rem] rounded-sm bg-background-neutral-soft px-md py-sm">
          <p className="text-body-sm-open text-text">
            {vcaLeadBrief.sentMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

function InboxComposer() {
  return (
    <div className="border-t border-border-faint bg-background">
      <div className="px-lg py-md">
        <div className="relative">
          <TextArea
            label={<span className="sr-only">Reply message</span>}
            placeholder={`Replying as ${pcpCompanyProfile.name}...`}
            size="large"
            textareaClassName="!min-h-[120px] !border-transparent !bg-background-neutral-soft !px-md !py-md !text-body-md"
          />
          <GhostIconButton
            className="absolute right-xs top-xs text-icon"
            horizontalPadding={false}
            icon="chevron-up"
            label="Collapse reply composer"
            touchTarget={false}
          />
        </div>
        <div className="mt-sm flex items-center gap-xs text-body-xs text-text-meta">
          <Icon name="signal-notice" size="small" />
          <span>Members see replies from Velora.</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-md border-t border-border-faint px-lg py-sm">
        <div className="flex items-center gap-xs">
          <GhostIconButton
            horizontalPadding={false}
            icon="attachment"
            label="Attach file"
          />
          <GhostIconButton
            horizontalPadding={false}
            icon="gif"
            label="Add GIF"
          />
          <GhostIconButton
            horizontalPadding={false}
            icon="emoji"
            label="Add emoji"
          />
          <GhostIconButton
            horizontalPadding={false}
            icon="image"
            label="Add image"
          />
        </div>
        <div className="flex items-center gap-sm">
          <Button disabled size="small">
            Send
          </Button>
          <GhostIconButton
            horizontalPadding={false}
            icon="overflow-web-ios"
            label="More reply actions"
          />
        </div>
      </div>
    </div>
  );
}

function InboxThreadDetail() {
  return (
    <section className="flex min-h-[760px] min-w-0 flex-col bg-background">
      <div className="flex min-h-[64px] items-center justify-between gap-md border-b border-border-faint px-lg py-sm">
        <div className="min-w-0">
          <h2 className="truncate text-heading-lg text-text">
            {vcaLeadBrief.buyer}
          </h2>
          <p className="truncate text-body-md text-text-meta">
            {vcaLeadBrief.role}
          </p>
        </div>
        <GhostIconButton
          horizontalPadding={false}
          icon="overflow-web-ios"
          label="Thread actions"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <InboxProfileHeader />
        <div className="space-y-lg px-lg py-md">
          <TodayDivider />
          <InboxMessage />
        </div>
      </div>

      <InboxComposer />
    </section>
  );
}

function InboxContent() {
  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="flex min-h-[64px] flex-wrap items-center gap-md border-b border-border-faint px-lg py-sm">
        <h1 className="text-heading-lg text-text">Inbox</h1>
        <InboxSearchField />
        <div className="ml-auto">
          <GhostIconButton
            horizontalPadding={false}
            icon="overflow-web-ios"
            label="Inbox actions"
          />
        </div>
      </div>

      <div className="flex min-h-[64px] flex-wrap items-center gap-sm border-b border-border-faint px-lg py-sm">
        <InboxFilterPill active label="Inbox" />
        <span className="hidden h-8 w-px bg-border-faint sm:block" />
        <InboxFilterPill label="Topics" />
        <InboxFilterPill label="Unread" showChevron={false} />
      </div>

      <div className="grid min-h-[760px] lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-border-faint lg:border-b-0 lg:border-r">
          {inboxThreads.map((thread) => (
            <InboxThreadListItem key={thread.name} thread={thread} />
          ))}
        </div>
        <InboxThreadDetail />
      </div>
    </section>
  );
}

function SettingsRow({ row }: Readonly<{ row: SettingsRowData }>) {
  const rowClassName =
    "group grid min-h-[88px] w-full grid-cols-[minmax(0,1fr)_32px] items-center gap-md border-t border-border-faint px-lg py-md text-left outline-none transition-colors first:border-t-0 hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring sm:px-xxl";
  const rowContent = (
    <>
      <span className="min-w-0">
        <span className="flex min-w-0 flex-wrap items-center gap-xs">
          <span className="text-heading-md text-text">{row.title}</span>
          {row.badge ? <NewFeatureTag /> : null}
        </span>
        <span className="mt-xxs block text-body-sm text-text-meta">
          {row.description}
        </span>
      </span>
      <Icon
        aria-hidden="true"
        className="justify-self-end text-icon transition-transform group-hover:translate-x-xxs"
        name="arrow-right"
        size="medium"
      />
    </>
  );

  if (row.href) {
    return (
      <IntentPrefetchLink className={rowClassName} href={row.href}>
        {rowContent}
      </IntentPrefetchLink>
    );
  }

  return (
    <button className={rowClassName} type="button">
      {rowContent}
    </button>
  );
}

function SettingsContent() {
  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="border-b border-border-faint px-lg py-lg sm:px-xxl">
        <h1 className="text-heading-xl text-text">Settings</h1>
      </div>
      <div>
        {settingsRows.map((row) => (
          <SettingsRow key={row.title} row={row} />
        ))}
      </div>
    </section>
  );
}

type AssistantCalendarProvider = "google" | "outlook";

type StatusChipTone = "neutral" | "positive";

const showVisitorAssistantColorPicker = true;

const defaultAssistantInstructions = `# Velora visitor assistant

- Keep answers concise and professional.
- Use Velora's Page, website, and uploaded files.
- Do not make pricing, legal, or medical commitments.`;

function SettingsDetailHeader() {
  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="flex min-h-[72px] items-center gap-md px-lg py-lg sm:px-xxl">
        <IntentPrefetchLink
          aria-label="Back to Settings"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-round text-icon outline-none transition-colors hover:bg-background-transparent-hover hover:text-icon-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          href={ADMIN_SETTINGS_HREF}
        >
          <Icon name="arrow-left-large" size="medium" />
        </IntentPrefetchLink>
        <h1 className="text-heading-lg tracking-normal text-text">
          Manage AI assistant
        </h1>
      </div>
    </section>
  );
}

function StatusChip({
  children,
  tone = "neutral",
}: Readonly<{
  children: ReactNode;
  tone?: StatusChipTone;
}>) {
  return (
    <span
      className={cx(
        "inline-flex min-h-6 items-center rounded-xs px-sm text-supportive-s-strong",
        tone === "positive"
          ? "bg-positive text-on-checked"
          : "bg-tag-default-background text-text-meta",
      )}
    >
      {children}
    </span>
  );
}

function SettingsCard({
  action,
  children,
  description,
  title,
}: Readonly<{
  action?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
}>) {
  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="flex flex-wrap items-start justify-between gap-md px-lg py-xl sm:px-xxl">
        <div className="min-w-0">
          <h2 className="text-heading-lg tracking-normal text-text">{title}</h2>
          {description ? (
            <p className="mt-xxs max-w-[680px] text-body-md text-text">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children ? (
        <div className="border-t border-border-faint">{children}</div>
      ) : null}
    </section>
  );
}

function SettingsSwitch({
  checked,
  disabled = false,
  label,
  onCheckedChange,
}: Readonly<{
  checked: boolean;
  disabled?: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}>) {
  return (
    <div className="flex items-center gap-sm">
      <span className="text-body-sm text-text-meta">
        {checked ? "On" : "Off"}
      </span>
      <button
        aria-checked={checked}
        aria-label={label}
        className={cx(
          "relative inline-flex h-8 w-14 shrink-0 items-center rounded-round border outline-none transition-colors focus-visible:ring-4 focus-visible:ring-action-focus-ring disabled:cursor-not-allowed disabled:opacity-60",
          checked
            ? "border-positive bg-positive"
            : "border-border-subtle bg-background",
        )}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        role="switch"
        type="button"
      >
        <span
          aria-hidden="true"
          className={cx(
            "absolute size-6 rounded-round bg-background shadow-raised-faint transition-transform",
            checked ? "translate-x-7" : "translate-x-xs",
          )}
        />
      </button>
    </div>
  );
}

function SetupRow({
  action,
  children,
  description,
  required = false,
  title,
}: Readonly<{
  action?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  title: ReactNode;
}>) {
  return (
    <div className="grid gap-lg border-t border-border-faint px-lg py-xl first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-xxl sm:py-xxl">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-xs">
          <h3 className="text-heading-lg tracking-normal text-text">{title}</h3>
          {required ? <StatusChip>Required</StatusChip> : null}
        </div>
        {description ? (
          <p className="mt-xxs max-w-[620px] text-body-md text-text">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-lg">{children}</div> : null}
      </div>
      {action ? (
        <div className="flex shrink-0 items-center justify-start sm:justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}

function FileStatusChip({
  children = "Velora FAQs.pdf",
}: Readonly<{
  children?: ReactNode;
}>) {
  return (
    <span className="inline-flex min-h-8 items-center gap-xs rounded-xs border border-border-faint bg-background px-sm text-body-sm text-text">
      <Icon aria-hidden="true" name="document" size="small" />
      {children}
    </span>
  );
}

function KnowledgeSourceChip({
  children,
  iconName,
  suffix,
}: Readonly<{
  children: ReactNode;
  iconName: IconName;
  suffix?: ReactNode;
}>) {
  return (
    <span className="inline-flex min-h-8 max-w-full items-center gap-xs rounded-xs border border-border-faint bg-background px-sm text-body-sm text-text">
      <Icon
        aria-hidden="true"
        className="shrink-0"
        name={iconName}
        size="small"
      />
      <span className="min-w-0 truncate">{children}</span>
      {suffix ? (
        <span className="shrink-0 text-body-xs text-text-meta">{suffix}</span>
      ) : null}
    </span>
  );
}

function KnowledgeSourcesRow({
  hasUploadedFaq,
  knowledgeLinks,
  onUploadFile,
}: Readonly<{
  hasUploadedFaq: boolean;
  knowledgeLinks: ReadonlyArray<string>;
  onUploadFile: () => void;
}>) {
  return (
    <div className="border-t border-border-faint px-lg py-xl first:border-t-0 sm:px-xxl sm:py-xxl">
      <div className="flex flex-col gap-lg sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-heading-lg tracking-normal text-text">
            Knowledge sources
          </h3>
          <p className="mt-xxs max-w-[620px] text-body-md text-text">
            Choose the Page content, links, and files the assistant can use.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-sm sm:justify-end">
          <Button
            leadingIcon={<Icon name="add" />}
            onClick={() => undefined}
            size="small"
            variant="secondary"
          >
            Add link
          </Button>
          <Button
            leadingIcon={<Icon name={hasUploadedFaq ? "check" : "upload"} />}
            onClick={onUploadFile}
            size="small"
            variant="secondary"
          >
            {hasUploadedFaq ? "Uploaded" : "Upload file"}
          </Button>
        </div>
      </div>

      <div className="mt-xxl">
        <div className="flex max-w-[620px] flex-wrap gap-sm">
          <KnowledgeSourceChip iconName="company" suffix="Included">
            Velora Page
          </KnowledgeSourceChip>
          {knowledgeLinks.map((link) => (
            <KnowledgeSourceChip iconName="link" key={link}>
              {link}
            </KnowledgeSourceChip>
          ))}
          {hasUploadedFaq ? <FileStatusChip /> : null}
        </div>
      </div>
    </div>
  );
}

function AssistantInstructionsRow({
  hasUploadedInstructions,
  instructions,
  onInstructionsChange,
  onUploadInstructions,
}: Readonly<{
  hasUploadedInstructions: boolean;
  instructions: string;
  onInstructionsChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onUploadInstructions: () => void;
}>) {
  return (
    <div className="border-t border-border-faint px-lg py-xl first:border-t-0 sm:px-xxl sm:py-xxl">
      <div className="flex flex-col gap-lg sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-heading-lg tracking-normal text-text">
            Assistant instructions
          </h3>
          <p className="mt-xxs max-w-[620px] text-body-md text-text">
            Define tone, guardrails, and what the assistant should avoid.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-sm sm:justify-end">
          <Button
            leadingIcon={
              <Icon name={hasUploadedInstructions ? "check" : "upload"} />
            }
            onClick={onUploadInstructions}
            size="small"
            variant="secondary"
          >
            {hasUploadedInstructions ? "Uploaded" : "Upload .md"}
          </Button>
        </div>
      </div>

      <div className="mt-xxl max-w-[620px] space-y-sm">
        <TextArea
          aria-label="Assistant instructions markdown"
          onChange={onInstructionsChange}
          size="large"
          textareaClassName="!min-h-[220px] font-mono text-body-sm-open sm:!min-h-[168px]"
          value={instructions}
        />
        {hasUploadedInstructions ? (
          <FileStatusChip>Velora assistant instructions.md</FileStatusChip>
        ) : null}
      </div>
    </div>
  );
}

function ConnectedCalendarChip({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <span className="inline-flex min-h-8 items-center gap-xs rounded-xs bg-tag-default-background px-sm text-body-sm text-text">
      <Icon aria-hidden="true" name="check" size="small" />
      {label} connected
    </span>
  );
}

function ColorSwatch({
  checked,
  option,
  onSelect,
}: Readonly<{
  checked: boolean;
  option: AssistantColorOption;
  onSelect: (option: AssistantColorOption) => void;
}>) {
  return (
    <button
      aria-label={option.label}
      aria-pressed={checked}
      className={cx(
        "inline-flex size-6 items-center justify-center rounded-round outline-none transition-[box-shadow,transform] hover:scale-105 focus-visible:ring-4 focus-visible:ring-action-focus-ring",
        checked && "ring-2 ring-action ring-offset-1 ring-offset-background",
      )}
      onClick={() => onSelect(option)}
      type="button"
    >
      <span
        aria-hidden="true"
        className="size-6 rounded-round"
        style={{ backgroundColor: option.value }}
      />
    </button>
  );
}

function AssistantColorPicker({
  selectedColor,
  onSelect,
}: Readonly<{
  selectedColor: AssistantColorOption;
  onSelect: (option: AssistantColorOption) => void;
}>) {
  return (
    <div className="flex flex-wrap items-center gap-sm">
      {assistantColorOptions.map((option) => (
        <ColorSwatch
          checked={selectedColor.id === option.id}
          key={option.id}
          option={option}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function VisitorAssistantFabPreview({
  color,
}: Readonly<{
  color: AssistantColorOption;
}>) {
  return (
    <div className="inline-flex">
      <VcaFab
        accentColor={color.value}
        borderColor={color.value}
        borderHoverColor={color.value}
        label="Visitor assistant color preview"
        position="static"
        showVisitorPresenceBadge={false}
        variant="visitor"
      />
    </div>
  );
}

function AiAssistantSettingsPlaceholderContent() {
  const [visitorAssistantEnabled, setVisitorAssistantEnabled] = useState(false);
  const [hasUploadedFaq, setHasUploadedFaq] = useState(false);
  const [assistantInstructions, setAssistantInstructions] = useState(
    defaultAssistantInstructions,
  );
  const [hasUploadedInstructions, setHasUploadedInstructions] = useState(false);
  const [connectedCalendars, setConnectedCalendars] = useState<
    ReadonlySet<AssistantCalendarProvider>
  >(new Set());
  const [visitorSelectedColor, setVisitorSelectedColor] =
    useState(assistantDefaultColor);

  function handleAssistantInstructionsChange(
    event: ChangeEvent<HTMLTextAreaElement>,
  ) {
    setAssistantInstructions(event.currentTarget.value);
  }

  function handleCalendarConnect(provider: AssistantCalendarProvider) {
    setConnectedCalendars((currentCalendars) => {
      const nextCalendars = new Set(currentCalendars);
      nextCalendars.add(provider);

      return nextCalendars;
    });
  }

  return (
    <div className="min-w-0 space-y-lg">
      <SettingsDetailHeader />

      <SettingsCard
        action={
          <SettingsSwitch
            checked={visitorAssistantEnabled}
            label="Toggle visitor AI assistant"
            onCheckedChange={setVisitorAssistantEnabled}
          />
        }
        title="AI assistant for visitors"
      >
        {visitorAssistantEnabled ? (
          <>
            <KnowledgeSourcesRow
              hasUploadedFaq={hasUploadedFaq}
              knowledgeLinks={defaultKnowledgeLinks}
              onUploadFile={() => setHasUploadedFaq(true)}
            />

            <AssistantInstructionsRow
              hasUploadedInstructions={hasUploadedInstructions}
              instructions={assistantInstructions}
              onInstructionsChange={handleAssistantInstructionsChange}
              onUploadInstructions={() => setHasUploadedInstructions(true)}
            />

            <SetupRow
              description="Let visitors request time with your team after the assistant answers their questions."
              title="Set calendar availability"
            >
              <div className="flex flex-wrap gap-sm">
                {connectedCalendars.has("google") ? (
                  <ConnectedCalendarChip label="Google Calendar" />
                ) : (
                  <Button
                    leadingIcon={<Icon name="add" />}
                    onClick={() => handleCalendarConnect("google")}
                    size="small"
                    variant="secondary"
                  >
                    Google Calendar
                  </Button>
                )}
                {connectedCalendars.has("outlook") ? (
                  <ConnectedCalendarChip label="Outlook" />
                ) : (
                  <Button
                    leadingIcon={<Icon name="add" />}
                    onClick={() => handleCalendarConnect("outlook")}
                    size="small"
                    variant="secondary"
                  >
                    Outlook
                  </Button>
                )}
              </div>
            </SetupRow>

            {showVisitorAssistantColorPicker ? (
              <SetupRow title="Pick color">
                <div className="flex flex-col items-start gap-md">
                  <VisitorAssistantFabPreview color={visitorSelectedColor} />
                  <AssistantColorPicker
                    selectedColor={visitorSelectedColor}
                    onSelect={setVisitorSelectedColor}
                  />
                </div>
              </SetupRow>
            ) : null}
          </>
        ) : null}
      </SettingsCard>

      <SettingsCard
        action={
          <SettingsSwitch
            checked
            disabled
            label="Admin AI assistant is on"
            onCheckedChange={() => undefined}
          />
        }
        title="AI assistant for admins"
      />
    </div>
  );
}

function DashboardContent({
  activeInsightId,
  onDigestInsightSelect,
  onSelfInitiatedViewSelect,
  story,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onDigestInsightSelect: (insight: AdminUc5InsightSelection) => void;
  onSelfInitiatedViewSelect: (
    view: AdminUc5SelfInitiatedView,
    prompt?: string,
  ) => void;
  story: PremiumCompanyPagesAdminStory;
}>) {
  const [performanceCardPageIndex, setPerformanceCardPageIndex] = useState(0);
  const {
    activeDotIndex: recentPostActiveDotIndex,
    canGoNext: canGoNextRecentPost,
    canGoPrevious: canGoPreviousRecentPost,
    scrollNext: scrollToNextRecentPost,
    scrollPrevious: scrollToPreviousRecentPost,
    scrollRef: recentPostsCarouselRef,
    updateScrollState: updateRecentPostCarouselState,
  } = useHorizontalCarousel<HTMLDivElement>({
    fallbackStep: RECENT_POST_CARD_SCROLL_STEP_FALLBACK,
    itemCount: recentPosts.length,
    itemSelector: "[data-recent-post-card]",
  });
  const performanceCardPageCount = Math.ceil(
    performanceCards.length / PERFORMANCE_CARDS_VISIBLE_COUNT,
  );
  const maxPerformanceCardPageIndex = Math.max(
    performanceCardPageCount - 1,
    0,
  );
  const performanceCardStartIndex =
    performanceCardPageIndex * PERFORMANCE_CARDS_VISIBLE_COUNT;
  const visiblePerformanceCards = performanceCards.slice(
    performanceCardStartIndex,
    performanceCardStartIndex + PERFORMANCE_CARDS_VISIBLE_COUNT,
  );

  function handlePreviousPerformanceCards() {
    setPerformanceCardPageIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }

  function handleNextPerformanceCards() {
    setPerformanceCardPageIndex((currentIndex) =>
      Math.min(currentIndex + 1, maxPerformanceCardPageIndex),
    );
  }

  return (
    <div className="min-w-0 space-y-md">
      <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background">
        <div
          className="px-lg pb-[28px] pt-[40px] sm:px-xxl"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, #FFFFFF 100%), linear-gradient(270deg, var(--color-premium-gradient-base-b) 0%, var(--color-premium-gradient-base-a) 100%)",
          }}
        >
          <h1 className="text-display-md text-text">
            Welcome back, {pcpCompanyProfile.name}
          </h1>
          <div className="mt-[40px]">
            <AdminPerformanceDigestCard
              activeInsightId={activeInsightId}
              onInsightSelect={onDigestInsightSelect}
              showFollowerGrowthInsight={story === "old"}
            />
          </div>
        </div>

        <div className="space-y-[56px] px-lg pb-xxl pt-[40px] sm:px-xxl">
          <section>
            <div className="flex items-start justify-between gap-lg">
              <div>
                <h2 className="text-heading-lg text-text">Track performance</h2>
                <p className="mt-xs text-body-md text-text-meta">
                  {story === "current"
                    ? "Grow your Page 3x faster with insights and analytics from the past 7 days."
                    : "Grow your page 3x faster by leveraging insights and analytics."}
                </p>
              </div>
              {story !== "current" ? (
                <CarouselControls
                  canGoNext={
                    performanceCardPageIndex < maxPerformanceCardPageIndex
                  }
                  canGoPrevious={performanceCardPageIndex > 0}
                  nextLabel="Next performance insights"
                  onNext={handleNextPerformanceCards}
                  onPrevious={handlePreviousPerformanceCards}
                  previousLabel="Previous performance insights"
                />
              ) : null}
            </div>

            {story === "current" ? (
              <div className="mt-xxl space-y-lg">
                <GroupedPerformanceMetrics
                  items={currentStandardPerformanceCards}
                />
                <GroupedPerformanceMetrics
                  items={currentPremiumPerformanceCards}
                  premium
                />
              </div>
            ) : (
              <>
                <div className="mt-lg grid gap-md sm:grid-cols-2 xl:grid-cols-4">
                  {visiblePerformanceCards.map((card) => (
                    <PerformanceCard key={card.title} {...card} />
                  ))}
                </div>

                <div
                  className="mt-md flex justify-center gap-md"
                  aria-hidden="true"
                >
                  {Array.from(
                    { length: performanceCardPageCount },
                    (_, index) => (
                      <span
                        className={cx(
                          "size-[6px] rounded-round",
                          index === performanceCardPageIndex
                            ? "bg-text"
                            : "border border-border-subtle",
                        )}
                        key={index}
                      />
                    ),
                  )}
                </div>
              </>
            )}

            {story === "current" ? (
              <div className="mt-lg">
                <ContextualAiPromptSlot
                  contextualPrompts={dashboardVisitorPromptRows}
                  flush
                  onInsightSelect={onDigestInsightSelect}
                  onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
                  presentation="dashboard"
                  showDivider={false}
                />
              </div>
            ) : null}
          </section>

          <section>
            <div className="flex items-start justify-between gap-lg">
              <div>
                <h2 className="text-heading-lg text-text">
                  Manage recent posts
                </h2>
                <p className="mt-xs text-body-md text-text-meta">
                  Manage your page&apos;s content and amplify your reach with
                  boosting.{" "}
                  <InlineAction>Learn more</InlineAction>
                </p>
              </div>
              <CarouselControls
                canGoNext={canGoNextRecentPost}
                canGoPrevious={canGoPreviousRecentPost}
                nextLabel="Next posts"
                onNext={scrollToNextRecentPost}
                onPrevious={scrollToPreviousRecentPost}
                previousLabel="Previous posts"
              />
            </div>

            <div
              className="mt-lg flex snap-x snap-mandatory gap-md overflow-hidden scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={updateRecentPostCarouselState}
              ref={recentPostsCarouselRef}
            >
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <div className="mt-lg flex justify-center gap-md" aria-hidden="true">
              {recentPosts.map((post, index) => (
                <span
                  className={cx(
                    "size-[6px] rounded-round",
                    index === recentPostActiveDotIndex
                      ? "bg-text"
                      : "border border-border-subtle",
                  )}
                  key={post.id}
                />
              ))}
            </div>

            <div className="mt-lg flex justify-center border-t border-border-faint pt-md">
              <GhostButton icon="arrow-right" iconAtEnd size="medium">
                Show all page posts
              </GhostButton>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function AnalyticsTabButton({
  active,
  tab,
  onSelect,
}: Readonly<{
  active: boolean;
  tab: (typeof analyticsTabs)[number];
  onSelect: (tabId: AnalyticsTabId) => void;
}>) {
  return (
    <TabItemHorizontal
      aria-controls={`premium-company-pages-analytics-${tab.id}-panel`}
      id={`premium-company-pages-analytics-${tab.id}-tab`}
      label={tab.label}
      onClick={() => onSelect(tab.id)}
      selected={active}
    />
  );
}

function AnalyticsTrend({
  tone = "positive",
  value,
}: Readonly<{ tone?: AnalyticsTrendTone; value: string }>) {
  const isNegative = tone === "negative";

  return (
    <span
      className={cx(
        "mt-xs inline-flex items-center gap-xxs text-supportive-s-strong",
        isNegative ? "text-negative" : "text-positive",
      )}
    >
      <Icon
        aria-hidden="true"
        name={isNegative ? "caret-down" : "caret-up"}
        size="small"
      />
      <span>{value}</span>
    </span>
  );
}

function AnalyticsCard({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cx(
        "rounded-sm border border-border-faint bg-background",
        className,
      )}
    >
      {children}
    </div>
  );
}

function AnalyticsControlsCard({
  dateRange = "May 10, 2026 - Jun 8, 2026",
}: Readonly<{ dateRange?: string }> = {}) {
  return (
    <AnalyticsCard>
      <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-md px-lg py-md">
        <button
          className="inline-flex min-h-9 max-w-full items-center gap-xs rounded-round border border-border-subtle bg-background px-md py-xs text-control-sm text-label outline-none transition-colors hover:border-border-subtle-hover hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          type="button"
        >
          <Icon
            aria-hidden="true"
            className="shrink-0 text-text-meta"
            name="calendar"
            size="small"
          />
          <span className="min-w-0 truncate">{dateRange}</span>
          <Icon
            aria-hidden="true"
            className="shrink-0 text-text-meta"
            name="chevron-down"
            size="small"
          />
        </button>
        <Button leadingIcon={<Icon name="download" />} size="small">
          Export
        </Button>
      </div>
    </AnalyticsCard>
  );
}

function HighlightsCard(props: AnalyticsContextualPromptSlotProps = {}) {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div>
          <h2 className="text-heading-lg text-text">Highlights</h2>
          <p className="mt-xs text-body-sm text-text-meta">
            Data for 5/10/2026 - 6/8/2026
          </p>
        </div>
        <div className="mt-xxl grid gap-lg sm:grid-cols-2 lg:grid-cols-4">
          {analyticsHighlights.map((highlight) => (
            <article key={highlight.label}>
              <p className="text-heading-xl text-text">{highlight.value}</p>
              <h3 className="mt-xxs text-body-sm text-text-meta">
                {highlight.label}
              </h3>
              <AnalyticsTrend
                tone={highlight.tone}
                value={highlight.delta}
              />
            </article>
          ))}
        </div>
      </div>
      <ContextualAiPromptSlot {...props} />
    </AnalyticsCard>
  );
}

export function PremiumCompanyPagesContentHighlightsPromptPreview() {
  return (
    <HighlightsCard
      contextualPrompts={wipContentHighlightsPromptRows}
      onInsightSelect={() => {}}
      onSelfInitiatedViewSelect={() => {}}
    />
  );
}

function AnalyticsKeyInsightsCard({
  activeInsightId,
  insights,
  onInsightSelect,
  sectionId,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  insights: ReadonlyArray<AnalyticsInsightCardData>;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
  sectionId: string;
}>) {
  const [dismissedInsightIds, setDismissedInsightIds] = useState<
    ReadonlySet<AdminUc5InsightId>
  >(() => new Set());
  const headingId = `${sectionId}-heading`;
  const visibleInsights = insights.filter(
    (insight) => !dismissedInsightIds.has(insight.insightId),
  );

  function handleDismiss(insightId: AdminUc5InsightId) {
    setDismissedInsightIds((currentInsightIds) => {
      const nextInsightIds = new Set(currentInsightIds);

      nextInsightIds.add(insightId);

      return nextInsightIds;
    });
  }

  if (visibleInsights.length === 0) {
    return null;
  }

  return (
    <AnalyticsCard>
      <section
        aria-labelledby={headingId}
        className="px-lg py-lg"
      >
        <div className="flex items-center gap-xs">
          <Icon
            aria-hidden="true"
            className="shrink-0 text-premium-inbug"
            name="signal-ai"
            size="small"
          />
          <h2
            className="text-heading-lg text-text"
            id={headingId}
          >
            Key insights
          </h2>
        </div>
        <div className="mt-xxl grid gap-md">
          {visibleInsights.map((insight) => (
            <InsightCard
              active={activeInsightId === insight.insightId}
              action={{
                id: `analytics-${insight.insightId}`,
                kind: "ask-ai",
                label: "Ask",
                onSelect: () =>
                  onInsightSelect({
                    id: insight.insightId,
                    prompt: insight.question,
                  }),
              }}
              dismissLabel={insight.dismissLabel}
              evidence={insight.evidence}
              headline={insight.headline}
              key={insight.insightId}
              onDismiss={() => handleDismiss(insight.insightId)}
              type={insight.type}
              visual={insight.visual}
            />
          ))}
        </div>
      </section>
    </AnalyticsCard>
  );
}

function ChartLegendRow({
  dashed = false,
  label,
  value,
}: Readonly<{
  dashed?: boolean;
  label: string;
  value: string;
}>) {
  return (
    <div className="grid min-h-10 grid-cols-[24px_32px_minmax(0,1fr)_auto] items-center gap-sm border-t border-border-faint py-sm">
      <span
        aria-hidden="true"
        className="inline-flex size-5 items-center justify-center rounded-xs bg-positive text-on-checked"
      >
        <Icon name="check" size="small" />
      </span>
      <span
        aria-hidden="true"
        className={cx(
          "block h-0 w-6 border-t-2",
          dashed ? "border-dashed border-positive" : "border-action",
        )}
      />
      <span className="min-w-0 truncate text-body-sm text-text-meta">
        {label}
      </span>
      <span className="text-control-sm text-text">{value}</span>
    </div>
  );
}

function ImpressionsChart() {
  return (
    <div className="mt-xxl overflow-x-auto pb-xs">
      <svg
        aria-labelledby="velora-impressions-chart-title"
        className="min-w-[620px]"
        role="img"
        viewBox="0 0 720 280"
      >
        <title id="velora-impressions-chart-title">
          Velora impressions trend from May 10, 2026 to Jun 8, 2026
        </title>
        {[52, 94, 136, 178, 220].map((y, index) => (
          <g key={y}>
            <line
              stroke="var(--color-border-faint)"
              strokeWidth="1"
              x1="72"
              x2="690"
              y1={y}
              y2={y}
            />
            <text
              fill="var(--color-text-meta)"
              fontSize="12"
              textAnchor="end"
              x="58"
              y={y + 4}
            >
              {[80000, 60000, 40000, 20000, 0][index]}
            </text>
          </g>
        ))}
        <path
          d="M72 218 C112 214 132 204 156 190 C184 174 204 176 230 184 C258 194 280 180 306 166 C334 150 358 148 386 136 C416 122 440 118 466 108 C498 96 520 78 548 68 C578 58 604 72 630 84 C652 94 672 96 690 90"
          fill="none"
          stroke="var(--color-action)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M72 220 C112 220 150 219 188 219 C230 218 270 219 310 218 C350 218 390 217 430 218 C470 217 510 218 550 218 C590 218 640 219 690 218"
          fill="none"
          stroke="var(--color-positive)"
          strokeDasharray="6 6"
          strokeLinecap="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {[
          ["May 10", 72],
          ["May 15", 178],
          ["May 20", 284],
          ["May 25", 390],
          ["May 30", 496],
          ["Jun 4", 602],
          ["Jun 8", 690],
        ].map(([label, x]) => (
          <text
            fill="var(--color-text-meta)"
            fontSize="12"
            key={label}
            textAnchor="middle"
            x={x}
            y="250"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function MetricsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex flex-wrap items-start justify-between gap-md">
          <div>
            <h2 className="text-heading-lg text-text">Metrics</h2>
          </div>
          <button
            className="inline-flex min-h-8 items-center gap-xs rounded-round bg-positive px-md text-control-sm text-on-checked outline-none transition-colors hover:bg-positive-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
            type="button"
          >
            <span>Impressions</span>
            <Icon aria-hidden="true" name="chevron-down" size="small" />
          </button>
        </div>

        <ImpressionsChart />

        <div className="mt-lg">
          <ChartLegendRow label="Organic" value="64,800" />
          <ChartLegendRow dashed label="Sponsored" value="0" />
        </div>
      </div>
    </AnalyticsCard>
  );
}

function VisitorHighlightsCard(
  props: AnalyticsContextualPromptSlotProps = {},
) {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-lg text-text">Visitor highlights</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <div className="mt-xxl grid gap-lg sm:grid-cols-3">
          {visitorHighlights.map((highlight) => (
            <article key={highlight.label}>
              <p className="text-heading-xl text-text">{highlight.value}</p>
              <h3 className="mt-xxs text-body-sm text-text-meta">
                {highlight.label}
              </h3>
              <AnalyticsTrend tone={highlight.tone} value={highlight.delta} />
            </article>
          ))}
        </div>
      </div>
      <ContextualAiPromptSlot {...props} />
    </AnalyticsCard>
  );
}

function VisitorMetricFilterButton({
  active = false,
  label,
}: Readonly<{
  active?: boolean;
  label: string;
}>) {
  return (
    <button
      aria-pressed={active}
      className={cx(
        "inline-flex min-h-8 items-center gap-xs rounded-round border px-md text-control-sm outline-none transition-colors focus-visible:ring-4 focus-visible:ring-neutral-focus-ring",
        active
          ? "border-positive bg-positive text-on-checked hover:bg-positive-hover"
          : "border-border-subtle bg-background text-label hover:border-border-subtle-hover hover:bg-background-transparent-hover",
      )}
      type="button"
    >
      <span>{label}</span>
      <Icon
        aria-hidden="true"
        className={active ? "text-on-checked" : "text-text-meta"}
        name="chevron-down"
        size="small"
      />
    </button>
  );
}

function VisitorMetricsChart() {
  return (
    <div className="mt-lg overflow-x-auto pb-xs">
      <svg
        aria-labelledby="velora-visitor-metrics-chart-title"
        className="min-w-[620px]"
        role="img"
        viewBox="0 0 720 290"
      >
        <title id="velora-visitor-metrics-chart-title">
          Velora visitor page views by device from May 11, 2026 to Jun 9, 2026
        </title>
        {[42, 92, 142, 192, 242].map((y, index) => (
          <g key={y}>
            <line
              stroke="var(--color-border-faint)"
              strokeWidth="1"
              x1="72"
              x2="690"
              y1={y}
              y2={y}
            />
            <text
              fill="var(--color-text-meta)"
              fontSize="12"
              textAnchor="end"
              x="58"
              y={y + 4}
            >
              {[10000, 7500, 5000, 2500, 0][index]}
            </text>
          </g>
        ))}
        <path
          d="M72 178 L100 166 L126 238 L154 216 L180 214 L206 242 L232 238 L258 210 L286 230 L314 232 L342 218 L368 174 L394 242 L422 234 L450 82 L478 178 L506 170 L532 224 L560 238 L588 212 L614 166 L640 190 L666 178 L690 236"
          fill="none"
          stroke="var(--color-action)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M72 238 L100 236 L126 242 L154 240 L180 242 L206 242 L232 240 L258 236 L286 240 L314 242 L342 238 L368 228 L394 242 L422 236 L450 220 L478 238 L506 212 L532 238 L560 240 L588 234 L614 232 L640 238 L666 218 L690 240"
          fill="none"
          stroke="var(--color-positive)"
          strokeDasharray="6 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {[
          ["May 11", 72],
          ["May 16", 180],
          ["May 21", 314],
          ["May 26", 450],
          ["May 31", 560],
          ["Jun 5", 666],
        ].map(([label, x]) => (
          <text
            fill="var(--color-text-meta)"
            fontSize="12"
            key={label}
            textAnchor="middle"
            x={x}
            y="270"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function VisitorDeviceLegendRow({
  dashed = false,
  label,
  value,
}: Readonly<{
  dashed?: boolean;
  label: string;
  value: string;
}>) {
  return (
    <div className="grid min-h-10 grid-cols-[24px_32px_minmax(0,1fr)_auto] items-center gap-sm border-t border-border-faint py-sm">
      <span
        aria-hidden="true"
        className="inline-flex size-5 items-center justify-center rounded-xs bg-positive text-on-checked"
      >
        <Icon name="check" size="small" />
      </span>
      <span
        aria-hidden="true"
        className={cx(
          "block h-0 w-6 border-t-2",
          dashed ? "border-dashed border-positive" : "border-action",
        )}
      />
      <span className="min-w-0 truncate text-body-sm text-text-meta">
        {label}
      </span>
      <span className="text-control-sm text-text">{value}</span>
    </div>
  );
}

function VisitorMetricsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-lg text-text">Visitor metrics</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>

        <div className="mt-xxl flex flex-wrap gap-sm">
          <VisitorMetricFilterButton active label="Page views" />
          <VisitorMetricFilterButton active label="All pages" />
          <VisitorMetricFilterButton label="All filters" />
        </div>

        <VisitorMetricsChart />

        <div className="mt-lg">
          <VisitorDeviceLegendRow label="Desktop" value="7,520" />
          <VisitorDeviceLegendRow dashed label="Mobile" value="1,220" />
        </div>
      </div>
    </AnalyticsCard>
  );
}

function VisitorProfileRow({
  visitor,
}: Readonly<{ visitor: VisitorProfileData }>) {
  return (
    <article className="grid grid-cols-[48px_minmax(0,1fr)] gap-md border-t border-border-faint px-lg py-xxl first:border-t-0">
      <Entity
        label={visitor.name}
        size={48}
        src={assetSrc(visitor.avatar)}
      />
      <div className="min-w-0">
        <h3 className="truncate text-control-sm text-text">{visitor.name}</h3>
        <p className="mt-xxs line-clamp-2 text-body-sm text-text">
          {visitor.headline}
        </p>
        <p className="mt-xs text-body-xs text-text-meta">{visitor.location}</p>
        <p className="mt-xxs text-body-xs text-text-meta">{visitor.detail}</p>
        <p className="mt-xxs text-body-xs text-text-meta">{visitor.shown}</p>
      </div>
    </article>
  );
}

function WhoVisitedYourPageCard() {
  return (
    <AnalyticsCard className="overflow-hidden border-t-4 border-t-premium-brand">
      <div className="px-lg pb-xxl pt-lg">
        <PremiumMark label="Premium" showText />
        <div className="mt-xs flex items-center gap-xs">
          <h2 className="text-heading-lg text-text">
            Who&apos;s visited your Page
          </h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <p className="mt-xs text-body-md text-text-meta">
          See one new page visitor each day.
        </p>
      </div>

      <div>
        {visitorProfiles.map((visitor) => (
          <VisitorProfileRow key={visitor.name} visitor={visitor} />
        ))}
      </div>

      <div className="border-t border-border-faint px-lg py-md text-center">
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
          Show all visitors
        </GhostButton>
      </div>
    </AnalyticsCard>
  );
}

function VisitorDemographicsCard(
  props: AnalyticsContextualPromptSlotProps = {},
) {
  return (
    <AnalyticsCard className="overflow-hidden">
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-lg text-text">Visitor demographics</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <button
          className="mt-xxl inline-flex min-h-8 items-center gap-xs rounded-round border border-border-subtle bg-background px-md text-control-sm text-label outline-none transition-colors hover:border-border-subtle-hover hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          type="button"
        >
          <span>Job function</span>
          <Icon aria-hidden="true" name="chevron-down" size="small" />
        </button>

        <div className="mt-lg space-y-xl">
          {visitorDemographics.map((row) => (
            <div className="space-y-xs" key={row.label}>
              <p className="text-body-sm font-semibold text-text">
                {row.label}
                <span className="font-normal text-text-meta">
                  {" "}
                  · {row.count} ({row.percentage}%)
                </span>
              </p>
              <span
                aria-hidden="true"
                className="block h-2 rounded-xs bg-tag-neutral-background"
                style={{ width: `${row.barPercent}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border-faint px-lg py-md text-center">
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
          Show all
        </GhostButton>
      </div>
      <ContextualAiPromptSlot {...props} />
    </AnalyticsCard>
  );
}

function CompetitorDateButton() {
  return (
    <button
      className="inline-flex min-h-9 max-w-full items-center gap-xs rounded-round border border-border-subtle bg-background px-md py-xs text-control-sm text-label outline-none transition-colors hover:border-border-subtle-hover hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
      type="button"
    >
      <Icon
        aria-hidden="true"
        className="shrink-0 text-text-meta"
        name="calendar"
        size="small"
      />
      <span className="min-w-0 truncate">{COMPETITOR_ANALYTICS_DATE_RANGE}</span>
      <Icon
        aria-hidden="true"
        className="shrink-0 text-text-meta"
        name="chevron-down"
        size="small"
      />
    </button>
  );
}

function CompetitorIntroCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg pb-xxl pt-lg">
        <PremiumMark label="Premium" showText />
        <h2 className="mt-xs text-heading-lg text-text">
          Learn from other Pages
        </h2>
        <p className="mt-xs text-body-sm text-text-meta">
          Stay ahead with competitor insights
        </p>
      </div>
      <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-md border-t border-border-faint px-lg py-md">
        <CompetitorDateButton />
        <div className="flex flex-wrap gap-sm">
          <Button size="small" variant="secondary">
            Edit competitors
          </Button>
          <Button leadingIcon={<Icon name="download" />} size="small">
            Export
          </Button>
        </div>
      </div>
    </AnalyticsCard>
  );
}

function CompetitorTrackingNoticeCard() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <TodayActionCard
      description="Edit your competitors list to track specific Pages on LinkedIn."
      dismissLabel="Dismiss competitor tracking notice"
      headline="Start tracking and benchmarking your Page's performance"
      inlineAction={{ label: "Learn more" }}
      onDismiss={() => setIsDismissed(true)}
      visual={
        <Image
          alt=""
          aria-hidden="true"
          className="size-12 shrink-0"
          height={48}
          src={assetSrc("ui-dashboard-large.svg")}
          width={48}
        />
      }
    />
  );
}

function CompetitorHighlightsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-lg text-text">Competitor highlights</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <p className="mt-xs text-body-sm text-text-meta">Last 30 days</p>
        <div className="mt-xxl grid gap-lg sm:grid-cols-2">
          {competitorHighlights.map((highlight) => (
            <article key={highlight.label}>
              <p className="text-heading-md text-text">{highlight.value}</p>
              <h3 className="mt-xxs text-body-sm text-text-meta">
                {highlight.label}
              </h3>
              <div className="flex flex-wrap items-center gap-xs">
                <AnalyticsTrend tone={highlight.tone} value={highlight.delta} />
                <span className="mt-xs text-supportive-s text-text-meta">
                  {highlight.context}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}

function CompetitorLogo({
  company,
}: Readonly<{
  company: string;
}>) {
  const isVelora = company === pcpCompanyProfile.name;

  return (
    <Entity
      className={cx(isVelora && "bg-[#ACF5B3]")}
      label={company}
      shape="square"
      size={40}
      src={isVelora ? pcpCompanyProfile.logoSrc : undefined}
      style={isVelora ? { backgroundColor: "#ACF5B3" } : undefined}
    />
  );
}

function CompetitorMetricCell({
  metric,
}: Readonly<{
  metric: CompetitorGrowthMetricData;
}>) {
  return (
    <td className="px-md py-md text-right align-top">
      <p className="text-control-sm text-text">{metric.value}</p>
      <AnalyticsTrend tone={metric.tone} value={metric.delta} />
    </td>
  );
}

function CompetitorGrowthTable(props: AnalyticsContextualPromptSlotProps = {}) {
  return (
    <AnalyticsCard>
      <div className="px-lg pb-xxl pt-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-lg text-text">Compare growth</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <p className="mt-xs text-body-sm text-text-meta">Last 30 days</p>
      </div>

      <div className="overflow-x-auto px-lg pb-lg">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="text-label-xs text-text-meta">
              <th className="w-[260px] px-md py-sm font-semibold">
                Competitors
              </th>
              <th className="px-md py-sm text-right font-semibold">
                New followers
              </th>
              <th className="px-md py-sm text-right font-semibold">Posts</th>
              <th className="px-md py-sm text-right font-semibold">
                Comments
              </th>
              <th className="px-md py-sm text-right font-semibold">
                Comments per day
              </th>
              <th className="px-md py-sm text-right font-semibold">
                Reactions
              </th>
            </tr>
          </thead>
          <tbody>
            {competitorGrowthRows.map((row) => (
              <tr
                className="border-t border-border-faint text-body-sm text-text"
                key={row.company}
              >
                <td className="px-md py-md align-top">
                  <div className="grid grid-cols-[24px_40px_minmax(0,1fr)] items-center gap-sm">
                    <span className="text-body-md text-text-meta">
                      {row.rank}
                    </span>
                    <CompetitorLogo company={row.company} />
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-xs">
                        <p className="truncate text-control-sm text-text">
                          {row.company}
                        </p>
                        {row.isYou ? (
                          <span className="rounded-xs bg-tag-default-background px-xs text-supportive-s-strong text-text">
                            You
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-xxs truncate text-body-xs text-text-meta">
                        {row.followers}
                      </p>
                    </div>
                  </div>
                </td>
                <CompetitorMetricCell metric={row.newFollowers} />
                <CompetitorMetricCell metric={row.posts} />
                <CompetitorMetricCell metric={row.comments} />
                <CompetitorMetricCell metric={row.commentsPerDay} />
                <CompetitorMetricCell metric={row.reactions} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ContextualAiPromptSlot {...props} />
    </AnalyticsCard>
  );
}

function CompetitorPostCard({
  post,
}: Readonly<{
  post: CompetitorPostData;
}>) {
  return (
    <article className="rounded-xs border border-border-faint p-md">
      <p className="text-body-xs text-text-meta">
        {post.company} {post.timestamp}
      </p>
      <p className="mt-sm line-clamp-2 text-body-sm text-text">{post.body}</p>
      <div className="mt-md grid grid-cols-[72px_minmax(0,1fr)] gap-md">
        <Image
          alt={post.imageAlt}
          className="aspect-square rounded-xs object-cover"
          height={72}
          src={assetSrc(post.image)}
          width={72}
        />
        <div className="min-w-0 self-center">
          <h3 className="line-clamp-2 text-control-sm text-text">
            {post.title}
          </h3>
          <p className="mt-xxs text-body-xs text-text-meta">{post.meta}</p>
        </div>
      </div>
      <div className="mt-md flex flex-wrap items-center justify-between gap-sm">
        <ReactionSummary comments={post.comments} reactions={post.reactions} />
        <button
          className="text-body-sm text-text-meta transition-colors hover:text-action hover:underline"
          type="button"
        >
          show more
        </button>
      </div>
    </article>
  );
}

function TrendingCompetitorPostsCard(
  props: AnalyticsContextualPromptSlotProps = {},
) {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-lg text-text">
            Trending competitor posts
          </h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <p className="mt-xs text-body-sm text-text-meta">Last 30 days</p>
        <div className="mt-xxl grid gap-md">
          {competitorPosts.map((post) => (
            <CompetitorPostCard key={post.title} post={post} />
          ))}
        </div>
      </div>
      <ContextualAiPromptSlot {...props} />
    </AnalyticsCard>
  );
}

function CompetitiveTipCard({
  tip,
}: Readonly<{
  tip: CompetitiveTipData;
}>) {
  return (
    <article className="grid min-h-[104px] grid-cols-[minmax(0,1fr)_64px] items-center gap-md rounded-xs border border-border-faint p-lg">
      <div className="min-w-0">
        <h3 className="text-control-sm text-text">{tip.title}</h3>
        <p className="mt-xxs text-body-sm text-text-meta">{tip.description}</p>
        <Button className="mt-sm" size="small" variant="secondary">
          {tip.action}
        </Button>
      </div>
      <Image
        alt=""
        aria-hidden="true"
        className="size-16 shrink-0 justify-self-end object-contain"
        height={64}
        src={assetSrc(tip.illustration)}
        width={64}
      />
    </article>
  );
}

function CompetitiveTipsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <h2 className="text-heading-lg text-text">Tips to stay competitive</h2>
        <div className="mt-xxl grid gap-md">
          {competitiveTips.map((tip) => (
            <CompetitiveTipCard key={tip.title} tip={tip} />
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}

function ContentBoostUpsellBanner({
  estimate,
}: Readonly<{ estimate: string }>) {
  return (
    <div className="mt-md flex flex-wrap items-center justify-between gap-md rounded-sm bg-surface-tint px-md py-sm text-text-meta">
      <p className="min-w-[220px] flex-1 text-body-sm">
        {estimate}{" "}
        <Icon
          aria-hidden="true"
          className="inline-block align-[-2px] text-icon"
          name="question"
          size="small"
        />
      </p>
      <Button size="small" variant="secondary">
        Boost
      </Button>
    </div>
  );
}

function ContentEngagementTable(props: AnalyticsContextualPromptSlotProps = {}) {
  return (
    <AnalyticsCard>
      <div className="flex flex-wrap items-center justify-between gap-md px-lg pb-xxl pt-[16px]">
        <div>
          <h2 className="text-heading-lg text-text">Content engagement</h2>
          <p className="mt-xs text-body-sm text-text-meta">
            Time range: May 26, 2026 - Jun 8, 2026
          </p>
        </div>
        <button
          className="inline-flex h-8 items-center gap-xs rounded-xs border border-border-subtle px-sm text-body-sm text-label outline-none transition-colors hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          type="button"
        >
          <span>Show: 4</span>
          <Icon aria-hidden="true" name="chevron-down" size="small" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border-faint bg-background-neutral-soft text-label-xs text-text-meta">
              <th className="w-[420px] px-lg py-[16px] font-semibold">
                Post title
              </th>
              <th className="px-md py-[16px] text-right font-semibold">
                Reactions
              </th>
              <th className="px-md py-[16px] text-right font-semibold">
                Comments
              </th>
              <th className="px-md py-[16px] text-right font-semibold">
                Reposts
              </th>
              <th className="px-md py-[16px] text-right font-semibold">
                Follows
              </th>
              <th className="px-lg py-[16px] text-right font-semibold">
                Engagement rate
              </th>
            </tr>
          </thead>
          <tbody>
            {contentEngagementRows.map((row) => (
              <tr
                className="border-b border-border-faint align-top text-body-sm text-text"
                key={row.title}
              >
                <td className="max-w-[440px] px-lg py-[32px]">
                  <button
                    className="line-clamp-2 text-left text-control-sm text-action hover:underline"
                    type="button"
                  >
                    {row.title}
                  </button>
                  <p className="mt-xs text-body-xs text-text-meta">
                    Posted by {row.postedBy} &middot; {row.date}
                  </p>
                  {row.boostEstimate ? (
                    <ContentBoostUpsellBanner estimate={row.boostEstimate} />
                  ) : null}
                </td>
                <td className="px-md py-[32px] text-right align-middle">
                  {row.reactions}
                </td>
                <td className="px-md py-[32px] text-right align-middle">
                  {row.comments}
                </td>
                <td className="px-md py-[32px] text-right align-middle">
                  {row.reposts}
                </td>
                <td className="px-md py-[32px] text-right align-middle">
                  {row.follows}
                </td>
                <td className="px-lg py-[32px] text-right align-middle">
                  {row.engagementRate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ContextualAiPromptSlot {...props} />
    </AnalyticsCard>
  );
}

function ContentAnalyticsPanel({
  activeInsightId,
  onInsightSelect,
  onSelfInitiatedViewSelect,
  showKeyInsights,
  showWipPrompts,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
  onSelfInitiatedViewSelect: (
    view: AdminUc5SelfInitiatedView,
    prompt?: string,
  ) => void;
  showKeyInsights: boolean;
  showWipPrompts: boolean;
}>) {
  return (
    <div
      aria-labelledby="premium-company-pages-analytics-content-tab"
      className="space-y-md"
      id="premium-company-pages-analytics-content-panel"
      role="tabpanel"
    >
      {showKeyInsights ? (
        <AnalyticsKeyInsightsCard
          activeInsightId={activeInsightId}
          insights={contentAnalyticsInsightCards}
          onInsightSelect={onInsightSelect}
          sectionId="analytics-content-ai-insights"
        />
      ) : null}
      <AnalyticsControlsCard />
      <HighlightsCard
        contextualPrompts={
          showWipPrompts ? wipContentHighlightsPromptRows : undefined
        }
        onInsightSelect={onInsightSelect}
        onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
      />
      <MetricsCard />
      <ContentEngagementTable
        contextualPrompts={showWipPrompts ? wipContentPromptRows : undefined}
        onInsightSelect={onInsightSelect}
        onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
      />
    </div>
  );
}

function VisitorAnalyticsPanel({
  activeInsightId,
  onInsightSelect,
  onSelfInitiatedViewSelect,
  showKeyInsights,
  showWipPrompts,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
  onSelfInitiatedViewSelect: (
    view: AdminUc5SelfInitiatedView,
    prompt?: string,
  ) => void;
  showKeyInsights: boolean;
  showWipPrompts: boolean;
}>) {
  return (
    <div
      aria-labelledby="premium-company-pages-analytics-visitors-tab"
      className="space-y-md"
      id="premium-company-pages-analytics-visitors-panel"
      role="tabpanel"
    >
      {showKeyInsights ? (
        <AnalyticsKeyInsightsCard
          activeInsightId={activeInsightId}
          insights={visitorAnalyticsInsightCards}
          onInsightSelect={onInsightSelect}
          sectionId="analytics-visitors-ai-insights"
        />
      ) : null}
      <AnalyticsControlsCard dateRange={VISITOR_ANALYTICS_DATE_RANGE} />
      <VisitorHighlightsCard
        contextualPrompts={
          showWipPrompts ? wipVisitorHighlightsPromptRows : undefined
        }
        onInsightSelect={onInsightSelect}
        onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
      />
      <VisitorMetricsCard />
      <WhoVisitedYourPageCard />
      <VisitorDemographicsCard
        contextualPrompts={
          showWipPrompts ? wipVisitorDemographicsPromptRows : undefined
        }
        onInsightSelect={onInsightSelect}
        onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
      />
    </div>
  );
}

function CompetitorAnalyticsPanel({
  activeInsightId,
  onInsightSelect,
  onSelfInitiatedViewSelect,
  showKeyInsights,
  showWipPrompts,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
  onSelfInitiatedViewSelect: (
    view: AdminUc5SelfInitiatedView,
    prompt?: string,
  ) => void;
  showKeyInsights: boolean;
  showWipPrompts: boolean;
}>) {
  return (
    <div
      aria-labelledby="premium-company-pages-analytics-competitors-tab"
      className="space-y-md"
      id="premium-company-pages-analytics-competitors-panel"
      role="tabpanel"
    >
      {showKeyInsights ? (
        <AnalyticsKeyInsightsCard
          activeInsightId={activeInsightId}
          insights={competitorAnalyticsInsightCards}
          onInsightSelect={onInsightSelect}
          sectionId="analytics-competitors-ai-insights"
        />
      ) : null}
      <CompetitorIntroCard />
      <CompetitorTrackingNoticeCard />
      <CompetitorHighlightsCard />
      <CompetitorGrowthTable
        contextualPrompts={
          showWipPrompts ? wipCompetitorGrowthPromptRows : undefined
        }
        onInsightSelect={onInsightSelect}
        onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
      />
      <TrendingCompetitorPostsCard
        contextualPrompts={
          showWipPrompts ? wipCompetitorPostsPromptRows : undefined
        }
        onInsightSelect={onInsightSelect}
        onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
      />
      <CompetitiveTipsCard />
    </div>
  );
}

function EmptyAnalyticsPanel({
  tab,
}: Readonly<{
  tab: (typeof analyticsTabs)[number];
}>) {
  return (
    <section
      aria-labelledby={`premium-company-pages-analytics-${tab.id}-tab`}
      className="min-h-[520px] rounded-sm border border-border-faint bg-background"
      id={`premium-company-pages-analytics-${tab.id}-panel`}
      role="tabpanel"
    >
      <h2 className="sr-only">{tab.label} analytics</h2>
    </section>
  );
}

function AnalyticsContent({
  activeInsightId,
  onInsightSelect,
  onSelfInitiatedViewSelect,
  story,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
  onSelfInitiatedViewSelect: (
    view: AdminUc5SelfInitiatedView,
    prompt?: string,
  ) => void;
  story: PremiumCompanyPagesAdminStory;
}>) {
  const [activeTabId, setActiveTabId] = useState<AnalyticsTabId>("content");
  const activeTab =
    analyticsTabs.find((tab) => tab.id === activeTabId) ?? analyticsTabs[0];
  const showKeyInsights = story === "old";
  const showWipPrompts = story === "current";

  return (
    <div className="min-w-0 space-y-md">
      <section className="overflow-hidden rounded-sm border border-border-faint bg-background">
        <div className="px-lg pt-lg">
          <h1 className="text-heading-xl text-text">Analytics</h1>
        </div>
        <div
          aria-label="Analytics sections"
          className="mt-md flex overflow-x-auto px-sm"
          role="tablist"
        >
          {analyticsTabs.map((tab) => (
            <AnalyticsTabButton
              active={activeTabId === tab.id}
              key={tab.id}
              onSelect={setActiveTabId}
              tab={tab}
            />
          ))}
        </div>
      </section>

      {activeTabId === "content" ? (
        <ContentAnalyticsPanel
          activeInsightId={activeInsightId}
          onInsightSelect={onInsightSelect}
          onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
          showKeyInsights={showKeyInsights}
          showWipPrompts={showWipPrompts}
        />
      ) : activeTabId === "visitors" ? (
        <VisitorAnalyticsPanel
          activeInsightId={activeInsightId}
          onInsightSelect={onInsightSelect}
          onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
          showKeyInsights={showKeyInsights}
          showWipPrompts={showWipPrompts}
        />
      ) : activeTabId === "competitors" ? (
        <CompetitorAnalyticsPanel
          activeInsightId={activeInsightId}
          onInsightSelect={onInsightSelect}
          onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
          showKeyInsights={showKeyInsights}
          showWipPrompts={showWipPrompts}
        />
      ) : (
        <EmptyAnalyticsPanel tab={activeTab} />
      )}
    </div>
  );
}

function PremiumCompanyPagesAdminShell({
  activeItem,
  children,
  onOpenAssistant,
  story,
}: Readonly<{
  activeItem: string;
  children: ReactNode;
  onOpenAssistant: () => void;
  story: PremiumCompanyPagesAdminStory;
}>) {
  return (
    <main className="min-h-dvh bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation profileSrc={pcpAdminPersona.avatarSrc} />
      <div className="mx-auto grid w-full max-w-[1145px] gap-lg px-lg pb-[112px] pt-xxl lg:grid-cols-[225px_minmax(0,888px)] lg:gap-[32px] lg:px-0 lg:py-xxl">
        <PageRail
          activeItem={activeItem}
          onOpenAssistant={onOpenAssistant}
          story={story}
        />
        {children}
      </div>
    </main>
  );
}

type PremiumCompanyPagesAdminVcaShellProps = Readonly<{
  activeItem: string;
  children: (props: {
    activeInsightId: AdminUc5InsightId | null;
    onInsightSelect: (insight: AdminUc5InsightSelection) => void;
    onSelfInitiatedViewSelect: (
      view: AdminUc5SelfInitiatedView,
      prompt?: string,
    ) => void;
  }) => ReactNode;
  initialAgentOpen?: boolean;
  story?: PremiumCompanyPagesAdminStory;
  turnIdPrefix: string;
}>;

function AdminVcaFabEntry({
  chatPanelId,
  onOpen,
  onPromptSelect,
  showPrompts,
  style,
}: Readonly<{
  chatPanelId: string;
  onOpen: () => void;
  onPromptSelect: (view: AdminUc5SelfInitiatedView) => void;
  showPrompts: boolean;
  style: CSSProperties;
}>) {
  return (
    <div
      className="pcp-ai-messaging-surface group fixed bottom-6 right-6 z-50 md:bottom-[var(--pcp-admin-ai-fab-bottom)]"
      style={style}
    >
      {showPrompts ? (
        <FabPromptStack
          items={ADMIN_UC5_SELF_INITIATED_PROMPTS.map((item) => ({
            id: item.id,
            prompt: item.prompt,
            value: item.id,
          }))}
          onPromptSelect={onPromptSelect}
        />
      ) : null}
      <VcaFab
        adminTone="gold"
        chatPanelId={chatPanelId}
        label="Open Assistant"
        onClick={onOpen}
        position="static"
        variant="admin"
      />
    </div>
  );
}

function PremiumCompanyPagesAdminVcaShell({
  activeItem,
  children,
  initialAgentOpen = false,
  story = "current",
  turnIdPrefix,
}: PremiumCompanyPagesAdminVcaShellProps) {
  const agentPanelId = useId();
  const nextTurnIdRef = useRef(0);
  const [isAgentOpen, setIsAgentOpen] = useState(initialAgentOpen);
  const [hasAgentSession, setHasAgentSession] = useState(initialAgentOpen);
  const [agentSessionKey, setAgentSessionKey] = useState(0);
  const [hasAgentConversationStarted, setHasAgentConversationStarted] =
    useState(false);
  const [isEndChatFeedbackOpen, setIsEndChatFeedbackOpen] = useState(false);
  const [agentPanelVariant, setAgentPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [activeInsight, setActiveInsight] =
    useState<AdminUc5InsightSelection | null>(null);
  const [initialSelfInitiatedView, setInitialSelfInitiatedView] =
    useState<AdminUc5SelfInitiatedView | null>(null);
  const [initialSelfInitiatedPrompt, setInitialSelfInitiatedPrompt] =
    useState<string | undefined>(undefined);
  const [agentDraft, setAgentDraft] = useState("");
  const [agentThreadTurns, setAgentThreadTurns] = useState<
    ReadonlyArray<AdminUc5ThreadTurn>
  >([]);
  const [isGlobalInboxExpanded, setIsGlobalInboxExpanded] = useState(false);

  function createTurnId() {
    const turnId = `${turnIdPrefix}-${nextTurnIdRef.current}`;
    nextTurnIdRef.current += 1;

    return turnId;
  }

  function runAdminMessagingSurfaceTransition(updateSurfaceState: () => void) {
    if (
      !startClassedViewTransition(
        () => {
          flushSync(updateSurfaceState);
        },
        "pcp-messaging-surface-transition",
      )
    ) {
      updateSurfaceState();
    }
  }

  function handleInsightSelect(insight: AdminUc5InsightSelection) {
    runAdminMessagingSurfaceTransition(() => {
      setAgentSessionKey((currentKey) => currentKey + 1);
      setHasAgentSession(true);
      setHasAgentConversationStarted(true);
      setIsEndChatFeedbackOpen(false);
      setActiveInsight(insight);
      setInitialSelfInitiatedView(null);
      setInitialSelfInitiatedPrompt(undefined);
      setAgentThreadTurns([]);
      setAgentDraft("");
      setAgentPanelVariant("collapsed");
      setIsAgentOpen(true);
    });
  }

  function handleOpenAgentFromFab() {
    runAdminMessagingSurfaceTransition(() => {
      if (hasAgentSession) {
        setIsEndChatFeedbackOpen(false);
        setAgentPanelVariant("collapsed");
        setIsAgentOpen(true);

        return;
      }

      setAgentSessionKey((currentKey) => currentKey + 1);
      setHasAgentSession(true);
      setHasAgentConversationStarted(false);
      setIsEndChatFeedbackOpen(false);
      setActiveInsight(null);
      setInitialSelfInitiatedView(null);
      setInitialSelfInitiatedPrompt(undefined);
      setAgentThreadTurns([]);
      setAgentDraft("");
      setAgentPanelVariant("collapsed");
      setIsAgentOpen(true);
    });
  }

  function handleOpenSelfInitiatedView(
    view: AdminUc5SelfInitiatedView,
    prompt?: string,
  ) {
    runAdminMessagingSurfaceTransition(() => {
      setAgentSessionKey((currentKey) => currentKey + 1);
      setHasAgentSession(true);
      setHasAgentConversationStarted(true);
      setIsEndChatFeedbackOpen(false);
      setActiveInsight(null);
      setInitialSelfInitiatedView(view);
      setInitialSelfInitiatedPrompt(prompt);
      setAgentThreadTurns([]);
      setAgentDraft("");
      setAgentPanelVariant("collapsed");
      setIsAgentOpen(true);
    });
  }

  function handleMinimizeAgentToFab() {
    runAdminMessagingSurfaceTransition(() => {
      setIsAgentOpen(false);
      setAgentPanelVariant("collapsed");
      setIsEndChatFeedbackOpen(false);
    });
  }

  function handleEndAgentChat() {
    runAdminMessagingSurfaceTransition(() => {
      setIsAgentOpen(false);
      setHasAgentSession(false);
      setHasAgentConversationStarted(false);
      setIsEndChatFeedbackOpen(false);
      setAgentPanelVariant("collapsed");
      setActiveInsight(null);
      setInitialSelfInitiatedView(null);
      setInitialSelfInitiatedPrompt(undefined);
      setAgentThreadTurns([]);
      setAgentDraft("");
    });
  }

  function handleRequestCloseAgent() {
    if (!hasAgentConversationStarted || isEndChatFeedbackOpen) {
      handleEndAgentChat();
      return;
    }

    setIsEndChatFeedbackOpen(true);
  }

  function handleBackToAgentChat() {
    setIsEndChatFeedbackOpen(false);
  }

  function handleAgentConversationStart() {
    setHasAgentConversationStarted(true);
  }

  function handleCollapseAgentPanel() {
    runAdminMessagingSurfaceTransition(() => {
      setAgentPanelVariant("collapsed");
    });
  }

  function handleToggleAgentPanelVariant() {
    runAdminMessagingSurfaceTransition(() => {
      setAgentPanelVariant((currentVariant) =>
        currentVariant === "expanded" ? "collapsed" : "expanded",
      );
    });
  }

  function handleAgentDraftChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setAgentDraft(event.currentTarget.value);
  }

  function handleAgentDraftClear() {
    setAgentDraft("");
  }

  function handleAgentFollowUpSelect(followUp: AdminUc5FollowUp) {
    setHasAgentConversationStarted(true);
    setAgentThreadTurns((currentTurns) => [
      ...currentTurns,
      {
        id: createTurnId(),
        prompt: followUp.prompt,
        response: followUp.response,
      },
    ]);
    setAgentDraft("");
  }

  function handleAgentSend() {
    const trimmedDraft = agentDraft.trim();

    if (!trimmedDraft) {
      return;
    }

    setHasAgentConversationStarted(true);
    setAgentThreadTurns((currentTurns) => [
      ...currentTurns,
      buildAdminUc5PrototypeFallbackTurn(trimmedDraft, createTurnId()),
    ]);
    setAgentDraft("");
  }

  const isAgentExpanded = agentPanelVariant === "expanded";
  const globalInboxHeightExpression = isGlobalInboxExpanded
    ? "min(calc(100dvh - 96px), 690px)"
    : "var(--design-layout-chat-tray-height, 48px)";
  const agentFabStyle = {
    "--pcp-admin-ai-fab-bottom": `calc(${globalInboxHeightExpression} + var(--design-spacing-md))`,
  } as CSSProperties;
  const agentPanelPositionClass = isAgentExpanded
    ? "md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2"
    : "md:inset-auto md:bottom-6 md:right-6 md:top-[calc(52px_+_var(--design-spacing-xxl))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]";
  const showVcaFabEntry = story !== "current-state";

  return (
    <>
      <PremiumCompanyPagesAdminShell
        activeItem={activeItem}
        onOpenAssistant={handleOpenAgentFromFab}
        story={story}
      >
        {children({
          activeInsightId: isAgentOpen ? activeInsight?.id ?? null : null,
          onInsightSelect: handleInsightSelect,
          onSelfInitiatedViewSelect: handleOpenSelfInitiatedView,
        })}
      </PremiumCompanyPagesAdminShell>

      {!isAgentOpen ? (
        <GlobalInboxTray
          isExpanded={isGlobalInboxExpanded}
          onToggle={() =>
            setIsGlobalInboxExpanded((currentValue) => !currentValue)
          }
          profileLabel={pcpAdminPersona.name}
          profileSrc={pcpAdminPersona.avatarSrc}
        />
      ) : null}

      {!isAgentOpen && showVcaFabEntry ? (
        <AdminVcaFabEntry
          chatPanelId={agentPanelId}
          onOpen={handleOpenAgentFromFab}
          onPromptSelect={handleOpenSelfInitiatedView}
          showPrompts={!hasAgentSession}
          style={agentFabStyle}
        />
      ) : null}

      {isAgentOpen ? (
        <button
          aria-label="Collapse expanded Velora AI"
          className={cx(
            "fixed inset-0 z-30 hidden bg-overlay-dim md:block",
            !isAgentExpanded && "pointer-events-none opacity-0",
          )}
          onClick={handleCollapseAgentPanel}
          type="button"
        />
      ) : null}

      {hasAgentSession ? (
        <div
          className={cx(
            "pcp-ai-messaging-surface fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform,opacity] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)]",
            agentPanelPositionClass,
            isAgentOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-[var(--design-motion-distance-surface-y)] opacity-0",
          )}
          role="dialog"
          aria-label="Velora AI"
          aria-hidden={!isAgentOpen}
          inert={!isAgentOpen}
        >
          <AdminUc5AgentPanel
            key={agentSessionKey}
            activeInsight={activeInsight}
            draft={agentDraft}
            endFeedbackScreen={
              isEndChatFeedbackOpen ? (
                <ChatEndFeedbackScreen
                  onBackToChat={handleBackToAgentChat}
                  onEndChat={handleEndAgentChat}
                />
              ) : undefined
            }
            initialSelfInitiatedPrompt={initialSelfInitiatedPrompt}
            initialSelfInitiatedView={initialSelfInitiatedView}
            panelId={agentPanelId}
            threadTurns={agentThreadTurns}
            variant={agentPanelVariant}
            onClose={handleRequestCloseAgent}
            onConversationStart={handleAgentConversationStart}
            onDraftChange={handleAgentDraftChange}
            onDraftClear={handleAgentDraftClear}
            onFollowUpSelect={handleAgentFollowUpSelect}
            onInsightSelect={handleInsightSelect}
            onMinimizeToTray={
              showVcaFabEntry ? handleMinimizeAgentToFab : undefined
            }
            onSend={handleAgentSend}
            onVariantToggle={handleToggleAgentPanelVariant}
          />
        </div>
      ) : null}
    </>
  );
}

type PremiumCompanyPagesPageProps = Readonly<{
  initialAgentOpen?: boolean;
  story?: string;
}>;

function getPremiumCompanyPagesDashboardStory(
  story: string | undefined,
): PremiumCompanyPagesAdminStory {
  if (story === "current-state") {
    return "current-state";
  }

  if (story === "dashboard-entry" || story === "cold-start" || story === "old") {
    return "old";
  }

  return "current";
}

export function PremiumCompanyPagesPage({
  initialAgentOpen = false,
  story,
}: PremiumCompanyPagesPageProps) {
  const dashboardStory = getPremiumCompanyPagesDashboardStory(story);

  return (
    <PremiumCompanyPagesAdminVcaShell
      activeItem="Dashboard"
      initialAgentOpen={initialAgentOpen}
      story={dashboardStory}
      turnIdPrefix="admin-uc5-turn"
    >
      {({ activeInsightId, onInsightSelect, onSelfInitiatedViewSelect }) => (
        <DashboardContent
          activeInsightId={activeInsightId}
          onDigestInsightSelect={onInsightSelect}
          onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
          story={dashboardStory}
        />
      )}
    </PremiumCompanyPagesAdminVcaShell>
  );
}

export function PremiumCompanyPagesAdminInboxPage() {
  return (
    <PremiumCompanyPagesAdminVcaShell
      activeItem="Inbox"
      story="current"
      turnIdPrefix="admin-inbox-turn"
    >
      {() => <InboxContent />}
    </PremiumCompanyPagesAdminVcaShell>
  );
}

export function PremiumCompanyPagesAdminSettingsPage() {
  return (
    <PremiumCompanyPagesAdminVcaShell
      activeItem="Settings"
      story="current"
      turnIdPrefix="admin-settings-turn"
    >
      {() => <SettingsContent />}
    </PremiumCompanyPagesAdminVcaShell>
  );
}

export function PremiumCompanyPagesAdminAiAssistantSettingsPage() {
  return (
    <PremiumCompanyPagesAdminVcaShell
      activeItem="Settings"
      story="current"
      turnIdPrefix="admin-ai-assistant-settings-turn"
    >
      {() => <AiAssistantSettingsPlaceholderContent />}
    </PremiumCompanyPagesAdminVcaShell>
  );
}

export function PremiumCompanyPagesAdminAnalyticsPage({
  story,
}: Readonly<{
  story?: string;
}> = {}) {
  const adminStory = getPremiumCompanyPagesDashboardStory(story);

  return (
    <PremiumCompanyPagesAdminVcaShell
      activeItem="Analytics"
      story={adminStory}
      turnIdPrefix="admin-analytics-turn"
    >
      {({ activeInsightId, onInsightSelect, onSelfInitiatedViewSelect }) => (
        <AnalyticsContent
          activeInsightId={activeInsightId}
          onInsightSelect={onInsightSelect}
          onSelfInitiatedViewSelect={onSelfInitiatedViewSelect}
          story={adminStory}
        />
      )}
    </PremiumCompanyPagesAdminVcaShell>
  );
}
