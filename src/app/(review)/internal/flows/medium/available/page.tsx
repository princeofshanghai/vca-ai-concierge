import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { getMediumFlowReview } from "@/lib/conversation-flows";
import { getHiringShellMode } from "@/lib/hiring-shell";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Medium Flow - Available",
  description:
    "Internal chat panel review for the medium AI concierge flow when a sales consultant is available.",
  robots: {
    index: false,
    follow: false,
  },
});

type MediumAvailableFlowPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function MediumAvailableFlowPage({
  searchParams,
}: MediumAvailableFlowPageProps) {
  const { shell } = await searchParams;
  const shellMode = getHiringShellMode(shell);

  return (
    <LandingPage
      reviewFlow={getMediumFlowReview("available")}
      shellMode={shellMode}
    />
  );
}
