import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { PremiumChipSmall } from "@/components/primitives/premium-chip-small";

export type PremiumUpsellBadgeVariant =
  | "inline-on-light"
  | "inline-on-blue"
  | "outline-on-blue"
  | "floating"
  | "solid"
  | "solid-with-chip"
  | "strong";

export type PremiumUpsellBadgeProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  children?: ReactNode;
  variant?: PremiumUpsellBadgeVariant;
};

const baseClassName =
  "inline-flex max-w-full shrink-0 items-center whitespace-nowrap text-supportive-s-strong";

const variantClassNames: Record<PremiumUpsellBadgeVariant, string> = {
  "inline-on-light": "gap-xs text-text",
  "inline-on-blue": "gap-xs text-on-action",
  "outline-on-blue":
    "gap-xs rounded-round border-[1.5px] border-on-action px-md py-[6px] text-on-action",
  floating:
    "gap-xs rounded-round bg-background px-md py-[6px] text-premium-text-brand shadow-raised-faint",
  solid: "rounded-round bg-premium-brand px-md py-[6px] text-text",
  "solid-with-chip":
    "gap-xs rounded-round bg-premium-brand px-md py-[6px] text-text",
  strong:
    "gap-xs rounded-round bg-premium-button-background-active px-md py-[6px] text-on-action",
};

const variantsWithIcon = new Set<PremiumUpsellBadgeVariant>([
  "inline-on-light",
  "inline-on-blue",
  "outline-on-blue",
  "floating",
  "solid-with-chip",
  "strong",
]);

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const PremiumUpsellBadge = forwardRef<
  HTMLSpanElement,
  PremiumUpsellBadgeProps
>(function PremiumUpsellBadge(
  {
    children = "Try Premium for $0",
    className,
    variant = "inline-on-blue",
    ...props
  },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      data-variant={variant}
      className={cx(baseClassName, variantClassNames[variant], className)}
    >
      {variantsWithIcon.has(variant) ? <PremiumChipSmall /> : null}
      <span className="min-w-0 overflow-hidden text-ellipsis">
        {children}
      </span>
    </span>
  );
});

PremiumUpsellBadge.displayName = "PremiumUpsellBadge";
