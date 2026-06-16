"use client";

import Image from "next/image";
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
} from "@/components/chat/chat-ui";
import {
  useChatLatestMessageAnchor,
} from "@/components/chat/chat-motion";
import {
  ChatSidePanel,
  ChatSidePanelLayout,
} from "@/components/chat/chat-side-panel";
import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";
import { Tag, type TagTone } from "@/components/primitives/tag";
import { AudienceFit as ResponseAudienceFit } from "@/components/premium-company-pages/response-blocks/AudienceFit";
import { Chips as ResponseChips } from "@/components/premium-company-pages/response-blocks/Chips";
import { Compare as ResponseCompare } from "@/components/premium-company-pages/response-blocks/Compare";
import { ContentList as ResponseContentList } from "@/components/premium-company-pages/response-blocks/ContentList";
import { ConversionPath as ResponseConversionPath } from "@/components/premium-company-pages/response-blocks/ConversionPath";
import { PostCard as ResponsePostCard } from "@/components/premium-company-pages/response-blocks/ChatCards";
import { Metric as ResponseMetric } from "@/components/premium-company-pages/response-blocks/Metric";
import { MetricWithTrend as ResponseMetricWithTrend } from "@/components/premium-company-pages/response-blocks/MetricWithTrend";
import { PersonCard as ResponsePersonCard } from "@/components/premium-company-pages/response-blocks/PersonCard";
import { ResponseRail } from "@/components/premium-company-pages/response-blocks/ResponseRail";
import {
  StreamingText as ResponseStreamingText,
  Text as ResponseText,
  TextRecommendationList as ResponseTextRecommendationList,
} from "@/components/premium-company-pages/response-blocks/Text";

import { InsightCard } from "./insight-card";
import {
  PCP_ASSET_ROOT,
  pcpCompanyProfile,
  pcpCompetitorNames,
  pcpProofSnippets,
  pcpVisitorPersona,
} from "./persona";
import { ScriptedResponseTurn } from "./scripted-response-turn";
import { TodayActionCard } from "./today-action-card";
import { useScriptedTurnController } from "./use-scripted-turn-controller";
import { PostSidePanelEngagementSummary } from "./post-side-panel-engagement-summary";
import { PcpAdminGoldAiMark } from "./vca-fab";
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
  type AdminUc5InsightSelection,
  type AdminUc5Lead,
  type AdminUc5Metric,
  type AdminUc5PostPerformance,
  type AdminUc5Tone,
} from "./premium-company-pages-admin-uc5-data";

const VELORA_LOGO_TILE_BACKGROUND_CLASS = "bg-[#ACF5B3]";
const VELORA_LOGO_TILE_BACKGROUND_STYLE = {
  backgroundColor: "#ACF5B3",
};
const ADMIN_BOOST_POST_IMAGE = "member/arbor-open-enrollment-post.png";
const CHERI_SPARKS_AVATAR = pcpVisitorPersona.avatar;
const ADMIN_AI_ASSISTANT_SETTINGS_HREF =
  "/premium-company-pages/admin/settings/manage-ai-assistant";
const ASSISTANT_SETUP_CARD_ID = "assistant-setup";
const STORY_1A_CARD_ID = "story-1a-follower-growth";
const STORY_1A_FOLLOWER_GROWTH_PROMPT =
  "How do I recover my follower growth?";
const AUTO_INVITE_CARD_ID = "auto-invite";
const FOLLOW_PAGES_CARD_ID = "follow-pages";

