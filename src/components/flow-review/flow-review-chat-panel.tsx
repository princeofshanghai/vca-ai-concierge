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
  ChatPanel,
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
import { TextInput } from "@/components/primitives/text-input";
import {
  STARTER_PROMPTS,
  type FlowReview,
  type FlowReviewAvailabilityStep,
  type FlowReviewResourcesStep,
  type FlowReviewStep,
  getMediumFlowReview,
} from "@/lib/conversation-flows";

type FlowReviewChatPanelProps = Readonly<{
  flow: FlowReview;
  variant?: ChatPanelVariant;
  className?: string;
  onClose?: () => void;
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

function getBookedMeetingContactCopy(meeting: BookedMeeting) {
  if (meeting.format === "Online meeting") {
    return `Link will be sent to ${meeting.contact}.`;
  }

  if (meeting.format === "Phone call") {
    return `We'll call you at ${meeting.contact}.`;
  }

  return `We'll call you on WhatsApp at ${meeting.contact}.`;
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

function AvailabilityVariant({ step }: { step: FlowReviewAvailabilityStep }) {
  const variant = step.variants[0];

  if (!variant) {
    return null;
  }

  return (
    <>
      <ChatMessage role={variant.role ?? "assistant"}>
        {variant.message}
      </ChatMessage>
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
          <div className="flex items-start gap-md">
            <span
              aria-hidden="true"
              className="mt-xxs inline-flex size-6 shrink-0 items-center justify-center rounded-round bg-background"
            >
              <span className="block size-4 animate-spin rounded-full border-[1.5px] border-action border-r-transparent" />
            </span>
            <div className="space-y-xs">
              <h2 className="text-heading-md">Connecting you now</h2>
            </div>
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
          <p className="chat-message-enter text-center text-body-xs text-text-meta">
            {LIVE_HIRING_SPECIALIST.name} joined the chat
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

function renderStep(step: FlowReviewStep) {
  if (step.kind === "message") {
    return (
      <div key={step.id} className="contents">
        <ChatMessage role={step.role}>{step.content}</ChatMessage>
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

  return <AvailabilityVariant key={step.id} step={step} />;
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
  onScheduleCall,
}: ScheduledSpecialistCardProps) {
  if (state === "matching") {
    return (
      <article
        role="status"
        aria-live="polite"
        className="chat-message-enter flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background p-xl pr-md text-text"
      >
        <div className="flex items-start gap-md">
          <span
            aria-hidden="true"
            className="mt-xxs inline-flex size-6 shrink-0 items-center justify-center rounded-round bg-background"
          >
            <span className="block size-4 animate-spin rounded-full border-[1.5px] border-action border-r-transparent" />
          </span>
          <div className="space-y-xs">
            <h2 className="text-heading-md">
              Finding you the right sales consultant
            </h2>
            <p className="text-body-sm-open text-text-meta">
              This may take up to 2 minutes.
            </p>
          </div>
        </div>
      </article>
    );
  }

  if (state === "booked" && bookedMeeting) {
    return (
      <article
        role="status"
        aria-live="polite"
        className="chat-message-enter flex w-full max-w-[21.5rem] flex-col items-center gap-lg rounded-md border border-ai-border bg-background p-xl text-center text-text"
      >
        <div className="relative">
          <Entity
            size={48}
            label={`${HIRING_SPECIALIST.name}, ${HIRING_SPECIALIST.role}`}
          />
          <span
            aria-hidden="true"
            className="absolute -right-xxs -bottom-xxs inline-flex size-6 items-center justify-center text-checked [&_svg]:size-5"
          >
            <Icon name="signal-success" size="small" />
          </span>
        </div>
        <div className="space-y-xs">
          <h2 className="text-heading-md">
            Meeting booked with {HIRING_SPECIALIST.name}
          </h2>
          <p className="text-body-sm-open text-text">
            {MEETING_DATE_DETAILS[bookedMeeting.date]} at {bookedMeeting.time} PT
          </p>
          <p className="text-body-sm-open text-text-meta">
            {getBookedMeetingContactCopy(bookedMeeting)}
          </p>
        </div>
      </article>
    );
  }

  if (state === "scheduling") {
    return (
      <article className="chat-message-enter flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background p-xl pr-md text-text">
        <div className="flex items-start gap-md">
          <Entity
            size={40}
            label={`${HIRING_SPECIALIST.name}, ${HIRING_SPECIALIST.role}`}
          />
          <div className="min-w-0 space-y-xs">
            <h2 className="text-heading-md">
              Your sales consultant is {HIRING_SPECIALIST.name}
            </h2>
            <p className="text-body-sm-open text-text-meta">
              Choose a time in the scheduler.
            </p>
          </div>
        </div>
      </article>
    );
  }

  if (state === "matched") {
    return (
      <article className="chat-message-enter flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background p-xl pr-md text-text">
        <div className="flex items-start gap-md">
          <Entity
            size={40}
            label={`${HIRING_SPECIALIST.name}, ${HIRING_SPECIALIST.role}`}
          />
          <div className="min-w-0 space-y-xs">
            <h2 className="text-heading-md">
              Your sales consultant is {HIRING_SPECIALIST.name}
            </h2>
            <p className="text-body-sm-open text-text-meta">
              Choose a time for a 15 min call.
            </p>
          </div>
        </div>
        <Button
          size="small"
          className="w-fit px-pill-padding-inline"
          onClick={onScheduleCall}
        >
          Schedule call
        </Button>
      </article>
    );
  }

  return (
    <article className="chat-message-enter flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background p-xl pr-md text-text">
      <div className="space-y-xs">
        <h2 className="text-heading-md">Speak with a sales consultant</h2>
      </div>
      <Button
        size="small"
        className="w-fit px-pill-padding-inline"
        onClick={onBookTime}
      >
        Book a time
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
  const bookingTimerRef = useRef<number | null>(null);
  const schedulePanelScrollRef = useRef<HTMLDivElement | null>(null);
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
  const [hasSchedulePanelScrolled, setHasSchedulePanelScrolled] =
    useState(false);
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

  useEffect(() => {
    if (initialScrollPosition !== "footer") {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      const schedulePanel = schedulePanelScrollRef.current;

      if (!schedulePanel) {
        return;
      }

      schedulePanel.scrollTop = schedulePanel.scrollHeight;
      setHasSchedulePanelScrolled(schedulePanel.scrollTop > 0);
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [initialScrollPosition]);

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

  function handleSchedulePanelScroll(event: UIEvent<HTMLDivElement>) {
    const nextHasScrolled = event.currentTarget.scrollTop > 0;

    setHasSchedulePanelScrolled((currentHasScrolled) =>
      currentHasScrolled === nextHasScrolled
        ? currentHasScrolled
        : nextHasScrolled,
    );
  }

  return (
    <aside className="flex h-full min-h-0 min-w-0 flex-col bg-background-neutral-soft">
      <div
        className={[
          "shrink-0 border-b bg-background-neutral-soft px-[var(--design-layout-schedule-panel-padding-inline)] pb-xxl pt-lg transition-colors duration-150 ease-out",
          hasSchedulePanelScrolled
            ? "border-border-faint"
            : "border-transparent",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[48px] items-center gap-sm rounded-xs text-control-sm text-text-meta outline-none transition-colors duration-150 ease-out hover:text-text focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
        >
          <Icon name="arrow-left" size="small" />
          <span>Back to chat</span>
        </button>
      </div>

      <div
        ref={schedulePanelScrollRef}
        onScroll={handleSchedulePanelScroll}
        className="min-h-0 flex-1 overflow-y-auto px-[var(--design-layout-schedule-panel-padding-inline)] pb-[48px]"
      >
      <div className="flex flex-wrap items-center gap-md">
        <h2 className="text-display-md text-text">Schedule a call</h2>
        <Tag size="medium" className="gap-xs">
          <Icon name="clock" size="small" />
          <span>15 min</span>
        </Tag>
      </div>

      <article className="mt-xxxl flex w-full max-w-[21.5rem] items-center gap-lg rounded-sm border border-border-faint bg-background p-lg">
        <Entity
          size={48}
          label={`${HIRING_SPECIALIST.name}, ${HIRING_SPECIALIST.role}`}
        />
        <div className="min-w-0">
          <p className="text-heading-md text-text">
            {HIRING_SPECIALIST.name}
          </p>
          <p className="text-body-sm-open text-text-meta">
            {HIRING_SPECIALIST.role}
          </p>
        </div>
      </article>

      <section className="mt-stack space-y-md">
        <h3 className="text-heading-md text-text">Meeting format</h3>
        <div className="flex flex-wrap gap-sm">
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

      <section className="mt-xxxl space-y-md">
        <h3 className="text-heading-md text-text">Date</h3>
        <div className="flex flex-wrap gap-sm">
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

      <section className="mt-xxxl space-y-md">
        <h3 className="text-heading-md text-text">Time</h3>
        {selectedDate ? (
          <div className="flex flex-wrap gap-sm">
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

      <section className="mt-xxxl space-y-md">
        <label htmlFor={noteId} className="block text-heading-md text-text">
          Anything you would like {HIRING_SPECIALIST.name} to know?
        </label>
        <textarea
          id={noteId}
          value={note}
          onChange={(event) => setNote(event.currentTarget.value)}
          disabled={isBooking}
          className="min-h-[7rem] w-full resize-none rounded-sm border border-border bg-background px-lg py-md text-body-md-open text-text outline-none transition-colors duration-150 ease-out hover:border-border-hover focus:border-border-hover disabled:border-transparent disabled:bg-background-disabled disabled:text-text-disabled"
        />
      </section>

      <div className="mt-xxxl flex flex-col gap-md border-t border-border-faint pt-xl sm:flex-row sm:items-center sm:justify-between">
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
      </div>
      </div>
    </aside>
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
  }, [flow.title, isSchedulePanelOpen]);

  useEffect(() => {
    const scrollFrame = window.requestAnimationFrame(() => {
      const chatBody = chatBodyRef.current;

      if (!chatBody) {
        return;
      }

      chatBody.scrollTop = chatBody.scrollHeight;
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

  function handleStartMediumLiveChat() {
    setMediumAvailableHandoffState("connecting");
  }

  function renderReviewStep(step: FlowReviewStep) {
    if (isHighValueFlow && step.id === "high-recommendation-card") {
      return (
        <ScheduledSpecialistCard
          key={`${step.id}-${scheduledSpecialistState}`}
          state={scheduledSpecialistState}
          bookedMeeting={bookedMeeting}
          onBookTime={handleBookTime}
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

    return renderStep(step);
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
        onClose={onClose}
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
          <ChatBody ref={chatBodyRef}>{thread}</ChatBody>
          <ChatComposer
            variant={variant}
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
