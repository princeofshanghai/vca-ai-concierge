import type { Metadata } from "next";

import { PremiumSurveyPage } from "@/components/premium/premium-survey-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Upsell Survey",
  description:
    "Project-specific survey route for the Premium upsell in Help Center prototype.",
});

export default function PremiumUpsellSurveyRoute() {
  return <PremiumSurveyPage />;
}
