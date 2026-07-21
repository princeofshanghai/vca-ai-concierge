import Image from "next/image";
import type { ReactNode } from "react";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatMessageContent,
  ChatPanel,
  ChatThread,
  Prompt,
} from "@/components/chat/chat-ui";
import { ChatSystemEvent } from "@/components/chat/live-agent-handoff";
import { HiringConfirmationEmail } from "@/components/hiring-microsite/hiring-confirmation-email";
import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { PremiumProductRecommendationCard } from "@/components/premium/premium-product-recommendation-card";
import {
  PremiumUpsellBadge,
  PremiumUpsellResultCard,
  type PremiumUpsellBadgeVariant,
} from "@/components/premium-upsell";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, iconMetadata, type IconSize } from "@/components/primitives/icon";
import {
  InlineFeedback,
  type InlineFeedbackTone,
} from "@/components/primitives/inline-feedback";
import { IdleSessionPrompt } from "@/components/primitives/idle-session-prompt";
import { InterimLoadingState } from "@/components/primitives/interim-loading-state";
import { NavLinkItemHorizontal } from "@/components/primitives/nav-link-item-horizontal";
import {
  OverlayButtonIcon,
  type OverlayButtonIconColor,
  type OverlayButtonIconSize,
} from "@/components/primitives/overlay-button-icon";
import { Pill } from "@/components/primitives/pill";
import { PresenceBadge } from "@/components/primitives/presence-badge";
import { ProgressIndicatorCircular } from "@/components/primitives/progress-indicator-circular";
import { Radio } from "@/components/primitives/radio";
import {
  isSduiReactionIconAvailable,
  SduiReactionIcon,
  sduiReactionIconSizes,
  sduiReactionIconTypes,
  type SduiReactionIconSize,
  type SduiReactionIconType,
} from "@/components/primitives/reaction-icon";
import { Tag } from "@/components/primitives/tag";
import { TabItemHorizontal } from "@/components/primitives/tab-item-horizontal";
import { TextArea } from "@/components/primitives/text-area";
import { TextInput } from "@/components/primitives/text-input";
import { AudienceFit as ResponseAudienceFit } from "@/components/premium-company-pages/response-blocks/AudienceFit";
import {
  ChatCardActions,
  ChatCardMedia,
  ChatCardShell,
  JobCard as ResponseJobCard,
  PostCard as ResponsePostCard,
  ProductCard as ResponseProductCard,
  ReactionSummary,
} from "@/components/premium-company-pages/response-blocks/ChatCards";
import { Compare as ResponseCompare } from "@/components/premium-company-pages/response-blocks/Compare";
import { ContentList as ResponseContentList } from "@/components/premium-company-pages/response-blocks/ContentList";
import { ConversionPath as ResponseConversionPath } from "@/components/premium-company-pages/response-blocks/ConversionPath";
import { Metric as ResponseMetric } from "@/components/premium-company-pages/response-blocks/Metric";
import { MetricWithTrend as ResponseMetricWithTrend } from "@/components/premium-company-pages/response-blocks/MetricWithTrend";
import { CompanyCard as ResponseCompanyCard } from "@/components/premium-company-pages/response-blocks/CompanyCard";
import { PersonCard as ResponsePersonCard } from "@/components/premium-company-pages/response-blocks/PersonCard";
import { ResponseRail } from "@/components/premium-company-pages/response-blocks/ResponseRail";
import { Trend as ResponseTrend } from "@/components/premium-company-pages/response-blocks/Trend";
import {
  pcpCompanyProfile,
  pcpCompetitorNames,
  pcpProofSnippets,
  pcpVcaScenario,
  pcpVisitorPersona,
} from "@/components/premium-company-pages/persona";

import {
  HiringMicrophoneVoiceBannerDemo,
  HiringSidePanelUsageDemo,
  PremiumFabDemo,
  PremiumFabReviewPreview,
  PremiumPlanCardDemo,
  PcpAdminInputFirstStartSurfacePreview,
  PcpInboxAiContextStripPreview,
  PcpInsightCardSystemPreview,
  PcpSidePanelUsageDemo,
  PcpTodayActionCardsPreview,
  PcpVcaSidePanelShellPreview,
  SduiBadgeDemo,
  SduiButtonDemo,
  SduiButtonIconDemo,
  SduiEntityDemo,
  SduiGhostButtonDemo,
  SduiGhostIconButtonDemo,
  SduiInlineFeedbackDemo,
  SduiNavLinkItemHorizontalDemo,
  SduiOverlayButtonIconDemo,
  SduiPillDemo,
  SduiPresenceBadgeDemo,
  SduiRadioDemo,
  SduiTagDemo,
  SduiTabItemHorizontalDemo,
  SduiTextAreaDemo,
  SduiTextInputDemo,
  SalesHandoffScenarioDemo,
  SharedActionCardDemo,
  SharedChoiceCardDemo,
  SharedComposerDemo,
  SharedComposerUsageDemo,
  SharedConfirmationDemo,
  SharedConfirmationVariants,
  SharedEndChatCsatDemo,
  SharedEndChatCsatUsageDemo,
  SharedFeedbackDemo,
  SharedFeedbackVariants,
  SharedHeaderDemo,
  SharedHeaderIdentityDemo,
  SharedHeaderPresentationDemo,
  SharedHeaderProductExample,
  SharedInlineErrorDemo,
  SharedLiveAgentHandoffDemo,
  LiveAgentHandoffUsageDemo,
  SharedMessagesDemo,
  SharedResponseStatesDemo,
  SharedPromptsDemo,
  SharedPromptsPlacementDemo,
  SharedPromptsUsageDemo,
  SharedShellDemo,
  SharedShellEntryPointBehaviorDemo,
  SharedShellExpandableBehaviorDemo,
  SharedShellHiringMicrositeDemo,
  SharedShellPremiumSurveyDemo,
  SharedSidePanelDemo,
  SharedTaskStatusCardDemo,
  SharedVoiceModeDemo,
  VcaFabPresenceBadgeExplorationPreview,
  VcaFabReviewPreview,
  VcaFabStatesPreview,
  VcaFabSwappableMarkPreview,
} from "./component-client-previews";
import type { ComponentNavItem } from "./component-nav";

const buttonStates = [
  "default",
  "hover",
  "active",
  "focus-visible",
  "disabled",
  "loading",
] as const;

const buttonRows = [
  { label: "Primary", variant: "primary" },
  { label: "Secondary", variant: "secondary" },
  { label: "Tertiary", variant: "tertiary" },
] as const;

const buttonSizes = [
  { label: "Medium", size: "medium" },
  { label: "Small", size: "small" },
] as const;

const overlayButtonIconRows = [
  { label: "Black", color: "black" },
  { label: "White", color: "white" },
] as const;

const entitySizes = [160, 128, 96, 80, 64, 48, 40, 32, 24, 16] as const;
const pillStates = ["default", "hover", "active", "focus-visible", "disabled"] as const;
const radioStates = ["default", "hover", "active", "disabled"] as const;
const textInputSizes = [
  { label: "Small", size: "small" },
  { label: "Large", size: "large" },
] as const;
const textInputStates = ["default", "hover", "active"] as const;
const ghostIconButtonStates = [
  "default",
  "hover",
  "active",
  "focus-visible",
  "disabled",
  "loading",
] as const;
const ghostButtonStates = ghostIconButtonStates;
const navigationIconMetadata = iconMetadata.filter(
  (icon) => "source" in icon && icon.source === "navigation",
);
const systemIconMetadata = iconMetadata.filter(
  (icon) => !("source" in icon) || icon.source !== "navigation",
);
type IconCatalogItem = (typeof iconMetadata)[number];
const reactionIconTypeLabels: Record<SduiReactionIconType, string> = {
  empathy: "Empathy",
  entertainment: "Entertainment",
  interest: "Interest",
  like: "Like",
  maybe: "Maybe",
  praise: "Praise",
  recommend: "Recommend",
  support: "Support",
};
const reactionIconSizeLabels: Record<SduiReactionIconSize, string> = {
  xsmall: "XSmall",
  small: "Small",
  medium: "Medium",
  large: "Large",
};
const reactionIconCatalogColumns = [
  { label: "XSmall", size: "xsmall", ring: false },
  { label: "XSmall ring", size: "xsmall", ring: true },
  { label: "Small", size: "small", ring: false },
  { label: "Small ring", size: "small", ring: true },
  { label: "Medium", size: "medium", ring: false },
  { label: "Large", size: "large", ring: false },
] as const satisfies ReadonlyArray<
  Readonly<{
    label: string;
    ring: boolean;
    size: SduiReactionIconSize;
  }>
>;
const reactionIconPlaceholderExamples = [
  { type: "interest", size: "medium", label: "Insight" },
  { type: "recommend", size: "medium", label: "Recommendation" },
  { type: "support", size: "medium", label: "Support" },
  { type: "like", size: "large", label: "High-confidence like" },
] as const satisfies ReadonlyArray<
  Readonly<{
    label: string;
    size: SduiReactionIconSize;
    type: SduiReactionIconType;
  }>
>;
const sduiIllustrationCatalog = {
  microspots: [
    {
      name: "Notepad Large",
      src: "/assets/sdui/illustrations/notepad-large.svg",
      width: 64,
      height: 64,
    },
  ],
  scenes: [
    {
      name: "Illustration",
      src: "/assets/sdui/illustrations/illustration.svg",
      width: 375,
      height: 186,
    },
  ],
} as const;
const tagSizes = [
  { label: "Small", size: "small" },
  { label: "Medium", size: "medium" },
] as const;
const tagTones = [
  { label: "Default", tone: "default" },
  { label: "Supportive 1", tone: "supportive-1" },
  { label: "Positive", tone: "positive" },
  { label: "Supportive 2", tone: "supportive-2" },
  { label: "Negative", tone: "negative" },
  { label: "Supportive 3", tone: "supportive-3" },
  { label: "Caution", tone: "caution" },
  { label: "Supportive 4", tone: "supportive-4" },
  { label: "Neutral", tone: "neutral" },
  { label: "Supportive 5", tone: "supportive-5" },
] as const;

const inlineFeedbackTones: ReadonlyArray<{
  label: string;
  tone: InlineFeedbackTone;
}> = [
  { label: "Positive", tone: "positive" },
  { label: "Negative", tone: "negative" },
  { label: "Neutral", tone: "neutral" },
  { label: "Caution", tone: "caution" },
];
const badgeExamples = [
  { label: "Alert dot", tone: "alert", size: "large", count: undefined },
  { label: "Alert counter", tone: "alert", size: "small", count: 99 },
  { label: "New dot", tone: "new", size: "small", count: undefined },
  { label: "New counter", tone: "new", size: "large", count: 99 },
] as const;
const presenceBadgeExamples = [
  { label: "Small", size: "small" },
  { label: "Medium", size: "medium" },
  { label: "Large", size: "large" },
] as const;
const progressIndicatorCircularSizes = [16, 20, 24, 32, 40, 48, 64] as const;
const premiumUpsellBadgeExamples = [
  {
    label: "Inline on light",
    variant: "inline-on-light",
    surfaceClassName: "bg-background-neutral-soft",
  },
  {
    label: "Inline on blue",
    variant: "inline-on-blue",
    surfaceClassName: "bg-[#0073B1]",
  },
  {
    label: "Outline on blue",
    variant: "outline-on-blue",
    surfaceClassName: "bg-[#0073B1]",
  },
  {
    label: "Floating",
    variant: "floating",
    surfaceClassName: "bg-background-neutral-soft",
  },
  {
    label: "Solid",
    variant: "solid",
    surfaceClassName: "bg-background-neutral-soft",
  },
  {
    label: "Solid with chip",
    variant: "solid-with-chip",
    surfaceClassName: "bg-background-neutral-soft",
  },
  {
    label: "Strong",
    variant: "strong",
    surfaceClassName: "bg-background-neutral-soft",
  },
] as const satisfies ReadonlyArray<
  Readonly<{
    label: string;
    surfaceClassName: string;
    variant: PremiumUpsellBadgeVariant;
  }>
