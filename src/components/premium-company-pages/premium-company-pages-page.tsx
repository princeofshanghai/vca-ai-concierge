"use client";

import Image from "next/image";
import { useState } from "react";

import { LinkedInGlobalNavigation } from "@/components/global-navigation";
import { Button } from "@/components/primitives/button";
import { ButtonIcon } from "@/components/primitives/button-icon";
import { Entity } from "@/components/primitives/entity";
import { GhostButton } from "@/components/primitives/ghost-button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";

import {
  PCP_ASSET_ROOT,
  pcpCompanyProfile,
} from "./persona";

const ASSET_ROOT = PCP_ASSET_ROOT;

const primaryRailItems = [
  "Dashboard",
  "Page posts",
  "Analytics",
  "Feed",
  "Activity",
  "Inbox",
  "Edit Page",
];

const secondaryRailItems = ["Life", "Services"];

const premiumRailItems: Array<{ label: string; icon?: IconName }> = [
  { label: "Premium features" },
  { label: "Advertise today", icon: "radar-screen" },
  { label: "Invite to follow" },
  { label: "Settings" },
];

type PerformanceCardData = Readonly<{
  title: string;
  value: string;
  delta?: string;
  deltaTone?: "negative" | "positive";
  label?: string;
  premium?: boolean;
}>;

const performanceCards: Array<PerformanceCardData> = [
  {
    title: "Who visited your Page",
    value: "18",
    label: "Premium insight",
    premium: true,
  },
  {
    title: "CTA clicks",
    value: "42",
    delta: "18% last 7 days",
    deltaTone: "positive",
  },
  {
    title: "New followers",
    value: "37",
    delta: "8% last 7 days",
    deltaTone: "positive",
  },
  {
    title: "Consult requests",
    value: "6",
    label: "Premium insight",
    premium: true,
  },
];

const recentPosts = [
  {
    body: "Three signals your roadmap is hiding a positioning problem. If every customer story points to a different buyer, your product narrative may be doing too much work.",
    metric: "Get up to 12K more impressions by boosting",
    image: "post-building-blue.png",
    imageAlt: "",
    linkTitle: "Three signals your roadmap is hiding a positioning problem",
    linkMeta: "veloracloud.com",
    reactions: "152",
    comments: "18 Comments",
  },
  {
    body: "Before and after: making a complex onboarding flow easier to trust. The first-run experience is often the clearest expression of your product strategy.",
    metric: "Get up to 9K more impressions by boosting",
    image: "post-kudos.png",
    imageAlt: "",
    linkTitle: "Client win",
    linkMeta: "LumaWorks product team",
    reactions: "860",
    comments: "42 Comments",
  },
  {
    body: "A short prompt we use before roadmap reviews: what customer truth would change the next decision if the team believed it?",
    metric: "Get up to 7K more impressions by boosting",
    image: "feed-post-content.png",
    imageAlt: "",
    reactions: "240",
    comments: "12 Comments",
  },
];

