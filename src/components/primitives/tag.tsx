import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type TagTone =
  | "default"
  | "positive"
  | "negative"
  | "caution"
  | "neutral"
  | "supportive-1"
  | "supportive-2"
  | "supportive-3"
  | "supportive-4"
  | "supportive-5";

export type TagSize = "small" | "medium";

export type TagProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  children: ReactNode;
  tone?: TagTone;
  size?: TagSize;
};

const sizeClasses: Record<TagSize, string> = {
  small: "h-[var(--design-layout-tag-small-height)] px-sm text-body-sm",
  medium: "h-[var(--design-layout-tag-medium-height)] px-sm text-body-md",
};

const toneClasses: Record<TagTone, string> = {
  default: "bg-tag-default-background text-label",
  positive: "bg-tag-positive-background text-on-tag-strong",
  negative: "bg-tag-negative-background text-on-tag-strong",
  caution: "bg-tag-caution-background text-on-tag-strong",
  neutral: "bg-tag-neutral-background text-on-tag-strong",
  "supportive-1": "bg-tag-supportive-1-background text-label",
  "supportive-2": "bg-tag-supportive-2-background text-label",
  "supportive-3": "bg-tag-supportive-3-background text-label",
  "supportive-4":
    "bg-tag-supportive-4-background text-tag-supportive-4-text",
  "supportive-5": "bg-tag-supportive-5-background text-label",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    children,
    className,
    tone = "default",
    size = "small",
    ...props
  },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      data-tone={tone}
      data-size={size}
      className={cx(
        "inline-flex max-w-full shrink-0 select-none items-center justify-center rounded-xs font-sans whitespace-nowrap",
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
});

Tag.displayName = "Tag";
