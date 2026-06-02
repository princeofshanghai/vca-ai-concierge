"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";
import { Tag } from "@/components/primitives/tag";
import { TextArea } from "@/components/primitives/text-area";

import {
  PCP_ASSET_ROOT,
  pcpCompanyProfile,
} from "./persona";

const ASSET_ROOT = PCP_ASSET_ROOT;
const ADMIN_DASHBOARD_HREF = "/premium-company-pages/admin";
const ADMIN_INBOX_HREF = "/premium-company-pages/admin/inbox";

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
    title: "High-intent messages",
    value: "6",
    label: "Premium insight",
    premium: true,
  },
];

const recentPosts = [
  {
    body: "What happens when a client pays late but contractors still need to be paid? Conditional payment schedules can keep expectations clear before the invoice is overdue.",
    metric: "Get up to 12K more impressions by boosting",
    image: "post-building-blue.png",
    imageAlt: "",
    linkTitle: "What late client payments do to contractor trust",
    linkMeta: "veloracloud.com",
    reactions: "152",
    comments: "18 Comments",
  },
  {
    body: "Before and after: replacing a contractor payment spreadsheet with one shared view of client invoices, approvals, and payout timing.",
    metric: "Get up to 9K more impressions by boosting",
    image: "post-kudos.png",
    imageAlt: "",
    linkTitle: "Agency ops win",
    linkMeta: "Studio Northline team",
    reactions: "860",
    comments: "42 Comments",
  },
  {
    body: "A short operating question for agency owners: which contractor payout becomes risky if this client invoice is five days late?",
    metric: "Get up to 7K more impressions by boosting",
    image: "feed-post-content.png",
    imageAlt: "",
    reactions: "240",
    comments: "12 Comments",
  },
];

const vcaLeadBrief = {
  buyer: "Cheri Sparks",
  role: "Founder & Creative Director at Brightframe Studio",
  avatar: "member/avatar-2.png",
  companyContext: "8-person creative production agency",
  need: "Client payment delays are creating contractor payout uncertainty",
  signals:
    "Asked what happens to contractor payments when a client pays late",
  proofShown: "Studio Northline late-payment case study",
  outcome: "Sent Ning a drafted message through Velora",
  sentMessage:
    "Hi Ning - I run a small creative agency with rotating contractors and I'm dealing with late client payments that cascade into late contractor payments. Velora's conditional payment scheduling sounds like exactly what I need. Would love to learn more about how it works for an agency our size.",
  intentSummary:
    "She asked how late client payments affect contractor payouts, viewed the Studio Northline case study, and sent a drafted message to Ning.",
  intentTags: [
    "8-person agency",
    "Late client payment pain",
    "Multi-project payout interest",
    "Evaluated just now",
  ],
  suggestedReply:
    "Hi Cheri - thanks for reaching out. I founded Velora for exactly this kind of agency payment workflow. You can tie contractor payouts to each client's payment status, so if one client pays late, only the contractors on that project move into a pending state. Happy to walk through how this would work for Brightframe.",
  suggestedPrep: [
    "Lead with how Velora keeps late client payments from making contractor payouts feel ambiguous.",
    "Explain conditional payment scheduling in plain language.",
    "Ask how Brightframe tracks contractor obligations across client projects today.",
  ],
};

