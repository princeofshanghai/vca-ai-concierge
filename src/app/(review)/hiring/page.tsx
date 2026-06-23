import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { getHiringShellMode } from "@/lib/hiring-shell";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "LTS Hiring Concierge",
  description:
    "Prototype landing surface for the LinkedIn Hiring AI concierge experience.",
});

type HiringPrototypePageProps = Readonly<{
  searchParams: Promise<{
    callbackForm?: string | ReadonlyArray<string>;
    contactSales?: string | ReadonlyArray<string>;
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function HiringPrototypePage({
  searchParams,
}: HiringPrototypePageProps) {
  const { callbackForm, contactSales, shell } = await searchParams;
  const callbackFormValue = Array.isArray(callbackForm)
    ? callbackForm[0]
    : callbackForm;
  const contactSalesValue = Array.isArray(contactSales)
    ? contactSales[0]
    : contactSales;
  const shellMode = getHiringShellMode(shell);

  return (
    <LandingPage
      contactSalesEntry={callbackFormValue === "off" ? "default" : "lix-test"}
      openContactSalesOnLoad={contactSalesValue === "open"}
      shellMode={shellMode}
    />
  );
}
