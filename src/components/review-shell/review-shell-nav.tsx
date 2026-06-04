"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  premiumLiveModeNavItems,
  premiumReviewFlowNavItems,
} from "@/components/premium/premium-concierge-flows";
import { Icon } from "@/components/primitives/icon";

import { useReviewShellState } from "./review-shell-state";
import {
  ReviewShellStateMenu,
  type ReviewShellModeMenuGroup,
} from "./review-shell-state-menu";

const HIRING_ALL_INTENTS_HREF = "/hiring";
const HIRING_ENTRY_LIX_TEST_HREF = "/hiring/entry-lix-test";
const HIRING_PROTOTYPE_HREF = HIRING_ENTRY_LIX_TEST_HREF;
const PREMIUM_PROTOTYPE_HREF = "/premium";
const PREMIUM_COMPANY_PAGES_MEMBER_HREF = "/premium-company-pages/member";
const PREMIUM_COMPANY_PAGES_ADMIN_HREF = "/premium-company-pages/admin";
const TRIGGER_ID = "review-shell-state-menu-trigger";
const HIRING_LIVE_NAV_ITEM = {
  id: "hiring-live",
  href: HIRING_ALL_INTENTS_HREF,
  label: "All intents",
  description: "Interact with the prototype to see results across all intents",
  typeLabel: "Interactive",
} as const;
const HIRING_ENTRY_LIX_TEST_NAV_ITEM = {
  id: "entry-lix-test",
  href: HIRING_ENTRY_LIX_TEST_HREF,
  label: "Entry LIX test",
  description: "Review the Contact sales entry choice experiment",
  typeLabel: "Interactive",
  hasDividerAfter: true,
} as const;
const HIRING_SHELL_OPTIONS = [
  {
    id: "hiring-shell-default",
    label: "Tray (hidden)",
  },
  {
    id: "hiring-shell-tray",
    label: "Tray (persistent)",
  },
  {
    id: "hiring-shell-hybrid",
    label: "Tray (hybrid)",
  },
] as const;
const PREMIUM_SHELL_OPTIONS = [
  {
    id: "premium-shell-dismissable-tray",
    label: "Tray (hidden)",
  },
  {
    id: "premium-shell-dockable-tray",
    label: "Tray (persistent)",
  },
] as const;
const PREMIUM_COMPANY_PAGES_SHELL_OPTIONS = [
  {
    id: "premium-company-pages-shell-fab",
    label: "FAB",
  },
  {
    id: "premium-company-pages-shell-tray",
    label: "Tray",
  },
] as const;
const hiringModeOptions = [
  HIRING_LIVE_NAV_ITEM,
  HIRING_ENTRY_LIX_TEST_NAV_ITEM,
  {
    id: "high",
    href: "/internal/flows/high",
    label: "High intent (static)",
  },
  {
    id: "medium",
    label: "Medium intent",
    options: [
      {
        id: "medium-available",
        href: "/internal/flows/medium/available",
        label: "SDR available",
        typeLabel: "Static",
      },
      {
        id: "medium-unavailable",
        href: "/internal/flows/medium/unavailable",
        label: "SDR unavailable",
        typeLabel: "Static",
      },
    ],
  },
  { id: "low", href: "/internal/flows/low", label: "Low intent (static)" },
] as const;
const premiumModeOptions = [
  ...premiumLiveModeNavItems,
  ...premiumReviewFlowNavItems,
] as const;
const premiumCompanyPagesModeOptions = [
  {
    id: "premium-company-pages-member",
    label: "Member view",
    description: "Visitor-facing company page",
    options: [
      {
        id: "premium-company-pages-member-buyer",
        href: PREMIUM_COMPANY_PAGES_MEMBER_HREF,
        label: "Buyer intent",
      },
      {
        id: "premium-company-pages-member-job-seeker",
        href: `${PREMIUM_COMPANY_PAGES_MEMBER_HREF}?vcaIntent=job-seeker`,
        label: "Job seeker intent",
      },
    ],
  },
  {
    id: "premium-company-pages-admin",
    href: PREMIUM_COMPANY_PAGES_ADMIN_HREF,
    label: "Admin view",
    description: "Admin view of PCP",
  },
] as const;
const prototypeProjectOptions = [
  {
    id: "project-hiring",
    href: HIRING_PROTOTYPE_HREF,
    label: "LTS microsite",
    description: "Hiring concierge prototype",
  },
  {
    id: "project-premium",
    href: PREMIUM_PROTOTYPE_HREF,
    label: "Premium survey",
    description: "Member Premium survey prototype",
  },
  {
    id: "project-premium-company-pages",
    href: PREMIUM_COMPANY_PAGES_MEMBER_HREF,
    label: "Premium Company Pages",
    description: "Company Pages prototype",
  },
] as const;

