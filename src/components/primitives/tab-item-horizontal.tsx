import type { ButtonHTMLAttributes } from "react";

import { Icon, type IconName } from "@/components/primitives/icon";

export type TabItemHorizontalVisualState = "default" | "hover" | "active";
export type TabItemHorizontalTone = "default" | "overlay";

export type TabItemHorizontalProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  label: string;
  selected?: boolean;
  icon?: IconName;
  overflow?: boolean;
  tone?: TabItemHorizontalTone;
  visualState?: TabItemHorizontalVisualState;
};

const visualStateClasses: Record<
  TabItemHorizontalTone,
  Record<TabItemHorizontalVisualState, string>
> = {
  default: {
    default: "",
    hover: "bg-background-transparent-hover text-text-hover",
    active: "bg-background-transparent-active text-text-active",
  },
  overlay: {
    default: "",
    hover:
      "bg-[var(--figma-color-background-color-background-transparent-overlay-hover)] text-[var(--figma-color-text-color-text-overlay-hover)]",
    active:
      "bg-[var(--figma-color-background-color-background-transparent-overlay-active)] text-[var(--figma-color-text-color-text-overlay-active)]",
  },
};

const selectedStateClasses: Record<
  TabItemHorizontalTone,
  Record<TabItemHorizontalVisualState, string>
> = {
  default: {
    default: "border-checked text-checked",
    hover: "border-checked-hover bg-background-transparent-hover text-checked-hover",
    active:
      "border-checked-active bg-background-transparent-active text-checked-active",
  },
  overlay: {
    default:
      "border-[var(--figma-color-text-color-text-overlay)] text-[var(--figma-color-text-color-text-overlay)]",
    hover:
      "border-[var(--figma-color-text-color-text-overlay-hover)] bg-[var(--figma-color-background-color-background-transparent-overlay-hover)] text-[var(--figma-color-text-color-text-overlay-hover)]",
    active:
      "border-[var(--figma-color-text-color-text-overlay-active)] bg-[var(--figma-color-background-color-background-transparent-overlay-active)] text-[var(--figma-color-text-color-text-overlay-active)]",
  },
};

const toneClasses: Record<TabItemHorizontalTone, string> = {
  default: "text-label",
  overlay: "text-[var(--figma-color-text-color-text-overlay)]",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TabItemHorizontal({
  label,
  selected = false,
  icon,
  overflow = false,
  tone = "default",
  visualState = "default",
  className,
  type,
  ...props
}: TabItemHorizontalProps) {
  const stateClass = selected
    ? selectedStateClasses[tone][visualState]
    : visualStateClasses[tone][visualState];
  const renderedIcon = overflow ? "caret" : icon;
  const iconSize = overflow ? "small" : "medium";

  return (
    <button
      {...props}
      aria-selected={selected}
      data-overflow={overflow || undefined}
      data-selected={selected || undefined}
      data-state={visualState}
      data-tone={tone}
      role={props.role ?? "tab"}
      type={type ?? "button"}
      className={cx(
        "relative inline-flex min-h-[var(--design-layout-primary-action-height)] shrink-0 select-none items-center gap-sm border-b-2 px-lg py-md text-left text-control-md outline-none transition-[background-color,border-color,color,box-shadow] duration-150 ease-out focus-visible:ring-4 focus-visible:ring-neutral-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-transparent disabled:text-text-disabled",
        selected ? null : "border-transparent",
        selected ? null : toneClasses[tone],
        stateClass,
        !selected &&
          tone === "default" &&
          "hover:bg-background-transparent-hover hover:text-text-hover active:bg-background-transparent-active active:text-text-active",
        !selected &&
          tone === "overlay" &&
          "hover:bg-[var(--figma-color-background-color-background-transparent-overlay-hover)] hover:text-[var(--figma-color-text-color-text-overlay-hover)] active:bg-[var(--figma-color-background-color-background-transparent-overlay-active)] active:text-[var(--figma-color-text-color-text-overlay-active)]",
        selected &&
          tone === "default" &&
          "hover:border-checked-hover hover:bg-background-transparent-hover hover:text-checked-hover active:border-checked-active active:bg-background-transparent-active active:text-checked-active",
        selected &&
          tone === "overlay" &&
          "hover:border-[var(--figma-color-text-color-text-overlay-hover)] hover:bg-[var(--figma-color-background-color-background-transparent-overlay-hover)] hover:text-[var(--figma-color-text-color-text-overlay-hover)] active:border-[var(--figma-color-text-color-text-overlay-active)] active:bg-[var(--figma-color-background-color-background-transparent-overlay-active)] active:text-[var(--figma-color-text-color-text-overlay-active)]",
        className,
      )}
    >
      {renderedIcon && !overflow ? <Icon name={renderedIcon} size="medium" /> : null}
      <span className="whitespace-nowrap">{overflow ? "More" : label}</span>
      {renderedIcon && overflow ? (
        <Icon aria-hidden="true" className="-mx-xxs" name="caret" size={iconSize} />
      ) : null}
    </button>
  );
}
