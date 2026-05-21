"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/primitives/icon";

import { componentNavGroups } from "./component-nav";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function sectionHasActivePage(
  section: (typeof componentNavGroups)[number],
  pathname: string,
) {
  return section.groups.some((group) =>
    group.items.some((item) => item.href === pathname),
  );
}

export function ComponentSidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      componentNavGroups.map((section) => [
        section.title,
        section.title === "VCA components" ||
          sectionHasActivePage(section, pathname),
      ]),
    ),
  );

  return (
    <aside className="border-b border-border-faint bg-background px-6 pb-xl sm:px-10 lg:fixed lg:bottom-0 lg:left-0 lg:top-0 lg:w-[15rem] lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-lg lg:pb-lg lg:pt-0 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
      <div className="px-md pb-8 pt-7 text-[16px] font-semibold leading-5 text-text">
        Component library
      </div>
      <div
        aria-hidden="true"
        className="-mx-6 border-t border-border-faint sm:-mx-10 lg:-mx-lg"
      />
      <nav aria-label="Component pages" className="mt-8 space-y-4">
        {componentNavGroups.map((section) => (
          <div key={section.title} className="space-y-3">
            <button
              type="button"
              aria-expanded={expandedSections[section.title] ?? false}
              aria-controls={`component-section-${section.title
                .toLowerCase()
                .replaceAll(" ", "-")}`}
              onClick={() => {
                setExpandedSections((current) => ({
                  ...current,
                  [section.title]: !(current[section.title] ?? false),
                }));
              }}
              className="flex min-h-[44px] w-full items-center justify-between rounded-sm px-md py-[10px] text-left text-sm font-medium leading-4 text-text outline-none transition-colors duration-150 ease-out hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
            >
              <span>{section.title}</span>
              <Icon
                name={
                  expandedSections[section.title]
                    ? "chevron-up"
                    : "chevron-down"
                }
                className="text-text-meta"
              />
            </button>

            {expandedSections[section.title] ? (
              <div
                id={`component-section-${section.title
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
                className="space-y-6"
              >
                {section.groups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    {section.title === "SDUI components" ? null : (
                      <h3 className="px-md text-[12px] font-medium leading-4 text-text-meta">
                        {group.title}
                      </h3>
                    )}
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={cx(
                              "block rounded-sm py-[8px] pl-[32px] pr-md text-[13px] leading-4 text-text outline-none transition-colors duration-150 ease-out focus-visible:ring-4 focus-visible:ring-neutral-focus-ring",
                              isActive
                                ? "bg-background-neutral-soft font-medium hover:bg-border-faint"
                                : "font-normal hover:bg-background-transparent-hover",
                            )}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  );
}
