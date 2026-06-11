import Image from "next/image";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Entity as PrimitiveEntity } from "@/components/primitives/entity";
import { Icon, type IconName } from "@/components/primitives/icon";
import {
  SduiReactionIcon,
  type SduiReactionIconType,
} from "@/components/primitives/reaction-icon";
import { Tag, type TagTone } from "@/components/primitives/tag";

import { pcpCompanyProfile } from "../persona";

type Audience = "visitor" | "admin";
type EntityVariant = "post" | "job" | "person" | "company" | "event";
type SignalTier = "tier-1" | "tier-2" | "tier-3";

export type EntityAction = Readonly<{
  label: ReactNode;
  icon?: IconName;
  onSelect?: () => void;
  variant?: "primary" | "secondary" | "tertiary";
}>;

export type EntityStat = Readonly<{
  label: ReactNode;
  value: ReactNode;
}>;

export type EntitySignal = Readonly<{
  tier: SignalTier;
  label: ReactNode;
  detail?: ReactNode;
  quote?: ReactNode;
  count?: ReactNode;
  avatars?: ReadonlyArray<string>;
}>;

export type EntityPerformanceTag = Readonly<{
  label: ReactNode;
  tone?: TagTone;
}>;

export type EntityProps = HTMLAttributes<HTMLElement> & {
  variant: EntityVariant;
  audience?: Audience;
  logoSrc?: string;
  avatarSrc?: string;
  name: ReactNode;
  headline?: ReactNode;
  timestamp?: ReactNode;
  snippet?: ReactNode;
  engagement?: ReactNode;
  commentCount?: ReactNode;
  previewImageAlt?: string;
  previewImageSrc?: string;
  reactions?: ReadonlyArray<SduiReactionIconType>;
  repostCount?: ReactNode;
  performanceTag?: EntityPerformanceTag;
  title?: ReactNode;
  company?: ReactNode;
  location?: ReactNode;
  alumni?: ReactNode;
  alumniImageSrc?: string;
  applicantCount?: ReactNode;
  easyApply?: boolean;
  category?: ReactNode;
  connectionDegree?: ReactNode;
  followerCount?: ReactNode;
  stats?: ReadonlyArray<EntityStat>;
  signal?: EntitySignal;
  onCardSelect?: () => void;
  cardSelectLabel?: string;
  date?: Readonly<{
    month: ReactNode;
    day: ReactNode;
  }>;
  attendance?: ReactNode;
  actions?: ReadonlyArray<EntityAction>;
};

const signalTagTone: Record<SignalTier, TagTone> = {
  "tier-1": "caution",
  "tier-2": "supportive-4",
  "tier-3": "neutral",
};

const signalBoxClasses: Record<SignalTier, string> = {
  "tier-1": "border-caution bg-background",
  "tier-2": "border-action bg-surface-tint",
  "tier-3": "border-border-faint bg-background-neutral-soft",
};