type ReviewDestination = Readonly<{
  href: string;
  label: string;
  matches: (pathname: string) => boolean;
  metaLabel?: string;
  menu?: "hiring" | "premium" | "premium-company-pages" | "projects";
}>;

type HiringShellLabel = (typeof HIRING_SHELL_OPTIONS)[number]["label"];
type PremiumShellLabel = (typeof PREMIUM_SHELL_OPTIONS)[number]["label"];
type PremiumCompanyPagesShellLabel =
  (typeof PREMIUM_COMPANY_PAGES_SHELL_OPTIONS)[number]["label"];
type PremiumCompanyPagesIntentLabel = "Buyer intent" | "Job seeker intent";
type ComponentProductLens = "hiring" | "premium";

const HOME_DESTINATION: ReviewDestination = {
  href: "/",
  label: "Home",
  matches: (candidate) => candidate === "/",
};
function getComponentsDestination(
  productLens: ComponentProductLens,
): ReviewDestination {
  return {
    href: `/internal/components?product=${productLens}`,
    label: "Components",
    matches: (candidate) => candidate.startsWith("/internal/components"),
  };
}

function isHiringPrototypePath(pathname: string) {
  return (
    pathname === HIRING_ALL_INTENTS_HREF ||
    pathname === HIRING_ENTRY_LIX_TEST_HREF ||
    pathname.startsWith("/internal/flows")
  );
}

function HomeNavIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-3 shrink-0 items-center justify-center"
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
  premiumCompanyPagesShellLabel?: PremiumCompanyPagesShellLabel,
  premiumCompanyPagesIntentLabel?: PremiumCompanyPagesIntentLabel,
): string | undefined {
  if (pathname.startsWith("/internal/components")) {
    return undefined;
  }

  if (pathname.startsWith("/premium-company-pages")) {
    if (pathname.startsWith(PREMIUM_COMPANY_PAGES_ADMIN_HREF)) {
      return `Admin view · ${premiumCompanyPagesShellLabel ?? "FAB"}`;
    }

    return `Member view · ${premiumCompanyPagesIntentLabel ?? "Buyer intent"} · ${premiumCompanyPagesShellLabel ?? "FAB"}`;
  }

  if (pathname.startsWith("/premium")) {
    const activePremiumMode = premiumModeOptions.find(
      (option) => option.href === pathname,
    );
    const modeLabel =
      activePremiumMode?.label ?? premiumLiveModeNavItems[0].label;

    return `${modeLabel} · ${premiumShellLabel}`;
  }

  if (isHiringPrototypePath(pathname)) {
    let modeLabel = "All intents";

    for (const option of hiringModeOptions) {
      if ("options" in option) {
        const activeChildOption = option.options.find(
          (childOption) => childOption.href === pathname,
        );

        if (activeChildOption) {
          modeLabel = `${option.label} · ${activeChildOption.label}`;
          break;
        }
      } else if (option.href === pathname) {
        modeLabel = option.label;
        break;
      }
    }

    return `${modeLabel} · ${hiringShellLabel}`;
  }

  return undefined;
}

