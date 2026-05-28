"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatPanel,
  ChatSidePanel,
  ChatSidePanelLayout,
  ChatTray,
  ChatThread,
  Prompt,
  type ChatPanelVariant,
} from "@/components/chat";
import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import { OverlayButtonIcon } from "@/components/primitives/overlay-button-icon";
import { Pill } from "@/components/primitives/pill";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";
import { TabItemHorizontal } from "@/components/primitives/tab-item-horizontal";
import { Tag } from "@/components/primitives/tag";
import { TextArea } from "@/components/primitives/text-area";
import { TextInput } from "@/components/primitives/text-input";

import {
  PCP_MEMBER_ASSET_ROOT,
  pcpCompanyProfile,
} from "./persona";

const ASSET_ROOT = PCP_MEMBER_ASSET_ROOT;

const pageTabs = [
  "Home",
  "About",
  "Posts",
  "Services",
  "Jobs",
  "Life",
  "People",
  "Insights",
];

const companyMetadata = [
  pcpCompanyProfile.industry,
  pcpCompanyProfile.location,
  pcpCompanyProfile.followers,
  pcpCompanyProfile.employees,
];

const sideJobs = [
  "Principal Product Strategist",
  "Senior UX Researcher",
  "Design Program Manager",
];

const affiliatedPages = [
  "LumaWorks",
  "Waypoint Research",
  "Northline Consulting",
];

const overviewHighlights = [
  {
    title: "Certified Woman-Owned Business",
    date: "January 2025",
    image: pcpCompanyProfile.logoSrc,
  },
  {
    title: "Top boutique product strategy firm",
    date: "June 2024",
    image: pcpCompanyProfile.logoSrc,
  },
];

const posts = [
  {
    title: "Three signals your roadmap is hiding a positioning problem.",
    body: "If every customer story points to a different buyer, the product team may be solving the right problem with the wrong narrative.",
    image: "../post-building-blue.png",
    stats: "4,238 impressions",
  },
  {
    title: "Before and after: making a complex onboarding flow easier to trust.",
    body: "A sharper first-run experience helped one SaaS team explain value faster and reduce drop-off before the first setup milestone.",
    image: "../post-kudos.png",
    stats: "42 comments",
  },
];

const products = [
  {
    title: "Product Strategy Sprint",
    type: "Consulting service",
    body: "A four-week engagement to clarify your market, sharpen the product narrative, and align leadership around the next growth bet.",
    image: "hero-cover-1.png",
  },
  {
    title: "UX Research Pod",
    type: "Consulting service",
    body: "A lightweight research pod for discovery, usability testing, and decision-ready synthesis when your internal team is stretched.",
  },
  {
    title: "Executive Narrative Workshop",
    type: "Consulting service",
    body: "A focused workshop for founders and product leaders who need to turn ambiguous product direction into a crisp story for customers, boards, or teams.",
    image: "media-1.png",
  },
];

const leaders = [
  {
    name: pcpCompanyProfile.founderName,
    role: pcpCompanyProfile.founderTitle,
    followers: "8,412 followers",
    image: "beta-entity.png",
  },
  {
    name: "Nadia Flores",
    role: "Research Director",
    followers: "3,284 followers",
    image: "avatar-2.png",
  },
  {
    name: "Marcus Lee",
    role: "Principal Product Strategist",
    followers: "2,981 followers",
    image: "avatar-1.png",
  },
  {
    name: "Ari Kim",
    role: "Design Lead",
    followers: "1,946 followers",
    image: "entity-icon.png",
  },
];

const leaderPosts = [
  {
    author: pcpCompanyProfile.founderName,
    avatar: "beta-entity.png",
    body: "A good product strategy does not start with more ideas. It starts with deciding which customer truth deserves the most attention this quarter.",
    image: null,
  },
  {
    author: "Nadia Flores",
    avatar: "avatar-2.png",
    body: "Research gets more useful when teams stop asking for certainty and start asking which decision the evidence needs to improve.",
    image: "media-1.png",
  },
  {
    author: "Marcus Lee",
    avatar: "avatar-1.png",
    body: "Your onboarding flow is a positioning statement. Every unclear step tells customers what your product still has not decided.",
    image: "media-2.png",
    linkTitle: "How product teams regain momentum after a vague roadmap",
    linkMeta: "Velora Consulting on LinkedIn - 7min...",
  },
];

const mainJobOpenings = [
  "Principal Product Strategist",
  "Senior UX Researcher",
];

const newsletters = [
  {
    title: "The Product Clarity Brief",
    meta: "Weekly - 2,674 subscribers",
    body: "Weekly notes for founders and product leaders turning messy signals into sharper product decisions.",
  },
  {
    title: "Founder Field Notes",
    meta: "Monthly - 1,204 subscribers",
    body: "Practical lessons from product strategy, UX research, and go-to-market alignment work with growing B2B teams.",
  },
  {
    title: "Research Signals",
    meta: "Monthly - 894 subscribers",
    body: "A concise readout of customer patterns, research prompts, and experiments worth trying before the next roadmap review.",
  },
];

const footerLinkColumns = [
  ["About", "Community Guidelines", "Privacy & Terms", "Sales Solution", "Safety Center"],
  ["Accessibility", "Careers", "Ad Choices", "Mobile"],
  ["Talent Solutions", "Marketing Solutions", "Advertising", "Small Business"],
];

type VcaEntryPoint = "header" | "anchor" | "services" | "featured";
type VcaShellMode = "drawer" | "rail" | "hybrid";
type VcaConversationStage =
  | "opening"
  | "qualifying"
  | "postProof"
  | "objectionHandling"
  | "servicesPricing"
  | "booking";
type VcaMeetingDate = "Thu, Jun 5" | "Fri, Jun 6" | "Tue, Jun 10";
type VcaMeetingTime = "10:00 AM" | "1:30 PM" | "3:00 PM";
type VcaBookedMeeting = Readonly<{
  date: VcaMeetingDate;
  time: VcaMeetingTime;
  email: string;
  note: string;
}>;

const VCA_FIT_PROMPT = "See if Velora is the right fit for us";
const VCA_SERVICES_PROMPT = "Learn about services and pricing";
const VCA_BOOK_PROMPT = "Book a discovery call";
const vcaStarterPrompts = [
  VCA_FIT_PROMPT,
  VCA_SERVICES_PROMPT,
  VCA_BOOK_PROMPT,
];
const VCA_FEATURED_CONTEXT_PROMPT = "Show me a relevant client story";
const VCA_POST_PROOF_PRICING_PROMPT = "Talk through pricing and scope";
const VCA_POST_PROOF_DIFFERENTIATION_PROMPT =
  "How is Velora different from a bigger consultancy?";
const vcaPostProofPrompts = [
  VCA_POST_PROOF_PRICING_PROMPT,
  VCA_POST_PROOF_DIFFERENTIATION_PROMPT,
  VCA_BOOK_PROMPT,
];

const VCA_BOOKING_DELAY_MS = 550;
const VCA_MEETING_DATES: ReadonlyArray<VcaMeetingDate> = [
  "Thu, Jun 5",
  "Fri, Jun 6",
  "Tue, Jun 10",
];
const VCA_MEETING_TIMES: ReadonlyArray<VcaMeetingTime> = [
  "10:00 AM",
  "1:30 PM",
  "3:00 PM",
];
const VCA_MEETING_DATE_DETAILS: Record<VcaMeetingDate, string> = {
  "Thu, Jun 5": "Thursday, Jun 5",
  "Fri, Jun 6": "Friday, Jun 6",
  "Tue, Jun 10": "Tuesday, Jun 10",
};
const VCA_QUALIFYING_QUESTION =
  "Happy to help with that. What kind of company are you at - and what's the challenge you're trying to solve?";
const VCA_PROOF_RESPONSE =
  "That's a strong fit for how Velora works. A lot of engagements with SaaS companies start with exactly that: a focused strategy sprint ahead of a new market push. Here's a relevant example.";
const VCA_FEATURED_PROOF_RESPONSE =
  "A good way to evaluate Velora is to look at whether their proof maps to your situation. This client story is closest to the kinds of product strategy questions visitors usually bring from this page.";
const VCA_SERVICES_RESPONSE =
  "Velora usually works with teams in three engagement shapes. Pricing stays fixed-fee, but the scope depends on the decision you need to make, how much research is involved, and how senior the working team needs to be.";
const VCA_OBJECTION_RESPONSE =
  "A focused Velora engagement is scoped as a fixed-fee project once the timeline, research depth, stakeholder complexity, and senior involvement are clear. Compared with a larger consultancy, the difference is seniority and focus: Skylar and the leads stay close to the work instead of handing it off after the pitch. The fastest way to test fit is a 30-minute discovery call around your situation.";
const VCA_BOOKING_SUMMARY =
  "We're exploring product strategy support for a new market expansion.";
const VCA_SERVICES_BOOKING_SUMMARY =
  "We're exploring which Velora engagement type best fits our product strategy needs.";
