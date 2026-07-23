import type { Metadata } from "next";

import { PremiumScreenshotPage } from "@/components/premium/premium-screenshot-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Learn More",
  description: "Reference design for the Premium learn-more experience.",
});

export default function PremiumLearnMorePage() {
  return (
    <PremiumScreenshotPage
      src="/assets/premium/learn-more.png"
      width={1419}
      height={777}
      alt="Static screenshot of the LinkedIn Premium learn more offer page."
    />
  );
}
