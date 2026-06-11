import type { Metadata } from "next";

import { PremiumCompanyPagesAdminAiAssistantSettingsPage } from "@/components/premium-company-pages";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Manage AI Assistant",
  description:
    "Placeholder Premium Company Page AI assistant settings prototype.",
});

export default function PremiumCompanyPagesAdminAiAssistantSettingsRoute() {
  return <PremiumCompanyPagesAdminAiAssistantSettingsPage />;
}
