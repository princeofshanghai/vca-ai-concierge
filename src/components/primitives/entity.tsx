import type { HTMLAttributes } from "react";

export type EntitySize = 16 | 24 | 32 | 40 | 48 | 64 | 80 | 96 | 128 | 160;
export type EntityShape = "circle" | "square";

export type EntityProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: EntitySize;
  shape?: EntityShape;
  src?: string;
  label?: string;
};

const sizeClasses: Record<EntitySize, string> = {
  16: "size-[var(--design-layout-entity-size-16)]",
  24: "size-[var(--design-layout-entity-size-24)]",
  32: "size-[var(--design-layout-entity-size-32)]",
  40: "size-[var(--design-layout-entity-size-40)]",
  48: "size-[var(--design-layout-entity-size-48)]",
  64: "size-[var(--design-layout-entity-size-64)]",
  80: "size-[var(--design-layout-entity-size-80)]",
  96: "size-[var(--design-layout-entity-size-96)]",
  128: "size-[var(--design-layout-entity-size-128)]",
  160: "size-[var(--design-layout-entity-size-160)]",
};

const squareRadiusClasses: Record<EntitySize, string> = {
  16: "rounded-xs",
  24: "rounded-xs",
  32: "rounded-xs",
  40: "rounded-xs",
  48: "rounded-sm",
  64: "rounded-sm",
  80: "rounded-sm",
  96: "rounded-entity-square-md",
  128: "rounded-md",
  160: "rounded-lg",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PersonGhost() {
  return (
    <svg
      aria-hidden="true"
      className="size-full"
      focusable="false"
      viewBox="0 0 160 160"
    >
      <rect
        width="160"
        height="160"
        fill="var(--design-color-entity-ghost-background)"
      />
      <circle
        cx="80"
        cy="68"
        r="38"
        fill="var(--design-color-entity-ghost-strong)"
      />
      <path
        d="M0 160C8 120 42 96 80 96C118 96 152 120 160 160H0Z"
        fill="var(--design-color-entity-ghost-medium)"
      />
      <ellipse
        cx="80"
        cy="112"
        rx="42"
        ry="14"
        fill="var(--design-color-entity-ghost-dark)"
      />
    </svg>
  );
}

function CompanyGhost() {
  return (
    <svg
      aria-hidden="true"
      className="size-full"
      focusable="false"
      viewBox="0 0 160 160"
    >
      <rect
        width="160"
        height="160"
        fill="var(--design-color-entity-ghost-background)"
      />
      <rect
        x="60"
        y="20"
        width="100"
        height="140"
        fill="var(--design-color-entity-ghost-medium)"
      />
      <rect
        x="20"
        y="105"
        width="40"
        height="55"
        fill="var(--design-color-entity-ghost-strong)"
      />
      <rect
        x="60"
        y="105"
        width="45"
        height="55"
        fill="var(--design-color-entity-ghost-dark)"
      />
    </svg>
  );
}

export function Entity({
  size = 40,
  shape = "circle",
  src,
  label,
  className,
  style,
  ...props
}: EntityProps) {
  const isDecorative = !label;

  return (
    <span
      {...props}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={isDecorative ? true : undefined}
      data-shape={shape}
      data-size={size}
      style={{
        ...style,
        ...(src
          ? {
              backgroundImage: `url(${src})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : undefined),
      }}
      className={cx(
        "relative inline-flex shrink-0 overflow-hidden bg-entity-ghost-background",
        sizeClasses[size],
        shape === "circle" ? "rounded-round" : squareRadiusClasses[size],
        className,
      )}
    >
      {src ? null : shape === "circle" ? (
        <PersonGhost />
      ) : (
        <CompanyGhost />
      )}
    </span>
  );
}
