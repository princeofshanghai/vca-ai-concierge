"use client";

import Image from "next/image";
import { flushSync } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatPanel,
  ChatSidePanel,
  ChatSidePanelLayout,
  ChatTray,
  ChatThread,
  Prompt,
  type ChatHeaderIdentity,
  type ChatMessageStreamStatus,
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
import { ProgressIndicatorCircular } from "@/components/primitives/progress-indicator-circular";
import { TabItemHorizontal } from "@/components/primitives/tab-item-horizontal";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

import {
  PCP_ASSET_ROOT,
  PCP_MEMBER_ASSET_ROOT,
  pcpAdminPersona,
  pcpCompanyProfile,
  pcpCompetitorNames,
  pcpProofSnippets,
  pcpVcaScenario,
  pcpVisitorPersona,
} from "./persona";
import { GlobalInboxTray } from "./global-inbox-tray";
import {
  Draft as ResponseDraft,
  Entity as ResponseEntity,
  PersonCard as ResponsePersonCard,
  ResponseRail,
} from "./response-blocks";
import { ScriptedResponseTurn } from "./scripted-response-turn";
import { VcaFab } from "./vca-fab";

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
  "Benefits Implementation Consultant",
  "Carrier Integrations Lead",
  "Product Designer, Admin Experience",
];

const affiliatedPages = [...pcpCompetitorNames];

const overviewHighlights = [
  {
    title: "Verified benefits administration platform",
    date: "January 2025",
    image: pcpCompanyProfile.logoSrc,
  },
  {
    title: "Built for enterprise HR teams managing carrier complexity",
    date: "June 2024",
    image: pcpCompanyProfile.logoSrc,
  },
];

const posts = [
  {
    title: pcpProofSnippets.postTitle,
    body: "A 12,000-employee retailer simplified carrier coordination before open enrollment by keeping eligibility cleanup, carrier files, and employee communications in one workflow.",
    image: "post-image-1.png",
    stats: `${pcpProofSnippets.postEngagement} reactions`,
  },
  {
    title: "Three signs your benefits workflow has outgrown spreadsheets.",
    body: "If every carrier, plan, and employee population has a different tracker, your team needs a system that keeps decisions, files, and communications in one place.",
    image: "post-image-2.png",
    stats: "42 comments",
  },
];

const products = [
  {
    title: "Open enrollment command center",
    type: "Benefits workflow",
    body: "Coordinate plan changes, employee communications, carrier readiness, and enrollment progress without recreating the same tracker every week.",
    image: "product-image-1.png",
  },
  {
    title: "Carrier connection management",
    type: "Integrations workflow",
    body: "See which carrier files are validated, which exceptions need review, and which plan updates are ready before enrollment opens.",
    image: "product-image-2.png",
  },
  {
    title: "Eligibility change tracking",
    type: "HR operations",
    body: "Give HR teams a shared view of population changes, seasonal workers, dependent updates, and exceptions by plan and location.",
    image: "hero-cover-1.png",
  },
];

const serviceKeywords = [
  "Benefits Administration",
  "Open Enrollment",
  "Carrier Integrations",
  "HR Operations",
  "Employee Benefits",
];

const leaders = [
  {
    name: pcpAdminPersona.name,
    role: pcpAdminPersona.title,
    followers: "8,412 followers",
    image: pcpAdminPersona.avatarSrc,
  },
  {
    name: "Avery Chen",
    role: "Head of Carrier Integrations",
    followers: "3,284 followers",
    image: `${PCP_ASSET_ROOT}/avatar-2.png`,
  },
  {
    name: "Marcus Lee",
    role: "Benefits Implementation Lead",
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
    author: pcpAdminPersona.name,
    avatar: pcpAdminPersona.avatarSrc,
    body: "Benefits operations usually break down in one invisible place: enrollment starts, but eligibility data, carrier files, and employee communications do not match.",
    image: null,
  },
  {
    author: "Avery Chen",
    avatar: `${PCP_ASSET_ROOT}/avatar-2.png`,
    body: "Good benefits integrations are not about adding process. They are about making file readiness, exceptions, and carrier decisions clear before enrollment gets messy.",
    image: "product-image-2.png",
  },
  {
    author: "Marcus Lee",
    avatar: `${PCP_ASSET_ROOT}/avatar-3.png`,
    body: "The best HR teams can answer three questions fast: which plans changed, which carrier files are ready, and which employee populations need attention.",
    image: "product-image-1.png",
    linkTitle: "How benefits teams reduce open enrollment surprises",
    linkMeta: "Velora on LinkedIn - 7min...",
  },
];

const mainJobOpenings = [
  "Benefits Implementation Consultant",
  "Carrier Integrations Lead",
];

const newsletters = [
  {
    title: "The Benefits Operations Brief",
    meta: "Weekly - 2,674 subscribers",
    body: "Weekly notes for HR and benefits leaders managing open enrollment, carrier readiness, and employee communications.",
  },
  {
    title: "Open Enrollment Field Notes",
    meta: "Monthly - 1,204 subscribers",
    body: "Practical lessons from enterprise benefits teams coordinating plan changes, eligibility exceptions, and carrier partners.",
  },
  {
    title: "Benefits Leader Signals",
    meta: "Monthly - 894 subscribers",
    body: "A concise readout of enrollment patterns, migration risks, and questions HR leaders are asking.",
  },
];

const footerLinkColumns = [
  ["About", "Community Guidelines", "Privacy & Terms", "Sales Solution", "Safety Center"],
  ["Accessibility", "Careers", "Ad Choices", "Mobile"],
  ["Talent Solutions", "Marketing Solutions", "Advertising", "Small Business"],
];

