import type { HTMLAttributes, ReactNode } from "react";

import { ComponentLibraryCallout } from "./component-library-callout";

type ComponentLibraryAnnotationProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children"
> & {
  children: ReactNode;
  label?: ReactNode;
};

export function ComponentLibraryAnnotation({
  children,
  className,
  label,
  ...props
}: ComponentLibraryAnnotationProps) {
  const labelSuffix =
    typeof label === "string" && /[!?:]$/.test(label) ? "" : ":";

  return (
    <ComponentLibraryCallout
      {...props}
      icon="lightbulb-fill"
      role="note"
      className={["w-fit max-w-full", className].filter(Boolean).join(" ")}
    >
      <p className="min-w-0">
        {label ? (
          <span className="font-medium">
            {label}
            {labelSuffix}{" "}
          </span>
        ) : null}
        {children}
      </p>
    </ComponentLibraryCallout>
  );
}
