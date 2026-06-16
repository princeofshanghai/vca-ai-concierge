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

export function ScriptedResponseTurn({
  id,
  text,
  attachments = [],
  animate = true,
  ...props
}: ScriptedResponseTurnProps) {
  const turnKey = `${id}\u0000${text}\u0000${animate ? "animated" : "static"}`;

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
  const [pendingResponse, setPendingResponse] =
    useState<ScriptedAssistantResponse | null>(() =>
      animate ? { id, text } : null,
    );
  const [streamStatus, setStreamStatus] =
    useState<ChatMessageStreamStatus>(() =>
      animate ? "thinking" : "complete",
    );
  const [streamText, setStreamText] = useState(() => (animate ? "" : text));
  const [visibleAttachmentCount, setVisibleAttachmentCount] = useState(() =>
    animate ? 0 : attachments.length,
  );
  const [isStopped, setIsStopped] = useState(false);
  const attachmentCount = attachments.length;
  const renderedAttachmentCount = animate
    ? Math.min(visibleAttachmentCount, attachmentCount)
    : attachmentCount;
  const streamPendingResponse = animate ? pendingResponse : null;
  const isBusy =
    animate &&
    !isStopped &&
    (pendingResponse !== null ||
      streamStatus === "thinking" ||
      streamStatus === "streaming" ||
      renderedAttachmentCount < attachmentCount);

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
    pendingResponse: streamPendingResponse,
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
    if (!animate || streamStatus !== "complete" || isStopped) {
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
    animate,
    attachmentCount,
    isStopped,
    renderedAttachmentCount,
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

  const displayedText =
    isStopped || streamStatus === "streaming" ? streamText : text;
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
