export type ComponentNavItem = Readonly<{
  id: string;
  title: string;
  description: string;
  href: string;
}>;

export type ComponentNavGroup = Readonly<{
  title: string;
  eyebrow?: string;
  items: ReadonlyArray<ComponentNavItem>;
}>;

export type ComponentNavSection = Readonly<{
  title: string;
  groups: ReadonlyArray<ComponentNavGroup>;
}>;

export const componentNavGroups: ReadonlyArray<ComponentNavSection> = [
  {
    title: "VCA",
    groups: [
      {
        title: "Core UI",
        items: [
          {
            id: "shared-shell",
            title: "Container",
            description:
              "The overall UI container for the VCA agent chat.",
            href: "/internal/components/shared/shell",
          },
          {
            id: "shared-composer",
            title: "Composer",
            description:
              "Input field that lets users communicate with the AI agent",
            href: "/internal/components/shared/composer",
          },
          {
            id: "shared-header",
            title: "Header",
            description: "Shows name of the AI chat and contains global actions",
            href: "/internal/components/shared/header",
          },
          {
            id: "shared-messages",
            title: "Messages",
            description:
              "Displays chat messages for users, the AI agent, and live agents",
            href: "/internal/components/shared/messages",
          },
          {
            id: "shared-prompts",
            title: "Prompts",
            description:
              "Shows suggested questions or actions that users can choose from",
            href: "/internal/components/shared/prompts",
          },
          {
            id: "shared-side-panel",
            title: "Side panel",
            description:
              "Enables a side panel inside the chat container to keep the user focused",
            href: "/internal/components/shared/side-panel",
          },
        ],
      },
      {
        title: "Interaction patterns",
        items: [
          {
            id: "shared-choice-card",
            title: "Choice card",
            description:
              "Lets users choose one item from a small set of assistant-provided options before continuing.",
            href: "/internal/components/shared/choice-card",
          },
          {
            id: "shared-task-status-card",
            title: "Task status card",
            description:
              "Shows completion status for AI agent run tasks",
            href: "/internal/components/shared/task-status-card",
          },
          {
            id: "shared-voice-mode",
            title: "Voice mode",
            description:
              "Shows compact voice controls with a scripted transcript in the chat thread.",
            href: "/internal/components/shared/voice-mode",
          },
        ],
      },
      {
        title: "States & handoffs",
        items: [
          {
            id: "shared-interim-state",
            title: "Initiating state",
            description:
              "Shows a calm waiting moment while the AI agent is being prepared",
            href: "/internal/components/shared/interim-state",
          },
          {
            id: "shared-response-states",
            title: "Response states",
            description:
              "Shows transient states while the AI prepares, streams, or stops a response.",
            href: "/internal/components/shared/response-states",
          },
          {
            id: "shared-inline-error",
            title: "Inline error",
            description:
              "Shows a failed AI response with a retry action.",
            href: "/internal/components/shared/inline-error",
          },
          {
            id: "shared-idle-session",
            title: "Idle session",
            description:
              "Prompts users to continue or end a chat after inactivity.",
            href: "/internal/components/shared/idle-session",
          },
          {
            id: "shared-live-agent-handoff",
            title: "Live agent handoff",
            description:
              "Connects a user to a live agent and communicates each handoff state.",
            href: "/internal/components/shared/live-agent-handoff",
          },
        ],
      },
      {
        title: "Feedback & completion",
        items: [
          {
            id: "shared-feedback",
            title: "Feedback",
            description:
              "Lets users rate an assistant response and optionally share why.",
            href: "/internal/components/shared/feedback",
          },
          {
            id: "shared-end-chat-csat",
            title: "CSAT",
            description:
              "Lets users rate the overall conversation before ending a chat.",
            href: "/internal/components/shared/end-chat-csat",
          },
        ],
      },
    ],
  },
  {
    title: "Project-specific",
    groups: [
      {
        title: "Hiring microsite",
        items: [
          {
            id: "shared-action-card",
            title: "Sales handoff card",
            description:
              "Connects users with a sales specialist through live chat or a scheduled conversation.",
            href: "/internal/components/shared/sales-card",
          },
          {
            id: "hiring-microsite-microphone-voice-banner",
            title: "Microphone voice banner",
            description:
              "Shows error message to inform user that their microphone access is blocked",
            href: "/internal/components/hiring-microsite/microphone-voice-banner",
          },
          {
            id: "hiring-microsite-email",
            title: "Meeting Email",
            description:
              "Email sent to user after meeting or phone call is booked",
            href: "/internal/components/hiring-microsite/email",
          },
        ],
      },
      {
        title: "Premium survey",
        items: [
          {
            id: "premium-product-recommendation-card",
            title: "SKU card",
            description:
              "Displays Premium SKU recommendations inside a conversation.",
            href: "/internal/components/premium/sku-card",
          },
          {
            id: "premium-survey-entry",
            title: "Entry FAB (Premium survey)",
            description:
              "Opens the Premium concierge from the Premium experience.",
            href: "/internal/components/premium/survey-entry",
          },
        ],
      },
      {
        title: "Premium upsell",
        items: [
          {
            id: "premium-upsell-badge",
            title: "Premium upsell badge",
            description:
              "Promotes the Premium trial offer inside Help Center upsell surfaces.",
            href: "/internal/components/premium-upsell/badge",
          },
          {
            id: "premium-upsell-result-card",
            title: "Premium upsell result card",
            description:
              "Shows a contextual Premium upsell inside search or help result surfaces.",
            href: "/internal/components/premium-upsell/result-card",
          },
        ],
      },
      {
        title: "Premium Company Page",
        items: [
          {
            id: "premium-company-page-data-cards",
            title: "Data cards",
            description:
              "Shows reusable metric, trend, comparison, audience, and content evidence cards used inside PCP responses.",
            href: "/internal/components/premium-company-page/data-cards",
          },
          {
            id: "premium-company-page-entity-cards",
            title: "Entity cards",
            description:
              "Shows reusable product, post, job, people, company, and carousel cards used inside PCP responses.",
            href: "/internal/components/premium-company-page/entity-cards",
          },
          {
            id: "premium-company-page-insight-cards",
            title: "Insight cards",
            description:
              "Showcases the reusable dashboard insight card system, routing rule, and six card types.",
            href: "/internal/components/premium-company-page/insight-cards",
          },
          {
            id: "premium-company-page-side-panel",
            title: "Side panel",
            description:
              "Shows PCP detail panels inside the VCA chat container.",
            href: "/internal/components/premium-company-page/side-panel",
          },
          {
            id: "premium-company-page-vca-fab",
            title: "Entry FAB (Premium Company Page)",
            description:
              "Opens the Premium Company Page VCA from page surfaces.",
            href: "/internal/components/premium-company-page/vca-fab",
          },
        ],
      },
    ],
  },
  {
    title: "SDUI",
    groups: [
      {
        title: "Buttons",
        items: [
          {
            id: "sdui-button",
            title: "Button",
            description:
              "Supports primary and secondary actions across the experience.",
            href: "/internal/components/sdui/button",
          },
          {
            id: "sdui-button-icon",
            title: "Button icon",
            description:
              "Supports compact actions using only an icon.",
            href: "/internal/components/sdui/button-icon",
          },
          {
            id: "sdui-ghost-button",
            title: "Ghost button",
            description:
              "Supports quiet text actions with optional icons, emphasis, and loading states.",
            href: "/internal/components/sdui/ghost-button",
          },
          {
            id: "sdui-ghost-icon-button",
            title: "Ghost icon button",
            description:
              "Supports quieter actions like closing, minimizing, or expanding.",
            href: "/internal/components/sdui/ghost-icon-button",
          },
          {
            id: "sdui-overlay-button-icon",
            title: "Overlay button icon",
            description:
              "Supports icon-only actions on top of media, imagery, or floating surfaces.",
            href: "/internal/components/sdui/overlay-button-icon",
          },
        ],
      },
      {
        title: "Inputs & Choices",
        items: [
          {
            id: "sdui-pill",
            title: "Pill",
            description: "Lets users make a lightweight choice.",
            href: "/internal/components/sdui/pill",
          },
          {
            id: "sdui-radio",
            title: "Radio",
            description: "Shows single-select control states for one-choice inputs.",
            href: "/internal/components/sdui/radio",
          },
          {
            id: "sdui-text-area",
            title: "Text area",
            description: "Captures a longer written response.",
            href: "/internal/components/sdui/text-area",
          },
          {
            id: "sdui-text-input",
            title: "Text input",
            description: "Captures a short text response.",
            href: "/internal/components/sdui/text-input",
          },
        ],
      },
      {
        title: "Navigation",
        items: [
          {
            id: "sdui-global-navigation",
            title: "Global navigation",
            description:
              "Displays LinkedIn's global web navigation with search, primary nav items, profile, and work menu.",
            href: "/internal/components/sdui/global-navigation",
          },
          {
            id: "sdui-nav-link-item-horizontal",
            title: "Nav link item horizontal",
            description:
              "Displays an icon, label, optional badge, optional dropdown caret, and current-state indicator inside navigation bars.",
            href: "/internal/components/sdui/nav-link-item-horizontal",
          },
          {
            id: "sdui-tab-item-horizontal",
            title: "Tab item horizontal",
            description:
              "Displays a 48px horizontal tab item with selected, hover, active, icon, and overflow states.",
            href: "/internal/components/sdui/tab-item-horizontal",
          },
        ],
      },
      {
        title: "Overlays",
        items: [
          {
            id: "sdui-confirmation",
            title: "Confirmation",
            description:
              "Confirms navigation or actions that would clear conversation state.",
            href: "/internal/components/sdui/confirmation",
          },
        ],
      },
      {
        title: "Status",
        items: [
          {
            id: "sdui-badge",
            title: "Badge",
            description:
              "Signals new activity, alerts, or updates.",
            href: "/internal/components/sdui/badge",
          },
          {
            id: "sdui-inline-feedback",
            title: "Inline feedback",
            description:
              "Confirms an action or communicates a concise notice, error, or warning in context.",
            href: "/internal/components/sdui/inline-feedback",
          },
          {
            id: "sdui-presence-badge",
            title: "Presence badge",
            description:
              "Signals whether a person or agent is active or on mobile.",
            href: "/internal/components/sdui/presence-badge",
          },
          {
            id: "sdui-progress-indicator-circular",
            title: "Progress indicator circular",
            description:
              "Communicates that a system action is processing or taking more time.",
            href: "/internal/components/sdui/progress-indicator-circular",
          },
          {
            id: "sdui-tag",
            title: "Tag",
            description: "Labels important status or context.",
            href: "/internal/components/sdui/tag",
          },
        ],
      },
      {
        title: "Visuals",
        items: [
          {
            id: "sdui-entity",
            title: "Entity",
            description:
              "Represents a user, company, or live agent.",
            href: "/internal/components/sdui/entity",
          },
          {
            id: "sdui-icon",
            title: "Icon",
            description:
              "Provides visual cues for actions, statuses, and AI moments.",
            href: "/internal/components/sdui/icon",
          },
          {
            id: "sdui-illustrations",
            title: "Illustrations",
            description:
              "Displays SDUI microspot and scene illustration assets.",
            href: "/internal/components/sdui/illustrations",
          },
          {
            id: "sdui-reaction-icons",
            title: "Reaction icons",
            description:
              "Displays SDUI reaction illustrations for like, praise, support, recommendation, and related signals.",
            href: "/internal/components/sdui/reaction-icons",
          },
        ],
      },
    ],
  },
];

export const componentNavItems: ReadonlyArray<ComponentNavItem> =
  componentNavGroups.flatMap((section) =>
    section.groups.flatMap((group) => group.items),
  );

export const defaultComponentHref = "/internal/components/shared/shell";

const componentRouteAliases: Record<string, string> = {
  "/internal/components/hiring-microsite/generic-inline-error":
    "/internal/components/shared/inline-error",
  "/internal/components/premium/product-recommendation-card":
    "/internal/components/premium/sku-card",
  "/internal/components/shared/action-card": "/internal/components/shared/sales-card",
};

export function getComponentNavItem(slug: ReadonlyArray<string>) {
  const href = `/internal/components/${slug.join("/")}`;

  return componentNavItems.find((item) => item.href === href);
}

export function getComponentRedirectHref(slug: ReadonlyArray<string>) {
  const href = `/internal/components/${slug.join("/")}`;

  return componentRouteAliases[href];
}
