import {
  forwardRef,
  type ButtonHTMLAttributes,
} from "react";

export type PillVariant = "choice";
export type PillVisualState =
  | "default"
  | "hover"
  | "active"
  | "focus-visible";

export type PillProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> & {
  variant?: PillVariant;
  checked?: boolean;
  disabled?: boolean;
  visualState?: PillVisualState;
};

const uncheckedStateClasses: Partial<
  Record<Exclude<PillVisualState, "default">, string>
> = {
  hover: "border-border bg-background-transparent-hover text-text-hover",
  active: "border-border-active bg-background-transparent-active text-text-active",
  "focus-visible": "ring-4 ring-neutral-focus-ring",
};

const checkedStateClasses: Partial<
  Record<Exclude<PillVisualState, "default">, string>
> = {
  hover: "bg-checked-hover text-on-checked",
  active: "bg-checked-active text-on-checked-active",
  "focus-visible": "ring-4 ring-neutral-focus-ring",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  function Pill(
    {
      children,
      className,
      variant = "choice",
      checked = false,
      disabled = false,
      visualState = "default",
      type,
      "aria-pressed": ariaPressed,
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type ?? "button"}
        disabled={disabled}
        aria-pressed={ariaPressed ?? checked}
        data-variant={variant}
        data-checked={checked || undefined}
        className={cx(
          "group inline-flex h-[48px] shrink-0 select-none items-center justify-center rounded-md bg-transparent font-sans outline-none transition-[box-shadow] duration-150 ease-out focus-visible:ring-4 focus-visible:ring-neutral-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed",
          className,
        )}
      >
        <span
          className={cx(
            "inline-flex min-h-[32px] shrink-0 items-center justify-center gap-xs rounded-md border px-md py-xs text-control-sm transition-[background-color,border-color,color] duration-150 ease-out",
            disabled
              ? "border-transparent bg-background-disabled text-label-disabled"
              : checked
                ? "border-transparent bg-checked text-on-checked group-hover:bg-checked-hover group-active:bg-checked-active group-active:text-on-checked-active"
                : "border-border-subtle bg-background text-label group-hover:border-border group-hover:bg-background-transparent-hover group-hover:text-text-hover group-active:border-border-active group-active:bg-background-transparent-active group-active:text-text-active",
            !disabled &&
              visualState !== "default" &&
              (checked
                ? checkedStateClasses[visualState]
                : uncheckedStateClasses[visualState]),
          )}
        >
          {children}
        </span>
      </button>
    );
  },
);

Pill.displayName = "Pill";
