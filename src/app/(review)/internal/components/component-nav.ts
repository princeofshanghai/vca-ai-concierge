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
        title: "Shared",
        items: [
          {
            id: "shared-shell",
            title: "Shell",
            description:
              "The overall UI container for the VCA AI Concierge experience.",
            href: "/internal/components/shared/shell",
          },
          {
            id: "shared-header",
            title: "Header",
            description: "Displays the concierge identity and key controls.",
            href: "/internal/components/shared/header",
          },
          {
            id: "shared-messages",
            title: "Messages",
            description:
              "Displays chat messages for members, visitors, the AI agent, and live agents.",
            href: "/internal/components/shared/messages",
          },
          {
            id: "shared-feedback",
            title: "Feedback",
            description:
              "Lets visitors rate an assistant response and optionally share why.",
            href: "/internal/components/shared/feedback",
          },
          {
            id: "shared-composer",
            title: "Composer",
            description:
              "Lets members or visitors type and send a message to the concierge.",
            href: "/internal/components/shared/composer",
          },
          {
            id: "shared-prompts",
            title: "Prompts",
            description:
              "Shows suggested questions members or visitors can choose from.",
            href: "/internal/components/shared/prompts",
          },
          {
            id: "shared-action-card",
            title: "Action card",
            description:
              "Displays a recommended action inside the conversation.",
            href: "/internal/components/shared/action-card",
          },
          {
            id: "shared-side-panel",
            title: "Side panel",
            description:
              "Supports a focused task alongside the conversation.",
            href: "/internal/components/shared/side-panel",
          },
          {
            id: "shared-interim-state",
            title: "Interim state",
            description:
              "Shows a calm waiting moment while an assistant or session is prepared.",
            href: "/internal/components/shared/interim-state",
          },
          {
            id: "shared-idle-session",
            title: "Idle session",
            description:
              "Prompts visitors to continue or end a chat after inactivity.",
            href: "/internal/components/shared/idle-session",
          },
        ],
      },
      {
        title: "Premium",
        items: [
          {
            id: "premium-survey-entry",
            title: "Floating Action Button",
            description:
              "Opens the Premium concierge from the Premium experience.",
            href: "/internal/components/premium/survey-entry",
          },
          {
            id: "premium-product-recommendation-card",
            title: "Plan card",
            description: "Displays premium plan recommendations.",
            href: "/internal/components/premium/product-recommendation-card",
          },
          {
            id: "premium-concierge-panel",
            title: "Concierge panel",
            description:
              "Shows the full Premium concierge conversation experience.",
            href: "/internal/components/premium/concierge-panel",
          },
        ],
      },
    ],
  },
  {
    title: "SDUI components",
    groups: [
      {
        title: "Navigation",
        items: [
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
          {
            id: "sdui-global-navigation",
            title: "Global navigation",
            description:
              "Displays LinkedIn's global web navigation with search, primary nav items, profile, and work menu.",
            href: "/internal/components/sdui/global-navigation",
          },
        ],
      },
      {
        title: "Primitives",
        items: [
          {
            id: "sdui-button",
            title: "Button",
            description:
              "Supports primary and secondary actions across the experience.",
            href: "/internal/components/sdui/button",
          },
          {
            id: "sdui-ghost-button",
            title: "Ghost button",
            description:
              "Supports quiet text actions with optional icons, emphasis, and loading states.",
            href: "/internal/components/sdui/ghost-button",
          },
          {
            id: "sdui-button-icon",
            title: "Button icon",
            description:
              "Supports compact actions using only an icon.",
            href: "/internal/components/sdui/button-icon",
          },
          {
            id: "sdui-overlay-button-icon",
            title: "Overlay button icon",
            description:
              "Supports icon-only actions on top of media, imagery, or floating surfaces.",
            href: "/internal/components/sdui/overlay-button-icon",
          },
          {
            id: "sdui-ghost-icon-button",
            title: "Ghost icon button",
            description:
              "Supports quieter actions like closing, minimizing, or expanding.",
            href: "/internal/components/sdui/ghost-icon-button",
          },
          {
            id: "sdui-confirmation",
            title: "Confirmation",
            description:
              "Confirms navigation or actions that would clear conversation state.",
            href: "/internal/components/sdui/confirmation",
          },
          {
            id: "sdui-pill",
            title: "Pill",
            description: "Lets members or visitors make a lightweight choice.",
            href: "/internal/components/sdui/pill",
          },
          {
            id: "sdui-icon",
            title: "Icon",
            description:
              "Provides visual cues for actions, statuses, and AI moments.",
            href: "/internal/components/sdui/icon",
          },
          {
            id: "sdui-entity",
            title: "Entity",
            description:
              "Represents a member, visitor, company, or live agent.",
            href: "/internal/components/sdui/entity",
          },
          {
            id: "sdui-text-input",
            title: "Text input",
            description: "Captures a short text response.",
            href: "/internal/components/sdui/text-input",
          },
          {
            id: "sdui-text-area",
            title: "Text area",
            description: "Captures a longer written response.",
            href: "/internal/components/sdui/text-area",
          },
          {
            id: "sdui-tag",
            title: "Tag",
            description: "Labels important status or context.",
            href: "/internal/components/sdui/tag",
          },
          {
            id: "sdui-badge",
            title: "Badge",
            description:
              "Signals new activity, alerts, or updates.",
            href: "/internal/components/sdui/badge",
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
        ],
      },
    ],
  },
];

export const componentNavItems: ReadonlyArray<ComponentNavItem> =
  componentNavGroups.flatMap((section) =>
    section.groups.flatMap((group) => group.items),
  );

export const defaultComponentHref =
  componentNavItems[0]?.href ?? "/internal/components/shared/shell";

export function getComponentNavItem(slug: ReadonlyArray<string>) {
  const href = `/internal/components/${slug.join("/")}`;

  return componentNavItems.find((item) => item.href === href);
}
