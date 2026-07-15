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
    title: "VCA components",
    groups: [
      {
        title: "Cards",
        items: [
          {
            id: "shared-choice-card",
            title: "Choice card",
            description:
              "Lets visitors choose one item from a small set of assistant-provided options before continuing.",
            href: "/internal/components/shared/choice-card",
          },
          {
            id: "shared-task-status-card",
            title: "Task status card",
            description:
              "Shows in-progress and completed states for assistant-run tasks.",
            href: "/internal/components/shared/task-status-card",
          },
        ],
      },
      {
        title: "Shared",
        items: [
          {
            id: "shared-composer",
            title: "Composer",
            description:
              "Lets members or visitors type and send a message to the concierge.",
            href: "/internal/components/shared/composer",
          },
          {
            id: "shared-end-chat-csat",
            title: "End chat CSAT",
            description:
              "Lets visitors rate the overall conversation before ending a chat.",
            href: "/internal/components/shared/end-chat-csat",
          },
          {
            id: "shared-feedback",
            title: "Feedback",
            description:
              "Lets visitors rate an assistant response and optionally share why.",
            href: "/internal/components/shared/feedback",
          },
          {
            id: "shared-header",
            title: "Header",
            description: "Displays the concierge identity and key controls.",
            href: "/internal/components/shared/header",
          },
          {
            id: "shared-idle-session",
            title: "Idle session",
            description:
              "Prompts visitors to continue or end a chat after inactivity.",
            href: "/internal/components/shared/idle-session",
          },
          {
            id: "shared-interim-state",
            title: "Interim state",
            description:
              "Shows a calm waiting moment while an assistant or session is prepared.",
            href: "/internal/components/shared/interim-state",
          },
          {
            id: "shared-messages",
            title: "Messages",
            description:
              "Displays chat messages for members, visitors, the AI agent, and live agents.",
            href: "/internal/components/shared/messages",
          },
          {
            id: "shared-prompts",
            title: "Prompts",
            description:
              "Shows suggested questions members or visitors can choose from.",
            href: "/internal/components/shared/prompts",
          },
          {
            id: "shared-shell",
            title: "Shell",
            description:
              "The overall UI container for the VCA AI Concierge experience.",
            href: "/internal/components/shared/shell",
          },
          {
            id: "shared-side-panel",
            title: "Side panel",
            description:
              "Supports a focused task alongside the conversation.",
            href: "/internal/components/shared/side-panel",
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
        title: "Hiring microsite",
        items: [
          {
            id: "shared-action-card",
            title: "Sales card",
            description:
              "Shows AE and SDR connection paths for high- and medium-intent sales moments.",
            href: "/internal/components/shared/sales-card",
          },
          {
            id: "hiring-microsite-microphone-voice-banner",
            title: "Microphone voice banner",
            description:
              "Shows blocked microphone access in context of the Hiring chat panel.",
            href: "/internal/components/hiring-microsite/microphone-voice-banner",
          },
          {
            id: "hiring-microsite-generic-inline-error",
            title: "Generic inline error",
            description:
              "Shows a recoverable assistant-response error with a concise retry action.",
            href: "/internal/components/hiring-microsite/generic-inline-error",
          },
          {
            id: "hiring-microsite-email",
            title: "Email",
            description:
              "Confirms a scheduled conversation and carries relevant concierge context into the hiring specialist handoff.",
            href: "/internal/components/hiring-microsite/email",
          },
        ],
      },
      {
        title: "Premium",
        items: [
          {
            id: "premium-concierge-panel",
            title: "Concierge panel",
            description:
              "Shows the full Premium concierge conversation experience.",
            href: "/internal/components/premium/concierge-panel",
          },
          {
            id: "premium-product-recommendation-card",
            title: "SKU card",
            description:
              "Displays Premium SKU recommendations inside a conversation.",
            href: "/internal/components/premium/sku-card",
          },
          {
            id: "premium-survey-entry",
            title: "Floating Action Button",
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
              "Shows PCP detail panels inside the VCA chat shell.",
            href: "/internal/components/premium-company-page/side-panel",
          },
          {
            id: "premium-company-page-vca-fab",
            title: "VCA FAB",
            description:
              "Opens the Premium Company Page VCA from page surfaces.",
            href: "/internal/components/premium-company-page/vca-fab",
          },
        ],
      },
    ],
  },
  {
    title: "SDUI components",
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
            description: "Lets members or visitors make a lightweight choice.",
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
              "Represents a member, visitor, company, or live agent.",
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
