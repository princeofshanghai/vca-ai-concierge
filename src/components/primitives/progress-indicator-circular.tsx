import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type ProgressIndicatorCircularSize = 16 | 20 | 24 | 32 | 40 | 48 | 64;
export type ProgressIndicatorCircularType = "indeterminate" | "determinate";

export type ProgressIndicatorCircularProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  label?: ReactNode;
  muted?: boolean;
  size?: ProgressIndicatorCircularSize;
  type?: ProgressIndicatorCircularType;
  value?: number;
};

const gapClasses: Record<ProgressIndicatorCircularSize, string> = {
  16: "gap-xs",
  20: "gap-sm",
  24: "gap-sm",
  32: "gap-md",
  40: "gap-md",
  48: "gap-md",
  64: "gap-md",
};

const strokeWidths: Record<ProgressIndicatorCircularSize, number> = {
  16: 2,
  20: 2,
  24: 2.5,
  32: 3,
  40: 4,
  48: 5,
  64: 6,
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function ProgressIndicatorCircular({
  className,
  label,
  muted = false,
  size = 16,
  type = "indeterminate",
  value = 66,
  role = "status",
  "aria-label": ariaLabel,
  ...props
}: ProgressIndicatorCircularProps) {
  const strokeWidth = strokeWidths[size];
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = clampProgress(value);
  const indeterminateArc = circumference * 0.28;
  const showLabel = size !== 16 && Boolean(label);
  const fillClassName = muted ? "text-text" : "text-action";
  const progressStyle = {
    strokeDasharray:
      type === "indeterminate"
        ? `${indeterminateArc} ${circumference - indeterminateArc}`
        : `${circumference} ${circumference}`,
    strokeDashoffset:
      type === "determinate"
        ? circumference - (normalizedValue / 100) * circumference
        : 0,
  } satisfies CSSProperties;

  return (
    <div
      {...props}
      role={role}
      aria-label={showLabel ? ariaLabel : (ariaLabel ?? "Loading")}
      data-muted={muted || undefined}
      data-size={size}
      data-type={type}
      className={cx(
        "inline-flex shrink-0 flex-col items-center justify-center",
        gapClasses[size],
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className={cx(
          "block shrink-0 overflow-visible",
          type === "indeterminate" &&
            "progress-indicator-circular__spinner",
        )}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <circle
          className={cx(
            "text-border-faint",
            type === "indeterminate" && "opacity-0",
          )}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          className={fillClassName}
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={progressStyle}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {showLabel ? (
        <span className="whitespace-nowrap text-center text-supportive-s text-text-meta">
          {label}
        </span>
      ) : null}
    </div>
  );
}
