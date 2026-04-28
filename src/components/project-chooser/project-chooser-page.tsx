import Link from "next/link";

const conciergeOptions = [
  {
    href: "/hiring",
    label: "LTS Hiring concierge",
  },
  {
    href: "/premium",
    label: "Premium concierge",
  },
] as const;

export function ProjectChooserPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-10 text-text sm:px-8">
      <section
        aria-labelledby="project-chooser-title"
        className="flex w-full max-w-[720px] flex-col items-center text-center"
      >
        <p className="mb-3 text-label-xs uppercase text-text-meta">
          AI Concierge prototypes
        </p>
        <h1
          id="project-chooser-title"
          className="text-display-md text-text"
        >
          Choose a concierge
        </h1>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          {conciergeOptions.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="group inline-flex h-[48px] min-w-[220px] shrink-0 items-center justify-center rounded-md bg-transparent font-sans outline-none transition-[box-shadow] duration-150 ease-out focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
            >
              <span className="inline-flex min-h-[32px] w-full items-center justify-center rounded-md border border-border-subtle bg-background px-md py-xs text-control-sm text-label transition-[background-color,border-color,color] duration-150 ease-out group-hover:border-border group-hover:bg-background-transparent-hover group-hover:text-text-hover group-active:border-border-active group-active:bg-background-transparent-active group-active:text-text-active">
                {option.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
