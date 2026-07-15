import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { Icon, type IconName } from "@/components/primitives/icon";

export type InlineFeedbackTone =
  | "positive"
  | "negative"
  | "neutral"
  | "caution";

export type InlineFeedbackProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  action?: ReactNode;
  children: ReactNode;
  tone?: InlineFeedbackTone;
};

const toneStyles: Record<
  InlineFeedbackTone,
  { iconName: IconName; className: string }
> = {
  positive: {
    iconName: "signal-success",
    className: "text-positive",
  },
  negative: {
    iconName: "signal-error",
    className: "text-negative",
  },
  neutral: {
    iconName: "signal-notice",
    className: "text-label",
  },
  caution: {
    iconName: "signal-caution",
    className: "text-caution",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const InlineFeedback = forwardRef<HTMLDivElement, InlineFeedbackProps>(
  function InlineFeedback(
    {
      action,
      children,
      className,
      tone = "positive",
      role = "status",
      "aria-live": ariaLive = "polite",
      ...props
    },
    ref,
  ) {
    const { iconName, className: toneClassName } = toneStyles[tone];

    return (
      <div
        {...props}
        ref={ref}
        role={role}
        aria-live={ariaLive}
        data-tone={tone}
        className={cx(
          "inline-flex max-w-full items-center gap-xs text-body-sm",
          toneClassName,
          className,
        )}
      >
        <Icon
          aria-hidden="true"
          className="shrink-0"
          name={iconName}
          size="small"
        />
        <span className="min-w-0 break-words">
          {children}
          {action ? (
            <>
              {" "}
              <span className="font-semibold underline decoration-current underline-offset-2 [&_a]:underline [&_a]:decoration-current [&_a]:underline-offset-2 [&_button]:underline [&_button]:decoration-current [&_button]:underline-offset-2">
                {action}
              </span>
            </>
          ) : null}
        </span>
      </div>
    );
  },
);

InlineFeedback.displayName = "InlineFeedback";
