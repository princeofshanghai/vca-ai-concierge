"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  CHAT_PANEL_TRAY_TRANSITION_MS,
  ChatBody,
  ChatComposer,
  ChatHeader,
  ChatMessage,
  ChatMessageContent,
  ChatMessageFeedbackFlow,
  ChatPanel,
  ChatResponseAttachment,
  ChatThread,
  ChatTray,
  Prompt,
  startChatPanelViewTransition,
  useChatPanelPresence,
  type ChatPanelVariant,
} from "@/components/chat";
import { PremiumProductRecommendationCard } from "@/components/premium/premium-product-recommendation-card";
import { PremiumUpsellBadge } from "@/components/premium-upsell";
import { Button } from "@/components/primitives/button";
import { ChoiceCard } from "@/components/premium-company-pages/response-blocks/ChoiceCard";
import {
  TaskStatusCard,
  type TaskStatusCardState,
} from "@/components/premium-company-pages/response-blocks/TaskStatusCard";
import { Entity } from "@/components/primitives/entity";
import { Icon, type IconName } from "@/components/primitives/icon";
import { getPrototypeMessageTimestamp } from "@/lib/prototype-timestamps";

const shortcuts = [
  "Recruiter Lite Help",
  "Post a job in Recruiter",
  "AI features in LinkedIn Recruiter",
  "Cancel your Recruiter account",
  "Projects in Recruiter and Recruiter Lite",
  "Manage billing on behalf of your company",
] as const;

const topics: ReadonlyArray<{
  icon: IconName;
  label: string;
  tone: "action" | "accent";
}> = [
  { icon: "company", label: "Admin", tone: "action" },
  { icon: "lightbulb", label: "Basics", tone: "accent" },
  { icon: "person", label: "Manage Users", tone: "accent" },
  { icon: "job", label: "Recruiter Lite", tone: "accent" },
  { icon: "document", label: "Projects", tone: "action" },
  { icon: "envelope", label: "InMail and Inbox", tone: "action" },
];

const helpAssistantPrompts = [
  "How do I find my InMail credits?",
  "How can admins manage permissions for other admins?",
  "Help me remove a user",
] as const;

const removeUserNextPrompts = [
  "Reassign license",
  "Park license",
  "Remove user",
] as const;

const removeUserConfirmationPrompts = ["Yes, remove", "No"] as const;

const removeUserMatchTemplates = [
  {
    id: "chen",
    familyName: "Chen",
    avatarSrc: "/assets/premium-company-pages/avatar-1.png",
  },
  {
    id: "patel",
    familyName: "Patel",
    avatarSrc: "/assets/premium-company-pages/avatar-2.png",
  },
  {
    id: "rivera",
    familyName: "Rivera",
    avatarSrc: "/assets/premium-company-pages/avatar-3.png",
  },
] as const;

function getPrototypeNameFromSearch(value: string) {
  const valueBeforeDomain = value.split("@")[0] ?? value;
  const normalizedValue = valueBeforeDomain
    .replace(/[._-]+/g, " ")
    .replace(/[^a-zA-Z\s]/g, " ")
    .trim();
  const [firstToken] = normalizedValue.split(/\s+/).filter(Boolean);

  if (!firstToken) {
    return "Alex";
  }

  return `${firstToken.charAt(0).toUpperCase()}${firstToken
    .slice(1)
    .toLowerCase()}`;
}

function getPrototypeUserMatches(searchValue: string) {
  const givenName = getPrototypeNameFromSearch(searchValue);
  const emailGivenName = givenName.toLowerCase();

  return removeUserMatchTemplates.map((template) => {
    const name = `${givenName} ${template.familyName}`;

    return {
      id: `${emailGivenName}-${template.id}`,
      name,
      email: `${emailGivenName}.${template.id}@example.com`,
      avatarSrc: template.avatarSrc,
    };
  });
}

type VcaEcosystemHelpCenterPageProps = Readonly<{
  premiumUpsellBadgeAction?: "open-premium-chat";
  premiumUpsellBadgeHref?: string;
  showPremiumUpsellBadge?: boolean;
}>;

type HelpCenterChatMode = "support" | "premium-recommendation";

function TopicCard({
  icon,
  label,
  tone,
}: Readonly<(typeof topics)[number]>) {
  const colorClassName = tone === "action" ? "text-[#0073B1]" : "text-[#6E5BD8]";

  return (
    <article className="flex min-h-[108px] items-center justify-center rounded-xs border border-border-faint bg-background px-md text-center shadow-[inset_0_0_0_1px_rgba(140,140,140,0.08)]">
      <div
        className={`flex min-w-0 flex-col items-center gap-md ${colorClassName}`}
      >
        <Icon name={icon} size="medium" className="[&&]:size-6" />
        <h3 className="text-[14px] font-semibold leading-[18px] tracking-normal">
          {label}
        </h3>
      </div>
    </article>
  );
}

