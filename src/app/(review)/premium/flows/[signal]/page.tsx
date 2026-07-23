import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  isPremiumReviewFlowId,
  premiumConversationFlows,
  premiumReviewFlowIds,
} from "@/components/premium/premium-concierge-flows";
import { PremiumSurveyPage } from "@/components/premium/premium-survey-page";
import { createPageMetadata } from "@/lib/metadata";
import { getPremiumShellMode } from "@/lib/premium-shell";

type PremiumReviewFlowPageProps = Readonly<{
  params: Promise<{
    signal: string;
  }>;
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export function generateStaticParams() {
  return premiumReviewFlowIds.map((signal) => ({ signal }));
}

export async function generateMetadata({
  params,
}: PremiumReviewFlowPageProps): Promise<Metadata> {
  const { signal } = await params;

  if (!isPremiumReviewFlowId(signal)) {
    return createPageMetadata({
      title: "Premium Concierge",
      description: "Design prototype for the Premium AI concierge.",
    });
  }

  return createPageMetadata({
    title: `Premium Concierge — ${signal === "low" ? "Low Signal" : "High Signal"}`,
    description:
      signal === "low"
        ? "Design flow for a concierge with limited member context."
        : "Design flow for a concierge with strong member context.",
  });
}

export default async function PremiumReviewFlowPage({
  params,
  searchParams,
}: PremiumReviewFlowPageProps) {
  const { signal } = await params;
  const { shell } = await searchParams;
  const shellMode = getPremiumShellMode(shell);

  if (!isPremiumReviewFlowId(signal)) {
    notFound();
  }

  const flow = premiumConversationFlows[signal];

  return (
    <PremiumSurveyPage
      key={flow.id}
      initialStep={flow.surveyStep}
      initialUseCaseOption={flow.selectedUseCaseOption}
      initialGoalOptions={flow.selectedGoalOptions}
      initialChatOpen={flow.initialChatOpen ?? true}
      conciergeNudge={flow.conciergeNudge}
      conversationFlow={flow}
      shellMode={shellMode}
    />
  );
}
