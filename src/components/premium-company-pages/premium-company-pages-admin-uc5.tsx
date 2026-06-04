"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type MouseEvent,
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
import { Button } from "@/components/primitives/button";
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

const VELORA_LOGO_TILE_BACKGROUND_CLASS = "bg-[#111827]";
const VELORA_LOGO_TILE_BACKGROUND_STYLE = {
  backgroundColor: "#111827",
};

const postVisuals: ReadonlyArray<Readonly<{ image: string; alt: string }>> = [
  {
    image: "post-building-blue.png",
    alt: "Velora office building post preview",
  },
  {
    image: "post-kudos.png",
    alt: "Velora kudos post preview",
  },
  {
    image: "feed-post-content.png",
    alt: "Velora content post preview",
  },
];

const leadAvatars: Record<string, string> = {
  "Cheri Sparks": "avatar-2.png",
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
  onInsightSelect: (insightId: AdminUc5InsightId) => void;
  onSend: () => void;
  onVariantToggle: () => void;
}>;

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

function FakeAnalyticsLink({ label }: Readonly<{ label: string }>) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
  }

  return (
    <a
      className="inline-flex w-fit items-center gap-xs text-control-sm text-action hover:text-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
      href="#"
      onClick={handleClick}
    >
      <span>{label}</span>
      <Icon name="link-external" size="small" />
    </a>
  );
}

