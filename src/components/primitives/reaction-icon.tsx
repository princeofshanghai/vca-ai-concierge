import Image from "next/image";
import type { HTMLAttributes } from "react";

export const sduiReactionIconTypes = [
  "empathy",
  "entertainment",
  "interest",
  "like",
  "maybe",
  "praise",
  "support",
  "recommend",
] as const;

export const sduiReactionIconSizes = [
  "xsmall",
  "small",
  "medium",
  "large",
] as const;

export type SduiReactionIconType = (typeof sduiReactionIconTypes)[number];
export type SduiReactionIconSize = (typeof sduiReactionIconSizes)[number];

type ReactionIconAsset = Readonly<{
  default: string;
  ring?: string;
}>;

export type SduiReactionIconProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  decorative?: boolean;
  label?: string;
  ring?: boolean;
  size?: SduiReactionIconSize;
  type: SduiReactionIconType;
};

const assetRoot = "/assets/sdui/reactions";

const reactionIconAssets: Record<
  SduiReactionIconType,
  Partial<Record<SduiReactionIconSize, ReactionIconAsset>>
> = {
  empathy: {
    xsmall: {
      default: `${assetRoot}/empathy-xsmall.svg`,
      ring: `${assetRoot}/empathy-xsmall-ring.svg`,
    },
    small: {
      default: `${assetRoot}/empathy-small.svg`,
      ring: `${assetRoot}/empathy-small-ring.svg`,
    },
    medium: { default: `${assetRoot}/empathy-medium.svg` },
  },
  entertainment: {
    xsmall: {
      default: `${assetRoot}/entertainment-xsmall.svg`,
      ring: `${assetRoot}/entertainment-xsmall-ring.svg`,
    },
    small: {
      default: `${assetRoot}/entertainment-small.svg`,
      ring: `${assetRoot}/entertainment-small-ring.svg`,
    },
    medium: { default: `${assetRoot}/entertainment-medium.svg` },
  },
  interest: {
    xsmall: {
      default: `${assetRoot}/interest-xsmall.svg`,
      ring: `${assetRoot}/interest-xsmall-ring.svg`,
    },
    small: {
      default: `${assetRoot}/interest-small.svg`,
      ring: `${assetRoot}/interest-small-ring.svg`,
    },
    medium: { default: `${assetRoot}/interest-medium.svg` },
  },
  like: {
    xsmall: {
      default: `${assetRoot}/like-xsmall.svg`,
      ring: `${assetRoot}/like-xsmall-ring.svg`,
    },
    small: {
      default: `${assetRoot}/like-small.svg`,
      ring: `${assetRoot}/like-small-ring.svg`,
    },
    medium: { default: `${assetRoot}/like-medium.svg` },
    large: { default: `${assetRoot}/like-large.svg` },
  },
  maybe: {
    xsmall: {
      default: `${assetRoot}/maybe-xsmall.svg`,
      ring: `${assetRoot}/maybe-xsmall-ring.svg`,
    },
    small: {
      default: `${assetRoot}/maybe-small.svg`,
      ring: `${assetRoot}/maybe-small-ring.svg`,
    },
    medium: { default: `${assetRoot}/maybe-medium.svg` },
  },
  praise: {
    xsmall: {
      default: `${assetRoot}/praise-xsmall.svg`,
      ring: `${assetRoot}/praise-xsmall-ring.svg`,
    },
    small: {
      default: `${assetRoot}/praise-small.svg`,
      ring: `${assetRoot}/praise-small-ring.svg`,
    },
    medium: { default: `${assetRoot}/praise-medium.svg` },
  },
  recommend: {
    xsmall: {
      default: `${assetRoot}/recommend-xsmall.svg`,
      ring: `${assetRoot}/recommend-xsmall-ring.svg`,
    },
    small: {
      default: `${assetRoot}/recommend-small.svg`,
      ring: `${assetRoot}/recommend-small-ring.svg`,
    },
    medium: { default: `${assetRoot}/recommend-medium.svg` },
  },
  support: {
    xsmall: {
      default: `${assetRoot}/support-xsmall.svg`,
      ring: `${assetRoot}/support-xsmall-ring.svg`,
    },
    small: {
      default: `${assetRoot}/support-small.svg`,
      ring: `${assetRoot}/support-small-ring.svg`,
    },
    medium: { default: `${assetRoot}/support-medium.svg` },
  },
};

const sizeClasses: Record<SduiReactionIconSize, string> = {
  xsmall: "size-4",
  small: "size-6",
  medium: "size-12",
  large: "size-24",
};

const sizePixels: Record<SduiReactionIconSize, number> = {
  xsmall: 16,
  small: 24,
  medium: 48,
  large: 96,
};

const reactionIconLabels: Record<SduiReactionIconType, string> = {
  empathy: "Empathy",
  entertainment: "Entertainment",
  interest: "Interest",
  like: "Like",
  maybe: "Maybe",
  praise: "Praise",
  recommend: "Recommend",
  support: "Support",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function isSduiReactionIconAvailable({
  ring = false,
  size,
  type,
}: Readonly<{
  ring?: boolean;
  size: SduiReactionIconSize;
  type: SduiReactionIconType;
}>) {
  const asset = reactionIconAssets[type][size];

  return Boolean(asset && (!ring || asset.ring));
}

function getReactionIconAsset({
  ring = false,
  size,
  type,
}: Readonly<{
  ring?: boolean;
  size: SduiReactionIconSize;
  type: SduiReactionIconType;
}>) {
  const asset = reactionIconAssets[type][size];

  if (!asset) {
    return null;
  }

  return ring ? (asset.ring ?? null) : asset.default;
}

function getSizeClass({
  ring,
  size,
  type,
}: Readonly<{
  ring: boolean;
  size: SduiReactionIconSize;
  type: SduiReactionIconType;
}>) {
  if (type === "entertainment" && size === "small" && !ring) {
    return "size-[22px]";
  }

  return sizeClasses[size];
}

function getPixelSize({
  ring,
  size,
  type,
}: Readonly<{
  ring: boolean;
  size: SduiReactionIconSize;
  type: SduiReactionIconType;
}>) {
  if (type === "entertainment" && size === "small" && !ring) {
    return 22;
  }

  return sizePixels[size];
}

export function SduiReactionIcon({
  className,
  decorative = false,
  label,
  ring = false,
  size = "small",
  type,
  ...props
}: SduiReactionIconProps) {
  const src = getReactionIconAsset({ ring, size, type });

  if (!src) {
    return null;
  }

  const accessibleLabel =
    label ?? `${reactionIconLabels[type]} reaction icon`;
  const pixelSize = getPixelSize({ ring, size, type });

  return (
    <span
      {...props}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : accessibleLabel}
      data-ring={ring || undefined}
      data-size={size}
      data-type={type}
      role={decorative ? undefined : "img"}
      className={cx(
        "inline-flex shrink-0 items-center justify-center",
        getSizeClass({ ring, size, type }),
        className,
      )}
    >
      <Image
        alt=""
        aria-hidden="true"
        className="block size-full"
        draggable={false}
        height={pixelSize}
        src={src}
        width={pixelSize}
      />
    </span>
  );
}