const postVisuals: ReadonlyArray<Readonly<{ image: string; alt: string }>> = [
  {
    image: "member/post-image-1.png",
    alt: "Carrier coordination post preview",
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
  onInsightSelect: (insight: AdminUc5InsightSelection) => void;
  showAssistantSetupAction?: boolean;
  showFollowerGrowthInsight?: boolean;
}>;

type AdminUc5SelfInitiatedTurn = Readonly<{
  id: string;
  prompt: string;
  view: AdminUc5SelfInitiatedView;
}>;

type AdminAttentionCardId =
  | typeof ASSISTANT_SETUP_CARD_ID
  | typeof STORY_1A_CARD_ID
  | typeof AUTO_INVITE_CARD_ID
  | typeof FOLLOW_PAGES_CARD_ID;

type AdminUc5AgentPanelProps = Readonly<{
  activeInsight: AdminUc5InsightSelection | null;
  draft: string;
  initialSelfInitiatedPrompt?: string;
  initialSelfInitiatedView?: AdminUc5SelfInitiatedView | null;
  panelId: string;
  threadTurns: ReadonlyArray<AdminUc5ThreadTurn>;
  variant: ChatPanelVariant;
  onClose: () => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onDraftClear: () => void;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
  onSend: () => void;
  onVariantToggle: () => void;
}>;

export type AdminUc5SelfInitiatedView =
  | "page-performance"
  | "next-focus"
  | "custom-button-clicks"
  | "post-impressions"
  | "relevant-visitors"
  | "visitor-audience"
  | "page-engagement";

const ADMIN_PAGE_PERFORMANCE_PROMPT = "How is my page performing?";
const ADMIN_NEXT_FOCUS_PROMPT = "What should I focus on next?";
const ADMIN_VISITOR_AUDIENCE_PROMPT =
  "Show insights about my page visitors";
const ADMIN_PAGE_PERFORMANCE_RESPONSE_TEXT = `Your Page is performing well on content engagement, but growth is not keeping pace with competitors.

Impressions, reactions, comments, and reposts are all up this month. Your strongest post reached an 8.2% engagement rate, which suggests practical open enrollment and carrier-readiness content is resonating.

The main gap is distribution. Page views are up, but unique visitors are down, custom button clicks are still low, and Velora added 420 new followers compared with ${pcpCompetitorNames[0]}'s 1,280. That suggests the content is resonating with people who see it, but the Page needs more reach and clearer conversion paths.`;
const ADMIN_PAGE_PERFORMANCE_RESPONSE_HIGHLIGHTS = [
  "content engagement",
  "growth is not keeping pace with competitors",
  "8.2% engagement rate",
  "Page views are up",
  "unique visitors are down",
  "custom button clicks are still low",
  `420 new followers compared with ${pcpCompetitorNames[0]}'s 1,280`,
] as const;
const VISITOR_AUDIENCE_RESPONSE_TEXT = `Your Page is reaching more relevant visitors this month.

64% of people who viewed your Page match Velora's target audience, up from 52% last month. The strongest signals are job function, seniority, and company size.

More visitors now match Velora's core audience profile: Human Resources roles, Director+ seniority, and companies with 10,001+ employees. That suggests your Page is reaching people who are more likely to evaluate Velora, not just browse it.`;
const VISITOR_AUDIENCE_RESPONSE_HIGHLIGHTS = [
  "64%",
  "up from 52% last month",
  "Human Resources roles",
  "Director+ seniority",
  "10,001+ employees",
] as const;
const VISITOR_AUDIENCE_RELEVANT_VISITORS_PROMPT =
  "Show relevant visitors";
const ADMIN_RELEVANT_VISITORS_PROMPT =
  "Which visitors look most relevant?";
const VISITOR_AUDIENCE_REACH_MORE_PROMPT = "How do I reach more of them?";
const VISITOR_AUDIENCE_RELEVANT_VISITORS_RESPONSE_TEXT =
  "Here are a few visitors who match the strongest audience signals for Velora right now.";
const ADMIN_RELEVANT_VISITORS_RESPONSE_TEXT = `A few recent visitors look especially relevant for Velora.

They match your target profile: HR and benefits leaders at large companies, with recent Page activity around benefits operations content.

I'd prioritize visitors who combine seniority, company size, and repeat engagement. Those signals are stronger than a single Page view on its own.`;
const ADMIN_RELEVANT_VISITORS_RESPONSE_HIGHLIGHTS = [
  "HR and benefits leaders",
  "large companies",
  "seniority, company size, and repeat engagement",
] as const;
const VISITOR_AUDIENCE_REACH_MORE_RESPONSE_TEXT =
  "Post more content for Human Resources leaders at large employers, then reuse the open enrollment and carrier-readiness proof that is already attracting relevant visitors.";
const ADMIN_NEXT_FOCUS_RESPONSE_TEXT = `Focus on turning engagement into follower growth.

Your content is resonating when people see it, but Velora is posting less often than similar Pages. Competitors gaining followers are using short, practical open enrollment posts with clear deadlines.

I'd make your next move a checklist-style post for HR leaders, then follow it with a Velora proof point.`;
const ADMIN_NEXT_FOCUS_RESPONSE_HIGHLIGHTS = [
  "turning engagement into follower growth",
  "posting less often",
  "checklist-style post",
] as const;
const ADMIN_NEXT_FOCUS_DRAFT_PROMPT = "Draft a similar post";
const ADMIN_NEXT_FOCUS_DRAFT_TEXT = `Here is a Velora version:

Open enrollment gets harder when carrier files, eligibility cleanup, and employee communications are tracked in different places.

Before enrollment opens, HR teams should confirm carrier file readiness, eligibility cleanup, plan-change communication, deadline risks, and follow-up owners.

Velora helps benefits teams see those moving parts in one workflow, so open enrollment feels coordinated before the deadline pressure hits.`;
const ADMIN_POST_IMPRESSIONS_PROMPT = "Why are post impressions down?";
const ADMIN_POST_IMPRESSIONS_BOOST_PROMPT = "What post should I boost?";
const ADMIN_POST_IMPRESSIONS_RESPONSE_TEXT = `Post impressions are down 18.4% this month. The clearest pattern is cadence: Velora posted fewer times, and two link-heavy updates had weaker early engagement.

The content itself is not all underperforming. Reactions, comments, and reposts are still up, which suggests people are responding when the right posts reach them. The issue looks more like distribution than topic fit.

I would first return to a steadier posting cadence and reuse practical benefits-operations topics organically. If you need faster reach ahead of open enrollment planning, boosting a proven post could also be a reasonable next step.`;
const ADMIN_POST_IMPRESSIONS_RESPONSE_HIGHLIGHTS = [
  "18.4% this month",
  "posted fewer times",
  "distribution than topic fit",
  "boosting a proven post could also be a reasonable next step",
] as const;
const ADMIN_POST_IMPRESSIONS_BOOST_RESPONSE_TEXT =
  "I'd boost the open enrollment customer story first. It already has the strongest engagement rate in the recent set, so boosting would extend content that is working instead of trying to rescue a weak post.";
const ADMIN_PAGE_ENGAGEMENT_PROMPT = "How can I boost my page engagement?";
const ADMIN_PAGE_ENGAGEMENT_RESPONSE_TEXT = `You can boost Page engagement by posting consistently, starting conversations, and using stronger visuals. You can also read more engagement best practices in the LinkedIn Page growth guide.

Post consistently

Companies that post weekly see 2x higher engagement. When someone engages with your post, invite them to follow your Page to grow your audience even faster.

Engage with your community

Ask thoughtful questions and respond to comments. Engagement with followers builds trust and helps you stay top of mind.

Use compelling visuals

Posts with images get 2x more comments; video drives 5x more engagement. Add photos, videos, or graphics that show your business, team, or customers in action.

Would you like me to help you draft a new post?`;
const ADMIN_PAGE_ENGAGEMENT_GUIDE_LINK_TEXT = "LinkedIn Page growth guide";
const ADMIN_PAGE_ENGAGEMENT_FINAL_PROMPT_TEXT =
  "Would you like me to help you draft a new post?";
const ADMIN_PAGE_ENGAGEMENT_SECTION_TITLES = [
  "Post consistently",
  "Engage with your community",
  "Use compelling visuals",
] as const;
const ADMIN_CUSTOM_BUTTON_CLICKS_PROMPT =
  "How can I get more custom button clicks?";
const ADMIN_CUSTOM_BUTTON_CLICKS_RESPONSE_TEXT = `Your custom button is getting a few clicks, but it is not converting enough Page attention yet.

Page views are up this month, but the button only received 126 clicks. That usually means visitors are finding the Page, but the next step is either not visible enough or not specific enough for what they came to learn.

I would make the button action match the content that is working: point visitors toward a demo, customer proof, or open enrollment resource. Then pin or post a short update that tells HR leaders exactly why to click.`;
const ADMIN_CUSTOM_BUTTON_CLICKS_RESPONSE_HIGHLIGHTS = [
  "not converting enough Page attention yet",
  "Page views are up",
  "only received 126 clicks",
  "demo, customer proof, or open enrollment resource",
] as const;

export const ADMIN_UC5_SELF_INITIATED_PROMPTS: ReadonlyArray<
  Readonly<{
    id: AdminUc5SelfInitiatedView;
    prompt: string;
  }>
> = [
  {
    id: "visitor-audience",
    prompt: ADMIN_VISITOR_AUDIENCE_PROMPT,
  },
  {
    id: "page-performance",
    prompt: ADMIN_PAGE_PERFORMANCE_PROMPT,
  },
  {
    id: "next-focus",
    prompt: ADMIN_NEXT_FOCUS_PROMPT,
  },
] as const;

function normalizeSelfInitiatedPrompt(prompt: string) {
  return prompt.trim().toLocaleLowerCase().replace(/[?!.]+$/u, "");
}

function isEngagementSupportPrompt(prompt: string) {
  const hasSupportIntent = [
    "boost",
    "best practice",
    "best practices",
    "drive",
    "get more",
    "help",
    "improve",
    "increase",
    "grow",
  ].some((keyword) => prompt.includes(keyword));
  const hasPageEngagementSubject = [
    "engagement",
    "page",
    "post",
    "posts",
  ].some((keyword) => prompt.includes(keyword));

  return hasSupportIntent && hasPageEngagementSubject;
}

function isCustomButtonClicksPrompt(prompt: string) {
  return (
    (prompt.includes("custom button") || prompt.includes("button click")) &&
    ["drive", "get more", "help", "improve", "increase", "grow"].some(
      (keyword) => prompt.includes(keyword),
    )
  );
}

const adminUc5SelfInitiatedViewByPrompt = new Map<
  string,
  AdminUc5SelfInitiatedView
>([
  [
    normalizeSelfInitiatedPrompt(ADMIN_PAGE_PERFORMANCE_PROMPT),
    "page-performance",
  ],
  [
    normalizeSelfInitiatedPrompt("How is my page performing this month?"),
    "page-performance",
  ],
  [normalizeSelfInitiatedPrompt("How do I compare?"), "page-performance"],
  [normalizeSelfInitiatedPrompt(ADMIN_NEXT_FOCUS_PROMPT), "next-focus"],
  [normalizeSelfInitiatedPrompt("What should I do next?"), "next-focus"],
  [normalizeSelfInitiatedPrompt("What should I post next?"), "next-focus"],
  [
    normalizeSelfInitiatedPrompt(ADMIN_POST_IMPRESSIONS_PROMPT),
    "post-impressions",
  ],
  [
    normalizeSelfInitiatedPrompt("Why did post impressions drop?"),
    "post-impressions",
  ],
  [
    normalizeSelfInitiatedPrompt("Why are impressions down?"),
    "post-impressions",
  ],
  [
    normalizeSelfInitiatedPrompt(ADMIN_VISITOR_AUDIENCE_PROMPT),
    "visitor-audience",
  ],
  [
    normalizeSelfInitiatedPrompt("What kinds of visitors am I attracting?"),
    "visitor-audience",
  ],
  [
    normalizeSelfInitiatedPrompt("Who is visiting my Page?"),
    "visitor-audience",
  ],
  [
    normalizeSelfInitiatedPrompt("Who is visiting my page?"),
    "visitor-audience",
  ],
  [
    normalizeSelfInitiatedPrompt("Who's been visiting my page?"),
    "visitor-audience",
  ],
  [
    normalizeSelfInitiatedPrompt("Who's been visiting my Page?"),
    "visitor-audience",
  ],
  [normalizeSelfInitiatedPrompt("Who's been visiting?"), "visitor-audience"],
  [
    normalizeSelfInitiatedPrompt(ADMIN_RELEVANT_VISITORS_PROMPT),
    "relevant-visitors",
  ],
  [
    normalizeSelfInitiatedPrompt(VISITOR_AUDIENCE_RELEVANT_VISITORS_PROMPT),
    "relevant-visitors",
  ],
  [
    normalizeSelfInitiatedPrompt(ADMIN_PAGE_ENGAGEMENT_PROMPT),
    "page-engagement",
  ],
  [
    normalizeSelfInitiatedPrompt("How can I boost my engagement?"),
    "page-engagement",
  ],
  [
    normalizeSelfInitiatedPrompt(ADMIN_CUSTOM_BUTTON_CLICKS_PROMPT),
    "custom-button-clicks",
  ],
  [
    normalizeSelfInitiatedPrompt("How do I improve custom button clicks?"),
    "custom-button-clicks",
  ],
  [
    normalizeSelfInitiatedPrompt("How to improve my custom button clicks?"),
    "custom-button-clicks",
  ],
]);

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${PCP_ASSET_ROOT}/${path}`;
}

function getSelfInitiatedViewForPrompt(
  prompt: string,
): AdminUc5SelfInitiatedView | null {
  const normalizedPrompt = normalizeSelfInitiatedPrompt(prompt);
  const exactView =
    adminUc5SelfInitiatedViewByPrompt.get(normalizedPrompt) ?? null;

  if (exactView) {
    return exactView;
  }

  if (isEngagementSupportPrompt(normalizedPrompt)) {
    return "page-engagement";
  }

  if (isCustomButtonClicksPrompt(normalizedPrompt)) {
    return "custom-button-clicks";
  }

  return null;
}

function getDefaultSelfInitiatedPrompt(view: AdminUc5SelfInitiatedView) {
  if (view === "page-performance") {
    return ADMIN_PAGE_PERFORMANCE_PROMPT;
  }

  if (view === "next-focus") {
    return ADMIN_NEXT_FOCUS_PROMPT;
  }

  if (view === "custom-button-clicks") {
    return ADMIN_CUSTOM_BUTTON_CLICKS_PROMPT;
  }

  if (view === "post-impressions") {
    return ADMIN_POST_IMPRESSIONS_PROMPT;
  }

  if (view === "relevant-visitors") {
    return ADMIN_RELEVANT_VISITORS_PROMPT;
  }

  if (view === "page-engagement") {
    return ADMIN_PAGE_ENGAGEMENT_PROMPT;
  }

  return ADMIN_VISITOR_AUDIENCE_PROMPT;
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

export function AdminPerformanceDigestCard({
  activeInsightId,
  onInsightSelect,
  showAssistantSetupAction = false,
  showFollowerGrowthInsight = true,
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
    insight: AdminUc5InsightSelection,
  ) {
    onInsightSelect(insight);
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
        {showAssistantSetupAction ? (
          !resolvedCardIds.has(ASSISTANT_SETUP_CARD_ID) ? (
            <TodayActionCard
              badge={{ label: "Premium", tone: "premium" }}
              cardHref={ADMIN_AI_ASSISTANT_SETTINGS_HREF}
              cardLabel="Set up your AI assistant"
              description="Engage visitors with instant replies using content you control."
              dismissLabel="Dismiss AI assistant setup action"
              headline="Set up your AI assistant"
              inlineAction={{
                href: ADMIN_AI_ASSISTANT_SETTINGS_HREF,
                label: "Set up",
              }}
              onDismiss={() => resolveCard(ASSISTANT_SETUP_CARD_ID)}
            />
          ) : null
        ) : showFollowerGrowthInsight &&
          !resolvedCardIds.has(STORY_1A_CARD_ID) ? (
          <InsightCard
            active={activeInsightId === "follower-growth"}
            action={{
              id: "ask-ai",
              kind: "ask-ai",
              label: "Ask",
              onSelect: () =>
                handleInsightCardSelect({
                  id: "follower-growth",
                  prompt: STORY_1A_FOLLOWER_GROWTH_PROMPT,
                }),
            }}
            dismissLabel="Dismiss follower growth insight"
            evidence="New followers dropped 18% after posting slowed to once a week."
            headline="Get follower growth back on track"
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
  activeInsight,
  draft,
  initialSelfInitiatedPrompt,
  initialSelfInitiatedView = null,
  panelId,
  threadTurns,
  variant,
  onClose,
  onDraftChange,
  onDraftClear,
  onFollowUpSelect,
  onSend,
  onVariantToggle,
}: AdminUc5AgentPanelProps) {
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const shouldCollapseAfterBoostPostPanelRef = useRef(false);
  const selfInitiatedTurnIdRef = useRef(initialSelfInitiatedView ? 1 : 0);
  const [isBoostPostSidePanelOpen, setIsBoostPostSidePanelOpen] =
    useState(false);
  const [selfInitiatedTurns, setSelfInitiatedTurns] = useState<
    ReadonlyArray<AdminUc5SelfInitiatedTurn>
  >(() =>
    initialSelfInitiatedView
      ? [
          {
            id: `${initialSelfInitiatedView}-0`,
            prompt:
              initialSelfInitiatedPrompt ??
              getDefaultSelfInitiatedPrompt(initialSelfInitiatedView),
            view: initialSelfInitiatedView,
          },
        ]
      : [],
  );
  const {
    busyTurnCount,
    handleScriptedTurnBusyChange,
    handleStopAssistantResponse,
    isAssistantBusy,
    stopSignal,
  } = useScriptedTurnController();
  const activeInsightData = activeInsight
    ? adminUc5Insights[activeInsight.id]
    : null;
  const headerActionSize = variant === "expanded" ? "medium" : "small";
  const latestSelfInitiatedTurn =
    selfInitiatedTurns[selfInitiatedTurns.length - 1];
  const latestThreadTurn = threadTurns[threadTurns.length - 1];
  const latestUserMessageAnchorKey = latestThreadTurn
    ? `turn:${latestThreadTurn.id}`
    : latestSelfInitiatedTurn
      ? `self-initiated:${latestSelfInitiatedTurn.id}`
      : activeInsight
        ? `active-insight:${activeInsight.id}:${activeInsight.prompt}`
        : null;
  const {
    hasLatestBelow,
    handleScroll: handleLatestScroll,
    scrollToLatest,
  } = useChatLatestMessageAnchor({
    scrollRef: chatBodyRef,
    anchorKey: latestUserMessageAnchorKey,
    contentKey: `${activeInsight?.id ?? "none"}:${selfInitiatedTurns.length}:${threadTurns.length}:${busyTurnCount}:${isBoostPostSidePanelOpen}`,
  });
  const handleThreadContentChange = useCallback(() => {
    handleLatestScroll();
  }, [handleLatestScroll]);
  const handleOpenBoostPostSidePanel = useCallback(() => {
    const shouldExpand = variant !== "expanded";

    shouldCollapseAfterBoostPostPanelRef.current = shouldExpand;
    setIsBoostPostSidePanelOpen(true);

    if (shouldExpand) {
      onVariantToggle();
    }
  }, [onVariantToggle, variant]);
  const handleCloseBoostPostSidePanel = useCallback(() => {
    setIsBoostPostSidePanelOpen(false);

    if (
      shouldCollapseAfterBoostPostPanelRef.current &&
      variant === "expanded"
    ) {
      shouldCollapseAfterBoostPostPanelRef.current = false;
      onVariantToggle();

      return;
    }

    shouldCollapseAfterBoostPostPanelRef.current = false;
  }, [onVariantToggle, variant]);
  const handleSelfInitiatedViewSelect = useCallback(
    (view: AdminUc5SelfInitiatedView, prompt?: string) => {
      const nextTurnId = selfInitiatedTurnIdRef.current;

      selfInitiatedTurnIdRef.current += 1;
      setSelfInitiatedTurns((currentTurns) => [
        ...currentTurns,
        {
          id: `${view}-${nextTurnId}`,
          prompt: prompt ?? getDefaultSelfInitiatedPrompt(view),
          view,
        },
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

      handleSelfInitiatedViewSelect(view, prompt);
    },
    [handleSelfInitiatedViewSelect],
  );
  const handleComposerSend = useCallback(() => {
    const view = getSelfInitiatedViewForPrompt(draft.trim());

    if (view) {
      handleSelfInitiatedViewSelect(view, draft.trim());
      onDraftClear();

      return;
    }

    onSend();
  }, [draft, handleSelfInitiatedViewSelect, onDraftClear, onSend]);
  const isStartSurfaceVisible =
    !activeInsight &&
    selfInitiatedTurns.length === 0 &&
    threadTurns.length === 0;
  const thread = (
    <ChatThread>
      <div className="flex flex-col gap-lg">
        {activeInsight && activeInsightData ? (
          <ActiveInsightThread
            insight={activeInsightData}
            onBusyChange={handleScriptedTurnBusyChange}
            onContentChange={handleThreadContentChange}
            onFollowUpSelect={onFollowUpSelect}
            prompt={activeInsight.prompt}
            stopSignal={stopSignal}
          />
        ) : null}

        {selfInitiatedTurns.map((turn) => {
          if (turn.view === "page-performance") {
            return (
              <SelfInitiatedPerformanceThread
                key={turn.id}
                onBusyChange={handleScriptedTurnBusyChange}
                onContentChange={handleThreadContentChange}
                onPromptSelect={handleSelfInitiatedPromptSelect}
                prompt={turn.prompt}
                stopSignal={stopSignal}
                turnId={turn.id}
              />
            );
          }

          if (turn.view === "next-focus") {
            return (
              <SelfInitiatedNextFocusThread
                key={turn.id}
                onBusyChange={handleScriptedTurnBusyChange}
                onContentChange={handleThreadContentChange}
                prompt={turn.prompt}
                stopSignal={stopSignal}
                turnId={turn.id}
              />
            );
          }

          if (turn.view === "page-engagement") {
            return (
              <SelfInitiatedPageEngagementThread
                key={turn.id}
                onBusyChange={handleScriptedTurnBusyChange}
                onContentChange={handleThreadContentChange}
                prompt={turn.prompt}
                stopSignal={stopSignal}
                turnId={turn.id}
              />
            );
          }

          if (turn.view === "custom-button-clicks") {
            return (
              <SelfInitiatedCustomButtonClicksThread
                key={turn.id}
                onBusyChange={handleScriptedTurnBusyChange}
                onContentChange={handleThreadContentChange}
                prompt={turn.prompt}
                stopSignal={stopSignal}
                turnId={turn.id}
              />
            );
          }

          if (turn.view === "post-impressions") {
            return (
              <SelfInitiatedPostImpressionsThread
                key={turn.id}
                onBusyChange={handleScriptedTurnBusyChange}
                onContentChange={handleThreadContentChange}
                onViewBoostPost={handleOpenBoostPostSidePanel}
                prompt={turn.prompt}
                stopSignal={stopSignal}
                turnId={turn.id}
              />
            );
          }

          if (turn.view === "relevant-visitors") {
            return (
              <SelfInitiatedRelevantVisitorsThread
                key={turn.id}
                onBusyChange={handleScriptedTurnBusyChange}
                onContentChange={handleThreadContentChange}
                prompt={turn.prompt}
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
              prompt={turn.prompt}
              stopSignal={stopSignal}
              turnId={turn.id}
            />
          );
        })}

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
  );

  return (
    <ChatPanel
      aria-label="Assistant"
      className="!h-full !w-full !rounded-none shadow-raised-faint md:!h-full md:!w-full md:!rounded-sm"
      id={panelId}
      variant={variant}
    >
      <ChatHeader
        actionSize={headerActionSize}
        centerContent={
          isStartSurfaceVisible ? undefined : <PcpAdminGoldAiMark />
        }
        onClose={onClose}
        onVariantToggle={onVariantToggle}
        showAiMark={false}
        transparent={isStartSurfaceVisible}
        variant={variant}
      />
      {isStartSurfaceVisible ? (
        <AdminAssistantStartSurface
          draft={draft}
          onDraftChange={onDraftChange}
          onPromptSelect={handleSelfInitiatedViewSelect}
          onSend={handleComposerSend}
        />
      ) : isBoostPostSidePanelOpen ? (
        <ChatSidePanelLayout
          chatBodyRef={chatBodyRef}
          history={thread}
          onChatBodyScroll={handleLatestScroll}
          onJumpToLatest={scrollToLatest}
          showJumpToLatest={hasLatestBelow}
          sidePanel={
            <AdminBoostPostSidePanel onBack={handleCloseBoostPostSidePanel} />
          }
          variant={variant}
        />
      ) : (
        <>
          <ChatBody
            ref={chatBodyRef}
            onJumpToLatest={scrollToLatest}
            onScroll={handleLatestScroll}
            showJumpToLatest={hasLatestBelow}
          >
            {thread}
          </ChatBody>
          <ChatComposer
            inputProps={{
              "aria-label": "Message Page assistant",
              onChange: onDraftChange,
              placeholder: "Send message",
              disabled: isAssistantBusy,
              value: draft,
            }}
            isResponding={isAssistantBusy}
            onSend={handleComposerSend}
            onStopResponse={handleStopAssistantResponse}
            sendDisabled={isAssistantBusy}
            showAttachAction={false}
            showDictationAction={false}
            showTopDivider
            showVoiceMode={false}
            variant="collapsed"
          />
        </>
      )}
    </ChatPanel>
  );
}

function AdminAssistantStartSurface({
  draft,
  onDraftChange,
  onPromptSelect,
  onSend,
}: Readonly<{
  draft: string;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onPromptSelect: (view: AdminUc5SelfInitiatedView) => void;
  onSend: () => void;
}>) {
  return (
    <section className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-lg pb-[120px] pt-xxl md:px-xxl">
      <div className="flex w-full flex-col items-center">
        <PcpAdminGoldAiMark className="size-14" />
        <h2 className="mt-lg text-heading-lg text-text">Page assistant</h2>
        <div className="mt-xl w-full max-w-[var(--design-layout-panel-content-max)]">
          <ChatComposer
            className="!min-h-0 !border-t-0 !px-0 !pb-0 !pt-0 md:!px-0 md:!pb-0 md:!pt-0"
            inputProps={{
              "aria-label": "Ask Page assistant",
              onChange: onDraftChange,
              placeholder: "Ask a question...",
              value: draft,
            }}
            onSend={onSend}
            showAttachAction={false}
            showDictationAction={false}
            showVoiceMode={false}
            variant="collapsed"
          />
        </div>
        <div className="mt-xl flex w-full max-w-[var(--design-layout-panel-content-max)] flex-col items-start gap-sm">
          {ADMIN_UC5_SELF_INITIATED_PROMPTS.map((item) => (
            <Prompt
              className="w-fit max-w-full self-start"
              key={item.id}
              onPromptSelect={() => onPromptSelect(item.id)}
              prompt={item.prompt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminBoostPostSidePanel({ onBack }: Readonly<{ onBack: () => void }>) {
  return (
    <ChatSidePanel
      className="bg-background [&_.chat-side-panel-x]:!bg-background"
      contentClassName="mx-auto w-full max-w-[760px] pb-xl"
      onBack={onBack}
    >
      <article className="text-text">
        <Image
          alt="Open enrollment customer story post preview"
          className="aspect-[16/7] w-full object-cover"
          height={332}
          src={assetSrc(ADMIN_BOOST_POST_IMAGE)}
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
            src={pcpCompanyProfile.logoSrc}
            style={VELORA_LOGO_TILE_BACKGROUND_STYLE}
          />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-heading-sm text-text">
              {pcpCompanyProfile.name}
            </h2>
            <p className="text-body-sm text-text">
              {pcpCompanyProfile.followers}
            </p>
          </div>
        </div>

        <p className="mt-xl text-body-sm text-text-meta">June 8, 2026</p>

        <div className="mt-xl space-y-md text-body-sm-open text-text">
          <p>
            Open enrollment gets complicated when eligibility cleanup, carrier
            file readiness, and employee communications are tracked in different
            places.
          </p>
          <p>
            Arbor Retail Group used Velora to coordinate plan-change readiness
            across HR, benefits operations, and carrier partners before
            enrollment opened.
          </p>
          <p>
            With one shared workflow, the team could see which files were ready,
            which employee groups needed follow-up, and where communications
            were at risk of slipping.
          </p>
          <p>
            For benefits teams planning open enrollment, the takeaway is simple:
            confirm the operational handoffs before deadline pressure starts.
          </p>
        </div>

        <PostSidePanelEngagementSummary
          comments="146 comments"
          reactions="1,240"
          reposts="64 reposts"
        />

        <footer className="mt-xxl flex flex-wrap justify-end gap-sm border-t border-border-faint pt-lg">
          <Button
            className="px-pill-padding-inline"
            size="medium"
            variant="primary"
          >
            Boost post
          </Button>
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

function SelfInitiatedPerformanceThread({
  onBusyChange,
  onContentChange,
  onPromptSelect,
  prompt,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onPromptSelect: (prompt: string) => void;
  prompt: string;
  stopSignal?: number;
  turnId: string;
}>) {
  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "content-metrics",
            children: (
              <ResponseMetric
                title="Content engagement"
                items={[
                  {
                    value: "64,800",
                    label: "Impressions",
                    delta: "18.4%",
                    deltaContext: "this month",
                    tone: "positive",
                  },
                  {
                    value: "3,420",
                    label: "Reactions",
                    delta: "12.7%",
                    deltaContext: "this month",
                    tone: "positive",
                  },
                  {
                    value: "640",
                    label: "Comments",
                    delta: "9.3%",
                    deltaContext: "this month",
                    tone: "positive",
                  },
                ]}
              />
            ),
          },
          {
            id: "follower-growth-comparison",
            children: (
              <ResponseCompare
                dimension="New followers in the last 30 days"
                rows={[
                  {
                    name: pcpCompetitorNames[0],
                    value: 1280,
                    valueLabel: "1,280",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                  {
                    name: pcpCompetitorNames[1],
                    value: 940,
                    valueLabel: "940",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                  {
                    name: pcpCompanyProfile.name,
                    value: 420,
                    valueLabel: "420",
                    isYou: true,
                    visual: {
                      kind: "company-logo",
                      src: pcpCompanyProfile.logoSrc,
                    },
                  },
                ]}
                title="Follower growth gap"
              />
            ),
          },
          {
            id: "chips",
            children: (
              <ResponseChips
                onPromptSelect={onPromptSelect}
                prompts={[
                  ADMIN_NEXT_FOCUS_PROMPT,
                  ADMIN_VISITOR_AUDIENCE_PROMPT,
                ]}
              />
            ),
          },
        ]}
        id={`${turnId}-performance-summary`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        renderText={({ streamStatus, text }) => (
          <PagePerformanceResponseText
            isStreaming={streamStatus === "streaming"}
            text={text}
          />
        )}
        stopSignal={stopSignal}
        text={ADMIN_PAGE_PERFORMANCE_RESPONSE_TEXT}
      />
    </>
  );
}

function SelfInitiatedNextFocusThread({
  onBusyChange,
  onContentChange,
  prompt,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  prompt: string;
  stopSignal?: number;
  turnId: string;
}>) {
  const [showDraftPost, setShowDraftPost] = useState(false);

  function handlePromptSelect(prompt: string) {
    if (prompt === ADMIN_NEXT_FOCUS_DRAFT_PROMPT) {
      setShowDraftPost(true);
    }
  }

  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "posting-cadence",
            children: (
              <ResponseCompare
                dimension="Posts in the last 30 days"
                rows={[
                  {
                    name: pcpCompetitorNames[0],
                    value: 22,
                    valueLabel: "22",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                  {
                    name: pcpCompetitorNames[1],
                    value: 18,
                    valueLabel: "18",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                  {
                    name: pcpCompanyProfile.name,
                    value: 12,
                    valueLabel: "12",
                    isYou: true,
                    visual: {
                      kind: "company-logo",
                      src: pcpCompanyProfile.logoSrc,
                    },
                  },
                ]}
                title="Posting cadence"
              />
            ),
          },
          {
            id: "competitor-post-example",
            children: (
              <ResponsePostCard
                actions={[
                  {
                    label: "View post",
                    variant: "secondary",
                  },
                ]}
                authorName={pcpCompetitorNames[0]}
                comments="640 comments"
                followerCount="128K followers"
                imageAlt="Open enrollment planning post preview"
                imageSrc={assetSrc("member/post-image-2.png")}
                linkMeta="Checklist - 8 min read"
                linkTitle="5 things benefits teams should lock down before enrollment opens"
                reactions="8,420"
                reposts="218 reposts"
                snippet="Open enrollment gets easier when carrier file readiness, eligibility cleanup, and employee communications are checked before October."
                timestamp="1w"
              />
            ),
          },
          ...(!showDraftPost
            ? [
                {
                  id: "next-focus-follow-up",
                  children: (
                    <ResponseChips
                      onPromptSelect={handlePromptSelect}
                      prompts={[
                        {
                          label: ADMIN_NEXT_FOCUS_DRAFT_PROMPT,
                          leadingIcon: "signal-ai",
                        },
                      ]}
                    />
                  ),
                },
              ]
            : []),
        ]}
        id={`${turnId}-next-focus`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        renderText={({ streamStatus, text }) => (
          <NextFocusResponseText
            isStreaming={streamStatus === "streaming"}
            text={text}
          />
        )}
        stopSignal={stopSignal}
        text={ADMIN_NEXT_FOCUS_RESPONSE_TEXT}
      />
      {showDraftPost ? (
        <>
          <ChatMessage role="user">{ADMIN_NEXT_FOCUS_DRAFT_PROMPT}</ChatMessage>
          <ScriptedResponseTurn
            attachments={[
              {
                id: "next-focus-draft-post",
                children: (
                  <ResponseText className="chat-message-enter">
                    {ADMIN_NEXT_FOCUS_DRAFT_TEXT.split("\n\n").map(
                      (paragraph) => (
                        <p className="mb-sm last:mb-0" key={paragraph}>
                          {paragraph}
                        </p>
                      ),
                    )}
                  </ResponseText>
                ),
              },
            ]}
            id={`${turnId}-next-focus-draft`}
            onBusyChange={onBusyChange}
            onContentChange={onContentChange}
            stopSignal={stopSignal}
            text="Here's a concise draft based on that direction."
          />
        </>
      ) : null}
    </>
  );
}

function SelfInitiatedRelevantVisitorsThread({
  onBusyChange,
  onContentChange,
  prompt,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  prompt: string;
  stopSignal?: number;
  turnId: string;
}>) {
  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "relevant-visitors",
            children: <RelevantVisitorsResponse />,
          },
        ]}
        id={`${turnId}-relevant-visitors`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        renderText={({ streamStatus, text }) => (
          <RelevantVisitorsResponseText
            isStreaming={streamStatus === "streaming"}
            text={text}
          />
        )}
        stopSignal={stopSignal}
        text={ADMIN_RELEVANT_VISITORS_RESPONSE_TEXT}
      />
    </>
  );
}

function SelfInitiatedVisitorAudienceThread({
  onBusyChange,
  onContentChange,
  prompt,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  prompt: string;
  stopSignal?: number;
  turnId: string;
}>) {
  const [selectedFollowUpPrompt, setSelectedFollowUpPrompt] = useState<
    string | null
  >(null);

  function handleFollowUpPromptSelect(prompt: string) {
    setSelectedFollowUpPrompt(prompt);
  }

  const showRelevantVisitors =
    selectedFollowUpPrompt === VISITOR_AUDIENCE_RELEVANT_VISITORS_PROMPT;
  const showReachMore =
    selectedFollowUpPrompt === VISITOR_AUDIENCE_REACH_MORE_PROMPT;

  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "visitor-audience",
            children: <VisitorAudienceFitResponse />,
          },
          ...(selectedFollowUpPrompt
            ? []
            : [
                {
                  id: "visitor-audience-follow-ups",
                  children: (
                    <ResponseChips
                      onPromptSelect={handleFollowUpPromptSelect}
                      prompts={[
                        VISITOR_AUDIENCE_RELEVANT_VISITORS_PROMPT,
                        VISITOR_AUDIENCE_REACH_MORE_PROMPT,
                      ]}
                    />
                  ),
                },
              ]),
        ]}
        id={`${turnId}-visitor-audience`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        renderText={({ streamStatus, text }) => (
          <VisitorAudienceResponseText
            isStreaming={streamStatus === "streaming"}
            text={text}
          />
        )}
        stopSignal={stopSignal}
        text={VISITOR_AUDIENCE_RESPONSE_TEXT}
      />
      {showRelevantVisitors ? (
        <>
          <ChatMessage role="user">
            {VISITOR_AUDIENCE_RELEVANT_VISITORS_PROMPT}
          </ChatMessage>
          <ScriptedResponseTurn
            attachments={[
              {
                id: "visitor-rail",
                children: <RelevantVisitorsResponse />,
              },
            ]}
            id={`${turnId}-relevant-visitors`}
            onBusyChange={onBusyChange}
            onContentChange={onContentChange}
            stopSignal={stopSignal}
            text={VISITOR_AUDIENCE_RELEVANT_VISITORS_RESPONSE_TEXT}
          />
        </>
      ) : null}
      {showReachMore ? (
        <>
          <ChatMessage role="user">
            {VISITOR_AUDIENCE_REACH_MORE_PROMPT}
          </ChatMessage>
          <ScriptedResponseTurn
            id={`${turnId}-reach-more-visitors`}
            onBusyChange={onBusyChange}
            onContentChange={onContentChange}
            stopSignal={stopSignal}
            text={VISITOR_AUDIENCE_REACH_MORE_RESPONSE_TEXT}
          />
        </>
      ) : null}
    </>
  );
}

function InlineStreamingText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return isStreaming ? <ResponseStreamingText text={text} /> : <>{text}</>;
}

function EmphasizedStreamingText({
  highlights = VISITOR_AUDIENCE_RESPONSE_HIGHLIGHTS,
  isStreaming,
  text,
}: Readonly<{
  highlights?: ReadonlyArray<string>;
  isStreaming: boolean;
  text: string;
}>) {
  const pieces: Array<Readonly<{ text: string; highlight: boolean }>> = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    const nextMatch = highlights.reduce<{
      phrase: string;
      index: number;
    } | null>((currentMatch, phrase) => {
      const index = remainingText.indexOf(phrase);

      if (index === -1) {
        return currentMatch;
      }

      if (
        currentMatch === null ||
        index < currentMatch.index ||
        (index === currentMatch.index &&
          phrase.length > currentMatch.phrase.length)
      ) {
        return { phrase, index };
      }

      return currentMatch;
    }, null);

    if (!nextMatch) {
      pieces.push({ text: remainingText, highlight: false });
      break;
    }

    if (nextMatch.index > 0) {
      pieces.push({
        text: remainingText.slice(0, nextMatch.index),
        highlight: false,
      });
    }

    pieces.push({ text: nextMatch.phrase, highlight: true });
    remainingText = remainingText.slice(
      nextMatch.index + nextMatch.phrase.length,
    );
  }

  return (
    <>
      {pieces.map((piece, index) =>
        piece.highlight ? (
          <strong className="font-semibold text-text" key={index}>
            <InlineStreamingText isStreaming={isStreaming} text={piece.text} />
          </strong>
        ) : (
          <InlineStreamingText
            isStreaming={isStreaming}
            key={index}
            text={piece.text}
          />
        ),
      )}
    </>
  );
}

function FormattedInsightResponseText({
  emphasizeOpening = true,
  highlights,
  isStreaming,
  text,
}: Readonly<{
  emphasizeOpening?: boolean;
  highlights: ReadonlyArray<string>;
  isStreaming: boolean;
  text: string;
}>) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <ResponseText className="chat-message-enter">
      {blocks.map((block, index) => (
        <p
          className={cx(
            emphasizeOpening && index === 0 && "font-semibold",
            index > 0 && "mt-md",
          )}
          key={index}
        >
          <EmphasizedStreamingText
            highlights={highlights}
            isStreaming={isStreaming}
            text={block}
          />
        </p>
      ))}
    </ResponseText>
  );
}

function VisitorAudienceResponseText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return (
    <FormattedInsightResponseText
      highlights={VISITOR_AUDIENCE_RESPONSE_HIGHLIGHTS}
      isStreaming={isStreaming}
      text={text}
    />
  );
}

function RelevantVisitorsResponseText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return (
    <FormattedInsightResponseText
      emphasizeOpening={false}
      highlights={ADMIN_RELEVANT_VISITORS_RESPONSE_HIGHLIGHTS}
      isStreaming={isStreaming}
      text={text}
    />
  );
}

function PagePerformanceResponseText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return (
    <FormattedInsightResponseText
      highlights={ADMIN_PAGE_PERFORMANCE_RESPONSE_HIGHLIGHTS}
      isStreaming={isStreaming}
      text={text}
    />
  );
}

function NextFocusResponseText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return (
    <FormattedInsightResponseText
      highlights={ADMIN_NEXT_FOCUS_RESPONSE_HIGHLIGHTS}
      isStreaming={isStreaming}
      text={text}
    />
  );
}

function CustomButtonClicksResponseText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return (
    <FormattedInsightResponseText
      highlights={ADMIN_CUSTOM_BUTTON_CLICKS_RESPONSE_HIGHLIGHTS}
      isStreaming={isStreaming}
      text={text}
    />
  );
}

function PostImpressionsResponseText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  return (
    <FormattedInsightResponseText
      highlights={ADMIN_POST_IMPRESSIONS_RESPONSE_HIGHLIGHTS}
      isStreaming={isStreaming}
      text={text}
    />
  );
}

function getPageEngagementBlockType(block: string) {
  const trimmedBlock = block.trim();

  if (
    ADMIN_PAGE_ENGAGEMENT_SECTION_TITLES.some((sectionTitle) =>
      sectionTitle.startsWith(trimmedBlock),
    )
  ) {
    return "heading";
  }

  if (ADMIN_PAGE_ENGAGEMENT_FINAL_PROMPT_TEXT.startsWith(trimmedBlock)) {
    return "final";
  }

  return "paragraph";
}

function PageEngagementIntroText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  const linkStartIndex = text.indexOf(ADMIN_PAGE_ENGAGEMENT_GUIDE_LINK_TEXT);

  if (linkStartIndex === -1) {
    return <InlineStreamingText isStreaming={isStreaming} text={text} />;
  }

  const beforeLink = text.slice(0, linkStartIndex);
  const afterLink = text.slice(
    linkStartIndex + ADMIN_PAGE_ENGAGEMENT_GUIDE_LINK_TEXT.length,
  );

  return (
    <>
      <InlineStreamingText isStreaming={isStreaming} text={beforeLink} />
      <a
        className="font-semibold text-action hover:underline"
        href="#page-growth-guide"
      >
        {ADMIN_PAGE_ENGAGEMENT_GUIDE_LINK_TEXT}
      </a>
      <InlineStreamingText isStreaming={isStreaming} text={afterLink} />
    </>
  );
}

function PageEngagementResponseText({
  isStreaming,
  text,
}: Readonly<{
  isStreaming: boolean;
  text: string;
}>) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <ResponseText className="chat-message-enter">
      {blocks.map((block, index) => {
        const blockType = getPageEngagementBlockType(block);
        const previousBlock = blocks[index - 1] ?? "";
        const previousBlockType = previousBlock
          ? getPageEngagementBlockType(previousBlock)
          : null;

        if (blockType === "heading") {
          return (
            <h3 className="mt-md text-control-sm text-text" key={index}>
              <InlineStreamingText isStreaming={isStreaming} text={block} />
            </h3>
          );
        }

        return (
          <p
            className={cx(
              index > 0 &&
                (previousBlockType === "heading" ? "mt-xxs" : "mt-md"),
            )}
            key={index}
          >
            {index === 0 ? (
              <PageEngagementIntroText
                isStreaming={isStreaming}
                text={block}
              />
            ) : (
              <InlineStreamingText isStreaming={isStreaming} text={block} />
            )}
          </p>
        );
      })}
    </ResponseText>
  );
}

function SelfInitiatedPageEngagementThread({
  onBusyChange,
  onContentChange,
  prompt,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  prompt: string;
  stopSignal?: number;
  turnId: string;
}>) {
  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "draft-post-prompt",
            children: <ResponseChips prompts={["Draft post"]} />,
          },
        ]}
        id={`${turnId}-page-engagement`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        renderText={({ streamStatus, text }) => (
          <PageEngagementResponseText
            isStreaming={streamStatus === "streaming"}
            text={text}
          />
        )}
        stopSignal={stopSignal}
        text={ADMIN_PAGE_ENGAGEMENT_RESPONSE_TEXT}
      />
    </>
  );
}

function SelfInitiatedCustomButtonClicksThread({
  onBusyChange,
  onContentChange,
  prompt,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  prompt: string;
  stopSignal?: number;
  turnId: string;
}>) {
  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "custom-button-conversion",
            children: (
              <ResponseConversionPath
                context="This month"
                steps={[
                  {
                    label: "Page views",
                    value: "8,740",
                    delta: "28%",
                    deltaContext: "this month",
                    tone: "positive",
                  },
                  {
                    label: "Unique visitors",
                    value: "3,180",
                    delta: "20.2%",
                    deltaContext: "this month",
                    tone: "negative",
                  },
                  {
                    label: "Custom button clicks",
                    value: "126",
                    delta: "33%",
                    deltaContext: "this month",
                    tone: "negative",
                  },
                ]}
                summaryLabel="visitor-to-button click rate"
                summaryValue="4%"
                title="Button conversion path"
              />
            ),
          },
        ]}
        id={`${turnId}-custom-button-clicks`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        renderText={({ streamStatus, text }) => (
          <CustomButtonClicksResponseText
            isStreaming={streamStatus === "streaming"}
            text={text}
          />
        )}
        stopSignal={stopSignal}
        text={ADMIN_CUSTOM_BUTTON_CLICKS_RESPONSE_TEXT}
      />
    </>
  );
}

function SelfInitiatedPostImpressionsThread({
  onBusyChange,
  onContentChange,
  onViewBoostPost,
  prompt,
  stopSignal,
  turnId,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onViewBoostPost: () => void;
  prompt: string;
  stopSignal?: number;
  turnId: string;
}>) {
  const [showBoostRecommendation, setShowBoostRecommendation] = useState(false);

  function handlePromptSelect(prompt: string) {
    if (prompt === ADMIN_POST_IMPRESSIONS_BOOST_PROMPT) {
      setShowBoostRecommendation(true);
    }
  }

  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "post-impressions-trend",
            children: (
              <ResponseMetricWithTrend
                annotation={{
                  label: "",
                  tone: "neutral",
                }}
                axisTicks={postImpressionsAxisTicks}
                delta="18.4%"
                deltaContext="vs last month"
                title="Post impressions"
                tone="negative"
                unit="impressions this month"
                value="64,800"
                values={postImpressionsValues}
              />
            ),
          },
          ...(!showBoostRecommendation
            ? [
                {
                  id: "post-impressions-follow-up",
                  children: (
                    <ResponseChips
                      onPromptSelect={handlePromptSelect}
                      prompts={[
                        {
                          label: ADMIN_POST_IMPRESSIONS_BOOST_PROMPT,
                        },
                      ]}
                    />
                  ),
                },
              ]
            : []),
        ]}
        id={`${turnId}-post-impressions`}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        renderText={({ streamStatus, text }) => (
          <PostImpressionsResponseText
            isStreaming={streamStatus === "streaming"}
            text={text}
          />
        )}
        stopSignal={stopSignal}
        text={ADMIN_POST_IMPRESSIONS_RESPONSE_TEXT}
      />
      {showBoostRecommendation ? (
        <>
          <ChatMessage role="user">
            {ADMIN_POST_IMPRESSIONS_BOOST_PROMPT}
          </ChatMessage>
          <ScriptedResponseTurn
            attachments={[
              {
                id: "boost-recommendation-post",
                children: (
                  <ResponsePostCard
                    actions={[
                      {
                        label: "Boost post",
                        variant: "primary",
                      },
                      {
                        label: "View post",
                        onSelect: onViewBoostPost,
                        variant: "secondary",
                      },
                    ]}
                    authorLogoSrc={pcpCompanyProfile.logoSrc}
                    authorName={pcpCompanyProfile.name}
                    comments="146 comments"
                    followerCount="86K followers"
                    imageAlt="Open enrollment customer story post preview"
                    imageSrc={assetSrc(ADMIN_BOOST_POST_IMAGE)}
                    linkMeta="Customer story - 6 min read"
                    linkTitle={pcpProofSnippets.postTitle}
                    reactions="1,240"
                    reposts="64 reposts"
                    snippet="How Arbor prepared 12,000 employees for open enrollment by coordinating eligibility cleanup, carrier file readiness, and employee communications in one workflow."
                    timestamp="6/8"
                  />
                ),
              },
            ]}
            id={`${turnId}-post-impressions-boost`}
            onBusyChange={onBusyChange}
            onContentChange={onContentChange}
            stopSignal={stopSignal}
            text={ADMIN_POST_IMPRESSIONS_BOOST_RESPONSE_TEXT}
          />
        </>
      ) : null}
    </>
  );
}

function ActiveInsightThread({
  insight,
  onBusyChange,
  onContentChange,
  onFollowUpSelect,
  prompt,
  stopSignal,
}: Readonly<{
  insight: AdminUc5Insight;
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
  prompt: string;
  stopSignal?: number;
}>) {
  if (insight.id === "follower-growth") {
    return (
      <Story1aFollowerGrowthThread
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        prompt={prompt}
        stopSignal={stopSignal}
      />
    );
  }

  if (insight.id === "competitor-growth") {
    return (
      <CompetitorGrowthThread
        insight={insight}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        onFollowUpSelect={onFollowUpSelect}
        prompt={prompt}
        stopSignal={stopSignal}
      />
    );
  }

  if (insight.id === "content-engagement") {
    return (
      <ContentResonanceThread
        insight={insight}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        onFollowUpSelect={onFollowUpSelect}
        prompt={prompt}
        stopSignal={stopSignal}
      />
    );
  }

  if (insight.id === "visitor-demographics") {
    return (
      <VisitorAudienceFitThread
        insight={insight}
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        onFollowUpSelect={onFollowUpSelect}
        prompt={prompt}
        stopSignal={stopSignal}
      />
    );
  }

  const followUps = insight.followUps.filter((followUp) => !followUp.primary);

  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
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
    return "The people finding Velora look close to your target audience: Human Resources visitors at Director+ seniority, especially from Insurance, Hospital & Health Care, and large enterprise companies.";
  }

  if (insightId === "content-engagement") {
    return "Your strongest engagement is clustering around carrier coordination and eligibility cleanup content.";
  }

  if (insightId === "weekly-synthesis") {
    return adminUc5SynthesisRecommendation;
  }

  return adminUc5Insights[insightId].value;
}

type Story1aBlockTurn = "compare" | "draft";

const STORY_1A_COMPARE_PROMPT = "How do my competitors compare?";
const STORY_1A_DRAFT_POST_PROMPT = "Draft post";
const story1aDraftPost = `Carrier readiness can make or break open enrollment.

Before enrollment opens, HR and benefits teams should know which carrier files are ready, which eligibility issues need cleanup, and where employee communications might get delayed.

Velora helps teams catch those gaps earlier, so open enrollment feels less reactive and more coordinated.`;
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
const postImpressionsAxisTicks = ["May 10", "May 25", "Jun 8"] as const;
const postImpressionsValues = [
  82,
  86,
  81,
  78,
  74,
  70,
  68,
  64,
] as const;
const contentResonanceItems = [
  {
    title: pcpProofSnippets.postTitle,
    thumbnailSrc: assetSrc("member/post-image-1.png"),
    thumbnailAlt: "Carrier coordination post preview",
    metrics: [
      { label: "Engagement rate", value: "8.2%" },
      { label: "Impressions", value: "18.4K" },
    ],
  },
  {
    title: "Carrier file readiness checklist for open enrollment",
    thumbnailSrc: assetSrc("member/post-image-2.png"),
    thumbnailAlt: "Open enrollment checklist post preview",
    metrics: [
      { label: "Engagement rate", value: "7.1%" },
      { label: "Impressions", value: "14.2K" },
    ],
  },
] as const;
const visitorAudienceFitSegments = [
  {
    dimension: "Job function",
    label: "38% Human Resources visitors",
  },
  {
    dimension: "Seniority",
    label: "34% Director+ visitors",
  },
  {
    dimension: "Company size",
    label: "44% from 10,001+ employee companies",
  },
] as const;

const visitorAudienceCards = [
  {
    name: pcpVisitorPersona.name,
    headline: `${pcpVisitorPersona.title} · ${pcpVisitorPersona.company}`,
    avatarSrc: assetSrc(CHERI_SPARKS_AVATAR),
    tag: "Returned this week",
  },
  {
    name: "Priya Shah",
    headline: "Director of Benefits · Calico Health Network",
    avatarSrc: assetSrc("avatar-3.png"),
    tag: "Viewed multiple posts",
  },
  {
    name: "Dana Kim",
    headline: "VP People Operations · Arbor Retail Group",
    avatarSrc: assetSrc("avatar-2.png"),
    tag: "Recent visitor",
  },
  {
    name: "Morgan Lee",
    headline: "Director of Human Resources · Meridian Logistics",
    avatarSrc: assetSrc("avatar-1.png"),
    tag: "Visited twice",
  },
] as const;

function Story1aFollowerGrowthThread({
  onBusyChange,
  onContentChange,
  prompt,
  stopSignal,
}: Readonly<{
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  prompt: string;
  stopSignal?: number;
  }>) {
  const [visibleTurns, setVisibleTurns] = useState<
    ReadonlyArray<Story1aBlockTurn>
  >([]);
  const hasCompareTurn = visibleTurns.includes("compare");
  const hasDraftTurn = visibleTurns.includes("draft");

  function showTurn(turn: Story1aBlockTurn) {
    setVisibleTurns((currentTurns) =>
      currentTurns.includes(turn) ? currentTurns : [...currentTurns, turn],
    );
  }

  function handlePromptSelect(prompt: string) {
    if (prompt === STORY_1A_COMPARE_PROMPT) {
      showTurn("compare");
    }

    if (prompt === STORY_1A_DRAFT_POST_PROMPT) {
      showTurn("draft");
    }
  }

  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
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
                  label: "",
                  tone: "negative",
                }}
                title="Follower growth"
                tone="negative"
                unit="new followers this month"
                value="+420"
                values={story1aFollowerGrowthValues}
              />
            ),
          },
          {
            id: "recommendations",
            children: (
              <ResponseText className="chat-message-enter">
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
                  ]}
                />
                <p className="mt-sm">
                  I can help you draft a new post if you&apos;d like.
                </p>
              </ResponseText>
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
                        {
                          label: STORY_1A_DRAFT_POST_PROMPT,
                          leadingIcon: "signal-ai",
                        },
                        STORY_1A_COMPARE_PROMPT,
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
        <>
          <ChatMessage role="user">{STORY_1A_COMPARE_PROMPT}</ChatMessage>
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
                        name: pcpCompetitorNames[0],
                        value: 24,
                        valueLabel: "+24%",
                        visual: {
                          kind: "company-logo",
                        },
                      },
                      {
                        name: pcpCompetitorNames[1],
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
            ]}
            id="story-1a-compare"
            onBusyChange={onBusyChange}
            onContentChange={onContentChange}
            stopSignal={stopSignal}
            text={`Compared with similar benefits platforms, Velora is losing follower momentum while ${pcpCompetitorNames[0]} and ${pcpCompetitorNames[1]} are still growing.`}
          />
        </>
      ) : null}

      {hasDraftTurn ? (
        <>
          <ChatMessage role="user">{STORY_1A_DRAFT_POST_PROMPT}</ChatMessage>
          <ScriptedResponseTurn
            attachments={[
              {
                id: "draft-post-text",
                children: (
                  <ResponseText className="chat-message-enter">
                    {story1aDraftPost.split("\n\n").map((paragraph) => (
                      <p className="mb-sm last:mb-0" key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </ResponseText>
                ),
              },
            ]}
            id="story-1a-draft-post"
            onBusyChange={onBusyChange}
            onContentChange={onContentChange}
            stopSignal={stopSignal}
            text="Here is a concise post draft based on the recovery plan."
          />
        </>
      ) : null}
    </>
  );
}

function CompetitorGrowthThread({
  insight,
  onBusyChange,
  onContentChange,
  onFollowUpSelect,
  prompt,
  stopSignal,
}: Readonly<{
  insight: AdminUc5Insight;
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
  prompt: string;
  stopSignal?: number;
}>) {
  const followUps = insight.followUps.filter((followUp) => !followUp.primary);

  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "compare",
            children: (
              <ResponseCompare
                dimension="New followers this month"
                rows={[
                  {
                    name: pcpCompetitorNames[0],
                    value: 1280,
                    valueLabel: "+1,280",
                    detail: "22 posts",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                  {
                    name: pcpCompetitorNames[1],
                    value: 940,
                    valueLabel: "+940",
                    detail: "18 posts",
                    visual: {
                      kind: "company-logo",
                    },
                  },
                  {
                    name: pcpCompanyProfile.name,
                    value: 420,
                    valueLabel: "+420",
                    detail: "12 posts",
                    isYou: true,
                    visual: {
                      kind: "company-logo",
                      src: pcpCompanyProfile.logoSrc,
                    },
                  },
                ]}
                title="Follower growth gap"
              />
            ),
          },
          {
            id: "recommendation-text",
            children: (
              <ResponseText className="chat-message-enter">
                <p>Here&apos;s what I&apos;d do next:</p>
                <ul className="mt-md list-disc space-y-sm pl-xl">
                  <li>
                    <strong className="font-semibold text-text">
                      Publish one deadline-driven checklist.
                    </strong>{" "}
                    Use a practical open enrollment or carrier-readiness angle
                    while the topic is already earning competitor attention.
                  </li>
                  <li>
                    <strong className="font-semibold text-text">
                      Pair it with Velora proof.
                    </strong>{" "}
                    Follow with the Arbor Retail Group story so the response is
                    specific to Velora, not just a copy of the competitor format.
                  </li>
                </ul>
              </ResponseText>
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
        id="competitor-growth-insight"
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
        text={`${pcpCompetitorNames[0]} is gaining faster because they paired higher posting cadence with short, checklist-style open enrollment content. The gap is less about brand size and more about repeating practical topics HR leaders are already engaging with.`}
      />
    </>
  );
}

function ContentResonanceThread({
  insight,
  onBusyChange,
  onContentChange,
  onFollowUpSelect,
  prompt,
  stopSignal,
}: Readonly<{
  insight: AdminUc5Insight;
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
  prompt: string;
  stopSignal?: number;
}>) {
  const followUps = insight.followUps.filter((followUp) => !followUp.primary);

  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "content-list",
            children: (
              <ResponseContentList
                items={contentResonanceItems}
                title="Posts"
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
        id="content-resonance-insight"
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        stopSignal={stopSignal}
        text="Your strongest engagement is clustering around operational benefits topics, especially carrier coordination and eligibility cleanup. The Arbor Retail Group post and the carrier-readiness checklist both outperformed broader Page updates, which suggests visitors are responding to concrete workflow pain points."
      />
    </>
  );
}

function VisitorAudienceFitThread({
  insight,
  onBusyChange,
  onContentChange,
  onFollowUpSelect,
  prompt,
  stopSignal,
}: Readonly<{
  insight: AdminUc5Insight;
  onBusyChange?: (id: string, isBusy: boolean) => void;
  onContentChange?: () => void;
  onFollowUpSelect: (followUp: AdminUc5FollowUp) => void;
  prompt: string;
  stopSignal?: number;
}>) {
  const followUps = insight.followUps.filter((followUp) => !followUp.primary);

  return (
    <>
      <ChatMessage role="user">{prompt}</ChatMessage>
      <ScriptedResponseTurn
        attachments={[
          {
            id: "audience-fit",
            children: <VisitorAudienceFitResponse />,
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
        id="visitor-audience-fit-insight"
        onBusyChange={onBusyChange}
        onContentChange={onContentChange}
        renderText={({ streamStatus, text }) => (
          <VisitorAudienceResponseText
            isStreaming={streamStatus === "streaming"}
            text={text}
          />
        )}
        stopSignal={stopSignal}
        text={VISITOR_AUDIENCE_RESPONSE_TEXT}
      />
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
          <VisitorAudienceFitResponse />
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
            {pcpProofSnippets.postTitle}
          </h4>
          <p className="mt-xxs text-body-xs text-text-meta">2d</p>
        </div>
      </div>
      <div className="mt-lg divide-y divide-border-faint">
        <PostMetricRow label="Engagement rate" value="8.2%" />
        <PostMetricRow label="Impressions" value="18.4K" />
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

function VisitorAudienceFitResponse() {
  return (
    <ResponseAudienceFit
      actionLabel={`Go to Who's visited my page`}
      metricLabel="match your target audience"
      metricValue="64%"
      segments={visitorAudienceFitSegments}
      trendContext="last month"
      trendDelta="from 52%"
      trendTone="positive"
    />
  );
}

function RelevantVisitorsResponse() {
  return (
    <ResponseRail aria-label="Relevant visitors">
      {visitorAudienceCards.map((visitor) => (
        <ResponsePersonCard
          actionIcon={null}
          actionLabel="View profile"
          avatarSrc={visitor.avatarSrc}
          headline={visitor.headline}
          key={visitor.name}
          name={visitor.name}
          tag={visitor.tag}
          tagTone="supportive-4"
        />
      ))}
    </ResponseRail>
  );
}

export function VisitorDemographicsResponse() {
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
