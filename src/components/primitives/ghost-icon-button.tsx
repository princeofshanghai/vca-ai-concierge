import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

import { Icon, type IconName } from "@/components/primitives/icon";

export type GhostIconButtonSize = "small" | "medium";
export type GhostIconButtonVisualState =
  | "default"
  | "hover"
  | "active"
  | "focus-visible";

export type GhostIconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  icon?: IconName;
  label: string;
  size?: GhostIconButtonSize;
  emphasis?: boolean;
  horizontalPadding?: boolean;
  touchTarget?: boolean;
  loading?: boolean;
  visualState?: GhostIconButtonVisualState;
};

const outerSizeClasses: Record<GhostIconButtonSize, string> = {
  small: "h-[var(--design-layout-ghost-icon-button-touch-height)]",
  medium: "h-[var(--design-layout-ghost-icon-button-touch-height)]",
};

const paddedWidthClasses: Record<GhostIconButtonSize, string> = {
  small: "w-[var(--design-layout-ghost-icon-button-small-width)]",
  medium: "w-[var(--design-layout-ghost-icon-button-medium-width)]",
};

const compactWidthClasses: Record<GhostIconButtonSize, string> = {
  small: "w-[var(--design-layout-ghost-icon-button-small-compact-width)]",
  medium: "w-[var(--design-layout-ghost-icon-button-medium-compact-width)]",
};

const stateLayerClasses: Record<GhostIconButtonSize, string> = {
  small: "size-[var(--design-layout-ghost-icon-button-small-state-size)]",
  medium: "size-[var(--design-layout-ghost-icon-button-medium-state-size)]",
};

const compactTouchClasses: Record<GhostIconButtonSize, string> = {
  small: "size-[var(--design-layout-ghost-icon-button-small-state-size)]",
  medium: "size-[var(--design-layout-ghost-icon-button-medium-state-size)]",
};

const visualStateClasses: Record<
  "neutral" | "emphasis",
  Partial<Record<Exclude<GhostIconButtonVisualState, "default">, string>>
> = {
  neutral: {
    hover: "bg-background-transparent-hover",
    active: "bg-background-transparent-active",
  },
  emphasis: {
    hover: "bg-action-background-transparent-hover",
    active: "bg-action-background-transparent-active",
  },
};

const staticToneClasses: Record<
  "neutral" | "emphasis",
  Partial<Record<Exclude<GhostIconButtonVisualState, "default">, string>>
> = {
  neutral: {
    hover: "text-text-hover",
    active: "text-text-active",
    "focus-visible": "ring-4 ring-neutral-focus-ring",
  },
  emphasis: {
    hover: "text-action-hover",
    active: "text-action-active",
    "focus-visible": "ring-4 ring-action-focus-ring",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function GhostIconButtonSpinner() {
  return (
    <span
      aria-hidden="true"
      className="block size-4 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
    />
  );
}

export const GhostIconButton = forwardRef<
  HTMLButtonElement,
  GhostIconButtonProps
>(function GhostIconButton(
  {
    icon = "placeholder",
    label,
    size = "small",
    emphasis = false,
    horizontalPadding = true,
    touchTarget = true,
    loading = false,
    visualState = "default",
    disabled = false,
    className,
    type,
    ...props
  },
  ref,
) {
  const isInteractionDisabled = disabled || loading;
  const tone = emphasis ? "emphasis" : "neutral";
  const shouldShowStateLayer = horizontalPadding && !isInteractionDisabled;

  return (
    <button
      {...props}
      ref={ref}
      type={type ?? "button"}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={isInteractionDisabled}
      data-size={size}
      data-emphasis={emphasis || undefined}
      data-horizontal-padding={horizontalPadding || undefined}
      data-touch-target={touchTarget || undefined}
      data-loading={loading || undefined}
      className={cx(
        "group inline-flex shrink-0 select-none items-center justify-center border border-transparent bg-transparent outline-none transition-[color,box-shadow] duration-150 ease-out focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed",
        touchTarget
          ? outerSizeClasses[size]
          : compactTouchClasses[size],
        touchTarget
          ? horizontalPadding
            ? paddedWidthClasses[size]
            : compactWidthClasses[size]
          : compactTouchClasses[size],
        isInteractionDisabled
          ? "text-text-disabled"
          : emphasis
            ? "text-action hover:text-action-hover active:text-action-active focus-visible:ring-action-focus-ring"
            : "text-text-meta hover:text-text-hover active:text-text-active focus-visible:ring-neutral-focus-ring",
        !isInteractionDisabled &&
          visualState !== "default" &&
          staticToneClasses[tone][visualState],
        className,
      )}
    >
      <span
        className={cx(
          "inline-flex shrink-0 items-center justify-center rounded-round transition-[background-color] duration-150 ease-out",
          horizontalPadding ? stateLayerClasses[size] : "size-6",
          shouldShowStateLayer &&
            (emphasis
              ? "group-hover:bg-action-background-transparent-hover group-active:bg-action-background-transparent-active"
              : "group-hover:bg-background-transparent-hover group-active:bg-background-transparent-active"),
          shouldShowStateLayer &&
            visualState !== "default" &&
            visualStateClasses[tone][visualState],
        )}
      >
        {loading ? <GhostIconButtonSpinner /> : <Icon name={icon} />}
      </span>
    </button>
  );
});

GhostIconButton.displayName = "GhostIconButton";
