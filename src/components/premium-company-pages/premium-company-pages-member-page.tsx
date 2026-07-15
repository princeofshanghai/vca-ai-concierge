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
  ChatResponseBlock,
  ChatTray,
  ChatThread,
  Prompt,
  type ChatHeaderIdentity,
  type ChatPanelVariant,
} from "@/components/chat/chat-ui";
import {
  ChatSidePanel,
  ChatSidePanelLayout,
} from "@/components/chat/chat-side-panel";
import {
  startClassedViewTransition,
  useChatLatestMessageAnchor,
  type ChatMessageStreamStatus,
} from "@/components/chat/chat-motion";
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
import {
  SduiReactionIcon,
  type SduiReactionIconType,
} from "@/components/primitives/reaction-icon";
import { TabItemHorizontal } from "@/components/primitives/tab-item-horizontal";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

import {
  PCP_ASSET_ROOT,
  PCP_MEMBER_ASSET_ROOT,
  pcpAdminPersona,
  pcpCompanyProfile,
  pcpProofSnippets,
  pcpVcaScenario,
  pcpVisitorPersona,
} from "./persona";
import {
  LIVE_SUPPORT_CONNECT_DELAY_MS,
  PCP_LIVE_SUPPORT_AGENT,
  VCA_CASE_STUDY_RETURN_PROMPT,
  VCA_DRAFT_INTRO_PROMPT,
  VCA_JOB_PROOF_INTRO,
  VCA_JOB_SEEKER_CHIP,
  VCA_JOB_SEEKER_QUESTION,
  VCA_JOB_SEEKER_RESPONSE,
  VCA_POST_RESPONSE,
  VCA_PRODUCT_POST_RESPONSE,
  VCA_PRODUCT_POST_RESPONSE_LINKS,
  VCA_PRODUCT_RESPONSE,
  VCA_PRODUCT_RESPONSE_HIGHLIGHTS,
  VCA_PRODUCT_RESPONSE_LINKS,
  affiliatedPages,
  companyMetadata,
  footerLinkColumns,
  getVcaHandoffOffer,
  getVcaHandoffMessage,
  getVcaVisitorPromptId,
  isVcaOpenEnrollmentReadinessQuestion,
  isVcaProductQuestion,
  leaderPosts,
  leaders,
  mainJobOpenings,
  newsletters,
  overviewHighlights,
  pageTabs,
  posts,
  promotedJobs,
  serviceKeywords,
  services,
  sideJobs,
  vcaCaseStudyPostDetail,
  vcaJobOpenings,
  vcaJobSeekerPrompts,
  vcaOpeningPrompts,
  vcaReadinessPostDetail,
  visitorProducts,
  type LeaderPostData,
  type PremiumCompanyPagesMemberStory,
  type VcaJobOpening,
  type VcaMemberIntent,
  type VcaPostDetail,
  type VcaShellMode,
  type VcaVisitorPromptId,
  type VisitorPostData,
  type VisitorProductData,
} from "./premium-company-pages-member-data";
import { FabPromptStack } from "./fab-prompt-stack";
import { GlobalInboxTray } from "./global-inbox-tray";
import {
  JobCard as ResponseJobCard,
  PostCard as ResponsePostCard,
  ProductCard as ResponseProductCard,
} from "./response-blocks/ChatCards";
import { PersonCard as ResponsePersonCard } from "./response-blocks/PersonCard";
import { PostSidePanelEngagementSummary } from "./post-side-panel-engagement-summary";
import { ResponseRail } from "./response-blocks/ResponseRail";
import { StreamingText as ResponseStreamingText } from "./response-blocks/Text";
import { ScriptedResponseTurn } from "./scripted-response-turn";
import { useHorizontalCarousel } from "./use-horizontal-carousel";
import { useScriptedTurnController } from "./use-scripted-turn-controller";
import { VcaFab } from "./vca-fab";

const ASSET_ROOT = PCP_MEMBER_ASSET_ROOT;
const VELORA_VISITOR_ASSISTANT_COLOR = "#2AA986";

export type {
  PremiumCompanyPagesMemberStory,
  VcaMemberIntent,
  VcaShellMode,
} from "./premium-company-pages-member-data";

type MessagingSurfaceState = "closed" | "docked" | "open";

type VcaConversationStage =
  | "opening"
  | "pageExplorerAnswered"
  | "productProof"
  | "productPostProof"
  | "postProof"
  | "caseStudyReturned"
  | "jobProof"
  | "handoffOffered"
  | "handoffOpened"
  | "liveSupportConnecting"
  | "liveSupportConnected";
