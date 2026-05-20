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
    title: "VCA AI concierge",
    groups: [
      {
        title: "Shared",
        items: [
          {
            id: "shared-shell",
            title: "Shell",
            description:
              "Panel and tray containers that define how the assistant opens, minimizes, and expands.",
            href: "/internal/components/shared/shell",
          },
          {
            id: "shared-header",
            title: "Header",
            description:
              "Top chrome for the chat panel, including AI identity and shell controls.",
            href: "/internal/components/shared/header",
          },
          {
            id: "shared-messages",
            title: "Messages",
            description:
              "Assistant, visitor, and representative turns, including feedback and rich states.",
            href: "/internal/components/shared/messages",
          },
          {
            id: "shared-composer",
            title: "Composer",
            description:
              "Message input and send controls, including long drafts and responding states.",
            href: "/internal/components/shared/composer",
          },
          {
            id: "shared-prompts",
            title: "Prompts",
            description:
              "Suggested user intents that help people start or steer the conversation.",
            href: "/internal/components/shared/prompts",
          },
          {
            id: "shared-recommendation-card",
            title: "Recommendation card",
            description:
              "Compact in-chat decision card for suggested products or next-best actions.",
            href: "/internal/components/shared/recommendation-card",
          },
        ],
      },
      {
        title: "Hiring",
        items: [
          {
            id: "hiring-specialist-recommendation",
            title: "Specialist recommendation",
            description:
              "In-chat appointment recommendation flow from matching through confirmed details.",
            href: "/internal/components/hiring/specialist-recommendation",
          },
          {
            id: "hiring-live-handoff",
            title: "Live handoff",
            description:
              "Card states for connecting a visitor to a live human representative.",
            href: "/internal/components/hiring/live-handoff",
          },
          {
            id: "hiring-booking-side-panel",
            title: "Booking side panel",
            description:
              "Scheduling surface used alongside chat when a visitor is ready to book.",
            href: "/internal/components/hiring/booking-side-panel",
          },
        ],
      },
      {
        title: "Premium",
        items: [
          {
            id: "premium-survey-entry",
            title: "Survey entry",
            description:
              "Premium entry and assistant affordance that sit around the plan survey.",
            href: "/internal/components/premium/survey-entry",
          },
          {
            id: "premium-survey-option",
            title: "Survey option",
            description:
              "Choice row for the Premium survey spine in unchecked and checked states.",
            href: "/internal/components/premium/survey-option",
          },
          {
            id: "premium-progress-indicator",
            title: "Progress indicator",
            description:
              "Header progress treatment used across Premium survey steps.",
            href: "/internal/components/premium/progress-indicator",
          },
          {
            id: "premium-product-recommendation-card",
            title: "Product recommendation card",
            description:
              "Premium plan recommendation card with trial CTA and included features.",
            href: "/internal/components/premium/product-recommendation-card",
          },
          {
            id: "premium-plan-card",
            title: "Plan card",
            description:
              "Plan-comparison card used on the Premium plan selection step.",
            href: "/internal/components/premium/plan-card",
          },
          {
            id: "premium-concierge-panel",
            title: "Concierge panel",
            description:
              "High-signal transcript showing rationale, plan card, and escape-hatch prompts.",
            href: "/internal/components/premium/concierge-panel",
          },
        ],
      },
    ],
  },
  {
    title: "SDUI",
    groups: [
      {
        title: "Primitives",
        items: [
          {
            id: "sdui-button",
            title: "Button",
            description:
              "Core action controls used across the review surfaces.",
            href: "/internal/components/sdui/button",
          },
          {
            id: "sdui-button-icon",
            title: "Button icon",
            description:
              "Icon-only action controls for compact toolbars and chat header commands.",
            href: "/internal/components/sdui/button-icon",
          },
          {
            id: "sdui-ghost-icon-button",
            title: "Ghost icon button",
            description:
              "Low-emphasis icon actions for chrome, dismissal, and secondary controls.",
            href: "/internal/components/sdui/ghost-icon-button",
          },
          {
            id: "sdui-pill",
            title: "Pill",
            description:
              "Choice chips for lightweight selection patterns.",
            href: "/internal/components/sdui/pill",
          },
          {
            id: "sdui-icon",
            title: "Icon",
            description:
              "Small symbolic marks for actions, statuses, and AI affordances.",
            href: "/internal/components/sdui/icon",
          },
          {
            id: "sdui-entity",
            title: "Entity",
            description:
              "Avatar and placeholder shapes for people, companies, and named entities.",
            href: "/internal/components/sdui/entity",
          },
          {
            id: "sdui-text-input",
            title: "Text input",
            description:
              "Single-line supporting form input.",
            href: "/internal/components/sdui/text-input",
          },
          {
            id: "sdui-text-area",
            title: "Text area",
            description:
              "Multi-line supporting form input.",
            href: "/internal/components/sdui/text-area",
          },
          {
            id: "sdui-tag",
            title: "Tag",
            description:
              "Short metadata labels for status, category, and contextual emphasis.",
            href: "/internal/components/sdui/tag",
          },
          {
            id: "sdui-badge",
            title: "Badge",
            description:
              "Overlay indicators for new activity, alerts, and notification counts.",
            href: "/internal/components/sdui/badge",
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
