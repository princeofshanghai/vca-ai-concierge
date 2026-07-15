"use client";

import type { ReactNode } from "react";

import Image from "next/image";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatPanel,
  ChatResponseAttachment,
  ChatResponseBlock,
  ChatSidePanelLayout,
  ChatThread,
  Prompt,
} from "@/components/chat";
import {
  HighValueMatchCardPreview,
  HighValueSchedulePanelPreview,
  MediumAvailableHandoffPreview,
  type BookedMeeting,
  type HighValueRecommendationState,
  type MediumAvailableHandoffState,
} from "@/components/flow-review/flow-review-chat-panel";
import { HiringHeader } from "@/components/landing/hiring-header";
import {
  EntryLixChoiceScreen,
  EntryLixLeadFormScreen,
  EntryLixSuccessScreen,
} from "@/components/onboarding/entry-lix-test-screen";
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen";
import { Button } from "@/components/primitives/button";
import { HIRING_CONCIERGE_TITLE } from "@/lib/concierge-copy";
import { STARTER_PROMPTS, flowReviews } from "@/lib/conversation-flows";

export type HiringFlowCheckpoint =
  | "entry-choice"
  | "callback-form"
  | "callback-success"
  | "onboarding-signed-in"
  | "onboarding-signed-out"
  | "welcome"
  | "high-qualification"
  | "high-recommendation"
  | "high-schedule"
  | "high-booked"
  | "medium-qualification"
  | "medium-recommendation"
  | "medium-connected"
  | "medium-schedule"
  | "medium-booked"
  | "low-qualification"
  | "low-resources";

type StaticHiringScreenProps = Readonly<{
  children: ReactNode;
  compact?: boolean;
  headerIdentity?: Readonly<{
    name: string;
    role: string;
  }>;
  panelWidth?: "collapsed" | "schedule";
  surface?: "default" | "welcome";
  tall?: boolean;
  transparentHeader?: boolean;
}>;

const BOOKED_MEETING: BookedMeeting = {
  format: "Online meeting",
  date: "Tue, Apr 28",
  time: "9:00 AM",
  contact: "jamie.chen@northstarhealth.com",
};

const HIGH_STATES: ReadonlyArray<
  Readonly<{ label: string; state: HighValueRecommendationState }>
> = [
  { label: "Recommendation", state: "initial" },
  { label: "Finding consultant", state: "matching" },
  { label: "Consultant available", state: "matched" },
  { label: "Choosing a time", state: "scheduling" },
  { label: "Meeting booked", state: "booked" },
];

const MEDIUM_STATES: ReadonlyArray<
  Readonly<{ label: string; state: MediumAvailableHandoffState }>
> = [
  { label: "Available now", state: "initial" },
  { label: "Connecting", state: "connecting" },
  { label: "Connected", state: "connected" },
  { label: "Unavailable", state: "unavailable" },
  { label: "Connection failed", state: "failed" },
];

function HiringPageBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <HiringHeader onContactSales={() => {}} />
      <section className="mx-auto flex w-full max-w-[1009px] items-center gap-12 px-0 pb-24 pt-12">
        <div className="size-[447px] shrink-0 overflow-hidden rounded-[14px] bg-background-neutral-soft">
          <Image
            src="/assets/hiring-hero.png"
            alt=""
            width={1098}
            height={1140}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex w-full max-w-[514px] flex-col items-start gap-8">
          <div className="space-y-3">
            <p className="text-[16px] font-bold leading-[1.25] tracking-[0.32px] text-black uppercase">
              Hire with LinkedIn
            </p>
            <h1 className="max-w-[514px] text-[64px] leading-[1.16] font-bold tracking-[-1px] text-text">
              Hire the people you need
            </h1>
          </div>
          <Button>Contact sales</Button>
        </div>
      </section>
    </div>
  );
}

