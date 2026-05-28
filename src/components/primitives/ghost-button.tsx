import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import { Icon, type IconName } from "@/components/primitives/icon";

export type GhostButtonSize = "small" | "medium";
export type GhostButtonVisualState =
  | "default"
  | "hover"
  | "active"
  | "focus-visible";

export type GhostButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> & {
  size?: GhostButtonSize;
  icon?: IconName;
  iconAtEnd?: boolean;
  emphasis?: boolean;
  horizontalPadding?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
  disabled?: boolean;
  visualState?: GhostButtonVisualState;
};

const textClasses: Record<GhostButtonSize, string> = {
  small: "text-control-sm",
  medium: "text-control-md",
};

const stateLayerSizeClasses: Record<GhostButtonSize, string> = {
  small: "h-6",
  medium: "h-8",
};

const paddedClasses: Record<GhostButtonSize, string> = {
  small: "px-sm",
  medium: "px-sm",
};

const compactClasses: Record<GhostButtonSize, string> = {
  small: "px-xs",
  medium: "px-xs",
};

const visualStateClasses: Record<
  "neutral" | "emphasis",
  Partial<Record<Exclude<GhostButtonVisualState, "default">, string>>
> = {
  neutral: {
    hover: "bg-background-transparent-hover text-label-hover",
    active: "bg-background-transparent-active text-label-active",
    "focus-visible": "ring-4 ring-neutral-focus-ring",
  },
  emphasis: {
    hover: "bg-action-background-transparent-hover text-action-hover",
    active: "bg-action-background-transparent-active text-action-active",
    "focus-visible": "ring-4 ring-action-focus-ring",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function GhostButtonSpinner() {
  return (
    <span
      aria-hidden="true"
      className="block size-4 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
    />
  );
}

export const GhostButton = forwardRef<HTMLButtonElement, GhostButtonProps>(
  function GhostButton(
    {
      children,
      className,
      size = "small",
      icon,
      iconAtEnd = false,
      emphasis = false,
      horizontalPadding = true,
      loading = false,
      loadingLabel = "Loading",
      disabled = false,
      visualState = "default",
      type,
      ...props
    },
    ref,
  ) {
    const isInteractionDisabled = disabled || loading;
    const tone = emphasis ? "emphasis" : "neutral";
    const content = loading ? loadingLabel : children;
    const adornment = loading ? (
      <GhostButtonSpinner />
    ) : icon ? (
      <Icon name={icon} size="small" />
    ) : null;
    const adornmentPosition = loading && !icon ? "start" : iconAtEnd ? "end" : "start";

    return (
      <button
        {...props}
        ref={ref}
        type={type ?? "button"}
        aria-busy={loading || undefined}
        disabled={isInteractionDisabled}
        data-size={size}
        data-emphasis={emphasis || undefined}
        data-horizontal-padding={horizontalPadding || undefined}
        data-loading={loading || undefined}
        className={cx(
          "group inline-flex h-12 shrink-0 select-none items-center justify-center border border-transparent bg-transparent outline-none transition-[color,box-shadow] duration-150 ease-out focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed",
          isInteractionDisabled
            ? "text-label-disabled"
            : emphasis
              ? "text-action hover:text-action-hover active:text-action-active focus-visible:ring-action-focus-ring"
              : "text-label hover:text-label-hover active:text-label-active focus-visible:ring-neutral-focus-ring",
          !isInteractionDisabled &&
            visualState === "focus-visible" &&
            visualStateClasses[tone]["focus-visible"],
          className,
        )}
      >
        <span
          className={cx(
            "inline-flex items-center justify-center gap-xs rounded-xs transition-[background-color,color] duration-150 ease-out",
            textClasses[size],
            stateLayerSizeClasses[size],
            horizontalPadding ? paddedClasses[size] : compactClasses[size],
            !isInteractionDisabled &&
              (emphasis
                ? "group-hover:bg-action-background-transparent-hover group-active:bg-action-background-transparent-active"
                : "group-hover:bg-background-transparent-hover group-active:bg-background-transparent-active"),
            !isInteractionDisabled &&
              visualState !== "default" &&
              visualState !== "focus-visible" &&
              visualStateClasses[tone][visualState],
          )}
        >
          {adornment && adornmentPosition === "start" ? (
            <span className="inline-flex size-4 items-center justify-center">
              {adornment}
            </span>
          ) : null}
          <span>{content}</span>
          {adornment && adornmentPosition === "end" ? (
            <span className="inline-flex size-4 items-center justify-center">
              {adornment}
            </span>
          ) : null}
        </span>
      </button>
    );
  },
);

GhostButton.displayName = "GhostButton";
