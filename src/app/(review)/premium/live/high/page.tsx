import type { Metadata } from "next";

import { PremiumSurveyPage } from "@/components/premium";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Concierge: High signal (interactive)",
  description:
    "Interactive high-signal Premium AI concierge recommendation prototype.",
});

export default function PremiumHighSignalLivePage() {
  return (
    <PremiumSurveyPage
      initialStep="plans"
      initialUseCaseOption="job"
      initialGoalOptions={["expand-network", "new-leads", "hire"]}
      initialChatOpen
      liveMode="high-signal"
    />
  );
}
