"use client";

import { useState, type ReactNode } from "react";
import {
  Maximize2,
  Monitor,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

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
  ChatThread,
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
  type PremiumReviewFlowId,
} from "@/components/premium";
import { PremiumConciergeFab } from "@/components/premium/premium-concierge-fab";
import { PremiumConciergePanel } from "@/components/premium/premium-concierge-panel";
import { PremiumProductRecommendationCard } from "@/components/premium/premium-product-recommendation-card";
import { premiumPlans, type PremiumPlanId } from "@/components/premium/premium-plan-data";
import { Badge } from "@/components/primitives/badge";
import { Button, type ButtonProps } from "@/components/primitives/button";
import { ButtonIcon, type ButtonIconProps } from "@/components/primitives/button-icon";
import { Entity, type EntityProps } from "@/components/primitives/entity";
import { GhostIconButton, type GhostIconButtonProps } from "@/components/primitives/ghost-icon-button";
import { Icon, iconMetadata, type IconName } from "@/components/primitives/icon";
import { Pill, type PillProps } from "@/components/primitives/pill";
import { Tag, type TagProps } from "@/components/primitives/tag";
import { TextArea, type TextAreaProps } from "@/components/primitives/text-area";
import { TextInput, type TextInputProps } from "@/components/primitives/text-input";
import {
  HIRING_CONCIERGE_TITLE,
  PREMIUM_CONCIERGE_TITLE,
} from "@/lib/concierge-copy";

type DemoOption<T extends string> = Readonly<{
  label: string;
  value: T;
}>;

type ButtonDemoState =
  | NonNullable<ButtonProps["visualState"]>
  | "disabled"
  | "loading";
type FieldContentState = "empty" | "filled" | "error" | "disabled";
type ComponentLibraryContext = "mobile" | "collapsed" | "expanded";
type SpecialistActionDemoStateId =
  | "initial"
  | "matching"
  | "matched"
  | "scheduling"
  | "booked-online"
  | "booked-phone";

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
    id: SpecialistActionDemoStateId;
    label: string;
    state: HighValueRecommendationState;
    bookedMeeting?: BookedMeeting;
  }>
