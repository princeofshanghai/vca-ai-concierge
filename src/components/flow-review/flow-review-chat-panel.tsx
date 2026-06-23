"use client";

import {
  Fragment,
  type UIEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatMessageFeedbackFlow,
  ChatPanel,
  ChatThread,
  Prompt,
  RecommendationCard,
  type ChatHeaderIdentity,
  type ChatPanelVariant,
} from "@/components/chat/chat-ui";
import { useChatLatestMessageAnchor } from "@/components/chat/chat-motion";
import {
  ChatSidePanel,
  ChatSidePanelLayout,
} from "@/components/chat/chat-side-panel";
import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";
import { Pill } from "@/components/primitives/pill";
import { Tag } from "@/components/primitives/tag";
import { TextArea } from "@/components/primitives/text-area";
import { TextInput } from "@/components/primitives/text-input";
import { HIRING_CONCIERGE_TITLE } from "@/lib/concierge-copy";
import {
  STARTER_PROMPTS,
  type FlowReview,
  type FlowReviewAvailabilityStep,
  type FlowReviewResourcesStep,
  type FlowReviewStep,
  getMediumFlowReview,
  shouldShowFlowReviewMessageFeedback,
} from "@/lib/conversation-flows";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

type FlowReviewChatPanelProps = Readonly<{
  flow: FlowReview;
  variant?: ChatPanelVariant;
  className?: string;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
  dockActionPosition?: "before-variant" | "after-variant";
  showCloseAction?: boolean;
  onHeaderIdentityChange?: (identity: ChatHeaderIdentity | null) => void;
  onUnreadActivity?: () => void;
  onSidePanelOpenChange?: (open: boolean) => void;
}>;

export type HighValueRecommendationState =
  | "initial"
  | "matching"
  | "matched"
  | "scheduling"
  | "booked";

export type MediumAvailableHandoffState =
  | "initial"
  | "connecting"
  | "connected"
  | "unavailable"
  | "failed";

const MATCHING_DELAY_MS = 900;
const BOOKING_DELAY_MS = 550;

const HIRING_SPECIALIST = {
  name: "David S.",
  role: "Sales consultant",
} as const;

const LIVE_HIRING_SPECIALIST = {
  ...HIRING_SPECIALIST,
  timestamp: "9:37 PM",
} as const;

const LEAD_WORK_EMAIL = "jamie.chen@northstarhealth.com";
const MEETING_FORMATS = [
  "Online meeting",
  "Phone call",
  "WhatsApp call",
] as const;
const MEETING_DATES = [
  "Tue, Apr 28",
  "Wed, Apr 29",
  "Thu, Apr 30",
  "Fri, May 1",
  "Mon, May 4",
] as const;
const MEETING_TIMES = ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"] as const;

export type MeetingFormat = (typeof MEETING_FORMATS)[number];
export type MeetingDate = (typeof MEETING_DATES)[number];
export type MeetingTime = (typeof MEETING_TIMES)[number];

export type BookedMeeting = Readonly<{
  format: MeetingFormat;
  date: MeetingDate;
  time: MeetingTime;
  contact: string;
}>;

type ScheduledSpecialistCardProps = Readonly<{
  state: HighValueRecommendationState;
  bookedMeeting?: BookedMeeting | null;
  onBookTime: () => void;
  onCancelMatching: () => void;
  onScheduleCall: () => void;
}>;

export type HighValueMatchCardPreviewProps = Readonly<{
  state: HighValueRecommendationState;
  bookedMeeting?: BookedMeeting | null;
}>;

export type MediumAvailableHandoffPreviewProps = Readonly<{
  state?: MediumAvailableHandoffState;
  bookedMeeting?: BookedMeeting | null;
  onBookTime?: () => void;
}>;

type SchedulePanelVisualState = "default" | "confirming";
type SchedulePanelInitialScrollPosition = "top" | "footer";
type FlowReviewSidePanel = "schedule" | null;

type SchedulePanelProps = Readonly<{
  visualState?: SchedulePanelVisualState;
  initialScrollPosition?: SchedulePanelInitialScrollPosition;
  onBack: () => void;
  onBook: (meeting: BookedMeeting) => void;
}>;

export type HighValueSchedulePanelPreviewProps = Readonly<{
  state?: SchedulePanelVisualState;
}>;

