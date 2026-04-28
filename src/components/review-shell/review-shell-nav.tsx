"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { premiumSignalFlowNavItems } from "@/components/premium/premium-concierge-flows";
import { Icon } from "@/components/primitives/icon";

import { useReviewShellState } from "./review-shell-state";
import { ReviewShellStateMenu } from "./review-shell-state-menu";

const HIRING_PROTOTYPE_HREF = "/hiring";
const PREMIUM_PROTOTYPE_HREF = "/premium";
const TRIGGER_ID = "review-shell-state-menu-trigger";
const PREMIUM_LIVE_NAV_ITEM = {
  id: "premium-live",
  href: PREMIUM_PROTOTYPE_HREF,
  label: "Live prototype",
} as const;
const premiumModeOptions = [
  PREMIUM_LIVE_NAV_ITEM,
  ...premiumSignalFlowNavItems,
] as const;

type ReviewDestination = Readonly<{
  href: string;
  label: string;
  matches: (pathname: string) => boolean;
  menu?: "hiring" | "premium";
}>;

function getPremiumNavLabel(pathname: string) {
  return (
    premiumSignalFlowNavItems.find((option) => option.href === pathname)
      ?.label ?? "Premium"
  );
}

function getReviewDestinations(
  pathname: string,
): ReadonlyArray<ReviewDestination> {
  if (pathname.startsWith("/premium")) {
    return [
      {
        href: PREMIUM_PROTOTYPE_HREF,
        label: getPremiumNavLabel(pathname),
        menu: "premium",
        matches: (candidate) => candidate.startsWith("/premium"),
      },
    ];
  }

  return [
    {
      href: HIRING_PROTOTYPE_HREF,
      label: "LTS Hiring",
      menu: "hiring",
      matches: (candidate) =>
        candidate === HIRING_PROTOTYPE_HREF ||
        candidate.startsWith("/internal/flows"),
    },
    {
      href: "/internal/components",
      label: "Components",
      matches: (candidate) => candidate.startsWith("/internal/components"),
    },
  ];
}

export function ReviewShellNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, setIsSignedIn } = useReviewShellState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reviewDestinations = useMemo(
    () => getReviewDestinations(pathname),
    [pathname],
  );

  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    opacity: number;
    transform: string;
    width: number;
  }>({
    opacity: 0,
    transform: "translateX(0px)",
    width: 0,
  });

  useLayoutEffect(() => {
    function updateIndicator() {
      const activeDestination = reviewDestinations.find((destination) =>
        destination.matches(pathname),
      );
      const activeElement = activeDestination
        ? itemRefs.current[activeDestination.href]
        : null;
      const listElement = listRef.current;

      if (!activeElement || !listElement) {
        return;
      }

      const listRect = listElement.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      setIndicatorStyle({
        opacity: 1,
        transform: `translateX(${activeRect.left - listRect.left}px)`,
        width: activeRect.width,
      });
    }

    updateIndicator();
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname, isSignedIn, reviewDestinations]);

  function handleLoginSelect(next: boolean) {
    setIsSignedIn(next);
    setIsMenuOpen(false);
    router.push(HIRING_PROTOTYPE_HREF);
  }

  function closeMenu() {
    setIsMenuOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-50 flex justify-center px-4 sm:top-3">
      <nav
        aria-label="Review surfaces"
        className="pointer-events-auto rounded-full border border-white/75 bg-white/50 p-1 shadow-[0_12px_32px_rgba(15,23,42,0.08),0_3px_12px_rgba(15,23,42,0.05)] ring-1 ring-black/5 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/42"
      >
        <ul ref={listRef} className="relative flex items-center gap-0.5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-sky-50 ring-1 ring-sky-100 transition-[transform,width,opacity] duration-200 ease-out motion-reduce:transition-none"
            style={indicatorStyle}
          />
          {reviewDestinations.map((destination) => {
            const isActive = destination.matches(pathname);
            const hasMenu = Boolean(destination.menu);
            const isPremiumMenu = destination.menu === "premium";

            if (hasMenu) {
              return (
                <li key={destination.href} className="relative z-10">
                  <button
                    id={TRIGGER_ID}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Open ${
                      isPremiumMenu ? "Premium" : "LTS Hiring"
                    } review menu`}
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    ref={(element) => {
                      itemRefs.current[destination.href] = element;
                      triggerRef.current = element;
                    }}
                    className={[
                      "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-medium tracking-[0.015em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 sm:px-4",
                      isActive
                        ? "text-sky-900"
                        : "text-slate-600 hover:text-slate-950",
                    ].join(" ")}
                  >
                    <span>{destination.label}</span>
                    <Icon
                      name="chevron-down"
                      size="small"
                      className={[
                        "transition-transform duration-200 ease-out motion-reduce:transition-none",
                        isMenuOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>
                  <ReviewShellStateMenu
                    isOpen={isMenuOpen}
                    isSignedIn={isSignedIn}
                    pathname={pathname}
                    onLoginSelect={
                      isPremiumMenu ? undefined : handleLoginSelect
                    }
                    onClose={closeMenu}
                    triggerRef={triggerRef}
                    labelledBy={TRIGGER_ID}
                    modeOptions={isPremiumMenu ? premiumModeOptions : undefined}
                    modeHeading={isPremiumMenu ? "Signal" : undefined}
                    showVisitorControls={!isPremiumMenu}
                  />
                </li>
              );
            }

            return (
              <li key={destination.href} className="relative z-10">
                <Link
                  href={destination.href}
                  aria-current={isActive ? "page" : undefined}
                  ref={(element) => {
                    itemRefs.current[destination.href] = element;
                  }}
                  className={[
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-medium tracking-[0.015em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 sm:px-4",
                    isActive
                      ? "text-sky-900"
                      : "text-slate-600 hover:text-slate-950",
                  ].join(" ")}
                >
                  {destination.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
