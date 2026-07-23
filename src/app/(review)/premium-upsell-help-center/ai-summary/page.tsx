import type { Metadata } from "next";

import { VcaEcosystemHelpCenterAiSummaryPage } from "@/components/vca-ecosystem/vca-ecosystem-help-center-ai-summary-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Upsell — AI Summary",
  description: "Design for an AI summary with contextual Premium guidance.",
});

type PremiumUpsellAiSummaryRouteProps = Readonly<{
  searchParams: Promise<{
    signal?: string | ReadonlyArray<string>;
  }>;
}>;

function getSignalParam(value: string | ReadonlyArray<string> | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PremiumUpsellAiSummaryRoute({
  searchParams,
}: PremiumUpsellAiSummaryRouteProps) {
  const { signal } = await searchParams;
  const signalParam = getSignalParam(signal);

  return (
    <VcaEcosystemHelpCenterAiSummaryPage
      signal={signalParam === "low" ? "low" : "high"}
    />
  );
}
