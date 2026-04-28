import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Prototype",
  description:
    "Prototype landing surface for the LinkedIn Hiring AI concierge experience.",
});

export default function PrototypePage() {
  return <LandingPage />;
}
