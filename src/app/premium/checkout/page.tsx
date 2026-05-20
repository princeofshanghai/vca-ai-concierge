import type { Metadata } from "next";

import { PremiumScreenshotPage } from "@/components/premium/premium-screenshot-page";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Checkout",
  description: "Static Premium checkout screenshot for prototype review.",
});

export default function PremiumCheckoutPage() {
  return (
    <PremiumScreenshotPage
      src="/assets/premium/checkout.png"
      width={1426}
      height={775}
      alt="Static screenshot of the LinkedIn Premium secure checkout page."
    />
  );
}
