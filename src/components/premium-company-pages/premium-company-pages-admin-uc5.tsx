"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type ChangeEvent,
  useState,
} from "react";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatPanel,
  ChatResponseAttachment,
  ChatThread,
  Prompt,
  type ChatPanelVariant,
} from "@/components/chat";
import { Button, getButtonClassName } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";
import { Tag, type TagTone } from "@/components/primitives/tag";

import {
  PCP_ASSET_ROOT,
  pcpCompanyProfile,
} from "./persona";
import {
  adminUc5CompetitorRows,
  adminUc5DemographicGroups,
  adminUc5FollowerMetrics,
  adminUc5InsightOrder,
  adminUc5Insights,
  adminUc5Leads,
  adminUc5LowPosts,
  adminUc5PrototypeFallback,
  adminUc5SynthesisRecommendation,
  adminUc5TopPosts,
  type AdminUc5BarGroup,
  type AdminUc5CompetitorRow,
  type AdminUc5FollowUp,
  type AdminUc5Insight,
  type AdminUc5InsightId,
  type AdminUc5Lead,
  type AdminUc5Metric,
  type AdminUc5PostPerformance,
  type AdminUc5Tone,
} from "./premium-company-pages-admin-uc5-data";

const VELORA_LOGO_TILE_BACKGROUND_CLASS = "bg-[#ACF5B3]";
const VELORA_LOGO_TILE_BACKGROUND_STYLE = {
  backgroundColor: "#ACF5B3",
};
const ADMIN_ANALYTICS_HREF = "/premium-company-pages/admin/analytics";
const ADMIN_INBOX_HREF = "/premium-company-pages/admin/inbox";
const CHERI_SPARKS_AVATAR = "member/avatar-2.png";

const postVisuals: ReadonlyArray<Readonly<{ image: string; alt: string }>> = [
  {
    image: "restaurant-post-menu-ops.png",
    alt: "Restaurant menu workflow post preview",
  },
  {
    image: "restaurant-post-campaign-calendar.png",
    alt: "Restaurant campaign calendar post preview",
  },
  {
    image: "restaurant-post-delivery-performance.png",
    alt: "Restaurant delivery performance post preview",
  },
];

const leadAvatars: Record<string, string> = {
  "Cheri Sparks": CHERI_SPARKS_AVATAR,
  "Priya Shah": "avatar-3.png",
  "Maya Patel": "avatar-1.png",
};

const competitorLogoSrc: Record<string, string> = {
  Velora: pcpCompanyProfile.logoSrc,
};

export type AdminUc5ThreadTurn = Readonly<{
  id: string;
  prompt: string;
  response: string;
}>;

type AdminPerformanceDigestCardProps = Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  onInsightSelect: (insightId: AdminUc5InsightId) => void;
}>;

type AdminUc5AgentPanelProps = Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  draft: string;
  panelId: string;
  threadTurns: ReadonlyArray<AdminUc5ThreadTurn>;
  variant: ChatPanelVariant;
  onClose: () => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
  onSend: () => void;
  onVariantToggle: () => void;
}>;

type AdminUc5SelfInitiatedView =
  | "page-performance"
  | "visitor-audience";

