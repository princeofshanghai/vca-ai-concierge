import type { Metadata } from "next";

import { HiringBlankPage } from "@/components/landing/hiring-blank-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Resources & Support",
  description:
    "Prototype placeholder for LinkedIn Hiring resources and support.",
});

export default function HiringResourcesSupportPage() {
  return <HiringBlankPage />;
}
