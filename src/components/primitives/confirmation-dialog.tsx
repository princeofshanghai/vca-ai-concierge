"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/primitives/button";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";

export type ConfirmationDialogProps = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  scope?: "viewport" | "container";
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    .filter((element) => !element.hasAttribute("disabled"))
    .filter((element) => element.getAttribute("aria-hidden") !== "true");
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ConfirmationDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  scope = "viewport",
}: ConfirmationDialogProps) {
  const titleId = useId();
  const bodyId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousBodyOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus({ preventScroll: true });
    });

    if (scope === "viewport") {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.cancelAnimationFrame(focusFrame);
      if (scope === "viewport") {
        document.body.style.overflow = previousBodyOverflow;
      }
      previousFocusRef.current?.focus({ preventScroll: true });
    };
  }, [open, scope]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onCancel();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(dialogRef.current);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      event.preventDefault();
      dialogRef.current?.focus({ preventScroll: true });
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus({ preventScroll: true });
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus({ preventScroll: true });
    }
  }

  const dialog = (
    <div
      className={cx(
        "flex items-center justify-center p-lg motion-reduce:transition-none md:p-xxl",
        scope === "container" ? "absolute inset-0 z-10" : "fixed inset-0 z-50",
      )}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
        style={{
          width:
            "min(calc(100vw - 32px), var(--design-layout-confirmation-dialog-width, 336px))",
        }}
        className="overflow-hidden rounded-sm border border-border-faint bg-background text-text shadow-raised outline-none transition-[opacity,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:transition-none"
      >
        <header className="flex items-start gap-md border-b border-border-faint py-xs pl-xxl pr-xs">
          <div className="flex min-h-[48px] min-w-0 flex-1 items-center py-sm">
            <h2 id={titleId} className="m-0 text-heading-lg font-semibold">
              {title}
            </h2>
          </div>
          <GhostIconButton
            label="Dismiss confirmation"
            icon="close"
            size="medium"
            onClick={onCancel}
          />
        </header>

        <div id={bodyId} className="p-xxl text-body-sm-open">
          {children}
        </div>

        <footer className="flex items-center justify-end gap-sm border-t border-border-faint px-xxl py-lg">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            size="small"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button variant="primary" size="small" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </footer>
      </div>
    </div>
  );

  if (scope === "container") {
    return dialog;
  }

  return createPortal(dialog, document.body);
}
