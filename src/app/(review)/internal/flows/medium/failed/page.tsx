import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { getMediumFlowReview } from "@/lib/conversation-flows";
import { getHiringShellMode } from "@/lib/hiring-shell";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Hiring Concierge — Connection Failed",
  description: "Design for the flow when a live sales connection fails.",
  robots: {
    index: false,
    follow: false,
  },
});

type MediumFailedFlowPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function MediumFailedFlowPage({
  searchParams,
}: MediumFailedFlowPageProps) {
  const { shell } = await searchParams;
  const shellMode = getHiringShellMode(shell);

  return (
    <LandingPage
      reviewFlow={getMediumFlowReview("failed")}
      reviewMediumHandoffState="failed"
      shellMode={shellMode}
    />
  );
}
