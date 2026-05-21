"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

import Link from "next/link";

import { Icon } from "@/components/primitives/icon";
import { FLOW_REVIEW_NAV_ITEMS } from "@/lib/conversation-flows";

const LIVE_PROTOTYPE_NAV_ITEM = {
  id: "live",
  href: "/hiring",
  label: "All intents",
  description: "Interact with the prototype to see results across all intents",
  typeLabel: "Interactive",
} as const;

type ReviewShellStateMenuOption = Readonly<{
  id: string;
  label: string;
  value: boolean;
}>;

type ReviewShellModeMenuOption = Readonly<{
  id: string;
  href?: string;
  label: string;
  description?: string;
  typeLabel?: string;
  hasDividerAfter?: boolean;
  options?: ReadonlyArray<ReviewShellModeMenuOption>;
}>;

export type ReviewShellModeMenuGroup = Readonly<{
  id: string;
  label: string;
  description?: string;
  options: ReadonlyArray<ReviewShellModeMenuOption>;
}>;

type ReviewShellShellMenuOption = Readonly<{
  id: string;
  href: string;
  label: string;
}>;

const loginOptions: ReadonlyArray<ReviewShellStateMenuOption> = [
  { id: "signed-in", label: "Signed in", value: true },
  { id: "signed-out", label: "Signed out", value: false },
];
const defaultModeOptions: ReadonlyArray<ReviewShellModeMenuOption> = [
  LIVE_PROTOTYPE_NAV_ITEM,
  ...FLOW_REVIEW_NAV_ITEMS,
];

type ReviewShellStateMenuProps = Readonly<{
  isOpen: boolean;
  isSignedIn: boolean;
  pathname: string;
  currentHref?: string;
  onLoginSelect?: (next: boolean) => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  labelledBy?: string;
  modeOptions?: ReadonlyArray<ReviewShellModeMenuOption>;
  modeGroups?: ReadonlyArray<ReviewShellModeMenuGroup>;
  modeHeading?: string;
  shellOptions?: ReadonlyArray<ReviewShellShellMenuOption>;
  shellHeading?: string;
  showVisitorControls?: boolean;
}>;

