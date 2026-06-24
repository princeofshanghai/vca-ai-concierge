"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";

import Image from "next/image";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";

import {
  ChatEndFeedbackScreen,
  ChatTray,
  type ChatHeaderIdentity,
  type ChatPanelVariant,
} from "@/components/chat/chat-ui";
import {
  CHAT_PANEL_TRAY_TRANSITION_MS,
  startChatPanelViewTransition,
  useChatPanelPresence,
} from "@/components/chat/chat-motion";
import {
  FlowReviewChatPanel,
  type MediumAvailableHandoffState,
} from "@/components/flow-review/flow-review-chat-panel";
import {
  ConciergePanel,
  type ContactSalesEntry,
} from "@/components/onboarding/concierge-panel";
import { Button } from "@/components/primitives/button";
import { ConfirmationDialog } from "@/components/primitives/confirmation-dialog";
import type { FlowReview } from "@/lib/conversation-flows";
import type { HiringShellMode } from "@/lib/hiring-shell";

import { HiringHeader, type HiringHeaderNavHref } from "./hiring-header";

type LandingPageProps = Readonly<{
  contactSalesEntry?: ContactSalesEntry;
  homeHref?: string;
  openContactSalesOnLoad?: boolean;
  reviewFlow?: FlowReview;
  reviewMediumHandoffState?: MediumAvailableHandoffState;
  shellMode?: HiringShellMode;
}>;

const communityProBold = localFont({
  src: "./CommunityPro-BoldWEB.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
});

