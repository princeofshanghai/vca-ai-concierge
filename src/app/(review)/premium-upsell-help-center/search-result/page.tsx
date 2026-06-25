import type { Metadata } from "next";

import { VcaEcosystemHelpCenterSearchResultPage } from "@/components/vca-ecosystem/vca-ecosystem-help-center-search-result-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Upsell Search Result",
  description:
    "Search result surface for the Premium upsell in Help Center prototype.",
});

export default function PremiumUpsellSearchResultRoute() {
  return <VcaEcosystemHelpCenterSearchResultPage />;
}