const VCA_BOOKING_CARD_CLASS =
  "chat-message-enter flex w-full max-w-[24rem] flex-col gap-lg rounded-md border border-ai-border bg-background py-xl pl-xl pr-lg text-text shadow-raised-faint";
const vcaEngagementSummaries = [
  {
    title: "Product Strategy Sprint",
    body: "Best when the team needs a crisp market wedge, sharper product narrative, and leadership alignment before a new bet.",
  },
  {
    title: "UX Research Pod",
    body: "Best when the decision is blocked by customer evidence, usability risk, or a discovery team that is stretched thin.",
  },
  {
    title: "Executive Narrative Workshop",
    body: "Best when founders or product leaders need to turn ambiguous direction into a clear story for customers, boards, or teams.",
  },
];

const vcaPanelContent: Record<
  VcaEntryPoint,
  Readonly<{
    eyebrow: string;
    opening: string;
  }>
> = {
  header: {
    eyebrow: "Page assistant",
    opening:
      "Hi! What brings you to Velora today?",
  },
  anchor: {
    eyebrow: "Page assistant",
    opening:
      "Hi! What brings you to Velora today?",
  },
  services: {
    eyebrow: "Services context",
    opening:
      "Not sure which engagement type fits your situation? I can help you compare Velora's strategy, research, and narrative services.",
  },
  featured: {
    eyebrow: "Featured context",
    opening:
      "Curious if Velora Consulting has worked on problems like yours? I can help you connect the featured proof points to your team's situation.",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function assetSrc(path: string) {
  return path.startsWith("/") ? path : `${ASSET_ROOT}/${path}`;
}

function VeloraVcaLogoMark() {
  return (
    <Image
      alt=""
      className="h-6 w-7 max-w-none shrink-0 object-contain"
      height={35}
      src={assetSrc("velora-vca-logo.png")}
      width={39}
    />
  );
}

function VeloraProofCard() {
  return (
    <article className="chat-message-enter flex w-full max-w-[24rem] flex-col gap-lg rounded-md border border-ai-border bg-background py-xl pl-xl pr-lg text-text shadow-raised-faint">
      <div className="flex items-center gap-xs text-body-xs text-text-meta">
        <Icon name="document" size="small" />
        <span>Client story</span>
      </div>
      <div className="space-y-xs">
        <h2 className="text-heading-md text-text">
          How Velora helped a SaaS team define a wedge strategy for a new vertical
        </h2>
        <p className="text-body-sm-open text-text-meta">
          An 80-person B2B SaaS company engaged Velora for a six-week product
          strategy sprint ahead of entering a regulated vertical. The team left
          with a prioritized opportunity map, sharper buyer narrative, and a
          leadership decision they trusted.
        </p>
      </div>
      <button
        className="inline-flex w-fit items-center gap-xs rounded-xs text-control-sm text-action outline-none transition-colors duration-150 ease-out hover:text-action-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
        type="button"
      >
        <span>See the full case study</span>
        <Icon name="arrow-right" size="small" />
      </button>
    </article>
  );
}

function VeloraServicesPricingCard() {
  return (
    <article className={VCA_BOOKING_CARD_CLASS}>
      <div className="flex items-center gap-xs text-body-xs text-text-meta">
        <Icon name="services" size="small" />
        <span>Engagement options</span>
      </div>
      <div className="space-y-xs">
        <h2 className="text-heading-md text-text">
          Three ways teams usually work with Velora
        </h2>
        <p className="text-body-sm-open text-text-meta">
          The right path depends on whether your biggest unknown is strategy,
          evidence, or executive narrative.
        </p>
      </div>
      <div className="space-y-md">
        {vcaEngagementSummaries.map((engagement, index) => (
          <div
            className={cx(
              "space-y-xxs",
              index > 0 && "border-t border-border-faint pt-md",
            )}
            key={engagement.title}
          >
            <h3 className="text-control-sm text-text">{engagement.title}</h3>
            <p className="text-body-sm-open text-text-meta">
              {engagement.body}
            </p>
          </div>
        ))}
      </div>
      <p className="rounded-sm bg-ai-background-soft px-md py-sm text-body-sm-open text-text-meta">
        Scope is shaped by timeline, research depth, stakeholder complexity, and
        how hands-on the senior Velora team needs to be.
      </p>
    </article>
  );
}

function VeloraBookingActionCard({
  onBookTime,
}: Readonly<{ onBookTime: () => void }>) {
  return (
    <article className={VCA_BOOKING_CARD_CLASS}>
      <div className="flex items-center gap-xs text-body-xs text-text-meta">
        <Icon name="calendar" size="small" />
        <span>Recommended next step</span>
      </div>
      <div className="space-y-xs">
        <h2 className="text-heading-md text-text">
          Book a 30-min discovery call
        </h2>
        <p className="text-body-sm-open text-text-meta">
          Velora scopes strategy sprints as fixed-fee engagements based on
          timeline, research depth, and senior involvement. A short call is the
          fastest way to see if the scope and budget fit.
        </p>
      </div>
      <Button
        className="w-fit px-pill-padding-inline"
        leadingIcon={<Icon name="calendar" />}
        onClick={onBookTime}
        size="small"
      >
        Pick a time
      </Button>
    </article>
  );
}

function VeloraBookingConfirmationCard({
  meeting,
}: Readonly<{ meeting: VcaBookedMeeting }>) {
  return (
    <article
      aria-live="polite"
      className={VCA_BOOKING_CARD_CLASS}
      role="status"
    >
      <div className="flex items-center gap-xs text-body-xs text-checked">
        <Icon name="signal-success" size="small" />
        <span>Discovery call booked</span>
      </div>
      <div className="space-y-xs">
        <h2 className="text-heading-md text-text">
          You&apos;re booked - {VCA_MEETING_DATE_DETAILS[meeting.date]} at{" "}
          {meeting.time} PT
        </h2>
        <p className="text-body-sm-open text-text-meta">
          I&apos;ve shared a summary of what you&apos;re working on with Skylar
          so your call can get straight to the substance.
        </p>
      </div>
      <p className="text-body-sm-open text-text-meta">
        Calendar invite sent to {meeting.email}.
      </p>
    </article>
  );
}

function VeloraSchedulePanel({
  initialNote,
  onBack,
  onBook,
}: Readonly<{
  initialNote: string;
  onBack: () => void;
  onBook: (meeting: VcaBookedMeeting) => void;
}>) {
  const bookingTimerRef = useRef<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<VcaMeetingDate | null>(
    VCA_MEETING_DATES[0] ?? null,
  );
  const [selectedTime, setSelectedTime] = useState<VcaMeetingTime | null>(
    VCA_MEETING_TIMES[0] ?? null,
  );
  const [email, setEmail] = useState("alex@northstar.io");
  const [note, setNote] = useState(initialNote);
  const [isBooking, setIsBooking] = useState(false);
  const canBookCall =
    Boolean(selectedDate) &&
    Boolean(selectedTime) &&
    email.trim().length > 0;
  const footerHelp =
    email.trim().length === 0
      ? "Enter your work email to continue."
      : !selectedDate
        ? "Choose a date to continue."
        : !selectedTime
          ? "Choose a time to continue."
          : "Skylar will get your context before the call.";

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
        date: selectedDate,
        time: selectedTime,
        email: email.trim(),
        note: note.trim(),
      });
    }, VCA_BOOKING_DELAY_MS);
  }

  return (
    <ChatSidePanel
      backLabel="Back to Velora chat"
      footerClassName="mt-stack-lg flex flex-col gap-md border-t border-border-faint pt-xl sm:flex-row sm:items-center sm:justify-between"
      footer={
        <>
          <p className="min-h-[1.25rem] text-body-sm-open text-text-meta">
            {footerHelp}
          </p>
          <Button
            className="w-full sm:w-fit"
            disabled={!canBookCall}
            loading={isBooking}
            loadingLabel="Booking"
            onClick={handleBookCall}
          >
            Book discovery call
          </Button>
        </>
      }
      onBack={onBack}
    >
      <div className="flex flex-wrap items-center gap-md">
        <h2 className="text-heading-xl text-text">Schedule a discovery call</h2>
        <Tag className="gap-xs" size="medium">
          <Icon name="clock" size="small" />
          <span>30 min</span>
        </Tag>
      </div>

      <article className="mt-xxl flex w-full max-w-[21.5rem] items-center gap-sm rounded-md border border-border-faint bg-background pb-xl pl-xl pr-lg pt-xl">
        <Entity
          label={`${pcpCompanyProfile.founderName}, ${pcpCompanyProfile.founderTitle}`}
          size={48}
          src={pcpCompanyProfile.founderAvatarSrc}
        />
        <div className="min-w-0">
          <p className="text-heading-md text-text">
            {pcpCompanyProfile.founderName}
          </p>
          <p className="text-body-xs text-text-meta">
            {pcpCompanyProfile.founderTitle}
          </p>
        </div>
      </article>

      <section className="mt-stack-lg space-y-lg">
        <h3 className="text-heading-lg text-text">Work email</h3>
        <TextInput
          autoComplete="email"
          className="max-w-[21.5rem]"
          inputMode="email"
          label="Work email"
          onChange={(event) => setEmail(event.currentTarget.value)}
          size="large"
          trailingIcon={null}
          type="email"
          value={email}
        />
      </section>

      <section className="mt-stack-lg space-y-lg">
        <h3 className="text-heading-lg text-text">Date</h3>
        <div className="flex flex-wrap gap-x-sm gap-y-xs">
          {VCA_MEETING_DATES.map((date) => (
            <Pill
              checked={selectedDate === date}
              disabled={isBooking}
              key={date}
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
            {VCA_MEETING_TIMES.map((time) => (
              <Pill
                checked={selectedTime === time}
                disabled={isBooking}
                key={time}
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
        <label className="block text-heading-lg text-text">
          Anything you want Skylar to know?
          <TextArea
            className="mt-lg"
            disabled={isBooking}
            onChange={(event) => setNote(event.currentTarget.value)}
            size="large"
            value={note}
          />
        </label>
      </section>
    </ChatSidePanel>
  );
}

function PremiumCompanyPagesVcaPanel({
  entryPoint,
  shellMode,
  variant,
  draft,
  conversationStage,
  bookedMeeting,
  isSchedulePanelOpen,
  onClose,
  onBackToChat,
  onBookMeeting,
  onDraftChange,
  onMinimizeToTray,
  onOpenSchedulePanel,
  onVariantToggle,
  onPromptSelect,
  onSend,
  selectedFollowUpPrompt,
  selectedStarterPrompt,
  qualifiedAnswer,
}: Readonly<{
  entryPoint: VcaEntryPoint;
  shellMode: VcaShellMode;
  variant?: ChatPanelVariant;
  draft: string;
  conversationStage: VcaConversationStage;
  bookedMeeting: VcaBookedMeeting | null;
  isSchedulePanelOpen: boolean;
  onClose: () => void;
  onBackToChat: () => void;
  onBookMeeting: (meeting: VcaBookedMeeting) => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onMinimizeToTray?: () => void;
  onOpenSchedulePanel: () => void;
  onVariantToggle?: () => void;
  onPromptSelect: (prompt: string) => void;
  onSend: () => void;
  selectedFollowUpPrompt: string | null;
  selectedStarterPrompt: string | null;
  qualifiedAnswer: string;
}>) {
  const content = vcaPanelContent[entryPoint];
  const identity =
    shellMode === "hybrid"
      ? ({
          type: "ai",
          title: pcpCompanyProfile.name,
          icon: <VeloraVcaLogoMark />,
        } as const)
      : undefined;
  const shouldShowProof =
    (conversationStage === "postProof" ||
      conversationStage === "objectionHandling" ||
      (conversationStage === "booking" && Boolean(selectedFollowUpPrompt))) &&
    selectedStarterPrompt !== VCA_SERVICES_PROMPT;
  const shouldShowServices =
    conversationStage === "servicesPricing" ||
    (conversationStage === "booking" &&
      selectedStarterPrompt === VCA_SERVICES_PROMPT);
  const shouldShowObjection = conversationStage === "objectionHandling";
  const shouldShowDirectBooking =
    conversationStage === "booking" &&
    selectedStarterPrompt === VCA_BOOK_PROMPT &&
    !selectedFollowUpPrompt;
  const shouldShowPostProofPrompts =
    conversationStage === "postProof" && !selectedFollowUpPrompt && !bookedMeeting;
  const proofResponse =
    entryPoint === "featured" && !qualifiedAnswer.trim()
      ? VCA_FEATURED_PROOF_RESPONSE
      : VCA_PROOF_RESPONSE;
  const scheduleNote =
    qualifiedAnswer.trim() ||
    (selectedStarterPrompt === VCA_SERVICES_PROMPT
      ? VCA_SERVICES_BOOKING_SUMMARY
      : VCA_BOOKING_SUMMARY);
  const thread = (
    <ChatThread
      className={cx(
        shellMode === "rail" && "px-lg",
        isSchedulePanelOpen && "chat-side-panel-thread",
      )}
      showAiDisclaimer={false}
    >
      <div className="flex flex-col gap-lg">
        <p className="text-body-xs text-text-meta">{content.eyebrow}</p>
        <ChatMessage>{content.opening}</ChatMessage>
        {conversationStage === "opening" && !selectedStarterPrompt ? (
          <div className="flex flex-col gap-sm">
            {vcaStarterPrompts.map((prompt) => (
              <Prompt
                className={cx(shellMode === "rail" && "md:max-w-full")}
                key={prompt}
                onPromptSelect={onPromptSelect}
                prompt={prompt}
              />
            ))}
          </div>
        ) : null}
        {selectedStarterPrompt ? (
          <ChatMessage role="user">{selectedStarterPrompt}</ChatMessage>
        ) : null}
        {conversationStage === "qualifying" ? (
          <ChatMessage>{VCA_QUALIFYING_QUESTION}</ChatMessage>
        ) : null}
        {shouldShowProof ? (
          <>
            {qualifiedAnswer ? (
              <ChatMessage role="user">{qualifiedAnswer}</ChatMessage>
            ) : null}
            <ChatMessage>{proofResponse}</ChatMessage>
            <VeloraProofCard />
            {shouldShowPostProofPrompts ? (
              <div className="flex flex-col gap-sm">
                {vcaPostProofPrompts.map((prompt) => (
                  <Prompt
                    className={cx(shellMode === "rail" && "md:max-w-full")}
                    key={prompt}
                    onPromptSelect={onPromptSelect}
                    prompt={prompt}
                  />
                ))}
              </div>
            ) : null}
            {selectedFollowUpPrompt ? (
              <ChatMessage role="user">{selectedFollowUpPrompt}</ChatMessage>
            ) : null}
            {shouldShowObjection ? (
              <>
                <ChatMessage>{VCA_OBJECTION_RESPONSE}</ChatMessage>
                {bookedMeeting ? (
                  <VeloraBookingConfirmationCard meeting={bookedMeeting} />
                ) : (
                  <VeloraBookingActionCard onBookTime={onOpenSchedulePanel} />
                )}
              </>
            ) : null}
            {selectedFollowUpPrompt === VCA_BOOK_PROMPT ? (
              bookedMeeting ? (
                <VeloraBookingConfirmationCard meeting={bookedMeeting} />
              ) : !isSchedulePanelOpen ? (
                <VeloraBookingActionCard onBookTime={onOpenSchedulePanel} />
              ) : null
            ) : null}
          </>
        ) : null}
        {shouldShowServices ? (
          <>
            <ChatMessage>{VCA_SERVICES_RESPONSE}</ChatMessage>
            <VeloraServicesPricingCard />
            {bookedMeeting ? (
              <VeloraBookingConfirmationCard meeting={bookedMeeting} />
            ) : (
              <VeloraBookingActionCard onBookTime={onOpenSchedulePanel} />
            )}
          </>
        ) : null}
        {shouldShowDirectBooking && bookedMeeting ? (
          <VeloraBookingConfirmationCard meeting={bookedMeeting} />
        ) : null}
        {shouldShowDirectBooking && !bookedMeeting && !isSchedulePanelOpen ? (
          <VeloraBookingActionCard onBookTime={onOpenSchedulePanel} />
        ) : null}
        {isSchedulePanelOpen ? (
          <div aria-hidden="true" className="h-lg shrink-0" />
        ) : null}
      </div>
    </ChatThread>
  );

  return (
    <ChatPanel
      aria-label={`${pcpCompanyProfile.name} assistant`}
      className={cx(
        isSchedulePanelOpen && "md:!w-full",
        shellMode === "rail"
          ? "!h-full !w-full !rounded-sm shadow-raised-faint md:!h-full md:!w-full"
          : shellMode === "hybrid"
            ? cx(
                "!h-full !w-full shadow-raised-faint md:!h-full md:!w-full",
                variant === "expanded"
                  ? "!rounded-none md:!rounded-panel"
                  : "!rounded-none md:!rounded-t-md md:!rounded-b-none",
              )
            : "!h-full !w-full !rounded-none border-l border-border-faint shadow-raised-faint md:!h-full md:!w-full md:!rounded-l-panel md:!rounded-r-none",
      )}
      variant={variant}
    >
      <ChatHeader
        identity={identity}
        title={pcpCompanyProfile.name}
        variant={variant}
        onClose={onClose}
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
      />
      {isSchedulePanelOpen ? (
        <ChatSidePanelLayout
          history={thread}
          sidePanel={
            <VeloraSchedulePanel
              initialNote={scheduleNote}
              onBack={onBackToChat}
              onBook={onBookMeeting}
            />
          }
          variant={variant}
        />
      ) : (
        <>
          <ChatBody>{thread}</ChatBody>
          <ChatComposer
            inputProps={{
              "aria-label": `Message ${pcpCompanyProfile.name}`,
              onChange: onDraftChange,
              placeholder: "Send a message",
              value: draft,
            }}
            onSend={onSend}
            showAttachAction={false}
            showDictationAction={false}
            showTopDivider={false}
            showVoiceMode={false}
            variant="collapsed"
          />
        </>
      )}
    </ChatPanel>
  );
}

function ContextualVcaNudge({
  body,
  onClick,
  title,
}: Readonly<{
  body: string;
  onClick: () => void;
  title: string;
}>) {
  return (
    <button
      className="mt-lg flex w-full items-start gap-sm rounded-sm border border-ai-border bg-ai-background-soft px-lg py-md text-left transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-action hover:bg-action-background-transparent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
      onClick={onClick}
      type="button"
    >
      <span className="mt-xxs inline-flex shrink-0 text-ai-icon">
        <Icon name="signal-ai" size="small" />
      </span>
      <span className="min-w-0">
        <span className="block text-control-sm text-text">{title}</span>
        <span className="mt-xxs block text-body-sm-open text-text-meta">
          {body}
        </span>
      </span>
    </button>
  );
}

function AskVeloraAnchor({
  isVisible,
  onOpen,
}: Readonly<{
  isVisible: boolean;
  onOpen: () => void;
}>) {
  if (!isVisible) {
    return null;
  }

  return (
    <OverlayButtonIcon
      className="fixed bottom-xxxl right-xxxl z-30 transition-[opacity,transform] duration-200 ease-out"
      color="white"
      label={`Ask ${pcpCompanyProfile.name}`}
      onClick={onOpen}
      size="medium"
    >
      <Image
        alt=""
        className="h-10 w-11 max-w-none shrink-0 object-contain"
        height={35}
        src={assetSrc("velora-vca-logo.png")}
        width={39}
      />
    </OverlayButtonIcon>
  );
}

function PremiumMark({
  size = "small",
  tone = "brand",
}: Readonly<{ size?: "small" | "medium"; tone?: "brand" | "inbug" }>) {
  return (
    <Icon
      aria-hidden="true"
      className={cx(
        "shrink-0",
        tone === "inbug" ? "text-premium-inbug" : "text-premium-brand",
      )}
      name="linked-in-bug"
      size={size}
    />
  );
}

function CompanyLogo({ className }: Readonly<{ className?: string }>) {
  return (
    <span
      className={cx(
        "relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-[#111827]",
        className,
      )}
    >
      <Image
        alt={pcpCompanyProfile.name}
        className="size-full object-cover"
        height={200}
        src={pcpCompanyProfile.logoSrc}
        width={200}
      />
    </span>
  );
}

function Hero({
  onBookCall,
  onOpenVca,
}: Readonly<{
  onBookCall: () => void;
  onOpenVca: (entryPoint: VcaEntryPoint) => void;
}>) {
  return (
    <section className="relative overflow-hidden bg-[#041838] text-white">
      <Image
        alt=""
        className="absolute inset-0 size-full object-cover"
        height={2415}
        priority
        src={pcpCompanyProfile.heroSrc}
        width={3840}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041838] via-[#041838]/35 to-black/15" />

      <div className="relative min-h-[560px] px-lg sm:min-h-[520px]">
        <div className="mx-auto flex min-h-[560px] w-full max-w-[1128px] flex-col justify-end gap-xxl pb-0 pt-stack sm:min-h-[520px]">
          <div className="grid gap-xxl lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="max-w-[720px] pb-xxl">
              <CompanyLogo className="size-24 border-2 border-white shadow-raised-faint" />
              <div className="mt-lg flex flex-wrap items-center gap-xs">
                <h1 className="text-display-xl text-[var(--figma-color-text-color-text-overlay)]">
                  {pcpCompanyProfile.name}
                </h1>
                <span className="inline-flex translate-y-xxs items-center gap-xs">
                  <Icon name="verified" size="medium" label="Verified" />
                  <PremiumMark size="medium" />
                </span>
              </div>
              <p className="mt-xs max-w-[640px] text-body-md text-[var(--figma-color-text-color-text-overlay)]">
                {pcpCompanyProfile.tagline}
              </p>
              <p className="mt-xs flex max-w-[640px] flex-wrap items-center gap-x-xs gap-y-xxs text-body-sm text-[var(--figma-color-text-color-text-overlay)]">
                {companyMetadata.map((item, index) => (
                  <span key={item} className="inline-flex items-center gap-xs">
                    {index > 0 ? (
                      <span
                        aria-hidden="true"
                        className="text-body-xs text-[var(--figma-color-text-color-text-overlay)]"
                      >
                        &middot;
                      </span>
                    ) : null}
                    <span>{item}</span>
                  </span>
                ))}
              </p>
              <p className="mt-sm flex items-center gap-xs text-control-sm text-[var(--figma-color-text-color-text-overlay)]">
                <Icon name="globe-americas" size="small" />
                {pcpCompanyProfile.socialProof}
              </p>
              <div className="mt-lg flex flex-wrap gap-sm">
                <Button
                  className="!border-transparent !bg-[var(--figma-color-icon-color-icon-overlay)] !text-[var(--figma-color-label-color-label)] hover:!bg-[var(--figma-color-icon-color-icon-overlay-hover)] active:!bg-[var(--figma-color-background-color-background-knockout-active)]"
                  leadingIcon={<Icon name="add" />}
                  size="medium"
                  variant="tertiary"
                >
                  Follow
                </Button>
                <Button
                  className="!border-[var(--figma-color-border-color-border-knockout)] !bg-transparent !text-[var(--figma-color-label-color-label-knockout)] hover:!border-[var(--figma-color-border-color-border-knockout-hover)] hover:!bg-[var(--figma-color-background-color-background-transparent-overlay-hover)] active:!border-[var(--figma-color-border-color-border-knockout-active)] active:!bg-[var(--figma-color-background-color-background-transparent-overlay-active)] active:!text-[var(--figma-color-label-color-label-knockout-active)]"
                  leadingIcon={<Icon name="signal-ai" />}
                  onClick={() => onOpenVca("header")}
                  size="medium"
                  variant="tertiary"
                >
                  Ask Velora
                </Button>
                <Button
                  className="!border-[var(--figma-color-border-color-border-knockout)] !bg-transparent !text-[var(--figma-color-label-color-label-knockout)] hover:!border-[var(--figma-color-border-color-border-knockout-hover)] hover:!bg-[var(--figma-color-background-color-background-transparent-overlay-hover)] active:!border-[var(--figma-color-border-color-border-knockout-active)] active:!bg-[var(--figma-color-background-color-background-transparent-overlay-active)] active:!text-[var(--figma-color-label-color-label-knockout-active)]"
                  leadingIcon={<Icon name="calendar" />}
                  onClick={onBookCall}
                  size="medium"
                  variant="tertiary"
                >
                  {pcpCompanyProfile.ctaLabel}
                </Button>
                <ButtonIcon
                  className="[&>span]:!border-[var(--figma-color-border-color-border-knockout)] [&>span]:!bg-transparent [&>span]:!text-[var(--figma-color-icon-color-icon-overlay)]"
                  icon="overflow-web-ios"
                  label="More actions"
                  size="medium"
                  variant="tertiary"
                />
              </div>
            </div>

            <aside className="mb-xxl rounded-sm bg-white/0 p-lg text-[var(--figma-color-text-color-text-overlay)]">
              <Icon className="text-premium-brand" name="quote" size="medium" />
              <p className="mt-sm text-body-md-open">
                {pcpCompanyProfile.testimonial.quote}
              </p>
              <div className="mt-md flex items-center gap-sm">
                <Entity
                  label={pcpCompanyProfile.testimonial.author}
                  size={32}
                  src={pcpCompanyProfile.testimonial.avatarSrc}
                />
                <div>
                  <p className="text-control-md">
                    {pcpCompanyProfile.testimonial.author}
                  </p>
                  <p className="text-supportive-s text-[var(--figma-color-text-color-text-overlay-hover)]">
                    {pcpCompanyProfile.testimonial.role}
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <nav
            aria-label={`${pcpCompanyProfile.name} sections`}
            className="flex min-h-[49px] overflow-x-auto border-t border-white/15"
            role="tablist"
          >
            {pageTabs.map((tab) => (
              <TabItemHorizontal
                key={tab}
                label={tab}
                selected={tab === "Home"}
                tone="overlay"
              />
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

function Card({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return (
    <section
      className={cx(
        "overflow-hidden rounded-sm border border-border-faint bg-background",
        className,
      )}
    >
      {children}
    </section>
  );
}

function ModuleHeader({
  title,
  premium = false,
}: Readonly<{ title: string; premium?: boolean }>) {
  return (
    <div
      className={cx(
        "bg-background pb-0 pl-xxl pr-lg pt-xxl",
        premium && "flex flex-col gap-sm",
      )}
    >
      {premium ? (
        <div className="flex items-center gap-xxs text-body-xs text-text">
          <PremiumChipSmall className="size-3" />
          <span>Premium</span>
        </div>
      ) : null}
      <h2 className="text-heading-lg text-text">{title}</h2>
    </div>
  );
}

function ModuleFooter({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex justify-center border-t border-border-faint">
      {children}
    </div>
  );
}

function EntityPile({
  size = 24,
}: Readonly<{ size?: 24 | 32 | 40 }>) {
  return (
    <span className="flex shrink-0 items-center">
      {["avatar-1.png", "avatar-2.png", "beta-entity.png"].map((image, index) => (
        <Entity
          key={image}
          className={cx(index > 0 && "-ml-xs", "ring-2 ring-background")}
          label=""
          size={size}
          src={assetSrc(image)}
        />
      ))}
    </span>
  );
}

function ReactionPile() {
  return (
    <span className="flex items-center">
      {["bg-action", "bg-caution", "bg-positive"].map((color, index) => (
        <span
          key={color}
          className={cx(
            "inline-flex size-4 items-center justify-center rounded-round border border-background text-[8px] text-white",
            index > 0 && "-ml-xs",
            color,
          )}
        >
          <span className="size-1 rounded-round bg-current" />
        </span>
      ))}
    </span>
  );
}

function CarouselButton({ label }: Readonly<{ label: string }>) {
  return (
    <OverlayButtonIcon
      className="absolute right-xxl top-1/2 z-10 -translate-y-1/2 translate-x-1/2"
      color="white"
      icon="chevron-right"
      label={label}
      size="small"
    />
  );
}

function OverviewCard() {
  return (
    <Card>
      <ModuleHeader title="Overview" />
      <div className="flex flex-col gap-lg px-xxl pb-xl pt-lg">
        <div className="relative overflow-hidden">
          <p className="line-clamp-3 pr-stack text-body-sm-open text-text">
            {pcpCompanyProfile.name} helps growing B2B teams clarify what to
            build next, why it matters, and how to tell the story. The studio
            blends product strategy, UX research, and crisp executive narrative
            work for SaaS and professional-services clients.
          </p>
          <span className="absolute bottom-0 right-0 bg-background pl-xs text-body-sm text-text-meta">
            more
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-md px-xxl pb-lg">
        <h3 className="text-control-sm text-text">
          Highlights from {pcpCompanyProfile.name}
        </h3>
        <div className="grid gap-lg sm:grid-cols-2">
          {overviewHighlights.map((highlight) => (
            <article
              className="flex min-w-0 items-start gap-sm rounded-sm border border-border-faint p-lg"
              key={highlight.title}
            >
              <Entity
                label={highlight.title}
                shape="square"
                size={40}
                src={assetSrc(highlight.image)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-start gap-xs">
                  <p className="min-w-0 truncate text-control-sm text-text">
                    {highlight.title}
                  </p>
                  <Icon
                    className="mt-xxs text-icon"
                    name="link-external"
                    size="small"
                  />
                </div>
                <p className="text-supportive-s text-text-meta">
                  {highlight.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function FeaturedCard({
  onOpenVca,
}: Readonly<{ onOpenVca: (entryPoint: VcaEntryPoint) => void }>) {
  return (
    <Card>
      <ModuleHeader title="Featured" />
      <div className="px-xxl pb-xl pt-lg">
        <div className="relative overflow-hidden rounded-sm">
          <Image
            alt="Featured customer video"
            className="aspect-[16/9] w-full object-cover"
            height={410}
        src={assetSrc("hero-cover-1.png")}
            width={720}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <span className="absolute left-1/2 top-1/2 inline-flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-round bg-black/70 text-white">
            <Icon name="play" size="medium" />
          </span>
        </div>
        <p className="mt-sm flex items-center gap-xs text-supportive-s text-text-meta">
          <PremiumChipSmall />
          Featured with Premium Pages
        </p>
        <div className="mt-md grid gap-lg sm:grid-cols-2">
          <MiniContentCard
            image="media-2.png"
            title="Things go wrong. How you handle it is what customers remember."
            meta="9,430 - 115 comments"
          />
          <MiniContentCard
            image="video-2.png"
            title="How a mid-market SaaS team reframed onboarding around buyer intent."
            meta="12,430 - 713 comments"
          />
        </div>
        <ContextualVcaNudge
          body="Ask how these proof points map to your team's product strategy challenge."
          onClick={() => onOpenVca("featured")}
          title="Ask Velora about this"
        />
      </div>
    </Card>
  );
}

function MiniContentCard({
  image,
  title,
  meta,
}: Readonly<{ image: string; title: string; meta: string }>) {
  return (
    <article className="flex min-w-0 gap-md overflow-hidden rounded-sm border border-border-faint p-md">
      <Image
        alt=""
        className="size-[84px] shrink-0 rounded-xs object-cover"
        height={84}
        src={assetSrc(image)}
        width={84}
      />
      <div className="min-w-0">
        <p className="line-clamp-3 text-body-sm text-text">{title}</p>
        <p className="mt-sm text-supportive-s text-text-meta">{meta}</p>
      </div>
    </article>
  );
}

function PostCard({
  title,
  body,
  image,
  stats,
}: Readonly<{
  title: string;
  body: string;
  image: string;
  stats: string;
}>) {
  return (
    <article className="overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="p-md">
        <div className="flex items-start gap-sm">
          <Entity
            label={pcpCompanyProfile.name}
            shape="square"
            size={40}
            src={pcpCompanyProfile.logoSrc}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-control-sm text-text">
              {pcpCompanyProfile.name}
            </h3>
            <p className="text-supportive-s text-text-meta">
              {pcpCompanyProfile.followers}
            </p>
            <p className="text-supportive-s text-text-meta">11h</p>
          </div>
          <Icon className="text-text-meta" name="overflow-web-ios" size="medium" />
        </div>
        <p className="mt-md text-body-sm text-text">{title}</p>
        <p className="mt-xs line-clamp-3 text-body-xs text-text-meta">{body}</p>
      </div>
      <Image
        alt=""
        className="aspect-[16/9] w-full object-cover"
        height={272}
        src={assetSrc(image)}
        width={484}
      />
      <div className="flex items-center justify-between border-t border-border-faint px-md py-sm text-supportive-s text-text-meta">
        <span>{stats}</span>
        <span>1 comment</span>
      </div>
      <div className="grid grid-cols-4 border-t border-border-faint text-text-meta">
        {[
          ["thumbs-up-outline", "Like"],
          ["comment", "Comment"],
          ["repost", "Repost"],
          ["send", "Send"],
        ].map(([icon, label]) => (
          <button
            key={label}
            className="flex min-h-10 items-center justify-center gap-xs text-supportive-s hover:bg-background-transparent-hover"
            type="button"
          >
            <Icon name={icon as IconName} size="small" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </article>
  );
}

function ProductsCard({
  onOpenVca,
}: Readonly<{ onOpenVca: (entryPoint: VcaEntryPoint) => void }>) {
  return (
    <Card>
      <ModuleHeader title="Services" />
      <div className="relative px-xxl pb-lg pt-xxl">
        <div className="flex gap-lg overflow-hidden">
          {products.map((product) => (
            <article
              className="flex min-h-[444px] w-[min(361px,calc(100vw-80px))] shrink-0 flex-col overflow-hidden rounded-sm border border-border-faint"
              key={product.title}
            >
              {product.image ? (
                <Image
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                  height={226}
                  src={assetSrc(product.image)}
                  width={361}
                />
              ) : null}
              <div className="flex flex-1 flex-col gap-lg p-lg">
                <div>
                  <p className="text-heading-sm text-text">{product.title}</p>
                  <p className="mt-xs text-body-sm text-text-meta">
                    {product.type}
                  </p>
                </div>
                <div className="flex items-center gap-xs">
                  <EntityPile size={32} />
                  <p className="text-supportive-s text-text-meta">
                    Ask {pcpCompanyProfile.founderName} and 2 others about
                    this service
                  </p>
                </div>
                <p className="flex-1 text-body-sm text-text">{product.body}</p>
                <Button
                  className="w-full"
                  leadingIcon={<Icon name="add" />}
                  size="small"
                  variant="tertiary"
                >
                  View service
                </Button>
              </div>
            </article>
          ))}
        </div>
        <CarouselButton label="View more services" />
        <ContextualVcaNudge
          body="Compare engagement types before opening a service detail page."
          onClick={() => onOpenVca("services")}
          title="Find the right service"
        />
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function LeaderCard({
  leader,
}: Readonly<{ leader: (typeof leaders)[number] }>) {
  return (
    <article className="flex min-w-[160px] flex-1 flex-col items-center rounded-md border border-border-faint p-md text-center">
      <Entity
        label={leader.name}
        size={80}
        src={assetSrc(leader.image)}
      />
      <div className="mt-md min-h-[63px]">
        <p className="truncate text-control-md text-text">{leader.name}</p>
        <p className="mt-xxs text-body-sm text-text-meta">{leader.role}</p>
        <p className="mt-sm text-supportive-s text-text-meta">
          {leader.followers}
        </p>
      </div>
      <Button className="mt-md w-full" size="small" variant="tertiary">
        Follow
      </Button>
    </article>
  );
}

function LeaderPostCard({
  post,
}: Readonly<{ post: (typeof leaderPosts)[number] }>) {
  return (
    <article className="flex h-[324px] min-w-[236px] flex-1 flex-col overflow-hidden rounded-sm border border-border-faint">
      <div className="flex items-start gap-sm px-md py-md">
        <Entity
          label={post.author}
          size={32}
          src={assetSrc(post.avatar)}
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-xxs truncate text-control-sm text-text">
            {post.author}
            <PremiumMark tone="inbug" />
          </p>
          <p className="text-supportive-s text-text-meta">5d</p>
        </div>
        <Icon className="text-icon" name="overflow-web-ios" size="small" />
      </div>
      <p className="line-clamp-4 px-md text-body-sm text-text">{post.body}</p>
      {post.image ? (
        <Image
          alt=""
          className="mt-sm h-[96px] w-full object-cover"
          height={112}
          src={assetSrc(post.image)}
          width={240}
        />
      ) : null}
      {post.linkTitle ? (
        <div className="bg-background-neutral-soft p-md">
          <p className="line-clamp-2 text-control-sm text-text">
            {post.linkTitle}
          </p>
          <p className="text-supportive-s text-text-meta">{post.linkMeta}</p>
        </div>
      ) : null}
      <div className="mt-auto flex items-center gap-xs px-md py-sm text-supportive-s text-text-meta">
        <ReactionPile />
        <span>[X]</span>
        <span>[X] comments</span>
      </div>
      <div className="grid grid-cols-4 border-t border-border-faint px-xs">
        {[
          ["thumbs-up-outline", "Like"],
          ["comment", "Comment"],
          ["repost", "Repost"],
          ["send", "Send"],
        ].map(([icon, label]) => (
          <button
            key={label}
            aria-label={label}
            className="flex min-h-[48px] items-center justify-center text-icon hover:bg-background-transparent-hover"
            type="button"
          >
            <Icon name={icon as IconName} size="small" />
          </button>
        ))}
      </div>
    </article>
  );
}

function LeadersCard() {
  return (
    <Card>
      <ModuleHeader title="Meet the leaders" />
      <div className="px-xxl pb-lg pt-xxl">
        <div className="grid gap-lg sm:grid-cols-2 xl:grid-cols-4">
          {leaders.map((leader) => (
            <LeaderCard key={leader.name} leader={leader} />
          ))}
        </div>
        <h3 className="mt-xxxl text-control-md text-text">
          See what they are talking about
        </h3>
        <div className="relative mt-lg">
          <div className="flex gap-lg overflow-hidden">
            {leaderPosts.map((post) => (
              <LeaderPostCard key={post.author} post={post} />
            ))}
          </div>
          <CarouselButton label="View more leader posts" />
        </div>
        <p className="mt-md flex items-center gap-xs text-supportive-s text-text-meta">
          <PremiumChipSmall />
          Featured with Premium Pages
        </p>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all leaders
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function EventCard() {
  return (
    <Card>
      <ModuleHeader title="Event" />
      <div className="p-xxl">
        <article className="flex flex-col gap-lg rounded-sm border border-border-faint p-xxl sm:flex-row">
          <Image
            alt=""
            className="aspect-video min-w-0 flex-1 rounded-xs object-cover"
            height={220}
            src={assetSrc("event-launch.png")}
            width={360}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-lg">
            <div className="space-y-xs">
              <span className="inline-flex rounded-xs bg-tag-supportive-1-background px-sm py-xxs text-body-sm text-text">
                Upcoming
              </span>
              <p className="text-body-sm text-text-meta">
                Wed, 06/18/2025, 5:00 PM
              </p>
              <h3 className="text-control-md text-text">
                Live teardown: turning page visits into consult requests
              </h3>
              <p className="text-body-sm text-text">
                Hosted by {pcpCompanyProfile.name}
              </p>
              <p className="text-body-sm text-text-meta">
                Live Video &middot; 342 registrations
              </p>
            </div>
            <div className="flex items-center gap-sm">
              <Button size="small" variant="tertiary">
                View event
              </Button>
              <ButtonIcon
                icon="share-linked-in"
                label="Share event"
                size="small"
                variant="tertiary"
              />
            </div>
          </div>
        </article>
      </div>
    </Card>
  );
}

function JobLockup({ title }: Readonly<{ title: string }>) {
  return (
    <div className="flex min-w-[256px] flex-1 items-start gap-sm">
      <Entity
        label={pcpCompanyProfile.name}
        shape="square"
        size={40}
        src={pcpCompanyProfile.logoSrc}
      />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-xxs truncate text-control-md text-text">
          {title}
          <Icon className="shrink-0 text-icon" name="verified" size="small" />
        </p>
        <p className="text-supportive-s text-text">
          Remote &middot; U.S. West Coast
        </p>
      </div>
    </div>
  );
}

function RecentJobOpeningsCard() {
  return (
    <Card>
      <ModuleHeader title="Recent job openings" />
      <div className="flex flex-wrap gap-lg p-xxl">
        {mainJobOpenings.map((job) => (
          <JobLockup key={job} title={job} />
        ))}
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all 2 jobs
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function LifeAtVeloraCard() {
  return (
    <Card>
      <ModuleHeader title={`Life at ${pcpCompanyProfile.name}`} />
      <div className="grid gap-lg p-xxl sm:grid-cols-2">
        <Image
          alt=""
          className="aspect-video w-full rounded-xs object-cover"
          height={260}
          src={assetSrc("life-at-sierra.png")}
          width={460}
        />
        <div>
          <h3 className="text-control-md text-text">
            Small pods for focused product decisions
          </h3>
          <p className="mt-xs text-body-sm-open text-text">
            {pcpCompanyProfile.name} works in lightweight delivery pods across
            strategy, research, and design so client teams can move from fuzzy
            questions to practical decisions.
          </p>
          <p className="text-body-sm-open text-text">
            {pcpCompanyProfile.founderName} founded the studio for teams that
            need senior product thinking without adding a large agency layer.
          </p>
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function PremiumInsightsCard() {
  return (
    <Card>
      <ModuleHeader
        premium
        title={`Exclusive insights on ${pcpCompanyProfile.name}`}
      />
      <div className="grid gap-xxl p-xxl md:grid-cols-[300px_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h3 className="text-control-md text-text">Visitor interest trends</h3>
          <TrendGraph />
        </div>
        <div>
          <h3 className="text-control-md text-text">Consultation intent</h3>
          <div className="mt-md flex items-center gap-xs">
            <Icon className="rotate-180 text-positive" name="caret" size="small" />
            <p className="text-heading-xl text-text">18%</p>
          </div>
          <p className="text-supportive-s text-text-meta">CTA click lift</p>
          <p className="mt-md text-supportive-s text-text-meta">
            And more visitor-to-lead signals
          </p>
        </div>
        <div>
          <h3 className="text-control-md text-text">18 qualified visitors</h3>
          <div className="mt-lg flex items-center">
            <EntityPile size={40} />
            <span className="-ml-xs inline-flex size-10 items-center justify-center rounded-round border border-border-faint bg-background text-body-sm text-text-meta">
              +9
            </span>
          </div>
          <p className="mt-lg text-supportive-s text-text-meta">
            Including product and marketing leaders from target accounts
          </p>
        </div>
      </div>
      <ModuleFooter>
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          Show all Premium insights
        </GhostButton>
      </ModuleFooter>
    </Card>
  );
}

function NewslettersCard() {
  return (
    <Card>
      <ModuleHeader title="Newsletters" />
      <div className="relative p-xxl">
        <div className="flex gap-lg overflow-hidden">
          {newsletters.map((newsletter) => (
            <article
              className="flex min-h-[197px] w-[min(362px,calc(100vw-80px))] shrink-0 flex-col justify-between rounded-sm border border-border-faint p-lg"
              key={newsletter.title}
            >
              <div>
                <div className="flex items-center gap-sm">
                  <Entity
                    label={newsletter.title}
                    shape="square"
                    size={48}
                    src={pcpCompanyProfile.logoSrc}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-control-md text-text">
                      {newsletter.title}
                    </p>
                    <p className="text-supportive-s text-text-meta">
                      {newsletter.meta}
                    </p>
                  </div>
                </div>
                <p className="mt-lg line-clamp-3 text-body-sm-open text-text">
                  {newsletter.body}
                </p>
              </div>
              <Button
                className="mt-lg self-start"
                leadingIcon={<Icon name="add" />}
                size="small"
                variant="tertiary"
              >
                Subscribe
              </Button>
            </article>
          ))}
        </div>
        <CarouselButton label="View more newsletters" />
      </div>
    </Card>
  );
}

function TrendGraph() {
  return (
    <div className="mt-md h-24 w-full text-text-meta">
      <svg
        aria-hidden="true"
        className="h-full w-full"
        focusable="false"
        viewBox="0 0 300 96"
      >
        <line
          stroke="currentColor"
          strokeDasharray="2 3"
          strokeOpacity="0.25"
          x1="0"
          x2="300"
          y1="18"
          y2="18"
        />
        <line
          stroke="currentColor"
          strokeOpacity="0.25"
          x1="0"
          x2="300"
          y1="62"
          y2="62"
        />
        <polyline
          fill="none"
          points="0,48 48,36 96,32 144,20 192,30 240,14 300,26"
          stroke="var(--figma-color-positive-color-positive)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <text fill="currentColor" fontSize="12" x="8" y="88">
          Apr 2024
        </text>
        <text fill="currentColor" fontSize="12" x="124" y="88">
          Oct 2024
        </text>
        <text fill="currentColor" fontSize="12" x="232" y="88">
          Apr 2025
        </text>
      </svg>
    </div>
  );
}

function MemberFooter() {
  return (
    <footer className="bg-background-neutral-soft px-xxl py-xxl text-text-meta">
      <div className="grid gap-xxl lg:grid-cols-[minmax(0,1fr)_minmax(260px,1fr)]">
        <div className="grid gap-xxl sm:grid-cols-3">
          {footerLinkColumns.map((column) => (
            <ul key={column.join("-")}>
              {column.map((item) => (
                <li key={item}>
                  <a className="block py-sm text-supportive-s-strong" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="grid gap-xxl sm:grid-cols-[minmax(0,1fr)_minmax(180px,1fr)]">
          <div className="space-y-sm">
            {[
              ["question", "Questions?", "Visit our Help Center."],
              ["settings", "Manage your account and privacy", "Go to your Settings."],
              [
                "shield",
                "Recommendation transparency",
                "Learn more about Recommended Content.",
              ],
            ].map(([icon, title, body]) => (
              <div className="flex gap-sm py-sm" key={title}>
                <Icon name={icon as IconName} size="small" />
                <div>
                  <p className="text-supportive-s-strong">{title}</p>
                  <p className="mt-xxs text-supportive-s">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <label className="block text-body-sm text-text-meta">
            Select Language
            <span className="mt-xxs flex h-8 items-center rounded-xs border border-text-meta bg-background pl-sm text-control-sm">
              English (English)
              <Icon className="ml-auto mr-xs" name="caret" size="small" />
            </span>
          </label>
        </div>
      </div>
      <p className="py-lg text-supportive-s">
        LinkedIn Corporation &copy; 2026
      </p>
    </footer>
  );
}

function PromotedCard() {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border-faint p-md">
        <p className="text-supportive-s text-text-meta">Promoted</p>
        <Icon name="overflow-web-ios" size="small" />
      </div>
      <div className="space-y-lg p-md">
        {sideJobs.slice(0, 3).map((job) => (
          <div key={job} className="flex gap-sm">
            <Entity
              label={pcpCompanyProfile.name}
              shape="square"
              size={32}
              src={pcpCompanyProfile.logoSrc}
            />
            <div>
              <p className="text-control-sm text-text">{job}</p>
              <p className="text-supportive-s text-text-meta">
                Remote &middot; U.S. West Coast
              </p>
            </div>
          </div>
        ))}
        <Button className="w-full" size="small" variant="tertiary">
          See more roles
        </Button>
      </div>
    </Card>
  );
}

function SideListCard({
  title,
  items,
  actionLabel,
  type = "page",
}: Readonly<{
  title: string;
  items: Array<string>;
  actionLabel: string;
  type?: "page" | "role";
}>) {
  return (
    <Card>
      <div className="p-lg">
        <h2 className="text-heading-sm text-text">{title}</h2>
        <div className="mt-md space-y-lg">
          {items.map((item) => (
            <div key={item} className="flex items-start gap-sm">
              <Entity
                label={item}
                shape="square"
                size={40}
                src={pcpCompanyProfile.logoSrc}
              />
              <div className="min-w-0 flex-1">
                <p className="text-control-sm text-text">{item}</p>
                <p className="text-supportive-s text-text-meta">
                  {type === "role"
                    ? "Remote - U.S. West Coast"
                    : "Business Consulting and Services"}
                </p>
                <Button className="mt-sm" size="small" variant="tertiary">
                  {type === "role" ? "View role" : "Follow"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center border-t border-border-faint">
        <GhostButton icon="arrow-right" iconAtEnd size="small">
          {actionLabel}
        </GhostButton>
      </div>
    </Card>
  );
}

export function PremiumCompanyPagesMemberPage({
  shellMode = "drawer",
}: Readonly<{ shellMode?: VcaShellMode }>) {
  const vcaPanelId = useId();
  const isHybridShell = shellMode === "hybrid";
  const [isVcaOpen, setIsVcaOpen] = useState(false);
  const [isHybridTrayVisible, setIsHybridTrayVisible] = useState(false);
  const [vcaPanelVariant, setVcaPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [vcaEntryPoint, setVcaEntryPoint] =
    useState<VcaEntryPoint>("header");
  const [vcaConversationStage, setVcaConversationStage] =
    useState<VcaConversationStage>("opening");
  const [vcaSelectedStarterPrompt, setVcaSelectedStarterPrompt] =
    useState<string | null>(null);
  const [vcaSelectedFollowUpPrompt, setVcaSelectedFollowUpPrompt] =
    useState<string | null>(null);
  const [vcaQualifiedAnswer, setVcaQualifiedAnswer] = useState("");
  const [vcaBookedMeeting, setVcaBookedMeeting] =
    useState<VcaBookedMeeting | null>(null);
  const [isVcaSchedulePanelOpen, setIsVcaSchedulePanelOpen] = useState(false);
  const [vcaDraft, setVcaDraft] = useState("");
  const vcaHybridPanelPositionClass = isVcaSchedulePanelOpen
    ? vcaPanelVariant === "expanded"
      ? "md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(calc(100dvh_-_96px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-side-panel-expanded-surface-width))] md:-translate-x-1/2 md:-translate-y-1/2"
      : "md:inset-auto md:bottom-0 md:right-6 md:h-[min(calc(100dvh_-_72px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-side-panel-collapsed-surface-width))]"
    : vcaPanelVariant === "expanded"
      ? "md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(calc(100dvh_-_96px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2"
      : "md:inset-auto md:bottom-0 md:right-6 md:h-[min(calc(100dvh_-_72px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]";

  function resetVcaConversation() {
    setVcaConversationStage("opening");
    setVcaSelectedStarterPrompt(null);
    setVcaSelectedFollowUpPrompt(null);
    setVcaQualifiedAnswer("");
    setVcaBookedMeeting(null);
    setIsVcaSchedulePanelOpen(false);
    setVcaDraft("");
  }

  function handleOpenVca(entryPoint: VcaEntryPoint) {
    setVcaEntryPoint(entryPoint);
    setVcaPanelVariant("collapsed");
    resetVcaConversation();

    if (entryPoint === "services") {
      setVcaConversationStage("servicesPricing");
      setVcaSelectedStarterPrompt(VCA_SERVICES_PROMPT);
    }

    if (entryPoint === "featured") {
      setVcaConversationStage("postProof");
      setVcaSelectedStarterPrompt(VCA_FEATURED_CONTEXT_PROMPT);
    }

    setIsHybridTrayVisible(false);
    setIsVcaOpen(true);
  }

  function handleOpenVcaBooking(entryPoint: VcaEntryPoint) {
    setVcaEntryPoint(entryPoint);
    setVcaPanelVariant("collapsed");
    setVcaConversationStage("booking");
    setVcaSelectedStarterPrompt(VCA_BOOK_PROMPT);
    setVcaSelectedFollowUpPrompt(null);
    setVcaQualifiedAnswer("");
    setVcaBookedMeeting(null);
    setIsVcaSchedulePanelOpen(true);
    setVcaDraft("");
    setIsHybridTrayVisible(false);
    setIsVcaOpen(true);
  }

  function handleCloseVca() {
    setIsVcaOpen(false);
    setIsHybridTrayVisible(false);
    setVcaPanelVariant("collapsed");
    resetVcaConversation();
  }

  function handleOpenVcaFromTray() {
    setVcaPanelVariant("collapsed");
    setIsHybridTrayVisible(false);
    setIsVcaOpen(true);
  }

  function handleExpandVcaFromTray() {
    setVcaPanelVariant("expanded");
    setIsHybridTrayVisible(false);
    setIsVcaOpen(true);
  }

  function handleMinimizeVcaToTray() {
    setIsVcaOpen(false);
    setVcaPanelVariant("collapsed");
    setIsVcaSchedulePanelOpen(false);
    setIsHybridTrayVisible(true);
  }

  function handleToggleVcaPanelVariant() {
    setVcaPanelVariant((currentVariant) =>
      currentVariant === "expanded" ? "collapsed" : "expanded",
    );
  }

  function handleVcaDraftChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setVcaDraft(event.currentTarget.value);
  }

  function handleOpenVcaSchedulePanel() {
    setIsVcaSchedulePanelOpen(true);
  }

  function handleBackToVcaChat() {
    setIsVcaSchedulePanelOpen(false);
  }

  function handleBookVcaMeeting(meeting: VcaBookedMeeting) {
    setVcaBookedMeeting(meeting);
    setIsVcaSchedulePanelOpen(false);
  }

  function handleVcaPromptSelect(prompt: string) {
    setVcaDraft("");

    if (prompt === VCA_BOOK_PROMPT) {
      if (vcaConversationStage === "postProof") {
        setVcaSelectedFollowUpPrompt(prompt);
      } else {
        setVcaSelectedStarterPrompt(prompt);
        setVcaSelectedFollowUpPrompt(null);
      }

      setVcaConversationStage("booking");
      handleOpenVcaSchedulePanel();
      return;
    }

    if (
      prompt === VCA_POST_PROOF_PRICING_PROMPT ||
      prompt === VCA_POST_PROOF_DIFFERENTIATION_PROMPT
    ) {
      setVcaSelectedFollowUpPrompt(prompt);
      setVcaConversationStage("objectionHandling");
      return;
    }

    setVcaSelectedStarterPrompt(prompt);
    setVcaSelectedFollowUpPrompt(null);

    if (prompt === VCA_SERVICES_PROMPT) {
      setVcaConversationStage("servicesPricing");
      return;
    }

    setVcaConversationStage("qualifying");
  }

  function handleVcaSend() {
    const trimmedDraft = vcaDraft.trim();

    if (!trimmedDraft) {
      return;
    }

    if (vcaConversationStage === "opening") {
      setVcaSelectedStarterPrompt(trimmedDraft);
      setVcaSelectedFollowUpPrompt(null);
      setVcaConversationStage("qualifying");
      setVcaDraft("");
      return;
    }

    if (vcaConversationStage === "qualifying") {
      setVcaQualifiedAnswer(trimmedDraft);
      setVcaSelectedFollowUpPrompt(null);
      setVcaConversationStage("postProof");
      setVcaDraft("");
      return;
    }

    if (vcaConversationStage === "postProof") {
      setVcaSelectedFollowUpPrompt(trimmedDraft);
      setVcaConversationStage("objectionHandling");
      setVcaDraft("");
      return;
    }

    setVcaDraft("");
  }

  return (
    <main className="min-h-dvh bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation
        profileSrc={pcpCompanyProfile.founderAvatarSrc}
        showAdvertise
      />
      <Hero
        onBookCall={() => handleOpenVcaBooking("header")}
        onOpenVca={handleOpenVca}
      />
      <AskVeloraAnchor
        isVisible={!isVcaOpen && !(isHybridShell && isHybridTrayVisible)}
        onOpen={() => handleOpenVca("anchor")}
      />

      {isHybridShell && isHybridTrayVisible ? (
        <ChatTray
          aria-controls={vcaPanelId}
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-label={`Open ${pcpCompanyProfile.name} assistant`}
          className="fixed bottom-0 left-4 right-4 z-40 mx-auto w-[calc(100vw_-_32px)] max-w-[var(--design-layout-panel-collapsed-width)] md:left-auto md:right-6 md:mx-0 md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
          identity={{
            type: "ai",
            title: pcpCompanyProfile.name,
            icon: <VeloraVcaLogoMark />,
          }}
          onClose={handleCloseVca}
          onOpen={handleOpenVcaFromTray}
          onVariantToggle={handleExpandVcaFromTray}
          showCloseAction
          variant="collapsed"
        />
      ) : null}

      {isVcaOpen && shellMode !== "hybrid" ? (
        <div
          id={vcaPanelId}
          role="dialog"
          aria-label={`${pcpCompanyProfile.name} assistant`}
          className={cx(
            "fixed inset-0 z-40",
            shellMode === "rail" && "lg:hidden",
          )}
        >
          <button
            aria-label={`Close ${pcpCompanyProfile.name} assistant`}
            className="absolute inset-0 bg-black/35"
            onClick={handleCloseVca}
            type="button"
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-[440px]">
            <PremiumCompanyPagesVcaPanel
              bookedMeeting={vcaBookedMeeting}
              conversationStage={vcaConversationStage}
              draft={vcaDraft}
              entryPoint={vcaEntryPoint}
              isSchedulePanelOpen={isVcaSchedulePanelOpen}
              onBackToChat={handleBackToVcaChat}
              onBookMeeting={handleBookVcaMeeting}
              onClose={handleCloseVca}
              onDraftChange={handleVcaDraftChange}
              onOpenSchedulePanel={handleOpenVcaSchedulePanel}
              onPromptSelect={handleVcaPromptSelect}
              onSend={handleVcaSend}
              qualifiedAnswer={vcaQualifiedAnswer}
              selectedFollowUpPrompt={vcaSelectedFollowUpPrompt}
              selectedStarterPrompt={vcaSelectedStarterPrompt}
              shellMode="drawer"
              variant="collapsed"
            />
          </div>
        </div>
      ) : null}

      {isHybridShell && isVcaOpen ? (
        <>
          <button
            aria-label={`Collapse expanded ${pcpCompanyProfile.name} assistant`}
            className={cx(
              "fixed inset-0 z-30 hidden bg-overlay-dim md:block",
              vcaPanelVariant !== "expanded" &&
                "pointer-events-none opacity-0",
            )}
            onClick={() => setVcaPanelVariant("collapsed")}
            type="button"
          />
          <div
            id={vcaPanelId}
            role="dialog"
            aria-label={`${pcpCompanyProfile.name} assistant`}
            className={cx(
              "fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform] duration-[var(--design-motion-duration-slow)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)]",
              vcaHybridPanelPositionClass,
            )}
          >
            <PremiumCompanyPagesVcaPanel
              bookedMeeting={vcaBookedMeeting}
              conversationStage={vcaConversationStage}
              draft={vcaDraft}
              entryPoint={vcaEntryPoint}
              isSchedulePanelOpen={isVcaSchedulePanelOpen}
              onBackToChat={handleBackToVcaChat}
              onBookMeeting={handleBookVcaMeeting}
              onClose={handleCloseVca}
              onDraftChange={handleVcaDraftChange}
              onMinimizeToTray={handleMinimizeVcaToTray}
              onOpenSchedulePanel={handleOpenVcaSchedulePanel}
              onVariantToggle={handleToggleVcaPanelVariant}
              onPromptSelect={handleVcaPromptSelect}
              onSend={handleVcaSend}
              qualifiedAnswer={vcaQualifiedAnswer}
              selectedFollowUpPrompt={vcaSelectedFollowUpPrompt}
              selectedStarterPrompt={vcaSelectedStarterPrompt}
              shellMode="hybrid"
              variant={vcaPanelVariant}
            />
          </div>
        </>
      ) : null}

      <div className="mx-auto grid max-w-[1128px] gap-xxl px-lg py-md lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-md">
          <OverviewCard />
          <FeaturedCard onOpenVca={handleOpenVca} />
          <Card>
            <ModuleHeader title="Posts" />
            <div className="px-xxl pb-xl pt-lg">
              <div className="grid gap-lg md:grid-cols-2">
                {posts.map((post) => (
                  <PostCard key={post.title} {...post} />
                ))}
              </div>
            </div>
            <ModuleFooter>
              <GhostButton icon="arrow-right" iconAtEnd size="small">
                Show all posts
              </GhostButton>
            </ModuleFooter>
          </Card>
          <ProductsCard onOpenVca={handleOpenVca} />
          <LeadersCard />
          <EventCard />
          <RecentJobOpeningsCard />
          <LifeAtVeloraCard />
          <PremiumInsightsCard />
          <NewslettersCard />
          <MemberFooter />
        </div>

        <aside className="space-y-md">
          {shellMode === "rail" && isVcaOpen ? (
            <div className="sticky top-20 hidden h-[calc(100dvh-96px)] lg:block">
              <PremiumCompanyPagesVcaPanel
                bookedMeeting={vcaBookedMeeting}
                conversationStage={vcaConversationStage}
                draft={vcaDraft}
                entryPoint={vcaEntryPoint}
                isSchedulePanelOpen={isVcaSchedulePanelOpen}
                onBackToChat={handleBackToVcaChat}
                onBookMeeting={handleBookVcaMeeting}
                onClose={handleCloseVca}
                onDraftChange={handleVcaDraftChange}
                onOpenSchedulePanel={handleOpenVcaSchedulePanel}
                onPromptSelect={handleVcaPromptSelect}
                onSend={handleVcaSend}
                qualifiedAnswer={vcaQualifiedAnswer}
                selectedFollowUpPrompt={vcaSelectedFollowUpPrompt}
                selectedStarterPrompt={vcaSelectedStarterPrompt}
                shellMode="rail"
                variant="collapsed"
              />
            </div>
          ) : (
            <>
              <PromotedCard />
              <SideListCard
                actionLabel="Show all"
                items={affiliatedPages}
                title="Affiliated pages"
              />
              <SideListCard
                actionLabel="Show more"
                items={sideJobs}
                title="Recent job openings"
                type="role"
              />
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
