import type { ReactNode } from "react";

import { ComponentLibraryCallout } from "./component-library-callout";

type ComponentLibraryDemoGuidanceProps = Readonly<{
  children: ReactNode;
  onReset: () => void;
  resetDisabled?: boolean;
  secondaryControl?: ReactNode;
}>;

export function ComponentLibraryDemoGuidance({
  children,
  onReset,
  resetDisabled = false,
  secondaryControl,
}: ComponentLibraryDemoGuidanceProps) {
  return (
    <ComponentLibraryCallout
      aria-label="Demo guidance"
      className="w-full flex-wrap items-center"
      icon="play"
      role="group"
    >
      <p className="min-w-48 flex-1">{children}</p>
      <div className="ml-auto flex shrink-0 items-center gap-md">
        {secondaryControl ? (
          <div className="shrink-0">{secondaryControl}</div>
        ) : null}
        <button
          type="button"
          className="rounded-xs px-xs py-xxs text-[13px] font-medium leading-[18px] text-text underline decoration-1 underline-offset-2 outline-none transition-colors hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring disabled:cursor-not-allowed disabled:text-text-disabled disabled:no-underline"
          disabled={resetDisabled}
          onClick={onReset}
        >
          Reset demo
        </button>
      </div>
    </ComponentLibraryCallout>
  );
}
