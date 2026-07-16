"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon } from "@/components/primitives/icon";
import { ProgressIndicatorCircular } from "@/components/primitives/progress-indicator-circular";

import { ChatMessage } from "./chat-ui";

export type LiveAgentHandoffState =
  | "available"
  | "connecting"
  | "delayed"
  | "connected"
  | "unavailable"
  | "failed";

export type LiveAgentHandoffAgent = Readonly<{
  name: string;
  role: string;
  timestamp: string;
  avatarSrc?: string;
  avatarLabel?: string;
}>;

export type LiveAgentHandoffStateContent = Readonly<{
  title: ReactNode;
  description?: ReactNode;
  actionLabel?: ReactNode;
}>;

export type LiveAgentHandoffContent = Readonly<
  Record<
    Exclude<LiveAgentHandoffState, "delayed">,
    LiveAgentHandoffStateContent
  > & {
    delayed?: LiveAgentHandoffStateContent;
  }
>;

export type LiveAgentHandoffProps = Readonly<{
  state: LiveAgentHandoffState;
  agent: LiveAgentHandoffAgent;
  content: LiveAgentHandoffContent;
  connectedMessage: ReactNode;
  onAction?: () => void;
}>;

export function ChatSystemEvent({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <p className="chat-message-enter text-center text-body-xs text-text-meta">
      {children}
    </p>
  );
}

export function LiveAgentHandoff({
  state,
  agent,
  content,
  connectedMessage,
  onAction,
}: LiveAgentHandoffProps) {
  const stateContent =
    state === "delayed"
      ? (content.delayed ?? content.connecting)
      : content[state];
  const isConnecting = state === "connecting" || state === "delayed";
  const showsAction =
    state === "available" ||
    state === "delayed" ||
    state === "unavailable" ||
    state === "failed";

  return (
    <>
      <article
        role={state === "available" ? undefined : "status"}
        aria-live={state === "available" ? undefined : "polite"}
        className="chat-message-enter flex w-full max-w-[21.5rem] flex-col gap-lg rounded-md border border-ai-border bg-background p-xl pr-md text-text"
      >
        {state === "available" ? (
          <Entity
            size={40}
            src={agent.avatarSrc}
            label={agent.avatarLabel ?? `${agent.name}, ${agent.role}`}
          />
        ) : null}

        <div
          className={
            isConnecting || state === "connected"
              ? "flex items-center gap-md"
              : "space-y-xs"
          }
        >
          {isConnecting ? (
            <ProgressIndicatorCircular
              aria-label="Connecting"
              size={20}
              type="indeterminate"
            />
          ) : null}
          {state === "connected" ? (
            <span
              aria-hidden="true"
              className="inline-flex size-6 shrink-0 items-center justify-center text-checked [&_svg]:size-6"
            >
              <Icon name="signal-success" size="medium" />
            </span>
          ) : null}
          <div className="space-y-xs">
            <h2 className="text-heading-md">{stateContent.title}</h2>
            {stateContent.description ? (
              <p className="text-body-sm-open text-text-meta">
                {stateContent.description}
              </p>
            ) : null}
          </div>
        </div>

        {showsAction && stateContent.actionLabel ? (
          <Button
            size="small"
            className="w-fit px-pill-padding-inline"
            onClick={onAction}
          >
            {stateContent.actionLabel}
          </Button>
        ) : null}
      </article>

      {state === "connected" ? (
        <div className="flex flex-col gap-lg">
          <ChatSystemEvent>
            {agent.name} joined the chat · {agent.timestamp}
          </ChatSystemEvent>
          <ChatMessage
            role="representative"
            authorName={agent.name}
            avatarSrc={agent.avatarSrc}
            avatarLabel={agent.avatarLabel ?? `${agent.name}, ${agent.role}`}
            timestamp={agent.timestamp}
          >
            {connectedMessage}
          </ChatMessage>
        </div>
      ) : null}
    </>
  );
}
