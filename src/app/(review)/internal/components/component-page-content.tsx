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
import { Tag } from "@/components/primitives/tag";
import { TabItemHorizontal } from "@/components/primitives/tab-item-horizontal";
import { TextArea } from "@/components/primitives/text-area";
import { TextInput } from "@/components/primitives/text-input";

import {
  PremiumConciergePanelDemo,
  PremiumFabDemo,
  PremiumFabReviewPreview,
  PremiumPlanCardDemo,
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
      <PreviewSection title="Swappable mark">
        <VcaFabSwappableMarkPreview />
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
