import { forwardRef, type HTMLAttributes } from "react";

export type RadioVisualState = "default" | "hover" | "active";

export type RadioProps = HTMLAttributes<HTMLSpanElement> & {
  checked?: boolean;
  disabled?: boolean;
  visualState?: RadioVisualState;
};

const checkedStateClasses: Record<RadioVisualState, string> = {
  default: "bg-checked",
  hover: "bg-checked-hover",
  active: "bg-checked-active",
};

const uncheckedStateClasses: Record<RadioVisualState, string> = {
  default: "border border-border bg-transparent",
  hover: "border-2 border-border-hover bg-background-transparent-hover",
  active: "border border-border-active bg-background-transparent-active",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Radio = forwardRef<HTMLSpanElement, RadioProps>(function Radio(
  {
    checked = false,
    className,
    disabled = false,
    visualState = "default",
    ...props
  },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
      data-visual-state={visualState}
      className={cx(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-md transition-[background-color,border-color] duration-150 ease-out",
        disabled
          ? "bg-background-disabled"
          : checked
            ? checkedStateClasses[visualState]
            : uncheckedStateClasses[visualState],
        className,
      )}
    >
      {checked ? (
        <span
          aria-hidden="true"
          className={cx(
            "block size-[6px] rounded-md",
            disabled
              ? "bg-text-disabled"
              : visualState === "active"
                ? "bg-on-checked-active"
                : "bg-on-checked",
          )}
        />
      ) : null}
    </span>
  );
});

Radio.displayName = "Radio";
