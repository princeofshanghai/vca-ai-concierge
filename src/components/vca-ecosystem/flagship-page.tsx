"use client";

import { useState, type ReactNode } from "react";

import {
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatMessageContent,
  ChatPanel,
  ChatResponseAttachment,
  ChatResponseBlock,
  ChatTray,
  Prompt,
  type ChatPanelVariant,
} from "@/components/chat";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";
import {
  LinkedInGlobalNavigation,
  type LinkedInGlobalNavigationItem,
} from "@/components/global-navigation";
import { Button } from "@/components/primitives/button";
import { Entity } from "@/components/primitives/entity";
import { GhostIconButton } from "@/components/primitives/ghost-icon-button";
import { Icon, type IconName } from "@/components/primitives/icon";
import {
  SduiReactionIcon,
  type SduiReactionIconType,
} from "@/components/primitives/reaction-icon";

const flagshipNavItems: ReadonlyArray<LinkedInGlobalNavigationItem> = [
  { label: "Home", icon: "navigation-home-active", active: true },
  { label: "My Network", icon: "navigation-people" },
  { label: "Jobs", icon: "navigation-job" },
  { label: "Messaging", icon: "navigation-messages" },
  { label: "Notifications", icon: "navigation-bell-fill" },
];

const flagshipProfile = {
  name: "Charles Hu",
  headline: "Staff Product Designer at LinkedIn",
} as const;

type FlagshipVcaSurfaceState = "closed" | "open" | "docked";

const flagshipHelpSuggestions = [
  "How do I send an InMail message?",
  "Can I switch my Premium billing to annual?",
  "How can I use Premium Career to advance my career?",
] as const;

const FLAGSHIP_INMAIL_PROMPT = "How do I send an InMail message?";
const FLAGSHIP_INMAIL_HELP_URL =
  "https://www.linkedin.com/help/linkedin/answer/a546814";
const FLAGSHIP_BILLING_CYCLE_PROMPT =
  "Can I switch my Premium billing to annual?";
const FLAGSHIP_BILLING_CYCLE_HELP_URL =
  "https://www.linkedin.com/help/linkedin/answer/a8058191";
const FLAGSHIP_CAREER_INSIGHTS_PROMPT =
  "How can I use Premium Career to advance my career?";
const FLAGSHIP_CAREER_INSIGHTS_FOLLOW_UP_PROMPT =
  "What type of insights are available?";
const FLAGSHIP_CAREER_INSIGHTS_HELP_URL =
  "https://www.linkedin.com/help/linkedin/answer/a6221139";

const flagshipHelpResources = [
  "Help Center",
  "Learning Center",
  "Community",
] as const;

const inboxThreads = [
  {
    id: "maya",
    name: "Maya Chen",
    detail: "Thanks for sharing the update on the prototype review.",
    time: "Now",
    active: true,
    unread: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    detail: "You have new activity from people in your network.",
    time: "11:42 AM",
  },
  {
    id: "design",
    name: "Design Leadership",
    detail: "The team added comments to the planning thread.",
    time: "Mon",
  },
] as const;

type FeedPostData = Readonly<{
  author: string;
  body: string;
  comments: string;
  headline: string;
  reactions: string;
  reactionTypes: ReadonlyArray<SduiReactionIconType>;
  time: string;
  visual?: "people";
}>;

const feedPosts: ReadonlyArray<FeedPostData> = [
  {
    author: "LinkedIn Product Design",
    headline: "Design systems and product craft",
    time: "1h",
    body:
      "A strong product experience starts with the basics: clear surfaces, predictable navigation, and context that helps people decide what to do next.",
    reactions: "486",
    comments: "42 comments",
    reactionTypes: ["like", "praise", "interest"],
  },
  {
    author: "Sarah Miller",
    headline: "Product leader at LinkedIn",
    time: "3h",
    body:
      "Small interface decisions can carry a lot of trust. When the product feels familiar, people can focus on the work they came to do.",
    reactions: "238",
    comments: "18 comments",
    reactionTypes: ["like", "empathy", "praise"],
    visual: "people",
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <section
      className={cx(
        "overflow-hidden rounded-xs border border-border-faint bg-background text-text",
        className,
      )}
    >
      {children}
    </section>
  );
}

