"use client";

import {
  useCallback,
  useEffect,
  useMemo,
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
  prefersReducedMotion,
  useChatAssistantStream,
  type ChatMessageStreamStatus,
} from "@/components/chat/chat-motion";
import type { ChatResponseFeedbackPolicy } from "@/components/chat/chat-response";

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
  feedbackPolicy?: ChatResponseFeedbackPolicy;
  timestamp?: string;
}>;

const ATTACHMENT_REVEAL_STAGGER_MS = 120;
const completedResponseTurnKeys = new Set<string>();

type ScriptedPendingResponse = Readonly<{
  id: string;
  text: string;
}>;

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
  feedbackPolicy = "none",
  timestamp,
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
  const [isStopped, setIsStopped] = useState(false);
  const isBusy =
    shouldAnimateResponse &&
    !isStopped &&
    (streamStatus === "thinking" || streamStatus === "streaming");
  const streamResponse = useMemo<ScriptedPendingResponse>(
    () => ({ id: responseKey, text }),
    [responseKey, text],
  );
  const pendingResponse =
    shouldAnimateResponse && !isStopped && streamStatus !== "complete"
      ? streamResponse
      : null;

  const handleStreamStart = useCallback(() => {
    setStreamStatus("streaming");
    setStreamText("");
  }, []);

  const handleStreamText = useCallback(
    (_response: ScriptedPendingResponse, visibleText: string) => {
      setStreamText(visibleText);
    },
    [],
  );

  const handleStreamComplete = useCallback(() => {
    setStreamStatus("complete");
    setStreamText(text);
    completedResponseTurnKeys.add(responseKey);
  }, [responseKey, text]);

  useChatAssistantStream({
    pendingResponse,
    onStreamStart: handleStreamStart,
    onStreamText: handleStreamText,
    onComplete: handleStreamComplete,
  });

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
    }, 0);

    return () => {
      window.clearTimeout(stopTimer);
    };
  }, [isBusy, stopSignal]);

  useEffect(() => {
    onContentChange?.();
  }, [
    isStopped,
    onContentChange,
    streamStatus,
    streamText,
  ]);

  useEffect(() => {
    onBusyChange?.(id, isBusy);

    return () => {
      onBusyChange?.(id, false);
    };
  }, [id, isBusy, onBusyChange]);

  const displayedText =
    streamStatus === "streaming" || isStopped ? streamText : text;
  const textNode =
    renderText?.({
      text: displayedText,
      fullText: text,
      streamStatus,
      streamText,
    }) ?? (
      <ResponseText
        className={shouldAnimateResponse ? undefined : "chat-message-enter"}
        streamStatus={streamStatus}
        streamText={streamText}
      >
        {displayedText}
      </ResponseText>
    );

  return (
    <ChatResponseBlock
      feedbackPolicy={
        streamStatus === "complete" && !isStopped ? feedbackPolicy : "none"
      }
      timestamp={streamStatus === "complete" ? timestamp : undefined}
    >
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
      {!isStopped && streamStatus === "complete"
        ? attachments.map((attachment, index) => (
            <ChatResponseAttachment
              gap={attachment.gap ?? "sm"}
              key={attachment.id}
              style={{
                animationDelay: prefersReducedMotion()
                  ? "0ms"
                  : `${index * ATTACHMENT_REVEAL_STAGGER_MS}ms`,
              }}
            >
              {attachment.children}
            </ChatResponseAttachment>
          ))
        : null}
    </ChatResponseBlock>
  );
}