type VcaAnimatedTurnId =
  | "member-vca-page-explorer-answer"
  | "member-vca-product-proof"
  | "member-vca-product-post-proof"
  | "member-vca-post-proof"
  | "member-vca-job-proof"
  | "member-vca-case-study-return"
  | "member-vca-handoff-offer";

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

  if (conversationStage === "productProof") {
    return "member-vca-product-proof";
  }

  if (conversationStage === "productPostProof") {
    return "member-vca-product-post-proof";
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${ASSET_ROOT}/${path}`;
}

function isVcaPostDetail(value: unknown): value is VcaPostDetail {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as Partial<VcaPostDetail>).body),
  );
}

function isVcaLiveSupportRequest(prompt: string) {
  const normalizedPrompt = prompt.trim().toLocaleLowerCase();

  return [
    "contact sales",
    "connect me",
    "human",
    "live support",
    "message someone",
    "representative",
    "sales consultant",
    "speak to someone",
    "support agent",
    "talk to sales",
    "talk to someone",
  ].some((keyword) => normalizedPrompt.includes(keyword));
}

const VELORA_LOGO_AVATAR_RADIUS_CLASS = "rounded-sm";
const VELORA_LOGO_TILE_BACKGROUND_CLASS = "bg-[#ACF5B3]";
const VELORA_LOGO_TILE_BACKGROUND_STYLE = {
  backgroundColor: "#ACF5B3",
};

function VeloraVcaLogoMark({
  showAiBadge = false,
  size = "small",
  surface = "tile",
}: Readonly<{
  showAiBadge?: boolean;
  size?: "small" | "medium" | "large";
  surface?: "tile" | "bare";
}>) {
  const markSizeClass =
    size === "large" ? "size-10" : size === "medium" ? "size-8" : "size-7";
  const badgeSizeClass = size === "large" ? "size-5" : "size-4";
  const isBareSurface = surface === "bare";

  return (
    <span className={cx("relative inline-flex shrink-0", markSizeClass)}>
      <span
        className={cx(
          "inline-flex size-full items-center justify-center overflow-hidden",
          isBareSurface
            ? "p-0"
            : cx(
                "border border-border-faint bg-[#ACF5B3] p-[3px]",
                VELORA_LOGO_AVATAR_RADIUS_CLASS,
              ),
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
            "absolute -bottom-xxs -right-xxs inline-flex items-center justify-center rounded-round border-2 border-background bg-background",
            badgeSizeClass,
          )}
          style={{ color: VELORA_VISITOR_ASSISTANT_COLOR }}
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

function InlineVcaStreamingText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return isStreaming ? <ResponseStreamingText text={text} /> : <>{text}</>;
}

type VcaAssistantTextLink = Readonly<{
  href?: string;
  label: string;
  onSelect?: () => void;
}>;

const vcaPageExplorerResponseHighlights: Partial<
  Record<VcaVisitorPromptId, ReadonlyArray<string>>
> = {
  overview: [
    "one shared workflow",
    "open enrollment",
    "carrier readiness",
  ],
  fit: [
    "larger teams",
    "multiple employee groups",
    "carrier connections",
  ],
  difference: [
    "before enrollment issues become urgent",
    "carrier readiness",
    "operational command center",
  ],
};

const vcaPageExplorerResponseLinks: Partial<
  Record<VcaVisitorPromptId, ReadonlyArray<VcaAssistantTextLink>>
> = {
  overview: [
    {
      label: "Velora's website",
      href: "#velora-website",
    },
  ],
  fit: [
    {
      label: "Velora's customer stories",
      href: "#velora-customer-stories",
    },
    {
      label: "connect with their team",
      href: "#velora-contact",
    },
  ],
};

function EmphasizedVcaText({
  highlights,
  isStreaming,
  links = [],
  text,
}: Readonly<{
  highlights: ReadonlyArray<string>;
  isStreaming: boolean;
  links?: ReadonlyArray<VcaAssistantTextLink>;
  text: string;
}>) {
  const pieces: Array<
    Readonly<{
      text: string;
      highlight?: boolean;
      link?: VcaAssistantTextLink;
    }>
  > = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    const linkMatches = links.map((link) => ({
      index: remainingText.indexOf(link.label),
      kind: "link" as const,
      label: link.label,
      link,
    }));
    const highlightMatches = highlights.map((phrase) => ({
      index: remainingText.indexOf(phrase),
      kind: "highlight" as const,
      label: phrase,
      link: undefined,
    }));
    const nextMatch = [...linkMatches, ...highlightMatches].reduce<{
      index: number;
      kind: "link" | "highlight";
      label: string;
      link?: VcaAssistantTextLink;
    } | null>((currentMatch, phrase) => {
      if (phrase.index === -1) {
        return currentMatch;
      }

      if (
        currentMatch === null ||
        phrase.index < currentMatch.index ||
        (phrase.index === currentMatch.index &&
          (phrase.kind === "link" ||
            phrase.label.length > currentMatch.label.length))
      ) {
        return phrase;
      }

      return currentMatch;
    }, null);

    if (!nextMatch) {
      pieces.push({ text: remainingText });
      break;
    }

    if (nextMatch.index > 0) {
      pieces.push({
        text: remainingText.slice(0, nextMatch.index),
      });
    }

    pieces.push({
      text: nextMatch.label,
      highlight: nextMatch.kind === "highlight",
      link: nextMatch.link,
    });
    remainingText = remainingText.slice(
      nextMatch.index + nextMatch.label.length,
    );
  }

  return (
    <>
      {pieces.map((piece, index) => {
        if (piece.link) {
          const linkContent = (
            <InlineVcaStreamingText
              isStreaming={isStreaming}
              text={piece.text}
            />
          );

          if (piece.link.onSelect) {
            return (
              <button
                className="inline font-semibold text-action hover:text-action-hover hover:underline"
                key={index}
                onClick={() => piece.link?.onSelect?.()}
                type="button"
              >
                {linkContent}
              </button>
            );
          }

          return (
            <a
              className="font-semibold text-action hover:text-action-hover hover:underline"
              href={piece.link.href ?? "#"}
              key={index}
            >
              {linkContent}
            </a>
          );
        }

        return piece.highlight ? (
          <strong className="font-semibold text-text" key={index}>
            <InlineVcaStreamingText
              isStreaming={isStreaming}
              text={piece.text}
            />
          </strong>
        ) : (
          <InlineVcaStreamingText
            isStreaming={isStreaming}
            key={index}
            text={piece.text}
          />
        );
      })}
    </>
  );
}

function FormattedVcaAssistantText({
  highlights = [],
  links = [],
  streamStatus,
  streamText,
  text,
}: Readonly<{
  highlights?: ReadonlyArray<string>;
  links?: ReadonlyArray<VcaAssistantTextLink>;
  streamStatus: ChatMessageStreamStatus;
  streamText: string;
  text: string;
}>) {
  const isStreaming = streamStatus === "streaming";
  const visibleText = isStreaming ? streamText : text;
  const blocks = visibleText
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => (
        <p className={cx(index > 0 && "mt-md")} key={index}>
          <EmphasizedVcaText
            highlights={highlights}
            isStreaming={isStreaming}
            links={links}
            text={block}
          />
        </p>
      ))}
    </>
  );
}

type VcaScriptedAssistantTurnProps = Omit<
  ComponentProps<typeof ScriptedResponseTurn>,
  "renderText"
> & {
  highlights?: ReadonlyArray<string>;
  links?: ReadonlyArray<VcaAssistantTextLink>;
  timestamp: string;
};

function VcaScriptedAssistantTurn({
  attachments = [],
  highlights,
  id,
  links,
  timestamp,
  ...props
}: VcaScriptedAssistantTurnProps) {
  const [stableTimestamp] = useState(() => timestamp);

  return (
    <ScriptedResponseTurn
      {...props}
      attachments={attachments}
      feedbackPolicy="rateable"
      id={id}
      renderText={({ streamStatus, streamText, text }) => (
        <VcaAssistantMessage>
          <FormattedVcaAssistantText
            highlights={highlights}
            links={links}
            streamStatus={streamStatus}
            streamText={streamText}
            text={text}
          />
        </VcaAssistantMessage>
      )}
      timestamp={stableTimestamp}
    />
  );
}

function VcaWelcomeIntro({
  prompts,
  onPromptSelect,
  timestamp,
}: Readonly<{
  prompts: ReadonlyArray<Readonly<{ label: string }>>;
  onPromptSelect: (prompt: string) => void;
  timestamp: string;
}>) {
  return (
    <ChatResponseBlock timestamp={timestamp}>
      <section className="flex w-full max-w-[var(--design-layout-chat-message-assistant-max)] flex-col items-start pt-sm pr-sm">
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
    </ChatResponseBlock>
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
    <ResponsePostCard
      actions={[
        {
          label: "View post",
          onSelect: onViewPost,
          variant: "secondary",
        },
      ]}
      authorLogoClassName={VELORA_LOGO_TILE_BACKGROUND_CLASS}
      authorLogoSrc={pcpCompanyProfile.logoSrc}
      authorLogoStyle={VELORA_LOGO_TILE_BACKGROUND_STYLE}
      authorName={pcpCompanyProfile.name}
      comments={pcpProofSnippets.postCommentLabel}
      imageAlt={pcpProofSnippets.postImageAlt}
      imageSrc={assetSrc(pcpProofSnippets.postImage)}
      followerCount={pcpCompanyProfile.followers}
      reactions={pcpProofSnippets.postEngagement}
      reactionTypes={defaultReactionTypes}
      reposts={`${pcpProofSnippets.postRepostCount} reposts`}
      snippet="A 12,000-employee retailer simplified carrier coordination before open enrollment by keeping eligibility cleanup, carrier files, and employee communications in one workflow."
      timestamp="35m"
    />
  );
}

function PostMediaPlaceholder({
  className,
  label,
}: Readonly<{ className?: string; label: string }>) {
  return (
    <div
      aria-label={label}
      className={cx(
        "flex items-center justify-center bg-background-neutral-soft text-icon",
        className,
      )}
      role="img"
    >
      <Icon name="image" size="medium" />
    </div>
  );
}

function VeloraReadinessPostProofCard({
  onViewPost,
}: Readonly<{ onViewPost: () => void }>) {
  return (
    <ResponsePostCard
      actions={[
        {
          label: "View post",
          onSelect: onViewPost,
          variant: "secondary",
        },
      ]}
      authorLogoClassName={VELORA_LOGO_TILE_BACKGROUND_CLASS}
      authorLogoSrc={pcpCompanyProfile.logoSrc}
      authorLogoStyle={VELORA_LOGO_TILE_BACKGROUND_STYLE}
      authorName={pcpCompanyProfile.name}
      comments="18 comments"
      imageAlt={vcaReadinessPostDetail.imageAlt}
      imageSrc={
        vcaReadinessPostDetail.image
          ? assetSrc(vcaReadinessPostDetail.image)
          : undefined
      }
      linkMeta={pcpCompanyProfile.name}
      linkTitle={vcaReadinessPostDetail.title}
      followerCount={pcpCompanyProfile.followers}
      reactions="216"
      reactionTypes={defaultReactionTypes}
      snippet="Open enrollment readiness starts before plan changes are announced. Here are a few ways benefits teams can keep the launch on track."
      timestamp="35m"
    />
  );
}

function VeloraProductResponseCard({
  onViewProduct,
  product,
}: Readonly<{
  onViewProduct: (product: VisitorProductData) => void;
  product: VisitorProductData;
}>) {
  return (
    <ResponseProductCard
      actions={[
        {
          label: "View product",
          onSelect: () => onViewProduct(product),
          variant: "secondary",
        },
      ]}
      body={product.body}
      imageAlt={product.imageAlt}
      imageSrc={product.image ? assetSrc(product.image) : undefined}
      title={product.title}
      type={product.type}
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
  post,
}: Readonly<{ onBack: () => void; post: VcaPostDetail }>) {
  return (
    <ChatSidePanel
      className="bg-background [&_.chat-side-panel-x]:!bg-background"
      contentClassName="mx-auto w-full max-w-[760px] pb-xl"
      headerActions={
        <div className="flex items-center gap-sm">
          <ButtonIcon
            icon="bookmark-outline"
            label="Save post"
            size="small"
            variant="tertiary"
          />
          <ButtonIcon
            icon="overflow-web-ios"
            label="More post actions"
            size="small"
            variant="tertiary"
          />
        </div>
      }
      onBack={onBack}
    >
      <article className="text-text">
        {post.image ? (
          <Image
            alt={post.imageAlt}
            className="aspect-[16/7] w-full object-cover"
            height={332}
            src={assetSrc(post.image)}
            width={760}
          />
        ) : (
          <PostMediaPlaceholder
            className="aspect-[16/7] w-full"
            label={post.imageAlt}
          />
        )}

        <h1 className="mt-xl text-heading-lg text-text">
          {post.title}
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
          {post.dateLabel}
        </p>

        <div className="mt-xl space-y-md text-body-sm-open text-text">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <PostSidePanelEngagementSummary
          comments={post.commentLabel}
          reactions={post.engagement}
          reposts={post.repostLabel}
        />

        <footer className="mt-xxl flex justify-end gap-sm border-t border-border-faint pt-lg">
          <Button
            className="px-pill-padding-inline"
            size="medium"
            trailingIcon={<Icon name="link-external" size="small" />}
            variant="secondary"
          >
            Go to post
          </Button>
        </footer>
      </article>
    </ChatSidePanel>
  );
}

function VeloraLinkedInJobPreviewCard({
  job,
  onViewJob,
}: Readonly<{ job: VcaJobOpening; onViewJob: (job: VcaJobOpening) => void }>) {
  return (
    <ResponseJobCard
      actions={[
        {
          label: "View job",
          onSelect: () => onViewJob(job),
          variant: "secondary",
        },
      ]}
      alumni={job.alumni}
      alumniImageSrc={assetSrc("school-alumni-spartan.png")}
      company={pcpCompanyProfile.name}
      location={job.location}
      logoClassName={VELORA_LOGO_TILE_BACKGROUND_CLASS}
      logoSrc={pcpCompanyProfile.logoSrc}
      logoStyle={VELORA_LOGO_TILE_BACKGROUND_STYLE}
      timestamp={job.posted}
      title={job.title}
    />
  );
}

function VeloraJobSidePanel({
  job,
  onBack,
}: Readonly<{ job: VcaJobOpening; onBack: () => void }>) {
  return (
    <ChatSidePanel
      className="bg-background [&_.chat-side-panel-x]:!bg-background"
      contentClassName="mx-auto w-full max-w-[760px] pb-xl"
      headerActions={
        <div className="flex items-center gap-sm">
          <ButtonIcon
            icon="overflow-web-ios"
            label="More job actions"
            size="small"
            variant="tertiary"
          />
        </div>
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
          <p className="mt-xl text-body-sm-open text-text">
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
            View job details
          </Button>
        </footer>
      </article>
    </ChatSidePanel>
  );
}

function ProductMediaPlaceholder({
  className,
  label,
}: Readonly<{ className?: string; label: string }>) {
  return (
    <div
      aria-label={label}
      className={cx(
        "flex items-center justify-center rounded-sm border border-border-faint bg-background-neutral-soft text-icon",
        className,
      )}
      role="img"
    >
      <Icon name="image" size="medium" />
    </div>
  );
}

function ProductProofSummary() {
  return (
    <div className="mt-md flex flex-wrap items-center gap-x-xl gap-y-sm text-body-sm text-text-meta">
      <div className="flex min-w-0 items-center gap-sm">
        <span className="flex shrink-0 -space-x-[8px]">
          {leaders.slice(0, 3).map((leader) => (
            <Entity
              className="border-2 border-background"
              key={leader.name}
              label={leader.name}
              size={32}
              src={assetSrc(leader.image)}
            />
          ))}
        </span>
        <span className="font-bold underline-offset-2 hover:underline">
          Ask {pcpAdminPersona.firstName} and 3 others about this product
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-sm">
        <Entity label="Flexis" shape="square" size={24} />
        <span className="font-bold underline-offset-2 hover:underline">
          Used by Flexis and 5 featured customers
        </span>
      </div>
    </div>
  );
}

function VeloraProductSidePanel({
  onBack,
  product,
}: Readonly<{
  onBack: () => void;
  product: VisitorProductData;
}>) {
  const productFeatures = [
    "Compare plans",
    "Enroll in benefits",
    "Update dependents",
    "Track deadlines",
  ] as const;
  const productDescription =
    "Velora Dashboard gives employees one place to compare benefits options, enroll in coverage, update dependents, and keep track of what needs attention before enrollment deadlines. It is designed to make the employee experience feel guided and self-service, while helping HR teams reduce repetitive questions about where to go next.";

  return (
    <ChatSidePanel
      className="bg-background [&_.chat-side-panel-x]:!bg-background"
      contentClassName="mx-auto w-full max-w-[760px] pb-xl"
      onBack={onBack}
    >
      <article className="text-text">
        {product.image ? (
          <Image
            alt={product.imageAlt ?? ""}
            className="aspect-[16/7] w-full rounded-sm object-cover"
            height={332}
            src={assetSrc(product.image)}
            width={760}
          />
        ) : null}

        <div className="-mt-[80px] ml-xxl">
          <Entity
            className={cx(
              VELORA_LOGO_TILE_BACKGROUND_CLASS,
              "border-[8px] border-background",
            )}
            label={pcpCompanyProfile.name}
            shape="square"
            size={128}
            src={pcpCompanyProfile.logoSrc}
            style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
          />
        </div>

        <div className="mt-xl min-w-0">
          <h1 className="text-display-md text-text">{product.title}</h1>
          <p className="mt-xs text-body-md text-text-meta">
            <span className="font-bold">{product.type}</span> by{" "}
            <span className="font-bold">{pcpCompanyProfile.name}</span>
          </p>
          <ProductProofSummary />
        </div>

        <section className="mt-xxl border-t border-border-faint pt-xxl">
          <h2 className="text-heading-lg text-text">
            What is {product.title}?
          </h2>
          <p className="mt-md text-body-sm-open text-text">
            {productDescription}{" "}
            <button className="font-semibold text-text" type="button">
              ...see more
            </button>
          </p>
        </section>

        <section className="mt-xxl border-t border-border-faint pt-xxl">
          <h2 className="text-heading-lg text-text">
            Key things employees can do
          </h2>
          <div className="mt-lg grid gap-md sm:grid-cols-2">
            {productFeatures.map((feature) => (
              <div
                className="flex min-h-[96px] items-center rounded-sm border border-border-faint bg-background px-xl py-lg"
                key={feature}
              >
                <p className="text-control-sm text-text">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-xxl border-t border-border-faint pt-xxl">
          <h2 className="text-heading-lg text-text">Product media</h2>
          <ProductMediaPlaceholder
            className="mt-lg aspect-video w-full"
            label={`${product.title} media preview`}
          />
          <div className="mt-md grid grid-cols-3 gap-sm">
            {[1, 2, 3].map((index) => (
              <ProductMediaPlaceholder
                className="aspect-video"
                key={index}
                label={`${product.title} media thumbnail ${index}`}
              />
            ))}
          </div>
        </section>

        <div className="mt-xxl flex justify-end gap-sm border-t border-border-faint pt-lg">
          <Button
            className="px-pill-padding-inline"
            size="medium"
            trailingIcon={<Icon name="link-external" size="small" />}
            variant="secondary"
          >
            Learn more
          </Button>
          <Button
            className="px-pill-padding-inline"
            size="medium"
            trailingIcon={<Icon name="link-external" size="small" />}
            variant="secondary"
          >
            View product page
          </Button>
        </div>
      </article>
    </ChatSidePanel>
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

export type PremiumCompanyPagesVcaSidePanelPreviewKind =
  | "post"
  | "job"
  | "product";

export function PremiumCompanyPagesVcaSidePanelPreview({
  kind,
  variant = "expanded",
}: Readonly<{
  kind: PremiumCompanyPagesVcaSidePanelPreviewKind;
  variant?: ChatPanelVariant;
}>) {
  const isPostOpen = kind === "post";
  const isJobOpen = kind === "job";
  const isProductOpen = kind === "product";
  const noop = () => {};

  return (
    <PremiumCompanyPagesVcaPanel
      conversationStage={
        isProductOpen ? "productProof" : isJobOpen ? "jobProof" : "postProof"
      }
      draft=""
      followUpQuestion={null}
      isCaseStudyOpen={isPostOpen}
      isJobOpen={isJobOpen}
      isProductOpen={isProductOpen}
      liveSupportMessages={[]}
      memberIntent={isJobOpen ? "job-seeker" : "buyer"}
      productPostQuestion={null}
      selectedJob={vcaJobOpenings[0]}
      selectedPost={vcaCaseStudyPostDetail}
      selectedProduct={visitorProducts[0]}
      surfaceMode="fab"
      visitorPromptId={isPostOpen ? "posts" : null}
      visitorQuestion={
        isProductOpen
          ? "Can employees self-serve benefits enrollment in Velora Dashboard?"
          : isJobOpen
            ? VCA_JOB_SEEKER_QUESTION
            : pcpVcaScenario.pageExplorerPrompts.posts
      }
      variant={variant}
      onClose={noop}
      onCloseCaseStudy={noop}
      onCloseJob={noop}
      onCloseProduct={noop}
      onDraftChange={noop}
      onOpenCaseStudy={noop}
      onOpenJob={noop}
      onOpenMessage={noop}
      onOpenProduct={noop}
      onPromptSelect={noop}
      onSend={noop}
      onVariantToggle={noop}
    />
  );
}

function VeloraAiHeader({
  actionSize,
  onClose,
  onVariantToggle,
  variant = "collapsed",
}: Readonly<{
  actionSize: "small" | "medium";
  onClose: () => void;
  onVariantToggle?: () => void;
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
          <h2 className="min-w-0 truncate text-heading-md text-text">
            Velora
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-0">
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
  isProductOpen,
  liveSupportMessages,
  selectedProduct,
  selectedJob,
  selectedPost,
  visitorPromptId,
  visitorQuestion,
  productPostQuestion,
  followUpQuestion,
  onClose,
  onCloseCaseStudy,
  onCloseJob,
  onCloseProduct,
  onDraftChange,
  onOpenCaseStudy,
  onOpenJob,
  onOpenProduct,
  onOpenMessage,
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
  isProductOpen: boolean;
  liveSupportMessages: ReadonlyArray<string>;
  selectedProduct: VisitorProductData;
  selectedJob: VcaJobOpening;
  selectedPost: VcaPostDetail;
  visitorPromptId: VcaVisitorPromptId | null;
  visitorQuestion: string | null;
  productPostQuestion: string | null;
  followUpQuestion: string | null;
  onClose: () => void;
  onCloseCaseStudy: () => void;
  onCloseJob: () => void;
  onCloseProduct: () => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onOpenCaseStudy: (post?: VcaPostDetail) => void;
  onOpenJob: (job: VcaJobOpening) => void;
  onOpenProduct: (product: VisitorProductData) => void;
  onOpenMessage: () => void;
  onVariantToggle?: () => void;
  onPromptSelect: (prompt: string) => void;
  onSend: () => void;
}>) {
  const headerActionSize = variant === "expanded" ? "medium" : "small";
  const isJobSeekerIntent = memberIntent === "job-seeker";
  const isDetailPanelOpen = isCaseStudyOpen || isJobOpen || isProductOpen;
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
  const hasProductPostQuestion = Boolean(productPostQuestion);
  const isProductFlow =
    !isJobSeekerIntent && isVcaProductQuestion(visitorQuestion);
  const handoffOffer = getVcaHandoffOffer(visitorQuestion);
  const shouldShowProof =
    !isProductFlow &&
    !isJobSeekerIntent &&
    (conversationStage === "postProof" ||
      conversationStage === "caseStudyReturned" ||
      conversationStage === "handoffOffered" ||
      conversationStage === "handoffOpened");
  const shouldShowProductProof =
    isProductFlow &&
    (conversationStage === "productProof" ||
      conversationStage === "productPostProof" ||
      conversationStage === "handoffOffered" ||
      conversationStage === "handoffOpened");
  const shouldShowProductPostProof =
    isProductFlow &&
    hasProductPostQuestion &&
    (conversationStage === "productPostProof" ||
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
  const {
    busyTurnCount,
    handleScriptedTurnBusyChange,
    handleStopAssistantResponse,
    isAssistantBusy,
    stopSignal,
  } = useScriptedTurnController();
  const isComposerDisabled = isAssistantBusy || isLiveSupportConnecting;
  const latestLiveSupportMessage =
    liveSupportMessages[liveSupportMessages.length - 1];
  const latestUserMessageAnchorKey = latestLiveSupportMessage
    ? `live-support:${liveSupportMessages.length}:${latestLiveSupportMessage}`
    : followUpQuestion
      ? `follow-up:${followUpQuestion}`
      : productPostQuestion
        ? `product-post:${productPostQuestion}`
        : visitorQuestion
          ? `visitor:${visitorQuestion}`
          : null;
  const latestContentKey = `${conversationStage}:${visitorQuestion ?? ""}:${productPostQuestion ?? ""}:${followUpQuestion ?? ""}:${liveSupportMessages.length}:${busyTurnCount}:${isDetailPanelOpen}`;
  const {
    hasLatestBelow: hasMainLatestBelow,
    handleScroll: handleMainLatestScroll,
    scrollToLatest: scrollMainToLatest,
  } = useChatLatestMessageAnchor({
    scrollRef: chatBodyRef,
    anchorKey: isDetailPanelOpen ? null : latestUserMessageAnchorKey,
    contentKey: latestContentKey,
  });
  const {
    hasLatestBelow: hasHistoryLatestBelow,
    handleScroll: handleHistoryLatestScroll,
    scrollToLatest: scrollHistoryToLatest,
  } = useChatLatestMessageAnchor({
    scrollRef: sidePanelHistoryRef,
    anchorKey: isDetailPanelOpen ? latestUserMessageAnchorKey : null,
    contentKey: latestContentKey,
  });
  const activeAnimatedTurnId = getActiveVcaAnimatedTurnId({
    conversationStage,
    hasFollowUp,
    isDetailPanelOpen,
    isJobSeekerIntent,
  });
  let messageTimestampIndex = 0;
  const getNextMessageTimestamp = () =>
    getPrototypeMessageTimestamp(messageTimestampIndex++);
  const handleVcaContentChange = useCallback(() => {
    if (isDetailPanelOpen) {
      handleHistoryLatestScroll();
      return;
    }

    handleMainLatestScroll();
  }, [handleHistoryLatestScroll, handleMainLatestScroll, isDetailPanelOpen]);

  const thread = (
    <ChatThread aiDisclaimerHref="#">
      <div className="flex flex-col gap-lg">
        {shouldShowWelcome ? (
          <VcaWelcomeIntro
            onPromptSelect={onPromptSelect}
            prompts={starterPrompts}
            timestamp={getNextMessageTimestamp()}
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
            highlights={
              visitorPromptId
                ? vcaPageExplorerResponseHighlights[visitorPromptId]
                : undefined
            }
            id="member-vca-page-explorer-answer"
            links={
              visitorPromptId
                ? vcaPageExplorerResponseLinks[visitorPromptId]
                : undefined
            }
            onBusyChange={handleScriptedTurnBusyChange}
            onContentChange={handleVcaContentChange}
            stopSignal={stopSignal}
            text={pageExplorerAnswer}
            timestamp={getNextMessageTimestamp()}
          />
        ) : null}
        {shouldShowProductProof ? (
          <VcaScriptedAssistantTurn
            animate={activeAnimatedTurnId === "member-vca-product-proof"}
            attachments={[
              {
                id: "product-proof",
                children: (
                  <VeloraProductResponseCard
                    onViewProduct={onOpenProduct}
                    product={visitorProducts[0]}
                  />
                ),
              },
            ]}
            highlights={VCA_PRODUCT_RESPONSE_HIGHLIGHTS}
            id="member-vca-product-proof"
            links={VCA_PRODUCT_RESPONSE_LINKS}
            onBusyChange={handleScriptedTurnBusyChange}
            onContentChange={handleVcaContentChange}
            stopSignal={stopSignal}
            text={VCA_PRODUCT_RESPONSE}
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
                    onViewPost={() => onOpenCaseStudy()}
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
        {hasProductPostQuestion && !isJobSeekerIntent ? (
          <VcaStableUserMessage timestamp={getNextMessageTimestamp()}>
            {productPostQuestion}
          </VcaStableUserMessage>
        ) : null}
        {shouldShowProductPostProof ? (
          <VcaScriptedAssistantTurn
            animate={
              activeAnimatedTurnId === "member-vca-product-post-proof"
            }
            attachments={[
              {
                id: "product-post-proof",
                children: (
                  <VeloraReadinessPostProofCard
                    onViewPost={() =>
                      onOpenCaseStudy(vcaReadinessPostDetail)
                    }
                  />
                ),
              },
            ]}
            id="member-vca-product-post-proof"
            links={VCA_PRODUCT_POST_RESPONSE_LINKS}
            onBusyChange={handleScriptedTurnBusyChange}
            onContentChange={handleVcaContentChange}
            stopSignal={stopSignal}
            text={VCA_PRODUCT_POST_RESPONSE}
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
                  id: "handoff-prompt",
                  children: (
                    <Prompt
                      className="w-fit max-w-full self-start"
                      onPromptSelect={onPromptSelect}
                      prompt={VCA_DRAFT_INTRO_PROMPT}
                    />
                  ),
                },
              ]}
              id="member-vca-handoff-offer"
              links={
                isProductFlow
                  ? [
                      {
                        label: "send Velora a message",
                        onSelect: onOpenMessage,
                      },
                    ]
                  : undefined
              }
              onBusyChange={handleScriptedTurnBusyChange}
              onContentChange={handleVcaContentChange}
              stopSignal={stopSignal}
              text={handoffOffer}
              timestamp={getNextMessageTimestamp()}
            />
          ) : (
            <Prompt
              className="w-fit max-w-full self-start"
              onPromptSelect={onPromptSelect}
              prompt={VCA_DRAFT_INTRO_PROMPT}
            />
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
          onVariantToggle={onVariantToggle}
          variant={variant}
        />
      ) : (
        <VeloraAiHeader
          actionSize={headerActionSize}
          onClose={onClose}
          onVariantToggle={onVariantToggle}
          variant={variant}
        />
      )}
      {isDetailPanelOpen ? (
        <ChatSidePanelLayout
          chatBodyClassName="pb-[96px]"
          chatBodyRef={sidePanelHistoryRef}
          history={thread}
          onChatBodyScroll={handleHistoryLatestScroll}
          onJumpToLatest={scrollHistoryToLatest}
          showJumpToLatest={hasHistoryLatestBelow}
          sidePanel={
            isProductOpen ? (
              <VeloraProductSidePanel
                onBack={onCloseProduct}
                product={selectedProduct}
              />
            ) : isJobOpen ? (
              <VeloraJobSidePanel job={selectedJob} onBack={onCloseJob} />
            ) : (
              <VeloraCaseStudySidePanel
                onBack={onCloseCaseStudy}
                post={selectedPost}
              />
            )
          }
          variant={variant}
        />
      ) : (
        <>
          <ChatBody
            ref={chatBodyRef}
            onJumpToLatest={scrollMainToLatest}
            onScroll={handleMainLatestScroll}
            showJumpToLatest={hasMainLatestBelow}
          >
            {thread}
          </ChatBody>
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
            showTopDivider={false}
            showVoiceMode={false}
            variant="collapsed"
          />
        </>
      )}
    </ChatPanel>
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
        "pcp-human-messaging-surface fixed bottom-0 z-40 hidden h-[min(calc(100dvh_-_96px),690px)] flex-col overflow-hidden rounded-t-sm border border-b-0 border-border-faint bg-background text-text shadow-raised-faint transition-[height,width,right,bottom,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none md:flex",
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

        {sentMessage ? (
          <div className="space-y-xl px-lg pb-xl">
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

function CompanyLogo({
  className,
  innerStrokeClassName,
}: Readonly<{ className?: string; innerStrokeClassName?: string }>) {
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
      {innerStrokeClassName ? (
        <span
          aria-hidden="true"
          className={cx("pointer-events-none absolute inset-0", innerStrokeClassName)}
        />
      ) : null}
    </span>
  );
}

function HeroCarouselIndicator() {
  return (
    <div
      aria-hidden="true"
      className="inline-flex h-5 w-[87px] items-center gap-[6px] rounded-[20px] bg-white/20 px-[8px]"
    >
      <span className="h-[6px] w-6 rounded-round bg-white" />
      {Array.from({ length: 4 }, (_, index) => (
        <span className="size-[6px] rounded-round bg-white" key={index} />
      ))}
    </div>
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
    <section className="relative min-h-[640px] overflow-hidden bg-[#011536] text-white lg:h-[640px]">
      <Image
        alt=""
        className="absolute inset-0 size-full object-cover object-center"
        height={640}
        priority
        src={pcpCompanyProfile.heroSrc}
        width={1440}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(177.5deg, rgba(1, 21, 54, 0) 6.43%, rgba(1, 21, 54, 0.441) 37.16%, rgba(1, 21, 54, 0.9) 61.24%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, transparent 18%, rgba(0, 0, 0, 0.65) 48%, #000 100%)",
          WebkitBackdropFilter: "blur(50px)",
          backdropFilter: "blur(50px)",
          background: "rgba(1, 21, 54, 0.01)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, transparent 18%, rgba(0, 0, 0, 0.65) 48%, #000 100%)",
        }}
      />

      <div className="relative min-h-[640px] px-lg lg:h-full">
        <div className="mx-auto flex min-h-[640px] w-full max-w-[1128px] flex-col justify-end gap-xxl pb-0 pt-stack lg:h-full lg:min-h-0">
          <div className="grid gap-xxl lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="min-w-0 w-[min(100%,320px)] pb-xxl sm:w-auto sm:max-w-[720px]">
              <CompanyLogo
                className="size-32 !rounded-[16px] shadow-raised-faint"
                innerStrokeClassName="rounded-[16px] shadow-[inset_0_0_0_4px_#fff]"
              />
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
                  className="!border-[var(--figma-color-border-color-border-knockout)] !bg-transparent !text-[var(--figma-color-label-color-label-knockout)] hover:!border-[var(--figma-color-border-color-border-knockout-hover)] hover:!bg-[var(--figma-color-background-color-background-transparent-overlay-hover)] hover:!shadow-[inset_0_0_0_1px_var(--figma-color-border-color-border-knockout-hover)] active:!border-[var(--figma-color-border-color-border-knockout-active)] active:!bg-[var(--figma-color-background-color-background-transparent-overlay-active)] active:!text-[var(--figma-color-label-color-label-knockout-active)] active:!shadow-none"
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
                    className="[&>span]:!border-[var(--figma-color-border-color-border-knockout)] [&>span]:!bg-transparent [&>span]:!text-[var(--figma-color-icon-color-icon-overlay)] [&>span]:group-hover:!shadow-[inset_0_0_0_1px_var(--figma-color-border-color-border-knockout-hover)] [&>span]:group-active:!shadow-none"
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

            <div className="mb-xxl flex w-[min(100%,320px)] flex-col items-start gap-[72px] text-[var(--figma-color-text-color-text-overlay)] lg:ml-auto lg:w-[320px] lg:items-end">
              <HeroCarouselIndicator />
              <aside className="w-full rounded-sm bg-white/0">
                <Image
                  alt=""
                  aria-hidden="true"
                  className="size-8"
                  height={32}
                  src={`${ASSET_ROOT}/quote.svg`}
                  unoptimized
                  width={32}
                />
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
    <span className="flex shrink-0 items-center gap-sm">
      {[
        `${PCP_ASSET_ROOT}/avatar-1.png`,
        `${PCP_ASSET_ROOT}/avatar-2.png`,
        `${PCP_ASSET_ROOT}/avatar-3.png`,
      ].map((image) => (
        <Entity
          key={image}
          className="ring-2 ring-background"
          label=""
          size={size}
          src={assetSrc(image)}
        />
      ))}
    </span>
  );
}

const defaultReactionTypes: ReadonlyArray<SduiReactionIconType> = [
  "like",
  "empathy",
  "interest",
];

function ReactionPile({
  reactionTypes = defaultReactionTypes,
}: Readonly<{ reactionTypes?: ReadonlyArray<SduiReactionIconType> }>) {
  return (
    <span className="flex items-center">
      {reactionTypes.map((reaction, index) => (
        <SduiReactionIcon
          className={index < reactionTypes.length - 1 ? "-mr-[4px]" : undefined}
          decorative
          key={`${reaction}-${index}`}
          ring
          size="xsmall"
          type={reaction}
        />
      ))}
    </span>
  );
}

function CarouselButton({
  alignToContentEdge = false,
  disabled = false,
  direction = "next",
  label,
  onClick,
}: Readonly<{
  alignToContentEdge?: boolean;
  disabled?: boolean;
  direction?: "next" | "previous";
  label: string;
  onClick?: () => void;
}>) {
  return (
    <OverlayButtonIcon
      className={cx(
        "absolute top-1/2 z-10 -translate-y-1/2",
        direction === "next"
          ? alignToContentEdge
            ? "right-0 translate-x-1/2"
            : "right-xxl translate-x-1/2"
          : alignToContentEdge
            ? "left-0 -translate-x-1/2"
            : "left-xxl -translate-x-1/2",
      )}
      color="white"
      disabled={disabled}
      icon={direction === "next" ? "chevron-right" : "chevron-left"}
      label={label}
      onClick={onClick}
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
            benefits communications in one place. Benefits operations teams use
            Velora to validate employee data, coordinate plan changes, prepare
            carrier files, and keep every stakeholder working from the same
            source of truth across complex enrollment cycles.
          </p>
          <span className="absolute bottom-0 right-0 bg-background pl-xxs text-body-sm-open text-text-meta">
            ... more
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
              className="flex min-w-0 items-center gap-sm rounded-sm border border-border-faint p-lg"
              key={highlight.title}
            >
              <Entity
                label={highlight.title}
                shape="square"
                size={40}
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
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
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
            src={assetSrc("featured-workspace-video.jpg")}
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
            comments="115 comments"
            image="product-image-1.png"
            reactions="9,430"
            title="Velora partners with Northstar Labs to bring faster workplace tools to growing teams."
          />
          <MiniContentCard
            comments="713 comments"
            image="product-image-2.png"
            reactions="12,430"
            title="How Arbor Retail Group used Velora to simplify team planning and make decisions faster."
          />
        </div>
      </div>
    </Card>
  );
}

const miniContentReactionTypes: ReadonlyArray<SduiReactionIconType> = [
  "like",
  "empathy",
  "interest",
];

function MiniContentCard({
  comments,
  image,
  reactions,
  title,
}: Readonly<{
  comments: string;
  image: string;
  reactions: string;
  title: string;
}>) {
  return (
    <article className="flex min-w-0 flex-col gap-[12px] overflow-hidden rounded-sm border border-border-faint p-[12px]">
      <div className="flex min-w-0 items-start gap-[12px]">
        <Image
          alt=""
          className="h-[86px] w-[84px] shrink-0 rounded-xs object-cover"
          height={86}
          src={assetSrc(image)}
          width={84}
        />
        <div className="min-h-[86px] min-w-0 flex-1">
          <p className="line-clamp-4 break-words text-body-sm-open text-text">
            {title}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-sm">
        <span className="flex items-center" aria-hidden="true">
          {miniContentReactionTypes.map((reaction, index) => (
            <SduiReactionIcon
              className={
                index < miniContentReactionTypes.length - 1
                  ? "-mr-[4px]"
                  : undefined
              }
              decorative
              key={reaction}
              ring
              size="xsmall"
              type={reaction}
            />
          ))}
        </span>
        <p className="flex items-center gap-xxs whitespace-nowrap text-supportive-s text-text-meta">
          <span>{reactions}</span>
          <span aria-hidden="true">&bull;</span>
          <span>{comments}</span>
        </p>
      </div>
    </article>
  );
}

const VISITOR_POST_CARD_SCROLL_STEP_FALLBACK = 380;
const VISITOR_PRODUCT_CARD_SCROLL_STEP_FALLBACK = 372;

function VisitorPostReactions({
  comments,
  reactions,
  reactionTypes,
  reposts,
}: Readonly<{
  comments: string;
  reactions: string;
  reactionTypes: ReadonlyArray<SduiReactionIconType>;
  reposts?: string;
}>) {
  return (
    <div className="flex min-h-5 items-center gap-xs px-md text-body-sm text-text-meta">
      <span className="flex items-center" aria-hidden="true">
        {reactionTypes.map((reaction, index) => (
          <SduiReactionIcon
            className={
              index < reactionTypes.length - 1 ? "-mr-[4px]" : undefined
            }
            decorative
            key={reaction}
            ring
            size="xsmall"
            type={reaction}
          />
        ))}
      </span>
      <p className="flex min-w-0 items-center gap-xxs whitespace-nowrap">
        <span>{reactions}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{comments}</span>
        {reposts ? (
          <>
            <span aria-hidden="true">&middot;</span>
            <span>{reposts}</span>
          </>
        ) : null}
      </p>
    </div>
  );
}

function VisitorPostActions() {
  return (
    <div className="grid min-h-12 grid-cols-4 text-icon">
      {[
        ["thumbs-up-outline", "Like"],
        ["comment", "Comment"],
        ["repost", "Repost"],
        ["send", "Send"],
      ].map(([icon, label]) => (
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-xs text-icon transition-colors hover:bg-background-transparent-hover hover:text-icon-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          key={label}
          type="button"
        >
          <Icon name={icon as IconName} size="small" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}

function VisitorPostCard({ post }: Readonly<{ post: VisitorPostData }>) {
  const hasLinkPreview = Boolean(post.linkTitle);

  return (
    <article
      className="flex h-[540px] w-[364px] shrink-0 flex-col gap-sm overflow-hidden rounded-sm border border-border-faint bg-background"
      data-visitor-post-card
    >
      <div className="flex flex-col gap-[12px] px-md pt-md">
        <div className="flex min-h-12 items-start gap-sm">
          <div className="flex min-w-0 flex-1 items-start gap-sm">
            <Entity
              className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
              label={pcpCompanyProfile.name}
              shape="square"
              size={32}
              style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
              src={pcpCompanyProfile.logoSrc}
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-control-sm text-text">
                {pcpCompanyProfile.name}
              </h3>
              <p className="truncate text-supportive-s text-text">
                {pcpCompanyProfile.followers}
              </p>
              <p className="text-supportive-s text-text-meta">35m</p>
            </div>
          </div>
          <Icon className="text-text-meta" name="overflow-web-ios" size="medium" />
        </div>
        <p className="line-clamp-3 whitespace-pre-wrap text-body-sm text-text">
          {post.body}{" "}
          <span className="text-text-meta">...more</span>
        </p>
      </div>

      <div className="h-[299px] w-full shrink-0 overflow-hidden">
        <Image
          alt={post.imageAlt}
          className={cx(
            "w-full object-cover",
            hasLinkPreview ? "h-[246px]" : "h-full",
          )}
          height={299}
          src={assetSrc(post.image)}
          width={364}
        />
        {hasLinkPreview ? (
          <div className="flex h-[56px] flex-col gap-xxs bg-background-neutral-soft px-sm py-sm">
            <p className="truncate text-control-sm text-text">
              {post.linkTitle}
            </p>
            {post.linkMeta ? (
              <p className="truncate text-supportive-s text-text-meta">
                {post.linkMeta}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <VisitorPostReactions
        comments={post.comments}
        reactions={post.reactions}
        reactionTypes={post.reactionTypes}
        reposts={post.reposts}
      />
      <div className="px-md">
        <div className="h-px bg-border-faint" />
      </div>
      <VisitorPostActions />
    </article>
  );
}

function PostsCard() {
  const {
    canGoNext: canAdvancePosts,
    canGoPrevious: canGoBackPosts,
    scrollNext: handleNextPost,
    scrollPrevious: handlePreviousPost,
    scrollRef: postsCarouselRef,
    updateScrollState: updatePostsCarouselState,
  } = useHorizontalCarousel<HTMLDivElement>({
    fallbackStep: VISITOR_POST_CARD_SCROLL_STEP_FALLBACK,
    itemSelector: "[data-visitor-post-card]",
  });

  return (
    <Card className="relative">
      <ModuleHeader title="Posts" />
      <div className="relative mt-md pb-md">
        <div
          className="ml-xxl flex gap-md overflow-hidden scroll-smooth py-xxs pr-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={updatePostsCarouselState}
          ref={postsCarouselRef}
        >
          {posts.map((post) => (
            <VisitorPostCard key={post.id} post={post} />
          ))}
        </div>
        {canGoBackPosts ? (
          <CarouselButton
            direction="previous"
            label="View previous posts"
            onClick={handlePreviousPost}
          />
        ) : null}
        <CarouselButton
          disabled={!canAdvancePosts}
          label="View more posts"
          onClick={handleNextPost}
        />
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
          Show all posts
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function VisitorProductCard({
  product,
}: Readonly<{ product: VisitorProductData }>) {
  return (
    <article
      className="flex h-[432px] w-[340px] shrink-0 flex-col overflow-hidden rounded-sm border border-border-faint bg-background sm:w-[364px]"
      data-visitor-product-card
    >
      {product.image ? (
        <Image
          alt={product.imageAlt ?? ""}
          className="h-[176px] w-full shrink-0 object-cover"
          height={176}
          src={assetSrc(product.image)}
          width={364}
        />
      ) : (
        <div className="flex h-[176px] w-full shrink-0 items-center justify-center bg-surface-tint px-lg text-center">
          <p className="max-w-[220px] text-heading-md text-text">
            Benefits guidance for every enrollment moment
          </p>
        </div>
      )}
      <div className="flex min-h-0 flex-1 flex-col px-lg pb-lg pt-md">
        <h3 className="line-clamp-2 text-heading-md text-text">
          {product.title}
        </h3>
        <p className="mt-xxs text-body-sm text-text-meta">{product.type}</p>
        <p className="mt-md line-clamp-5 text-body-sm-open text-text">
          {product.body}
        </p>
        <Button
          className="mt-auto w-full"
          leadingIcon={<Icon name="add" />}
          size="small"
          variant="tertiary"
        >
          Add skill
        </Button>
      </div>
    </article>
  );
}

function ProductsCard() {
  const {
    canGoNext: canAdvanceProducts,
    canGoPrevious: canGoBackProducts,
    scrollNext: handleNextProduct,
    scrollPrevious: handlePreviousProduct,
    scrollRef: productsCarouselRef,
    updateScrollState: updateProductsCarouselState,
  } = useHorizontalCarousel<HTMLDivElement>({
    fallbackStep: VISITOR_PRODUCT_CARD_SCROLL_STEP_FALLBACK,
    itemSelector: "[data-visitor-product-card]",
  });

  return (
    <Card className="relative">
      <ModuleHeader title="Products" />
      <div className="relative mt-md pb-md">
        <div
          className="ml-xxl flex gap-md overflow-hidden scroll-smooth py-xxs pr-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={updateProductsCarouselState}
          ref={productsCarouselRef}
        >
          {visitorProducts.map((product) => (
            <VisitorProductCard key={product.id} product={product} />
          ))}
        </div>
        {canGoBackProducts ? (
          <CarouselButton
            direction="previous"
            label="View previous products"
            onClick={handlePreviousProduct}
          />
        ) : null}
        <CarouselButton
          disabled={!canAdvanceProducts}
          label="View more products"
          onClick={handleNextProduct}
        />
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
          Show all
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function ServicesCard() {
  const serviceGalleryImages = services.map((service) => service.image);
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
          <CarouselButton alignToContentEdge label="View more service images" />
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
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
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
    <article className="flex h-full min-w-[160px] flex-1 flex-col items-center rounded-md border border-border-faint p-md text-center">
      <Entity
        label={leader.name}
        size={80}
        src={assetSrc(leader.image)}
      />
      <div className="mt-md flex min-h-[96px] w-full flex-col items-center">
        <p className="truncate text-control-md text-text">{leader.name}</p>
        <p className="mt-xxs line-clamp-2 text-body-sm text-text-meta">
          {leader.role}
        </p>
        <p className="mt-auto text-supportive-s text-text-meta">
          {leader.followers}
        </p>
      </div>
      <Button
        className="mt-md w-full"
        leadingIcon={<Icon name="add" />}
        size="small"
        variant="tertiary"
      >
        Follow
      </Button>
    </article>
  );
}

function LeaderPostCard({ post }: Readonly<{ post: LeaderPostData }>) {
  const hasLinkPreview = Boolean(post.linkTitle);
  const bodyClampClass = hasLinkPreview
    ? "line-clamp-1"
    : post.image
      ? "line-clamp-2"
      : "line-clamp-4";
  const imageHeightClass = hasLinkPreview ? "h-[96px]" : "h-[128px]";

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
      <p className={cx(bodyClampClass, "px-md text-body-sm text-text")}>
        {post.body}
      </p>
      {post.image ? (
        <Image
          alt=""
          className={cx("mt-sm w-full object-cover", imageHeightClass)}
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
        <ReactionPile reactionTypes={post.reactionTypes} />
        <span>{post.reactionCount}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{post.commentCount} comments</span>
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
          <CarouselButton alignToContentEdge label="View more leader posts" />
        </div>
        <p className="mt-md flex items-center gap-xs text-supportive-s text-text-meta">
          <PremiumChipSmall />
          Featured with Premium Pages
        </p>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
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
            alt="Audience watching a speaker at a Velora event"
            className="aspect-video min-w-0 flex-1 rounded-xs object-cover"
            height={220}
            src={assetSrc("event-fireside-chat.jpg")}
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
                Fireside chat with CEO James Li
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
          <GhostButton icon="arrow-right" iconAtEnd size="medium">
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
          alt="Velora teammates collaborating in a meeting room"
          className="aspect-video w-full rounded-xs object-cover"
          height={260}
          src={assetSrc("life-at-velora-team.jpg")}
          width={460}
        />
        <div>
          <h3 className="text-control-md text-text">
            Building thoughtful software for enterprise teams
          </h3>
          <p className="mt-xs text-body-sm-open text-text">
            Founded in 2019, {pcpCompanyProfile.name} creates benefits
            administration software for companies managing complex people
            operations at scale.
          </p>
          <p className="text-body-sm-open text-text">
            The team works across product, engineering, design, and customer
            partnerships with a practical, collaborative culture focused on
            solving real operational problems.
          </p>
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
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
          <h3 className="text-control-md text-text">
            The latest hiring trends
          </h3>
          <TrendGraph />
        </div>
        <div>
          <h3 className="text-control-md text-text">Growth trends</h3>
          <div className="mt-md flex items-center gap-xs">
            <Icon className="text-positive" name="caret-up" size="small" />
            <p className="text-heading-xl text-text">3%</p>
          </div>
          <p className="text-supportive-s text-text-meta">Employee growth</p>
          <p className="mt-md text-supportive-s text-text-meta">
            And more hiring trends
          </p>
        </div>
        <div>
          <h3 className="text-control-md text-text">12 recent senior hires</h3>
          <div className="mt-lg flex items-center gap-sm">
            <EntityPile size={40} />
            <span className="inline-flex size-10 items-center justify-center rounded-round border border-border-faint bg-background text-body-sm text-text-meta">
              +9
            </span>
          </div>
          <p className="mt-lg text-supportive-s text-text-meta">
            Including Zuberi Idowu and 11 others
          </p>
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
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
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.9"
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
      <div className="space-y-md p-md">
        <div className="flex justify-end">
          <span className="inline-flex items-center gap-xxs rounded-xs bg-tag-default-background px-sm py-xxs text-supportive-s text-text-meta">
            Promoted
            <Icon name="overflow-web-ios" size="small" />
          </span>
        </div>

        <div className="flex items-center gap-sm">
          <Entity
            label={pcpVisitorPersona.name}
            size={32}
            src={assetSrc(pcpVisitorPersona.memberAvatar)}
          />
          <p className="min-w-0 text-supportive-s text-text">
            {pcpVisitorPersona.firstName}, explore jobs at{" "}
            <span className="text-supportive-s-strong">
              {pcpCompanyProfile.name}
            </span>
          </p>
        </div>

        {promotedJobs.map((job) => (
          <div key={job} className="flex gap-sm">
            <Entity
              className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
              label={pcpCompanyProfile.name}
              shape="square"
              size={40}
              style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
              src={pcpCompanyProfile.logoSrc}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-control-sm text-text">{job}</p>
              <p className="text-supportive-s text-text-meta">
                {pcpCompanyProfile.location}
              </p>
            </div>
          </div>
        ))}
        <Button className="w-full" size="small" variant="tertiary">
          See more jobs
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
  items: ReadonlyArray<string>;
  actionLabel: string;
  type?: "page" | "role";
}>) {
  return (
    <Card>
      <div className="p-lg">
        <h2 className="text-heading-sm text-text">{title}</h2>
        <div className="mt-lg space-y-lg">
          {items.map((item) => {
            const isRole = type === "role";

            return (
              <div key={item} className="flex items-start gap-sm">
                <Entity
                  className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
                  label={isRole ? pcpCompanyProfile.name : item}
                  shape="square"
                  size={40}
                  src={pcpCompanyProfile.logoSrc}
                  style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-control-sm text-text">{item}</p>
                  <p className="text-supportive-s text-text-meta">
                    {isRole
                      ? pcpCompanyProfile.location
                      : "Software Development"}
                  </p>
                  <Button
                    className="mt-sm"
                    leadingIcon={!isRole ? <Icon name="add" /> : undefined}
                    size="small"
                    variant="tertiary"
                  >
                    {isRole ? "View role" : "Follow"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center border-t border-border-faint">
        <GhostButton icon="arrow-right" iconAtEnd size="medium">
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
  const [vcaProductPostQuestion, setVcaProductPostQuestion] =
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
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [selectedVcaJob, setSelectedVcaJob] = useState<VcaJobOpening>(
    vcaJobOpenings[0],
  );
  const [selectedVcaProduct, setSelectedVcaProduct] =
    useState<VisitorProductData>(visitorProducts[0]);
  const [selectedVcaPost, setSelectedVcaPost] =
    useState<VcaPostDetail>(vcaCaseStudyPostDetail);
  const [isGlobalInboxExpanded, setIsGlobalInboxExpanded] = useState(false);
  const vcaFabHoverPrompts = isJobSeekerIntent
    ? vcaJobSeekerPrompts.map((label) => ({ label }))
    : vcaOpeningPrompts;
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
    vcaPanelVariant === "expanded" ||
    isCaseStudyOpen ||
    isJobOpen ||
    isProductOpen;
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
          icon: <VeloraVcaLogoMark />,
        };
  const shouldShowGlobalInboxTray =
    !isExpandedVcaSurface && !(isFabEntryMode && isVcaOpen);
  const vcaSurfacePanelPositionClass =
    isExpandedVcaSurface
      ? cx(
          "md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(calc(100dvh_-_48px),860px)] md:-translate-x-1/2 md:-translate-y-1/2",
          isCaseStudyOpen || isJobOpen || isProductOpen
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

  function clearVcaSidePanels() {
    setIsCaseStudyOpen(false);
    setIsJobOpen(false);
    setIsProductOpen(false);
  }

  function resetVcaThreadQuestions() {
    setVcaVisitorPromptId(null);
    setVcaVisitorQuestion(null);
    setVcaProductPostQuestion(null);
    setVcaFollowUpQuestion(null);
  }

  function collapseVcaSurface() {
    setVcaPanelVariant("collapsed");
    clearVcaSidePanels();
  }

  function openVcaSidePanel(panel: "case-study" | "job" | "product") {
    setIsCaseStudyOpen(panel === "case-study");
    setIsJobOpen(panel === "job");
    setIsProductOpen(panel === "product");
    setVcaPanelVariant("expanded");
  }

  function resetVcaConversation() {
    setVcaConversationStage("opening");
    resetVcaThreadQuestions();
    setVcaLiveSupportMessages([]);
    setVcaDraft("");
    setSelectedVcaPost(vcaCaseStudyPostDetail);
    clearVcaSidePanels();
  }

  function startVcaLiveSupportFlow(message: string) {
    resetVcaThreadQuestions();
    setVcaLiveSupportMessages([message]);
    setVcaConversationStage("liveSupportConnecting");
    setVcaDraft("");
    collapseVcaSurface();
  }

  function appendVcaLiveSupportMessage(message: string) {
    setVcaLiveSupportMessages((currentMessages) => [
      ...currentMessages,
      message,
    ]);
    setVcaDraft("");
  }

  function startVcaProductFlow(question: string) {
    setVcaVisitorQuestion(question);
    setVcaVisitorPromptId(null);
    setVcaProductPostQuestion(null);
    setVcaFollowUpQuestion(null);
    setVcaConversationStage("productProof");
    setVcaDraft("");
    clearVcaSidePanels();
  }

  function startVcaJobProof(
    question: string,
    promptId: VcaVisitorPromptId | null = null,
  ) {
    setVcaVisitorQuestion(question);
    setVcaVisitorPromptId(promptId);
    setVcaProductPostQuestion(null);
    setVcaFollowUpQuestion(null);
    setVcaConversationStage("jobProof");
  }

  function startVcaPageExplorerOrPostProof(
    question: string,
    promptId: VcaVisitorPromptId | null,
  ) {
    setVcaVisitorQuestion(question);
    setVcaVisitorPromptId(promptId);
    setVcaProductPostQuestion(null);
    setVcaConversationStage(
      promptId && promptId !== "posts" ? "pageExplorerAnswered" : "postProof",
    );
  }

  function startVcaProductPostProof(question: string) {
    setVcaProductPostQuestion(question);
    setVcaFollowUpQuestion(null);
    setVcaConversationStage("productPostProof");
  }

  function offerVcaHandoff(question: string) {
    setVcaFollowUpQuestion(question);
    setVcaConversationStage("handoffOffered");
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
    const transitionClassNames = ["pcp-messaging-surface-transition"];

    if (transitionClassName) {
      transitionClassNames.push(transitionClassName);
    }

    if (
      !startClassedViewTransition(
        () => {
          flushSync(updateSurfaceState);
        },
        transitionClassNames,
      )
    ) {
      updateSurfaceState();
    }
  }

  function getBackgroundTrayTransitionClass() {
    return isFabEntryMode ? "pcp-background-trays-slide" : undefined;
  }

  function handleCloseVca() {
    runMessagingSurfaceTransition(
      () => {
        setAiSurfaceState(isFabEntryMode ? "docked" : "closed");
        collapseVcaSurface();
        resetVcaConversation();
      },
      getBackgroundTrayTransitionClass(),
    );
  }

  function handleOpenVcaFromTray() {
    runMessagingSurfaceTransition(
      () => {
        collapseVcaSurface();
        setHumanSurfaceState((currentState) =>
          currentState === "closed" ? "closed" : "docked",
        );
        setAiSurfaceState("open");
      },
      getBackgroundTrayTransitionClass(),
    );
  }

  function handleExpandVcaFromTray() {
    runMessagingSurfaceTransition(() => {
      setVcaPanelVariant("expanded");
      clearVcaSidePanels();
      setHumanSurfaceState((currentState) =>
        currentState === "closed" ? "closed" : "docked",
      );
      setAiSurfaceState("open");
    });
  }

  function handleToggleVcaPanelVariant() {
    clearVcaSidePanels();
    setVcaPanelVariant((currentVariant) =>
      currentVariant === "expanded" ? "collapsed" : "expanded",
    );
  }

  function handleOpenVcaCaseStudy(post?: unknown) {
    const resolvedPost = isVcaPostDetail(post)
      ? post
      : vcaCaseStudyPostDetail;

    runMessagingSurfaceTransition(() => {
      setSelectedVcaPost(resolvedPost);
      openVcaSidePanel("case-study");
    });
  }

  function handleCloseVcaCaseStudy() {
    runMessagingSurfaceTransition(() => {
      collapseVcaSurface();
      setVcaConversationStage((currentStage) =>
        currentStage === "postProof" ? "caseStudyReturned" : currentStage,
      );
    });
  }

  function handleOpenVcaJob(job: VcaJobOpening) {
    runMessagingSurfaceTransition(() => {
      setSelectedVcaJob(job);
      openVcaSidePanel("job");
    });
  }

  function handleCloseVcaJob() {
    runMessagingSurfaceTransition(() => {
      collapseVcaSurface();
    });
  }

  function handleOpenVcaProduct(product: VisitorProductData) {
    runMessagingSurfaceTransition(() => {
      setSelectedVcaProduct(product);
      openVcaSidePanel("product");
    });
  }

  function handleCloseVcaProduct() {
    runMessagingSurfaceTransition(() => {
      collapseVcaSurface();
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
      collapseVcaSurface();
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
      collapseVcaSurface();
      if (!humanSentMessage) {
        setHumanDraft(getVcaHandoffMessage(vcaVisitorQuestion));
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
      collapseVcaSurface();
      setVcaConversationStage("handoffOpened");
      setAiSurfaceState((currentState) =>
        currentState === "closed" ? "closed" : "docked",
      );
      setHumanSurfaceState("open");
    });
  }

  function handleVcaPromptSelect(prompt: string) {
    setVcaDraft("");

    if (
      isLiveSupportStory ||
      vcaConversationStage === "liveSupportConnecting" ||
      vcaConversationStage === "liveSupportConnected" ||
      isVcaLiveSupportRequest(prompt)
    ) {
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
      startVcaJobProof(
        prompt === VCA_JOB_SEEKER_CHIP ? VCA_JOB_SEEKER_QUESTION : prompt,
      );
      return;
    }

    const promptId = getVcaVisitorPromptId(prompt);

    if (prompt === VCA_DRAFT_INTRO_PROMPT) {
      handleOpenVcaHandoffMessage();
      return;
    }

    if (promptId === "jobs") {
      startVcaJobProof(prompt, promptId);
      return;
    }

    if (vcaConversationStage === "productProof") {
      if (isVcaOpenEnrollmentReadinessQuestion(prompt)) {
        startVcaProductPostProof(prompt);
        return;
      }

      setVcaProductPostQuestion(null);
      offerVcaHandoff(prompt);
      return;
    }

    if (vcaConversationStage === "productPostProof") {
      offerVcaHandoff(prompt);
      return;
    }

    if (
      (vcaConversationStage === "opening" ||
        vcaConversationStage === "pageExplorerAnswered") &&
      isVcaProductQuestion(prompt)
    ) {
      startVcaProductFlow(prompt);
      return;
    }

    if (vcaConversationStage === "postProof") {
      offerVcaHandoff(prompt);
      return;
    }

    if (vcaConversationStage === "opening") {
      startVcaPageExplorerOrPostProof(prompt, promptId);
      return;
    }

    if (vcaConversationStage === "pageExplorerAnswered") {
      startVcaPageExplorerOrPostProof(prompt, promptId);
      return;
    }

    if (vcaConversationStage === "caseStudyReturned") {
      offerVcaHandoff(prompt);
      return;
    }

    offerVcaHandoff(prompt);
  }

  function handleVcaFabPromptSelect(prompt: string) {
    runMessagingSurfaceTransition(
      () => {
        collapseVcaSurface();
        setHumanSurfaceState((currentState) =>
          currentState === "closed" ? "closed" : "docked",
        );
        setAiSurfaceState("open");
        handleVcaPromptSelect(prompt);
      },
      getBackgroundTrayTransitionClass(),
    );
  }

  function handleVcaSend() {
    const draftText = vcaDraft;
    const trimmedDraft = draftText.trim();

    if (!trimmedDraft) {
      return;
    }

    if (
      isLiveSupportStory ||
      vcaConversationStage === "liveSupportConnecting" ||
      vcaConversationStage === "liveSupportConnected" ||
      isVcaLiveSupportRequest(trimmedDraft)
    ) {
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
      startVcaJobProof(trimmedDraft);
      setVcaDraft("");
      return;
    }

    const promptId = getVcaVisitorPromptId(trimmedDraft);

    if (promptId === "jobs") {
      startVcaJobProof(trimmedDraft, promptId);
      setVcaDraft("");
      return;
    }

    if (vcaConversationStage === "productProof") {
      if (isVcaOpenEnrollmentReadinessQuestion(trimmedDraft)) {
        startVcaProductPostProof(trimmedDraft);
        setVcaDraft("");
        return;
      }

      setVcaProductPostQuestion(null);
      offerVcaHandoff(trimmedDraft);
      setVcaDraft("");
      return;
    }

    if (vcaConversationStage === "productPostProof") {
      offerVcaHandoff(trimmedDraft);
      setVcaDraft("");
      return;
    }

    if (
      (vcaConversationStage === "opening" ||
        vcaConversationStage === "pageExplorerAnswered") &&
      isVcaProductQuestion(trimmedDraft)
    ) {
      startVcaProductFlow(trimmedDraft);
      return;
    }

    if (
      vcaConversationStage === "opening" ||
      vcaConversationStage === "pageExplorerAnswered"
    ) {
      setVcaFollowUpQuestion(null);
      startVcaPageExplorerOrPostProof(trimmedDraft, promptId);
      setVcaDraft("");
      return;
    }

    if (
      vcaConversationStage === "postProof" ||
      vcaConversationStage === "caseStudyReturned" ||
      vcaConversationStage === "handoffOffered"
    ) {
      offerVcaHandoff(trimmedDraft);
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
          className="pcp-ai-messaging-surface group fixed bottom-6 right-6 z-50 md:bottom-[var(--pcp-vca-fab-bottom)]"
          style={vcaFabStyle}
        >
          {isFabIconEntryMode ? (
            <>
              <FabPromptStack
                items={vcaFabHoverPrompts.map((prompt) => ({
                  id: prompt.label,
                  prompt: prompt.label,
                  value: prompt.label,
                }))}
                onPromptSelect={handleVcaFabPromptSelect}
              />
              <VcaFab
                accentColor={VELORA_VISITOR_ASSISTANT_COLOR}
                borderColor={VELORA_VISITOR_ASSISTANT_COLOR}
                borderHoverColor={VELORA_VISITOR_ASSISTANT_COLOR}
                chatPanelId={vcaPanelId}
                className="hover:-translate-y-px hover:scale-[1.04] hover:shadow-raised-soft active:translate-y-0 active:scale-[1.02] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100"
                isOpen={false}
                label={`Open ${pcpCompanyProfile.name} assistant`}
                onClick={handleOpenVcaFromTray}
                position="static"
                variant="visitor"
              >
                <VeloraVcaLogoMark size="large" surface="bare" />
              </VcaFab>
            </>
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
              collapseVcaSurface();
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
              isProductOpen={isProductOpen}
              liveSupportMessages={vcaLiveSupportMessages}
              memberIntent={memberIntent}
              productPostQuestion={vcaProductPostQuestion}
              selectedJob={selectedVcaJob}
              selectedPost={selectedVcaPost}
              selectedProduct={selectedVcaProduct}
              surfaceMode={isFabEntryMode ? "fab" : "tray"}
              visitorPromptId={vcaVisitorPromptId}
              onCloseCaseStudy={handleCloseVcaCaseStudy}
              onCloseJob={handleCloseVcaJob}
              onCloseProduct={handleCloseVcaProduct}
              onClose={handleCloseVca}
              onDraftChange={handleVcaDraftChange}
              onOpenCaseStudy={handleOpenVcaCaseStudy}
              onOpenJob={handleOpenVcaJob}
              onOpenProduct={handleOpenVcaProduct}
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

      <div className="mx-auto grid max-w-[1128px] gap-xxl px-lg py-md xl:px-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-md">
          <OverviewCard />
          <FeaturedCard />
          <PostsCard />
          <ProductsCard />
          <ServicesCard />
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
