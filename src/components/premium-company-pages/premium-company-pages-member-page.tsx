"use client";

import Image from "next/image";
import { flushSync } from "react-dom";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  ChatBody,
  ChatComposer,
  ChatMessage,
  ChatPanel,
  ChatSidePanel,
  ChatSidePanelLayout,
  ChatTray,
  ChatThread,
  Prompt,
  type ChatPanelVariant,
} from "@/components/chat";
import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import { OverlayButtonIcon } from "@/components/primitives/overlay-button-icon";
import { Pill } from "@/components/primitives/pill";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";
import { TabItemHorizontal } from "@/components/primitives/tab-item-horizontal";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

import {
  PCP_ASSET_ROOT,
  PCP_MEMBER_ASSET_ROOT,
  pcpCompanyProfile,
} from "./persona";

const ASSET_ROOT = PCP_MEMBER_ASSET_ROOT;

const pageTabs = [
  "Home",
  "About",
  "Posts",
  "Services",
  "Jobs",
  "Life",
  "People",
  "Insights",
];

const companyMetadata = [
  pcpCompanyProfile.industry,
  pcpCompanyProfile.location,
  pcpCompanyProfile.followers,
  pcpCompanyProfile.employees,
];

const sideJobs = [
  "Senior Payments Engineer",
  "Customer Operations Lead",
  "Product Designer, Payments",
];

const affiliatedPages = [
  "FreshBooks",
  "QuickBooks",
  "Wave",
];

const overviewHighlights = [
  {
    title: "Verified small business payments provider",
    date: "January 2025",
    image: pcpCompanyProfile.logoSrc,
  },
  {
    title: "Built for agencies with rotating contractor teams",
    date: "June 2024",
    image: pcpCompanyProfile.logoSrc,
  },
];

const posts = [
  {
    title: "What happens when a client pays late but contractors still need to be paid?",
    body: "The agencies that stay trusted have a clear payment plan before the invoice is overdue. Conditional schedules can keep the work moving without a spreadsheet chase.",
    image: "../post-building-blue.png",
    stats: "4,238 impressions",
  },
  {
    title: "Three signs your contractor payment workflow has outgrown spreadsheets.",
    body: "If every project has a different payment dependency, your team needs a system that can track client approvals, contractor obligations, and payout timing together.",
    image: "../post-kudos.png",
    stats: "42 comments",
  },
];

const products = [
  {
    title: "Conditional payment schedules",
    type: "Payment workflow",
    body: "Connect contractor payouts to client payment status, approval milestones, or project rules so late client invoices do not create manual tracking work.",
    image: "hero-cover-1.png",
  },
  {
    title: "Contractor payout tracking",
    type: "Operations workflow",
    body: "See which contractors are waiting on approvals, which invoices are blocked by clients, and which payouts are ready to release.",
    image: "media-2.png",
  },
  {
    title: "Client payment visibility",
    type: "Client operations",
    body: "Give agency owners a simple view of client invoice timing, payment dependencies, and the contractor impact of late payments.",
    image: "media-1.png",
  },
];

const serviceKeywords = [
  "Financial Services",
  "Payment Processing",
  "Invoice Processing",
  "Bookkeeping",
  "Operations",
];

