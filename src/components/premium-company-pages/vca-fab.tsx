"use client";

import Image from "next/image";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type VcaFabVisualState = "default" | "hover" | "active" | "focus-visible";

export type VcaFabProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> & {
  label?: string;
  chatPanelId?: string;
  children?: ReactNode;
  isOpen?: boolean;
  position?: "fixed" | "static";
  visualState?: VcaFabVisualState;
};

const markSrc = "/assets/premium-company-pages/vca-fab-mark.png";

const visualStateClasses: Partial<
  Record<Exclude<VcaFabVisualState, "default">, string>
> = {
  hover: "bg-background-transparent-hover",
  active: "bg-background-transparent-active shadow-raised-faint-active",
  "focus-visible": "ring-4 ring-action-focus-ring",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function DefaultVcaFabMark() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-[4.75px] top-[9.18px] h-[37.646px] w-[43.068px] overflow-hidden"
    >
      <Image
        src={markSrc}
        alt=""
        width={810}
        height={1440}
        className="absolute left-[-18.53%] top-[-90.23%] h-[283.81%] w-[139.55%] max-w-none"
      />
    </span>
  );
}

export const VcaFab = forwardRef<HTMLButtonElement, VcaFabProps>(
  function VcaFab(
    {
      label = "Open VCA",
      chatPanelId,
      children,
      isOpen = false,
      position = "fixed",
      visualState = "default",
      disabled = false,
      className,
      type,
      ...props
    },
    ref,
  ) {
    return (
      <div
        className={cx(
          "pointer-events-none flex max-w-[calc(100vw-3rem)] items-center",
          position === "fixed"
            ? "fixed bottom-6 right-6 z-20 md:bottom-8 md:right-10"
            : "relative justify-end",
        )}
      >
        <button
          {...props}
          ref={ref}
          type={type ?? "button"}
          aria-label={label}
          aria-controls={chatPanelId}
          aria-expanded={chatPanelId ? isOpen : undefined}
          aria-haspopup={chatPanelId ? "dialog" : undefined}
          disabled={disabled}
          data-visual-state={visualState}
          className={cx(
            "pointer-events-auto relative size-[56px] shrink-0 overflow-hidden rounded-entity-square-md border-2 border-data-a-3 bg-background shadow-raised-faint outline-none transition-[background-color,box-shadow] duration-150 ease-out hover:bg-background-transparent-hover active:bg-background-transparent-active active:shadow-raised-faint-active focus-visible:ring-4 focus-visible:ring-action-focus-ring disabled:pointer-events-none disabled:opacity-40",
            !disabled &&
              visualState !== "default" &&
              visualStateClasses[visualState],
            className,
          )}
        >
          {children ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              {children}
            </span>
          ) : (
            <DefaultVcaFabMark />
          )}
        </button>
      </div>
    );
  },
);

VcaFab.displayName = "VcaFab";
