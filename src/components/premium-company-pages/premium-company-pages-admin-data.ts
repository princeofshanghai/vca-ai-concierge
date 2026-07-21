import type { IconName } from "@/components/primitives/icon";

export const ADMIN_DASHBOARD_HREF = "/premium-company-pages/admin";
export const ADMIN_ANALYTICS_HREF = "/premium-company-pages/admin/analytics";
export const ADMIN_INBOX_HREF = "/premium-company-pages/admin/inbox";
export const ADMIN_SETTINGS_HREF = "/premium-company-pages/admin/settings";
export const ADMIN_AI_ASSISTANT_SETTINGS_HREF =
  "/premium-company-pages/admin/settings/manage-ai-assistant";

const VELORA_AI_ACCENT = "#2AA986";

export const primaryRailItems = [
  "Dashboard",
  "Page posts",
  "Analytics",
  "Feed",
  "Activity",
  "Inbox",
  "Edit Page",
];

export const secondaryRailItems = ["Services", "Products", "Jobs"];

export const railItemHrefs: Partial<Record<string, string>> = {
  Analytics: ADMIN_ANALYTICS_HREF,
  Dashboard: ADMIN_DASHBOARD_HREF,
  Inbox: ADMIN_INBOX_HREF,
  Settings: ADMIN_SETTINGS_HREF,
};

export const premiumRailItems: ReadonlyArray<{
  label: string;
  icon?: IconName;
}> = [
  { label: "Premium features" },
  { label: "Advertise today", icon: "radar-screen" },
  { label: "Invite to follow" },
  { label: "Chat with assistant" },
  { label: "Settings" },
];

export type SettingsRowData = Readonly<{
  title: string;
  description: string;
  badge?: string;
  href?: string;
}>;

export const settingsRows: ReadonlyArray<SettingsRowData> = [
  {
    title: "Manage admins",
    description: "Control who manages your page",
  },
  {
    title: "Manage restricted members",
    description: "See all the restricted members",
  },
  {
    title: "Manage following",
    description: "See all the pages your page follows",
  },
  {
    title: "Inbox settings",
    description:
      "Choose whether members can message the page and select conversation topics",
  },
  {
    title: "Manage AI assistant",
    description: "Turn on and manage your Page's AI assistant",
    badge: "New",
    href: ADMIN_AI_ASSISTANT_SETTINGS_HREF,
  },
  {
    title: "Job posting",
    description: "Manage who can post jobs and how jobs are shared on your page",
  },
  {
    title: "Verification controls",
    description:
      "Review or change the ways members can verify their association with your organization",
  },
  {
    title: "Deactivate page",
    description: "Take your page down",
  },
];

export type AssistantColorOption = Readonly<{
  id: string;
  label: string;
  value: string;
}>;

export const assistantColorOptions: ReadonlyArray<AssistantColorOption> = [
  { id: "red", label: "Red", value: "#D11124" },
  { id: "orange", label: "Orange", value: "#F28C28" },
  { id: "yellow", label: "Yellow", value: "#F4B400" },
  { id: "green", label: "Green", value: VELORA_AI_ACCENT },
  { id: "teal", label: "Teal", value: "#00A3A3" },
  { id: "blue", label: "Blue", value: "#0A66C2" },
  { id: "purple", label: "Purple", value: "#8E3FF2" },
  { id: "gray", label: "Gray", value: "#56687A" },
];

export const assistantDefaultColor =
  assistantColorOptions.find((option) => option.id === "green") ??
  assistantColorOptions[0];

export const additionalKnowledgeLinks: ReadonlyArray<string> = [
  "https://help.velora.com/faqs",
  "https://www.velora.com/resources",
  "https://www.velora.com/customers",
];

export const defaultKnowledgeLinks: ReadonlyArray<string> = [
  "https://www.velora.com",
  ...additionalKnowledgeLinks,
];
