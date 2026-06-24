import type { HTMLAttributes, ReactNode } from "react";

import { Icon } from "@/components/primitives/icon";

export type TaskStatusCardState = "in-progress" | "completed";

export type TaskStatusCardProps = HTMLAttributes<HTMLElement> & {
  description?: ReactNode;
  progressValue?: number;
  state?: TaskStatusCardState;
  title: ReactNode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clampProgressValue(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function TaskStatusCard({
  className,
  description,
  progressValue = 100,
  state = "in-progress",
  title,
  ...props
}: TaskStatusCardProps) {
  const isCompleted = state === "completed";

  return (
    <article
      {...props}
      data-response-block="TaskStatusCard"
      data-state={state}
      className={cx(
        "relative w-full max-w-[var(--design-layout-panel-content-max)] overflow-hidden rounded-md border border-ai-border bg-background text-left text-text shadow-raised-faint",
        className,
      )}
    >
      <div className="flex items-start gap-md p-xl">
        {isCompleted ? (
          <Icon
            name="signal-success"
            size="medium"
            aria-hidden="true"
            className="mt-[-1px] shrink-0 text-entity-ghost-dark [&&]:size-6"
          />
        ) : null}
        <div className="min-w-0">
          <h3 className="text-control-sm tracking-normal text-text">
            {title}
          </h3>
          {description ? (
            <div className="mt-sm text-body-sm text-text [&_a]:font-semibold [&_a]:text-action [&_a]:hover:text-action-hover">
              {description}
            </div>
          ) : null}
        </div>
      </div>
      {!isCompleted ? (
        <div
          aria-hidden="true"
          className="h-1 w-full bg-ai-background-strong"
        >
          <div
            className="task-status-card__progress-bar h-full origin-left bg-action"
            style={{ width: `${clampProgressValue(progressValue)}%` }}
          />
        </div>
      ) : null}
    </article>
  );
}
