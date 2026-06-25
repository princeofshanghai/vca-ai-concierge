import type { ReactNode } from "react";

import Link from "next/link";

import { getButtonClassName } from "@/components/primitives/button";

import { PremiumUpsellBadge } from "./premium-upsell-badge";

type PremiumUpsellResultCardAction = Readonly<{
  href: string;
  label: string;
}>;

export type PremiumUpsellResultCardProps = Readonly<{
  body: ReactNode;
  className?: string;
  eyebrow?: string;
  primaryAction: PremiumUpsellResultCardAction;
  secondaryAction?: PremiumUpsellResultCardAction;
  title: ReactNode;
}>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PremiumUpsellResultCard({
  body,
  className,
  eyebrow = "Try Premium for $0",
  primaryAction,
  secondaryAction,
  title,
}: PremiumUpsellResultCardProps) {
  return (
    <article
      className={cx(
        "flex flex-col gap-lg rounded-sm border border-border-faint bg-background px-lg py-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <div className="min-w-0">
        <PremiumUpsellBadge variant="inline-on-light">
          {eyebrow}
        </PremiumUpsellBadge>
        <h2 className="mt-sm text-heading-md text-text">{title}</h2>
        <div className="mt-xs text-body-sm text-text-meta">{body}</div>
      </div>

      <div className="flex flex-wrap items-center gap-sm">
        <Link
          href={primaryAction.href}
          className={getButtonClassName({
            size: "small",
            className: "px-pill-padding-inline",
          })}
        >
          {primaryAction.label}
        </Link>
        {secondaryAction ? (
          <Link
            href={secondaryAction.href}
            className={getButtonClassName({
              size: "small",
              variant: "secondary",
              className: "px-pill-padding-inline",
            })}
          >
            {secondaryAction.label}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
