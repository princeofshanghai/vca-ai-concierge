import type { Metadata } from "next";

import { ProjectChooserPage } from "@/components/project-chooser/project-chooser-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "VCA Design Prototypes",
  description: "Design prototypes for AI concierge experiences.",
});

export default function HomePage() {
  return <ProjectChooserPage />;
}
