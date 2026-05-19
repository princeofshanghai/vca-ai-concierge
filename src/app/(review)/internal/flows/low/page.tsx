import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { flowReviews } from "@/lib/conversation-flows";
import { getHiringShellMode } from "@/lib/hiring-shell";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Low Flow",
  description: "Internal chat panel review for the low AI concierge flow.",
  robots: {
    index: false,
    follow: false,
  },
});

type LowFlowPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function LowFlowPage({
  searchParams,
}: LowFlowPageProps) {
  const { shell } = await searchParams;
  const shellMode = getHiringShellMode(shell);

  return <LandingPage reviewFlow={flowReviews.low} shellMode={shellMode} />;
}