function HelpLogo() {
  return (
    <div className="flex items-center gap-md">
      <Image
        src="/assets/linkedin-bug.svg"
        alt="LinkedIn"
        width={34}
        height={34}
        priority
        className="size-[34px] shrink-0"
      />
      <span className="text-[24px] font-semibold leading-[30px] tracking-normal">
        Help
      </span>
    </div>
  );
}

function SearchBar() {
  return (
    <div
      role="search"
      aria-label="Help center search"
      className="grid min-h-[42px] max-w-[798px] grid-cols-1 overflow-hidden rounded-xs bg-background text-text shadow-sm sm:grid-cols-[130px_minmax(0,1fr)_42px]"
    >
      <div className="flex items-center justify-between gap-md border-b border-border-faint px-md text-[17px] font-semibold leading-[22px] text-text-meta sm:border-b-0 sm:border-r">
        <span>Recruiter</span>
        <Icon name="caret-down" size="small" className="text-icon" />
      </div>
      <div className="flex min-h-[42px] items-center px-md text-[17px] font-normal leading-[22px] text-text-meta">
        Ask or search anything
      </div>
      <div className="hidden items-center justify-center border-l border-border-faint text-icon sm:flex">
        <Icon name="search" size="medium" className="[&&]:size-5" />
      </div>
    </div>
  );
}

function Shortcuts() {
  return (
    <section aria-labelledby="recruiter-shortcuts-title">
      <h2
        id="recruiter-shortcuts-title"
        className="text-[18px] font-semibold leading-[24px] tracking-normal text-text"
      >
        Recruiter shortcuts
      </h2>
      <div className="mt-[24px] grid gap-x-[54px] gap-y-[18px] md:grid-cols-2">
        {shortcuts.map((shortcut) => (
          <p
            key={shortcut}
            className="text-[16px] font-semibold leading-[22px] tracking-normal text-[#0073B1]"
          >
            {shortcut}
          </p>
        ))}
      </div>
    </section>
  );
}

function RecommendedTopics() {
  return (
    <section aria-labelledby="recommended-topics-title" className="mt-[66px]">
      <div className="flex items-center justify-between gap-xl">
        <h2
          id="recommended-topics-title"
          className="text-[18px] font-semibold leading-[24px] tracking-normal text-text"
        >
          Recommended topics
        </h2>
        <span className="shrink-0 text-[16px] font-semibold leading-[20px] tracking-normal text-[#6E5BD8]">
          View all
        </span>
      </div>
      <div className="mt-[26px] grid gap-[24px] md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.label} {...topic} />
        ))}
      </div>
    </section>
  );
}

type SupportCardProps = Readonly<{
  chatPanelId: string;
  isChatOpen: boolean;
  onStartChat: () => void;
}>;

function SupportCard({
  chatPanelId,
  isChatOpen,
  onStartChat,
}: SupportCardProps) {
  return (
    <aside
      aria-labelledby="recruiter-support-title"
      className="border-t border-border-faint px-lg py-[36px] lg:border-l lg:border-t-0 lg:px-[26px]"
    >
      <h2
        id="recruiter-support-title"
        className="text-[18px] font-semibold leading-[24px] tracking-normal text-text"
      >
        Contact Recruiter support
      </h2>
      <div className="mt-[24px] flex min-h-[123px] items-start gap-[21px] rounded-xs border border-border-faint bg-background px-[21px] py-[22px] shadow-[0_2px_6px_rgba(0,0,0,0.16)]">
        <Image
          src="/assets/vca-ecosystem/chat-support-illustration.png"
          alt=""
          width={122}
          height={112}
          className="mt-[1px] h-auto w-[52px] shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold leading-[18px] tracking-normal text-text">
            Chat with support
          </h3>
          <p className="mt-xxs text-[12px] font-normal leading-[16px] tracking-normal text-text">
            Online now
          </p>
          <Button
            variant="secondary"
            size="small"
            aria-controls={isChatOpen ? chatPanelId : undefined}
            aria-expanded={isChatOpen}
            aria-haspopup="dialog"
            className="mt-sm border-[#0073B1] px-md text-[#0073B1] hover:border-[#0073B1] hover:bg-[#0073B1]/10 hover:text-[#0073B1] hover:shadow-[inset_0_0_0_1px_#0073B1] active:border-[#0073B1] active:bg-[#0073B1]/20 active:text-[#0073B1] focus-visible:ring-[#0073B1]/15"
            onClick={onStartChat}
          >
            Start Chat
          </Button>
        </div>
      </div>
    </aside>
  );
}