function ProfileRail() {
  return (
    <aside className="hidden lg:block">
      <Card>
        <div className="h-14 bg-surface-tint" />
        <div className="-mt-8 flex flex-col items-start px-lg pb-lg text-left">
          <Entity
            className="border-4 border-background"
            label={flagshipProfile.name}
            size={80}
          />
          <h1 className="mt-sm flex max-w-full items-center gap-xs text-heading-md text-text">
            <span className="min-w-0 truncate">{flagshipProfile.name}</span>
            <Icon
              aria-hidden="true"
              className="shrink-0 text-premium-inbug"
              name="linked-in-bug"
              size="small"
            />
          </h1>
          <p className="mt-xxs text-body-xs text-text-meta">
            {flagshipProfile.headline}
          </p>
        </div>
        <div className="border-t border-border-faint px-lg py-md text-body-xs">
          <div className="flex justify-between gap-md">
            <span className="text-text-meta">Profile viewers</span>
            <span className="font-semibold text-action">64</span>
          </div>
          <div className="mt-sm flex justify-between gap-md">
            <span className="text-text-meta">Post impressions</span>
            <span className="font-semibold text-action">1,240</span>
          </div>
        </div>
      </Card>

      <Card className="mt-md">
        <button
          className="flex w-full items-center gap-sm px-lg py-md text-left text-control-sm text-text outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          type="button"
        >
          <Icon name="bookmark-fill" size="small" className="text-icon" />
          <span>Saved items</span>
        </button>
      </Card>
    </aside>
  );
}

function ComposerCard() {
  return (
    <Card className="p-lg">
      <div className="flex items-center gap-md">
        <Entity label="Charles" size={48} />
        <button
          className="flex h-12 min-w-0 flex-1 items-center rounded-round border border-border-subtle px-lg text-left text-control-md text-text outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          type="button"
        >
          Start a post
        </button>
      </div>
    </Card>
  );
}

function PostVisual({
  type,
}: Readonly<{ type: NonNullable<FeedPostData["visual"]> }>) {
  return (
    <div className="mt-lg flex h-[172px] items-center justify-center bg-surface-tint px-xl">
      <div className="flex items-end -space-x-lg">
        {[80, 96, 80, 96].map((size, index) => (
          <Entity
            key={`${type}-${size}-${index}`}
            className="border-4 border-background shadow-raised-faint"
            label={`Person ${index + 1}`}
            size={size as 80 | 96}
          />
        ))}
      </div>
    </div>
  );
}

function getCompactCount(label: string) {
  return label.split(" ")[0] ?? label;
}

function FeedPostAction({
  count,
  icon,
  label,
}: Readonly<{
  count?: string;
  icon: IconName;
  label: string;
}>) {
  return (
    <button
      aria-label={label}
      className="inline-flex min-h-10 shrink-0 items-center gap-xs rounded-xs px-xs text-icon outline-none transition-colors duration-150 ease-out hover:bg-background-transparent-hover hover:text-icon-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
      type="button"
    >
      <Icon name={icon} size="small" />
      {count ? (
        <span className="text-control-sm text-text-meta">{count}</span>
      ) : null}
    </button>
  );
}

function FeedPostReactionPile({
  reactionTypes,
}: Readonly<{
  reactionTypes: ReadonlyArray<SduiReactionIconType>;
}>) {
  return (
    <span className="flex items-center" aria-hidden="true">
      {reactionTypes.map((reaction, index) => (
        <SduiReactionIcon
          className={index < reactionTypes.length - 1 ? "-mr-[4px]" : undefined}
          decorative
          key={reaction}
          ring
          size="xsmall"
          type={reaction}
        />
      ))}
    </span>
  );
}