function getPrototypeDestination(
  pathname: string,
  hiringShellLabel?: HiringShellLabel,
  premiumShellLabel?: PremiumShellLabel,
  premiumCompanyPagesShellLabel?: PremiumCompanyPagesShellLabel,
  premiumCompanyPagesIntentLabel?: PremiumCompanyPagesIntentLabel,
): ReviewDestination {
  if (pathname.startsWith("/internal/components")) {
    return {
      href: HIRING_PROTOTYPE_HREF,
      label: "Prototype",
      matches: () => false,
      menu: "projects",
    };
  }

  const isPremium =
    pathname.startsWith("/premium") &&
    !pathname.startsWith("/premium-company-pages");
  const isPremiumCompanyPages = pathname.startsWith("/premium-company-pages");

  return {
    href: isPremiumCompanyPages
      ? PREMIUM_COMPANY_PAGES_MEMBER_HREF
      : isPremium
        ? PREMIUM_PROTOTYPE_HREF
        : HIRING_PROTOTYPE_HREF,
    label: "Prototype",
    matches: isPremiumCompanyPages
      ? (candidate) => candidate.startsWith("/premium-company-pages")
      : isPremium
        ? (candidate) =>
            candidate.startsWith("/premium") &&
            !candidate.startsWith("/premium-company-pages")
        : (candidate) =>
            isHiringPrototypePath(candidate),
    menu: isPremiumCompanyPages
      ? "premium-company-pages"
      : isPremium
        ? "premium"
        : "hiring",
    metaLabel: getPrototypeMetaLabel(
      pathname,
      hiringShellLabel,
      premiumShellLabel,
      premiumCompanyPagesShellLabel,
      premiumCompanyPagesIntentLabel,
    ),
  };
}

function getReviewDestinations(
  pathname: string,
  hiringShellLabel?: HiringShellLabel,
  premiumShellLabel?: PremiumShellLabel,
  premiumCompanyPagesShellLabel?: PremiumCompanyPagesShellLabel,
  premiumCompanyPagesIntentLabel?: PremiumCompanyPagesIntentLabel,
  componentProductLens: ComponentProductLens = "hiring",
): ReadonlyArray<ReviewDestination> {
  return [
    HOME_DESTINATION,
    getPrototypeDestination(
      pathname,
      hiringShellLabel,
      premiumShellLabel,
      premiumCompanyPagesShellLabel,
      premiumCompanyPagesIntentLabel,
    ),
    getComponentsDestination(componentProductLens),
  ];
}

function withHiringShell(href: string, shellLabel: HiringShellLabel) {
  if (shellLabel === "Tray (hidden)") {
    return `${href}?shell=default`;
  }

  if (shellLabel === "Tray (persistent)") {
    return href;
  }

  return `${href}?shell=hybrid`;
}

function withPremiumShell(href: string, shellLabel: PremiumShellLabel) {
  if (shellLabel === "Tray (persistent)") {
    return `${href}?shell=tray`;
  }

  return href;
}

function withQueryParam(
  href: string,
  key: string,
  value: string | null,
) {
  const [path, queryString = ""] = href.split("?");
  const params = new URLSearchParams(queryString);

  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }

  const nextQueryString = params.toString();

  return nextQueryString ? `${path}?${nextQueryString}` : path;
}

function withPremiumCompanyPagesShell(
  href: string,
  shellLabel: PremiumCompanyPagesShellLabel,
) {
  if (shellLabel === "FAB") {
    return withQueryParam(href, "vcaShell", null);
  }

  return withQueryParam(href, "vcaShell", "tray");
}