> = [
  { id: "initial", label: "Initial", state: "initial" },
  { id: "matching", label: "Matching", state: "matching" },
  { id: "matched", label: "Matched", state: "matched" },
  { id: "scheduling", label: "Scheduling passive", state: "scheduling" },
  { id: "booked-online", label: "Booked online", state: "booked", bookedMeeting: bookedMeetingPreview },
  { id: "booked-phone", label: "Booked phone", state: "booked", bookedMeeting: bookedPhoneCallPreview },
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

const buttonStates: ReadonlyArray<DemoOption<ButtonDemoState>> = [
  { label: "Default", value: "default" },
  { label: "Hover", value: "hover" },
  { label: "Active", value: "active" },
  { label: "Focus", value: "focus-visible" },
  { label: "Disabled", value: "disabled" },
  { label: "Loading", value: "loading" },
];

const fieldContentStates: ReadonlyArray<DemoOption<FieldContentState>> = [
  { label: "Empty", value: "empty" },
  { label: "Filled", value: "filled" },
  { label: "Error", value: "error" },
  { label: "Disabled", value: "disabled" },
];

const chatContextOptions: ReadonlyArray<DemoOption<ComponentLibraryContext>> = [
  { label: "Mobile", value: "mobile" },
  { label: "Desktop collapsed", value: "collapsed" },
  { label: "Desktop expanded", value: "expanded" },
];

const chatContextDisplayOptions: ReadonlyArray<
  DemoOption<ComponentLibraryContext> & Readonly<{ Icon: LucideIcon }>
> = [
  { label: "Mobile", value: "mobile", Icon: Smartphone },
  { label: "Desktop collapsed", value: "collapsed", Icon: Monitor },
  { label: "Desktop expanded", value: "expanded", Icon: Maximize2 },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function renderControlLabel(label: string) {
  return (
    <span className="text-[13px] font-medium leading-4 text-text-meta">
      {label}
    </span>
  );
}

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: Readonly<{
  label: string;
  options: ReadonlyArray<DemoOption<T>>;
  value: T;
  onChange: (value: T) => void;
}>) {
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      {renderControlLabel(label)}
      <div className="inline-flex w-fit max-w-full flex-wrap gap-0.5 rounded-[10px] border border-[#d7dce2] bg-background p-0.5">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              className={cx(
                "min-h-[30px] rounded-[7px] border px-[11px] text-[14px] font-medium leading-none transition-[background-color,border-color,color,box-shadow] duration-150 ease-out",
                isSelected
                  ? "shadow-none"
                  : "border-[#dfe3e8] bg-background text-text-meta hover:border-[#cfd5dc] hover:text-text",
              )}
              style={
                isSelected
                  ? {
                      backgroundColor: "#000000",
                      borderColor: "#000000",
                      color: "#ffffff",
                    }
                  : undefined
              }
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SelectControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: Readonly<{
  label: string;
  options: ReadonlyArray<DemoOption<T>>;
  value: T;
  onChange: (value: T) => void;
}>) {
  return (
    <label className="flex min-w-[12rem] flex-col gap-[8px]">
      {renderControlLabel(label)}
      <span className="relative inline-flex h-9 items-center rounded-[10px] border border-[#d7dce2] bg-background shadow-[0_1px_1px_rgba(0,0,0,0.03)] transition-[border-color,box-shadow] duration-150 ease-out focus-within:border-border-subtle focus-within:ring-4 focus-within:ring-neutral-focus-ring">
        <select
          value={value}
          className="h-full w-full appearance-none rounded-[10px] border-0 bg-transparent py-0 pl-md pr-[40px] text-[14px] font-medium text-text outline-none"
          onChange={(event) => onChange(event.currentTarget.value as T)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-md top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-icon"
        >
          <Icon name="chevron-down" size="small" />
        </span>
      </span>
    </label>
  );
}

function ToggleControl({
  label,
  checked,
  onChange,
}: Readonly<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}>) {
  return (
    <label className="flex min-h-9 min-w-[12rem] items-center justify-between gap-md rounded-[10px] border border-[#d7dce2] bg-background px-md text-[14px] font-medium text-text shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <span
        aria-hidden="true"
        className={cx(
          "relative inline-flex h-5 w-9 shrink-0 rounded-round transition-colors duration-150 ease-out",
          !checked && "bg-background-disabled",
        )}
        style={checked ? { backgroundColor: "#000000" } : undefined}
      >
        <span
          className={cx(
            "absolute left-0.5 top-0.5 size-4 rounded-round bg-background shadow-raised transition-transform duration-150 ease-out",
            checked && "translate-x-4",
          )}
        />
      </span>
    </label>
  );
}

function ComponentDemoSection({
  children,
  controls,
  previewClassName,
}: Readonly<{
  children: ReactNode;
  controls?: ReactNode;
  previewClassName?: string;
}>) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#d7dce2] bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {controls ? (
        <div className="border-b border-[#dfe3e8] bg-[#f8f9fb] px-[28px] py-[22px]">
          <div className="flex flex-wrap items-end gap-x-[28px] gap-y-[16px]">
            {controls}
          </div>
        </div>
      ) : null}
      <div className="component-library-demo-preview flex min-h-[22rem] items-center justify-center overflow-x-auto bg-background p-[64px]">
        <div className={cx("min-w-0", previewClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ChatContextControl({
  value,
  onChange,
}: Readonly<{
  value: ComponentLibraryContext;
  onChange: (value: ComponentLibraryContext) => void;
}>) {
  return (
    <div className="order-last ml-auto flex min-w-0 items-end">
      <div
        className="inline-flex w-fit max-w-full gap-0.5 rounded-[10px] border border-[#d7dce2] bg-background p-0.5"
        role="group"
        aria-label="Preview context"
      >
        {chatContextDisplayOptions.map((option) => {
          const isSelected = option.value === value;
          const ContextIcon = option.Icon;

          return (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={isSelected}
              title={option.label}
              className={cx(
                "flex min-h-[30px] min-w-[34px] items-center justify-center rounded-[7px] border px-[9px] text-[14px] font-medium leading-none transition-[background-color,border-color,color,box-shadow] duration-150 ease-out",
                isSelected
                  ? "shadow-none"
                  : "border-[#dfe3e8] bg-background text-text-meta hover:border-[#cfd5dc] hover:text-text",
              )}
              style={
                isSelected
                  ? {
                      backgroundColor: "#000000",
                      borderColor: "#000000",
                      color: "#ffffff",
                    }
                : undefined
              }
              onClick={() => onChange(option.value)}
            >
              <ContextIcon aria-hidden="true" size={16} strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

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

function getPanelVariantForContext(context: ComponentLibraryContext) {
  return context === "expanded" ? "expanded" : "collapsed";
}

function getMobilePanelOverrideClass(context: ComponentLibraryContext) {
  return context === "mobile"
    ? "!h-[var(--component-library-mobile-chat-height)] !w-[var(--component-library-mobile-chat-width)] !rounded-none md:!h-[var(--component-library-mobile-chat-height)] md:!w-[var(--component-library-mobile-chat-width)] md:!rounded-none"
    : undefined;
}

function ChatPanelContextFrame({
  context,
  children,
  className,
}: Readonly<{
  context: ComponentLibraryContext;
  children: ReactNode;
  className?: string;
}>) {
  return (
    <div
      className={cx(
        "overflow-hidden border border-border-faint bg-background",
        context === "mobile" ? "rounded-none" : "rounded-panel",
        getChatContextWidthClass(context),
        getChatContextAssistantMaxClass(context),
        className,
      )}
    >
      {children}
    </div>
  );
}

function ChatThreadContextFrame({
  context,
  children,
}: Readonly<{
  context: ComponentLibraryContext;
  children: ReactNode;
}>) {
  return (
    <ChatPanelContextFrame context={context}>
      <div className="flex justify-center py-xl">
        <ChatThread showAiDisclaimer={false}>{children}</ChatThread>
      </div>
    </ChatPanelContextFrame>
  );
}

function SidePanelContextFrame({
  context,
  children,
}: Readonly<{
  context: ComponentLibraryContext;
  children: ReactNode;
}>) {
  return (
    <div
      className={cx(
        "max-h-[calc(100dvh-8rem)] overflow-hidden border border-border-faint bg-background-neutral-soft",
        context === "mobile"
          ? "h-[var(--component-library-mobile-chat-height)] rounded-none"
          : "h-[48rem] rounded-lg",
        getSidePanelContextWidthClass(context),
      )}
    >
      {children}
    </div>
  );
}

function renderDemoButton(
  state: ButtonDemoState,
  variant: NonNullable<ButtonProps["variant"]>,
  size: NonNullable<ButtonProps["size"]>,
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
    <Button size={size} variant={variant} visualState={state}>
      Button
    </Button>
  );
}

function renderDemoButtonIcon(
  state: ButtonDemoState,
  variant: NonNullable<ButtonIconProps["variant"]>,
  size: NonNullable<ButtonIconProps["size"]>,
) {
  if (state === "disabled") {
    return <ButtonIcon disabled icon="placeholder" label="Action" size={size} variant={variant} />;
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
      variant={variant}
      visualState={state}
    />
  );
}

function renderFieldProps(state: FieldContentState) {
  if (state === "filled") {
    return {
      defaultValue: "Input text value",
      helperText: "Helper text",
    };
  }

  if (state === "error") {
    return {
      errorText: "Error text",
    };
  }

  if (state === "disabled") {
    return {
      defaultValue: "Input text value",
      disabled: true,
      helperText: "Helper text",
    };
  }

  return {
    helperText: "Helper text",
  };
}

export function SharedShellDemo() {
  const [mode, setMode] = useState("panel");

  return (
    <ComponentDemoSection
      controls={
        <SegmentedControl
          label="Version"
          value={mode}
          options={[
            { label: "Default panel", value: "panel" },
            { label: "Mobile panel", value: "mobile" },
            { label: "Tray", value: "tray" },
            { label: "Live agent tray", value: "tray-agent" },
            { label: "Wide panel", value: "wide" },
          ]}
          onChange={setMode}
        />
      }
    >
      {mode === "tray" ? (
        <div className="flex justify-end rounded-lg border border-border-faint bg-background-neutral-soft p-xl">
          <ChatTray />
        </div>
      ) : mode === "tray-agent" ? (
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
      ) : mode === "mobile" ? (
        <div className="overflow-x-auto px-xl pb-xxxl pt-md">
          <ChatPanelPreview
            className={getMobilePanelOverrideClass("mobile")}
            variant="collapsed"
          />
        </div>
      ) : (
        <div className="overflow-x-auto px-xl pb-xxxl pt-md">
          <ChatPanelPreview variant={mode === "wide" ? "expanded" : "collapsed"} />
        </div>
      )}
    </ComponentDemoSection>
  );
}

export function SharedHeaderDemo() {
  const [mode, setMode] = useState("hiring");
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Header"
            value={mode}
            options={[
              { label: "Hiring", value: "hiring" },
              { label: "Premium", value: "premium" },
              { label: "Live agent", value: "agent" },
            ]}
            onChange={setMode}
          />
          <ChatContextControl value={context} onChange={setContext} />
        </>
      }
    >
      <ChatPanelContextFrame context={context}>
        {mode === "agent" ? (
          <ChatHeader
            variant={getPanelVariantForContext(context)}
            identity={{
              type: "representative",
              name: "David S.",
              role: "Sales consultant",
            }}
          />
        ) : (
          <ChatHeader
            variant={getPanelVariantForContext(context)}
            title={
              mode === "premium"
                ? PREMIUM_CONCIERGE_TITLE
                : HIRING_CONCIERGE_TITLE
            }
          />
        )}
      </ChatPanelContextFrame>
    </ComponentDemoSection>
  );
}

export function SharedMessagesDemo() {
  const [messageType, setMessageType] = useState("ai");
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SelectControl
            label="Message type"
            value={messageType}
            options={[
              { label: "AI assistant", value: "ai" },
              { label: "Interactive AI feedback", value: "feedback" },
              { label: "Feedback result", value: "feedback-result" },
              { label: "Member or visitor", value: "user" },
              { label: "Live agent", value: "agent" },
              { label: "Thinking", value: "thinking" },
              { label: "Rich content", value: "rich" },
            ]}
            onChange={setMessageType}
          />
          <ChatContextControl value={context} onChange={setContext} />
        </>
      }
    >
      <ChatThreadContextFrame context={context}>
        {messageType === "feedback" ? (
          <div className="space-y-xs">
            <ChatMessage>
              I would compare the lighter hiring path against Recruiter before routing you to sales.
            </ChatMessage>
            <ChatMessageFeedbackFlow timestamp="1:01 PM" />
          </div>
        ) : messageType === "feedback-result" ? (
          <div className="space-y-xs">
            <ChatMessage>A sales consultant can narrow the setup fast.</ChatMessage>
            <div className="flex justify-start">
              <ChatMessageFeedback value="thumbs-down" timestamp="1:03 PM" />
            </div>
            <div className="flex justify-start">
              <ChatFeedbackReasonChips value="confusing" />
            </div>
          </div>
        ) : messageType === "user" ? (
          <ChatMessage role="user" timestamp="1:04 PM">
            We need to ramp hiring fast this quarter.
          </ChatMessage>
        ) : messageType === "agent" ? (
          <ChatMessage
            role="representative"
            authorName="David S."
            avatarLabel="David S., Live agent"
            timestamp="9:37 PM"
          >
            Hey Jamie, how can I help you?
          </ChatMessage>
        ) : messageType === "thinking" ? (
          <div className="space-y-xs">
            <ChatThinkingMessage />
            <div className="flex justify-start">
              <ChatInlineFeedback tone="neutral">Response stopped.</ChatInlineFeedback>
            </div>
          </div>
        ) : messageType === "rich" ? (
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
        ) : (
          <div className="space-y-xs">
            <ChatMessage>I can help compare hiring options quickly.</ChatMessage>
            <div className="flex justify-start">
              <ChatMessageFeedback timestamp="1:00 PM" />
            </div>
          </div>
        )}
      </ChatThreadContextFrame>
    </ComponentDemoSection>
  );
}

export function SharedComposerDemo() {
  const [state, setState] = useState("empty");
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="State"
            value={state}
            options={[
              { label: "Empty", value: "empty" },
              { label: "Draft", value: "draft" },
              { label: "Responding", value: "responding" },
            ]}
            onChange={setState}
          />
          <ChatContextControl value={context} onChange={setContext} />
        </>
      }
    >
      <ChatPanelContextFrame context={context}>
        <ChatComposer
          key={`${state}-${context}`}
          variant={getPanelVariantForContext(context)}
          isResponding={state === "responding"}
          inputProps={
            state === "draft"
              ? {
                  "aria-label": "Long message draft",
                  defaultValue:
                    "We have several hiring teams moving at different speeds, and I need a path that works for a small pilot now but can still scale.",
                }
              : undefined
          }
        />
      </ChatPanelContextFrame>
    </ComponentDemoSection>
  );
}

export function SharedPromptsDemo() {
  const [state, setState] = useState<NonNullable<PillProps["visualState"]>>("default");
  const [disabled, setDisabled] = useState(false);
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");

  return (
    <ComponentDemoSection
      controls={
        <>
          <ChatContextControl value={context} onChange={setContext} />
          <SegmentedControl
            label="State"
            value={state}
            options={[
              { label: "Default", value: "default" },
              { label: "Hover", value: "hover" },
              { label: "Active", value: "active" },
              { label: "Focus", value: "focus-visible" },
            ]}
            onChange={setState}
          />
          <ToggleControl label="Disabled" checked={disabled} onChange={setDisabled} />
        </>
      }
    >
      <ChatThreadContextFrame context={context}>
        <Prompt
          disabled={disabled}
          prompt="We need to ramp hiring fast this quarter."
          visualState={disabled ? "default" : state}
        />
      </ChatThreadContextFrame>
    </ComponentDemoSection>
  );
}

export function SharedActionCardDemo() {
  const [useCase, setUseCase] = useState("shared");
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");
  const [specialistState, setSpecialistState] =
    useState<SpecialistActionDemoStateId>("initial");
  const [liveState, setLiveState] = useState<MediumAvailableHandoffState>("initial");
  const [premiumPlanId, setPremiumPlanId] =
    useState<PremiumPlanId>("business-suite");
  const selectedSpecialistState =
    highValueMatchCardStates.find(({ id }) => id === specialistState) ??
    highValueMatchCardStates[0];

  return (
    <ComponentDemoSection
      controls={
        <>
          <ChatContextControl value={context} onChange={setContext} />
          <SegmentedControl
            label="Use case"
            value={useCase}
            options={[
              { label: "Shared", value: "shared" },
              { label: "Specialist", value: "specialist" },
              { label: "Live handoff", value: "live" },
              { label: "Premium plan", value: "premium" },
            ]}
            onChange={setUseCase}
          />
          {useCase === "specialist" ? (
            <SelectControl
              label="State"
              value={specialistState}
              options={highValueMatchCardStates.map(({ id, label }) => ({
                label,
                value: id,
              }))}
              onChange={setSpecialistState}
            />
          ) : null}
          {useCase === "live" ? (
            <SegmentedControl
              label="State"
              value={liveState}
              options={mediumAvailableHandoffStates.map(({ label, state }) => ({
                label,
                value: state,
              }))}
              onChange={setLiveState}
            />
          ) : null}
          {useCase === "premium" ? (
            <SelectControl
              label="Plan"
              value={premiumPlanId}
              options={premiumPlans.map((plan) => ({
                label: plan.name,
                value: plan.id,
              }))}
              onChange={setPremiumPlanId}
            />
          ) : null}
        </>
      }
    >
      <ChatThreadContextFrame context={context}>
        {useCase === "specialist" ? (
          <HighValueMatchCardPreview
            state={selectedSpecialistState.state}
            bookedMeeting={selectedSpecialistState.bookedMeeting}
          />
        ) : useCase === "live" ? (
          <MediumAvailableHandoffPreview state={liveState} />
        ) : useCase === "premium" ? (
          <PremiumProductRecommendationCard planId={premiumPlanId} />
        ) : (
          <RecommendationCard />
        )}
      </ChatThreadContextFrame>
    </ComponentDemoSection>
  );
}

export function SharedSidePanelDemo() {
  const [state, setState] = useState("default");
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");

  return (
    <ComponentDemoSection
      controls={
        <>
          <ChatContextControl value={context} onChange={setContext} />
          <SegmentedControl
            label="Booking state"
            value={state}
            options={[
              { label: "Default", value: "default" },
              { label: "Confirming", value: "confirming" },
            ]}
            onChange={setState}
          />
        </>
      }
    >
      <SidePanelContextFrame context={context}>
        <HighValueSchedulePanelPreview
          key={state}
          state={state === "confirming" ? "confirming" : "default"}
        />
      </SidePanelContextFrame>
    </ComponentDemoSection>
  );
}

export function PremiumFabReviewPreview() {
  return (
    <div className="relative min-h-28 overflow-hidden rounded-lg border border-border-faint bg-background-neutral-soft">
      <div className="absolute bottom-xl right-xl">
        <PremiumConciergeFab onClick={() => {}} position="static" />
      </div>
    </div>
  );
}

export function PremiumFabDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ComponentDemoSection
      controls={
        <ToggleControl
          label="Chat open"
          checked={isOpen}
          onChange={setIsOpen}
        />
      }
    >
      <div className="relative min-h-28 overflow-hidden rounded-lg border border-border-faint bg-background-neutral-soft">
        <div className="absolute bottom-xl right-xl">
          <PremiumConciergeFab
            isChatOpen={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            position="static"
          />
        </div>
      </div>
    </ComponentDemoSection>
  );
}

