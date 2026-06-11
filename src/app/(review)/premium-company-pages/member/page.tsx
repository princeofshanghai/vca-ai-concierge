import type { Metadata } from "next";

import {
  PremiumCompanyPagesMemberPage,
  type PremiumCompanyPagesMemberStory,
  type VcaMemberIntent,
  type VcaShellMode,
} from "@/components/premium-company-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Visitor View",
  description:
    "Visitor-facing Premium Company Page prototype for the Premium Company Pages AI chat experience.",
});

type PremiumCompanyPagesMemberRouteProps = Readonly<{
  searchParams: Promise<{
    story?: string | ReadonlyArray<string>;
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

  if (shellMode === "fab-icon") {
    return "fab-icon";
  }

  if (shellMode === "fab-pill" || shellMode === "fab") {
    return "fab";
  }

  return "fab-icon";
}

function getVcaMemberIntent(): VcaMemberIntent {
  return "buyer";
}

function getMemberStory(
  value?: string | ReadonlyArray<string>,
): PremiumCompanyPagesMemberStory {
  const story = Array.isArray(value) ? value[0] : value;

  return story === "live-support" ? "live-support" : "default";
}

export default async function PremiumCompanyPagesMemberRoute({
  searchParams,
}: PremiumCompanyPagesMemberRouteProps) {
  const { story, vcaShell } = await searchParams;
  const memberIntent = getVcaMemberIntent();
  const memberStory = getMemberStory(story);
  const shellMode = getVcaShellMode(vcaShell);

  return (
    <PremiumCompanyPagesMemberPage
      key={`${memberIntent}:${shellMode}:${memberStory}`}
      memberIntent={memberIntent}
      shellMode={shellMode}
      story={memberStory}
    />
  );
}
