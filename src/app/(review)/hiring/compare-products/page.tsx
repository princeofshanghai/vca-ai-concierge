import type { Metadata } from "next";

import { HiringBlankPage } from "@/components/landing";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Compare Products",
  description: "Prototype placeholder for LinkedIn Hiring product comparison.",
});

export default function HiringCompareProductsPage() {
  return <HiringBlankPage />;
}
