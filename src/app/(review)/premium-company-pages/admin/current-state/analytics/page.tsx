import type { Metadata } from "next";

import { PremiumCompanyPagesAdminAnalyticsPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages — Current Analytics",
  description: "Current Page analytics design used as the comparison baseline.",
});

export default function PremiumCompanyPagesCurrentStateAnalyticsRoute() {
  return <PremiumCompanyPagesAdminAnalyticsPage story="current-state" />;
}
