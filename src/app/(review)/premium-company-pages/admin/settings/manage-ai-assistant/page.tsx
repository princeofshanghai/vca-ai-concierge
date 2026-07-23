import type { Metadata } from "next";

import { PremiumCompanyPagesAdminAiAssistantSettingsPage } from "@/components/premium-company-pages/premium-company-pages-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Manage AI Assistant",
  description: "Design for managing a Page's AI assistant.",
});

export default function PremiumCompanyPagesAdminAiAssistantSettingsRoute() {
  return <PremiumCompanyPagesAdminAiAssistantSettingsPage />;
}
