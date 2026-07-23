import type { Metadata } from "next";

import { PremiumSurveyPage } from "@/components/premium/premium-survey-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Upsell — Survey",
  description: "Design for the Premium recommendation survey.",
});

export default function PremiumUpsellSurveyRoute() {
  return <PremiumSurveyPage />;
}