const VELORA_LOGO_TILE_BACKGROUND_CLASS = "bg-[#ACF5B3]";
const VELORA_LOGO_TILE_BACKGROUND_STYLE = {
  backgroundColor: "#ACF5B3",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isVeloraLogo(src?: string, label?: ReactNode) {
  return src === pcpCompanyProfile.logoSrc || String(label) === pcpCompanyProfile.name;
}

function getCompanyLogoEntityProps(src?: string, label?: ReactNode) {
  if (!isVeloraLogo(src, label)) {
    return {};
  }

  return {
    className: VELORA_LOGO_TILE_BACKGROUND_CLASS,
    style: VELORA_LOGO_TILE_BACKGROUND_STYLE,
  };
}

function ActionRow({
  actions,
}: Readonly<{ actions?: ReadonlyArray<EntityAction> }>) {
  if (!actions?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-md border-t border-border-faint pt-lg">
      {actions.map(({ label, icon, onSelect, variant }, index) => (
        <Button
          key={`${String(label)}-${index}`}
          size="small"
          variant={variant ?? (index === 0 ? "primary" : "secondary")}
          leadingIcon={icon ? <Icon name={icon} size="small" /> : undefined}
          onClick={onSelect}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

function SignalBox({ signal }: Readonly<{ signal?: EntitySignal }>) {
  if (!signal) {
    return null;
  }

  return (
    <div
      className={cx(
        "space-y-md rounded-sm border p-lg",
        signalBoxClasses[signal.tier],
      )}
    >
      <div className="flex flex-wrap items-center gap-sm">
        <Tag tone={signalTagTone[signal.tier]} size="small">
          {signal.label}
        </Tag>
        {signal.count ? (
          <p className="text-body-xs text-text-meta">{signal.count}</p>
        ) : null}
      </div>
      {signal.avatars?.length ? (
        <div className="flex items-center">
          {signal.avatars.map((src, index) => (
            <PrimitiveEntity
              key={`${src}-${index}`}
              src={src}
              size={32}
              className={index === 0 ? "" : "-ml-sm ring-2 ring-background"}
            />
          ))}
        </div>
      ) : null}
      {signal.quote ? (
        <p className="text-body-sm-open text-text">“{signal.quote}”</p>
      ) : null}
      {signal.detail ? (
        <p className="text-body-sm-open text-text-meta">{signal.detail}</p>
      ) : null}
    </div>
  );
}

function ReactionPile({
  reactions = ["like", "praise", "interest"],
}: Readonly<{ reactions?: ReadonlyArray<SduiReactionIconType> }>) {
  return (
    <span className="flex items-center">
      {reactions.map((reaction, index) => (
        <SduiReactionIcon
          key={`${reaction}-${index}`}
          decorative
          ring
          size="xsmall"
          type={reaction}
          className={index > 0 ? "-ml-xs" : undefined}
        />
      ))}
    </span>
  );
}

function PostActionMetric({
  icon,
  value,
}: Readonly<{
  icon: IconName;
  value?: ReactNode;
}>) {
  if (!value) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-xs">
      <Icon aria-hidden="true" name={icon} size="small" />
      <span>{value}</span>
    </span>
  );
}

function PostActionStrip({
  commentCount,
  engagement,
  reactions,
  repostCount,
}: Readonly<{
  commentCount?: ReactNode;
  engagement?: ReactNode;
  reactions?: ReadonlyArray<SduiReactionIconType>;
  repostCount?: ReactNode;
}>) {
  if (!engagement && !commentCount && !repostCount) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-md text-body-sm font-semibold text-text-meta">
      <div className="flex min-w-0 items-center gap-lg">
        <PostActionMetric icon="thumbs-up-outline" value={engagement} />
        <PostActionMetric icon="comment" value={commentCount} />
        <PostActionMetric icon="repost" value={repostCount} />
        <Icon aria-hidden="true" name="send" size="small" />
      </div>
      <ReactionPile reactions={reactions} />
    </div>
  );
}

function renderPost(props: EntityProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-md">
        <div className="flex min-w-0 items-start gap-sm">
          <PrimitiveEntity
            {...getCompanyLogoEntityProps(props.logoSrc, props.name)}
            src={props.logoSrc}
            label={String(props.name)}
            shape="square"
            size={40}
          />
          <div className="min-w-0">
            <p className="truncate text-body-sm font-semibold text-text">
              {props.name}
            </p>
            {props.followerCount ? (
              <p className="text-body-xs text-text-meta">{props.followerCount}</p>
            ) : null}
            {props.timestamp ? (
              <p className="text-body-xs text-text-meta">{props.timestamp}</p>
            ) : null}
          </div>
        </div>
        {props.performanceTag ? (
          <Tag
            className="shrink-0"
            size="small"
            tone={props.performanceTag.tone ?? "positive"}
          >
            {props.performanceTag.label}
          </Tag>
        ) : null}
      </div>
      {props.snippet ? (
        <p className="line-clamp-2 text-body-sm-open text-text">
          {props.snippet}
        </p>
      ) : null}
      {props.previewImageSrc ? (
        <Image
          alt={props.previewImageAlt ?? ""}
          className="aspect-[16/6] w-full rounded-sm object-cover"
          height={144}
          src={props.previewImageSrc}
          width={384}
        />
      ) : null}
      <PostActionStrip
        commentCount={props.commentCount}
        engagement={props.engagement}
        reactions={props.reactions}
        repostCount={props.repostCount}
      />
    </>
  );
}

function renderJob(props: EntityProps) {
  return (
    <div className="flex items-start gap-md">
      <PrimitiveEntity
        {...getCompanyLogoEntityProps(props.logoSrc, props.company)}
        src={props.logoSrc}
        label={props.company ? String(props.company) : undefined}
        shape="square"
        size={40}
      />
      <div className="min-w-0 flex-1 space-y-md text-left">
        <div className="space-y-xxs">
          <p className="line-clamp-2 text-body-sm font-semibold text-text">
            {props.title}
          </p>
          <p className="truncate text-body-sm text-text">
            <span>{props.company}</span>
            {props.location ? (
              <span className="text-text-meta"> · {props.location}</span>
            ) : null}
          </p>
        </div>
        {props.alumni ? (
          <div className="flex items-center gap-sm text-body-xs text-text-meta">
            {props.alumniImageSrc ? (
              <Image
                alt=""
                className="size-[var(--design-layout-entity-size-24)] rounded-xs object-cover"
                height={24}
                src={props.alumniImageSrc}
                width={24}
              />
            ) : null}
            <span className="min-w-0 truncate">{props.alumni}</span>
          </div>
        ) : null}
        {props.timestamp || props.applicantCount || props.easyApply ? (
          <p className="text-body-xs text-text-meta">
            {props.timestamp}
            {props.timestamp && props.applicantCount ? " · " : null}
            {props.applicantCount}
            {(props.timestamp || props.applicantCount) && props.easyApply
              ? " · "
              : null}
            {props.easyApply ? "Easy Apply" : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function renderPerson(props: EntityProps) {
  return (
    <>
      <div className="flex items-start gap-md">
        <PrimitiveEntity
          src={props.avatarSrc}
          label={String(props.name)}
          size={40}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-sm font-semibold text-text">
            {props.name}
            {props.connectionDegree ? (
              <span className="font-normal text-text-meta">
                {" "}
                · {props.connectionDegree}
              </span>
            ) : null}
          </p>
          {props.headline ? (
            <p className="text-body-xs text-text-meta">
              {props.headline}
            </p>
          ) : null}
        </div>
      </div>
      <SignalBox signal={props.signal} />
    </>
  );
}

function renderCompany(props: EntityProps) {
  return (
    <>
      <div className="flex items-start gap-md">
        <PrimitiveEntity
          {...getCompanyLogoEntityProps(props.logoSrc, props.name)}
          src={props.logoSrc}
          label={String(props.name)}
          shape="square"
          size={40}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-sm">
            <p className="truncate text-body-sm font-semibold text-text">
              {props.name}
            </p>
            {props.audience === "admin" ? (
              <Tag tone="supportive-4" size="small">
                VS YOU
              </Tag>
            ) : null}
          </div>
          <p className="text-body-sm-open text-text-meta">
            {props.category}
            {props.followerCount ? <> · {props.followerCount}</> : null}
          </p>
        </div>
      </div>
      {props.audience === "admin" && props.stats?.length ? (
        <div className="divide-y divide-border-faint rounded-sm border border-border-faint">
          {props.stats.map(({ label, value }, index) => (
            <div
              key={`${String(label)}-${index}`}
              className="flex items-center justify-between gap-md px-md py-sm"
            >
              <p className="text-body-xs text-text-meta">{label}</p>
              <p className="text-body-sm font-medium text-text">{value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

function renderEvent(props: EntityProps) {
  return (
    <div className="flex items-start gap-md">
      <div className="flex min-w-[var(--design-layout-input-small-height)] flex-col overflow-hidden rounded-sm border border-border-faint text-center">
        <span className="bg-ai-background-soft px-sm py-xxs text-label-xs text-label">
          {props.date?.month}
        </span>
        <span className="bg-background px-sm py-xs text-heading-md text-text">
          {props.date?.day}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm font-semibold text-text">{props.name}</p>
        {props.attendance ? (
          <p className="text-body-sm-open text-text-meta">
            {props.attendance}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function renderEntityContent(props: EntityProps) {
  switch (props.variant) {
    case "post":
      return renderPost(props);
    case "job":
      return renderJob(props);
    case "person":
      return renderPerson(props);
    case "company":
      return renderCompany(props);
    case "event":
      return renderEvent(props);
    default:
      return null;
  }
}

export function Entity({
  className,
  actions,
  audience = "visitor",
  onCardSelect,
  cardSelectLabel,
  ...props
}: EntityProps) {
  const entityProps = { ...props, audience, actions };

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!onCardSelect) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onCardSelect();
    }
  }

  return (
    <article
      aria-label={cardSelectLabel}
      data-response-block="Entity"
      data-variant={props.variant}
      data-audience={audience}
      onClick={onCardSelect}
      onKeyDown={onCardSelect ? handleKeyDown : undefined}
      role={onCardSelect ? "button" : undefined}
      tabIndex={onCardSelect ? 0 : undefined}
      className={cx(
        "w-full rounded-sm border border-ai-border bg-background p-xl text-text shadow-raised-faint",
        onCardSelect
          ? "cursor-pointer outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-faint-hover hover:shadow-raised-soft focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          : "",
        className,
      )}
    >
      <div className="space-y-xl">
        {renderEntityContent(entityProps)}
        <ActionRow actions={actions} />
      </div>
    </article>
  );
}
