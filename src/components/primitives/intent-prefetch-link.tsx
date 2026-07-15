"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ComponentProps } from "react";

export type IntentPrefetchLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "prefetch"
> & {
  href: string;
};

export function IntentPrefetchLink({
  onFocus,
  onMouseEnter,
  ...props
}: IntentPrefetchLinkProps) {
  const router = useRouter();

  const prefetchDestination = () => {
    router.prefetch(props.href);
  };

  return (
    <Link
      {...props}
      prefetch={false}
      onFocus={(event) => {
        prefetchDestination();
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        prefetchDestination();
        onMouseEnter?.(event);
      }}
    />
  );
}