export function AdminPerformanceDigestCard({
  activeInsightId,
  onInsightSelect,
}: AdminPerformanceDigestCardProps) {
  return (
    <section
      aria-labelledby="admin-performance-digest-heading"
      className="overflow-hidden rounded-sm border border-border-faint bg-background"
    >
      <div className="flex min-h-[72px] items-center justify-between gap-md border-b border-border-faint px-lg py-md">
        <div className="flex min-w-0 items-center gap-sm">
          <VeloraLogo size={40} />
          <div className="min-w-0">
            <h2
              className="text-control-sm text-text"
              id="admin-performance-digest-heading"
            >
              Performance digest
            </h2>
            <p className="mt-xxs truncate text-body-xs text-text-meta">
              Velora AI &middot; Today &middot; 4 insights
            </p>
          </div>
        </div>
        <Tag size="small" tone="default">AI</Tag>
      </div>

      <div className="divide-y divide-border-faint">
        {adminUc5InsightOrder.map((insightId) => {
          const insight = adminUc5Insights[insightId];
          const isActive = activeInsightId === insightId;

          return (
            <button
              aria-pressed={isActive}
              className={cx(
                "group grid min-h-[78px] w-full grid-cols-[64px_minmax(0,1fr)_24px] items-center gap-md px-lg py-md text-left outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-action-focus-ring",
                isActive
                  ? "bg-surface-tint shadow-[inset_4px_0_0_var(--color-action)]"
                  : "bg-background",
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
                <span className="mt-xs block text-body-sm text-text-meta">
                  {insight.value}
                </span>
              </span>
              <Icon
                aria-hidden="true"
                className="justify-self-end text-text-meta group-hover:text-icon"
                name="chevron-right"
                size="small"
              />
            </button>
          );
        })}
      </div>
    </section>
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
        src={assetSrc("post-building-blue.png")}
        width={48}
      />
    );
  }

  return (
    <span className="relative inline-flex size-12 shrink-0">
      <Entity
        label="Cheri Sparks"
        size={40}
        src={assetSrc("avatar-2.png")}
      />
      <span className="absolute bottom-0 right-0 inline-flex size-5 items-center justify-center rounded-xs border border-background bg-action text-on-action">
        <Icon name="signal-ai" size="small" />
      </span>
    </span>
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
  onInsightSelect,
  onSend,
  onVariantToggle,
}: AdminUc5AgentPanelProps) {
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
            ) : (
              <WelcomeThread onInsightSelect={onInsightSelect} />
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

function WelcomeThread({
  onInsightSelect,
}: Readonly<{
  onInsightSelect: (insightId: AdminUc5InsightId) => void;
}>) {
  return (
    <>
      <ChatMessage>
        Hi Ning - I can summarize Velora&apos;s Page performance across
        followers, visitors, content, and this week&apos;s top actions.
      </ChatMessage>
      <div className="flex flex-col gap-sm">
        {adminUc5InsightOrder.map((insightId) => {
          const insight = adminUc5Insights[insightId];

          return (
            <Prompt
              className="w-fit max-w-full self-start"
              key={insight.id}
              onPromptSelect={() => onInsightSelect(insight.id)}
              prompt={insight.query}
            >
              <span className="inline-flex min-w-0 items-center gap-xs">
                <Icon
                  className="shrink-0 text-icon"
                  name={insight.icon}
                  size="small"
                />
                <span className="min-w-0">{insight.label}</span>
              </span>
            </Prompt>
          );
        })}
      </div>
    </>
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
      <ChatResponseAttachment gap="sm">
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
    <article className="chat-message-enter w-full max-w-[var(--design-layout-panel-content-max)] overflow-hidden rounded-sm border border-border-faint bg-background text-text shadow-raised-faint">
      <header className="flex items-start gap-sm border-b border-border-faint px-lg py-md">
        <VeloraLogo size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-xs">
            <h3 className="min-w-0 text-control-sm text-text">
              {getInsightCardTitle(insight.id)}
            </h3>
            <Tag size="small" tone="default">AI insight</Tag>
          </div>
          <p className="mt-xxs text-body-xs text-text-meta">
            Velora AI &middot; Today
          </p>
        </div>
      </header>

      <div className="px-lg py-lg">
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

      <footer className="border-t border-border-faint px-lg py-md">
        <FakeAnalyticsLink label={insight.analyticsLabel} />
      </footer>
    </article>
  );
}

function getInsightCardTitle(insightId: AdminUc5InsightId) {
  if (insightId === "follower-growth") {
    return "Follower growth";
  }

  if (insightId === "visitor-demographics") {
    return "Visitor demographics";
  }

  if (insightId === "content-engagement") {
    return "Content engagement";
  }

  return "Weekly summary";
}

function FollowerGrowthResponse() {
  return (
    <div className="space-y-lg">
      <div className="flex items-start gap-md">
        <MiniAvatarPile />
        <p className="min-w-0 text-body-sm text-text">
          Visitor interest is turning into follower growth this month, with
          new follows pacing ahead of last week.
        </p>
      </div>
      <div className="grid overflow-hidden rounded-sm border border-border-faint sm:grid-cols-3">
        {adminUc5FollowerMetrics.map((metric) => (
          <MetricTile key={metric.label} metric={metric} />
        ))}
      </div>
    </div>
  );
}

function MetricTile({ metric }: Readonly<{ metric: AdminUc5Metric }>) {
  return (
    <div className="min-w-0 border-t border-border-faint p-md first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0">
      <p className="text-body-xs text-text-meta">{metric.label}</p>
      <p className="mt-xs text-heading-lg text-text">{metric.value}</p>
      <p
        className={cx(
          "mt-xs inline-flex items-center gap-xxs text-supportive-s-strong",
          getToneClass(metric.tone),
        )}
      >
        <Icon
          name={metric.tone === "negative" ? "arrow-down" : "arrow-up"}
          size="small"
        />
        <span>{metric.change}</span>
      </p>
    </div>
  );
}

function VisitorDemographicsResponse() {
  return (
    <div className="space-y-lg">
      <div className="flex items-start gap-md">
        <Entity
          label={pcpCompanyProfile.founderName}
          size={40}
          src={pcpCompanyProfile.founderAvatarSrc}
        />
        <p className="min-w-0 text-body-sm text-text">
          The strongest visitor segments still line up with Velora&apos;s ICP:
          small agency owners and creative operations leads.
        </p>
      </div>
      <div>
        {adminUc5DemographicGroups.map((group) => (
          <BarGroup group={group} key={group.label} />
        ))}
      </div>
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
      <div className="border-t border-border-faint pt-md">
        <p className="text-body-sm text-text">
          Mobile accounts for 68% of top-post views. Keep captions short and
          lead with the agency payment problem in the first line.
        </p>
      </div>
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
        row.highlight && "rounded-xs bg-surface-tint px-sm",
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
          src={assetSrc("avatar-2.png")}
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-supportive-s-strong text-text">
            Recommended action
          </h4>
          <p className="mt-xs text-body-sm text-text">
            {adminUc5SynthesisRecommendation}
          </p>
          {primaryFollowUp ? (
            <Button
              className="mt-md h-auto max-w-full whitespace-normal px-pill-padding-inline py-xs text-left"
              onClick={() => onFollowUpSelect(primaryFollowUp)}
              size="small"
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
