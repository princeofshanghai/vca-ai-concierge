"use client";

import { useMemo, useRef, useState } from "react";

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
const HIRING_PROTOTYPE_HREF = HIRING_ALL_INTENTS_HREF;
const HIRING_FLOW_MAP_HREF = "/internal/flows";
const PREMIUM_PROTOTYPE_HREF = "/premium";
const PREMIUM_UPSELL_HELP_CENTER_HREF = "/premium-upsell-help-center";
const PREMIUM_UPSELL_HELP_CENTER_AI_CONCIERGE_HREF =
  "/premium-upsell-help-center/ai-concierge";
const PREMIUM_UPSELL_HELP_CENTER_AI_SUMMARY_HREF =
  "/premium-upsell-help-center/ai-summary";
const PREMIUM_UPSELL_HELP_CENTER_SEARCH_RESULT_HREF =
  "/premium-upsell-help-center/search-result";
const PREMIUM_COMPANY_PAGES_MEMBER_HREF = "/premium-company-pages/member";
const PREMIUM_COMPANY_PAGES_ADMIN_HREF = "/premium-company-pages/admin";
const PREMIUM_COMPANY_PAGES_ADMIN_CURRENT_STATE_HREF =
  "/premium-company-pages/admin/current-state";
const PREMIUM_COMPANY_PAGES_ADMIN_OLD_HREF =
  "/premium-company-pages/admin/old";
