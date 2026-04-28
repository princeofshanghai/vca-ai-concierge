import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { flowReviews } from "@/lib/conversation-flows";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "High Flow",
  description: "Internal chat panel review for the high AI concierge flow.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function HighFlowPage() {
  return <LandingPage reviewFlow={flowReviews.high} />;
}
