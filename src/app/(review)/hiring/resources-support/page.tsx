import type { Metadata } from "next";

import { HiringBlankPage } from "@/components/landing/hiring-blank-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Hiring Resources & Support",
  description: "Design for Hiring resources and support.",
});

export default function HiringResourcesSupportPage() {
  return <HiringBlankPage />;
}