const PREMIUM_COMPANY_PAGES_STORIES_HREF = "/premium-company-pages/stories";
const VCA_ECOSYSTEM_HREF = "/vca-ecosystem";
const VCA_ECOSYSTEM_ONLINE_JOBS_HREF = "/vca-ecosystem/online-jobs";
const VCA_ECOSYSTEM_FLAGSHIP_HREF = "/vca-ecosystem/flagship";
const TRIGGER_ID = "review-shell-state-menu-trigger";
const HIRING_LIVE_NAV_ITEM = {
  id: "hiring-live",
  href: HIRING_ALL_INTENTS_HREF,
  label: "All intents",
  typeLabel: "Interactive",
} as const;
const HIRING_SHELL_OPTIONS = [
  {
    id: "hiring-shell-tray",
    label: "Tray (persistent)",
  },
  {
    id: "hiring-shell-hybrid",
    label: "Tray (hybrid)",
  },
  {
    id: "hiring-shell-default",
    label: "Tray (hidden)",
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
    id: "premium-company-pages-shell-fab-icon",
    label: "FAB icon",
  },
  {
    id: "premium-company-pages-shell-fab-pill",
    label: "FAB pill",
  },
  {
    id: "premium-company-pages-shell-tray",
    label: "Tray",
  },
] as const;
const hiringModeOptions = [
  HIRING_LIVE_NAV_ITEM,
  {
    id: "hiring-flow-map",
    href: HIRING_FLOW_MAP_HREF,
    label: "Flow map",
    typeLabel: "Static",
    hasDividerAfter: true,
  },
  {
    id: "high",
    href: "/internal/flows/high",
    label: "High intent (static)",
  },
  {
    id: "medium",
    href: "/internal/flows/medium",
    label: "Medium intent",
    typeLabel: "Static",
    showSubmenu: false,
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
      {
        id: "medium-failed",
        href: "/internal/flows/medium/failed",
        label: "SDR connection failed",
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
    href: PREMIUM_COMPANY_PAGES_MEMBER_HREF,
    label: "Visitor view",
    description: "Visitor view of PCP",
  },
  {
    id: "premium-company-pages-admin",
    href: PREMIUM_COMPANY_PAGES_ADMIN_HREF,
    label: "Admin view",
    description: "Admin view of PCP",
  },
  {
    id: "premium-company-pages-current-state",
    href: PREMIUM_COMPANY_PAGES_ADMIN_CURRENT_STATE_HREF,
    label: "Current state",
    description: "Current LinkedIn Page admin baseline",
  },
  {
    id: "premium-company-pages-future-vision",
    href: PREMIUM_COMPANY_PAGES_ADMIN_OLD_HREF,
    label: "Future vision",
    description: "Vision prototype for the VCA admin experience",
  },
] as const;
const premiumCompanyPagesPlaceholderStoryLabels: Readonly<
  Record<string, string>
> = {
  "1b": "Story 1b",
  "1c": "Story 1c",
  "2": "Story 2",
};
const vcaEcosystemModeOptions = [
  {
    id: "vca-ecosystem-help-center",
    href: VCA_ECOSYSTEM_HREF,
    label: "Help center",
    description: "Recruiter support landing page",
  },
  {
    id: "vca-ecosystem-online-jobs",
    href: VCA_ECOSYSTEM_ONLINE_JOBS_HREF,
    label: "Online jobs",
    description: "Jobs management landing page",
  },
  {
    id: "vca-ecosystem-flagship",
    href: VCA_ECOSYSTEM_FLAGSHIP_HREF,
    label: "Flagship",
    description: "LinkedIn.com member experience",
  },
] as const;
const premiumUpsellHelpCenterModeOptions = [
  {
    id: "premium-upsell-help-center-always-on-banner",
    label: "Always on banner",
    options: [
      {
        id: "premium-upsell-help-center-low-upm",
        href: `${PREMIUM_UPSELL_HELP_CENTER_HREF}?upmSignal=low`,
        label: "Low UPM signal",
        description: "Go to choose flow",
      },
      {
        id: "premium-upsell-help-center-high-upm",
        href: `${PREMIUM_UPSELL_HELP_CENTER_HREF}?upmSignal=high`,
        label: "High UPM signal",
        description: "Open AI concierge",
      },
    ],
  },
  {
    id: "premium-upsell-help-center-search-result",
    href: PREMIUM_UPSELL_HELP_CENTER_SEARCH_RESULT_HREF,
    label: "Search result",
  },
  {
    id: "premium-upsell-help-center-ai-summary",
    label: "AI summary",
    options: [
      {
        id: "premium-upsell-help-center-ai-summary-high",
        href: `${PREMIUM_UPSELL_HELP_CENTER_AI_SUMMARY_HREF}?signal=high`,
        label: "High signal",
      },
      {
        id: "premium-upsell-help-center-ai-summary-low",
        href: `${PREMIUM_UPSELL_HELP_CENTER_AI_SUMMARY_HREF}?signal=low`,
        label: "Low signal",
      },
    ],
  },
  {
    id: "premium-upsell-help-center-ai-concierge",
    label: "Using AI concierge",
    options: [
      {
        id: "premium-upsell-help-center-ai-concierge-high",
        href: `${PREMIUM_UPSELL_HELP_CENTER_AI_CONCIERGE_HREF}?signal=high`,
        label: "High signal",
      },
      {
        id: "premium-upsell-help-center-ai-concierge-low",
        href: `${PREMIUM_UPSELL_HELP_CENTER_AI_CONCIERGE_HREF}?signal=low`,
        label: "Low signal",
      },
    ],
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
    id: "project-premium-upsell-help-center",
    href: PREMIUM_UPSELL_HELP_CENTER_HREF,
    label: "Premium upsell in Help Center",
    description: "Help Center upsell prototype",
  },
  {
    id: "project-premium-company-pages",
    href: PREMIUM_COMPANY_PAGES_ADMIN_HREF,
    label: "Premium Company Pages",
    description: "Company Pages prototype",
  },
  {
    id: "project-vca-ecosystem",
    href: VCA_ECOSYSTEM_HREF,
    label: "VCA ecosystem",
    description: "Near term VCA UI optimizations",
  },
] as const;

type ReviewDestination = Readonly<{
  href: string;
  label: string;
  matches: (pathname: string) => boolean;
  metaLabel?: string;
  menu?:
    | "hiring"
    | "premium"
    | "premium-upsell-help-center"
    | "premium-company-pages"
    | "projects"
    | "vca-ecosystem";
}>;

type HiringShellLabel = (typeof HIRING_SHELL_OPTIONS)[number]["label"];
type HiringCallbackFormLabel = "On" | "Off";
type PremiumShellLabel = (typeof PREMIUM_SHELL_OPTIONS)[number]["label"];
type PremiumCompanyPagesShellLabel =
  (typeof PREMIUM_COMPANY_PAGES_SHELL_OPTIONS)[number]["label"];
type PremiumCompanyPagesIntentLabel = "Buyer intent" | "Job seeker intent";
type ComponentProductLens = "hiring" | "premium";
type PremiumUpsellSignalLabel = "Low UPM signal" | "High UPM signal";
type PremiumUpsellAiSignalLabel = "Low signal" | "High signal";
type PremiumUpsellAiSummarySignalLabel = "Low signal" | "High signal";

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

function getPremiumCompanyPagesPlaceholderStoryLabel(pathname: string) {
  const storyId = pathname
    .replace(`${PREMIUM_COMPANY_PAGES_STORIES_HREF}/`, "")
    .split("/")[0];

  if (storyId === pathname) {
    return undefined;
  }

  return premiumCompanyPagesPlaceholderStoryLabels[storyId];
}

function getPrototypeMetaLabel(
  pathname: string,
  hiringShellLabel?: HiringShellLabel,
  premiumShellLabel?: PremiumShellLabel,
  premiumUpsellSignalLabel?: PremiumUpsellSignalLabel,
  premiumUpsellAiSignalLabel?: PremiumUpsellAiSignalLabel,
  premiumUpsellAiSummarySignalLabel?: PremiumUpsellAiSummarySignalLabel,
): string | undefined {
  if (pathname.startsWith("/internal/components")) {
    return undefined;
  }

  if (pathname.startsWith(VCA_ECOSYSTEM_HREF)) {
    if (pathname.startsWith(VCA_ECOSYSTEM_FLAGSHIP_HREF)) {
      return "Flagship";
    }

    if (pathname.startsWith(VCA_ECOSYSTEM_ONLINE_JOBS_HREF)) {
      return "Online jobs";
    }

    return "Help center";
  }

  if (pathname.startsWith("/premium-company-pages")) {
    const placeholderStoryLabel =
      getPremiumCompanyPagesPlaceholderStoryLabel(pathname);

    if (placeholderStoryLabel) {
      return `${placeholderStoryLabel} · Placeholder`;
    }

    if (pathname.startsWith(PREMIUM_COMPANY_PAGES_ADMIN_OLD_HREF)) {
      return "Future vision";
    }

    if (pathname.startsWith(PREMIUM_COMPANY_PAGES_ADMIN_CURRENT_STATE_HREF)) {
      return "Current state";
    }

    if (pathname.startsWith(PREMIUM_COMPANY_PAGES_ADMIN_HREF)) {
      return "Admin view";
    }

    return "Visitor view";
  }

  if (pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_SEARCH_RESULT_HREF)) {
    return "Search result";
  }

  if (pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_AI_SUMMARY_HREF)) {
    return premiumUpsellAiSummarySignalLabel
      ? `AI summary · ${premiumUpsellAiSummarySignalLabel}`
      : "AI summary";
  }

  if (pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_AI_CONCIERGE_HREF)) {
    return premiumUpsellAiSignalLabel
      ? `Using AI concierge · ${premiumUpsellAiSignalLabel}`
      : "Using AI concierge";
  }

  if (pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_HREF)) {
    return premiumUpsellSignalLabel
      ? `Always on banner · ${premiumUpsellSignalLabel}`
      : "Always on banner";
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

    return modeLabel;
  }

  return undefined;
}

