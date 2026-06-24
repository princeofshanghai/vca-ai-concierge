"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Radio } from "@/components/primitives/radio";

import {
  DataCardFooter,
  DataCardHeader,
  DataCardShell,
} from "./DataCard";

export type ChoiceCardOption = Readonly<{
  id: string;
  description?: ReactNode;
  label: ReactNode;
  visual?: ReactNode;
}>;

export type ChoiceCardProps = HTMLAttributes<HTMLElement> & {
  actionDisabled?: boolean;
  actionLabel?: ReactNode;
  context?: ReactNode;
  options: ReadonlyArray<ChoiceCardOption>;
  selectedId?: string | null;
  title?: ReactNode;
  onAction?: () => void;
  onSelectionChange?: (id: string) => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ChoiceCard({
  actionDisabled = false,
  actionLabel,
  className,
  context,
  options,
  selectedId,
  title,
  onAction,
  onSelectionChange,
  ...props
}: ChoiceCardProps) {
  return (
    <DataCardShell
      {...props}
      block="ChoiceCard"
      className={cx(
        "max-w-[var(--design-layout-panel-content-max)]",
        className,
      )}
    >
      <DataCardHeader context={context} title={title} />

      <div
        role="radiogroup"
        aria-label={typeof title === "string" ? title : "Choice options"}
        className={cx("space-y-sm", title || context ? "mt-lg" : "")}
      >
        {options.map((option) => {
          const isSelected = option.id === selectedId;

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={cx(
                "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-md rounded-sm border p-sm text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-out",
                isSelected
                  ? "border-action bg-ai-background-soft shadow-[inset_0_0_0_1px_var(--color-action)]"
                  : "border-border-faint bg-background hover:border-border-faint-hover hover:bg-background-transparent-hover",
                "focus-visible:ring-4 focus-visible:ring-action-focus-ring",
              )}
              onClick={() => onSelectionChange?.(option.id)}
            >
              {option.visual ? (
                <span className="inline-flex shrink-0 items-center justify-center">
                  {option.visual}
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="block truncate text-control-sm text-text">
                  {option.label}
                </span>
                {option.description ? (
                  <span className="mt-xxs block truncate text-body-xs text-text-meta">
                    {option.description}
                  </span>
                ) : null}
              </span>
              <Radio checked={isSelected} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {actionLabel ? (
        <DataCardFooter className="flex justify-start">
          <Button
            variant="primary"
            size="small"
            disabled={actionDisabled}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </DataCardFooter>
      ) : null}
    </DataCardShell>
  );
}