export function PremiumPlanCardDemo() {
  const [planId, setPlanId] = useState<PremiumPlanId>("business-suite");
  const [showAvatar, setShowAvatar] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");

  return (
    <ComponentDemoSection
      controls={
        <>
          <ChatContextControl value={context} onChange={setContext} />
          <SelectControl
            label="Plan"
            value={planId}
            options={premiumPlans.map((plan) => ({
              label: plan.name,
              value: plan.id,
            }))}
            onChange={setPlanId}
          />
          <ToggleControl
            label="Show avatar"
            checked={showAvatar}
            onChange={setShowAvatar}
          />
          <ToggleControl
            label="Show price"
            checked={showPrice}
            onChange={setShowPrice}
          />
        </>
      }
    >
      <ChatThreadContextFrame context={context}>
        <PremiumProductRecommendationCard
          planId={planId}
          showAvatar={showAvatar}
          showPrice={showPrice}
        />
      </ChatThreadContextFrame>
    </ComponentDemoSection>
  );
}

export function PremiumConciergePanelDemo() {
  const [signal, setSignal] = useState<PremiumReviewFlowId>("high");
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Signal"
            value={signal}
            options={[
              { label: "Low", value: "low" },
              { label: "High", value: "high" },
            ]}
            onChange={setSignal}
          />
          <SegmentedControl
            label="Context"
            value={context}
            options={chatContextOptions}
            onChange={setContext}
          />
        </>
      }
    >
      <div
        className={cx(
          "h-[48rem] max-h-[calc(100dvh-8rem)] overflow-hidden rounded-lg bg-background-neutral-soft",
          getChatContextWidthClass(context),
        )}
      >
        <PremiumConciergePanel
          key={`${signal}-${context}`}
          className={cx(
            context !== "mobile" && "md:!h-full",
            getMobilePanelOverrideClass(context),
          )}
          flow={premiumConversationFlows[signal]}
          showCloseAction={false}
          variant={getPanelVariantForContext(context)}
        />
      </div>
    </ComponentDemoSection>
  );
}

