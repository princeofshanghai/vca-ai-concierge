import { Suspense, type ReactNode } from "react";

import { ReviewShellNav } from "./review-shell-nav";
import { ReviewShellStateProvider } from "./review-shell-state";

type ReviewShellProps = Readonly<{
  children: ReactNode;
}>;

export function ReviewShell({ children }: ReviewShellProps) {
  return (
    <ReviewShellStateProvider>
      <div className="relative min-h-dvh">
        <Suspense fallback={null}>
          <ReviewShellNav />
        </Suspense>
        <div className="min-h-dvh pt-28 sm:pt-32">{children}</div>
      </div>
    </ReviewShellStateProvider>
  );
}
