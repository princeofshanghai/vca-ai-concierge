import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  isPremiumReviewFlowId,
  premiumConversationFlows,
  premiumReviewFlowIds,
  PremiumSurveyPage,
} from "@/components/premium";
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
      description:
        "Prototype survey landing surface for the LinkedIn Premium AI concierge experience.",
    });
  }

  return createPageMetadata({
    title: `Premium Concierge: ${premiumConversationFlows[signal].label}`,
    description:
      "Static signal-based Premium AI concierge transcript prototype.",
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
