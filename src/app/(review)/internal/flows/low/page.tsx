import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { flowReviews } from "@/lib/conversation-flows";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Low Flow",
  description: "Internal chat panel review for the low AI concierge flow.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function LowFlowPage() {
  return <LandingPage reviewFlow={flowReviews.low} />;
}
