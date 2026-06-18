"use client";

import Image from "next/image";
import {
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from "react";

import {
  ChatBody,
  ChatComposer,
  ChatEndFeedbackScreen,
  ChatFeedbackReasonPanel,
  ChatFeedbackReasonChips,
  ChatHeader,
  ChatInlineFeedback,
  ChatMessage,
  ChatMessageFeedback,
  ChatMessageFeedbackFlow,
  ChatPanel,
  ChatThinkingMessage,
  ChatThread,
  ChatTray,
  Prompt,
  RecommendationCard,
  type ChatFeedbackReason,
  type ChatPanelVariant,
} from "@/components/chat/chat-ui";
import {
  ChatSidePanel,
  ChatSidePanelLayout,
} from "@/components/chat/chat-side-panel";
import {
  HighValueMatchCardPreview,
  MediumAvailableHandoffPreview,
  type BookedMeeting,
  type HighValueRecommendationState,
  type MediumAvailableHandoffState,
} from "@/components/flow-review/flow-review-chat-panel";
import {
  premiumConversationFlows,
  type PremiumReviewFlowId,
} from "@/components/premium/premium-concierge-flows";
import {
  InsightCard,
  type InsightCardAction,
} from "@/components/premium-company-pages/insight-card";
import {
  PremiumCompanyPagesVcaSidePanelPreview,
  type PremiumCompanyPagesVcaSidePanelPreviewKind,
} from "@/components/premium-company-pages/premium-company-pages-member-page";
import { PremiumCompanyPagesInboxContextStripPreview } from "@/components/premium-company-pages/premium-company-pages-page";
import { pcpCompetitorNames } from "@/components/premium-company-pages/persona";
import { TodayActionCard } from "@/components/premium-company-pages/today-action-card";
import {
  VcaFab,
  type VcaFabVisualState,
} from "@/components/premium-company-pages/vca-fab";
import { PremiumConciergeFab } from "@/components/premium/premium-concierge-fab";
import { PremiumConciergePanel } from "@/components/premium/premium-concierge-panel";
import { PremiumProductRecommendationCard } from "@/components/premium/premium-product-recommendation-card";
import { premiumPlans, type PremiumPlanId } from "@/components/premium/premium-plan-data";
import {
  PremiumEntityStack,
  PremiumLinkedInBug,
  PremiumProfileMark,
  PremiumProgressIndicator,
  PremiumSurveyOption,
} from "@/components/premium/premium-survey-components";
import { Badge } from "@/components/primitives/badge";
import { Button, type ButtonProps } from "@/components/primitives/button";
import { ButtonIcon, type ButtonIconProps } from "@/components/primitives/button-icon";
import { ConfirmationDialog } from "@/components/primitives/confirmation-dialog";
import { Entity, type EntityProps } from "@/components/primitives/entity";
import { GhostButton, type GhostButtonProps } from "@/components/primitives/ghost-button";
import { GhostIconButton, type GhostIconButtonProps } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import {
  NavLinkItemHorizontal,
  type NavLinkItemHorizontalIndicator,
  type NavLinkItemHorizontalVisualState,
} from "@/components/primitives/nav-link-item-horizontal";
import {
  OverlayButtonIcon,
  type OverlayButtonIconProps,
} from "@/components/primitives/overlay-button-icon";
import { Pill, type PillProps } from "@/components/primitives/pill";
import {
  PresenceBadge,
  type PresenceBadgeProps,
} from "@/components/primitives/presence-badge";
import { Tag, type TagProps } from "@/components/primitives/tag";
import {
  TabItemHorizontal,
  type TabItemHorizontalTone,
  type TabItemHorizontalVisualState,
} from "@/components/primitives/tab-item-horizontal";
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
type GhostButtonDemoState =
  | NonNullable<GhostButtonProps["visualState"]>
  | "disabled"
  | "loading";
type OverlayButtonIconDemoState =
  | NonNullable<OverlayButtonIconProps["visualState"]>
  | "disabled"
  | "loading";
type FieldContentState = "empty" | "filled" | "error" | "disabled";
type NavLinkItemDemoState = NavLinkItemHorizontalVisualState;
type TabItemDemoState = TabItemHorizontalVisualState;
type ComponentLibraryContext = "mobile" | "collapsed" | "expanded";
type SidePanelDemoView = "panel" | "shell";
type ShellDemoVersion = "dismissable" | "persistent" | "hybrid";
type ShellDemoDevice = "desktop" | "mobile";
type ShellDemoState = "closed" | "tray" | "panel";
type ShellDemoPanelRenderProps = Readonly<{
  className: string;
  variant: ChatPanelVariant;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  dockActionPosition?: "before-variant" | "after-variant";
  showCloseAction: boolean;
}>;
type ShellDemoContent = Readonly<{
  title: string;
  assistantMessage: string;
  prompts?: readonly [string, string];
  userMessage: string;
  assistantReply: string;
  secondUserMessage?: string;
  closingMessage?: string;
  showRecommendation?: boolean;
}>;
type SpecialistActionDemoStateId =
  | "initial"
  | "matching"
  | "matched"
  | "scheduling"
  | "booked-online"
  | "booked-phone";
type VcaFabDemoState = VcaFabVisualState | "selected" | "disabled";

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

const overlayButtonIconStates: ReadonlyArray<
  DemoOption<OverlayButtonIconDemoState>
> = buttonStates;

const fieldContentStates: ReadonlyArray<DemoOption<FieldContentState>> = [
  { label: "Empty", value: "empty" },
  { label: "Filled", value: "filled" },
  { label: "Error", value: "error" },
  { label: "Disabled", value: "disabled" },
];

const navLinkItemStates: ReadonlyArray<DemoOption<NavLinkItemDemoState>> = [
  { label: "Default", value: "default" },
  { label: "Hover", value: "hover" },
  { label: "Active", value: "active" },
];

const navLinkItemIndicators: ReadonlyArray<
  DemoOption<NavLinkItemHorizontalIndicator>
> = [
  { label: "Bottom", value: "bottom" },
  { label: "Top", value: "top" },
  { label: "None", value: "none" },
];

const tabItemStates: ReadonlyArray<DemoOption<TabItemDemoState>> = [
  { label: "Default", value: "default" },
  { label: "Hover", value: "hover" },
  { label: "Active", value: "active" },
];

const tabItemTones: ReadonlyArray<DemoOption<TabItemHorizontalTone>> = [
  { label: "Default", value: "default" },
  { label: "Overlay", value: "overlay" },
];

const chatContextOptions: ReadonlyArray<DemoOption<ComponentLibraryContext>> = [
  { label: "Mobile", value: "mobile" },
  { label: "Desktop collapsed", value: "collapsed" },
  { label: "Desktop expanded", value: "expanded" },
];

const chatContextDisplayOptions: ReadonlyArray<
  DemoOption<ComponentLibraryContext> & Readonly<{ icon: IconName }>
> = [
  { label: "Mobile", value: "mobile", icon: "phone-handset" },
  { label: "Desktop collapsed", value: "collapsed", icon: "responsive" },
  { label: "Desktop expanded", value: "expanded", icon: "maximize" },
];

const shellDemoVersionOptions: ReadonlyArray<DemoOption<ShellDemoVersion>> = [
  { label: "Tray (hidden)", value: "dismissable" },
  { label: "Tray (persistent)", value: "persistent" },
  { label: "Tray (hybrid)", value: "hybrid" },
];

const shellDemoDeviceOptions: ReadonlyArray<
  DemoOption<ShellDemoDevice> & Readonly<{ icon: IconName }>
> = [
  { label: "Desktop", value: "desktop", icon: "responsive" },
  { label: "Mobile", value: "mobile", icon: "phone-handset" },
];

const shellDemoDesktopHeight = 820;
const shellDemoDesktopHeaderGap = 72;
const shellDemoDesktopPanelCollapsedHeight =
  shellDemoDesktopHeight - shellDemoDesktopHeaderGap;
const shellDemoDesktopPanelExpandedHeight =
  shellDemoDesktopHeight - 48;
const vcaFabStates: ReadonlyArray<DemoOption<VcaFabDemoState>> = [
  { label: "Default", value: "default" },
  { label: "Hover", value: "hover" },
  { label: "Active", value: "active" },
  { label: "Selected", value: "selected" },
  { label: "Focus", value: "focus-visible" },
  { label: "Disabled", value: "disabled" },
];
const genericShellDemoContent: ShellDemoContent = {
  title: "AI assistant",
  assistantMessage: "I can help answer questions and guide next steps.",
  prompts: [
    "Help me understand my options.",
    "Show me the recommended next step.",
  ],
  userMessage: "Help me understand my options.",
  assistantReply: "Here are the most relevant paths to compare first.",
  secondUserMessage: "Show me the recommended next step.",
  closingMessage: "I can keep the next step visible while you continue browsing.",
};

const hiringShellDemoContent: ShellDemoContent = {
  title: HIRING_CONCIERGE_TITLE,
  assistantMessage: "I can help compare hiring options quickly.",
  prompts: [
    "We need to ramp hiring fast this quarter.",
    "Help me compare Recruiter and Hiring Pro.",
  ],
  userMessage: "We need to ramp hiring fast this quarter.",
  assistantReply: "A sales consultant can narrow the setup fast.",
  secondUserMessage: "We want the fastest path to launch.",
  closingMessage: "Here's the quickest next step.",
  showRecommendation: true,
};

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
        role="switch"
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

function ContextualComponentDemoSection({
  children,
  controls,
  previewClassName,
}: Readonly<{
  children: ReactNode;
  controls?: ReactNode;
  previewClassName?: string;
}>) {
  return (
    <div className="space-y-6">
      {controls ? (
        <div className="rounded-[20px] border border-[#d7dce2] bg-[#f8f9fb] px-[28px] py-[22px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-end gap-x-[28px] gap-y-[16px]">
            {controls}
          </div>
        </div>
      ) : null}
      <div className="component-library-demo-preview flex justify-center overflow-x-auto py-2">
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
              <Icon name={option.icon} size="small" />
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

function renderDemoOverlayButtonIcon(
  state: OverlayButtonIconDemoState,
  color: NonNullable<OverlayButtonIconProps["color"]>,
  size: NonNullable<OverlayButtonIconProps["size"]>,
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
      visualState={state}
    />
  );
}

function renderDemoGhostButton(
  state: GhostButtonDemoState,
  size: NonNullable<GhostButtonProps["size"]>,
  emphasis: boolean,
  horizontalPadding: boolean,
  icon?: NonNullable<GhostButtonProps["icon"]>,
  iconAtEnd = false,
) {
  if (state === "disabled") {
    return (
      <GhostButton
        disabled
        emphasis={emphasis}
        horizontalPadding={horizontalPadding}
        icon={icon}
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
        icon={icon}
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
      icon={icon}
      iconAtEnd={iconAtEnd}
      size={size}
      visualState={state}
    >
      Button
    </GhostButton>
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

function getInitialShellDemoState(version: ShellDemoVersion): ShellDemoState {
  return version === "persistent" ? "tray" : "closed";
}

function DemoDeviceControl({
  value,
  onChange,
  ariaLabel = "Preview device",
}: Readonly<{
  value: ShellDemoDevice;
  onChange: (value: ShellDemoDevice) => void;
  ariaLabel?: string;
}>) {
  return (
    <div className="order-last ml-auto flex min-w-0 items-end">
      <div
        className="inline-flex w-fit max-w-full gap-0.5 rounded-[10px] border border-[#d7dce2] bg-background p-0.5"
        role="group"
        aria-label={ariaLabel}
      >
        {shellDemoDeviceOptions.map((option) => {
          const isSelected = option.value === value;

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
              <Icon name={option.icon} size="small" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatSurfaceDemoFrame({
  children,
  device,
  height = "standard",
}: Readonly<{
  children: ReactNode;
  device: ShellDemoDevice;
  height?: "short" | "standard" | "tall";
}>) {
  const context: ComponentLibraryContext =
    device === "mobile" ? "mobile" : "collapsed";

  return (
    <div
      className={cx(
        "mx-auto flex min-h-0 flex-col overflow-hidden border border-border-faint bg-background shadow-[0_10px_28px_rgba(0,0,0,0.08)]",
        getChatContextAssistantMaxClass(context),
        device === "mobile"
          ? "w-[375px] rounded-[25px]"
          : "w-[var(--design-layout-panel-collapsed-width)] rounded-panel",
        device === "mobile" && height === "short" && "h-[480px]",
        device === "mobile" && height === "standard" && "h-[620px]",
        device === "mobile" && height === "tall" && "h-[720px]",
        device !== "mobile" && height === "short" && "h-[360px]",
        device !== "mobile" && height === "standard" && "h-[520px]",
        device !== "mobile" && height === "tall" && "h-[620px]",
      )}
    >
      {children}
    </div>
  );
}

function ShellDemoBackdrop({
  body,
  ctaLabel,
  onOpen,
  title,
}: Readonly<{
  body: string;
  ctaLabel: string;
  onOpen: () => void;
  title: string;
}>) {
  return (
    <>
      <header className="flex h-[52px] items-center border-b border-border-faint bg-background px-6">
        <span
          aria-label="LinkedIn"
          role="img"
          className="inline-flex size-[26px] shrink-0 items-center justify-center text-action"
        >
          <Icon name="linked-in-bug" size="medium" />
        </span>
      </header>
      <section className="flex min-h-0 flex-1 items-center justify-center bg-background-neutral-soft px-6 text-center">
        <div className="flex max-w-[28rem] flex-col items-center gap-lg">
          <div className="space-y-xs">
            <h3 className="text-heading-lg text-text">{title}</h3>
            <p className="text-body-sm-open text-text-meta">
              {body}
            </p>
          </div>
          <Button size="small" onClick={onOpen}>
            {ctaLabel}
          </Button>
        </div>
      </section>
    </>
  );
}

function ShellDemoPanel({
  className,
  content,
  dockActionPosition,
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  showCloseAction,
  variant,
}: ShellDemoPanelRenderProps & Readonly<{ content: ShellDemoContent }>) {
  return (
    <ChatPanel variant={variant} className={className}>
      <ChatHeader
        variant={variant}
        title={content.title}
        onClose={onClose}
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
        dockActionPosition={dockActionPosition}
        showCloseAction={showCloseAction}
      />
      <ChatBody>
        <ChatThread>
          <ChatMessage>{content.assistantMessage}</ChatMessage>
          {content.prompts ? (
            <div className="flex flex-wrap gap-sm">
              {content.prompts.map((prompt) => (
                <Prompt key={prompt} prompt={prompt} />
              ))}
            </div>
          ) : null}
          <ChatMessage role="user">{content.userMessage}</ChatMessage>
          <ChatMessage>{content.assistantReply}</ChatMessage>
          {content.secondUserMessage ? (
            <ChatMessage role="user">{content.secondUserMessage}</ChatMessage>
          ) : null}
          {content.closingMessage ? (
            <ChatMessage>{content.closingMessage}</ChatMessage>
          ) : null}
          {content.showRecommendation ? <RecommendationCard /> : null}
        </ChatThread>
      </ChatBody>
      <ChatComposer variant={variant} />
    </ChatPanel>
  );
}

function ShellDemoSurface({
  device,
  renderPanel,
  version,
  shellState,
  shellTitle,
  panelVariant,
  onClose,
  onDock,
  onOpen,
  onOpenExpanded,
  onVariantToggle,
}: Readonly<{
  device: ShellDemoDevice;
  renderPanel: (props: ShellDemoPanelRenderProps) => ReactNode;
  version: ShellDemoVersion;
  shellState: ShellDemoState;
  shellTitle: string;
  panelVariant: ChatPanelVariant;
  onClose: () => void;
  onDock: () => void;
  onOpen: () => void;
  onOpenExpanded: () => void;
  onVariantToggle: () => void;
}>) {
  const isMobile = device === "mobile";
  const isPersistent = version === "persistent";
  const isHybrid = version === "hybrid";
  const canDockToTray = isPersistent || isHybrid;
  const showCloseAction = !isPersistent;
  const desktopShellRailClass =
    "absolute bottom-0 right-6 z-20 w-[min(calc(100%_-_48px),var(--design-layout-chat-tray-width))]";
  const panelClassName = isMobile
    ? "!h-full !w-full !rounded-none md:!h-full md:!w-full md:!rounded-none"
    : panelVariant === "expanded"
      ? "md:!h-[var(--shell-demo-panel-expanded-height)] md:!w-full"
      : "md:!h-[var(--shell-demo-panel-collapsed-height)] md:!w-full md:!rounded-t-md md:!rounded-b-none";
  const panelPositionClass = isMobile
    ? "absolute inset-0 z-20"
    : panelVariant === "expanded"
      ? "absolute left-1/2 top-1/2 z-20 w-[min(calc(100%_-_48px),var(--design-layout-panel-expanded-width))] -translate-x-1/2 -translate-y-1/2"
      : desktopShellRailClass;
  const trayClassName = isMobile
    ? "absolute bottom-0 left-0 right-0 z-20 w-full max-w-none"
    : desktopShellRailClass;

  return (
    <>
      {shellState === "panel" && !isMobile && panelVariant === "expanded" ? (
        <button
          type="button"
          aria-label="Collapse expanded chat"
          className="absolute inset-0 z-10 bg-overlay-dim"
          onClick={onVariantToggle}
        />
      ) : null}
      {shellState === "tray" ? (
        <ChatTray
          variant={panelVariant}
          aria-label="Open AI Concierge chat"
          className={trayClassName}
          title={shellTitle}
          onOpen={onOpen}
          onVariantToggle={isMobile || isHybrid ? undefined : onOpenExpanded}
          openActionPosition={isPersistent ? "after-variant" : undefined}
          onClose={isHybrid ? onClose : undefined}
          showCloseAction={isHybrid}
        />
      ) : null}
      {shellState === "panel" ? (
        <div className={panelPositionClass}>
          {renderPanel({
            className: panelClassName,
            variant: panelVariant,
            onClose: showCloseAction ? onClose : undefined,
            onMinimizeToTray: canDockToTray ? onDock : undefined,
            onVariantToggle: isMobile ? undefined : onVariantToggle,
            dockActionPosition: isPersistent ? "after-variant" : undefined,
            showCloseAction,
          })}
        </div>
      ) : null}
    </>
  );
}

function ShellDemoFrame({
  device,
  renderBackdrop,
  renderPanel,
  version,
  shellState,
  shellTitle,
  panelVariant,
  onClose,
  onDock,
  onOpen,
  onOpenExpanded,
  onVariantToggle,
}: Readonly<{
  device: ShellDemoDevice;
  renderBackdrop: (onOpen: () => void) => ReactNode;
  renderPanel: (props: ShellDemoPanelRenderProps) => ReactNode;
  version: ShellDemoVersion;
  shellState: ShellDemoState;
  shellTitle: string;
  panelVariant: ChatPanelVariant;
  onClose: () => void;
  onDock: () => void;
  onOpen: () => void;
  onOpenExpanded: () => void;
  onVariantToggle: () => void;
}>) {
  const page = (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {renderBackdrop(onOpen)}
      <ShellDemoSurface
        device={device}
        renderPanel={renderPanel}
        version={version}
        shellState={shellState}
        shellTitle={shellTitle}
        panelVariant={panelVariant}
        onClose={onClose}
        onDock={onDock}
        onOpen={onOpen}
        onOpenExpanded={onOpenExpanded}
        onVariantToggle={onVariantToggle}
      />
    </div>
  );

  if (device === "mobile") {
    return (
      <div className="mx-auto w-fit rounded-[34px] border border-[#cfd5dc] bg-[#111827] p-[10px] shadow-[0_16px_36px_rgba(0,0,0,0.18)]">
        <div className="h-[812px] w-[375px] overflow-hidden rounded-[25px] bg-background">
          {page}
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-[var(--shell-demo-desktop-height)] w-full min-w-[760px] overflow-hidden rounded-[16px] border border-border-faint bg-background shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
      style={
        {
          "--shell-demo-desktop-height": `${shellDemoDesktopHeight}px`,
          "--shell-demo-panel-collapsed-height": `${shellDemoDesktopPanelCollapsedHeight}px`,
          "--shell-demo-panel-expanded-height": `${shellDemoDesktopPanelExpandedHeight}px`,
        } as CSSProperties
      }
    >
      {page}
    </div>
  );
}

export function SharedShellDemo() {
  const [version, setVersion] = useState<ShellDemoVersion>("dismissable");
  const [device, setDevice] = useState<ShellDemoDevice>("desktop");
  const [shellState, setShellState] = useState<ShellDemoState>(
    getInitialShellDemoState("dismissable"),
  );
  const [panelVariant, setPanelVariant] =
    useState<ChatPanelVariant>("collapsed");

  function resetShell(nextVersion = version) {
    setPanelVariant("collapsed");
    setShellState(getInitialShellDemoState(nextVersion));
  }

  function handleVersionChange(nextVersion: ShellDemoVersion) {
    setVersion(nextVersion);
    resetShell(nextVersion);
  }

  function handleDeviceChange(nextDevice: ShellDemoDevice) {
    setDevice(nextDevice);
    resetShell();
  }

  function openPanel() {
    setPanelVariant("collapsed");
    setShellState("panel");
  }

  function openExpandedPanel() {
    setPanelVariant("expanded");
    setShellState("panel");
  }

  function closeShell() {
    setPanelVariant("collapsed");
    setShellState("closed");
  }

  function dockShell() {
    setPanelVariant("collapsed");
    setShellState("tray");
  }

  function togglePanelVariant() {
    setPanelVariant((currentVariant) =>
      currentVariant === "collapsed" ? "expanded" : "collapsed",
    );
  }

  return (
    <ContextualComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Version"
            value={version}
            options={shellDemoVersionOptions}
            onChange={handleVersionChange}
          />
          <DemoDeviceControl
            value={device}
            onChange={handleDeviceChange}
            ariaLabel="Shell preview device"
          />
        </>
      }
      previewClassName="w-full"
    >
      <ShellDemoFrame
        device={device}
        renderBackdrop={(handleOpen) => (
          <ShellDemoBackdrop
            title="Sample page"
            body="Click the button to open the shell and see where it lives on the page."
            ctaLabel="Open shell"
            onOpen={handleOpen}
          />
        )}
        renderPanel={(panelProps) => (
          <ShellDemoPanel
            {...panelProps}
            content={genericShellDemoContent}
          />
        )}
        version={version}
        shellState={shellState}
        shellTitle={genericShellDemoContent.title}
        panelVariant={panelVariant}
        onClose={closeShell}
        onDock={dockShell}
        onOpen={openPanel}
        onOpenExpanded={openExpandedPanel}
        onVariantToggle={togglePanelVariant}
      />
    </ContextualComponentDemoSection>
  );
}

function HiringMicrositeBackdrop({
  onOpen,
}: Readonly<{
  onOpen: () => void;
}>) {
  return (
    <>
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-border-subtle bg-background px-6">
        <Image
          src="/assets/logo-lockup.svg"
          alt="LinkedIn Hire"
          width={162}
          height={27}
          className="h-[27px] w-[162px]"
        />
        <div className="flex items-center gap-5">
          <nav
            aria-label="LinkedIn Hiring"
            className="hidden items-center gap-5 text-[15px] font-semibold leading-none text-action lg:flex"
          >
            <span>Products</span>
            <span>Resources</span>
            <span>Pricing</span>
          </nav>
          <Button
            variant="secondary"
            size="small"
            aria-haspopup="dialog"
            onClick={onOpen}
          >
            Contact sales
          </Button>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-[1009px] flex-1 items-center gap-12 px-8">
        <div className="aspect-square w-full max-w-[360px] shrink-0 overflow-hidden rounded-[14px] bg-background-neutral-soft">
          <Image
            src="/assets/hiring-hero.png"
            alt="Professional portrait for LinkedIn Hiring"
            width={1098}
            height={1140}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex max-w-[514px] flex-col items-start gap-8">
          <div className="space-y-3">
            <p className="text-[16px] font-bold uppercase leading-[1.25] tracking-[0.32px] text-text">
              Hire with LinkedIn
            </p>
            <h3 className="max-w-[514px] text-[56px] font-bold leading-[1.16] text-text">
              Hire the people you need
            </h3>
          </div>
          <Button aria-haspopup="dialog" onClick={onOpen}>
            Contact sales
          </Button>
        </div>
      </section>
    </>
  );
}

function PremiumSurveyBackdrop({
  onOpen,
  showFab = true,
}: Readonly<{
  onOpen: () => void;
  showFab?: boolean;
}>) {
  return (
    <>
      <header className="flex h-[52px] items-center justify-between border-b border-border-faint bg-background px-6">
        <PremiumLinkedInBug className="size-[26px] [&_span]:!size-[26px]" />
        <PremiumProgressIndicator progress={25} />
        <Entity size={32} label="Signed-in member" />
      </header>
      <section className="bg-background px-6 pb-7 pt-8 text-center">
        <div className="mx-auto flex max-w-[762px] flex-col items-center gap-lg">
          <div className="flex flex-col items-center gap-sm">
            <h3 className="text-heading-xl text-text">
              Premium members are 2.6x more likely to get hired on average
            </h3>
            <p className="text-body-md-open text-text">
              Enjoy 1-month free on us. Cancel anytime. We&apos;ll remind you
              7 days before your trial ends.
            </p>
          </div>
          <div className="flex items-center justify-center gap-sm">
            <PremiumEntityStack />
            <p className="text-body-sm text-text-meta">
              Millions of members use Premium
            </p>
          </div>
        </div>
      </section>
      <section className="flex min-h-0 flex-1 justify-center bg-background-neutral-soft px-6 pb-32 pt-6">
        <div className="w-full max-w-[558px]">
          <div className="rounded-sm bg-background px-xxl pb-xxxl pt-xxl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-xxl">
              <div className="flex flex-col gap-md">
                <PremiumProfileMark />
                <div className="flex flex-col gap-md">
                  <h4 className="text-heading-lg text-text">
                    Alex, are you interested in Premium for personal or
                    professional use?
                  </h4>
                  <p className="text-body-sm text-text">
                    We&apos;ll find the best plan for you.
                  </p>
                </div>
              </div>
              <div
                role="radiogroup"
                aria-label="Premium use"
                className="flex flex-col gap-sm"
              >
                <PremiumSurveyOption
                  checked
                  label="I'd use Premium for my personal goals"
                />
                <PremiumSurveyOption
                  checked={false}
                  label="I'd use Premium as part of my job"
                />
              </div>
              <div className="flex justify-end">
                <Button size="small" className="w-[76px] px-0">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showFab ? (
        <div className="absolute bottom-8 right-10 z-10">
          <PremiumConciergeFab onClick={onOpen} position="static" />
        </div>
      ) : null}
    </>
  );
}

export function SharedConfirmationDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  function openDialog() {
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
  }

  return (
    <ContextualComponentDemoSection previewClassName="w-full">
      <div className="relative h-[420px] min-w-[760px] overflow-hidden rounded-[16px] border border-border-faint bg-background shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
        <header className="relative z-0 flex h-16 items-center justify-between border-b border-border-subtle bg-background px-6">
          <Image
            src="/assets/logo-lockup.svg"
            alt="LinkedIn Hire"
            width={162}
            height={27}
            className="h-[27px] w-[162px]"
          />
          <div className="flex items-center gap-5">
            <nav
              aria-label="LinkedIn Hiring"
              className="flex items-center gap-5 text-[15px] font-semibold leading-none text-action"
            >
              <button
                type="button"
                className="outline-none transition-colors duration-150 ease-out hover:text-action-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
                onClick={openDialog}
              >
                Products
              </button>
              <button
                type="button"
                className="outline-none transition-colors duration-150 ease-out hover:text-action-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
                onClick={openDialog}
              >
                Compare Products
              </button>
              <button
                type="button"
                className="outline-none transition-colors duration-150 ease-out hover:text-action-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
                onClick={openDialog}
              >
                Resources &amp; Support
              </button>
            </nav>
            <Button variant="secondary" size="small">
              Contact sales
            </Button>
          </div>
        </header>
        <div className="h-[356px] bg-white" />

        <ConfirmationDialog
          open={isDialogOpen}
          title="Leave this page?"
          confirmLabel="Leave page"
          cancelLabel="Stay in chat"
          onDismiss={closeDialog}
          scope="container"
          onConfirm={closeDialog}
          onCancel={closeDialog}
        >
          <p className="m-0">Leaving will clear this chat.</p>
        </ConfirmationDialog>
      </div>
    </ContextualComponentDemoSection>
  );
}

export function SharedConfirmationVariants() {
  const [alignment, setAlignment] = useState<"center" | "top">("center");

  return (
    <ContextualComponentDemoSection
      controls={
        <SegmentedControl
          label="Alignment"
          value={alignment}
          options={[
            { label: "Center", value: "center" },
            { label: "Top", value: "top" },
          ]}
          onChange={setAlignment}
        />
      }
      previewClassName="w-full"
    >
      <div className="relative h-[420px] min-w-[760px] overflow-hidden rounded-[16px] border border-border-faint bg-background shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
        <div className="h-full bg-white" />
        <ConfirmationDialog
          open
          title="Confirmation"
          confirmLabel="Confirm"
          cancelLabel="Secondary"
          tertiaryLabel="Tertiary"
          alignment={alignment}
          scope="container"
          onConfirm={() => {}}
          onCancel={() => {}}
          onTertiary={() => {}}
          onDismiss={() => {}}
        >
          <p className="m-0">Body copy explaining the consequence.</p>
        </ConfirmationDialog>
      </div>
    </ContextualComponentDemoSection>
  );
}

export function SharedShellHiringMicrositeDemo() {
  const [shellState, setShellState] = useState<ShellDemoState>("closed");
  const [panelVariant, setPanelVariant] =
    useState<ChatPanelVariant>("collapsed");

  function openPanel() {
    setPanelVariant("collapsed");
    setShellState("panel");
  }

  function closeShell() {
    setPanelVariant("collapsed");
    setShellState("closed");
  }

  function togglePanelVariant() {
    setPanelVariant((currentVariant) =>
      currentVariant === "collapsed" ? "expanded" : "collapsed",
    );
  }

  return (
    <ContextualComponentDemoSection previewClassName="w-full">
      <ShellDemoFrame
        device="desktop"
        renderBackdrop={(handleOpen) => (
          <HiringMicrositeBackdrop onOpen={handleOpen} />
        )}
        renderPanel={(panelProps) => (
          <ShellDemoPanel {...panelProps} content={hiringShellDemoContent} />
        )}
        version="dismissable"
        shellState={shellState}
        shellTitle={HIRING_CONCIERGE_TITLE}
        panelVariant={panelVariant}
        onClose={closeShell}
        onDock={closeShell}
        onOpen={openPanel}
        onOpenExpanded={openPanel}
        onVariantToggle={togglePanelVariant}
      />
    </ContextualComponentDemoSection>
  );
}

export function SharedShellPremiumSurveyDemo() {
  const [shellState, setShellState] = useState<ShellDemoState>("closed");
  const [panelVariant, setPanelVariant] =
    useState<ChatPanelVariant>("collapsed");

  function openPanel() {
    setPanelVariant("collapsed");
    setShellState("panel");
  }

  function closeShell() {
    setPanelVariant("collapsed");
    setShellState("closed");
  }

  function togglePanelVariant() {
    setPanelVariant((currentVariant) =>
      currentVariant === "collapsed" ? "expanded" : "collapsed",
    );
  }

  return (
    <ContextualComponentDemoSection previewClassName="w-full">
      <ShellDemoFrame
        device="desktop"
        renderBackdrop={(handleOpen) => (
          <PremiumSurveyBackdrop onOpen={handleOpen} />
        )}
        renderPanel={(panelProps) => (
          <PremiumConciergePanel
            className={panelProps.className}
            variant={panelProps.variant}
            context="use-case"
            onClose={panelProps.onClose}
            onVariantToggle={panelProps.onVariantToggle}
            showCloseAction={panelProps.showCloseAction}
          />
        )}
        version="dismissable"
        shellState={shellState}
        shellTitle={PREMIUM_CONCIERGE_TITLE}
        panelVariant={panelVariant}
        onClose={closeShell}
        onDock={closeShell}
        onOpen={openPanel}
        onOpenExpanded={openPanel}
        onVariantToggle={togglePanelVariant}
      />
    </ContextualComponentDemoSection>
  );
}

export function SharedHeaderDemo() {
  const [mode, setMode] = useState("hiring");
  const [hasLiveAgent, setHasLiveAgent] = useState(false);
  const [shellVersion, setShellVersion] =
    useState<ShellDemoVersion>("dismissable");
  const [isDocked, setIsDocked] = useState(false);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const [device, setDevice] = useState<ShellDemoDevice>("desktop");
  const isMobile = device === "mobile";
  const isPersistent = shellVersion === "persistent";
  const hasDockAction = shellVersion === "persistent" || shellVersion === "hybrid";
  const shouldShowDockedTray = hasDockAction && isDocked;
  const panelVariant = getPanelVariantForContext(
    isMobile ? "mobile" : "collapsed",
  );
  const headerIdentity =
    hasLiveAgent
      ? ({
          type: "representative",
          name: "David S.",
          role: "Sales consultant",
        } as const)
      : undefined;
  const headerTitle =
    mode === "premium" ? PREMIUM_CONCIERGE_TITLE : HIRING_CONCIERGE_TITLE;

  function handleLiveAgentChange(nextHasLiveAgent: boolean) {
    setHasLiveAgent(nextHasLiveAgent);
    if (!nextHasLiveAgent) {
      setHasUnreadMessage(false);
    }
  }

  function handleHeaderShellChange(nextShellVersion: ShellDemoVersion) {
    setShellVersion(nextShellVersion);
    if (nextShellVersion === "dismissable") {
      setIsDocked(false);
    }
  }

  function dockHeaderDemo() {
    if (hasDockAction) {
      setIsDocked(true);
    }
  }

  function openHeaderDemo() {
    setIsDocked(false);
  }

  return (
    <ContextualComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Header"
            value={mode}
            options={[
              { label: "Hiring", value: "hiring" },
              { label: "Premium", value: "premium" },
            ]}
            onChange={setMode}
          />
          <ToggleControl
            label="Live agent"
            checked={hasLiveAgent}
            onChange={handleLiveAgentChange}
          />
          <SegmentedControl
            label="Shell"
            value={shellVersion}
            options={shellDemoVersionOptions}
            onChange={handleHeaderShellChange}
          />
          {hasLiveAgent ? (
            <ToggleControl
              label="Unread message"
              checked={hasUnreadMessage}
              onChange={setHasUnreadMessage}
            />
          ) : null}
          <DemoDeviceControl value={device} onChange={setDevice} />
        </>
      }
    >
      <ChatSurfaceDemoFrame device={device} height="short">
        {shouldShowDockedTray ? (
          <div className="relative flex min-h-0 flex-1 items-center justify-center bg-background-neutral-soft px-xl text-center">
            <p className="max-w-[18rem] text-body-sm-open text-text-meta">
              Docked tray uses the compact header treatment.
            </p>
            <ChatTray
              aria-label="Open AI Concierge chat"
              badge={hasLiveAgent && hasUnreadMessage}
              badgeLabel="Unread message"
              className={
                isMobile
                  ? "absolute bottom-0 left-0 right-0 w-full max-w-none"
                  : "absolute bottom-0 right-0"
              }
              identity={headerIdentity}
              title={headerTitle}
              onOpen={openHeaderDemo}
              onVariantToggle={
                isMobile || shellVersion === "hybrid" ? undefined : () => {}
              }
              openActionPosition={isPersistent ? "after-variant" : undefined}
              onClose={shellVersion === "hybrid" ? openHeaderDemo : undefined}
              showCloseAction={shellVersion === "hybrid"}
            />
          </div>
        ) : (
          <ChatHeader
            variant={panelVariant}
            identity={headerIdentity}
            title={headerTitle}
            dockActionPosition={isPersistent ? "after-variant" : undefined}
            onMinimizeToTray={hasDockAction ? dockHeaderDemo : undefined}
            onVariantToggle={isMobile ? undefined : () => {}}
            showCloseAction={!isPersistent}
          />
        ) }
        {!shouldShowDockedTray ? (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-background-neutral-soft px-xl text-center">
            <p className="max-w-[18rem] text-body-sm-open text-text-meta">
              Header controls adapt to the selected shell and device.
            </p>
          </div>
        ) : null}
      </ChatSurfaceDemoFrame>
    </ContextualComponentDemoSection>
  );
}

function HeaderVariantReferenceFrame({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <ChatPanel
      variant="collapsed"
      className="!h-auto border-b-0 md:!w-[var(--design-layout-panel-collapsed-width)]"
    >
      {children}
    </ChatPanel>
  );
}

export function SharedHeaderVariants() {
  return (
    <div className="space-y-16">
      <section>
        <h3 className="mb-md text-[18px] font-medium leading-6 text-text">
          LTS hiring microsite
        </h3>
        <HeaderVariantReferenceFrame>
          <ChatHeader title={HIRING_CONCIERGE_TITLE} onVariantToggle={() => {}} />
        </HeaderVariantReferenceFrame>
      </section>
      <section>
        <h3 className="mb-md text-[18px] font-medium leading-6 text-text">
          Premium survey
        </h3>
        <HeaderVariantReferenceFrame>
          <ChatHeader title={PREMIUM_CONCIERGE_TITLE} onVariantToggle={() => {}} />
        </HeaderVariantReferenceFrame>
      </section>
      <section>
        <h3 className="mb-md text-[18px] font-medium leading-6 text-text">
          Live agent
        </h3>
        <p className="mb-md max-w-[40rem] text-body-sm-open text-text-meta">
          Used once a live agent joins. The header shows the agent avatar and
          name so it feels clear that a person is now helping.
        </p>
        <HeaderVariantReferenceFrame>
          <ChatHeader
            identity={{
              type: "representative",
              name: "David S.",
              role: "Sales consultant",
            }}
            onVariantToggle={() => {}}
          />
        </HeaderVariantReferenceFrame>
      </section>
    </div>
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
        {messageType === "user" ? (
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
          <ChatMessage>I can help compare hiring options quickly.</ChatMessage>
        )}
      </ChatThreadContextFrame>
    </ComponentDemoSection>
  );
}

export function SharedFeedbackDemo() {
  return (
    <ComponentDemoSection>
      <ChatThreadContextFrame context="collapsed">
        <div className="space-y-xs">
          <ChatMessage>
            I would compare the lighter hiring path against Recruiter before routing you to sales.
          </ChatMessage>
          <ChatMessageFeedbackFlow timestamp="1:01 PM" />
        </div>
      </ChatThreadContextFrame>
    </ComponentDemoSection>
  );
}

export function SharedEndChatCsatDemo() {
  return (
    <ComponentDemoSection>
      <ChatPanel
        variant="collapsed"
        className="!h-[640px] !w-[var(--design-layout-panel-collapsed-width)] md:!h-[640px] md:!w-[var(--design-layout-panel-collapsed-width)]"
      >
        <ChatHeader title="Contact sales" showAiMark />
        <ChatEndFeedbackScreen
          onBackToChat={() => {}}
          onEndChat={() => {}}
        />
      </ChatPanel>
    </ComponentDemoSection>
  );
}

function FeedbackVariantHeading({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <h3 className="mb-md text-[18px] font-medium leading-6 text-text">
      {children}
    </h3>
  );
}

export function SharedFeedbackVariants() {
  const selectedReasons: ReadonlyArray<ChatFeedbackReason> = [
    "confusing",
    "not-what-im-looking-for",
  ];

  return (
    <div className="space-y-16">
      <section>
        <FeedbackVariantHeading>Rating</FeedbackVariantHeading>
        <ChatThreadContextFrame context="collapsed">
          <div className="flex justify-start">
            <ChatMessageFeedback timestamp="1:00 PM" />
          </div>
        </ChatThreadContextFrame>
      </section>
      <section>
        <FeedbackVariantHeading>Selected rating</FeedbackVariantHeading>
        <ChatThreadContextFrame context="collapsed">
          <div className="flex justify-start">
            <ChatMessageFeedback value="thumbs-down" timestamp="1:03 PM" />
          </div>
        </ChatThreadContextFrame>
      </section>
      <section>
        <FeedbackVariantHeading>Reason chips</FeedbackVariantHeading>
        <ChatThreadContextFrame context="collapsed">
          <ChatFeedbackReasonChips values={selectedReasons} />
        </ChatThreadContextFrame>
      </section>
      <section>
        <FeedbackVariantHeading>Optional feedback</FeedbackVariantHeading>
        <ChatThreadContextFrame context="collapsed">
          <ChatFeedbackReasonPanel
            values={selectedReasons}
            comment="The recommendation did not explain which option is fastest to launch."
            onValuesChange={() => {}}
            onCommentChange={() => {}}
            onClose={() => {}}
            onSubmit={() => {}}
          />
        </ChatThreadContextFrame>
      </section>
      <section>
        <FeedbackVariantHeading>Submitted</FeedbackVariantHeading>
        <ChatThreadContextFrame context="collapsed">
          <div className="flex justify-start">
            <ChatInlineFeedback>Thank you for the feedback.</ChatInlineFeedback>
          </div>
        </ChatThreadContextFrame>
      </section>
    </div>
  );
}

export function SharedComposerDemo() {
  const [state, setState] = useState("empty");
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  const [showAttachAction, setShowAttachAction] = useState(true);
  const [showDictationAction, setShowDictationAction] = useState(true);
  const [responseStopped, setResponseStopped] = useState(false);
  const [device, setDevice] = useState<ShellDemoDevice>("desktop");
  const panelVariant = getPanelVariantForContext(
    device === "mobile" ? "mobile" : "collapsed",
  );
  const isResponding = state === "responding" && !responseStopped;

  function handleStateChange(nextState: string) {
    setState(nextState);
    setResponseStopped(false);
  }

  return (
    <ContextualComponentDemoSection
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
            onChange={handleStateChange}
          />
          <ToggleControl
            label="Voice mode"
            checked={showVoiceMode}
            onChange={setShowVoiceMode}
          />
          <ToggleControl
            label="Add file"
            checked={showAttachAction}
            onChange={setShowAttachAction}
          />
          <ToggleControl
            label="Dictate"
            checked={showDictationAction}
            onChange={setShowDictationAction}
          />
          <DemoDeviceControl value={device} onChange={setDevice} />
        </>
      }
    >
      <ChatSurfaceDemoFrame device={device}>
        <ChatHeader title={HIRING_CONCIERGE_TITLE} showCloseAction={false} />
        <ChatBody>
          <ChatThread showAiDisclaimer={false}>
            <ChatMessage>I can help compare hiring options quickly.</ChatMessage>
            <ChatMessage role="user">
              We need to ramp hiring fast this quarter.
            </ChatMessage>
            {state === "responding" && responseStopped ? (
              <div className="flex justify-start">
                <ChatInlineFeedback tone="neutral">Response stopped.</ChatInlineFeedback>
              </div>
            ) : null}
          </ChatThread>
        </ChatBody>
        <ChatComposer
          key={`${state}-${device}`}
          variant={panelVariant}
          isResponding={isResponding}
          onStopResponse={() => setResponseStopped(true)}
          showAttachAction={showAttachAction}
          showDictationAction={showDictationAction}
          showVoiceMode={showVoiceMode}
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
      </ChatSurfaceDemoFrame>
    </ContextualComponentDemoSection>
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

function GenericSidePanelDemoContent() {
  return (
    <ChatSidePanel
      onBack={() => {}}
      footerClassName="mt-stack-lg flex flex-col gap-md border-t border-border-faint pt-xl sm:flex-row sm:items-center sm:justify-between"
      footer={
        <>
          <p className="min-h-[1.25rem] text-body-sm-open text-text-meta">
            You can return to chat at any time.
          </p>
          <div className="flex flex-col gap-sm sm:flex-row">
            <Button className="w-full sm:w-fit" variant="secondary">
              Cancel
            </Button>
            <Button className="w-full sm:w-fit">Continue</Button>
          </div>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-md">
        <h2 className="text-heading-xl text-text">Review request details</h2>
        <Tag size="medium">Example</Tag>
      </div>

      <p className="mt-sm max-w-[34rem] text-body-sm-open text-text-meta">
        Confirm the context before moving ahead with the next step.
      </p>

      <article className="mt-xxl flex w-full max-w-[21.5rem] items-center gap-sm rounded-md border border-border-faint bg-background pb-xl pl-xl pr-lg pt-xl">
        <Entity size={48} label="Focused task placeholder" />
        <div className="min-w-0">
          <p className="text-heading-md text-text">Focused task</p>
          <p className="text-body-xs text-text-meta">
            Reusable side panel content
          </p>
        </div>
      </article>

      <section className="mt-stack-lg space-y-lg">
        <h3 className="text-heading-lg text-text">Context</h3>
        <p className="max-w-[34rem] text-body-sm-open text-text-meta">
          Confirm the context before moving ahead with the next step.
        </p>
      </section>

      <section className="mt-stack-lg space-y-lg">
        <h3 className="text-heading-lg text-text">Selected option</h3>
        <div className="flex flex-wrap gap-x-sm gap-y-xs">
          <Pill checked>Recommended</Pill>
          <Pill>Alternative</Pill>
          <Pill>More details</Pill>
        </div>
      </section>

      <section className="mt-stack-lg space-y-lg">
        <h3 className="text-heading-lg text-text">Next step</h3>
        <p className="max-w-[34rem] text-body-sm-open text-text-meta">
          Continue with a guided setup while the chat remains available.
        </p>
      </section>
    </ChatSidePanel>
  );
}

function GenericSidePanelChatHistory() {
  return (
    <ChatThread timestamp="9:24 PM" showAiDisclaimer={false}>
      <ChatMessage>
        I can keep the conversation here while you complete a focused task.
      </ChatMessage>
      <ChatMessage role="user" timestamp="9:25 PM">
        Show me the next step.
      </ChatMessage>
    </ChatThread>
  );
}

export function SharedSidePanelDemo() {
  const [view, setView] = useState<SidePanelDemoView>("panel");
  const [context, setContext] =
    useState<ComponentLibraryContext>("collapsed");
  const variant = getPanelVariantForContext(context);

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="View"
            value={view}
            options={[
              { label: "Panel only", value: "panel" },
              { label: "In chat shell", value: "shell" },
            ]}
            onChange={setView}
          />
          <ChatContextControl value={context} onChange={setContext} />
        </>
      }
    >
      <SidePanelContextFrame context={context}>
        {view === "panel" ? (
          <GenericSidePanelDemoContent />
        ) : (
          <ChatPanel
            variant={variant}
            className={cx(
              "md:!h-full md:!w-full",
              getMobilePanelOverrideClass(context),
            )}
          >
            <ChatHeader title="Contact sales" showAiMark variant={variant} />
            <ChatSidePanelLayout
              history={<GenericSidePanelChatHistory />}
              sidePanel={<GenericSidePanelDemoContent />}
              variant={variant}
            />
          </ChatPanel>
        )}
      </SidePanelContextFrame>
    </ComponentDemoSection>
  );
}

export function PremiumFabReviewPreview() {
  return (
    <PremiumFabPreviewFrame>
      <PremiumConciergeFab onClick={() => {}} position="static" />
    </PremiumFabPreviewFrame>
  );
}

export function VcaFabReviewPreview() {
  return (
    <VcaFabPreviewFrame>
      <VcaFab onClick={() => {}} position="static" />
    </VcaFabPreviewFrame>
  );
}

export function VcaFabPresenceBadgeExplorationPreview() {
  return (
    <div className="flex flex-wrap items-start gap-xl">
      <div className="space-y-xs">
        <p className="text-body-xs text-text-meta">Visitor FAB</p>
        <div className="flex min-h-20 min-w-20 items-center justify-center rounded-lg border border-border-faint bg-background-neutral-soft">
          <VcaFab
            accentColor="#2AA986"
            borderColor="#2AA986"
            borderHoverColor="#2AA986"
            onClick={() => {}}
            position="static"
          />
        </div>
      </div>
    </div>
  );
}

export function VcaFabStatesPreview() {
  return (
    <div className="flex flex-wrap items-start gap-xl">
      {vcaFabStates.map(({ label, value }) => (
        <div key={value} className="space-y-xs">
          <p className="text-body-xs text-text-meta">{label}</p>
          <div className="flex min-h-20 min-w-20 items-center justify-center rounded-lg border border-border-faint bg-background-neutral-soft">
            <VcaFab
              onClick={() => {}}
              position="static"
              selected={value === "selected"}
              visualState={
                value === "disabled" || value === "selected"
                  ? "default"
                  : value
              }
              disabled={value === "disabled"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VcaFabSwappableMarkPreview() {
  return (
    <div className="flex flex-wrap items-start gap-xl">
      <div className="space-y-xs">
        <p className="text-body-xs text-text-meta">Visitor mark</p>
        <div className="flex min-h-20 min-w-20 items-center justify-center rounded-lg border border-border-faint bg-background-neutral-soft">
          <VcaFab onClick={() => {}} position="static" />
        </div>
      </div>
      <div className="space-y-xs">
        <p className="text-body-xs text-text-meta">Admin mark</p>
        <div className="flex min-h-20 min-w-20 items-center justify-center rounded-lg border border-border-faint bg-background-neutral-soft">
          <VcaFab
            accentColor="#2AA986"
            label="Open assistant"
            onClick={() => {}}
            position="static"
            variant="admin"
          />
        </div>
      </div>
      <div className="space-y-xs">
        <p className="text-body-xs text-text-meta">Gold admin mark</p>
        <div className="flex min-h-20 min-w-20 items-center justify-center rounded-lg border border-border-faint bg-background-neutral-soft">
          <VcaFab
            adminTone="gold"
            label="Open assistant"
            onClick={() => {}}
            position="static"
            variant="admin"
          />
        </div>
      </div>
      <div className="space-y-xs">
        <p className="text-body-xs text-text-meta">Selected admin mark</p>
        <div className="flex min-h-20 min-w-20 items-center justify-center rounded-lg border border-border-faint bg-background-neutral-soft">
          <VcaFab
            accentColor="#2AA986"
            label="Open assistant"
            onClick={() => {}}
            position="static"
            selected
            variant="admin"
          />
        </div>
      </div>
    </div>
  );
}

function PcpContextPreviewFrame({
  children,
  wide = false,
}: Readonly<{ children: ReactNode; wide?: boolean }>) {
  return (
    <div
      className={cx(
        "w-full min-w-0",
        wide ? "max-w-[680px]" : "max-w-[24rem]",
      )}
    >
      {children}
    </div>
  );
}

export function PcpVcaSidePanelShellPreview({
  kind,
}: Readonly<{ kind: PremiumCompanyPagesVcaSidePanelPreviewKind }>) {
  return (
    <SidePanelContextFrame context="collapsed">
      <PremiumCompanyPagesVcaSidePanelPreview
        kind={kind}
        variant="collapsed"
      />
    </SidePanelContextFrame>
  );
}

export function PcpTodayActionCardsPreview() {
  const preventPreviewNavigation: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex w-full flex-col gap-md">
      <TodayActionCard
        badge={{ label: "Premium", tone: "premium" }}
        description="Automatically invite post-engagers to follow."
        dismissLabel="Dismiss Auto-Invite action"
        headline="Turn on Auto-Invite to grow new followers 6.7x faster"
        inlineAction={{
          label: "Enable",
          onSelect: preventPreviewNavigation,
        }}
        onDismiss={() => {}}
      />
      <TodayActionCard
        description="Follow other Pages to stay connected to your industry and easily join relevant conversations."
        dismissLabel="Dismiss follow other Pages action"
        headline="Follow other Pages"
        inlineAction={{
          label: "Follow",
          onSelect: preventPreviewNavigation,
        }}
        onDismiss={() => {}}
      />
    </div>
  );
}

export function PcpInsightCardSystemPreview() {
  const askAiAction = (id: string): InsightCardAction => ({
    id,
    kind: "ask-ai",
    label: "Ask",
    onSelect: () => {},
  });

  return (
    <div className="flex w-full flex-col gap-md">
      <section className="space-y-sm">
        <p className="text-body-xs font-semibold text-text-meta">Lead · Tier 1</p>
        <InsightCard
          action={{
            id: "view-message",
            kind: "link",
            label: "View message",
            onSelect: () => {},
          }}
          dismissLabel="Dismiss lead insight"
          evidence="She viewed the Arbor Retail Group post and sent Rose a message."
          headline="A VP of HR sent you a message"
          onDismiss={() => {}}
          type="lead-tier-1"
          visual={{
            kind: "avatar",
            label: "Cheri Sparks",
            src: "/assets/premium-company-pages/member/cheri-sparks.png",
          }}
        />
      </section>

      <section className="space-y-sm">
        <p className="text-body-xs font-semibold text-text-meta">
          Anomaly
        </p>
        <InsightCard
          action={askAiAction("ask-ai-anomaly")}
          dismissLabel="Dismiss follower growth insight"
          evidence="Down 18% after posting slowed to once a week."
          headline="Recover your follower growth"
          onDismiss={() => {}}
          type="anomaly"
        />
      </section>

      <section className="space-y-sm">
        <p className="text-body-xs font-semibold text-text-meta">
          Opportunity
        </p>
        <InsightCard
          action={askAiAction("ask-ai-opportunity")}
          dismissLabel="Dismiss opportunity insight"
          evidence="Your top 2 posts by engagement both focus on carrier readiness and eligibility cleanup."
          headline="Carrier coordination content is resonating"
          onDismiss={() => {}}
          type="opportunity"
          visual={{
            alt: "Carrier coordination post preview",
            kind: "post-thumbnail",
            src: "/assets/premium-company-pages/member/post-image-1.png",
          }}
        />
      </section>

      <section className="space-y-sm">
        <p className="text-body-xs font-semibold text-text-meta">
          Strong-fit visitor · Tier 2
        </p>
        <InsightCard
          action={askAiAction("ask-ai-strong-fit")}
          dismissLabel="Dismiss strong-fit visitor insight"
          evidence="Priya viewed carrier coordination content and matches your benefits leader audience."
          headline="A benefits director matches your ICP"
          onDismiss={() => {}}
          signal={{
            tone: "profile",
            text: "Viewed carrier coordination content twice this week",
          }}
          type="strong-fit-tier-2"
          visual={{
            kind: "avatar",
            label: "Priya Shah",
            src: "/assets/premium-company-pages/avatar-3.png",
          }}
        />
      </section>

      <section className="space-y-sm">
        <p className="text-body-xs font-semibold text-text-meta">
          Competitive
        </p>
        <InsightCard
          action={askAiAction("ask-ai-competitive")}
          dismissLabel="Dismiss competitive insight"
          evidence="82 new followers this month vs. Velora's 29."
          headline={`${pcpCompetitorNames[0]} is pulling ahead in follower growth`}
          onDismiss={() => {}}
          type="competitive"
          visual={{
            kind: "company-logo",
            label: pcpCompetitorNames[0],
          }}
        />
      </section>

      <section className="space-y-sm">
        <p className="text-body-xs font-semibold text-text-meta">
          Audience fit
        </p>
        <InsightCard
          action={askAiAction("ask-ai-audience-fit")}
          dismissLabel="Dismiss audience fit insight"
          evidence="64% of engaged visitors work in HR, benefits, or people operations."
          headline="Your page is reaching more relevant visitors"
          onDismiss={() => {}}
          type="audience-fit"
          visual={{
            kind: "avatar-pair",
            primary: {
              label: "Priya Shah",
              src: "/assets/premium-company-pages/avatar-3.png",
            },
            secondary: {
              label: "Dana Kim",
              src: "/assets/premium-company-pages/avatar-2.png",
            },
          }}
        />
      </section>
    </div>
  );
}

export function PcpInboxAiContextStripPreview() {
  return (
    <PcpContextPreviewFrame wide>
      <PremiumCompanyPagesInboxContextStripPreview />
    </PcpContextPreviewFrame>
  );
}

function PremiumFabPreviewFrame({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative h-56 w-full min-w-[20rem] overflow-hidden rounded-lg border border-border-faint bg-background-neutral-soft">
      <div className="absolute bottom-xl right-xl">
        {children}
      </div>
    </div>
  );
}

function VcaFabPreviewFrame({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative h-56 w-full min-w-[20rem] overflow-hidden rounded-lg border border-border-faint bg-background-neutral-soft">
      <div className="absolute bottom-xl right-xl">
        {children}
      </div>
    </div>
  );
}

export function PremiumFabDemo() {
  const [shellState, setShellState] = useState<ShellDemoState>("closed");
  const [panelVariant, setPanelVariant] =
    useState<ChatPanelVariant>("collapsed");

  function openPanel() {
    setPanelVariant("collapsed");
    setShellState("panel");
  }

  function closeShell() {
    setPanelVariant("collapsed");
    setShellState("closed");
  }

  function togglePanelVariant() {
    setPanelVariant((currentVariant) =>
      currentVariant === "collapsed" ? "expanded" : "collapsed",
    );
  }

  return (
    <ContextualComponentDemoSection previewClassName="w-full">
      <ShellDemoFrame
        device="desktop"
        renderBackdrop={(handleOpen) => (
          <PremiumSurveyBackdrop
            onOpen={handleOpen}
            showFab={shellState === "closed"}
          />
        )}
        renderPanel={(panelProps) => (
          <PremiumConciergePanel
            className={panelProps.className}
            variant={panelProps.variant}
            context="use-case"
            onClose={panelProps.onClose}
            onVariantToggle={panelProps.onVariantToggle}
            showCloseAction={panelProps.showCloseAction}
          />
        )}
        version="dismissable"
        shellState={shellState}
        shellTitle={PREMIUM_CONCIERGE_TITLE}
        panelVariant={panelVariant}
        onClose={closeShell}
        onDock={closeShell}
        onOpen={openPanel}
        onOpenExpanded={openPanel}
        onVariantToggle={togglePanelVariant}
      />
    </ContextualComponentDemoSection>
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

export function SduiNavLinkItemHorizontalDemo() {
  const [state, setState] = useState<NavLinkItemDemoState>("default");
  const [indicator, setIndicator] =
    useState<NavLinkItemHorizontalIndicator>("bottom");
  const [current, setCurrent] = useState(false);
  const [badge, setBadge] = useState(true);
  const [hasDropdown, setHasDropdown] = useState(true);

  return (
    <ComponentDemoSection
      controls={
        <>
          <SelectControl
            label="State"
            value={state}
            options={navLinkItemStates}
            onChange={setState}
          />
          <SegmentedControl
            label="Indicator"
            value={indicator}
            options={navLinkItemIndicators}
            onChange={setIndicator}
          />
          <ToggleControl label="Current" checked={current} onChange={setCurrent} />
          <ToggleControl label="Badge" checked={badge} onChange={setBadge} />
          <ToggleControl
            label="Dropdown"
            checked={hasDropdown}
            onChange={setHasDropdown}
          />
        </>
      }
    >
      <NavLinkItemHorizontal
        badge={badge}
        current={current}
        hasDropdown={hasDropdown}
        icon="placeholder"
        indicator={indicator}
        label="Nav link"
        visualState={state}
      />
    </ComponentDemoSection>
  );
}

export function SduiTabItemHorizontalDemo() {
  const [state, setState] = useState<TabItemDemoState>("default");
  const [tone, setTone] = useState<TabItemHorizontalTone>("default");
  const [selected, setSelected] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [overflow, setOverflow] = useState(false);

  return (
    <ComponentDemoSection
      controls={
        <>
          <SelectControl
            label="State"
            value={state}
            options={tabItemStates}
            onChange={setState}
          />
          <SegmentedControl
            label="Tone"
            value={tone}
            options={tabItemTones}
            onChange={setTone}
          />
          <ToggleControl label="Selected" checked={selected} onChange={setSelected} />
          <ToggleControl label="Icon" checked={showIcon} onChange={setShowIcon} />
          <ToggleControl label="Overflow" checked={overflow} onChange={setOverflow} />
        </>
      }
    >
      <div
        className={cx(
          "inline-flex p-lg",
          tone === "overlay" ? "bg-[#041838]" : "bg-background",
        )}
      >
        <TabItemHorizontal
          icon={showIcon ? "placeholder" : undefined}
          label="Tab label"
          overflow={overflow}
          selected={selected}
          tone={tone}
          visualState={state}
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

export function SduiGhostButtonDemo() {
  const [state, setState] = useState<GhostButtonDemoState>("default");
  const [size, setSize] = useState<NonNullable<GhostButtonProps["size"]>>("small");
  const [emphasis, setEmphasis] = useState(false);
  const [padded, setPadded] = useState(true);
  const [iconPosition, setIconPosition] =
    useState<"none" | "start" | "end">("end");

  const icon = iconPosition === "none" ? undefined : "placeholder";
  const iconAtEnd = iconPosition === "end";

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
              { label: "Disabled", value: "disabled" },
              { label: "Loading", value: "loading" },
            ]}
            onChange={setState}
          />
          <SegmentedControl
            label="Icon"
            value={iconPosition}
            options={[
              { label: "None", value: "none" },
              { label: "Start", value: "start" },
              { label: "End", value: "end" },
            ]}
            onChange={setIconPosition}
          />
          <ToggleControl label="Emphasis" checked={emphasis} onChange={setEmphasis} />
          <ToggleControl label="Padded" checked={padded} onChange={setPadded} />
        </>
      }
    >
      {renderDemoGhostButton(
        state,
        size,
        emphasis,
        padded,
        icon,
        iconAtEnd,
      )}
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

export function SduiOverlayButtonIconDemo() {
  const [color, setColor] =
    useState<NonNullable<OverlayButtonIconProps["color"]>>("black");
  const [size, setSize] =
    useState<NonNullable<OverlayButtonIconProps["size"]>>("small");
  const [state, setState] =
    useState<OverlayButtonIconDemoState>("default");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Color"
            value={color}
            options={[
              { label: "Black", value: "black" },
              { label: "White", value: "white" },
            ]}
            onChange={setColor}
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
          <SelectControl
            label="State"
            value={state}
            options={overlayButtonIconStates}
            onChange={setState}
          />
        </>
      }
    >
      <div className="flex min-h-[12rem] min-w-[16rem] items-center justify-center rounded-sm bg-background-neutral-soft p-xxxl">
        {renderDemoOverlayButtonIcon(state, color, size)}
      </div>
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

export function SduiPresenceBadgeDemo() {
  const [presence, setPresence] =
    useState<NonNullable<PresenceBadgeProps["presence"]>>("active");
  const [size, setSize] =
    useState<NonNullable<PresenceBadgeProps["size"]>>("small");

  return (
    <ComponentDemoSection
      controls={
        <>
          <SegmentedControl
            label="Presence"
            value={presence}
            options={[
              { label: "Active", value: "active" },
              { label: "On mobile", value: "mobile" },
            ]}
            onChange={setPresence}
          />
          <SegmentedControl
            label="Size"
            value={size}
            options={[
              { label: "Small", value: "small" },
              { label: "Medium", value: "medium" },
              { label: "Large", value: "large" },
            ]}
            onChange={setSize}
          />
        </>
      }
    >
      <PresenceBadge
        label={presence === "active" ? "Active" : "On mobile"}
        presence={presence}
        size={size}
      />
    </ComponentDemoSection>
  );
}