const ADMIN_PAGE_PERFORMANCE_PROMPT = "How is my page performing this month?";
const ADMIN_VISITOR_AUDIENCE_PROMPT = "Who's been visiting my Page?";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${PCP_ASSET_ROOT}/${path}`;
}

function getToneClass(tone: AdminUc5Tone) {
  if (tone === "positive") {
    return "text-positive";
  }

  if (tone === "negative") {
    return "text-negative";
  }

  return "text-text-meta";
}

function getTagTone(label: string): TagTone {
  if (label === "Replied") {
    return "positive";
  }

  if (label === "High intent") {
    return "supportive-4";
  }

  return "default";
}

function MetricTrend({
  className,
  context,
  tone,
  value,
}: Readonly<{
  className?: string;
  context: string;
  tone: AdminUc5Tone;
  value: string;
}>) {
  const isDirectional = tone !== "neutral";

  return (
    <span
      className={cx(
        "inline-flex min-w-0 flex-wrap items-center gap-xxs",
        getToneClass(tone),
        className,
      )}
    >
      {isDirectional ? (
        <Icon
          aria-hidden="true"
          className="shrink-0"
          name={tone === "negative" ? "caret-down" : "caret-up"}
          size="small"
        />
      ) : null}
      <strong className="font-semibold">{value}</strong>
      <span className="text-text-meta">{context}</span>
    </span>
  );
}

function AnalyticsPageButton() {
  return (
    <Link
      className={getButtonClassName({ size: "small", variant: "secondary" })}
      href={ADMIN_ANALYTICS_HREF}
    >
      View in Analytics page
    </Link>
  );
}

export function AdminPerformanceDigestCard({
  activeInsightId,
  onInsightSelect,
}: AdminPerformanceDigestCardProps) {
  return (
    <section
      aria-labelledby="admin-performance-digest-heading"
      className="min-w-0"
    >
      <div>
        <div className="flex items-center gap-xs text-control-sm text-text">
          <Icon
            aria-hidden="true"
            className="shrink-0 text-premium-inbug"
            name="signal-ai"
            size="small"
          />
          <span>Based on your page activity</span>
        </div>
        <h2
          className="mt-sm text-heading-lg text-text"
          id="admin-performance-digest-heading"
        >
          What needs your attention today
        </h2>
      </div>

      <div className="mt-xxl space-y-md">
        <Link
          aria-label="View Cheri Sparks message in Inbox"
          className="group grid min-h-[78px] w-full grid-cols-[64px_minmax(0,1fr)_auto_24px] items-center gap-md rounded-xs border border-border-faint bg-background px-lg py-md text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          href={ADMIN_INBOX_HREF}
        >
          <CheriAiAvatar />
          <span className="min-w-0 py-xxs">
            <span className="block text-control-sm text-text">
              Cheri Sparks looks like a strong match
            </span>
            <span className="mt-xs block text-body-sm text-text-meta">
              She asked about delivery promotions and sent you a message
            </span>
          </span>
          <InsightRowCta label="View message" />
          <InsightRowDismissIcon />
        </Link>

        {adminUc5InsightOrder.map((insightId) => {
          const insight = adminUc5Insights[insightId];
          const isActive = activeInsightId === insightId;

          return (
            <button
              aria-pressed={isActive}
              className={cx(
                "group grid min-h-[78px] w-full grid-cols-[64px_minmax(0,1fr)_auto_24px] items-center gap-md rounded-xs border bg-background px-lg py-md text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring",
                isActive
                  ? "border-action bg-surface-tint shadow-[inset_4px_0_0_var(--color-action)]"
                  : "border-border-faint",
              )}
              key={insight.id}
              onClick={() => onInsightSelect(insight.id)}
              type="button"
            >
              <DigestInsightVisual insightId={insight.id} />
              <span className="min-w-0 py-xxs">
                <span className="block text-control-sm text-text">
                  {insight.label}
                </span>
                <DigestInsightValue insight={insight} />
              </span>
              <InsightRowCta icon="ai" label="Ask AI" />
              <InsightRowDismissIcon />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DigestInsightValue({
  insight,
}: Readonly<{ insight: AdminUc5Insight }>) {
  if (insight.id === "post-amplification") {
    return (
      <span className="mt-xs flex flex-wrap items-center gap-x-xs gap-y-xxs text-body-sm text-text-meta">
        <span>
          <strong className="font-semibold text-text">4.2%</strong> engagement
          rate
        </span>
        <span aria-hidden="true">&middot;</span>
        <span>only 180 impressions</span>
      </span>
    );
  }

  if (insight.id === "follower-growth") {
    return (
      <span className="mt-xs flex flex-wrap items-center gap-x-xs gap-y-xxs text-body-sm text-text-meta">
        <span>312 visitors</span>
        <span aria-hidden="true">&middot;</span>
        <MetricTrend
          context="vs last month"
          tone="positive"
          value="18 points"
        />
      </span>
    );
  }

  return (
    <span className="mt-xs block text-body-sm text-text-meta">
      {insight.value}
    </span>
  );
}

function InsightRowCta({
  icon,
  label,
}: Readonly<{
  icon?: "ai";
  label: string;
}>) {
  return (
    <span
      aria-hidden="true"
      className={getButtonClassName({
        className: "pointer-events-none w-fit justify-self-end",
        size: "small",
        variant: "tertiary",
      })}
    >
      {icon === "ai" ? (
        <Icon
          aria-hidden="true"
          className="text-premium-inbug"
          name="signal-ai"
          size="small"
        />
      ) : null}
      <span>{label}</span>
    </span>
  );
}

function InsightRowDismissIcon() {
  return (
    <Icon
      aria-hidden="true"
      className="justify-self-end text-text-meta group-hover:text-icon"
      name="close"
      size="small"
    />
  );
}

function CheriAiAvatar({ size = 48 }: Readonly<{ size?: 40 | 48 }>) {
  return (
    <span className="relative inline-flex size-12 shrink-0">
      <Entity
        label="Cheri Sparks"
        size={size}
        src={assetSrc(CHERI_SPARKS_AVATAR)}
      />
      <span className="absolute -bottom-xxs -right-xxs inline-flex size-5 items-center justify-center rounded-round border border-background bg-background text-premium-inbug">
        <Icon className="[&&]:size-3" name="signal-ai" size="small" />
      </span>
    </span>
  );
}

function VeloraLogo({ size = 40 }: Readonly<{ size?: 32 | 40 | 48 }>) {
  return (
    <Entity
      className={VELORA_LOGO_TILE_BACKGROUND_CLASS}
      label={pcpCompanyProfile.name}
      shape="square"
      size={size}
      src={pcpCompanyProfile.logoSrc}
      style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
    />
  );
}

function DigestInsightVisual({
  insightId,
}: Readonly<{ insightId: AdminUc5InsightId }>) {
  if (insightId === "post-amplification") {
    return (
      <Image
        alt=""
        className="size-12 shrink-0 rounded-xs object-cover"
        height={48}
        src={assetSrc("restaurant-post-menu-ops.png")}
        width={48}
      />
    );
  }

  if (insightId === "follower-growth") {
    return <MiniAvatarPile compact />;
  }

  if (insightId === "visitor-demographics") {
    return (
      <span className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-round bg-background-neutral-soft">
        <Entity
          className="border border-background"
          label="Ning Hu"
          size={32}
          src={pcpCompanyProfile.founderAvatarSrc}
        />
        <span className="absolute -bottom-xxs -right-xxs inline-flex size-5 items-center justify-center rounded-round border border-background bg-background text-text-meta">
          <Icon name="people" size="small" />
        </span>
      </span>
    );
  }

  if (insightId === "content-engagement") {
    return (
      <Image
        alt=""
        className="size-12 shrink-0 rounded-xs object-cover"
        height={48}
        src={assetSrc("restaurant-post-menu-ops.png")}
        width={48}
      />
    );
  }

  return (
    <CheriAiAvatar size={40} />
  );
}

function MiniAvatarPile({
  compact = false,
}: Readonly<{ compact?: boolean }>) {
  const size = compact ? 24 : 32;

  return (
    <span className="flex items-center">
      {["avatar-2.png", "avatar-1.png", "avatar-3.png"].map(
        (avatar, index) => (
          <Entity
            className={cx(index > 0 && "-ml-sm", "border border-background")}
            key={avatar}
            label=""
            size={size}
            src={assetSrc(avatar)}
          />
        ),
      )}
    </span>
  );
}

export function AdminUc5AgentPanel({
  activeInsightId,
  draft,
  panelId,
  threadTurns,
  variant,
  onClose,
  onDraftChange,
  onFollowUpSelect,
  onSend,
  onVariantToggle,
}: AdminUc5AgentPanelProps) {
  const [selfInitiatedView, setSelfInitiatedView] =
    useState<AdminUc5SelfInitiatedView | null>(null);
  const activeInsight = activeInsightId
    ? adminUc5Insights[activeInsightId]
    : null;
  const headerActionSize = variant === "expanded" ? "medium" : "small";

  return (
    <ChatPanel
      aria-label="Velora AI"
      className="!h-full !w-full !rounded-none shadow-raised-faint md:!h-full md:!w-full md:!rounded-sm"
      id={panelId}
      variant={variant}
    >
      <ChatHeader
        actionSize={headerActionSize}
        identity={{
          type: "ai",
          title: "Velora AI",
          icon: <VeloraLogo size={32} />,
        }}
        onClose={onClose}
        onMinimizeToTray={onClose}
        onVariantToggle={onVariantToggle}
        variant={variant}
      />
      <ChatBody>
        <ChatThread showAiDisclaimer={false}>
          <div className="flex flex-col gap-lg">
            {activeInsight ? (
              <ActiveInsightThread
                insight={activeInsight}
                onFollowUpSelect={onFollowUpSelect}
              />
            ) : selfInitiatedView === "page-performance" ? (
              <SelfInitiatedPerformanceThread
                onFollowUpSelect={onFollowUpSelect}
              />
            ) : selfInitiatedView === "visitor-audience" ? (
              <SelfInitiatedVisitorAudienceThread
                onFollowUpSelect={onFollowUpSelect}
              />
            ) : (
              <WelcomeThread
                onPagePerformanceSelect={() =>
                  setSelfInitiatedView("page-performance")
                }
                onVisitorAudienceSelect={() =>
                  setSelfInitiatedView("visitor-audience")
                }
              />
            )}

            {threadTurns.map((turn) => (
              <FollowUpTurn key={turn.id} turn={turn} />
            ))}
          </div>
        </ChatThread>
      </ChatBody>
      <ChatComposer
        inputProps={{
          "aria-label": "Message Velora AI",
          onChange: onDraftChange,
          placeholder: "Ask about Page performance...",
          value: draft,
        }}
        onSend={onSend}
        showAttachAction={false}
        showDictationAction={false}
        showTopDivider
        showVoiceMode={false}
        variant="collapsed"
      />
    </ChatPanel>
  );
}

const adminSelfInitiatedPrompts = [
  ADMIN_PAGE_PERFORMANCE_PROMPT,
  "What are my competitors doing?",
  ADMIN_VISITOR_AUDIENCE_PROMPT,
] as const;

function WelcomeThread({
  onPagePerformanceSelect,
  onVisitorAudienceSelect,
}: Readonly<{
  onPagePerformanceSelect: () => void;
  onVisitorAudienceSelect: () => void;
}>) {
  function getPromptSelectHandler(prompt: (typeof adminSelfInitiatedPrompts)[number]) {
    if (prompt === ADMIN_PAGE_PERFORMANCE_PROMPT) {
      return onPagePerformanceSelect;
    }

    if (prompt === ADMIN_VISITOR_AUDIENCE_PROMPT) {
      return onVisitorAudienceSelect;
    }

    return undefined;
  }

  return (
    <>
      <ChatMessage>
        Hi, I&apos;m your AI assistant. I can help make sense of what&apos;s
        happening on your Page, from who&apos;s visiting to which posts are
        working and what to do next. What would you like to explore?
      </ChatMessage>
      <div className="flex flex-col gap-sm">
        {adminSelfInitiatedPrompts.map((prompt) => (
          <Prompt
            className="w-fit max-w-full self-start"
            key={prompt}
            onPromptSelect={getPromptSelectHandler(prompt)}
            prompt={prompt}
          />
        ))}
      </div>
    </>
  );
}

function SelfInitiatedPerformanceThread({
  onFollowUpSelect,
}: Readonly<{
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
}>) {
  return (
    <>
      <ChatMessage role="user">How is my page performing this month?</ChatMessage>
      <ChatMessage>
        Three things stand out: reach is up, follower growth is improving, and
        restaurant operators are showing interest.
      </ChatMessage>
      <ChatResponseAttachment className="!block !opacity-100" gap="sm">
        <SelfInitiatedMetricsSummaryCard />
      </ChatResponseAttachment>
      <ChatMessage>
        The biggest opportunity is reach: one post is getting strong engagement,
        but only 180 people saw it.
      </ChatMessage>
      <ChatResponseAttachment className="!block !opacity-100" gap="sm">
        <InsightResponse
          insight={adminUc5Insights["post-amplification"]}
          onFollowUpSelect={onFollowUpSelect}
        />
      </ChatResponseAttachment>
      <FollowUpActions
        followUps={selfInitiatedBoostFollowUps}
        onFollowUpSelect={onFollowUpSelect}
      />
    </>
  );
}

function SelfInitiatedVisitorAudienceThread({
  onFollowUpSelect,
}: Readonly<{
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
}>) {
  return (
    <>
      <ChatMessage role="user">{ADMIN_VISITOR_AUDIENCE_PROMPT}</ChatMessage>
      <ChatMessage>
        Your recent visitors cluster around a clear audience: multi-location
        restaurant decision-makers who are likely evaluating menu and campaign
        workflows.
      </ChatMessage>
      <ChatResponseAttachment className="!block !opacity-100" gap="sm">
        <VisitorAudienceInsightCard />
      </ChatResponseAttachment>
      <FollowUpActions
        followUps={selfInitiatedVisitorAudienceFollowUps}
        onFollowUpSelect={onFollowUpSelect}
      />
    </>
  );
}

const selfInitiatedVisitorAudienceFollowUps: ReadonlyArray<AdminUc5FollowUp> =
  [
    {
      prompt: "Show matching visitors",
      response:
        "I would filter the visitor list to marketing ops leads, digital ordering managers, and operators at 20-50 employee restaurant teams. The strongest matches are people engaging with delivery promotion and menu rollout content.",
    },
    {
      prompt: "Save this audience",
      response:
        "Audience draft: restaurant group marketers and operators. Use marketing ops, digital ordering, operations leads, 20-50 employee companies, and restaurants or hospitality as the starting criteria.",
    },
    {
      prompt: "What content brought them here?",
      response:
        "The Northline Kitchen Group menu rollout story is the strongest pull. It connects directly to the visitor pattern: growing restaurant teams trying to keep delivery promotions aligned across locations.",
    },
    {
      prompt: "Draft a post for this audience",
      response:
        "Draft angle: 'Which locations lose repeat orders after a delivery promo ends?' Lead with the restaurant operator problem, then show how location-level campaign reporting keeps teams aligned.",
    },
  ];

const selfInitiatedBoostFollowUps: ReadonlyArray<AdminUc5FollowUp> =
  [
    {
      prompt: "Why this post?",
      response:
        "Because it has a strong early signal: 4.2% engagement, well above your 1.1% average. The content is working, but only a small audience has seen it.",
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
  ];

function SelfInitiatedMetricsSummaryCard() {
  return (
    <article className="chat-message-enter w-full max-w-[var(--design-layout-panel-content-max)] overflow-hidden rounded-md border border-ai-border bg-background text-text shadow-raised-faint">
      <div className="divide-y divide-border-faint px-lg py-lg">
        <SelfInitiatedMetricRow
          label="Visitors"
          trendContext="vs last month"
          trendValue="18 points"
          value="312"
        />
        <SelfInitiatedMetricRow
          label="Post impressions"
          trendContext="vs last 7 days"
          trendValue="115.6%"
          value="3,479"
        />
        <SelfInitiatedMetricRow
          label="New followers"
          trendContext="vs last 7 days"
          trendValue="8%"
          value="37"
        />
      </div>
    </article>
  );
}

export function AdminUc5SelfInitiatedMetricsCardPreview() {
  return <SelfInitiatedMetricsSummaryCard />;
}

export function AdminUc5VisitorAudienceCardPreview() {
  return <VisitorAudienceInsightCard />;
}

function VisitorAudienceInsightCard() {
  return (
    <article className="chat-message-enter w-full max-w-[var(--design-layout-panel-content-max)] overflow-hidden rounded-md border border-ai-border bg-background text-text shadow-raised-faint">
      <div className="px-lg py-lg">
        <div className="flex items-start gap-md">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-round bg-ai-background-soft text-ai-icon">
            <Icon name="visibility" size="medium" />
          </span>
          <div className="min-w-0">
            <p className="text-label-xs text-text-meta">
              Visitor audience insight
            </p>
            <h3 className="mt-xxs text-heading-sm text-text">
              Your Page is attracting restaurant operators
            </h3>
            <p className="mt-sm text-body-sm text-text">
              <strong className="font-semibold">37 recent visitors</strong>{" "}
              match restaurant group marketers and operators who care about
              delivery promotions and menu updates.
            </p>
          </div>
        </div>

        <div className="mt-lg divide-y divide-border-faint">
          <VisitorAudienceMetricRow label="Matching visitors" value="37" />
          <VisitorAudienceMetricRow label="20-50 employees" value="62%" />
          <VisitorAudienceMetricRow label="Marketing roles" value="65%" />
        </div>

        <section className="mt-lg border-t border-border-faint pt-md">
          <h4 className="text-supportive-s-strong text-text">
            Top visitor signals
          </h4>
          <div className="mt-sm flex flex-wrap gap-xs">
            <Tag size="small" tone="supportive-4">
              Marketing ops
            </Tag>
            <Tag size="small" tone="supportive-4">
              20-50 employees
            </Tag>
            <Tag size="small" tone="supportive-4">
              Restaurants
            </Tag>
            <Tag size="small" tone="supportive-4">
              Delivery promotion interest
            </Tag>
          </div>
        </section>

        <section className="mt-lg border-t border-border-faint pt-md">
          <p className="text-label-xs text-text-meta">Suggested audience</p>
          <p className="mt-xxs text-control-sm text-text">
            Restaurant group marketers and operators
          </p>
          <p className="mt-xs text-body-xs text-text-meta">
            Use this audience to review matching visitors or guide your next
            boosted post.
          </p>
        </section>
      </div>
    </article>
  );
}

function VisitorAudienceMetricRow({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="flex min-w-0 items-baseline justify-between gap-md py-md first:pt-0 last:pb-0">
      <p className="text-label-xs text-text-meta">{label}</p>
      <p className="shrink-0 text-control-md text-text">{value}</p>
    </div>
  );
}

function SelfInitiatedMetricRow({
  label,
  trendContext,
  trendTone = "positive",
  trendValue,
  value,
}: Readonly<{
  label: string;
  trendContext: string;
  trendTone?: AdminUc5Tone;
  trendValue: string;
  value: string;
}>) {
  return (
    <div className="min-w-0 py-md first:pt-0 last:pb-0">
      <p className="text-label-xs text-text-meta">{label}</p>
      <p className="mt-xxs text-control-md text-text">{value}</p>
      <MetricTrend
        className="mt-xxs text-body-xs"
        context={trendContext}
        tone={trendTone}
        value={trendValue}
      />
    </div>
  );
}

function ActiveInsightThread({
  insight,
  onFollowUpSelect,
}: Readonly<{
  insight: AdminUc5Insight;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
}>) {
  return (
    <>
      <ChatMessage role="user">{insight.query}</ChatMessage>
      {insight.id === "post-amplification" ? (
        <ChatMessage>
          This post is standing out because people who saw it responded, but
          reach stayed low.
        </ChatMessage>
      ) : null}
      {insight.id === "follower-growth" ? (
        <ChatMessage>
          Visitor interest is turning into follower growth this month, with new
          follows pacing ahead of last week.
        </ChatMessage>
      ) : null}
      {insight.id === "visitor-demographics" ? (
        <ChatMessage>
          The people finding Velora look close to the teams you&apos;re built
          for: multi-location restaurant marketers, digital ordering leads, and
          operators managing menu and campaign complexity.
        </ChatMessage>
      ) : null}
      {insight.id === "content-engagement" ? (
        <ChatMessage>
          The Northline story is getting efficient engagement. I would treat it
          as a reach opportunity: the message is working, but distribution is
          still modest.
        </ChatMessage>
      ) : null}
      {insight.id === "weekly-synthesis" ? (
        <ChatMessage>
          {adminUc5SynthesisRecommendation}
        </ChatMessage>
      ) : null}
      <ChatResponseAttachment
        className={
          insight.id === "post-amplification"
            ? "!block !opacity-100"
            : undefined
        }
        gap="sm"
      >
        <InsightResponse
          insight={insight}
          onFollowUpSelect={onFollowUpSelect}
        />
      </ChatResponseAttachment>
      <FollowUpActions
        followUps={insight.followUps.filter((followUp) => !followUp.primary)}
        onFollowUpSelect={onFollowUpSelect}
      />
    </>
  );
}

function FollowUpTurn({
  turn,
}: Readonly<{
  turn: AdminUc5ThreadTurn;
}>) {
  return (
    <>
      <ChatMessage role="user">{turn.prompt}</ChatMessage>
      <ChatMessage>{turn.response}</ChatMessage>
    </>
  );
}

function InsightResponse({
  insight,
  onFollowUpSelect,
}: Readonly<{
  insight: AdminUc5Insight;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
}>) {
  return (
    <article className="chat-message-enter w-full max-w-[var(--design-layout-panel-content-max)] overflow-hidden rounded-md border border-ai-border bg-background text-text shadow-raised-faint">
      <div className="px-lg py-lg">
        {insight.id === "post-amplification" ? (
          <PostAmplificationResponse />
        ) : null}
        {insight.id === "follower-growth" ? <FollowerGrowthResponse /> : null}
        {insight.id === "visitor-demographics" ? (
          <VisitorDemographicsResponse />
        ) : null}
        {insight.id === "content-engagement" ? (
          <ContentEngagementResponse />
        ) : null}
        {insight.id === "weekly-synthesis" ? (
          <WeeklySynthesisResponse
            onFollowUpSelect={onFollowUpSelect}
            primaryFollowUp={insight.followUps.find(
              (followUp) => followUp.primary,
            )}
          />
        ) : null}
      </div>

      {insight.id === "post-amplification" ? null : (
        <footer className="border-t border-border-faint px-lg py-md">
          <AnalyticsPageButton />
        </footer>
      )}
    </article>
  );
}

export function AdminUc5InsightResponseCardPreview({
  insightId,
}: Readonly<{ insightId: AdminUc5InsightId }>) {
  return (
    <InsightResponse
      insight={adminUc5Insights[insightId]}
      onFollowUpSelect={() => {}}
    />
  );
}

function PostAmplificationResponse() {
  return (
    <div className="space-y-lg">
      <BoostCandidatePostPreview />
      <div className="flex flex-wrap gap-sm">
        <Button size="small" variant="secondary">
          View post
        </Button>
        <Button size="small" variant="secondary">
          Boost post
        </Button>
      </div>
    </div>
  );
}

function BoostCandidatePostPreview() {
  return (
    <article>
      <div className="flex min-w-0 items-center gap-sm">
        <Image
          alt=""
          className="size-10 shrink-0 rounded-xs object-cover"
          height={40}
          src={assetSrc("restaurant-post-menu-ops.png")}
          width={40}
        />
        <div className="min-w-0">
          <h4 className="truncate text-control-sm text-text">
            How restaurant teams keep delivery menus consistent across
            locations
          </h4>
          <p className="mt-xxs text-body-xs text-text-meta">2d</p>
        </div>
      </div>
      <div className="mt-lg divide-y divide-border-faint">
        <PostMetricRow label="Engagement rate" value="4.2%" />
        <PostMetricRow label="Impressions" value="180" />
      </div>
    </article>
  );
}

function PostMetricRow({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="flex min-w-0 items-baseline justify-between gap-md py-md first:pt-0 last:pb-0">
      <p className="text-body-sm text-text-meta">{label}</p>
      <p className="shrink-0 text-control-sm text-text">{value}</p>
    </div>
  );
}

function FollowerGrowthResponse() {
  return (
    <div className="space-y-md">
      <div>
        <MiniAvatarPile />
      </div>
      <div className="divide-y divide-border-faint">
        {adminUc5FollowerMetrics.map((metric) => (
          <MetricRow key={metric.label} metric={metric} />
        ))}
      </div>
    </div>
  );
}

function MetricRow({ metric }: Readonly<{ metric: AdminUc5Metric }>) {
  return (
    <div className="min-w-0 py-md first:pt-0 last:pb-0">
      <p className="text-body-xs text-text-meta">{metric.label}</p>
      <p className="mt-xs text-control-md text-text">{metric.value}</p>
      <MetricTrend
        className="mt-xs text-supportive-s-strong"
        context={metric.changeContext}
        tone={metric.tone}
        value={metric.changeValue}
      />
    </div>
  );
}

function VisitorDemographicsResponse() {
  return (
    <div>
      {adminUc5DemographicGroups.map((group) => (
        <BarGroup group={group} key={group.label} />
      ))}
    </div>
  );
}

function BarGroup({ group }: Readonly<{ group: AdminUc5BarGroup }>) {
  return (
    <section className="border-t border-border-faint py-md first:border-t-0 first:pt-0 last:pb-0">
      <h4 className="text-supportive-s-strong text-text">{group.label}</h4>
      <div className="mt-sm space-y-sm">
        {group.rows.map((row) => (
          <div
            className="space-y-xxs text-body-xs"
            key={row.label}
          >
            <div className="flex items-baseline justify-between gap-sm">
              <span className="min-w-0 text-text-meta">{row.label}</span>
              <span className="shrink-0 text-supportive-s-strong text-text">
                {row.percentage}%
              </span>
            </div>
            <span className="block h-2 overflow-hidden rounded-round bg-background-neutral-soft">
              <span
                className="block h-full rounded-round bg-action"
                style={{ width: `${row.percentage}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContentEngagementResponse() {
  return (
    <div className="space-y-lg">
      <PostPerformanceGroup label="Top posts" posts={adminUc5TopPosts} />
      <PostPerformanceGroup label="Needs attention" posts={adminUc5LowPosts} />
    </div>
  );
}

