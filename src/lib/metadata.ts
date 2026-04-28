import type { Metadata } from "next";

export const siteName = "VCA AI concierge";
export const siteDescription =
  "Prototype conversational layer and component library for the LinkedIn Hiring solutions concierge.";
export const shareImageAlt = "VCA AI concierge share preview";

function resolveSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

  return new URL(configuredUrl);
}

export const siteUrl = resolveSiteUrl();

export const openGraphImages = [
  {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: shareImageAlt,
  },
];

export const twitterImages = [
  {
    url: "/twitter-image",
    alt: shareImageAlt,
  },
];

type PageMetadataOptions = {
  description: string;
  robots?: Metadata["robots"];
  title: string;
};

export function createPageMetadata({
  description,
  robots,
  title,
}: PageMetadataOptions): Metadata {
  const resolvedTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    robots,
    openGraph: {
      title: resolvedTitle,
      description,
      siteName,
      type: "website",
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: twitterImages,
    },
  };
}
