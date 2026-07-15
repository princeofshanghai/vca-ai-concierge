import {
  SduiReactionIcon,
  type SduiReactionIconType,
} from "@/components/primitives/reaction-icon";

export const DEFAULT_REACTION_TYPES: ReadonlyArray<SduiReactionIconType> = [
  "like",
  "empathy",
  "interest",
];

export function ReactionPile({
  reactionTypes = DEFAULT_REACTION_TYPES,
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
