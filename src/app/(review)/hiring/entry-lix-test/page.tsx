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
    contactSales?: string | ReadonlyArray<string>;
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function HiringEntryLixTestPage({
  searchParams,
}: HiringEntryLixTestPageProps) {
  const { contactSales, shell } = await searchParams;
  const contactSalesValue = Array.isArray(contactSales)
    ? contactSales[0]
    : contactSales;
  const shellMode = getHiringShellMode(shell);

  return (
    <LandingPage
      contactSalesEntry="lix-test"
      homeHref="/hiring/entry-lix-test"
      openContactSalesOnLoad={contactSalesValue === "open"}
      shellMode={shellMode}
    />
  );
}
