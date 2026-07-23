import type { Metadata } from "next";

import { FlagshipPage } from "@/components/vca-ecosystem/flagship-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "VCA Ecosystem — Flagship",
  description: "Design for an AI concierge in the core member experience.",
});

export default function FlagshipRoute() {
  return <FlagshipPage />;
}