function StaticHiringScreen({
  children,
  compact = false,
  headerIdentity,
  panelWidth = "collapsed",
  surface = "default",
  tall = false,
  transparentHeader = false,
}: StaticHiringScreenProps) {
  const outerWidth = compact ? 450 : 720;
  const previewScale = outerWidth / 1280;
  const sourceHeight = tall ? 1280 : 800;
  const outerHeight = compact ? 281.25 : sourceHeight * previewScale;
  const panelClassName =
    panelWidth === "schedule"
      ? tall
        ? "!h-[1208px] !w-[896px] !rounded-t-md !rounded-b-none"
        : "!h-[728px] !w-[896px] !rounded-t-md !rounded-b-none"
      : "!h-[728px] !w-[400px] !rounded-t-md !rounded-b-none";

  return (
    <div
      className="relative overflow-hidden rounded-md border border-border-faint bg-background shadow-raised-faint"
      style={{ width: outerWidth, height: outerHeight }}
    >
      <div
        aria-hidden="true"
        inert
        className={[
          "pointer-events-none absolute left-0 top-0 w-[1280px] origin-top-left overflow-hidden",
          tall ? "h-[1280px]" : "h-[800px]",
        ].join(" ")}
        style={{ transform: `scale(${previewScale})` }}
      >
        <HiringPageBackdrop />
        <div className="absolute bottom-0 right-6 z-10">
          <ChatPanel className={panelClassName} surface={surface}>
            <ChatHeader
              transparent={transparentHeader}
              identity={
                headerIdentity
                  ? {
                      type: "representative",
                      name: headerIdentity.name,
                      role: headerIdentity.role,
                    }
                  : undefined
              }
              title={
                headerIdentity || transparentHeader
                  ? undefined
                  : HIRING_CONCIERGE_TITLE
              }
              onMinimizeToTray={() => {}}
              onVariantToggle={() => {}}
              onClose={() => {}}
              showCloseAction
              showAiMark={false}
            />
            {children}
          </ChatPanel>
        </div>
      </div>
    </div>
  );
}

function StaticComposer() {
  return (
    <ChatComposer
      showAttachAction={false}
      sendDisabled
      inputProps={{
        placeholder: "Send a message",
        readOnly: true,
        tabIndex: -1,
      }}
    />
  );
}

function ConversationSurface({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <ChatBody>
        <ChatThread>{children}</ChatThread>
      </ChatBody>
      <StaticComposer />
    </>
  );
}

function AssistantResponse({
  children,
  attachment,
}: Readonly<{ children: ReactNode; attachment?: ReactNode }>) {
  return (
    <ChatResponseBlock feedbackPolicy="rateable" timestamp="1:10 PM">
      <ChatMessage role="assistant">{children}</ChatMessage>
      {attachment ? (
        <ChatResponseAttachment>{attachment}</ChatResponseAttachment>
      ) : null}
    </ChatResponseBlock>
  );
}

function UserTurn({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ChatMessage role="user" timestamp="1:09 PM">
      {children}
    </ChatMessage>
  );
}

function WelcomeConversation() {
  return (
    <ConversationSurface>
      <ChatMessage role="assistant">
        Hi Jamie. I can help you understand which LinkedIn hiring solution fits
        Northstar Health and what the next step should be.
      </ChatMessage>
      <ChatResponseAttachment>
        <div className="flex flex-wrap gap-sm pr-sm">
          {STARTER_PROMPTS.map((prompt) => (
            <Prompt key={prompt} prompt={prompt} />
          ))}
        </div>
      </ChatResponseAttachment>
    </ConversationSurface>
  );
}

function HighQualificationConversation() {
  return (
    <ConversationSurface>
      <UserTurn>
        We just closed funding and need to hire around 40 roles over the next
        two quarters.
      </UserTurn>
      <AssistantResponse>
        That is a meaningful ramp. Which roles are most important to fill
        first?
      </AssistantResponse>
      <UserTurn>
        Clinical operations and senior engineering. We have recruiters, but
        sourcing is taking too long.
      </UserTurn>
    </ConversationSurface>
  );
}

function HighRecommendationConversation() {
  const recommendation = flowReviews.high.steps.find(
    (step) => step.id === "high-assistant-recommendation",
  );

  return (
    <ConversationSurface>
      <UserTurn>
        I lead talent acquisition, and I would bring in our VP of People.
      </UserTurn>
      <AssistantResponse
        attachment={<HighValueMatchCardPreview state="initial" />}
      >
        {recommendation?.kind === "message"
          ? recommendation.content
          : "I am going to match you with a sales consultant who can help shape your hiring plan."}
      </AssistantResponse>
    </ConversationSurface>
  );
}

