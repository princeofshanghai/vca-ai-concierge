import type { Metadata } from "next";

import { PremiumCompanyPagesAdminAnalyticsPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Current State Analytics",
  description:
    "Baseline Premium Company Page analytics prototype without contextual VCA prompt chips.",
});

export default function PremiumCompanyPagesCurrentStateAnalyticsRoute() {
  return <PremiumCompanyPagesAdminAnalyticsPage story="current-state" />;
}
