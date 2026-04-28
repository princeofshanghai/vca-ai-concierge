"use client";

import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type RefObject,
} from "react";

import Link from "next/link";

import { Icon } from "@/components/primitives/icon";
import { FLOW_REVIEW_NAV_ITEMS } from "@/lib/conversation-flows";

const LIVE_PROTOTYPE_NAV_ITEM = {
  id: "live",
  href: "/",
  label: "Live prototype",
} as const;

type ReviewShellStateMenuOption = Readonly<{
  id: string;
  label: string;
  value: boolean;
}>;

type ReviewShellModeMenuOption = Readonly<{
  id: string;
  href: string;
  label: string;
}>;

const loginOptions: ReadonlyArray<ReviewShellStateMenuOption> = [
  { id: "signed-in", label: "Signed in", value: true },
  { id: "signed-out", label: "Signed out", value: false },
];
const modeOptions: ReadonlyArray<ReviewShellModeMenuOption> = [
  LIVE_PROTOTYPE_NAV_ITEM,
  ...FLOW_REVIEW_NAV_ITEMS,
];

type ReviewShellStateMenuProps = Readonly<{
  isOpen: boolean;
  isSignedIn: boolean;
  pathname: string;
  onLoginSelect: (next: boolean) => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  labelledBy?: string;
}>;

export function ReviewShellStateMenu({
  isOpen,
  isSignedIn,
  pathname,
  onLoginSelect,
  onClose,
  triggerRef,
  labelledBy,
}: ReviewShellStateMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const optionCount = modeOptions.length + loginOptions.length;
  const activeModeIndex = modeOptions.findIndex(
    (option) => option.href === pathname,
  );
  const activeLoginIndex = loginOptions.findIndex(
    (option) => option.value === isSignedIn,
  );
  const focusIndex =
    activeModeIndex >= 0
      ? loginOptions.length + activeModeIndex
      : activeLoginIndex >= 0
        ? activeLoginIndex
        : 0;

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

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby={labelledBy}
      className="absolute left-0 top-full z-50 mt-2 min-w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.12),0_4px_14px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
    >
      <div
        role="group"
        aria-labelledby="review-shell-login-menu-heading"
        className="space-y-1"
      >
        <p
          id="review-shell-login-menu-heading"
          className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500"
        >
          Visitor
        </p>
        {loginOptions.map((option, index) => {
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
                onLoginSelect(option.value);
              }}
              onKeyDown={(event) => handleItemKeyDown(event, index)}
              className={[
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-medium tracking-[0.01em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20",
                isSelected
                  ? "bg-sky-50 text-sky-900"
                  : "text-slate-600 hover:bg-sky-50 hover:text-sky-900 focus-visible:bg-sky-50 focus-visible:text-sky-900",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "inline-flex size-4 shrink-0 items-center justify-center",
                  isSelected ? "text-sky-700" : "text-transparent",
                ].join(" ")}
              >
                <Icon name="check" size="small" />
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-labelledby="review-shell-mode-menu-heading"
        className="mt-2 space-y-1 border-t border-slate-200/70 pt-2"
      >
        <p
          id="review-shell-mode-menu-heading"
          className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500"
        >
          Mode
        </p>
        {modeOptions.map((option, optionIndex) => {
          const index = loginOptions.length + optionIndex;
          const isSelected = option.href === pathname;

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
              onKeyDown={(event) => handleItemKeyDown(event, index)}
              className={[
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-medium tracking-[0.01em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/20",
                isSelected
                  ? "bg-sky-50 text-sky-900"
                  : "text-slate-600 hover:bg-sky-50 hover:text-sky-900 focus-visible:bg-sky-50 focus-visible:text-sky-900",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={[
                  "inline-flex size-4 shrink-0 items-center justify-center",
                  isSelected ? "text-sky-700" : "text-transparent",
                ].join(" ")}
              >
                <Icon name="check" size="small" />
              </span>
              <span>{option.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
