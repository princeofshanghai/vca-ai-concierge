"use client";

import Link from "next/link";

import { getButtonClassName } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";

import type { PremiumPlan } from "./premium-plan-data";

export function PremiumLinkedInBug({
  className,
}: Readonly<{
  className?: string;
}>) {
  return (
    <span
      aria-label="LinkedIn"
      role="img"
      className={[
        "inline-flex shrink-0 items-center justify-center text-action",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon name="linked-in-bug" size="medium" />
    </span>
  );
}

export function PremiumProgressIndicator({
  progress,
}: Readonly<{
  progress: number;
}>) {
  return (
    <div
      aria-label={`Survey progress, ${progress}% complete`}
      className="mx-4 flex min-w-0 flex-1 items-center gap-sm md:max-w-[472px]"
    >
      <span className="hidden shrink-0 text-supportive-s text-text-meta sm:inline">
        Choose plan
      </span>
      <div
        aria-hidden="true"
        className="relative h-[6px] min-w-0 flex-1 rounded-xs md:min-w-[300px]"
      >
        <span className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-xs bg-text-meta" />
        <span
          className="absolute left-0 top-0 h-[6px] rounded-xs bg-premium-indicator"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="shrink-0 text-supportive-s text-text-meta">
        {progress}%
      </span>
    </div>
  );
}

export function PremiumEntityStack() {
  return (
    <span aria-hidden="true" className="inline-flex items-start pr-sm">
      <Entity
        size={24}
        label="Premium member"
        className="mr-[-8px] ring-1 ring-background"
      />
      <Entity
        size={24}
        label="Premium member"
        className="mr-[-8px] ring-1 ring-background"
      />
      <Entity
        size={24}
        label="Premium member"
        className="mr-[-8px] ring-1 ring-background"
      />
    </span>
  );
}

export function PremiumProfileMark() {
  return (
    <div
      aria-hidden="true"
      className="relative flex size-12 items-center justify-center"
    >
      <span className="absolute -inset-[2px] rounded-round border-[2px] border-premium-inbug" />
      <Entity size={48} label="Alex" />
      <span className="absolute bottom-0 right-0 flex size-[13px] items-center justify-center rounded-xs bg-background">
        <PremiumLinkedInBug className="size-[10px] [&_span]:!size-[10px]" />
      </span>
    </div>
  );
}

export function PremiumSurveyOption({
  checked,
  control = "radio",
  emphasis = "standard",
  label,
  onSelect,
}: Readonly<{
  checked: boolean;
  control?: "checkbox" | "radio";
  emphasis?: "large" | "standard";
  label: string;
  onSelect?: () => void;
}>) {
  return (
    <button
      type="button"
      role={control}
      aria-checked={checked}
      onClick={onSelect}
      className={[
        "flex w-full items-center gap-md rounded-sm border bg-background text-left transition-[background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-focus-ring",
        emphasis === "large" ? "p-xxl" : "p-lg",
        checked
          ? "border-checked shadow-[inset_0_0_0_1px_rgba(1,117,79,0.12)]"
          : "border-border-faint hover:border-border-subtle hover:bg-background-transparent-hover",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "inline-flex size-6 shrink-0 items-center justify-center rounded-xs border transition-colors duration-150 ease-out",
          checked
            ? "border-checked bg-checked text-on-checked"
            : "border-border-subtle bg-background text-transparent",
        ].join(" ")}
      >
        <Icon name="check" size="small" />
      </span>
      <span
        className={[
          "min-w-0 flex-1 text-text",
          emphasis === "large" ? "text-heading-lg" : "text-control-sm",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}

export function PremiumPlanCard({ plan }: Readonly<{ plan: PremiumPlan }>) {
  return (
    <article
      className={[
        "relative flex min-h-[432px] flex-col overflow-hidden rounded-lg border border-border-faint px-xxl py-xxxl",
        "bg-[radial-gradient(circle_at_8%_100%,rgba(253,226,188,0.95)_0%,rgba(253,226,188,0.58)_30%,transparent_58%),radial-gradient(circle_at_94%_86%,rgba(255,223,214,0.88)_0%,rgba(255,223,214,0.46)_34%,transparent_62%),#fffaf5]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:min-h-[485px]",
      ].join(" ")}
    >
      <div className="flex flex-1 flex-col gap-xxl">
        <div className="flex flex-col gap-sm">
          <h2 className="text-display-md text-text">{plan.name}</h2>
          <p className="text-body-md-open text-text">{plan.subtitle}</p>
        </div>

        <ul className="flex flex-col gap-lg">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex gap-md text-body-sm-open text-text"
            >
              <span
                aria-hidden="true"
                className="mt-[2px] inline-flex size-5 shrink-0 items-center justify-center text-premium-text-brand"
              >
                <Icon name="check" size="small" />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/premium/learn-more"
        className={getButtonClassName({
          variant: "tertiary",
          size: "medium",
          className: "mt-xxl w-full",
        })}
      >
        Learn more
      </Link>
    </article>
  );
}
