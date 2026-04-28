"use client";

import { Button } from "@/components/primitives/button";
import { Icon } from "@/components/primitives/icon";

const conciergeFabNudges = {
  "use-case": "Not sure which option fits? I can help.",
  goals: "I can help make sense of your goals.",
  plans: "Want help comparing these plans?",
} as const;

type PremiumConciergeFabContext = keyof typeof conciergeFabNudges;

export function PremiumConciergeFab({
  chatPanelId,
  context,
  isChatOpen = false,
  onClick,
}: Readonly<{
  chatPanelId?: string;
  context: PremiumConciergeFabContext;
  isChatOpen?: boolean;
  onClick: () => void;
}>) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-20 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-sm md:bottom-6 md:right-8">
      <p className="hidden max-w-[232px] rounded-sm border border-ai-border bg-ai-background-soft px-md py-sm text-right text-body-sm text-text shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:block">
        {conciergeFabNudges[context]}
      </p>

      <Button
        aria-label="Help me pick"
        aria-controls={chatPanelId}
        aria-expanded={isChatOpen}
        aria-haspopup="dialog"
        variant="secondary"
        leadingIcon={<Icon name="signal-ai" />}
        className="pointer-events-auto shadow-[0_8px_24px_rgba(0,0,0,0.16)] max-sm:w-12 max-sm:gap-0 max-sm:px-0 max-sm:[&>span:last-child]:sr-only"
        onClick={onClick}
      >
        Help me pick
      </Button>
    </div>
  );
}
