import type { Metadata } from "next";

import { VcaEcosystemHelpCenterPage } from "@/components/vca-ecosystem/vca-ecosystem-help-center-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Upsell in Help Center",
  description:
    "Prototype route for the Premium upsell in Help Center always-on banner concept.",
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
