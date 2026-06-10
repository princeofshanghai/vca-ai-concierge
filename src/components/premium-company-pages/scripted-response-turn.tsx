"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  ChatInlineFeedback,
  ChatResponseAttachment,
  ChatResponseBlock,
  ChatThinkingMessage,
  prefersReducedMotion,
  useChatAssistantStream,
  type ChatMessageStreamStatus,
} from "@/components/chat";

import { Text as ResponseText } from "./response-blocks";

type ScriptedAssistantResponse = Readonly<{
  id: string;
  text: string;
}>;

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
    streamStatus: ChatMessageStreamStatus;
    streamText: string;
  }) => ReactNode;
  onContentChange?: () => void;
  onBusyChange?: (id: string, isBusy: boolean) => void;
  stopSignal?: number;
}>;

const ATTACHMENT_REVEAL_INTERVAL_MS = 220;

export function ScriptedResponseTurn({
  id,
  text,
  attachments = [],
  renderText,
  onContentChange,
  onBusyChange,
  stopSignal = 0,
}: ScriptedResponseTurnProps) {
  const [pendingResponse, setPendingResponse] =
    useState<ScriptedAssistantResponse | null>(() => ({ id, text }));
  const [streamStatus, setStreamStatus] =
    useState<ChatMessageStreamStatus>("thinking");
  const [streamText, setStreamText] = useState("");
  const [visibleAttachmentCount, setVisibleAttachmentCount] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const attachmentCount = attachments.length;
  const isBusy =
    !isStopped &&
    (pendingResponse !== null ||
      streamStatus === "thinking" ||
      streamStatus === "streaming" ||
      visibleAttachmentCount < attachmentCount);

  const handleStreamStart = useCallback(() => {
    setStreamStatus("streaming");
    setStreamText("");
  }, []);

  const handleStreamText = useCallback(
    (_response: ScriptedAssistantResponse, visibleText: string) => {
      setStreamText(visibleText);
    },
    [],
  );

  const handleComplete = useCallback(
    (response: ScriptedAssistantResponse) => {
      setPendingResponse(null);
      setStreamStatus("complete");
      setStreamText(response.text);
    },
    [],
  );

  useChatAssistantStream({
    pendingResponse,
    onStreamStart: handleStreamStart,
    onStreamText: handleStreamText,
    onComplete: handleComplete,
  });

  useEffect(() => {
    if (stopSignal === 0 || !isBusy) {
      return;
    }

    const stopTimer = window.setTimeout(() => {
      setPendingResponse(null);
      setIsStopped(true);
      setStreamStatus("complete");
      setVisibleAttachmentCount(0);
    }, 0);

    return () => {
      window.clearTimeout(stopTimer);
    };
  }, [isBusy, stopSignal]);

  useEffect(() => {
    if (streamStatus !== "complete" || isStopped) {
      return;
    }

    if (attachmentCount === 0) {
      return;
    }

    const revealInterval = prefersReducedMotion()
      ? 0
      : ATTACHMENT_REVEAL_INTERVAL_MS;
    const timers = Array.from({ length: attachmentCount }, (_, index) =>
      window.setTimeout(() => {
        setVisibleAttachmentCount((currentCount) =>
          Math.max(currentCount, index + 1),
        );
      }, revealInterval * (index + 1)),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [attachmentCount, isStopped, streamStatus]);

  useEffect(() => {
    onContentChange?.();
  }, [isStopped, onContentChange, streamStatus, streamText, visibleAttachmentCount]);

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
      {attachments.slice(0, visibleAttachmentCount).map((attachment) => (
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
