import type { Metadata } from "next";

import { PremiumCompanyPagesPlaceholder } from "@/components/premium-company-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages",
  description:
    "Visionary prototype placeholder for the Premium Company Pages AI chat experience.",
});

export default function PremiumCompanyPagesPage() {
  return <PremiumCompanyPagesPlaceholder />;
}
