import Image from "next/image";
import type { HTMLAttributes, ReactNode } from "react";

export type PostCompactProps = HTMLAttributes<HTMLElement> & {
  author?: ReactNode;
  href?: string;
  meta: ReactNode;
  text: ReactNode;
  thumbnailAlt?: string;
  thumbnailSrc: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PostCompactContent({
  author,
  meta,
  text,
  thumbnailAlt,
  thumbnailSrc,
}: Pick<
  PostCompactProps,
  "author" | "meta" | "text" | "thumbnailAlt" | "thumbnailSrc"
>) {
  return (
    <>
      <Image
        alt={thumbnailAlt ?? ""}
        className="size-10 shrink-0 rounded-xs object-cover"
        height={40}
        src={thumbnailSrc}
        width={40}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-sm text-text">{text}</span>
        <span className="mt-xxs block truncate text-body-xs text-text-meta">
          {author ? (
            <>
              <span>{author}</span>
              <span aria-hidden="true"> · </span>
            </>
          ) : null}
          {meta}
        </span>
      </span>
    </>
  );
}

export function PostCompact({
  author,
  className,
  href,
  meta,
  text,
  thumbnailAlt,
  thumbnailSrc,
  ...props
}: PostCompactProps) {
  const classNames = cx(
    "flex w-full items-center gap-md rounded-sm border border-border-faint bg-background p-md text-left text-text shadow-raised-faint",
    href
      ? "outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:shadow-raised-soft focus-visible:ring-4 focus-visible:ring-action-focus-ring"
      : "",
    className,
  );
  const content = (
    <PostCompactContent
      author={author}
      meta={meta}
      text={text}
      thumbnailAlt={thumbnailAlt}
      thumbnailSrc={thumbnailSrc}
    />
  );

  if (href) {
    return (
      <a
        {...props}
        className={classNames}
        data-response-block="PostCompact"
        href={href}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      {...props}
      className={classNames}
      data-response-block="PostCompact"
    >
      {content}
    </article>
  );
}