export type VcaShellMode = "tray" | "fab" | "fab-icon";
export type VcaMemberIntent = "buyer" | "job-seeker";
export type PremiumCompanyPagesMemberStory = "default" | "live-support";
type MessagingSurfaceState = "closed" | "docked" | "open";

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => {
    finished: Promise<void>;
  };
};
type VcaConversationStage =
  | "opening"
  | "pageExplorerAnswered"
  | "postProof"
  | "caseStudyReturned"
  | "jobProof"
  | "handoffOffered"
  | "handoffOpened"
  | "liveSupportConnecting"
  | "liveSupportConnected";
type VcaAnimatedTurnId =
  | "member-vca-page-explorer-answer"
  | "member-vca-post-proof"
  | "member-vca-job-proof"
  | "member-vca-case-study-return"
  | "member-vca-handoff-offer";
type VcaVisitorPromptId = keyof typeof pcpVcaScenario.pageExplorerPrompts;

function getActiveVcaAnimatedTurnId({
  conversationStage,
  hasFollowUp,
  isDetailPanelOpen,
  isJobSeekerIntent,
}: Readonly<{
  conversationStage: VcaConversationStage;
  hasFollowUp: boolean;
  isDetailPanelOpen: boolean;
  isJobSeekerIntent: boolean;
}>): VcaAnimatedTurnId | null {
  if (isDetailPanelOpen) {
    return null;
  }

  if (isJobSeekerIntent) {
    return conversationStage === "jobProof" ? "member-vca-job-proof" : null;
  }

  if (conversationStage === "pageExplorerAnswered") {
    return "member-vca-page-explorer-answer";
  }

  if (conversationStage === "postProof") {
    return "member-vca-post-proof";
  }

  if (conversationStage === "caseStudyReturned") {
    return "member-vca-case-study-return";
  }

  if (conversationStage === "handoffOffered" && hasFollowUp) {
    return "member-vca-handoff-offer";
  }

  return null;
}

const vcaOpeningPrompts = pcpVcaScenario.visitorPrompts;
const pageExplorerPromptEntries = Object.entries(
  pcpVcaScenario.pageExplorerPrompts,
) as Array<[VcaVisitorPromptId, string]>;
const VCA_JOB_SEEKER_QUESTION =
  "Would my HR operations background be a fit for the Benefits Implementation Consultant role?";
const VCA_JOB_SEEKER_CHIP = "Would my HR ops background be a fit?";
const vcaJobSeekerPrompts = [
  VCA_JOB_SEEKER_CHIP,
  "What does this role own?",
  "Is this role remote?",
];
const VCA_POST_RESPONSE = pcpVcaScenario.pageExplorerResponses.posts;
const VCA_JOB_SEEKER_RESPONSE =
  "Yes - your HR operations background sounds relevant, especially if you've helped employees, benefits partners, or internal teams through setup, troubleshooting, and process changes. These roles connect customer conversations, benefits workflow setup, and cross-functional product feedback so HR teams get clear answers quickly.";
const VCA_JOB_PROOF_INTRO =
  "These roles look closest to what you're describing:";
const vcaJobOpenings = [
  {
    title: "Benefits Implementation Consultant",
    location: pcpCompanyProfile.location,
    posted: "2 days ago",
    employmentType: "Full-time",
    applyClicks: "20 people clicked apply",
    alumni: "1,412 school alumni work here",
    summary:
      "Help enterprise HR teams set up benefits workflows, enrollment milestones, and customer launch plans.",
    about:
      "Velora helps HR teams manage open enrollment, carrier readiness, eligibility changes, and employee communications in one workflow. The Benefits Implementation team works closely with customers, product, and integration partners to make complex launch questions feel clear and actionable.",
  },
  {
    title: "Carrier Integrations Lead",
    location: pcpCompanyProfile.location,
    posted: "1 week ago",
    employmentType: "Full-time",
    applyClicks: "14 people clicked apply",
    alumni: "1,412 school alumni work here",
    summary:
      "Own carrier readiness workflows across file validation, exceptions, and partner coordination.",
    about:
      "This role leads the connective tissue between Velora customers, carrier partners, and internal product teams. You would help define how file readiness, exception handling, and carrier decisions stay visible before enrollment opens.",
  },
  {
    title: "Product Designer, Admin Experience",
    location: pcpCompanyProfile.location,
    posted: "3 days ago",
    employmentType: "Full-time",
    applyClicks: "9 people clicked apply",
    alumni: "1,412 school alumni work here",
    summary:
      "Design admin workflows for benefits teams managing enrollment, eligibility, and carrier coordination.",
    about:
      "The Admin Experience team designs the workspace HR and benefits leaders use to understand plan changes, population updates, and open enrollment progress. This role focuses on making complex operational states easy to scan and act on.",
  },
] as const;
type VcaJobOpening = (typeof vcaJobOpenings)[number];
const VCA_CASE_STUDY_RETURN_PROMPT = pcpVcaScenario.caseStudyReturnPrompt;
const VCA_DRAFT_INTRO_PROMPT = "Draft message";
const VCA_HANDOFF_OFFER = pcpVcaScenario.handoffOffer;
const VCA_HANDOFF_MESSAGE = pcpVcaScenario.handoffMessage;
const LIVE_SUPPORT_CONNECT_DELAY_MS = 900;
const PCP_LIVE_SUPPORT_AGENT = {
  name: "Maya R.",
  role: "Velora live support",
  timestamp: "9:37 PM",
  message: "How can I help you?",
} as const;

function normalizeVcaPromptText(prompt: string) {
  return prompt.trim().toLowerCase();
}

