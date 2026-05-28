import type { HTMLAttributes } from "react";

import { Badge } from "@/components/primitives/badge";
import { Icon, type IconName } from "@/components/primitives/icon";

export type NavLinkItemHorizontalIndicator = "bottom" | "top" | "none";
export type NavLinkItemHorizontalVisualState = "default" | "hover" | "active";

export type NavLinkItemHorizontalProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> & {
  label: string;
  icon: IconName;
  href?: string;
  badge?: boolean | number;
  badgeLabel?: string;
  current?: boolean;
  hasDropdown?: boolean;
  indicator?: NavLinkItemHorizontalIndicator;
  visualState?: NavLinkItemHorizontalVisualState;
};

const visualStateClasses: Record<NavLinkItemHorizontalVisualState, string> = {
  default: "",
  hover: "bg-background-transparent-hover text-text-hover",
  active: "bg-background-transparent-active text-text-active",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function NavLinkItemContent({
  badge,
  badgeLabel,
  current,
  hasDropdown,
  icon,
  indicator,
  label,
}: Readonly<
  Pick<
    NavLinkItemHorizontalProps,
    | "badge"
    | "badgeLabel"
    | "current"
    | "hasDropdown"
    | "icon"
    | "indicator"
    | "label"
  >
>) {
  const badgeCount = typeof badge === "number" ? badge : undefined;

  return (
    <>
      {current && indicator !== "none" ? (
        <span
          aria-hidden="true"
          className={cx(
            "absolute inset-x-0 h-[2px] bg-border",
            indicator === "top" ? "top-0" : "bottom-0",
          )}
        />
      ) : null}
      <span className="flex min-w-0 flex-col items-center justify-center gap-xxs">
        <span className="relative inline-flex size-[var(--design-icon-size-medium)] items-center justify-center">
          <Icon name={icon} size="medium" />
          {badge ? (
            <span className="pointer-events-none absolute right-0 top-0 z-10 translate-x-1/4 -translate-y-1/4">
              <Badge
                aria-label={badgeLabel ?? `${label} has new activity`}
                count={badgeCount}
                size="large"
              />
            </span>
          ) : null}
        </span>
        <span className="flex max-w-full items-center justify-center gap-xxs">
          <span className="min-w-0 truncate">{label}</span>
          {hasDropdown ? (
            <Icon
              aria-hidden="true"
              className="-mx-xxs"
              name="caret"
              size="small"
            />
          ) : null}
        </span>
      </span>
    </>
  );
}

export function NavLinkItemHorizontal({
  label,
  icon,
  href,
  badge = false,
  badgeLabel,
  current = false,
  hasDropdown = false,
  indicator = "bottom",
  visualState = "default",
  className,
  ...props
}: NavLinkItemHorizontalProps) {
  const sharedClassName = cx(
    "relative inline-flex h-[52px] w-20 shrink-0 items-center justify-center overflow-hidden text-center text-supportive-s outline-none transition-[background-color,color,box-shadow] duration-150 ease-out focus-visible:ring-4 focus-visible:ring-neutral-focus-ring",
    current ? "text-text" : "text-text-meta",
    "hover:bg-background-transparent-hover hover:text-text-hover active:bg-background-transparent-active active:text-text-active",
    visualStateClasses[visualState],
    className,
  );
  const content = (
    <NavLinkItemContent
      badge={badge}
      badgeLabel={badgeLabel}
      current={current}
      hasDropdown={hasDropdown}
      icon={icon}
      indicator={indicator}
      label={label}
    />
  );

  return href ? (
    <a
      {...props}
      aria-current={current ? "page" : undefined}
      className={sharedClassName}
      href={href}
    >
      {content}
    </a>
  ) : (
    <span
      {...props}
      aria-current={current ? "page" : undefined}
      className={sharedClassName}
    >
      {content}
    </span>
  );
}
