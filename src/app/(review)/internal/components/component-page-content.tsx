import Image from "next/image";
import type { ReactNode } from "react";

import {
  ChatComposer,
  ChatFeedbackReasonChips,
  ChatHeader,
  ChatInlineFeedback,
  ChatMessage,
  ChatMessageFeedback,
  ChatMessageFeedbackFlow,
  ChatPanelPreview,
  ChatThinkingMessage,
  ChatTray,
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
  premiumPromptLabels,
  premiumPromptRowsBySurveyStep,
} from "@/components/premium";
import { PremiumConciergePanel } from "@/components/premium/premium-concierge-panel";
import { PremiumProductRecommendationCard } from "@/components/premium/premium-product-recommendation-card";
import { premiumBusinessSuitePlan } from "@/components/premium/premium-plan-data";
import {
  PremiumPlanCard,
  PremiumProfileMark,
  PremiumProgressIndicator,
} from "@/components/premium/premium-survey-components";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, iconMetadata } from "@/components/primitives/icon";
import { Pill } from "@/components/primitives/pill";
import { Tag } from "@/components/primitives/tag";
import { TextArea } from "@/components/primitives/text-area";
import { TextInput } from "@/components/primitives/text-input";
import {
  HIRING_CONCIERGE_TITLE,
  PREMIUM_CONCIERGE_TITLE,
} from "@/lib/concierge-copy";

import {
  PremiumFabReviewPreview,
  PremiumSurveyOptionReviewPreview,
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
const iconExamples = [
  "add",
  "check",
  "close",
  "search",
  "send",
  "voice",
  "magic-wand",
  "signal-ai",
  "signal-success",
  "signal-error",
  "link-external",
] as const;
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
    <header className="space-y-sm border-b border-border-faint pb-xxxl">
      <h1 className="text-display-md text-text">{title}</h1>
      <p className="max-w-3xl text-body-sm-open text-text-meta">
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
    <section className="space-y-lg border-t border-border-faint pt-xxxl first:border-t-0 first:pt-0">
      <div className="space-y-xs">
        <h2 className="text-heading-xl text-text">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-body-sm-open text-text-meta">
            {description}
          </p>
        ) : null}
      </div>
      {children}
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
      <h3 className="text-heading-md text-text">{title}</h3>
      {description ? (
        <p className="text-body-xs text-text-meta">{description}</p>
      ) : null}
      {children}
    </section>
  );
}

