import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import { Icon, type IconName, type IconSize } from "@/components/primitives/icon";
import { ProgressIndicatorCircular } from "@/components/primitives/progress-indicator-circular";

export type OverlayButtonIconColor = "black" | "white";
export type OverlayButtonIconSize = "small" | "medium";
export type OverlayButtonIconVisualState =
  | "default"
  | "hover"
  | "active"
  | "focus-visible";

export type OverlayButtonIconProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label" | "disabled"
> & {
  children?: ReactNode;
  icon?: IconName;
  label: string;
  color?: OverlayButtonIconColor;
  size?: OverlayButtonIconSize;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  visualState?: OverlayButtonIconVisualState;
};

const sizeClasses: Record<OverlayButtonIconSize, string> = {
  small: "h-[var(--design-layout-primary-action-height)] w-[var(--design-layout-compact-action-height)]",
  medium: "size-[var(--design-layout-primary-action-height)]",
};

const surfaceSizeClasses: Record<OverlayButtonIconSize, string> = {
  small: "size-[var(--design-layout-compact-action-height)]",
  medium: "size-[var(--design-layout-primary-action-height)]",
};

const surfacePaddingClasses: Record<OverlayButtonIconSize, string> = {
  small: "p-sm",
  medium: "p-md",
};

const iconSizes: Record<OverlayButtonIconSize, IconSize> = {
  small: "small",
  medium: "medium",
};

const enabledSurfaceClasses: Record<OverlayButtonIconColor, string> = {
  black:
    "bg-[var(--figma-color-background-color-background-overlay)] text-[var(--figma-color-icon-color-icon-overlay)] hover:bg-[var(--figma-color-background-color-background-overlay-hover)] active:bg-[var(--figma-color-background-color-background-overlay-active)]",
  white:
    "bg-[var(--figma-color-background-color-background-knockout)] text-icon shadow-raised hover:bg-[var(--figma-color-background-color-background-knockout-hover)] hover:text-icon-hover active:bg-[var(--figma-color-background-color-background-knockout-active)] active:text-icon-active active:shadow-raised-active",
};

const staticSurfaceClasses: Record<
  OverlayButtonIconColor,
  Partial<Record<Exclude<OverlayButtonIconVisualState, "default">, string>>
> = {
  black: {
    hover:
      "bg-[var(--figma-color-background-color-background-overlay-hover)]",
    active:
      "bg-[var(--figma-color-background-color-background-overlay-active)]",
    "focus-visible": "ring-4 ring-neutral-focus-ring",
  },
  white: {
    hover:
      "bg-[var(--figma-color-background-color-background-knockout-hover)] text-icon-hover shadow-raised",
    active:
      "bg-[var(--figma-color-background-color-background-knockout-active)] text-icon-active shadow-raised-active",
    "focus-visible": "ring-4 ring-neutral-focus-ring",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const OverlayButtonIcon = forwardRef<
  HTMLButtonElement,
  OverlayButtonIconProps
>(function OverlayButtonIcon(
  {
    icon = "placeholder",
    label,
    color = "white",
    size = "small",
    loading = false,
    loadingLabel = "Loading",
    disabled = false,
    visualState = "default",
    children,
    className,
    type,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      ref={ref}
      type={type ?? "button"}
      aria-label={loading ? loadingLabel : label}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      data-color={color}
      data-size={size}
      data-loading={loading || undefined}
      className={cx(
        "group inline-flex shrink-0 select-none items-center justify-center rounded-round bg-transparent font-sans outline-none transition-[box-shadow] duration-150 ease-out focus-visible:ring-4 focus-visible:ring-neutral-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed",
        sizeClasses[size],
        className,
      )}
    >
      <span
        className={cx(
          "inline-flex shrink-0 items-center justify-center rounded-round transition-[background-color,color,box-shadow] duration-150 ease-out",
          surfaceSizeClasses[size],
          surfacePaddingClasses[size],
          isDisabled
            ? "bg-background-disabled text-text-disabled"
            : enabledSurfaceClasses[color],
          !isDisabled &&
            visualState !== "default" &&
            staticSurfaceClasses[color][visualState],
        )}
      >
        {loading ? (
          <ProgressIndicatorCircular muted size={16} />
        ) : children ? (
          children
        ) : (
          <Icon name={icon} size={iconSizes[size]} />
        )}
      </span>
    </button>
  );
});

OverlayButtonIcon.displayName = "OverlayButtonIcon";
