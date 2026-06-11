import type { Metadata } from "next";

import { PremiumCompanyPagesAdminSettingsPage } from "@/components/premium-company-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Admin Settings",
  description:
    "Scripted Premium Company Page admin settings prototype for VCA onboarding.",
});

export default function PremiumCompanyPagesAdminSettingsRoute() {
  return <PremiumCompanyPagesAdminSettingsPage />;
}
