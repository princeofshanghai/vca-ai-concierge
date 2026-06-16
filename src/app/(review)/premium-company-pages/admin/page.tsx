import type { Metadata } from "next";

import { PremiumCompanyPagesPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Admin View",
  description:
    "Admin-facing Premium Company Page dashboard prototype for the Premium Company Pages AI chat experience.",
});

type PremiumCompanyPagesAdminRouteProps = Readonly<{
  searchParams: Promise<{
    story?: string | ReadonlyArray<string>;
  }>;
}>;

function getStoryParam(value: string | ReadonlyArray<string> | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PremiumCompanyPagesAdminRoute({
  searchParams,
}: PremiumCompanyPagesAdminRouteProps) {
  const { story } = await searchParams;
  const storyParam = getStoryParam(story);

  return (
    <PremiumCompanyPagesPage
      key={storyParam ?? "dashboard"}
      story={storyParam}
    />
  );
}
