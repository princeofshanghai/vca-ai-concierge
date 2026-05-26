import type { HTMLAttributes, ReactNode } from "react";

import { Icon, type IconName } from "@/components/primitives/icon";

type InterimLoadingStateProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: IconName;
  iconLabel?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function InterimLoadingState({
  title,
  description,
  icon = "signal-ai",
  iconLabel = "Loading",
  className,
  ...props
}: InterimLoadingStateProps) {
  return (
    <div
      {...props}
      role="status"
      aria-live="polite"
      className={cx(
        "flex min-h-0 flex-1 items-center justify-center px-xxl py-xxxl text-center",
        className,
      )}
    >
      <div className="flex max-w-[24rem] flex-col items-center">
        <div className="interim-loading-visual flex size-16 items-center justify-center text-ai-icon">
          <Icon
            name={icon}
            label={iconLabel}
            className="interim-loading-mark !size-8"
          />
        </div>
        <h2 className="mt-md text-heading-md text-text">{title}</h2>
        {description ? (
          <p className="mt-xs text-body-sm text-text-meta">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
