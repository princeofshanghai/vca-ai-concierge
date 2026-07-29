import type { HTMLAttributes } from "react";

export type ResponseSource = Readonly<{
  href: string;
  label: string;
}>;

export type SourcesProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  items: ReadonlyArray<ResponseSource>;
  title?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Sources({
  className,
  items,
  title = "Sources",
  ...props
}: SourcesProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      {...props}
      aria-label={title}
      className={cx(
        "w-full max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] border-t border-border-faint pt-md pr-sm text-text-meta",
        className,
      )}
      data-response-block="Sources"
    >
      <h3 className="text-supportive-s-strong">{title}</h3>
      <ul className="mt-sm space-y-xs">
        {items.map(({ href, label }) => (
          <li className="text-supportive-s" key={`${href}-${label}`}>
            <a
              className="underline decoration-1 underline-offset-2 transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              href={href}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
