import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

import { Icon, type IconName, type IconSize } from "@/components/primitives/icon";

export type ButtonIconVariant = "primary" | "secondary" | "tertiary";
export type ButtonIconSize = "small" | "medium";
export type ButtonIconVisualState =
  | "default"
  | "hover"
  | "active"
  | "focus-visible";

export type ButtonIconProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label" | "disabled"
> & {
  icon?: IconName;
  label: string;
  variant?: ButtonIconVariant;
  size?: ButtonIconSize;
  touchTarget?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  visualState?: ButtonIconVisualState;
};

const sizeClasses: Record<ButtonIconSize, string> = {
  small:
    "h-[var(--design-layout-primary-action-height)] w-[var(--design-layout-compact-action-height)]",
  medium: "size-[var(--design-layout-primary-action-height)]",
};

const compactSizeClasses: Record<ButtonIconSize, string> = {
  small: "size-[var(--design-layout-compact-action-height)]",
  medium: "size-[var(--design-layout-primary-action-height)]",
};

const surfaceSizeClasses: Record<ButtonIconSize, string> = {
  small: "size-[var(--design-layout-compact-action-height)]",
  medium: "size-[var(--design-layout-primary-action-height)]",
};

const iconSizes: Record<ButtonIconSize, IconSize> = {
  small: "small",
  medium: "medium",
};

const variantClasses: Record<ButtonIconVariant, string> = {
  primary:
    "border-transparent bg-action text-on-action group-hover:bg-action-hover group-active:bg-action-active",
  secondary:
    "border-action bg-background text-action group-hover:border-action-hover group-hover:bg-action-background-transparent-hover group-hover:text-action-hover group-hover:shadow-[inset_0_0_0_1px_var(--color-action-hover)] group-active:border-action-active group-active:bg-action-background-transparent-active group-active:text-action-active group-active:shadow-none",
  tertiary:
    "border-border bg-background text-label group-hover:border-border-hover group-hover:bg-background-transparent-hover group-hover:text-label-hover group-hover:shadow-[inset_0_0_0_1px_var(--color-border-hover)] group-active:border-border-active group-active:bg-background-transparent-active group-active:text-label-active group-active:shadow-none",
};

const staticStateClasses: Record<
  ButtonIconVariant,
  Partial<Record<Exclude<ButtonIconVisualState, "default">, string>>
> = {
  primary: {
    hover: "bg-action-hover",
    active: "bg-action-active",
    "focus-visible": "ring-4 ring-action-focus-ring",
  },
  secondary: {
    hover:
      "border-action-hover bg-action-background-transparent-hover text-action-hover shadow-[inset_0_0_0_1px_var(--color-action-hover)]",
    active:
      "border-action-active bg-action-background-transparent-active text-action-active shadow-none",
    "focus-visible": "ring-4 ring-action-focus-ring",
  },
  tertiary: {
    hover:
      "border-border-hover bg-background-transparent-hover text-label-hover shadow-[inset_0_0_0_1px_var(--color-border-hover)]",
    active:
      "border-border-active bg-background-transparent-active text-label-active shadow-none",
    "focus-visible": "ring-4 ring-neutral-focus-ring",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ButtonIconSpinner() {
  return (
    <span
      aria-hidden="true"
      className="block size-4 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
    />
  );
}

export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(
  function ButtonIcon(
    {
      icon = "placeholder",
      label,
      variant = "primary",
      size = "small",
      touchTarget = true,
      loading = false,
      loadingLabel = "Loading",
      disabled = false,
      visualState = "default",
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
        data-variant={variant}
        data-size={size}
        data-touch-target={touchTarget || undefined}
        data-loading={loading || undefined}
        className={cx(
          "group inline-flex shrink-0 select-none items-center justify-center rounded-full bg-transparent font-sans outline-none transition-[box-shadow] duration-150 ease-out focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed",
          touchTarget ? sizeClasses[size] : compactSizeClasses[size],
          variant === "tertiary"
            ? "focus-visible:ring-neutral-focus-ring"
            : "focus-visible:ring-action-focus-ring",
          className,
        )}
      >
        <span
          className={cx(
            "inline-flex shrink-0 items-center justify-center rounded-round border shadow-none transition-[background-color,border-color,color,box-shadow] duration-150 ease-out",
            surfaceSizeClasses[size],
            isDisabled
              ? "border-transparent bg-background-disabled text-text-disabled"
              : variantClasses[variant],
            !isDisabled &&
              visualState !== "default" &&
              staticStateClasses[variant][visualState],
          )}
        >
          {loading ? (
            <ButtonIconSpinner />
          ) : (
            <Icon name={icon} size={iconSizes[size]} />
          )}
        </span>
      </button>
    );
  },
);

ButtonIcon.displayName = "ButtonIcon";
