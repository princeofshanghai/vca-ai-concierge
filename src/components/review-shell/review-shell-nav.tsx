"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  premiumLiveModeNavItems,
  premiumReviewFlowNavItems,
} from "@/components/premium/premium-concierge-flows";
import { Icon } from "@/components/primitives/icon";
import { FLOW_REVIEW_NAV_ITEMS } from "@/lib/conversation-flows";

import { useReviewShellState } from "./review-shell-state";
import { ReviewShellStateMenu } from "./review-shell-state-menu";

const HIRING_PROTOTYPE_HREF = "/hiring";
const PREMIUM_PROTOTYPE_HREF = "/premium";
const TRIGGER_ID = "review-shell-state-menu-trigger";
const HIRING_LIVE_NAV_ITEM = {
  id: "hiring-live",
  href: HIRING_PROTOTYPE_HREF,
  label: "Live (interactive)",
} as const;
const HIRING_SHELL_OPTIONS = [
  {
    id: "hiring-shell-default",
    label: "Floating card",
  },
  {
    id: "hiring-shell-tray",
    label: "Tray",
  },
  {
    id: "hiring-shell-hybrid",
    label: "Hybrid",
  },
] as const;
const PREMIUM_SHELL_OPTIONS = [
  {
    id: "premium-shell-fab",
    label: "FAB",
  },
  {
    id: "premium-shell-tray",
    label: "Tray",
  },
] as const;
const hiringModeOptions = [
  HIRING_LIVE_NAV_ITEM,
  ...FLOW_REVIEW_NAV_ITEMS,
] as const;
const premiumModeOptions = [
  ...premiumLiveModeNavItems,
  ...premiumReviewFlowNavItems,
] as const;

type ReviewDestination = Readonly<{
  href: string;
  label: string;
  matches: (pathname: string) => boolean;
  metaLabel?: string;
  menu?: "hiring" | "premium";
}>;

type HiringShellLabel = (typeof HIRING_SHELL_OPTIONS)[number]["label"];
type PremiumShellLabel = (typeof PREMIUM_SHELL_OPTIONS)[number]["label"];

const HOME_DESTINATION: ReviewDestination = {
  href: "/",
  label: "Home",
  matches: (candidate) => candidate === "/",
};
const COMPONENTS_DESTINATION: ReviewDestination = {
  href: "/internal/components",
  label: "Components",
  matches: (candidate) => candidate.startsWith("/internal/components"),
};

function HomeNavIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-[var(--design-icon-size-small)] shrink-0 items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-full"
      >
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    </span>
  );
}

function getPrototypeMetaLabel(
  pathname: string,
  hiringShellLabel?: HiringShellLabel,
  premiumShellLabel?: PremiumShellLabel,
): string | undefined {
  if (pathname.startsWith("/internal/components")) {
    return undefined;
  }

  if (pathname.startsWith("/premium")) {
    const activePremiumMode = premiumModeOptions.find(
      (option) => option.href === pathname,
    );
    const modeLabel =
      activePremiumMode?.label ?? premiumLiveModeNavItems[0].label;

    return premiumShellLabel === "Tray"
      ? `${modeLabel} · ${premiumShellLabel}`
      : modeLabel;
  }

  if (
    pathname === HIRING_PROTOTYPE_HREF ||
    pathname.startsWith("/internal/flows")
  ) {
    const activeHiringMode = hiringModeOptions.find(
      (option) => option.href === pathname,
    );
    const modeLabel = activeHiringMode?.label ?? "Live (interactive)";

    return `${modeLabel} · ${hiringShellLabel}`;
  }

  return undefined;
}

function getPrototypeDestination(
  pathname: string,
  hiringShellLabel?: HiringShellLabel,
  premiumShellLabel?: PremiumShellLabel,
): ReviewDestination {
  const isPremium = pathname.startsWith("/premium");

  return {
    href: isPremium ? PREMIUM_PROTOTYPE_HREF : HIRING_PROTOTYPE_HREF,
    label: "Prototype",
    matches: isPremium
      ? (candidate) => candidate.startsWith("/premium")
      : (candidate) =>
          candidate === HIRING_PROTOTYPE_HREF ||
          candidate.startsWith("/internal/flows"),
    menu: isPremium ? "premium" : "hiring",
    metaLabel: getPrototypeMetaLabel(
      pathname,
      hiringShellLabel,
      premiumShellLabel,
    ),
  };
}

function getReviewDestinations(
  pathname: string,
  hiringShellLabel?: HiringShellLabel,
  premiumShellLabel?: PremiumShellLabel,
): ReadonlyArray<ReviewDestination> {
  if (pathname.startsWith("/premium")) {
    return [
      HOME_DESTINATION,
      getPrototypeDestination(pathname, hiringShellLabel, premiumShellLabel),
    ];
  }

  return [
    HOME_DESTINATION,
    getPrototypeDestination(pathname, hiringShellLabel, premiumShellLabel),
    COMPONENTS_DESTINATION,
  ];
}

function withHiringShell(href: string, shellLabel: HiringShellLabel) {
  if (shellLabel === "Floating card") {
    return `${href}?shell=default`;
  }

  if (shellLabel === "Tray") {
    return `${href}?shell=tray`;
  }

  return href;
}

function withPremiumShell(href: string, shellLabel: PremiumShellLabel) {
  if (shellLabel === "Tray") {
    return `${href}?shell=tray`;
  }

  return href;
}

