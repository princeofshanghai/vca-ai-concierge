"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type ChangeEvent,
  useCallback,
  useRef,
  useState,
} from "react";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatPanel,
  ChatThread,
  Prompt,
  type ChatPanelVariant,
} from "@/components/chat";
import { Button, getButtonClassName } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";
import { Tag, type TagTone } from "@/components/primitives/tag";
import {
  Chips as ResponseChips,
  Compare as ResponseCompare,
  Entity as ResponseEntity,
  Metric as ResponseMetric,
  MetricWithTrend as ResponseMetricWithTrend,
  PostCompact as ResponsePostCompact,
  Text as ResponseText,
  TextRecommendationList as ResponseTextRecommendationList,
} from "@/components/premium-company-pages/response-blocks";

import { InsightCard } from "./insight-card";
import {
  PCP_ASSET_ROOT,
  pcpCompanyProfile,
  pcpVisitorPersona,
} from "./persona";
import { ScriptedResponseTurn } from "./scripted-response-turn";
import { TodayActionCard } from "./today-action-card";
import {
  adminUc5CompetitorRows,
  adminUc5DemographicGroups,
  adminUc5FollowerMetrics,
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
const CHERI_SPARKS_AVATAR = pcpVisitorPersona.avatar;
const STORY_1A_CARD_ID = "story-1a-follower-growth";
const AUTO_INVITE_CARD_ID = "auto-invite";
const FOLLOW_PAGES_CARD_ID = "follow-pages";

const postVisuals: ReadonlyArray<Readonly<{ image: string; alt: string }>> = [
  {
    image: "member/post-image-1.png",
    alt: "Benefits migration readiness post preview",
  },
  {
    image: "member/post-image-2.png",
    alt: "Open enrollment planning post preview",
  },
  {
    image: "feed-post-content.png",
    alt: "Benefits analytics post preview",
  },
];

const leadAvatars: Record<string, string> = {
  [pcpVisitorPersona.name]: CHERI_SPARKS_AVATAR,
  "Priya Shah": "avatar-3.png",
  "Dana Kim": "avatar-1.png",
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

type AdminUc5SelfInitiatedTurn = Readonly<{
  id: string;
  view: AdminUc5SelfInitiatedView;
}>;

type AdminAttentionCardId =
  | typeof STORY_1A_CARD_ID
  | typeof AUTO_INVITE_CARD_ID
  | typeof FOLLOW_PAGES_CARD_ID;

type AdminUc5AgentPanelProps = Readonly<{
  activeInsightId: AdminUc5InsightId | null;
  draft: string;
  initialSelfInitiatedView?: AdminUc5SelfInitiatedView | null;
  panelId: string;
  threadTurns: ReadonlyArray<AdminUc5ThreadTurn>;
  variant: ChatPanelVariant;
  onClose: () => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
  onSend: () => void;
  onVariantToggle: () => void;
}>;

export type AdminUc5SelfInitiatedView =
  | "page-performance"
  | "competitors"
  | "visitor-audience";

const ADMIN_PAGE_PERFORMANCE_PROMPT = "How is my page performing this month?";
const ADMIN_COMPETITORS_PROMPT = "What are my competitors doing?";
const ADMIN_VISITOR_AUDIENCE_PROMPT = "Who's been visiting my Page?";

export const ADMIN_UC5_SELF_INITIATED_PROMPTS: ReadonlyArray<
  Readonly<{
    id: AdminUc5SelfInitiatedView;
    prompt: string;
  }>
> = [
  {
    id: "page-performance",
    prompt: ADMIN_PAGE_PERFORMANCE_PROMPT,
  },
  {
    id: "competitors",
    prompt: ADMIN_COMPETITORS_PROMPT,
  },
  {
    id: "visitor-audience",
    prompt: ADMIN_VISITOR_AUDIENCE_PROMPT,
  },
] as const;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${PCP_ASSET_ROOT}/${path}`;
}

function getSelfInitiatedViewForPrompt(
  prompt: string,
): AdminUc5SelfInitiatedView | null {
  if (
    prompt === ADMIN_PAGE_PERFORMANCE_PROMPT ||
    prompt === "How is my page performing?" ||
    prompt === "How do I compare?"
  ) {
    return "page-performance";
  }

  if (prompt === ADMIN_COMPETITORS_PROMPT) {
    return "competitors";
  }

  if (
    prompt === ADMIN_VISITOR_AUDIENCE_PROMPT ||
    prompt === "Who's been visiting?"
  ) {
    return "visitor-audience";
  }

  return null;
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
  const [resolvedCardIds, setResolvedCardIds] = useState<
    ReadonlySet<AdminAttentionCardId>
  >(() => new Set());

  function resolveCard(cardId: AdminAttentionCardId) {
    setResolvedCardIds((currentCardIds) => {
      const nextCardIds = new Set(currentCardIds);

      nextCardIds.add(cardId);

      return nextCardIds;
    });
  }

  function handleInsightCardSelect(
    insightId: AdminUc5InsightId,
  ) {
    onInsightSelect(insightId);
  }

  return (
    <section
      aria-labelledby="admin-performance-digest-heading"
      className="min-w-0"
    >
      <div>
        <h2
          className="text-heading-lg text-text"
          id="admin-performance-digest-heading"
        >
          Today&apos;s actions
        </h2>
      </div>

      <div className="mt-xxl space-y-md">
        {!resolvedCardIds.has(STORY_1A_CARD_ID) ? (
          <InsightCard
            active={activeInsightId === "follower-growth"}
            action={{
              id: "ask-ai",
              kind: "ask-ai",
              label: "Ask",
              onSelect: () => handleInsightCardSelect("follower-growth"),
            }}
            dismissLabel="Dismiss follower growth insight"
            evidence="Posting slowed from 3x a week to once."
            headline="Follower growth down 18% this month"
            onDismiss={() => resolveCard(STORY_1A_CARD_ID)}
            type="anomaly"
          />
        ) : null}
        {!resolvedCardIds.has(AUTO_INVITE_CARD_ID) ? (
          <TodayActionCard
            badge={{ label: "Premium", tone: "premium" }}
            description="Automatically invite post-engagers to follow."
            dismissLabel="Dismiss Auto-Invite action"
            headline="Turn on Auto-Invite to grow new followers 6.7x faster"
            inlineAction={{
              label: "Enable",
              onSelect: () => resolveCard(AUTO_INVITE_CARD_ID),
            }}
            onDismiss={() => resolveCard(AUTO_INVITE_CARD_ID)}
          />
        ) : null}
        {!resolvedCardIds.has(FOLLOW_PAGES_CARD_ID) ? (
          <TodayActionCard
            description="Follow other Pages to stay connected to your industry and easily join relevant conversations."
            dismissLabel="Dismiss follow other Pages action"
            headline="Follow other Pages"
            inlineAction={{
              label: "Follow",
              onSelect: () => resolveCard(FOLLOW_PAGES_CARD_ID),
            }}
            onDismiss={() => resolveCard(FOLLOW_PAGES_CARD_ID)}
          />
        ) : null}
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
  initialSelfInitiatedView = null,
  panelId,
  threadTurns,
  variant,
  onClose,
  onDraftChange,
  onFollowUpSelect,
  onSend,
  onVariantToggle,
}: AdminUc5AgentPanelProps) {
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const selfInitiatedTurnIdRef = useRef(initialSelfInitiatedView ? 1 : 0);
  const [selfInitiatedTurns, setSelfInitiatedTurns] = useState<
    ReadonlyArray<AdminUc5SelfInitiatedTurn>
  >(() =>
    initialSelfInitiatedView
      ? [{ id: `${initialSelfInitiatedView}-0`, view: initialSelfInitiatedView }]
      : [],
  );
  const [busyTurnIds, setBusyTurnIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [stopSignal, setStopSignal] = useState(0);
  const activeInsight = activeInsightId
    ? adminUc5Insights[activeInsightId]
    : null;
  const headerActionSize = variant === "expanded" ? "medium" : "small";
  const isAssistantBusy = busyTurnIds.size > 0;
  const handleThreadContentChange = useCallback(() => {
    const scrollToBottom = () => {
      const chatBody = chatBodyRef.current;

      if (!chatBody) {
        return;
      }

      chatBody.scrollTo({ top: chatBody.scrollHeight });
    };

    scrollToBottom();
    window.requestAnimationFrame(scrollToBottom);
    window.setTimeout(scrollToBottom, 120);
    window.setTimeout(scrollToBottom, 360);
    window.setTimeout(scrollToBottom, 700);
  }, []);
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
  const handleSelfInitiatedViewSelect = useCallback(
    (view: AdminUc5SelfInitiatedView) => {
      const nextTurnId = selfInitiatedTurnIdRef.current;

      selfInitiatedTurnIdRef.current += 1;
      setSelfInitiatedTurns((currentTurns) => [
        ...currentTurns,
        { id: `${view}-${nextTurnId}`, view },
      ]);
    },
    [],
  );
  const handleSelfInitiatedPromptSelect = useCallback(
    (prompt: string) => {
      const view = getSelfInitiatedViewForPrompt(prompt);

      if (!view) {
        return;
      }

      handleSelfInitiatedViewSelect(view);
    },
    [handleSelfInitiatedViewSelect],
  );

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
      <ChatBody ref={chatBodyRef}>
        <ChatThread showAiDisclaimer={false}>
          <div className="flex flex-col gap-lg">
            {activeInsight ? (
              <ActiveInsightThread
                insight={activeInsight}
                onBusyChange={handleScriptedTurnBusyChange}
                onContentChange={handleThreadContentChange}
                onFollowUpSelect={onFollowUpSelect}
                stopSignal={stopSignal}
              />
            ) : selfInitiatedTurns.length > 0 ? (
              selfInitiatedTurns.map((turn) => {
                if (turn.view === "page-performance") {
                  return (
                    <SelfInitiatedPerformanceThread
                      key={turn.id}
                      onBusyChange={handleScriptedTurnBusyChange}
                      onContentChange={handleThreadContentChange}
                      onPromptSelect={handleSelfInitiatedPromptSelect}
                      stopSignal={stopSignal}
                      turnId={turn.id}
                    />
                  );
                }

                if (turn.view === "competitors") {
                  return (
                    <SelfInitiatedCompetitorsThread
                      key={turn.id}
                      onBusyChange={handleScriptedTurnBusyChange}
                      onContentChange={handleThreadContentChange}
                      onPromptSelect={handleSelfInitiatedPromptSelect}
                      stopSignal={stopSignal}
                      turnId={turn.id}
                    />
                  );
                }

                return (
                  <SelfInitiatedVisitorAudienceThread
                    key={turn.id}
                    onBusyChange={handleScriptedTurnBusyChange}
                    onContentChange={handleThreadContentChange}
                    stopSignal={stopSignal}
                    turnId={turn.id}
                  />
                );
              })
            ) : threadTurns.length === 0 ? (
              <WelcomeThread onPromptSelect={handleSelfInitiatedViewSelect} />
            ) : null}

            {threadTurns.map((turn) => (
              <FollowUpTurn
                key={turn.id}
                onBusyChange={handleScriptedTurnBusyChange}
                onContentChange={handleThreadContentChange}
                stopSignal={stopSignal}
                turn={turn}
              />
            ))}
          </div>
        </ChatThread>
      </ChatBody>
      <ChatComposer
        inputProps={{
          "aria-label": "Message Velora AI",
          onChange: onDraftChange,
          placeholder: "Send message",
          disabled: isAssistantBusy,
          value: draft,
        }}
        isResponding={isAssistantBusy}
        onSend={onSend}
        onStopResponse={handleStopAssistantResponse}
        sendDisabled={isAssistantBusy}
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
  onPromptSelect,
}: Readonly<{
  onPromptSelect: (view: AdminUc5SelfInitiatedView) => void;
}>) {
  return (
    <section className="flex w-full max-w-[var(--design-layout-chat-message-assistant-max)] flex-col items-start pb-xl pt-sm pr-sm">
      <h2 className="text-heading-lg text-text">
        Hi {pcpCompanyProfile.adminFirstName} 👋
      </h2>
      <p className="mt-xs text-body-sm text-text">
        What would you like to look at?
      </p>
      <div className="mt-lg flex flex-col gap-sm">
        {ADMIN_UC5_SELF_INITIATED_PROMPTS.map((item) => (
          <Prompt
            className="w-fit max-w-full self-start"
            key={item.id}
            onPromptSelect={() => onPromptSelect(item.id)}
            prompt={item.prompt}
          />
        ))}
      </div>
    </section>
  );
}

function SelfInitiatedPerformanceThread({
  onBusyChange,
  onContentChange,
  onPromptSelect,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onPromptSelect: (prompt: string) => void;
  stopSignal?: number;
  turnId: string;
}>) {
  return (
    <>
      <ChatMessage role="user">How is my page performing this month?</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "metrics",
            children: (
              <ResponseMetric
                items={[
                  {
                    value: "+212",
                    label: "New followers",
                    delta: "12%",
                    deltaContext: "vs last mo",
                    tone: "positive",
                  },
                  {
                    value: "1,204",
                    label: "Page visits",
                    delta: "19%",
                    deltaContext: "vs last mo",
                    tone: "positive",
                  },
                  {
                    value: "4.6%",
                    label: "Engagement rate",
                    delta: "0.8 pts",
                    tone: "positive",
                  },
                ]}
              />
            ),
          },
          {
            id: "competitor-comparison",
            children: (
              <ResponseCompare
                dimension="Follower growth this month"
                rows={[
                  {
                    name: "BenefitHub",
                    value: 18,
                    valueLabel: "+18%",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                  {
                    name: "Velora",
                    value: 12,
                    valueLabel: "+12%",
                    isYou: true,
                    visual: {
                      kind: "company-logo",
                      src: pcpCompanyProfile.logoSrc,
                    },
                  },
                  {
                    name: "Enrollly",
                    value: 4,
                    valueLabel: "+4%",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                ]}
                title="Competitor comparison"
              />
            ),
          },
          {
            id: "performance-context",
            children: (
              <ResponseText className="chat-message-enter">
                BenefitHub grew faster — but they posted 3x as much. Per post,
                your engagement is the strongest of the three. And the right
                people are showing up: 68% of your visitors this month are HR
                Director or above.
              </ResponseText>
            ),
          },
          {
            id: "chips",
            children: (
              <ResponseChips
                onPromptSelect={onPromptSelect}
                prompts={[
                  "Who's been visiting?",
                  "What are my competitors doing?",
                ]}
              />
            ),
          },
        ]}
        id={`${turnId}-performance-summary`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
        text="Strong month, Rose. Your follower growth recovered — and the open enrollment posts we talked about last month did the heavy lifting."
      />
    </>
  );
}

function SelfInitiatedCompetitorsThread({
  onBusyChange,
  onContentChange,
  onPromptSelect,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onPromptSelect: (prompt: string) => void;
  stopSignal?: number;
  turnId: string;
}>) {
  return (
    <>
      <ChatMessage role="user">{ADMIN_COMPETITORS_PROMPT}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "posts-published",
            children: (
              <ResponseCompare
                dimension="This month"
                rows={[
                  {
                    name: "BenefitHub",
                    value: 22,
                    valueLabel: "22",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                  {
                    name: "Velora",
                    value: 12,
                    valueLabel: "12",
                    isYou: true,
                    visual: {
                      kind: "company-logo",
                      src: pcpCompanyProfile.logoSrc,
                    },
                  },
                  {
                    name: "Enrollly",
                    value: 8,
                    valueLabel: "8",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                ]}
                title="Posts published"
              />
            ),
          },
          {
            id: "competitor-post-context",
            children: (
              <ResponseText className="chat-message-enter">
                Their best one this month is a checklist-style post — short,
                practical, deadline-driven:
              </ResponseText>
            ),
          },
          {
            id: "competitor-post",
            children: (
              <ResponsePostCompact
                author="BenefitHub"
                meta="421 reactions · 1w"
                text="5 things to lock down before open enrollment opens. Number 4 is the one…"
                thumbnailAlt="BenefitHub checklist post thumbnail"
                thumbnailSrc={assetSrc("member/post-image-2.png")}
              />
            ),
          },
          {
            id: "chips",
            children: (
              <ResponseChips
                onPromptSelect={onPromptSelect}
                prompts={[
                  "How do I compare?",
                  "How is my page performing?",
                ]}
              />
            ),
          },
        ]}
        id={`${turnId}-competitors`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
        text="BenefitHub is setting the pace right now — they've moved to short, deadline-focused posts and they're publishing almost daily."
      />
    </>
  );
}

function SelfInitiatedVisitorAudienceThread({
  onBusyChange,
  onContentChange,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  stopSignal?: number;
  turnId: string;
}>) {
  return (
    <>
      <ChatMessage role="user">{ADMIN_VISITOR_AUDIENCE_PROMPT}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "visitor-audience",
            children: (
              <ResponseEntity
                audience="admin"
                headline="Your target buyer · up from 51% last month"
                name="68% are HR Director or above"
                signal={{
                  tier: "tier-3",
                  label: "Tier 3 · Aggregate",
                  avatars: [
                    assetSrc("avatar-2.png"),
                    assetSrc("avatar-1.png"),
                    assetSrc("avatar-3.png"),
                  ],
                }}
                variant="person"
              />
            ),
          },
          {
            id: "visitor-standout-text",
            children: (
              <ResponseText className="chat-message-enter">
                One visitor stands out this week:
              </ResponseText>
            ),
          },
          {
            id: "visitor-person",
            children: (
              <ResponseEntity
                actions={[
                  { label: "View profile", variant: "secondary" },
                  { label: "See what they viewed", variant: "secondary" },
                ]}
                audience="admin"
                connectionDegree="3rd"
                headline="Director of Benefits · Healthcare · 8,500 employees"
                name="Marcus Tran"
                signal={{
                  tier: "tier-2",
                  label: "Viewed your pricing post twice this week",
                }}
                variant="person"
              />
            ),
          },
          {
            id: "chips",
            children: (
              <ResponseChips
                prompts={[
                  "Break down by role",
                  "What content drew them?",
                ]}
              />
            ),
          },
        ]}
        id={`${turnId}-visitor-audience`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
        text="1,204 people visited this month — and the right ones are finding you."
      />
    </>
  );
}

function ActiveInsightThread({
  insight,
  onBusyChange,
  onContentChange,
  onFollowUpSelect,
  stopSignal,
}: Readonly<{
  insight: AdminUc5Insight;
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
  stopSignal?: number;
}>) {
  if (insight.id === "follower-growth") {
    return (
      <Story1aFollowerGrowthThread
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
      />
    );
  }

  const followUps = insight.followUps.filter((followUp) => !followUp.primary);

  return (
    <>
      <ChatMessage role="user">{insight.query}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "insight-card",
            children: (
              <InsightResponse
                insight={insight}
                onFollowUpSelect={onFollowUpSelect}
              />
            ),
          },
          ...(followUps.length
            ? [
                {
                  id: "follow-ups",
                  children: (
                    <FollowUpActions
                      followUps={followUps}
                      onFollowUpSelect={onFollowUpSelect}
                    />
                  ),
                },
              ]
            : []),
        ]}
        id={`admin-insight-${insight.id}`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
        text={getActiveInsightIntro(insight.id)}
      />
    </>
  );
}

function getActiveInsightIntro(insightId: AdminUc5InsightId) {
  if (insightId === "post-amplification") {
    return "This post is standing out because people who saw it responded, but reach stayed low.";
  }

  if (insightId === "visitor-demographics") {
    return "The people finding Velora look close to the teams you're built for: HR, benefits, and people operations leaders managing carrier complexity, eligibility cleanup, and open enrollment readiness.";
  }

  if (insightId === "content-engagement") {
    return "The Arbor proof is getting efficient engagement. I would treat it as a reach opportunity: the message is working, but distribution is still modest.";
  }

  if (insightId === "weekly-synthesis") {
    return adminUc5SynthesisRecommendation;
  }

  return adminUc5Insights[insightId].value;
}

type Story1aBlockTurn = "compare" | "recommendations";

const STORY_1A_COMPARE_PROMPT = "How do my competitors compare?";
const STORY_1A_RECOMMENDATIONS_PROMPT = "What should I do this week?";
const story1aFollowerGrowthAxisTicks = ["May 5", "May 19", "Jun 2"] as const;
const story1aFollowerGrowthValues = [
  94,
  101,
  97,
  105,
  100,
  103,
  88,
  80,
  74,
] as const;

function Story1aFollowerGrowthThread({
  onBusyChange,
  onContentChange,
  stopSignal,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  stopSignal?: number;
}>) {
  const [visibleTurns, setVisibleTurns] = useState<
    ReadonlyArray<Story1aBlockTurn>
  >([]);
  const hasCompareTurn = visibleTurns.includes("compare");
  const hasRecommendationsTurn = visibleTurns.includes("recommendations");

  function showTurn(turn: Story1aBlockTurn) {
    setVisibleTurns((currentTurns) =>
      currentTurns.includes(turn) ? currentTurns : [...currentTurns, turn],
    );
  }

  function handlePromptSelect(prompt: string) {
    if (prompt === STORY_1A_COMPARE_PROMPT) {
      showTurn("compare");
      return;
    }

    if (prompt === STORY_1A_RECOMMENDATIONS_PROMPT) {
      showTurn("recommendations");
    }
  }

  return (
    <>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "metric-with-trend",
            children: (
              <ResponseMetricWithTrend
                axisTicks={story1aFollowerGrowthAxisTicks}
                delta="18%"
                deltaContext="vs last month"
                annotation={{
                  startIndex: 6,
                  endIndex: 8,
                  label: "Posting gap",
                  tone: "negative",
                }}
                title="Follower growth"
                tone="negative"
                unit="new followers this month"
                value="+86"
                values={story1aFollowerGrowthValues}
              />
            ),
          },
          ...(visibleTurns.length === 0
            ? [
                {
                  id: "chips",
                  children: (
                    <ResponseChips
                      onPromptSelect={handlePromptSelect}
                      prompts={[
                        STORY_1A_COMPARE_PROMPT,
                        STORY_1A_RECOMMENDATIONS_PROMPT,
                      ]}
                    />
                  ),
                },
              ]
            : []),
        ]}
        id="story-1a-follower-growth"
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
        text="Your follower growth dropped 18% this month. The main cause: posting frequency fell from 3x a week to once."
      />

      {hasCompareTurn ? (
        <ScriptedResponseTurn
          attachments={[
            {
              id: "compare",
              children: (
                <ResponseCompare
                  dimension="Follower growth this month"
                  rows={[
                    {
                      name: "Velora",
                      value: -18,
                      valueLabel: "-18%",
                      isYou: true,
                      visual: {
                        kind: "company-logo",
                        src: pcpCompanyProfile.logoSrc,
                      },
                    },
                    {
                      name: "BenefitHub",
                      value: 24,
                      valueLabel: "+24%",
                      visual: {
                        kind: "company-logo",
                      },
                    },
                    {
                      name: "Enrollly",
                      value: 6,
                      valueLabel: "+6%",
                      visual: {
                        kind: "company-logo",
                      },
                    },
                  ]}
                  title="Competitor comparison"
                />
              ),
            },
            ...(!hasRecommendationsTurn
              ? [
                  {
                    id: "chips",
                    children: (
                      <ResponseChips
                        onPromptSelect={handlePromptSelect}
                        prompts={[STORY_1A_RECOMMENDATIONS_PROMPT]}
                      />
                    ),
                  },
                ]
              : []),
          ]}
          id="story-1a-compare"
          onBusyChange={onBusyChange}
          onContentChange={onContentChange}
          stopSignal={stopSignal}
          text="Compared with similar benefits platforms, Velora is losing follower momentum while BenefitHub and Enrollly are still growing."
        />
      ) : null}

      {hasRecommendationsTurn ? (
        <ScriptedResponseTurn
          attachments={[
            {
              id: "post",
              children: (
                <ResponsePostCompact
                  meta="134 reactions · 3w"
                  text="Open enrollment creates a hard deadline for benefits teams. Here are three carrier-readiness checks to finish before a mid-year migration."
                  thumbnailAlt="Open enrollment readiness post thumbnail"
                  thumbnailSrc={assetSrc("member/post-image-1.png")}
                />
              ),
            },
          ]}
          id="story-1a-recommendations"
          onBusyChange={onBusyChange}
          onContentChange={onContentChange}
          renderText={({ streamStatus, streamText }) => (
            <ResponseText
              className="chat-message-enter"
              streamStatus={streamStatus}
              streamText={streamText}
            >
              <p>
                Good news first: your audience hasn&apos;t gone anywhere — they
                just haven&apos;t heard from you. Here&apos;s what I&apos;d do
                this week:
              </p>
              <ResponseTextRecommendationList
                items={[
                  {
                    action: "Get back to 3 posts a week",
                    reason: "even short ones keep you in the feed.",
                  },
                  {
                    action: "Talk about open enrollment deadlines",
                    reason:
                      "that's what brought your best visitors last month.",
                  },
                  {
                    action: "Re-run your top post",
                    reason: "it's still your strongest performer:",
                  },
                ]}
              />
            </ResponseText>
          )}
          stopSignal={stopSignal}
          text="Good news first: your audience hasn't gone anywhere — they just haven't heard from you. Here's what I'd do this week:"
        />
      ) : null}
    </>
  );
}

function FollowUpTurn({
  onBusyChange,
  onContentChange,
  stopSignal,
  turn,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  stopSignal?: number;
  turn: AdminUc5ThreadTurn;
}>) {
  return (
    <>
      <ChatMessage role="user">{turn.prompt}</ChatMessage>
      <ScriptedResponseTurn
        id={turn.id}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
        text={turn.response}
      />
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
          src={assetSrc("member/post-image-1.png")}
          width={40}
        />
        <div className="min-w-0">
          <h4 className="truncate text-control-sm text-text">
            What benefits teams should validate before a mid-year migration
          </h4>
          <p className="mt-xxs text-body-xs text-text-meta">2d</p>
        </div>
      </div>
      <div className="mt-lg divide-y divide-border-faint">
        <PostMetricRow label="Engagement rate" value="4.8%" />
        <PostMetricRow label="Impressions" value="240" />
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
          className={cx(
            row.company === pcpCompanyProfile.name &&
              VELORA_LOGO_TILE_BACKGROUND_CLASS,
          )}
          label={row.company}
          shape="square"
          size={32}
          src={competitorLogoSrc[row.company]}
          style={
            row.company === pcpCompanyProfile.name
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
          label={pcpVisitorPersona.name}
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
