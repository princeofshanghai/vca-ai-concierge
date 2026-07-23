import type { Metadata } from "next";

import { PremiumCompanyPagesAdminInboxPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Company Pages — Inbox",
  description: "Design for AI-supported Page inbox experiences.",
});

export default function PremiumCompanyPagesAdminInboxRoute() {
  return <PremiumCompanyPagesAdminInboxPage />;
}
