import type { Metadata } from "next";

import { HiringFlowMap } from "@/components/flow-map";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Hiring Concierge — Flow Map",
  description: "Design overview of the Hiring Concierge flows and states.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function HiringFlowMapPage() {
  return <HiringFlowMap />;
}
