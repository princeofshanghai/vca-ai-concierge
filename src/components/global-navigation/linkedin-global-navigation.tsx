import type { HTMLAttributes } from "react";

import { Entity } from "@/components/primitives/entity";
import { Icon, type IconName } from "@/components/primitives/icon";
import { NavLinkItemHorizontal } from "@/components/primitives/nav-link-item-horizontal";

import { LinkedInBugSdui } from "./linkedin-bug-sdui";

export type LinkedInGlobalNavigationItem = Readonly<{
  label: string;
  icon: IconName;
  href?: string;
  active?: boolean;
  badge?: boolean;
}>;

export type LinkedInGlobalNavigationProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> & {
  items?: ReadonlyArray<LinkedInGlobalNavigationItem>;
  searchPlaceholder?: string;
  secondarySearchPlaceholder?: string;
  profileSrc?: string;
  profileLabel?: string;
  showAdvertise?: boolean;
  showPremiumSpotlight?: boolean;
};

const defaultItems: ReadonlyArray<LinkedInGlobalNavigationItem> = [
  { label: "Home", icon: "navigation-home", active: true, badge: true },
  { label: "My Network", icon: "navigation-people" },
  { label: "Jobs", icon: "navigation-job" },
  { label: "Messaging", icon: "navigation-messages" },
  { label: "Notifications", icon: "navigation-bell-fill" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SearchInput({
  icon = "search",
  placeholder,
  className,
}: Readonly<{
  icon?: IconName;
  placeholder: string;
  className?: string;
}>) {
  return (
    <label
      className={cx(
        "flex min-h-9 min-w-0 items-center gap-sm rounded-round border border-border-subtle px-lg py-sm text-body-sm text-text-meta focus-within:border-border-subtle-active",
        className,
      )}
    >
      <Icon name={icon} size="small" />
      <span className="sr-only">{placeholder}</span>
      <input
        className="min-w-0 flex-1 bg-transparent p-0 text-body-sm text-text outline-none placeholder:text-text-meta"
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}

function ProfileMenu({
  src,
  label,
}: Readonly<{
  src?: string;
  label: string;
}>) {
  return (
    <span className="hidden h-[52px] w-[56px] shrink-0 flex-col items-center justify-center gap-xxs text-supportive-s text-text-meta md:flex">
      <Entity label={label} size={24} src={src} />
      <span className="flex max-w-full items-center gap-xxs truncate">
        {label}
        <Icon name="chevron-down" size="small" />
      </span>
    </span>
  );
}

function WorkMenu() {
  return (
    <NavLinkItemHorizontal
      className="hidden border-l border-border-faint lg:inline-flex"
      hasDropdown
      icon="marketplace"
      indicator="none"
      label="Work"
    />
  );
}

function PremiumSpotlight() {
  return (
    <span className="hidden h-[52px] w-[100px] shrink-0 items-center justify-center text-center text-supportive-s text-text lg:flex">
      <span>
        <span className="block">Try Premium Free</span>
        <span className="block">for 1 Month</span>
      </span>
    </span>
  );
}

export function LinkedInGlobalNavigation({
  items = defaultItems,
  searchPlaceholder = "Search",
  secondarySearchPlaceholder,
  profileSrc,
  profileLabel = "Me",
  showAdvertise = false,
  showPremiumSpotlight = false,
  className,
  ...props
}: LinkedInGlobalNavigationProps) {
  const visibleItems = items.slice(0, 5);
  const compactItems = visibleItems.slice(0, 3);

  return (
    <header
      {...props}
      className={cx(
        "relative z-10 flex h-[52px] items-center justify-center bg-background shadow-[0_1px_0_rgba(0,0,0,0.08)]",
        className,
      )}
    >
      <div className="flex h-[52px] w-full max-w-[1128px] items-center justify-between px-xxl min-[1200px]:px-0">
        <div className="flex min-w-0 shrink-0 items-center gap-sm min-[992px]:w-[362px] min-[992px]:shrink">
          <LinkedInBugSdui />
          <SearchInput
            className={cx(
              "hidden min-[992px]:flex",
              secondarySearchPlaceholder
                ? "min-[1025px]:hidden"
                : "min-[992px]:flex-1",
            )}
            placeholder={searchPlaceholder}
          />
          {secondarySearchPlaceholder ? (
            <div className="hidden min-[1025px]:flex min-[1025px]:w-[554px] min-[1025px]:gap-sm">
              <SearchInput
                className="min-w-0 flex-1"
                placeholder={searchPlaceholder}
              />
              <SearchInput
                className="min-w-0 flex-1"
                icon="location-marker"
                placeholder={secondarySearchPlaceholder}
              />
            </div>
          ) : null}
          <span className="flex size-8 items-center justify-center text-text-meta min-[992px]:hidden">
            <Icon name="search" size="small" />
          </span>
        </div>

        <nav
          aria-label="LinkedIn navigation"
          className="ml-auto hidden min-[748px]:flex"
        >
          <span className="hidden min-[854px]:contents">
            {visibleItems.map((item) => (
              <NavLinkItemHorizontal
                badge={item.badge}
                current={item.active}
                href={item.href}
                icon={item.icon}
                key={item.label}
                label={item.label}
              />
            ))}
          </span>
          <span className="contents min-[854px]:hidden">
            {compactItems.map((item) => (
              <NavLinkItemHorizontal
                badge={item.badge}
                current={item.active}
                href={item.href}
                icon={item.icon}
                key={item.label}
                label={item.label}
              />
            ))}
          </span>
        </nav>

        <div className="ml-auto flex h-[52px] shrink-0 items-center min-[748px]:ml-0">
          <ProfileMenu label={profileLabel} src={profileSrc} />
          <WorkMenu />
          {showPremiumSpotlight ? <PremiumSpotlight /> : null}
          {showAdvertise ? (
            <NavLinkItemHorizontal
              className="hidden xl:inline-flex"
              icon="radar-screen"
              indicator="none"
              label="Advertise"
            />
          ) : null}
          <span className="flex h-[52px] w-12 items-center justify-center text-text-meta min-[748px]:hidden">
            <Icon name="overflow-web-ios" size="medium" />
          </span>
        </div>
      </div>
    </header>
  );
}
