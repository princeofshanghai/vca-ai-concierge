import type { Metadata } from "next";

import "@/styles/globals.css";
import {
  openGraphImages,
  siteDescription,
  siteName,
  siteUrl,
  shareTitle,
  twitterImages,
} from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteName,
  title: shareTitle,
  description: siteDescription,
  openGraph: {
    title: shareTitle,
    description: siteDescription,
    siteName,
    type: "website",
    images: openGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
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
