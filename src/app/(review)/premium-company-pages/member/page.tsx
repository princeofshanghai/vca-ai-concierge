import type { Metadata } from "next";

import {
  PremiumCompanyPagesMemberPage,
  type VcaMemberIntent,
  type VcaShellMode,
} from "@/components/premium-company-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Member View",
  description:
    "Customer-facing Premium Company Page prototype for the Premium Company Pages AI chat experience.",
});

type PremiumCompanyPagesMemberRouteProps = Readonly<{
  searchParams: Promise<{
    vcaIntent?: string | ReadonlyArray<string>;
    vcaShell?: string | ReadonlyArray<string>;
  }>;
}>;

function getVcaShellMode(
  value?: string | ReadonlyArray<string>,
): VcaShellMode {
  const shellMode = Array.isArray(value) ? value[0] : value;

  if (shellMode === "tray") {
    return "tray";
  }

  return "fab";
}

function getVcaMemberIntent(
  value?: string | ReadonlyArray<string>,
): VcaMemberIntent {
  const intent = Array.isArray(value) ? value[0] : value;

  return intent === "job-seeker" ? "job-seeker" : "buyer";
}

export default async function PremiumCompanyPagesMemberRoute({
  searchParams,
}: PremiumCompanyPagesMemberRouteProps) {
  const { vcaIntent, vcaShell } = await searchParams;
  const memberIntent = getVcaMemberIntent(vcaIntent);
  const shellMode = getVcaShellMode(vcaShell);

  return (
    <PremiumCompanyPagesMemberPage
      key={`${memberIntent}:${shellMode}`}
      memberIntent={memberIntent}
      shellMode={shellMode}
    />
  );
}
