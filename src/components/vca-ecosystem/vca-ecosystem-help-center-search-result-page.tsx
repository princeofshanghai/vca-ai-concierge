import Image from "next/image";
import type { ReactNode } from "react";

import { PremiumUpsellResultCard } from "@/components/premium-upsell";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";
import { Radio } from "@/components/primitives/radio";

const PREMIUM_UPSELL_SURVEY_HREF =
  "/premium-upsell-help-center/survey?upmSignal=low";

const filterOptions = [
  "LinkedIn",
  "Billing",
  "Learning",
  "Marketing Solutions",
  "Recruiter",
  "Sales Navigator",
  "Talent Insights",
] as const;

const searchResults = [
  {
    title: "Send an InMail Message",
    tone: "visited",
    body: "Send an InMail Message InMail messages allows you to directly message another LinkedIn member that you're not connected to. You can send an InMail message to a LinkedIn member from the introduction section on their profile or by sending a new...",
  },
  {
    title: "InMail Messages",
    tone: "default",
    body: "InMail Messages FEATURE_LAUNCHER Send Smart Messages with AI Use LinkedIn's AI-powered messaging assistant to connect with your network effortlessly. InMail messages is a premium feature, and it allows you to...",
  },
  {
    title: "Send messages on LinkedIn",
    tone: "default",
    body: "Send messages on LinkedIn On LinkedIn, you can message your 1st-degree connections or LinkedIn Pages for free. You may be able to message other members that you aren't connected to if they are Premium members who've enabled Open Profile...",
  },
  {
    title: "InMail Messages FAQ",
    tone: "default",
    body: "InMail Messages FAQ InMail messages allows you to directly message another LinkedIn member that you're not connected to. Here are some frequently asked questions about InMail messages. How many InMail messages do I receive per month? The amount of...",
  },
  {
    title: "Send messages to connections on LinkedIn Messaging",
    tone: "default",
    body: "Send messages to connections on LinkedIn Messaging You can send a message to your connections from LinkedIn Messaging page, conversation window, connections page, or their profile. Messages appear in their inbox and may also be sent to their email...",
  },
  {
    title: "Troubleshoot message sending issues on LinkedIn",
    tone: "default",
    body: "Troubleshoot message sending issues on LinkedIn If you can't send messages on LinkedIn, try these troubleshooting steps. After each step, try sending the message again to see if the issue is resolved. This can also help to identify the cause...",
  },
  {
    title: "Searching for Sent and Received Messages",
    tone: "default",
    body: "Searching for Sent and Received Messages You can search for sent and received messages on LinkedIn using filters or keywords. Though LinkedIn does not have a sent folder, sent messages can be found within an existing conversation thread in LinkedIn...",
  },
  {
    title: "Send an Open Profile message on LinkedIn",
    tone: "default",
    body: "Send an Open Profile message on LinkedIn WARNING Important to know The Open Profile Premium feature allows members to contact a Premium member for free. However, in an effort to keep LinkedIn safe and professional, we limit the number of Open...",
  },
  {
    title: "InMail with Hiring Pro",
    tone: "default",
    body: "InMail with Hiring Pro InMail with Hiring Pro is an AI-powered outreach messaging feature, available exclusively for promoted jobs. It helps you invite qualified candidates to apply by generating a draft of a personalized InMail message based on the...",
  },
  {
    title: "Types of restrictions for sending invitations",
    tone: "default",
    body: "Types of restrictions for sending invitations LinkedIn limits the number of invitations you can send to protect the member experience and ensure that requests are relevant. If you exceed these limits or use prohibited tools, your account may be...",
  },
] as const;

export function HelpSearchHeader() {
  return (
    <header className="bg-[#0073B1] text-on-action">
      <div className="mx-auto flex min-h-[80px] max-w-[1288px] flex-col gap-md px-lg py-md sm:px-[30px] md:grid md:grid-cols-[174px_minmax(0,844px)_minmax(32px,1fr)] md:items-center md:gap-[34px] md:py-0 xl:px-0">
        <div className="flex items-center gap-md">
          <Image
            src="/assets/linkedin-bug.svg"
            alt="LinkedIn"
            width={34}
            height={34}
            priority
            className="size-[34px] shrink-0"
          />
          <span className="text-[24px] font-semibold leading-[30px] tracking-normal">
            Help
          </span>
        </div>

        <div
          role="search"
          aria-label="Help center search"
          className="grid min-h-[42px] overflow-hidden rounded-xs bg-background text-text shadow-sm sm:grid-cols-[130px_minmax(0,1fr)_42px_42px]"
        >
          <div className="flex items-center justify-between gap-md border-b border-border-faint px-md text-[16px] font-semibold leading-[22px] text-text-meta sm:border-b-0 sm:border-r">
            <span>LinkedIn</span>
            <Icon name="caret-down" size="small" className="text-icon" />
          </div>
          <div className="flex min-h-[42px] items-center px-md text-[16px] font-normal leading-[22px] text-text">
            how to send inmail
          </div>
          <div className="hidden items-center justify-center border-l border-border-faint text-icon sm:flex">
            <Icon name="clear" size="small" />
          </div>
          <div className="hidden items-center justify-center border-l border-border-faint text-icon sm:flex">
            <Icon name="search" size="medium" className="[&&]:size-5" />
          </div>
        </div>

        <div className="hidden justify-self-end md:block">
          <Entity
            size={32}
            src="/assets/premium-company-pages/avatar-2.png"
            label="Charles"
          />
        </div>
      </div>
    </header>
  );
}