export function ReviewShellStateMenu({
  isOpen,
  isSignedIn,
  pathname,
  currentHref = pathname,
  onLoginSelect,
  onClose,
  triggerRef,
  labelledBy,
  modeOptions = defaultModeOptions,
  modeGroups,
  modeHeading = "Mode",
  shellOptions = [],
  shellHeading = "Shell",
  showVisitorControls = true,
}: ReviewShellStateMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeModeGroupId, setActiveModeGroupId] = useState<string | null>(
    null,
  );
  const visitorOptions = showVisitorControls ? loginOptions : [];
  const modeControlCount = modeGroups?.length ?? modeOptions.length;
  const hasSettings = visitorOptions.length > 0 || shellOptions.length > 0;
  const optionCount =
    modeControlCount + shellOptions.length + visitorOptions.length;
  const activeModeIndex = modeGroups
    ? modeGroups.findIndex((group) =>
        group.options.some((option) => option.href?.split("?")[0] === pathname),
      )
    : modeOptions.findIndex((option) =>
        option.options
          ? option.options.some(
              (childOption) => childOption.href?.split("?")[0] === pathname,
            )
          : option.href?.split("?")[0] === pathname,
      );
  const activeShellIndex = shellOptions.findIndex(
    (option) => option.href === currentHref,
  );
  const activeLoginIndex = visitorOptions.findIndex(
    (option) => option.value === isSignedIn,
  );
  const focusIndex =
    activeModeIndex >= 0
      ? activeModeIndex
      : activeLoginIndex >= 0
        ? modeControlCount + activeLoginIndex
        : activeShellIndex >= 0
          ? modeControlCount + visitorOptions.length + activeShellIndex
          : 0;
  const shellGridClass =
    shellOptions.length > 2
      ? "grid-cols-1"
      : "grid-cols-2";

  function getSegmentClasses(isSelected: boolean) {
    return [
      "flex min-h-7 items-center justify-center rounded-[9px] px-2 py-1 text-center text-[10px] font-medium leading-tight transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20",
      isSelected
        ? "bg-white text-sky-900 shadow-sm ring-1 ring-sky-100"
        : "text-slate-600 hover:bg-white/80 hover:text-sky-900 focus-visible:bg-white",
    ].join(" ");
  }

  function getSettingsControlIndex(
    group: "auth" | "shell",
    optionIndex: number,
  ) {
    return group === "auth"
      ? modeControlCount + optionIndex
      : modeControlCount + visitorOptions.length + optionIndex;
  }

  function renderSettingRow({
    children,
    heading,
    id,
  }: Readonly<{
    children: ReactNode;
    heading: string;
    id: string;
  }>) {
    return (
      <div className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 px-1">
        <p
          id={id}
          className="pl-2 text-[11px] font-semibold leading-none text-slate-500"
        >
          {heading}
        </p>
        {children}
      </div>
    );
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    itemRefs.current[focusIndex]?.focus();
  }, [focusIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node | null;

      if (!target) {
        return;
      }
      if (menuRef.current?.contains(target)) {
        return;
      }
      if (triggerRef.current?.contains(target)) {
        return;
      }

      onClose();
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function moveFocus(currentIndex: number, delta: number) {
    const next = (currentIndex + delta + optionCount) % optionCount;
    itemRefs.current[next]?.focus();
  }

  function handleItemKeyDown(
    event: KeyboardEvent<HTMLElement>,
    index: number,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(index, 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(index, -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      itemRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      itemRefs.current[optionCount - 1]?.focus();
    }
  }

  function getModeOptionDisplay(option: ReviewShellModeMenuOption) {
    const match = option.label.match(
      /\s+\((interactive|static)(?: screen)?\)$/i,
    );
    const parentheticalStart = match?.index ?? option.label.length;

    return {
      label: match
        ? option.label.slice(0, parentheticalStart).trim()
        : option.label,
      typeLabel:
        option.typeLabel ??
        (match
          ? match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()
          : undefined),
    };
  }

  function renderModeOptions() {
    if (modeGroups) {
      return modeGroups.map((group, groupIndex) => {
        const isGroupSelected = group.options.some(
          (option) => option.href?.split("?")[0] === pathname,
        );

        const isSubmenuOpen = activeModeGroupId === group.id;

        return (
          <div
            key={group.id}
            className="relative"
            onMouseEnter={() => setActiveModeGroupId(group.id)}
            onMouseLeave={() => setActiveModeGroupId(null)}
            onFocusCapture={() => setActiveModeGroupId(group.id)}
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={isSubmenuOpen}
              tabIndex={groupIndex === focusIndex ? 0 : -1}
              onKeyDown={(event) => handleItemKeyDown(event, groupIndex)}
              ref={(element) => {
                itemRefs.current[groupIndex] = element;
              }}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20",
                isGroupSelected
                  ? "bg-sky-50 text-sky-900"
                  : "text-slate-600 hover:bg-sky-50 hover:text-sky-900 focus-visible:bg-sky-50 focus-visible:text-sky-900",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "inline-flex w-3 shrink-0 items-center justify-center",
                  isGroupSelected ? "text-sky-700" : "text-transparent",
                ].join(" ")}
              >
                <Icon name="check" size="small" className="[&&]:size-3" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-medium leading-tight tracking-[0.01em]">
                  {group.label}
                </span>
                {group.description ? (
                  <span className="mt-0.5 block text-[11px] font-normal leading-snug text-slate-500">
                    {group.description}
                  </span>
                ) : null}
              </span>
              <Icon
                name="chevron-right"
                size="small"
                className="shrink-0 text-slate-400 [&&]:size-3"
              />
            </button>
            <div
              role="menu"
              aria-label={`${group.label} view type`}
              className={[
                "absolute left-[calc(100%+8px)] top-0 min-w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.12),0_4px_14px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition-[opacity,visibility] duration-150 ease-out",
                isSubmenuOpen
                  ? "visible opacity-100"
                  : "invisible opacity-0",
              ].join(" ")}
            >
              {group.options.map((option) => {
                const display = getModeOptionDisplay(option);
                const isSelected = option.href?.split("?")[0] === pathname;

                return (
                  <Link
                    key={option.id}
                    href={option.href ?? "#"}
                    role="menuitemradio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={onClose}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        itemRefs.current[groupIndex]?.focus();
                      } else {
                        handleItemKeyDown(event, groupIndex);
                      }
                    }}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20",
                      isSelected
                        ? "bg-sky-50 text-sky-900"
                        : "text-slate-600 hover:bg-sky-50 hover:text-sky-900 focus-visible:bg-sky-50 focus-visible:text-sky-900",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "inline-flex w-3 shrink-0 items-center justify-center",
                        isSelected ? "text-sky-700" : "text-transparent",
                      ].join(" ")}
                    >
                      <Icon name="check" size="small" className="[&&]:size-3" />
                    </span>
                    <span className="min-w-max flex-1 whitespace-nowrap text-[12px] font-medium leading-tight tracking-[0.01em]">
                      {display.label}
                    </span>
                    {display.typeLabel ? (
                      <span className="shrink-0 text-[11px] font-medium leading-none text-slate-400">
                        {display.typeLabel}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      });
    }

    return modeOptions.map((option, optionIndex) => {
      const index = optionIndex;
      const hasSubmenu = Boolean(option.options?.length);
      const isSelected = hasSubmenu
        ? option.options?.some(
            (childOption) => childOption.href?.split("?")[0] === pathname,
          ) ?? false
        : option.href?.split("?")[0] === pathname;
      const display = getModeOptionDisplay(option);

      if (hasSubmenu) {
        const isSubmenuOpen = activeModeGroupId === option.id;

        return (
          <div
            key={option.id}
            className={[
              "relative",
              option.hasDividerAfter
                ? "mb-1.5 border-b border-slate-200/70 pb-1.5"
                : "",
            ].join(" ")}
            onMouseEnter={() => setActiveModeGroupId(option.id)}
            onMouseLeave={() => setActiveModeGroupId(null)}
            onFocusCapture={() => setActiveModeGroupId(option.id)}
          >
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={isSubmenuOpen}
              tabIndex={index === focusIndex ? 0 : -1}
              onKeyDown={(event) => handleItemKeyDown(event, index)}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20",
                isSelected
                  ? "bg-sky-50 text-sky-900"
                  : "text-slate-600 hover:bg-sky-50 hover:text-sky-900 focus-visible:bg-sky-50 focus-visible:text-sky-900",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "inline-flex w-3 shrink-0 items-center justify-center",
                  isSelected ? "text-sky-700" : "text-transparent",
                ].join(" ")}
              >
                <Icon name="check" size="small" className="[&&]:size-3" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-medium leading-tight tracking-[0.01em]">
                  {display.label}
                </span>
                {option.description ? (
                  <span className="mt-0.5 block text-[11px] font-normal leading-snug text-slate-500">
                    {option.description}
                  </span>
                ) : null}
              </span>
              <Icon
                name="chevron-right"
                size="small"
                className="shrink-0 text-slate-400 [&&]:size-3"
              />
            </button>
            <div
              role="menu"
              aria-label={`${display.label} options`}
              className={[
                "absolute left-[calc(100%+8px)] top-0 min-w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.12),0_4px_14px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition-[opacity,visibility] duration-150 ease-out",
                isSubmenuOpen
                  ? "visible opacity-100"
                  : "invisible opacity-0",
              ].join(" ")}
            >
              {option.options?.map((childOption) => {
                const childDisplay = getModeOptionDisplay(childOption);
                const isChildSelected =
                  childOption.href?.split("?")[0] === pathname;

                return (
                  <Link
                    key={childOption.id}
                    href={childOption.href ?? "#"}
                    role="menuitemradio"
                    aria-checked={isChildSelected}
                    tabIndex={0}
                    onClick={onClose}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        itemRefs.current[index]?.focus();
                      } else {
                        handleItemKeyDown(event, index);
                      }
                    }}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20",
                      isChildSelected
                        ? "bg-sky-50 text-sky-900"
                        : "text-slate-600 hover:bg-sky-50 hover:text-sky-900 focus-visible:bg-sky-50 focus-visible:text-sky-900",
                    ].join(" ")}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        "inline-flex w-3 shrink-0 items-center justify-center",
                        isChildSelected ? "text-sky-700" : "text-transparent",
                      ].join(" ")}
                    >
                      <Icon name="check" size="small" className="[&&]:size-3" />
                    </span>
                    <span className="min-w-max flex-1 whitespace-nowrap text-[12px] font-medium leading-tight tracking-[0.01em]">
                      {childDisplay.label}
                    </span>
                    {childDisplay.typeLabel ? (
                      <span className="shrink-0 text-[11px] font-medium leading-none text-slate-400">
                        {childDisplay.typeLabel}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      }

      return (
        <div
          key={option.id}
          className={[
            option.hasDividerAfter
              ? "mb-1.5 border-b border-slate-200/70 pb-1.5"
              : "",
          ].join(" ")}
        >
          <Link
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            href={option.href ?? "#"}
            role="menuitemradio"
            aria-checked={isSelected}
            tabIndex={index === focusIndex ? 0 : -1}
            onClick={onClose}
            onKeyDown={(event) => handleItemKeyDown(event, index)}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20",
              isSelected
                ? "bg-sky-50 text-sky-900"
                : "text-slate-600 hover:bg-sky-50 hover:text-sky-900 focus-visible:bg-sky-50 focus-visible:text-sky-900",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={[
                "inline-flex w-3 shrink-0 items-center justify-center",
                isSelected ? "text-sky-700" : "text-transparent",
              ].join(" ")}
            >
              <Icon name="check" size="small" className="[&&]:size-3" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-medium leading-tight tracking-[0.01em]">
                {display.label}
              </span>
              {option.description ? (
                <span className="mt-0.5 block text-[11px] font-normal leading-snug text-slate-500">
                  {option.description}
                </span>
              ) : null}
            </span>
            {display.typeLabel ? (
              <span className="shrink-0 text-[11px] font-medium leading-none text-slate-400">
                {display.typeLabel}
              </span>
            ) : null}
          </Link>
        </div>
      );
    });
  }

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={labelledBy}
      className="absolute left-0 top-full z-50 mt-2 min-w-[320px] rounded-2xl border border-slate-200 bg-white px-2 pb-2 pt-3 shadow-[0_16px_40px_rgba(15,23,42,0.12),0_4px_14px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
    >
      <div
        role="group"
        aria-labelledby="review-shell-mode-menu-heading"
        className="space-y-1"
      >
        <p
          id="review-shell-mode-menu-heading"
          className="px-3 pb-1 pt-0 text-[11px] font-semibold leading-none text-slate-500"
        >
          {modeHeading}
        </p>
        {renderModeOptions()}
      </div>

      {hasSettings ? (
        <div
          role="group"
          aria-labelledby="review-shell-settings-menu-heading"
          className="mt-2 space-y-3 border-t border-slate-200/70 pt-2"
        >
          <p
            id="review-shell-settings-menu-heading"
            className="px-3 pb-1 pt-1 text-[11px] font-semibold leading-none text-slate-500"
          >
            Settings
          </p>
          {visitorOptions.length > 0
            ? renderSettingRow({
                heading: "Auth",
                id: "review-shell-login-menu-heading",
                children: (
                  <div
                    aria-labelledby="review-shell-login-menu-heading"
                    className="grid grid-cols-2 gap-0.5 rounded-[11px] bg-slate-100 p-0.5"
                  >
                    {visitorOptions.map((option, optionIndex) => {
                      const index = getSettingsControlIndex(
                        "auth",
                        optionIndex,
                      );
                      const isSelected = option.value === isSignedIn;

                      return (
                        <button
                          key={option.id}
                          ref={(element) => {
                            itemRefs.current[index] = element;
                          }}
                          type="button"
                          role="menuitemradio"
                          aria-checked={isSelected}
                          tabIndex={index === focusIndex ? 0 : -1}
                          onClick={() => {
                            onLoginSelect?.(option.value);
                          }}
                          onKeyDown={(event) =>
                            handleItemKeyDown(event, index)
                          }
                          className={getSegmentClasses(isSelected)}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                ),
              })
            : null}
          {shellOptions.length > 0
            ? renderSettingRow({
                heading: shellHeading,
                id: "review-shell-shell-menu-heading",
                children: (
                  <div
                    aria-labelledby="review-shell-shell-menu-heading"
                    className={[
                      "grid gap-0.5 rounded-[11px] bg-slate-100 p-0.5",
                      shellGridClass,
                    ].join(" ")}
                  >
                    {shellOptions.map((option, optionIndex) => {
                      const index = getSettingsControlIndex(
                        "shell",
                        optionIndex,
                      );
                      const isSelected = option.href === currentHref;

                      return (
                        <Link
                          key={option.id}
                          ref={(element) => {
                            itemRefs.current[index] = element;
                          }}
                          href={option.href}
                          role="menuitemradio"
                          aria-checked={isSelected}
                          tabIndex={index === focusIndex ? 0 : -1}
                          onClick={onClose}
                          onKeyDown={(event) =>
                            handleItemKeyDown(event, index)
                          }
                          className={getSegmentClasses(isSelected)}
                        >
                          {option.label}
                        </Link>
                      );
                    })}
                  </div>
                ),
              })
            : null}
        </div>
      ) : null}
    </div>
  );
}
