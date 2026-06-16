"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  ChatInlineFeedback,
  ChatResponseAttachment,
  ChatResponseBlock,
  ChatThinkingMessage,
} from "@/components/chat/chat-ui";
import {
  CHAT_ASSISTANT_THINKING_DELAY_MS,
  prefersReducedMotion,
  type ChatMessageStreamStatus,
} from "@/components/chat/chat-motion";

import { Text as ResponseText } from "./response-blocks/Text";

export type ScriptedResponseAttachment = Readonly<{
  id: string;
  children: ReactNode;
  gap?: "sm" | "md";
}>;

export type ScriptedResponseTurnProps = Readonly<{
  id: string;
  text: string;
  attachments?: ReadonlyArray<ScriptedResponseAttachment>;
  renderText?: (options: {
    text: string;
    fullText: string;
    streamStatus: ChatMessageStreamStatus;
    streamText: string;
  }) => ReactNode;
  onContentChange?: () => void;
  onBusyChange?: (id: string, isBusy: boolean) => void;
  stopSignal?: number;
  animate?: boolean;
}>;

const ATTACHMENT_REVEAL_INTERVAL_MS = 220;
const completedResponseTurnKeys = new Set<string>();

export function ScriptedResponseTurn({
  id,
  text,
  attachments = [],
  animate = true,
  ...props
}: ScriptedResponseTurnProps) {
  const turnKey = `${id}\u0000${text}`;

  return (
    <ScriptedResponseTurnContent
      {...props}
      animate={animate}
      attachments={attachments}
      id={id}
      key={turnKey}
      text={text}
    />
  );
}

type ScriptedResponseTurnContentProps = Omit<
  ScriptedResponseTurnProps,
  "animate" | "attachments"
> &
  Readonly<{
    animate: boolean;
    attachments: ReadonlyArray<ScriptedResponseAttachment>;
  }>;

function ScriptedResponseTurnContent({
  id,
  text,
  attachments,
  renderText,
  onContentChange,
  onBusyChange,
  stopSignal = 0,
  animate,
}: ScriptedResponseTurnContentProps) {
  const responseKey = `${id}\u0000${text}`;
  const [shouldAnimateResponse] = useState(
    () => animate && !completedResponseTurnKeys.has(responseKey),
  );
  const [streamStatus, setStreamStatus] =
    useState<ChatMessageStreamStatus>(() =>
      shouldAnimateResponse ? "thinking" : "complete",
    );
  const [streamText, setStreamText] = useState(() =>
    shouldAnimateResponse ? "" : text,
  );
  const [visibleAttachmentCount, setVisibleAttachmentCount] = useState(() =>
    shouldAnimateResponse ? 0 : attachments.length,
  );
  const [isStopped, setIsStopped] = useState(false);
  const attachmentCount = attachments.length;
  const renderedAttachmentCount = shouldAnimateResponse
    ? Math.min(visibleAttachmentCount, attachmentCount)
    : attachmentCount;
  const isBusy =
    shouldAnimateResponse &&
    !isStopped &&
    (streamStatus === "thinking" || renderedAttachmentCount < attachmentCount);

  useEffect(() => {
    if (!shouldAnimateResponse || streamStatus !== "thinking") {
      return;
    }

    const revealDelay = prefersReducedMotion()
      ? 0
      : CHAT_ASSISTANT_THINKING_DELAY_MS;
    const revealTimer = window.setTimeout(() => {
      setStreamStatus("complete");
      setStreamText(text);
      completedResponseTurnKeys.add(responseKey);
    }, revealDelay);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, [responseKey, shouldAnimateResponse, streamStatus, text]);

  useEffect(() => {
    if (streamStatus !== "complete" || isStopped) {
      return;
    }

    completedResponseTurnKeys.add(responseKey);
  }, [isStopped, responseKey, streamStatus]);

  useEffect(() => {
    if (stopSignal === 0 || !isBusy) {
      return;
    }

    const stopTimer = window.setTimeout(() => {
      setIsStopped(true);
      setStreamStatus("complete");
      setVisibleAttachmentCount(0);
    }, 0);

    return () => {
      window.clearTimeout(stopTimer);
    };
  }, [isBusy, stopSignal]);

  useEffect(() => {
    if (!shouldAnimateResponse || streamStatus !== "complete" || isStopped) {
      return;
    }

    if (renderedAttachmentCount >= attachmentCount) {
      return;
    }

    const revealDelay = prefersReducedMotion()
      ? 0
      : ATTACHMENT_REVEAL_INTERVAL_MS;
    const nextAttachmentCount = renderedAttachmentCount + 1;
    const timer = window.setTimeout(() => {
      setVisibleAttachmentCount((currentCount) =>
        Math.min(attachmentCount, Math.max(currentCount, nextAttachmentCount)),
      );
    }, revealDelay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    attachmentCount,
    isStopped,
    renderedAttachmentCount,
    shouldAnimateResponse,
    streamStatus,
  ]);

  useEffect(() => {
    onContentChange?.();
  }, [
    isStopped,
    onContentChange,
    renderedAttachmentCount,
    streamStatus,
    streamText,
  ]);

  useEffect(() => {
    onBusyChange?.(id, isBusy);

    return () => {
      onBusyChange?.(id, false);
    };
  }, [id, isBusy, onBusyChange]);

  const displayedText = isStopped ? streamText : text;
  const textNode =
    renderText?.({
      text: displayedText,
      fullText: text,
      streamStatus,
      streamText,
    }) ?? (
      <ResponseText
        className="chat-message-enter"
        streamStatus={streamStatus}
        streamText={streamText}
      >
        {displayedText}
      </ResponseText>
    );

  return (
    <ChatResponseBlock>
      {streamStatus === "thinking" ? (
        <ChatThinkingMessage />
      ) : isStopped && displayedText.trim().length === 0 ? (
        <ChatInlineFeedback tone="neutral">Response stopped.</ChatInlineFeedback>
      ) : (
        textNode
      )}
      {isStopped && displayedText.trim().length > 0 ? (
        <ChatResponseAttachment gap="sm">
          <ChatInlineFeedback tone="neutral">Response stopped.</ChatInlineFeedback>
        </ChatResponseAttachment>
      ) : null}
      {attachments.slice(0, renderedAttachmentCount).map((attachment) => (
        <ChatResponseAttachment
          gap={attachment.gap ?? "sm"}
          key={attachment.id}
        >
          {attachment.children}
        </ChatResponseAttachment>
      ))}
    </ChatResponseBlock>
  );
}