const inboxThreads: ReadonlyArray<InboxThreadData> = [
  {
    name: vcaLeadBrief.buyer,
    role: vcaLeadBrief.role,
    topic: "Late contractor payments",
    snippet:
      "Cheri: Hi Ning - I run a small creative agency with rotating contractors...",
    timestamp: "4:48 PM",
    avatar: vcaLeadBrief.avatar,
    selected: true,
    vca: true,
  },
  {
    name: "Maya Patel",
    role: "Managing Partner at Studio Northline",
    topic: "Services",
    snippet: "Ning: Glad the approval view helped your team.",
    timestamp: "4:44 PM",
    avatar: "avatar-1.png",
  },
  {
    name: "Priya Shah",
    role: "Founder at North Pier Studio",
    topic: "Other",
    snippet: "Priya: Does Velora support QuickBooks exports?",
    timestamp: "May 31",
    avatar: "avatar-3.png",
  },
  {
    name: "Luis Romero",
    role: "Operations Lead at Grove Creative",
    topic: "Service request",
    snippet: "Luis: We need a clearer way to track client approval status...",
    timestamp: "May 21",
    avatar: "avatar-2.png",
  },
  {
    name: "Diana Lin",
    role: "Agency Owner at Lin Studio",
    topic: "Careers",
    snippet: "Diana: Are you hiring for customer operations roles?",
    timestamp: "Mar 30",
    avatar: "avatar-1.png",
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
            className="border-2 border-white"
            label={pcpCompanyProfile.name}
            shape="square"
            size={80}
            src={pcpCompanyProfile.logoSrc}
            style={{ height: 72, width: 72 }}
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

function ActionCard({
  title,
  body,
  premium,
  action,
}: Readonly<{
  title: string;
  body: string;
  premium?: boolean;
  action?: string;
}>) {
  return (
    <article className="flex min-h-[72px] items-start gap-sm rounded-xs border border-border-faint bg-background px-lg py-md">
      <div className="mt-[3px]">
        {premium ? (
          <PremiumMark label="Premium" />
        ) : (
          <span className="block size-3 rounded-xs bg-border-faint" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {premium ? (
          <p className="text-supportive-s text-text-meta">Premium</p>
        ) : null}
        <h3 className="text-control-sm text-text">{title}</h3>
        <p className="text-body-xs text-text-meta">
          {body}
          {action ? (
            <>
              {" "}
              <InlineAction>{action}</InlineAction>
            </>
          ) : null}
        </p>
      </div>
      <GhostIconButton
        className="-mr-xs text-text-meta"
        horizontalPadding={false}
        icon="close"
        label={`Dismiss ${title}`}
        touchTarget={false}
      />
    </article>
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
  deltaTone,
  label,
  premium,
}: PerformanceCardData) {
  return (
    <article className="min-h-[105px] rounded-xs border border-border-faint bg-background p-md">
      {title === "Who visited your Page" ? <AvatarPile /> : null}
      <p className="mt-xs text-heading-xl text-text">{value}</p>
      <h3 className="text-control-sm text-action">{title}</h3>
      {delta ? (
        <p
          className={cx(
            "mt-xxs text-supportive-s",
            deltaTone === "positive" ? "text-positive" : "text-negative",
          )}
        >
          {deltaTone === "positive" ? "+" : "-"} {delta}
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
    <article className="w-[365px] shrink-0 overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="flex min-h-[62px] items-center justify-between gap-md border-b border-border-faint px-md py-sm">
        <span className="inline-flex max-w-[190px] items-center gap-xs text-supportive-s-strong text-text">
          {metric}
          <Icon className="shrink-0 text-text-meta" name="question" size="small" />
        </span>
        <Button size="small" variant="secondary">
          Boost
        </Button>
      </div>
      <div className="px-md py-lg">
        <div className="flex items-start gap-sm">
          <Entity
            label={pcpCompanyProfile.name}
            shape="square"
            size={40}
            src={pcpCompanyProfile.logoSrc}
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

        <p className="mt-md line-clamp-2 text-body-sm text-text">{body}</p>
        <Image
          alt={imageAlt}
          className="mt-sm h-[220px] w-full object-cover"
          height={386}
          src={`${ASSET_ROOT}/${image}`}
          width={514}
        />
        {linkTitle ? (
          <div className="bg-background-neutral-soft px-md py-sm">
            <p className="text-control-sm text-text">{linkTitle}</p>
            {linkMeta ? (
              <p className="text-body-xs text-text-meta">{linkMeta}</p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="border-t border-border-faint px-md py-sm">
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
          Founder & Creative Director at Brightframe Studio
        </p>
        <p className="mt-xs text-body-sm text-text-meta">Late contractor payments</p>
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

      <div className="mt-md flex flex-wrap gap-xs">
        {vcaLeadBrief.intentTags.map((tag) => (
          <Tag key={tag} size="small" tone="default">
            {tag}
          </Tag>
        ))}
      </div>
      <p className="mt-sm text-body-xs text-text-meta">
        Summary only. The full visitor-side AI conversation is not shown.
      </p>
    </div>
  );
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

function DashboardContent() {
  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
      <div className="bg-gradient-to-r from-premium-gradient-base-a via-premium-gradient-base-b to-background px-lg pb-[28px] pt-[40px] sm:px-xxl">
        <h1 className="text-display-md text-text">
          Welcome back, {pcpCompanyProfile.name}
        </h1>
        <div className="mt-[40px]">
          <h2 className="text-heading-sm text-text">Today&apos;s actions</h2>
          <p className="mt-xxs text-body-sm text-text-meta">
            Pages that complete these actions regularly grow 4x faster.
          </p>
        </div>
        <div className="mt-xxl space-y-md">
          <ActionCard
            action="Enable"
            premium
            title="Turn on Auto-Invite to grow new followers 6.7x faster"
            body="Automatically invite post-engagers to follow."
          />
          <ActionCard
            action="Create"
            title="3 visitors asked about contractor payment timing"
            body="Turn the repeated question into a post that explains conditional payment schedules."
          />
        </div>
      </div>

      <div className="space-y-[40px] px-lg pb-xxl pt-[40px] sm:px-xxl">
        <section>
          <div className="flex items-start justify-between gap-lg">
            <div>
              <h2 className="text-heading-sm text-text">Track performance</h2>
              <p className="text-body-sm text-text-meta">
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
              <p className="text-body-sm text-text-meta">
                Manage payment education content and amplify top-performing posts with
                boosting. <InlineAction>Learn more</InlineAction>
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

function PremiumCompanyPagesAdminShell({
  activeItem,
  children,
}: Readonly<{
  activeItem: string;
  children: ReactNode;
}>) {
  return (
    <main className="min-h-dvh bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation profileSrc={pcpCompanyProfile.founderAvatarSrc} />
      <div className="mx-auto grid w-full max-w-[1145px] gap-lg px-lg py-xxl lg:grid-cols-[225px_minmax(0,888px)] lg:gap-[32px] lg:px-0">
        <PageRail activeItem={activeItem} />
        {children}
      </div>
    </main>
  );
}

export function PremiumCompanyPagesPage() {
  return (
    <PremiumCompanyPagesAdminShell activeItem="Dashboard">
      <DashboardContent />
    </PremiumCompanyPagesAdminShell>
  );
}

export function PremiumCompanyPagesAdminInboxPage() {
  return (
    <PremiumCompanyPagesAdminShell activeItem="Inbox">
      <InboxContent />
    </PremiumCompanyPagesAdminShell>
  );
}