export function SduiButtonDemo() {
  const [variant, setVariant] = useState<NonNullable<ButtonProps["variant"]>>("primary");
  const [size, setSize] = useState<NonNullable<ButtonProps["size"]>>("medium");
  const [state, setState] = useState<ButtonDemoState>("default");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Variant"
            value={variant}
            options={[
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Tertiary", value: "tertiary" },
            ]}
            onChange={setVariant}
          />
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { label: "Medium", value: "medium" },
              { label: "Small", value: "small" },
            ]}
            onChange={setSize}
          />
          <SelectControl label="State" value={state} options={buttonStates} onChange={setState} />
        </>
      }
    >
      {renderDemoButton(state, variant, size)}
    </ComponentDemoSection>
  );
}

export function SduiButtonIconDemo() {
  const [variant, setVariant] = useState<NonNullable<ButtonIconProps["variant"]>>("primary");
  const [size, setSize] = useState<NonNullable<ButtonIconProps["size"]>>("small");
  const [state, setState] = useState<ButtonDemoState>("default");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Variant"
            value={variant}
            options={[
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Tertiary", value: "tertiary" },
            ]}
            onChange={setVariant}
          />
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { label: "Small", value: "small" },
              { label: "Medium", value: "medium" },
            ]}
            onChange={setSize}
          />
          <SelectControl label="State" value={state} options={buttonStates} onChange={setState} />
        </>
      }
    >
      {renderDemoButtonIcon(state, variant, size)}
    </ComponentDemoSection>
  );
}

