import {
  forwardRef,
  type HTMLAttributes,
} from "react";

export type PresenceBadgePresence = "active" | "mobile";
export type PresenceBadgeSize = "small" | "medium" | "large";

export type PresenceBadgeProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  presence?: PresenceBadgePresence;
  size?: PresenceBadgeSize;
  label?: string;
};

const containerSizeClasses: Record<PresenceBadgeSize, string> = {
  small: "size-4",
  medium: "size-4",
  large: "size-5",
};

const markSizeClasses: Record<PresenceBadgeSize, string> = {
  small: "size-2",
  medium: "size-3",
  large: "size-4",
};

const mobileStrokeClasses: Record<PresenceBadgeSize, string> = {
  small: "border-2",
  medium: "border-[3px]",
  large: "border-4",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const PresenceBadge = forwardRef<HTMLSpanElement, PresenceBadgeProps>(
  function PresenceBadge(
    {
      className,
      presence = "active",
      size = "small",
      label,
      ...props
    },
    ref,
  ) {
    const isDecorative = !label;

    return (
      <span
        {...props}
        ref={ref}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={isDecorative ? true : undefined}
        data-presence={presence}
        data-size={size}
        className={cx(
          "inline-flex shrink-0 items-center justify-center rounded-round",
          containerSizeClasses[size],
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            "rounded-round",
            markSizeClasses[size],
            presence === "active"
              ? "bg-checked"
              : "border-checked bg-background",
            presence === "mobile" && mobileStrokeClasses[size],
          )}
        />
      </span>
    );
  },
);

PresenceBadge.displayName = "PresenceBadge";
