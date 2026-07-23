import type { Metadata } from "next";

import { PremiumCompanyPagesAdminSettingsPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages — Settings",
  description: "Design for setting up and managing the AI assistant.",
});

export default function PremiumCompanyPagesAdminSettingsRoute() {
  return <PremiumCompanyPagesAdminSettingsPage />;
}