function MediumQualificationConversation() {
  return (
    <ConversationSurface>
      <UserTurn>
        Maybe five roles this quarter. A few department leaders are hiring
        directly.
      </UserTurn>
      <AssistantResponse>
        That sounds more like a lighter hiring motion. Are you trying to move
        on those roles soon?
      </AssistantResponse>
      <UserTurn>
        Yes, ideally this month. We do not have a dedicated recruiter for
        these roles.
      </UserTurn>
    </ConversationSurface>
  );
}

function MediumRecommendationConversation() {
  return (
    <ConversationSurface>
      <UserTurn>
        That sounds right. I would still like to talk to someone before we pick
        a path.
      </UserTurn>
      <AssistantResponse
        attachment={<MediumAvailableHandoffPreview state="initial" />}
      >
        Since this is near-term hiring but lighter than an enterprise setup, a
        sales consultant can confirm whether Hiring Pro fits.
      </AssistantResponse>
    </ConversationSurface>
  );
}

function MediumConnectedConversation() {
  return (
    <ConversationSurface>
      <AssistantResponse>
        A sales consultant is available to continue with you now.
      </AssistantResponse>
      <MediumAvailableHandoffPreview state="connected" />
    </ConversationSurface>
  );
}

function LowQualificationConversation() {
  return (
    <ConversationSurface>
      <UserTurn>Mostly one customer support role right now.</UserTurn>
      <AssistantResponse>
        For one role, Recruiter may be more than you need. Is this a one-off
        need, or the start of a bigger hiring plan?
      </AssistantResponse>
      <UserTurn>Probably one-off for now, but we may grow later.</UserTurn>
    </ConversationSurface>
  );
}

function ResourceCards() {
  const resourcesStep = flowReviews.low.steps.find(
    (step) => step.kind === "resources",
  );

  if (!resourcesStep || resourcesStep.kind !== "resources") {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-md pr-sm">
      {resourcesStep.resources.map((resource) => (
        <article
          key={resource.title}
          className="flex flex-col gap-md rounded-md border border-border-faint bg-background p-lg"
        >
          <div className="space-y-xs">
            <h2 className="text-heading-md text-text">{resource.title}</h2>
            <p className="text-body-xs text-text-meta">
              {resource.description}
            </p>
          </div>
          <Button size="small" variant="secondary" className="w-fit">
            {resource.actionLabel}
          </Button>
        </article>
      ))}
    </div>
  );
}

function LowResourcesConversation() {
  return (
    <ConversationSurface>
      <UserTurn>Can I just review options and move at my own pace?</UserTurn>
      <AssistantResponse attachment={<ResourceCards />}>
        Yes. For where you are now, self-serve resources are the better fit.
      </AssistantResponse>
    </ConversationSurface>
  );
}

function ScheduleConversation({ tier }: Readonly<{ tier: "high" | "medium" }>) {
  return (
    <ChatSidePanelLayout
      history={
        <ChatThread>
          <UserTurn>
            {tier === "high"
              ? "I would like to find a time with the consultant."
              : "Scheduling a call works for me."}
          </UserTurn>
          <AssistantResponse>
            Choose a meeting format and a time that works for you.
          </AssistantResponse>
        </ChatThread>
      }
      sidePanel={<HighValueSchedulePanelPreview showAvailableTimes />}
    />
  );
}

function BookedConversation({ tier }: Readonly<{ tier: "high" | "medium" }>) {
  return (
    <ConversationSurface>
      <AssistantResponse
        attachment={
          <HighValueMatchCardPreview
            state="booked"
            bookedMeeting={BOOKED_MEETING}
          />
        }
      >
        {tier === "high"
          ? "Your meeting with a sales consultant is confirmed."
          : "Your scheduled conversation with a sales consultant is confirmed."}
      </AssistantResponse>
    </ConversationSurface>
  );
}

