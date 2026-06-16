import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "small" | "medium";
type ButtonVisualState = "default" | "hover" | "active" | "focus-visible";

type ButtonClassNameOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  visualState?: ButtonVisualState;
  className?: string;
};

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  visualState?: ButtonVisualState;
};

const sizeClasses: Record<ButtonSize, string> = {
  medium: "h-[48px] px-[var(--spacing-button-padding-inline)] text-control-md",
  small: "h-[32px] px-[var(--spacing-md)] text-control-sm",
};

const iconClasses: Record<ButtonSize, string> = {
  medium: "size-[var(--design-icon-size-medium)] [&_svg]:size-full",
  small: "size-[var(--design-icon-size-small)] [&_svg]:size-full",
};

const staticStateClasses: Record<
  ButtonVariant,
  Partial<Record<Exclude<ButtonVisualState, "default">, string>>
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

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-action text-on-action hover:bg-action-hover active:bg-action-active focus-visible:ring-4 focus-visible:ring-action-focus-ring",
  secondary:
    "border-action bg-background text-action hover:border-action-hover hover:bg-action-background-transparent-hover hover:text-action-hover hover:shadow-[inset_0_0_0_1px_var(--color-action-hover)] active:border-action-active active:bg-action-background-transparent-active active:text-action-active active:shadow-none focus-visible:ring-4 focus-visible:ring-action-focus-ring",
  tertiary:
    "border-border bg-background text-label hover:border-border-hover hover:bg-background-transparent-hover hover:text-label-hover hover:shadow-[inset_0_0_0_1px_var(--color-border-hover)] active:border-border-active active:bg-background-transparent-active active:text-label-active active:shadow-none focus-visible:ring-4 focus-visible:ring-neutral-focus-ring",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getButtonClassName({
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  visualState = "default",
  className,
}: ButtonClassNameOptions = {}) {
  const isDisabled = disabled || loading;

  return cx(
    "inline-flex shrink-0 select-none items-center justify-center gap-xs rounded-round border font-sans whitespace-nowrap text-center shadow-none outline-none transition-[background-color,border-color,color,box-shadow] duration-150 ease-out",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    sizeClasses[size],
    isDisabled
      ? "border-transparent bg-background-disabled text-text-disabled"
      : variantClasses[variant],
    !isDisabled &&
      visualState !== "default" &&
      staticStateClasses[variant][visualState],
    className,
  );
}

function ButtonSpinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-4 items-center justify-center"
    >
      <span className="block size-4 animate-spin rounded-full border-[1.5px] border-current border-r-transparent" />
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      variant = "primary",
      size = "medium",
      leadingIcon,
      trailingIcon,
      loading = false,
      loadingLabel = "Loading",
      disabled = false,
      visualState = "default",
      type,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    const label = loading ? loadingLabel : children;

    const showLeadingSpinner = loading && !trailingIcon;
    const showTrailingSpinner = loading && Boolean(trailingIcon);

    const startAdornment = showLeadingSpinner ? (
      <ButtonSpinner />
    ) : (
      leadingIcon
    );
    const endAdornment = showTrailingSpinner ? <ButtonSpinner /> : trailingIcon;

    return (
      <button
        {...props}
        ref={ref}
        type={type ?? "button"}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        className={getButtonClassName({
          variant,
          size,
          loading,
          disabled,
          visualState,
          className,
        })}
      >
        {startAdornment ? (
          <span
            aria-hidden="true"
            className={cx(
              "inline-flex items-center justify-center",
              loading ? "size-4 [&_svg]:size-full" : iconClasses[size],
            )}
          >
            {startAdornment}
          </span>
        ) : null}

        <span>{label}</span>

        {endAdornment ? (
          <span
            aria-hidden="true"
            className={cx(
              "inline-flex items-center justify-center",
              loading ? "size-4 [&_svg]:size-full" : iconClasses[size],
            )}
          >
            {endAdornment}
          </span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = "Button";
