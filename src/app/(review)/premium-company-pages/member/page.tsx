import type { Metadata } from "next";

import { PremiumCompanyPagesMemberPage } from "@/components/premium-company-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Member View",
  description:
    "Customer-facing Premium Company Page prototype for the Premium Company Pages AI chat experience.",
});

type PremiumCompanyPagesMemberRouteProps = Readonly<{
  searchParams: Promise<{
    vcaShell?: string | ReadonlyArray<string>;
  }>;
}>;

function getVcaShellMode(value?: string | ReadonlyArray<string>) {
  const shellMode = Array.isArray(value) ? value[0] : value;

  if (shellMode === "drawer") {
    return "drawer";
  }

  return shellMode === "rail" ? "rail" : "hybrid";
}

export default async function PremiumCompanyPagesMemberRoute({
  searchParams,
}: PremiumCompanyPagesMemberRouteProps) {
  const { vcaShell } = await searchParams;

  return <PremiumCompanyPagesMemberPage shellMode={getVcaShellMode(vcaShell)} />;
}
