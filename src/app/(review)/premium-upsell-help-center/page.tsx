import type { Metadata } from "next";

import { VcaEcosystemHelpCenterPage } from "@/components/vca-ecosystem/vca-ecosystem-help-center-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Upsell — Help Center",
  description: "Design prototype for Premium upsell in Help Center.",
});

type PremiumUpsellHelpCenterRouteProps = Readonly<{
  searchParams: Promise<{
    upmSignal?: string | ReadonlyArray<string>;
  }>;
}>;

function getUpmSignalParam(value: string | ReadonlyArray<string> | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PremiumUpsellHelpCenterRoute({
  searchParams,
}: PremiumUpsellHelpCenterRouteProps) {
  const { upmSignal } = await searchParams;
  const upmSignalParam = getUpmSignalParam(upmSignal);

  return (
    <VcaEcosystemHelpCenterPage
      premiumUpsellBadgeAction={
        upmSignalParam === "high" ? "open-premium-chat" : undefined
      }
      premiumUpsellBadgeHref={
        upmSignalParam === "low"
          ? "/premium-upsell-help-center/survey?upmSignal=low"
          : undefined
      }
      showPremiumUpsellBadge
    />
  );
}
