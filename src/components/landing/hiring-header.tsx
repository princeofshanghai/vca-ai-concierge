"use client";

import type { MouseEventHandler } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button, getButtonClassName } from "@/components/primitives/button";

export const hiringHeaderNavItems = [
  { href: "/hiring/products", label: "Products" },
  { href: "/hiring/compare-products", label: "Compare Products" },
  { href: "/hiring/resources-support", label: "Resources & Support" },
] as const;

export type HiringHeaderNavHref =
  (typeof hiringHeaderNavItems)[number]["href"];

type HiringHeaderProps = Readonly<{
  homeHref?: string;
  contactSalesHref?: string;
  isChatOpen?: boolean;
  chatPanelId?: string;
  onContactSales?: () => void;
  onNavItemClick?: (
    event: Parameters<MouseEventHandler<HTMLAnchorElement>>[0],
    href: HiringHeaderNavHref,
  ) => void;
}>;

export function HiringHeader({
  homeHref = "/hiring",
  contactSalesHref = "/hiring?contactSales=open",
  isChatOpen = false,
  chatPanelId,
  onContactSales,
  onNavItemClick,
}: HiringHeaderProps) {
  return (
    <header className="relative z-10 flex h-16 items-center justify-between border-b border-border-subtle bg-white px-6 sm:px-8">
      <Link
        href={homeHref}
        aria-label="LinkedIn Hire home"
        className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
      >
        <Image
          src="/assets/logo-lockup.svg"
          alt="LinkedIn Hire"
          width={162}
          height={27}
          className="h-[27px] w-[162px]"
        />
      </Link>

      <div className="flex items-center gap-5 min-[920px]:gap-6">
        <nav
          aria-label="LinkedIn Hiring"
          className="hidden items-center gap-5 min-[920px]:flex min-[1080px]:gap-6"
        >
          {hiringHeaderNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[16px] font-semibold leading-none text-action transition-colors duration-150 ease-out hover:text-action-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              onClick={(event) => onNavItemClick?.(event, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {onContactSales ? (
          <Button
            variant="secondary"
            size="small"
            aria-controls={isChatOpen ? chatPanelId : undefined}
            aria-expanded={isChatOpen}
            aria-haspopup="dialog"
            onClick={onContactSales}
          >
            Contact sales
          </Button>
        ) : (
          <Link
            href={contactSalesHref}
            className={getButtonClassName({
              variant: "secondary",
              size: "small",
            })}
          >
            <span>Contact sales</span>
          </Link>
        )}
      </div>
    </header>
  );
}
