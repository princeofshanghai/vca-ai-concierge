"use client";

import { Button } from "@/components/primitives/button";
import { Icon } from "@/components/primitives/icon";

export function PremiumConciergeFab({
  chatPanelId,
  isChatOpen = false,
  onClick,
  position = "fixed",
}: Readonly<{
  chatPanelId?: string;
  isChatOpen?: boolean;
  onClick: () => void;
  position?: "fixed" | "static";
}>) {
  return (
    <div
      className={[
        "pointer-events-none flex max-w-[calc(100vw-3rem)] items-center",
        position === "fixed"
          ? "fixed bottom-6 right-6 z-20 md:bottom-8 md:right-10"
          : "relative justify-end",
      ].join(" ")}
    >
      <Button
        aria-label="Help me decide"
        aria-controls={chatPanelId}
        aria-expanded={isChatOpen}
        aria-haspopup="dialog"
        variant="secondary"
        leadingIcon={<Icon name="signal-ai" />}
        className="pointer-events-auto !bg-transparent !shadow-raised hover:!bg-action-background-transparent-hover active:!bg-action-background-transparent-active max-sm:w-12 max-sm:gap-0 max-sm:px-0 max-sm:[&>span:last-child]:sr-only"
        onClick={onClick}
      >
        Help me decide
      </Button>
    </div>
  );
}
