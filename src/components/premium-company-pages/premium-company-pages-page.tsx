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

import { Prompt, type ChatPanelVariant } from "@/components/chat";
import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import { Pill } from "@/components/primitives/pill";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";
import { TextArea } from "@/components/primitives/text-area";

import {
  PCP_ASSET_ROOT,
  pcpAdminPersona,
  pcpAdminScenario,
  pcpCompanyProfile,
  pcpProofSnippets,
  pcpVcaScenario,
  pcpVisitorPersona,
} from "./persona";
import { GlobalInboxTray } from "./global-inbox-tray";
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
} from "./premium-company-pages-admin-uc5-data";
import { VcaFab } from "./vca-fab";

const ASSET_ROOT = PCP_ASSET_ROOT;
const ADMIN_DASHBOARD_HREF = "/premium-company-pages/admin";
const ADMIN_ANALYTICS_HREF = "/premium-company-pages/admin/analytics";
const ADMIN_INBOX_HREF = "/premium-company-pages/admin/inbox";
const VELORA_AI_ACCENT = "#2AA986";

type AdminAiIconMarkStyle = CSSProperties & {
  "--pcp-admin-ai-accent": string;
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

type AnalyticsTabId =
  | "content"
  | "visitors"
  | "followers"
  | "search-appearances"
  | "competitors"
  | "leads"
  | "newsletters";

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
  insightId: AdminUc5InsightId;
  icon: IconName;
  title: string;
  detail: string;
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
  signals: "Asked whether Velora can support a mid-year migration before open enrollment",
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
    topic: "Benefits migration evaluation",
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

const analyticsInsightCards: ReadonlyArray<AnalyticsInsightCardData> = [
  {
    insightId: "visitor-demographics",
    icon: "people",
    title: "Right audience is engaging",
    detail: "68% of engaged visitors are HR Director+.",
  },
  {
    insightId: "content-engagement",
    icon: "popular-content",
    title: "High-engagement post needs reach",
    detail: "The Arbor proof is working, but impressions are modest.",
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
          Benefits migration evaluation
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

function DashboardContent({
  activeInsightId,
  onDigestInsightSelect,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onDigestInsightSelect: (insightId: AdminUc5InsightId) => void;
}>) {
  return (
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
                Turn Page interest into qualified conversations with weekly visitor
                and intent insights.
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
              <h2 className="text-heading-sm text-text">Manage recent posts</h2>
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

function AnalyticsTrend({ value }: Readonly<{ value: string }>) {
  return (
    <span className="mt-xs inline-flex items-center gap-xxs text-supportive-s-strong text-positive">
      <Icon aria-hidden="true" name="caret-up" size="small" />
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

function AnalyticsControlsCard() {
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
          <span className="min-w-0 truncate">
            May 10, 2026 - Jun 8, 2026
          </span>
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

function HighlightsCard({
  activeInsightId,
  onInsightSelect,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insightId: AdminUc5InsightId) => void;
}>) {
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
        <AnalyticsInsightsSection
          activeInsightId={activeInsightId}
          onInsightSelect={onInsightSelect}
        />
      </div>
    </AnalyticsCard>
  );
}

function AnalyticsInsightCard({
  active,
  insight,
  onSelect,
}: Readonly<{
  active: boolean;
  insight: AnalyticsInsightCardData;
  onSelect: (insightId: AdminUc5InsightId) => void;
}>) {
  return (
    <button
      aria-pressed={active}
      className={cx(
        "group grid min-h-[78px] w-full grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-md rounded-xs border bg-background px-lg py-md text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring",
        active
          ? "border-action bg-surface-tint shadow-[inset_4px_0_0_var(--color-action)]"
          : "border-border-faint",
      )}
      onClick={() => onSelect(insight.insightId)}
      type="button"
    >
      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-round bg-ai-background-soft text-ai-icon">
        <Icon aria-hidden="true" name={insight.icon} size="medium" />
      </span>
      <span className="min-w-0 py-xxs">
        <span className="block text-control-sm text-text">
          {insight.title}
        </span>
        <span className="mt-xs block text-body-sm text-text-meta">
          {insight.detail}
        </span>
      </span>
      <AdminAiIconMark selected={active} />
    </button>
  );
}

function AdminAiIconMark({ selected = false }: Readonly<{ selected?: boolean }>) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none inline-flex size-8 shrink-0 items-center justify-center justify-self-end rounded-sm border-[1.5px] border-[color:var(--pcp-admin-ai-accent)] bg-background text-[color:var(--pcp-admin-ai-accent)] transition-[background-color,box-shadow] duration-150 ease-out",
        selected && "bg-background-transparent-active shadow-raised-faint-active",
      )}
      style={
        {
          "--pcp-admin-ai-accent": VELORA_AI_ACCENT,
        } as AdminAiIconMarkStyle
      }
    >
      <Icon
        aria-hidden="true"
        name={selected ? "navigation-signal-ai-active" : "navigation-signal-ai"}
        size="small"
      />
    </span>
  );
}

function AnalyticsInsightsSection({
  activeInsightId,
  onInsightSelect,
}: Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insightId: AdminUc5InsightId) => void;
}>) {
  return (
    <section
      aria-labelledby="analytics-ai-insights-heading"
      className="mt-xxl border-t border-border-faint pt-lg"
    >
      <div className="flex items-center gap-xs text-control-sm text-text">
        <Icon
          aria-hidden="true"
          className="shrink-0 text-premium-inbug"
          name="signal-ai"
          size="small"
        />
        <h2 id="analytics-ai-insights-heading">Key insights</h2>
      </div>
      <div className="mt-lg grid gap-md">
        {analyticsInsightCards.map((insight) => (
          <AnalyticsInsightCard
            active={activeInsightId === insight.insightId}
            insight={insight}
            key={insight.insightId}
            onSelect={onInsightSelect}
          />
        ))}
      </div>
    </section>
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
  onInsightSelect: (insightId: AdminUc5InsightId) => void;
}>) {
  return (
    <div
      aria-labelledby="premium-company-pages-analytics-content-tab"
      className="space-y-md"
      id="premium-company-pages-analytics-content-panel"
      role="tabpanel"
    >
      <AnalyticsControlsCard />
      <HighlightsCard
        activeInsightId={activeInsightId}
        onInsightSelect={onInsightSelect}
      />
      <MetricsCard />
      <ContentEngagementTable />
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
  onInsightSelect: (insightId: AdminUc5InsightId) => void;
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
      <div className="mx-auto grid w-full max-w-[1145px] gap-lg px-lg py-xxl lg:grid-cols-[225px_minmax(0,888px)] lg:gap-[32px] lg:px-0">
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
    onInsightSelect: (insightId: AdminUc5InsightId) => void;
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
      className="group fixed bottom-6 right-6 z-50 md:bottom-[var(--pcp-admin-ai-fab-bottom)]"
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
  const [activeInsightId, setActiveInsightId] =
    useState<AdminUc5InsightId | null>(null);
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

  function handleInsightSelect(insightId: AdminUc5InsightId) {
    setActiveInsightId(insightId);
    setInitialSelfInitiatedView(null);
    setAgentThreadTurns([]);
    setAgentDraft("");
    setAgentPanelVariant("collapsed");
    setIsAgentOpen(true);
  }

  function handleOpenAgentFromFab() {
    setActiveInsightId(null);
    setInitialSelfInitiatedView(null);
    setAgentThreadTurns([]);
    setAgentDraft("");
    setAgentPanelVariant("collapsed");
    setIsAgentOpen(true);
  }

  function handleOpenSelfInitiatedView(view: AdminUc5SelfInitiatedView) {
    setActiveInsightId(null);
    setInitialSelfInitiatedView(view);
    setAgentThreadTurns([]);
    setAgentDraft("");
    setAgentPanelVariant("collapsed");
    setIsAgentOpen(true);
  }

  function handleCloseAgent() {
    setIsAgentOpen(false);
    setAgentPanelVariant("collapsed");
    setAgentDraft("");
    setInitialSelfInitiatedView(null);
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
    : "md:inset-auto md:bottom-6 md:right-6 md:h-[min(calc(100dvh_-_96px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]";

  return (
    <>
      <PremiumCompanyPagesAdminShell activeItem={activeItem}>
        {children({
          activeInsightId: isAgentOpen ? activeInsightId : null,
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
            onClick={() => setAgentPanelVariant("collapsed")}
            type="button"
          />
          <div
            className={cx(
              "fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)]",
              agentPanelPositionClass,
            )}
            role="dialog"
            aria-label="Velora AI"
          >
            <AdminUc5AgentPanel
              activeInsightId={activeInsightId}
              draft={agentDraft}
              initialSelfInitiatedView={initialSelfInitiatedView}
              panelId={agentPanelId}
              threadTurns={agentThreadTurns}
              variant={agentPanelVariant}
              onClose={handleCloseAgent}
              onDraftChange={handleAgentDraftChange}
              onFollowUpSelect={handleAgentFollowUpSelect}
              onSend={handleAgentSend}
              onVariantToggle={() =>
                setAgentPanelVariant((currentVariant) =>
                  currentVariant === "expanded" ? "collapsed" : "expanded",
                )
              }
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
    <PremiumCompanyPagesAdminShell activeItem="Inbox">
      <InboxContent />
    </PremiumCompanyPagesAdminShell>
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
