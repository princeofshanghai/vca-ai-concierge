import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { getMediumFlowReview } from "@/lib/conversation-flows";
import { getHiringShellMode } from "@/lib/hiring-shell";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Hiring Concierge — Live Sales Unavailable",
  description: "Design for the flow when live sales support is unavailable.",
  robots: {
    index: false,
    follow: false,
  },
});

type MediumUnavailableFlowPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function MediumUnavailableFlowPage({
  searchParams,
}: MediumUnavailableFlowPageProps) {
  const { shell } = await searchParams;
  const shellMode = getHiringShellMode(shell);

  return (
    <LandingPage
      reviewFlow={getMediumFlowReview("unavailable")}
      shellMode={shellMode}
    />
  );
}
