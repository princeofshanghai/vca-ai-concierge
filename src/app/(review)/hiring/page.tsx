import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "LTS Hiring Concierge",
  description:
    "Prototype landing surface for the LinkedIn Hiring AI concierge experience.",
});

type HiringPrototypePageProps = Readonly<{
  searchParams: Promise<{
    shell?: string | ReadonlyArray<string>;
  }>;
}>;

export default async function HiringPrototypePage({
  searchParams,
}: HiringPrototypePageProps) {
  const { shell } = await searchParams;
  const shellMode =
    shell === "tray" || shell === "hybrid" ? shell : "default";

  return <LandingPage shellMode={shellMode} />;
}
