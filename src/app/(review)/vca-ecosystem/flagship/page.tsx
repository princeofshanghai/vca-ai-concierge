import type { Metadata } from "next";

import { FlagshipPage } from "@/components/vca-ecosystem/flagship-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Flagship",
  description: "LinkedIn Flagship page shell prototype for the VCA ecosystem.",
});

export default function FlagshipRoute() {
  return <FlagshipPage />;
}
