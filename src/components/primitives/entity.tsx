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

function EntityGhost({ shape }: Readonly<{ shape: EntityShape }>) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${
          shape === "circle"
            ? "/assets/entity-ghost-person.png"
            : "/assets/entity-ghost-company.png"
        })`,
      }}
    />
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
      {src ? null : <EntityGhost shape={shape} />}
    </span>
  );
}
