import type { HTMLAttributes, ReactNode } from "react";

import {
  CHAT_ASSISTANT_STREAM_WORD_FADE_MS,
  splitIntoStreamChunks,
  type ChatMessageStreamStatus,
} from "@/components/chat";

type TextTone = "default" | "insight";

export type TextRecommendationItem = Readonly<{
  action: ReactNode;
  reason?: ReactNode;
}>;

export type TextProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  streamStatus?: ChatMessageStreamStatus;
  streamText?: string;
  tone?: TextTone;
};

export type TextRecommendationListProps = HTMLAttributes<HTMLOListElement> & {
  items: ReadonlyArray<TextRecommendationItem>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Text({
  children,
  tone = "default",
  streamStatus,
  streamText,
  className,
  ...props
}: TextProps) {
  return (
    <div
      {...props}
      data-response-block="Text"
      data-tone={tone}
      className={cx(
        "max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] break-words pr-sm text-body-sm-open text-text",
        className,
      )}
    >
      {streamStatus === "streaming" && streamText !== undefined ? (
        <StreamingText text={streamText} />
      ) : (
        children
      )}
    </div>
  );
}

export function StreamingText({ text }: Readonly<{ text: string }>) {
  return (
    <>
      {splitIntoStreamChunks(text).map((chunk, index) => (
        <span
          className="chat-stream-word"
          key={index}
          style={{
            animationDuration: `${CHAT_ASSISTANT_STREAM_WORD_FADE_MS}ms`,
          }}
        >
          {chunk}
        </span>
      ))}
    </>
  );
}

export function TextRecommendationList({
  items,
  className,
  ...props
}: TextRecommendationListProps) {
  return (
    <ol
      {...props}
      className={cx("mt-md list-decimal space-y-sm pl-xl", className)}
    >
      {items.map(({ action, reason }, index) => (
        <li className="pl-xs" key={`${String(action)}-${index}`}>
          <strong className="font-semibold text-text">{action}</strong>
          {reason ? <span> — {reason}</span> : null}
        </li>
      ))}
    </ol>
  );
}