function PostPerformanceGroup({
  label,
  posts,
}: Readonly<{
  label: string;
  posts: ReadonlyArray<AdminUc5PostPerformance>;
}>) {
  return (
    <section className="border-t border-border-faint pt-md first:border-t-0 first:pt-0">
      <h4 className="text-supportive-s-strong text-text">{label}</h4>
      <div className="mt-sm divide-y divide-border-faint">
        {posts.map((post) => (
          <PostPerformanceRow key={post.title} post={post} />
        ))}
      </div>
    </section>
  );
}

function PostPerformanceRow({
  post,
}: Readonly<{ post: AdminUc5PostPerformance }>) {
  const visual = getPostVisual(post);

  return (
    <article className="flex min-w-0 gap-md py-md first:pt-0 last:pb-0">
      <Image
        alt={visual.alt}
        className="size-14 shrink-0 rounded-xs object-cover"
        height={56}
        src={assetSrc(visual.image)}
        width={56}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-sm">
          <p className="line-clamp-2 min-w-0 text-body-sm text-text">
            {post.title}
          </p>
          <p className="shrink-0 text-supportive-s-strong text-text">
            {post.impressions}
          </p>
        </div>
        <p className="mt-xs text-body-xs text-text-meta">
          Desktop {post.desktop}% &middot; Mobile {post.mobile}%
        </p>
      </div>
    </article>
  );
}

