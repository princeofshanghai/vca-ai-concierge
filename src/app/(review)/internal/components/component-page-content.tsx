import Image from "next/image";
import type { ReactNode } from "react";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatInlineFeedback,
  ChatMessage,
  ChatPanel,
  ChatThinkingMessage,
  ChatThread,
  Prompt,
  RecommendationCard,
} from "@/components/chat";
import {
  HighValueMatchCardPreview,
  HighValueSchedulePanelPreview,
  MediumAvailableHandoffPreview,
  type BookedMeeting,
  type HighValueRecommendationState,
  type MediumAvailableHandoffState,
} from "@/components/flow-review";
import {
  premiumConversationFlows,
} from "@/components/premium";
import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { PremiumConciergePanel } from "@/components/premium/premium-concierge-panel";
import { PremiumProductRecommendationCard } from "@/components/premium/premium-product-recommendation-card";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, iconMetadata, type IconSize } from "@/components/primitives/icon";
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
import {
  AudienceFit as ResponseAudienceFit,
  Chips as ResponseChips,
  ContentList as ResponseContentList,
  Compare as ResponseCompare,
  Draft as ResponseDraft,
  Entity as ResponseEntity,
  Metric as ResponseMetric,
  MetricWithTrend as ResponseMetricWithTrend,
  PageIdentityCard as ResponsePageIdentityCard,
  PersonCard as ResponsePersonCard,
  PostCompact as ResponsePostCompact,
  ResponseRail,
  Text as ResponseText,
  TextRecommendationList as ResponseTextRecommendationList,
  Trend as ResponseTrend,
} from "@/components/premium-company-pages/response-blocks";
import {
  pcpAdminScenario,
  pcpCompanyProfile,
  pcpCompetitorNames,
  pcpProofSnippets,
  pcpVcaScenario,
  pcpVisitorPersona,
} from "@/components/premium-company-pages/persona";

