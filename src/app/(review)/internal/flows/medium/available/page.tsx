import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { getMediumFlowReview } from "@/lib/conversation-flows";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Medium Flow - Available",
  description:
    "Internal chat panel review for the medium AI concierge flow when a specialist is available.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function MediumAvailableFlowPage() {
  return <LandingPage reviewFlow={getMediumFlowReview("available")} />;
}
