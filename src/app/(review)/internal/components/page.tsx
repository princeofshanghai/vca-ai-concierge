import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createPageMetadata } from "@/lib/metadata";

import { defaultComponentHref } from "./component-nav";

export const metadata: Metadata = createPageMetadata({
  title: "VCA Component Library",
  description: "Component designs for AI concierge experiences.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function InternalComponentsPage() {
  redirect(defaultComponentHref);
}
