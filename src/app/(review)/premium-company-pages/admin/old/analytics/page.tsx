import type { Metadata } from "next";

import { PremiumCompanyPagesAdminAnalyticsPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Old Admin Analytics",
  description:
    "Archived Premium Company Page analytics prototype with insight-card based AI surfaces.",
});

export default function PremiumCompanyPagesOldAdminAnalyticsRoute() {
  return <PremiumCompanyPagesAdminAnalyticsPage story="old" />;
}
