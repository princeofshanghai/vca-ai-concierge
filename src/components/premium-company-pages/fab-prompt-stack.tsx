"use client";

import type { CSSProperties } from "react";

import { Prompt } from "@/components/chat";

export type FabPromptStackItem<TValue extends string = string> = Readonly<{
  id: string;
  prompt: string;
  value: TValue;
}>;

type FabPromptStackProps<TValue extends string> = Readonly<{
  items: ReadonlyArray<FabPromptStackItem<TValue>>;
  onPromptSelect: (value: TValue) => void;
}>;

type PromptDelayStyle = CSSProperties & {
  "--pcp-fab-prompt-delay": string;
};

const FAB_PROMPT_STAGGER_MS = 22;

export function FabPromptStack<TValue extends string>({
  items,
  onPromptSelect,
}: FabPromptStackProps<TValue>) {
  return (
    <div className="pointer-events-none absolute bottom-full right-0 hidden flex-col items-end gap-sm pb-md group-hover:pointer-events-auto group-focus-within:pointer-events-auto [@media(hover:hover)_and_(pointer:fine)]:flex">
      {items.map((item, index) => {
        const bottomFirstDelay = (items.length - 1 - index) * FAB_PROMPT_STAGGER_MS;

        return (
          <div
            className="translate-y-xs opacity-0 [transition-delay:0ms] transition-[opacity,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:[transition-delay:var(--pcp-fab-prompt-delay)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:[transition-delay:var(--pcp-fab-prompt-delay)] motion-reduce:translate-y-0 motion-reduce:transition-none"
            key={item.id}
            style={{
              "--pcp-fab-prompt-delay": `${bottomFirstDelay}ms`,
            } as PromptDelayStyle}
          >
            <Prompt
              className="w-max max-w-[calc(100vw-3rem)] self-end !border-border-faint !bg-background !text-text shadow-raised-faint transition-[background-color,border-color,box-shadow] hover:!border-border hover:!bg-background-neutral-soft hover:!text-text-hover hover:!shadow-raised-soft active:!border-border-active active:!bg-background-neutral-soft active:!text-text-active active:!shadow-raised-faint [&>span]:whitespace-nowrap [&>span]:break-normal"
              onPromptSelect={() => onPromptSelect(item.value)}
              prompt={item.prompt}
              showNativeTooltip={false}
            />
          </div>
        );
      })}
    </div>
  );
}
