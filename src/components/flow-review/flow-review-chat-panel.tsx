"use client";

import {
  type UIEvent,
  useEffect,
  useId,
  useLayoutEffect,
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
  ChatSidePanel,
  ChatThread,
  Prompt,
  RecommendationCard,
  type ChatPanelVariant,
} from "@/components/chat";
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
} from "@/lib/conversation-flows";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

type FlowReviewChatPanelProps = Readonly<{
  flow: FlowReview;
  variant?: ChatPanelVariant;
  className?: string;
  onClose?: () => void;
  onMinimizeToTray?: () => void;
  onVariantToggle?: () => void;
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
  | "connected";

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
}>;

type SchedulePanelVisualState = "default" | "confirming";
type SchedulePanelInitialScrollPosition = "top" | "footer";

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

  return (
    <>
      <ChatMessage
        role={variant.role ?? "assistant"}
        className={
          (variant.role ?? "assistant") === "assistant" ? "!pb-xs" : undefined
        }
        timestamp={
          (variant.role ?? "assistant") === "assistant" ? undefined : timestamp
        }
      >
        {variant.message}
      </ChatMessage>
      {(variant.role ?? "assistant") === "assistant" ? (
        <ChatMessageFeedbackFlow timestamp={timestamp} />
      ) : null}
      <RecommendationCard
        title={variant.title}
        primaryAction={variant.primaryAction}
        secondaryAction={variant.secondaryAction}
      />
    </>
  );
}

function MediumAvailableHandoff({
  step,
  state,
  onStartChat,
}: {
  step: FlowReviewAvailabilityStep;
  state: MediumAvailableHandoffState;
  onStartChat: () => void;
}) {
  const variant = step.variants[0];

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
          <div className="flex items-center gap-md">
            <span
              aria-hidden="true"
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-round bg-background"
            >
              <span className="block size-4 animate-spin rounded-full border-[1.5px] border-action border-r-transparent" />
            </span>
            <h2 className="text-heading-md">Connecting you now</h2>
          </div>
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
        <>
          <p className="chat-message-enter mb-md mt-md text-center text-body-xs text-text-meta">
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
        </>
      ) : null}
    </>
  );
}

export function MediumAvailableHandoffPreview({
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
      step={availabilityStep}
      state={state}
      onStartChat={() => {}}
    />
  );
}