function getPrototypeDestination(
  pathname: string,
  hiringShellLabel?: HiringShellLabel,
  premiumShellLabel?: PremiumShellLabel,
  premiumUpsellSignalLabel?: PremiumUpsellSignalLabel,
  premiumUpsellAiSignalLabel?: PremiumUpsellAiSignalLabel,
  premiumUpsellAiSummarySignalLabel?: PremiumUpsellAiSummarySignalLabel,
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
    !pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_HREF) &&
    !pathname.startsWith("/premium-company-pages");
  const isPremiumUpsellHelpCenter = pathname.startsWith(
    PREMIUM_UPSELL_HELP_CENTER_HREF,
  );
  const isPremiumCompanyPages = pathname.startsWith("/premium-company-pages");
  const isVcaEcosystem = pathname.startsWith(VCA_ECOSYSTEM_HREF);

  return {
    href: isVcaEcosystem
      ? VCA_ECOSYSTEM_HREF
      : isPremiumUpsellHelpCenter
      ? PREMIUM_UPSELL_HELP_CENTER_HREF
      : isPremiumCompanyPages
      ? PREMIUM_COMPANY_PAGES_MEMBER_HREF
      : isPremium
        ? PREMIUM_PROTOTYPE_HREF
        : HIRING_PROTOTYPE_HREF,
    label: "Prototype",
    matches: isVcaEcosystem
      ? (candidate) => candidate.startsWith(VCA_ECOSYSTEM_HREF)
      : isPremiumUpsellHelpCenter
      ? (candidate) => candidate.startsWith(PREMIUM_UPSELL_HELP_CENTER_HREF)
      : isPremiumCompanyPages
      ? (candidate) => candidate.startsWith("/premium-company-pages")
      : isPremium
        ? (candidate) =>
            candidate.startsWith("/premium") &&
            !candidate.startsWith("/premium-company-pages")
        : (candidate) =>
            isHiringPrototypePath(candidate),
    menu: isVcaEcosystem
      ? "vca-ecosystem"
      : isPremiumUpsellHelpCenter
      ? "premium-upsell-help-center"
      : isPremiumCompanyPages
      ? "premium-company-pages"
      : isPremium
        ? "premium"
        : "hiring",
    metaLabel: getPrototypeMetaLabel(
      pathname,
      hiringShellLabel,
      premiumShellLabel,
      premiumUpsellSignalLabel,
      premiumUpsellAiSignalLabel,
      premiumUpsellAiSummarySignalLabel,
    ),
  };
}

