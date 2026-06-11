import Image from "next/image";
import type { HTMLAttributes, ReactNode } from "react";

import { Icon } from "@/components/primitives/icon";

export type ContentListMetric = Readonly<{
  label: ReactNode;
  value: ReactNode;
}>;

export type ContentListItem = Readonly<{
  meta?: ReactNode;
  metrics?: ReadonlyArray<ContentListMetric>;
  thumbnailAlt?: string;
  thumbnailSrc?: string;
  title: ReactNode;
}>;

export type ContentListProps = HTMLAttributes<HTMLElement> & {
  description?: ReactNode;
  items: ReadonlyArray<ContentListItem>;
  title?: ReactNode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ContentListThumbnail({
  alt,
  src,
}: Readonly<{
  alt?: string;
  src?: string;
}>) {
  if (src) {
    return (
      <Image
        alt={alt ?? ""}
        className="size-10 rounded-xs object-cover"
        height={40}
        src={src}
        width={40}
      />
    );
  }

  return (
    <span className="inline-flex size-10 items-center justify-center rounded-xs bg-ai-background-soft text-ai-icon">
      <Icon aria-hidden="true" name="popular-content" size="small" />
    </span>
  );
}

export function ContentList({
  className,
  description,
  items,
  title = "Content performance",
  ...props
}: ContentListProps) {
  return (
    <article
      {...props}
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-xl text-text shadow-raised-faint",
        className,
      )}
      data-response-block="ContentList"
    >
      <div className="mb-xl space-y-xs">
        <h3 className="text-control-md text-text">{title}</h3>
        {description ? (
          <p className="text-body-sm text-text">{description}</p>
        ) : null}
      </div>
      <div className="divide-y divide-border-faint">
        {items.map((item, index) => (
          <article
            className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] gap-lg py-lg first:pt-0 last:pb-0"
            key={`${String(item.title)}-${index}`}
          >
            <ContentListThumbnail
              alt={item.thumbnailAlt}
              src={item.thumbnailSrc}
            />
            <div className="min-w-0">
              <h4 className="line-clamp-2 text-body-sm font-semibold text-text">
                {item.title}
              </h4>
              {item.meta ? (
                <p className="mt-xxs text-body-xs text-text-meta">{item.meta}</p>
              ) : null}
              {item.metrics?.length ? (
                <div className="mt-md flex flex-wrap gap-x-xl gap-y-sm">
                  {item.metrics.map((metric, metricIndex) => (
                    <div
                      className="min-w-0"
                      key={`${String(metric.label)}-${metricIndex}`}
                    >
                      <p className="text-control-sm text-text">{metric.value}</p>
                      <p className="text-body-xs text-text-meta">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}