import {
  PremiumConciergePanelDemo,
  PremiumFabDemo,
  PremiumFabReviewPreview,
  PremiumPlanCardDemo,
  PcpAdminAttentionCardsPreview,
  PcpAdminInsightResponseCardPreview,
  PcpAiCardsDemo,
  PcpInboxAiContextStripPreview,
  PcpInsightCardSystemPreview,
  PcpTodayActionCardsPreview,
  PcpVcaCaseStudyCardPreview,
  PcpVcaHandoffCardPreview,
  PcpVcaJobCardPreview,
  SduiBadgeDemo,
  SduiButtonDemo,
  SduiButtonIconDemo,
  SduiEntityDemo,
  SduiGhostButtonDemo,
  SduiGhostIconButtonDemo,
  SduiNavLinkItemHorizontalDemo,
  SduiOverlayButtonIconDemo,
  SduiPillDemo,
  SduiPresenceBadgeDemo,
  SduiTagDemo,
  SduiTabItemHorizontalDemo,
  SduiTextAreaDemo,
  SduiTextInputDemo,
  SharedActionCardDemo,
  SharedComposerDemo,
  SharedConfirmationDemo,
  SharedConfirmationVariants,
  SharedFeedbackDemo,
  SharedFeedbackVariants,
  SharedHeaderDemo,
  SharedHeaderVariants,
  SharedMessagesDemo,
  SharedPromptsDemo,
  SharedShellDemo,
  SharedShellHiringMicrositeDemo,
  SharedShellPremiumSurveyDemo,
  SharedSidePanelDemo,
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
const promptStates = ["default", "hover", "active", "focus-visible", "disabled"] as const;
const pillStates = ["default", "hover", "active", "focus-visible", "disabled"] as const;
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const bookedMeetingPreview: BookedMeeting = {
  format: "Online meeting",
  date: "Tue, Apr 28",
  time: "9:00 AM",
  contact: "jamie.chen@northstarhealth.com",
};

const bookedPhoneCallPreview: BookedMeeting = {
  format: "Phone call",
  date: "Tue, Apr 28",
  time: "9:00 AM",
  contact: "+1 (415) 555-0172",
};

const highValueMatchCardStates: ReadonlyArray<
  Readonly<{
    label: string;
    state: HighValueRecommendationState;
    bookedMeeting?: BookedMeeting;
  }>
> = [
  { label: "Initial", state: "initial" },
  { label: "Matching", state: "matching" },
  { label: "Matched", state: "matched" },
  { label: "Scheduling passive", state: "scheduling" },
  { label: "Booked online", state: "booked", bookedMeeting: bookedMeetingPreview },
  { label: "Booked phone", state: "booked", bookedMeeting: bookedPhoneCallPreview },
];

const mediumAvailableHandoffStates: ReadonlyArray<
  Readonly<{
    label: string;
    state: MediumAvailableHandoffState;
  }>
> = [
  { label: "Available card", state: "initial" },
  { label: "Connecting", state: "connecting" },
  { label: "Connected", state: "connected" },
];

const highValueBookingPanelStates = [
  { label: "Default", state: "default" },
  { label: "Confirming", state: "confirming" },
] as const;

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
          <p className="max-w-2xl text-body-sm-open text-text-meta">
            {description}
          </p>
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
}: Readonly<{
  children: ReactNode;
  className?: string;
  level?: "h3" | "h4";
}>) {
  const Heading = level;
  const headingClassName =
    level === "h3"
      ? "mb-md text-[18px] font-medium leading-6 text-text"
      : "text-body-xs font-medium leading-[1.25] text-text-meta";

  return (
    <Heading
      className={[headingClassName, extraClassName].filter(Boolean).join(" ")}
    >
      {children}
    </Heading>
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

function getSidePanelContextWidthClass(context: ComponentLibraryContext) {
  return context === "mobile"
    ? "w-[var(--component-library-mobile-chat-width)]"
    : context === "expanded"
    ? "w-[var(--design-layout-side-panel-expanded-surface-width)]"
    : "w-[var(--design-layout-side-panel-collapsed-surface-width)]";
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

function SidePanelReferenceFrame({
  context = "collapsed",
  children,
}: Readonly<{
  context?: ComponentLibraryContext;
  children: ReactNode;
}>) {
  return (
    <div
      className={[
        "max-h-[calc(100dvh-8rem)] overflow-hidden border border-border-faint bg-background-neutral-soft",
        context === "mobile"
          ? "h-[var(--component-library-mobile-chat-height)] rounded-none"
          : "h-[48rem] rounded-lg",
        getSidePanelContextWidthClass(context),
      ].join(" ")}
    >
      {children}
    </div>
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

function renderPromptState(state: (typeof promptStates)[number]) {
  if (state === "disabled") {
    return <Prompt disabled prompt="We need to ramp hiring fast this quarter." />;
  }

  return (
    <Prompt
      prompt="We need to ramp hiring fast this quarter."
      tabIndex={-1}
      visualState={state}
    />
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

function SharedHeaderPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedHeaderDemo />
      </PreviewSection>
      <PreviewSection title="Variants">
        <SharedHeaderVariants />
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedMessagesPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedMessagesDemo />
      </PreviewSection>
      <PreviewSection title="Message states">
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>AI assistant</PreviewExampleHeading>
            <ChatThreadReferenceFrame>
              <ChatMessage>I can help compare hiring options quickly.</ChatMessage>
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Member or visitor</PreviewExampleHeading>
            <ChatThreadReferenceFrame>
              <ChatMessage role="user" timestamp="1:04 PM">
                We need to ramp hiring fast this quarter.
              </ChatMessage>
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Live agent</PreviewExampleHeading>
            <ChatThreadReferenceFrame>
              <ChatMessage
                role="representative"
                authorName="David S."
                avatarLabel="David S., Live agent"
                timestamp="9:37 PM"
              >
                Hey Jamie, how can I help you?
              </ChatMessage>
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Thinking and stopped</PreviewExampleHeading>
            <ChatThreadReferenceFrame>
              <ChatThinkingMessage />
              <div className="flex justify-start">
                <ChatInlineFeedback tone="neutral">Response stopped.</ChatInlineFeedback>
              </div>
            </ChatThreadReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Rich content</PreviewExampleHeading>
            <ChatThreadReferenceFrame>
              <ChatMessage>
                <div className="space-y-sm">
                  <p>Here are the fastest next steps:</p>
                  <ul className="list-disc space-y-xs pl-lg">
                    <li>Confirm hiring volume and timeline.</li>
                    <li>Choose whether the team needs sourcing tools.</li>
                    <li>Route complex questions to a live agent.</li>
                  </ul>
                </div>
              </ChatMessage>
            </ChatThreadReferenceFrame>
          </PreviewMoment>
        </PreviewMomentStack>
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

function SharedComposerPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Demo">
        <SharedComposerDemo />
      </PreviewSection>
      <PreviewSection title="Composer states">
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>Empty</PreviewExampleHeading>
            <ChatPanelReferenceFrame>
              <ChatComposer />
            </ChatPanelReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Draft</PreviewExampleHeading>
            <ChatPanelReferenceFrame>
              <ChatComposer
                inputProps={{
                  "aria-label": "Long message draft",
                  defaultValue:
                    "We have several hiring teams moving at different speeds, and I need a path that works for a small pilot now but can still scale.",
                }}
              />
            </ChatPanelReferenceFrame>
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Responding</PreviewExampleHeading>
            <ChatPanelReferenceFrame>
              <ChatComposer isResponding />
            </ChatPanelReferenceFrame>
          </PreviewMoment>
        </PreviewMomentStack>
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
      <PreviewSection title="Prompt examples">
        <ChatThreadReferenceFrame>
          <div className="flex flex-wrap gap-sm">
            <Prompt prompt="We need to ramp hiring fast this quarter." />
            <Prompt prompt="Help me compare Recruiter and Hiring Pro.">
              Compare products
            </Prompt>
          </div>
        </ChatThreadReferenceFrame>
      </PreviewSection>
      <PreviewSection title="Interaction states">
        <div className="flex flex-wrap items-start gap-lg">
          {promptStates.map((state) => (
            <div key={state} className="space-y-sm">
              <p className="text-body-xs text-text-meta">{state}</p>
              {renderPromptState(state)}
            </div>
          ))}
        </div>
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
      <PreviewSection title="Shared pattern">
        <ChatThreadReferenceFrame>
          <RecommendationCard />
        </ChatThreadReferenceFrame>
      </PreviewSection>

      <PreviewSection title="Hiring examples">
        <PreviewMomentStack>
          {highValueMatchCardStates.map(({ label, state, bookedMeeting }) => (
            <PreviewMoment key={`${state}-${label}`}>
              <PreviewExampleHeading>
                Specialist recommendation · {label}
              </PreviewExampleHeading>
              <ChatThreadReferenceFrame>
                <HighValueMatchCardPreview
                  state={state}
                  bookedMeeting={bookedMeeting}
                />
              </ChatThreadReferenceFrame>
            </PreviewMoment>
          ))}
          {mediumAvailableHandoffStates.map(({ label, state }) => (
            <PreviewMoment key={state}>
              <PreviewExampleHeading>
                Live handoff · {label}
              </PreviewExampleHeading>
              <ChatThreadReferenceFrame>
                <MediumAvailableHandoffPreview state={state} />
              </ChatThreadReferenceFrame>
            </PreviewMoment>
          ))}
        </PreviewMomentStack>
      </PreviewSection>

      <PreviewSection title="Premium examples">
        <ChatThreadReferenceFrame>
          <PremiumProductRecommendationCard />
        </ChatThreadReferenceFrame>
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
      <PreviewSection title="LTS hiring microsite">
        <SharedShellHiringMicrositeDemo />
      </PreviewSection>
      <PreviewSection title="Premium survey">
        <SharedShellPremiumSurveyDemo />
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
      <PreviewSection title="LTS microsite examples">
        <PreviewMomentStack>
          {highValueBookingPanelStates.map(({ label, state }) => (
            <PreviewMoment key={state}>
              <PreviewExampleHeading>
                Booking side panel · {label}
              </PreviewExampleHeading>
              <SidePanelReferenceFrame>
                <HighValueSchedulePanelPreview state={state} />
              </SidePanelReferenceFrame>
            </PreviewMoment>
          ))}
        </PreviewMomentStack>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedInterimStatePage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection
        title="Assistant setup"
        description="A reusable neutral state for short delays before a chat, session, or workflow is ready."
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
              showDictationAction={false}
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
        title="Chat inactivity"
        description="A reusable overlay for asking whether someone wants to keep a session open after a quiet period."
      >
        <ChatShellContainerPreview>
          <ChatPanel
            variant="collapsed"
            className="md:!h-full md:!w-full"
          >
            <ChatHeader title="Contact sales" showAiMark />
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
              showDictationAction={false}
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
    <ComponentPageShell item={item} section="Premium">
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
    <ComponentPageShell item={item} section="Premium">
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

function PremiumConciergePanelPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium">
      <PreviewSection title="Demo">
        <PremiumConciergePanelDemo />
      </PreviewSection>
      <PreviewSection title="High-signal transcript">
        <div className="h-[48rem] max-h-[calc(100dvh-8rem)] w-[var(--design-layout-panel-collapsed-width)] overflow-hidden rounded-lg bg-background-neutral-soft">
          <PremiumConciergePanel
            className="md:!h-full"
            flow={premiumConversationFlows.high}
            showCloseAction={false}
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
      <PreviewSection title="States">
        <VcaFabStatesPreview />
      </PreviewSection>
      <PreviewSection title="Visitor and admin marks">
        <VcaFabSwappableMarkPreview />
      </PreviewSection>
    </ComponentPageShell>
  );
}

const pcpAdminInsightResponseExamples = [
  {
    title: "Post amplification",
    insightId: "post-amplification",
  },
  {
    title: "Follower growth",
    insightId: "follower-growth",
  },
  {
    title: "Visitor demographics",
    insightId: "visitor-demographics",
  },
  {
    title: "Content engagement",
    insightId: "content-engagement",
  },
  {
    title: "Weekly synthesis",
    insightId: "weekly-synthesis",
  },
] as const;

function PremiumCompanyPageAiCardsPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium Company Page">
      <PreviewSection
        title="Demo"
        description="Picker for the AI-related PCP cards shown in visitor VCA, admin attention, admin AI response, and inbox context moments."
      >
        <PcpAiCardsDemo />
      </PreviewSection>

      <PreviewSection title="Visitor VCA conversation cards">
        <PreviewMomentStack>
          <PreviewMoment>
            <PreviewExampleHeading>Post proof</PreviewExampleHeading>
            <PcpVcaCaseStudyCardPreview />
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Job preview</PreviewExampleHeading>
            <PcpVcaJobCardPreview />
          </PreviewMoment>
          <PreviewMoment>
            <PreviewExampleHeading>Drafted message handoff</PreviewExampleHeading>
            <PcpVcaHandoffCardPreview />
          </PreviewMoment>
        </PreviewMomentStack>
      </PreviewSection>

      <PreviewSection
        title="Admin attention cards"
        description="The cards and rows from the dashboard's What needs your attention today section."
      >
        <PcpAdminAttentionCardsPreview />
      </PreviewSection>

      <PreviewSection title="Admin AI response cards">
        <PreviewMomentStack>
          {pcpAdminInsightResponseExamples.map(({ insightId, title }) => (
            <PreviewMoment key={insightId}>
              <PreviewExampleHeading>{title}</PreviewExampleHeading>
              <PcpAdminInsightResponseCardPreview insightId={insightId} />
            </PreviewMoment>
          ))}
        </PreviewMomentStack>
      </PreviewSection>

      <PreviewSection
        title="Admin inbox AI context"
        description="Recommended inclusion: this is the downstream context card that explains the Cheri high-intent signal after the dashboard attention card."
      >
        <PcpInboxAiContextStripPreview />
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
        description="These are the real-product onboarding actions that share the same surface and shell. Actions stay inline as blue text links."
      >
        <PcpTodayActionCardsPreview />
      </PreviewSection>

      <PreviewSection
        title="AI insight card catalog"
        description="AI insight cards use the same shell with added provenance, an inline AI Ask action, optional visuals, and signal pills. Audience-fit cards can use paired avatars when the insight is about visitor quality; Tier 2 profile signals use blue."
      >
        <PcpInsightCardSystemPreview />
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
const aggregateAvatarSrcs = [
  "/assets/premium-company-pages/avatar-1.png",
  "/assets/premium-company-pages/avatar-2.png",
  "/assets/premium-company-pages/avatar-3.png",
] as const;
const responseRailPeople = [
  {
    name: pcpCompanyProfile.adminName,
    headline: pcpCompanyProfile.adminTitle,
    followers: "8,412 followers",
    avatarSrc: pcpCompanyProfile.adminAvatarSrc,
  },
  {
    name: "Avery Chen",
    headline: "Head of Carrier Integrations",
    followers: "3,284 followers",
    avatarSrc: "/assets/premium-company-pages/avatar-2.png",
  },
  {
    name: "Marcus Lee",
    headline: "Benefits Implementation Lead",
    followers: "2,981 followers",
    avatarSrc: "/assets/premium-company-pages/avatar-3.png",
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

function RuleTile({
  title,
  children,
}: Readonly<{
  title: string;
  children: ReactNode;
}>) {
  return (
    <div className="rounded-sm border border-border-faint bg-background p-lg">
      <h3 className="text-body-sm font-medium text-text">{title}</h3>
      <p className="mt-xs text-body-sm-open text-text-meta">{children}</p>
    </div>
  );
}

function ResponseSystemGrammarExample() {
  return (
    <div className="grid gap-xl lg:grid-cols-2">
      <div className="space-y-lg">
        <RuleTile title="Insight">
          A plain-language takeaway opens the response. It is always a Text
          block.
        </RuleTile>
        <RuleTile title="Evidence">
          Two or three structured blocks prove the claim without turning the
          answer into a dashboard.
        </RuleTile>
        <RuleTile title="Action">
          The final block gives the next move. For non-terminal turns, that is
          Chips.
        </RuleTile>
      </div>
      <ResponseSystemStack>
        <ResponseText tone="insight">
          Follower growth dropped 18% this month because Velora went quiet after
          a strong open enrollment post.
        </ResponseText>
        <ResponseMetricWithTrend
          annotation={followerGrowthTrendAnnotation}
          axisTicks={followerGrowthAxisTicks}
          delta="18%"
          deltaContext="vs last month"
          title="Follower growth"
          tone="negative"
          unit="new followers this month"
          value="+86"
          values={followerGrowthTrendValues}
        />
        <ResponseChips
          prompts={[
            "What should I post this week?",
            "Which content drove follows?",
          ]}
        />
      </ResponseSystemStack>
    </div>
  );
}

function ResponseSystemRules() {
  return (
    <div className="grid gap-md md:grid-cols-2 lg:grid-cols-4">
      <RuleTile title="Open with Text">
        Every response starts with the insight in prose before evidence appears.
      </RuleTile>
      <RuleTile title="Keep evidence small">
        Use two or three evidence blocks per turn. Prefer a crisp stack over a
        dense report.
      </RuleTile>
      <RuleTile title="Advice stays in Text">
        Recommendations are the agent&apos;s opinion. Render them as prose or a
        light numbered list, not as a separate evidence card.
      </RuleTile>
      <RuleTile title="Never nest blocks">
        Metric, Trend, Compare, ContentList, Entity, Draft, and Chips stay as
        siblings.
      </RuleTile>
      <RuleTile title="Respect audience">
        Visitors get Text, Draft, and relevant public entities. Admins get the
        full block library.
      </RuleTile>
    </div>
  );
}

function ResponseSystemBlockCatalog() {
  return (
    <PreviewMomentStack>
      <PreviewMoment>
        <PreviewExampleHeading>Text</PreviewExampleHeading>
        <p className="max-w-[var(--design-layout-panel-collapsed-width)] text-body-sm text-text-meta">
          Text carries the agent&apos;s opinion, including light numbered
          recommendations. Data and evidence move into blocks.
        </p>
        <ResponseSystemStack>
          <ResponseText tone="insight">
            <p>
              Benefits leaders are finding Velora, but the Page needs a clearer
              weekly content rhythm.
            </p>
            <ResponseTextRecommendationList
              items={[
                {
                  action: "Post 3x this week",
                  reason: "even short posts keep Velora in the feed.",
                },
                {
                  action: "Lead with open enrollment deadlines",
                  reason: "that is what brought your strongest visitors.",
                },
                {
                  action: "Re-run the top post",
                  reason: "it is still the strongest performer.",
                },
              ]}
            />
          </ResponseText>
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Metric</PreviewExampleHeading>
        <ResponseSystemStack>
          <ResponseMetric
            title="Monthly summary"
            items={[
              {
                value: "312",
                label: "Visitors",
                delta: "18",
                deltaContext: "vs last month",
                tone: "negative",
              },
              {
                value: "29",
                label: "New followers",
                delta: "11%",
                deltaContext: "vs last week",
                tone: "negative",
              },
              {
                value: "48,218",
                label: "Follower total",
                delta: "29",
                deltaContext: "this week",
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
            value="+86"
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
        <PreviewExampleHeading>AudienceFit</PreviewExampleHeading>
        <p className="max-w-[var(--design-layout-panel-collapsed-width)] text-body-sm text-text-meta">
          AudienceFit summarizes which visitor groups are showing up after the
          agent explains the main audience-match signal.
        </p>
        <ResponseSystemStack>
          <ResponseAudienceFit
            avatars={[
              {
                label: "Priya Shah",
                src: "/assets/premium-company-pages/avatar-3.png",
              },
              {
                label: "Dana Kim",
                src: "/assets/premium-company-pages/avatar-2.png",
              },
              {
                label: "Morgan Lee",
                src: "/assets/premium-company-pages/avatar-1.png",
              },
            ]}
            segments={[
              {
                label: "HR leaders",
                detail: "Largest viewer group",
                value: "38%",
              },
              {
                label: "Benefits operations",
                detail: "Viewed readiness content",
                value: "16%",
              },
              {
                label: "People operations",
                detail: "Growing share of Page viewers",
                value: "10%",
              },
            ]}
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
                  { label: "Engagement rate", value: "4.8%" },
                  { label: "Impressions", value: "1,688" },
                ],
              },
              {
                title: "Carrier file readiness checklist for open enrollment",
                thumbnailSrc:
                  "/assets/premium-company-pages/member/post-image-2.png",
                thumbnailAlt: "Open enrollment checklist post preview",
                metrics: [
                  { label: "Engagement rate", value: "4.2%" },
                  { label: "Impressions", value: "1,204" },
                ],
              },
            ]}
            title="Posts"
          />
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Draft</PreviewExampleHeading>
        <ResponseSystemStack>
          <ResponseDraft
            message={pcpVcaScenario.handoffMessage}
            recipient={`To ${pcpCompanyProfile.adminName} at ${pcpCompanyProfile.name}`}
          />
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Chips</PreviewExampleHeading>
        <ResponseSystemStack>
          <ResponseChips
            prompts={[
              "Why did followers drop?",
              "Show me competitor content",
              "Draft the Cheri story",
            ]}
          />
        </ResponseSystemStack>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>ResponseRail + identity cards</PreviewExampleHeading>
        <p className="max-w-[var(--design-layout-panel-collapsed-width)] text-body-sm text-text-meta">
          ResponseRail is the reusable horizontal-scroll wrapper for future
          multi-card responses. PersonCard and PageIdentityCard are the first
          card types using it.
        </p>
        <div className="grid gap-lg xl:grid-cols-3">
          <div className="space-y-sm">
            <PreviewExampleHeading level="h4">
              Collapsed chat width
            </PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseRail
                aria-label="People on this Page"
                title={
                  <>
                    <Icon name="people" size="small" />
                    <span>People on this Page</span>
                  </>
                }
              >
                {responseRailPeople.map((person) => (
                  <ResponsePersonCard
                    avatarSrc={person.avatarSrc}
                    followers={person.followers}
                    headline={person.headline}
                    key={person.name}
                    name={person.name}
                  />
                ))}
              </ResponseRail>
            </ChatThreadReferenceFrame>
          </div>
          <div className="space-y-sm">
            <PreviewExampleHeading level="h4">
              Expanded chat width
            </PreviewExampleHeading>
            <ChatThreadReferenceFrame context="expanded">
              <ResponseRail
                aria-label="People on this Page"
                title={
                  <>
                    <Icon name="people" size="small" />
                    <span>People on this Page</span>
                  </>
                }
              >
                {responseRailPeople.map((person) => (
                  <ResponsePersonCard
                    avatarSrc={person.avatarSrc}
                    followers={person.followers}
                    headline={person.headline}
                    key={person.name}
                    name={person.name}
                  />
                ))}
              </ResponseRail>
            </ChatThreadReferenceFrame>
          </div>
          <div className="space-y-sm">
            <PreviewExampleHeading level="h4">
              Page identity card
            </PreviewExampleHeading>
            <ChatThreadReferenceFrame context="collapsed">
              <ResponseRail
                aria-label="Page identity"
                title={
                  <>
                    <Icon name="company" size="small" />
                    <span>Page identity</span>
                  </>
                }
              >
                <ResponsePageIdentityCard
                  followers={pcpCompanyProfile.followers}
                  industry={pcpCompanyProfile.industry}
                  logoSrc={pcpCompanyProfile.logoSrc}
                  name={pcpCompanyProfile.name}
                />
              </ResponseRail>
            </ChatThreadReferenceFrame>
          </div>
        </div>
      </PreviewMoment>
    </PreviewMomentStack>
  );
}

function ResponseEntityActionPairs() {
  return (
    <PreviewMomentStack>
      <PreviewMoment>
        <PreviewExampleHeading>Post</PreviewExampleHeading>
        <p className="max-w-[var(--design-layout-panel-collapsed-width)] text-body-sm text-text-meta">
          Compact is for admin recognize-and-act reference contexts. Full Post
          is for visitor reading contexts.
        </p>
        <div className="grid gap-lg xl:grid-cols-3">
          <div className="space-y-sm">
            <PreviewExampleHeading level="h4">Full visitor</PreviewExampleHeading>
            <ResponseEntity
              actions={[{ label: "View post" }, { label: "Follow" }]}
              audience="visitor"
              commentCount="3"
              engagement="134"
              followerCount={pcpCompanyProfile.followers}
              logoSrc={pcpCompanyProfile.logoSrc}
              name={pcpCompanyProfile.name}
              previewImageSrc={postPreviewImageSrc}
              repostCount="3"
              snippet={pcpProofSnippets.postSummary}
              timestamp="3d"
              variant="post"
            />
          </div>
          <div className="space-y-sm">
            <PreviewExampleHeading level="h4">Full admin</PreviewExampleHeading>
            <ResponseEntity
              actions={[
                { label: "Boost", icon: "trending" },
                { label: "Replicate" },
                { label: "View" },
              ]}
              audience="admin"
              commentCount="3"
              engagement="134"
              followerCount={pcpCompanyProfile.followers}
              logoSrc={pcpCompanyProfile.logoSrc}
              name={pcpCompanyProfile.name}
              previewImageSrc={postPreviewImageSrc}
              reactions={["like", "support", "interest"]}
              repostCount="3"
              snippet={pcpProofSnippets.postSummary}
              timestamp="3d"
              variant="post"
            />
          </div>
          <div className="space-y-sm">
            <PreviewExampleHeading level="h4">
              Compact reference
            </PreviewExampleHeading>
            <ResponsePostCompact
              author={benefitHubName}
              meta="421 reactions · 1w"
              text="5 things to lock down before open enrollment opens. Number 4 is the one…"
              thumbnailAlt={`${benefitHubName} checklist post thumbnail`}
              thumbnailSrc={postPreviewImageSrc}
            />
          </div>
        </div>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Job</PreviewExampleHeading>
        <div className="grid gap-lg lg:grid-cols-2">
          <ResponseEntity
            actions={[{ label: "Apply" }, { label: "Save" }]}
            alumni="1,412 school alumni work here"
            alumniImageSrc={schoolAlumniImageSrc}
            audience="visitor"
            company={pcpCompanyProfile.name}
            location="San Francisco, CA"
            logoSrc={pcpCompanyProfile.logoSrc}
            name="Senior Benefits Implementation Consultant"
            title="Senior Benefits Implementation Consultant"
            variant="job"
          />
          <ResponseEntity
            actions={[{ label: "Promote job" }, { label: "Share as post" }]}
            alumni="1,412 school alumni work here"
            alumniImageSrc={schoolAlumniImageSrc}
            audience="admin"
            company={pcpCompanyProfile.name}
            location="San Francisco, CA"
            logoSrc={pcpCompanyProfile.logoSrc}
            name="Senior Benefits Implementation Consultant"
            title="Senior Benefits Implementation Consultant"
            variant="job"
          />
        </div>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Person</PreviewExampleHeading>
        <div className="grid gap-lg lg:grid-cols-2">
          <RuleTile title="Visitor side">
            Person cards do not render for visitors. The visitor experience uses
            Text and Draft, plus public Post, Job, Company, Event, or Page people
            summaries.
          </RuleTile>
          <ResponseEntity
            actions={[{ label: "View message" }, { label: "Profile" }]}
            audience="admin"
            avatarSrc={cheriAvatarSrc}
            connectionDegree="1st"
            headline="VP of HR · Arbor Retail Group"
            name={pcpVisitorPersona.name}
            signal={{
              tier: "tier-1",
              label: "High intent",
              quote:
                "I'm exploring Velora for HR and benefits operations after seeing the Arbor Retail Group post.",
              detail: pcpAdminScenario.leadSummary,
            }}
            variant="person"
          />
        </div>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Company</PreviewExampleHeading>
        <div className="grid gap-lg lg:grid-cols-2">
          <ResponseEntity
            actions={[{ label: "Follow" }, { label: "View page" }]}
            audience="visitor"
            category="Benefits administration software"
            followerCount="48,218 followers"
            logoSrc={pcpCompanyProfile.logoSrc}
            name={pcpCompanyProfile.name}
            variant="company"
          />
          <ResponseEntity
            actions={[
              { label: "See what's working" },
              { label: "View page" },
            ]}
            audience="admin"
            category="Benefits administration software"
            followerCount="82 new followers"
            name={benefitHubName}
            stats={[
              { label: "Posts per week", value: "5" },
              { label: "New followers", value: "82" },
              { label: "Comments per day", value: "18" },
            ]}
            variant="company"
          />
        </div>
      </PreviewMoment>

      <PreviewMoment>
        <PreviewExampleHeading>Event</PreviewExampleHeading>
        <div className="grid gap-lg lg:grid-cols-2">
          <ResponseEntity
            actions={[{ label: "Attend" }, { label: "View event" }]}
            attendance="1,284 attendees"
            audience="visitor"
            date={{ month: "JUN", day: "24" }}
            name="Open enrollment carrier coordination workshop"
            variant="event"
          />
          <ResponseEntity
            actions={[{ label: "Promote" }, { label: "Share" }]}
            attendance="1,284 attendees"
            audience="admin"
            date={{ month: "JUN", day: "24" }}
            name="Open enrollment carrier coordination workshop"
            variant="event"
          />
        </div>
      </PreviewMoment>
    </PreviewMomentStack>
  );
}

function VisitorSignalTierExamples() {
  return (
    <div className="grid gap-lg lg:grid-cols-3">
      <ResponseEntity
        actions={[{ label: "View message" }, { label: "Profile" }]}
        audience="admin"
        avatarSrc={cheriAvatarSrc}
        connectionDegree="1st"
        headline="VP of HR · Arbor Retail Group"
        name="Cheri Sparks"
        signal={{
          tier: "tier-1",
          label: "Tier 1 · High intent",
          quote:
            "I'm exploring Velora for HR and benefits operations after seeing the Arbor Retail Group post.",
          detail: "Amber signal: she did something.",
        }}
        variant="person"
      />
      <ResponseEntity
        actions={[
          { label: "View profile" },
          { label: "See what they viewed" },
        ]}
        audience="admin"
        connectionDegree="2nd"
        headline="Director, Benefits · Northstar Health"
        name="Priya Shah"
        signal={{
          tier: "tier-2",
          label: "Tier 2 · Strong fit",
          detail:
            "Blue signal: he matches the ICP, but has not taken an outreach-worthy action.",
        }}
        variant="person"
      />
      <ResponseEntity
        actions={[{ label: "Break down by role" }]}
        audience="admin"
        headline="Aggregate visitor pattern"
        name="Benefits leaders"
        signal={{
          tier: "tier-3",
          label: "Tier 3 · Aggregate",
          count: "43 visitors",
          avatars: aggregateAvatarSrcs,
          detail:
            "64% of people who viewed your Page are in HR, benefits, or people operations roles.",
        }}
        variant="person"
      />
    </div>
  );
}

function StoryCompositionExamples() {
  return (
    <div className="grid gap-xl lg:grid-cols-2">
      <ResponseSystemStack>
        <PreviewExampleHeading>Story 1a · Anomaly</PreviewExampleHeading>
        <ResponseText tone="insight">
          Follower growth dropped 18% — here&apos;s why.
        </ResponseText>
        <ResponseMetricWithTrend
          annotation={followerGrowthTrendAnnotation}
          axisTicks={followerGrowthAxisTicks}
          delta="18%"
          deltaContext="vs last month"
          title="Follower growth"
          tone="negative"
          unit="new followers this month"
          value="+86"
          values={followerGrowthTrendValues}
        />
        <ResponseChips prompts={["What changed?", "What should I post?"]} />
      </ResponseSystemStack>

      <ResponseSystemStack>
        <PreviewExampleHeading>Story 3 · Lead arrives</PreviewExampleHeading>
        <ResponseEntity
          actions={[{ label: "View message" }, { label: "Profile" }]}
          audience="admin"
          avatarSrc={cheriAvatarSrc}
          connectionDegree="1st"
          headline="VP of HR · Arbor Retail Group"
          name={pcpVisitorPersona.name}
          signal={{
            tier: "tier-1",
            label: "High intent",
            quote:
              "I'm exploring Velora for HR and benefits operations after seeing the Arbor Retail Group post.",
          }}
          variant="person"
        />
        <ResponseText>
          Cheri viewed Velora&apos;s Arbor Retail Group post, explored whether
          Velora is relevant for HR and benefits operations, and sent Rose a
          drafted message.
        </ResponseText>
        <ResponseDraft
          message={pcpAdminScenario.suggestedReply}
          recipient={`Reply to ${pcpVisitorPersona.name}`}
        />
        <ResponseChips
          prompts={["Prep Rose for the reply", "Draft a follow-up post"]}
        />
      </ResponseSystemStack>
    </div>
  );
}

function PremiumCompanyPageResponseSystemPage({
  item,
}: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium Company Page">
      <PreviewSection
        title="Insight → Evidence → Action"
        description="The composition grammar every PCP VCA response follows."
      >
        <ResponseSystemGrammarExample />
      </PreviewSection>

      <PreviewSection title="System rules">
        <ResponseSystemRules />
      </PreviewSection>

      <PreviewSection
        title="Block catalog"
        description="Each block is shown as a standalone response unit assembled from existing primitives and tokens."
      >
        <ResponseSystemBlockCatalog />
      </PreviewSection>

      <PreviewSection
        title="Entity variants"
        description="The same entity anatomy supports visitor and admin contexts; only the action row changes."
      >
        <ResponseEntityActionPairs />
      </PreviewSection>

      <PreviewSection
        title="Visitor signal tiers"
        description="Tier 1 stays amber, Tier 2 is blue, and Tier 3 is aggregate-only."
      >
        <VisitorSignalTierExamples />
      </PreviewSection>

      <PreviewSection
        title="Story compositions"
        description="Full response stacks using the source-system grammar without nested blocks."
      >
        <StoryCompositionExamples />
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
    case "shared-feedback":
      return <SharedFeedbackPage item={item} />;
    case "shared-composer":
      return <SharedComposerPage item={item} />;
    case "shared-prompts":
      return <SharedPromptsPage item={item} />;
    case "shared-action-card":
      return <SharedActionCardPage item={item} />;
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
    case "premium-concierge-panel":
      return <PremiumConciergePanelPage item={item} />;
    case "premium-company-page-vca-fab":
      return <PremiumCompanyPageVcaFabPage item={item} />;
    case "premium-company-page-ai-cards":
      return <PremiumCompanyPageAiCardsPage item={item} />;
    case "premium-company-page-insight-cards":
      return <PremiumCompanyPageInsightCardsPage item={item} />;
    case "premium-company-page-response-system":
      return <PremiumCompanyPageResponseSystemPage item={item} />;
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
    case "sdui-icon":
      return <SduiIconPage item={item} />;
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
    case "sdui-presence-badge":
      return <SduiPresenceBadgePage item={item} />;
    case "sdui-progress-indicator-circular":
      return <SduiProgressIndicatorCircularPage item={item} />;
    default:
      return null;
  }
}
