import type { Metadata } from "next";

import { OnlineJobsPage } from "@/components/vca-ecosystem/online-jobs-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "VCA Ecosystem — Online Jobs",
  description: "Design for an AI concierge in the Online Jobs experience.",
});

export default function OnlineJobsRoute() {
  return <OnlineJobsPage />;
}
