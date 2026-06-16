import type { HTMLAttributes } from "react";

import { Prompt } from "@/components/chat/chat-ui";
import { Icon, type IconName } from "@/components/primitives/icon";

export type ChipPrompt =
  | string
  | Readonly<{
      label: string;
      leadingIcon?: IconName;
      prompt?: string;
    }>;

export type ChipsProps = HTMLAttributes<HTMLDivElement> & {
  prompts: ReadonlyArray<ChipPrompt>;
  onPromptSelect?: (prompt: string) => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getPromptLabel(prompt: ChipPrompt) {
  return typeof prompt === "string" ? prompt : prompt.label;
}

function getPromptValue(prompt: ChipPrompt) {
  return typeof prompt === "string" ? prompt : (prompt.prompt ?? prompt.label);
}

export function Chips({
  prompts,
  className,
  onPromptSelect,
  ...props
}: ChipsProps) {
  return (
    <div
      {...props}
      data-response-block="Chips"
      className={cx("flex flex-wrap items-start gap-md", className)}
    >
      {prompts.map((prompt) => (
        <Prompt
          key={getPromptValue(prompt)}
          onPromptSelect={onPromptSelect}
          prompt={getPromptValue(prompt)}
        >
          {typeof prompt === "string" ? (
            prompt
          ) : (
            <span className="inline-flex min-w-0 items-center gap-xs">
              {prompt.leadingIcon ? (
                <Icon
                  aria-hidden="true"
                  className="shrink-0 text-icon [&&]:size-3"
                  name={prompt.leadingIcon}
                  size="small"
                />
              ) : null}
              <span className="min-w-0">{getPromptLabel(prompt)}</span>
            </span>
          )}
        </Prompt>
      ))}
    </div>
  );
}