export function SduiGhostIconButtonDemo() {
  const [state, setState] =
    useState<NonNullable<GhostIconButtonProps["visualState"]>>("default");
  const [size, setSize] = useState<NonNullable<GhostIconButtonProps["size"]>>("small");
  const [emphasis, setEmphasis] = useState(false);
  const [padded, setPadded] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { label: "Small", value: "small" },
              { label: "Medium", value: "medium" },
            ]}
            onChange={setSize}
          />
          <SelectControl
            label="State"
            value={state}
            options={[
              { label: "Default", value: "default" },
              { label: "Hover", value: "hover" },
              { label: "Active", value: "active" },
              { label: "Focus", value: "focus-visible" },
            ]}
            onChange={setState}
          />
          <ToggleControl label="Emphasis" checked={emphasis} onChange={setEmphasis} />
          <ToggleControl label="Padded" checked={padded} onChange={setPadded} />
          <ToggleControl label="Loading" checked={loading} onChange={setLoading} />
        </>
      }
    >
      <GhostIconButton
        emphasis={emphasis}
        horizontalPadding={padded}
        icon="placeholder"
        label={loading ? "Loading action" : "Action"}
        loading={loading}
        size={size}
        visualState={state}
      />
    </ComponentDemoSection>
  );
}

export function SduiPillDemo() {
  const [state, setState] = useState<NonNullable<PillProps["visualState"]>>("default");
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="State"
            value={state}
            options={[
              { label: "Default", value: "default" },
              { label: "Hover", value: "hover" },
              { label: "Active", value: "active" },
              { label: "Focus", value: "focus-visible" },
            ]}
            onChange={setState}
          />
          <ToggleControl label="Checked" checked={checked} onChange={setChecked} />
          <ToggleControl label="Disabled" checked={disabled} onChange={setDisabled} />
        </>
      }
    >
      <Pill
        checked={checked}
        disabled={disabled}
        visualState={disabled ? "default" : state}
        onClick={() => setChecked((current) => !current)}
      >
        Pill choice
      </Pill>
    </ComponentDemoSection>
  );
}

