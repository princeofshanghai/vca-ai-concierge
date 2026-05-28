import {
  forwardRef,
  type HTMLAttributes,
} from "react";

export type PremiumChipSmallProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  label?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const PremiumChipSmall = forwardRef<
  HTMLSpanElement,
  PremiumChipSmallProps
>(function PremiumChipSmall({ className, label, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cx("inline-flex size-4 shrink-0", className)}
    >
      <svg
        aria-hidden="true"
        className="size-full"
        focusable="false"
        viewBox="0 0 16 16"
      >
        <path
          d="M10.68 11.34C11.1 10.92 11.34 10.35 11.34 9.75V2.25C11.34 1.01 10.33 0 9.09 0H1.59C0.99 0 0.42 0.24 0 0.66L10.68 11.34Z"
          fill="var(--design-color-premium-button-background-hover)"
          transform="translate(2.66 2)"
        />
        <path
          d="M0.66 0C0.24 0.42 0 0.99 0 1.59V9.09C0 10.33 1.01 11.34 2.25 11.34H9.75C10.35 11.34 10.92 11.1 11.34 10.68L0.66 0Z"
          fill="var(--design-color-premium-inbug)"
          transform="translate(2 2.66)"
        />
      </svg>
    </span>
  );
});

PremiumChipSmall.displayName = "PremiumChipSmall";
