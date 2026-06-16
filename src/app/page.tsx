import type { Metadata } from "next";

import { ProjectChooserPage } from "@/components/project-chooser/project-chooser-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Concierge Prototypes",
  description: "Shared prototype chooser for LinkedIn AI concierge surfaces.",
});

export default function HomePage() {
  return <ProjectChooserPage />;
}