export function SduiIconDemo() {
  const [iconName, setIconName] = useState<IconName>("signal-ai");

  return (
    <ComponentDemoSection
      controls={
        <SelectControl
          label="Icon"
          value={iconName}
          options={iconMetadata.map((icon) => ({
            label: icon.label,
            value: icon.name,
          }))}
          onChange={setIconName}
        />
      }
    >
      <span className="inline-flex size-12 items-center justify-center text-text-meta">
        <Icon name={iconName} />
      </span>
    </ComponentDemoSection>
  );
}

export function SduiEntityDemo() {
  const [shape, setShape] = useState<NonNullable<EntityProps["shape"]>>("circle");
  const [size, setSize] = useState("48");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Shape"
            value={shape}
            options={[
              { label: "Circle", value: "circle" },
              { label: "Square", value: "square" },
            ]}
            onChange={setShape}
          />
          <SelectControl
            label="Size"
            value={size}
            options={["16", "24", "32", "40", "48", "64", "80", "96", "128", "160"].map((value) => ({
              label: `${value}px`,
              value,
            }))}
            onChange={setSize}
          />
        </>
      }
    >
      <Entity
        label={`${shape} entity placeholder, ${size}px`}
        shape={shape}
        size={Number(size) as NonNullable<EntityProps["size"]>}
      />
    </ComponentDemoSection>
  );
}