export function LandingPage({
  contactSalesEntry = "default",
  homeHref = "/hiring",
  openContactSalesOnLoad = false,
  reviewFlow,
  reviewMediumHandoffState,
  shellMode = "tray",
}: LandingPageProps) {
  const router = useRouter();
  const isReviewFlow = Boolean(reviewFlow);
  const isDismissableTrayShell = shellMode === "default";
  const isPersistentTrayShell = shellMode === "tray";
  const isHybridShell = shellMode === "hybrid";
  const isTrayStyleShell =
    isDismissableTrayShell || isPersistentTrayShell || isHybridShell;
  const [chatPanelVariant, setChatPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [isReviewSidePanelOpen, setIsReviewSidePanelOpen] = useState(false);
  const [isEndChatFeedbackOpen, setIsEndChatFeedbackOpen] = useState(false);
  const [pendingLeaveHref, setPendingLeaveHref] =
    useState<HiringHeaderNavHref | null>(null);
  const [isChatConversationStarted, setIsChatConversationStarted] =
    useState(false);
  const [isHybridTrayVisible, setIsHybridTrayVisible] = useState(false);
  const [isChatTrayOpeningBridgeVisible, setIsChatTrayOpeningBridgeVisible] =
    useState(false);
  const [hasUnreadTrayActivity, setHasUnreadTrayActivity] = useState(false);
  const [trayIdentity, setTrayIdentity] =
    useState<ChatHeaderIdentity | null>(null);
  const chatPanelId = useId();
  const hasOpenedContactSalesOnLoadRef = useRef(false);
  const resetChatPanelState = useCallback(() => {
    setIsEndChatFeedbackOpen(false);
    setPendingLeaveHref(null);
    setIsChatConversationStarted(false);
    setIsReviewSidePanelOpen(false);
    setIsHybridTrayVisible(false);
    setIsChatTrayOpeningBridgeVisible(false);
    setHasUnreadTrayActivity(false);
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
    closeTransitionMs: isTrayStyleShell
      ? CHAT_PANEL_TRAY_TRANSITION_MS
      : undefined,
    initialOpen: isReviewFlow && !isHybridShell,
    onBeforeOpen: isTrayStyleShell ? undefined : resetChatPanelState,
    onBeforeClose: isTrayStyleShell ? undefined : resetChatPanelState,
  });
  const isChatInteractiveRef = useRef(isChatInteractive);
  const isChatPanelMounted = isPersistentTrayShell || isChatMounted;
  const isWideChatSurface =
    chatPanelVariant === "expanded" || isReviewSidePanelOpen;
  const isCenteredChatSurface = chatPanelVariant === "expanded";
  const isBottomAttachedChatSurface =
    !isCenteredChatSurface &&
    (isDismissableTrayShell || isPersistentTrayShell || isHybridShell);
  const shouldRenderChatTray =
    chatPanelPresence === "closed" ||
    (chatPanelPresence === "entering" &&
      (isPersistentTrayShell || (isHybridShell && isHybridTrayVisible))) ||
    (chatPanelPresence === "open" && isChatTrayOpeningBridgeVisible);
  const isChatTrayShellVisible =
    isPersistentTrayShell ||
    (isHybridShell &&
      (isHybridTrayVisible || isChatTrayOpeningBridgeVisible));
  const isChatTrayOpeningBridgeActive =
    chatPanelPresence === "open" && isChatTrayOpeningBridgeVisible;
  const usesHeaderDockMotion =
    isPersistentTrayShell || (isHybridShell && isHybridTrayVisible);
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

  useEffect(() => {
    isChatInteractiveRef.current = isChatInteractive;
  }, [isChatInteractive]);

  const clearUnreadTrayActivity = useCallback(() => {
    setHasUnreadTrayActivity(false);
  }, []);

  const markUnreadTrayActivity = useCallback(() => {
    if (isChatInteractiveRef.current) {
      return;
    }

    setHasUnreadTrayActivity(true);
  }, []);

  const openChat = useCallback(() => {
    if (isReviewFlow && !isTrayStyleShell) {
      return;
    }

    if (isHybridShell && !isHybridTrayVisible && !isChatOpen) {
      resetChatPanelState();
    }

    clearUnreadTrayActivity();
    setIsChatTrayOpeningBridgeVisible(
      isPersistentTrayShell || (isHybridShell && isHybridTrayVisible),
    );
    openChatPanel();
  }, [
    clearUnreadTrayActivity,
    isChatOpen,
    isHybridShell,
    isHybridTrayVisible,
    isPersistentTrayShell,
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

    clearUnreadTrayActivity();
    setIsChatTrayOpeningBridgeVisible(
      isPersistentTrayShell || (isHybridShell && isHybridTrayVisible),
    );
    setChatPanelVariant("expanded");
    openChatPanel();
  }, [
    clearUnreadTrayActivity,
    isChatOpen,
    isHybridShell,
    isHybridTrayVisible,
    isPersistentTrayShell,
    isReviewFlow,
    isTrayStyleShell,
    openChatPanel,
    resetChatPanelState,
  ]);

  useEffect(() => {
    if (!openContactSalesOnLoad || hasOpenedContactSalesOnLoadRef.current) {
      return;
    }

    hasOpenedContactSalesOnLoadRef.current = true;
    openChat();
  }, [openChat, openContactSalesOnLoad]);

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

    setIsEndChatFeedbackOpen(false);
    setChatPanelVariant("collapsed");
    setIsChatTrayOpeningBridgeVisible(false);
    setIsHybridTrayVisible(isHybridShell);
    closeChatPanel();
  }, [closeChatPanel, isHybridShell, isReviewFlow, isTrayStyleShell]);

  const showEndChatFeedback = useCallback(() => {
    clearUnreadTrayActivity();
    setIsEndChatFeedbackOpen(true);
    setIsChatTrayOpeningBridgeVisible(
      isPersistentTrayShell || (isHybridShell && isHybridTrayVisible),
    );
    openChatPanel();
  }, [
    clearUnreadTrayActivity,
    isHybridShell,
    isHybridTrayVisible,
    isPersistentTrayShell,
    openChatPanel,
  ]);

  const requestCloseChat = useCallback(() => {
    if (isReviewFlow && !isTrayStyleShell) {
      setIsReviewSidePanelOpen(false);
      router.push(homeHref);
      return;
    }

    if (isEndChatFeedbackOpen) {
      closeChat();
      return;
    }

    const isHybridDockedTrayClose =
      isHybridShell &&
      isHybridTrayVisible &&
      chatPanelPresence === "closed";

    if (
      (chatPanelPresence === "closed" || chatPanelPresence === "exiting") &&
      !isHybridDockedTrayClose
    ) {
      return;
    }

    if (!isReviewFlow && !isChatConversationStarted) {
      closeChat();
      return;
    }

    showEndChatFeedback();
  }, [
    chatPanelPresence,
    closeChat,
    homeHref,
    isEndChatFeedbackOpen,
    isChatConversationStarted,
    isHybridShell,
    isHybridTrayVisible,
    isReviewFlow,
    isTrayStyleShell,
    router,
    showEndChatFeedback,
  ]);

  const cancelEndChatFeedback = useCallback(() => {
    setIsEndChatFeedbackOpen(false);
  }, []);

  const confirmEndChat = useCallback(() => {
    setIsEndChatFeedbackOpen(false);
    closeChat();
  }, [closeChat]);

  const handleConversationStart = useCallback(() => {
    setIsChatConversationStarted(true);
  }, []);

  const requestHeaderNavigation = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: HiringHeaderNavHref) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      if (!isChatConversationStarted) {
        return;
      }

      event.preventDefault();
      setPendingLeaveHref(href);
    },
    [isChatConversationStarted],
  );

  const cancelLeavePageDialog = useCallback(() => {
    setPendingLeaveHref(null);
  }, []);

  const confirmLeavePage = useCallback(() => {
    if (!pendingLeaveHref) {
      return;
    }

    const href = pendingLeaveHref;

    setPendingLeaveHref(null);
    router.push(href);
  }, [pendingLeaveHref, router]);

  useEffect(() => {
    if (!isChatPanelMounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isEndChatFeedbackOpen || pendingLeaveHref) {
          return;
        }

        requestCloseChat();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isChatPanelMounted,
    isEndChatFeedbackOpen,
    pendingLeaveHref,
    requestCloseChat,
  ]);

  useEffect(() => {
    if (!isChatTrayOpeningBridgeVisible || chatPanelPresence !== "open") {
      return;
    }

    const bridgeTimer = window.setTimeout(() => {
      setIsChatTrayOpeningBridgeVisible(false);
    }, CHAT_PANEL_TRAY_TRANSITION_MS);

    return () => {
      window.clearTimeout(bridgeTimer);
    };
  }, [chatPanelPresence, isChatTrayOpeningBridgeVisible]);

  return (
    <main className="-mt-28 min-h-dvh bg-white sm:-mt-32">
      <HiringHeader
        homeHref={homeHref}
        isChatOpen={isChatOpen}
        chatPanelId={chatPanelId}
        onContactSales={openChat}
        onNavItemClick={requestHeaderNavigation}
      />

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

      {isChatTrayShellVisible && shouldRenderChatTray ? (
        <ChatTray
          variant={chatPanelVariant}
          aria-controls={chatPanelId}
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-hidden={isChatTrayOpeningBridgeActive}
          aria-label="Open AI Concierge chat"
          badge={hasUnreadTrayActivity}
          className={[
            "fixed bottom-0 left-4 right-4 z-40 mx-auto w-[calc(100vw_-_32px)] max-w-[var(--design-layout-chat-tray-width)] md:left-auto md:right-6 md:mx-0 md:w-[min(calc(100vw_-_48px),var(--design-layout-chat-tray-width))]",
            isChatTrayOpeningBridgeActive ? "pointer-events-none" : "",
          ].join(" ")}
          identity={trayIdentity}
          inert={isChatTrayOpeningBridgeActive}
          onOpen={openChat}
          onVariantToggle={
            isHybridShell || isPersistentTrayShell ? undefined : openChatExpanded
          }
          openActionPosition={
            isPersistentTrayShell ? "after-variant" : undefined
          }
          onClose={isHybridShell ? requestCloseChat : undefined}
          showCloseAction={isHybridShell}
          showAiMark={false}
          trayHeight="header"
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
                  ? chatPanelPresence === "entering" ||
                    chatPanelPresence === "closed"
                    ? "transition-none"
                    : "transition-transform duration-[var(--design-motion-duration-slow)]"
                  : "transition-[opacity,transform] duration-[var(--design-motion-duration-moderate)]",
                isChatInteractive
                  ? "translate-y-0 opacity-100"
                  : isTrayStyleShell &&
                      usesHeaderDockMotion &&
                      (chatPanelPresence === "entering" ||
                        chatPanelPresence === "exiting")
                    ? "pointer-events-none chat-panel-header-dock-offset opacity-100"
                  : isTrayStyleShell
                    ? "pointer-events-none translate-y-full opacity-100"
                    : "pointer-events-none translate-y-[var(--design-motion-distance-surface-y)] opacity-0",
              ].join(" ")}
            >
              {reviewFlow ? (
                <FlowReviewChatPanel
                  className={chatPanelFrameClass}
                  flow={reviewFlow}
                  initialMediumAvailableHandoffState={
                    reviewMediumHandoffState
                  }
                  variant={chatPanelVariant}
                  onClose={requestCloseChat}
                  onMinimizeToTray={
                    isPersistentTrayShell || isHybridShell
                      ? minimizeChatToTray
                      : undefined
                  }
                  onVariantToggle={toggleChatPanelVariant}
                  showCloseAction
                  showHeaderAiMark={false}
                  onHeaderIdentityChange={setTrayIdentity}
                  onUnreadActivity={markUnreadTrayActivity}
                  onSidePanelOpenChange={setIsReviewSidePanelOpen}
                />
              ) : (
                <ConciergePanel
                  contactSalesEntry={contactSalesEntry}
                  className={chatPanelFrameClass}
                  variant={chatPanelVariant}
                  onClose={requestCloseChat}
                  onMinimizeToTray={
                    isPersistentTrayShell || isHybridShell
                      ? minimizeChatToTray
                      : undefined
                  }
                  onVariantToggle={toggleChatPanelVariant}
                  showCloseAction
                  showHeaderAiMark={false}
                  onUnreadActivity={markUnreadTrayActivity}
                  onSidePanelOpenChange={setIsReviewSidePanelOpen}
                  onConversationStart={handleConversationStart}
                  onSessionEnd={closeChat}
                  endFeedbackScreen={
                    isEndChatFeedbackOpen ? (
                      <ChatEndFeedbackScreen
                        onBackToChat={cancelEndChatFeedback}
                        onEndChat={confirmEndChat}
                      />
                    ) : undefined
                  }
                />
              )}
            </div>
          </div>
        </>
      ) : null}

      <ConfirmationDialog
        open={Boolean(pendingLeaveHref)}
        title="Leave this page?"
        confirmLabel="Leave page"
        cancelLabel="Stay in chat"
        onConfirm={confirmLeavePage}
        onCancel={cancelLeavePageDialog}
        onDismiss={cancelLeavePageDialog}
      >
        <p className="m-0">Leaving will clear this chat.</p>
      </ConfirmationDialog>
    </main>
  );
}