function getHiringShellOptions(pathname: string) {
  const baseHref =
    isHiringPrototypePath(pathname)
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

function getPremiumCompanyPagesShellOptions(
  pathname: string,
  intentLabel: PremiumCompanyPagesIntentLabel,
) {
  const basePathname = pathname.startsWith("/premium-company-pages")
    ? pathname
    : PREMIUM_COMPANY_PAGES_MEMBER_HREF;
  const baseHref =
    intentLabel === "Job seeker intent" &&
    basePathname.startsWith(PREMIUM_COMPANY_PAGES_MEMBER_HREF)
      ? withQueryParam(basePathname, "vcaIntent", "job-seeker")
      : basePathname;

  return PREMIUM_COMPANY_PAGES_SHELL_OPTIONS.map((option) => ({
    ...option,
    href: withPremiumCompanyPagesShell(baseHref, option.label),
  }));
}

type ReviewShellNavProps = Readonly<{
  isToolbarHidden: boolean;
  onToolbarHiddenChange: (isHidden: boolean) => void;
}>;

export function ReviewShellNav({
  isToolbarHidden,
  onToolbarHiddenChange,
}: ReviewShellNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, setIsSignedIn } = useReviewShellState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPremiumCompanyPagesMember = pathname.startsWith(
    PREMIUM_COMPANY_PAGES_MEMBER_HREF,
  );
  const [hasDarkOverlayBackdrop, setHasDarkOverlayBackdrop] = useState(false);
  const usesDarkOverlayChrome =
    isPremiumCompanyPagesMember && hasDarkOverlayBackdrop;
  const currentSearch = searchParams.toString();
  const currentHref = currentSearch ? `${pathname}?${currentSearch}` : pathname;
  const activeHiringShellLabel: HiringShellLabel =
    searchParams.get("shell") === "hybrid"
      ? "Tray (hybrid)"
      : searchParams.get("shell") === "default" ||
          searchParams.get("shell") === "dismissable-tray"
        ? "Tray (hidden)"
        : "Tray (persistent)";
  const normalizedHiringHref =
    activeHiringShellLabel === "Tray (hybrid)"
      ? `${pathname}?shell=hybrid`
      : activeHiringShellLabel === "Tray (hidden)"
        ? `${pathname}?shell=default`
        : pathname;
  const activePremiumShellLabel: PremiumShellLabel =
    searchParams.get("shell") === "tray"
      ? "Tray (persistent)"
      : "Tray (hidden)";
  const normalizedPremiumHref =
    activePremiumShellLabel === "Tray (persistent)"
      ? currentHref
      : pathname;
  const activePremiumCompanyPagesShellLabel: PremiumCompanyPagesShellLabel =
    searchParams.get("vcaShell") === "tray" ? "Tray" : "FAB";
  const activePremiumCompanyPagesIntentLabel: PremiumCompanyPagesIntentLabel =
    searchParams.get("vcaIntent") === "job-seeker"
      ? "Job seeker intent"
      : "Buyer intent";
  const normalizedPremiumCompanyPagesHref =
    withPremiumCompanyPagesShell(
      activePremiumCompanyPagesIntentLabel === "Job seeker intent" &&
        pathname.startsWith(PREMIUM_COMPANY_PAGES_MEMBER_HREF)
        ? withQueryParam(pathname, "vcaIntent", "job-seeker")
        : pathname,
      activePremiumCompanyPagesShellLabel,
    );
  const componentProductLens: ComponentProductLens =
    (pathname.startsWith("/premium") &&
      !pathname.startsWith("/premium-company-pages")) ||
    pathname.startsWith("/premium-company-pages") ||
    searchParams.get("product") === "premium"
      ? "premium"
      : "hiring";
  const shellAwareHiringModeOptions = useMemo(
    () =>
      hiringModeOptions.map((option) => ({
        ...option,
        href: "href" in option && option.href
          ? withHiringShell(option.href, activeHiringShellLabel)
          : undefined,
        options:
          "options" in option
            ? option.options.map((childOption) => ({
                ...childOption,
                href: childOption.href
                  ? withHiringShell(childOption.href, activeHiringShellLabel)
                  : undefined,
              }))
            : undefined,
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
  const shellAwarePremiumCompanyPagesModeOptions = useMemo(
    () =>
      premiumCompanyPagesModeOptions.map((option) => ({
        ...option,
        href:
          "href" in option && option.href
            ? withPremiumCompanyPagesShell(
                option.href,
                activePremiumCompanyPagesShellLabel,
              )
            : undefined,
        options:
          "options" in option
            ? option.options.map((childOption) => ({
                ...childOption,
                href: withPremiumCompanyPagesShell(
                  childOption.href,
                  activePremiumCompanyPagesShellLabel,
                ),
              }))
            : undefined,
      })),
    [activePremiumCompanyPagesShellLabel],
  );
  const premiumModeGroups = useMemo<ReadonlyArray<ReviewShellModeMenuGroup>>(
    () => [
      {
        id: "premium-low-signal",
        label: "Low signal",
        description: "Ask user questions before recommending plan",
        options: [
          {
            id: "premium-low-signal-interactive",
            href:
              shellAwarePremiumModeOptions.find(
                (option) => option.id === "low-signal",
              )?.href ?? withPremiumShell("/premium", activePremiumShellLabel),
            label: "Interactive",
          },
          {
            id: "premium-low-signal-static",
            href:
              shellAwarePremiumModeOptions.find(
                (option) => option.id === "low",
              )?.href ??
              withPremiumShell("/premium/flows/low", activePremiumShellLabel),
            label: "Static",
          },
        ],
      },
      {
        id: "premium-high-signal",
        label: "High signal",
        description: "Give recommended plan immediately",
        options: [
          {
            id: "premium-high-signal-interactive",
            href:
              shellAwarePremiumModeOptions.find(
                (option) => option.id === "high-signal",
              )?.href ??
              withPremiumShell("/premium/live/high", activePremiumShellLabel),
            label: "Interactive",
          },
          {
            id: "premium-high-signal-static",
            href:
              shellAwarePremiumModeOptions.find(
                (option) => option.id === "high",
              )?.href ??
              withPremiumShell("/premium/flows/high", activePremiumShellLabel),
            label: "Static",
          },
        ],
      },
    ],
    [activePremiumShellLabel, shellAwarePremiumModeOptions],
  );
  const hiringShellOptions = useMemo(
    () => getHiringShellOptions(pathname),
    [pathname],
  );
  const premiumShellOptions = useMemo(
    () => getPremiumShellOptions(pathname),
    [pathname],
  );
  const premiumCompanyPagesShellOptions = useMemo(
    () =>
      getPremiumCompanyPagesShellOptions(
        pathname,
        activePremiumCompanyPagesIntentLabel,
      ),
    [activePremiumCompanyPagesIntentLabel, pathname],
  );
  const reviewDestinations = useMemo(
    () =>
      getReviewDestinations(
        pathname,
        activeHiringShellLabel,
        activePremiumShellLabel,
        activePremiumCompanyPagesShellLabel,
        activePremiumCompanyPagesIntentLabel,
        componentProductLens,
      ),
    [
      activeHiringShellLabel,
      activePremiumShellLabel,
      activePremiumCompanyPagesShellLabel,
      activePremiumCompanyPagesIntentLabel,
      componentProductLens,
      pathname,
    ],
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
  }, [pathname, isSignedIn, isToolbarHidden, reviewDestinations]);

  useEffect(() => {
    if (!isPremiumCompanyPagesMember) {
      return;
    }

    function getColorLuminance(color: string) {
      const rgbMatch = color.match(/^rgba?\((.+)\)$/);

      if (!rgbMatch) {
        return null;
      }

      const [channelValue, alphaValue] = rgbMatch[1].split("/");
      const channels = channelValue
        .trim()
        .split(/[,\s]+/)
        .filter(Boolean);

      if (channels.length < 3) {
        return null;
      }

      const alpha = alphaValue
        ? Number.parseFloat(alphaValue)
        : channels[3]
          ? Number.parseFloat(channels[3])
          : 1;

      if (alpha < 0.2) {
        return null;
      }

      const [red, green, blue] = channels.slice(0, 3).map((channel) => {
        if (channel.endsWith("%")) {
          return (Number.parseFloat(channel) / 100) * 255;
        }

        return Number.parseFloat(channel);
      });

      if ([red, green, blue].some((channel) => Number.isNaN(channel))) {
        return null;
      }

      const [linearRed, linearGreen, linearBlue] = [red, green, blue].map(
        (channel) => {
          const normalized = channel / 255;

          return normalized <= 0.03928
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4;
        },
      );

      return (
        0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue
      );
    }

    function getElementBackdropIsDark(element: Element) {
      let currentElement: HTMLElement | null =
        element instanceof HTMLElement ? element : element.parentElement;

      while (currentElement && currentElement !== document.documentElement) {
        const style = window.getComputedStyle(currentElement);
        const luminance = getColorLuminance(style.backgroundColor);

        if (luminance !== null) {
          return luminance < 0.45;
        }

        currentElement = currentElement.parentElement;
      }

      return false;
    }

    function getPointBackdropIsDark(
      navElement: HTMLElement,
      x: number,
      y: number,
    ) {
      const elements = document.elementsFromPoint(x, y);
      const backdropElement = elements.find(
        (element) => !navElement.contains(element),
      );

      return backdropElement
        ? getElementBackdropIsDark(backdropElement)
        : false;
    }

    function updateChromeContrast() {
      const navElement = listRef.current?.closest("nav");

      if (!(navElement instanceof HTMLElement)) {
        return;
      }

      const navRect = navElement.getBoundingClientRect();
      const sampleY = navRect.top + navRect.height / 2;
      const samplePoints = [
        navRect.left + Math.min(48, navRect.width / 4),
        navRect.left + navRect.width / 2,
        navRect.right - Math.min(48, navRect.width / 4),
      ];
      const darkSampleCount = samplePoints.filter((sampleX) =>
        getPointBackdropIsDark(navElement, sampleX, sampleY),
      ).length;

      setHasDarkOverlayBackdrop((currentValue) => {
        const nextValue = darkSampleCount >= 2;

        return currentValue === nextValue ? currentValue : nextValue;
      });
    }

    let frame = window.requestAnimationFrame(updateChromeContrast);

    function scheduleChromeContrastUpdate() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateChromeContrast);
    }

    window.addEventListener("scroll", scheduleChromeContrastUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleChromeContrastUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleChromeContrastUpdate);
      window.removeEventListener("resize", scheduleChromeContrastUpdate);
    };
  }, [isPremiumCompanyPagesMember]);

  function handleLoginSelect(next: boolean) {
    setIsSignedIn(next);
    setIsMenuOpen(false);
    router.push(
      withHiringShell(
        pathname === HIRING_ALL_INTENTS_HREF
          ? HIRING_ALL_INTENTS_HREF
          : HIRING_PROTOTYPE_HREF,
        activeHiringShellLabel,
      ),
    );
  }

  function closeMenu() {
    setIsMenuOpen(false);
    triggerRef.current?.focus();
  }

  function hideToolbar() {
    setIsMenuOpen(false);
    onToolbarHiddenChange(true);
  }

  if (isToolbarHidden) {
    return (
      <div className="pointer-events-none fixed left-3 top-3 z-50">
        <button
          type="button"
          aria-label="Reveal toolbar"
          title="Reveal toolbar"
          onClick={() => onToolbarHiddenChange(false)}
          className="group pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/75 bg-white/50 text-slate-700 shadow-[0_12px_32px_rgba(15,23,42,0.08),0_3px_12px_rgba(15,23,42,0.05)] ring-1 ring-black/5 backdrop-blur-2xl transition-colors duration-200 ease-out hover:bg-white/70 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 supports-[backdrop-filter]:bg-white/42"
        >
          <Icon name="visibility" size="small" className="[&&]:size-4" />
          <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/75 bg-white/70 px-3 py-1.5 text-[11px] font-medium leading-none text-slate-700 opacity-0 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-2xl transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 supports-[backdrop-filter]:bg-white/58">
            Reveal toolbar
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-50 flex justify-center px-4 sm:top-3">
      <nav
        aria-label="Review surfaces"
        className={[
          "pointer-events-auto rounded-full border bg-white/50 p-1 shadow-[0_12px_32px_rgba(15,23,42,0.08),0_3px_12px_rgba(15,23,42,0.05)] ring-1 ring-black/5 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/42",
          usesDarkOverlayChrome ? "border-white/40" : "border-white/75",
        ].join(" ")}
      >
        <ul ref={listRef} className="relative flex items-center gap-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-sky-50 ring-1 ring-sky-100 transition-[transform,width,opacity] duration-200 ease-out motion-reduce:transition-none"
            style={indicatorStyle}
          />
          {reviewDestinations.map((destination) => {
            const isActive = destination.matches(pathname);
            const hasMenu = Boolean(destination.menu);
            const isPremiumMenu = destination.menu === "premium";
            const isPremiumCompanyPagesMenu =
              destination.menu === "premium-company-pages";
            const isProjectMenu = destination.menu === "projects";
            const modeOptions = isProjectMenu
              ? prototypeProjectOptions
              : isPremiumCompanyPagesMenu
              ? shellAwarePremiumCompanyPagesModeOptions
              : isPremiumMenu
                ? shellAwarePremiumModeOptions
                : shellAwareHiringModeOptions;
            const shellOptions = isProjectMenu
              ? []
              : isPremiumCompanyPagesMenu
                ? premiumCompanyPagesShellOptions
              : isPremiumMenu
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
                      "inline-flex min-h-8 min-w-0 items-center gap-3 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium tracking-[0.015em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 sm:px-4",
                      isActive
                        ? "text-sky-900"
                        : usesDarkOverlayChrome
                          ? "text-white/90 hover:bg-white/15 hover:text-white"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
                    ].join(" ")}
                  >
                    <span className="inline-flex min-w-0 items-baseline gap-2 leading-none">
                      <span className="leading-[1.1]">
                        {destination.label}
                      </span>
                      {destination.metaLabel ? (
                        <span
                          className={[
                            "max-w-[44vw] truncate text-[10px] font-medium leading-[1.05] tracking-normal sm:max-w-none",
                            isActive
                              ? "text-sky-700/75"
                              : usesDarkOverlayChrome
                                ? "text-white/70"
                                : "text-slate-500",
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
                        "[&&]:size-3 transition-transform duration-200 ease-out motion-reduce:transition-none",
                        isMenuOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>
                  <ReviewShellStateMenu
                    isOpen={isMenuOpen}
                    isSignedIn={isSignedIn}
                    pathname={pathname}
                    currentHref={
                      isProjectMenu
                        ? pathname
                        : isPremiumCompanyPagesMenu
                          ? normalizedPremiumCompanyPagesHref
                        : isPremiumMenu
                          ? normalizedPremiumHref
                          : normalizedHiringHref
                    }
                    onLoginSelect={
                      isProjectMenu || isPremiumMenu || isPremiumCompanyPagesMenu
                        ? undefined
                        : handleLoginSelect
                    }
                    onClose={closeMenu}
                    triggerRef={triggerRef}
                    labelledBy={TRIGGER_ID}
                    modeOptions={modeOptions}
                    modeGroups={
                      isPremiumMenu && !isPremiumCompanyPagesMenu
                        ? premiumModeGroups
                        : undefined
                    }
                    modeHeading={isProjectMenu ? "Choose project" : "Choose flow"}
                    shellHeading="UI"
                    shellOptions={shellOptions}
                    showVisitorControls={
                      !isProjectMenu && !isPremiumMenu && !isPremiumCompanyPagesMenu
                    }
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
                    "inline-flex min-h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium tracking-[0.015em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 sm:px-4",
                    isActive
                      ? "text-sky-900"
                      : usesDarkOverlayChrome
                        ? "text-white/90 hover:bg-white/15 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
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
          <li
            aria-hidden="true"
            className={[
              "relative z-10 mx-1 h-5 w-px shrink-0",
              usesDarkOverlayChrome ? "bg-white/30" : "bg-slate-200/90",
            ].join(" ")}
          />
          <li className="relative z-10">
            <button
              type="button"
              aria-label="Hide toolbar"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                hideToolbar();
              }}
              onClick={hideToolbar}
              className={[
                "inline-flex min-h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium tracking-[0.015em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 sm:px-4",
                usesDarkOverlayChrome
                  ? "text-white/90 hover:bg-white/15 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
              ].join(" ")}
            >
              <Icon name="visibility-off" size="small" className="[&&]:size-4" />
              Hide
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