const MEETING_DATE_DETAILS: Record<MeetingDate, string> = {
  "Tue, Apr 28": "Tuesday, April 28",
  "Wed, Apr 29": "Wednesday, April 29",
  "Thu, Apr 30": "Thursday, April 30",
  "Fri, May 1": "Friday, May 1",
  "Mon, May 4": "Monday, May 4",
};

const MEETING_CONFIRM_LABELS: Record<MeetingFormat, string> = {
  "Online meeting": "Confirm online meeting",
  "Phone call": "Confirm phone call",
  "WhatsApp call": "Confirm WhatsApp call",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getBookedMeetingContactCopy(meeting: BookedMeeting) {
  if (meeting.format === "Online meeting") {
    return `Meeting link sent to ${meeting.contact}`;
  }

  if (meeting.format === "Phone call") {
    return `${HIRING_SPECIALIST.name.split(" ")[0]} will call ${meeting.contact}`;
  }

  return `${HIRING_SPECIALIST.name.split(" ")[0]} will call ${meeting.contact} on WhatsApp`;
}

function getBookedMeetingTitle(meeting: BookedMeeting) {
  return meeting.format === "Online meeting"
    ? `Meeting with ${HIRING_SPECIALIST.name}`
    : `Call with ${HIRING_SPECIALIST.name}`;
}

function getBookedMeetingContactIcon(meeting: BookedMeeting) {
  if (meeting.format === "Online meeting") {
    return "envelope" as const;
  }

  if (meeting.format === "WhatsApp call") {
    return "whats-app" as const;
  }

  return "phone-handset" as const;
}

function SpecialistAvatar({ muted = false }: { muted?: boolean }) {
  return (
    <div className={cx("relative shrink-0", muted && "opacity-50")}>
      <Entity
        size={48}
        label={`${HIRING_SPECIALIST.name}, ${HIRING_SPECIALIST.role}`}
      />
    </div>
  );
}

function MatchedSpecialistAvatar({ muted = false }: { muted?: boolean }) {
  return (
    <div className={cx("relative shrink-0", muted && "opacity-50")}>
      <Entity
        size={48}
        label={`${HIRING_SPECIALIST.name}, ${HIRING_SPECIALIST.role}`}
      />
      <span
        aria-hidden="true"
        className="absolute -right-xxs -bottom-xxs inline-flex size-5 items-center justify-center rounded-round bg-background text-checked [&_svg]:size-5"
      >
        <Icon name="signal-success" size="small" />
      </span>
    </div>
  );
}

function SpecialistHeader({
  title,
  muted = false,
  booked = false,
}: {
  title: string;
  muted?: boolean;
  booked?: boolean;
}) {
  return (
    <div className="flex w-full items-center gap-sm">
      {booked ? (
        <MatchedSpecialistAvatar muted={muted} />
      ) : (
        <SpecialistAvatar muted={muted} />
      )}
      <div className="min-w-0 flex-1 space-y-xs">
        <h2 className="text-heading-md text-text">{title}</h2>
        <p className="text-body-xs text-text-meta">{HIRING_SPECIALIST.role}</p>
      </div>
    </div>
  );
}

function MatchingEntityStack() {
  return (
    <span
      aria-hidden="true"
      className="matching-entity-stack flex shrink-0 items-center pl-xxs"
    >
      {[0, 1, 2].map((index) => (
        <Entity
          key={index}
          size={24}
          className={cx(
            "matching-entity",
            `matching-entity-${index}`,
            index > 0 && "-ml-sm",
            "relative ring-2 ring-background",
          )}
        />
      ))}
    </span>
  );
}

function BookedMeetingDetails({ meeting }: { meeting: BookedMeeting }) {
  const contactIcon = getBookedMeetingContactIcon(meeting);

  return (
    <div className="flex w-full flex-col gap-xs border-t border-border-faint pt-md">
      <div className="flex items-center gap-sm text-body-sm-open text-text">
        <Icon name="calendar" size="small" className="shrink-0 text-icon" />
        <p className="min-w-0 flex-1">
          {MEETING_DATE_DETAILS[meeting.date]} at {meeting.time} PT
        </p>
      </div>
      <div className="flex items-start gap-sm text-body-sm-open text-text">
        <Icon
          name={contactIcon}
          size="small"
          className="mt-xxs shrink-0 text-icon"
        />
        <p className="min-w-0 flex-1">{getBookedMeetingContactCopy(meeting)}</p>
      </div>
    </div>
  );
}

function getSchedulePanelFooterHelp({
  selectedFormat,
  contactValue,
  selectedDate,
  selectedTime,
}: {
  selectedFormat: MeetingFormat;
  contactValue: string;
  selectedDate: MeetingDate | null;
  selectedTime: MeetingTime | null;
}) {
  if (contactValue.trim().length === 0) {
    if (selectedFormat === "Online meeting") {
      return "Enter your work email to continue.";
    }

    if (selectedFormat === "Phone call") {
      return "Enter your phone number to continue.";
    }

    return "Enter your WhatsApp number to continue.";
  }

  if (!selectedDate) {
    return "Choose a date to continue.";
  }

  if (!selectedTime) {
    return "Choose a time to continue.";
  }

  return null;
}

function StarterPromptRow() {
  return (
    <div className="chat-message-enter flex w-full">
      <div className="flex max-w-[33rem] flex-wrap gap-sm pr-sm">
        {STARTER_PROMPTS.map((prompt) => (
          <Prompt key={prompt} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}

function ResourceCards({ step }: { step: FlowReviewResourcesStep }) {
  return (
    <div className="chat-message-enter flex w-full">
      <div className="flex w-full max-w-[33rem] flex-col gap-md pr-sm">
        {step.resources.map((resource) => (
          <article
            key={resource.title}
            className="flex min-w-0 flex-col gap-md rounded-md border border-border-faint bg-background p-lg"
          >
            <div className="space-y-xs">
              <h2 className="text-heading-md text-text">{resource.title}</h2>
              <p className="text-body-xs text-text-meta">
                {resource.description}
              </p>
            </div>
            <Button
              size="small"
              variant="secondary"
              className="mt-auto w-fit px-pill-padding-inline"
            >
              {resource.actionLabel}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function AvailabilityVariant({
  step,
  timestamp,
}: {
  step: FlowReviewAvailabilityStep;
  timestamp: string;
}) {
  const variant = step.variants[0];

  if (!variant) {
    return null;
  }

  const role = variant.role ?? "assistant";
  const showFeedback = role === "assistant" && variant.feedbackEligible === true;

  return (
    <>
      {showFeedback ? (
        <div className="flex flex-col items-start gap-sm">
          <ChatMessage role={role}>{variant.message}</ChatMessage>
          <ChatMessageFeedbackFlow timestamp={timestamp} />
        </div>
      ) : (
        <ChatMessage role={role} timestamp={timestamp}>
          {variant.message}
        </ChatMessage>
      )}
      <RecommendationCard
        title={variant.title}
        primaryAction={variant.primaryAction}
        secondaryAction={variant.secondaryAction}
      />
    </>
  );
}

function MediumAvailableHandoff({
  bookedMeeting,
  step,
  state,
  onBookTime,
  onStartChat,
}: {
  bookedMeeting?: BookedMeeting | null;
  step: FlowReviewAvailabilityStep;
  state: MediumAvailableHandoffState;
  onBookTime: () => void;
  onStartChat: () => void;
}) {
  const variant = step.variants[0];
  const isFallbackSchedulingState =
    state === "unavailable" || state === "failed";

  if (!variant) {
    return null;
  }

  return (
    <>
      <article
        role={state === "initial" ? undefined : "status"}
        aria-live={state === "initial" ? undefined : "polite"}
        className="chat-message-enter flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background p-xl pr-md text-text"
      >
        {state === "connecting" ? (
          <div className="space-y-sm">
            <div className="flex items-center gap-md">
              <MatchingEntityStack />
              <h2 className="text-heading-md">Connecting you now...</h2>
            </div>
            <p className="text-body-sm-open text-text-meta">
              This can take up to 3 minutes.
            </p>
          </div>
        ) : null}
        {isFallbackSchedulingState && bookedMeeting ? (
          <>
            <SpecialistHeader
              title={getBookedMeetingTitle(bookedMeeting)}
              booked
            />
            <BookedMeetingDetails meeting={bookedMeeting} />
          </>
        ) : null}
        {isFallbackSchedulingState ? (
          bookedMeeting ? null : (
            <>
              <div className="space-y-xs">
                <h2 className="text-heading-md">
                  {state === "failed"
                    ? "We couldn't connect you to live chat"
                    : "Live chat is unavailable right now"}
                </h2>
                <p className="text-body-sm-open text-text-meta">
                  {state === "failed"
                    ? "Schedule a call with a sales specialist instead."
                    : "Choose a time to talk with a sales specialist instead."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-sm">
                <Button
                  size="small"
                  className="px-pill-padding-inline"
                  onClick={onBookTime}
                >
                  Schedule a call
                </Button>
              </div>
            </>
          )
        ) : null}
        {state === "connected" ? (
          <div className="flex items-center gap-sm">
            <span
              aria-hidden="true"
              className="inline-flex size-6 shrink-0 items-center justify-center text-checked [&_svg]:size-6"
            >
              <Icon name="signal-success" size="medium" />
            </span>
            <h2 className="text-heading-md">
              Connected to {LIVE_HIRING_SPECIALIST.name}
            </h2>
          </div>
        ) : null}
        {state === "initial" ? (
          <>
            <Entity
              size={40}
              label={`${LIVE_HIRING_SPECIALIST.name}, ${LIVE_HIRING_SPECIALIST.role}`}
            />
            <div className="space-y-xs">
              <h2 className="text-heading-md">{variant.title}</h2>
            </div>
          </>
        ) : null}
        {state === "initial" ? (
          <Button
            size="small"
            className="w-fit px-pill-padding-inline"
            onClick={onStartChat}
          >
            {variant.primaryAction}
          </Button>
        ) : null}
      </article>
      {state === "connected" ? (
        <div className="flex flex-col gap-lg">
          <p className="chat-message-enter text-center text-body-xs text-text-meta">
            {LIVE_HIRING_SPECIALIST.name} joined the chat -{" "}
            {LIVE_HIRING_SPECIALIST.timestamp}
          </p>
          <ChatMessage
            role="representative"
            authorName={LIVE_HIRING_SPECIALIST.name}
            avatarLabel={`${LIVE_HIRING_SPECIALIST.name}, ${LIVE_HIRING_SPECIALIST.role}`}
            timestamp={LIVE_HIRING_SPECIALIST.timestamp}
          >
            {variant.message}
          </ChatMessage>
        </div>
      ) : null}
    </>
  );
}

export function MediumAvailableHandoffPreview({
  bookedMeeting,
  onBookTime = () => {},
  state = "initial",
}: MediumAvailableHandoffPreviewProps) {
  const availabilityStep = getMediumFlowReview("available").steps.find(
    (step): step is FlowReviewAvailabilityStep => step.kind === "availability",
  );

  if (!availabilityStep) {
    return null;
  }

  return (
    <MediumAvailableHandoff
      bookedMeeting={bookedMeeting}
      step={availabilityStep}
      state={state}
      onBookTime={onBookTime}
      onStartChat={() => {}}
    />
  );
}

function renderStep(step: FlowReviewStep, index = 0) {
  if (step.kind === "message") {
    const showFeedback = shouldShowFlowReviewMessageFeedback(step);
    const showStarterPrompts = step.showStarterPromptsAfter === true;
    const timestamp = getPrototypeMessageTimestamp(index);
    const messageNode = (
      <ChatMessage role={step.role} timestamp={showFeedback ? undefined : timestamp}>
        {step.content}
      </ChatMessage>
    );

    if (showStarterPrompts || showFeedback) {
      return (
        <div key={step.id} className="flex flex-col items-start">
          {messageNode}
          {showStarterPrompts ? (
            <div className="mt-md w-full">
              <StarterPromptRow />
            </div>
          ) : null}
          {showFeedback ? (
            <ChatMessageFeedbackFlow className="mt-sm" timestamp={timestamp} />
          ) : null}
        </div>
      );
    }

    return <Fragment key={step.id}>{messageNode}</Fragment>;
  }

  if (step.kind === "recommendation") {
    return (
      <RecommendationCard
        key={step.id}
        title={step.title}
        description={step.description}
        primaryAction={step.primaryAction}
        secondaryAction={step.secondaryAction}
      />
    );
  }

  if (step.kind === "resources") {
    return <ResourceCards key={step.id} step={step} />;
  }

  return (
    <AvailabilityVariant
      key={step.id}
      step={step}
      timestamp={getPrototypeMessageTimestamp(index)}
    />
  );
}

function isMediumScheduledStep(step: FlowReviewStep) {
  return (
    step.kind === "availability" &&
    step.variants.length === 1 &&
    step.variants[0]?.id === "medium-scheduled"
  );
}

export function ScheduledSpecialistCard({
  state,
  bookedMeeting,
  onBookTime,
  onCancelMatching,
  onScheduleCall,
}: ScheduledSpecialistCardProps) {
  if (state === "matching") {
    return (
      <article
        role="status"
        aria-live="polite"
        className="chat-message-enter flex w-full max-w-[24rem] min-w-[15rem] flex-col gap-sm rounded-md border border-ai-border bg-background pb-xl pl-xl pr-lg pt-xl text-text"
      >
        <div className="flex w-full items-center gap-sm">
          <MatchingEntityStack />
          <h2 className="min-w-0 flex-1 text-heading-md text-text">
            Finding your consultant...
          </h2>
        </div>
        <p className="text-body-sm-open text-text">
          This usually takes under a minute.
        </p>
        <Button
          size="small"
          variant="secondary"
          className="mt-sm w-fit px-pill-padding-inline"
          onClick={onCancelMatching}
        >
          Cancel
        </Button>
      </article>
    );
  }

  if (state === "booked" && bookedMeeting) {
    return (
      <article
        role="status"
        aria-live="polite"
        className="chat-message-enter flex w-full max-w-[24rem] min-w-[15rem] flex-col gap-lg rounded-md border border-ai-border bg-background py-xl pl-xl pr-lg text-text"
      >
        <SpecialistHeader title={getBookedMeetingTitle(bookedMeeting)} booked />
        <BookedMeetingDetails meeting={bookedMeeting} />
      </article>
    );
  }

  if (state === "scheduling") {
    return (
      <article className="chat-message-enter flex w-full max-w-[24rem] min-w-[15rem] flex-col gap-sm rounded-md border border-ai-border bg-background py-xl pl-xl pr-lg text-text">
        <SpecialistHeader title={HIRING_SPECIALIST.name} muted />
        <Button
          size="small"
          disabled
          className="mt-sm w-fit px-pill-padding-inline"
        >
          Choose a time
        </Button>
      </article>
    );
  }

  if (state === "matched") {
    return (
      <article className="chat-message-enter flex w-full max-w-[24rem] min-w-[15rem] flex-col gap-sm rounded-md border border-ai-border bg-background py-xl pl-xl pr-lg text-text">
        <SpecialistHeader title={`${HIRING_SPECIALIST.name} is available`} />
        <Button
          size="small"
          className="mt-sm w-fit px-pill-padding-inline"
          onClick={onScheduleCall}
        >
          Choose a time
        </Button>
      </article>
    );
  }

  return (
    <article className="chat-message-enter flex w-full max-w-[24rem] min-w-[15rem] flex-col gap-sm rounded-md border border-ai-border bg-background py-xl pl-xl pr-lg text-text">
      <div className="space-y-xs">
        <h2 className="text-heading-md">Speak with a sales consultant</h2>
        <p className="text-body-sm-open text-text">
          Get a 15 min call with someone who can help.
        </p>
      </div>
      <Button
        size="small"
        className="mt-sm w-fit px-pill-padding-inline"
        onClick={onBookTime}
      >
        Find a consultant
      </Button>
    </article>
  );
}

export function HighValueMatchCardPreview({
  state,
  bookedMeeting,
}: HighValueMatchCardPreviewProps) {
  return (
    <ScheduledSpecialistCard
      state={state}
      bookedMeeting={bookedMeeting}
      onBookTime={() => {}}
      onCancelMatching={() => {}}
      onScheduleCall={() => {}}
    />
  );
}

export function SchedulePanel({
  visualState = "default",
  initialScrollPosition = "top",
  onBack,
  onBook,
}: SchedulePanelProps) {
  const noteId = useId();
  const noteLabelId = `${noteId}-label`;
  const bookingTimerRef = useRef<number | null>(null);
  const isConfirmingPreview = visualState === "confirming";
  const [selectedFormat, setSelectedFormat] =
    useState<MeetingFormat>("Online meeting");
  const [selectedDate, setSelectedDate] = useState<MeetingDate | null>(
    isConfirmingPreview ? MEETING_DATES[0] : null,
  );
  const [selectedTime, setSelectedTime] = useState<MeetingTime | null>(
    isConfirmingPreview ? MEETING_TIMES[0] : null,
  );
  const [onlineMeetingEmail, setOnlineMeetingEmail] = useState(
    LEAD_WORK_EMAIL,
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [note, setNote] = useState("");
  const [isBooking, setIsBooking] = useState(isConfirmingPreview);
  const contactField =
    selectedFormat === "Online meeting"
      ? {
          label: "Work email",
          value: onlineMeetingEmail,
          helperText: undefined,
          type: "email",
          inputMode: "email" as const,
          autoComplete: "email",
          onChange: setOnlineMeetingEmail,
        }
      : selectedFormat === "Phone call"
        ? {
            label: "Phone number",
            value: phoneNumber,
            helperText: "We'll call you at this number.",
            type: "tel",
            inputMode: "tel" as const,
            autoComplete: "tel",
            onChange: setPhoneNumber,
          }
        : {
            label: "WhatsApp number",
            value: whatsAppNumber,
            helperText: "We'll call you on WhatsApp at this number.",
            type: "tel",
            inputMode: "tel" as const,
            autoComplete: "tel",
            onChange: setWhatsAppNumber,
          };
  const canBookCall =
    Boolean(selectedDate) &&
    Boolean(selectedTime) &&
    contactField.value.trim().length > 0;
  const footerHelp = getSchedulePanelFooterHelp({
    selectedFormat,
    contactValue: contactField.value,
    selectedDate,
    selectedTime,
  });

  useEffect(() => {
    return () => {
      if (bookingTimerRef.current !== null) {
        window.clearTimeout(bookingTimerRef.current);
      }
    };
  }, []);

  function handleBookCall() {
    if (!selectedDate || !selectedTime || !canBookCall || isBooking) {
      return;
    }

    setIsBooking(true);
    bookingTimerRef.current = window.setTimeout(() => {
      bookingTimerRef.current = null;
      onBook({
        format: selectedFormat,
        date: selectedDate,
        time: selectedTime,
        contact: contactField.value.trim(),
      });
    }, BOOKING_DELAY_MS);
  }

  return (
    <ChatSidePanel
      onBack={onBack}
      initialScrollPosition={initialScrollPosition}
      footerClassName="mt-stack-lg flex flex-col gap-md border-t border-border-faint pt-xl sm:flex-row sm:items-center sm:justify-between"
      footer={
        <>
          <p
            aria-live="polite"
            className="min-h-[1.25rem] text-body-sm-open text-text-meta"
          >
            {footerHelp}
          </p>
          <Button
            disabled={!canBookCall}
            loading={isBooking}
            loadingLabel="Confirming"
            className="w-full sm:w-fit"
            onClick={handleBookCall}
          >
            {MEETING_CONFIRM_LABELS[selectedFormat]}
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-md">
        <h2 className="text-heading-xl text-text">Schedule a call</h2>
        <Tag size="medium" className="gap-xs">
          <Icon name="clock" size="small" />
          <span>15 min</span>
        </Tag>
      </div>

      <article className="mt-xxl flex w-full max-w-[21.5rem] items-center gap-sm rounded-md border border-border-faint bg-background pb-xl pl-xl pr-lg pt-xl">
        <Entity
          size={48}
          label={`${HIRING_SPECIALIST.name}, ${HIRING_SPECIALIST.role}`}
        />
        <div className="min-w-0">
          <p className="text-heading-md text-text">
            {HIRING_SPECIALIST.name}
          </p>
          <p className="text-body-xs text-text-meta">
            {HIRING_SPECIALIST.role}
          </p>
        </div>
      </article>

      <section className="mt-stack-lg space-y-lg">
        <h3 className="text-heading-lg text-text">Meeting format</h3>
        <div className="flex flex-wrap gap-x-sm gap-y-xs">
          {MEETING_FORMATS.map((format) => (
            <Pill
              key={format}
              checked={selectedFormat === format}
              disabled={isBooking}
              onClick={() => setSelectedFormat(format)}
            >
              {format}
            </Pill>
          ))}
        </div>
        <TextInput
          label={contactField.label}
          value={contactField.value}
          helperText={contactField.helperText}
          type={contactField.type}
          inputMode={contactField.inputMode}
          autoComplete={contactField.autoComplete}
          trailingIcon={null}
          size="large"
          disabled={isBooking}
          className="max-w-[21.5rem]"
          onChange={(event) => contactField.onChange(event.currentTarget.value)}
        />
      </section>

      <section className="mt-stack-lg space-y-lg">
        <h3 className="text-heading-lg text-text">Date</h3>
        <div className="flex flex-wrap gap-x-sm gap-y-xs">
          {MEETING_DATES.map((date) => (
            <Pill
              key={date}
              checked={selectedDate === date}
              disabled={isBooking}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
            >
              {date}
            </Pill>
          ))}
        </div>
      </section>

      <section className="mt-stack-lg space-y-lg">
        <h3 className="text-heading-lg text-text">Time</h3>
        {selectedDate ? (
          <div className="flex flex-wrap gap-x-sm gap-y-xs">
            {MEETING_TIMES.map((time) => (
              <Pill
                key={time}
                checked={selectedTime === time}
                disabled={isBooking}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Pill>
            ))}
          </div>
        ) : (
          <p className="text-body-sm-open text-text-meta">
            Choose a date to see available times.
          </p>
        )}
      </section>

      <section className="mt-stack-lg space-y-lg">
        <label
          id={noteLabelId}
          htmlFor={noteId}
          className="block text-heading-lg text-text"
        >
          Anything you would like {HIRING_SPECIALIST.name} to know?
        </label>
        <TextArea
          id={noteId}
          aria-labelledby={noteLabelId}
          value={note}
          onChange={(event) => setNote(event.currentTarget.value)}
          disabled={isBooking}
          size="large"
        />
      </section>
    </ChatSidePanel>
  );
}

export function HighValueSchedulePanelPreview({
  state = "default",
}: HighValueSchedulePanelPreviewProps) {
  const [previewKey, setPreviewKey] = useState(0);

  return (
    <SchedulePanel
      key={`${state}-${previewKey}`}
      visualState={state}
      initialScrollPosition={state === "confirming" ? "footer" : "top"}
      onBack={() => {}}
      onBook={() => setPreviewKey((key) => key + 1)}
    />
  );
}

export function FlowReviewChatPanel({
  flow,
  variant = "collapsed",
  className,
  onClose,
  onMinimizeToTray,
  onVariantToggle,
  dockActionPosition,
  showCloseAction = true,
  onHeaderIdentityChange,
  onUnreadActivity,
  onSidePanelOpenChange,
}: FlowReviewChatPanelProps) {
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const [scheduledSpecialistState, setScheduledSpecialistState] =
    useState<HighValueRecommendationState>("initial");
  const [mediumAvailableHandoffState, setMediumAvailableHandoffState] =
    useState<MediumAvailableHandoffState>("initial");
  const [bookedMeeting, setBookedMeeting] = useState<BookedMeeting | null>(
    null,
  );
  const [activeSidePanel, setActiveSidePanel] =
    useState<FlowReviewSidePanel>(null);
  const [hasChatBodyScrolled, setHasChatBodyScrolled] = useState(false);
  const isHighValueFlow = flow.id === "high";
  const isSidePanelOpen = activeSidePanel !== null;
  const shellVariant = variant;
  const {
    hasLatestBelow,
    handleScroll: handleLatestScroll,
    scrollToLatest,
  } = useChatLatestMessageAnchor({
    scrollRef: chatBodyRef,
    contentKey: `${flow.id}:${activeSidePanel}:${scheduledSpecialistState}:${mediumAvailableHandoffState}`,
  });
  const chatHeaderIdentity = useMemo<ChatHeaderIdentity | null>(
    () =>
      mediumAvailableHandoffState === "connected"
        ? {
            type: "representative",
            name: LIVE_HIRING_SPECIALIST.name,
            role: LIVE_HIRING_SPECIALIST.role,
          }
        : null,
    [mediumAvailableHandoffState],
  );

  useEffect(() => {
    onHeaderIdentityChange?.(chatHeaderIdentity);
  }, [chatHeaderIdentity, onHeaderIdentityChange]);

  useEffect(() => {
    return () => {
      onHeaderIdentityChange?.(null);
    };
  }, [onHeaderIdentityChange]);

  useEffect(() => {
    if (scheduledSpecialistState !== "matching") {
      return;
    }

    const matchingTimer = window.setTimeout(() => {
      setScheduledSpecialistState("matched");
    }, MATCHING_DELAY_MS);

    return () => {
      window.clearTimeout(matchingTimer);
    };
  }, [scheduledSpecialistState]);

  useEffect(() => {
    if (mediumAvailableHandoffState !== "connecting") {
      return;
    }

    const connectingTimer = window.setTimeout(() => {
      setMediumAvailableHandoffState("connected");
      onUnreadActivity?.();
    }, MATCHING_DELAY_MS);

    return () => {
      window.clearTimeout(connectingTimer);
    };
  }, [mediumAvailableHandoffState, onUnreadActivity]);

  useEffect(() => {
    return () => {
      onSidePanelOpenChange?.(false);
    };
  }, [onSidePanelOpenChange]);

  function handleBookTime() {
    setScheduledSpecialistState("matching");
  }

  function handleCancelMatching() {
    setScheduledSpecialistState("initial");
  }

  function handleScheduleCall() {
    setScheduledSpecialistState("scheduling");
    setActiveSidePanel("schedule");
    onSidePanelOpenChange?.(true);
  }

  function handleBackToChat() {
    if (scheduledSpecialistState === "scheduling") {
      setScheduledSpecialistState("matched");
    }

    setActiveSidePanel(null);
    onSidePanelOpenChange?.(false);
  }

  function handleBookMeeting(meeting: BookedMeeting) {
    setBookedMeeting(meeting);
    if (scheduledSpecialistState === "scheduling") {
      setScheduledSpecialistState("booked");
    }

    setActiveSidePanel(null);
    onSidePanelOpenChange?.(false);
  }

  function handleChatBodyScroll(event: UIEvent<HTMLDivElement>) {
    handleLatestScroll();

    const nextHasScrolled = event.currentTarget.scrollTop > 0;

    setHasChatBodyScrolled((currentHasScrolled) =>
      currentHasScrolled === nextHasScrolled
        ? currentHasScrolled
        : nextHasScrolled,
    );
  }

  function handleStartMediumLiveChat() {
    setMediumAvailableHandoffState("connecting");
  }

  function handleScheduleMediumCall() {
    setActiveSidePanel("schedule");
    onSidePanelOpenChange?.(true);
  }

  function renderReviewStep(step: FlowReviewStep, index: number) {
    if (isHighValueFlow && step.id === "high-recommendation-card") {
      return (
        <ScheduledSpecialistCard
          key={`${step.id}-${scheduledSpecialistState}`}
          state={scheduledSpecialistState}
          bookedMeeting={bookedMeeting}
          onBookTime={handleBookTime}
          onCancelMatching={handleCancelMatching}
          onScheduleCall={handleScheduleCall}
        />
      );
    }

    if (isMediumScheduledStep(step)) {
      return (
        <ScheduledSpecialistCard
          key={`${step.id}-${scheduledSpecialistState}`}
          state={scheduledSpecialistState}
          bookedMeeting={bookedMeeting}
          onBookTime={handleBookTime}
          onCancelMatching={handleCancelMatching}
          onScheduleCall={handleScheduleCall}
        />
      );
    }

    if (
      step.kind === "availability" &&
      step.variants.length === 1 &&
      step.variants[0]?.id === "medium-live"
    ) {
      return (
        <MediumAvailableHandoff
          key={`${step.id}-${mediumAvailableHandoffState}`}
          bookedMeeting={bookedMeeting}
          step={step}
          state={mediumAvailableHandoffState}
          onBookTime={handleScheduleMediumCall}
          onStartChat={handleStartMediumLiveChat}
        />
      );
    }

    return renderStep(step, index);
  }

  const thread = (
    <ChatThread
      aria-label={`${flow.label} flow conversation`}
      className={isSidePanelOpen ? "chat-side-panel-thread" : undefined}
    >
      {flow.steps.map(renderReviewStep)}
      {isSidePanelOpen ? (
        <div aria-hidden="true" className="h-lg shrink-0" />
      ) : null}
    </ChatThread>
  );

  return (
    <ChatPanel
      variant={shellVariant}
      className={[isSidePanelOpen && "md:!w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <ChatHeader
        variant={variant}
        identity={chatHeaderIdentity}
        title={HIRING_CONCIERGE_TITLE}
        onClose={onClose}
        dockActionPosition={dockActionPosition}
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
        showCloseAction={showCloseAction}
      />
      {isSidePanelOpen ? (
        <ChatSidePanelLayout
          chatBodyRef={chatBodyRef}
          history={thread}
          onChatBodyScroll={handleChatBodyScroll}
          onJumpToLatest={scrollToLatest}
          sidePanel={
            <SchedulePanel
              onBack={handleBackToChat}
              onBook={handleBookMeeting}
            />
          }
          showJumpToLatest={hasLatestBelow}
          variant={variant}
        />
      ) : (
        <>
          <ChatBody
            ref={chatBodyRef}
            onJumpToLatest={scrollToLatest}
            onScroll={handleChatBodyScroll}
            showJumpToLatest={hasLatestBelow}
          >
            {thread}
          </ChatBody>
          <ChatComposer
            variant={variant}
            showTopDivider={hasChatBodyScrolled}
            showVoiceMode={false}
            className="pointer-events-none"
            inputProps={{
              disabled: true,
            }}
            sendDisabled
          />
        </>
      )}
    </ChatPanel>
  );
}
