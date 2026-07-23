import type { Metadata } from "next";

import { PremiumSurveyPage } from "@/components/premium/premium-survey-page";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumShellMode } from "@/lib/premium-shell";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Concierge",
  description: "Design prototype for the Premium AI concierge.",
});

type PremiumPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function PremiumPage({ searchParams }: PremiumPageProps) {
  const { shell } = await searchParams;
  const shellMode = getPremiumShellMode(shell);

  return <PremiumSurveyPage shellMode={shellMode} />;
}
