import type { Metadata } from "next";

import { PremiumCompanyPagesAdminAnalyticsPage } from "@/components/premium-company-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Admin Analytics",
  description:
    "Scripted Premium Company Page analytics prototype for Velora admin content performance.",
});

export default function PremiumCompanyPagesAdminAnalyticsRoute() {
  return <PremiumCompanyPagesAdminAnalyticsPage />;
}
