"use client";

import { useCallback, useEffect, useId, useState } from "react";

import {
  ChatTray,
  type ChatPanelVariant,
  useChatPanelPresence,
} from "@/components/chat";
import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";
import { PREMIUM_CONCIERGE_TITLE } from "@/lib/concierge-copy";

import type {
  PremiumConversationFlow,
  PremiumGoalOptionId,
  PremiumLiveMode,
  PremiumSurveyStep,
  PremiumUseCaseOptionId,
} from "./premium-concierge-flows";
import { PremiumConciergeFab } from "./premium-concierge-fab";
import { PremiumConciergePanel } from "./premium-concierge-panel";
import { premiumPlans, type PremiumPlan } from "./premium-plan-data";

const useCaseOptions = [
  {
    id: "personal",
    label: "I'd use Premium for my personal goals",
  },
  {
    id: "job",
    label: "I'd use Premium as part of my job",
  },
  {
    id: "other",
    label: "Other",
  },
] as const;

const goalOptions = [
  {
    id: "land-job",
    label: "Stand out and land the right job",
  },
  {
    id: "advance-career",
    label: "Stay competitive and advance my career",
  },
  {
    id: "expand-network",
    label: "Expand my network, business, or visibility",
  },
  {
    id: "new-leads",
    label: "Find and reach new leads",
  },
  {
    id: "hire",
    label: "Hire the right people",
  },
  {
    id: "other",
    label: "Other",
  },
] as const;

type UseCaseOptionId = PremiumUseCaseOptionId;
type GoalOptionId = PremiumGoalOptionId;
type SurveyStep = PremiumSurveyStep;

