import type { Metadata } from "next";

import { HiringBlankPage } from "@/components/landing/hiring-blank-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Compare Hiring Products",
  description: "Design for comparing Hiring products.",
});

export default function HiringCompareProductsPage() {
  return <HiringBlankPage />;
}
