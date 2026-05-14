import type { Metadata } from "next";
import Image from "next/image";

import {
  ChatComposer,
  ChatFeedbackReasonChips,
  ChatHeader,
  ChatInlineFeedback,
  ChatMessage,
  ChatMessageFeedback,
  ChatMessageFeedbackFlow,
  ChatPanelPreview,
  ChatTray,
  ChatThinkingMessage,
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
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Component Library",
  description:
    "Internal component library for the VCA AI concierge primitives, chat UI, and review surfaces.",
  robots: {
    index: false,
    follow: false,
  },
});

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

const iconExamples = [
  "add",
  "check",
  "close",
  "search",
  "send",
  "magic-wand",
  "signal-ai",
  "signal-success",
  "signal-error",
  "link-external",
] as const;

const entitySizes = [160, 128, 96, 80, 64, 48, 40, 32, 24, 16] as const;

const ghostIconButtonStates = [
  "default",
  "hover",
  "active",
  "disabled",
  "loading",
] as const;

const textInputSizes = [
  { label: "Small", size: "small" },
  { label: "Large", size: "large" },
] as const;

const textInputStates = ["default", "hover", "active"] as const;

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

const promptStates = [
  "default",
  "hover",
  "active",
  "focus-visible",
  "disabled",
] as const;

const pillStates = [
  "default",
  "hover",
  "active",
  "focus-visible",
  "disabled",
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
  {
    label: "Booked online",
    state: "booked",
    bookedMeeting: bookedMeetingPreview,
  },
  {
    label: "Booked phone",
    state: "booked",
    bookedMeeting: bookedPhoneCallPreview,
  },
];

const highValueBookingPanelStates = [
  { label: "Default", state: "default" },
  { label: "Confirming", state: "confirming" },
] as const;

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
      <ButtonIcon
        disabled
        icon="placeholder"
        label="Action"
        size={size}
        variant={variant}
      />
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
    return (
      <Prompt disabled prompt="We need to ramp hiring fast this quarter." />
    );
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
    <Pill
      checked={checked}
      tabIndex={-1}
      visualState={state}
    >
      Pill Choice
    </Pill>
  );
}

