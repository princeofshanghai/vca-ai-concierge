import type { Metadata } from "next";

import { PremiumSurveyPage } from "@/components/premium/premium-survey-page";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumShellMode } from "@/lib/premium-shell";

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
  const shellMode = getPremiumShellMode(shell);

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
