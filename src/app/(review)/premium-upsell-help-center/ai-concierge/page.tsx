import type { Metadata } from "next";

import { VcaEcosystemHelpCenterPage } from "@/components/vca-ecosystem/vca-ecosystem-help-center-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Upsell AI Concierge",
  description:
    "AI concierge signal variants for the Premium upsell in Help Center prototype.",
});

type PremiumUpsellAiConciergeRouteProps = Readonly<{
  searchParams: Promise<{
    signal?: string | ReadonlyArray<string>;
  }>;
}>;

function getSignalParam(value: string | ReadonlyArray<string> | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PremiumUpsellAiConciergeRoute({
  searchParams,
}: PremiumUpsellAiConciergeRouteProps) {
  const { signal } = await searchParams;
  const signalParam = getSignalParam(signal);

  return (
    <VcaEcosystemHelpCenterPage
      premiumUpsellBadgeAction={
        signalParam === "low"
          ? "open-premium-low-signal-chat"
          : "open-premium-chat"
      }
      premiumUpsellInitialChatVariant="expanded"
      premiumUpsellStartChatAction={
        signalParam === "low" ? undefined : "open-premium-inmail-support-chat"
      }
      premiumUpsellStartChatVariant="expanded"
      showPremiumUpsellBadge
    />
  );
}