export default function InternalComponentsPage() {
  return (
    <main className="min-h-[calc(100dvh-7rem)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfe_100%)]">
      <div className="mx-auto flex w-full max-w-[72rem] flex-col gap-[4.5rem] px-8 py-[4.75rem] sm:px-14 lg:px-28">
        <header className="space-y-lg">
          <div className="space-y-sm">
            <p className="text-label-xs text-text-meta">
              Internal Component Library
            </p>
            <h1 className="text-display-md text-text">
              Component library
            </h1>
            <p className="text-body-sm-open text-text-meta">
              A focused review surface for the chat experience, with foundations kept available but quieter.
            </p>
          </div>
        </header>

        <section className="order-2 space-y-lg border-t border-border-faint pt-xxxl">
          <div className="max-w-2xl space-y-xs">
            <p className="text-label-xs text-text-meta">Foundations</p>
            <h2 className="text-heading-xl text-text">Atomic components</h2>
            <p className="text-body-sm-open text-text-meta">
              Shared building blocks that support the chat system. Open only when you need to inspect primitive states.
            </p>
          </div>
        </section>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 01</p>
              <h2 className="text-heading-xl text-text">Button</h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Core actions used across the review surfaces, including icon and brand CTA variants.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">Ready</p>
          </summary>

          <div className="mt-xl space-y-12">
            <section className="space-y-4">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                States
              </h3>
              <div className="flex flex-wrap gap-sm">
                {buttonStates.map((state) => (
                  <span key={state} className="text-body-xs text-text-meta">
                    {state}
                  </span>
                ))}
              </div>
            </section>

            {buttonSizes.map(({ label, size }) => (
              <section key={size} className="space-y-6">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                  {label}
                </h3>

                <div className="space-y-6">
                  {buttonRows.map(({ label: rowLabel, variant }) => (
                    <div
                      key={`${size}-${variant}`}
                      className="flex flex-col gap-4 border-t border-border-faint pt-6 first:border-t-0 first:pt-0"
                    >
                      <h4 className="text-[14px] font-normal text-text-meta">
                        {rowLabel}
                      </h4>
                      <div className="flex flex-wrap items-center gap-md">
                        {buttonStates.map((state) => (
                          <div
                            key={`${size}-${variant}-${state}`}
                            className="min-w-max"
                          >
                            {renderButtonState(state, variant, size)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <section className="space-y-4 border-t border-border-faint pt-xxl">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Icons
              </h3>
              <div className="flex flex-wrap items-center gap-md">
                <Button
                  leadingIcon={<Icon name="add" size="medium" />}
                  variant="primary"
                >
                  Button
                </Button>
                <Button
                  trailingIcon={<Icon name="link-external" size="medium" />}
                  variant="secondary"
                >
                  Button
                </Button>
                <Button
                  leadingIcon={<Icon name="magic-wand" size="medium" />}
                  variant="tertiary"
                >
                  Button
                </Button>
              </div>
            </section>

            <section className="space-y-4 border-t border-border-faint pt-xxl">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Brand CTA
              </h3>
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
            </section>
          </div>
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 02</p>
              <h2 className="text-heading-xl text-text">Pill</h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Choice chips for lightweight selection patterns inside chat prompts and feedback flows.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </summary>

          <div className="mt-xl space-y-8">
            {[
              { label: "Unchecked", checked: false },
              { label: "Checked", checked: true },
            ].map(({ label, checked }) => (
              <section key={label} className="space-y-4">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                  {label}
                </h3>
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
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 03</p>
              <h2 className="text-heading-xl text-text">Icon</h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Small symbolic marks for actions, statuses, and AI affordances used throughout the prototype.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">
              {iconMetadata.length} icons
            </p>
          </summary>

          <div className="mt-xl space-y-8">
            <section className="space-y-4">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Common
              </h3>
              <div className="flex flex-wrap items-center gap-md text-text-meta">
                {iconExamples.map((name) => (
                  <Icon key={name} name={name} />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Catalog
              </h3>
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
            </section>
          </div>
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 04</p>
              <h2 className="text-heading-xl text-text">Entity</h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Avatar and placeholder shapes for people, companies, and other named entities.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </summary>

          <div className="mt-xl space-y-8">
            {([
              { label: "Circle", shape: "circle" },
              { label: "Square", shape: "square" },
            ] as const).map(({ label, shape }) => (
              <section key={shape} className="space-y-4">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                  {label}
                </h3>

                <div className="flex flex-wrap items-end gap-lg">
                  {entitySizes.map((size) => (
                    <div
                      key={`${shape}-${size}`}
                      className="flex min-w-16 flex-col items-center gap-sm"
                    >
                      <Entity
                        label={`${label} entity placeholder, ${size}px`}
                        shape={shape}
                        size={size}
                      />
                      <span className="text-body-xs text-text-meta">
                        {size}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 05</p>
              <h2 className="text-heading-xl text-text">
                Button icon
              </h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Icon-only action controls for compact toolbars and chat header commands.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </summary>

          <div className="mt-xl space-y-8">
            {buttonSizes.map(({ label, size }) => (
              <section key={`button-icon-${size}`} className="space-y-4">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                  {label}
                </h3>

                <div className="space-y-6">
                  {buttonRows.map(({ label: rowLabel, variant }) => (
                    <div
                      key={`button-icon-${size}-${variant}`}
                      className="flex flex-col gap-4 border-t border-border-faint pt-6 first:border-t-0 first:pt-0"
                    >
                      <h4 className="text-[14px] font-normal text-text-meta">
                        {rowLabel}
                      </h4>
                      <div className="flex flex-wrap items-center gap-md">
                        {buttonStates.map((state) => (
                          <div
                            key={`button-icon-${size}-${variant}-${state}`}
                            className="min-w-max"
                          >
                            {renderButtonIconState(state, variant, size)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 06</p>
              <h2 className="text-heading-xl text-text">
                Ghost icon button
              </h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Low-emphasis icon actions for chrome, dismissal, and secondary chat controls.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">Updated</p>
          </summary>

          <div className="mt-xl space-y-8">
            {(["small", "medium"] as const).map((size) => (
              <section key={size} className="space-y-4">
                <h3 className="text-[1.05rem] font-semibold capitalize tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                  {size}
                </h3>

                <div className="grid gap-lg lg:grid-cols-2">
                  {[
                    { label: "Padded", horizontalPadding: true },
                    { label: "Compact", horizontalPadding: false },
                  ].map(({ label, horizontalPadding }) => (
                    <div
                      key={`${size}-${label}`}
                      className="space-y-md border-t border-border-faint pt-lg first:border-t-0 first:pt-0 lg:border-t-0 lg:pt-0"
                    >
                      <h4 className="text-[14px] font-normal text-text-meta">
                        {label}
                      </h4>

                      <div className="space-y-sm">
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
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 07</p>
              <h2 className="text-heading-xl text-text">
                Text input
              </h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Single-line form input for supporting flows outside the main chat composer.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </summary>

          <div className="mt-xl space-y-10">
            <section className="space-y-4">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Core variants
              </h3>

              <div className="grid gap-xl lg:grid-cols-2">
                {textInputSizes.map(({ label, size }) => (
                  <div key={size} className="space-y-lg">
                    <h4 className="text-[14px] font-normal text-text-meta">
                      {label}
                    </h4>

                    <div className="grid gap-lg">
                      <TextInput
                        className="max-w-80"
                        counter
                        helperText="Helper text"
                        label="Label"
                        placeholder="Hint text (Optional)"
                        required
                        size={size}
                      />
                      <TextInput
                        className="max-w-80"
                        counter
                        defaultValue="Input text value"
                        helperText="Helper text"
                        label="Label"
                        placeholder="Hint text (Optional)"
                        required
                        size={size}
                      />
                      <TextInput
                        className="max-w-80"
                        counter
                        errorText="Error text"
                        label="Label"
                        placeholder="Hint text (Optional)"
                        required
                        size={size}
                      />
                      <TextInput
                        className="max-w-80"
                        counter
                        defaultValue="Input text value"
                        disabled
                        helperText="Helper text"
                        label="Label"
                        placeholder="Hint text (Optional)"
                        required
                        size={size}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4 border-t border-border-faint pt-xxl">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Interaction states
              </h3>

              <div className="grid gap-xl lg:grid-cols-2">
                {textInputSizes.map(({ label, size }) => (
                  <div key={size} className="space-y-lg">
                    <h4 className="text-[14px] font-normal text-text-meta">
                      {label}
                    </h4>

                    <div className="grid gap-lg">
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
                  </div>
                ))}
              </div>
            </section>

          </div>
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 08</p>
              <h2 className="text-heading-xl text-text">
                Text area
              </h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Multi-line form input for longer supporting notes and feedback capture.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </summary>

          <div className="mt-xl space-y-10">
            <section className="space-y-4">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Core variants
              </h3>

              <div className="grid gap-xl lg:grid-cols-2">
                {textInputSizes.map(({ label, size }) => (
                  <div key={`text-area-${size}`} className="space-y-lg">
                    <h4 className="text-[14px] font-normal text-text-meta">
                      {label}
                    </h4>

                    <div className="grid gap-lg">
                      <TextArea
                        className="max-w-80"
                        counter
                        helperText="Helper text"
                        label="Label"
                        placeholder="Hint text (Optional)"
                        required
                        size={size}
                      />
                      <TextArea
                        className="max-w-80"
                        counter
                        defaultValue="Input text value"
                        helperText="Helper text"
                        label="Label"
                        placeholder="Hint text (Optional)"
                        required
                        size={size}
                      />
                      <TextArea
                        className="max-w-80"
                        counter
                        errorText="Error text"
                        label="Label"
                        placeholder="Hint text (Optional)"
                        required
                        size={size}
                      />
                      <TextArea
                        className="max-w-80"
                        counter
                        defaultValue="Input text value"
                        disabled
                        helperText="Helper text"
                        label="Label"
                        placeholder="Hint text (Optional)"
                        required
                        size={size}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4 border-t border-border-faint pt-xxl">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Interaction states
              </h3>

              <div className="grid gap-xl lg:grid-cols-2">
                {textInputSizes.map(({ label, size }) => (
                  <div key={`text-area-state-${size}`} className="space-y-lg">
                    <h4 className="text-[14px] font-normal text-text-meta">
                      {label}
                    </h4>

                    <div className="grid gap-lg">
                      {textInputStates.map((state) => (
                        <TextArea
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
                  </div>
                ))}
              </div>
            </section>
          </div>
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 09</p>
              <h2 className="text-heading-xl text-text">Tag</h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Short metadata labels for status, category, and contextual emphasis.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </summary>

          <div className="mt-xl space-y-8">
            {tagSizes.map(({ label, size }) => (
              <section key={`tag-${size}`} className="space-y-4">
                <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                  {label}
                </h3>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-md lg:max-w-2xl">
                  {tagTones.map(({ label: toneLabel, tone }) => (
                    <div
                      key={`tag-${size}-${tone}`}
                      className="flex min-h-20 flex-col items-start justify-center gap-sm rounded-sm border border-border-faint bg-background px-md py-sm"
                    >
                      <p className="whitespace-nowrap text-body-xs text-text-meta">
                        {toneLabel}
                      </p>
                      <Tag size={size} tone={tone}>
                        Label
                      </Tag>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </details>

        <details className="group order-3 border-t border-border-faint pt-xl">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-lg [&::-webkit-details-marker]:hidden">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 10</p>
              <h2 className="text-heading-xl text-text">Badge</h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Overlay indicators for new activity, alerts, and capped notification counts.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </summary>

          <div className="mt-xl grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-md lg:max-w-2xl">
            {badgeExamples.map(({ label, tone, size, count }) => (
              <div
                key={label}
                className="flex min-h-20 flex-col items-start justify-center gap-sm rounded-sm border border-border-faint bg-background px-md py-sm"
              >
                <p className="whitespace-nowrap text-body-xs text-text-meta">
                  {label}
                </p>
                <Badge
                  tone={tone}
                  size={size}
                  count={count}
                  label={label}
                />
              </div>
            ))}
          </div>
        </details>

        <section className="order-1 space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Chat components</p>
              <h2 className="text-heading-xl text-text">Chat UI</h2>
              <p className="max-w-2xl text-body-sm-open text-text-meta">
                Product-facing pieces that define the concierge conversation, from shell behavior to message states and sales handoffs.
              </p>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">Primary</p>
          </div>

          <div className="space-y-10">
            <section className="space-y-4">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Components
              </h3>
              <div className="grid gap-lg lg:grid-cols-2">
                <div className="space-y-sm">
                  <p className="text-label-xs text-text-meta">Header</p>
                  <p className="text-body-xs text-text-meta">
                    Top chrome for the chat panel, including AI identity and shell controls.
                  </p>
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
                </div>

                <div className="space-y-sm">
                  <p className="text-label-xs text-text-meta">Messages</p>
                  <p className="text-body-xs text-text-meta">
                    Conversation bubbles for assistant, visitor, and representative turns, including feedback and rich content states.
                  </p>
                  <div className="rounded-lg border border-border-faint bg-background p-panel-padding">
                    <div className="space-y-xl">
                      <section className="space-y-sm">
                        <p className="text-body-xs text-text-meta">AI assistant</p>
                        <ChatMessage className="!pb-xs">
                          I can help compare hiring options quickly.
                        </ChatMessage>
                        <div className="flex justify-start">
                          <ChatMessageFeedback timestamp="1:00 PM" />
                        </div>
                      </section>

                      <section className="space-y-sm">
                        <p className="text-body-xs text-text-meta">
                          Interactive AI assistant feedback
                        </p>
                        <ChatMessage className="!pb-xs">
                          I would start by comparing the lighter hiring path
                          against Recruiter before routing you to sales.
                        </ChatMessage>
                        <ChatMessageFeedbackFlow timestamp="1:01 PM" />
                      </section>

                      <section className="space-y-sm">
                        <p className="text-body-xs text-text-meta">
                          AI assistant feedback states
                        </p>
                        <div className="space-y-xs">
                          <div>
                            <ChatMessage className="!pb-xs">
                              I can help compare hiring options quickly.
                            </ChatMessage>
                            <div className="flex justify-start">
                              <ChatMessageFeedback
                                value="thumbs-up"
                                timestamp="1:02 PM"
                              />
                            </div>
                            <div className="flex justify-start">
                              <ChatInlineFeedback />
                            </div>
                          </div>
                          <div>
                            <ChatMessage className="!pb-xs">
                              A sales consultant can narrow the setup fast.
                            </ChatMessage>
                            <div className="flex justify-start">
                              <ChatMessageFeedback
                                value="thumbs-down"
                                timestamp="1:03 PM"
                              />
                            </div>
                            <div className="flex justify-start">
                              <ChatFeedbackReasonChips value="confusing" />
                            </div>
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
                        <p className="text-body-xs text-text-meta">
                          Human representative with metadata
                        </p>
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
                        <p className="text-body-xs text-text-meta">
                          Human representative
                        </p>
                        <ChatMessage role="representative">
                          I can stay with you while we narrow this down.
                        </ChatMessage>
                      </section>

                      <section className="space-y-sm">
                        <p className="text-body-xs text-text-meta">Thinking</p>
                        <ChatThinkingMessage />
                      </section>

                      <section className="space-y-sm">
                        <p className="text-body-xs text-text-meta">
                          Long-text wrapping
                        </p>
                        <ChatMessage role="user">
                          We have several hiring teams moving at different speeds,
                          and I need a path that works for a small pilot now but
                          can still scale if the next quarter gets busier.
                        </ChatMessage>
                      </section>

                      <section className="space-y-sm">
                        <p className="text-body-xs text-text-meta">
                          Rich assistant content
                        </p>
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
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-label-xs text-text-meta">Recommendation</p>
                  <p className="text-body-xs text-text-meta">
                    A compact in-chat decision card for suggested products or next-best actions.
                  </p>
                  <div className="rounded-md border border-border-faint bg-background p-panel-padding">
                    <RecommendationCard />
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-label-xs text-text-meta">Prompts</p>
                  <p className="text-body-xs text-text-meta">
                    Suggested user intents that help people start or steer the conversation.
                  </p>
                  <div className="rounded-lg border border-border-faint bg-background p-panel-padding">
                    <div className="flex flex-wrap gap-sm">
                      <Prompt prompt="We need to ramp hiring fast this quarter." />
                      <Prompt prompt="Help me compare Recruiter and Hiring Pro.">
                        Compare products
                      </Prompt>
                    </div>
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-label-xs text-text-meta">Composer</p>
                  <p className="text-body-xs text-text-meta">
                    Message input and send controls, including longer draft behavior.
                  </p>
                  <div className="rounded-lg border border-border-faint bg-background p-panel-padding">
                    <div className="space-y-md">
                      <ChatComposer className="px-0 pb-0" />
                      <ChatComposer
                        className="px-0 pb-0"
                        inputProps={{
                          "aria-label": "Long message draft",
                          defaultValue:
                            "ka;sd kas;d kas;dl kas;ld kas;ld kasld; aksd; aksdl; askd a;ldk a sd;laksd ;adk asl;",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4 border-t border-border-faint pt-xxl">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Scheduled sales consultant card states
              </h3>
              <p className="max-w-2xl text-body-xs text-text-meta">
                In-chat appointment recommendation flow, from matching through confirmed meeting details.
              </p>
              <div className="grid gap-xl md:grid-cols-2">
                {highValueMatchCardStates.map(
                  ({ label, state, bookedMeeting }) => (
                    <div key={`${state}-${label}`} className="space-y-sm">
                      <p className="text-body-xs text-text-meta">{label}</p>
                      <HighValueMatchCardPreview
                        state={state}
                        bookedMeeting={bookedMeeting}
                      />
                    </div>
                  ),
                )}
              </div>
            </section>

            <section className="space-y-4 border-t border-border-faint pt-xxl">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Medium-value live sales consultant handoff states
              </h3>
              <p className="max-w-2xl text-body-xs text-text-meta">
                Live handoff card states for connecting a visitor to a human representative.
              </p>
              <div className="grid gap-xl md:grid-cols-2 xl:grid-cols-3">
                {mediumAvailableHandoffStates.map(({ label, state }) => (
                  <div key={state} className="space-y-sm">
                    <p className="text-body-xs text-text-meta">{label}</p>
                    <div className="space-y-lg">
                      <MediumAvailableHandoffPreview state={state} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4 border-t border-border-faint pt-xxl">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                High-value booking side panel
              </h3>
              <p className="max-w-2xl text-body-xs text-text-meta">
                Scheduling surface used alongside the chat when a visitor is ready to book.
              </p>
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
            </section>

            <section className="space-y-4 border-t border-border-faint pt-xxl">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Prompt states
              </h3>
              <p className="max-w-2xl text-body-xs text-text-meta">
                Interaction states for suggested prompts before they are shown inside a full chat panel.
              </p>
              <div className="flex flex-wrap items-start gap-lg">
                {promptStates.map((state) => (
                  <div key={state} className="space-y-sm">
                    <p className="text-body-xs text-text-meta">{state}</p>
                    {renderPromptState(state)}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Shell versions
              </h3>
              <p className="max-w-2xl text-body-xs text-text-meta">
                Panel and tray containers that define how the concierge opens, minimizes, and expands.
              </p>
              <div className="space-y-xl">
                <div className="space-y-sm">
                  <p className="text-body-xs text-text-meta">
                    Default shell
                  </p>
                  <div className="overflow-x-auto px-xl pb-xxxl pt-md">
                    <ChatPanelPreview variant="collapsed" />
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-body-xs text-text-meta">
                    Tray shell · minimized
                  </p>
                  <div className="flex justify-end rounded-lg border border-border-faint bg-background-neutral-soft p-xl">
                    <ChatTray />
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-body-xs text-text-meta">
                    Tray shell · badge
                  </p>
                  <div className="flex justify-end rounded-lg border border-border-faint bg-background-neutral-soft p-xl">
                    <ChatTray badge />
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-body-xs text-text-meta">
                    Tray shell · representative
                  </p>
                  <div className="flex justify-end rounded-lg border border-border-faint bg-background-neutral-soft p-xl">
                    <ChatTray
                      identity={{
                        type: "representative",
                        name: "David S.",
                        role: "Sales consultant",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-body-xs text-text-meta">
                    Tray shell · expanded
                  </p>
                  <div className="flex h-[48rem] max-h-[calc(100dvh-8rem)] items-end justify-end overflow-x-auto rounded-lg border border-border-faint bg-background-neutral-soft px-xl pt-md">
                    <ChatPanelPreview
                      className="md:!h-full md:!rounded-t-md md:!rounded-b-none"
                      variant="collapsed"
                      showMinimizeToTrayAction
                    />
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-body-xs text-text-meta">
                    Default shell · wide
                  </p>
                  <div className="overflow-x-auto px-xl pb-xxxl pt-md">
                    <ChatPanelPreview variant="expanded" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
