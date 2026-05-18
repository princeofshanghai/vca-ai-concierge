import type { Metadata } from "next";

import { PremiumSurveyPage } from "@/components/premium";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Concierge: High signal (interactive)",
  description:
    "Interactive high-signal Premium AI concierge recommendation prototype.",
});

type PremiumHighSignalLivePageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function PremiumHighSignalLivePage({
  searchParams,
}: PremiumHighSignalLivePageProps) {
  const { shell } = await searchParams;
  const shellMode = shell === "tray" ? "tray" : "fab";

  return (
    <PremiumSurveyPage
      initialStep="plans"
      initialUseCaseOption="job"
      initialGoalOptions={["expand-network", "new-leads", "hire"]}
      initialChatOpen
      liveMode="high-signal"
      shellMode={shellMode}
    />
  );
}
