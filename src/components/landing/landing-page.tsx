"use client";

import { useCallback, useEffect, useId, useState } from "react";

import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ChatTray,
  startChatPanelViewTransition,
  type ChatHeaderIdentity,
  type ChatPanelVariant,
  useChatPanelPresence,
} from "@/components/chat";
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

type LandingPageProps = Readonly<{
  homeHref?: string;
  reviewFlow?: FlowReview;
  shellMode?: "default" | "tray" | "hybrid";
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
  shellMode = "default",
}: LandingPageProps) {
  const router = useRouter();
  const isReviewFlow = Boolean(reviewFlow);
  const isTrayShell = shellMode === "tray";
  const isHybridShell = shellMode === "hybrid";
  const isTrayStyleShell = isTrayShell || isHybridShell;
  const [chatPanelVariant, setChatPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [isReviewSidePanelOpen, setIsReviewSidePanelOpen] = useState(false);
  const [isEndChatDialogOpen, setIsEndChatDialogOpen] = useState(false);
  const [isChatConversationStarted, setIsChatConversationStarted] =
    useState(false);
  const [isHybridTrayVisible, setIsHybridTrayVisible] = useState(false);
  const [trayIdentity, setTrayIdentity] =
    useState<ChatHeaderIdentity | null>(null);
  const chatPanelId = useId();
  const resetChatPanelState = useCallback(() => {
    setIsEndChatDialogOpen(false);
    setIsChatConversationStarted(false);
    setIsReviewSidePanelOpen(false);
    setIsHybridTrayVisible(false);
    setTrayIdentity(null);
    setChatPanelVariant("collapsed");
  }, []);
  const {
    presence: chatPanelPresence,
    isMounted: isChatMounted,
    isOpen: isChatOpen,
    isInteractive: isChatInteractive,
    open: openChatPanel,
    close: closeChatPanel,
  } = useChatPanelPresence({
    initialOpen: isReviewFlow && !isHybridShell,
    onBeforeOpen: isTrayStyleShell ? undefined : resetChatPanelState,
    onBeforeClose: isTrayStyleShell ? undefined : resetChatPanelState,
  });
  const isChatPanelMounted = isTrayShell || isChatMounted;
  const isWideChatSurface =
    chatPanelVariant === "expanded" || isReviewSidePanelOpen;
  const isCenteredChatSurface = chatPanelVariant === "expanded";
  const isBottomAttachedChatSurface =
    isTrayShell || (isHybridShell && !isCenteredChatSurface);
  // Tray shells are bottom-docked; 72px preserves the 64px landing header plus an 8px gap.
  const chatPanelPositionClass = isBottomAttachedChatSurface
    ? isCenteredChatSurface
      ? isReviewSidePanelOpen
        ? "md:left-1/2 md:bottom-0 md:h-[min(calc(100dvh_-_72px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-side-panel-expanded-surface-width))] md:-translate-x-1/2"
        : "md:left-1/2 md:bottom-0 md:h-[min(calc(100dvh_-_72px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2"
      : isWideChatSurface
        ? "md:right-6 md:bottom-0 md:h-[min(calc(100dvh_-_72px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-side-panel-collapsed-surface-width))]"
        : "md:right-6 md:bottom-0 md:h-[min(calc(100dvh_-_72px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
    : isCenteredChatSurface
      ? isReviewSidePanelOpen
        ? "md:top-1/2 md:left-1/2 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-side-panel-expanded-surface-width))] md:-translate-x-1/2 md:-translate-y-1/2"
        : "md:top-1/2 md:left-1/2 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2"
      : isWideChatSurface
        ? "md:right-6 md:bottom-6 md:h-[min(calc(100dvh_-_96px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-side-panel-collapsed-surface-width))]"
        : "md:right-6 md:bottom-6 md:h-[min(calc(100dvh_-_96px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]";
  const chatPanelFrameClass = isBottomAttachedChatSurface
    ? "md:!h-full md:!w-full md:!rounded-t-md md:!rounded-b-none"
    : isCenteredChatSurface
      ? "md:!h-full md:!w-full"
      : "md:!h-full md:!w-full";

  const openChat = useCallback(() => {
    if (isReviewFlow && !isTrayStyleShell) {
      return;
    }

    if (isHybridShell && !isHybridTrayVisible && !isChatOpen) {
      resetChatPanelState();
    }

    setIsHybridTrayVisible(false);
    openChatPanel();
  }, [
    isChatOpen,
    isHybridShell,
    isHybridTrayVisible,
    isReviewFlow,
    isTrayStyleShell,
    openChatPanel,
    resetChatPanelState,
  ]);

  const openChatExpanded = useCallback(() => {
    if (isReviewFlow && !isTrayStyleShell) {
      return;
    }

    if (isHybridShell && !isHybridTrayVisible && !isChatOpen) {
      resetChatPanelState();
    }

    setIsHybridTrayVisible(false);
    setChatPanelVariant("expanded");
    openChatPanel();
  }, [
    isChatOpen,
    isHybridShell,
    isHybridTrayVisible,
    isReviewFlow,
    isTrayStyleShell,
    openChatPanel,
    resetChatPanelState,
  ]);

  const toggleChatPanelVariant = useCallback(() => {
    const toggleVariant = () => {
      setChatPanelVariant((variant) =>
        variant === "collapsed" ? "expanded" : "collapsed",
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

  const closeChat = useCallback(() => {
    if (isTrayStyleShell) {
      resetChatPanelState();
    }

    closeChatPanel();
  }, [closeChatPanel, isTrayStyleShell, resetChatPanelState]);

  const minimizeChatToTray = useCallback(() => {
    if (isReviewFlow && !isTrayStyleShell) {
      return;
    }

    setIsEndChatDialogOpen(false);
    setIsHybridTrayVisible(isHybridShell);
    closeChatPanel();
  }, [closeChatPanel, isHybridShell, isReviewFlow, isTrayStyleShell]);

  const requestCloseChat = useCallback(() => {
    if (isReviewFlow && !isTrayStyleShell) {
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
    isTrayStyleShell,
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
    if (!isChatPanelMounted) {
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
  }, [isChatPanelMounted, isEndChatDialogOpen, requestCloseChat]);

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

      {(isTrayShell || (isHybridShell && isHybridTrayVisible)) &&
      !isChatInteractive ? (
        <ChatTray
          variant={chatPanelVariant}
          aria-controls={chatPanelId}
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-label="Open AI Concierge chat"
          badge
          className="fixed bottom-0 left-4 right-4 z-40 mx-auto w-[calc(100vw_-_32px)] max-w-[var(--design-layout-panel-collapsed-width)] md:left-auto md:right-6 md:mx-0 md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
          identity={trayIdentity}
          onOpen={openChat}
          onVariantToggle={openChatExpanded}
          onClose={closeChat}
        />
      ) : null}

      {isChatPanelMounted ? (
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
            aria-label="AI Concierge chat"
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
                isTrayStyleShell
                  ? "transition-transform duration-[var(--design-motion-duration-slow)]"
                  : "transition-[opacity,transform] duration-[var(--design-motion-duration-moderate)]",
                isChatInteractive
                  ? "translate-y-0 opacity-100"
                  : isTrayStyleShell
                    ? "pointer-events-none translate-y-full opacity-100"
                    : "pointer-events-none translate-y-[var(--design-motion-distance-surface-y)] opacity-0",
              ].join(" ")}
            >
              {reviewFlow ? (
                <FlowReviewChatPanel
                  className={chatPanelFrameClass}
                  flow={reviewFlow}
                  variant={chatPanelVariant}
                  onClose={requestCloseChat}
                  onMinimizeToTray={
                    isTrayStyleShell ? minimizeChatToTray : undefined
                  }
                  onVariantToggle={toggleChatPanelVariant}
                  onHeaderIdentityChange={setTrayIdentity}
                  onSidePanelOpenChange={setIsReviewSidePanelOpen}
                />
              ) : (
                <ConciergePanel
                  className={chatPanelFrameClass}
                  variant={chatPanelVariant}
                  onClose={requestCloseChat}
                  onMinimizeToTray={
                    isTrayStyleShell ? minimizeChatToTray : undefined
                  }
                  onVariantToggle={toggleChatPanelVariant}
                  onSidePanelOpenChange={setIsReviewSidePanelOpen}
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
                />
              )}
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