function Frame({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={[
        "rounded-lg border border-border-faint bg-background p-panel-padding",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
      <PreviewSection title="Header variants">
        <div className="space-y-sm">
          <div className="overflow-hidden rounded-t-md border border-border-faint bg-background">
            <ChatHeader title={HIRING_CONCIERGE_TITLE} />
          </div>
          <div className="overflow-hidden rounded-t-md border border-border-faint bg-background">
            <ChatHeader title={PREMIUM_CONCIERGE_TITLE} />
          </div>
          <div className="overflow-hidden rounded-t-md border border-border-faint bg-background">
            <ChatHeader
              identity={{
                type: "representative",
                name: "David S.",
                role: "Sales consultant",
              }}
            />
          </div>
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedMessagesPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Message states">
        <Frame>
          <div className="space-y-xl">
            <section className="space-y-sm">
              <p className="text-body-xs text-text-meta">AI assistant</p>
              <ChatMessage>I can help compare hiring options quickly.</ChatMessage>
              <div className="flex justify-start">
                <ChatMessageFeedback timestamp="1:00 PM" />
              </div>
            </section>
            <section className="space-y-sm">
              <p className="text-body-xs text-text-meta">Interactive AI feedback</p>
              <ChatMessage>
                I would compare the lighter hiring path against Recruiter before routing you to sales.
              </ChatMessage>
              <ChatMessageFeedbackFlow timestamp="1:01 PM" />
            </section>
            <section className="space-y-sm">
              <p className="text-body-xs text-text-meta">Feedback result states</p>
              <div className="space-y-xs">
                <ChatMessage>A sales consultant can narrow the setup fast.</ChatMessage>
                <div className="flex justify-start">
                  <ChatMessageFeedback value="thumbs-down" timestamp="1:03 PM" />
                </div>
                <div className="flex justify-start">
                  <ChatFeedbackReasonChips value="confusing" />
                </div>
              </div>
            </section>
            <section className="space-y-sm">
              <p className="text-body-xs text-text-meta">User</p>
              <ChatMessage role="user" timestamp="1:04 PM">
                We need to ramp hiring fast this quarter.
              </ChatMessage>
            </section>
            <section className="space-y-sm">
              <p className="text-body-xs text-text-meta">Human representative</p>
              <ChatMessage
                role="representative"
                authorName="David S."
                avatarLabel="David S., Human representative"
                timestamp="9:37 PM"
              >
                Hey Jamie, how can I help you?
              </ChatMessage>
            </section>
            <section className="space-y-sm">
              <p className="text-body-xs text-text-meta">Thinking and stopped</p>
              <ChatThinkingMessage />
              <div className="flex justify-start">
                <ChatInlineFeedback tone="neutral">Response stopped.</ChatInlineFeedback>
              </div>
            </section>
            <section className="space-y-sm">
              <p className="text-body-xs text-text-meta">Rich content</p>
              <ChatMessage>
                <div className="space-y-sm">
                  <p>Here are the fastest next steps:</p>
                  <ul className="list-disc space-y-xs pl-lg">
                    <li>Confirm hiring volume and timeline.</li>
                    <li>Choose whether the team needs sourcing tools.</li>
                    <li>Route complex questions to a representative.</li>
                  </ul>
                </div>
              </ChatMessage>
            </section>
          </div>
        </Frame>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedComposerPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Composer states">
        <Frame>
          <div className="space-y-md">
            <ChatComposer className="px-0 pb-0" />
            <ChatComposer
              className="px-0 pb-0"
              inputProps={{
                "aria-label": "Long message draft",
                defaultValue:
                  "We have several hiring teams moving at different speeds, and I need a path that works for a small pilot now but can still scale.",
              }}
            />
            <ChatComposer className="px-0 pb-0" isResponding />
          </div>
        </Frame>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedPromptsPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Prompt examples">
        <Frame>
          <div className="flex flex-wrap gap-sm">
            <Prompt prompt="We need to ramp hiring fast this quarter." />
            <Prompt prompt="Help me compare Recruiter and Hiring Pro.">
              Compare products
            </Prompt>
          </div>
        </Frame>
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

function SharedRecommendationPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Recommendation card">
        <Frame className="max-w-[28rem]">
          <RecommendationCard />
        </Frame>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SharedShellPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Shared">
      <PreviewSection title="Panel and tray versions">
        <div className="space-y-xl">
          <div className="space-y-sm">
            <p className="text-body-xs text-text-meta">Default shell</p>
            <div className="overflow-x-auto px-xl pb-xxxl pt-md">
              <ChatPanelPreview variant="collapsed" />
            </div>
          </div>
          <div className="space-y-sm">
            <p className="text-body-xs text-text-meta">Tray shell</p>
            <div className="flex justify-end rounded-lg border border-border-faint bg-background-neutral-soft p-xl">
              <ChatTray />
            </div>
          </div>
          <div className="space-y-sm">
            <p className="text-body-xs text-text-meta">Tray shell with representative badge</p>
            <div className="flex justify-end rounded-lg border border-border-faint bg-background-neutral-soft p-xl">
              <ChatTray
                badge
                identity={{
                  type: "representative",
                  name: "David S.",
                  role: "Sales consultant",
                }}
              />
            </div>
          </div>
          <div className="space-y-sm">
            <p className="text-body-xs text-text-meta">Wide shell</p>
            <div className="overflow-x-auto px-xl pb-xxxl pt-md">
              <ChatPanelPreview variant="expanded" />
            </div>
          </div>
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function HiringSpecialistPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Hiring">
      <PreviewSection title="Card states">
        <div className="grid gap-xl md:grid-cols-2">
          {highValueMatchCardStates.map(({ label, state, bookedMeeting }) => (
            <div key={`${state}-${label}`} className="space-y-sm">
              <p className="text-body-xs text-text-meta">{label}</p>
              <HighValueMatchCardPreview state={state} bookedMeeting={bookedMeeting} />
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function HiringLiveHandoffPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Hiring">
      <PreviewSection title="Live handoff states">
        <div className="grid gap-xl md:grid-cols-2 xl:grid-cols-3">
          {mediumAvailableHandoffStates.map(({ label, state }) => (
            <div key={state} className="space-y-sm">
              <p className="text-body-xs text-text-meta">{label}</p>
              <MediumAvailableHandoffPreview state={state} />
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function HiringBookingSidePanelPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Hiring">
      <PreviewSection title="Booking panel states">
        <div className="space-y-xl">
          {highValueBookingPanelStates.map(({ label, state }) => (
            <div key={state} className="space-y-sm">
              <p className="text-body-xs text-text-meta">{label}</p>
              <div className="h-[48rem] max-h-[calc(100dvh-8rem)] max-w-[54rem] overflow-hidden rounded-lg border border-border-faint bg-background-neutral-soft">
                <HighValueSchedulePanelPreview state={state} />
              </div>
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumSurveyEntryPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium">
      <PreviewSection title="Entry affordances">
        <div className="grid gap-xl lg:grid-cols-2">
          <PreviewCard title="Floating entry point">
            <PremiumFabReviewPreview />
          </PreviewCard>
          <PreviewCard title="Profile mark">
            <Frame className="flex min-h-28 items-center">
              <PremiumProfileMark />
            </Frame>
          </PreviewCard>
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumSurveyOptionPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium">
      <PreviewSection title="Survey option states">
        <Frame>
          <PremiumSurveyOptionReviewPreview />
        </Frame>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumProgressPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium">
      <PreviewSection title="Progress indicator">
        <Frame className="flex">
          <PremiumProgressIndicator progress={60} />
        </Frame>
      </PreviewSection>
      <PreviewSection title="Premium prompt rows">
        <Frame>
          <div className="grid gap-md md:grid-cols-3">
            {(["use-case", "goals", "plans"] as const).map((step) => (
              <div key={step} className="space-y-sm">
                <p className="text-body-xs capitalize text-text-meta">
                  {step.replace("-", " ")}
                </p>
                <div className="flex flex-wrap gap-sm">
                  {premiumPromptRowsBySurveyStep[step].map((promptId) => (
                    <Prompt
                      key={promptId}
                      prompt={premiumPromptLabels[promptId]}
                      tabIndex={-1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Frame>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumProductCardPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium">
      <PreviewSection title="In-chat recommendation card">
        <Frame className="max-w-[28rem]">
          <PremiumProductRecommendationCard />
        </Frame>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumPlanCardPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium">
      <PreviewSection title="Plan comparison card">
        <div className="max-w-[28rem]">
          <PremiumPlanCard plan={premiumBusinessSuitePlan} />
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function PremiumConciergePanelPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="Premium">
      <PreviewSection title="High-signal transcript">
        <div className="h-[48rem] max-h-[calc(100dvh-8rem)] overflow-hidden rounded-lg border border-border-faint bg-background-neutral-soft p-md">
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

function SduiButtonPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Button states">
        <div className="space-y-8">
          {buttonSizes.map(({ label, size }) => (
            <section key={size} className="space-y-6">
              <h2 className="text-heading-md text-text">{label}</h2>
              {buttonRows.map(({ label: rowLabel, variant }) => (
                <div key={`${size}-${variant}`} className="space-y-sm">
                  <p className="text-body-xs text-text-meta">{rowLabel}</p>
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
      <PreviewSection title="Brand CTA">
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

function SduiPillPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Pill states">
        <div className="space-y-8">
          {[
            { label: "Unchecked", checked: false },
            { label: "Checked", checked: true },
          ].map(({ label, checked }) => (
            <section key={label} className="space-y-4">
              <h2 className="text-heading-md text-text">{label}</h2>
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
      <PreviewSection title="Common icons">
        <div className="flex flex-wrap items-center gap-md text-text-meta">
          {iconExamples.map((name) => (
            <Icon key={name} name={name} />
          ))}
        </div>
      </PreviewSection>
      <PreviewSection title={`Catalog (${iconMetadata.length})`}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7.75rem,1fr))] gap-sm text-text-meta">
          {iconMetadata.map((icon) => (
            <div
              key={icon.name}
              className="flex min-h-[5rem] flex-col items-center justify-center gap-sm rounded-sm border border-border-faint bg-background px-sm py-md text-center"
            >
              <Icon name={icon.name} />
              <span className="max-w-full break-words text-body-xs leading-[1.2] text-text-meta">
                {icon.label}
              </span>
            </div>
          ))}
        </div>
      </PreviewSection>
    </ComponentPageShell>
  );
}

function SduiEntityPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Entity sizes">
        <div className="space-y-8">
          {([
            { label: "Circle", shape: "circle" },
            { label: "Square", shape: "square" },
          ] as const).map(({ label, shape }) => (
            <section key={shape} className="space-y-4">
              <h2 className="text-heading-md text-text">{label}</h2>
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
      <PreviewSection title="Button icon states">
        <div className="space-y-8">
          {buttonSizes.map(({ label, size }) => (
            <section key={size} className="space-y-6">
              <h2 className="text-heading-md text-text">{label}</h2>
              {buttonRows.map(({ label: rowLabel, variant }) => (
                <div key={`${size}-${variant}`} className="space-y-sm">
                  <p className="text-body-xs text-text-meta">{rowLabel}</p>
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

function SduiGhostIconButtonPage({ item }: Readonly<{ item: ComponentNavItem }>) {
  return (
    <ComponentPageShell item={item} section="SDUI Reference">
      <PreviewSection title="Ghost icon button states">
        <div className="grid gap-lg lg:grid-cols-2">
          {(["small", "medium"] as const).map((size) => (
            <section key={size} className="space-y-4">
              <h2 className="text-heading-md capitalize text-text">{size}</h2>
              {[
                { label: "Padded", horizontalPadding: true },
                { label: "Compact", horizontalPadding: false },
              ].map(({ label, horizontalPadding }) => (
                <div key={`${size}-${label}`} className="space-y-sm">
                  <p className="text-body-xs text-text-meta">{label}</p>
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
      <PreviewSection title="Text input variants">
        <div className="grid gap-xl lg:grid-cols-2">
          {textInputSizes.map(({ label, size }) => (
            <div key={size} className="space-y-lg">
              <h2 className="text-heading-md text-text">{label}</h2>
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
              <h2 className="text-heading-md text-text">{label}</h2>
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
      <PreviewSection title="Text area variants">
        <div className="grid gap-xl lg:grid-cols-2">
          {textInputSizes.map(({ label, size }) => (
            <div key={size} className="space-y-lg">
              <h2 className="text-heading-md text-text">{label}</h2>
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
      <PreviewSection title="Tag tones">
        <div className="space-y-8">
          {tagSizes.map(({ label, size }) => (
            <section key={size} className="space-y-4">
              <h2 className="text-heading-md text-text">{label}</h2>
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
    case "shared-composer":
      return <SharedComposerPage item={item} />;
    case "shared-prompts":
      return <SharedPromptsPage item={item} />;
    case "shared-recommendation-card":
      return <SharedRecommendationPage item={item} />;
    case "hiring-specialist-recommendation":
      return <HiringSpecialistPage item={item} />;
    case "hiring-live-handoff":
      return <HiringLiveHandoffPage item={item} />;
    case "hiring-booking-side-panel":
      return <HiringBookingSidePanelPage item={item} />;
    case "premium-survey-entry":
      return <PremiumSurveyEntryPage item={item} />;
    case "premium-survey-option":
      return <PremiumSurveyOptionPage item={item} />;
    case "premium-progress-indicator":
      return <PremiumProgressPage item={item} />;
    case "premium-product-recommendation-card":
      return <PremiumProductCardPage item={item} />;
    case "premium-plan-card":
      return <PremiumPlanCardPage item={item} />;
    case "premium-concierge-panel":
      return <PremiumConciergePanelPage item={item} />;
    case "sdui-button":
      return <SduiButtonPage item={item} />;
    case "sdui-button-icon":
      return <SduiButtonIconPage item={item} />;
    case "sdui-ghost-icon-button":
      return <SduiGhostIconButtonPage item={item} />;
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
    default:
      return null;
  }
}
