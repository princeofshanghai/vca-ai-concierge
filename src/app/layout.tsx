import type { Metadata } from "next";

import "@/styles/globals.css";
import {
  openGraphImages,
  siteDescription,
  siteName,
  siteUrl,
  twitterImages,
} from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    type: "website",
    images: openGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: twitterImages,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
