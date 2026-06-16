import type { Metadata } from "next";

import { PremiumCompanyPagesPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Old Admin View",
  description:
    "Archived Premium Company Page admin prototype with insight-card based AI surfaces.",
});

export default function PremiumCompanyPagesOldAdminRoute() {
  return <PremiumCompanyPagesPage key="old-dashboard" story="old" />;
}
