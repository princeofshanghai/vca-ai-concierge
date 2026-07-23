import type { Metadata } from "next";

import { VcaEcosystemHelpCenterPage } from "@/components/vca-ecosystem/vca-ecosystem-help-center-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "VCA Ecosystem",
  description: "Design explorations for AI concierge experiences across products.",
});

export default function VcaEcosystemRoute() {
  return <VcaEcosystemHelpCenterPage />;
}
