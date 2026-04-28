import type { Metadata } from "next";

import { PremiumSurveyPage } from "@/components/premium";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Concierge",
  description:
    "Prototype survey landing surface for the LinkedIn Premium AI concierge experience.",
});

export default function PremiumPage() {
  return <PremiumSurveyPage />;
}
