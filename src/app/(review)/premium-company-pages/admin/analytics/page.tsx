import type { Metadata } from "next";

import { PremiumCompanyPagesAdminAnalyticsPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Admin Analytics",
  description:
    "Scripted Premium Company Page analytics prototype for Velora admin content performance.",
});

type PremiumCompanyPagesAdminAnalyticsRouteProps = Readonly<{
  searchParams: Promise<{
    story?: string | ReadonlyArray<string>;
  }>;
}>;

function getStoryParam(value: string | ReadonlyArray<string> | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PremiumCompanyPagesAdminAnalyticsRoute({
  searchParams,
}: PremiumCompanyPagesAdminAnalyticsRouteProps) {
  const { story } = await searchParams;
  const storyParam = getStoryParam(story);

  return <PremiumCompanyPagesAdminAnalyticsPage story={storyParam} />;
}
