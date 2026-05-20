import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createPageMetadata } from "@/lib/metadata";

import { defaultComponentHref } from "./component-nav";

export const metadata: Metadata = createPageMetadata({
  title: "AI Concierge Components",
  description:
    "Internal review surface for the VCA AI concierge shared chat system, product surfaces, and SDUI reference components.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function InternalComponentsPage() {
  redirect(defaultComponentHref);
}
