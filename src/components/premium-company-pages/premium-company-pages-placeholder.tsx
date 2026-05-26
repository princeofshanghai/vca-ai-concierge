import Link from "next/link";

import { getButtonClassName } from "@/components/primitives/button";

export function PremiumCompanyPagesPlaceholder() {
  return (
    <main className="min-h-dvh bg-background text-text">
      <section className="mx-auto flex min-h-dvh w-full max-w-[880px] flex-col justify-center px-lg py-stack sm:px-xxxl">
        <p className="mb-md text-label-xs text-text-meta">
          Premium Company Pages
        </p>
        <h1 className="max-w-[720px] text-display-md text-text">
          Vision prototype placeholder
        </h1>
        <p className="mt-lg max-w-[680px] text-body-md-open text-text-meta">
          This space is reserved for the executive-facing AI chat concept for
          Premium Company Pages. It is intentionally minimal until the project
          brief, narrative, and design direction are defined.
        </p>

        <div className="mt-xxxl flex flex-col gap-md sm:flex-row">
          <Link
            href="/"
            className={getButtonClassName({
              variant: "tertiary",
              size: "medium",
            })}
          >
            Back to projects
          </Link>
        </div>
      </section>
    </main>
  );
}
