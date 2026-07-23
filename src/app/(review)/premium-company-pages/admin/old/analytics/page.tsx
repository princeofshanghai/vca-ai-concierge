import type { Metadata } from "next";

import { PremiumCompanyPagesAdminAnalyticsPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages — Earlier Analytics Concept",
  description: "Earlier design exploration for AI-supported Page analytics.",
});

export default function PremiumCompanyPagesOldAdminAnalyticsRoute() {
  return <PremiumCompanyPagesAdminAnalyticsPage story="old" />;
}
