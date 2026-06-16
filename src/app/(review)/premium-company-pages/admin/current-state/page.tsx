import type { Metadata } from "next";

import { PremiumCompanyPagesPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Current State",
  description:
    "Baseline Premium Company Page admin prototype without the contextual VCA prompt layer.",
});

export default function PremiumCompanyPagesCurrentStateRoute() {
  return (
    <PremiumCompanyPagesPage
      key="current-state-dashboard"
      story="current-state"
    />
  );
}
