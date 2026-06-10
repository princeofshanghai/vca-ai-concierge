"use client";

import Image from "next/image";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

import { Icon } from "@/components/primitives/icon";

export type VcaFabVisualState = "default" | "hover" | "active" | "focus-visible";
export type VcaFabVariant = "visitor" | "admin";

type VcaFabStyle = CSSProperties & {
  "--vca-fab-accent"?: string;
  "--vca-fab-border"?: string;
  "--vca-fab-border-hover"?: string;
};

export type VcaFabProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> & {
  accentColor?: string;
  borderColor?: string;
  borderHoverColor?: string;
  label?: string;
  chatPanelId?: string;
  children?: ReactNode;
  isOpen?: boolean;
  position?: "fixed" | "static";
  selected?: boolean;
  variant?: VcaFabVariant;
  visualState?: VcaFabVisualState;
};

const defaultAccentColor = "#2AA986";
const defaultBorderColor = "#8FE8B1";
const defaultBorderHoverColor = "#5DDC91";
const markSrc = "/assets/premium-company-pages/member/velora-vca-logo.png";

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
      className="relative inline-flex size-10 shrink-0 items-center justify-center"
    >
      <Image
        src={markSrc}
        alt=""
        width={39}
        height={35}
        className="h-auto w-10 max-w-none object-contain"
      />
      <span className="absolute -bottom-xxs -right-xxs inline-flex size-5 items-center justify-center rounded-round border-2 border-background bg-background text-ai-icon">
        <Icon className="[&&]:size-3" name="signal-ai" size="small" />
      </span>
    </span>
  );
}

function AdminVcaFabMark({ selected }: Readonly<{ selected: boolean }>) {
  return (
    <Icon
      aria-hidden="true"
      name={selected ? "navigation-signal-ai-active" : "navigation-signal-ai"}
      size="medium"
      style={{ height: 20, width: 20 }}
    />
  );
}

export const VcaFab = forwardRef<HTMLButtonElement, VcaFabProps>(
  function VcaFab(
    {
      accentColor,
      borderColor,
      borderHoverColor,
      label = "Open VCA",
      chatPanelId,
      children,
      isOpen = false,
      position = "fixed",
      selected = false,
      variant = "visitor",
      visualState = "default",
      disabled = false,
      className,
      style,
      type,
      "aria-pressed": ariaPressed,
      ...props
    },
    ref,
  ) {
    const isAdmin = variant === "admin";
    const isSelected = selected || isOpen;
    const buttonStyle: VcaFabStyle = {
      "--vca-fab-accent": accentColor ?? defaultAccentColor,
      "--vca-fab-border": borderColor ?? defaultBorderColor,
      "--vca-fab-border-hover": borderHoverColor ?? defaultBorderHoverColor,
      ...style,
    };

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
          aria-pressed={
            ariaPressed ?? (selected && !chatPanelId ? true : undefined)
          }
          disabled={disabled}
          data-visual-state={visualState}
          data-selected={isSelected || undefined}
          data-variant={variant}
          style={buttonStyle}
          className={cx(
            "pointer-events-auto relative inline-flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[color:var(--vca-fab-border)] bg-background text-[color:var(--vca-fab-accent)] shadow-raised-active outline-none transition-[background-color,border-color,box-shadow,color,transform] duration-150 ease-out hover:border-[color:var(--vca-fab-border-hover)] hover:bg-background hover:shadow-raised-active active:border-[color:var(--vca-fab-border-hover)] active:bg-background active:shadow-raised-faint focus-visible:ring-4 focus-visible:ring-action-focus-ring disabled:pointer-events-none disabled:opacity-40",
            !disabled &&
              isSelected &&
              "border-[color:var(--vca-fab-border-hover)] bg-background shadow-raised-faint-active",
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
          ) : isAdmin ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
            >
              <AdminVcaFabMark selected={isSelected} />
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
