import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { getHiringShellMode } from "@/lib/hiring-shell";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Entry LIX Test | LTS Hiring Concierge",
  description:
    "Review prototype for the LinkedIn Hiring Contact sales entry test.",
});

type HiringEntryLixTestPageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function HiringEntryLixTestPage({
  searchParams,
}: HiringEntryLixTestPageProps) {
  const { shell } = await searchParams;
  const shellMode = getHiringShellMode(shell);

  return (
    <LandingPage
      contactSalesEntry="lix-test"
      homeHref="/hiring/entry-lix-test"
      shellMode={shellMode}
    />
  );
}
