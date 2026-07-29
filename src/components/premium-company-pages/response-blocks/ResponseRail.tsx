import type { HTMLAttributes, ReactNode } from "react";

export type ResponseRailProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "title"
> & {
  children: ReactNode;
  title?: ReactNode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ResponseRail({
  children,
  className,
  title,
  "aria-label": ariaLabel,
  ...props
}: ResponseRailProps) {
  return (
    <section
      {...props}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
      data-response-block="ResponseRail"
      className={cx(
        "w-full max-w-[min(100%,var(--design-layout-chat-message-assistant-max))]",
        className,
      )}
    >
      {title ? (
        <div className="mb-md flex items-center gap-sm text-control-md text-text">
          {title}
        </div>
      ) : null}
      <div className="-mx-sm overflow-x-auto overscroll-x-contain px-sm pb-xs [scrollbar-width:thin]">
        <div className="flex w-max min-w-full snap-x snap-mandatory gap-md [&>article]:!w-[var(--response-entity-card-rail-width,24rem)] [&>article]:shrink-0 [&>article]:snap-start">
          {children}
        </div>
      </div>
    </section>
  );
}
