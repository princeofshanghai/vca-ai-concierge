import type { HTMLAttributes, ReactNode } from "react";

import { Entity } from "@/components/primitives/entity";

import { pcpCompanyProfile } from "../persona";
import {
  DataCardHeader,
  DataCardShell,
} from "./DataCard";

export type CompareRowVisual = Readonly<{
  kind: "avatar" | "company-logo";
  label?: string;
  src?: string;
}>;

export type CompareRow = Readonly<{
  name: string;
  value: number;
  valueLabel?: ReactNode;
  detail?: ReactNode;
  isYou?: boolean;
  visual?: CompareRowVisual;
}>;

export type CompareProps = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
  dimension: ReactNode;
  rows: ReadonlyArray<CompareRow>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const VELORA_LOGO_TILE_BACKGROUND_CLASS = "bg-[#ACF5B3]";
const VELORA_LOGO_TILE_BACKGROUND_STYLE = {
  backgroundColor: "#ACF5B3",
};

function isVeloraLogo(src?: string, label?: ReactNode) {
  return src === pcpCompanyProfile.logoSrc || String(label) === pcpCompanyProfile.name;
}

function getValueLabel(row: CompareRow) {
  if (row.valueLabel) {
    return row.valueLabel;
  }

  if (row.value > 0) {
    return `+${row.value}`;
  }

  return String(row.value);
}

function getBarLayout(
  value: number,
  maxPositive: number,
  maxNegative: number,
  zeroX: number,
) {
  if (value < 0) {
    const width = maxNegative > 0 ? (Math.abs(value) / maxNegative) * zeroX : 0;

    return {
      left: zeroX - width,
      width,
    };
  }

  const positiveSpace = 100 - zeroX;
  const width = maxPositive > 0 ? (value / maxPositive) * positiveSpace : 0;

  return {
    left: zeroX,
    width,
  };
}

function renderVisual(row: CompareRow) {
  const visual = row.visual ?? {
    kind: "company-logo" as const,
    label: row.name,
  };

  return (
    <Entity
      className={
        visual.kind === "company-logo" && isVeloraLogo(visual.src, row.name)
          ? VELORA_LOGO_TILE_BACKGROUND_CLASS
          : undefined
      }
      label={visual.label ?? row.name}
      shape={visual.kind === "company-logo" ? "square" : "circle"}
      size={24}
      src={visual.src}
      style={
        visual.kind === "company-logo" && isVeloraLogo(visual.src, row.name)
          ? VELORA_LOGO_TILE_BACKGROUND_STYLE
          : undefined
      }
    />
  );
}

export function Compare({
  title,
  dimension,
  rows,
  className,
  ...props
}: CompareProps) {
  const sortedRows = [...rows].sort((firstRow, secondRow) => {
    return secondRow.value - firstRow.value;
  });
  const maxPositive = Math.max(0, ...sortedRows.map((row) => row.value));
  const maxNegative = Math.max(
    0,
    ...sortedRows.map((row) => (row.value < 0 ? Math.abs(row.value) : 0)),
  );
  const hasNegativeAndPositive = maxPositive > 0 && maxNegative > 0;
  const zeroX = hasNegativeAndPositive
    ? (maxNegative / (maxNegative + maxPositive)) * 100
    : maxNegative > 0
      ? 100
      : 0;

  return (
    <DataCardShell
      {...props}
      block="Compare"
      className={className}
    >
      <DataCardHeader context={dimension} title={title} />
      <div className="mt-xl grid gap-xs">
        {sortedRows.map((row, index) => {
          const { detail, isYou, name, value } = row;
          const barLayout = getBarLayout(value, maxPositive, maxNegative, zeroX);
          const isNegative = value < 0;

          return (
            <div
              key={`${name}-${index}`}
              className={cx(
                "grid min-h-11 grid-cols-[minmax(0,1fr)_minmax(96px,1fr)_minmax(44px,auto)] items-center gap-lg rounded-sm px-md py-sm",
                isYou ? "bg-background-neutral-soft" : "",
              )}
            >
              <div className="flex min-w-0 items-center gap-md">
                {renderVisual(row)}
                <div className="min-w-0">
                  <p className="truncate text-control-sm text-text">{name}</p>
                  {detail ? (
                    <p className="text-body-xs text-text-meta">{detail}</p>
                  ) : null}
                </div>
              </div>
              <div className="relative h-5 min-w-[96px]">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 rounded-round bg-border-faint"
                />
                {hasNegativeAndPositive ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 w-px bg-border-faint"
                    style={{ left: `${zeroX}%` }}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute top-1/2 h-1.5 -translate-y-1/2 rounded-round",
                    isNegative ? "bg-negative" : "bg-action",
                  )}
                  style={{
                    left: `${barLayout.left}%`,
                    width: `${barLayout.width}%`,
                  }}
                />
              </div>
              <p
                className={cx(
                  "text-right text-control-sm",
                  isNegative ? "text-negative" : "text-text",
                )}
              >
                {getValueLabel(row)}
              </p>
            </div>
          );
        })}
      </div>
    </DataCardShell>
  );
}
