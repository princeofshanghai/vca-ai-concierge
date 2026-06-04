import Image from "next/image";
import Link from "next/link";

type ProjectStatus = "In progress" | "Ready";
type ProjectPreview = Readonly<{
  alt: string;
  objectPosition: string;
  src: string;
}>;

const projectOptions: Array<{
  href: string;
  label: string;
  description: string;
  preview: ProjectPreview;
  status: ProjectStatus;
}> = [
  {
    href: "/hiring/entry-lix-test",
    label: "LTS microsite",
    description: "VCA sales agent to help qualify leads and route to an AE/SDR.",
    preview: {
      alt: "Preview of the LTS microsite concierge",
      objectPosition: "center top",
      src: "/assets/project-previews/hiring-lts-concierge.png",
    },
    status: "Ready",
  },
  {
    href: "/premium",
    label: "Premium survey/chooser",
    description: "VCA sales agent to help give Premium SKU recommendations.",
    preview: {
      alt: "Preview of the Premium survey concierge",
      objectPosition: "62% top",
      src: "/assets/project-previews/premium-survey-concierge.png",
    },
    status: "Ready",
  },
  {
    href: "/premium-company-pages/member",
    label: "Premium Company Pages vision",
    description:
      "VCA agent that helps give admins more insight and helps visitors get their questions answered.",
    preview: {
      alt: "Preview of Premium Company Pages",
      objectPosition: "50% top",
      src: "/assets/project-previews/premium-company-pages.png",
    },
    status: "In progress",
  },
] as const;

const componentLibraryOption = {
  href: "/internal/components",
  label: "Component library",
} as const;

const statusClassNames: Record<ProjectStatus, string> = {
  "In progress":
    "bg-[color-mix(in_srgb,var(--color-caution)_11%,white)] text-caution",
  Ready:
    "bg-[color-mix(in_srgb,var(--color-positive)_11%,white)] text-positive",
};

function ProjectStatusChip({ status }: Readonly<{ status: ProjectStatus }>) {
  return (
    <span
      className={`inline-flex h-5 max-w-full shrink-0 items-center rounded-round px-sm text-supportive-s-strong ${statusClassNames[status]}`}
    >
      {status}
    </span>
  );
}

function ProjectPreview({ preview }: Readonly<{ preview: ProjectPreview }>) {
  return (
    <div className="relative aspect-[2390/1630] w-full overflow-hidden rounded-xs bg-background-neutral-soft">
      <Image
        src={preview.src}
        alt={preview.alt}
        fill
        sizes="(min-width: 1024px) 34vw, (min-width: 768px) 42vw, 100vw"
        className="object-contain"
        loading="eager"
        style={{ objectPosition: preview.objectPosition }}
      />
    </div>
  );
}

function ProjectTile({
  description,
  href,
  label,
  preview,
  status,
}: Readonly<(typeof projectOptions)[number]>) {
  return (
    <Link
      href={href}
      aria-label={`${label}, ${status}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-sm border border-border-faint bg-background outline-none transition-[border-color,background-color] duration-150 ease-out hover:border-border-subtle focus-visible:ring-4 focus-visible:ring-action-focus-ring"
    >
      <div className="border-b border-border-faint bg-background-neutral-soft p-sm">
        <ProjectPreview preview={preview} />
      </div>
      <div className="flex flex-1 flex-col gap-md p-lg text-left">
        <div className="flex items-start justify-between gap-md">
          <h2 className="text-heading-sm text-text">{label}</h2>
          <ProjectStatusChip status={status} />
        </div>
        <p className="max-w-[30rem] text-body-sm-open text-text">
          {description}
        </p>
      </div>
    </Link>
  );
}

export function ProjectChooserPage() {
  return (
    <main className="min-h-dvh bg-background text-text">
      <section
        aria-labelledby="project-chooser-title"
        className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col px-md py-lg sm:px-lg lg:px-xxl"
      >
        <header className="flex items-center justify-between gap-lg">
          <p className="text-heading-md text-text">VCA AI Concierge</p>
          <Link
            href={componentLibraryOption.href}
            className="rounded-round border border-border-subtle bg-background px-md py-xs text-control-sm text-text outline-none transition-[background-color,border-color] duration-150 ease-out hover:border-border-subtle-hover hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          >
            Browse component library
          </Link>
        </header>

        <div className="mt-[72px] md:mt-[96px]">
          <h1
            id="project-chooser-title"
            className="text-display-md text-text sm:text-display-xl"
          >
            Choose project
          </h1>
        </div>

        <div className="mt-[72px] grid gap-lg md:mt-[96px] md:grid-cols-3">
          {projectOptions.map((option) => (
            <ProjectTile key={option.href} {...option} />
          ))}
        </div>

        <div className="flex-1" />
      </section>
    </main>
  );
}
