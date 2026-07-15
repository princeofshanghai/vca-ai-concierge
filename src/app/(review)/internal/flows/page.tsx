import type { Metadata } from "next";

import { HiringFlowMap } from "@/components/flow-map";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Hiring Flow Map",
  description:
    "Internal canvas overview of the Hiring AI Concierge journeys and states.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function HiringFlowMapPage() {
  return <HiringFlowMap />;
}
