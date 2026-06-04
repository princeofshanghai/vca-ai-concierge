"use client";

import { Suspense, useState, type ReactNode } from "react";

import { usePathname } from "next/navigation";

import { ReviewShellNav } from "./review-shell-nav";
import { ReviewShellStateProvider } from "./review-shell-state";

type ReviewShellProps = Readonly<{
  children: ReactNode;
}>;

export function ReviewShell({ children }: ReviewShellProps) {
  const pathname = usePathname();
  const [isToolbarHidden, setIsToolbarHidden] = useState(false);
  const shouldOverlapPrototype =
    pathname?.startsWith("/premium-company-pages") ?? false;

  return (
    <ReviewShellStateProvider>
      <div className="relative min-h-dvh">
        <Suspense fallback={null}>
          <ReviewShellNav
            isToolbarHidden={isToolbarHidden}
            onToolbarHiddenChange={setIsToolbarHidden}
          />
        </Suspense>
        <div
          className={
            shouldOverlapPrototype ? "min-h-dvh" : "min-h-dvh pt-28 sm:pt-32"
          }
        >
          {children}
        </div>
      </div>
    </ReviewShellStateProvider>
  );
}