function LinkedInBug({
  className,
}: Readonly<{
  className?: string;
}>) {
  return (
    <span
      aria-label="LinkedIn"
      role="img"
      className={[
        "inline-flex shrink-0 items-center justify-center text-action",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon name="linked-in-bug" size="medium" />
    </span>
  );
}

function ProgressIndicator({
  progress,
}: Readonly<{
  progress: number;
}>) {
  return (
    <div
      aria-label={`Survey progress, ${progress}% complete`}
      className="mx-4 flex min-w-0 flex-1 items-center gap-sm md:w-[472px] md:flex-none"
    >
      <span className="hidden shrink-0 text-supportive-s text-text-meta sm:inline">
        Choose plan
      </span>
      <div
        aria-hidden="true"
        className="relative h-[6px] min-w-0 flex-1 rounded-xs md:min-w-[300px]"
      >
        <span className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-xs bg-text-meta" />
        <span
          className="absolute left-0 top-0 h-[6px] rounded-xs bg-premium-indicator"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="shrink-0 text-supportive-s text-text-meta">
        {progress}%
      </span>
    </div>
  );
}

function EntityStack() {
  return (
    <span aria-hidden="true" className="inline-flex items-start pr-sm">
      <Entity
        size={24}
        label="Premium member"
        className="mr-[-8px] ring-1 ring-background"
      />
      <Entity
        size={24}
        label="Premium member"
        className="mr-[-8px] ring-1 ring-background"
      />
      <Entity
        size={24}
        label="Premium member"
        className="mr-[-8px] ring-1 ring-background"
      />
    </span>
  );
}

function PremiumProfileMark() {
  return (
    <div
      aria-hidden="true"
      className="relative flex size-12 items-center justify-center"
    >
      <span className="absolute -inset-[2px] rounded-round border-[2px] border-premium-inbug" />
      <Entity size={48} label="Alex" />
      <span className="absolute bottom-0 right-0 flex size-[13px] items-center justify-center rounded-xs bg-background">
        <LinkedInBug className="size-[10px] [&_span]:!size-[10px]" />
      </span>
    </div>
  );
}

function SurveyOption({
  checked,
  control = "radio",
  emphasis = "standard",
  label,
  onSelect,
}: Readonly<{
  checked: boolean;
  control?: "checkbox" | "radio";
  emphasis?: "large" | "standard";
  label: string;
  onSelect: () => void;
}>) {
  return (
    <button
      type="button"
      role={control}
      aria-checked={checked}
      onClick={onSelect}
      className={[
        "flex w-full items-center gap-md rounded-sm border bg-background text-left transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-focus-ring",
        emphasis === "large" ? "p-xxl" : "p-lg",
        checked
          ? "border-checked shadow-[inset_0_0_0_1px_rgba(1,117,79,0.12)]"
          : "border-border-faint hover:border-border-subtle hover:bg-background-transparent-hover",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "inline-flex size-6 shrink-0 items-center justify-center rounded-xs border transition-colors duration-150 ease-out",
          checked
            ? "border-checked bg-checked text-on-checked"
            : "border-border-subtle bg-background text-transparent",
        ].join(" ")}
      >
        <Icon name="check" size="small" />
      </span>
      <span
        className={[
          "min-w-0 flex-1 text-text",
          emphasis === "large" ? "text-heading-lg" : "text-control-sm",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}

function PremiumPlanCard({ plan }: Readonly<{ plan: PremiumPlan }>) {
  return (
    <article
      className={[
        "relative flex min-h-[432px] flex-col overflow-hidden rounded-lg border border-border-faint px-xxl py-xxxl",
        "bg-[radial-gradient(circle_at_8%_100%,rgba(253,226,188,0.95)_0%,rgba(253,226,188,0.58)_30%,transparent_58%),radial-gradient(circle_at_94%_86%,rgba(255,223,214,0.88)_0%,rgba(255,223,214,0.46)_34%,transparent_62%),#fffaf5]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:min-h-[485px]",
      ].join(" ")}
    >
      <div className="flex flex-1 flex-col gap-xxl">
        <div className="flex flex-col gap-sm">
          <h2 className="text-display-md text-text">{plan.name}</h2>
          <p className="text-body-md-open text-text">{plan.subtitle}</p>
        </div>

        <ul className="flex flex-col gap-lg">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex gap-md text-body-sm-open text-text"
            >
              <span
                aria-hidden="true"
                className="mt-[2px] inline-flex size-5 shrink-0 items-center justify-center text-premium-text-brand"
              >
                <Icon name="check" size="small" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button variant="tertiary" size="medium" className="mt-xxl w-full">
        Learn more
      </Button>
    </article>
  );
}

function PlanComparisonStep() {
  return (
    <section className="bg-background px-6 pb-40 pt-10 sm:px-8 lg:px-[120px]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
        <div className="flex max-w-[760px] flex-col items-center gap-md">
          <h1 className="text-display-md text-text">
            Join the millions of LinkedIn members using Premium to get ahead
          </h1>
          <p className="text-body-md-open text-text-meta">
            Enjoy 1 month free of Premium - cancel anytime. We&apos;ll send you
            a reminder 7 days before your trial ends.
          </p>
        </div>

        <div className="mt-10 grid w-full grid-cols-1 gap-xxl text-left lg:grid-cols-3">
          {premiumPlans.map((plan) => (
            <PremiumPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mt-8 inline-flex max-w-full items-center justify-center gap-sm rounded-round bg-background-neutral-soft px-lg py-md text-left">
          <EntityStack />
          <p className="text-body-sm text-text-meta">
            Millions are using Premium to get up to 16x more connections
          </p>
        </div>
      </div>
    </section>
  );
}

type PremiumSurveyPageProps = Readonly<{
  initialStep?: SurveyStep;
  initialUseCaseOption?: UseCaseOptionId;
  initialGoalOptions?: ReadonlyArray<GoalOptionId>;
  initialChatOpen?: boolean;
  conciergeNudge?: string;
  conversationFlow?: PremiumConversationFlow;
  liveMode?: PremiumLiveMode;
  shellMode?: "fab" | "tray";
}>;

const defaultInitialGoalOptions: ReadonlyArray<GoalOptionId> = [];

export function PremiumSurveyPage({
  initialStep = "use-case",
  initialUseCaseOption = "other",
  initialGoalOptions = defaultInitialGoalOptions,
  initialChatOpen = false,
  conversationFlow,
  liveMode = "low-signal",
  shellMode = "fab",
}: PremiumSurveyPageProps = {}) {
  const isTrayShell = shellMode === "tray";
  const [step, setStep] = useState<SurveyStep>(initialStep);
  const [selectedUseCaseOption, setSelectedUseCaseOption] =
    useState<UseCaseOptionId>(initialUseCaseOption);
  const [selectedGoalOptions, setSelectedGoalOptions] = useState<
    ReadonlySet<GoalOptionId>
  >(() => new Set(initialGoalOptions));
  const [chatPanelVariant, setChatPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const chatPanelId = useId();
  const resetChatPanelState = useCallback(() => {
    setChatPanelVariant("collapsed");
  }, []);
  const {
    isMounted: isChatMounted,
    isOpen: isChatOpen,
    isInteractive: isChatInteractive,
    open: openChat,
    close: closeChat,
  } = useChatPanelPresence({
    initialOpen: isTrayShell ? false : initialChatOpen,
    onBeforeOpen: isTrayShell ? undefined : resetChatPanelState,
    onBeforeClose: isTrayShell ? undefined : resetChatPanelState,
  });

  const isGoalStep = step === "goals";
  const isPlanStep = step === "plans";
  const isChatPanelMounted = isTrayShell || isChatMounted;
  const progress = isPlanStep ? 60 : isGoalStep ? 33 : 0;
  const isBottomAttachedChatSurface =
    isTrayShell && chatPanelVariant !== "expanded";
  const chatPanelPositionClass =
    isBottomAttachedChatSurface
      ? "md:right-6 md:bottom-0 md:h-[min(calc(100dvh_-_60px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
      : chatPanelVariant === "expanded"
        ? "md:top-1/2 md:left-1/2 md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2"
      : "md:right-6 md:bottom-6 md:h-[min(calc(100dvh_-_84px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]";
  const chatPanelFrameClass = isBottomAttachedChatSurface
    ? "md:!h-full md:!rounded-t-md md:!rounded-b-none"
    : chatPanelVariant === "expanded"
      ? undefined
      : "md:!h-full";

  const toggleChatPanelVariant = useCallback(() => {
    setChatPanelVariant((variant) =>
      variant === "collapsed" ? "expanded" : "collapsed",
    );
  }, []);

  const dockChatToTray = useCallback(() => {
    setChatPanelVariant("collapsed");
    closeChat();
  }, [closeChat]);

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0 });
  }, [step]);

  useEffect(() => {
    if (!isChatMounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isTrayShell) {
          dockChatToTray();
          return;
        }

        closeChat();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeChat, dockChatToTray, isChatMounted, isTrayShell]);

  function advanceSurvey() {
    if (step === "use-case") {
      setStep("goals");
    } else if (step === "goals") {
      setStep("plans");
    }
  }

  function goBack() {
    if (step === "goals") {
      setStep("use-case");
    } else if (step === "plans") {
      setStep("goals");
    }
  }

  function toggleGoalOption(optionId: GoalOptionId) {
    setSelectedGoalOptions((currentOptions) => {
      const nextOptions = new Set(currentOptions);

      if (nextOptions.has(optionId)) {
        nextOptions.delete(optionId);
      } else {
        nextOptions.add(optionId);
      }

      return nextOptions;
    });
  }

  return (
    <main
      className={[
        "-mt-28 min-h-dvh text-text sm:-mt-32",
        isPlanStep ? "bg-background" : "bg-background-neutral-soft",
      ].join(" ")}
    >
      <header className="flex h-[52px] items-center justify-between border-b border-border-faint bg-background px-6 sm:px-8 lg:px-[120px]">
        <LinkedInBug className="size-[26px] [&_span]:!size-[26px]" />
        <ProgressIndicator progress={progress} />
        <Entity size={32} label="Signed-in member" />
      </header>

      {isPlanStep ? (
        <PlanComparisonStep />
      ) : (
        <>
          <section className="bg-background px-6 pb-7 pt-8 text-center sm:px-8">
            <div className="mx-auto flex max-w-[762px] flex-col items-center gap-lg">
              <div className="flex flex-col items-center gap-sm">
                <h1 className="text-heading-xl text-text">
                  Premium members are 2.6x more likely to get hired on average
                </h1>
                <p className="text-body-md-open text-text">
                  Enjoy 1-month free on us. Cancel anytime. We&apos;ll remind
                  you 7 days before your trial ends.
                </p>
              </div>

              <div className="flex items-center justify-center gap-sm">
                <EntityStack />
                <p className="text-body-sm text-text-meta">
                  Millions of members use Premium
                </p>
              </div>
            </div>
          </section>

          <section className="flex justify-center px-6 pb-40 pt-6 sm:px-8 sm:pb-32">
            <div className="w-full max-w-[558px]">
              <div className="rounded-sm bg-background px-xxl pb-xxxl pt-xxl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col gap-xxl">
                  {isGoalStep ? (
                    <div className="flex flex-col gap-md">
                      <h2 className="text-heading-lg text-text">
                        Premium subscribers get up to 11x more profile views.
                        What do you need help with?
                      </h2>
                      <p className="text-body-sm text-text">
                        We use AI to tailor your plan
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-md">
                      <PremiumProfileMark />
                      <div className="flex flex-col gap-md">
                        <h2 className="text-heading-lg text-text">
                          Alex, are you interested in Premium for personal or
                          professional use?
                        </h2>
                        <p className="text-body-sm text-text">
                          We&apos;ll find the best plan for you.
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    role={isGoalStep ? "group" : "radiogroup"}
                    aria-label={isGoalStep ? "Premium goals" : "Premium use"}
                    className={
                      isGoalStep
                        ? "flex flex-col gap-lg"
                        : "flex flex-col gap-sm"
                    }
                  >
                    {isGoalStep
                      ? goalOptions.map((option) => (
                          <SurveyOption
                            key={option.id}
                            checked={selectedGoalOptions.has(option.id)}
                            control="checkbox"
                            label={option.label}
                            onSelect={() => toggleGoalOption(option.id)}
                          />
                        ))
                      : useCaseOptions.map((option) => (
                          <SurveyOption
                            key={option.id}
                            checked={selectedUseCaseOption === option.id}
                            label={option.label}
                            onSelect={() =>
                              setSelectedUseCaseOption(option.id)
                            }
                          />
                        ))}
                  </div>
                </div>
              </div>

              <div
                className={[
                  "mt-sm flex items-center",
                  isGoalStep ? "justify-between" : "justify-end",
                ].join(" ")}
              >
                {isGoalStep ? (
                  <Button
                    variant="secondary"
                    size="small"
                    className="w-[76px] px-0"
                    onClick={goBack}
                  >
                    Back
                  </Button>
                ) : null}
                <Button
                  size="small"
                  className="w-[76px] px-0"
                  onClick={advanceSurvey}
                >
                  Next
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {isTrayShell && !isChatInteractive ? (
        <ChatTray
          variant={chatPanelVariant}
          aria-controls={chatPanelId}
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-label="Open Premium help assistant"
          className="fixed bottom-0 left-4 right-4 z-40 mx-auto w-[calc(100vw_-_32px)] max-w-[var(--design-layout-panel-collapsed-width)] md:left-auto md:right-6 md:mx-0 md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
          title={PREMIUM_CONCIERGE_TITLE}
          onOpen={openChat}
          onVariantToggle={() => {
            setChatPanelVariant("expanded");
            openChat();
          }}
          showCloseAction={false}
        />
      ) : null}

      {isChatPanelMounted ? (
        <>
          {chatPanelVariant === "expanded" ? (
            <button
              type="button"
              aria-label="Collapse expanded chat"
              tabIndex={-1}
              className={[
                "fixed inset-0 z-30 hidden cursor-default bg-overlay-dim transition-opacity duration-[var(--design-motion-duration-moderate)] ease-emphasized focus:outline-none motion-reduce:duration-[var(--design-motion-duration-instant)] md:block",
                isChatInteractive
                  ? "opacity-100"
                  : "pointer-events-none opacity-0",
              ].join(" ")}
              onClick={() => setChatPanelVariant("collapsed")}
            />
          ) : null}

          <div
            id={chatPanelId}
            role="dialog"
            aria-label="AI Concierge chat"
            aria-hidden={!isChatOpen}
            inert={!isChatOpen}
            className={[
              "fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)] md:inset-auto",
              chatPanelPositionClass,
              isChatOpen ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
          >
            <div
              className={[
                "h-full w-full ease-emphasized motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:duration-[var(--design-motion-duration-instant)]",
                isTrayShell
                  ? "transition-transform duration-[var(--design-motion-duration-slow)]"
                  : "transition-[opacity,transform] duration-[var(--design-motion-duration-moderate)]",
                isChatInteractive
                  ? "translate-y-0 opacity-100"
                  : isTrayShell
                    ? "pointer-events-none translate-y-full opacity-100"
                    : "pointer-events-none translate-y-[var(--design-motion-distance-surface-y)] opacity-0",
              ].join(" ")}
            >
              <PremiumConciergePanel
                className={chatPanelFrameClass}
                variant={chatPanelVariant}
                context={step}
                flow={conversationFlow}
                liveMode={liveMode}
                onClose={isTrayShell ? undefined : closeChat}
                onMinimizeToTray={isTrayShell ? dockChatToTray : undefined}
                onVariantToggle={toggleChatPanelVariant}
                showCloseAction={!isTrayShell}
              />
            </div>
          </div>
        </>
      ) : !isTrayShell ? (
        <PremiumConciergeFab
          chatPanelId={chatPanelId}
          isChatOpen={isChatOpen}
          onClick={openChat}
        />
      ) : null}
    </main>
  );
}