function renderCheckpoint(checkpoint: HiringFlowCheckpoint) {
  switch (checkpoint) {
    case "entry-choice":
      return <EntryLixChoiceScreen onChatWithAi={() => {}} onFillOutForm={() => {}} />;
    case "callback-form":
      return <EntryLixLeadFormScreen onSubmit={() => {}} />;
    case "callback-success":
      return (
        <EntryLixSuccessScreen
          onDone={() => {}}
          onChatWithAi={() => {}}
        />
      );
    case "onboarding-signed-in":
      return (
        <OnboardingScreen
          headline="Before we begin"
          isSignedIn
          onSubmit={() => {}}
          showAiMark={false}
          subcopy={null}
        />
      );
    case "onboarding-signed-out":
      return (
        <OnboardingScreen
          headline="Before we begin"
          isSignedIn={false}
          onSubmit={() => {}}
          showAiMark={false}
          subcopy={null}
        />
      );
    case "welcome":
      return <WelcomeConversation />;
    case "high-qualification":
      return <HighQualificationConversation />;
    case "high-recommendation":
      return <HighRecommendationConversation />;
    case "high-schedule":
      return <ScheduleConversation tier="high" />;
    case "high-booked":
      return <BookedConversation tier="high" />;
    case "medium-qualification":
      return <MediumQualificationConversation />;
    case "medium-recommendation":
      return <MediumRecommendationConversation />;
    case "medium-connected":
      return <MediumConnectedConversation />;
    case "medium-schedule":
      return <ScheduleConversation tier="medium" />;
    case "medium-booked":
      return <BookedConversation tier="medium" />;
    case "low-qualification":
      return <LowQualificationConversation />;
    case "low-resources":
      return <LowResourcesConversation />;
  }
}

export function HiringFlowCheckpointScreen({
  checkpoint,
  compact = false,
}: Readonly<{ checkpoint: HiringFlowCheckpoint; compact?: boolean }>) {
  const isEntrySurface =
    checkpoint === "entry-choice" ||
    checkpoint === "callback-form" ||
    checkpoint === "callback-success" ||
    checkpoint === "onboarding-signed-in" ||
    checkpoint === "onboarding-signed-out";
  const isSchedule =
    checkpoint === "high-schedule" || checkpoint === "medium-schedule";
  const isRepresentative = checkpoint === "medium-connected";

  return (
    <StaticHiringScreen
      compact={compact}
      panelWidth={isSchedule ? "schedule" : "collapsed"}
      surface={isEntrySurface ? "welcome" : "default"}
      tall={isSchedule}
      transparentHeader={isEntrySurface}
      headerIdentity={
        isRepresentative
          ? { name: "David S.", role: "Sales consultant" }
          : undefined
      }
    >
      {renderCheckpoint(checkpoint)}
    </StaticHiringScreen>
  );
}

function StatePreview({
  children,
  label,
}: Readonly<{ children: ReactNode; label: string }>) {
  return (
    <article className="flex min-w-[400px] flex-col gap-lg rounded-lg border border-border-faint bg-background p-xl shadow-raised-faint">
      <p className="text-[20px] font-medium leading-tight text-text-meta">
        {label}
      </p>
      <div className="pointer-events-none flex min-h-[180px] items-start">
        {children}
      </div>
    </article>
  );
}

export function HighValueStateGallery() {
  return (
    <div className="flex gap-xl">
      {HIGH_STATES.map(({ label, state }) => (
        <StatePreview key={state} label={label}>
          <HighValueMatchCardPreview
            state={state}
            bookedMeeting={state === "booked" ? BOOKED_MEETING : undefined}
          />
        </StatePreview>
      ))}
    </div>
  );
}

export function MediumValueStateGallery() {
  return (
    <div className="flex gap-xl">
      {MEDIUM_STATES.map(({ label, state }) => (
        <StatePreview key={state} label={label}>
          <MediumAvailableHandoffPreview state={state} />
        </StatePreview>
      ))}
      <StatePreview label="Fallback meeting booked">
        <MediumAvailableHandoffPreview
          state="unavailable"
          bookedMeeting={BOOKED_MEETING}
        />
      </StatePreview>
    </div>
  );
}