export function SduiTextInputDemo() {
  const [size, setSize] = useState<NonNullable<TextInputProps["size"]>>("small");
  const [contentState, setContentState] = useState<FieldContentState>("empty");
  const [visualState, setVisualState] =
    useState<NonNullable<TextInputProps["visualState"]>>("default");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { label: "Small", value: "small" },
              { label: "Large", value: "large" },
            ]}
            onChange={setSize}
          />
          <SegmentedControl
            label="Content"
            value={contentState}
            options={fieldContentStates}
            onChange={setContentState}
          />
          <SegmentedControl
            label="Visual state"
            value={visualState}
            options={[
              { label: "Default", value: "default" },
              { label: "Hover", value: "hover" },
              { label: "Active", value: "active" },
            ]}
            onChange={setVisualState}
          />
        </>
      }
    >
      <TextInput
        key={`${contentState}-${size}`}
        className="max-w-80"
        counter
        label="Label"
        placeholder="Hint text (Optional)"
        required
        size={size}
        visualState={contentState === "disabled" ? "default" : visualState}
        {...renderFieldProps(contentState)}
      />
    </ComponentDemoSection>
  );
}

export function SduiTextAreaDemo() {
  const [size, setSize] = useState<NonNullable<TextAreaProps["size"]>>("small");
  const [contentState, setContentState] = useState<FieldContentState>("empty");
  const [visualState, setVisualState] =
    useState<NonNullable<TextAreaProps["visualState"]>>("default");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { label: "Small", value: "small" },
              { label: "Large", value: "large" },
            ]}
            onChange={setSize}
          />
          <SegmentedControl
            label="Content"
            value={contentState}
            options={fieldContentStates}
            onChange={setContentState}
          />
          <SegmentedControl
            label="Visual state"
            value={visualState}
            options={[
              { label: "Default", value: "default" },
              { label: "Hover", value: "hover" },
              { label: "Active", value: "active" },
            ]}
            onChange={setVisualState}
          />
        </>
      }
    >
      <TextArea
        key={`${contentState}-${size}`}
        className="max-w-80"
        counter
        label="Label"
        placeholder="Hint text (Optional)"
        required
        size={size}
        visualState={contentState === "disabled" ? "default" : visualState}
        {...renderFieldProps(contentState)}
      />
    </ComponentDemoSection>
  );
}

