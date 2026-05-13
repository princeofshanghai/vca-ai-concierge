import {
  forwardRef,
  type HTMLAttributes,
} from "react";

export type BadgeTone = "alert" | "new";
export type BadgeSize = "small" | "large";

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  tone?: BadgeTone;
  size?: BadgeSize;
  count?: number;
  max?: number;
  label?: string;
  showZero?: boolean;
};

const toneClasses: Record<BadgeTone, string> = {
  alert: "bg-negative text-on-action",
  new: "bg-action text-on-action",
};

const dotSizeClasses: Record<BadgeSize, string> = {
  small: "size-2",
  large: "size-4",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getDisplayCount(count: number, max: number) {
  return count > max ? `${max}+` : String(count);
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    className,
    tone = "alert",
    size = "large",
    count,
    max = 99,
    label,
    showZero = false,
    ...props
  },
  ref,
) {
  const hasCount = typeof count === "number";

  if (hasCount && count <= 0 && !showZero) {
    return null;
  }

  const displayCount = hasCount ? getDisplayCount(count, max) : null;

  return (
    <span
      {...props}
      ref={ref}
      aria-hidden={label ? undefined : hasCount ? props["aria-hidden"] : true}
      aria-label={label}
      data-size={size}
      data-tone={tone}
      data-counter={hasCount || undefined}
      className={cx(
        "relative inline-flex shrink-0 select-none items-center justify-center rounded-round font-sans",
        toneClasses[tone],
        hasCount
          ? "h-4 min-w-4 px-xs text-supportive-s-strong"
          : dotSizeClasses[size],
        !hasCount && tone === "alert" && size === "large"
          ? "after:absolute after:size-1 after:rounded-round after:bg-on-action"
          : null,
        className,
      )}
    >
      {displayCount}
    </span>
  );
});

Badge.displayName = "Badge";
