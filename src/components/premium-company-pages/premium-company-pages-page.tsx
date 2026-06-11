"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import { Prompt, type ChatPanelVariant } from "@/components/chat";
import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Button, getButtonClassName } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import { Pill } from "@/components/primitives/pill";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";
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
import { VcaFab } from "./vca-fab";

const ASSET_ROOT = PCP_ASSET_ROOT;
const ADMIN_DASHBOARD_HREF = "/premium-company-pages/admin";
const ADMIN_ANALYTICS_HREF = "/premium-company-pages/admin/analytics";
const ADMIN_INBOX_HREF = "/premium-company-pages/admin/inbox";
const ADMIN_SETTINGS_HREF = "/premium-company-pages/admin/settings";
const ADMIN_AI_ASSISTANT_SETTINGS_HREF =
  "/premium-company-pages/admin/settings/manage-ai-assistant";
const VELORA_AI_ACCENT = "#2AA986";

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => {
    finished: Promise<void>;
  };
};

const primaryRailItems = [
  "Dashboard",
  "Page posts",
  "Analytics",
  "Feed",
  "Activity",
  "Inbox",
  "Edit Page",
];

const secondaryRailItems = ["Services", "Products", "Jobs"];

const railItemHrefs: Partial<Record<string, string>> = {
  Analytics: ADMIN_ANALYTICS_HREF,
  Dashboard: ADMIN_DASHBOARD_HREF,
  Inbox: ADMIN_INBOX_HREF,
  Settings: ADMIN_SETTINGS_HREF,
};

const premiumRailItems: Array<{ label: string; icon?: IconName }> = [
  { label: "Premium features" },
  { label: "Advertise today", icon: "radar-screen" },
  { label: "Invite to follow" },
  { label: "Settings" },
];

