"use client";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatPanel,
  ChatThread,
  type ChatPanelVariant,
} from "@/components/chat";

import type { PremiumConversationFlow } from "./premium-concierge-flows";
import { PremiumProductRecommendationCard } from "./premium-product-recommendation-card";

export function PremiumConciergePanel({
  variant = "collapsed",
  className,
  flow,
  onClose,
  onVariantToggle,
}: Readonly<{
  variant?: ChatPanelVariant;
  className?: string;
  flow?: PremiumConversationFlow;
  onClose?: () => void;
  onVariantToggle?: () => void;
}>) {
  return (
    <ChatPanel variant={variant} className={className}>
      <ChatHeader
        variant={variant}
        onClose={onClose}
        onVariantToggle={onVariantToggle}
      />
      <ChatBody>
        {flow ? (
          <ChatThread timestamp={null} aria-label={`${flow.label} transcript`}>
            {flow.steps.map((step) => {
              if (step.kind === "product-recommendation") {
                return <PremiumProductRecommendationCard key={step.id} />;
              }

              return (
                <ChatMessage key={step.id} role={step.role}>
                  {step.content}
                </ChatMessage>
              );
            })}
          </ChatThread>
        ) : null}
      </ChatBody>
      <ChatComposer
        variant={variant}
        inputProps={{
          disabled: true,
        }}
        sendDisabled
        showVoiceMode={false}
      />
    </ChatPanel>
  );
}
