import type { HTMLAttributes } from "react";

import { Prompt } from "@/components/chat";

export type ChipsProps = HTMLAttributes<HTMLDivElement> & {
  prompts: ReadonlyArray<string>;
  onPromptSelect?: (prompt: string) => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
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
      className={cx("flex flex-wrap items-start gap-sm", className)}
    >
      {prompts.map((prompt) => (
        <Prompt
          key={prompt}
          onPromptSelect={onPromptSelect}
          prompt={prompt}
        >
          {prompt}
        </Prompt>
      ))}
    </div>
  );
}