function renderStep(step: FlowReviewStep, index = 0) {
  if (step.kind === "message") {
    const showFeedback =
      step.role === "assistant" && !step.showStarterPromptsAfter;
    const timestamp = getPrototypeMessageTimestamp(index);

    return (
      <div key={step.id} className="contents">
        <ChatMessage
          role={step.role}
          className={showFeedback ? "!pb-xs" : undefined}
          timestamp={showFeedback ? undefined : timestamp}
        >
          {step.content}
        </ChatMessage>
        {showFeedback ? <ChatMessageFeedbackFlow timestamp={timestamp} /> : null}
        {step.showStarterPromptsAfter ? <StarterPromptRow /> : null}
      </div>
    );
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

function hasMediumScheduledHandoff(flow: FlowReview) {
  return flow.steps.some(isMediumScheduledStep);
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
  const [hasChatBodyScrolled, setHasChatBodyScrolled] = useState(false);
  const isHighValueFlow = flow.id === "high";
  const isMediumScheduledFlow = hasMediumScheduledHandoff(flow);
  const isScheduledSpecialistFlow = isHighValueFlow || isMediumScheduledFlow;
  const isSchedulePanelOpen =
    isScheduledSpecialistFlow && scheduledSpecialistState === "scheduling";
  const shellVariant = variant;

  useLayoutEffect(() => {
    const chatBody = chatBodyRef.current;

    if (!chatBody) {
      return;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
    setHasChatBodyScrolled(chatBody.scrollTop > 0);
  }, [flow.title, isSchedulePanelOpen]);

  useEffect(() => {
    const scrollFrame = window.requestAnimationFrame(() => {
      const chatBody = chatBodyRef.current;

      if (!chatBody) {
        return;
      }

      chatBody.scrollTop = chatBody.scrollHeight;
      setHasChatBodyScrolled(chatBody.scrollTop > 0);
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [flow.title, isSchedulePanelOpen]);

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
    }, MATCHING_DELAY_MS);

    return () => {
      window.clearTimeout(connectingTimer);
    };
  }, [mediumAvailableHandoffState]);

  useEffect(() => {
    return () => {
      onSidePanelOpenChange?.(false);
    };
  }, [onSidePanelOpenChange]);

  useEffect(() => {
    const shouldScrollScheduledSpecialist =
      isScheduledSpecialistFlow && scheduledSpecialistState !== "initial";
    const shouldScrollMediumAvailable =
      mediumAvailableHandoffState !== "initial";

    if (!shouldScrollScheduledSpecialist && !shouldScrollMediumAvailable) {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      const chatBody = chatBodyRef.current;

      if (!chatBody) {
        return;
      }

      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior:
          isSchedulePanelOpen ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
      });
      setHasChatBodyScrolled(chatBody.scrollTop > 0);
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [
    isScheduledSpecialistFlow,
    isSchedulePanelOpen,
    mediumAvailableHandoffState,
    scheduledSpecialistState,
  ]);

  function handleBookTime() {
    setScheduledSpecialistState("matching");
  }

  function handleCancelMatching() {
    setScheduledSpecialistState("initial");
  }

  function handleScheduleCall() {
    setScheduledSpecialistState("scheduling");
    onSidePanelOpenChange?.(true);
  }

  function handleBackToChat() {
    setScheduledSpecialistState("matched");
    onSidePanelOpenChange?.(false);
  }

  function handleBookMeeting(meeting: BookedMeeting) {
    setBookedMeeting(meeting);
    setScheduledSpecialistState("booked");
    onSidePanelOpenChange?.(false);
  }

  function handleChatBodyScroll(event: UIEvent<HTMLDivElement>) {
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
          step={step}
          state={mediumAvailableHandoffState}
          onStartChat={handleStartMediumLiveChat}
        />
      );
    }

    return renderStep(step, index);
  }

  const thread = (
    <ChatThread
      aria-label={`${flow.label} flow conversation`}
      className={isSchedulePanelOpen ? "chat-schedule-thread" : undefined}
    >
      {flow.steps.map(renderReviewStep)}
      {isSchedulePanelOpen ? (
        <div aria-hidden="true" className="h-lg shrink-0" />
      ) : null}
    </ChatThread>
  );

  return (
    <ChatPanel
      variant={shellVariant}
      className={[isSchedulePanelOpen && "md:!w-full", className]
        .filter(Boolean)
        .join(" ")}
    >
      <ChatHeader
        variant={variant}
        title={HIRING_CONCIERGE_TITLE}
        onClose={onClose}
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
      />
      {isSchedulePanelOpen ? (
        <div
          data-chat-variant={variant}
          className="chat-schedule-layout min-h-0 flex-1"
        >
          <div className="hidden min-h-0 min-w-0 border-r border-border-faint md:flex">
            <ChatBody
              ref={chatBodyRef}
              onScroll={handleChatBodyScroll}
              className={
                variant === "collapsed"
                  ? "chat-schedule-history [--design-layout-chat-message-assistant-max:var(--design-layout-chat-message-assistant-collapsed-max)]"
                  : "chat-schedule-history"
              }
            >
              {thread}
            </ChatBody>
          </div>
          <SchedulePanel onBack={handleBackToChat} onBook={handleBookMeeting} />
        </div>
      ) : (
        <>
          <ChatBody ref={chatBodyRef} onScroll={handleChatBodyScroll}>
            {thread}
          </ChatBody>
          <ChatComposer
            variant={variant}
            showTopDivider={hasChatBodyScrolled}
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
