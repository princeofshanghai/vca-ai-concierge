import type { Metadata } from "next";

import { VcaEcosystemHelpCenterPage } from "@/components/vca-ecosystem/vca-ecosystem-help-center-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "VCA Ecosystem",
  description: "Collection of near term VCA UI optimization projects.",
});

export default function VcaEcosystemRoute() {
  return <VcaEcosystemHelpCenterPage />;
}