export function SduiTagDemo() {
  const [size, setSize] = useState<NonNullable<TagProps["size"]>>("small");
  const [tone, setTone] = useState<NonNullable<TagProps["tone"]>>("default");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { label: "Small", value: "small" },
              { label: "Medium", value: "medium" },
            ]}
            onChange={setSize}
          />
          <SelectControl
            label="Tone"
            value={tone}
            options={[
              { label: "Default", value: "default" },
              { label: "Positive", value: "positive" },
              { label: "Negative", value: "negative" },
              { label: "Caution", value: "caution" },
              { label: "Neutral", value: "neutral" },
              { label: "Supportive 1", value: "supportive-1" },
              { label: "Supportive 2", value: "supportive-2" },
              { label: "Supportive 3", value: "supportive-3" },
              { label: "Supportive 4", value: "supportive-4" },
              { label: "Supportive 5", value: "supportive-5" },
            ]}
            onChange={setTone}
          />
        </>
      }
    >
      <Tag size={size} tone={tone}>Label</Tag>
    </ComponentDemoSection>
  );
}

export function SduiBadgeDemo() {
  const [size, setSize] = useState("large");
  const [tone, setTone] = useState("alert");
  const [mode, setMode] = useState("dot");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Mode"
            value={mode}
            options={[
              { label: "Dot", value: "dot" },
              { label: "Counter", value: "counter" },
            ]}
            onChange={setMode}
          />
          <SegmentedControl
            label="Tone"
            value={tone}
            options={[
              { label: "Alert", value: "alert" },
              { label: "New", value: "new" },
            ]}
            onChange={setTone}
          />
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { label: "Small", value: "small" },
              { label: "Large", value: "large" },
            ]}
            onChange={setSize}
          />
        </>
      }
    >
      <Badge
        count={mode === "counter" ? 99 : undefined}
        label={mode === "counter" ? "99 updates" : "New update"}
        size={size === "small" ? "small" : "large"}
        tone={tone === "new" ? "new" : "alert"}
      />
    </ComponentDemoSection>
  );
}