function getReviewDestinations(
  pathname: string,
  hiringShellLabel?: HiringShellLabel,
  premiumShellLabel?: PremiumShellLabel,
  componentProductLens: ComponentProductLens = "hiring",
  premiumUpsellSignalLabel?: PremiumUpsellSignalLabel,
  premiumUpsellAiSignalLabel?: PremiumUpsellAiSignalLabel,
  premiumUpsellAiSummarySignalLabel?: PremiumUpsellAiSummarySignalLabel,
): ReadonlyArray<ReviewDestination> {
  const destinations = [
    HOME_DESTINATION,
    getPrototypeDestination(
      pathname,
      hiringShellLabel,
      premiumShellLabel,
      premiumUpsellSignalLabel,
      premiumUpsellAiSignalLabel,
      premiumUpsellAiSummarySignalLabel,
    ),
  ];

  destinations.push(getComponentsDestination(componentProductLens));

  return destinations;
}

function withHiringCallbackForm(
  href: string,
  callbackFormLabel: HiringCallbackFormLabel,
) {
  return withQueryParam(
    href,
    "callbackForm",
    callbackFormLabel === "Off" ? "off" : null,
  );
}

function withHiringShell(href: string, shellLabel: HiringShellLabel) {
  if (shellLabel === "Tray (persistent)") {
    return withQueryParam(href, "shell", null);
  }

  if (shellLabel === "Tray (hidden)") {
    return withQueryParam(href, "shell", "default");
  }

  return withQueryParam(href, "shell", "hybrid");
}

