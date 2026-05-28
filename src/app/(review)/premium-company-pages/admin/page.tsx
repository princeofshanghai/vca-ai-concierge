import type { Metadata } from "next";

import { PremiumCompanyPagesPage } from "@/components/premium-company-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Admin View",
  description:
    "Admin-facing Premium Company Page dashboard prototype for the Premium Company Pages AI chat experience.",
});

export default function PremiumCompanyPagesAdminRoute() {
  return <PremiumCompanyPagesPage />;
}
