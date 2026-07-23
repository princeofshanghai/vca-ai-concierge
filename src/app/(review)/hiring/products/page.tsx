import type { Metadata } from "next";

import { HiringBlankPage } from "@/components/landing/hiring-blank-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Hiring Products",
  description: "Design for browsing Hiring products.",
});

export default function HiringProductsPage() {
  return <HiringBlankPage />;
}
