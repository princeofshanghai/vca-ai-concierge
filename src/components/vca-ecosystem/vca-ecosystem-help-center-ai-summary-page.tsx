"use client";

import { useCallback, useId, useState } from "react";

import { useRouter } from "next/navigation";

import {
  CHAT_PANEL_TRAY_TRANSITION_MS,
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatMessageContent,
  ChatPanel,
  ChatResponseAttachment,
  ChatResponseBlock,
  ChatThread,
  Prompt,
  startChatPanelViewTransition,
  useChatPanelPresence,
  type ChatPanelVariant,
} from "@/components/chat";
import { PremiumProductRecommendationCard } from "@/components/premium/premium-product-recommendation-card";
import { Button } from "@/components/primitives/button";
import { Icon } from "@/components/primitives/icon";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

import { HelpCenterSearchResultsShell } from "./vca-ecosystem-help-center-search-result-page";

type AiSummarySignal = "high" | "low";

type VcaEcosystemHelpCenterAiSummaryPageProps = Readonly<{
  signal?: AiSummarySignal;
}>;

function AiSummaryCard({
  isChatOpen,
  onOpenAssistant,
  panelId,
  signal,
}: Readonly<{
  isChatOpen: boolean;
  onOpenAssistant: () => void;
  panelId: string;
  signal: AiSummarySignal;
}>) {
  const isHighSignal = signal === "high";

  return (
    <section aria-labelledby="ai-summary-title" className="min-w-0">
      <div className="flex flex-col gap-xs">
        <h1 id="ai-summary-title" className="text-heading-sm text-text">
          AI Summary
        </h1>
        <p className="text-body-sm text-text-meta">
          This AI feature may make mistakes.{" "}
          <a
            href="#"
            className="font-semibold text-[#0073B1] hover:text-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
            onClick={(event) => event.preventDefault()}
          >
            Learn more
          </a>
        </p>
      </div>

      <article className="mt-md rounded-[20px] bg-background-neutral-soft px-lg py-lg text-text shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
        <div className="flex max-w-[62rem] flex-col gap-md">
          <div className="flex flex-col gap-sm text-body-sm-open">
            <p>
              InMail lets you message LinkedIn members you are not connected to
              when the option is available. To send one, open the member&apos;s
              profile, choose the message or InMail action, write your note, and
              review it before sending.
            </p>
            <p>
              If you are trying to reach someone outside your network, Premium
              may help because some plans include monthly InMail credits. The
              number of credits and available messaging options can vary by
              plan.
            </p>
            <p>Common ways to start:</p>
            <ul className="list-disc space-y-xs pl-xl">
              <li>Use the message option on a member profile when it appears.</li>
              <li>
                Start from an introduction or messaging entry point when InMail
                is available.
              </li>
              <li>
                Keep your message focused on why you are reaching out and what
                you are asking for.
              </li>
            </ul>
          </div>

          {isHighSignal ? (
            <div className="flex flex-col gap-sm border-t border-border-faint pt-md sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-body-sm font-semibold text-text">
                  You&apos;re eligible for a free Premium trial
                </p>
                <p className="mt-xxs text-body-sm text-text-meta">
                  Premium Career includes InMail credits to help you message
                  people outside your network.
                </p>
              </div>
              <Button
                size="small"
                leadingIcon={<Icon name="signal-ai" size="small" />}
                className="w-fit shrink-0 px-pill-padding-inline"
                aria-controls={isChatOpen ? panelId : undefined}
                aria-expanded={isChatOpen}
                aria-haspopup="dialog"
                onClick={onOpenAssistant}
              >
                View plan
              </Button>
            </div>
          ) : (
            <Button
              size="small"
              leadingIcon={<Icon name="signal-ai" size="small" />}
              className="w-fit px-pill-padding-inline"
              aria-controls={isChatOpen ? panelId : undefined}
              aria-expanded={isChatOpen}
              aria-haspopup="dialog"
              onClick={onOpenAssistant}
            >
              Ask AI about Premium options
            </Button>
          )}
        </div>

        <div className="mt-lg border-t border-border-faint pt-md">
          <h2 className="text-body-sm font-semibold text-text-meta">Sources</h2>
          <div className="mt-xs flex flex-col gap-xs text-body-sm">
            {[
              "Send an InMail Message",
              "InMail Messages",
              "Send messages on LinkedIn",
            ].map((source) => (
              <a
                key={source}
                href="#"
                className="inline-flex w-fit items-center gap-sm font-semibold text-text-meta underline underline-offset-2 hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
                onClick={(event) => event.preventDefault()}
              >
                {source}
                <Icon name="link-external" size="small" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-lg flex justify-end gap-sm text-icon">
          <button
            type="button"
            aria-label="Helpful"
            className="inline-flex size-6 items-center justify-center rounded-round border border-border-faint bg-background text-icon hover:bg-background-transparent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          >
            <Icon name="thumbs-up-outline" size="small" />
          </button>
          <button
            type="button"
            aria-label="Not helpful"
            className="inline-flex size-6 items-center justify-center rounded-round border border-border-faint bg-background text-icon hover:bg-background-transparent-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
          >
            <Icon name="thumbs-down-outline" size="small" />
          </button>
        </div>
      </article>
    </section>
  );
}

function PremiumAiSummaryAssistantPanel({
  className,
  signal,
  variant,
  onClose,
  onVariantToggle,
}: Readonly<{
  className?: string;
  signal: AiSummarySignal;
  variant: ChatPanelVariant;
  onClose: () => void;
  onVariantToggle: () => void;
}>) {
  const isLowSignal = signal === "low";
  const router = useRouter();

  return (
    <ChatPanel className={className} variant={variant}>
      <ChatHeader
        variant={variant}
        title="Help assistant"
        showAiMark={false}
        onClose={onClose}
        onVariantToggle={onVariantToggle}
      />
      <ChatBody>
        {isLowSignal ? (
          <ChatThread>
            <ChatResponseBlock timestamp={getPrototypeMessageTimestamp(0)}>
              <ChatMessage>
                <ChatMessageContent>
                  <p>
                    I can help you figure out whether Premium makes sense for
                    what you&apos;re trying to do.
                  </p>
                  <p>
                    Before I recommend a plan, what are you hoping Premium helps
                    with most?
                  </p>
                </ChatMessageContent>
              </ChatMessage>
            </ChatResponseBlock>
            <ChatMessage
              role="user"
              timestamp={getPrototypeMessageTimestamp(1)}
            >
              I want to message people I&apos;m not connected to, especially for
              my job search.
            </ChatMessage>
            <ChatResponseBlock
              feedbackPolicy="rateable"
              timestamp={getPrototypeMessageTimestamp(2)}
            >
              <ChatMessage>
                <ChatMessageContent>
                  <p>
                    That points to Premium Career. It includes InMail credits,
                    which can help you reach people outside your network, and it
                    is built around job search and career growth.
                  </p>
                </ChatMessageContent>
              </ChatMessage>
              <ChatResponseAttachment gap="sm">
                <PremiumProductRecommendationCard
                  displayName="Premium Career"
                  planId="career"
                />
              </ChatResponseAttachment>
            </ChatResponseBlock>
          </ChatThread>
        ) : (
          <ChatThread>
            <ChatResponseBlock
              feedbackPolicy="rateable"
              timestamp={getPrototypeMessageTimestamp(0)}
            >
              <ChatMessage>
                <ChatMessageContent>
                  <p>
                    You&apos;re eligible for a free Premium trial.
                  </p>
                  <p>
                    Since you&apos;re looking up InMail, Premium Career may be
                    a good fit because it includes InMail credits for messaging
                    people outside your network.
                  </p>
                </ChatMessageContent>
              </ChatMessage>
              <ChatResponseAttachment gap="sm">
                <PremiumProductRecommendationCard
                  displayName="Premium Career"
                  planId="career"
                />
              </ChatResponseAttachment>
              <ChatResponseAttachment gap="sm">
                <div className="flex flex-wrap gap-sm">
                  <Prompt
                    prompt="Browse other plans"
                    onPromptSelect={() => router.push("/premium/learn-more")}
                  />
                </div>
              </ChatResponseAttachment>
            </ChatResponseBlock>
          </ChatThread>
        )}
      </ChatBody>
      <ChatComposer
        variant={variant}
        inputProps={{
          "aria-label": "Message",
          disabled: true,
          placeholder: "Send a message",
          value: "",
        }}
        onSend={() => undefined}
        sendDisabled
        showVoiceMode={false}
      />
    </ChatPanel>
  );
}

export function VcaEcosystemHelpCenterAiSummaryPage({
  signal = "high",
}: VcaEcosystemHelpCenterAiSummaryPageProps) {
  const [chatPanelVariant, setChatPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const chatPanelId = useId();
  const {
    presence: chatPanelPresence,
    isMounted: isChatMounted,
    isOpen: isChatOpen,
    isInteractive: isChatInteractive,
    open: openChatPanel,
    close: closeChatPanel,
  } = useChatPanelPresence({
    closeTransitionMs: CHAT_PANEL_TRAY_TRANSITION_MS,
  });
  const isCenteredChatSurface = chatPanelVariant === "expanded";
  const isBottomAttachedChatSurface = !isCenteredChatSurface;
  const chatPanelPositionClass = isBottomAttachedChatSurface
    ? "md:right-6 md:bottom-0 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
    : "md:top-1/2 md:left-1/2 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2";
  const chatPanelFrameClass = isBottomAttachedChatSurface
    ? "md:!h-full md:!w-full md:!rounded-t-md md:!rounded-b-none"
    : "md:!h-full md:!w-full";

  const openAssistant = useCallback(() => {
    setChatPanelVariant("collapsed");
    openChatPanel();
  }, [openChatPanel]);

  const closeAssistant = useCallback(() => {
    setChatPanelVariant("collapsed");
    closeChatPanel();
  }, [closeChatPanel]);

  const toggleChatPanelVariant = useCallback(() => {
    const toggleVariant = () => {
      setChatPanelVariant((currentVariant) =>
        currentVariant === "collapsed" ? "expanded" : "collapsed",
      );
    };

    if (!startChatPanelViewTransition(toggleVariant)) {
      toggleVariant();
    }
  }, []);

  const collapseChatPanelVariant = useCallback(() => {
    const collapseVariant = () => {
      setChatPanelVariant("collapsed");
    };

    if (!startChatPanelViewTransition(collapseVariant)) {
      collapseVariant();
    }
  }, []);

  return (
    <>
      <HelpCenterSearchResultsShell
        topContent={
          <AiSummaryCard
            isChatOpen={isChatOpen}
            panelId={chatPanelId}
            signal={signal}
            onOpenAssistant={openAssistant}
          />
        }
      />

      {isChatMounted ? (
        <>
          <button
            type="button"
            aria-label="Collapse expanded chat"
            tabIndex={-1}
            className={[
              "fixed inset-0 z-30 hidden cursor-default bg-overlay-dim transition-opacity duration-[var(--design-motion-duration-moderate)] ease-emphasized focus:outline-none motion-reduce:duration-[var(--design-motion-duration-instant)] md:block",
              chatPanelVariant === "expanded" && isChatInteractive
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            ].join(" ")}
            onClick={collapseChatPanelVariant}
          />

          <div
            id={chatPanelId}
            role="dialog"
            aria-label="Help assistant chat"
            aria-hidden={!isChatOpen}
            inert={!isChatOpen}
            className={[
              "concierge-chat-panel fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform,opacity] duration-[var(--design-motion-duration-slow)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)] md:inset-auto",
              chatPanelPositionClass,
              isChatOpen ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
          >
            <div
              className={[
                "h-full w-full ease-emphasized motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:duration-[var(--design-motion-duration-instant)]",
                chatPanelPresence === "entering" ||
                chatPanelPresence === "closed"
                  ? "transition-none"
                  : "transition-transform duration-[var(--design-motion-duration-slow)]",
                isChatInteractive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-full opacity-100",
              ].join(" ")}
            >
              <PremiumAiSummaryAssistantPanel
                className={chatPanelFrameClass}
                signal={signal}
                variant={chatPanelVariant}
                onClose={closeAssistant}
                onVariantToggle={toggleChatPanelVariant}
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
