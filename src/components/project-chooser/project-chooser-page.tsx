import Image from "next/image";
import Link from "next/link";

import { Icon, type IconName } from "@/components/primitives/icon";

type ProjectStatus = "In progress" | "Ready";
type ProjectImagePreview = Readonly<{
  alt: string;
  objectPosition: string;
  src: string;
}>;
type ProjectPlaceholderPreview = Readonly<{
  icon: IconName;
  label: string;
}>;
type ProjectPreview = ProjectImagePreview | ProjectPlaceholderPreview;

const projectOptions: Array<{
  href: string;
  label: string;
  description: string;
  preview: ProjectPreview;
  status: ProjectStatus;
}> = [
  {
    href: "/hiring/entry-lix-test",
    label: "LTS acquisition",
    description: "Sales agent for lead qualification on microsites",
    preview: {
      alt: "Preview of the LTS microsite concierge",
      objectPosition: "center top",
      src: "/assets/project-previews/hiring-lts-concierge.png",
    },
    status: "Ready",
  },
  {
    href: "/premium",
    label: "Premium acquisition",
    description: "Sales agent for online SKU recommendations",
    preview: {
      alt: "Preview of the Premium survey concierge",
      objectPosition: "62% top",
      src: "/assets/project-previews/premium-survey-concierge.png",
    },
    status: "Ready",
  },
  {
    href: "/premium-company-pages/admin",
    label: "PCP vision",
    description: "Admin and visitor agent for analytics insights and support",
    preview: {
      alt: "Preview of Premium Company Pages",
      objectPosition: "50% top",
      src: "/assets/project-previews/premium-company-pages.png",
    },
    status: "In progress",
  },
  {
    href: "/vca-ecosystem",
    label: "VCA ecosystem",
    description: "Collection of near term VCA UI optimization projects",
    preview: {
      icon: "signal-ai",
      label: "VCA ecosystem placeholder preview",
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
    "bg-[color-mix(in_srgb,var(--color-caution)_12%,white)] text-caution",
  Ready:
    "bg-[color-mix(in_srgb,var(--color-positive)_12%,white)] text-positive",
};

function ProjectStatusChip({ status }: Readonly<{ status: ProjectStatus }>) {
  return (
    <span
      className={`inline-flex h-5 max-w-full shrink-0 items-center rounded-round px-sm text-[12px] font-semibold leading-[15px] tracking-normal ${statusClassNames[status]}`}
    >
      {status}
    </span>
  );
}

function ProjectPreview({ preview }: Readonly<{ preview: ProjectPreview }>) {
  if (!("src" in preview)) {
    return (
      <div
        aria-label={preview.label}
        className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-sm border border-border-faint bg-surface-tint text-ai-icon transition-colors duration-150 ease-out group-hover:border-border-subtle"
        role="img"
      >
        <Icon
          name={preview.icon}
          size="medium"
          className="[&&]:size-8 transition-transform duration-150 ease-out group-hover:scale-[1.015]"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border-faint bg-background-neutral-soft transition-colors duration-150 ease-out group-hover:border-border-subtle">
      <Image
        src={preview.src}
        alt={preview.alt}
        fill
        sizes="(min-width: 1024px) 214px, (min-width: 768px) 42vw, 100vw"
        className="object-cover transition-transform duration-150 ease-out group-hover:scale-[1.015]"
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
      className="group flex min-w-0 flex-col rounded-sm outline-none transition-opacity duration-150 ease-out focus-visible:ring-4 focus-visible:ring-action-focus-ring"
    >
      <ProjectPreview preview={preview} />
      <div className="flex flex-1 flex-col pt-lg text-left">
        <h2 className="text-[14px] font-medium leading-[18px] tracking-normal text-text transition-colors duration-150 ease-out group-hover:text-action">
          {label}
        </h2>
        <p className="mt-sm max-w-[19rem] text-[13px] font-normal leading-[18px] tracking-normal text-text-meta">
          {description}
        </p>
        <div className="mt-md">
          <ProjectStatusChip status={status} />
        </div>
      </div>
    </Link>
  );
}

export function ProjectChooserPage() {
  return (
    <main className="min-h-dvh bg-background text-text">
      <section
        aria-labelledby="project-chooser-title"
        className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col px-md py-[32px] sm:px-[40px] sm:py-[56px] lg:px-0 lg:py-[64px]"
      >
        <header className="flex items-center justify-between gap-lg">
          <p className="flex items-center gap-xs text-[13px] font-medium leading-[18px] tracking-normal text-text">
            <Image
              src="/assets/linkedin-bug-blue.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-[14px] shrink-0"
            />
            VCA AI concierge
          </p>
          <Link
            href={componentLibraryOption.href}
            className="group inline-flex items-center gap-xs rounded-xs px-xs py-xs text-[13px] font-normal leading-[18px] tracking-normal text-text-meta outline-none transition-colors duration-150 ease-out hover:text-text focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          >
            {componentLibraryOption.label}
            <Icon
              name="arrow-right"
              size="small"
              className="transition-transform duration-150 ease-out group-hover:translate-x-[2px]"
            />
          </Link>
        </header>

        <div className="mt-[112px] md:mt-[144px]">
          <h1
            id="project-chooser-title"
            className="text-[24px] font-medium leading-[30px] tracking-normal text-text"
          >
            Choose project
          </h1>
        </div>

        <div className="mt-[72px] grid gap-x-[40px] gap-y-[64px] md:grid-cols-2 lg:grid-cols-3">
          {projectOptions.map((option) => (
            <ProjectTile key={option.href} {...option} />
          ))}
        </div>

        <div className="flex-1" />
      </section>
    </main>
  );
}