function withHiringPrototypeSettings(
  href: string,
  shellLabel: HiringShellLabel,
  callbackFormLabel: HiringCallbackFormLabel,
) {
  const hrefWithCallbackForm =
    href.split("?")[0] === HIRING_ALL_INTENTS_HREF
      ? withHiringCallbackForm(href, callbackFormLabel)
      : href;

  return withHiringShell(hrefWithCallbackForm, shellLabel);
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
  if (shellLabel === "FAB icon") {
    return withQueryParam(href, "vcaShell", null);
  }

  if (shellLabel === "FAB pill") {
    return withQueryParam(href, "vcaShell", "fab-pill");
  }

  return withQueryParam(href, "vcaShell", "tray");
}

function getPremiumCompanyPagesMemberShellLabel(
  value: string | null,
): PremiumCompanyPagesShellLabel {
  if (value === "tray") {
    return "Tray";
  }

  if (value === "fab-pill" || value === "fab") {
    return "FAB pill";
  }

  return "FAB icon";
}

function getPremiumCompanyPagesActiveShellLabel(
  value: string | null,
  isMemberView: boolean,
): PremiumCompanyPagesShellLabel {
  if (isMemberView) {
    return getPremiumCompanyPagesMemberShellLabel(value);
  }

  return value === "tray" ? "Tray" : "FAB pill";
}

function getHiringShellOptions(
  pathname: string,
  callbackFormLabel: HiringCallbackFormLabel,
) {
  const basePathname =
    isHiringPrototypePath(pathname)
      ? pathname
      : HIRING_PROTOTYPE_HREF;
  const baseHref =
    basePathname === HIRING_ALL_INTENTS_HREF
      ? withHiringCallbackForm(basePathname, callbackFormLabel)
      : basePathname;

  return HIRING_SHELL_OPTIONS.map((option) => ({
    ...option,
    href: withHiringShell(baseHref, option.label),
  }));
}

function getHiringCallbackFormOptions(shellLabel: HiringShellLabel) {
  return [
    {
      id: "hiring-callback-form-on",
      label: "On",
      href: withHiringPrototypeSettings(
        HIRING_ALL_INTENTS_HREF,
        shellLabel,
        "On",
      ),
    },
    {
      id: "hiring-callback-form-off",
      label: "Off",
      href: withHiringPrototypeSettings(
        HIRING_ALL_INTENTS_HREF,
        shellLabel,
        "Off",
      ),
    },
  ] as const;
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

  const shellOptions = basePathname.startsWith(PREMIUM_COMPANY_PAGES_MEMBER_HREF)
    ? PREMIUM_COMPANY_PAGES_SHELL_OPTIONS
    : PREMIUM_COMPANY_PAGES_SHELL_OPTIONS.filter(
        (option) => option.label !== "FAB icon",
      );

  return shellOptions.map((option) => ({
    ...option,
    href: withPremiumCompanyPagesShell(baseHref, option.label),
  }));
}

