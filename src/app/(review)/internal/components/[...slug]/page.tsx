import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { createPageMetadata } from "@/lib/metadata";

import { ComponentPageContent } from "../component-page-content";
import {
  componentNavItems,
  getComponentNavItem,
  getComponentRedirectHref,
} from "../component-nav";

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
      title: "VCA Component Library",
      description: "Component designs for AI concierge experiences.",
    });
  }

  return createPageMetadata({
    title: `VCA Component — ${item.title}`,
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
    const redirectHref = getComponentRedirectHref(slug);

    if (redirectHref) {
      redirect(redirectHref);
    }

    notFound();
  }

  return <ComponentPageContent item={item} />;
}