function FeedPost({
  author,
  body,
  comments,
  headline,
  reactions,
  reactionTypes,
  time,
  visual,
}: FeedPostData) {
  return (
    <Card>
      <article>
        <div className="flex items-start gap-md px-lg pt-lg">
          <Entity label={author} size={48} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-md">
              <div className="min-w-0">
                <h2 className="truncate text-control-sm text-text">{author}</h2>
                <p className="truncate text-body-xs text-text-meta">
                  {headline}
                </p>
                <p className="text-body-xs text-text-meta">{time}</p>
              </div>
              <GhostIconButton
                icon="overflow-web-ios"
                label="More post actions"
                size="small"
              />
            </div>
          </div>
        </div>
        <p className="mt-md px-lg text-body-sm-open text-text">{body}</p>

        {visual ? <PostVisual type={visual} /> : null}

        <div className="mt-md border-t border-border-faint px-lg py-sm">
          <div className="flex min-h-10 items-center justify-between gap-md">
            <div className="flex min-w-0 items-center gap-sm">
              <button
                aria-label="Choose posting identity"
                className="inline-flex min-h-10 shrink-0 items-center gap-xxs rounded-xs pr-xs outline-none transition-colors duration-150 ease-out hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
                type="button"
              >
                <Entity label="Charles" size={24} />
                <Icon className="text-icon" name="caret" size="small" />
              </button>

              <div className="flex min-w-0 items-center gap-xs">
                <FeedPostAction
                  count={reactions}
                  icon="thumbs-up-outline"
                  label="Like"
                />
                <FeedPostAction
                  count={getCompactCount(comments)}
                  icon="comment"
                  label={comments}
                />
                <FeedPostAction icon="repost" label="Repost" />
                <FeedPostAction icon="send" label="Send" />
              </div>
            </div>

            <div className="shrink-0">
              <FeedPostReactionPile reactionTypes={reactionTypes} />
            </div>
          </div>
        </div>
      </article>
    </Card>
  );
}

