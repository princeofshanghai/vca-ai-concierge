"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { type ChatPanelVariant } from "@/components/chat";
import { FlowReviewChatPanel } from "@/components/flow-review";
import { ConciergePanel } from "@/components/onboarding";
import { Button } from "@/components/primitives/button";
import { ConfirmationDialog } from "@/components/primitives/confirmation-dialog";
import type { FlowReview } from "@/lib/conversation-flows";

const navItems = [
  { href: "#products", label: "Products" },
  { href: "#compare-products", label: "Compare Products" },
  { href: "#resources-support", label: "Resources & Support" },
];

const PANEL_TRANSITION_MS = 240;

type ChatPanelPresence = "closed" | "entering" | "open" | "exiting";

type LandingPageProps = Readonly<{
  homeHref?: string;
  reviewFlow?: FlowReview;
}>;

const communityProBold = localFont({
  src: "./CommunityPro-BoldWEB.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
});

export function LandingPage({
  homeHref = "/hiring",
  reviewFlow,
}: LandingPageProps) {
  const router = useRouter();
  const isReviewFlow = Boolean(reviewFlow);
  const [chatPanelPresence, setChatPanelPresence] =
    useState<ChatPanelPresence>(() => (reviewFlow ? "open" : "closed"));
  const [chatPanelVariant, setChatPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [isReviewSidePanelOpen, setIsReviewSidePanelOpen] = useState(false);
  const [isEndChatDialogOpen, setIsEndChatDialogOpen] = useState(false);
  const [isChatConversationStarted, setIsChatConversationStarted] =
    useState(false);
  const openAnimationFrameRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const chatPanelId = useId();
  const isChatMounted = isReviewFlow || chatPanelPresence !== "closed";
  const isChatOpen =
    isReviewFlow ||
    chatPanelPresence === "entering" || chatPanelPresence === "open";
  const isChatInteractive = isReviewFlow || chatPanelPresence === "open";
  const isWideChatSurface =
    chatPanelVariant === "expanded" || isReviewSidePanelOpen;
  const isCenteredChatSurface = chatPanelVariant === "expanded";
  const chatPanelPositionClass = isCenteredChatSurface
    ? isReviewSidePanelOpen
      ? "md:top-1/2 md:left-1/2 md:w-[min(calc(100vw_-_48px),var(--design-layout-schedule-expanded-surface-width))] md:-translate-x-1/2 md:-translate-y-1/2"
      : "md:top-1/2 md:left-1/2 md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2"
    : isWideChatSurface
      ? "md:top-6 md:right-6 md:bottom-6 md:w-[min(calc(100vw_-_48px),var(--design-layout-schedule-collapsed-surface-width))]"
      : "md:top-6 md:right-6 md:bottom-6 md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]";

  const clearPanelTimers = useCallback(() => {
    if (openAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(openAnimationFrameRef.current);
      openAnimationFrameRef.current = null;
    }

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const openChat = useCallback(() => {
    if (chatPanelPresence === "entering" || chatPanelPresence === "open") {
      return;
    }

    clearPanelTimers();
    setIsEndChatDialogOpen(false);
    setIsChatConversationStarted(false);
    setIsReviewSidePanelOpen(false);
    setChatPanelVariant("collapsed");
    setChatPanelPresence("entering");

    openAnimationFrameRef.current = window.requestAnimationFrame(() => {
      openAnimationFrameRef.current = null;
      setChatPanelPresence("open");
    });
  }, [chatPanelPresence, clearPanelTimers]);

  const toggleChatPanelVariant = useCallback(() => {
    setChatPanelVariant((variant) =>
      variant === "collapsed" ? "expanded" : "collapsed",
    );
  }, []);

  const closeChat = useCallback(() => {
    if (chatPanelPresence === "closed" || chatPanelPresence === "exiting") {
      return;
    }

    clearPanelTimers();
    setIsEndChatDialogOpen(false);
    setIsChatConversationStarted(false);
    setIsReviewSidePanelOpen(false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChatPanelPresence("closed");
      return;
    }

    setChatPanelPresence("exiting");
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      setChatPanelPresence("closed");
    }, PANEL_TRANSITION_MS);
  }, [chatPanelPresence, clearPanelTimers]);

  const requestCloseChat = useCallback(() => {
    if (isReviewFlow) {
      setIsReviewSidePanelOpen(false);
      router.push(homeHref);
      return;
    }

    if (chatPanelPresence === "closed" || chatPanelPresence === "exiting") {
      return;
    }

    if (!isChatConversationStarted) {
      closeChat();
      return;
    }

    setIsEndChatDialogOpen(true);
  }, [
    chatPanelPresence,
    closeChat,
    homeHref,
    isChatConversationStarted,
    isReviewFlow,
    router,
  ]);

  const cancelEndChatDialog = useCallback(() => {
    setIsEndChatDialogOpen(false);
  }, []);

  const confirmEndChat = useCallback(() => {
    setIsEndChatDialogOpen(false);
    closeChat();
  }, [closeChat]);

  const handleConversationStart = useCallback(() => {
    setIsChatConversationStarted(true);
  }, []);

  useEffect(() => {
    return clearPanelTimers;
  }, [clearPanelTimers]);

  useEffect(() => {
    if (!isChatMounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isEndChatDialogOpen) {
          return;
        }

        requestCloseChat();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isChatMounted, isEndChatDialogOpen, requestCloseChat]);

  return (
    <main className="-mt-28 min-h-dvh bg-white sm:-mt-32">
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-border-subtle bg-white px-6 sm:px-8">
        <Link
          href={homeHref}
          aria-label="LinkedIn Hire home"
          className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
        >
          <Image
            src="/assets/logo-lockup.svg"
            alt="LinkedIn Hire"
            width={162}
            height={27}
            className="h-[27px] w-[162px]"
          />
        </Link>

        <div className="flex items-center gap-5 min-[920px]:gap-6">
          <nav
            aria-label="LinkedIn Hiring"
            className="hidden items-center gap-5 min-[920px]:flex min-[1080px]:gap-6"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[16px] font-semibold leading-none text-action transition-colors duration-150 ease-out hover:text-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Button
            variant="secondary"
            size="small"
            aria-controls={isChatOpen ? chatPanelId : undefined}
            aria-expanded={isChatOpen}
            aria-haspopup="dialog"
            onClick={openChat}
          >
            Contact sales
          </Button>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-[1009px] flex-col items-start gap-8 px-6 pb-24 pt-12 sm:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-0">
        <div className="aspect-square w-full max-w-[447px] shrink-0 overflow-hidden rounded-[14px] bg-background-neutral-soft">
          <Image
            src="/assets/hiring-hero.png"
            alt="Professional portrait for LinkedIn Hiring"
            width={1098}
            height={1140}
            priority
            sizes="(min-width: 1024px) 447px, calc(100vw - 48px)"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex w-full max-w-[514px] flex-col items-start gap-8">
          <div className="space-y-3">
            <p
              className={`${communityProBold.className} text-[16px] font-bold leading-[1.25] tracking-[0.32px] text-black uppercase`}
            >
              Hire with LinkedIn
            </p>
            <h1
              className={`${communityProBold.className} max-w-[514px] text-[44px] leading-[1.12] font-bold tracking-[0px] text-text sm:text-[56px] sm:leading-[1.16] lg:text-[64px] lg:leading-[1.25]`}
            >
              Hire the people you need
            </h1>
          </div>

          <Button
            aria-controls={isChatOpen ? chatPanelId : undefined}
            aria-expanded={isChatOpen}
            aria-haspopup="dialog"
            onClick={openChat}
          >
            Contact sales
          </Button>
        </div>
      </section>

      {isChatMounted ? (
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
            className={[
              "fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)] md:inset-auto",
              chatPanelPositionClass,
            ].join(" ")}
          >
            <div
              className={[
                "h-full w-full transition-[opacity,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:duration-[var(--design-motion-duration-instant)]",
                isChatInteractive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-[var(--design-motion-distance-surface-y)] opacity-0",
              ].join(" ")}
            >
              {reviewFlow ? (
                <FlowReviewChatPanel
                  flow={reviewFlow}
                  variant={chatPanelVariant}
                  onClose={requestCloseChat}
                  onVariantToggle={toggleChatPanelVariant}
                  onSidePanelOpenChange={setIsReviewSidePanelOpen}
                  className={
                    isWideChatSurface
                      ? "h-[var(--design-layout-mobile-panel-height)] md:!h-[calc(100dvh-48px)]"
                      : "h-[var(--design-layout-mobile-panel-height)] md:!h-full"
                  }
                />
              ) : (
                <ConciergePanel
                  variant={chatPanelVariant}
                  onClose={requestCloseChat}
                  onVariantToggle={toggleChatPanelVariant}
                  onConversationStart={handleConversationStart}
                  confirmationDialog={
                    <ConfirmationDialog
                      open={isEndChatDialogOpen && isChatConversationStarted}
                      title="End chat?"
                      confirmLabel="End chat"
                      cancelLabel="Continue chat"
                      scope="container"
                      onConfirm={confirmEndChat}
                      onCancel={cancelEndChatDialog}
                    >
                      <p className="m-0">
                        This will end the chat and clear any messages in this
                        conversation.
                      </p>
                    </ConfirmationDialog>
                  }
                  className={
                    chatPanelVariant === "expanded"
                      ? "h-[var(--design-layout-mobile-panel-height)] md:!h-[calc(100dvh-48px)]"
                      : "h-[var(--design-layout-mobile-panel-height)] md:!h-full"
                  }
                />
              )}
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