const leaders = [
  {
    name: pcpCompanyProfile.founderName,
    role: pcpCompanyProfile.founderTitle,
    followers: "8,412 followers",
    image: pcpCompanyProfile.founderAvatarSrc,
  },
  {
    name: "Avery Chen",
    role: "Head of Payments",
    followers: "3,284 followers",
    image: `${PCP_ASSET_ROOT}/avatar-2.png`,
  },
  {
    name: "Marcus Lee",
    role: "Customer Operations Lead",
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

const leaderPosts = [
  {
    author: pcpCompanyProfile.founderName,
    avatar: pcpCompanyProfile.founderAvatarSrc,
    body: "Agency payment chaos usually starts with one invisible dependency: the client is late, but the contractor still expects a clear answer.",
    image: null,
  },
  {
    author: "Avery Chen",
    avatar: `${PCP_ASSET_ROOT}/avatar-2.png`,
    body: "Conditional payout rules are not about delaying contractors. They are about making payment timing explicit before a project gets messy.",
    image: "media-1.png",
  },
  {
    author: "Marcus Lee",
    avatar: `${PCP_ASSET_ROOT}/avatar-3.png`,
    body: "The best agency operators can answer three questions fast: who has paid, who is waiting, and which contractor payout is affected.",
    image: "media-2.png",
    linkTitle: "How agency teams reduce late contractor payment surprises",
    linkMeta: "Velora on LinkedIn - 7min...",
  },
];

const mainJobOpenings = [
  "Senior Payments Engineer",
  "Customer Operations Lead",
];

const newsletters = [
  {
    title: "The Contractor Payment Brief",
    meta: "Weekly - 2,674 subscribers",
    body: "Weekly notes for agency founders managing client invoices, contractor payouts, and payment timing without spreadsheet sprawl.",
  },
  {
    title: "Agency Ops Field Notes",
    meta: "Monthly - 1,204 subscribers",
    body: "Practical lessons from small agencies coordinating client approvals, rotating teams, and contractor payment expectations.",
  },
  {
    title: "Payment Signals",
    meta: "Monthly - 894 subscribers",
    body: "A concise readout of invoice timing patterns, payout dependencies, and questions agency owners are asking.",
  },
];

const footerLinkColumns = [
  ["About", "Community Guidelines", "Privacy & Terms", "Sales Solution", "Safety Center"],
  ["Accessibility", "Careers", "Ad Choices", "Mobile"],
  ["Talent Solutions", "Marketing Solutions", "Advertising", "Small Business"],
];

const globalInboxThreads = [
  {
    id: "velora",
    name: pcpCompanyProfile.name,
    detail: "You: Hi Velora, I found your...",
    time: "Jun 1",
    avatar: "velora-logo.png",
    selected: true,
  },
  {
    id: "maya",
    name: "Maya Patel",
    detail: "Lorem ipsum dolor sit amet, consectetur...",
    time: "4:48 PM",
    avatar: `${PCP_ASSET_ROOT}/avatar-1.png`,
    active: true,
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    detail: "Praesent commodo cursus magna...",
    time: "May 29",
    avatar: `${PCP_ASSET_ROOT}/avatar-3.png`,
  },
  {
    id: "nicole",
    name: "Nicole Zhang",
    detail: "Etiam porta sem malesuada magna...",
    time: "May 27",
    avatar: `${PCP_ASSET_ROOT}/avatar-2.png`,
    active: true,
  },
  {
    id: "james",
    name: "James Yu",
    detail: "Donec ullamcorper nulla non metus...",
    time: "May 27",
    avatar: `${PCP_ASSET_ROOT}/avatar-2.png`,
  },
  {
    id: "steven",
    name: "Steven Ji",
    detail: "Nullam id dolor id nibh ultricies...",
    time: "May 25",
    avatar: `${PCP_ASSET_ROOT}/avatar-3.png`,
  },
  {
    id: "amanda",
    name: "Amanda Liu",
    detail: "Aenean lacinia bibendum nulla sed...",
    time: "May 13",
    avatar: `${PCP_ASSET_ROOT}/avatar-1.png`,
    active: true,
  },
];

export type VcaShellMode = "tray" | "fab";
export type VcaMemberIntent = "buyer" | "job-seeker";
type MessagingSurfaceState = "closed" | "docked" | "open";

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => {
    finished: Promise<void>;
  };
};
type VcaConversationStage =
  | "opening"
  | "profilePromptAnswered"
  | "postProof"
  | "caseStudyReturned"
  | "jobProof"
  | "handoffOffered"
  | "handoffOpened";

const VCA_HERO_QUESTION =
  "If a client pays late, what happens to my contractor payments?";
const VCA_LATE_PAYMENT_CHIP = "What happens when a client pays late?";
const vcaStarterPrompts = [
  "How does contractor payment work?",
  VCA_LATE_PAYMENT_CHIP,
  "How does pricing work?",
];
const profileQuestionPrompts = [
  "How does contractor payment work?",
  "What happens when a client pays late?",
  "How does pricing work?",
  "Can I track contractors by client?",
  "Can I manage several projects at once?",
] as const;
const profileQuestionResponses: Record<
  (typeof profileQuestionPrompts)[number],
  string
> = {
  "How does contractor payment work?":
    "Velora lets you connect contractor payouts to the client project, approval milestone, or payment condition behind them. You can queue payouts, show contractors when a payment is pending, and release the right payments once the client-side dependency clears.",
  "What happens when a client pays late?":
    "Velora moves only the affected contractor payments into a pending state automatically. Contractors can see that their payment is queued, not missing, and once the client payment clears, the scheduled payouts release without your team chasing spreadsheets.",
  "How does pricing work?":
    "Velora pricing is based on agency size and the complexity of your payout workflow, including active projects, contractor volume, and client payment rules. For a small agency, the goal is to keep the plan predictable while still covering conditional payment scheduling and contractor visibility.",
  "Can I track contractors by client?":
    "Yes. Velora tracks each contractor-client relationship separately, so you can see which contractors are tied to each client, project, invoice, and approval status. That makes it easier to answer who is ready to be paid and who is waiting on a client dependency.",
  "Can I manage several projects at once?":
    "Yes. Velora gives you one dashboard across active client projects, with payment status, contractor payout timing, and approval blockers grouped by project. If one project is delayed, the rest of your contractor payments can keep moving.",
};
const VCA_JOB_SEEKER_QUESTION =
  "Would my customer operations background be a fit for the Customer Operations Lead role?";
const VCA_JOB_SEEKER_CHIP = "Would my customer ops background be a fit?";
const vcaJobSeekerPrompts = [
  VCA_JOB_SEEKER_CHIP,
  "What does this role own?",
  "Is this role remote?",
];
const VCA_GREETING =
  "Hi, I'm Velora's AI assistant. I can help explain what Velora does, answer questions about roles or recent updates, and point you to the right next step. What would you like to know?";
const VCA_LATE_PAYMENT_RESPONSE =
  "This is one of the core things Velora was built for. When a client payment is delayed, contractor payments go into a pending state automatically - no manual intervention, no awkward conversations. Contractors can see their payment is queued, not missing. Once the client pays, everything releases. Here's how a similar agency handled it:";
const VCA_JOB_SEEKER_RESPONSE =
  "Yes - your customer operations background sounds relevant, especially if you've helped customers through setup, troubleshooting, and feedback loops. For this role, Velora is looking for someone who can connect customer conversations, payment workflow setup, and cross-functional product feedback so small agency teams get clear answers quickly.";
const VCA_JOB_PROOF_INTRO =
  "This role looks closest to what you're describing:";
const VCA_CASE_STUDY_RETURN_PROMPT =
  "Studio Northline feels pretty close to your world - a small team, rotating contractors, and client payments that ripple into payout timing. Want me to turn what you've shared into a warm intro to Velora so the team has the right context from the start?";
const VCA_DRAFT_INTRO_PROMPT = "Draft message";
const VCA_HANDOFF_OFFER =
  "Sounds like this might be a fit for your team. Want me to put together a message to Velora so they have your context before you connect?";
const VCA_HANDOFF_MESSAGE =
  "Hi - I run a small creative agency with rotating contractors and I'm dealing with late client payments that cascade into late contractor payments. Your conditional payment scheduling sounds like exactly what I need. Would love to learn more about how it works for an agency our size.";
const VCA_AI_CARD_CLASS =
  "chat-message-enter flex w-full max-w-[24rem] flex-col gap-lg rounded-md border border-ai-border bg-background py-xl pl-xl pr-lg text-text shadow-raised-faint";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${ASSET_ROOT}/${path}`;
}

const VELORA_LOGO_AVATAR_RADIUS_CLASS = "rounded-sm";
const VELORA_LOGO_TILE_BACKGROUND_CLASS = "bg-[#ACF5B3]";
const VELORA_LOGO_TILE_BACKGROUND_STYLE = {
  backgroundColor: "#ACF5B3",
};

function VeloraVcaLogoMark({
  size = "small",
}: Readonly<{ size?: "small" | "medium" }>) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center justify-center overflow-hidden border border-border-faint bg-[#ACF5B3]",
        size === "medium" ? "size-8 p-[3px]" : "size-7 p-[3px]",
        VELORA_LOGO_AVATAR_RADIUS_CLASS,
      )}
    >
      <Image
        alt=""
        className="size-full max-w-none object-contain"
        height={35}
        src={assetSrc("velora-vca-logo.png")}
        width={39}
      />
    </span>
  );
}

function VeloraAiTag() {
  return (
    <span className="inline-flex h-[var(--design-layout-tag-small-height)] max-w-full shrink-0 select-none items-center justify-center gap-xxs rounded-xs bg-ai-background-soft px-sm font-sans text-body-sm text-action-active whitespace-nowrap">
      <Icon
        className="[&&]:size-3 shrink-0 text-ai-icon"
        name="signal-ai"
        size="small"
      />
      <span>AI</span>
    </span>
  );
}

function VcaAssistantMessage({
  children,
  timestamp,
}: Readonly<{ children: ReactNode; timestamp?: string }>) {
  return <ChatMessage timestamp={timestamp}>{children}</ChatMessage>;
}

function VcaUserMessage({
  children,
  timestamp,
}: Readonly<{ children: ReactNode; timestamp?: string }>) {
  return (
    <ChatMessage role="user" timestamp={timestamp}>
      {children}
    </ChatMessage>
  );
}

function VeloraLinkedInPostProofCard({
  onViewCaseStudy,
}: Readonly<{ onViewCaseStudy: () => void }>) {
  return (
    <article className="chat-message-enter w-full max-w-[24rem] overflow-hidden rounded-md border border-ai-border bg-background text-text shadow-raised-faint">
      <div className="p-lg">
        <div className="flex items-start gap-sm">
          <Entity
            className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
            label={pcpCompanyProfile.name}
            shape="square"
            size={40}
            style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
            src={pcpCompanyProfile.logoSrc}
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-control-sm text-text">
              {pcpCompanyProfile.name}
            </h3>
            <p className="text-supportive-s text-text-meta">
              {pcpCompanyProfile.followers}
            </p>
            <p className="text-supportive-s text-text-meta">2d</p>
          </div>
        </div>

        <p className="mt-md text-control-sm text-text">
          Studio Northline: how a 10-person creative agency stopped chasing late payments
        </p>
      </div>
      <Image
        alt=""
        className="aspect-[16/9] w-full object-cover"
        height={272}
        src={assetSrc("post-image-1.png")}
        width={484}
      />
      <div className="flex items-center justify-between border-t border-border-faint px-lg py-sm text-body-sm text-text-meta">
        <span className="inline-flex min-w-0 items-center gap-sm">
          <ReactionPile />
          <span>1,284</span>
        </span>
        <span>36 comments</span>
      </div>
      <div className="flex justify-start border-t border-border-faint px-lg py-md">
        <Button onClick={onViewCaseStudy} size="small" variant="secondary">
          View case study
        </Button>
      </div>
    </article>
  );
}

function VeloraCaseStudySidePanel({
  onBack,
}: Readonly<{ onBack: () => void }>) {
  return (
    <ChatSidePanel
      className="bg-background"
      contentClassName="mx-auto w-full max-w-[760px] pb-xl"
      headerActions={
        <>
          <GhostIconButton
            icon="bookmark-outline"
            label="Save post"
            size="medium"
          />
          <GhostIconButton
            icon="overflow-web-ios"
            label="More post actions"
            size="medium"
          />
        </>
      }
      onBack={onBack}
    >
      <article className="text-text">
        <Image
          alt=""
          className="aspect-[16/7] w-full object-cover"
          height={332}
          src={assetSrc("post-image-1.png")}
          width={760}
        />

        <h1 className="mt-xl text-heading-lg text-text">
          Studio Northline: how a 10-person creative agency stopped chasing
          late payments
        </h1>

        <div className="mt-lg flex items-start gap-md">
          <Entity
            className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
            label={pcpCompanyProfile.name}
            shape="square"
            size={48}
            style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
            src={pcpCompanyProfile.logoSrc}
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-heading-sm text-text">
              {pcpCompanyProfile.name}
            </h2>
            <p className="text-body-sm text-text">{pcpCompanyProfile.followers}</p>
          </div>
        </div>

        <p className="mt-xl text-body-sm text-text-meta">
          June 2, 2026 &middot; Edited
        </p>

        <div className="mt-xl space-y-md text-body-sm-open text-text">
          <p>
            Studio Northline was juggling five active client retainers and
            14 rotating contractors across brand, motion, and production work.
            One late client invoice used to send the whole team into a
            spreadsheet scramble.
          </p>
          <p>
            With Velora, Maya&apos;s team mapped every contractor payout to the
            client project and payment condition behind it. When one client paid
            late, only the affected contractor payments moved into pending.
            Everyone else stayed on schedule.
          </p>
          <p>
            Contractors could see that payments were queued, not missing. Once
            the invoice cleared, Velora released the right payouts
            automatically.
          </p>
        </div>

        <div className="mt-xl flex items-center justify-between border-t border-border-faint py-md text-body-sm text-text-meta">
          <span className="inline-flex min-w-0 items-center gap-sm">
            <ReactionPile />
            <span>1,284</span>
          </span>
          <span>36 comments</span>
        </div>
      </article>
    </ChatSidePanel>
  );
}

function VeloraLinkedInJobPreviewCard({
  onViewJob,
}: Readonly<{ onViewJob: () => void }>) {
  return (
    <article className="chat-message-enter w-full max-w-[24rem] overflow-hidden rounded-md border border-ai-border bg-background text-text shadow-raised-faint">
      <div className="p-xl">
        <Image
          alt=""
          className="size-14 rounded-sm bg-[#ACF5B3] object-cover"
          height={56}
          src={pcpCompanyProfile.logoSrc}
          style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
          width={56}
        />

        <div className="mt-sm">
          <h3 className="flex items-center gap-xxs text-heading-md text-text">
            Customer Operations Lead
            <Icon className="shrink-0 text-icon" name="verified" size="small" />
          </h3>
          <div className="mt-sm">
            <p className="text-control-sm text-text">
              {pcpCompanyProfile.name}
            </p>
            <p className="text-body-sm text-text-meta">
              {pcpCompanyProfile.location}
            </p>
          </div>
        </div>

        <div className="mt-xl flex items-center gap-sm text-body-xs text-text-meta">
          <Image
            alt=""
            className="size-8 rounded-xs object-cover"
            height={32}
            src={assetSrc("school-alumni-spartan.png")}
            width={32}
          />
          <span>1,412 school alumni work here</span>
        </div>

        <p className="mt-xl text-body-xs text-text-meta">2 days ago</p>
      </div>
      <div className="flex justify-start border-t border-border-faint px-lg py-md">
        <Button onClick={onViewJob} size="small" variant="secondary">
          View job
        </Button>
      </div>
    </article>
  );
}

function VeloraJobSidePanel({ onBack }: Readonly<{ onBack: () => void }>) {
  return (
    <ChatSidePanel
      className="bg-background"
      contentClassName="mx-auto w-full max-w-[760px] pb-xl"
      headerActions={
        <>
          <GhostIconButton
            icon="bookmark-outline"
            label="Save job"
            size="medium"
          />
          <GhostIconButton
            icon="overflow-web-ios"
            label="More job actions"
            size="medium"
          />
        </>
      }
      onBack={onBack}
    >
      <article className="text-text">
        <div className="flex items-center gap-md">
          <Entity
            className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
            label={pcpCompanyProfile.name}
            shape="square"
            size={48}
            style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
            src={pcpCompanyProfile.logoSrc}
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-heading-md text-text">
              {pcpCompanyProfile.name}
            </h2>
          </div>
        </div>

        <h1 className="mt-xl flex items-center gap-sm text-heading-xl text-text">
          Customer Operations Lead
          <Icon className="shrink-0 text-icon" name="verified" size="medium" />
        </h1>

        <div className="mt-md space-y-xxs text-body-sm-open text-text-meta">
          <p>
            {pcpCompanyProfile.location} &middot; 2 days ago &middot;{" "}
            <span className="font-semibold text-positive">
              20 people clicked apply
            </span>
          </p>
        </div>

        <div className="mt-xl flex flex-wrap gap-sm">
          {[pcpCompanyProfile.location, "Full-time"].map((detail) => (
            <Pill
              aria-disabled="true"
              key={detail}
              tabIndex={-1}
            >
              {detail}
            </Pill>
          ))}
        </div>

        <section className="mt-xxl border-t border-border-faint pt-xxl text-text">
          <h3 className="text-heading-lg text-text">About the job</h3>
          <h4 className="mt-lg text-heading-sm text-text">About The Team</h4>
          <p className="mt-xl text-body-md-open text-text">
            Velora helps small agency teams manage contractor payments, client
            invoice timing, and project approvals in one workflow. The Customer
            Operations team works closely with customers, product, and payments
            partners to make complex payout questions feel clear and
            actionable....{" "}
            <button
              className="font-semibold text-text-meta hover:text-text"
              type="button"
            >
              more
            </button>
          </p>
        </section>

        <footer className="mt-xxl flex justify-end gap-sm border-t border-border-faint pt-lg">
          <Button
            className="px-pill-padding-inline"
            size="medium"
            variant="secondary"
          >
            Save
          </Button>
          <Button
            className="px-pill-padding-inline"
            size="medium"
            trailingIcon={<Icon name="link-external" size="small" />}
          >
            Apply
          </Button>
        </footer>
      </article>
    </ChatSidePanel>
  );
}

function VcaHandoffCard({
  onOpenMessage,
}: Readonly<{ onOpenMessage: () => void }>) {
  return (
    <article className={VCA_AI_CARD_CLASS}>
      <div className="flex items-center gap-xs text-body-xs text-text-meta">
        <Icon name="send" size="small" />
        <span>Drafted message</span>
      </div>
      <div className="space-y-xs">
        <h2 className="text-heading-md text-text">
          Ready to send to Velora
        </h2>
        <p className="rounded-sm bg-background-neutral-soft p-md text-body-sm-open text-text">
          {VCA_HANDOFF_MESSAGE}
        </p>
      </div>
      <Button
        className="w-fit px-pill-padding-inline"
        onClick={onOpenMessage}
        size="small"
      >
        Open drafted message
      </Button>
    </article>
  );
}

function VeloraAiHeader({
  actionSize,
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  showResponseTime,
  variant = "collapsed",
}: Readonly<{
  actionSize: "small" | "medium";
  onClose: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  showResponseTime: boolean;
  variant?: ChatPanelVariant;
}>) {
  const variantAction =
    onVariantToggle ? (
      <span className="hidden md:inline-flex">
        <GhostIconButton
          label={variant === "expanded" ? "Collapse chat" : "Expand chat"}
          icon={variant === "expanded" ? "minimize" : "maximize"}
          size={actionSize}
          onClick={onVariantToggle}
        />
      </span>
    ) : null;

  return (
    <header
      className="flex min-h-[var(--design-layout-panel-header-height)] shrink-0 items-center justify-between border-b border-border-faint bg-background pl-[calc(var(--design-spacing-xxl)+env(safe-area-inset-left))] pr-[calc(var(--design-spacing-lg)+env(safe-area-inset-right))] transition-[background-color,border-color] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:pl-xxl md:pr-lg"
    >
      <div className="flex min-w-0 items-center gap-sm py-sm">
        <VeloraVcaLogoMark size="medium" />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-xs">
            <h2 className="min-w-0 truncate text-heading-md text-text">
              Velora
            </h2>
            <VeloraAiTag />
          </div>
          {showResponseTime ? (
            <p className="mt-xxs truncate text-body-xs text-text-meta">
              Replies instantly
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-0">
        {onMinimizeToTray ? (
          <GhostIconButton
            label="Dock chat to tray"
            icon="chevron-down"
            size={actionSize}
            onClick={onMinimizeToTray}
          />
        ) : null}
        {variantAction}
        <GhostIconButton
          label="Close chat"
          icon="close"
          size={actionSize}
          onClick={onClose}
        />
      </div>
    </header>
  );
}

function PremiumCompanyPagesVcaPanel({
  variant,
  surfaceMode,
  memberIntent,
  draft,
  conversationStage,
  isCaseStudyOpen,
  isJobOpen,
  visitorQuestion,
  followUpQuestion,
  onClose,
  onCloseCaseStudy,
  onCloseJob,
  onDraftChange,
  onOpenCaseStudy,
  onOpenJob,
  onOpenMessage,
  onMinimizeToTray,
  onVariantToggle,
  onPromptSelect,
  onSend,
}: Readonly<{
  variant?: ChatPanelVariant;
  surfaceMode: VcaShellMode;
  memberIntent: VcaMemberIntent;
  draft: string;
  conversationStage: VcaConversationStage;
  isCaseStudyOpen: boolean;
  isJobOpen: boolean;
  visitorQuestion: string | null;
  followUpQuestion: string | null;
  onClose: () => void;
  onCloseCaseStudy: () => void;
  onCloseJob: () => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onOpenCaseStudy: () => void;
  onOpenJob: () => void;
  onOpenMessage: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  onPromptSelect: (prompt: string) => void;
  onSend: () => void;
}>) {
  const headerActionSize = variant === "expanded" ? "medium" : "small";
  const showHeaderResponseTime = true;
  const isJobSeekerIntent = memberIntent === "job-seeker";
  const isDetailPanelOpen = isCaseStudyOpen || isJobOpen;
  const hasStartedConversation = Boolean(visitorQuestion);
  const hasFollowUp = Boolean(followUpQuestion);
  const shouldShowProof =
    !isJobSeekerIntent &&
    (conversationStage === "postProof" ||
      conversationStage === "caseStudyReturned" ||
      conversationStage === "handoffOffered" ||
      conversationStage === "handoffOpened");
  const shouldShowJobProof =
    isJobSeekerIntent && conversationStage === "jobProof";
  const profilePromptAnswer = visitorQuestion
    ? profileQuestionResponses[
        visitorQuestion as keyof typeof profileQuestionResponses
      ]
    : undefined;
  const shouldShowCaseStudyReturnPrompt =
    !isJobSeekerIntent && conversationStage === "caseStudyReturned";
  const shouldShowHandoff =
    !isJobSeekerIntent &&
    (conversationStage === "handoffOffered" ||
      conversationStage === "handoffOpened");
  const shouldShowGreeting = conversationStage !== "profilePromptAnswered";
  const greeting = VCA_GREETING;
  const starterPrompts = isJobSeekerIntent
    ? vcaJobSeekerPrompts
    : vcaStarterPrompts;
  const composerPlaceholder = "Ask Velora...";
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const sidePanelHistoryRef = useRef<HTMLDivElement | null>(null);
  let messageTimestampIndex = 0;
  const getNextMessageTimestamp = () =>
    getPrototypeMessageTimestamp(messageTimestampIndex++);

  useEffect(() => {
    if (!isDetailPanelOpen) {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      const historyPanel = sidePanelHistoryRef.current;

      if (!historyPanel) {
        return;
      }

      historyPanel.scrollTop = historyPanel.scrollHeight;
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [
    conversationStage,
    followUpQuestion,
    isDetailPanelOpen,
    visitorQuestion,
  ]);

  useEffect(() => {
    if (isDetailPanelOpen || conversationStage !== "caseStudyReturned") {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      const chatBody = chatBodyRef.current;

      if (!chatBody) {
        return;
      }

      chatBody.scrollTop = chatBody.scrollHeight;
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [conversationStage, isDetailPanelOpen]);

  const thread = (
    <ChatThread aiDisclaimerHref="#">
      <div className="flex flex-col gap-lg">
        {shouldShowGreeting ? (
          <VcaAssistantMessage timestamp={getNextMessageTimestamp()}>
            {greeting}
          </VcaAssistantMessage>
        ) : null}
        {conversationStage === "opening" && !hasStartedConversation ? (
          <div className="flex flex-col gap-sm">
            {starterPrompts.map((prompt) => (
              <Prompt
                className="w-fit max-w-full self-start"
                key={prompt}
                onPromptSelect={onPromptSelect}
                prompt={prompt}
              />
            ))}
          </div>
        ) : null}
        {visitorQuestion ? (
          <VcaUserMessage timestamp={getNextMessageTimestamp()}>
            {visitorQuestion}
          </VcaUserMessage>
        ) : null}
        {shouldShowProof ? (
          <>
            <VcaAssistantMessage timestamp={getNextMessageTimestamp()}>
              {VCA_LATE_PAYMENT_RESPONSE}
            </VcaAssistantMessage>
            <VeloraLinkedInPostProofCard
              onViewCaseStudy={onOpenCaseStudy}
            />
          </>
        ) : null}
        {shouldShowJobProof ? (
          <>
            <VcaAssistantMessage timestamp={getNextMessageTimestamp()}>
              {VCA_JOB_SEEKER_RESPONSE}
            </VcaAssistantMessage>
            <VcaAssistantMessage timestamp={getNextMessageTimestamp()}>
              {VCA_JOB_PROOF_INTRO}
            </VcaAssistantMessage>
            <VeloraLinkedInJobPreviewCard onViewJob={onOpenJob} />
          </>
        ) : null}
        {conversationStage === "profilePromptAnswered" &&
        profilePromptAnswer ? (
          <VcaAssistantMessage timestamp={getNextMessageTimestamp()}>
            {profilePromptAnswer}
          </VcaAssistantMessage>
        ) : null}
        {hasFollowUp && !isJobSeekerIntent ? (
          <VcaUserMessage timestamp={getNextMessageTimestamp()}>
            {followUpQuestion}
          </VcaUserMessage>
        ) : null}
        {shouldShowCaseStudyReturnPrompt ? (
          <>
            <VcaAssistantMessage timestamp={getNextMessageTimestamp()}>
              {VCA_CASE_STUDY_RETURN_PROMPT}
            </VcaAssistantMessage>
            <Prompt
              className="w-fit max-w-full self-start"
              onPromptSelect={onPromptSelect}
              prompt={VCA_DRAFT_INTRO_PROMPT}
            />
          </>
        ) : null}
        {shouldShowHandoff ? (
          <>
            {hasFollowUp ? (
              <>
                <VcaAssistantMessage timestamp={getNextMessageTimestamp()}>
                  {VCA_HANDOFF_OFFER}
                </VcaAssistantMessage>
              </>
            ) : null}
            <VcaHandoffCard onOpenMessage={onOpenMessage} />
          </>
        ) : null}
      </div>
    </ChatThread>
  );

  return (
    <ChatPanel
      aria-label={`${pcpCompanyProfile.name} assistant`}
      className={cx(
        "!h-full !w-full shadow-raised-faint md:!h-full md:!w-full",
        surfaceMode === "fab" || variant === "expanded"
          ? "!rounded-none md:!rounded-sm"
          : "!rounded-none md:!rounded-t-sm md:!rounded-b-none",
        isDetailPanelOpen && "md:!w-full",
      )}
      variant={variant}
    >
      <VeloraAiHeader
        actionSize={headerActionSize}
        onClose={onClose}
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
        showResponseTime={showHeaderResponseTime}
        variant={variant}
      />
      {isDetailPanelOpen ? (
        <ChatSidePanelLayout
          chatBodyClassName="pb-[96px]"
          chatBodyRef={sidePanelHistoryRef}
          history={thread}
          sidePanel={
            isJobOpen ? (
              <VeloraJobSidePanel onBack={onCloseJob} />
            ) : (
              <VeloraCaseStudySidePanel onBack={onCloseCaseStudy} />
            )
          }
          variant={variant}
        />
      ) : (
        <>
          <ChatBody ref={chatBodyRef}>{thread}</ChatBody>
          <ChatComposer
            inputProps={{
              "aria-label": `Message ${pcpCompanyProfile.name} AI assistant`,
              onChange: onDraftChange,
              placeholder: composerPlaceholder,
              value: draft,
            }}
            onSend={onSend}
            showAttachAction={false}
            showDictationAction={false}
            showTopDivider={false}
            showVoiceMode={false}
            variant="collapsed"
          />
        </>
      )}
    </ChatPanel>
  );
}

function GlobalInboxAvatar({
  active = false,
  className,
  label,
  shape = "circle",
  size = 40,
  src,
  style,
}: Readonly<{
  active?: boolean;
  className?: string;
  label: string;
  shape?: "circle" | "square";
  size?: 32 | 40;
  src: string;
  style?: CSSProperties;
}>) {
  return (
    <span className="relative inline-flex shrink-0">
      <Entity
        className={className}
        label={label}
        shape={shape}
        size={size}
        src={src}
        style={style}
      />
      {active ? (
        <span
          aria-label="Active"
          className="absolute -bottom-xxs -right-xxs size-3 rounded-round border-2 border-background bg-positive"
          role="status"
        />
      ) : null}
    </span>
  );
}

function GlobalInboxTray({
  isExpanded,
  onOpenVeloraThread,
  onToggle,
}: Readonly<{
  isExpanded: boolean;
  onOpenVeloraThread: () => void;
  onToggle: () => void;
}>) {
  return (
    <aside
      aria-label="Messaging inbox"
      className={cx(
        "pcp-global-messaging-surface fixed bottom-0 right-6 z-50 hidden w-[288px] flex-col overflow-hidden rounded-t-sm border border-b-0 border-border-faint bg-background text-text shadow-raised-faint-upward transition-[height] duration-[var(--design-motion-duration-moderate)] ease-emphasized md:flex",
        isExpanded
          ? "h-[min(calc(100dvh_-_96px),690px)]"
          : "h-[var(--design-layout-chat-tray-height,48px)]",
      )}
    >
      <div className="flex min-h-[var(--design-layout-chat-tray-height,48px)] items-center gap-sm border-b border-border-faint px-lg">
        <button
          aria-expanded={isExpanded}
          className="group flex min-w-0 flex-1 items-center gap-sm rounded-xs text-left outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          onClick={onToggle}
          type="button"
        >
          <GlobalInboxAvatar
            active
            label="Cheri Sparks"
            size={32}
            src={assetSrc("avatar-2.png")}
          />
          <span className="min-w-0 truncate text-heading-md text-text">
            Messaging
          </span>
        </button>
        <div className="flex shrink-0 items-center -space-x-xs">
          <GhostIconButton
            icon="overflow-web-ios"
            label="More messaging actions"
            size="small"
          />
          <GhostIconButton
            icon="compose"
            label="Compose message"
            size="small"
          />
          <GhostIconButton
            icon={isExpanded ? "chevron-down" : "chevron-up"}
            label={isExpanded ? "Collapse messaging" : "Expand messaging"}
            onClick={onToggle}
            size="small"
          />
        </div>
      </div>

      {isExpanded ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <button
            className="flex min-h-[48px] items-center justify-between border-b border-border-faint px-lg text-left text-control-md text-text outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
            type="button"
          >
            <span>More inboxes</span>
            <Icon className="text-icon" name="caret" size="small" />
          </button>

          <div className="border-b border-border-faint px-lg py-sm">
            <div className="flex h-10 items-center gap-sm rounded-xs bg-background-neutral-soft px-md text-text-meta">
              <Icon name="search" size="small" />
              <span className="min-w-0 flex-1 truncate text-body-sm">
                Search messages
              </span>
              <Icon name="overflow-android" size="small" />
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-border-faint text-center text-control-sm">
            <button
              aria-selected="true"
              className="border-b-2 border-positive px-md py-md text-positive outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              role="tab"
              type="button"
            >
              Focused
            </button>
            <button
              aria-selected="false"
              className="border-b-2 border-transparent px-md py-md text-text-meta outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
              role="tab"
              type="button"
            >
              Other
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {globalInboxThreads.map((thread) => (
              <button
                className={cx(
                  "flex w-full items-start gap-sm border-b border-border-faint px-md py-sm text-left outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring",
                  thread.selected && "bg-action-background-transparent-hover",
                )}
                onClick={
                  thread.id === "velora" ? onOpenVeloraThread : undefined
                }
                key={thread.name}
                type="button"
              >
                <GlobalInboxAvatar
                  active={thread.active}
                  className={
                    thread.id === "velora"
                      ? cx(
                          VELORA_LOGO_TILE_BACKGROUND_CLASS,
                          VELORA_LOGO_AVATAR_RADIUS_CLASS,
                        )
                      : undefined
                  }
                  label={thread.name}
                  shape={thread.id === "velora" ? "square" : "circle"}
                  src={assetSrc(thread.avatar)}
                  style={
                    thread.id === "velora"
                      ? VELORA_LOGO_TILE_BACKGROUND_STYLE
                      : undefined
                  }
                />
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-baseline justify-between gap-sm">
                    <span className="truncate text-control-sm text-text">
                      {thread.name}
                    </span>
                    <span className="shrink-0 text-body-xs text-text-meta">
                      {thread.time}
                    </span>
                  </span>
                  <span className="mt-xxs block truncate text-body-sm text-text-meta">
                    {thread.detail}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function HumanMessageDivider({ label }: Readonly<{ label: string }>) {
  return (
    <div className="flex items-center gap-lg py-md text-center">
      <span className="h-px flex-1 bg-border-faint" />
      <span className="shrink-0 text-body-xs uppercase tracking-[0.16em] text-text-meta">
        {label}
      </span>
      <span className="h-px flex-1 bg-border-faint" />
    </div>
  );
}

function HumanMessageEntry({
  author,
  avatarSrc,
  children,
  time,
}: Readonly<{
  author: string;
  avatarSrc: string;
  children: ReactNode;
  time: string;
}>) {
  const isCompanyAuthor = author === pcpCompanyProfile.name;

  return (
    <div className="space-y-xs">
      <div className="flex items-center justify-between gap-sm">
        <div className="flex min-w-0 items-center gap-sm">
          <Entity
            className={
              isCompanyAuthor
                ? cx(
                    VELORA_LOGO_TILE_BACKGROUND_CLASS,
                    VELORA_LOGO_AVATAR_RADIUS_CLASS,
                  )
                : undefined
            }
            label={author}
            shape={isCompanyAuthor ? "square" : "circle"}
            size={40}
            src={avatarSrc}
            style={isCompanyAuthor ? VELORA_LOGO_TILE_BACKGROUND_STYLE : undefined}
          />
          <div className="flex min-w-0 flex-wrap items-center gap-xs">
            <p className="truncate text-control-sm text-text">{author}</p>
            {author !== pcpCompanyProfile.name ? (
              <Icon className="shrink-0 text-premium-inbug" name="linked-in-bug" size="small" />
            ) : null}
            <span className="text-body-xs text-text-meta">&middot;</span>
            <span className="text-body-xs text-text-meta">{time}</span>
          </div>
        </div>
        <Icon className="shrink-0 text-text-meta" name="signal-success" size="small" />
      </div>
      <div className="space-y-xs pl-[calc(40px+var(--design-spacing-sm))] text-body-sm text-text">
        {children}
      </div>
    </div>
  );
}

function HumanMessageComposer({
  draft,
  isSent,
  onDraftChange,
  onSend,
}: Readonly<{
  draft: string;
  isSent: boolean;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
}>) {
  const canSend = draft.trim().length > 0 && !isSent;

  return (
    <div className="shrink-0 border-t border-border-faint bg-background">
      <div className="flex items-start gap-sm px-lg py-md">
        <textarea
          aria-label={`Write a message to ${pcpCompanyProfile.name}`}
          className="min-h-[112px] flex-1 resize-none rounded-sm border-0 bg-background-neutral-soft px-md py-md text-body-sm text-text outline-none placeholder:text-text-meta disabled:text-text-disabled"
          disabled={isSent}
          onChange={onDraftChange}
          placeholder={isSent ? "Message sent" : "Write a message..."}
          value={draft}
        />
        <GhostIconButton
          icon="chevron-up"
          label="Collapse composer"
          size="medium"
        />
      </div>
      <div className="flex min-h-[56px] items-center justify-between border-t border-border-faint px-lg">
        <div className="flex items-center gap-xs text-icon">
          <GhostIconButton icon="image" label="Add image" size="small" />
          <GhostIconButton icon="link" label="Attach file" size="small" />
          <GhostIconButton icon="gif" label="Add GIF" size="small" />
          <GhostIconButton icon="emoji" label="Add emoji" size="small" />
        </div>
        <div className="flex items-center gap-sm">
          <Button disabled={!canSend} onClick={onSend} size="small">
            Send
          </Button>
          <GhostIconButton
            icon="overflow-web-ios"
            label="More compose actions"
            size="small"
          />
        </div>
      </div>
    </div>
  );
}

function HumanCompanyMessagePanel({
  className,
  draft,
  onClose,
  onDraftChange,
  onMinimize,
  onSend,
  sentMessage,
  style,
}: Readonly<{
  className?: string;
  draft: string;
  onClose: () => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onMinimize: () => void;
  onSend: () => void;
  sentMessage: string | null;
  style?: CSSProperties;
}>) {
  return (
    <aside
      aria-label={`${pcpCompanyProfile.name} human message thread`}
      className={cx(
        "pcp-human-messaging-surface fixed bottom-0 z-40 hidden h-[min(calc(100dvh_-_96px),690px)] flex-col overflow-hidden rounded-t-sm border border-b-0 border-border-faint bg-background text-text shadow-raised-faint-upward transition-[height,width,right,bottom,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:flex",
        className,
      )}
      style={style}
    >
      <header className="flex min-h-[var(--design-layout-panel-header-height)] shrink-0 items-center justify-between border-b border-border-faint bg-background pl-xxl pr-lg">
        <div className="flex min-w-0 items-center gap-sm py-sm">
          <CompanyLogo className="size-10" />
          <div className="min-w-0">
            <h2 className="truncate text-heading-md text-text">
              {pcpCompanyProfile.name}
            </h2>
            <p className="mt-xxs truncate text-body-xs text-text-meta">
              Average response time: Within 1 hour
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0">
          <GhostIconButton
            icon="overflow-web-ios"
            label="More message actions"
            size="small"
          />
          <GhostIconButton
            icon="chevron-down"
            label="Dock message thread"
            onClick={onMinimize}
            size="small"
          />
          <GhostIconButton
            icon="close"
            label="Close message thread"
            onClick={onClose}
            size="small"
          />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="px-lg py-xl">
          <CompanyLogo className="size-[72px]" />
          <div className="mt-md flex flex-wrap items-baseline gap-xs">
            <h3 className="text-heading-md text-text">
              {pcpCompanyProfile.name}
            </h3>
            <span className="text-body-sm text-text-meta">&middot;</span>
            <span className="text-body-sm text-text-meta">Following</span>
          </div>
          <p className="mt-xs text-body-sm text-text">
            {pcpCompanyProfile.industry}
          </p>
          <p className="mt-xxs text-body-xs text-text-meta">Other</p>
        </section>

        <div className="px-lg">
          <HumanMessageDivider label="May 18" />
          <div className="space-y-xl pb-xl">
            <HumanMessageEntry
              author="Cheri Sparks"
              avatarSrc={assetSrc("avatar-2.png")}
              time="4:02 PM"
            >
              <p>Hi Velora,</p>
              <p>
                I found your Premium Company Page and I am interested in
                learning whether Velora could help my agency manage client
                payments and contractor payouts.
              </p>
            </HumanMessageEntry>
            <HumanMessageEntry
              author="Cheri Sparks"
              avatarSrc={assetSrc("avatar-2.png")}
              time="4:37 PM"
            >
              <p>Also curious whether this is the right place to ask.</p>
            </HumanMessageEntry>
            <HumanMessageEntry
              author={pcpCompanyProfile.name}
              avatarSrc={pcpCompanyProfile.logoSrc}
              time="4:38 PM"
            >
              <p>Thanks for reaching out. A Velora admin can help here.</p>
            </HumanMessageEntry>
          </div>

          <button
            className="sticky bottom-lg ml-auto flex size-8 items-center justify-center rounded-round bg-action text-white shadow-raised-faint outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
            type="button"
            aria-label="Jump to latest message"
          >
            <Icon name="arrow-down" size="small" />
          </button>

          <HumanMessageDivider label="Monday" />
          {sentMessage ? (
            <div className="space-y-xl pb-xl pt-lg">
              <HumanMessageEntry
                author="Cheri Sparks"
                avatarSrc={assetSrc("avatar-2.png")}
                time="Now"
              >
                <p>{sentMessage}</p>
              </HumanMessageEntry>
            </div>
          ) : null}
        </div>
      </div>

      <HumanMessageComposer
        draft={draft}
        isSent={Boolean(sentMessage)}
        onDraftChange={onDraftChange}
        onSend={onSend}
      />
    </aside>
  );
}

function HumanCompanyMessageTray({
  className,
  onClose,
  onOpen,
  style,
}: Readonly<{
  className?: string;
  onClose: () => void;
  onOpen: () => void;
  style?: CSSProperties;
}>) {
  return (
    <ChatTray
      actionSize="small"
      aria-expanded={false}
      aria-haspopup="dialog"
      aria-label={`Open ${pcpCompanyProfile.name} message thread`}
      className={cx(
        "pcp-human-messaging-surface fixed bottom-0 left-4 right-4 z-40 mx-auto w-[calc(100vw_-_32px)] max-w-[var(--design-layout-chat-tray-width,384px)] !rounded-t-sm !transition-[height,width,right,bottom,transform,background-color,border-color,box-shadow] !duration-[var(--design-motion-duration-moderate)] !ease-emphasized md:left-auto md:mx-0 md:!w-[216px] md:!max-w-[216px]",
        className,
      )}
      identity={{
        type: "ai",
        title: pcpCompanyProfile.name,
        icon: <CompanyLogo className="size-7" />,
      }}
      onClose={onClose}
      onOpen={onOpen}
      showCloseAction
      style={style}
      variant="collapsed"
    />
  );
}

function PremiumMark({
  size = "small",
  tone = "brand",
}: Readonly<{ size?: "small" | "medium"; tone?: "brand" | "inbug" }>) {
  return (
    <Icon
      aria-hidden="true"
      className={cx(
        "shrink-0",
        tone === "inbug" ? "text-premium-inbug" : "text-premium-brand",
      )}
      name="linked-in-bug"
      size={size}
    />
  );
}

function CompanyLogo({ className }: Readonly<{ className?: string }>) {
  return (
    <span
      className={cx(
        "relative inline-flex items-center justify-center overflow-hidden bg-[#ACF5B3]",
        VELORA_LOGO_AVATAR_RADIUS_CLASS,
        className,
      )}
    >
      <Image
        alt={pcpCompanyProfile.name}
        className="size-full object-cover"
        height={200}
        src={pcpCompanyProfile.logoSrc}
        width={200}
      />
    </span>
  );
}

function Hero({
  onSendMessage,
}: Readonly<{
  onSendMessage: () => void;
}>) {
  const menuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node | null;

      if (!target) {
        return;
      }

      if (menuRef.current?.contains(target)) {
        return;
      }

      if (triggerRef.current?.contains(target)) {
        return;
      }

      setIsMenuOpen(false);
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  function handleSendMessageSelect() {
    setIsMenuOpen(false);
    onSendMessage();
  }

  return (
    <section className="relative overflow-hidden bg-[#041838] text-white">
      <Image
        alt=""
        className="absolute inset-0 size-full object-cover"
        height={2415}
        priority
        src={pcpCompanyProfile.heroSrc}
        width={3840}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041838] via-[#041838]/35 to-black/15" />

      <div className="relative min-h-[560px] px-lg sm:min-h-[520px]">
        <div className="mx-auto flex min-h-[560px] w-full max-w-[1128px] flex-col justify-end gap-xxl pb-0 pt-stack sm:min-h-[520px]">
          <div className="grid gap-xxl lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="max-w-[720px] pb-xxl">
              <CompanyLogo className="size-24 border-2 border-white shadow-raised-faint" />
              <div className="mt-lg flex flex-wrap items-center gap-xs">
                <h1 className="text-display-xl text-[var(--figma-color-text-color-text-overlay)]">
                  {pcpCompanyProfile.name}
                </h1>
                <span className="inline-flex translate-y-[5px] items-center gap-xs self-center">
                  <Icon name="verified" size="medium" label="Verified" />
                  <PremiumMark size="medium" />
                </span>
              </div>
              <p className="mt-xs max-w-[640px] text-body-md text-[var(--figma-color-text-color-text-overlay)]">
                {pcpCompanyProfile.tagline}
              </p>
              <p className="mt-xs flex max-w-[640px] flex-wrap items-center gap-x-xs gap-y-xxs text-body-sm text-[var(--figma-color-text-color-text-overlay)]">
                {companyMetadata.map((item, index) => (
                  <span key={item} className="inline-flex items-center gap-xs">
                    {index > 0 ? (
                      <span
                        aria-hidden="true"
                        className="text-body-xs text-[var(--figma-color-text-color-text-overlay)]"
                      >
                        &middot;
                      </span>
                    ) : null}
                    <span>{item}</span>
                  </span>
                ))}
              </p>
              <p className="mt-md flex items-center gap-xs text-control-sm text-[var(--figma-color-text-color-text-overlay)]">
                <Entity
                  label="Tia"
                  size={24}
                  src={`${PCP_ASSET_ROOT}/avatar-2.png`}
                />
                {pcpCompanyProfile.socialProof}
              </p>
              <div className="mt-md flex flex-wrap gap-sm">
                <Button
                  className="!border-transparent !bg-[var(--figma-color-icon-color-icon-overlay)] !text-[var(--figma-color-label-color-label)] hover:!bg-[var(--figma-color-icon-color-icon-overlay-hover)] active:!bg-[var(--figma-color-background-color-background-knockout-active)]"
                  leadingIcon={<Icon name="add" />}
                  size="medium"
                  variant="tertiary"
                >
                  Follow
                </Button>
                <Button
                  className="!border-[var(--figma-color-border-color-border-knockout)] !bg-transparent !text-[var(--figma-color-label-color-label-knockout)] hover:!border-[var(--figma-color-border-color-border-knockout-hover)] hover:!bg-[var(--figma-color-background-color-background-transparent-overlay-hover)] active:!border-[var(--figma-color-border-color-border-knockout-active)] active:!bg-[var(--figma-color-background-color-background-transparent-overlay-active)] active:!text-[var(--figma-color-label-color-label-knockout-active)]"
                  leadingIcon={
                    <Icon className="text-white" name="send" />
                  }
                  size="medium"
                  variant="tertiary"
                >
                  Message
                </Button>
                <div className="relative">
                  <ButtonIcon
                    aria-controls={menuId}
                    aria-expanded={isMenuOpen}
                    aria-haspopup="menu"
                    className="[&>span]:!border-[var(--figma-color-border-color-border-knockout)] [&>span]:!bg-transparent [&>span]:!text-[var(--figma-color-icon-color-icon-overlay)]"
                    icon="overflow-web-ios"
                    label="More actions"
                    onClick={() =>
                      setIsMenuOpen((currentValue) => !currentValue)
                    }
                    ref={triggerRef}
                    size="medium"
                    variant="tertiary"
                    visualState={isMenuOpen ? "active" : "default"}
                  />
                  {isMenuOpen ? (
                    <div
                      aria-label={`${pcpCompanyProfile.name} actions`}
                      className="absolute left-0 top-[calc(100%+var(--design-spacing-sm))] z-50 min-w-[256px] overflow-hidden rounded-sm border border-border-faint bg-background py-sm text-text shadow-raised-faint-upward"
                      id={menuId}
                      ref={menuRef}
                      role="menu"
                    >
                      <button
                        className="flex min-h-12 w-full items-center gap-md px-lg text-left text-control-md text-text outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
                        onClick={handleSendMessageSelect}
                        role="menuitem"
                        type="button"
                      >
                        <Icon
                          className="shrink-0 text-icon"
                          name="send"
                          size="medium"
                        />
                        <span>Send a message</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="mb-xxl rounded-sm bg-white/0 p-lg text-[var(--figma-color-text-color-text-overlay)]">
              <Icon className="text-[#ACF5B3]" name="quote" size="medium" />
              <p className="mt-sm text-body-md-open">
                {pcpCompanyProfile.testimonial.quote}
              </p>
              <div className="mt-md flex items-center gap-sm">
                <Entity
                  label={pcpCompanyProfile.testimonial.author}
                  size={32}
                  src={pcpCompanyProfile.testimonial.avatarSrc}
                />
                <div>
                  <p className="text-control-md">
                    {pcpCompanyProfile.testimonial.author}
                  </p>
                  <p className="text-supportive-s text-[var(--figma-color-text-color-text-overlay-hover)]">
                    {pcpCompanyProfile.testimonial.role}
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <nav
            aria-label={`${pcpCompanyProfile.name} sections`}
            className="flex min-h-[49px] overflow-x-auto border-t border-white/15"
            role="tablist"
          >
            {pageTabs.map((tab) => (
              <TabItemHorizontal
                key={tab}
                label={tab}
                selected={tab === "Home"}
                tone="overlay"
              />
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

function Card({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <section
      className={cx(
        "overflow-hidden rounded-sm border border-border-faint bg-background",
        className,
      )}
    >
      {children}
    </section>
  );
}

function ModuleHeader({
  title,
  premium = false,
}: Readonly<{ title: string; premium?: boolean }>) {
  return (
    <div
      className={cx(
        "bg-background pb-0 pl-xxl pr-lg pt-xxl",
        premium && "flex flex-col gap-sm",
      )}
    >
      {premium ? (
        <div className="flex items-center gap-xxs text-body-xs text-text">
          <PremiumChipSmall className="size-3" />
          <span>Premium</span>
        </div>
      ) : null}
      <h2 className="text-heading-lg text-text">{title}</h2>
    </div>
  );
}

function ModuleFooter({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex justify-center border-t border-border-faint">
      {children}
    </div>
  );
}

function EntityPile({
  size = 24,
}: Readonly<{ size?: 24 | 32 | 40 }>) {
  return (
    <span className="flex shrink-0 items-center">
      {[
        `${PCP_ASSET_ROOT}/avatar-1.png`,
        `${PCP_ASSET_ROOT}/avatar-2.png`,
        `${PCP_ASSET_ROOT}/avatar-3.png`,
      ].map((image, index) => (
        <Entity
          key={image}
          className={cx(index > 0 && "-ml-xs", "ring-2 ring-background")}
          label=""
          size={size}
          src={assetSrc(image)}
        />
      ))}
    </span>
  );
}

function ReactionPile() {
  return (
    <span className="flex items-center">
      {["bg-action", "bg-caution", "bg-positive"].map((color, index) => (
        <span
          key={color}
          className={cx(
            "inline-flex size-4 items-center justify-center rounded-round border border-background text-[8px] text-white",
            index > 0 && "-ml-xs",
            color,
          )}
        >
          <span className="size-1 rounded-round bg-current" />
        </span>
      ))}
    </span>
  );
}

function CarouselButton({ label }: Readonly<{ label: string }>) {
  return (
    <OverlayButtonIcon
      className="absolute right-xxl top-1/2 z-10 -translate-y-1/2 translate-x-1/2"
      color="white"
      icon="chevron-right"
      label={label}
      size="small"
    />
  );
}

function ProfileQuestionNudgeCard({
  onPromptSelect,
}: Readonly<{
  onPromptSelect: (prompt: (typeof profileQuestionPrompts)[number]) => void;
}>) {
  const promptScrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPromptsLeft, setCanScrollPromptsLeft] = useState(false);
  const [canScrollPromptsRight, setCanScrollPromptsRight] = useState(false);

  function updatePromptScrollState() {
    const scroller = promptScrollerRef.current;

    if (!scroller) {
      return;
    }

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;

    setCanScrollPromptsLeft(scroller.scrollLeft > 1);
    setCanScrollPromptsRight(scroller.scrollLeft < maxScrollLeft - 1);
  }

  function scrollPromptRow(direction: "left" | "right") {
    const scroller = promptScrollerRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollBy({
      behavior: "smooth",
      left:
        direction === "right"
          ? Math.max(scroller.clientWidth * 0.8, 240)
          : -Math.max(scroller.clientWidth * 0.8, 240),
    });
  }

  useEffect(() => {
    updatePromptScrollState();

    window.addEventListener("resize", updatePromptScrollState);

    return () => {
      window.removeEventListener("resize", updatePromptScrollState);
    };
  }, []);

  return (
    <Card>
      <div className="relative px-xxl py-xl">
        <div className="flex items-center gap-xs text-control-sm text-text">
          <Icon className="shrink-0 text-ai-icon" name="signal-ai" size="small" />
          <span>Based on your profile</span>
        </div>
        <h2 className="mt-sm text-heading-lg text-text">
          Top questions from agency founders
        </h2>
        <div className="relative mt-lg">
          <div
            className="flex gap-md overflow-x-auto overflow-y-hidden pr-xxl scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={updatePromptScrollState}
            ref={promptScrollerRef}
          >
            {profileQuestionPrompts.map((prompt) => (
              <Prompt
                className="h-14 w-fit shrink-0 rounded-sm px-lg py-0 text-body-md"
                key={prompt}
                onPromptSelect={() => onPromptSelect(prompt)}
                prompt={prompt}
              >
                <span className="inline-flex min-w-0 items-center gap-xs">
                  <Icon
                    className="shrink-0 text-ai-icon"
                    name="signal-ai"
                    size="small"
                  />
                  <span className="min-w-0 whitespace-nowrap">{prompt}</span>
                </span>
              </Prompt>
            ))}
          </div>
          {canScrollPromptsLeft ? (
            <OverlayButtonIcon
              className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              color="white"
              icon="chevron-left"
              label="View previous suggested questions"
              onClick={() => scrollPromptRow("left")}
              size="small"
            />
          ) : null}
          {canScrollPromptsRight ? (
            <OverlayButtonIcon
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2"
              color="white"
              icon="chevron-right"
              label="View more suggested questions"
              onClick={() => scrollPromptRow("right")}
              size="small"
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function OverviewCard() {
  return (
    <Card>
      <ModuleHeader title="Overview" />
      <div className="flex flex-col gap-lg px-xxl pb-xl pt-lg">
        <div className="relative overflow-hidden">
          <p className="line-clamp-3 pr-stack text-body-sm-open text-text">
            {pcpCompanyProfile.name} helps small agencies manage client
            payments, contractor payout timing, and approval dependencies in
            one place. It is built for owners whose payment operations have
            outgrown spreadsheets but not their team size.
          </p>
          <span className="absolute bottom-0 right-0 bg-background pl-xs text-body-sm text-text-meta">
            more
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-md px-xxl pb-lg">
        <h3 className="text-control-sm text-text">
          Highlights from {pcpCompanyProfile.name}
        </h3>
        <div className="grid gap-lg sm:grid-cols-2">
          {overviewHighlights.map((highlight) => (
            <article
              className="flex min-w-0 items-start gap-sm rounded-sm border border-border-faint p-lg"
              key={highlight.title}
            >
              <Entity
                className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
                label={highlight.title}
                shape="square"
                size={40}
                style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
                src={assetSrc(highlight.image)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start gap-xs">
                  <p className="min-w-0 truncate text-control-sm text-text">
                    {highlight.title}
                  </p>
                  <Icon
                    className="mt-xxs text-icon"
                    name="link-external"
                    size="small"
                  />
                </div>
                <p className="text-supportive-s text-text-meta">
                  {highlight.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function FeaturedCard() {
  return (
    <Card>
      <ModuleHeader title="Featured" />
      <div className="px-xxl pb-xl pt-lg">
        <div className="relative overflow-hidden rounded-sm">
          <Image
            alt="Featured customer video"
            className="aspect-[16/9] w-full object-cover"
            height={410}
        src={assetSrc("hero-cover-1.png")}
            width={720}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <span className="absolute left-1/2 top-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-round bg-black/70 text-white">
            <Icon name="play" size="medium" />
          </span>
        </div>
        <p className="mt-sm flex items-center gap-xs text-supportive-s text-text-meta">
          <PremiumChipSmall />
          Featured with Premium Pages
        </p>
        <div className="mt-md grid gap-lg sm:grid-cols-2">
          <MiniContentCard
            image="media-2.png"
            title="When client payments slip, contractor trust is what customers remember."
            meta="9,430 - 115 comments"
          />
          <MiniContentCard
            image="video-2.png"
            title="How a creative agency stopped tracking contractor payouts in spreadsheets."
            meta="12,430 - 713 comments"
          />
        </div>
      </div>
    </Card>
  );
}

function MiniContentCard({
  image,
  title,
  meta,
}: Readonly<{ image: string; title: string; meta: string }>) {
  return (
    <article className="flex min-w-0 gap-md overflow-hidden rounded-sm border border-border-faint p-md">
      <Image
        alt=""
        className="size-[84px] shrink-0 rounded-xs object-cover"
        height={84}
        src={assetSrc(image)}
        width={84}
      />
      <div className="min-w-0">
        <p className="line-clamp-3 text-body-sm text-text">{title}</p>
        <p className="mt-sm text-supportive-s text-text-meta">{meta}</p>
      </div>
    </article>
  );
}

function PostCard({
  title,
  body,
  image,
  stats,
}: Readonly<{
  title: string;
  body: string;
  image: string;
  stats: string;
}>) {
  return (
    <article className="overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="p-md">
        <div className="flex items-start gap-sm">
          <Entity
            className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
            label={pcpCompanyProfile.name}
            shape="square"
            size={40}
            style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
            src={pcpCompanyProfile.logoSrc}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-control-sm text-text">
              {pcpCompanyProfile.name}
            </h3>
            <p className="text-supportive-s text-text-meta">
              {pcpCompanyProfile.followers}
            </p>
            <p className="text-supportive-s text-text-meta">11h</p>
          </div>
          <Icon className="text-text-meta" name="overflow-web-ios" size="medium" />
        </div>
        <p className="mt-md text-control-sm text-text">{title}</p>
        <p className="mt-xs line-clamp-3 text-body-sm text-text">{body}</p>
      </div>
      <Image
        alt=""
        className="aspect-[16/9] w-full object-cover"
        height={272}
        src={assetSrc(image)}
        width={484}
      />
      <div className="flex items-center justify-between border-t border-border-faint px-md py-sm text-supportive-s text-text-meta">
        <span>{stats}</span>
        <span>1 comment</span>
      </div>
      <div className="grid grid-cols-4 border-t border-border-faint text-text-meta">
        {[
          ["thumbs-up-outline", "Like"],
          ["comment", "Comment"],
          ["repost", "Repost"],
          ["send", "Send"],
        ].map(([icon, label]) => (
          <button
            key={label}
            className="flex min-h-10 items-center justify-center gap-xs text-supportive-s hover:bg-background-transparent-hover"
            type="button"
          >
            <Icon name={icon as IconName} size="small" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </article>
  );
}

function ProductsCard() {
  const serviceGalleryImages = products.map((product) => product.image);
  const serviceNames = serviceKeywords.join(" · ");

  return (
    <Card>
      <ModuleHeader title="Services" />
      <div className="px-xxl pb-xl pt-xxl">
        <div className="relative">
          <div className="flex gap-lg overflow-hidden">
            {serviceGalleryImages.map((image) => (
              <Image
                alt=""
                className="h-[188px] w-[min(420px,calc(100vw-80px))] shrink-0 rounded-sm object-cover"
                height={188}
                key={image}
                src={assetSrc(image)}
                width={420}
              />
            ))}
          </div>
          <CarouselButton label="View more service images" />
        </div>

        <div className="mt-md flex justify-center gap-md" aria-hidden="true">
          {serviceGalleryImages.map((image, index) => (
            <span
              className={cx(
                "size-2 rounded-round border border-text",
                index === 0 ? "bg-text" : "bg-transparent",
              )}
              key={image}
            />
          ))}
        </div>

        <div className="mt-xl max-w-[960px]">
          <p className="text-body-sm text-text">
            Velora helps agency teams coordinate client payment timing,
            contractor obligations, and project approvals in one workflow.
            Teams can understand what is ready, blocked, or waiting on follow-up
            before payouts turn into spreadsheet work.
          </p>

          <div className="mt-lg">
            <h3 className="text-heading-md text-text">Services provided</h3>
            <p className="mt-sm text-body-sm text-text">{serviceNames}</p>
          </div>

          <Button className="mt-lg w-full" size="medium" variant="tertiary">
            Request services
          </Button>
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all services
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function LeaderCard({
  leader,
}: Readonly<{ leader: (typeof leaders)[number] }>) {
  return (
    <article className="flex min-w-[160px] flex-1 flex-col items-center rounded-md border border-border-faint p-md text-center">
      <Entity
        label={leader.name}
        size={80}
        src={assetSrc(leader.image)}
      />
      <div className="mt-md min-h-[63px]">
        <p className="truncate text-control-md text-text">{leader.name}</p>
        <p className="mt-xxs text-body-sm text-text-meta">{leader.role}</p>
        <p className="mt-sm text-supportive-s text-text-meta">
          {leader.followers}
        </p>
      </div>
      <Button className="mt-md w-full" size="small" variant="tertiary">
        Follow
      </Button>
    </article>
  );
}

function LeaderPostCard({
  post,
}: Readonly<{ post: (typeof leaderPosts)[number] }>) {
  return (
    <article className="flex h-[324px] min-w-[236px] flex-1 flex-col overflow-hidden rounded-sm border border-border-faint">
      <div className="flex items-start gap-sm px-md py-md">
        <Entity
          label={post.author}
          size={32}
          src={assetSrc(post.avatar)}
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-xxs truncate text-control-sm text-text">
            {post.author}
            <PremiumMark tone="inbug" />
          </p>
          <p className="text-supportive-s text-text-meta">5d</p>
        </div>
        <Icon className="text-icon" name="overflow-web-ios" size="small" />
      </div>
      <p className="line-clamp-4 px-md text-body-sm text-text">{post.body}</p>
      {post.image ? (
        <Image
          alt=""
          className="mt-sm h-[96px] w-full object-cover"
          height={112}
          src={assetSrc(post.image)}
          width={240}
        />
      ) : null}
      {post.linkTitle ? (
        <div className="bg-background-neutral-soft p-md">
          <p className="line-clamp-2 text-control-sm text-text">
            {post.linkTitle}
          </p>
          <p className="text-supportive-s text-text-meta">{post.linkMeta}</p>
        </div>
      ) : null}
      <div className="mt-auto flex items-center gap-xs px-md py-sm text-supportive-s text-text-meta">
        <ReactionPile />
        <span>[X]</span>
        <span>[X] comments</span>
      </div>
      <div className="grid grid-cols-4 border-t border-border-faint px-xs">
        {[
          ["thumbs-up-outline", "Like"],
          ["comment", "Comment"],
          ["repost", "Repost"],
          ["send", "Send"],
        ].map(([icon, label]) => (
          <button
            key={label}
            aria-label={label}
            className="flex min-h-[48px] items-center justify-center text-icon hover:bg-background-transparent-hover"
            type="button"
          >
            <Icon name={icon as IconName} size="small" />
          </button>
        ))}
      </div>
    </article>
  );
}

function LeadersCard() {
  return (
    <Card>
      <ModuleHeader title="Meet the leaders" />
      <div className="px-xxl pb-lg pt-xxl">
        <div className="grid gap-lg sm:grid-cols-2 xl:grid-cols-4">
          {leaders.map((leader) => (
            <LeaderCard key={leader.name} leader={leader} />
          ))}
        </div>
        <h3 className="mt-xxxl text-control-md text-text">
          See what they are talking about
        </h3>
        <div className="relative mt-lg">
          <div className="flex gap-lg overflow-hidden">
            {leaderPosts.map((post) => (
              <LeaderPostCard key={post.author} post={post} />
            ))}
          </div>
          <CarouselButton label="View more leader posts" />
        </div>
        <p className="mt-md flex items-center gap-xs text-supportive-s text-text-meta">
          <PremiumChipSmall />
          Featured with Premium Pages
        </p>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all leaders
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function EventCard() {
  return (
    <Card>
      <ModuleHeader title="Event" />
      <div className="p-xxl">
        <article className="flex flex-col gap-lg rounded-sm border border-border-faint p-xxl sm:flex-row">
          <Image
            alt=""
            className="aspect-video min-w-0 flex-1 rounded-xs object-cover"
            height={220}
            src={assetSrc("event-launch.png")}
            width={360}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-lg">
            <div className="space-y-xs">
              <span className="inline-flex rounded-xs bg-tag-supportive-1-background px-sm py-xxs text-body-sm text-text">
                Upcoming
              </span>
              <p className="text-body-sm text-text-meta">
                Wed, 06/18/2025, 5:00 PM
              </p>
              <h3 className="text-control-md text-text">
                Live workshop: keeping contractor payments clear when clients pay late
              </h3>
              <p className="text-body-sm text-text">
                Hosted by {pcpCompanyProfile.name}
              </p>
              <p className="text-body-sm text-text-meta">
                Live Video &middot; 342 registrations
              </p>
            </div>
            <div className="flex items-center gap-sm">
              <Button size="small" variant="tertiary">
                View event
              </Button>
              <ButtonIcon
                icon="share-linked-in"
                label="Share event"
                size="small"
                variant="tertiary"
              />
            </div>
          </div>
        </article>
      </div>
    </Card>
  );
}

function JobLockup({ title }: Readonly<{ title: string }>) {
  return (
    <div className="flex min-w-[256px] flex-1 items-start gap-sm">
      <Entity
        className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
        label={pcpCompanyProfile.name}
        shape="square"
        size={40}
        style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
        src={pcpCompanyProfile.logoSrc}
      />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-xxs truncate text-control-md text-text">
          {title}
          <Icon className="shrink-0 text-icon" name="verified" size="small" />
        </p>
        <p className="text-supportive-s text-text">
          {pcpCompanyProfile.location}
        </p>
      </div>
    </div>
  );
}

function RecentJobOpeningsCard() {
  return (
    <Card>
      <ModuleHeader title="Recent job openings" />
      <div className="flex flex-wrap gap-lg p-xxl">
        {mainJobOpenings.map((job) => (
          <JobLockup key={job} title={job} />
        ))}
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all 2 jobs
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function LifeAtVeloraCard() {
  return (
    <Card>
      <ModuleHeader title={`Life at ${pcpCompanyProfile.name}`} />
      <div className="grid gap-lg p-xxl sm:grid-cols-2">
        <Image
          alt=""
          className="aspect-video w-full rounded-xs object-cover"
          height={260}
          src={assetSrc("life-at-sierra.png")}
          width={460}
        />
        <div>
          <h3 className="text-control-md text-text">
            Built around agency payment complexity
          </h3>
          <p className="mt-xs text-body-sm-open text-text">
            {pcpCompanyProfile.name} helps agency teams connect client invoice
            timing, contractor obligations, and project approvals in one place.
          </p>
          <p className="text-body-sm-open text-text">
            {pcpCompanyProfile.founderName} founded the company for small teams
            that need payment clarity without adding another spreadsheet or
            finance operations layer.
          </p>
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function PremiumInsightsCard() {
  return (
    <Card>
      <ModuleHeader
        premium
        title={`Exclusive insights on ${pcpCompanyProfile.name}`}
      />
      <div className="grid gap-xxl p-xxl md:grid-cols-[300px_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h3 className="text-control-md text-text">Visitor interest trends</h3>
          <TrendGraph />
        </div>
        <div>
          <h3 className="text-control-md text-text">Consultation intent</h3>
          <div className="mt-md flex items-center gap-xs">
            <Icon className="rotate-180 text-positive" name="caret" size="small" />
            <p className="text-heading-xl text-text">18%</p>
          </div>
          <p className="text-supportive-s text-text-meta">CTA click lift</p>
          <p className="mt-md text-supportive-s text-text-meta">
            And more visitor-to-lead signals
          </p>
        </div>
        <div>
          <h3 className="text-control-md text-text">18 qualified visitors</h3>
          <div className="mt-lg flex items-center">
            <EntityPile size={40} />
            <span className="-ml-xs inline-flex size-10 items-center justify-center rounded-round border border-border-faint bg-background text-body-sm text-text-meta">
              +9
            </span>
          </div>
          <p className="mt-lg text-supportive-s text-text-meta">
            Including agency founders and operations leads from target accounts
          </p>
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all Premium insights
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function NewslettersCard() {
  return (
    <Card>
      <ModuleHeader title="Newsletters" />
      <div className="relative p-xxl">
        <div className="flex gap-lg overflow-hidden">
          {newsletters.map((newsletter) => (
            <article
              className="flex min-h-[197px] w-[min(362px,calc(100vw-80px))] shrink-0 flex-col justify-between rounded-sm border border-border-faint p-lg"
              key={newsletter.title}
            >
              <div>
                <div className="flex items-center gap-sm">
                  <Entity
                    className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
                    label={newsletter.title}
                    shape="square"
                    size={48}
                    style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
                    src={pcpCompanyProfile.logoSrc}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-control-md text-text">
                      {newsletter.title}
                    </p>
                    <p className="text-supportive-s text-text-meta">
                      {newsletter.meta}
                    </p>
                  </div>
                </div>
                <p className="mt-lg line-clamp-3 text-body-sm-open text-text">
                  {newsletter.body}
                </p>
              </div>
              <Button
                className="mt-lg self-start"
                leadingIcon={<Icon name="add" />}
                size="small"
                variant="tertiary"
              >
                Subscribe
              </Button>
            </article>
          ))}
        </div>
        <CarouselButton label="View more newsletters" />
      </div>
    </Card>
  );
}

function TrendGraph() {
  return (
    <div className="mt-md h-24 w-full text-text-meta">
      <svg
        aria-hidden="true"
        className="h-full w-full"
        focusable="false"
        viewBox="0 0 300 96"
      >
        <line
          stroke="currentColor"
          strokeDasharray="2 3"
          strokeOpacity="0.25"
          x1="0"
          x2="300"
          y1="18"
          y2="18"
        />
        <line
          stroke="currentColor"
          strokeOpacity="0.25"
          x1="0"
          x2="300"
          y1="62"
          y2="62"
        />
        <polyline
          fill="none"
          points="0,48 48,36 96,32 144,20 192,30 240,14 300,26"
          stroke="var(--figma-color-positive-color-positive)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <text fill="currentColor" fontSize="12" x="8" y="88">
          Apr 2024
        </text>
        <text fill="currentColor" fontSize="12" x="124" y="88">
          Oct 2024
        </text>
        <text fill="currentColor" fontSize="12" x="232" y="88">
          Apr 2025
        </text>
      </svg>
    </div>
  );
}

function MemberFooter() {
  return (
    <footer className="bg-background-neutral-soft px-xxl py-xxl text-text-meta">
      <div className="grid gap-xxl lg:grid-cols-[minmax(0,1fr)_minmax(260px,1fr)]">
        <div className="grid gap-xxl sm:grid-cols-3">
          {footerLinkColumns.map((column) => (
            <ul key={column.join("-")}>
              {column.map((item) => (
                <li key={item}>
                  <a className="block py-sm text-supportive-s-strong" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="grid gap-xxl sm:grid-cols-[minmax(0,1fr)_minmax(180px,1fr)]">
          <div className="space-y-sm">
            {[
              ["question", "Questions?", "Visit our Help Center."],
              ["settings", "Manage your account and privacy", "Go to your Settings."],
              [
                "shield",
                "Recommendation transparency",
                "Learn more about Recommended Content.",
              ],
            ].map(([icon, title, body]) => (
              <div className="flex gap-sm py-sm" key={title}>
                <Icon name={icon as IconName} size="small" />
                <div>
                  <p className="text-supportive-s-strong">{title}</p>
                  <p className="mt-xxs text-supportive-s">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <label className="block text-body-sm text-text-meta">
            Select Language
            <span className="mt-xxs flex h-8 items-center rounded-xs border border-text-meta bg-background pl-sm text-control-sm">
              English (English)
              <Icon className="ml-auto mr-xs" name="caret" size="small" />
            </span>
          </label>
        </div>
      </div>
      <p className="py-lg text-supportive-s">
        LinkedIn Corporation &copy; 2026
      </p>
    </footer>
  );
}

function PromotedCard() {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border-faint p-md">
        <p className="text-supportive-s text-text-meta">Promoted</p>
        <Icon name="overflow-web-ios" size="small" />
      </div>
      <div className="space-y-lg p-md">
        {sideJobs.slice(0, 3).map((job) => (
          <div key={job} className="flex gap-sm">
            <Entity
              label={pcpCompanyProfile.name}
              shape="square"
              size={32}
            />
            <div>
              <p className="text-control-sm text-text">{job}</p>
              <p className="text-supportive-s text-text-meta">
                {pcpCompanyProfile.location}
              </p>
            </div>
          </div>
        ))}
        <Button className="w-full" size="small" variant="tertiary">
          See more roles
        </Button>
      </div>
    </Card>
  );
}

function SideListCard({
  title,
  items,
  actionLabel,
  type = "page",
}: Readonly<{
  title: string;
  items: Array<string>;
  actionLabel: string;
  type?: "page" | "role";
}>) {
  return (
    <Card>
      <div className="p-lg">
        <h2 className="text-heading-sm text-text">{title}</h2>
        <div className="mt-md space-y-lg">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-sm">
              <Entity
                label={type === "role" ? pcpCompanyProfile.name : item}
                shape="square"
                size={40}
              />
              <div className="min-w-0 flex-1">
                <p className="text-control-sm text-text">{item}</p>
                <p className="text-supportive-s text-text-meta">
                  {type === "role"
                    ? pcpCompanyProfile.location
                    : "Financial services software"}
                </p>
                <Button className="mt-sm" size="small" variant="tertiary">
                  {type === "role" ? "View role" : "Follow"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center border-t border-border-faint">
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          {actionLabel}
        </GhostButton>
      </div>
    </Card>
  );
}

export function PremiumCompanyPagesMemberPage({
  memberIntent = "buyer",
  shellMode = "fab",
}: Readonly<{
  memberIntent?: VcaMemberIntent;
  shellMode?: VcaShellMode;
}>) {
  return (
    <PremiumCompanyPagesSeparateMemberPage
      entryMode={shellMode}
      memberIntent={memberIntent}
    />
  );
}

function PremiumCompanyPagesSeparateMemberPage({
  entryMode,
  memberIntent,
}: Readonly<{ entryMode: VcaShellMode; memberIntent: VcaMemberIntent }>) {
  const isFabEntryMode = entryMode === "fab";
  const isJobSeekerIntent = memberIntent === "job-seeker";
  const vcaPanelId = useId();
  const [aiSurfaceState, setAiSurfaceState] =
    useState<MessagingSurfaceState>(() =>
      isFabEntryMode ? "docked" : "closed",
    );
  const [humanSurfaceState, setHumanSurfaceState] =
    useState<MessagingSurfaceState>("closed");
  const [vcaPanelVariant, setVcaPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [vcaConversationStage, setVcaConversationStage] =
    useState<VcaConversationStage>("opening");
  const [vcaVisitorQuestion, setVcaVisitorQuestion] =
    useState<string | null>(null);
  const [vcaFollowUpQuestion, setVcaFollowUpQuestion] =
    useState<string | null>(null);
  const [vcaDraft, setVcaDraft] = useState("");
  const [humanDraft, setHumanDraft] = useState("");
  const [humanSentMessage, setHumanSentMessage] = useState<string | null>(null);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [isGlobalInboxExpanded, setIsGlobalInboxExpanded] = useState(false);
  const isVcaOpen = aiSurfaceState === "open";
  const isVcaEntryVisible = aiSurfaceState === "docked";
  const isHumanMessagePanelOpen = humanSurfaceState === "open";
  const isHumanMessageTrayVisible = humanSurfaceState === "docked";
  const shouldShowHumanMessageTray =
    isHumanMessageTrayVisible && !(isFabEntryMode && isVcaOpen);
  const stackedTrayBaseRightExpression =
    "calc(var(--design-spacing-xxl) + 288px + var(--design-spacing-lg))";
  const trayGapExpression = "var(--design-spacing-lg)";
  const humanDockedTrayWidthExpression = "216px";
  const humanPanelWidthExpression = "640px";
  const humanTrayRightExpression = stackedTrayBaseRightExpression;
  const aiTrayRightExpression =
    humanSurfaceState === "open"
      ? `calc(${stackedTrayBaseRightExpression} + ${humanPanelWidthExpression} + ${trayGapExpression})`
      : humanSurfaceState === "docked"
        ? `calc(${stackedTrayBaseRightExpression} + ${humanDockedTrayWidthExpression} + ${trayGapExpression})`
        : stackedTrayBaseRightExpression;
  const humanTrayStyle = {
    "--pcp-human-tray-right": humanTrayRightExpression,
  } as CSSProperties;
  const aiTrayStyle = {
    "--pcp-ai-tray-right": aiTrayRightExpression,
  } as CSSProperties;
  const globalInboxHeightExpression = isGlobalInboxExpanded
    ? "min(calc(100dvh - 96px), 690px)"
    : "var(--design-layout-chat-tray-height, 48px)";
  const vcaFabStyle = {
    "--pcp-vca-fab-bottom": `calc(${globalInboxHeightExpression} + var(--design-spacing-md))`,
  } as CSSProperties;
  const humanPanelDesktopRightClass =
    "md:right-[calc(var(--design-spacing-xxl)+288px+var(--design-spacing-lg))]";
  const vcaSeparateDesktopRightClass =
    "md:right-[var(--pcp-ai-tray-right)]";
  const vcaFloatingDesktopRightClass = "md:right-6";
  const isExpandedVcaSurface =
    vcaPanelVariant === "expanded" || isCaseStudyOpen || isJobOpen;
  const shouldShowGlobalInboxTray =
    !isExpandedVcaSurface && !(isFabEntryMode && isVcaOpen);
  const vcaSurfacePanelPositionClass =
    isExpandedVcaSurface
      ? cx(
          "md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(calc(100dvh_-_48px),860px)] md:-translate-x-1/2 md:-translate-y-1/2",
          isCaseStudyOpen || isJobOpen
            ? "md:w-[min(calc(100vw_-_48px),var(--design-layout-side-panel-expanded-surface-width))]"
            : "md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))]",
        )
      : cx(
          "md:inset-auto",
          isFabEntryMode
            ? "md:bottom-6 md:h-[min(calc(100dvh_-_96px),var(--design-layout-panel-collapsed-height))]"
            : "md:bottom-0 md:h-[min(calc(100dvh_-_72px),var(--design-layout-panel-collapsed-height))]",
          isFabEntryMode
            ? "md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
            : "md:w-[min(calc(100vw_-_var(--pcp-ai-tray-right)_-_var(--design-spacing-xxl)),var(--design-layout-panel-collapsed-width))]",
          isFabEntryMode
            ? vcaFloatingDesktopRightClass
            : vcaSeparateDesktopRightClass,
        );

  function resetVcaConversation() {
    setVcaConversationStage("opening");
    setVcaVisitorQuestion(null);
    setVcaFollowUpQuestion(null);
    setVcaDraft("");
    setIsCaseStudyOpen(false);
    setIsJobOpen(false);
  }

  function runMessagingSurfaceTransition(
    updateSurfaceState: () => void,
    transitionClassName?: string,
  ) {
    const viewTransitionDocument = document as ViewTransitionDocument;

    if (
      typeof viewTransitionDocument.startViewTransition !== "function"
    ) {
      updateSurfaceState();
      return;
    }

    const transitionClassNames = ["pcp-messaging-surface-transition"];

    if (transitionClassName) {
      transitionClassNames.push(transitionClassName);
    }

    document.documentElement.classList.add("pcp-messaging-surface-transition");
    if (transitionClassName) {
      document.documentElement.classList.add(transitionClassName);
    }

    const transition = viewTransitionDocument.startViewTransition(() => {
      flushSync(updateSurfaceState);
    });

    void transition.finished.finally(() => {
      document.documentElement.classList.remove(...transitionClassNames);
    });
  }

  function getBackgroundTrayTransitionClass() {
    return isFabEntryMode ? "pcp-background-trays-slide" : undefined;
  }

  function handleOpenVcaWithProfilePrompt(
    prompt: (typeof profileQuestionPrompts)[number],
  ) {
    runMessagingSurfaceTransition(
      () => {
        resetVcaConversation();
        setVcaPanelVariant("collapsed");
        if (!isJobSeekerIntent && prompt === VCA_LATE_PAYMENT_CHIP) {
          setVcaVisitorQuestion(VCA_HERO_QUESTION);
          setVcaConversationStage("postProof");
        } else {
          setVcaVisitorQuestion(prompt);
          setVcaConversationStage("profilePromptAnswered");
        }
        setHumanSurfaceState((currentState) =>
          currentState === "closed" ? "closed" : "docked",
        );
        setAiSurfaceState("open");
      },
      getBackgroundTrayTransitionClass(),
    );
  }

  function handleCloseVca() {
    runMessagingSurfaceTransition(
      () => {
        setAiSurfaceState(isFabEntryMode ? "docked" : "closed");
        setVcaPanelVariant("collapsed");
        resetVcaConversation();
      },
      getBackgroundTrayTransitionClass(),
    );
  }

  function handleOpenVcaFromTray() {
    runMessagingSurfaceTransition(
      () => {
        setVcaPanelVariant("collapsed");
        setIsCaseStudyOpen(false);
        setIsJobOpen(false);
        setHumanSurfaceState((currentState) =>
          currentState === "closed" ? "closed" : "docked",
        );
        setAiSurfaceState("open");
      },
      getBackgroundTrayTransitionClass(),
    );
  }

  function handleMinimizeVcaToTray() {
    runMessagingSurfaceTransition(
      () => {
        setVcaPanelVariant("collapsed");
        setIsCaseStudyOpen(false);
        setIsJobOpen(false);
        setAiSurfaceState("docked");
      },
      getBackgroundTrayTransitionClass(),
    );
  }

  function handleExpandVcaFromTray() {
    runMessagingSurfaceTransition(() => {
      setVcaPanelVariant("expanded");
      setIsCaseStudyOpen(false);
      setIsJobOpen(false);
      setHumanSurfaceState((currentState) =>
        currentState === "closed" ? "closed" : "docked",
      );
      setAiSurfaceState("open");
    });
  }

  function handleToggleVcaPanelVariant() {
    setIsCaseStudyOpen(false);
    setIsJobOpen(false);
    setVcaPanelVariant((currentVariant) =>
      currentVariant === "expanded" ? "collapsed" : "expanded",
    );
  }

  function handleOpenVcaCaseStudy() {
    runMessagingSurfaceTransition(() => {
      setIsCaseStudyOpen(true);
      setIsJobOpen(false);
      setVcaPanelVariant("expanded");
    });
  }

  function handleCloseVcaCaseStudy() {
    runMessagingSurfaceTransition(() => {
      setIsCaseStudyOpen(false);
      setIsJobOpen(false);
      setVcaPanelVariant("collapsed");
      setVcaConversationStage((currentStage) =>
        currentStage === "postProof" ? "caseStudyReturned" : currentStage,
      );
    });
  }

  function handleOpenVcaJob() {
    runMessagingSurfaceTransition(() => {
      setIsCaseStudyOpen(false);
      setIsJobOpen(true);
      setVcaPanelVariant("expanded");
    });
  }

  function handleCloseVcaJob() {
    runMessagingSurfaceTransition(() => {
      setIsJobOpen(false);
      setVcaPanelVariant("collapsed");
    });
  }

  function handleVcaDraftChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setVcaDraft(event.currentTarget.value);
  }

  function handleHumanDraftChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setHumanDraft(event.currentTarget.value);
  }

  function handleOpenHumanMessagePanel() {
    runMessagingSurfaceTransition(() => {
      setAiSurfaceState((currentState) =>
        currentState === "closed" ? "closed" : "docked",
      );
      setVcaPanelVariant("collapsed");
      setIsCaseStudyOpen(false);
      setIsJobOpen(false);
      resetVcaConversation();
      if (!humanSentMessage) {
        setHumanDraft("");
      }
      setHumanSurfaceState("open");
    });
  }

  function handleOpenVcaHandoffMessage() {
    runMessagingSurfaceTransition(() => {
      setVcaConversationStage("handoffOpened");
      setVcaPanelVariant("collapsed");
      setIsCaseStudyOpen(false);
      setIsJobOpen(false);
      if (!humanSentMessage) {
        setHumanDraft(VCA_HANDOFF_MESSAGE);
      }
      setAiSurfaceState("docked");
      setHumanSurfaceState("open");
    });
  }

  function handleMinimizeHumanMessagePanel() {
    runMessagingSurfaceTransition(() => {
      setHumanSurfaceState("docked");
    });
  }

  function handleCloseHumanMessagePanel() {
    runMessagingSurfaceTransition(() => {
      setHumanSurfaceState("closed");
    });
  }

  function handleSendHumanMessage() {
    const trimmedDraft = humanDraft.trim();

    if (!trimmedDraft || humanSentMessage) {
      return;
    }

    runMessagingSurfaceTransition(() => {
      setHumanSentMessage(trimmedDraft);
      setHumanDraft("");
      setVcaPanelVariant("collapsed");
      setIsCaseStudyOpen(false);
      setIsJobOpen(false);
      setVcaConversationStage("handoffOpened");
      setAiSurfaceState((currentState) =>
        currentState === "closed" ? "closed" : "docked",
      );
      setHumanSurfaceState("open");
    });
  }

  function handleVcaPromptSelect(prompt: string) {
    setVcaDraft("");

    if (isJobSeekerIntent) {
      setVcaVisitorQuestion(
        prompt === VCA_JOB_SEEKER_CHIP ? VCA_JOB_SEEKER_QUESTION : prompt,
      );
      setVcaFollowUpQuestion(null);
      setVcaConversationStage("jobProof");
      return;
    }

    if (prompt === VCA_DRAFT_INTRO_PROMPT) {
      setVcaConversationStage("handoffOffered");
      return;
    }

    if (vcaConversationStage === "postProof") {
      setVcaFollowUpQuestion(prompt);
      setVcaConversationStage("handoffOffered");
      return;
    }

    if (vcaConversationStage === "opening") {
      if (
        prompt !== VCA_LATE_PAYMENT_CHIP &&
        prompt in profileQuestionResponses
      ) {
        setVcaVisitorQuestion(prompt);
        setVcaConversationStage("profilePromptAnswered");
        return;
      }

      setVcaVisitorQuestion(
        prompt === VCA_LATE_PAYMENT_CHIP ? VCA_HERO_QUESTION : prompt,
      );
      setVcaConversationStage("postProof");
      return;
    }

    if (vcaConversationStage === "caseStudyReturned") {
      setVcaFollowUpQuestion(prompt);
      setVcaConversationStage("handoffOffered");
      return;
    }

    setVcaFollowUpQuestion(prompt);
    setVcaConversationStage("handoffOffered");
  }

  function handleVcaSend() {
    const trimmedDraft = vcaDraft.trim();

    if (!trimmedDraft) {
      return;
    }

    if (isJobSeekerIntent) {
      setVcaVisitorQuestion(trimmedDraft);
      setVcaFollowUpQuestion(null);
      setVcaConversationStage("jobProof");
      setVcaDraft("");
      return;
    }

    if (
      vcaConversationStage === "opening" ||
      vcaConversationStage === "profilePromptAnswered"
    ) {
      setVcaVisitorQuestion(trimmedDraft);
      setVcaFollowUpQuestion(null);
      setVcaConversationStage("postProof");
      setVcaDraft("");
      return;
    }

    if (
      vcaConversationStage === "postProof" ||
      vcaConversationStage === "caseStudyReturned" ||
      vcaConversationStage === "handoffOffered"
    ) {
      setVcaFollowUpQuestion(trimmedDraft);
      setVcaConversationStage("handoffOffered");
      setVcaDraft("");
      return;
    }

    setVcaDraft("");
  }

  return (
    <main className="min-h-dvh bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation
        profileSrc={assetSrc("avatar-2.png")}
        showAdvertise
      />
      <Hero
        onSendMessage={handleOpenHumanMessagePanel}
      />

      {shouldShowGlobalInboxTray ? (
        <GlobalInboxTray
          isExpanded={isGlobalInboxExpanded}
          onOpenVeloraThread={handleOpenHumanMessagePanel}
          onToggle={() =>
            setIsGlobalInboxExpanded((currentValue) => !currentValue)
          }
        />
      ) : null}

      {isHumanMessagePanelOpen ? (
        <HumanCompanyMessagePanel
          className={cx(
            "md:w-[640px]",
            humanPanelDesktopRightClass,
          )}
          draft={humanDraft}
          onClose={handleCloseHumanMessagePanel}
          onDraftChange={handleHumanDraftChange}
          onMinimize={handleMinimizeHumanMessagePanel}
          onSend={handleSendHumanMessage}
          sentMessage={humanSentMessage}
        />
      ) : null}

      {shouldShowHumanMessageTray ? (
        <HumanCompanyMessageTray
          className="!hidden md:!inline-flex md:!right-[var(--pcp-human-tray-right)]"
          onClose={handleCloseHumanMessagePanel}
          onOpen={handleOpenHumanMessagePanel}
          style={humanTrayStyle}
        />
      ) : null}

      {isVcaEntryVisible && isFabEntryMode ? (
        <div
          className="pcp-ai-messaging-surface fixed bottom-6 right-6 z-50 md:bottom-[var(--pcp-vca-fab-bottom)]"
          style={vcaFabStyle}
        >
          <Button
            aria-controls={vcaPanelId}
            aria-expanded={false}
            aria-haspopup="dialog"
            aria-label={`Open ${pcpCompanyProfile.name} assistant`}
            className="!h-12 !w-[156px] !gap-xs !rounded-[24px] !border-[1.5px] !border-[#2AA986] !bg-background !px-0 !py-0 !text-[#2AA986] !shadow-raised-active hover:!border-[#2AA986] hover:!bg-background active:!border-[#2AA986] active:!bg-background active:!shadow-raised-active [&>span[aria-hidden='true']]:!size-5"
            leadingIcon={
              <Icon
                className="text-[#2AA986]"
                name="signal-ai"
                size="small"
              />
            }
            onClick={handleOpenVcaFromTray}
            size="medium"
            style={{ borderWidth: "1.5px" }}
            variant="tertiary"
          >
            Ask Velora
          </Button>
        </div>
      ) : null}

      {isVcaEntryVisible && !isFabEntryMode ? (
        <ChatTray
          actionSize="small"
          aria-controls={vcaPanelId}
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-label={`Open ${pcpCompanyProfile.name} assistant`}
          className={cx(
            "pcp-ai-messaging-surface fixed bottom-0 left-4 right-4 z-40 mx-auto w-[calc(100vw_-_32px)] max-w-[var(--design-layout-chat-tray-width,384px)] !rounded-t-sm !transition-[height,width,right,bottom,transform,background-color,border-color,box-shadow] !duration-[var(--design-motion-duration-moderate)] !ease-emphasized md:left-auto md:mx-0 md:!w-[336px] md:!max-w-[336px]",
            vcaSeparateDesktopRightClass,
          )}
          identity={{
            type: "ai",
            title: (
              <span className="inline-flex min-w-0 items-center gap-xs">
                <span className="truncate">{pcpCompanyProfile.name}</span>
                <VeloraAiTag />
              </span>
            ),
            icon: <VeloraVcaLogoMark />,
          }}
          onClose={handleCloseVca}
          onOpen={handleOpenVcaFromTray}
          onVariantToggle={handleExpandVcaFromTray}
          showCloseAction
          style={aiTrayStyle}
          variant="collapsed"
        />
      ) : null}

      {isVcaOpen ? (
        <>
          <button
            aria-label={`Collapse expanded ${pcpCompanyProfile.name} assistant`}
            className={cx(
              "fixed inset-0 z-30 hidden bg-overlay-dim md:block",
              !isExpandedVcaSurface && "pointer-events-none opacity-0",
            )}
            onClick={() => {
              setIsCaseStudyOpen(false);
              setIsJobOpen(false);
              setVcaPanelVariant("collapsed");
            }}
            type="button"
          />
          <div
            id={vcaPanelId}
            role="dialog"
            aria-label={`${pcpCompanyProfile.name} assistant`}
            className={cx(
              "pcp-ai-messaging-surface fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)]",
              vcaSurfacePanelPositionClass,
            )}
            style={aiTrayStyle}
          >
            <PremiumCompanyPagesVcaPanel
              conversationStage={vcaConversationStage}
              draft={vcaDraft}
              followUpQuestion={vcaFollowUpQuestion}
              isCaseStudyOpen={isCaseStudyOpen}
              isJobOpen={isJobOpen}
              memberIntent={memberIntent}
              surfaceMode={entryMode}
              onCloseCaseStudy={handleCloseVcaCaseStudy}
              onCloseJob={handleCloseVcaJob}
              onClose={handleCloseVca}
              onDraftChange={handleVcaDraftChange}
              onMinimizeToTray={handleMinimizeVcaToTray}
              onOpenCaseStudy={handleOpenVcaCaseStudy}
              onOpenJob={handleOpenVcaJob}
              onOpenMessage={handleOpenVcaHandoffMessage}
              onVariantToggle={handleToggleVcaPanelVariant}
              onPromptSelect={handleVcaPromptSelect}
              onSend={handleVcaSend}
              visitorQuestion={vcaVisitorQuestion}
              variant={vcaPanelVariant}
            />
          </div>
        </>
      ) : null}

      <div className="mx-auto grid max-w-[1128px] gap-xxl px-lg py-md lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-md">
          <ProfileQuestionNudgeCard
            onPromptSelect={handleOpenVcaWithProfilePrompt}
          />
          <OverviewCard />
          <FeaturedCard />
          <Card>
            <ModuleHeader title="Posts" />
            <div className="px-xxl pb-xl pt-lg">
              <div className="grid gap-lg md:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.title} {...post} />
                ))}
              </div>
            </div>
            <ModuleFooter>
              <GhostButton icon="arrow-right" iconAtEnd size="small">
                Show all posts
              </GhostButton>
            </ModuleFooter>
          </Card>
          <ProductsCard />
          <LeadersCard />
          <EventCard />
          <RecentJobOpeningsCard />
          <LifeAtVeloraCard />
          <PremiumInsightsCard />
          <NewslettersCard />
          <MemberFooter />
        </div>

        <aside className="space-y-md">
          <PromotedCard />
          <SideListCard
            actionLabel="Show all"
            items={affiliatedPages}
            title="Affiliated pages"
          />
          <SideListCard
            actionLabel="Show more"
            items={sideJobs}
            title="Recent job openings"
            type="role"
          />
        </aside>
      </div>
    </main>
  );
}