export function ReviewShellNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, setIsSignedIn } = useReviewShellState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHiringFlowMap = pathname === HIRING_FLOW_MAP_HREF;
  const isPremiumCompanyPagesMember = pathname.startsWith(
    PREMIUM_COMPANY_PAGES_MEMBER_HREF,
  );
  const currentSearch = searchParams.toString();
  const currentHref = currentSearch ? `${pathname}?${currentSearch}` : pathname;
  const vcaShellParam = searchParams.get("vcaShell");
  const activeHiringShellLabel: HiringShellLabel =
    searchParams.get("shell") === "tray" ||
    searchParams.get("shell") === "persistent-tray"
      ? "Tray (persistent)"
      : searchParams.get("shell") === "hybrid"
      ? "Tray (hybrid)"
      : searchParams.get("shell") === "default" ||
          searchParams.get("shell") === "dismissable-tray"
        ? "Tray (hidden)"
        : "Tray (persistent)";
  const activeHiringCallbackFormLabel: HiringCallbackFormLabel =
    searchParams.get("callbackForm") === "off" ? "Off" : "On";
  const normalizedHiringHref =
    withHiringPrototypeSettings(
      pathname,
      activeHiringShellLabel,
      activeHiringCallbackFormLabel,
    );
  const normalizedHiringCallbackFormHref =
    withHiringPrototypeSettings(
      HIRING_ALL_INTENTS_HREF,
      activeHiringShellLabel,
      activeHiringCallbackFormLabel,
    );
  const activePremiumShellLabel: PremiumShellLabel =
    searchParams.get("shell") === "tray"
      ? "Tray (persistent)"
      : "Tray (hidden)";
  const normalizedPremiumHref =
    activePremiumShellLabel === "Tray (persistent)"
      ? currentHref
      : pathname;
  const activePremiumCompanyPagesShellLabel =
    getPremiumCompanyPagesActiveShellLabel(
      vcaShellParam,
      isPremiumCompanyPagesMember,
    );
  const activePremiumCompanyPagesIntentLabel: PremiumCompanyPagesIntentLabel =
    searchParams.get("vcaIntent") === "job-seeker"
      ? "Job seeker intent"
      : "Buyer intent";
  const premiumCompanyPagesBaseHref =
    activePremiumCompanyPagesIntentLabel === "Job seeker intent" &&
    pathname.startsWith(PREMIUM_COMPANY_PAGES_MEMBER_HREF)
      ? withQueryParam(pathname, "vcaIntent", "job-seeker")
      : pathname;
  const normalizedPremiumCompanyPagesHref =
    withPremiumCompanyPagesShell(
      premiumCompanyPagesBaseHref,
      activePremiumCompanyPagesShellLabel,
    );
  const activePremiumUpsellSignal =
    searchParams.get("upmSignal") === "high"
      ? "high"
      : searchParams.get("upmSignal") === "low"
        ? "low"
        : null;
  const activePremiumUpsellSignalLabel: PremiumUpsellSignalLabel | undefined =
    activePremiumUpsellSignal === "high"
      ? "High UPM signal"
      : activePremiumUpsellSignal === "low"
        ? "Low UPM signal"
        : undefined;
  const activePremiumUpsellAiSignal =
    pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_AI_CONCIERGE_HREF) &&
    searchParams.get("signal") === "high"
      ? "high"
      : pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_AI_CONCIERGE_HREF) &&
          searchParams.get("signal") === "low"
        ? "low"
        : null;
  const activePremiumUpsellAiSignalLabel:
    | PremiumUpsellAiSignalLabel
    | undefined =
    activePremiumUpsellAiSignal === "high"
      ? "High signal"
      : activePremiumUpsellAiSignal === "low"
        ? "Low signal"
        : undefined;
  const activePremiumUpsellAiSummarySignal =
    pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_AI_SUMMARY_HREF) &&
    searchParams.get("signal") === "high"
      ? "high"
      : pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_AI_SUMMARY_HREF) &&
          searchParams.get("signal") === "low"
        ? "low"
        : null;
  const activePremiumUpsellAiSummarySignalLabel:
    | PremiumUpsellAiSummarySignalLabel
    | undefined =
    activePremiumUpsellAiSummarySignal === "high"
      ? "High signal"
      : activePremiumUpsellAiSummarySignal === "low"
        ? "Low signal"
        : undefined;
  const normalizedPremiumUpsellHelpCenterHref =
    activePremiumUpsellAiSummarySignal
      ? `${PREMIUM_UPSELL_HELP_CENTER_AI_SUMMARY_HREF}?signal=${activePremiumUpsellAiSummarySignal}`
      : activePremiumUpsellAiSignal
        ? `${PREMIUM_UPSELL_HELP_CENTER_AI_CONCIERGE_HREF}?signal=${activePremiumUpsellAiSignal}`
        : activePremiumUpsellSignal
          ? `${PREMIUM_UPSELL_HELP_CENTER_HREF}?upmSignal=${activePremiumUpsellSignal}`
          : currentHref;
  const componentProductLens: ComponentProductLens =
    pathname.startsWith(PREMIUM_UPSELL_HELP_CENTER_HREF) ||
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
          ? withHiringPrototypeSettings(
              option.href,
              activeHiringShellLabel,
              activeHiringCallbackFormLabel,
            )
          : undefined,
        options:
          "options" in option
            ? option.options.map((childOption) => ({
                ...childOption,
                href: childOption.href
                  ? withHiringPrototypeSettings(
                      childOption.href,
                      activeHiringShellLabel,
                      activeHiringCallbackFormLabel,
                    )
                  : undefined,
              }))
            : undefined,
      })),
    [activeHiringCallbackFormLabel, activeHiringShellLabel],
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
                option.href.startsWith(PREMIUM_COMPANY_PAGES_MEMBER_HREF)
                  ? "FAB icon"
                  : activePremiumCompanyPagesShellLabel,
              )
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
    () => getHiringShellOptions(pathname, activeHiringCallbackFormLabel),
    [activeHiringCallbackFormLabel, pathname],
  );
  const hiringCallbackFormOptions = useMemo(
    () => getHiringCallbackFormOptions(activeHiringShellLabel),
    [activeHiringShellLabel],
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
        componentProductLens,
        activePremiumUpsellSignalLabel,
        activePremiumUpsellAiSignalLabel,
        activePremiumUpsellAiSummarySignalLabel,
      ),
    [
      activeHiringShellLabel,
      activePremiumUpsellAiSummarySignalLabel,
      activePremiumUpsellAiSignalLabel,
      activePremiumUpsellSignalLabel,
      activePremiumShellLabel,
      componentProductLens,
      pathname,
    ],
  );

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function handleLoginSelect(next: boolean) {
    setIsSignedIn(next);
    setIsMenuOpen(false);
    router.push(
      withHiringPrototypeSettings(
        pathname === HIRING_ALL_INTENTS_HREF
          ? HIRING_ALL_INTENTS_HREF
          : HIRING_PROTOTYPE_HREF,
        activeHiringShellLabel,
        activeHiringCallbackFormLabel,
      ),
    );
  }

  function closeMenu() {
    setIsMenuOpen(false);
    triggerRef.current?.focus();
  }

  function getPillClasses(isActive: boolean, extraClassName = "") {
    return [
      "pointer-events-auto inline-flex min-h-8 min-w-0 items-center justify-center whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-[0.015em] shadow-[0_12px_32px_rgba(15,23,42,0.08),0_3px_12px_rgba(15,23,42,0.05)] ring-1 ring-black/5 backdrop-blur-2xl transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20 sm:px-4",
      isActive
        ? "border-sky-100 bg-sky-50/82 text-sky-900 supports-[backdrop-filter]:bg-sky-50/70"
        : "border-slate-300/80 bg-white/50 text-slate-700 ring-slate-900/10 hover:border-slate-400/70 hover:bg-white/70 hover:text-slate-950 supports-[backdrop-filter]:bg-white/42",
      extraClassName,
    ].join(" ");
  }

  return (
    <nav
      aria-label="Review surfaces"
      className="pointer-events-none fixed inset-x-0 top-2 z-50 px-4 sm:top-3"
    >
      <ul className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2 sm:gap-3">
        {reviewDestinations.map((destination) => {
            const isActive = destination.matches(pathname);
            const hasMenu = Boolean(destination.menu);
            const isPremiumMenu = destination.menu === "premium";
            const isPremiumUpsellHelpCenterMenu =
              destination.menu === "premium-upsell-help-center";
            const isPremiumCompanyPagesMenu =
              destination.menu === "premium-company-pages";
            const isProjectMenu = destination.menu === "projects";
            const isVcaEcosystemMenu = destination.menu === "vca-ecosystem";
            const modeOptions = isVcaEcosystemMenu
              ? vcaEcosystemModeOptions
              : isPremiumUpsellHelpCenterMenu
              ? premiumUpsellHelpCenterModeOptions
              : isProjectMenu
              ? prototypeProjectOptions
              : isPremiumCompanyPagesMenu
              ? shellAwarePremiumCompanyPagesModeOptions
              : isPremiumMenu
                ? shellAwarePremiumModeOptions
                : shellAwareHiringModeOptions;
            const shellOptions = isProjectMenu ||
              isVcaEcosystemMenu ||
              isPremiumUpsellHelpCenterMenu ||
              isHiringFlowMap
              ? []
              : isPremiumCompanyPagesMenu
                ? premiumCompanyPagesShellOptions
              : isPremiumMenu
                ? premiumShellOptions
                : hiringShellOptions;

            if (hasMenu) {
              return (
                <li
                  key={destination.href}
                  className="relative z-10 min-w-0 justify-self-center"
                >
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
                      triggerRef.current = element;
                    }}
                    className={getPillClasses(
                      isActive,
                      "max-w-full gap-2 sm:gap-3",
                    )}
                  >
                    <span className="inline-flex min-w-0 items-baseline gap-2 leading-none">
                      <span className="leading-[1.1]">
                        {destination.label}
                      </span>
                      {destination.metaLabel ? (
                        <span
                          className={[
                            "hidden max-w-[34vw] truncate border-l pl-3 text-[11px] font-medium leading-[1.05] tracking-normal md:inline",
                            isActive
                              ? "border-sky-700/20 text-sky-700/75"
                              : "border-slate-300/80 text-slate-500",
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
                        : isPremiumUpsellHelpCenterMenu
                          ? normalizedPremiumUpsellHelpCenterHref
                        : isVcaEcosystemMenu
                          ? VCA_ECOSYSTEM_HREF
                        : isPremiumCompanyPagesMenu
                          ? normalizedPremiumCompanyPagesHref
                        : isPremiumMenu
                          ? normalizedPremiumHref
                          : normalizedHiringHref
                    }
                    onLoginSelect={
                      isHiringFlowMap ||
                      isProjectMenu ||
                      isPremiumUpsellHelpCenterMenu ||
                      isVcaEcosystemMenu ||
                      isPremiumMenu ||
                      isPremiumCompanyPagesMenu
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
                    modeHeading={
                      isVcaEcosystemMenu
                        ? "VCA ecosystem"
                        : isPremiumUpsellHelpCenterMenu
                        ? "Premium upsell"
                        : isProjectMenu
                        ? "Choose project"
                        : isPremiumCompanyPagesMenu
                          ? "Choose view"
                          : "Choose flow"
                    }
                    shellHeading="UI"
                    shellOptions={shellOptions}
                    callbackFormHeading="Call back form"
                    callbackFormOptions={
                      !isHiringFlowMap &&
                      !isProjectMenu &&
                      !isPremiumUpsellHelpCenterMenu &&
                      !isVcaEcosystemMenu &&
                      !isPremiumMenu &&
                      !isPremiumCompanyPagesMenu
                        ? hiringCallbackFormOptions
                        : []
                    }
                    callbackFormCurrentHref={normalizedHiringCallbackFormHref}
                    showVisitorControls={
                      !isHiringFlowMap &&
                      !isProjectMenu &&
                      !isPremiumUpsellHelpCenterMenu &&
                      !isVcaEcosystemMenu &&
                      !isPremiumMenu &&
                      !isPremiumCompanyPagesMenu
                    }
                  />
                </li>
              );
            }

            return (
              <li
                key={destination.href}
                className={[
                  "relative z-10",
                  destination.href === HOME_DESTINATION.href
                    ? "justify-self-start"
                    : "justify-self-end",
                ].join(" ")}
              >
                <Link
                  href={destination.href}
                  aria-current={isActive ? "page" : undefined}
                  className={getPillClasses(
                    isActive,
                    destination.href === HOME_DESTINATION.href
                      ? "gap-1 sm:gap-1.5"
                      : "gap-1.5",
                  )}
                >
                  {destination.href === HOME_DESTINATION.href ? (
                    <>
                      <HomeNavIcon />
                      <span className="hidden sm:inline">
                        {destination.label}
                      </span>
                      <span className="sr-only sm:hidden">
                        {destination.label}
                      </span>
                    </>
                  ) : (
                    destination.label
                  )}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