function NewsRail() {
  return (
    <aside className="hidden xl:block">
      <Card className="p-lg">
        <div className="flex items-center justify-between gap-md">
          <h2 className="text-heading-md text-text">LinkedIn News</h2>
          <Icon name="question" size="small" className="text-icon" />
        </div>
        <ul className="mt-md space-y-md">
          {[
            "Product teams focus on AI workflows",
            "Hiring leaders rethink candidate experience",
            "Design systems shape everyday work",
            "Members share career lessons",
          ].map((item, index) => (
            <li key={item}>
              <button
                className="w-full rounded-xs text-left outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
                type="button"
              >
                <p className="text-control-sm text-text">{item}</p>
                <p className="mt-xxs text-body-xs text-text-meta">
                  {index + 2}h ago
                </p>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-md p-lg">
        <h2 className="text-heading-md text-text">Add to your feed</h2>
        <div className="mt-md space-y-md">
          {["LinkedIn Design", "Product Management", "AI at Work"].map(
            (item) => (
              <div className="flex items-start gap-sm" key={item}>
                <Entity label={item} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-control-sm text-text">{item}</p>
                  <p className="text-body-xs text-text-meta">
                    Company or topic
                  </p>
                  <Button className="mt-sm" size="small" variant="tertiary">
                    Follow
                  </Button>
                </div>
              </div>
            ),
          )}
        </div>
      </Card>
    </aside>
  );
}

function FlagshipHelpWelcomeSurface({
  onPromptSelect,
}: Readonly<{
  onPromptSelect: (prompt: string) => void;
}>) {
  return (
    <section className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-lg pb-[96px] pt-xxl md:px-xxl">
      <div className="flex w-full flex-col items-center">
        <h2 className="text-heading-lg text-text">How can we help?</h2>

        <div className="mt-xl w-full max-w-[var(--design-layout-panel-content-max)]">
          <ChatComposer
            forceMultiline
            className="!min-h-0 !border-t-0 !px-0 !pb-0 !pt-0 md:!px-0 md:!pb-0 md:!pt-0"
            inputProps={{
              "aria-label": "Ask Help assistant",
              placeholder: "Ask a question or describe your issue...",
            }}
            onSend={() => {}}
            showVoiceMode={false}
          />
        </div>

        <section
          aria-label="Suggested questions"
          className="mt-xl flex w-full max-w-[var(--design-layout-panel-content-max)] flex-col items-start gap-sm"
        >
          <div className="flex w-full flex-col items-start gap-sm">
            {flagshipHelpSuggestions.map((suggestion) => (
              <Prompt
                className="w-fit max-w-full self-start"
                key={suggestion}
                onPromptSelect={onPromptSelect}
                prompt={suggestion}
              />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="flagship-help-resources"
          className="mt-xl w-full max-w-[var(--design-layout-panel-content-max)] border-t border-border-faint pt-lg"
        >
          <h3
            id="flagship-help-resources"
            className="text-control-md text-text"
          >
            More resources
          </h3>
          <div className="mt-sm flex flex-col items-start gap-xxs">
            {flagshipHelpResources.map((resource) => (
              <button
                className="flex min-h-8 w-fit max-w-full items-center gap-xs rounded-xs py-xxs pr-xs text-left text-control-sm text-text-meta outline-none transition-[background-color,color] duration-150 ease-out hover:bg-background-transparent-hover hover:text-text-hover active:bg-background-transparent-active active:text-text-active focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
                key={resource}
                type="button"
              >
                <span className="min-w-0 truncate">{resource}</span>
                <Icon
                  aria-hidden="true"
                  className="text-icon"
                  name="link-external"
                  size="small"
                />
              </button>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function FlagshipCareerInsightsChatSurface() {
  const [showInsightTypes, setShowInsightTypes] = useState(false);

  return (
    <>
      <ChatBody>
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[var(--design-layout-panel-content-max)] flex-col gap-xxl px-xxl pb-xl pt-xl">
            <ChatMessage
              role="user"
              timestamp={getPrototypeMessageTimestamp(0)}
            >
              {FLAGSHIP_CAREER_INSIGHTS_PROMPT}
            </ChatMessage>

            <ChatResponseBlock
              feedbackPolicy="rateable"
              timestamp={getPrototypeMessageTimestamp(1)}
            >
              <ChatMessage>
                <ChatMessageContent>
                <p>
                  Yes. Since you&apos;re on Premium Career, I can help you use
                  Career Insights to think through your next move more
                  strategically.
                </p>

                <p>
                  Based on your profile as a Staff Product Designer, a good
                  starting point is to compare a few possible paths, like staying
                  on a senior IC track, moving toward design leadership, or
                  exploring adjacent product strategy roles. Career Insights can
                  help you see where those paths are showing demand, which
                  companies are hiring for similar roles, and who in your network
                  may be able to help you learn more.
                </p>

                <p>
                  You can also set a career goal so LinkedIn can personalize
                  recommendations for roles, companies, people, courses, and
                  events that match the direction you want to explore.
                </p>

                <p>
                  <a
                    href={FLAGSHIP_CAREER_INSIGHTS_HELP_URL}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Learn more about Career Insights
                  </a>
                </p>
                </ChatMessageContent>
              </ChatMessage>
              {!showInsightTypes ? (
                <ChatResponseAttachment>
                  <div className="flex justify-start">
                    <Prompt
                      className="w-fit max-w-full"
                      onPromptSelect={() => setShowInsightTypes(true)}
                      prompt={FLAGSHIP_CAREER_INSIGHTS_FOLLOW_UP_PROMPT}
                    />
                  </div>
                </ChatResponseAttachment>
              ) : null}
            </ChatResponseBlock>

            {showInsightTypes ? (
              <>
                <ChatMessage
                  role="user"
                  timestamp={getPrototypeMessageTimestamp(2)}
                >
                  {FLAGSHIP_CAREER_INSIGHTS_FOLLOW_UP_PROMPT}
                </ChatMessage>

                <ChatResponseBlock
                  feedbackPolicy="rateable"
                  timestamp={getPrototypeMessageTimestamp(3)}
                >
                  <ChatMessage>
                    <ChatMessageContent>
                    <p>
                      Premium Career can help you look at your next step from a
                      few useful angles, not just open jobs.
                    </p>

                    <ul>
                      <li>
                        <strong>Companies where your target role is in demand</strong>
                        : places with recent job posting activity for that role.
                      </li>
                      <li>
                        <strong>People who may be able to help</strong>: 1st-
                        or 2nd-degree connections with experience in the role
                        you&apos;re exploring.
                      </li>
                      <li>
                        <strong>Actively hiring signals</strong>: Premium
                        subscribers can see people actively hiring for specified
                        roles in the Insights Hub.
                      </li>
                      <li>
                        <strong>Courses and skill-building paths</strong>:
                        recommended LinkedIn Learning courses tied to your job
                        title or career goal.
                      </li>
                      <li>
                        <strong>Premium events</strong>: upcoming events and
                        replays focused on job seeking, career growth, and
                        networking.
                      </li>
                    </ul>

                    <p>
                      If you set a career goal, LinkedIn can make those insights
                      more specific to the role or direction you care about.
                    </p>
                    </ChatMessageContent>
                  </ChatMessage>
                </ChatResponseBlock>
              </>
            ) : null}
          </div>
        </div>
      </ChatBody>
      <ChatComposer
        inputProps={{
          "aria-label": "Ask Help assistant a follow-up",
          placeholder: "Ask a follow-up...",
        }}
        onSend={() => {}}
        showAttachAction={false}
        showTopDivider
        showVoiceMode={false}
      />
    </>
  );
}

function FlagshipInMailChatSurface() {
  return (
    <>
      <ChatBody>
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[var(--design-layout-panel-content-max)] flex-col gap-xxl px-xxl pb-xl pt-xl">
            <ChatMessage role="user" timestamp={getPrototypeMessageTimestamp(0)}>
              {FLAGSHIP_INMAIL_PROMPT}
            </ChatMessage>

            <ChatResponseBlock
              feedbackPolicy="rateable"
              timestamp={getPrototypeMessageTimestamp(1)}
            >
              <ChatMessage>
                <ChatMessageContent>
                <p>
                  Yes. Since you&apos;re on Premium Career, you can use InMail
                  to message people you&apos;re not connected to yet.
                </p>

                <p>On desktop:</p>
                <ol>
                  <li>Open the person&apos;s profile.</li>
                  <li>
                    Select <strong>More</strong> in their intro section.
                  </li>
                  <li>
                    Choose <strong>Message</strong>.
                  </li>
                  <li>
                    Add an optional subject, write your message, and send.
                  </li>
                </ol>

                <p>
                  On mobile, open their profile, tap <strong>Message</strong> in
                  the intro section, add an optional subject, then send your
                  note.
                </p>

                <p>
                  A couple things to keep in mind: your subject can be up to 200
                  characters, the message can be up to 2,000 characters, and
                  some members may not accept InMail depending on their message
                  preferences.
                </p>

                <p>
                  <a
                    href={FLAGSHIP_INMAIL_HELP_URL}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Learn more about InMail
                  </a>
                </p>
                </ChatMessageContent>
              </ChatMessage>
            </ChatResponseBlock>
          </div>
        </div>
      </ChatBody>
      <ChatComposer
        inputProps={{
          "aria-label": "Ask Help assistant a follow-up",
          placeholder: "Ask a follow-up...",
        }}
        onSend={() => {}}
        showAttachAction={false}
        showTopDivider
        showVoiceMode={false}
      />
    </>
  );
}

function FlagshipBillingCycleChatSurface() {
  return (
    <>
      <ChatBody>
        <div className="flex w-full justify-center">
          <div className="flex w-full max-w-[var(--design-layout-panel-content-max)] flex-col gap-xxl px-xxl pb-xl pt-xl">
            <ChatMessage role="user" timestamp={getPrototypeMessageTimestamp(0)}>
              {FLAGSHIP_BILLING_CYCLE_PROMPT}
            </ChatMessage>

            <ChatResponseBlock
              feedbackPolicy="rateable"
              timestamp={getPrototypeMessageTimestamp(1)}
            >
              <ChatMessage>
                <ChatMessageContent>
                <p>
                  Yes. You&apos;re currently on a monthly Premium Career plan,
                  and you can still switch to annual billing to save money.
                  Annual billing can cost up to 50% less compared with paying
                  monthly.
                </p>

                <p>To change it:</p>
                <ol>
                  <li>
                    Open the <strong>Me</strong> menu at the top of LinkedIn.
                  </li>
                  <li>
                    Select <strong>Premium features</strong>.
                  </li>
                  <li>
                    Choose <strong>Manage your subscription</strong>.
                  </li>
                  <li>
                    In <strong>Billing information</strong>, select{" "}
                    <strong>Edit</strong> next to billing frequency.
                  </li>
                  <li>
                    Choose <strong>Annual</strong>, then confirm the update.
                  </li>
                </ol>

                <p>
                  Since you&apos;re switching from monthly to annual, the annual
                  plan can start right away, and any remaining time in your
                  current monthly cycle is adjusted into the new billing.
                </p>

                <p>
                  <a
                    href={FLAGSHIP_BILLING_CYCLE_HELP_URL}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Learn more about changing your billing cycle
                  </a>
                </p>
                </ChatMessageContent>
              </ChatMessage>
            </ChatResponseBlock>
          </div>
        </div>
      </ChatBody>
      <ChatComposer
        inputProps={{
          "aria-label": "Ask Help assistant a follow-up",
          placeholder: "Ask a follow-up...",
        }}
        onSend={() => {}}
        showAttachAction={false}
        showTopDivider
        showVoiceMode={false}
      />
    </>
  );
}

function FlagshipHelpPanel({
  onClose,
  onDock,
  onVariantToggle,
  variant,
}: Readonly<{
  onClose: () => void;
  onDock: () => void;
  onVariantToggle: () => void;
  variant: ChatPanelVariant;
}>) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const isInMailChat = selectedPrompt === FLAGSHIP_INMAIL_PROMPT;
  const isBillingCycleChat = selectedPrompt === FLAGSHIP_BILLING_CYCLE_PROMPT;
  const isCareerInsightsChat =
    selectedPrompt === FLAGSHIP_CAREER_INSIGHTS_PROMPT;

  function handlePromptSelect(prompt: string) {
    if (
      prompt === FLAGSHIP_INMAIL_PROMPT ||
      prompt === FLAGSHIP_BILLING_CYCLE_PROMPT ||
      prompt === FLAGSHIP_CAREER_INSIGHTS_PROMPT
    ) {
      setSelectedPrompt(prompt);
    }
  }

  function handleStartNewChat() {
    setSelectedPrompt(null);
  }

  return (
    <ChatPanel
      aria-label="Help assistant"
      className="!h-full !w-full !rounded-none shadow-raised-faint md:!h-full md:!w-full md:!rounded-sm"
      variant={variant}
    >
      <ChatHeader
        onClose={onClose}
        onMinimizeToTray={onDock}
        onStartNewChat={selectedPrompt ? handleStartNewChat : undefined}
        onVariantToggle={onVariantToggle}
        showAiMark={false}
        transparent
        variant={variant}
      />
      {isInMailChat ? (
        <FlagshipInMailChatSurface />
      ) : isBillingCycleChat ? (
        <FlagshipBillingCycleChatSurface />
      ) : isCareerInsightsChat ? (
        <FlagshipCareerInsightsChatSurface />
      ) : (
        <FlagshipHelpWelcomeSurface onPromptSelect={handlePromptSelect} />
      )}
    </ChatPanel>
  );
}

function FlagshipGlobalInboxTray() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      aria-label="Messaging inbox"
      className={cx(
        "vca-global-messaging-surface fixed bottom-0 right-6 z-50 hidden w-[288px] flex-col overflow-hidden rounded-t-sm border border-b-0 border-border-faint bg-background text-text shadow-raised-faint transition-[height] duration-[var(--design-motion-duration-moderate)] ease-emphasized md:flex",
        isExpanded
          ? "h-[min(calc(100dvh_-_96px),520px)]"
          : "h-[var(--design-layout-chat-tray-height,48px)]",
      )}
    >
      <div className="flex min-h-[var(--design-layout-chat-tray-height,48px)] items-center gap-sm border-b border-border-faint px-sm">
        <button
          aria-expanded={isExpanded}
          className="group flex min-w-0 flex-1 items-center gap-sm rounded-xs text-left outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
          type="button"
        >
          <span className="relative inline-flex shrink-0">
            <Entity label="Charles" size={32} />
            <span
              aria-label="Active"
              className="absolute -bottom-xxs -right-xxs size-3 rounded-round border-2 border-background bg-positive"
              role="status"
            />
          </span>
          <span className="min-w-0 flex-1 truncate text-control-sm">
            Messaging
          </span>
        </button>
        <div className="flex shrink-0 items-center -space-x-xs">
          <GhostIconButton
            icon="overflow-web-ios"
            label="More messaging actions"
            size="small"
          />
          <GhostIconButton
            icon="compose"
            label="Compose message"
            size="small"
          />
          <GhostIconButton
            icon={isExpanded ? "chevron-down" : "chevron-up"}
            label={isExpanded ? "Collapse messaging" : "Expand messaging"}
            onClick={() => setIsExpanded((currentValue) => !currentValue)}
            size="small"
          />
        </div>
      </div>

      {isExpanded ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <button
            className="flex h-8 items-center justify-between border-b border-border-faint px-lg text-left text-control-sm text-text outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
            type="button"
          >
            <span>More inboxes</span>
            <Icon className="text-icon" name="caret" size="small" />
          </button>
          <div className="border-b border-border-faint px-lg py-sm">
            <div className="flex h-8 items-center gap-sm rounded-xs bg-background-neutral-soft px-md text-text-meta">
              <Icon name="search" size="small" />
              <span className="min-w-0 flex-1 truncate text-body-sm">
                Search messages
              </span>
              <Icon name="overflow-android" size="small" />
            </div>
          </div>
          <div className="grid grid-cols-2 border-b border-border-faint text-center text-control-sm">
            <button
              aria-selected="true"
              className="border-b-2 border-positive px-md py-md text-positive outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              role="tab"
              type="button"
            >
              Focused
            </button>
            <button
              aria-selected="false"
              className="border-b-2 border-transparent px-md py-md text-text-meta outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-neutral-focus-ring"
              role="tab"
              type="button"
            >
              Other
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {inboxThreads.map((thread) => (
              <button
                className="flex h-[72px] min-h-[72px] w-full items-start gap-sm border-b border-border-faint px-md pb-md pt-sm text-left outline-none hover:bg-background-transparent-hover focus-visible:ring-4 focus-visible:ring-action-focus-ring"
                key={thread.id}
                type="button"
              >
                <span className="relative inline-flex shrink-0">
                  <Entity label={thread.name} size={40} />
                  {"active" in thread && thread.active ? (
                    <span
                      aria-label="Active"
                      className="absolute -bottom-xxs -right-xxs size-3 rounded-round border-2 border-background bg-positive"
                      role="status"
                    />
                  ) : null}
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-xxs">
                  <span className="flex min-w-0 items-baseline justify-between gap-sm">
                    <span
                      className={cx(
                        "truncate text-body-sm text-text",
                        "unread" in thread &&
                          thread.unread &&
                          "font-semibold",
                      )}
                    >
                      {thread.name}
                    </span>
                    <span className="shrink-0 text-body-xs text-text-meta">
                      {thread.time}
                    </span>
                  </span>
                  <span className="line-clamp-2 text-body-xs text-text-meta">
                    {thread.detail}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export function FlagshipPage() {
  const [helpSurfaceState, setHelpSurfaceState] =
    useState<FlagshipVcaSurfaceState>("closed");
  const [helpPanelVariant, setHelpPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const isHelpPanelOpen = helpSurfaceState === "open";
  const isHelpDocked = helpSurfaceState === "docked";
  const isHelpExpanded = helpPanelVariant === "expanded";
  const helpPanelPositionClass = isHelpExpanded
    ? "md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2"
    : "md:inset-auto md:bottom-6 md:right-6 md:top-[calc(52px_+_var(--design-spacing-xxl))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]";

  function handleOpenHelpPanel() {
    setHelpPanelVariant("collapsed");
    setHelpSurfaceState("open");
  }

  function handleOpenHelpFromTray() {
    setHelpSurfaceState("open");
  }

  function handleExpandHelpFromTray() {
    setHelpPanelVariant("expanded");
    setHelpSurfaceState("open");
  }

  function handleCloseHelpPanel() {
    setHelpPanelVariant("collapsed");
    setHelpSurfaceState("closed");
  }

  function handleDockHelpPanel() {
    setHelpPanelVariant("collapsed");
    setHelpSurfaceState("docked");
  }

  function handleCollapseHelpPanel() {
    setHelpPanelVariant("collapsed");
  }

  function handleToggleHelpPanelVariant() {
    setHelpPanelVariant((currentVariant) =>
      currentVariant === "expanded" ? "collapsed" : "expanded",
    );
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-background-neutral-soft pb-[96px] text-text">
      <LinkedInGlobalNavigation
        items={flagshipNavItems}
        onHelpSelect={handleOpenHelpPanel}
        profileHeadline={flagshipProfile.headline}
        profileLabel="Me"
        profileName={flagshipProfile.name}
        searchPlaceholder="Search"
      />

      <div className="mx-auto grid w-full max-w-[1128px] grid-cols-1 gap-lg px-lg pt-xxl md:grid-cols-[minmax(0,1fr)] lg:grid-cols-[225px_minmax(0,555px)] xl:grid-cols-[225px_minmax(0,555px)_300px] xl:px-0">
        <ProfileRail />
        <section aria-label="LinkedIn feed" className="grid content-start gap-md">
          <ComposerCard />
          {feedPosts.map((post) => (
            <FeedPost key={post.author} {...post} />
          ))}
        </section>
        <NewsRail />
      </div>

      {!isHelpPanelOpen ? <FlagshipGlobalInboxTray /> : null}

      {isHelpDocked ? (
        <ChatTray
          actionSize="small"
          aria-controls="flagship-help-assistant"
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-label="Open Help assistant"
          className="fixed bottom-0 right-[calc(288px_+_var(--design-spacing-xxl)_+_var(--design-spacing-xxl))] z-50 hidden !h-[var(--design-layout-chat-tray-height,48px)] !w-[288px] !max-w-[288px] !rounded-t-sm md:inline-flex"
          onClose={handleCloseHelpPanel}
          onOpen={handleOpenHelpFromTray}
          onVariantToggle={handleExpandHelpFromTray}
          showAiMark={false}
          title="Help assistant"
          titleClassName="text-control-sm"
          trayHeight="default"
          variant={helpPanelVariant}
        />
      ) : null}

      {isHelpPanelOpen ? (
        <>
          <button
            aria-label="Collapse expanded Help assistant"
            className={cx(
              "fixed inset-0 z-30 hidden bg-overlay-dim md:block",
              !isHelpExpanded && "pointer-events-none opacity-0",
            )}
            onClick={handleCollapseHelpPanel}
            type="button"
          />
          <div
            aria-label="Help assistant"
            className={cx(
              "vca-ai-messaging-surface fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform] duration-[var(--design-motion-duration-moderate)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)]",
              helpPanelPositionClass,
            )}
            id="flagship-help-assistant"
            role="dialog"
          >
            <FlagshipHelpPanel
              onClose={handleCloseHelpPanel}
              onDock={handleDockHelpPanel}
              onVariantToggle={handleToggleHelpPanelVariant}
              variant={helpPanelVariant}
            />
          </div>
        </>
      ) : null}
    </main>
  );
}