>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PageHeader({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <header className="max-w-[48rem] space-y-sm border-b border-border-faint pb-xxxl">
      <h1 className="text-[32px] font-medium leading-10 text-text">
        {title}
      </h1>
      <p className="max-w-3xl text-[16px] leading-6 text-text-meta">
        {description}
      </p>
    </header>
  );
}

function ComponentLibraryBodyCopy({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <p
      className={[
        "text-[15px] font-normal leading-[22px] text-text",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}

function PreviewSection({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
}>) {
  return (
    <section className="space-y-12 border-t border-border-faint pt-xxxl first:border-t-0 first:pt-0">
      <div className="max-w-[48rem] space-y-sm">
        <h2 className="text-[24px] font-medium leading-[30px] text-text">
          {title}
        </h2>
        {description ? (
          <ComponentLibraryBodyCopy className="max-w-2xl">
            {description}
          </ComponentLibraryBodyCopy>
        ) : null}
      </div>
      <div className="component-library-preview overflow-x-auto pb-1">
        {children}
      </div>
    </section>
  );
}

function PreviewCard({
  title,
  description,
  children,
  wide = false,
}: Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}>) {
  return (
    <section className={wide ? "space-y-sm lg:col-span-2" : "space-y-sm"}>
      <PreviewExampleHeading>{title}</PreviewExampleHeading>
      {description ? (
        <p className="text-body-xs text-text-meta">{description}</p>
      ) : null}
      <div className="component-library-preview">{children}</div>
    </section>
  );
}

// Use this for titled examples inside a preview so labels stay semantic headings.
function PreviewExampleHeading({
  children,
  className: extraClassName,
  level = "h3",
  withBottomMargin = true,
}: Readonly<{
  children: ReactNode;
  className?: string;
  level?: "h3" | "h4";
  withBottomMargin?: boolean;
}>) {
  const Heading = level;
  const headingClassName =
    level === "h3"
      ? [
          withBottomMargin ? "mb-md" : null,
          "text-[18px] font-medium leading-6 text-text",
        ]
          .filter(Boolean)
          .join(" ")
      : "text-body-xs font-medium leading-[1.25] text-text-meta";

  return (
    <Heading
      className={[headingClassName, extraClassName].filter(Boolean).join(" ")}
    >
      {children}
    </Heading>
  );
}

function PreviewSubsectionHeading({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <h4 className="text-[16px] font-medium leading-6 text-text">
      {children}
    </h4>
  );
}

function PreviewExampleIntro({
  title,
  children,
}: Readonly<{
  title: ReactNode;
  children: ReactNode;
}>) {
  return (
    <div className="max-w-[44rem] space-y-sm">
      <PreviewExampleHeading withBottomMargin={false}>
        {title}
      </PreviewExampleHeading>
      <ComponentLibraryBodyCopy>{children}</ComponentLibraryBodyCopy>
    </div>
  );
}

function PreviewMomentStack({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div className={["space-y-16", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

function PreviewMoment({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <section className={["space-y-lg", className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}

type ComponentLibraryContext = "mobile" | "collapsed" | "expanded";

function getChatContextWidthClass(context: ComponentLibraryContext) {
  return context === "mobile"
    ? "w-[var(--component-library-mobile-chat-width)]"
    : context === "expanded"
    ? "w-[var(--design-layout-panel-expanded-width)]"
    : "w-[var(--design-layout-panel-collapsed-width)]";
}

function getChatContextAssistantMaxClass(context: ComponentLibraryContext) {
  return context === "expanded"
    ? "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-expanded-max)]"
    : "[--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-collapsed-max)]";
}

function ChatPanelReferenceFrame({
  context = "collapsed",
  children,
  className,
}: Readonly<{
  context?: ComponentLibraryContext;
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={[
        "overflow-hidden border border-border-faint bg-background",
        context === "mobile" ? "rounded-none" : "rounded-panel",
        getChatContextWidthClass(context),
        getChatContextAssistantMaxClass(context),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function ChatShellContainerPreview({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="h-[760px] w-[var(--design-layout-panel-collapsed-width)] max-w-full">
      {children}
    </div>
  );
}

function ChatThreadReferenceFrame({
  context = "collapsed",
  children,
}: Readonly<{
  context?: ComponentLibraryContext;
  children: ReactNode;
}>) {
  return (
    <ChatPanelReferenceFrame context={context}>
      <div className="flex justify-center py-xl">
        <ChatThread showAiDisclaimer={false}>{children}</ChatThread>
      </div>
    </ChatPanelReferenceFrame>
  );
}

function renderButtonState(
  state: (typeof buttonStates)[number],
  variant: (typeof buttonRows)[number]["variant"],
  size: (typeof buttonSizes)[number]["size"],
) {
  if (state === "disabled") {
    return (
      <Button disabled size={size} variant={variant}>
        Button
      </Button>
    );
  }

  if (state === "loading") {
    return (
      <Button loading size={size} variant={variant}>
        Button
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      visualState={state}
      tabIndex={-1}
      aria-hidden="true"
    >
      Button
    </Button>
  );
}

function renderButtonIconState(
  state: (typeof buttonStates)[number],
  variant: (typeof buttonRows)[number]["variant"],
  size: (typeof buttonSizes)[number]["size"],
) {
  if (state === "disabled") {
    return (
      <ButtonIcon disabled icon="placeholder" label="Action" size={size} variant={variant} />
    );
  }

  if (state === "loading") {
    return (
      <ButtonIcon
        icon="placeholder"
        label="Action"
        loading
        loadingLabel="Loading action"
        size={size}
        variant={variant}
      />
    );
  }

  return (
    <ButtonIcon
      icon="placeholder"
      label="Action"
      size={size}
      tabIndex={-1}
      variant={variant}
      visualState={state}
    />
  );
}

function renderOverlayButtonIconState(
  state: (typeof buttonStates)[number],
  color: OverlayButtonIconColor,
  size: OverlayButtonIconSize,
) {
  if (state === "disabled") {
    return (
      <OverlayButtonIcon
        color={color}
        disabled
        icon="placeholder"
        label="Overlay action"
        size={size}
      />
    );
  }

  if (state === "loading") {
    return (
      <OverlayButtonIcon
        color={color}
        icon="placeholder"
        label="Overlay action"
        loading
        loadingLabel="Loading overlay action"
        size={size}
      />
    );
  }

  return (
    <OverlayButtonIcon
      color={color}
      icon="placeholder"
      label="Overlay action"
      size={size}
      tabIndex={-1}
      visualState={state}
    />
  );
}

function renderGhostIconButtonState(
  state: (typeof ghostIconButtonStates)[number],
  emphasis = false,
  size: "small" | "medium" = "small",
  horizontalPadding = true,
) {
  if (state === "disabled") {
    return (
      <GhostIconButton
        disabled
        emphasis={emphasis}
        horizontalPadding={horizontalPadding}
        icon="placeholder"
        label="Action"
        size={size}
      />
    );
  }

  if (state === "loading") {
    return (
      <GhostIconButton
        emphasis={emphasis}
        horizontalPadding={horizontalPadding}
        icon="placeholder"
        label="Loading action"
        loading
        size={size}
      />
    );
  }

  return (
    <GhostIconButton
      emphasis={emphasis}
      horizontalPadding={horizontalPadding}
      icon="placeholder"
      label="Action"
      size={size}
      tabIndex={-1}
      visualState={state}
    />
  );
}

function renderGhostButtonState(
  state: (typeof ghostButtonStates)[number],
  emphasis = false,
  size: "small" | "medium" = "small",
  horizontalPadding = true,
  iconAtEnd = false,
) {
  if (state === "disabled") {
    return (
      <GhostButton
        disabled
        emphasis={emphasis}
        horizontalPadding={horizontalPadding}
        icon="placeholder"
        iconAtEnd={iconAtEnd}
        size={size}
      >
        Button
      </GhostButton>
    );
  }

  if (state === "loading") {
    return (
      <GhostButton
        emphasis={emphasis}
        horizontalPadding={horizontalPadding}
        icon="placeholder"
        iconAtEnd={iconAtEnd}
        loading
        size={size}
      >
        Button
      </GhostButton>
    );
  }

  return (
    <GhostButton
      emphasis={emphasis}
      horizontalPadding={horizontalPadding}
      icon="placeholder"
      iconAtEnd={iconAtEnd}
      size={size}
      tabIndex={-1}
      visualState={state}
    >
      Button
    </GhostButton>
  );
}

function renderPillState(
  state: (typeof pillStates)[number],
  checked = false,
) {
  if (state === "disabled") {
    return (
      <Pill checked={checked} disabled>
        Pill Choice
      </Pill>
    );
  }

  return (
    <Pill checked={checked} tabIndex={-1} visualState={state}>
      Pill Choice
    </Pill>
  );
}

function renderRadioState(
  state: (typeof radioStates)[number],
  checked = false,
) {
  if (state === "disabled") {
    return <Radio checked={checked} disabled />;
  }

  return <Radio checked={checked} visualState={state} />;
}

function SharedHeaderPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedHeaderDemo />
      </PreviewSection>
      <PreviewSection
        title="Usage"
        description="The header shows who the user is chatting with. When a live agent joins, the AI identity is replaced by the agent’s avatar, presence, and name."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading withBottomMargin={false}>
              AI agent
            </PreviewExampleHeading>
            <SharedHeaderIdentityDemo identity="ai-agent" />
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading withBottomMargin={false}>
              Live agent
            </PreviewExampleHeading>
            <SharedHeaderIdentityDemo identity="live-agent" />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
      <PreviewSection
        title="Behavior"
        description="The chat container header can include actions to dock, expand, and close the chat."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleIntro title="Panel">
              Includes dock, expand, and close.
            </PreviewExampleIntro>
            <SharedHeaderPresentationDemo presentation="panel" />
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleIntro title="Expanded">
              Replaces expand with collapse while keeping dock and close.
            </PreviewExampleIntro>
            <SharedHeaderPresentationDemo presentation="expanded" />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
      <PreviewSection title="Examples">
        <PreviewMomentStack>
          <PreviewMoment>
            <div className="max-w-[48rem]">
              <PreviewExampleHeading>
                LTS hiring microsite
              </PreviewExampleHeading>
              <ComponentLibraryBodyCopy>
                The LTS hiring microsite labels the agent chat as Contact sales.
              </ComponentLibraryBodyCopy>
            </div>
            <SharedHeaderProductExample product="hiring" />
          </PreviewMoment>
          <PreviewMoment>
            <div className="max-w-[48rem]">
              <PreviewExampleHeading>Premium survey</PreviewExampleHeading>
              <ComponentLibraryBodyCopy>
                The Premium survey labels the agent chat as Help assistant.
              </ComponentLibraryBodyCopy>
            </div>
            <SharedHeaderProductExample product="premium" />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function MessagesPlacementConversation() {
  return (
    <ChatPanelReferenceFrame className="flex h-[720px] flex-col">
      <ChatHeader
        identity={{
          type: "representative",
          name: "David S.",
          role: "Sales consultant",
        }}
        showCloseAction={false}
      />
      <ChatBody>
        <ChatThread showAiDisclaimer={false}>
          <ChatMessage>
            Hi Jamie. I can help you understand which hiring solution fits your
            team.
          </ChatMessage>
          <ChatMessage role="user" timestamp="1:04 PM">
            We need to hire 40 roles this quarter.
          </ChatMessage>
          <ChatMessage>
            <ChatMessageContent>
              <p>Here&apos;s a simple place to start:</p>
              <ul>
                <li>Confirm your priority roles.</li>
                <li>Compare sourcing and hiring options.</li>
              </ul>
            </ChatMessageContent>
          </ChatMessage>
          <ChatMessage role="user" timestamp="1:05 PM">
            Can I speak with a sales consultant about the best option?
          </ChatMessage>
          <ChatMessage>
            No problem, I&apos;ll connect you with a sales consultant now.
          </ChatMessage>
          <ChatSystemEvent>
            David S. joined the chat · 9:37 PM
          </ChatSystemEvent>
          <ChatMessage
            role="representative"
            authorName="David S."
            avatarLabel="David S., Sales consultant"
            timestamp="9:37 PM"
          >
            Hi Jamie, I can help you plan the next step.
          </ChatMessage>
        </ChatThread>
      </ChatBody>
      <ChatComposer
        sendDisabled
        showAttachAction={false}
        showVoiceMode={false}
      />
    </ChatPanelReferenceFrame>
  );
}

function SharedMessagesPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedMessagesDemo />
      </PreviewSection>
      <PreviewSection title="Example">
        <MessagesPlacementConversation />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedLiveAgentHandoffPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedLiveAgentHandoffDemo />
      </PreviewSection>

      <PreviewSection title="Usage">
        <ComponentLibraryBodyCopy className="max-w-[44rem]">
          Trigger each example to see the handoff move from connecting to
          connected.
        </ComponentLibraryBodyCopy>
        <PreviewMomentStack className="mt-xxxl">
          <PreviewMoment>
            <PreviewExampleHeading>
              General support (Used across VCA use cases including Premium
              Company Pages)
            </PreviewExampleHeading>
            <LiveAgentHandoffUsageDemo product="support" />
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>LTS hiring microsite</PreviewExampleHeading>
            <LiveAgentHandoffUsageDemo product="hiring" />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedResponseStatesPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedResponseStatesDemo />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedFeedbackPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedFeedbackDemo />
      </PreviewSection>
      <PreviewSection title="Variants">
        <SharedFeedbackVariants />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedEndChatCsatPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedEndChatCsatDemo />
      </PreviewSection>
      <PreviewSection title="Usage">
        <ComponentLibraryBodyCopy className="max-w-[44rem]">
          The CSAT screen appears and replaces the existing chat when the user
          clicks X to close it.
        </ComponentLibraryBodyCopy>
        <div className="mt-xxxl">
          <SharedEndChatCsatUsageDemo />
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedComposerPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedComposerDemo />
      </PreviewSection>
      <PreviewSection title="Usage">
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleIntro title="General">
              For most use cases, the VCA composer is a simple text input for
              sending messages.
            </PreviewExampleIntro>
            <SharedComposerUsageDemo useCase="general" />
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleIntro title="LTS hiring microsite">
              The LTS hiring microsite adds voice mode. Selecting the voice
              button switches the composer between text and voice input.
            </PreviewExampleIntro>
            <SharedComposerUsageDemo useCase="hiring" />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedVoiceModePage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection
        title="Demo"
        description="A click-through mock of the compact voice control. Live recognition appears as a provisional user message in the normal thread, then the center indicator changes speaker while the AI responds."
      >
        <SharedVoiceModeDemo />
      </PreviewSection>
      <PreviewSection title="Production notes">
        <div className="max-w-[48rem] space-y-md rounded-md border border-border-faint bg-background-neutral-soft p-xl text-body-sm-open text-text-meta">
          <p>
            This prototype mocks speech-to-text with a scripted transcript and
            uses browser speech synthesis as the audio fallback. Production
            should use streaming STT and a brand-tuned TTS voice.
          </p>
          <p>
            The prototype starts audio when visible text begins streaming and
            paces the text to feel synchronized. Production should stream both
            channels together and target sub-300ms audio cutoff for barge-in.
          </p>
          <p>
            Structured cards render silently. The assistant should always speak
            a short framing sentence first, then let cards appear visually
            without reading their contents aloud.
          </p>
          <p>
            Visual task panels hide the voice controls, stop audio, and release
            the microphone while the user completes the focused task. Voice
            mode resumes when the user returns to chat or completes the
            task.
          </p>
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedPromptsPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedPromptsDemo />
      </PreviewSection>
      <PreviewSection
        title="Usage"
        description="Prompts suggest relevant next steps. Selecting one sends its text as a user message."
      >
        <SharedPromptsUsageDemo />
      </PreviewSection>
      <PreviewSection
        title="Placement"
        description="Prompt layout adapts to the available chat-container width."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleIntro title="Panel">
              Prompts stack vertically in the standard-width chat panel.
            </PreviewExampleIntro>
            <SharedPromptsPlacementDemo context="collapsed" />
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleIntro title="Expanded">
              Prompts appear inline and wrap when needed in the expanded chat
              panel.
            </PreviewExampleIntro>
            <SharedPromptsPlacementDemo context="expanded" />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedActionCardPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedActionCardDemo />
      </PreviewSection>

      <PreviewSection
        title="Scenarios"
        description="Sales handoff cards appear after a lead is qualified as high or medium intent. High-intent leads are routed to a scheduled conversation, while medium-intent leads are offered live chat."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleIntro title="High intent">
              Connects the user with a matched sales consultant to schedule a
              conversation.
            </PreviewExampleIntro>
            <SalesHandoffScenarioDemo intent="high" />
          </PreviewMoment>

          <PreviewMoment>
            <PreviewExampleIntro title="Medium intent">
              Offers live chat with an available sales consultant, with
              scheduling as a fallback.
            </PreviewExampleIntro>
            <SalesHandoffScenarioDemo intent="medium" />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function HiringEmailThemeComparison({
  meetingFormat,
}: Readonly<{ meetingFormat: "online" | "phone" }>) {
  return (
    <div className="min-w-[44rem] space-y-12">
      <section aria-label="Light theme email preview">
        <PreviewExampleHeading>Light theme</PreviewExampleHeading>
        <div className="flex justify-center rounded-lg bg-background-neutral-soft px-xxxl py-12">
          <HiringConfirmationEmail meetingFormat={meetingFormat} />
        </div>
      </section>

      <section aria-label="Dark theme email preview">
        <PreviewExampleHeading>Dark theme</PreviewExampleHeading>
        <div className="flex justify-center rounded-lg bg-[#1f1f1f] px-xxxl py-12">
          <HiringConfirmationEmail meetingFormat={meetingFormat} theme="dark" />
        </div>
      </section>
    </div>
  );
}

function HiringMicrositeEmailPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Hiring microsite">
      <PreviewSection
        title="Phone call"
        description="The phone-call confirmation keeps the full phone number next to the call instruction so the meeting format is immediately clear."
      >
        <HiringEmailThemeComparison meetingFormat="phone" />
      </PreviewSection>

      <PreviewSection
        title="Online meeting"
        description="The online confirmation uses the same email structure and appends mocked Microsoft Teams details below the LinkedIn sign-off."
      >
        <HiringEmailThemeComparison meetingFormat="online" />
      </PreviewSection>

      <PreviewSection title="Design intent">
        <dl className="grid max-w-[64rem] gap-xxxl md:grid-cols-3">
          <div className="space-y-sm border-t border-border-faint pt-lg">
            <dt className="text-heading-md text-text">Preserve familiarity</dt>
            <dd className="text-body-sm-open text-text-meta">
              The original greeting, paragraphs, notes, and sign-off remain
              recognizable across both formats.
            </dd>
          </div>
          <div className="space-y-sm border-t border-border-faint pt-lg">
            <dt className="text-heading-md text-text">Personalize lightly</dt>
            <dd className="text-body-sm-open text-text-meta">
              The user and matched sales consultant are named without adding a
              new content section.
            </dd>
          </div>
          <div className="space-y-sm border-t border-border-faint pt-lg">
            <dt className="text-heading-md text-text">Clarify the essentials</dt>
            <dd className="text-body-sm-open text-text-meta">
              Meeting format, contact instructions, and optional notes are
              separated into predictable sections.
            </dd>
          </div>
        </dl>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function HiringMicrositeMicrophoneVoiceBannerPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Hiring microsite">
      <PreviewSection title="Demo">
        <HiringMicrophoneVoiceBannerDemo />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedInlineErrorPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="VCA">
      <PreviewSection
        title="Demo"
        description="Uses SDUI’s Inline feedback component to show general errors and offer a retry action."
      >
        <SharedInlineErrorDemo />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedChoiceCardPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedChoiceCardDemo />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedTaskStatusCardPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection
        title="Demo"
        description="Use Task status card when the assistant is running an action and needs to show a clear in-progress or completed state."
      >
        <SharedTaskStatusCardDemo />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedShellPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedShellDemo />
      </PreviewSection>
      <PreviewSection title="Behavior">
        <div className="max-w-[48rem]">
          <PreviewExampleHeading>Entry point</PreviewExampleHeading>
          <ComponentLibraryBodyCopy>
            The VCA container can have different entry points.
          </ComponentLibraryBodyCopy>
        </div>
        <PreviewMomentStack className="mt-xxxl">
          <PreviewMoment>
            <div className="max-w-[48rem] space-y-sm">
              <PreviewSubsectionHeading>Persistent</PreviewSubsectionHeading>
              <ComponentLibraryBodyCopy>
                Persistent keeps a docked tray visible in the bottom-right
                corner. Selecting it opens the container.
              </ComponentLibraryBodyCopy>
            </div>
            <SharedShellEntryPointBehaviorDemo behavior="persistent" />
          </PreviewMoment>
          <PreviewMoment>
            <div className="max-w-[48rem] space-y-sm">
              <PreviewSubsectionHeading>Dismissible</PreviewSubsectionHeading>
              <ComponentLibraryBodyCopy>
                Dismissible starts from a CTA or FAB. Closing the container
                removes it without leaving a docked tray.
              </ComponentLibraryBodyCopy>
            </div>
            <SharedShellEntryPointBehaviorDemo behavior="dismissable" />
          </PreviewMoment>
          <PreviewMoment>
            <div className="max-w-[48rem] space-y-sm">
              <PreviewSubsectionHeading>Hybrid</PreviewSubsectionHeading>
              <ComponentLibraryBodyCopy>
                Hybrid starts from a CTA or FAB. After opening, the container
                can be minimized to a tray or dismissed completely.
              </ComponentLibraryBodyCopy>
            </div>
            <SharedShellEntryPointBehaviorDemo behavior="hybrid" />
          </PreviewMoment>
        </PreviewMomentStack>
        <div className="mt-16 max-w-[48rem]">
          <PreviewExampleHeading>Expandable</PreviewExampleHeading>
          <ComponentLibraryBodyCopy>
            The chat panel can be expanded into an immersive, full screen
            dialog view by clicking the button in the header.
          </ComponentLibraryBodyCopy>
        </div>
        <div className="mt-xxxl">
          <SharedShellExpandableBehaviorDemo />
        </div>
      </PreviewSection>
      <PreviewSection title="Examples">
        <PreviewMomentStack>
          <PreviewMoment>
            <div className="max-w-[48rem]">
              <PreviewExampleHeading>
                LTS hiring microsite
              </PreviewExampleHeading>
              <ComponentLibraryBodyCopy>
                The LTS hiring microsite keeps the agent chat discoverable in a
                tray docked in the bottom-right corner. Users can open it
                from the tray or a Contact sales CTA, then minimize it back to
                the tray.
              </ComponentLibraryBodyCopy>
            </div>
            <SharedShellHiringMicrositeDemo />
          </PreviewMoment>
          <PreviewMoment>
            <div className="max-w-[48rem]">
              <PreviewExampleHeading>Premium survey</PreviewExampleHeading>
              <ComponentLibraryBodyCopy>
                The Premium survey opens a tray from Help me decide. Closing
                the chat removes it without leaving a docked tray.
              </ComponentLibraryBodyCopy>
            </div>
            <SharedShellPremiumSurveyDemo />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedSidePanelPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedSidePanelDemo />
      </PreviewSection>
      <PreviewSection
        title="Usage"
        description="Side panels keep the conversation available while users complete a focused task or review details. This preserves context and reduces the chance they abandon the conversation."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleIntro title="LTS hiring microsite">
              Users can schedule a conversation with a sales consultant without
              leaving the chat.
            </PreviewExampleIntro>
            <HiringSidePanelUsageDemo />
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleIntro title="Premium Company Pages">
              Users can inspect relevant company content while keeping the
              related conversation visible.
            </PreviewExampleIntro>
            <PcpSidePanelUsageDemo />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedInterimStatePage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection
        title="Demo"
        description="Shown on initial load while the AI agent is getting ready, so users know the chat is working."
      >
        <ChatShellContainerPreview>
          <ChatPanel
            variant="collapsed"
            className="md:!h-full md:!w-full"
          >
            <ChatHeader variant="collapsed" />
            <ChatBody>
              <InterimLoadingState
                title="Your AI assistant is getting ready"
              />
            </ChatBody>
            <ChatComposer
              inputProps={{
                disabled: true,
                placeholder: "Send a message",
              }}
              showAttachAction={false}
              showVoiceMode={false}
            />
          </ChatPanel>
        </ChatShellContainerPreview>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedIdleSessionPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection
        title="Demo"
        description="Prompts users to continue or end the chat after a period of inactivity."
      >
        <ChatShellContainerPreview>
          <ChatPanel
            variant="collapsed"
            className="md:!h-full md:!w-full"
          >
            <ChatHeader title="Contact sales" showAiMark={false} />
            <ChatBody className="opacity-20">
              <ChatThread timestamp="23:02" showAiDisclaimer={false}>
                <ChatMessage>
                  Hi there. With the help of AI, I can answer questions about
                  LinkedIn hiring solutions or connect you to our team.
                </ChatMessage>
              </ChatThread>
            </ChatBody>
            <ChatComposer
              inputProps={{
                disabled: true,
                placeholder: "Send a message",
              }}
              showAttachAction={false}
              showVoiceMode={false}
            />
            <IdleSessionPrompt
              title="Still there?"
              description="Your hiring chat will close soon."
              timeRemaining="8:22 remaining"
              primaryActionLabel="Continue chat"
              secondaryActionLabel="End chat"
            />
          </ChatPanel>
        </ChatShellContainerPreview>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiConfirmationPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI">
      <PreviewSection
        title="Component"
        description="The SDUI confirmation dialog supports center and top alignment, a dismiss action, primary and secondary actions, and an optional tertiary action."
      >
        <SharedConfirmationVariants />
      </PreviewSection>
      <PreviewSection
        title="Leave page warning"
        description="A confirmation moment for navigation that would end an active chat session."
      >
        <SharedConfirmationDemo />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumSurveyEntryPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium survey">
      <PreviewSection title="Demo">
        <PremiumFabDemo />
      </PreviewSection>
      <PreviewSection title="Floating action button">
        <PreviewCard title="Default">
          <PremiumFabReviewPreview />
        </PreviewCard>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumProductCardPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium survey">
      <PreviewSection title="Demo">
        <PremiumPlanCardDemo />
      </PreviewSection>
      <PreviewSection title="Plan recommendation">
        <ChatThreadReferenceFrame>
          <PremiumProductRecommendationCard />
        </ChatThreadReferenceFrame>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumUpsellBadgePage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium upsell">
      <PreviewSection
        title="Badge"
        description="The Premium upsell badge is a compact offer label for Help Center upsell moments. It reuses the shared Premium chip and existing Premium color tokens."
      >
        <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-3">
          {premiumUpsellBadgeExamples.map(
            ({ label, surfaceClassName, variant }) => (
              <div
                key={variant}
                className="flex min-h-28 flex-col gap-md rounded-sm border border-border-faint bg-background p-md"
              >
                <p className="text-body-xs text-text-meta">{label}</p>
                <div
                  className={cx(
                    "flex min-h-16 items-center rounded-xs px-lg py-md",
                    surfaceClassName,
                  )}
                >
                  <PremiumUpsellBadge variant={variant} />
                </div>
              </div>
            ),
          )}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumUpsellResultCardPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium upsell">
      <PreviewSection
        title="Generic"
        description="The Premium upsell result card is a contextual card for search results, help surfaces, and other answer-like pages. Keep the copy tied to what the member is trying to do."
      >
        <div className="max-w-[895px]">
          <PremiumUpsellResultCard
            title="Premium can help with this goal"
            body={
              <p>
                Use this space to connect the member&apos;s current task to a
                relevant Premium benefit. Keep the message specific, helpful,
                and short.
              </p>
            }
            primaryAction={{
              href: "/premium-upsell-help-center/survey?upmSignal=low",
              label: "Start free trial",
            }}
            secondaryAction={{
              href: "/premium/learn-more",
              label: "Compare plans",
            }}
          />
        </div>
      </PreviewSection>

      <PreviewSection
        title="Search result use case"
        description="Example copy for a Help Center search about sending InMail or messaging people outside the member's network."
      >
        <div className="max-w-[895px]">
          <PremiumUpsellResultCard
            title="Message people outside your network with Premium"
            body={
              <p>
                Premium Career includes InMail credits, so you can reach hiring
                managers and people you&apos;re not connected to. You can also
                get help drafting a message before you send.
              </p>
            }
            primaryAction={{
              href: "/premium-upsell-help-center/survey?upmSignal=low",
              label: "Start free trial",
            }}
            secondaryAction={{
              href: "/premium/learn-more",
              label: "Compare Premium plans",
            }}
          />
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumCompanyPageVcaFabPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium Company Page">
      <PreviewSection title="Floating action button">
        <PreviewCard title="Default">
          <VcaFabReviewPreview />
        </PreviewCard>
      </PreviewSection>
      <PreviewSection title="Visitor presence badge">
        <VcaFabPresenceBadgeExplorationPreview />
      </PreviewSection>
      <PreviewSection title="States">
        <VcaFabStatesPreview />
      </PreviewSection>
      <PreviewSection title="Visitor and admin marks">
        <VcaFabSwappableMarkPreview />
      </PreviewSection>
      <PreviewSection
        title="Visitor prompt card"
        description="Opening-state prompt card used to help a Page visitor start a VCA conversation."
      >
        <PreviewCard title="Opening prompts">
          <PcpVisitorPromptCardPreview />
        </PreviewCard>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PcpVisitorPromptCardPreview() {
  return (
    <section className="max-w-[360px] rounded-sm border border-border-faint bg-background p-lg shadow-raised-faint">
      <h3 className="text-heading-lg text-text">{pcpVcaScenario.openingTitle}</h3>
      <p className="mt-xs text-body-sm text-text">
        {pcpVcaScenario.openingSubcopy}
      </p>
      <div className="mt-lg flex flex-col items-start gap-sm">
        {pcpVcaScenario.visitorPrompts.map((prompt) => (
          <Prompt
            className="w-fit max-w-full"
            key={prompt.id}
            prompt={prompt.label}
          />
        ))}
      </div>
    </section>
  );
}

const pcpSidePanelExamples = [
  {
    title: "Post detail",
    kind: "post",
  },
  {
    title: "Job detail",
    kind: "job",
  },
  {
    title: "Product detail",
    kind: "product",
  },
] as const;

function PremiumCompanyPageSidePanelPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium Company Page">
      <PreviewSection
        title="Chat container examples"
        description="PCP detail panels open inside the VCA container so the chat history stays visible beside the focused content."
      >
        <PreviewMomentStack>
          {pcpSidePanelExamples.map(({ kind, title }) => (
            <PreviewMoment key={kind}>
              <PreviewExampleHeading>{title}</PreviewExampleHeading>
              <PcpVcaSidePanelShellPreview kind={kind} />
            </PreviewMoment>
          ))}
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumCompanyPageInputFirstStartSurfacePage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium Company Page">
      <PreviewSection
        title="Demo"
        description="Earlier PCP admin input-first opening, preserved as an exploration. The live assistant now uses the standard conversation-first opening."
      >
        <PcpAdminInputFirstStartSurfacePreview />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumCompanyPageEntityCardsPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium Company Page">
      <PreviewSection
        title="Building blocks"
        description="Atomic pieces for PCP entity cards. These represent nouns like products, posts, jobs, people, and companies inside AI responses."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>Container + actions</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ChatCardShell>
                <div className="space-y-md p-xl">
                  <h3 className="text-heading-md text-text">Card container</h3>
                  <p className="text-body-sm-open text-text">
                    Standard border, radius, width, and raised-faint shadow for
                    reusable PCP entity cards.
                  </p>
                </div>
                <ChatCardActions
                  actions={[
                    {
                      label: "Primary action",
                      variant: "secondary",
                    },
                  ]}
                />
              </ChatCardShell>
            </ChatThreadReferenceFrame>
          </PreviewMoment>

          <PreviewMoment>
            <PreviewExampleHeading>Media + passive reactions</PreviewExampleHeading>
            <div className="grid gap-lg lg:grid-cols-2">
              <ChatThreadReferenceFrame context="collapsed">
                <ChatCardShell>
                  <div className="space-y-md p-xl">
                    <ChatCardMedia
                      alt="Placeholder media"
                      placeholderLabel="Placeholder media"
                    />
                    <p className="text-body-sm-open text-text">
                      Inset media keeps the card padding visible.
                    </p>
                  </div>
                </ChatCardShell>
              </ChatThreadReferenceFrame>
              <ChatThreadReferenceFrame context="collapsed">
                <ChatCardShell>
                  <ChatCardMedia
                    alt="Full-bleed post media"
                    fullBleed
                    src={postPreviewImageSrc}
                  />
                  <div className="py-sm">
                    <ReactionSummary
                      comments="36 comments"
                      reactions="1,284"
                      reposts="18 reposts"
                    />
                  </div>
                </ChatCardShell>
              </ChatThreadReferenceFrame>
            </div>
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>

      <PreviewSection
        title="Product cards"
        description="Public product references for visitor answers. Product cards do not include company identity or social actions."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>Image + CTA</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseProductCard
                actions={[{ label: "View product", variant: "secondary" }]}
                body="Give employees one place to compare plans, enroll in benefits, update dependents, and see what needs attention before deadlines."
                imageAlt="Velora Dashboard product preview"
                imageSrc="/assets/premium-company-pages/member/velora-dashboard-product.png"
                title="Velora Dashboard"
                type="Employee benefits portal"
              />
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>No image</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseProductCard
                actions={[{ label: "View product", variant: "secondary" }]}
                body="Keep employees informed with timely reminders, clear next steps, and answers to common benefits questions during enrollment windows."
                title="Velora Guidance"
                type="Employee communications"
              />
            </ChatThreadReferenceFrame>
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>

      <PreviewSection
        title="Post cards"
        description="Post cards reuse the same header, two-line body, full-bleed media, link preview, and passive engagement row. They never render Like, Comment, Repost, or Send controls."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>Media + CTA</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponsePostCard
                actions={[{ label: "View post", variant: "secondary" }]}
                authorLogoClassName={veloraLogoTileClassName}
                authorLogoSrc={pcpCompanyProfile.logoSrc}
                authorLogoStyle={veloraLogoTileStyle}
                authorName={pcpCompanyProfile.name}
                comments={pcpProofSnippets.postCommentLabel}
                followerCount={pcpCompanyProfile.followers}
                imageAlt={pcpProofSnippets.postImageAlt}
                imageSrc={postPreviewImageSrc}
                reactions={pcpProofSnippets.postEngagement}
                reposts={`${pcpProofSnippets.postRepostCount} reposts`}
                snippet="A 12,000-employee retailer simplified carrier coordination before open enrollment by keeping eligibility cleanup, carrier files, and employee communications in one workflow."
                timestamp="35m"
              />
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Post with title preview + CTA</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponsePostCard
                actions={[{ label: "View post", variant: "secondary" }]}
                authorLogoClassName={veloraLogoTileClassName}
                authorLogoSrc={pcpCompanyProfile.logoSrc}
                authorLogoStyle={veloraLogoTileStyle}
                authorName={pcpCompanyProfile.name}
                comments="18 comments"
                followerCount={pcpCompanyProfile.followers}
                imageAlt="Placeholder preview for an open enrollment readiness post"
                linkMeta={pcpCompanyProfile.name}
                linkTitle="Open enrollment readiness checklist for enterprise HR teams"
                reactions="216"
                snippet="Open enrollment readiness starts before plan changes are announced. Here are a few ways benefits teams can keep the launch on track."
                timestamp="35m"
              />
            </ChatThreadReferenceFrame>
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>

      <PreviewSection
        title="Job cards"
        description="Job cards are intentionally narrow so multiple jobs can sit inside a response rail without stretching the chat panel."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>Single job</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseJobCard
                actions={[{ label: "View job", variant: "secondary" }]}
                alumni="1,412 school alumni work here"
                alumniImageSrc={schoolAlumniImageSrc}
                company={pcpCompanyProfile.name}
                location="San Francisco, CA"
                logoClassName={veloraLogoTileClassName}
                logoSrc={pcpCompanyProfile.logoSrc}
                logoStyle={veloraLogoTileStyle}
                timestamp="2 days ago"
                title="Benefits Implementation Consultant"
              />
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>In carousel</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseRail aria-label="Open roles">
                {[
                  "Benefits Implementation Consultant",
                  "Carrier Integrations Lead",
                  "Product Designer, Admin Experience",
                ].map((title, index) => (
                  <ResponseJobCard
                    actions={[{ label: "View job", variant: "secondary" }]}
                    alumni="1,412 school alumni work here"
                    alumniImageSrc={schoolAlumniImageSrc}
                    company={pcpCompanyProfile.name}
                    key={title}
                    location="San Francisco, CA"
                    logoClassName={veloraLogoTileClassName}
                    logoSrc={pcpCompanyProfile.logoSrc}
                    logoStyle={veloraLogoTileStyle}
                    timestamp={index === 1 ? "1 week ago" : "2 days ago"}
                    title={title}
                  />
                ))}
              </ResponseRail>
            </ChatThreadReferenceFrame>
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>

      <PreviewSection
        title="People cards"
        description="People cards can stand alone or sit inside a ResponseRail. The optional tag is for high-level visitor insight, not follower counts."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>Standalone</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponsePersonCard
                actionIcon={null}
                actionLabel="View profile"
                avatarSrc={chatCardPeople[0].avatarSrc}
                headline={chatCardPeople[0].headline}
                name={chatCardPeople[0].name}
                tag={chatCardPeople[0].tag}
                tagTone="supportive-4"
              />
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>In carousel</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseRail aria-label="Relevant visitors">
                {chatCardPeople.map((person) => (
                  <ResponsePersonCard
                    actionIcon={null}
                    actionLabel="View profile"
                    avatarSrc={person.avatarSrc}
                    headline={person.headline}
                    key={person.name}
                    name={person.name}
                    tag={person.tag}
                    tagTone="supportive-4"
                  />
                ))}
              </ResponseRail>
            </ChatThreadReferenceFrame>
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>

      <PreviewSection
        title="Company card"
        description="Company cards are compact company references for carousel layouts. Keep broader company/event cards undefined until a prototype flow actually needs them."
      >
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>Standalone</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseCompanyCard
                followers={pcpCompanyProfile.followers}
                industry={pcpCompanyProfile.industry}
                logoSrc={pcpCompanyProfile.logoSrc}
                name={pcpCompanyProfile.name}
              />
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>In carousel</PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseRail aria-label="Related pages">
                <ResponseCompanyCard
                  followers={pcpCompanyProfile.followers}
                  industry={pcpCompanyProfile.industry}
                  logoSrc={pcpCompanyProfile.logoSrc}
                  name={pcpCompanyProfile.name}
                />
                <ResponseCompanyCard
                  followers="32,840 followers"
                  industry="Benefits administration software"
                  name={benefitHubName}
                />
              </ResponseRail>
            </ChatThreadReferenceFrame>
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumCompanyPageInsightCardsPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium Company Page">
      <PreviewSection
        title="Routing rule"
        description="Every dashboard insight card chooses its action from one test: whether the payoff already exists on LinkedIn or must be synthesized by VCA."
      >
        <div className="grid gap-md lg:grid-cols-2">
          <div className="rounded-sm border border-border-faint bg-background p-lg">
            <div className="flex items-center gap-xs text-positive">
              <Icon name="signal-ai" size="small" />
              <h3 className="text-control-sm text-text">Synthesized payoff</h3>
            </div>
            <p className="mt-sm text-body-sm text-text-meta">
              Diagnosis, comparison, exploration, or plan. The card uses a
              blue inline Ask action and opens the VCA panel pre-loaded.
            </p>
          </div>
          <div className="rounded-sm border border-border-faint bg-background p-lg">
            <div className="flex items-center gap-xs text-action">
              <Icon name="link-external" size="small" />
              <h3 className="text-control-sm text-text">Existing payoff</h3>
            </div>
            <p className="mt-sm text-body-sm text-text-meta">
              Message, post, or other artifact already exists. The card uses a
              primary destination action to route to that surface.
            </p>
          </div>
        </div>
      </PreviewSection>

      <PreviewSection
        title="Today’s action base cards"
        description="These are the real-product onboarding actions that share the same surface and container. Actions stay inline as blue text links."
      >
        <PcpTodayActionCardsPreview />
      </PreviewSection>

      <PreviewSection
        title="AI insight card catalog"
        description="AI insight cards use the same container with added provenance, an inline AI Ask action, optional visuals, and signal pills. Audience-fit cards can use paired avatars when the insight is about visitor quality; Tier 2 profile signals use blue."
      >
        <PcpInsightCardSystemPreview />
      </PreviewSection>

      <PreviewSection
        title="Admin inbox AI context"
        description="Downstream context shown in the inbox after an insight or attention card explains why a lead matters."
      >
        <PcpInboxAiContextStripPreview />
      </PreviewSection>

      <PreviewSection
        title="Story 1a stack"
        description="For Story 1a, the AI anomaly ranks first and generic product actions remain below it for contrast. Resolved or dismissed cards leave the stack."
      >
        <div className="rounded-sm border border-border-faint bg-background p-lg">
          <ol className="grid gap-sm text-body-sm text-text-meta md:grid-cols-2">
            <li>
              <strong className="text-text">1. AI insight:</strong> follower
              growth down 18%
            </li>
            <li>
              <strong className="text-text">2. Product action:</strong>{" "}
              Auto-Invite
            </li>
            <li>
              <strong className="text-text">3. Product action:</strong> Follow
              other Pages
            </li>
          </ol>
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

const benefitHubName = pcpCompetitorNames[0];
const enrollwiseName = pcpCompetitorNames[1];
const cheriAvatarSrc = "/assets/premium-company-pages/member/cheri-sparks.png";
const postPreviewImageSrc = "/assets/premium-company-pages/member/media-1.png";
const schoolAlumniImageSrc =
  "/assets/premium-company-pages/member/school-alumni-spartan.png";
const veloraLogoTileClassName = "bg-[#ACF5B3]";
const veloraLogoTileStyle = {
  backgroundColor: "#ACF5B3",
};
const followerGrowthAxisTicks = ["May 5", "May 19", "Jun 2"] as const;
const followerGrowthTrendValues = [
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
const followerGrowthTrendAnnotation = {
  startIndex: 6,
  endIndex: 8,
  label: "",
  tone: "negative",
} as const;
const chatCardPeople = [
  {
    name: pcpVisitorPersona.name,
    headline: "VP of HR · Arbor Retail Group",
    tag: "Returned this week",
    avatarSrc: cheriAvatarSrc,
  },
  {
    name: "Priya Shah",
    headline: "Director of Benefits · Calico Health Network",
    tag: "Viewed multiple posts",
    avatarSrc: "/assets/premium-company-pages/avatar-3.png",
  },
  {
    name: "Marcus Lee",
    headline: "People Operations Lead · Northstar Retail",
    tag: "Opened your Page twice",
    avatarSrc: "/assets/premium-company-pages/avatar-1.png",
  },
] as const;

function ResponseSystemStack({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={[
        "flex w-full max-w-[var(--design-layout-panel-collapsed-width)] flex-col items-start gap-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function DataCardsCatalog() {
  return (
    <PreviewMomentStack>
      <PreviewMoment>
        <PreviewExampleHeading>Metric</PreviewExampleHeading>
        <ResponseSystemStack>
          <ResponseMetric
            title="Monthly summary"
            items={[
              {
                value: "8,740",
                label: "Visitors",
                delta: "18%",
                deltaContext: "vs last month",
                tone: "negative",
              },
              {
                value: "420",
                label: "New followers",
                delta: "11%",
                deltaContext: "vs last month",
                tone: "negative",
              },
              {
                value: "86,420",
                label: "Follower total",
                delta: "420",
                deltaContext: "this month",
                tone: "positive",
              },
            ]}
          />
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Trend</PreviewExampleHeading>
        <ResponseSystemStack>
          <ResponseTrend
            annotation={{
              startIndex: 4,
              endIndex: 6,
              label: "Open enrollment gap",
              tone: "negative",
            }}
            axisTicks={["May 5", "May 19", "Jun 2"]}
            title="Page visits"
            values={[34, 39, 36, 43, 31, 25, 28]}
          />
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>MetricWithTrend</PreviewExampleHeading>
        <p className="max-w-[var(--design-layout-panel-collapsed-width)] text-body-sm text-text-meta">
          Use MetricWithTrend when one metric needs both its current state and
          its history; use Metric alone for grids/snapshots; use Trend alone
          when the shape of the data is the whole point.
        </p>
        <ResponseSystemStack>
          <ResponseMetricWithTrend
            annotation={followerGrowthTrendAnnotation}
            axisTicks={followerGrowthAxisTicks}
            delta="18%"
            deltaContext="vs last month"
            title="Follower growth"
            tone="negative"
            unit="new followers this month"
            value="+420"
            values={followerGrowthTrendValues}
          />
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Compare</PreviewExampleHeading>
        <ResponseSystemStack>
          <ResponseCompare
            dimension="Follower growth this month"
            rows={[
              {
                name: pcpCompanyProfile.name,
                value: -18,
                valueLabel: "-18%",
                isYou: true,
                visual: {
                  kind: "company-logo",
                  src: pcpCompanyProfile.logoSrc,
                },
              },
              {
                name: benefitHubName,
                value: 24,
                valueLabel: "+24%",
                visual: {
                  kind: "company-logo",
                },
              },
              {
                name: enrollwiseName,
                value: 6,
                valueLabel: "+6%",
                visual: {
                  kind: "company-logo",
                },
              },
            ]}
            title="Competitor comparison"
          />
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>ConversionPath</PreviewExampleHeading>
        <p className="max-w-[var(--design-layout-panel-collapsed-width)] text-body-sm text-text-meta">
          ConversionPath shows where Page attention turns into a concrete action.
          Keep the recommendation in the AI response; use the card for the
          measurable path.
        </p>
        <ResponseSystemStack>
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
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>AudienceFit</PreviewExampleHeading>
        <p className="max-w-[var(--design-layout-panel-collapsed-width)] text-body-sm text-text-meta">
          AudienceFit summarizes which visitor groups are showing up after the
          agent explains the main audience-match signal. Segment labels should
          use LinkedIn demographic dimensions, not invented audience buckets.
        </p>
        <ResponseSystemStack>
          <ResponseAudienceFit
            metricLabel="match your target audience"
            metricValue="64%"
            segments={[
              {
                label: "Human Resources · Director+",
                value: "38%",
              },
              {
                label: "Insurance & Healthcare",
                value: "31%",
              },
              {
                label: "10,001+ employees",
                value: "44%",
                valueTone: "positive",
              },
            ]}
            trendContext="vs last month"
            trendDelta="12 pts"
            trendTone="positive"
          />
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>ContentList</PreviewExampleHeading>
        <p className="max-w-[var(--design-layout-panel-collapsed-width)] text-body-sm text-text-meta">
          ContentList compares a small set of posts when the agent is explaining
          content performance patterns.
        </p>
        <ResponseSystemStack>
          <ResponseContentList
            items={[
              {
                title: pcpProofSnippets.postTitle,
                thumbnailSrc:
                  "/assets/premium-company-pages/member/post-image-1.png",
                thumbnailAlt: "Carrier coordination post preview",
                metrics: [
                  { label: "Engagement rate", value: "8.2%" },
                  { label: "Impressions", value: "18.4K" },
                ],
              },
              {
                title: "Carrier file readiness checklist for open enrollment",
                thumbnailSrc:
                  "/assets/premium-company-pages/member/post-image-2.png",
                thumbnailAlt: "Open enrollment checklist post preview",
                metrics: [
                  { label: "Engagement rate", value: "7.1%" },
                  { label: "Impressions", value: "14.2K" },
                ],
              },
            ]}
            title="Posts"
          />
        </ResponseSystemStack>
      </PreviewMoment>
    </PreviewMomentStack>
  );
}

function PremiumCompanyPageDataCardsPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium Company Page">
      <PreviewSection
        title="Data cards"
        description="Reusable structured evidence cards for metrics, trends, comparisons, conversion paths, audience segments, and content patterns inside PCP AI responses."
      >
        <DataCardsCatalog />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiButtonPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiButtonDemo />
      </PreviewSection>
      <PreviewSection title="Button states">
        <div className="space-y-8">
          {buttonSizes.map(({ label, size }) => (
            <section key={size} className="space-y-6">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              {buttonRows.map(({ label: rowLabel, variant }) => (
                <div key={`${size}-${variant}`} className="space-y-sm">
                  <PreviewExampleHeading level="h4">
                    {rowLabel}
                  </PreviewExampleHeading>
                  <div className="flex flex-wrap items-center gap-md">
                    {buttonStates.map((state) => (
                      <div key={`${size}-${variant}-${state}`} className="space-y-xs">
                        <p className="text-body-xs text-text-meta">{state}</p>
                        {renderButtonState(state, variant, size)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </PreviewSection>
      <PreviewSection title="Sign in CTA">
        <div className="flex w-full max-w-[384px]">
          <Button
            leadingIcon={
              <Image
                src="/assets/linkedin-bug.svg"
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
            }
            variant="primary"
            className="w-full !gap-2 [&>span:first-child]:size-6"
          >
            Continue with LinkedIn
          </Button>
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiGhostButtonPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiGhostButtonDemo />
      </PreviewSection>
      <PreviewSection title="Ghost button states">
        <div className="grid gap-lg lg:grid-cols-2">
          {buttonSizes.map(({ label, size }) => (
            <section key={size} className="space-y-6">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              {[
                { label: "Label only", iconAtEnd: false, icon: false },
                { label: "Leading icon", iconAtEnd: false, icon: true },
                { label: "Trailing icon", iconAtEnd: true, icon: true },
              ].map(({ label: rowLabel, iconAtEnd, icon }) => (
                <div key={`${size}-${rowLabel}`} className="space-y-sm">
                  <PreviewExampleHeading level="h4">
                    {rowLabel}
                  </PreviewExampleHeading>
                  <div className="flex flex-wrap items-center gap-md">
                    {ghostButtonStates.map((state) => (
                      <div key={`${size}-${rowLabel}-${state}`} className="space-y-xs">
                        <p className="text-body-xs text-text-meta">{state}</p>
                        {icon ? (
                          renderGhostButtonState(
                            state,
                            false,
                            size,
                            true,
                            iconAtEnd,
                          )
                        ) : (
                          <GhostButton
                            disabled={state === "disabled"}
                            horizontalPadding
                            loading={state === "loading"}
                            size={size}
                            tabIndex={state === "default" ? undefined : -1}
                            visualState={
                              state === "disabled" || state === "loading"
                                ? "default"
                                : state
                            }
                          >
                            Button
                          </GhostButton>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </PreviewSection>
      <PreviewSection title="Emphasis and padding">
        <div className="flex flex-wrap items-center gap-lg">
          <GhostButton icon="arrow-right" iconAtEnd size="small">
            Default
          </GhostButton>
          <GhostButton emphasis icon="arrow-right" iconAtEnd size="small">
            Emphasis
          </GhostButton>
          <GhostButton horizontalPadding={false} icon="arrow-right" iconAtEnd size="small">
            Compact
          </GhostButton>
          <GhostButton emphasis horizontalPadding={false} icon="arrow-right" iconAtEnd size="medium">
            Medium compact
          </GhostButton>
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiNavLinkItemHorizontalPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiNavLinkItemHorizontalDemo />
      </PreviewSection>
      <PreviewSection title="States">
        <div className="grid gap-lg sm:grid-cols-3">
          {(["default", "hover", "active"] as const).map((state) => (
            <div
              key={state}
              className="flex flex-col items-start gap-sm rounded-sm border border-border-faint bg-background p-md"
            >
              <PreviewExampleHeading className="capitalize">
                {state}
              </PreviewExampleHeading>
              <NavLinkItemHorizontal
                badge
                hasDropdown
                icon="placeholder"
                label="Nav link"
                visualState={state}
              />
            </div>
          ))}
        </div>
      </PreviewSection>
      <PreviewSection title="Current indicators">
        <div className="flex flex-wrap items-start gap-lg">
          {(["bottom", "top", "none"] as const).map((indicator) => (
            <div
              key={indicator}
              className="flex flex-col items-start gap-sm rounded-sm border border-border-faint bg-background p-md"
            >
              <PreviewExampleHeading className="capitalize">
                {indicator}
              </PreviewExampleHeading>
              <NavLinkItemHorizontal
                badge
                current
                hasDropdown
                icon="placeholder"
                indicator={indicator}
                label="Nav link"
              />
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiTabItemHorizontalPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiTabItemHorizontalDemo />
      </PreviewSection>
      <PreviewSection title="States">
        <div className="grid gap-lg lg:grid-cols-2">
          {(["default", "overlay"] as const).map((tone) => (
            <div
              key={tone}
              className={cx(
                "space-y-md rounded-sm border border-border-faint p-lg",
                tone === "overlay" ? "bg-[#041838]" : "bg-background",
              )}
            >
              <PreviewExampleHeading
                className={tone === "overlay" ? "text-white" : undefined}
              >
                {tone === "overlay" ? "Overlay" : "Default"}
              </PreviewExampleHeading>
              <div className="flex flex-wrap items-start">
                {(["default", "hover", "active"] as const).map((state) => (
                  <TabItemHorizontal
                    icon="placeholder"
                    key={`${tone}-${state}`}
                    label="Tab label"
                    tone={tone}
                    visualState={state}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-start">
                {(["default", "hover", "active"] as const).map((state) => (
                  <TabItemHorizontal
                    icon="placeholder"
                    key={`${tone}-selected-${state}`}
                    label="Tab label"
                    selected
                    tone={tone}
                    visualState={state}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-start">
                {(["default", "hover", "active"] as const).map((state) => (
                  <TabItemHorizontal
                    key={`${tone}-overflow-${state}`}
                    label="More"
                    overflow
                    tone={tone}
                    visualState={state}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PreviewSection>
      <PreviewSection title="Tab list">
        <div className="inline-flex border-b border-border-faint" role="tablist">
          {["Home", "About", "Posts", "Products"].map((tab) => (
            <TabItemHorizontal
              key={tab}
              label={tab}
              selected={tab === "Home"}
            />
          ))}
          <TabItemHorizontal label="More" overflow />
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiGlobalNavigationPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection
        title="Default"
        description="The default web navigation shows the LinkedIn bug, global search, primary nav links, profile, and work menu."
      >
        <div className="-mx-lg overflow-hidden border-y border-border-faint bg-background sm:mx-0 sm:rounded-sm sm:border">
          <LinkedInGlobalNavigation profileSrc="/assets/premium-company-pages/member/beta-entity.png" />
        </div>
      </PreviewSection>
      <PreviewSection
        title="Extended"
        description="Optional slots support a second search field, the Premium spotlight, and Advertise."
      >
        <div className="-mx-lg overflow-hidden border-y border-border-faint bg-background sm:mx-0 sm:rounded-sm sm:border">
          <LinkedInGlobalNavigation
            profileSrc="/assets/premium-company-pages/member/beta-entity.png"
            searchPlaceholder="Title, skill or company"
            secondarySearchPlaceholder="City, state, or zip..."
            showAdvertise
            showPremiumSpotlight
          />
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiPillPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiPillDemo />
      </PreviewSection>
      <PreviewSection title="Pill states">
        <div className="space-y-8">
          {[
            { label: "Unchecked", checked: false },
            { label: "Checked", checked: true },
          ].map(({ label, checked }) => (
            <section key={label} className="space-y-4">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              <div className="flex flex-wrap items-start gap-lg">
                {pillStates.map((state) => (
                  <div key={`${label}-${state}`} className="space-y-sm">
                    <p className="text-body-xs text-text-meta">{state}</p>
                    {renderPillState(state, checked)}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiRadioPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiRadioDemo />
      </PreviewSection>
      <PreviewSection title="Radio states">
        <div className="space-y-8">
          {[
            { label: "Unchecked", checked: false },
            { label: "Checked", checked: true },
          ].map(({ label, checked }) => (
            <section key={label} className="space-y-4">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              <div className="flex flex-wrap items-start gap-lg">
                {radioStates.map((state) => (
                  <div key={`${label}-${state}`} className="space-y-sm">
                    <p className="text-body-xs text-text-meta">{state}</p>
                    {renderRadioState(state, checked)}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiIconPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title={`Navigation icons (${navigationIconMetadata.length})`}>
        <IconCatalogGrid icons={navigationIconMetadata} iconSize="medium" />
      </PreviewSection>
      <PreviewSection title={`System icons (${systemIconMetadata.length})`}>
        <IconCatalogGrid icons={systemIconMetadata} />
      </PreviewSection>
    </ComponentPageShell>
  );
}

type SduiIllustrationAsset =
  (typeof sduiIllustrationCatalog)[keyof typeof sduiIllustrationCatalog][number];

function SduiIllustrationAssetCard({
  asset,
  wide = false,
}: Readonly<{
  asset: SduiIllustrationAsset;
  wide?: boolean;
}>) {
  return (
    <article
      className={[
        "rounded-sm border border-border-faint bg-background p-lg",
        wide ? "max-w-[560px]" : "max-w-[240px]",
      ].join(" ")}
    >
      <div className="flex min-h-[180px] items-center justify-center rounded-xs bg-background-neutral-soft p-lg">
        <Image
          alt={asset.name}
          className={wide ? "h-auto w-full max-w-[375px]" : "size-16"}
          height={asset.height}
          src={asset.src}
          unoptimized
          width={asset.width}
        />
      </div>
      <p className="mt-md text-control-sm text-text">{asset.name}</p>
      <p className="mt-xs break-all text-body-xs text-text-meta">
        {asset.src}
      </p>
    </article>
  );
}

function SduiIllustrationsPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection
        title="Microspots"
        description="Compact SDUI illustration assets for small supporting moments."
      >
        <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
          {sduiIllustrationCatalog.microspots.map((asset) => (
            <SduiIllustrationAssetCard asset={asset} key={asset.src} />
          ))}
        </div>
      </PreviewSection>
      <PreviewSection
        title="Scenes"
        description="Larger SDUI illustration assets for more expressive surfaces."
      >
        <div className="grid gap-lg">
          {sduiIllustrationCatalog.scenes.map((asset) => (
            <SduiIllustrationAssetCard asset={asset} key={asset.src} wide />
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiReactionIconsPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection
        title="Consumption matrix"
        description="Reaction illustrations from the SDUI design-system library. Small sizes include default and ring variants where Figma provides both."
      >
        <div className="overflow-x-auto rounded-sm border border-border-faint bg-background">
          <table className="min-w-[720px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-border-faint">
                <th className="w-40 px-md py-sm text-label-xs text-text-meta">
                  Type
                </th>
                {reactionIconCatalogColumns.map((column) => (
                  <th
                    className="px-md py-sm text-label-xs text-text-meta"
                    key={column.label}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sduiReactionIconTypes.map((type) => (
                <tr className="border-b border-border-faint last:border-b-0" key={type}>
                  <th className="px-md py-md text-control-sm text-text">
                    {reactionIconTypeLabels[type]}
                  </th>
                  {reactionIconCatalogColumns.map(({ label, ring, size }) => (
                    <td className="px-md py-md" key={`${type}-${label}`}>
                      {isSduiReactionIconAvailable({ ring, size, type }) ? (
                        <SduiReactionIcon
                          label={`${reactionIconTypeLabels[type]} ${label} reaction icon`}
                          ring={ring}
                          size={size}
                          type={type}
                        />
                      ) : (
                        <span className="text-body-xs text-text-disabled">
                          -
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PreviewSection>
      <PreviewSection title="Common placeholder candidates">
        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-4">
          {reactionIconPlaceholderExamples.map(({ label, size, type }) => (
            <div
              className="flex min-h-32 flex-col items-center justify-center gap-sm rounded-sm border border-border-faint bg-background p-md text-center"
              key={label}
            >
              <SduiReactionIcon
                label={`${label} placeholder reaction icon`}
                size={size}
                type={type}
              />
              <span className="text-body-sm text-text">{label}</span>
              <span className="text-body-xs text-text-meta">
                {reactionIconTypeLabels[type]} / {reactionIconSizeLabels[size]}
              </span>
            </div>
          ))}
        </div>
      </PreviewSection>
      <PreviewSection title="Size reference">
        <div className="flex flex-wrap items-end gap-xl rounded-sm border border-border-faint bg-background p-lg">
          {sduiReactionIconSizes.map((size) => (
            <div className="flex flex-col items-center gap-sm" key={size}>
              <SduiReactionIcon size={size} type="like" />
              <span className="text-body-xs text-text-meta">
                {reactionIconSizeLabels[size]}
              </span>
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function IconCatalogGrid({
  icons,
  iconSize = "small",
}: Readonly<{
  icons: ReadonlyArray<IconCatalogItem>;
  iconSize?: IconSize;
}>) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(7.75rem,1fr))] gap-sm">
      {icons.map((icon) => (
        <div
          key={icon.name}
          className="flex min-h-[5rem] flex-col items-center justify-center gap-sm rounded-sm border border-border-faint bg-background px-sm py-md text-center"
        >
          <Icon name={icon.name} size={iconSize} className="text-icon" />
          <span className="max-w-full break-words text-body-xs leading-[1.2] text-text-meta">
            {icon.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function SduiEntityPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiEntityDemo />
      </PreviewSection>
      <PreviewSection title="Entity sizes">
        <div className="space-y-8">
          {([
            { label: "Circle", shape: "circle" },
            { label: "Square", shape: "square" },
          ] as const).map(({ label, shape }) => (
            <section key={shape} className="space-y-4">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              <div className="flex flex-wrap items-end gap-lg">
                {entitySizes.map((size) => (
                  <div key={`${shape}-${size}`} className="flex min-w-16 flex-col items-center gap-sm">
                    <Entity
                      label={`${label} entity placeholder, ${size}px`}
                      shape={shape}
                      size={size}
                    />
                    <span className="text-body-xs text-text-meta">{size}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiButtonIconPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiButtonIconDemo />
      </PreviewSection>
      <PreviewSection title="Button icon states">
        <div className="space-y-8">
          {buttonSizes.map(({ label, size }) => (
            <section key={size} className="space-y-6">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              {buttonRows.map(({ label: rowLabel, variant }) => (
                <div key={`${size}-${variant}`} className="space-y-sm">
                  <PreviewExampleHeading level="h4">
                    {rowLabel}
                  </PreviewExampleHeading>
                  <div className="flex flex-wrap items-center gap-md">
                    {buttonStates.map((state) => (
                      <div key={`${size}-${variant}-${state}`} className="space-y-xs">
                        <p className="text-body-xs text-text-meta">{state}</p>
                        {renderButtonIconState(state, variant, size)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiOverlayButtonIconPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection
        title="Demo"
        description="Overlay icon buttons sit on top of imagery, video, or floating surfaces where the control needs its own circular contrast layer."
      >
        <SduiOverlayButtonIconDemo />
      </PreviewSection>
      <PreviewSection title="Overlay button icon states">
        <div className="space-y-8">
          {buttonSizes.map(({ label, size }) => (
            <section key={size} className="space-y-6">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              {overlayButtonIconRows.map(({ label: rowLabel, color }) => (
                <div key={`${size}-${color}`} className="space-y-sm">
                  <PreviewExampleHeading level="h4">
                    {rowLabel}
                  </PreviewExampleHeading>
                  <div className="rounded-sm bg-background-neutral-soft p-lg">
                    <div className="flex flex-wrap items-center gap-md">
                      {buttonStates.map((state) => (
                        <div
                          key={`${size}-${color}-${state}`}
                          className="space-y-xs"
                        >
                          <p className="text-body-xs text-text-meta">
                            {state}
                          </p>
                          {renderOverlayButtonIconState(state, color, size)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiGhostIconButtonPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiGhostIconButtonDemo />
      </PreviewSection>
      <PreviewSection title="Ghost icon button states">
        <div className="grid gap-lg lg:grid-cols-2">
          {(["small", "medium"] as const).map((size) => (
            <section key={size} className="space-y-4">
              <PreviewExampleHeading className="capitalize">
                {size}
              </PreviewExampleHeading>
              {[
                { label: "Padded", horizontalPadding: true },
                { label: "Compact", horizontalPadding: false },
              ].map(({ label, horizontalPadding }) => (
                <div key={`${size}-${label}`} className="space-y-sm">
                  <PreviewExampleHeading level="h4">
                    {label}
                  </PreviewExampleHeading>
                  <div className="flex flex-wrap items-center gap-sm">
                    {ghostIconButtonStates.map((state) => (
                      <span key={`${size}-${label}-${state}`}>
                        {renderGhostIconButtonState(
                          state,
                          false,
                          size,
                          horizontalPadding,
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-sm">
                    {ghostIconButtonStates.map((state) => (
                      <span key={`${size}-${label}-${state}-emphasis`}>
                        {renderGhostIconButtonState(
                          state,
                          true,
                          size,
                          horizontalPadding,
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiTextInputPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiTextInputDemo />
      </PreviewSection>
      <PreviewSection title="Text input variants">
        <div className="grid gap-xl lg:grid-cols-2">
          {textInputSizes.map(({ label, size }) => (
            <div key={size} className="space-y-lg">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              <TextInput className="max-w-80" counter helperText="Helper text" label="Label" placeholder="Hint text (Optional)" required size={size} />
              <TextInput className="max-w-80" counter defaultValue="Input text value" helperText="Helper text" label="Label" placeholder="Hint text (Optional)" required size={size} />
              <TextInput className="max-w-80" counter errorText="Error text" label="Label" placeholder="Hint text (Optional)" required size={size} />
              <TextInput className="max-w-80" counter defaultValue="Input text value" disabled helperText="Helper text" label="Label" placeholder="Hint text (Optional)" required size={size} />
            </div>
          ))}
        </div>
      </PreviewSection>
      <PreviewSection title="Interaction states">
        <div className="grid gap-xl lg:grid-cols-2">
          {textInputSizes.map(({ label, size }) => (
            <div key={size} className="space-y-lg">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              {textInputStates.map((state) => (
                <TextInput
                  className="max-w-80"
                  key={`${size}-${state}`}
                  counter
                  helperText="Helper text"
                  label="Label"
                  placeholder="Hint text (Optional)"
                  required
                  size={size}
                  visualState={state}
                />
              ))}
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiTextAreaPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiTextAreaDemo />
      </PreviewSection>
      <PreviewSection title="Text area variants">
        <div className="grid gap-xl lg:grid-cols-2">
          {textInputSizes.map(({ label, size }) => (
            <div key={size} className="space-y-lg">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              <TextArea className="max-w-80" counter helperText="Helper text" label="Label" placeholder="Hint text (Optional)" required size={size} />
              <TextArea className="max-w-80" counter defaultValue="Input text value" helperText="Helper text" label="Label" placeholder="Hint text (Optional)" required size={size} />
              <TextArea className="max-w-80" counter errorText="Error text" label="Label" placeholder="Hint text (Optional)" required size={size} />
              <TextArea className="max-w-80" counter defaultValue="Input text value" disabled helperText="Helper text" label="Label" placeholder="Hint text (Optional)" required size={size} />
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiTagPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiTagDemo />
      </PreviewSection>
      <PreviewSection title="Tag tones">
        <div className="space-y-8">
          {tagSizes.map(({ label, size }) => (
            <section key={size} className="space-y-4">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-md lg:max-w-2xl">
                {tagTones.map(({ label: toneLabel, tone }) => (
                  <div key={`${size}-${tone}`} className="flex min-h-20 flex-col items-start justify-center gap-sm rounded-sm border border-border-faint bg-background px-md py-sm">
                    <p className="whitespace-nowrap text-body-xs text-text-meta">
                      {toneLabel}
                    </p>
                    <Tag size={size} tone={tone}>Label</Tag>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiBadgePage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiBadgeDemo />
      </PreviewSection>
      <PreviewSection title="Badge examples">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-md lg:max-w-2xl">
          {badgeExamples.map(({ label, tone, size, count }) => (
            <div key={label} className="flex min-h-20 flex-col items-start justify-center gap-sm rounded-sm border border-border-faint bg-background px-md py-sm">
              <p className="whitespace-nowrap text-body-xs text-text-meta">
                {label}
              </p>
              <Badge tone={tone} size={size} count={count} label={label} />
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiInlineFeedbackPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiInlineFeedbackDemo />
      </PreviewSection>
      <PreviewSection
        title="Tones"
        description="Use the tone that matches the meaning of the feedback. Severity does not determine whether the message interrupts assistive technology."
      >
        <div className="flex min-h-[28.5rem] w-full max-w-[32rem] flex-col items-start justify-center gap-[64px] rounded-[32px] border border-border-faint bg-background px-[96px] py-[64px]">
          {inlineFeedbackTones.map(({ label, tone }) => (
            <InlineFeedback action={<span>Link</span>} key={tone} tone={tone}>
              Feedback text.
              <span className="sr-only"> {label} feedback.</span>
            </InlineFeedback>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiPresenceBadgePage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Demo">
        <SduiPresenceBadgeDemo />
      </PreviewSection>
      <PreviewSection title="Presence badge examples">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-md lg:max-w-2xl">
          {presenceBadgeExamples.map(({ label, size }) => (
            <div key={size} className="flex min-h-20 flex-col items-start justify-center gap-sm rounded-sm border border-border-faint bg-background px-md py-sm">
              <p className="whitespace-nowrap text-body-xs text-text-meta">
                {label}
              </p>
              <div className="flex items-center gap-lg">
                <PresenceBadge label={`${label} active`} presence="active" size={size} />
                <PresenceBadge label={`${label} on mobile`} presence="mobile" size={size} />
              </div>
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiProgressIndicatorCircularPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection
        title="Demo"
        description="Circular progress indicators are for short system waits or actions that need more time to complete."
      >
        <div className="flex flex-wrap items-center gap-xxxl">
          <ProgressIndicatorCircular
            aria-label="Loading"
            size={16}
            type="indeterminate"
          />
          <ProgressIndicatorCircular
            label="Optional label"
            size={24}
            type="indeterminate"
          />
          <ProgressIndicatorCircular
            label="Optional label"
            size={40}
            type="determinate"
            value={66}
          />
        </div>
      </PreviewSection>
      <PreviewSection title="Indeterminate">
        <div className="space-y-10">
          {[
            { label: "Default", muted: false },
            { label: "Muted", muted: true },
          ].map(({ label, muted }) => (
            <section key={label} className="space-y-md">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              <div className="flex flex-wrap items-end gap-xxxl">
                {progressIndicatorCircularSizes.map((size) => (
                  <div
                    key={`${label}-${size}`}
                    className="flex min-w-16 flex-col items-center gap-sm"
                  >
                    <ProgressIndicatorCircular
                      aria-label={`${label} loading indicator, ${size}px`}
                      label="Optional label"
                      muted={muted}
                      size={size}
                      type="indeterminate"
                    />
                    <span className="text-body-xs text-text-meta">{size}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PreviewSection>
      <PreviewSection title="Determinate">
        <div className="space-y-10">
          {[
            { label: "Default", muted: false },
            { label: "Muted", muted: true },
          ].map(({ label, muted }) => (
            <section key={label} className="space-y-md">
              <PreviewExampleHeading>{label}</PreviewExampleHeading>
              <div className="flex flex-wrap items-end gap-xxxl">
                {progressIndicatorCircularSizes.map((size) => (
                  <div
                    key={`${label}-${size}`}
                    className="flex min-w-16 flex-col items-center gap-sm"
                  >
                    <ProgressIndicatorCircular
                      aria-label={`${label} progress indicator, ${size}px`}
                      label="Optional label"
                      muted={muted}
                      size={size}
                      type="determinate"
                      value={66}
                    />
                    <span className="text-body-xs text-text-meta">{size}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function ComponentPageShell({
  item,
  children,
}: Readonly<{
  item: ComponentNavItem;
  section: string;
  children: ReactNode;
}>) {
  return (
    <div className="space-y-[4.5rem]">
      <PageHeader title={item.title} description={item.description} />
      <div className="space-y-[4.5rem]">{children}</div>
    </div>
  );
}

export function ComponentPageContent({
  item,
}: Readonly<{
  item: ComponentNavItem;
}>) {
  switch (item.id) {
    case "shared-shell":
      return <SharedShellPage item={item} />;
    case "shared-header":
      return <SharedHeaderPage item={item} />;
    case "shared-messages":
      return <SharedMessagesPage item={item} />;
    case "shared-live-agent-handoff":
      return <SharedLiveAgentHandoffPage item={item} />;
    case "shared-response-states":
      return <SharedResponseStatesPage item={item} />;
    case "shared-inline-error":
      return <SharedInlineErrorPage item={item} />;
    case "shared-feedback":
      return <SharedFeedbackPage item={item} />;
    case "shared-end-chat-csat":
      return <SharedEndChatCsatPage item={item} />;
    case "shared-composer":
      return <SharedComposerPage item={item} />;
    case "shared-voice-mode":
      return <SharedVoiceModePage item={item} />;
    case "shared-prompts":
      return <SharedPromptsPage item={item} />;
    case "shared-action-card":
      return <SharedActionCardPage item={item} />;
    case "hiring-microsite-email":
      return <HiringMicrositeEmailPage item={item} />;
    case "hiring-microsite-microphone-voice-banner":
      return <HiringMicrositeMicrophoneVoiceBannerPage item={item} />;
    case "shared-choice-card":
      return <SharedChoiceCardPage item={item} />;
    case "shared-task-status-card":
      return <SharedTaskStatusCardPage item={item} />;
    case "shared-side-panel":
      return <SharedSidePanelPage item={item} />;
    case "shared-interim-state":
      return <SharedInterimStatePage item={item} />;
    case "shared-idle-session":
      return <SharedIdleSessionPage item={item} />;
    case "premium-survey-entry":
      return <PremiumSurveyEntryPage item={item} />;
    case "premium-product-recommendation-card":
      return <PremiumProductCardPage item={item} />;
    case "premium-upsell-badge":
      return <PremiumUpsellBadgePage item={item} />;
    case "premium-upsell-result-card":
      return <PremiumUpsellResultCardPage item={item} />;
    case "premium-company-page-vca-fab":
      return <PremiumCompanyPageVcaFabPage item={item} />;
    case "premium-company-page-side-panel":
      return <PremiumCompanyPageSidePanelPage item={item} />;
    case "premium-company-page-input-first-start-surface":
      return <PremiumCompanyPageInputFirstStartSurfacePage item={item} />;
    case "premium-company-page-entity-cards":
      return <PremiumCompanyPageEntityCardsPage item={item} />;
    case "premium-company-page-data-cards":
      return <PremiumCompanyPageDataCardsPage item={item} />;
    case "premium-company-page-insight-cards":
      return <PremiumCompanyPageInsightCardsPage item={item} />;
    case "sdui-nav-link-item-horizontal":
      return <SduiNavLinkItemHorizontalPage item={item} />;
    case "sdui-tab-item-horizontal":
      return <SduiTabItemHorizontalPage item={item} />;
    case "sdui-global-navigation":
      return <SduiGlobalNavigationPage item={item} />;
    case "sdui-button":
      return <SduiButtonPage item={item} />;
    case "sdui-ghost-button":
      return <SduiGhostButtonPage item={item} />;
    case "sdui-button-icon":
      return <SduiButtonIconPage item={item} />;
    case "sdui-overlay-button-icon":
      return <SduiOverlayButtonIconPage item={item} />;
    case "sdui-ghost-icon-button":
      return <SduiGhostIconButtonPage item={item} />;
    case "sdui-confirmation":
      return <SduiConfirmationPage item={item} />;
    case "sdui-pill":
      return <SduiPillPage item={item} />;
    case "sdui-radio":
      return <SduiRadioPage item={item} />;
    case "sdui-icon":
      return <SduiIconPage item={item} />;
    case "sdui-illustrations":
      return <SduiIllustrationsPage item={item} />;
    case "sdui-reaction-icons":
      return <SduiReactionIconsPage item={item} />;
    case "sdui-entity":
      return <SduiEntityPage item={item} />;
    case "sdui-text-input":
      return <SduiTextInputPage item={item} />;
    case "sdui-text-area":
      return <SduiTextAreaPage item={item} />;
    case "sdui-tag":
      return <SduiTagPage item={item} />;
    case "sdui-badge":
      return <SduiBadgePage item={item} />;
    case "sdui-inline-feedback":
      return <SduiInlineFeedbackPage item={item} />;
    case "sdui-presence-badge":
      return <SduiPresenceBadgePage item={item} />;
    case "sdui-progress-indicator-circular":
      return <SduiProgressIndicatorCircularPage item={item} />;
    default:
      return null;
  }
}
