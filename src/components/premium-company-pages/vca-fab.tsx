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
export type VcaFabAdminTone = "default" | "gold";

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
  showVisitorPresenceBadge?: boolean;
  adminTone?: VcaFabAdminTone;
  variant?: VcaFabVariant;
  visualState?: VcaFabVisualState;
};

const defaultAccentColor = "#2AA986";
const defaultBorderColor = "#8FE8B1";
const defaultBorderHoverColor = "#5DDC91";
const markSrc = "/assets/premium-company-pages/member/velora-vca-logo.png";
const adminGoldGradient =
  "conic-gradient(from 90deg at 50% 50%, #BF6B00 0deg, #C37D16 36.0000005364418deg, #E9A53F 90deg, #FFF58C 125.99999785423279deg, #F9C982 161.99999570846558deg, #E9A53F 216.00000858306885deg, #C37D16 288.0000042915344deg, #BF6B00 360deg)";
const adminSignalAiPath =
  "M19 9.5C19 9 18.6 8.5 18.1 8.5C14.1 8.1 10.9 4.9 10.5 0.9C10.4 0.4 10 0 9.5 0C9 0 8.5 0.4 8.5 0.9C8.1 4.9 4.9 8.1 0.9 8.5C0.4 8.6 0 9 0 9.5C0 10 0.4 10.4 0.9 10.5C4.9 10.9 8.1 14.1 8.5 18.1C8.6 18.6 9 19 9.5 19C10 19 10.5 18.6 10.5 18.1C10.9 14.1 14.1 10.9 18.1 10.5C18.6 10.4 19 10 19 9.5Z";
const adminSignalAiActivePath =
  "M18.1 10C14.1 9.6 10.9 6.4 10.5 2.4C10.4 1.9 10 1.5 9.5 1.5C9 1.5 8.5 1.9 8.5 2.4C8.1 6.4 4.9 9.6 0.9 10C0.4 10.1 0 10.5 0 11C0 11.5 0.4 11.9 0.9 12C4.9 12.4 8.1 15.6 8.5 19.6C8.6 20.1 9 20.5 9.5 20.5C10 20.5 10.5 20.1 10.5 19.6C10.9 15.6 14.1 12.4 18.1 12C18.6 11.9 19 11.5 19 11C19 10.5 18.6 10 18.1 10ZM19.75 2.75C18.65 2.75 17.75 1.85 17.75 0.75C17.75 0.34 17.41 0 17 0C16.59 0 16.25 0.34 16.25 0.75C16.25 1.85 15.35 2.75 14.25 2.75C13.84 2.75 13.5 3.09 13.5 3.5C13.5 3.91 13.84 4.25 14.25 4.25C15.35 4.25 16.25 5.15 16.25 6.25C16.25 6.66 16.59 7 17 7C17.41 7 17.75 6.66 17.75 6.25C17.75 5.15 18.65 4.25 19.75 4.25C20.16 4.25 20.5 3.91 20.5 3.5C20.5 3.09 20.16 2.75 19.75 2.75Z";
const adminSignalAiMask = getSvgMaskImage("0 0 19 19", adminSignalAiPath);
const adminSignalAiActiveMask = getSvgMaskImage(
  "0 0 20.5 20.5",
  adminSignalAiActivePath,
);

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

function getSvgMaskImage(viewBox: string, path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="black" d="${path}"/></svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
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
    </span>
  );
}

function VisitorVcaFabPresenceBadge({
  disabled,
}: Readonly<{ disabled: boolean }>) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute -bottom-0.5 -right-0.5 z-10 inline-flex size-7 items-center justify-center rounded-round border-2 border-background bg-background text-[color:var(--vca-fab-accent)] shadow-raised-faint",
        disabled && "opacity-40",
      )}
    >
      <Icon className="[&&]:size-5" name="signal-ai" />
    </span>
  );
}

export function PcpAdminGoldAiMark({
  className,
  selected = false,
}: Readonly<{
  className?: string;
  selected?: boolean;
}>) {
  return (
    <span
      aria-hidden="true"
      className={cx("inline-flex size-6 shrink-0", className)}
      style={{
        background: adminGoldGradient,
        maskImage: selected ? adminSignalAiActiveMask : adminSignalAiMask,
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskImage: selected ? adminSignalAiActiveMask : adminSignalAiMask,
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

function AdminVcaFabMark({
  selected,
  tone,
}: Readonly<{
  selected: boolean;
  tone: VcaFabAdminTone;
}>) {
  if (tone === "gold") {
    return <PcpAdminGoldAiMark selected={selected} />;
  }

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
      showVisitorPresenceBadge = true,
      adminTone = "default",
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
    const isGoldAdmin = isAdmin && adminTone === "gold";
    const isSelected = selected || isOpen;
    const buttonStyle: VcaFabStyle = {
      "--vca-fab-accent": accentColor ?? defaultAccentColor,
      "--vca-fab-border":
        borderColor ?? (isGoldAdmin ? "var(--color-border-faint)" : defaultBorderColor),
      "--vca-fab-border-hover":
        borderHoverColor ??
        (isGoldAdmin ? "var(--color-border-faint-hover)" : defaultBorderHoverColor),
      ...style,
    };
    const badgeStyle: VcaFabStyle = {
      "--vca-fab-accent": accentColor ?? defaultAccentColor,
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
        <span className="relative inline-flex" style={badgeStyle}>
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
              "group/fab pointer-events-auto relative inline-flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[color:var(--vca-fab-border)] bg-background text-[color:var(--vca-fab-accent)] shadow-raised-faint-active outline-none transition-[background-color,border-color,box-shadow,color,transform] duration-150 ease-out hover:border-[color:var(--vca-fab-border-hover)] hover:bg-background hover:shadow-raised-faint-active active:border-[color:var(--vca-fab-border-hover)] active:bg-background active:shadow-raised-faint focus-visible:ring-4 focus-visible:ring-action-focus-ring disabled:pointer-events-none disabled:opacity-40",
              !disabled &&
                isAdmin &&
                "hover:-translate-y-px hover:scale-[1.04] hover:shadow-raised-soft active:translate-y-0 active:scale-[1.02] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
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
                <AdminVcaFabMark selected={isSelected} tone={adminTone} />
              </span>
            ) : (
              <DefaultVcaFabMark />
            )}
          </button>
          {!isAdmin && !children && showVisitorPresenceBadge ? (
            <VisitorVcaFabPresenceBadge disabled={disabled} />
          ) : null}
        </span>
      </div>
    );
  },
);

VcaFab.displayName = "VcaFab";