type PerformanceCardData = Readonly<{
  title: string;
  value: string;
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

type SettingsRowData = Readonly<{
  title: string;
  description: string;
  badge?: string;
  href?: string;
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
  value: string;
  delta: string;
}>;

type ContentEngagementRowData = Readonly<{
  title: string;
  postedBy: string;
  date: string;
  type: string;
  audience: string;
  impressions: string;
  views: string;
  clicks: string;
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
  icon: IconName;
}>;

const performanceCards: Array<PerformanceCardData> = [
  {
    title: "Who visited your Page",
    value: "18",
    label: "Premium insight",
    premium: true,
  },
  {
    title: "CTA clicks",
    value: "42",
    delta: "18% last 7 days",
    deltaTone: "positive",
  },
  {
    title: "New followers",
    value: "37",
    delta: "8% last 7 days",
    deltaTone: "positive",
  },
  {
    title: "Post impressions",
    value: "3,479",
    delta: "115.6%",
    deltaMeta: "last 7 days",
    deltaTone: "positive",
  },
];

const recentPosts = [
  {
    body: "What benefits teams should validate before a mid-year platform migration: eligibility data, carrier file readiness, employee communications, and open enrollment timing.",
    metric: "Get up to 12K more impressions by boosting",
    image: "member/post-image-1.png",
    imageAlt: "Benefits team reviewing an implementation dashboard",
    linkTitle: "Benefits migration readiness checklist",
    linkMeta: "veloracloud.com",
    reactions: "152",
    comments: "18 Comments",
  },
  {
    body: "Before and after: replacing carrier-by-carrier spreadsheets with one shared view of open issues, plan changes, and employee communication status.",
    metric: "Get up to 9K more impressions by boosting",
    image: "member/post-image-2.png",
    imageAlt: "Benefits administrators reviewing open enrollment tasks",
    linkTitle: "Open enrollment operations win",
    linkMeta: "Arbor Retail Group",
    reactions: "860",
    comments: "42 Comments",
  },
  {
    body: "A short operating question for HR leaders: what breaks first when eligibility cleanup, carrier files, and employee communications are managed in separate systems?",
    metric: "Get up to 7K more impressions by boosting",
    image: "feed-post-content.png",
    imageAlt: "Benefits analytics post preview",
    reactions: "240",
    comments: "12 Comments",
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

const settingsRows: ReadonlyArray<SettingsRowData> = [
  {
    title: "Manage admins",
    description: "Control who manages your page",
  },
  {
    title: "Manage restricted members",
    description: "See all the restricted members",
  },
  {
    title: "Manage following",
    description: "See all the pages your page follows",
  },
  {
    title: "Inbox settings",
    description:
      "Choose whether members can message the page and select conversation topics",
  },
  {
    title: "Manage AI assistant",
    description: "Turn on and manage your Page's AI assistant",
    badge: "New",
    href: ADMIN_AI_ASSISTANT_SETTINGS_HREF,
  },
  {
    title: "Job posting",
    description: "Manage who can post jobs and how jobs are shared on your page",
  },
  {
    title: "Verification controls",
    description:
      "Review or change the ways members can verify their association with your organization",
  },
  {
    title: "Deactivate page",
    description: "Take your page down",
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
    value: "8,920",
    delta: "18.4%",
  },
  {
    label: "Reactions",
    value: "486",
    delta: "12.7%",
  },
  {
    label: "Comments",
    value: "128",
    delta: "9.3%",
  },
  {
    label: "Reposts",
    value: "42",
    delta: "15.6%",
  },
];

const VISITOR_ANALYTICS_DATE_RANGE = "May 11, 2026 - Jun 9, 2026";

const visitorHighlights: ReadonlyArray<VisitorHighlightData> = [
  {
    label: "Page views",
    value: "507",
    delta: "28%",
    tone: "positive",
  },
  {
    label: "Unique visitors",
    value: "150",
    delta: "20.2%",
    tone: "negative",
  },
  {
    label: "Custom button clicks",
    value: "0",
    delta: "100%",
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
    count: "211",
    percentage: "41.6",
    barPercent: 100,
  },
  {
    label: "Operations",
    count: "109",
    percentage: "21.5",
    barPercent: 52,
  },
  {
    label: "Information Technology",
    count: "28",
    percentage: "5.5",
    barPercent: 13,
  },
  {
    label: "Product Management",
    count: "23",
    percentage: "4.5",
    barPercent: 11,
  },
  {
    label: "Business Development",
    count: "20",
    percentage: "3.9",
    barPercent: 9,
  },
  {
    label: "Marketing",
    count: "19",
    percentage: "3.7",
    barPercent: 9,
  },
];

const COMPETITOR_ANALYTICS_DATE_RANGE = "May 11, 2026 - Jun 9, 2026";

const competitorHighlights: ReadonlyArray<CompetitorHighlightData> = [
  {
    label: "Comments on posts",
    value: "39",
    delta: "96.8%",
    tone: "negative",
    context: "vs competitors",
  },
  {
    label: "New followers",
    value: "11",
    delta: "100%",
    tone: "negative",
    context: "vs competitors",
  },
];

const competitorGrowthRows: ReadonlyArray<CompetitorGrowthRowData> = [
  {
    rank: 1,
    company: pcpCompetitorNames[0],
    followers: "64,280 followers",
    newFollowers: { value: "82", delta: "24%", tone: "positive" },
    posts: { value: "22", delta: "83.3%", tone: "positive" },
    comments: { value: "146", delta: "18.7%", tone: "positive" },
    commentsPerDay: { value: "18", delta: "63.6%", tone: "positive" },
    reactions: { value: "1.8K", delta: "32.4%", tone: "positive" },
  },
  {
    rank: 2,
    company: pcpCompetitorNames[1],
    followers: "42,910 followers",
    newFollowers: { value: "64", delta: "12.5%", tone: "positive" },
    posts: { value: "18", delta: "50%", tone: "positive" },
    comments: { value: "118", delta: "6.8%", tone: "positive" },
    commentsPerDay: { value: "14", delta: "27.3%", tone: "positive" },
    reactions: { value: "1.2K", delta: "18.6%", tone: "positive" },
  },
  {
    rank: 3,
    company: pcpCompetitorNames[2],
    followers: "28,740 followers",
    newFollowers: { value: "41", delta: "7.3%", tone: "positive" },
    posts: { value: "15", delta: "25%", tone: "positive" },
    comments: { value: "74", delta: "28.8%", tone: "negative" },
    commentsPerDay: { value: "7", delta: "36.4%", tone: "negative" },
    reactions: { value: "684", delta: "9.2%", tone: "positive" },
  },
  {
    rank: 4,
    company: pcpCompanyProfile.name,
    followers: pcpCompanyProfile.followers,
    isYou: true,
    newFollowers: { value: "29", delta: "64.6%", tone: "negative" },
    posts: { value: "12", delta: "45.5%", tone: "negative" },
    comments: { value: "39", delta: "73.3%", tone: "negative" },
    commentsPerDay: { value: "11", delta: "38.9%", tone: "negative" },
    reactions: { value: "486", delta: "73%", tone: "negative" },
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
    reactions: "1,284",
    comments: "117 comments - 52 reposts",
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
    reactions: "936",
    comments: "84 comments - 31 reposts",
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
    reactions: "642",
    comments: "48 comments - 18 reposts",
  },
];

const competitiveTips: ReadonlyArray<CompetitiveTipData> = [
  {
    title: "Grow your audience",
    description:
      "Invite relevant HR and benefits leaders who engaged with open enrollment content.",
    action: "Invite to follow",
    icon: "connection-add",
  },
  {
    title: "Drive more engagement",
    description:
      "Post a short carrier-readiness checklist while competitors are publishing deadline content.",
    action: "Start a post",
    icon: "compose",
  },
  {
    title: "Follow peer Pages",
    description:
      "Track similar benefits platforms to spot topics your audience is already responding to.",
    action: "Find Pages to follow",
    icon: "company",
  },
];

const contentEngagementRows: ReadonlyArray<ContentEngagementRowData> = [
  {
    title: "How Arbor prepared 12,000 employees for open enrollment",
    postedBy: pcpAdminPersona.name,
    date: "6/8/2026",
    type: "Article",
    audience: "HR leaders",
    impressions: "1,284",
    views: "184",
    clicks: "46",
  },
  {
    title: "Carrier file readiness checklist for enterprise benefits teams",
    postedBy: "Velora",
    date: "6/6/2026",
    type: "Document",
    audience: "Benefits teams",
    impressions: "986",
    views: "132",
    clicks: "31",
  },
  {
    title: "What breaks first when benefits teams migrate mid-year?",
    postedBy: pcpAdminPersona.name,
    date: "6/3/2026",
    type: "Image",
    audience: "People leaders",
    impressions: "812",
    views: "-",
    clicks: "34",
  },
  {
    title: "Eligibility cleanup should not require five spreadsheets",
    postedBy: "Velora",
    date: "5/30/2026",
    type: "Text",
    audience: "HR operations",
    impressions: "654",
    views: "-",
    clicks: "18",
  },
];

const visitorAnalyticsInsightCards: ReadonlyArray<AnalyticsInsightCardData> = [
  {
    dismissLabel: "Dismiss audience insight",
    evidence:
      "64% of people who viewed your Page work in HR, benefits, or people operations.",
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
    evidence: "82 new followers this month vs. Velora's 29.",
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${ASSET_ROOT}/${path}`;
}

function PremiumMark({ label }: Readonly<{ label?: string }>) {
  return <PremiumChipSmall label={label} />;
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
  withPremiumIcon = false,
}: Readonly<{
  items: ReadonlyArray<string | { label: string; icon?: IconName }>;
  activeItem?: string;
  withPremiumIcon?: boolean;
}>) {
  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const icon = typeof item === "string" ? undefined : item.icon;
        const active = activeItem === label;
        const href = railItemHrefs[label];
        const itemClassName = cx(
          "flex min-h-10 w-full items-center gap-sm px-xxl py-sm text-left text-control-sm transition-colors hover:bg-background-transparent-hover",
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
            <Link
              aria-current={active ? "page" : undefined}
              className={itemClassName}
              href={href}
              key={label}
            >
              {itemContent}
            </Link>
          );
        }

        return (
          <button
            key={label}
            className={itemClassName}
            type="button"
          >
            {itemContent}
          </button>
        );
      })}
    </div>
  );
}

function PageRail({ activeItem }: Readonly<{ activeItem: string }>) {
  return (
    <aside className="overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="relative p-lg pt-stack">
        <div
          className="absolute inset-x-0 top-0 h-[96px] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0)), url(${pcpCompanyProfile.coverSrc})`,
          }}
        />
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

      <RailSection activeItem={activeItem} items={primaryRailItems} />
      <div className="mx-xxl my-sm h-px bg-border-faint" />
      <RailSection items={secondaryRailItems} />
      <div className="mx-xxl my-sm h-px bg-border-faint" />
      <RailSection items={premiumRailItems} withPremiumIcon />
    </aside>
  );
}

function AvatarPile() {
  return (
    <div className="flex items-center">
      {["avatar-2.png", "avatar-1.png", "avatar-3.png"].map((avatar, index) => (
        <Entity
          key={avatar}
          className={cx(index > 0 && "-ml-sm", "border border-background")}
          label=""
          size={32}
          src={`${ASSET_ROOT}/${avatar}`}
        />
      ))}
      <span className="-ml-sm inline-flex size-8 items-center justify-center rounded-round border border-border-faint bg-background text-supportive-s text-text-meta">
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
    <article className="min-h-[128px] rounded-xs border border-border-faint bg-background p-md">
      {title === "Who visited your Page" ? <AvatarPile /> : null}
      <p className="mt-xs text-heading-xl text-text">{value}</p>
      <h3 className="text-control-sm text-action">{title}</h3>
      {delta ? (
        <p
          className={cx(
            "mt-xxs flex flex-wrap items-center gap-xxs text-supportive-s",
            deltaTone === "positive" ? "text-positive" : "text-negative",
          )}
        >
          <span>
            {deltaTone === "positive" ? "+ " : "- "}
            {delta}
          </span>
          {deltaMeta ? (
            <span className="text-text-meta">{deltaMeta}</span>
          ) : null}
        </p>
      ) : null}
      {label ? (
        <p className="mt-xxs flex items-center gap-xs text-supportive-s text-text-meta">
          {premium ? <PremiumMark label="Premium" /> : null}
          {label}
        </p>
      ) : null}
    </article>
  );
}

function CarouselControls({
  nextLabel,
  previousLabel,
}: Readonly<{ nextLabel: string; previousLabel: string }>) {
  return (
    <div className="hidden gap-xs sm:flex">
      <ButtonIcon
        disabled
        icon="chevron-left"
        label={previousLabel}
        size="small"
        touchTarget={false}
        variant="tertiary"
      />
      <ButtonIcon
        icon="chevron-right"
        label={nextLabel}
        size="small"
        touchTarget={false}
        variant="tertiary"
      />
    </div>
  );
}

function ReactionSummary({
  comments,
  reactions,
}: Readonly<{ comments: string; reactions: string }>) {
  return (
    <div className="flex items-center gap-xs text-supportive-s text-text-meta">
      <span className="flex items-center" aria-hidden="true">
        <span className="block size-4 rounded-round border border-background bg-action" />
        <span className="-ml-[5px] block size-4 rounded-round border border-background bg-positive" />
        <span className="-ml-[5px] block size-4 rounded-round border border-background bg-caution" />
      </span>
      <span>{reactions}</span>
      <span aria-hidden="true">&middot;</span>
      <span>{comments}</span>
    </div>
  );
}

function PostCard({
  body,
  comments,
  image,
  imageAlt,
  linkMeta,
  linkTitle,
  metric,
  reactions,
}: Readonly<{
  body: string;
  comments: string;
  image: string;
  imageAlt: string;
  linkMeta?: string;
  linkTitle?: string;
  metric: string;
  reactions: string;
}>) {
  return (
    <article className="flex h-[560px] w-[365px] shrink-0 flex-col overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="grid min-h-[72px] grid-cols-[minmax(0,1fr)_auto] items-center gap-md border-b border-border-faint px-md py-sm">
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
      <div className="flex min-h-0 flex-1 flex-col px-md py-lg">
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
            <h3 className="text-control-sm text-text">
              {pcpCompanyProfile.name}
            </h3>
            <p className="text-supportive-s text-text-meta">
              {pcpCompanyProfile.followers}
            </p>
            <p className="text-supportive-s text-text-meta">Timestamp</p>
          </div>
          <Icon className="text-text-meta" name="overflow-web-ios" size="medium" />
        </div>

        <p className="mt-md min-h-[42px] shrink-0 line-clamp-2 text-body-sm text-text">
          {body}
        </p>
        <Image
          alt={imageAlt}
          className="mt-sm h-[220px] w-full shrink-0 object-cover"
          height={386}
          src={`${ASSET_ROOT}/${image}`}
          width={514}
        />
        {linkTitle ? (
          <div className="min-h-[66px] bg-background-neutral-soft px-md py-sm">
            <p className="text-control-sm text-text">{linkTitle}</p>
            {linkMeta ? (
              <p className="text-body-xs text-text-meta">{linkMeta}</p>
            ) : null}
          </div>
        ) : (
          <div className="min-h-[66px]" />
        )}
      </div>
      <div className="mt-auto border-t border-border-faint px-md py-sm">
        <ReactionSummary comments={comments} reactions={reactions} />
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
        <p className="mt-xs text-body-sm text-text-meta">
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
    <div className="rounded-sm border border-ai-border bg-background p-lg shadow-raised-faint">
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
          <h2 className="truncate text-heading-sm text-text">
            {vcaLeadBrief.buyer}
          </h2>
          <p className="truncate text-body-sm text-text-meta">
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
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
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
      <Link className={rowClassName} href={row.href}>
        {rowContent}
      </Link>
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
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
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

type AssistantColorOption = Readonly<{
  id: string;
  label: string;
  value: string;
}>;

type StatusChipTone = "neutral" | "positive";

const assistantColorOptions: ReadonlyArray<AssistantColorOption> = [
  { id: "red", label: "Red", value: "#D11124" },
  { id: "orange", label: "Orange", value: "#F28C28" },
  { id: "yellow", label: "Yellow", value: "#F4B400" },
  { id: "green", label: "Green", value: VELORA_AI_ACCENT },
  { id: "teal", label: "Teal", value: "#00A3A3" },
  { id: "blue", label: "Blue", value: "#0A66C2" },
  { id: "purple", label: "Purple", value: "#8E3FF2" },
  { id: "gray", label: "Gray", value: "#56687A" },
];

const assistantDefaultColor =
  assistantColorOptions.find((option) => option.id === "green") ??
  assistantColorOptions[0];

const defaultAssistantInstructions = `# Velora visitor assistant

- Keep answers concise and professional.
- Use Velora's Page, website, and uploaded files.
- Do not make pricing, legal, or medical commitments.`;

const additionalKnowledgeLinks: ReadonlyArray<string> = [
  "https://help.velora.com/faqs",
  "https://www.velora.com/resources",
  "https://www.velora.com/customers",
];

const defaultKnowledgeLinks: ReadonlyArray<string> = [
  "https://www.velora.com",
  ...additionalKnowledgeLinks,
];

function SettingsDetailHeader() {
  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
      <div className="flex min-h-[72px] items-center gap-md px-lg py-lg sm:px-xxl">
        <Link
          aria-label="Back to Settings"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-round text-icon outline-none transition-colors hover:bg-background-transparent-hover hover:text-icon-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          href={ADMIN_SETTINGS_HREF}
        >
          <Icon name="arrow-left-large" size="medium" />
        </Link>
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
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
      <div className="flex flex-wrap items-start justify-between gap-md px-lg py-xl sm:px-xxl">
        <div className="min-w-0">
          <h2 className="text-heading-lg tracking-normal text-text">{title}</h2>
          {description ? (
            <p className="mt-xxs max-w-[680px] text-body-sm text-text">
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
          <h3 className="text-heading-md tracking-normal text-text">{title}</h3>
          {required ? <StatusChip>Required</StatusChip> : null}
        </div>
        {description ? (
          <p className="mt-xxs max-w-[620px] text-body-sm text-text">
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
          <h3 className="text-heading-md tracking-normal text-text">
            Knowledge sources
          </h3>
          <p className="mt-xxs max-w-[620px] text-body-sm text-text">
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
          <h3 className="text-heading-md tracking-normal text-text">
            Assistant instructions
          </h3>
          <p className="mt-xxs max-w-[620px] text-body-sm text-text">
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

function AdminAssistantColorPreview({
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
        label="Admin assistant color preview"
        position="static"
        variant="admin"
      />
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
  const [adminSelectedColor, setAdminSelectedColor] =
    useState(assistantDefaultColor);
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
    <div className="min-w-0 space-y-md">
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

            <SetupRow title="Pick color">
              <div className="flex flex-col items-start gap-md">
                <VisitorAssistantFabPreview color={visitorSelectedColor} />
                <AssistantColorPicker
                  selectedColor={visitorSelectedColor}
                  onSelect={setVisitorSelectedColor}
                />
              </div>
            </SetupRow>
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
      >
        <SetupRow title="Pick color">
          <div className="flex flex-col items-start gap-md">
            <AdminAssistantColorPreview color={adminSelectedColor} />
            <AssistantColorPicker
              selectedColor={adminSelectedColor}
              onSelect={setAdminSelectedColor}
            />
          </div>
        </SetupRow>
      </SettingsCard>
    </div>
  );
}

function VisitorAssistantAvailabilityBanner({
  onDismiss,
}: Readonly<{
  onDismiss: () => void;
}>) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
      <GhostIconButton
        className="absolute right-sm top-sm text-icon"
        horizontalPadding={false}
        icon="close"
        label="Dismiss visitor assistant setup banner"
        onClick={onDismiss}
        touchTarget={false}
      />
      <div className="flex flex-col gap-lg px-lg py-xl pr-stack sm:flex-row sm:items-center sm:justify-between sm:px-xxl sm:pr-[72px]">
        <div className="min-w-0">
          <NewFeatureTag />
          <h2 className="mt-xs text-heading-lg tracking-normal text-text">
            AI assistant is now available for your Page
          </h2>
          <p className="mt-xs max-w-[620px] text-body-sm text-text">
            Help visitors get instant answers from approved Velora content you
            control. <InlineAction>Learn more</InlineAction>
          </p>
        </div>
        <Link
          className={getButtonClassName({
            className: "self-start sm:self-center",
            size: "small",
          })}
          href={ADMIN_AI_ASSISTANT_SETTINGS_HREF}
        >
          Set up
        </Link>
      </div>
    </section>
  );
}

function DashboardContent({
  activeInsightId,
  onDigestInsightSelect,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onDigestInsightSelect: (insight: AdminUc5InsightSelection) => void;
}>) {
  const [
    isVisitorAssistantBannerDismissed,
    setIsVisitorAssistantBannerDismissed,
  ] = useState(false);

  return (
    <div className="min-w-0 space-y-md">
      {!isVisitorAssistantBannerDismissed ? (
        <VisitorAssistantAvailabilityBanner
          onDismiss={() => setIsVisitorAssistantBannerDismissed(true)}
        />
      ) : null}

      <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
        <div className="bg-gradient-to-r from-premium-gradient-base-a via-premium-gradient-base-b to-background px-lg pb-[28px] pt-[40px] sm:px-xxl">
          <h1 className="text-display-md text-text">
            Welcome back, {pcpAdminPersona.firstName}
          </h1>
          <div className="mt-[40px]">
            <AdminPerformanceDigestCard
              activeInsightId={activeInsightId}
              onInsightSelect={onDigestInsightSelect}
            />
          </div>
        </div>

        <div className="space-y-[40px] px-lg pb-xxl pt-[40px] sm:px-xxl">
          <section>
            <div className="flex items-start justify-between gap-lg">
              <div>
                <h2 className="text-heading-sm text-text">Track performance</h2>
                <p className="mt-xs text-body-sm text-text-meta">
                  Turn Page interest into qualified conversations with weekly
                  visitor and intent insights.
                </p>
              </div>
              <CarouselControls
                nextLabel="Next performance insights"
                previousLabel="Previous performance insights"
              />
            </div>

            <div className="mt-lg grid gap-md sm:grid-cols-2 xl:grid-cols-4">
              {performanceCards.map((card) => (
                <PerformanceCard key={card.title} {...card} />
              ))}
            </div>

            <div className="mt-md flex justify-center gap-md" aria-hidden="true">
              <span className="size-[6px] rounded-round bg-text" />
              <span className="size-[6px] rounded-round border border-border-subtle" />
            </div>
          </section>

          <section>
            <div className="flex items-start justify-between gap-lg">
              <div>
                <h2 className="text-heading-sm text-text">
                  Manage recent posts
                </h2>
                <p className="mt-xs text-body-sm text-text-meta">
                  Manage benefits administration content and amplify
                  top-performing posts with boosting.{" "}
                  <InlineAction>Learn more</InlineAction>
                </p>
              </div>
              <CarouselControls
                nextLabel="Next posts"
                previousLabel="Previous posts"
              />
            </div>

            <div className="mt-lg flex gap-md overflow-hidden">
              {recentPosts.map((post) => (
                <PostCard key={post.body} {...post} />
              ))}
            </div>

            <div className="mt-lg flex justify-center gap-md" aria-hidden="true">
              <span className="size-[6px] rounded-round bg-text" />
              <span className="size-[6px] rounded-round border border-border-subtle" />
              <span className="size-[6px] rounded-round border border-border-subtle" />
              <span className="size-[6px] rounded-round border border-border-subtle" />
              <span className="size-[6px] rounded-round border border-border-subtle" />
              <span className="size-[6px] rounded-round border border-border-subtle" />
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
    <button
      aria-controls={`premium-company-pages-analytics-${tab.id}-panel`}
      aria-selected={active}
      className={cx(
        "flex h-12 shrink-0 items-center border-b-2 px-md text-control-sm outline-none transition-colors focus-visible:ring-4 focus-visible:ring-action-focus-ring",
        active
          ? "border-positive text-positive"
          : "border-transparent text-label hover:text-text",
      )}
      id={`premium-company-pages-analytics-${tab.id}-tab`}
      onClick={() => onSelect(tab.id)}
      role="tab"
      type="button"
    >
      {tab.label}
    </button>
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
        "rounded-sm border border-border-faint bg-background shadow-raised-faint",
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

function HighlightsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div>
          <h2 className="text-heading-sm text-text">Highlights</h2>
          <p className="mt-xxs text-body-sm text-text-meta">
            Data for 5/10/2026 - 6/8/2026
          </p>
        </div>
        <div className="mt-lg grid gap-lg sm:grid-cols-2 lg:grid-cols-4">
          {analyticsHighlights.map((highlight) => (
            <article key={highlight.label}>
              <p className="text-heading-xl text-text">{highlight.value}</p>
              <h3 className="mt-xxs text-body-sm text-text-meta">
                {highlight.label}
              </h3>
              <AnalyticsTrend value={highlight.delta} />
            </article>
          ))}
        </div>
      </div>
    </AnalyticsCard>
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
            className="text-heading-sm text-text"
            id={headingId}
          >
            Key insights
          </h2>
        </div>
        <div className="mt-lg grid gap-md">
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
    <div className="grid min-h-10 grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-sm border-t border-border-faint py-sm">
      <span
        aria-hidden="true"
        className={cx(
          "inline-flex size-5 items-center justify-center rounded-xs",
          dashed ? "border border-dashed border-positive" : "bg-positive text-on-checked",
        )}
      >
        {dashed ? null : <Icon name="check" size="small" />}
      </span>
      <span className="min-w-0 truncate text-body-sm text-text-meta">
        {label}
      </span>
      <span className="text-control-sm text-text">{value}</span>
    </div>
  );
}

function ImpressionsChart() {
  return (
    <div className="mt-lg overflow-x-auto pb-xs">
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
              {[2000, 1500, 1000, 500, 0][index]}
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
            <h2 className="text-heading-sm text-text">Metrics</h2>
            <p className="mt-xs text-body-sm text-text-meta">
              Reach patterns from HR leaders, benefits operators, and enterprise
              people teams.
            </p>
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
          <ChartLegendRow label="Organic" value="8,920" />
          <ChartLegendRow dashed label="Sponsored" value="0" />
        </div>
      </div>
    </AnalyticsCard>
  );
}

function VisitorHighlightsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-sm text-text">Visitor highlights</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <div className="mt-lg grid gap-lg sm:grid-cols-3">
          {visitorHighlights.map((highlight) => (
            <article key={highlight.label}>
              <p className="text-heading-md text-text">{highlight.value}</p>
              <h3 className="mt-xxs text-body-sm text-text-meta">
                {highlight.label}
              </h3>
              <AnalyticsTrend tone={highlight.tone} value={highlight.delta} />
            </article>
          ))}
        </div>
      </div>
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
              {[100, 75, 50, 25, 0][index]}
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
          <h2 className="text-heading-sm text-text">Visitor metrics</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>

        <div className="mt-lg flex flex-wrap gap-sm">
          <VisitorMetricFilterButton active label="Page views" />
          <VisitorMetricFilterButton active label="All pages" />
          <VisitorMetricFilterButton label="All filters" />
        </div>

        <VisitorMetricsChart />

        <div className="mt-lg">
          <VisitorDeviceLegendRow label="Desktop" value="436" />
          <VisitorDeviceLegendRow dashed label="Mobile" value="71" />
        </div>
      </div>
    </AnalyticsCard>
  );
}

function VisitorProfileRow({
  visitor,
}: Readonly<{ visitor: VisitorProfileData }>) {
  return (
    <article className="grid grid-cols-[40px_minmax(0,1fr)] gap-md border-t border-border-faint px-lg py-lg first:border-t-0">
      <Entity
        label={visitor.name}
        size={40}
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
      <div className="px-lg py-md">
        <PremiumMark label="Premium" />
        <div className="mt-xs flex items-center gap-xs">
          <h2 className="text-heading-sm text-text">
            Who&apos;s visited your Page
          </h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <p className="mt-xxs text-body-sm text-text-meta">
          See one new page visitor each day.
        </p>
      </div>

      <div>
        {visitorProfiles.map((visitor) => (
          <VisitorProfileRow key={visitor.name} visitor={visitor} />
        ))}
      </div>

      <div className="border-t border-border-faint px-lg py-md text-center">
        <button
          className="inline-flex items-center gap-xs text-control-sm text-label transition-colors hover:text-action hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          type="button"
        >
          <span>Show all visitors</span>
          <Icon aria-hidden="true" name="arrow-right" size="small" />
        </button>
      </div>
    </AnalyticsCard>
  );
}

function VisitorDemographicsCard() {
  return (
    <AnalyticsCard className="overflow-hidden">
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-sm text-text">Visitor demographics</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <button
          className="mt-lg inline-flex min-h-8 items-center gap-xs rounded-round border border-border-subtle bg-background px-md text-control-sm text-label outline-none transition-colors hover:border-border-subtle-hover hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          type="button"
        >
          <span>Job function</span>
          <Icon aria-hidden="true" name="chevron-down" size="small" />
        </button>

        <div className="mt-lg space-y-lg">
          {visitorDemographics.map((row) => (
            <div className="space-y-xs" key={row.label}>
              <p className="text-supportive-s-strong text-text">
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
        <button
          className="inline-flex items-center gap-xs text-control-sm text-label transition-colors hover:text-action hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          type="button"
        >
          <span>Show all</span>
          <Icon aria-hidden="true" name="arrow-right" size="small" />
        </button>
      </div>
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
      <div className="px-lg py-md">
        <PremiumMark label="Premium" />
        <h2 className="mt-xs text-heading-sm text-text">
          Learn from other Pages
        </h2>
        <p className="mt-xxs text-body-sm text-text-meta">
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
  return (
    <AnalyticsCard>
      <div className="grid min-h-[72px] grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-md px-lg py-md">
        <span className="inline-flex size-10 items-center justify-center rounded-xs bg-surface-tint text-action">
          <Icon aria-hidden="true" name="document-search" size="medium" />
        </span>
        <div className="min-w-0">
          <h2 className="text-control-sm text-text">
            Start tracking and benchmarking your Page&apos;s performance
          </h2>
          <p className="mt-xxs text-body-sm text-text-meta">
            Edit your competitors list to track specific Pages on LinkedIn.{" "}
            <span className="font-semibold text-action">Learn more</span>
          </p>
        </div>
        <ButtonIcon
          icon="close"
          label="Dismiss competitor tracking notice"
          size="small"
          touchTarget={false}
          variant="tertiary"
        />
      </div>
    </AnalyticsCard>
  );
}

function CompetitorHighlightsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-sm text-text">Competitor highlights</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <p className="mt-xxs text-body-sm text-text-meta">Last 30 days</p>
        <div className="mt-lg grid gap-lg sm:grid-cols-2">
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

function CompetitorGrowthTable() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-sm text-text">Compare growth</h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <p className="mt-xxs text-body-sm text-text-meta">Last 30 days</p>
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

function TrendingCompetitorPostsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <div className="flex items-center gap-xs">
          <h2 className="text-heading-sm text-text">
            Trending competitor posts
          </h2>
          <Icon
            aria-hidden="true"
            className="text-text-meta"
            name="question"
            size="small"
          />
        </div>
        <p className="mt-xxs text-body-sm text-text-meta">Last 30 days</p>
        <div className="mt-lg grid gap-md">
          {competitorPosts.map((post) => (
            <CompetitorPostCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}

function CompetitiveTipCard({
  tip,
}: Readonly<{
  tip: CompetitiveTipData;
}>) {
  return (
    <article className="grid min-h-[104px] grid-cols-[minmax(0,1fr)_56px] items-center gap-md rounded-xs border border-border-faint p-md">
      <div className="min-w-0">
        <h3 className="text-control-sm text-text">{tip.title}</h3>
        <p className="mt-xxs text-body-sm text-text-meta">{tip.description}</p>
        <Button className="mt-sm" size="small" variant="secondary">
          {tip.action}
        </Button>
      </div>
      <span className="inline-flex size-14 items-center justify-center justify-self-end rounded-xs bg-surface-tint text-action">
        <Icon aria-hidden="true" name={tip.icon} size="medium" />
      </span>
    </article>
  );
}

function CompetitiveTipsCard() {
  return (
    <AnalyticsCard>
      <div className="px-lg py-lg">
        <h2 className="text-heading-sm text-text">Tips to stay competitive</h2>
        <div className="mt-lg grid gap-md">
          {competitiveTips.map((tip) => (
            <CompetitiveTipCard key={tip.title} tip={tip} />
          ))}
        </div>
      </div>
    </AnalyticsCard>
  );
}

function ContentEngagementTable() {
  return (
    <AnalyticsCard>
      <div className="flex flex-wrap items-center justify-between gap-md px-lg py-md">
        <div>
          <h2 className="text-heading-sm text-text">Content engagement</h2>
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
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border-faint bg-background-neutral-soft text-label-xs text-text-meta">
              <th className="px-lg py-sm font-semibold">Post title</th>
              <th className="px-md py-sm font-semibold">Post type</th>
              <th className="px-md py-sm font-semibold">Audience</th>
              <th className="px-md py-sm text-right font-semibold">
                Impressions
              </th>
              <th className="px-md py-sm text-right font-semibold">Views</th>
              <th className="px-lg py-sm text-right font-semibold">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {contentEngagementRows.map((row) => (
              <tr
                className="border-b border-border-faint align-top text-body-sm text-text"
                key={row.title}
              >
                <td className="max-w-[340px] px-lg py-md">
                  <button
                    className="line-clamp-2 text-left text-control-sm text-action hover:underline"
                    type="button"
                  >
                    {row.title}
                  </button>
                  <p className="mt-xs text-body-xs text-text-meta">
                    Posted by {row.postedBy} &middot; {row.date}
                  </p>
                </td>
                <td className="px-md py-md">{row.type}</td>
                <td className="max-w-[180px] px-md py-md text-text-meta">
                  {row.audience}
                </td>
                <td className="px-md py-md text-right">{row.impressions}</td>
                <td className="px-md py-md text-right">{row.views}</td>
                <td className="px-lg py-md text-right">{row.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AnalyticsCard>
  );
}

function ContentAnalyticsPanel({
  activeInsightId,
  onInsightSelect,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
}>) {
  return (
    <div
      aria-labelledby="premium-company-pages-analytics-content-tab"
      className="space-y-md"
      id="premium-company-pages-analytics-content-panel"
      role="tabpanel"
    >
      <AnalyticsKeyInsightsCard
        activeInsightId={activeInsightId}
        insights={contentAnalyticsInsightCards}
        onInsightSelect={onInsightSelect}
        sectionId="analytics-content-ai-insights"
      />
      <AnalyticsControlsCard />
      <HighlightsCard />
      <MetricsCard />
      <ContentEngagementTable />
    </div>
  );
}

function VisitorAnalyticsPanel({
  activeInsightId,
  onInsightSelect,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
}>) {
  return (
    <div
      aria-labelledby="premium-company-pages-analytics-visitors-tab"
      className="space-y-md"
      id="premium-company-pages-analytics-visitors-panel"
      role="tabpanel"
    >
      <AnalyticsKeyInsightsCard
        activeInsightId={activeInsightId}
        insights={visitorAnalyticsInsightCards}
        onInsightSelect={onInsightSelect}
        sectionId="analytics-visitors-ai-insights"
      />
      <AnalyticsControlsCard dateRange={VISITOR_ANALYTICS_DATE_RANGE} />
      <VisitorHighlightsCard />
      <VisitorMetricsCard />
      <WhoVisitedYourPageCard />
      <VisitorDemographicsCard />
    </div>
  );
}

function CompetitorAnalyticsPanel({
  activeInsightId,
  onInsightSelect,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
}>) {
  return (
    <div
      aria-labelledby="premium-company-pages-analytics-competitors-tab"
      className="space-y-md"
      id="premium-company-pages-analytics-competitors-panel"
      role="tabpanel"
    >
      <AnalyticsKeyInsightsCard
        activeInsightId={activeInsightId}
        insights={competitorAnalyticsInsightCards}
        onInsightSelect={onInsightSelect}
        sectionId="analytics-competitors-ai-insights"
      />
      <CompetitorIntroCard />
      <CompetitorTrackingNoticeCard />
      <CompetitorHighlightsCard />
      <CompetitorGrowthTable />
      <TrendingCompetitorPostsCard />
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
      className="min-h-[520px] rounded-sm border border-border-faint bg-background shadow-raised-faint"
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
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
}>) {
  const [activeTabId, setActiveTabId] = useState<AnalyticsTabId>("content");
  const activeTab =
    analyticsTabs.find((tab) => tab.id === activeTabId) ?? analyticsTabs[0];

  return (
    <div className="min-w-0 space-y-md">
      <section className="overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
        <div className="px-lg pt-lg">
          <h1 className="text-heading-lg text-text">Analytics</h1>
        </div>
        <div
          aria-label="Analytics sections"
          className="mt-sm flex overflow-x-auto px-sm"
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
        />
      ) : activeTabId === "visitors" ? (
        <VisitorAnalyticsPanel
          activeInsightId={activeInsightId}
          onInsightSelect={onInsightSelect}
        />
      ) : activeTabId === "competitors" ? (
        <CompetitorAnalyticsPanel
          activeInsightId={activeInsightId}
          onInsightSelect={onInsightSelect}
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
}: Readonly<{
  activeItem: string;
  children: ReactNode;
}>) {
  return (
    <main className="min-h-dvh bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation profileSrc={pcpAdminPersona.avatarSrc} />
      <div className="mx-auto grid w-full max-w-[1145px] gap-lg px-lg pb-[112px] pt-xxl lg:grid-cols-[225px_minmax(0,888px)] lg:gap-[32px] lg:px-0 lg:py-xxl">
        <PageRail activeItem={activeItem} />
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
  }) => ReactNode;
  initialAgentOpen?: boolean;
  turnIdPrefix: string;
}>;

function AdminVcaFabEntry({
  chatPanelId,
  onOpen,
  onPromptSelect,
  style,
}: Readonly<{
  chatPanelId: string;
  onOpen: () => void;
  onPromptSelect: (view: AdminUc5SelfInitiatedView) => void;
  style: CSSProperties;
}>) {
  return (
    <div
      className="pcp-ai-messaging-surface group fixed bottom-6 right-6 z-50 md:bottom-[var(--pcp-admin-ai-fab-bottom)]"
      style={style}
    >
      <div className="pointer-events-none absolute bottom-full right-0 hidden translate-y-xs flex-col items-end gap-sm pb-sm opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:flex">
        {ADMIN_UC5_SELF_INITIATED_PROMPTS.map((item) => (
          <Prompt
            className="w-max max-w-[calc(100vw-3rem)] self-end shadow-raised-faint [&>span]:whitespace-nowrap [&>span]:break-normal"
            key={item.id}
            onPromptSelect={() => onPromptSelect(item.id)}
            prompt={item.prompt}
          />
        ))}
      </div>
      <VcaFab
        accentColor={VELORA_AI_ACCENT}
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
  turnIdPrefix,
}: PremiumCompanyPagesAdminVcaShellProps) {
  const agentPanelId = useId();
  const nextTurnIdRef = useRef(0);
  const [isAgentOpen, setIsAgentOpen] = useState(initialAgentOpen);
  const [agentPanelVariant, setAgentPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [activeInsight, setActiveInsight] =
    useState<AdminUc5InsightSelection | null>(null);
  const [initialSelfInitiatedView, setInitialSelfInitiatedView] =
    useState<AdminUc5SelfInitiatedView | null>(null);
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
    const viewTransitionDocument = document as ViewTransitionDocument;

    if (typeof viewTransitionDocument.startViewTransition !== "function") {
      updateSurfaceState();
      return;
    }

    const transitionClassName = "pcp-messaging-surface-transition";

    document.documentElement.classList.add(transitionClassName);

    const transition = viewTransitionDocument.startViewTransition(() => {
      flushSync(updateSurfaceState);
    });

    void transition.finished.finally(() => {
      document.documentElement.classList.remove(transitionClassName);
    });
  }

  function handleInsightSelect(insight: AdminUc5InsightSelection) {
    runAdminMessagingSurfaceTransition(() => {
      setActiveInsight(insight);
      setInitialSelfInitiatedView(null);
      setAgentThreadTurns([]);
      setAgentDraft("");
      setAgentPanelVariant("collapsed");
      setIsAgentOpen(true);
    });
  }

  function handleOpenAgentFromFab() {
    runAdminMessagingSurfaceTransition(() => {
      setActiveInsight(null);
      setInitialSelfInitiatedView(null);
      setAgentThreadTurns([]);
      setAgentDraft("");
      setAgentPanelVariant("collapsed");
      setIsAgentOpen(true);
    });
  }

  function handleOpenSelfInitiatedView(view: AdminUc5SelfInitiatedView) {
    runAdminMessagingSurfaceTransition(() => {
      setActiveInsight(null);
      setInitialSelfInitiatedView(view);
      setAgentThreadTurns([]);
      setAgentDraft("");
      setAgentPanelVariant("collapsed");
      setIsAgentOpen(true);
    });
  }

  function handleCloseAgent() {
    runAdminMessagingSurfaceTransition(() => {
      setIsAgentOpen(false);
      setAgentPanelVariant("collapsed");
      setAgentDraft("");
      setInitialSelfInitiatedView(null);
    });
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

  function handleAgentFollowUpSelect(followUp: AdminUc5FollowUp) {
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

  return (
    <>
      <PremiumCompanyPagesAdminShell activeItem={activeItem}>
        {children({
          activeInsightId: isAgentOpen ? activeInsight?.id ?? null : null,
          onInsightSelect: handleInsightSelect,
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

      {!isAgentOpen ? (
        <AdminVcaFabEntry
          chatPanelId={agentPanelId}
          onOpen={handleOpenAgentFromFab}
          onPromptSelect={handleOpenSelfInitiatedView}
          style={agentFabStyle}
        />
      ) : null}

      {isAgentOpen ? (
        <>
          <button
            aria-label="Collapse expanded Velora AI"
            className={cx(
              "fixed inset-0 z-30 hidden bg-overlay-dim md:block",
              !isAgentExpanded && "pointer-events-none opacity-0",
            )}
            onClick={handleCollapseAgentPanel}
            type="button"
          />
          <div
            className={cx(
              "pcp-ai-messaging-surface fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)]",
              agentPanelPositionClass,
            )}
            role="dialog"
            aria-label="Velora AI"
          >
            <AdminUc5AgentPanel
              activeInsight={activeInsight}
              draft={agentDraft}
              initialSelfInitiatedView={initialSelfInitiatedView}
              panelId={agentPanelId}
              threadTurns={agentThreadTurns}
              variant={agentPanelVariant}
              onClose={handleCloseAgent}
              onDraftChange={handleAgentDraftChange}
              onFollowUpSelect={handleAgentFollowUpSelect}
              onSend={handleAgentSend}
              onVariantToggle={handleToggleAgentPanelVariant}
            />
          </div>
        </>
      ) : null}
    </>
  );
}

type PremiumCompanyPagesPageProps = Readonly<{
  initialAgentOpen?: boolean;
}>;

export function PremiumCompanyPagesPage({
  initialAgentOpen = false,
}: PremiumCompanyPagesPageProps) {
  return (
    <PremiumCompanyPagesAdminVcaShell
      activeItem="Dashboard"
      initialAgentOpen={initialAgentOpen}
      turnIdPrefix="admin-uc5-turn"
    >
      {({ activeInsightId, onInsightSelect }) => (
        <DashboardContent
          activeInsightId={activeInsightId}
          onDigestInsightSelect={onInsightSelect}
        />
      )}
    </PremiumCompanyPagesAdminVcaShell>
  );
}

export function PremiumCompanyPagesAdminInboxPage() {
  return (
    <PremiumCompanyPagesAdminVcaShell
      activeItem="Inbox"
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
      turnIdPrefix="admin-ai-assistant-settings-turn"
    >
      {() => <AiAssistantSettingsPlaceholderContent />}
    </PremiumCompanyPagesAdminVcaShell>
  );
}

export function PremiumCompanyPagesAdminAnalyticsPage() {
  return (
    <PremiumCompanyPagesAdminVcaShell
      activeItem="Analytics"
      turnIdPrefix="admin-analytics-turn"
    >
      {({ activeInsightId, onInsightSelect }) => (
        <AnalyticsContent
          activeInsightId={activeInsightId}
          onInsightSelect={onInsightSelect}
        />
      )}
    </PremiumCompanyPagesAdminVcaShell>
  );
}