function getVcaVisitorPromptId(prompt: string): VcaVisitorPromptId | null {
  const normalizedPrompt = normalizeVcaPromptText(prompt);
  const matchedEntry = pageExplorerPromptEntries.find(
    ([, label]) => normalizeVcaPromptText(label) === normalizedPrompt,
  );

  if (matchedEntry) {
    return matchedEntry[0];
  }

  if (
    normalizedPrompt.includes("people") ||
    normalizedPrompt.includes("leader") ||
    normalizedPrompt.includes("founder")
  ) {
    return "people";
  }

  if (
    normalizedPrompt.includes("job") ||
    normalizedPrompt.includes("role") ||
    normalizedPrompt.includes("career") ||
    normalizedPrompt.includes("hiring") ||
    normalizedPrompt.includes("position") ||
    normalizedPrompt.includes("opening") ||
    normalizedPrompt.includes("opportunit") ||
    normalizedPrompt.includes("apply")
  ) {
    return "jobs";
  }

  if (
    normalizedPrompt.includes("post") ||
    normalizedPrompt.includes("proof") ||
    normalizedPrompt.includes("case study") ||
    normalizedPrompt.includes("recent")
  ) {
    return "posts";
  }

  if (
    normalizedPrompt.includes("relevant") ||
    normalizedPrompt.includes("right for me") ||
    normalizedPrompt.includes("fit")
  ) {
    return "fit";
  }

  if (
    normalizedPrompt.includes("what should") ||
    normalizedPrompt.includes("what does") ||
    normalizedPrompt.includes("overview")
  ) {
    return "overview";
  }

  return null;
}

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
  showAiBadge = false,
  size = "small",
}: Readonly<{
  showAiBadge?: boolean;
  size?: "small" | "medium" | "large";
}>) {
  const markSizeClass =
    size === "large" ? "size-10" : size === "medium" ? "size-8" : "size-7";
  const badgeSizeClass = size === "large" ? "size-5" : "size-4";

  return (
    <span
      className={cx(
        "relative inline-flex shrink-0",
        markSizeClass,
      )}
    >
      <span
        className={cx(
          "inline-flex size-full items-center justify-center overflow-hidden border border-border-faint bg-[#ACF5B3] p-[3px]",
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
      {showAiBadge ? (
        <span
          className={cx(
            "absolute -bottom-xxs -right-xxs inline-flex items-center justify-center rounded-round border-2 border-background bg-background text-ai-icon",
            badgeSizeClass,
          )}
        >
          <Icon className="[&&]:size-3" name="signal-ai" size="small" />
        </span>
      ) : null}
    </span>
  );
}

function VcaAssistantMessage({
  children,
  streamStatus,
  streamText,
  timestamp,
}: Readonly<{
  children: ReactNode;
  streamStatus?: ChatMessageStreamStatus;
  streamText?: string;
  timestamp?: string;
}>) {
  return (
    <ChatMessage
      streamStatus={streamStatus}
      streamText={streamText}
      timestamp={timestamp}
    >
      {children}
    </ChatMessage>
  );
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

type VcaScriptedAssistantTurnProps = Omit<
  ComponentProps<typeof ScriptedResponseTurn>,
  "renderText"
> & {
  timestamp: string;
};

function VcaScriptedAssistantTurn({
  attachments = [],
  id,
  timestamp,
  ...props
}: VcaScriptedAssistantTurnProps) {
  const [stableTimestamp] = useState(() => timestamp);
  const attachmentsWithTimestamp: ComponentProps<
    typeof ScriptedResponseTurn
  >["attachments"] = [
    ...attachments,
    {
      id: `${id}-timestamp`,
      gap: "sm",
      children: (
        <p className="text-body-xs text-text-meta">{stableTimestamp}</p>
      ),
    },
  ];

  return (
    <ScriptedResponseTurn
      {...props}
      attachments={attachmentsWithTimestamp}
      id={id}
      renderText={({ streamStatus, streamText, text }) => (
        <VcaAssistantMessage
          streamStatus={streamStatus}
          streamText={streamText}
        >
          {text}
        </VcaAssistantMessage>
      )}
    />
  );
}

function VcaWelcomeIntro({
  prompts,
  onPromptSelect,
}: Readonly<{
  prompts: ReadonlyArray<Readonly<{ label: string }>>;
  onPromptSelect: (prompt: string) => void;
}>) {
  return (
    <section className="flex w-full max-w-[var(--design-layout-chat-message-assistant-max)] flex-col items-start pb-xl pt-sm pr-sm">
      <h2 className="text-heading-lg text-text">
        {pcpVcaScenario.openingTitle}
      </h2>
      <p className="mt-xs text-body-sm text-text">
        {pcpVcaScenario.openingSubcopy}
      </p>
      <div className="mt-lg flex flex-col gap-sm">
        {prompts.map((prompt) => (
          <Prompt
            className="w-fit max-w-full self-start"
            key={prompt.label}
            onPromptSelect={() => onPromptSelect(prompt.label)}
            prompt={prompt.label}
          />
        ))}
      </div>
    </section>
  );
}

function VcaStableAssistantMessage({
  children,
  timestamp,
}: Readonly<{ children: ReactNode; timestamp: string }>) {
  const [stableTimestamp] = useState(() => timestamp);

  return (
    <VcaAssistantMessage timestamp={stableTimestamp}>
      {children}
    </VcaAssistantMessage>
  );
}

function VcaStableUserMessage({
  children,
  timestamp,
}: Readonly<{ children: ReactNode; timestamp: string }>) {
  const [stableTimestamp] = useState(() => timestamp);

  return (
    <VcaUserMessage timestamp={stableTimestamp}>
      {children}
    </VcaUserMessage>
  );
}

function VeloraLinkedInPostProofCard({
  onViewPost,
}: Readonly<{ onViewPost: () => void }>) {
  return (
    <ResponseEntity
      actions={[
        {
          label: "View post",
          onSelect: onViewPost,
          variant: "secondary",
        },
      ]}
      audience="visitor"
      className="chat-message-enter max-w-[24rem]"
      commentCount={pcpProofSnippets.postCommentCount}
      engagement={pcpProofSnippets.postEngagement}
      followerCount={pcpCompanyProfile.followers}
      logoSrc={pcpCompanyProfile.logoSrc}
      name={pcpCompanyProfile.name}
      previewImageAlt={pcpProofSnippets.postImageAlt}
      previewImageSrc={assetSrc(pcpProofSnippets.postImage)}
      repostCount={pcpProofSnippets.postRepostCount}
      snippet={pcpProofSnippets.postSummary}
      timestamp={pcpProofSnippets.postTimestamp}
      variant="post"
    />
  );
}

function VeloraPeopleSummaryCard() {
  return (
    <ResponseRail
      aria-label="People on this Page"
      className="chat-message-enter"
      title={
        <>
          <Icon name="people" size="small" />
          <span>People on this Page</span>
        </>
      }
    >
      {leaders.slice(0, 3).map((leader) => (
        <ResponsePersonCard
          avatarSrc={assetSrc(leader.image)}
          followers={leader.followers}
          headline={leader.role}
          key={leader.name}
          name={leader.name}
        />
      ))}
    </ResponseRail>
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
          alt={pcpProofSnippets.postImageAlt}
          className="aspect-[16/7] w-full object-cover"
          height={332}
          src={assetSrc(pcpProofSnippets.postImage)}
          width={760}
        />

        <h1 className="mt-xl text-heading-lg text-text">
          {pcpProofSnippets.postTitle}
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
          {pcpProofSnippets.postDateLabel}
        </p>

        <div className="mt-xl space-y-md text-body-sm-open text-text">
          {pcpProofSnippets.postBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-xl flex items-center justify-between border-t border-border-faint py-md text-body-sm text-text-meta">
          <span className="inline-flex min-w-0 items-center gap-sm">
            <ReactionPile />
            <span>{pcpProofSnippets.postEngagement}</span>
          </span>
          <span>{pcpProofSnippets.postCommentLabel}</span>
        </div>
      </article>
    </ChatSidePanel>
  );
}

function VeloraLinkedInJobPreviewCard({
  job,
  onViewJob,
}: Readonly<{ job: VcaJobOpening; onViewJob: (job: VcaJobOpening) => void }>) {
  return (
    <ResponseEntity
      alumni={job.alumni}
      alumniImageSrc={assetSrc("school-alumni-spartan.png")}
      audience="visitor"
      className="chat-message-enter w-[15.5rem] shrink-0 p-lg"
      company={pcpCompanyProfile.name}
      location={job.location}
      logoSrc={pcpCompanyProfile.logoSrc}
      name={job.title}
      onCardSelect={() => onViewJob(job)}
      cardSelectLabel={`View ${job.title} details`}
      snippet={job.summary}
      timestamp={job.posted}
      title={job.title}
      variant="job"
    />
  );
}

function VeloraJobSidePanel({
  job,
  onBack,
}: Readonly<{ job: VcaJobOpening; onBack: () => void }>) {
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
          {job.title}
          <Icon className="shrink-0 text-icon" name="verified" size="medium" />
        </h1>

        <div className="mt-md space-y-xxs text-body-sm-open text-text-meta">
          <p>
            {job.location} &middot; {job.posted} &middot;{" "}
            <span className="font-semibold text-positive">
              {job.applyClicks}
            </span>
          </p>
        </div>

        <div className="mt-xl flex flex-wrap gap-sm">
          {[job.location, job.employmentType].map((detail) => (
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
            {job.about}{" "}
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
    <ResponseDraft
      className="chat-message-enter max-w-[24rem]"
      message={VCA_HANDOFF_MESSAGE}
      onActionSelect={onOpenMessage}
      recipient={`To ${pcpCompanyProfile.adminName} at ${pcpCompanyProfile.name}`}
    />
  );
}

function VcaLiveSupportHandoff({
  state,
}: Readonly<{ state: "connecting" | "connected" }>) {
  return (
    <>
      <article
        role="status"
        aria-live="polite"
        className="chat-message-enter flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background p-xl pr-md text-text"
      >
        {state === "connecting" ? (
          <div className="flex items-center gap-md">
            <ProgressIndicatorCircular
              aria-label="Connecting"
              size={20}
              type="indeterminate"
            />
            <h2 className="text-heading-md">Connecting you now</h2>
          </div>
        ) : null}
        {state === "connected" ? (
          <div className="flex items-center gap-sm">
            <span
              aria-hidden="true"
              className="inline-flex size-6 shrink-0 items-center justify-center text-checked [&_svg]:size-6"
            >
              <Icon name="signal-success" size="medium" />
            </span>
            <h2 className="text-heading-md">
              Connected to {PCP_LIVE_SUPPORT_AGENT.name}
            </h2>
          </div>
        ) : null}
      </article>
      {state === "connected" ? (
        <div className="flex flex-col gap-lg">
          <p className="chat-message-enter text-center text-body-xs text-text-meta">
            {PCP_LIVE_SUPPORT_AGENT.name} joined the chat -{" "}
            {PCP_LIVE_SUPPORT_AGENT.timestamp}
          </p>
          <ChatMessage
            role="representative"
            authorName={PCP_LIVE_SUPPORT_AGENT.name}
            avatarLabel={`${PCP_LIVE_SUPPORT_AGENT.name}, ${PCP_LIVE_SUPPORT_AGENT.role}`}
            timestamp={PCP_LIVE_SUPPORT_AGENT.timestamp}
          >
            {PCP_LIVE_SUPPORT_AGENT.message}
          </ChatMessage>
        </div>
      ) : null}
    </>
  );
}

export function PremiumCompanyPagesVcaPostProofCardPreview() {
  return <VeloraLinkedInPostProofCard onViewPost={() => {}} />;
}

export function PremiumCompanyPagesVcaJobPreviewCardPreview() {
  return (
    <VeloraLinkedInJobPreviewCard
      job={vcaJobOpenings[0]}
      onViewJob={() => {}}
    />
  );
}

export function PremiumCompanyPagesVcaHandoffCardPreview() {
  return <VcaHandoffCard onOpenMessage={() => {}} />;
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
        <VeloraVcaLogoMark showAiBadge size="medium" />
        <div className="min-w-0">
          <h2 className="min-w-0 truncate text-heading-md text-text">
            Velora
          </h2>
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
  liveSupportMessages,
  selectedJob,
  visitorPromptId,
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
  liveSupportMessages: ReadonlyArray<string>;
  selectedJob: VcaJobOpening;
  visitorPromptId: VcaVisitorPromptId | null;
  visitorQuestion: string | null;
  followUpQuestion: string | null;
  onClose: () => void;
  onCloseCaseStudy: () => void;
  onCloseJob: () => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onOpenCaseStudy: () => void;
  onOpenJob: (job: VcaJobOpening) => void;
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
  const [firstLiveSupportMessage, ...liveSupportFollowUpMessages] =
    liveSupportMessages;
  const hasLiveSupportMessages = liveSupportMessages.length > 0;
  const isLiveSupportConnecting =
    conversationStage === "liveSupportConnecting";
  const isLiveSupportConnected = conversationStage === "liveSupportConnected";
  const liveSupportHeaderIdentity: ChatHeaderIdentity = {
    type: "representative",
    name: PCP_LIVE_SUPPORT_AGENT.name,
    role: PCP_LIVE_SUPPORT_AGENT.role,
  };
  const hasStartedConversation =
    Boolean(visitorQuestion) || hasLiveSupportMessages;
  const hasFollowUp = Boolean(followUpQuestion);
  const shouldShowProof =
    !isJobSeekerIntent &&
    (conversationStage === "postProof" ||
      conversationStage === "caseStudyReturned" ||
      conversationStage === "handoffOffered" ||
      conversationStage === "handoffOpened");
  const shouldShowJobProof = conversationStage === "jobProof";
  const pageExplorerAnswer = visitorPromptId
    ? pcpVcaScenario.pageExplorerResponses[visitorPromptId]
    : undefined;
  const shouldShowPageExplorerAnswer =
    !isJobSeekerIntent &&
    conversationStage === "pageExplorerAnswered" &&
    Boolean(pageExplorerAnswer);
  const shouldShowCaseStudyReturnPrompt =
    !isJobSeekerIntent && conversationStage === "caseStudyReturned";
  const shouldShowHandoff =
    !isJobSeekerIntent &&
    (conversationStage === "handoffOffered" ||
      conversationStage === "handoffOpened");
  const shouldShowWelcome =
    conversationStage === "opening" && !hasStartedConversation;
  const starterPrompts = isJobSeekerIntent
    ? vcaJobSeekerPrompts.map((label) => ({ label }))
    : vcaOpeningPrompts;
  const composerPlaceholder = "Send message";
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const sidePanelHistoryRef = useRef<HTMLDivElement | null>(null);
  const [busyTurnIds, setBusyTurnIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [stopSignal, setStopSignal] = useState(0);
  const isAssistantBusy = busyTurnIds.size > 0;
  const isComposerDisabled = isAssistantBusy || isLiveSupportConnecting;
  const activeAnimatedTurnId = getActiveVcaAnimatedTurnId({
    conversationStage,
    hasFollowUp,
    isDetailPanelOpen,
    isJobSeekerIntent,
  });
  let messageTimestampIndex = 0;
  const getNextMessageTimestamp = () =>
    getPrototypeMessageTimestamp(messageTimestampIndex++);
  const handleScriptedTurnBusyChange = useCallback(
    (turnId: string, isBusy: boolean) => {
      setBusyTurnIds((currentTurnIds) => {
        const nextTurnIds = new Set(currentTurnIds);

        if (isBusy) {
          nextTurnIds.add(turnId);
        } else {
          nextTurnIds.delete(turnId);
        }

        return nextTurnIds;
      });
    },
    [],
  );
  const handleStopAssistantResponse = useCallback(() => {
    setStopSignal((currentSignal) => currentSignal + 1);
    setBusyTurnIds(new Set());
  }, []);
  const handleVcaContentChange = useCallback(() => {
    const scrollToBottom = () => {
      const scrollContainer = isDetailPanelOpen
        ? sidePanelHistoryRef.current
        : chatBodyRef.current;

      if (!scrollContainer) {
        return;
      }

      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    };

    scrollToBottom();
    window.requestAnimationFrame(scrollToBottom);
    window.setTimeout(scrollToBottom, 120);
    window.setTimeout(scrollToBottom, 360);
    window.setTimeout(scrollToBottom, 700);
  }, [isDetailPanelOpen]);
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
    liveSupportMessages,
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
        {shouldShowWelcome ? (
          <VcaWelcomeIntro
            onPromptSelect={onPromptSelect}
            prompts={starterPrompts}
          />
        ) : null}
        {visitorQuestion ? (
          <VcaStableUserMessage timestamp={getNextMessageTimestamp()}>
            {visitorQuestion}
          </VcaStableUserMessage>
        ) : null}
        {firstLiveSupportMessage ? (
          <VcaStableUserMessage timestamp={getNextMessageTimestamp()}>
            {firstLiveSupportMessage}
          </VcaStableUserMessage>
        ) : null}
        {isLiveSupportConnecting || isLiveSupportConnected ? (
          <VcaLiveSupportHandoff
            state={isLiveSupportConnected ? "connected" : "connecting"}
          />
        ) : null}
        {isLiveSupportConnected
          ? liveSupportFollowUpMessages.map((message, index) => (
              <VcaStableUserMessage
                key={`${message}-${index}`}
                timestamp={getNextMessageTimestamp()}
              >
                {message}
              </VcaStableUserMessage>
            ))
          : null}
        {shouldShowPageExplorerAnswer && pageExplorerAnswer ? (
          <VcaScriptedAssistantTurn
            animate={activeAnimatedTurnId === "member-vca-page-explorer-answer"}
            attachments={
              visitorPromptId === "people"
                ? [
                    {
                      id: "people-summary",
                      children: <VeloraPeopleSummaryCard />,
                    },
                  ]
                : []
            }
            id="member-vca-page-explorer-answer"
            onBusyChange={handleScriptedTurnBusyChange}
            onContentChange={handleVcaContentChange}
            stopSignal={stopSignal}
            text={pageExplorerAnswer}
            timestamp={getNextMessageTimestamp()}
          />
        ) : null}
        {shouldShowProof ? (
          <VcaScriptedAssistantTurn
            animate={activeAnimatedTurnId === "member-vca-post-proof"}
            attachments={[
              {
                id: "post-proof",
                children: (
                  <VeloraLinkedInPostProofCard
                    onViewPost={onOpenCaseStudy}
                  />
                ),
              },
            ]}
            id="member-vca-post-proof"
            onBusyChange={handleScriptedTurnBusyChange}
            onContentChange={handleVcaContentChange}
            stopSignal={stopSignal}
            text={VCA_POST_RESPONSE}
            timestamp={getNextMessageTimestamp()}
          />
        ) : null}
        {shouldShowJobProof ? (
          <VcaScriptedAssistantTurn
            animate={activeAnimatedTurnId === "member-vca-job-proof"}
            attachments={[
              ...(isJobSeekerIntent
                ? [
                    {
                      id: "job-proof-intro",
                      children: (
                        <VcaStableAssistantMessage timestamp={getNextMessageTimestamp()}>
                          {VCA_JOB_PROOF_INTRO}
                        </VcaStableAssistantMessage>
                      ),
                    },
                  ]
                : []),
              {
                id: "job-proof-rail",
                children: (
                  <ResponseRail aria-label="Open roles at Velora">
                    {vcaJobOpenings.map((job) => (
                      <VeloraLinkedInJobPreviewCard
                        job={job}
                        key={job.title}
                        onViewJob={onOpenJob}
                      />
                    ))}
                  </ResponseRail>
                ),
              },
              {
                id: "jobs-page-link",
                children: (
                  <VcaStableAssistantMessage timestamp={getNextMessageTimestamp()}>
                    You can also see all open roles by visiting the{" "}
                    <a
                      className="font-semibold text-action hover:text-action-hover"
                      href="#jobs"
                    >
                      Jobs page
                    </a>
                    .
                  </VcaStableAssistantMessage>
                ),
              },
            ]}
            id="member-vca-job-proof"
            onBusyChange={handleScriptedTurnBusyChange}
            onContentChange={handleVcaContentChange}
            stopSignal={stopSignal}
            text={
              isJobSeekerIntent
                ? VCA_JOB_SEEKER_RESPONSE
                : pcpVcaScenario.pageExplorerResponses.jobs
            }
            timestamp={getNextMessageTimestamp()}
          />
        ) : null}
        {hasFollowUp && !isJobSeekerIntent ? (
          <VcaStableUserMessage timestamp={getNextMessageTimestamp()}>
            {followUpQuestion}
          </VcaStableUserMessage>
        ) : null}
        {shouldShowCaseStudyReturnPrompt ? (
          <VcaScriptedAssistantTurn
            animate={activeAnimatedTurnId === "member-vca-case-study-return"}
            attachments={[
              {
                id: "draft-prompt",
                children: (
                  <Prompt
                    className="w-fit max-w-full self-start"
                    onPromptSelect={onPromptSelect}
                    prompt={VCA_DRAFT_INTRO_PROMPT}
                  />
                ),
              },
            ]}
            id="member-vca-case-study-return"
            onBusyChange={handleScriptedTurnBusyChange}
            onContentChange={handleVcaContentChange}
            stopSignal={stopSignal}
            text={VCA_CASE_STUDY_RETURN_PROMPT}
            timestamp={getNextMessageTimestamp()}
          />
        ) : null}
        {shouldShowHandoff ? (
          hasFollowUp ? (
            <VcaScriptedAssistantTurn
              animate={activeAnimatedTurnId === "member-vca-handoff-offer"}
              attachments={[
                {
                  id: "handoff-card",
                  children: <VcaHandoffCard onOpenMessage={onOpenMessage} />,
                },
              ]}
              id="member-vca-handoff-offer"
              onBusyChange={handleScriptedTurnBusyChange}
              onContentChange={handleVcaContentChange}
              stopSignal={stopSignal}
              text={VCA_HANDOFF_OFFER}
              timestamp={getNextMessageTimestamp()}
            />
          ) : (
            <VcaHandoffCard onOpenMessage={onOpenMessage} />
          )
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
      {isLiveSupportConnected ? (
        <ChatHeader
          actionSize={headerActionSize}
          identity={liveSupportHeaderIdentity}
          onClose={onClose}
          onMinimizeToTray={onMinimizeToTray}
          onVariantToggle={onVariantToggle}
          variant={variant}
        />
      ) : (
        <VeloraAiHeader
          actionSize={headerActionSize}
          onClose={onClose}
          onMinimizeToTray={onMinimizeToTray}
          onVariantToggle={onVariantToggle}
          showResponseTime={showHeaderResponseTime}
          variant={variant}
        />
      )}
      {isDetailPanelOpen ? (
        <ChatSidePanelLayout
          chatBodyClassName="pb-[96px]"
          chatBodyRef={sidePanelHistoryRef}
          history={thread}
          sidePanel={
            isJobOpen ? (
              <VeloraJobSidePanel job={selectedJob} onBack={onCloseJob} />
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
              disabled: isComposerDisabled,
              onChange: onDraftChange,
              placeholder: composerPlaceholder,
              value: draft,
            }}
            isResponding={isAssistantBusy}
            onSend={onSend}
            onStopResponse={handleStopAssistantResponse}
            sendDisabled={isComposerDisabled}
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
              author={pcpVisitorPersona.name}
              avatarSrc={assetSrc(pcpVisitorPersona.memberAvatar)}
              time="4:02 PM"
            >
              <p>Hi Velora,</p>
              <p>
                I found your Premium Company Page and saw your post about Arbor
                Retail Group. I am interested in whether Velora could be
                relevant for our HR and benefits operations.
              </p>
            </HumanMessageEntry>
            <HumanMessageEntry
              author={pcpVisitorPersona.name}
              avatarSrc={assetSrc(pcpVisitorPersona.memberAvatar)}
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
                author={pcpVisitorPersona.name}
                avatarSrc={assetSrc(pcpVisitorPersona.memberAvatar)}
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
            <div className="min-w-0 w-[min(100%,320px)] pb-xxl sm:w-auto sm:max-w-[720px]">
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
              <p className="mt-xs w-[min(100%,320px)] break-words text-body-md text-[var(--figma-color-text-color-text-overlay)] sm:w-auto sm:max-w-[640px]">
                {pcpCompanyProfile.tagline}
              </p>
              <p className="mt-xs flex w-[min(100%,320px)] flex-wrap items-center gap-x-xs gap-y-xxs break-words text-body-sm text-[var(--figma-color-text-color-text-overlay)] sm:w-auto sm:max-w-[640px]">
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

            <aside className="mb-xxl w-[min(100%,320px)] rounded-sm bg-white/0 p-lg text-[var(--figma-color-text-color-text-overlay)] lg:w-auto lg:max-w-none">
              <Icon className="text-[#ACF5B3]" name="quote" size="medium" />
              <p className="mt-sm break-words text-body-md-open">
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

function OverviewCard() {
  return (
    <Card>
      <ModuleHeader title="Overview" />
      <div className="flex flex-col gap-lg px-xxl pb-xl pt-lg">
        <div className="relative overflow-hidden">
          <p className="line-clamp-3 pr-stack text-body-sm-open text-text">
            {pcpCompanyProfile.name} helps enterprise HR teams manage open
            enrollment, carrier connections, eligibility changes, and employee
            benefits communications in one place. It is built for benefits
            operations teams whose workflows have outgrown spreadsheets.
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
            src={assetSrc("media-1.png")}
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
            image="product-image-1.png"
            title="When open enrollment starts, eligibility exceptions are what teams remember."
            meta="9,430 - 115 comments"
          />
          <MiniContentCard
            image="product-image-2.png"
            title="How an enterprise HR team stopped tracking carrier readiness in spreadsheets."
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
            Velora helps HR teams coordinate open enrollment timing, carrier
            readiness, eligibility changes, and employee communications in one
            workflow. Teams can understand what is live, blocked, or waiting on
            follow-up before benefits operations turn into spreadsheet work.
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
                Thu, 06/18/2026, 5:00 PM
              </p>
              <h3 className="text-control-md text-text">
                Live workshop: carrier coordination before open enrollment
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
    <div id="jobs">
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
    </div>
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
          src={assetSrc("media-2.png")}
          width={460}
        />
        <div>
          <h3 className="text-control-md text-text">
            Built around benefits operations complexity
          </h3>
          <p className="mt-xs text-body-sm-open text-text">
            {pcpCompanyProfile.name} helps HR teams connect eligibility data,
            carrier readiness, employee communications, and enrollment reporting
            in one place.
          </p>
          <p className="text-body-sm-open text-text">
            The Velora team builds for benefits teams that need clarity before
            open enrollment without adding another spreadsheet or operations
            layer.
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
            Including HR leaders and benefits operations leads from target
            accounts
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
                    : "Benefits administration software"}
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
  shellMode = "fab-icon",
  story = "default",
}: Readonly<{
  memberIntent?: VcaMemberIntent;
  shellMode?: VcaShellMode;
  story?: PremiumCompanyPagesMemberStory;
}>) {
  return (
    <PremiumCompanyPagesSeparateMemberPage
      entryMode={shellMode}
      memberIntent={memberIntent}
      story={story}
    />
  );
}

function PremiumCompanyPagesSeparateMemberPage({
  entryMode,
  memberIntent,
  story,
}: Readonly<{
  entryMode: VcaShellMode;
  memberIntent: VcaMemberIntent;
  story: PremiumCompanyPagesMemberStory;
}>) {
  const isFabEntryMode = entryMode !== "tray";
  const isFabIconEntryMode = entryMode === "fab-icon";
  const isJobSeekerIntent = memberIntent === "job-seeker";
  const isLiveSupportStory = story === "live-support";
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
  const [vcaVisitorPromptId, setVcaVisitorPromptId] =
    useState<VcaVisitorPromptId | null>(null);
  const [vcaVisitorQuestion, setVcaVisitorQuestion] =
    useState<string | null>(null);
  const [vcaFollowUpQuestion, setVcaFollowUpQuestion] =
    useState<string | null>(null);
  const [vcaLiveSupportMessages, setVcaLiveSupportMessages] = useState<
    ReadonlyArray<string>
  >([]);
  const [vcaDraft, setVcaDraft] = useState("");
  const [humanDraft, setHumanDraft] = useState("");
  const [humanSentMessage, setHumanSentMessage] = useState<string | null>(null);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [selectedVcaJob, setSelectedVcaJob] = useState<VcaJobOpening>(
    vcaJobOpenings[0],
  );
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
  const vcaTrayIdentity: ChatHeaderIdentity =
    vcaConversationStage === "liveSupportConnected"
      ? {
          type: "representative",
          name: PCP_LIVE_SUPPORT_AGENT.name,
          role: PCP_LIVE_SUPPORT_AGENT.role,
        }
      : {
          type: "ai",
          title: pcpCompanyProfile.name,
          icon: <VeloraVcaLogoMark showAiBadge />,
        };
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
            ? "md:bottom-6 md:top-[calc(52px_+_var(--design-spacing-xxl))]"
            : "md:bottom-0 md:top-[calc(52px_+_var(--design-spacing-xxl))]",
          isFabEntryMode
            ? "md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
            : "md:w-[min(calc(100vw_-_var(--pcp-ai-tray-right)_-_var(--design-spacing-xxl)),var(--design-layout-panel-collapsed-width))]",
          isFabEntryMode
            ? vcaFloatingDesktopRightClass
            : vcaSeparateDesktopRightClass,
        );

  function resetVcaConversation() {
    setVcaConversationStage("opening");
    setVcaVisitorPromptId(null);
    setVcaVisitorQuestion(null);
    setVcaFollowUpQuestion(null);
    setVcaLiveSupportMessages([]);
    setVcaDraft("");
    setIsCaseStudyOpen(false);
    setIsJobOpen(false);
  }

  function startVcaLiveSupportFlow(message: string) {
    setVcaVisitorPromptId(null);
    setVcaVisitorQuestion(null);
    setVcaFollowUpQuestion(null);
    setVcaLiveSupportMessages([message]);
    setVcaConversationStage("liveSupportConnecting");
    setVcaDraft("");
    setIsCaseStudyOpen(false);
    setIsJobOpen(false);
    setVcaPanelVariant("collapsed");
  }

  function appendVcaLiveSupportMessage(message: string) {
    setVcaLiveSupportMessages((currentMessages) => [
      ...currentMessages,
      message,
    ]);
    setVcaDraft("");
  }

  useEffect(() => {
    if (vcaConversationStage !== "liveSupportConnecting") {
      return;
    }

    const connectingTimer = window.setTimeout(() => {
      setVcaConversationStage("liveSupportConnected");
    }, LIVE_SUPPORT_CONNECT_DELAY_MS);

    return () => {
      window.clearTimeout(connectingTimer);
    };
  }, [vcaConversationStage]);

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

  function handleOpenVcaJob(job: VcaJobOpening) {
    runMessagingSurfaceTransition(() => {
      setSelectedVcaJob(job);
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

    if (isLiveSupportStory) {
      if (vcaConversationStage === "liveSupportConnected") {
        appendVcaLiveSupportMessage(prompt);
        return;
      }

      if (vcaConversationStage !== "liveSupportConnecting") {
        startVcaLiveSupportFlow(prompt);
      }

      return;
    }

    if (isJobSeekerIntent) {
      setVcaVisitorQuestion(
        prompt === VCA_JOB_SEEKER_CHIP ? VCA_JOB_SEEKER_QUESTION : prompt,
      );
      setVcaFollowUpQuestion(null);
      setVcaConversationStage("jobProof");
      return;
    }

    const promptId = getVcaVisitorPromptId(prompt);

    if (prompt === VCA_DRAFT_INTRO_PROMPT) {
      setVcaConversationStage("handoffOffered");
      return;
    }

    if (promptId === "jobs") {
      setVcaVisitorQuestion(prompt);
      setVcaVisitorPromptId(promptId);
      setVcaFollowUpQuestion(null);
      setVcaConversationStage("jobProof");
      return;
    }

    if (vcaConversationStage === "postProof") {
      setVcaFollowUpQuestion(prompt);
      setVcaConversationStage("handoffOffered");
      return;
    }

    if (vcaConversationStage === "opening") {
      setVcaVisitorQuestion(prompt);
      setVcaVisitorPromptId(promptId);

      if (promptId && promptId !== "posts") {
        setVcaConversationStage("pageExplorerAnswered");
        return;
      }

      setVcaConversationStage("postProof");
      return;
    }

    if (vcaConversationStage === "pageExplorerAnswered") {
      setVcaVisitorQuestion(prompt);
      setVcaVisitorPromptId(promptId);

      if (promptId && promptId !== "posts") {
        setVcaConversationStage("pageExplorerAnswered");
        return;
      }

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
    const draftText = vcaDraft;
    const trimmedDraft = draftText.trim();

    if (!trimmedDraft) {
      return;
    }

    if (isLiveSupportStory) {
      if (vcaConversationStage === "liveSupportConnected") {
        appendVcaLiveSupportMessage(draftText);
        return;
      }

      if (vcaConversationStage !== "liveSupportConnecting") {
        startVcaLiveSupportFlow(draftText);
      }

      return;
    }

    if (isJobSeekerIntent) {
      setVcaVisitorQuestion(trimmedDraft);
      setVcaFollowUpQuestion(null);
      setVcaConversationStage("jobProof");
      setVcaDraft("");
      return;
    }

    const promptId = getVcaVisitorPromptId(trimmedDraft);

    if (promptId === "jobs") {
      setVcaVisitorQuestion(trimmedDraft);
      setVcaVisitorPromptId(promptId);
      setVcaFollowUpQuestion(null);
      setVcaConversationStage("jobProof");
      setVcaDraft("");
      return;
    }

    if (
      vcaConversationStage === "opening" ||
      vcaConversationStage === "pageExplorerAnswered"
    ) {
      setVcaVisitorQuestion(trimmedDraft);
      setVcaVisitorPromptId(promptId);
      setVcaFollowUpQuestion(null);

      if (promptId && promptId !== "posts") {
        setVcaConversationStage("pageExplorerAnswered");
        setVcaDraft("");
        return;
      }

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
    <main className="min-h-dvh overflow-x-hidden bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation
        profileSrc={assetSrc(pcpVisitorPersona.memberAvatar)}
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
          {isFabIconEntryMode ? (
            <VcaFab
              chatPanelId={vcaPanelId}
              isOpen={false}
              label={`Open ${pcpCompanyProfile.name} assistant`}
              onClick={handleOpenVcaFromTray}
              position="static"
              variant="visitor"
            />
          ) : (
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
          )}
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
          identity={vcaTrayIdentity}
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
              liveSupportMessages={vcaLiveSupportMessages}
              memberIntent={memberIntent}
              selectedJob={selectedVcaJob}
              surfaceMode={isFabEntryMode ? "fab" : "tray"}
              visitorPromptId={vcaVisitorPromptId}
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
