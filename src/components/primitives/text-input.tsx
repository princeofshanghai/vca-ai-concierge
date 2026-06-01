"use client";

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import type { IconName } from "@/components/primitives/icon";

export type TextInputSize = "small" | "large";
export type TextInputVisualState = "default" | "hover" | "active";

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "className"
> & {
  className?: string;
  inputClassName?: string;
  label: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  error?: boolean;
  counter?: boolean | ReactNode;
  size?: TextInputSize;
  trailingIcon?: IconName | null;
  trailingActionLabel?: string;
  onTrailingAction?: () => void;
  visualState?: TextInputVisualState;
};

const fieldSizeClasses: Record<TextInputSize, string> = {
  small: "h-[var(--design-layout-input-small-height)] px-xs text-body-sm",
  large: "h-[var(--design-layout-input-large-height)] px-md text-body-md",
};

const iconButtonSizeByInputSize: Record<TextInputSize, "small" | "medium"> = {
  small: "small",
  large: "medium",
};

const staticFieldStateClasses: Partial<
  Record<Exclude<TextInputVisualState, "default">, string>
> = {
  hover: "border-border-hover",
  active: "border-border-active",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getInputValueLength(value: unknown) {
  if (value === null || value === undefined) {
    return 0;
  }

  if (Array.isArray(value)) {
    return value.join("").length;
  }

  return String(value).length;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      className,
      inputClassName,
      id,
      label,
      helperText,
      errorText,
      error = false,
      counter = false,
      size = "small",
      trailingIcon = null,
      trailingActionLabel = "Text input action",
      onTrailingAction,
      visualState = "default",
      disabled = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      required,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const counterId = `${inputId}-counter`;
    const isInvalid = error || Boolean(errorText);
    const isControlled = value !== undefined;
    const resolvedMaxLength = maxLength ?? (counter === true ? 200 : undefined);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const valueLength = getInputValueLength(
      isControlled ? value : uncontrolledValue,
    );
    const counterContent =
      typeof counter === "boolean"
        ? `${valueLength}/${resolvedMaxLength ?? 200}`
        : counter;
    const statusText = isInvalid ? errorText : helperText;
    const hasStatusText = Boolean(statusText);
    const hasCounter = Boolean(counter);
    const describedBy = [
      ariaDescribedBy,
      hasStatusText ? messageId : undefined,
      hasCounter ? counterId : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      if (!isControlled) {
        setUncontrolledValue(event.currentTarget.value);
      }

      onChange?.(event);
    }

    return (
      <div
        className={cx("flex w-full flex-col gap-xxs font-sans", className)}
      >
        <label
          htmlFor={inputId}
          className={cx(
            "text-body-xs text-label",
            disabled && "text-label-disabled",
          )}
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="text-negative">
              *
            </span>
          ) : null}
        </label>

        <div
          className={cx(
            "flex w-full items-center rounded-xs border bg-background transition-[background-color,border-color] duration-150 ease-out",
            fieldSizeClasses[size],
            disabled
              ? "border-transparent bg-background-disabled text-text-disabled"
              : isInvalid
                ? "border-negative text-text hover:border-negative-hover active:border-negative-active focus-within:border-negative-active focus-within:hover:border-negative-active"
                : "border-border text-text hover:border-border-hover active:border-border-active focus-within:border-border-active focus-within:hover:border-border-active",
            !disabled &&
              !isInvalid &&
              visualState !== "default" &&
              staticFieldStateClasses[visualState],
          )}
        >
          <input
            {...props}
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            disabled={disabled}
            maxLength={resolvedMaxLength}
            required={required}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy || undefined}
            className={cx(
              "h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-inherit outline-none placeholder:text-text-disabled",
              inputClassName,
            )}
          />

          {trailingIcon ? (
            <GhostIconButton
              icon={trailingIcon}
              label={trailingActionLabel}
              size={iconButtonSizeByInputSize[size]}
              disabled={disabled}
              horizontalPadding={false}
              className={cx(
                "h-full text-icon hover:text-icon-hover active:text-icon-active",
                disabled && "text-icon-disabled",
              )}
              onClick={onTrailingAction}
              tabIndex={onTrailingAction ? undefined : -1}
            />
          ) : null}
        </div>

        {(hasStatusText || hasCounter) && (
          <div className="flex min-h-[15px] items-start justify-between gap-md text-supportive-s">
            <p
              id={hasStatusText ? messageId : undefined}
              className={cx(
                "min-w-0 flex-1",
                disabled
                  ? "text-text-disabled"
                  : isInvalid
                    ? "text-negative"
                    : "text-text-meta",
              )}
            >
              {statusText}
            </p>

            {hasCounter ? (
              <p
                id={counterId}
                className={cx(
                  "shrink-0 text-right",
                  disabled
                    ? "text-text-disabled"
                    : isInvalid
                      ? "text-supportive-s-strong text-negative"
                      : "text-text-meta",
                )}
              >
                {counterContent}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
