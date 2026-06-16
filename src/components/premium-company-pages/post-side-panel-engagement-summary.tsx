import type { ReactNode } from "react";

import {
  SduiReactionIcon,
  type SduiReactionIconType,
} from "@/components/primitives/reaction-icon";

const defaultReactionTypes: ReadonlyArray<SduiReactionIconType> = [
  "like",
  "empathy",
  "interest",
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ReactionPile({
  reactionTypes = defaultReactionTypes,
}: Readonly<{ reactionTypes?: ReadonlyArray<SduiReactionIconType> }>) {
  return (
    <span className="flex items-center">
      {reactionTypes.map((reaction, index) => (
        <SduiReactionIcon
          className={index < reactionTypes.length - 1 ? "-mr-[4px]" : undefined}
          decorative
          key={`${reaction}-${index}`}
          ring
          size="xsmall"
          type={reaction}
        />
      ))}
    </span>
  );
}

export function PostSidePanelEngagementSummary({
  className,
  comments,
  reactions,
  reactionTypes,
  reposts,
}: Readonly<{
  className?: string;
  comments?: ReactNode;
  reactions: ReactNode;
  reactionTypes?: ReadonlyArray<SduiReactionIconType>;
  reposts?: ReactNode;
}>) {
  return (
    <div
      className={cx(
        "mt-xl border-t border-border-faint py-md text-left text-body-sm text-text-meta",
        className,
      )}
    >
      <span className="inline-flex min-w-0 flex-wrap items-center gap-xs">
        <ReactionPile reactionTypes={reactionTypes} />
        <span>{reactions}</span>
        {comments ? (
          <>
            <span aria-hidden="true">&middot;</span>
            <span>{comments}</span>
          </>
        ) : null}
        {reposts ? (
          <>
            <span aria-hidden="true">&middot;</span>
            <span>{reposts}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}
