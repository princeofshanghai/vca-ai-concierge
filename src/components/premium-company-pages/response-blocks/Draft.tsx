import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Icon } from "@/components/primitives/icon";
import { TextArea } from "@/components/primitives/text-area";

export type DraftProps = HTMLAttributes<HTMLElement> & {
  recipient: ReactNode;
  message: string;
  actionLabel?: ReactNode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Draft({
  recipient,
  message,
  actionLabel = "Open drafted message",
  className,
  ...props
}: DraftProps) {
  return (
    <article
      {...props}
      data-response-block="Draft"
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-lg text-text shadow-raised-faint",
        className,
      )}
    >
      <div className="space-y-lg">
        <div className="flex items-center gap-sm">
          <span className="inline-flex size-8 items-center justify-center rounded-round bg-ai-background-soft text-ai-icon">
            <Icon name="send" size="small" />
          </span>
          <div className="min-w-0">
            <p className="text-body-sm font-semibold text-text">Drafted message</p>
            <p className="truncate text-body-xs text-text-meta">{recipient}</p>
          </div>
        </div>
        <TextArea
          aria-label="Drafted message preview"
          readOnly
          size="large"
          textareaClassName="text-body-sm-open"
          value={message}
        />
        <Button
          size="small"
          leadingIcon={<Icon name="envelope-open" size="small" />}
        >
          {actionLabel}
        </Button>
      </div>
    </article>
  );
}
