import type { Metadata } from "next";

import { PremiumCompanyPagesPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages — Earlier Concept",
  description: "Earlier design exploration for the Page admin experience.",
});

export default function PremiumCompanyPagesOldAdminRoute() {
  return <PremiumCompanyPagesPage key="old-dashboard" story="old" />;
}
