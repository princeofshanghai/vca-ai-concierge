"use client";

import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { Entity } from "@/components/primitives/entity";
import { Icon, type IconName } from "@/components/primitives/icon";
import { NavLinkItemHorizontal } from "@/components/primitives/nav-link-item-horizontal";
import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";

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
  profileName?: string;
  profileHeadline?: string;
  onHelpSelect?: () => void;
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

type UtilityMenuItem = Readonly<{
  label: string;
  icon?: ReactNode;
  iconName?: IconName;
}>;

const utilityMenuItems: ReadonlyArray<UtilityMenuItem> = [
  {
    label: "Premium features",
    icon: <PremiumChipSmall className="size-6" />,
  },
  {
    label: "Job Posting Account",
    iconName: "job",
  },
  {
    label: "Settings",
    iconName: "settings",
  },
  {
    label: "Help",
    iconName: "question",
  },
  {
    label: "Language",
    iconName: "globe-language",
  },
];

function ProfileMenuCard({
  label,
}: Readonly<{
  label: string;
}>) {
  return (
    <button
      className="flex min-h-[52px] w-full items-center justify-between rounded-sm border border-border-faint bg-background p-[16px] text-left text-[14px] font-bold leading-5 tracking-normal text-text outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-border-subtle hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
      role="menuitem"
      type="button"
    >
      <span>{label}</span>
      <Icon className="text-text-meta" name="chevron-right" size="small" />
    </button>
  );
}

function UtilityMenuItemRow({
  icon,
  iconName,
  label,
  onSelect,
}: UtilityMenuItem & { onSelect?: () => void }) {
  return (
    <button
      className="flex min-h-10 w-full items-center gap-md rounded-xs px-xs py-sm text-left text-[14px] font-bold leading-5 tracking-normal text-text outline-none transition-colors duration-150 ease-out hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
      onClick={onSelect}
      role="menuitem"
      type="button"
    >
      <span className="flex size-6 shrink-0 items-center justify-center text-icon">
        {icon ?? (iconName ? <Icon name={iconName} size="medium" /> : null)}
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}

function ProfileMenu({
  src,
  label,
  name,
  headline,
  onHelpSelect,
}: Readonly<{
  src?: string;
  label: string;
  name?: string;
  headline?: string;
  onHelpSelect?: () => void;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileName = name ?? label;
  const showProfileBadge = profileName !== label;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !containerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      className="relative hidden h-[52px] w-20 shrink-0 md:flex"
      ref={containerRef}
    >
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="relative inline-flex h-[52px] w-20 shrink-0 items-center justify-center overflow-hidden text-center text-supportive-s text-text-meta outline-none transition-[background-color,color,box-shadow] duration-150 ease-out hover:bg-background-transparent-hover hover:text-text-hover active:bg-background-transparent-active active:text-text-active focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        ref={buttonRef}
        type="button"
      >
        <span className="flex min-w-0 flex-col items-center justify-center gap-xxs">
          <span className="relative inline-flex size-5 items-center justify-center">
            <Entity
              className="[&&]:size-5"
              label={profileName}
              size={24}
              src={src}
            />
          </span>
          <span className="flex max-w-full items-center justify-center gap-xxs">
            <span className="min-w-0 truncate">{label}</span>
            <Icon
              aria-hidden="true"
              className="-mx-xxs"
              name="caret"
              size="small"
            />
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          aria-label="Me menu"
          className="absolute right-0 top-full z-50 mt-xs flex w-[380px] max-w-[calc(100vw-32px)] flex-col gap-md rounded-sm border border-border-faint bg-background p-lg text-text shadow-raised-faint-upward"
          role="menu"
        >
          <button
            className="flex w-full items-center gap-md rounded-sm border border-border-faint bg-background p-[16px] text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out hover:border-border-subtle hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
            role="menuitem"
            type="button"
          >
            <Entity label={profileName} size={40} src={src} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="flex min-w-0 items-center gap-xs text-[16px] font-bold leading-5 tracking-normal text-text">
                <span className="min-w-0 truncate">{profileName}</span>
                {showProfileBadge ? (
                  <Icon
                    className="text-premium-inbug"
                    name="linked-in-bug"
                    size="small"
                  />
                ) : null}
              </span>
              {headline ? (
                <span className="line-clamp-2 text-[12px] font-normal leading-4 tracking-normal text-text">
                  {headline}
                </span>
              ) : null}
            </span>
            <Icon className="text-text-meta" name="chevron-right" size="small" />
          </button>

          <ProfileMenuCard label="Analytics" />
          <ProfileMenuCard label="Saved posts" />

          <div className="flex flex-col gap-xs py-xs" role="none">
            {utilityMenuItems.map((item) => {
              const handleSelect =
                item.label === "Help" && onHelpSelect
                  ? () => {
                      setIsOpen(false);
                      onHelpSelect();
                    }
                  : undefined;

              return (
                <UtilityMenuItemRow
                  key={item.label}
                  {...item}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>

          <button
            className="border-t border-border-faint px-0 pb-0 pt-lg text-left text-[14px] font-bold leading-5 tracking-normal text-text outline-none transition-colors duration-150 ease-out hover:text-text-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
            role="menuitem"
            type="button"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
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
  profileName,
  profileHeadline,
  onHelpSelect,
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
          <ProfileMenu
            headline={profileHeadline}
            label={profileLabel}
            name={profileName}
            onHelpSelect={onHelpSelect}
            src={profileSrc}
          />
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
