import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageMetadata } from "@/lib/metadata";

import { ComponentPageContent } from "../component-page-content";
import { componentNavItems, getComponentNavItem } from "../component-nav";

type ComponentDetailPageProps = Readonly<{
  params: Promise<{
    slug: string[];
  }>;
}>;

export function generateStaticParams() {
  return componentNavItems.map((item) => ({
    slug: item.href.replace("/internal/components/", "").split("/"),
  }));
}

export async function generateMetadata({
  params,
}: ComponentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getComponentNavItem(slug);

  if (!item) {
    return createPageMetadata({
      title: "AI Concierge Components",
      description:
        "Internal review surface for the VCA AI concierge component system.",
    });
  }

  return createPageMetadata({
    title: `AI Concierge Components: ${item.title}`,
    description: item.description,
    robots: {
      index: false,
      follow: false,
    },
  });
}

export default async function ComponentDetailPage({
  params,
}: ComponentDetailPageProps) {
  const { slug } = await params;
  const item = getComponentNavItem(slug);

  if (!item) {
    notFound();
  }

  return <ComponentPageContent item={item} />;
}
