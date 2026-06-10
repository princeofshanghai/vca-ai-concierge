import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Icon } from "@/components/primitives/icon";
import { createPageMetadata } from "@/lib/metadata";

const placeholderStories = {
  "1b": "Story 1b",
  "1c": "Story 1c",
  "2": "Story 2",
  "3": "Story 3",
} as const;

type PremiumCompanyPagesStoryId = keyof typeof placeholderStories;

type PremiumCompanyPagesStoryPlaceholderRouteProps = Readonly<{
  params: Promise<{
    storyId: string;
  }>;
}>;

function isPlaceholderStoryId(
  storyId: string,
): storyId is PremiumCompanyPagesStoryId {
  return storyId in placeholderStories;
}

export function generateStaticParams() {
  return Object.keys(placeholderStories).map((storyId) => ({ storyId }));
}

export async function generateMetadata({
  params,
}: PremiumCompanyPagesStoryPlaceholderRouteProps): Promise<Metadata> {
  const { storyId } = await params;
  const storyLabel = isPlaceholderStoryId(storyId)
    ? placeholderStories[storyId]
    : "Premium Company Pages Story";

  return createPageMetadata({
    title: `${storyLabel} Placeholder`,
    description:
      "Reserved Premium Company Pages prototype story route for an unbuilt use case.",
  });
}

export default async function PremiumCompanyPagesStoryPlaceholderRoute({
  params,
}: PremiumCompanyPagesStoryPlaceholderRouteProps) {
  const { storyId } = await params;

  if (!isPlaceholderStoryId(storyId)) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation />
      <section className="mx-auto flex min-h-[calc(100dvh-64px)] max-w-[1128px] items-center justify-center px-lg py-xxl">
        <div className="flex w-full max-w-[520px] flex-col items-center rounded-sm border border-border-faint bg-background px-xxl py-stack text-center shadow-raised-faint">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-ai-background-soft text-ai-icon">
            <Icon name="signal-ai" size="medium" />
          </span>
          <p className="mt-lg text-body-sm font-semibold text-text-meta">
            Premium Company Pages
          </p>
          <h1 className="mt-xs text-heading-lg text-text">
            {placeholderStories[storyId]}
          </h1>
          <p className="mt-sm text-body-sm text-text-meta">
            Placeholder for an unbuilt prototype story.
          </p>
        </div>
      </section>
    </main>
  );
}
