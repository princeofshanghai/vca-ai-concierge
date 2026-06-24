import type { Metadata } from "next";

import { OnlineJobsPage } from "@/components/vca-ecosystem/online-jobs-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Online Jobs",
  description: "Online jobs landing page prototype for the VCA ecosystem.",
});

export default function OnlineJobsRoute() {
  return <OnlineJobsPage />;
}
