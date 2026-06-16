import type { Metadata } from "next";

import { PremiumCompanyPagesAdminInboxPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages Admin Inbox",
  description:
    "Scripted Premium Company Page inbox prototype with VCA context and suggested replies.",
});

export default function PremiumCompanyPagesAdminInboxRoute() {
  return <PremiumCompanyPagesAdminInboxPage />;
}
