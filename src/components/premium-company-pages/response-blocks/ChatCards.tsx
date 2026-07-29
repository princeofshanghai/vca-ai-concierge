import Image from "next/image";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { Icon, type IconName } from "@/components/primitives/icon";
import {
  SduiReactionIcon,
  type SduiReactionIconType,
} from "@/components/primitives/reaction-icon";
import { Tag, type TagTone } from "@/components/primitives/tag";

type ChatCardButtonVariant = "primary" | "secondary" | "tertiary";
type ChatCardButtonSize = "small" | "medium";

export type ChatCardAction = Readonly<{
  icon?: IconName;
  label: ReactNode;
  onSelect?: () => void;
  size?: ChatCardButtonSize;
  trailingIcon?: IconName;
  variant?: ChatCardButtonVariant;
}>;

export type ChatCardShellProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onSelect"
>;

export type ChatCardMediaProps = {
  alt?: string;
  aspectClassName?: string;
  className?: string;
  fullBleed?: boolean;
  placeholderLabel?: string;
  src?: string;
};

export type ReactionSummaryProps = {
  className?: string;
  comments?: ReactNode;
  reactions?: ReactNode;
  reactionTypes?: ReadonlyArray<SduiReactionIconType>;
  reposts?: ReactNode;
};

export type ChatCardActionsProps = {
  actions?: ReadonlyArray<ChatCardAction>;
  className?: string;
};

export type ProductCardProps = ChatCardShellProps & {
  actions?: ReadonlyArray<ChatCardAction>;
  body: ReactNode;
  imageAlt?: string;
  imageSrc?: string;
  title: ReactNode;
  type: ReactNode;
};

export type PostCardPresentation = "default" | "evidence";

export type PostCardProps = ChatCardShellProps & {
  actions?: ReadonlyArray<ChatCardAction>;
  authorLogoClassName?: string;
  authorLogoSrc?: string;
  authorLogoStyle?: CSSProperties;
  authorName: ReactNode;
  comments?: ReactNode;
  followerCount?: ReactNode;
  imageAlt?: string;
  imageSrc?: string;
  linkMeta?: ReactNode;
  linkTitle?: ReactNode;
  reactions?: ReactNode;
  reactionTypes?: ReadonlyArray<SduiReactionIconType>;
  reposts?: ReactNode;
  presentation?: PostCardPresentation;
  snippet: ReactNode;
  tag?: ReactNode;
  tagDetail?: ReactNode;
  tagTone?: TagTone;
  timestamp?: ReactNode;
};

export type JobCardProps = ChatCardShellProps & {
  actions?: ReadonlyArray<ChatCardAction>;
  alumni?: ReactNode;
  alumniImageSrc?: string;
  company: ReactNode;
  location?: ReactNode;
  logoClassName?: string;
  logoSrc?: string;
  logoStyle?: CSSProperties;
  timestamp?: ReactNode;
  title: ReactNode;
};

