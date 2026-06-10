import type { HTMLAttributes, ReactNode } from "react";

export type RecommendationItem = Readonly<{
  title: ReactNode;
  detail?: ReactNode;
}>;

export type RecommendationsProps = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
  items: ReadonlyArray<RecommendationItem>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Recommendations({
  title = "Recommended next steps",
  items,
  className,
  ...props
}: RecommendationsProps) {
  return (
    <article
      {...props}
      data-response-block="Recommendations"
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-lg text-text shadow-raised-faint",
        className,
      )}
    >
      <h3 className="mb-lg text-body-sm font-semibold text-text">{title}</h3>
      <ol className="space-y-md">
        {items.map(({ title: itemTitle, detail }, index) => (
          <li key={`${String(itemTitle)}-${index}`} className="flex gap-sm">
            <span className="inline-flex size-[var(--design-icon-size-medium)] shrink-0 items-center justify-center rounded-round bg-ai-background-soft text-label-xs text-ai-icon">
              {index + 1}
            </span>
            <div className="min-w-0 space-y-xxs">
              <p className="text-body-sm font-semibold text-text">{itemTitle}</p>
              {detail ? (
                <p className="text-body-sm-open text-text-meta">{detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
