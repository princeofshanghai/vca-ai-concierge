import type { HTMLAttributes, ReactNode } from "react";

import { Icon, type IconName } from "@/components/primitives/icon";

type ComponentLibraryCalloutProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  icon: IconName;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ComponentLibraryCallout({
  children,
  className,
  icon,
  ...props
}: ComponentLibraryCalloutProps) {
  return (
    <div
      {...props}
      className={cx(
        "flex items-start gap-sm rounded-sm bg-premium-gradient-base-a px-md py-sm text-[13px] font-normal leading-[18px] text-text",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className="mt-[1px] shrink-0 text-premium-inbug"
        name={icon}
        size="small"
      />
      {children}
    </div>
  );
}
