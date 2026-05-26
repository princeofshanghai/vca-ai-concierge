import { useId, type HTMLAttributes, type ReactNode } from "react";

import { Button } from "@/components/primitives/button";

type IdleSessionPromptProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  description?: ReactNode;
  timeRemaining?: ReactNode;
  primaryActionLabel?: ReactNode;
  secondaryActionLabel?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function IdleSessionPrompt({
  title,
  description,
  timeRemaining,
  primaryActionLabel = "Continue",
  secondaryActionLabel = "End",
  onPrimaryAction,
  onSecondaryAction,
  className,
  ...props
}: IdleSessionPromptProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <div
      {...props}
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cx(
        "absolute inset-0 z-20 flex items-center justify-center bg-background/90 px-xxl py-xxxl text-center backdrop-blur-[2px]",
        className,
      )}
    >
      <div className="flex max-w-[23rem] flex-col items-center">
        <h2 id={titleId} className="mt-xl text-heading-md text-text">
          {title}
        </h2>
        {description ? (
          <p
            id={descriptionId}
            className="mt-xs max-w-[19rem] text-body-sm text-text-meta"
          >
            {description}
          </p>
        ) : null}
        {timeRemaining ? (
          <p className="mt-md text-control-sm text-text">{timeRemaining}</p>
        ) : null}

        <div className="mt-xxl flex w-full max-w-[12.5rem] flex-col gap-md">
          <Button type="button" onClick={onPrimaryAction} className="w-full">
            {primaryActionLabel}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onSecondaryAction}
            className="w-full"
          >
            {secondaryActionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