function getPostVisual(post: AdminUc5PostPerformance) {
  const allPosts = [...adminUc5TopPosts, ...adminUc5LowPosts];
  const index = Math.max(0, allPosts.findIndex((item) => item.title === post.title));

  return postVisuals[index % postVisuals.length];
}

function WeeklySynthesisResponse({
  primaryFollowUp,
  onFollowUpSelect,
}: Readonly<{
  primaryFollowUp?: AdminUc5FollowUp;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
}>) {
  return (
    <div className="space-y-lg">
      <CompetitorRows />
      <LeadCards />
      <RecommendationAction
        onFollowUpSelect={onFollowUpSelect}
        primaryFollowUp={primaryFollowUp}
      />
    </div>
  );
}

function CompetitorRows() {
  return (
    <section>
      <h4 className="text-supportive-s-strong text-text">
        Competitors to watch
      </h4>
      <div className="mt-sm divide-y divide-border-faint">
        {adminUc5CompetitorRows.map((row) => (
          <CompetitorRow key={row.company} row={row} />
        ))}
      </div>
    </section>
  );
}

function CompetitorRow({ row }: Readonly<{ row: AdminUc5CompetitorRow }>) {
  return (
    <div
      className={cx(
        "grid gap-sm py-sm first:pt-0 last:pb-0",
        row.highlight && "border-l-2 border-action pl-sm",
      )}
    >
      <div className="flex min-w-0 items-center gap-sm">
        <Entity
          className={cx(row.company === "Velora" && VELORA_LOGO_TILE_BACKGROUND_CLASS)}
          label={row.company}
          shape="square"
          size={32}
          src={competitorLogoSrc[row.company]}
          style={
            row.company === "Velora"
              ? VELORA_LOGO_TILE_BACKGROUND_STYLE
              : undefined
          }
        />
        <div className="min-w-0">
          <p className="text-control-sm text-text">{row.company}</p>
          <p className="text-body-xs text-text-meta">
            {row.highlight ? "Your Page" : "Company Page"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-sm text-body-xs">
        <MiniStat label="Posts/wk" value={row.postsPerWeek} />
        <MiniStat label="Follows" value={row.newFollowers} />
        <MiniStat label="Comments" value={row.commentsPerDay} />
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="min-w-0">
      <p className="text-supportive-s-strong text-text">{value}</p>
      <p className="truncate text-body-xs text-text-meta">{label}</p>
    </div>
  );
}

function LeadCards() {
  return (
    <section className="border-t border-border-faint pt-md">
      <h4 className="text-supportive-s-strong text-text">
        Top leads from the past 30 days
      </h4>
      <div className="mt-sm divide-y divide-border-faint">
        {adminUc5Leads.map((lead) => (
          <LeadCard key={lead.name} lead={lead} />
        ))}
      </div>
    </section>
  );
}

function LeadCard({ lead }: Readonly<{ lead: AdminUc5Lead }>) {
  return (
    <article className="flex min-w-0 gap-md py-md first:pt-0 last:pb-0">
      <Entity
        label={lead.name}
        size={40}
        src={assetSrc(leadAvatars[lead.name] ?? "avatar-1.png")}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-xs">
          <div className="min-w-0">
            <p className="text-control-sm text-text">{lead.name}</p>
            <p className="text-body-xs text-text-meta">{lead.company}</p>
          </div>
          <span className="flex flex-wrap justify-start gap-xs sm:justify-end">
            <Tag size="small" tone={getTagTone(lead.status)}>
              {lead.status}
            </Tag>
            {lead.replyNeeded ? (
              <Tag size="small" tone="default">
                Reply needed
              </Tag>
            ) : null}
          </span>
        </div>
        <p className="mt-xs text-body-sm text-text">{lead.summary}</p>
      </div>
    </article>
  );
}

function RecommendationAction({
  primaryFollowUp,
  onFollowUpSelect,
}: Readonly<{
  primaryFollowUp?: AdminUc5FollowUp;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
}>) {
  return (
    <section className="border-t border-border-faint pt-md">
      <div className="flex items-start gap-md">
        <Entity
          label="Cheri Sparks"
          size={40}
          src={assetSrc(CHERI_SPARKS_AVATAR)}
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-supportive-s-strong text-text">
            Recommended action
          </h4>
          {primaryFollowUp ? (
            <Button
              className="mt-md h-auto max-w-full whitespace-normal px-pill-padding-inline py-xs text-left"
              onClick={() => onFollowUpSelect(primaryFollowUp)}
              size="small"
              variant="secondary"
            >
              {primaryFollowUp.prompt}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FollowUpActions({
  followUps,
  onFollowUpSelect,
}: Readonly<{
  followUps: ReadonlyArray<AdminUc5FollowUp>;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
}>) {
  if (followUps.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-sm">
      {followUps.map((followUp) => (
        <Prompt
          className="w-fit max-w-full self-start"
          key={followUp.prompt}
          onPromptSelect={() => onFollowUpSelect(followUp)}
          prompt={followUp.prompt}
        />
      ))}
    </div>
  );
}

export function buildAdminUc5PrototypeFallbackTurn(
  prompt: string,
  id: string,
): AdminUc5ThreadTurn {
  return {
    id,
    prompt,
    response: adminUc5PrototypeFallback,
  };
}
