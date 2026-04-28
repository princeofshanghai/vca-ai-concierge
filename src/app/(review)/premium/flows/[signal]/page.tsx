import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  isPremiumSignalFlowId,
  premiumConversationFlows,
  premiumSignalFlowIds,
  PremiumSurveyPage,
} from "@/components/premium";
import { createPageMetadata } from "@/lib/metadata";

type PremiumSignalFlowPageProps = Readonly<{
  params: Promise<{
    signal: string;
  }>;
}>;

export function generateStaticParams() {
  return premiumSignalFlowIds.map((signal) => ({ signal }));
}

export async function generateMetadata({
  params,
}: PremiumSignalFlowPageProps): Promise<Metadata> {
  const { signal } = await params;

  if (!isPremiumSignalFlowId(signal)) {
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

export default async function PremiumSignalFlowPage({
  params,
}: PremiumSignalFlowPageProps) {
  const { signal } = await params;

  if (!isPremiumSignalFlowId(signal)) {
    notFound();
  }

  const flow = premiumConversationFlows[signal];

  return (
    <PremiumSurveyPage
      key={flow.id}
      initialStep={flow.surveyStep}
      initialUseCaseOption={flow.selectedUseCaseOption}
      initialGoalOptions={flow.selectedGoalOptions}
      initialChatOpen
      conversationFlow={flow}
    />
  );
}