function getHiringShellOptions(pathname: string) {
  const baseHref =
    pathname === HIRING_PROTOTYPE_HREF || pathname.startsWith("/internal/flows")
      ? pathname
      : HIRING_PROTOTYPE_HREF;

  return HIRING_SHELL_OPTIONS.map((option) => ({
    ...option,
    href: withHiringShell(baseHref, option.label),
  }));
}

function getPremiumShellOptions(pathname: string) {
  const baseHref = pathname.startsWith("/premium")
    ? pathname
    : PREMIUM_PROTOTYPE_HREF;

  return PREMIUM_SHELL_OPTIONS.map((option) => ({
    ...option,
    href: withPremiumShell(baseHref, option.label),
  }));
}

export function ReviewShellNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, setIsSignedIn } = useReviewShellState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentSearch = searchParams.toString();
  const currentHref = currentSearch ? `${pathname}?${currentSearch}` : pathname;
  const activeHiringShellLabel: HiringShellLabel =
    searchParams.get("shell") === "tray"
      ? "Tray"
      : searchParams.get("shell") === "default" ||
          searchParams.get("shell") === "floating"
        ? "Floating card"
        : "Hybrid";
  const normalizedHiringHref =
    activeHiringShellLabel === "Hybrid"
      ? pathname
      : activeHiringShellLabel === "Floating card"
        ? `${pathname}?shell=default`
        : currentHref;
  const activePremiumShellLabel: PremiumShellLabel =
    searchParams.get("shell") === "tray" ? "Tray" : "FAB";
  const shellAwareHiringModeOptions = useMemo(
    () =>
      hiringModeOptions.map((option) => ({
        ...option,
        href: withHiringShell(option.href, activeHiringShellLabel),
      })),
    [activeHiringShellLabel],
  );
  const shellAwarePremiumModeOptions = useMemo(
    () =>
      premiumModeOptions.map((option) => ({
        ...option,
        href: withPremiumShell(option.href, activePremiumShellLabel),
      })),
    [activePremiumShellLabel],
  );
  const hiringShellOptions = useMemo(
    () => getHiringShellOptions(pathname),
    [pathname],
  );
  const premiumShellOptions = useMemo(
    () => getPremiumShellOptions(pathname),
    [pathname],
  );
  const reviewDestinations = useMemo(
    () =>
      getReviewDestinations(
        pathname,
        activeHiringShellLabel,
        activePremiumShellLabel,
      ),
    [activeHiringShellLabel, activePremiumShellLabel, pathname],
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
    router.push(withHiringShell(HIRING_PROTOTYPE_HREF, activeHiringShellLabel));
  }

  function closeMenu() {
    setIsMenuOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-50 flex justify-center px-4 sm:top-3">
      <nav
        aria-label="Review surfaces"
        className="pointer-events-auto rounded-full border border-white/75 bg-white/50 p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.08),0_3px_12px_rgba(15,23,42,0.05)] ring-1 ring-black/5 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/42"
      >
        <ul ref={listRef} className="relative flex items-center gap-2">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-sky-50 ring-1 ring-sky-100 transition-[transform,width,opacity] duration-200 ease-out motion-reduce:transition-none"
            style={indicatorStyle}
          />
          {reviewDestinations.map((destination) => {
            const isActive = destination.matches(pathname);
            const hasMenu = Boolean(destination.menu);
            const isPremiumMenu = destination.menu === "premium";
            const modeOptions = isPremiumMenu
              ? shellAwarePremiumModeOptions
              : shellAwareHiringModeOptions;
            const shellOptions = isPremiumMenu
              ? premiumShellOptions
              : hiringShellOptions;

            if (hasMenu) {
              return (
                <li key={destination.href} className="relative z-10">
                  <button
                    id={TRIGGER_ID}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Open Prototype review menu${
                      destination.metaLabel
                        ? ` for ${destination.metaLabel}`
                        : ""
                    }`}
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    ref={(element) => {
                      itemRefs.current[destination.href] = element;
                      triggerRef.current = element;
                    }}
                    className={[
                      "inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-medium tracking-[0.015em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 sm:px-5",
                      isActive
                        ? "text-sky-900"
                        : "text-slate-600 hover:text-slate-950",
                    ].join(" ")}
                  >
                    <span className="flex min-w-0 flex-col items-start leading-none">
                      <span className="leading-[1.1]">
                        {destination.label}
                      </span>
                      {destination.metaLabel ? (
                        <span
                          className={[
                            "mt-0.5 max-w-[96px] truncate text-[10px] font-medium leading-[1.05] tracking-normal sm:max-w-[220px]",
                            isActive ? "text-sky-700/75" : "text-slate-500",
                          ].join(" ")}
                        >
                          {destination.metaLabel}
                        </span>
                      ) : null}
                    </span>
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
                    currentHref={
                      isPremiumMenu ? currentHref : normalizedHiringHref
                    }
                    onLoginSelect={
                      isPremiumMenu ? undefined : handleLoginSelect
                    }
                    onClose={closeMenu}
                    triggerRef={triggerRef}
                    labelledBy={TRIGGER_ID}
                    modeOptions={modeOptions}
                    modeHeading="Choose flow"
                    shellOptions={shellOptions}
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
                    "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.015em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 sm:px-5",
                    isActive
                      ? "text-sky-900"
                      : "text-slate-600 hover:text-slate-950",
                  ].join(" ")}
                >
                  {destination.href === HOME_DESTINATION.href ? (
                    <HomeNavIcon />
                  ) : null}
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
