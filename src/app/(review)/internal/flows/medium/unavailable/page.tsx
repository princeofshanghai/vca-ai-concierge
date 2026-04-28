import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { getMediumFlowReview } from "@/lib/conversation-flows";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Medium Flow - Unavailable",
  description:
    "Internal chat panel review for the medium AI concierge scheduled specialist flow.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function MediumUnavailableFlowPage() {
  return <LandingPage reviewFlow={getMediumFlowReview("unavailable")} />;
}