export function SearchFilters() {
  return (
    <aside
      aria-labelledby="help-search-filters-title"
      className="shrink-0 lg:w-[250px]"
    >
      <h2
        id="help-search-filters-title"
        className="text-[18px] font-semibold leading-[24px] tracking-normal text-text"
      >
        Filter results:
      </h2>
      <div
        role="radiogroup"
        aria-labelledby="help-search-filters-title"
        className="mt-md flex flex-col gap-sm"
      >
        {filterOptions.map((option) => {
          const isSelected = option === "LinkedIn";

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className="flex min-h-7 w-fit items-center gap-sm rounded-xs text-left text-body-sm text-text outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
            >
              <Radio checked={isSelected} aria-hidden="true" />
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled
        className="mt-[24px] h-9 rounded-xs border border-[#A8D4F0] px-md text-[16px] font-semibold leading-[20px] text-[#A8D4F0]"
      >
        Apply
      </button>
    </aside>
  );
}

function DefaultSearchResultUpsell() {
  return (
    <PremiumUpsellResultCard
      title="Message people outside your network with Premium"
      body={
        <p>
          Premium Career includes InMail credits, so you can reach hiring
          managers and people you&apos;re not connected to. You can also get
          help drafting a message before you send.
        </p>
      }
      primaryAction={{
        href: PREMIUM_UPSELL_SURVEY_HREF,
        label: "Start free trial",
      }}
      secondaryAction={{
        href: "/premium/learn-more",
        label: "Compare Premium plans",
      }}
    />
  );
}

export function SearchResultList({
  topContent = <DefaultSearchResultUpsell />,
}: Readonly<{
  topContent?: ReactNode;
}>) {
  return (
    <section aria-label="Search results" className="min-w-0">
      {topContent}
      <div className="mt-[30px]">
        <h2 className="text-heading-sm text-text">Search results</h2>
      </div>
      <div className="mt-md flex flex-col gap-[26px]">
        {searchResults.map((result) => (
          <article key={result.title}>
            <h2
              className={[
                "text-heading-md",
                result.tone === "visited" ? "text-[#6E5BD8]" : "text-[#0073B1]",
              ].join(" ")}
            >
              {result.title}
            </h2>
            <p className="mt-xxs text-body-sm text-text">
              {result.body}
            </p>
          </article>
        ))}
      </div>
      <nav aria-label="Search result pages" className="mt-[28px] flex gap-sm">
        <span className="inline-flex size-9 items-center justify-center rounded-xs bg-[#0073B1] text-[16px] font-semibold text-on-action">
          1
        </span>
        <span className="inline-flex size-9 items-center justify-center rounded-xs border border-border text-[16px] font-semibold text-text-meta">
          2
        </span>
        <span className="inline-flex h-9 items-center justify-center px-xs text-[16px] font-semibold text-text-meta">
          ...
        </span>
        <span className="inline-flex h-9 items-center justify-center rounded-xs border border-border px-md text-[16px] font-semibold text-text-meta">
          Next
        </span>
      </nav>
    </section>
  );
}

export function SearchFooter() {
  return (
    <footer className="border-t border-border-faint bg-background">
      <div className="mx-auto flex max-w-[1210px] flex-col gap-md px-lg py-lg text-[13px] font-semibold leading-[18px] tracking-normal text-text sm:px-[30px] lg:flex-row lg:items-center lg:justify-between xl:px-0">
        <div className="flex flex-wrap items-center gap-lg">
          <span className="inline-flex items-center gap-xxs">
            Linked
            <Image
              src="/assets/linkedin-bug.svg"
              alt="in"
              width={15}
              height={15}
              className="size-[15px]"
            />
          </span>
          <span>Contact us</span>
          <span>Start chat</span>
        </div>
        <button
          type="button"
          className="flex h-9 w-full max-w-[240px] items-center justify-between rounded-xs border border-border px-md text-left text-[14px] font-normal leading-[18px] text-text"
        >
          English (English)
          <Icon name="caret-down" size="small" className="text-icon" />
        </button>
      </div>
      <div className="bg-background-neutral-soft">
        <div className="mx-auto flex max-w-[1210px] flex-wrap gap-x-[24px] gap-y-sm px-lg py-md text-[13px] font-normal leading-[18px] tracking-normal text-text-meta sm:px-[30px] xl:px-0">
          <span>LinkedIn Corporation © 2026</span>
          <span>About</span>
          <span>Transparency Center</span>
          <span>Privacy and Terms</span>
        </div>
      </div>
    </footer>
  );
}

export function VcaEcosystemHelpCenterSearchResultPage() {
  return (
    <HelpCenterSearchResultsShell />
  );
}

export function HelpCenterSearchResultsShell({
  topContent,
}: Readonly<{
  topContent?: ReactNode;
}> = {}) {
  return (
    <main className="min-h-dvh bg-background text-text">
      <HelpSearchHeader />
      <div className="mx-auto grid max-w-[1288px] grid-cols-1 gap-[34px] px-lg py-[34px] sm:px-[30px] lg:grid-cols-[174px_minmax(0,895px)] lg:items-start xl:px-0">
        <SearchFilters />
        <SearchResultList topContent={topContent} />
      </div>
      <SearchFooter />
    </main>
  );
}
