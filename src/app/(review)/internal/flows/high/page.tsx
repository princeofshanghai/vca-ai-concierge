import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { flowReviews } from "@/lib/conversation-flows";
import { getHiringShellMode } from "@/lib/hiring-shell";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Hiring Concierge — High Flow",
  description: "Design for the high-intent concierge flow.",
  robots: {
    index: false,
    follow: false,
  },
});

type HighFlowPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function HighFlowPage({
  searchParams,
}: HighFlowPageProps) {
  const { shell } = await searchParams;
  const shellMode = getHiringShellMode(shell);

  return <LandingPage reviewFlow={flowReviews.high} shellMode={shellMode} />;
}
