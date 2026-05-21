import Link from "next/link";

import { getButtonClassName } from "@/components/primitives/button";

const conciergeOptions = [
  {
    href: "/hiring",
    label: "LTS microsite concierge",
  },
  {
    href: "/premium",
    label: "Premium survey concierge",
  },
  {
    href: "/internal/components",
    label: "Browse UI components",
  },
] as const;

export function ProjectChooserPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-lg py-stack text-body-md-open text-text sm:px-xxxl">
      <section
        aria-labelledby="project-chooser-title"
        className="flex w-full max-w-[720px] flex-col items-center text-center"
      >
        <p className="mb-md text-label-xs text-text-meta">
          VCA AI concierge
        </p>
        <h1
          id="project-chooser-title"
          className="text-display-md text-text"
        >
          Choose project
        </h1>
        <div className="mt-xxxl flex flex-col items-center gap-md sm:flex-row sm:gap-lg">
          {conciergeOptions.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className={getButtonClassName({
                variant: "tertiary",
                size: "medium",
                className: "min-w-[220px]",
              })}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