type HelpAssistantPanelProps = Readonly<{
  className?: string;
  mode: HelpCenterChatMode;
  removeUserDraft: string;
  removeUserSearchQuery: string;
  showRemoveUserConfirmation: boolean;
  removeUserTaskState: TaskStatusCardState | null;
  selectedRemoveUserId: string | null;
  showRemoveUserEntry: boolean;
  showRemoveUserGuidance: boolean;
  variant: ChatPanelVariant;
  onClose: () => void;
  onMinimizeToTray: () => void;
  onRemoveUserActionSelect: () => void;
  onRemoveUserDraftChange: (value: string) => void;
  onRemoveUserLookupSubmit: () => void;
  onRemoveUserConfirm: () => void;
  onRemoveUserSelectionContinue: () => void;
  onRemoveUserPromptSelect: () => void;
  onRemoveUserSelectionChange: (id: string) => void;
  onVariantToggle: () => void;
}>;

function HelpAssistantPanel({
  className,
  mode,
  removeUserDraft,
  removeUserSearchQuery,
  showRemoveUserConfirmation,
  removeUserTaskState,
  selectedRemoveUserId,
  showRemoveUserEntry,
  showRemoveUserGuidance,
  variant,
  onClose,
  onMinimizeToTray,
  onRemoveUserActionSelect,
  onRemoveUserDraftChange,
  onRemoveUserLookupSubmit,
  onRemoveUserConfirm,
  onRemoveUserSelectionContinue,
  onRemoveUserPromptSelect,
  onRemoveUserSelectionChange,
  onVariantToggle,
}: HelpAssistantPanelProps) {
  const removeUserNextPromptsRef = useRef<HTMLDivElement | null>(null);
  const removeUserEntryRef = useRef<HTMLDivElement | null>(null);
  const removeUserMatchesRef = useRef<HTMLDivElement | null>(null);
  const removeUserConfirmationRef = useRef<HTMLDivElement | null>(null);
  const removeUserTaskStatusRef = useRef<HTMLDivElement | null>(null);
  const hasRemoveUserSearchQuery = removeUserSearchQuery.trim().length > 0;
  const removeUserMatches = hasRemoveUserSearchQuery
    ? getPrototypeUserMatches(removeUserSearchQuery)
    : [];
  const selectedRemoveUser =
    removeUserMatches.find((person) => person.id === selectedRemoveUserId) ??
    null;
  const isPremiumRecommendationMode = mode === "premium-recommendation";

  useEffect(() => {
    if (!showRemoveUserGuidance) {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      removeUserNextPromptsRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [showRemoveUserGuidance]);

  useEffect(() => {
    if (!showRemoveUserEntry) {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      removeUserEntryRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [showRemoveUserEntry]);

  useEffect(() => {
    if (!hasRemoveUserSearchQuery) {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      removeUserMatchesRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [hasRemoveUserSearchQuery, removeUserSearchQuery]);

  useEffect(() => {
    if (!showRemoveUserConfirmation) {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      removeUserConfirmationRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [showRemoveUserConfirmation]);

  useEffect(() => {
    if (!removeUserTaskState) {
      return;
    }

    const scrollFrame = window.requestAnimationFrame(() => {
      removeUserTaskStatusRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [removeUserTaskState]);

  return (
    <ChatPanel className={className} variant={variant}>
      <ChatHeader
        variant={variant}
        title="Help assistant"
        showAiMark={false}
        onClose={onClose}
        onMinimizeToTray={onMinimizeToTray}
        onVariantToggle={onVariantToggle}
      />
      <ChatBody>
        {isPremiumRecommendationMode ? (
          <ChatThread>
            <div className="flex flex-col items-start">
              <ChatMessage>
                <ChatMessageContent>
                  <p>
                    Great, I can help you get started with Premium.
                  </p>
                  <p>
                    For a personal trial, Premium Career is the best place to
                    start because it&apos;s built for job search and career
                    growth. It can help you see jobs where you may be a top
                    applicant, mark top choice jobs, and message hiring
                    managers directly.
                  </p>
                  <p>
                    You can also{" "}
                    <Link href="/premium/learn-more">
                      browse all plans here
                    </Link>{" "}
                    if you&apos;d like to compare options.
                  </p>
                </ChatMessageContent>
              </ChatMessage>
              <ChatResponseAttachment gap="sm">
                <PremiumProductRecommendationCard
                  displayName="Premium Career"
                  planId="career"
                />
              </ChatResponseAttachment>
              <ChatMessageFeedbackFlow
                className="mt-sm"
                timestamp={getPrototypeMessageTimestamp(0)}
              />
            </div>
          </ChatThread>
        ) : (
          <ChatThread>
            <div className="flex flex-col items-start">
              <ChatMessage>
                <ChatMessageContent>
                  <p>
                    Hi there. With the help of AI, I can answer questions about
                    Recruiter solutions or connect you to our team.
                  </p>
                  <p>Not sure where to start? You can try:</p>
                </ChatMessageContent>
              </ChatMessage>
              {!showRemoveUserGuidance ? (
                <ChatResponseAttachment gap="sm">
                  <div className="flex flex-wrap gap-sm">
                    {helpAssistantPrompts.map((prompt) => (
                      <Prompt
                        key={prompt}
                        prompt={prompt}
                        onPromptSelect={
                          prompt === "Help me remove a user"
                            ? onRemoveUserPromptSelect
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </ChatResponseAttachment>
              ) : null}
              <p className="mt-sm text-body-xs text-text-meta">
                {getPrototypeMessageTimestamp(0)}
              </p>
            </div>
            {showRemoveUserGuidance ? (
            <>
              <ChatMessage
                role="user"
                timestamp={getPrototypeMessageTimestamp(1)}
              >
                Help me remove a user
              </ChatMessage>
              <div className="flex flex-col items-start">
                <ChatMessage>
                  <ChatMessageContent>
                    <p>
                      Got it. Heads up, removing a user deletes them from your
                      dashboard and frees up their license. The user loses
                      access to all data tied to the license, like projects and
                      saved searches. Removing a user is best when permanently
                      offboarding users.
                    </p>
                    <p>
                      If you&apos;d like to preserve data access, consider these
                      other options:
                    </p>
                    <ul>
                      <li>
                        <strong>Reassign the license:</strong> transfer data to
                        another user.
                      </li>
                      <li>
                        <strong>Park the license:</strong> temporarily
                        deactivate the license but preserve the data.
                      </li>
                      <li>
                        <strong>Unpark a license:</strong> reactivate a
                        previously parked user.
                      </li>
                    </ul>
                    <p>How would you like to proceed?</p>
                  </ChatMessageContent>
                </ChatMessage>
                {!showRemoveUserEntry ? (
                  <ChatResponseAttachment gap="sm">
                    <div
                      ref={removeUserNextPromptsRef}
                      className="flex flex-wrap gap-sm"
                    >
                      {removeUserNextPrompts.map((prompt) => (
                        <Prompt
                          key={prompt}
                          prompt={prompt}
                          onPromptSelect={
                            prompt === "Remove user"
                              ? onRemoveUserActionSelect
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </ChatResponseAttachment>
                ) : null}
                <ChatMessageFeedbackFlow
                  className="mt-sm"
                  timestamp={getPrototypeMessageTimestamp(2)}
                />
              </div>
              {showRemoveUserEntry ? (
                <>
                  <ChatMessage
                    role="user"
                    timestamp={getPrototypeMessageTimestamp(3)}
                  >
                    Remove user
                  </ChatMessage>
                  <div
                    ref={removeUserEntryRef}
                    className="flex flex-col items-start"
                  >
                    <ChatMessage>
                      <ChatMessageContent>
                        <p>
                          Sure. Enter the user&apos;s name or email and
                          I&apos;ll remove them for you. If you prefer to do it
                          on your own, I can{" "}
                          <a
                            href="#"
                            onClick={(event) => event.preventDefault()}
                          >
                            guide you step-by-step
                          </a>
                          {"."}
                        </p>
                      </ChatMessageContent>
                    </ChatMessage>
                    <ChatMessageFeedbackFlow
                      className="mt-sm"
                      timestamp={getPrototypeMessageTimestamp(4)}
                    />
                  </div>
                  {hasRemoveUserSearchQuery ? (
                    <>
                      <ChatMessage
                        role="user"
                        timestamp={getPrototypeMessageTimestamp(5)}
                      >
                        {removeUserSearchQuery}
                      </ChatMessage>
                      <div
                        ref={removeUserMatchesRef}
                        className="flex flex-col items-start"
                      >
                        <ChatMessage>
                          <ChatMessageContent>
                            <p>
                              Thanks, I found a few people who could match
                              that. Choose the right person below and I&apos;ll
                              help you remove them.
                            </p>
                          </ChatMessageContent>
                        </ChatMessage>
                        <ChatResponseAttachment gap="sm">
                          <ChoiceCard
                            title="Choose person"
                            options={removeUserMatches.map((person) => ({
                              id: person.id,
                              label: person.name,
                              description: person.email,
                              visual: (
                                <Entity
                                  size={40}
                                  src={person.avatarSrc}
                                />
                              ),
                            }))}
                            selectedId={selectedRemoveUserId}
                            actionLabel="Continue"
                            actionDisabled={!selectedRemoveUserId}
                            onAction={onRemoveUserSelectionContinue}
                            onSelectionChange={onRemoveUserSelectionChange}
                          />
                        </ChatResponseAttachment>
                        <ChatMessageFeedbackFlow
                          className="mt-sm"
                          timestamp={getPrototypeMessageTimestamp(6)}
                        />
                      </div>
                      {showRemoveUserConfirmation && selectedRemoveUser ? (
                        <div
                          ref={removeUserConfirmationRef}
                          className="flex flex-col items-start"
                        >
                          <ChatMessage>
                            <ChatMessageContent>
                              <p>
                                Got it. To confirm, I will remove{" "}
                                <strong>
                                  {selectedRemoveUser.name} (
                                  {selectedRemoveUser.email})
                                </strong>{" "}
                                from your dashboard Flexis Recruiter.
                              </p>
                            </ChatMessageContent>
                          </ChatMessage>
                          <ChatResponseAttachment gap="sm">
                            <div className="flex flex-wrap gap-sm">
                              {removeUserConfirmationPrompts.map((prompt) => (
                                <Prompt
                                  key={prompt}
                                  prompt={prompt}
                                  disabled={Boolean(removeUserTaskState)}
                                  onPromptSelect={
                                    prompt === "Yes, remove"
                                      ? onRemoveUserConfirm
                                      : undefined
                                  }
                                />
                              ))}
                            </div>
                          </ChatResponseAttachment>
                          <ChatMessageFeedbackFlow
                            className="mt-sm"
                            timestamp={getPrototypeMessageTimestamp(7)}
                          />
                        </div>
                      ) : null}
                      {removeUserTaskState && selectedRemoveUser ? (
                        <>
                          <ChatMessage
                            role="user"
                            timestamp={getPrototypeMessageTimestamp(8)}
                          >
                            Yes, remove
                          </ChatMessage>
                          <div
                            ref={removeUserTaskStatusRef}
                            className="flex flex-col items-start"
                          >
                            <ChatResponseAttachment gap="sm">
                              <TaskStatusCard
                                state={removeUserTaskState}
                                title={
                                  removeUserTaskState === "completed"
                                    ? "User removed from Flexis Recruiter"
                                    : "Removing user..."
                                }
                                description={
                                  removeUserTaskState === "completed" ? (
                                    <p>
                                      You can view the updates in the{" "}
                                      <a
                                        href="#"
                                        onClick={(event) =>
                                          event.preventDefault()
                                        }
                                      >
                                        Users &amp; License Management
                                      </a>{" "}
                                      tab in Admin Center.
                                    </p>
                                  ) : undefined
                                }
                              />
                            </ChatResponseAttachment>
                            {removeUserTaskState === "completed" ? (
                              <ChatMessageFeedbackFlow
                                className="mt-sm"
                                timestamp={getPrototypeMessageTimestamp(9)}
                              />
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : null}
                </>
              ) : null}
            </>
            ) : null}
          </ChatThread>
        )}
      </ChatBody>
      <ChatComposer
        variant={variant}
        inputProps={{
          "aria-label": showRemoveUserEntry
            ? "Enter a name or email to find a user"
            : "Message",
          disabled: isPremiumRecommendationMode || !showRemoveUserEntry,
          onChange: (event: ChangeEvent<HTMLTextAreaElement>) =>
            onRemoveUserDraftChange(event.currentTarget.value),
          placeholder: showRemoveUserEntry
            ? "Enter a name or email"
            : "Send a message",
          value: removeUserDraft,
        }}
        onSend={onRemoveUserLookupSubmit}
        sendDisabled={
          isPremiumRecommendationMode ||
          !showRemoveUserEntry ||
          removeUserDraft.trim().length === 0
        }
        showVoiceMode={false}
      />
    </ChatPanel>
  );
}

export function VcaEcosystemHelpCenterPage({
  premiumUpsellBadgeAction,
  premiumUpsellBadgeHref,
  showPremiumUpsellBadge = false,
}: VcaEcosystemHelpCenterPageProps) {
  const [chatPanelVariant, setChatPanelVariant] =
    useState<ChatPanelVariant>("collapsed");
  const [chatMode, setChatMode] = useState<HelpCenterChatMode>("support");
  const [isHybridTrayVisible, setIsHybridTrayVisible] = useState(false);
  const [isChatTrayOpeningBridgeVisible, setIsChatTrayOpeningBridgeVisible] =
    useState(false);
  const [showRemoveUserGuidance, setShowRemoveUserGuidance] = useState(false);
  const [showRemoveUserEntry, setShowRemoveUserEntry] = useState(false);
  const [showRemoveUserConfirmation, setShowRemoveUserConfirmation] =
    useState(false);
  const [removeUserTaskState, setRemoveUserTaskState] =
    useState<TaskStatusCardState | null>(null);
  const [removeUserDraft, setRemoveUserDraft] = useState("");
  const [removeUserSearchQuery, setRemoveUserSearchQuery] = useState("");
  const [selectedRemoveUserId, setSelectedRemoveUserId] = useState<
    string | null
  >(null);
  const removeUserTaskCompletionTimerRef = useRef<number | null>(null);
  const chatPanelId = useId();
  const {
    presence: chatPanelPresence,
    isMounted: isChatMounted,
    isOpen: isChatOpen,
    isInteractive: isChatInteractive,
    open: openChatPanel,
    close: closeChatPanel,
  } = useChatPanelPresence({
    closeTransitionMs: CHAT_PANEL_TRAY_TRANSITION_MS,
  });
  const isCenteredChatSurface = chatPanelVariant === "expanded";
  const isBottomAttachedChatSurface = !isCenteredChatSurface;
  const isChatTrayOpeningBridgeActive =
    chatPanelPresence === "open" && isChatTrayOpeningBridgeVisible;
  const usesHeaderDockMotion = isHybridTrayVisible;
  const shouldRenderChatTray =
    isHybridTrayVisible &&
    (chatPanelPresence === "closed" ||
      chatPanelPresence === "entering" ||
      isChatTrayOpeningBridgeActive);
  const chatPanelPositionClass = isBottomAttachedChatSurface
    ? "md:right-6 md:bottom-0 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-collapsed-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-collapsed-width))]"
    : "md:top-1/2 md:left-1/2 md:h-[min(calc(100dvh_-_48px),var(--design-layout-panel-expanded-height))] md:w-[min(calc(100vw_-_48px),var(--design-layout-panel-expanded-width))] md:-translate-x-1/2 md:-translate-y-1/2";
  const chatPanelFrameClass = isBottomAttachedChatSurface
    ? "md:!h-full md:!w-full md:!rounded-t-md md:!rounded-b-none"
    : "md:!h-full md:!w-full";

  const openChat = useCallback(() => {
    const isOpeningFromTray =
      isHybridTrayVisible && chatPanelPresence === "closed";

    if (!isOpeningFromTray) {
      setChatPanelVariant("collapsed");
    }

    setIsChatTrayOpeningBridgeVisible(isOpeningFromTray);
    openChatPanel();
  }, [chatPanelPresence, isHybridTrayVisible, openChatPanel]);

  const clearRemoveUserTaskCompletionTimer = useCallback(() => {
    if (removeUserTaskCompletionTimerRef.current === null) {
      return;
    }

    window.clearTimeout(removeUserTaskCompletionTimerRef.current);
    removeUserTaskCompletionTimerRef.current = null;
  }, []);

  const openSupportChat = useCallback(() => {
    setChatMode("support");
    openChat();
  }, [openChat]);

  const openPremiumUpsellChat = useCallback(() => {
    clearRemoveUserTaskCompletionTimer();
    setChatMode("premium-recommendation");
    setShowRemoveUserGuidance(false);
    setShowRemoveUserEntry(false);
    setShowRemoveUserConfirmation(false);
    setRemoveUserTaskState(null);
    setRemoveUserDraft("");
    setRemoveUserSearchQuery("");
    setSelectedRemoveUserId(null);
    openChat();
  }, [clearRemoveUserTaskCompletionTimer, openChat]);

  const closeChat = useCallback(() => {
    clearRemoveUserTaskCompletionTimer();
    setChatPanelVariant("collapsed");
    setChatMode("support");
    setIsHybridTrayVisible(false);
    setIsChatTrayOpeningBridgeVisible(false);
    setShowRemoveUserGuidance(false);
    setShowRemoveUserEntry(false);
    setShowRemoveUserConfirmation(false);
    setRemoveUserTaskState(null);
    setRemoveUserDraft("");
    setRemoveUserSearchQuery("");
    setSelectedRemoveUserId(null);
    closeChatPanel();
  }, [clearRemoveUserTaskCompletionTimer, closeChatPanel]);

  const minimizeChatToTray = useCallback(() => {
    setChatPanelVariant("collapsed");
    setIsChatTrayOpeningBridgeVisible(false);
    setIsHybridTrayVisible(true);
    closeChatPanel();
  }, [closeChatPanel]);

  const toggleChatPanelVariant = useCallback(() => {
    const toggleVariant = () => {
      setChatPanelVariant((variant) =>
        variant === "collapsed" ? "expanded" : "collapsed",
      );
    };

    if (!startChatPanelViewTransition(toggleVariant)) {
      toggleVariant();
    }
  }, []);

  const collapseChatPanelVariant = useCallback(() => {
    const collapseVariant = () => {
      setChatPanelVariant("collapsed");
    };

    if (!startChatPanelViewTransition(collapseVariant)) {
      collapseVariant();
    }
  }, []);

  const selectRemoveUserAction = useCallback(() => {
    clearRemoveUserTaskCompletionTimer();
    setShowRemoveUserEntry(true);
    setShowRemoveUserConfirmation(false);
    setRemoveUserTaskState(null);
    setRemoveUserDraft("");
    setRemoveUserSearchQuery("");
    setSelectedRemoveUserId(null);
  }, [clearRemoveUserTaskCompletionTimer]);

  const submitRemoveUserLookup = useCallback(() => {
    const nextSearchQuery = removeUserDraft.trim();

    if (!nextSearchQuery) {
      return;
    }

    clearRemoveUserTaskCompletionTimer();
    setRemoveUserSearchQuery(nextSearchQuery);
    setRemoveUserDraft("");
    setSelectedRemoveUserId(null);
    setShowRemoveUserConfirmation(false);
    setRemoveUserTaskState(null);
  }, [clearRemoveUserTaskCompletionTimer, removeUserDraft]);

  const continueWithSelectedRemoveUser = useCallback(() => {
    if (!selectedRemoveUserId) {
      return;
    }

    setShowRemoveUserConfirmation(true);
  }, [selectedRemoveUserId]);

  const selectRemoveUserMatch = useCallback((id: string) => {
    clearRemoveUserTaskCompletionTimer();
    setSelectedRemoveUserId(id);
    setShowRemoveUserConfirmation(false);
    setRemoveUserTaskState(null);
  }, [clearRemoveUserTaskCompletionTimer]);

  const confirmRemoveUser = useCallback(() => {
    clearRemoveUserTaskCompletionTimer();
    setRemoveUserTaskState("in-progress");

    removeUserTaskCompletionTimerRef.current = window.setTimeout(() => {
      removeUserTaskCompletionTimerRef.current = null;
      setRemoveUserTaskState("completed");
    }, 1500);
  }, [clearRemoveUserTaskCompletionTimer]);

  useEffect(() => {
    return () => {
      clearRemoveUserTaskCompletionTimer();
    };
  }, [clearRemoveUserTaskCompletionTimer]);

  useEffect(() => {
    if (!isChatTrayOpeningBridgeVisible || chatPanelPresence !== "open") {
      return;
    }

    const bridgeTimer = window.setTimeout(() => {
      setIsChatTrayOpeningBridgeVisible(false);
      setIsHybridTrayVisible(false);
    }, CHAT_PANEL_TRAY_TRANSITION_MS);

    return () => {
      window.clearTimeout(bridgeTimer);
    };
  }, [chatPanelPresence, isChatTrayOpeningBridgeVisible]);

  useEffect(() => {
    if (!isChatMounted && !isHybridTrayVisible) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeChat();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeChat, isChatMounted, isHybridTrayVisible]);

  return (
    <main className="min-h-dvh bg-background text-text">
      <header className="bg-[#0073B1] text-on-action">
        <div className="mx-auto flex h-[78px] max-w-[1210px] items-center justify-between px-lg sm:px-[30px] xl:px-0">
          <HelpLogo />
          <div className="flex items-center gap-sm">
            {showPremiumUpsellBadge && premiumUpsellBadgeHref ? (
              <Link
                href={premiumUpsellBadgeHref}
                className="inline-flex rounded-round outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
              >
                <PremiumUpsellBadge variant="solid" />
              </Link>
            ) : showPremiumUpsellBadge &&
              premiumUpsellBadgeAction === "open-premium-chat" ? (
              <button
                type="button"
                aria-controls={isChatOpen ? chatPanelId : undefined}
                aria-expanded={
                  isChatOpen && chatMode === "premium-recommendation"
                }
                aria-haspopup="dialog"
                className="inline-flex rounded-round outline-none focus-visible:ring-4 focus-visible:ring-action-focus-ring"
                onClick={openPremiumUpsellChat}
              >
                <PremiumUpsellBadge variant="solid" />
              </button>
            ) : showPremiumUpsellBadge ? (
              <PremiumUpsellBadge variant="solid" />
            ) : null}
            <Entity
              size={24}
              src="/assets/premium-company-pages/avatar-2.png"
              label="Charles"
            />
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="mx-auto max-w-[1210px] px-lg pb-[35px] pt-[36px] sm:px-[30px] xl:px-0">
            <h1 className="text-[34px] font-normal leading-[42px] tracking-normal">
              {"Hi Charles, we're here to help."}
            </h1>
            <div className="mt-[20px]">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1210px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_392px]">
        <div className="px-lg py-[36px] sm:px-[30px] xl:pl-0 xl:pr-[24px]">
          <Shortcuts />
          <RecommendedTopics />
        </div>
        <SupportCard
          chatPanelId={chatPanelId}
          isChatOpen={isChatOpen}
          onStartChat={openSupportChat}
        />
      </div>

      {shouldRenderChatTray ? (
        <ChatTray
          variant={chatPanelVariant}
          aria-controls={chatPanelId}
          aria-expanded={false}
          aria-haspopup="dialog"
          aria-hidden={isChatTrayOpeningBridgeActive}
          aria-label="Open Help assistant"
          className={[
            "fixed bottom-0 left-4 right-4 z-40 mx-auto w-[calc(100vw_-_32px)] max-w-[var(--design-layout-chat-tray-width)] md:left-auto md:right-6 md:mx-0 md:w-[min(calc(100vw_-_48px),var(--design-layout-chat-tray-width))]",
            isChatTrayOpeningBridgeActive ? "pointer-events-none" : "",
          ].join(" ")}
          inert={isChatTrayOpeningBridgeActive}
          title="Help assistant"
          showAiMark={false}
          showCloseAction
          trayHeight="header"
          onOpen={openChat}
          onClose={closeChat}
        />
      ) : null}

      {isChatMounted ? (
        <>
          <button
            type="button"
            aria-label="Collapse expanded chat"
            tabIndex={-1}
            className={[
              "fixed inset-0 z-30 hidden cursor-default bg-overlay-dim transition-opacity duration-[var(--design-motion-duration-moderate)] ease-emphasized focus:outline-none motion-reduce:duration-[var(--design-motion-duration-instant)] md:block",
              chatPanelVariant === "expanded" && isChatInteractive
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            ].join(" ")}
            onClick={collapseChatPanelVariant}
          />

          <div
            id={chatPanelId}
            role="dialog"
            aria-label="Help assistant chat"
            aria-hidden={!isChatOpen}
            inert={!isChatOpen}
            className={[
              "concierge-chat-panel fixed inset-[var(--design-layout-mobile-panel-inset)] z-40 w-[var(--design-layout-mobile-panel-width)] transition-[width,height,top,left,right,bottom,transform,opacity] duration-[var(--design-motion-duration-slow)] ease-emphasized motion-reduce:duration-[var(--design-motion-duration-instant)] md:inset-auto",
              chatPanelPositionClass,
              isChatOpen ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
          >
            <div
              className={[
                "h-full w-full ease-emphasized motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:duration-[var(--design-motion-duration-instant)]",
                chatPanelPresence === "entering" || chatPanelPresence === "closed"
                  ? "transition-none"
                  : "transition-transform duration-[var(--design-motion-duration-slow)]",
                isChatInteractive
                  ? "translate-y-0 opacity-100"
                  : usesHeaderDockMotion &&
                      (chatPanelPresence === "entering" ||
                        chatPanelPresence === "exiting")
                    ? "pointer-events-none chat-panel-header-dock-offset opacity-100"
                  : "pointer-events-none translate-y-full opacity-100",
              ].join(" ")}
            >
              <HelpAssistantPanel
                className={chatPanelFrameClass}
                mode={chatMode}
                removeUserDraft={removeUserDraft}
                removeUserSearchQuery={removeUserSearchQuery}
                showRemoveUserConfirmation={showRemoveUserConfirmation}
                removeUserTaskState={removeUserTaskState}
                selectedRemoveUserId={selectedRemoveUserId}
                showRemoveUserEntry={showRemoveUserEntry}
                showRemoveUserGuidance={showRemoveUserGuidance}
                variant={chatPanelVariant}
                onClose={closeChat}
                onMinimizeToTray={minimizeChatToTray}
                onRemoveUserActionSelect={selectRemoveUserAction}
                onRemoveUserDraftChange={setRemoveUserDraft}
                onRemoveUserLookupSubmit={submitRemoveUserLookup}
                onRemoveUserConfirm={confirmRemoveUser}
                onRemoveUserSelectionContinue={continueWithSelectedRemoveUser}
                onRemoveUserPromptSelect={() => setShowRemoveUserGuidance(true)}
                onRemoveUserSelectionChange={selectRemoveUserMatch}
                onVariantToggle={toggleChatPanelVariant}
              />
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
