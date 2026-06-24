"use client";

import { useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatMessageContent,
  ChatPanel,
  ChatThread,
  startClassedViewTransition,
  type ChatPanelVariant,
} from "@/components/chat";
import {
  LinkedInGlobalNavigation,
  type LinkedInGlobalNavigationItem,
} from "@/components/global-navigation";
import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";

const JOB_TITLE = "Testing <Test Job Visible to LinkedIn Employees Only>";

const onlineJobsNavItems: ReadonlyArray<LinkedInGlobalNavigationItem> = [
  { label: "Home", icon: "navigation-home" },
  { label: "My Network", icon: "navigation-people" },
  { label: "Jobs", icon: "navigation-job-active", active: true },
  { label: "Messaging", icon: "navigation-messages" },
  { label: "Notifications", icon: "navigation-bell-fill" },
];

const onlineJobsProfile = {
  name: "Charles Hu",
  headline: "Staff Product Designer at LinkedIn",
} as const;

const tabs = [
  { label: "Hiring plan", active: true },
  { label: "Candidate search", active: false },
  { label: "Applicants (0)", active: false },
] as const;
const inboxThreads = [
  {
    id: "support",
    name: "LinkedIn Support",
    detail: "We can help with your job post or account setup.",
    time: "Now",
    unread: true,
  },
  {
    id: "recruiter",
    name: "Recruiter Team",
    detail: "Your job is active and ready to receive applicants.",
    time: "1h",
  },
  {
    id: "jobs",
    name: "Jobs updates",
    detail: "Candidate recommendations are ready for review.",
    time: "Tue",
  },
] as const;

type JobPlanCardData = Readonly<{
  actionLabel: string;
  description: string;
  metric?: {
    label: string;
    value: string;
  };
  status: string;
  statusTone: "positive" | "action" | "caution" | "muted";
  title: string;
  trailingIcon?: IconName;
  variant?: "secondary" | "tertiary";
}>;

const jobPlanCards: ReadonlyArray<JobPlanCardData> = [
  {
    actionLabel: "Edit job post",
    description:
      "You are using these qualifications to find and review applicants.",
    metric: {
      label: "Views",
      value: "0",
    },
    status: "Completed",
    statusTone: "positive",
    title: "Post job",
  },
  {
    actionLabel: "View sourced candidates",
    description:
      "Your free job includes previews of 25 recommended candidates. To invite up to 350 qualified candidates and send InMail messages, promote your job.",
    status: "Ready for review",
    statusTone: "action",
    title: "Find candidates",
    trailingIcon: "locked",
  },
  {
    actionLabel: "Review",
    description:
      "This job can receive 35 applicants for free before it is paused. To receive more applicants, promote your job.",
    metric: {
      label: "Total",
      value: "0",
    },
    status: "In progress",
    statusTone: "caution",
    title: "Review applicants",
  },
  {
    actionLabel: "Try a demo",
    description:
      "Save time by inviting top applicants to complete an AI interview. To get access to this feature, promote your job.",
    status: "Not started",
    statusTone: "muted",
    title: "Screen shortlisted applicants through an AI interview",
    trailingIcon: "locked",
    variant: "tertiary",
  },
];

