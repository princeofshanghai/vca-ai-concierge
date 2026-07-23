import type { Metadata } from "next";

import { VcaEcosystemHelpCenterSearchResultPage } from "@/components/vca-ecosystem/vca-ecosystem-help-center-search-result-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Upsell — Search Result",
  description: "Design for Premium guidance in Help Center search results.",
});

export default function PremiumUpsellSearchResultRoute() {
  return <VcaEcosystemHelpCenterSearchResultPage />;
}
