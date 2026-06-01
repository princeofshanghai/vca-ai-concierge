"use client";

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

export type TextAreaSize = "small" | "large";
export type TextAreaVisualState = "default" | "hover" | "active";

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> & {
  className?: string;
  textareaClassName?: string;
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  error?: boolean;
  counter?: boolean | ReactNode;
  size?: TextAreaSize;
  visualState?: TextAreaVisualState;
};

const textareaSizeClasses: Record<TextAreaSize, string> = {
  small:
    "min-h-[calc(var(--design-layout-input-large-height)+var(--design-spacing-lg))] px-xs py-xs text-body-sm-open",
  large:
    "min-h-[calc(var(--design-layout-input-large-height)+var(--design-spacing-xxxl)+var(--design-spacing-xxxl))] px-md py-md text-body-md-open",
};

const staticFieldStateClasses: Partial<
  Record<Exclude<TextAreaVisualState, "default">, string>
> = {
  hover: "border-border-hover",
  active: "border-border-active",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getTextAreaValueLength(value: unknown) {
  if (value === null || value === undefined) {
    return 0;
  }

  if (Array.isArray(value)) {
    return value.join("").length;
  }

  return String(value).length;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      className,
      textareaClassName,
      id,
      label,
      helperText,
      errorText,
      error = false,
      counter = false,
      size = "small",
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
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;
    const counterId = `${textareaId}-counter`;
    const isInvalid = error || Boolean(errorText);
    const isControlled = value !== undefined;
    const resolvedMaxLength = maxLength ?? (counter === true ? 200 : undefined);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const valueLength = getTextAreaValueLength(
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

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
      if (!isControlled) {
        setUncontrolledValue(event.currentTarget.value);
      }

      onChange?.(event);
    }

    return (
      <div className={cx("flex w-full flex-col gap-xxs font-sans", className)}>
        {label ? (
          <label
            htmlFor={textareaId}
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
        ) : null}

        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          maxLength={resolvedMaxLength}
          required={required}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy || undefined}
          className={cx(
            "w-full resize-none rounded-xs border bg-background text-text outline-none transition-[background-color,border-color] duration-150 ease-out placeholder:text-text-disabled",
            textareaSizeClasses[size],
            disabled
              ? "border-transparent bg-background-disabled text-text-disabled"
              : isInvalid
                ? "border-negative hover:border-negative-hover active:border-negative-active focus:border-negative-active"
                : "border-border hover:border-border-hover active:border-border-active focus:border-border-active",
            !disabled &&
              !isInvalid &&
              visualState !== "default" &&
              staticFieldStateClasses[visualState],
            textareaClassName,
          )}
        />

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

TextArea.displayName = "TextArea";