const statusToneClassNames: Record<JobPlanCardData["statusTone"], string> = {
  action: "text-action",
  caution: "text-caution",
  muted: "text-text-meta",
  positive: "text-positive",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function InlineActionText({ children }: Readonly<{ children: string }>) {
  return <span className="text-action">{children}</span>;
}

function CompanyPlaceholderLogo() {
  return (
    <span
      aria-label="GSOBA"
      className="relative inline-flex size-12 shrink-0 overflow-hidden bg-[#EAE6DF]"
      role="img"
    >
      <span className="absolute bottom-0 left-2 h-[18px] w-[10px] bg-[#788FA5]" />
      <span className="absolute bottom-0 left-[20px] h-[40px] w-[18px] bg-[#C8D6E2]" />
      <span className="absolute bottom-0 left-[22px] h-[18px] w-[10px] bg-[#56687A]" />
      <span className="absolute bottom-0 left-[40px] h-12 w-2 bg-[#D9D4CC]" />
    </span>
  );
}

function JobSubToolbar() {
  return (
    <section className="border-b border-border-faint bg-background">
      <div className="mx-auto flex h-20 w-full max-w-[1128px] flex-col justify-center px-lg xl:px-0">
        <h1 className="truncate text-[16px] font-semibold leading-[20px] tracking-normal text-text">
          {JOB_TITLE}
        </h1>
        <nav aria-label="Job navigation" className="mt-md flex min-w-0 gap-xl">
          {tabs.map((tab) => (
            <span
              aria-current={tab.active ? "page" : undefined}
              className={cx(
                "relative inline-flex h-8 shrink-0 items-start text-[14px] font-normal leading-[18px] tracking-normal",
                tab.active ? "font-semibold text-action" : "text-text-meta",
              )}
              key={tab.label}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={cx(
                  "absolute inset-x-0 bottom-0 h-0.5 rounded-round",
                  tab.active ? "bg-action" : "bg-transparent",
                )}
              />
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="shrink-0 text-right">
      <p className="text-[24px] font-semibold leading-[26px] tracking-normal text-text">
        {value}
      </p>
      <p className="mt-xxs text-body-xs text-text-meta">{label}</p>
    </div>
  );
}

function JobPlanCard({
  actionLabel,
  description,
  metric,
  status,
  statusTone,
  title,
  trailingIcon,
  variant = "secondary",
}: JobPlanCardData) {
  return (
    <article className="rounded-xs border border-border-faint bg-background px-xl py-lg text-text">
      <div className="flex min-w-0 items-start justify-between gap-lg">
        <div className="min-w-0">
          <p
            className={cx(
              "text-label-xs leading-[15px]",
              statusToneClassNames[statusTone],
            )}
          >
            {status}
          </p>
          <h2 className="mt-xxs text-[18px] font-semibold leading-[22px] tracking-normal text-text">
            {title}
          </h2>
        </div>
        {metric ? (
          <Metric {...metric} />
        ) : trailingIcon ? (
          <Icon
            className="mt-xxs text-icon [&&]:size-6"
            name={trailingIcon}
            size="medium"
          />
        ) : null}
      </div>
      <p className="mt-md text-body-sm-open text-text-meta">
        {description}
      </p>
      <Button className="mt-md" size="small" variant={variant}>
        {actionLabel}
      </Button>
    </article>
  );
}

function JobDetailsCard() {
  return (
    <article className="rounded-xs border border-border-faint bg-background p-lg text-text">
      <div className="flex items-center gap-md">
        <CompanyPlaceholderLogo />
        <p className="text-body-sm text-text-meta">GSOBA</p>
      </div>
      <h2 className="mt-sm text-[16px] font-semibold leading-[20px] tracking-normal text-action">
        {JOB_TITLE}
      </h2>
      <p className="mt-sm text-body-sm-open text-text-meta">
        Seattle, Washington, United States
        <br />
        (On-site)
      </p>
      <p className="mt-sm text-body-sm text-text-meta">
        <span className="font-semibold text-positive">Active</span>
        <span aria-hidden="true"> - </span>
        Created 1w ago
      </p>
      <p className="mt-sm text-body-sm-open text-text-meta">
        This free job will pause after 14 days or 35 applicants. Limits vary by
        job, depending on market competitiveness and demand for talent. Promote
        to keep it active and get more applicants.{" "}
        <InlineActionText>Learn more</InlineActionText>
      </p>
      <div className="mt-md flex items-center gap-sm">
        <Button size="small">Promote job</Button>
        <GhostIconButton
          className="rounded-round border border-border-subtle text-icon"
          icon="overflow-web-ios"
          label="More job actions"
          size="small"
          touchTarget={false}
        />
      </div>
    </article>
  );
}

function SupportCard({ onStartChat }: Readonly<{ onStartChat: () => void }>) {
  return (
    <aside className="rounded-xs border border-border-faint bg-background p-lg text-text">
      <h2 className="text-[18px] font-semibold leading-[22px] tracking-normal">
        Need help?
      </h2>
      <p className="mt-sm text-body-sm-open text-text-meta">
        Get help from our support team
      </p>
      <div className="mt-md flex items-center gap-xl">
        <button
          className="text-control-sm text-action outline-none transition-colors duration-150 ease-out hover:text-action-hover hover:underline hover:underline-offset-2 focus-visible:rounded-xs focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          onClick={onStartChat}
          type="button"
        >
          Contact support
        </button>
        <span className="text-control-sm text-text">Help center</span>
      </div>
    </aside>
  );
}

function MessagingTray({
  isExpanded,
  onToggle,
}: Readonly<{
  isExpanded: boolean;
  onToggle: () => void;
}>) {
  return (
    <aside
      aria-label="Messaging inbox"
      className={cx(
        "vca-global-messaging-surface fixed bottom-0 right-6 z-50 hidden w-[288px] flex-col overflow-hidden rounded-t-sm border border-b-0 border-border-faint bg-background text-text shadow-raised-faint transition-[height] duration-[var(--design-motion-duration-moderate)] ease-emphasized md:flex",
        isExpanded
          ? "h-[min(calc(100dvh_-_96px),420px)]"
          : "h-[var(--design-layout-chat-tray-height,48px)]",
      )}
    >
      <div className="flex min-h-[var(--design-layout-chat-tray-height,48px)] items-center gap-sm border-b border-border-faint px-sm">
        <button
          aria-expanded={isExpanded}
          className="group flex min-w-0 flex-1 items-center gap-sm rounded-xs text-left outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          onClick={onToggle}
          type="button"
        >
          <span className="relative inline-flex shrink-0">
            <Entity label="Me" size={32} />
            <span
              aria-label="Active"
              className="absolute -bottom-xxs -right-xxs size-3 rounded-round border-2 border-background bg-positive"
              role="status"
            />
          </span>
          <span className="min-w-0 flex-1 truncate text-control-sm">
            Messaging
          </span>
        </button>
        <div className="flex shrink-0 items-center -space-x-xs">
          <GhostIconButton
            icon="overflow-web-ios"
            label="More messaging actions"
            size="small"
          />
          <GhostIconButton
            icon="compose"
            label="Compose message"
            size="small"
          />
          <GhostIconButton
            icon={isExpanded ? "chevron-down" : "chevron-up"}
            label={isExpanded ? "Collapse messaging" : "Expand messaging"}
            onClick={onToggle}
            size="small"
          />
        </div>
      </div>

      {isExpanded ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <button
            className="flex h-8 items-center justify-between border-b border-border-faint px-lg text-left text-control-sm text-text outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
            type="button"
          >
            <span>More inboxes</span>
            <Icon className="text-icon" name="caret" size="small" />
          </button>

          <div className="border-b border-border-faint px-lg py-sm">
            <div className="flex h-8 items-center gap-sm rounded-xs bg-background-neutral-soft px-md text-text-meta">
              <Icon name="search" size="small" />
              <span className="min-w-0 flex-1 truncate text-body-sm">
                Search messages
              </span>
              <Icon name="overflow-android" size="small" />
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-border-faint text-center text-control-sm">
            <button
              aria-selected="true"
              className="border-b-2 border-positive px-md py-md text-positive outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              role="tab"
              type="button"
            >
              Focused
            </button>
            <button
              aria-selected="false"
              className="border-b-2 border-transparent px-md py-md text-text-meta outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
              role="tab"
              type="button"
            >
              Other
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {inboxThreads.map((thread) => (
              <button
                className="flex h-[72px] min-h-[72px] w-full items-start gap-sm border-b border-border-faint px-md pb-md pt-sm text-left outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
                key={thread.id}
                type="button"
              >
                <Entity label={thread.name} size={40} />
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-xxs">
                  <span className="flex min-w-0 items-baseline justify-between gap-sm">
                    <span
                      className={cx(
                        "truncate text-body-sm text-text",
                        "unread" in thread &&
                          thread.unread &&
                          "font-semibold",
                      )}
                    >
                      {thread.name}
                    </span>
                    <span className="shrink-0 text-body-xs text-text-meta">
                      {thread.time}
                    </span>
                  </span>
                  <span className="line-clamp-2 text-body-xs text-text-meta">
                    {thread.detail}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function HelpAssistantPanel({
  onClose,
  onVariantToggle,
  variant,
}: Readonly<{
  onClose: () => void;
  onVariantToggle: () => void;
  variant: ChatPanelVariant;
}>) {
  return (
    <ChatPanel
      className="!h-full !w-full md:!h-full md:!w-full"
      surface="floating-card"
      variant={variant}
    >
      <ChatHeader
        title="Help assistant"
        variant={variant}
        showAiMark={false}
        onClose={onClose}
        onVariantToggle={onVariantToggle}
      />
      <ChatBody>
        <ChatThread showAiDisclaimer={false}>
          <ChatMessage>
            <ChatMessageContent>
              <p>Hi how can I help you?</p>
            </ChatMessageContent>
          </ChatMessage>
        </ChatThread>
      </ChatBody>
      <ChatComposer variant={variant} sendDisabled showVoiceMode={false} />
    </ChatPanel>
  );
}

function OnlineJobsMessagingShell({
  children,
}: Readonly<{
  children: (props: { onStartChat: () => void }) => ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPanelVariant, setChatPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [isGlobalInboxExpanded, setIsGlobalInboxExpanded] = useState(false);
  const isChatExpanded = chatPanelVariant === "expanded";
  const chatPanelPositionClass = isChatExpanded
    ? "md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2"
    : "md:inset-auto md:bottom-6 md:right-6 md:top-[calc(52px_+_var(--design-spacing-xxl))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]";

  function runMessagingSurfaceTransition(updateSurfaceState: () => void) {
    const transitionClassNames = [
      "vca-messaging-surface-transition",
      "vca-background-trays-slide",
    ];

    if (
      !startClassedViewTransition(() => {
        flushSync(updateSurfaceState);
      }, transitionClassNames)
    ) {
      updateSurfaceState();
    }
  }

  function handleOpenChat() {
    runMessagingSurfaceTransition(() => {
      setChatPanelVariant("collapsed");
      setIsChatOpen(true);
    });
  }

  function handleCloseChat() {
    runMessagingSurfaceTransition(() => {
      setIsChatOpen(false);
      setChatPanelVariant("collapsed");
    });
  }

  function handleCollapseChatPanel() {
    runMessagingSurfaceTransition(() => {
      setChatPanelVariant("collapsed");
    });
  }

  function handleToggleChatPanelVariant() {
    runMessagingSurfaceTransition(() => {
      setChatPanelVariant((currentVariant) =>
        currentVariant === "expanded" ? "collapsed" : "expanded",
      );
    });
  }

  return (
    <>
      {children({ onStartChat: handleOpenChat })}

      {!isChatOpen ? (
        <MessagingTray
          isExpanded={isGlobalInboxExpanded}
          onToggle={() =>
            setIsGlobalInboxExpanded((currentValue) => !currentValue)
          }
        />
      ) : null}

      {isChatOpen ? (
        <>
          <button
            aria-label="Collapse expanded Help assistant"
            className={cx(
              "fixed inset-0 z-30 hidden bg-overlay-dim md:block",
              !isChatExpanded && "pointer-events-none opacity-0",
            )}
            onClick={handleCollapseChatPanel}
            type="button"
          />
          <div
            aria-label="Help assistant"
            className={cx(
              "vca-ai-messaging-surface fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)]",
              chatPanelPositionClass,
            )}
            role="dialog"
          >
            <HelpAssistantPanel
              variant={chatPanelVariant}
              onClose={handleCloseChat}
              onVariantToggle={handleToggleChatPanelVariant}
            />
          </div>
        </>
      ) : null}
    </>
  );
}

export function OnlineJobsPage() {
  return (
    <OnlineJobsMessagingShell>
      {({ onStartChat }) => (
        <main className="min-h-dvh overflow-x-hidden bg-background-neutral-soft pb-[96px] text-text">
          <LinkedInGlobalNavigation
            items={onlineJobsNavItems}
            profileHeadline={onlineJobsProfile.headline}
            profileLabel="Me"
            profileName={onlineJobsProfile.name}
            searchPlaceholder="I'm looking for..."
          />
          <JobSubToolbar />

          <div className="mx-auto grid w-full max-w-[1128px] grid-cols-1 gap-xxl px-lg pt-xxl lg:grid-cols-[minmax(0,744px)_360px] xl:px-0">
            <section aria-label="Hiring plan" className="grid gap-md">
              {jobPlanCards.map((card) => (
                <JobPlanCard key={card.title} {...card} />
              ))}
            </section>

            <div className="grid content-start gap-md">
              <JobDetailsCard />
              <SupportCard onStartChat={onStartChat} />
            </div>
          </div>
        </main>
      )}
    </OnlineJobsMessagingShell>
  );
}