const callPrepBrief = {
  buyer: "Alex Morgan",
  role: "VP Product at Northstar",
  avatar: "avatar-2.png",
  companyContext: "80-person B2B SaaS company",
  need: "Product strategy support for a regulated market expansion",
  signals:
    "Asked about fit, services/pricing, differentiation, and booked time",
  proofShown: "SaaS wedge strategy client story",
  bookedSlot: "Thursday, Jun 5 at 10:00 AM PT",
  suggestedPrep: [
    "Lead with why a focused strategy sprint fits the market-expansion moment.",
    "Explain the scope factors: timeline, research depth, stakeholder complexity, and senior involvement.",
    "Reinforce that Skylar and senior practitioners stay close to the work.",
  ],
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PremiumMark({ label }: Readonly<{ label?: string }>) {
  return <PremiumChipSmall label={label} />;
}

function CompanyPremiumBug() {
  return (
    <Icon
      aria-hidden="true"
      className="shrink-0 text-premium-inbug"
      name="linked-in-bug"
      size="medium"
    />
  );
}

function InlineAction({ children }: Readonly<{ children: string }>) {
  return (
    <button
      className="font-semibold text-action hover:underline"
      type="button"
    >
      {children}
    </button>
  );
}

function RailSection({
  items,
  activeItem,
  withPremiumIcon = false,
}: Readonly<{
  items: Array<string> | Array<{ label: string; icon?: IconName }>;
  activeItem?: string;
  withPremiumIcon?: boolean;
}>) {
  return (
    <div className="flex flex-col">
      {items.map((item) => {
        const label = typeof item === "string" ? item : item.label;
        const icon = typeof item === "string" ? undefined : item.icon;
        const active = activeItem === label;

        return (
          <button
            key={label}
            className={cx(
              "flex min-h-10 w-full items-center gap-sm px-xxl py-sm text-left text-control-sm transition-colors hover:bg-background-transparent-hover",
              active
                ? "border-l-2 border-positive pl-[22px] text-positive"
                : "text-label",
            )}
            type="button"
          >
            {withPremiumIcon && label === "Premium features" ? (
              <PremiumMark label="Premium" />
            ) : icon ? (
              <Icon name={icon} size="small" />
            ) : null}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PageRail() {
  return (
    <aside className="overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="relative p-lg pt-stack">
        <div
          className="absolute inset-x-0 top-0 h-[96px] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0)), url(${pcpCompanyProfile.coverSrc})`,
          }}
        />
        <div className="absolute inset-x-0 top-0 h-xs bg-premium-brand" />
        <span className="absolute right-sm top-md text-control-sm text-white">
          Premium
        </span>

        <div className="relative flex items-start justify-between">
          <Entity
            className="border-2 border-white"
            label={pcpCompanyProfile.name}
            shape="square"
            size={80}
            src={pcpCompanyProfile.logoSrc}
            style={{ height: 72, width: 72 }}
          />
          <ButtonIcon
            className="mt-sm"
            icon="edit"
            label="Edit cover"
            size="small"
            variant="tertiary"
          />
        </div>

        <div className="mt-lg">
          <div className="flex items-center gap-xs">
            <h2 className="text-heading-lg text-text">
              {pcpCompanyProfile.name}
            </h2>
            <CompanyPremiumBug />
            <Icon
              className="text-text-meta"
              name="verified"
              size="medium"
              label="Verified"
            />
          </div>
          <p className="mt-xxs text-supportive-s-strong text-text-meta">
            {pcpCompanyProfile.followers}
          </p>
        </div>

        <div className="mt-lg flex flex-col items-start gap-md">
          <Button leadingIcon={<Icon name="add" />} size="small">
            Create
          </Button>
          <Button
            className="!border-border !text-label"
            leadingIcon={<Icon name="visibility" />}
            size="small"
            variant="tertiary"
          >
            View as member
          </Button>
        </div>
      </div>

      <RailSection activeItem="Dashboard" items={primaryRailItems} />
      <div className="mx-xxl my-sm h-px bg-border-faint" />
      <RailSection items={secondaryRailItems} />
      <div className="mx-xxl my-sm h-px bg-border-faint" />
      <RailSection items={premiumRailItems} withPremiumIcon />
    </aside>
  );
}

function ActionCard({
  title,
  body,
  premium,
  action,
}: Readonly<{
  title: string;
  body: string;
  premium?: boolean;
  action?: string;
}>) {
  return (
    <article className="flex min-h-[72px] items-start gap-sm rounded-xs border border-border-faint bg-background px-lg py-md">
      <div className="mt-[3px]">
        {premium ? (
          <PremiumMark label="Premium" />
        ) : (
          <span className="block size-3 rounded-xs bg-border-faint" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {premium ? (
          <p className="text-supportive-s text-text-meta">Premium</p>
        ) : null}
        <h3 className="text-control-sm text-text">{title}</h3>
        <p className="text-body-xs text-text-meta">
          {body}
          {action ? (
            <>
              {" "}
              <InlineAction>{action}</InlineAction>
            </>
          ) : null}
        </p>
      </div>
      <GhostIconButton
        className="-mr-xs text-text-meta"
        horizontalPadding={false}
        icon="close"
        label={`Dismiss ${title}`}
        touchTarget={false}
      />
    </article>
  );
}

function CallPrepActionCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleLabel = isExpanded ? "Hide brief" : "Review brief";

  return (
    <article className="overflow-hidden rounded-xs border border-ai-border bg-background shadow-raised-faint">
      <div className="flex min-h-[72px] items-start gap-sm px-lg py-md">
        <span className="mt-xxs inline-flex size-8 shrink-0 items-center justify-center rounded-round bg-ai-background-soft text-ai-icon">
          <Icon name="signal-ai" size="small" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-xs">
            <PremiumMark label="Premium" />
            <p className="text-supportive-s text-text-meta">Page Agent</p>
          </div>
          <h3 className="mt-xxs text-control-sm text-text">
            Review prep for Alex Morgan&apos;s discovery call
          </h3>
          <p className="text-body-xs text-text-meta">
            VCA captured buyer context from Northstar&apos;s evaluation of Velora.{" "}
            <button
              aria-expanded={isExpanded}
              className="font-semibold text-action hover:underline"
              onClick={() => setIsExpanded((current) => !current)}
              type="button"
            >
              {toggleLabel}
            </button>
          </p>
        </div>
        <GhostIconButton
          className="-mr-xs text-text-meta"
          horizontalPadding={false}
          icon="close"
          label="Dismiss call prep"
          touchTarget={false}
        />
      </div>

      {isExpanded ? (
        <div className="border-t border-border-faint bg-ai-background-soft px-lg py-lg">
          <div className="flex flex-col gap-lg lg:flex-row lg:items-start">
            <div className="flex min-w-[220px] items-center gap-sm">
              <Entity
                label={callPrepBrief.buyer}
                size={48}
                src={`${ASSET_ROOT}/${callPrepBrief.avatar}`}
              />
              <div className="min-w-0">
                <p className="truncate text-control-sm text-text">
                  {callPrepBrief.buyer}
                </p>
                <p className="text-body-xs text-text-meta">
                  {callPrepBrief.role}
                </p>
              </div>
            </div>

            <div className="grid min-w-0 flex-1 gap-md sm:grid-cols-2">
              {[
                ["Company context", callPrepBrief.companyContext],
                ["Need", callPrepBrief.need],
                ["Signals", callPrepBrief.signals],
                ["Proof shown", callPrepBrief.proofShown],
                ["Booked slot", callPrepBrief.bookedSlot],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-supportive-s-strong text-text-meta">
                    {label}
                  </p>
                  <p className="mt-xxs text-body-sm text-text">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-lg border-t border-border-faint pt-md">
            <p className="text-supportive-s-strong text-text-meta">
              Suggested prep
            </p>
            <ul className="mt-sm space-y-sm">
              {callPrepBrief.suggestedPrep.map((item) => (
                <li className="flex gap-sm text-body-sm-open text-text" key={item}>
                  <Icon className="mt-xxs shrink-0 text-positive" name="check" size="small" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function AvatarPile() {
  return (
    <div className="flex items-center">
      {["avatar-2.png", "avatar-1.png", "avatar-3.png"].map((avatar, index) => (
        <Entity
          key={avatar}
          className={cx(index > 0 && "-ml-sm", "border border-background")}
          label=""
          size={32}
          src={`${ASSET_ROOT}/${avatar}`}
        />
      ))}
      <span className="-ml-sm inline-flex size-8 items-center justify-center rounded-round border border-border-faint bg-background text-supportive-s text-text-meta">
        +99
      </span>
    </div>
  );
}

function PerformanceCard({
  title,
  value,
  delta,
  deltaTone,
  label,
  premium,
}: PerformanceCardData) {
  return (
    <article className="min-h-[105px] rounded-xs border border-border-faint bg-background p-md">
      {title === "Who visited your Page" ? <AvatarPile /> : null}
      <p className="mt-xs text-heading-xl text-text">{value}</p>
      <h3 className="text-control-sm text-action">{title}</h3>
      {delta ? (
        <p
          className={cx(
            "mt-xxs text-supportive-s",
            deltaTone === "positive" ? "text-positive" : "text-negative",
          )}
        >
          {deltaTone === "positive" ? "+" : "-"} {delta}
        </p>
      ) : null}
      {label ? (
        <p className="mt-xxs flex items-center gap-xs text-supportive-s text-text-meta">
          {premium ? <PremiumMark label="Premium" /> : null}
          {label}
        </p>
      ) : null}
    </article>
  );
}

function CarouselControls({
  nextLabel,
  previousLabel,
}: Readonly<{ nextLabel: string; previousLabel: string }>) {
  return (
    <div className="hidden gap-xs sm:flex">
      <ButtonIcon
        disabled
        icon="chevron-left"
        label={previousLabel}
        size="small"
        touchTarget={false}
        variant="tertiary"
      />
      <ButtonIcon
        icon="chevron-right"
        label={nextLabel}
        size="small"
        touchTarget={false}
        variant="tertiary"
      />
    </div>
  );
}

function ReactionSummary({
  comments,
  reactions,
}: Readonly<{ comments: string; reactions: string }>) {
  return (
    <div className="flex items-center gap-xs text-supportive-s text-text-meta">
      <span className="flex items-center" aria-hidden="true">
        <span className="block size-4 rounded-round border border-background bg-action" />
        <span className="-ml-[5px] block size-4 rounded-round border border-background bg-positive" />
        <span className="-ml-[5px] block size-4 rounded-round border border-background bg-caution" />
      </span>
      <span>{reactions}</span>
      <span aria-hidden="true">&middot;</span>
      <span>{comments}</span>
    </div>
  );
}

function PostCard({
  body,
  comments,
  image,
  imageAlt,
  linkMeta,
  linkTitle,
  metric,
  reactions,
}: Readonly<{
  body: string;
  comments: string;
  image: string;
  imageAlt: string;
  linkMeta?: string;
  linkTitle?: string;
  metric: string;
  reactions: string;
}>) {
  return (
    <article className="w-[365px] shrink-0 overflow-hidden rounded-sm border border-border-faint bg-background">
      <div className="flex min-h-[62px] items-center justify-between gap-md border-b border-border-faint px-md py-sm">
        <span className="inline-flex max-w-[190px] items-center gap-xs text-supportive-s-strong text-text">
          {metric}
          <Icon className="shrink-0 text-text-meta" name="question" size="small" />
        </span>
        <Button size="small" variant="secondary">
          Boost
        </Button>
      </div>
      <div className="px-md py-lg">
        <div className="flex items-start gap-sm">
          <Entity
            label={pcpCompanyProfile.name}
            shape="square"
            size={40}
            src={pcpCompanyProfile.logoSrc}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-control-sm text-text">
              {pcpCompanyProfile.name}
            </h3>
            <p className="text-supportive-s text-text-meta">
              {pcpCompanyProfile.followers}
            </p>
            <p className="text-supportive-s text-text-meta">Timestamp</p>
          </div>
          <Icon className="text-text-meta" name="overflow-web-ios" size="medium" />
        </div>

        <p className="mt-md line-clamp-2 text-body-sm text-text">{body}</p>
        <Image
          alt={imageAlt}
          className="mt-sm h-[220px] w-full object-cover"
          height={386}
          src={`${ASSET_ROOT}/${image}`}
          width={514}
        />
        {linkTitle ? (
          <div className="bg-background-neutral-soft px-md py-sm">
            <p className="text-control-sm text-text">{linkTitle}</p>
            {linkMeta ? (
              <p className="text-body-xs text-text-meta">{linkMeta}</p>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="border-t border-border-faint px-md py-sm">
        <ReactionSummary comments={comments} reactions={reactions} />
      </div>
    </article>
  );
}

function DashboardContent() {
  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-border-faint bg-background shadow-raised-faint">
      <div className="bg-gradient-to-r from-premium-gradient-base-a via-premium-gradient-base-b to-background px-lg pb-[28px] pt-[40px] sm:px-xxl">
        <h1 className="text-display-md text-text">
          Welcome back, {pcpCompanyProfile.name}
        </h1>
        <div className="mt-[40px]">
          <h2 className="text-heading-sm text-text">Today&apos;s actions</h2>
          <p className="mt-xxs text-body-sm text-text-meta">
            Pages that complete these actions regularly grow 4x faster.
          </p>
        </div>
        <div className="mt-xxl space-y-md">
          <CallPrepActionCard />
          <ActionCard
            action="Enable"
            premium
            title="Turn on Auto-Invite to grow new followers 6.7x faster"
            body="Automatically invite post-engagers to follow."
          />
          <ActionCard
            action="Follow"
            title="Follow similar consultancies"
            body="Join relevant conversations with product strategy, UX research, and SaaS leadership pages."
          />
        </div>
      </div>

      <div className="space-y-[40px] px-lg pb-xxl pt-[40px] sm:px-xxl">
        <section>
          <div className="flex items-start justify-between gap-lg">
            <div>
              <h2 className="text-heading-sm text-text">Track performance</h2>
              <p className="text-body-sm text-text-meta">
                Turn Page interest into consult requests with weekly visitor
                and CTA insights.
              </p>
            </div>
            <CarouselControls
              nextLabel="Next performance insights"
              previousLabel="Previous performance insights"
            />
          </div>

          <div className="mt-lg grid gap-md sm:grid-cols-2 xl:grid-cols-4">
            {performanceCards.map((card) => (
              <PerformanceCard key={card.title} {...card} />
            ))}
          </div>

          <div className="mt-md flex justify-center gap-md" aria-hidden="true">
            <span className="size-[6px] rounded-round bg-text" />
            <span className="size-[6px] rounded-round border border-border-subtle" />
          </div>
        </section>

        <section>
          <div className="flex items-start justify-between gap-lg">
            <div>
              <h2 className="text-heading-sm text-text">Manage recent posts</h2>
              <p className="text-body-sm text-text-meta">
                Manage thought leadership and amplify top-performing posts with
                boosting. <InlineAction>Learn more</InlineAction>
              </p>
            </div>
            <CarouselControls
              nextLabel="Next posts"
              previousLabel="Previous posts"
            />
          </div>

          <div className="mt-lg flex gap-md overflow-hidden">
            {recentPosts.map((post) => (
              <PostCard key={post.body} {...post} />
            ))}
          </div>

          <div className="mt-lg flex justify-center gap-md" aria-hidden="true">
            <span className="size-[6px] rounded-round bg-text" />
            <span className="size-[6px] rounded-round border border-border-subtle" />
            <span className="size-[6px] rounded-round border border-border-subtle" />
            <span className="size-[6px] rounded-round border border-border-subtle" />
            <span className="size-[6px] rounded-round border border-border-subtle" />
            <span className="size-[6px] rounded-round border border-border-subtle" />
          </div>

          <div className="mt-lg flex justify-center border-t border-border-faint pt-md">
            <GhostButton icon="arrow-right" iconAtEnd size="medium">
              Show all page posts
            </GhostButton>
          </div>
        </section>
      </div>
    </section>
  );
}

export function PremiumCompanyPagesPage() {
  return (
    <main className="min-h-dvh bg-background-neutral-soft text-text">
      <LinkedInGlobalNavigation profileSrc={pcpCompanyProfile.founderAvatarSrc} />
      <div className="mx-auto grid w-full max-w-[1145px] gap-lg px-lg py-xxl lg:grid-cols-[225px_minmax(0,888px)] lg:gap-[32px] lg:px-0">
        <PageRail />
        <DashboardContent />
      </div>
    </main>
  );
}
