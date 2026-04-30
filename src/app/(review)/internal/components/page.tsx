import type { Metadata } from "next";
import Image from "next/image";

import {
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatPanelPreview,
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
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, iconMetadata } from "@/components/primitives/icon";
import { Pill } from "@/components/primitives/pill";
import { Tag } from "@/components/primitives/tag";
import { TextInput } from "@/components/primitives/text-input";
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
    label: "Booked",
    state: "booked",
    bookedMeeting: bookedMeetingPreview,
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
              Minimal internal review surface for shared primitives.
            </p>
          </div>
        </header>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 01</p>
              <h2 className="text-heading-xl text-text">Button</h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">Ready</p>
          </div>

          <div className="space-y-12">
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
        </section>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 02</p>
              <h2 className="text-heading-xl text-text">Pill</h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </div>

          <div className="space-y-8">
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
        </section>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 03</p>
              <h2 className="text-heading-xl text-text">Icon</h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">
              {iconMetadata.length} icons
            </p>
          </div>

          <div className="space-y-8">
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
        </section>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 04</p>
              <h2 className="text-heading-xl text-text">Entity</h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </div>

          <div className="space-y-8">
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
        </section>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 05</p>
              <h2 className="text-heading-xl text-text">
                Button icon
              </h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </div>

          <div className="space-y-8">
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
        </section>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 06</p>
              <h2 className="text-heading-xl text-text">
                Ghost icon button
              </h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">Updated</p>
          </div>

          <div className="space-y-8">
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
        </section>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 07</p>
              <h2 className="text-heading-xl text-text">
                Text input
              </h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </div>

          <div className="space-y-10">
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
        </section>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Primitive 08</p>
              <h2 className="text-heading-xl text-text">Tag</h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">New</p>
          </div>

          <div className="space-y-8">
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
        </section>

        <section className="space-y-10 border-t border-border-faint pt-xxxl">
          <div className="flex items-start justify-between gap-lg">
            <div className="space-y-xs">
              <p className="text-label-xs text-text-meta">Composable 01</p>
              <h2 className="text-heading-xl text-text">Chat UI</h2>
            </div>
            <p className="pt-[2px] text-body-xs text-text-meta">First batch</p>
          </div>

          <div className="space-y-10">
            <section className="space-y-4">
              <h3 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-[1.125rem]">
                Components
              </h3>
              <div className="grid gap-lg lg:grid-cols-2">
                <div className="space-y-sm">
                  <p className="text-label-xs text-text-meta">Header</p>
                  <div className="overflow-hidden rounded-t-lg border border-border-faint bg-background">
                    <ChatHeader />
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-label-xs text-text-meta">Messages</p>
                  <div className="rounded-lg border border-border-faint bg-background p-panel-padding">
                    <div className="space-y-xl">
                      <section className="space-y-sm">
                        <p className="text-body-xs text-text-meta">AI assistant</p>
                        <ChatMessage>
                          I can help compare hiring options quickly.
                        </ChatMessage>
                      </section>

                      <section className="space-y-sm">
                        <p className="text-body-xs text-text-meta">User</p>
                        <ChatMessage role="user">
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
                  <div className="rounded-md border border-border-faint bg-background p-panel-padding">
                    <RecommendationCard />
                  </div>
                </div>

                <div className="space-y-sm">
                  <p className="text-label-xs text-text-meta">Prompts</p>
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
                Scheduled specialist card states
              </h3>
              <div className="grid gap-xl md:grid-cols-2">
                {highValueMatchCardStates.map(
                  ({ label, state, bookedMeeting }) => (
                    <div key={state} className="space-y-sm">
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
                Medium-value live specialist handoff states
              </h3>
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
                Panel states
              </h3>
              <div className="space-y-lg">
                <div className="overflow-x-auto px-xl pb-xxxl pt-md">
                  <ChatPanelPreview variant="collapsed" />
                </div>
                <div className="overflow-x-auto px-xl pb-xxxl pt-md">
                  <ChatPanelPreview variant="expanded" />
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