const defaultReactionTypes: ReadonlyArray<SduiReactionIconType> = [
  "like",
  "empathy",
  "interest",
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ChatCardShell({
  children,
  className,
  ...props
}: ChatCardShellProps) {
  return (
    <article
      data-response-block="ChatCardShell"
      {...props}
      className={cx(
        "chat-message-enter w-[var(--response-entity-card-width,100%)] max-w-[min(100%,var(--design-layout-chat-message-assistant-max))] overflow-hidden rounded-sm border border-ai-border bg-background text-left text-text shadow-raised-faint",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function ChatCardMedia({
  alt = "",
  aspectClassName = "aspect-[16/7]",
  className,
  fullBleed = false,
  placeholderLabel = "Media preview",
  src,
}: ChatCardMediaProps) {
  const mediaClassName = cx(
    aspectClassName,
    "w-full object-cover",
    fullBleed ? "" : "rounded-sm",
    className,
  );

  if (src) {
    return (
      <Image
        alt={alt}
        className={mediaClassName}
        height={168}
        src={src}
        width={384}
      />
    );
  }

  return (
    <div
      aria-label={alt || placeholderLabel}
      className={cx(
        mediaClassName,
        "flex items-center justify-center bg-background-neutral-soft text-icon",
      )}
      role="img"
    >
      <Icon name="image" size="medium" />
    </div>
  );
}

export function ReactionSummary({
  className,
  comments,
  reactions,
  reactionTypes = defaultReactionTypes,
  reposts,
}: ReactionSummaryProps) {
  if (!reactions && !comments && !reposts) {
    return null;
  }

  return (
    <div
      className={cx(
        "flex min-h-5 items-center gap-xs px-md text-body-xs text-text-meta",
        className,
      )}
    >
      {reactionTypes.length ? (
        <span aria-hidden="true" className="flex items-center">
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
      ) : null}
      <p className="flex min-w-0 items-center gap-xxs whitespace-nowrap">
        {reactions ? <span>{reactions}</span> : null}
        {reactions && comments ? <span aria-hidden="true">&middot;</span> : null}
        {comments ? <span>{comments}</span> : null}
        {(reactions || comments) && reposts ? (
          <span aria-hidden="true">&middot;</span>
        ) : null}
        {reposts ? <span>{reposts}</span> : null}
      </p>
    </div>
  );
}

export function ChatCardActions({
  actions,
  className,
}: ChatCardActionsProps) {
  if (!actions?.length) {
    return null;
  }

  return (
    <div
      className={cx(
        "flex flex-wrap items-center gap-md border-t border-border-faint px-md py-lg",
        className,
      )}
    >
      {actions.map(({ icon, label, onSelect, size, trailingIcon, variant }, index) => (
        <Button
          key={`${String(label)}-${index}`}
          leadingIcon={icon ? <Icon name={icon} size="small" /> : undefined}
          onClick={onSelect ? () => onSelect() : undefined}
          size={size ?? "small"}
          trailingIcon={
            trailingIcon ? <Icon name={trailingIcon} size="small" /> : undefined
          }
          variant={variant ?? "secondary"}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

export function ProductCard({
  actions,
  body,
  children,
  imageAlt,
  imageSrc,
  title,
  type,
  ...props
}: ProductCardProps) {
  return (
    <ChatCardShell {...props} data-response-block="ProductCard">
      <div className="space-y-xl p-xl">
        {imageSrc ? (
          <ChatCardMedia
            alt={imageAlt}
            aspectClassName="aspect-[16/7]"
            src={imageSrc}
          />
        ) : null}
        <div className="space-y-xs">
          <h3 className="text-heading-md text-text">{title}</h3>
          <p className="text-body-sm text-text-meta">{type}</p>
        </div>
        <p className="text-body-sm-open text-text">{body}</p>
        {children}
      </div>
      <ChatCardActions actions={actions} />
    </ChatCardShell>
  );
}

export function PostCard({
  actions,
  authorLogoClassName,
  authorLogoSrc,
  authorLogoStyle,
  authorName,
  comments,
  followerCount,
  imageAlt,
  imageSrc,
  linkMeta,
  linkTitle,
  reactions,
  reactionTypes,
  reposts,
  presentation = "default",
  snippet,
  tag,
  tagDetail,
  tagTone = "default",
  timestamp,
  ...props
}: PostCardProps) {
  return (
    <ChatCardShell
      {...props}
      data-presentation={presentation}
      data-response-block="PostCard"
    >
      <div className="flex flex-col gap-[12px] px-md pt-md">
        <div className="flex min-h-12 items-start gap-sm">
          <div className="flex min-w-0 flex-1 items-start gap-sm">
            <Entity
              className={authorLogoClassName}
              label={String(authorName)}
              shape="square"
              size={32}
              src={authorLogoSrc}
              style={authorLogoStyle}
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-control-sm text-text">
                {authorName}
              </h3>
              {followerCount ? (
                <p className="truncate text-supportive-s text-text">
                  {followerCount}
                </p>
              ) : null}
              {timestamp ? (
                <p className="text-supportive-s text-text-meta">{timestamp}</p>
              ) : null}
            </div>
          </div>
          {presentation === "default" ? (
            <Icon
              aria-hidden="true"
              className="text-text-meta"
              name="overflow-web-ios"
              size="medium"
            />
          ) : null}
        </div>
        <p className="line-clamp-2 whitespace-pre-wrap text-body-sm text-text">
          {snippet} <span className="text-text-meta">...more</span>
        </p>
        {tag ? (
          <div className="flex min-w-0 flex-col items-start gap-xs">
            <Tag className="max-w-full" size="small" tone={tagTone}>
              {tag}
            </Tag>
            {tagDetail ? (
              <p className="text-supportive-s text-text-meta">{tagDetail}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-[12px]">
        <ChatCardMedia
          alt={imageAlt}
          aspectClassName="aspect-[16/7]"
          fullBleed
          placeholderLabel="Post media preview"
          src={imageSrc}
        />
        {linkTitle ? (
          <div className="bg-background-neutral-soft px-md py-sm">
            <p className="line-clamp-2 text-control-sm text-text">
              {linkTitle}
            </p>
            {linkMeta ? (
              <p className="mt-xxs truncate text-supportive-s text-text-meta">
                {linkMeta}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="py-sm">
        <ReactionSummary
          comments={comments}
          reactions={reactions}
          reactionTypes={reactionTypes}
          reposts={reposts}
        />
      </div>
      <ChatCardActions actions={actions} />
    </ChatCardShell>
  );
}

export function JobCard({
  actions,
  alumni,
  alumniImageSrc,
  className,
  company,
  location,
  logoClassName,
  logoSrc,
  logoStyle,
  timestamp,
  title,
  ...props
}: JobCardProps) {
  return (
    <ChatCardShell
      {...props}
      className={cx(
        "shrink-0 [--response-entity-card-rail-width:240px]",
        className,
      )}
      data-response-block="JobCard"
    >
      <div className="space-y-xl p-lg">
        <Entity
          className={logoClassName}
          label={String(company)}
          shape="square"
          size={48}
          src={logoSrc}
          style={logoStyle}
        />
        <div className="space-y-lg text-left">
          <div className="space-y-xs">
            <p className="line-clamp-2 min-h-[40px] text-heading-md text-text">
              {title}
            </p>
            <div className="space-y-xxs text-body-sm">
              <p className="truncate text-text">{company}</p>
              {location ? (
                <p className="truncate text-text-meta">{location}</p>
              ) : null}
            </div>
          </div>
          {alumni ? (
            <div className="flex items-center gap-sm text-body-xs text-text-meta">
              {alumniImageSrc ? (
                <Image
                  alt=""
                  className="size-[var(--design-layout-entity-size-24)] rounded-xs object-cover"
                  height={24}
                  src={alumniImageSrc}
                  width={24}
                />
              ) : null}
              <span className="min-w-0 truncate">{alumni}</span>
            </div>
          ) : null}
          {timestamp ? (
            <p className="text-body-xs text-text-meta">{timestamp}</p>
          ) : null}
        </div>
      </div>
      <ChatCardActions actions={actions} />
    </ChatCardShell>
  );
}
