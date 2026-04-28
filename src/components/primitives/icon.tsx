import type { HTMLAttributes } from "react";

export const iconNames = [
  "add",
  "analytics",
  "amp",
  "archive",
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "arrow-up",
  "arrow-up-down",
  "arrow-up-left",
  "attachment",
  "audio-lines",
  "bank",
  "bell-fill",
  "bell-off",
  "bell-outline",
  "block",
  "book-open",
  "bookmark-fill",
  "bookmark-outline",
  "calendar",
  "camera",
  "caret",
  "caret-right",
  "caret-up",
  "certificate",
  "check",
  "checklist",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "chevron-up",
  "circle",
  "clear",
  "clipboard",
  "clipboard-check",
  "clock",
  "close",
  "closed-captions-fill",
  "closed-captions-outline",
  "comment",
  "comment-off",
  "company",
  "compose",
  "connection-add",
  "curly-braces",
  "dashboard",
  "document",
  "document-copy",
  "document-search",
  "download",
  "edit",
  "envelope",
  "envelope-open",
  "embed",
  "emoji",
  "fast-forward",
  "filter",
  "folder",
  "format-font",
  "fullscreen-enter",
  "fullscreen-exit",
  "g2",
  "gallery-view",
  "gif",
  "gift",
  "globe-americas",
  "globe-language",
  "group",
  "hashtag",
  "image",
  "image-square",
  "import-export",
  "in-common",
  "job",
  "keyboard-down",
  "keyboard-up",
  "lightbulb",
  "lightbulb-fill",
  "link",
  "link-external",
  "linked-in-bug-influencer",
  "linked-in-bug",
  "location-marker",
  "locked",
  "magic-wand",
  "marketplace",
  "maximize",
  "mention",
  "mention-off",
  "messages",
  "microphone-fill",
  "microphone-off",
  "minimize",
  "newspaper",
  "org-chart",
  "overflow-android",
  "overflow-web-ios",
  "pause",
  "phone-handset",
  "phone-missed-call",
  "people",
  "person",
  "pin-fill",
  "pin-outline",
  "placeholder",
  "play",
  "popular-content",
  "question",
  "quote",
  "radar-dish",
  "radar-screen",
  "rearrange-horizontal",
  "refresh",
  "remove-connection",
  "reply",
  "report",
  "repost",
  "responsive",
  "rss",
  "salary",
  "scan-qr-code",
  "school",
  "search",
  "send",
  "send-privately",
  "server-sync",
  "services",
  "settings",
  "share-android",
  "share-ios",
  "share-linked-in",
  "shield",
  "signal-ai",
  "signal-ai-outline",
  "signal-caution",
  "signal-error",
  "signal-notice",
  "signal-success",
  "slides",
  "signal-success-outline",
  "skills",
  "skip-back",
  "skip-forward",
  "sort",
  "sort-down",
  "sort-up",
  "star-fill",
  "star-half",
  "star-outline",
  "starburst",
  "sticky-note",
  "stop",
  "subtract",
  "tag",
  "templates",
  "test",
  "text-align-center",
  "text-align-left",
  "text-align-right",
  "text-bold",
  "text-bulleted-list",
  "text-italic",
  "text-numbered-list",
  "text-underline",
  "thumbs-down-fill",
  "thumbs-down-outline",
  "thumbs-up-fill",
  "thumbs-up-outline",
  "trash",
  "trending",
  "trophy",
  "unarchive",
  "unblock",
  "undo",
  "unlocked",
  "verified",
  "verified-fill",
  "upload",
  "video-camera",
  "video-conference",
  "video-inset",
  "video-square",
  "visibility",
  "visibility-off",
  "virtual-chat",
  "virtual-chat-fill",
  "volume-high",
  "volume-low",
  "volume-medium",
  "volume-mute",
  "whats-app"
] as const;

export type IconName = (typeof iconNames)[number];
export type IconSize = "small" | "medium";

export type IconProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children" | "dangerouslySetInnerHTML"
> & {
  name: IconName;
  size?: IconSize;
  label?: string;
};

export const iconMetadata = [
  {
    "name": "add",
    "label": "Add",
    "figmaName": "Add Small",
    "figmaNodeId": "2008:2778"
  },
  {
    "name": "analytics",
    "label": "Analytics",
    "figmaName": "Analytics Small",
    "figmaNodeId": "2008:2698"
  },
  {
    "name": "amp",
    "label": "AMP",
    "figmaName": "AMP Small",
    "figmaNodeId": "2008:2772"
  },
  {
    "name": "archive",
    "label": "Archive",
    "figmaName": "Archive Small",
    "figmaNodeId": "2008:2771"
  },
  {
    "name": "arrow-down",
    "label": "Arrow Down",
    "figmaName": "Arrow Down Small",
    "figmaNodeId": "2008:2753"
  },
  {
    "name": "arrow-left",
    "label": "Arrow Left",
    "figmaName": "Arrow Left Small",
    "figmaNodeId": "2008:2710"
  },
  {
    "name": "arrow-right",
    "label": "Arrow Right",
    "figmaName": "Arrow Right Small",
    "figmaNodeId": "2008:2776"
  },
  {
    "name": "arrow-up",
    "label": "Arrow Up",
    "figmaName": "Arrow Up Small",
    "figmaNodeId": "2008:2731"
  },
  {
    "name": "arrow-up-down",
    "label": "Arrow Up Down",
    "figmaName": "Arrow Up Down Small",
    "figmaNodeId": "2008:2759"
  },
  {
    "name": "arrow-up-left",
    "label": "Arrow Up Left",
    "figmaName": "Arrow Up Left Small",
    "figmaNodeId": "2008:2765"
  },
  {
    "name": "attachment",
    "label": "Attachment",
    "figmaName": "Attachment Small",
    "figmaNodeId": "2008:2741"
  },
  {
    "name": "audio-lines",
    "label": "Audio Lines",
    "source": "Lucide"
  },
  {
    "name": "bank",
    "label": "Bank",
    "figmaName": "Bank Small",
    "figmaNodeId": "2008:2777"
  },
  {
    "name": "bell-fill",
    "label": "Bell Fill",
    "figmaName": "Bell Fill Small",
    "figmaNodeId": "2008:2678"
  },
  {
    "name": "bell-off",
    "label": "Bell Off",
    "figmaName": "Bell Off Small",
    "figmaNodeId": "2008:2752"
  },
  {
    "name": "bell-outline",
    "label": "Bell Outline",
    "figmaName": "Bell Outline Small",
    "figmaNodeId": "2008:2658"
  },
  {
    "name": "block",
    "label": "Block",
    "figmaName": "Block Small",
    "figmaNodeId": "2008:2774"
  },
  {
    "name": "book-open",
    "label": "Book Open",
    "figmaName": "Book Open Small",
    "figmaNodeId": "2008:2749"
  },
  {
    "name": "bookmark-fill",
    "label": "Bookmark Fill",
    "figmaName": "Bookmark Fill Small",
    "figmaNodeId": "2008:2745"
  },
  {
    "name": "bookmark-outline",
    "label": "Bookmark Outline",
    "figmaName": "Bookmark Outline Small",
    "figmaNodeId": "2008:2766"
  },
  {
    "name": "calendar",
    "label": "Calendar",
    "figmaName": "Calendar Small",
    "figmaNodeId": "2008:2713"
  },
  {
    "name": "camera",
    "label": "Camera",
    "figmaName": "Camera Small",
    "figmaNodeId": "2008:2756"
  },
  {
    "name": "caret",
    "label": "Caret",
    "figmaName": "Caret Small",
    "figmaNodeId": "2008:2762"
  },
  {
    "name": "caret-right",
    "label": "Caret Right",
    "figmaName": "Caret Right Small",
    "figmaNodeId": "2008:2668"
  },
  {
    "name": "caret-up",
    "label": "Caret Up",
    "figmaName": "Caret Up Small",
    "figmaNodeId": "2008:2739"
  },
  {
    "name": "certificate",
    "label": "Certificate",
    "figmaName": "Certificate Small",
    "figmaNodeId": "2008:2737"
  },
  {
    "name": "check",
    "label": "Check",
    "figmaName": "Check Small",
    "figmaNodeId": "2008:2735"
  },
  {
    "name": "checklist",
    "label": "Checklist",
    "figmaName": "Checklist Small",
    "figmaNodeId": "2008:2733"
  },
  {
    "name": "chevron-down",
    "label": "Chevron Down",
    "figmaName": "Chevron Down Small",
    "figmaNodeId": "2008:2730"
  },
  {
    "name": "chevron-left",
    "label": "Chevron Left",
    "figmaName": "Chevron Left Small",
    "figmaNodeId": "2008:2763"
  },
  {
    "name": "chevron-right",
    "label": "Chevron Right",
    "figmaName": "Chevron Right Small",
    "figmaNodeId": "2008:2746"
  },
  {
    "name": "chevron-up",
    "label": "Chevron Up",
    "figmaName": "Chevron Up Small",
    "figmaNodeId": "2008:2726"
  },
  {
    "name": "circle",
    "label": "Circle",
    "figmaName": "Circle Small",
    "figmaNodeId": "2008:2724"
  },
  {
    "name": "clear",
    "label": "Clear",
    "figmaName": "Clear Small",
    "figmaNodeId": "2008:2769"
  },
  {
    "name": "clipboard",
    "label": "Clipboard",
    "figmaName": "Clipboard Small",
    "figmaNodeId": "2008:2719"
  },
  {
    "name": "clipboard-check",
    "label": "Clipboard Check",
    "figmaName": "Clipboard Check Small",
    "figmaNodeId": "2008:2674"
  },
  {
    "name": "clock",
    "label": "Clock",
    "figmaName": "Clock Small",
    "figmaNodeId": "2008:2729"
  },
  {
    "name": "close",
    "label": "Close",
    "figmaName": "Close Small",
    "figmaNodeId": "2008:2734"
  },
  {
    "name": "closed-captions-fill",
    "label": "Closed Captions Fill",
    "figmaName": "Closed Captions Fill Small",
    "figmaNodeId": "2008:2717"
  },
  {
    "name": "closed-captions-outline",
    "label": "Closed Captions Outline",
    "figmaName": "Closed Captions Outline Small",
    "figmaNodeId": "2008:2732"
  },
  {
    "name": "comment",
    "label": "Comment",
    "figmaName": "Comment Small",
    "figmaNodeId": "2008:2751"
  },
  {
    "name": "comment-off",
    "label": "Comment Off",
    "figmaName": "Comment Off Small",
    "figmaNodeId": "2008:2715"
  },
  {
    "name": "company",
    "label": "Company",
    "figmaName": "Company Small",
    "figmaNodeId": "2008:2711"
  },
  {
    "name": "compose",
    "label": "Compose",
    "figmaName": "Compose Small",
    "figmaNodeId": "2008:2708"
  },
  {
    "name": "connection-add",
    "label": "Connection Add",
    "figmaName": "Connection Add Small",
    "figmaNodeId": "2008:2707"
  },
  {
    "name": "curly-braces",
    "label": "Curly Braces",
    "figmaName": "Curly Braces Small",
    "figmaNodeId": "2008:2754"
  },
  {
    "name": "dashboard",
    "label": "Dashboard",
    "figmaName": "Dashboard Small",
    "figmaNodeId": "2008:2704"
  },
  {
    "name": "document",
    "label": "Document",
    "figmaName": "Document Small",
    "figmaNodeId": "2008:2705"
  },
  {
    "name": "document-copy",
    "label": "Document Copy",
    "figmaName": "Document Copy Small",
    "figmaNodeId": "2008:2702"
  },
  {
    "name": "document-search",
    "label": "Document Search",
    "figmaName": "Document Search",
    "figmaNodeId": "2008:2703"
  },
  {
    "name": "download",
    "label": "Download",
    "figmaName": "Download Small",
    "figmaNodeId": "2008:2700"
  },
  {
    "name": "edit",
    "label": "Edit",
    "figmaName": "Edit Small",
    "figmaNodeId": "2008:2755"
  },
  {
    "name": "envelope",
    "label": "Envelope",
    "figmaName": "Envelope Small",
    "figmaNodeId": "2008:2699"
  },
  {
    "name": "envelope-open",
    "label": "Envelope Open",
    "figmaName": "Envelope Open Small",
    "figmaNodeId": "2008:2696"
  },
  {
    "name": "embed",
    "label": "Embed",
    "figmaName": "Embed Small",
    "figmaNodeId": "2008:2694"
  },
  {
    "name": "emoji",
    "label": "Emoji",
    "figmaName": "Emoji Small",
    "figmaNodeId": "2008:2764"
  },
  {
    "name": "fast-forward",
    "label": "Fast Forward",
    "figmaName": "Fast Forward Small",
    "figmaNodeId": "2008:2691"
  },
  {
    "name": "filter",
    "label": "Filter",
    "figmaName": "Filter Small",
    "figmaNodeId": "2008:2672"
  },
  {
    "name": "folder",
    "label": "Folder",
    "figmaName": "Folder Small",
    "figmaNodeId": "2008:2742"
  },
  {
    "name": "format-font",
    "label": "Format Font",
    "figmaName": "Format Font Small",
    "figmaNodeId": "2008:2689"
  },
  {
    "name": "fullscreen-enter",
    "label": "Fullscreen Enter",
    "figmaName": "Fullscreen Enter Small",
    "figmaNodeId": "2008:2750"
  },
  {
    "name": "fullscreen-exit",
    "label": "Fullscreen Exit",
    "figmaName": "Fullscreen Exit Small",
    "figmaNodeId": "2008:2670"
  },
  {
    "name": "g2",
    "label": "G2",
    "figmaName": "G2 Small",
    "figmaNodeId": "2008:2688"
  },
  {
    "name": "gallery-view",
    "label": "Gallery View",
    "figmaName": "Gallery View Small",
    "figmaNodeId": "2008:2709"
  },
  {
    "name": "gif",
    "label": "GIF",
    "figmaName": "GIF Small",
    "figmaNodeId": "2008:2686"
  },
  {
    "name": "gift",
    "label": "Gift",
    "figmaName": "Gift Small",
    "figmaNodeId": "2008:2697"
  },
  {
    "name": "globe-americas",
    "label": "Globe Americas",
    "figmaName": "Globe Americas Small",
    "figmaNodeId": "2008:2685"
  },
  {
    "name": "globe-language",
    "label": "Globe Language",
    "figmaName": "Globe Language Small",
    "figmaNodeId": "2008:2706"
  },
  {
    "name": "group",
    "label": "Group",
    "figmaName": "Group Small",
    "figmaNodeId": "2008:2683"
  },
  {
    "name": "hashtag",
    "label": "Hashtag",
    "figmaName": "Hashtag Small",
    "figmaNodeId": "2008:2682"
  },
  {
    "name": "image",
    "label": "Image",
    "figmaName": "Image Small",
    "figmaNodeId": "2008:2725"
  },
  {
    "name": "image-square",
    "label": "Image Square",
    "figmaName": "Image Square Small",
    "figmaNodeId": "2008:2680"
  },
  {
    "name": "import-export",
    "label": "Import Export",
    "figmaName": "Import Export Small",
    "figmaNodeId": "2008:2677"
  },
  {
    "name": "in-common",
    "label": "In Common",
    "figmaName": "In Common Small",
    "figmaNodeId": "2008:2722"
  },
  {
    "name": "job",
    "label": "Job",
    "figmaName": "Job Small",
    "figmaNodeId": "2008:2728"
  },
  {
    "name": "keyboard-down",
    "label": "Keyboard Down",
    "figmaName": "Keyboard Down Small",
    "figmaNodeId": "2008:2675"
  },
  {
    "name": "keyboard-up",
    "label": "Keyboard Up",
    "figmaName": "Keyboard Up Small",
    "figmaNodeId": "2008:2747"
  },
  {
    "name": "lightbulb",
    "label": "Lightbulb",
    "figmaName": "Lightbulb Small",
    "figmaNodeId": "2008:2743"
  },
  {
    "name": "lightbulb-fill",
    "label": "Lightbulb Fill",
    "figmaName": "Lightbulb Fill Small",
    "figmaNodeId": "2008:2721"
  },
  {
    "name": "link",
    "label": "Link",
    "figmaName": "Link Small",
    "figmaNodeId": "2008:2767"
  },
  {
    "name": "link-external",
    "label": "Link External",
    "figmaName": "Link External Small",
    "figmaNodeId": "2008:2761"
  },
  {
    "name": "linked-in-bug-influencer",
    "label": "LinkedIn Bug Influencer",
    "figmaName": "LinkedIn Bug Influencer Small",
    "figmaNodeId": "2008:2673"
  },
  {
    "name": "linked-in-bug",
    "label": "LinkedIn Bug",
    "figmaName": "LinkedIn Bug Small",
    "figmaNodeId": "2008:2671"
  },
  {
    "name": "location-marker",
    "label": "Location Marker",
    "figmaName": "Location Marker Small",
    "figmaNodeId": "2008:2693"
  },
  {
    "name": "locked",
    "label": "Locked",
    "figmaName": "Locked Small",
    "figmaNodeId": "2008:2740"
  },
  {
    "name": "magic-wand",
    "label": "Magic Wand",
    "figmaName": "Magic Wand Small",
    "figmaNodeId": "2008:2669"
  },
  {
    "name": "marketplace",
    "label": "Marketplace",
    "figmaName": "Marketplace Small",
    "figmaNodeId": "2008:2687"
  },
  {
    "name": "maximize",
    "label": "Maximize",
    "figmaName": "Maximize Small",
    "figmaNodeId": "2008:2667"
  },
  {
    "name": "mention",
    "label": "Mention",
    "figmaName": "Mention Small",
    "figmaNodeId": "2008:2738"
  },
  {
    "name": "mention-off",
    "label": "Mention Off",
    "figmaName": "Mention Off Small",
    "figmaNodeId": "2008:2665"
  },
  {
    "name": "messages",
    "label": "Messages",
    "figmaName": "Messages Small",
    "figmaNodeId": "2008:2663"
  },
  {
    "name": "microphone-fill",
    "label": "Microphone Fill",
    "figmaName": "Microphone Fill Small",
    "figmaNodeId": "2008:2662"
  },
  {
    "name": "microphone-off",
    "label": "Microphone Off",
    "figmaName": "Microphone Off Small",
    "figmaNodeId": "2008:2661"
  },
  {
    "name": "minimize",
    "label": "Minimize",
    "figmaName": "Minimize Small",
    "figmaNodeId": "2008:2679"
  },
  {
    "name": "newspaper",
    "label": "Newspaper",
    "figmaName": "Newspaper Small",
    "figmaNodeId": "2008:2684"
  },
  {
    "name": "org-chart",
    "label": "Org Chart",
    "figmaName": "Org Chart Small",
    "figmaNodeId": "2008:2758"
  },
  {
    "name": "overflow-android",
    "label": "Overflow Android",
    "figmaName": "Overflow Android Small",
    "figmaNodeId": "2008:2660"
  },
  {
    "name": "overflow-web-ios",
    "label": "Overflow Web iOS",
    "figmaName": "Overflow Web iOS Small",
    "figmaNodeId": "2008:2659"
  },
  {
    "name": "pause",
    "label": "Pause",
    "figmaName": "Pause Small",
    "figmaNodeId": "2008:2657"
  },
  {
    "name": "phone-handset",
    "label": "Phone Handset",
    "figmaName": "Phone Handset Small",
    "figmaNodeId": "2008:2656"
  },
  {
    "name": "phone-missed-call",
    "label": "Phone Missed Call",
    "figmaName": "Phone Missed Call Small",
    "figmaNodeId": "2008:2655"
  },
  {
    "name": "people",
    "label": "People",
    "figmaName": "People Small",
    "figmaNodeId": "2008:2653"
  },
  {
    "name": "person",
    "label": "Person",
    "figmaName": "Person Small",
    "figmaNodeId": "2008:2652"
  },
  {
    "name": "pin-fill",
    "label": "Pin Fill",
    "figmaName": "Pin Fill Small",
    "figmaNodeId": "2008:2651"
  },
  {
    "name": "pin-outline",
    "label": "Pin Outline",
    "figmaName": "Pin Outline Small",
    "figmaNodeId": "2008:2690"
  },
  {
    "name": "placeholder",
    "label": "Placeholder",
    "figmaName": "Placeholder Small",
    "figmaNodeId": "2008:2720"
  },
  {
    "name": "play",
    "label": "Play",
    "figmaName": "Play Small",
    "figmaNodeId": "2008:2760"
  },
  {
    "name": "popular-content",
    "label": "Popular Content",
    "figmaName": "Popular Content Small",
    "figmaNodeId": "2008:2650"
  },
  {
    "name": "question",
    "label": "Question",
    "figmaName": "Question Small",
    "figmaNodeId": "2008:2647"
  },
  {
    "name": "quote",
    "label": "Quote",
    "figmaName": "Quote Small",
    "figmaNodeId": "2008:2646"
  },
  {
    "name": "radar-dish",
    "label": "Radar Dish",
    "figmaName": "Radar Dish Small",
    "figmaNodeId": "2008:2645"
  },
  {
    "name": "radar-screen",
    "label": "Radar Screen",
    "figmaName": "Radar Screen Small",
    "figmaNodeId": "2008:2644"
  },
  {
    "name": "rearrange-horizontal",
    "label": "Rearrange Horizontal",
    "figmaName": "Rearrange Horizontal Small",
    "figmaNodeId": "2008:2643"
  },
  {
    "name": "refresh",
    "label": "Refresh",
    "figmaName": "Refresh Small",
    "figmaNodeId": "2008:2770"
  },
  {
    "name": "remove-connection",
    "label": "Remove Connection",
    "figmaName": "Remove Connection Small",
    "figmaNodeId": "2008:2748"
  },
  {
    "name": "reply",
    "label": "Reply",
    "figmaName": "Reply Small",
    "figmaNodeId": "2008:2642"
  },
  {
    "name": "report",
    "label": "Report",
    "figmaName": "Report Small",
    "figmaNodeId": "2008:2641"
  },
  {
    "name": "repost",
    "label": "Repost",
    "figmaName": "Repost Small",
    "figmaNodeId": "2008:2640"
  },
  {
    "name": "responsive",
    "label": "Responsive",
    "figmaName": "Responsive Small",
    "figmaNodeId": "2008:2639"
  },
  {
    "name": "rss",
    "label": "RSS",
    "figmaName": "RSS Small",
    "figmaNodeId": "2008:2714"
  },
  {
    "name": "salary",
    "label": "Salary",
    "figmaName": "Salary Small",
    "figmaNodeId": "2008:2638"
  },
  {
    "name": "scan-qr-code",
    "label": "Scan QR Code",
    "figmaName": "Scan QR Code Small",
    "figmaNodeId": "2008:2637"
  },
  {
    "name": "school",
    "label": "School",
    "figmaName": "School Small",
    "figmaNodeId": "2008:2635"
  },
  {
    "name": "search",
    "label": "Search",
    "figmaName": "Search Small",
    "figmaNodeId": "2008:2634"
  },
  {
    "name": "send",
    "label": "Send",
    "figmaName": "Send Small",
    "figmaNodeId": "2008:2632"
  },
  {
    "name": "send-privately",
    "label": "Send Privately",
    "figmaName": "Send Privately Small",
    "figmaNodeId": "2008:2631"
  },
  {
    "name": "server-sync",
    "label": "Server Sync",
    "figmaName": "Server Sync Small",
    "figmaNodeId": "2008:2695"
  },
  {
    "name": "services",
    "label": "Services",
    "figmaName": "Services Small",
    "figmaNodeId": "2008:2630"
  },
  {
    "name": "settings",
    "label": "Settings",
    "figmaName": "Settings Small",
    "figmaNodeId": "2008:2676"
  },
  {
    "name": "share-android",
    "label": "Share Android",
    "figmaName": "Share Android Small",
    "figmaNodeId": "2008:2629"
  },
  {
    "name": "share-ios",
    "label": "Share iOS",
    "figmaName": "Share iOS Small",
    "figmaNodeId": "2008:2628"
  },
  {
    "name": "share-linked-in",
    "label": "Share LinkedIn",
    "figmaName": "Share LinkedIn Small",
    "figmaNodeId": "2008:2757"
  },
  {
    "name": "shield",
    "label": "Shield",
    "figmaName": "Shield Small",
    "figmaNodeId": "2008:2627"
  },
  {
    "name": "signal-ai",
    "label": "Signal AI",
    "figmaName": "Signal AI Small",
    "figmaNodeId": "2008:2626"
  },
  {
    "name": "signal-ai-outline",
    "label": "Signal AI Outline",
    "figmaName": "Signal AI Outline Small",
    "figmaNodeId": "2008:2625"
  },
  {
    "name": "signal-caution",
    "label": "Signal Caution",
    "figmaName": "Signal Caution Small",
    "figmaNodeId": "2008:2624"
  },
  {
    "name": "signal-error",
    "label": "Signal Error",
    "figmaName": "Signal Error Small",
    "figmaNodeId": "2008:2623"
  },
  {
    "name": "signal-notice",
    "label": "Signal Notice",
    "figmaName": "Signal Notice Small",
    "figmaNodeId": "2008:2775"
  },
  {
    "name": "signal-success",
    "label": "Signal Success",
    "figmaName": "Signal Success Small",
    "figmaNodeId": "2008:2744"
  },
  {
    "name": "slides",
    "label": "Slides",
    "figmaName": "Slides Small",
    "figmaNodeId": "2008:2664"
  },
  {
    "name": "signal-success-outline",
    "label": "Signal Success Outline",
    "figmaName": "Signal Success Outline Small",
    "figmaNodeId": "2008:2636"
  },
  {
    "name": "skills",
    "label": "Skills",
    "figmaName": "Skills Small",
    "figmaNodeId": "2008:2681"
  },
  {
    "name": "skip-back",
    "label": "Skip Back",
    "figmaName": "Skip Back Small",
    "figmaNodeId": "2008:2712"
  },
  {
    "name": "skip-forward",
    "label": "Skip Forward",
    "figmaName": "Skip Forward Small",
    "figmaNodeId": "2008:2622"
  },
  {
    "name": "sort",
    "label": "Sort",
    "figmaName": "Sort Small",
    "figmaNodeId": "2008:2620"
  },
  {
    "name": "sort-down",
    "label": "Sort Down",
    "figmaName": "Sort Down Small",
    "figmaNodeId": "2008:2618"
  },
  {
    "name": "sort-up",
    "label": "Sort Up",
    "figmaName": "Sort Up Small",
    "figmaNodeId": "2008:2649"
  },
  {
    "name": "star-fill",
    "label": "Star Fill",
    "figmaName": "Star Fill Small",
    "figmaNodeId": "2008:2701"
  },
  {
    "name": "star-half",
    "label": "Star Half",
    "figmaName": "Star Half Small",
    "figmaNodeId": "2008:2616"
  },
  {
    "name": "star-outline",
    "label": "Star Outline",
    "figmaName": "Star Outline Small",
    "figmaNodeId": "2008:2633"
  },
  {
    "name": "starburst",
    "label": "Starburst",
    "figmaName": "Starburst Small",
    "figmaNodeId": "2008:2615"
  },
  {
    "name": "sticky-note",
    "label": "Sticky Note",
    "figmaName": "Sticky Note Small",
    "figmaNodeId": "2008:2727"
  },
  {
    "name": "stop",
    "label": "Stop",
    "figmaName": "Stop Small",
    "figmaNodeId": "2008:2614"
  },
  {
    "name": "subtract",
    "label": "Subtract",
    "figmaName": "Subtract Small",
    "figmaNodeId": "2008:2613"
  },
  {
    "name": "tag",
    "label": "Tag",
    "figmaName": "Tag Small",
    "figmaNodeId": "2008:2612"
  },
  {
    "name": "templates",
    "label": "Templates",
    "figmaName": "Templates Small",
    "figmaNodeId": "2008:2611"
  },
  {
    "name": "test",
    "label": "Test",
    "figmaName": "Test Small",
    "figmaNodeId": "2008:2610"
  },
  {
    "name": "text-align-center",
    "label": "Text Align Center",
    "figmaName": "Text Align Center Small",
    "figmaNodeId": "2008:2736"
  },
  {
    "name": "text-align-left",
    "label": "Text Align Left",
    "figmaName": "Text Align Left Small",
    "figmaNodeId": "2008:2609"
  },
  {
    "name": "text-align-right",
    "label": "Text Align Right",
    "figmaName": "Text Align Right Small",
    "figmaNodeId": "2008:2617"
  },
  {
    "name": "text-bold",
    "label": "Text Bold",
    "figmaName": "Text Bold Small",
    "figmaNodeId": "2008:2608"
  },
  {
    "name": "text-bulleted-list",
    "label": "Text Bulleted List",
    "figmaName": "Text Bulleted List Small",
    "figmaNodeId": "2008:2607"
  },
  {
    "name": "text-italic",
    "label": "Text Italic",
    "figmaName": "Text Italic Small",
    "figmaNodeId": "2008:2606"
  },
  {
    "name": "text-numbered-list",
    "label": "Text Numbered List",
    "figmaName": "Text Numbered List Small",
    "figmaNodeId": "2008:2716"
  },
  {
    "name": "text-underline",
    "label": "Text Underline",
    "figmaName": "Text Underline Small",
    "figmaNodeId": "2008:2773"
  },
  {
    "name": "thumbs-down-fill",
    "label": "Thumbs Down Fill",
    "figmaName": "Thumbs Down Fill Small",
    "figmaNodeId": "2008:2605"
  },
  {
    "name": "thumbs-down-outline",
    "label": "Thumbs Down Outline",
    "figmaName": "Thumbs Down Outline Small",
    "figmaNodeId": "2008:2648"
  },
  {
    "name": "thumbs-up-fill",
    "label": "Thumbs Up Fill",
    "figmaName": "Thumbs Up Fill Small",
    "figmaNodeId": "2008:2604"
  },
  {
    "name": "thumbs-up-outline",
    "label": "Thumbs Up Outline",
    "figmaName": "Thumbs Up Outline Small",
    "figmaNodeId": "2008:2603"
  },
  {
    "name": "trash",
    "label": "Trash",
    "figmaName": "Trash Small",
    "figmaNodeId": "2008:2602"
  },
  {
    "name": "trending",
    "label": "Trending",
    "figmaName": "Trending Small",
    "figmaNodeId": "2008:2601"
  },
  {
    "name": "trophy",
    "label": "Trophy",
    "figmaName": "Trophy Small",
    "figmaNodeId": "2008:2600"
  },
  {
    "name": "unarchive",
    "label": "Unarchive",
    "figmaName": "Unarchive Small",
    "figmaNodeId": "2008:2599"
  },
  {
    "name": "unblock",
    "label": "Unblock",
    "figmaName": "Unblock Small",
    "figmaNodeId": "2008:2598"
  },
  {
    "name": "undo",
    "label": "Undo",
    "figmaName": "Undo Small",
    "figmaNodeId": "2008:2666"
  },
  {
    "name": "unlocked",
    "label": "Unlocked",
    "figmaName": "Unlocked Small",
    "figmaNodeId": "2008:2597"
  },
  {
    "name": "verified",
    "label": "Verified",
    "figmaName": "Verified Small",
    "figmaNodeId": "2008:2596"
  },
  {
    "name": "verified-fill",
    "label": "Verified Fill",
    "figmaName": "Verified Fill Small",
    "figmaNodeId": "2008:2595"
  },
  {
    "name": "upload",
    "label": "Upload",
    "figmaName": "Upload Small",
    "figmaNodeId": "2008:2718"
  },
  {
    "name": "video-camera",
    "label": "Video Camera",
    "figmaName": "Video Camera Small",
    "figmaNodeId": "2008:2654"
  },
  {
    "name": "video-conference",
    "label": "Video Conference",
    "figmaName": "Video Conference Small",
    "figmaNodeId": "2008:2594"
  },
  {
    "name": "video-inset",
    "label": "Video Inset",
    "figmaName": "Video Inset Small",
    "figmaNodeId": "2008:2621"
  },
  {
    "name": "video-square",
    "label": "Video Square",
    "figmaName": "Video Square Small",
    "figmaNodeId": "2008:2593"
  },
  {
    "name": "visibility",
    "label": "Visibility",
    "figmaName": "Visibility Small",
    "figmaNodeId": "2008:2692"
  },
  {
    "name": "visibility-off",
    "label": "Visibility Off",
    "figmaName": "Visibility Off Small",
    "figmaNodeId": "2008:2723"
  },
  {
    "name": "virtual-chat",
    "label": "Virtual Chat",
    "figmaName": "Virtual Chat Small",
    "figmaNodeId": "2008:2619"
  },
  {
    "name": "virtual-chat-fill",
    "label": "Virtual Chat Fill",
    "figmaName": "Virtual Chat Fill Small",
    "figmaNodeId": "2008:2768"
  },
  {
    "name": "volume-high",
    "label": "Volume High",
    "figmaName": "Volume High Small",
    "figmaNodeId": "2008:2592"
  },
  {
    "name": "volume-low",
    "label": "Volume Low",
    "figmaName": "Volume Low Small",
    "figmaNodeId": "2008:2591"
  },
  {
    "name": "volume-medium",
    "label": "Volume Medium",
    "figmaName": "Volume Medium Small",
    "figmaNodeId": "2008:2590"
  },
  {
    "name": "volume-mute",
    "label": "Volume Mute",
    "figmaName": "Volume Mute Small",
    "figmaNodeId": "2008:2589"
  },
  {
    "name": "whats-app",
    "label": "WhatsApp",
    "figmaName": "WhatsApp Small",
    "figmaNodeId": "2008:2588"
  }
] as const satisfies ReadonlyArray<{
  name: IconName;
  label: string;
  figmaName?: string;
  figmaNodeId?: string;
  source?: string;
}>;

const iconSvgByName = {
  "add": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 7H9V2H7V7H2V9H7V14H9V9H14V7Z\" fill=\"currentColor\"/>\n</svg>",
  "analytics": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 13V14H1V13H15ZM5 6H1V12H5V6ZM10 2H6V12H10V2ZM15 9H11V12H15V9Z\" fill=\"currentColor\"/>\n</svg>",
  "amp": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8 2C8.6 2 9.2 2.1 9.8 2.3L4.8 9H7L6.1 13.7C3.7 12.9 2 10.6 2 8C2 4.7 4.7 2 8 2ZM14 8C14 11.3 11.3 14 8 14C7.4 14 6.8 13.9 6.2 13.7L11.2 7H9L9.9 2.3C12.3 3.1 14 5.4 14 8Z\" fill=\"currentColor\"/>\n</svg>",
  "archive": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6 3H2V1H6C7.66 1 9 2.34 9 4V9H10.5L8 11.5L5.5 9H7V4C7 3.45 6.55 3 6 3ZM11 5V7H12V12C12 12.55 11.55 13 11 13H5C4.45 13 4 12.55 4 12V7H5V5H2V12C2 13.66 3.34 15 5 15H11C12.66 15 14 13.66 14 12V5H11Z\" fill=\"currentColor\"/>\n</svg>",
  "arrow-down": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M3 11.4L8 15L13 11.4V9L9 11.8V2H7V11.8L3 9V11.4Z\" fill=\"currentColor\"/>\n</svg>",
  "arrow-left": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4.6 3L1 8L4.6 13H7L4.2 9H14V7H4.2L7 3H4.6Z\" fill=\"currentColor\"/>\n</svg>",
  "arrow-right": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11.4 3L15 8L11.4 13H9L11.8 9H2V7H11.8L9 3H11.4Z\" fill=\"currentColor\"/>\n</svg>",
  "arrow-up": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13 4.6L8 1L3 4.6V7L7 4.2V14H9V4.2L13 7V4.6Z\" fill=\"currentColor\"/>\n</svg>",
  "arrow-up-down": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 0L12 2.85V5.29L9 3.15V7H7V3.15L4 5.29V2.85L8 0ZM12 13.15V10.71L9 12.85V9H7V12.85L4 10.71V13.15L8 16L12 13.15Z\" fill=\"currentColor\"/>\n</svg>",
  "arrow-up-left": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 12.6L12.6 14L4 5.4V10H2V2H10V4H5.4L14 12.6Z\" fill=\"currentColor\"/>\n</svg>",
  "attachment": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11 1C9.9 1 8.9 1.4 8.2 2.2L2.2 8.2C1.4 8.9 1 9.9 1 11C1 13.2 2.8 15 5 15C6.1 15 7.1 14.6 7.8 13.8L8 13.7L6.6 12.3L6.4 12.5C6 12.8 5.5 13 5 13C3.9 13 3 12.1 3 11C3 10.5 3.2 10 3.6 9.6L9.6 3.6C10 3.2 10.5 3 11 3C12.1 3 13 3.9 13 5C13 5.5 12.8 6 12.4 6.4L9 9.9C8.8 10 8.7 10 8.6 10C8.3 10 8.1 9.8 8.1 9.5C8.1 9.4 8.1 9.3 8.2 9.1L11 6.4L9.6 5L6.9 7.7C6.4 8.2 6.1 8.9 6.1 9.5C6.1 10.9 7.2 12 8.6 12C9.2 12 9.9 11.8 10.4 11.3L13.9 7.8C14.6 7.1 15 6.1 15 5C15 2.8 13.3 1 11 1Z\" fill=\"currentColor\"/>\n</svg>",
  "audio-lines": "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M2 10v3\"/>\n<path d=\"M6 6v11\"/>\n<path d=\"M10 3v18\"/>\n<path d=\"M14 8v7\"/>\n<path d=\"M18 5v13\"/>\n<path d=\"M22 10v3\"/>\n</svg>",
  "bank": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15 4L8 1L1 4V6H3V10H2V12H14V10H13V6H15V4ZM11 6H9V10H11V6ZM7 6V10H5V6H7ZM15 13V15H1V13H15Z\" fill=\"currentColor\"/>\n</svg>",
  "bell-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12.9 7.99999H3.1L3.6 4.79999C4 2.39999 6.2 0.699994 8.6 1.09999C10.5 1.39999 12 2.89999 12.3 4.79999L12.9 7.99999ZM15 11.8C15 11.3 14.8 10.7 14.5 10.3L13.5 8.99999H2.5L1.5 10.3C1.2 10.7 1 11.3 1 11.8V13H6.6C6.5 13.2 6.5 13.3 6.5 13.5C6.5 14.3 7.2 15 8 15C8.8 15 9.5 14.3 9.5 13.5C9.5 13.3 9.5 13.2 9.4 13H15V11.8Z\" fill=\"currentColor\"/>\n</svg>",
  "bell-off": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C6.7 1 5.5 1.6 4.7 2.6L6.1 4C6.9 2.9 8.3 2.7 9.4 3.4C9.9 3.8 10.3 4.3 10.4 5L10.9 8.7L15 12.8V11.7C15 11 14.8 10.3 14.3 9.8L12.8 8L12.3 4.7C12 2.6 10.2 1 8 1ZM1.7 1L1 1.7L3.7 4.4L3.2 8L1.7 9.9C1.2 10.4 1 11.1 1 11.8V13H6.6C6.5 13.2 6.5 13.3 6.5 13.5C6.5 14.3 7.2 15 8 15C8.8 15 9.5 14.3 9.5 13.5C9.5 13.3 9.5 13.2 9.4 13H12.3L14.3 15L15 14.3L1.7 1ZM5.2 8L5.5 6.2L7.3 8H5.2ZM3.3 11L5 9H8.3L10.3 11H3.3Z\" fill=\"currentColor\"/>\n</svg>",
  "bell-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 11.8C15 11.3 14.8 10.7 14.5 10.3L12.9 8.19999L12.4 4.79999C12 2.39999 9.8 0.699994 7.4 1.09999C5.4 1.39999 3.9 2.89999 3.6 4.79999L3.1 8.19999L1.5 10.3C1.2 10.7 1 11.3 1 11.8V13H6.6C6.5 13.2 6.5 13.3 6.5 13.5C6.5 14.3 7.2 15 8 15C8.8 15 9.5 14.3 9.5 13.5C9.5 13.3 9.5 13.2 9.4 13H15V11.8ZM8 2.99999C9.2 2.99999 10.2 3.89999 10.4 5.09999L10.9 7.99999H5.1L5.5 5.09999C5.8 3.89999 6.8 2.99999 8 2.99999ZM3.5 11L4.7 9.39999L5 8.99999H11L11.3 9.39999L12.5 11H3.5Z\" fill=\"currentColor\"/>\n</svg>",
  "block": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8 3C9.02 3 9.96 3.31 10.75 3.83L8 6.58L6.59 7.99L3.84 10.74C3.32 9.95 3.01 9 3.01 7.99C3.01 5.23 5.25 2.99 8.01 2.99L8 3ZM8 13C6.98 13 6.04 12.69 5.25 12.17L8 9.42L9.41 8.01L12.16 5.26C12.68 6.05 12.99 7 12.99 8.01C12.99 10.77 10.75 13.01 7.99 13.01L8 13Z\" fill=\"currentColor\"/>\n</svg>",
  "book-open": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.96 2H11.0128C9.80371 2 8.72448 2.55 7.98501 3.4C7.24554 2.55 6.1763 2 4.95717 2H1.02998C1.02998 2 1 2.01 1 2.03V12.97C1 12.97 1.00999 13 1.02998 13H4.87723C5.72662 13 6.48608 13.54 6.76588 14.34L6.99572 14.98C6.99572 14.98 7.00571 15 7.0157 15H8.9843C8.9843 15 9.00428 15 9.00428 14.98L9.23412 14.34C9.51392 13.54 10.2734 13 11.1228 13H14.97C14.97 13 15 12.99 15 12.97V2.03C15 2.03 14.99 2 14.97 2H14.96ZM12.9914 11H11.1128C10.3433 11 9.61385 11.22 8.99429 11.61V6.03C8.99429 4.91 9.90364 4 11.0228 4H12.9914V11ZM2.99857 4H4.96717C6.08637 4 6.99572 4.91 6.99572 6.03V11.61C6.37616 11.22 5.64668 11 4.87723 11H2.99857V4Z\" fill=\"currentColor\"/>\n</svg>",
  "bookmark-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13 4C13 2.343 11.657 1 10 1H3V15L8 10.5L13 15V4Z\" fill=\"currentColor\"/>\n</svg>",
  "bookmark-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11 10.509L8 7.809L5 10.509V3H10C10.552 3 11 3.448 11 4V10.509ZM3 1V15L8 10.5L13 15V4C13 2.343 11.657 1 10 1H3Z\" fill=\"currentColor\"/>\n</svg>",
  "calendar": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M2 2V11C2 12.7 3.3 14 5 14H11C12.7 14 14 12.7 14 11V2H2ZM10.5 3.5C11.1 3.5 11.5 3.9 11.5 4.5C11.5 5.1 11.1 5.5 10.5 5.5C9.9 5.5 9.5 5.1 9.5 4.5C9.5 3.9 9.9 3.5 10.5 3.5ZM5.5 3.5C6.1 3.5 6.5 3.9 6.5 4.5C6.5 5.1 6.1 5.5 5.5 5.5C4.9 5.5 4.5 5.1 4.5 4.5C4.5 3.9 4.9 3.5 5.5 3.5ZM12 11C12 11.6 11.6 12 11 12H5C4.4 12 4 11.6 4 11V7H12V11Z\" fill=\"currentColor\"/>\n</svg>",
  "camera": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10 9C10 10.1 9.1 11 8 11C6.9 11 6 10.1 6 9C6 7.9 6.9 7 8 7C9.1 7 10 7.9 10 9ZM15 6.5V14H1V6.5C1 5.1 2.1 4 3.5 4H4.3L5 2H11L11.7 4H12.5C13.9 4 15 5.1 15 6.5ZM11 9C11 7.3 9.7 6 8 6C6.3 6 5 7.3 5 9C5 10.7 6.3 12 8 12C9.7 12 11 10.7 11 9Z\" fill=\"currentColor\"/>\n</svg>",
  "caret": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8 11L3 6H13L8 11Z\" fill=\"currentColor\"/>\n</svg>",
  "caret-right": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11 8L6 13V3L11 8Z\" fill=\"currentColor\"/>\n</svg>",
  "caret-up": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8.5 5.5L13.5 10.5H3.5L8.5 5.5Z\" fill=\"currentColor\"/>\n</svg>",
  "certificate": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M1 14V2H15V14H1ZM3 12V4H13V12H3ZM4 5H12V6H4V5ZM6 7H10V8H6V7ZM7 10H4V11H7V10ZM12.38 10C12.38 10.76 11.76 11.38 11 11.38C10.24 11.38 9.62 10.76 9.62 10C9.62 9.24 10.24 8.62 11 8.62C11.76 8.62 12.38 9.24 12.38 10Z\" fill=\"currentColor\"/>\n</svg>",
  "check": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5.7 11.9L2.4 8.6L1 10L6 15L15 2H12.6L5.7 11.9Z\" fill=\"currentColor\"/>\n</svg>",
  "checklist": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 6H8V4H15V6ZM15 10H8V12H15V10ZM7 1L2.5 7L0 4.5L1.43 3.07L2.32 3.96L4.53 1H7ZM7 7L2.5 13L0 10.5L1.43 9.07L2.32 9.96L4.54 7H7.01H7Z\" fill=\"currentColor\"/>\n</svg>",
  "chevron-down": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M1 7.4L8 12L15 7.4V5L8 9.6L1 5V7.4Z\" fill=\"currentColor\"/>\n</svg>",
  "chevron-left": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.6 1L4 8L8.6 15H11L6.4 8L11 1H8.6Z\" fill=\"currentColor\"/>\n</svg>",
  "chevron-right": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M7.4 15L12 8L7.4 1H5L9.6 8L5 15H7.4Z\" fill=\"currentColor\"/>\n</svg>",
  "chevron-up": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 8.6L8 4L1 8.6V11L8 6.4L15 11V8.6Z\" fill=\"currentColor\"/>\n</svg>",
  "circle": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 4C10.2 4 12 5.8 12 8C12 10.2 10.2 12 8 12C5.8 12 4 10.2 4 8C4 5.8 5.8 4 8 4ZM8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C11.3 14 14 11.3 14 8C14 4.7 11.3 2 8 2Z\" fill=\"currentColor\"/>\n</svg>",
  "clear": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM12 10.6L10.6 12L8 9.4L5.4 12L4 10.6L6.6 8L4 5.4L5.4 4L8 6.6L10.6 4L12 5.4L9.4 8L12 10.6Z\" fill=\"currentColor\"/>\n</svg>",
  "clipboard": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.95 1L8.71 0.44C8.59 0.15 8.29 0 8 0C7.71 0 7.41 0.15 7.29 0.44L7.05 1H3V12C3 13.66 4.34 15 6 15H10C11.66 15 13 13.66 13 12V1H8.95ZM11 12C11 12.55 10.55 13 10 13H6C5.45 13 5 12.55 5 12V3H6.21L6 3.5V4H10V3.5L9.79 3H11V12Z\" fill=\"currentColor\"/>\n</svg>",
  "clipboard-check": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.95 1L8.71 0.44C8.59 0.15 8.29 0 8 0C7.71 0 7.41 0.15 7.29 0.44L7.05 1H3V12C3 13.66 4.34 15 6 15H10C11.66 15 13 13.66 13 12V1H8.95ZM11 12C11 12.55 10.55 13 10 13H6C5.45 13 5 12.55 5 12V3H6.21L6 3.5V4H10V3.5L9.79 3H11V12ZM9.12 6H10.25L7.5 10L5.75 8.25L6.42 7.58L7.35 8.51L9.11 6H9.12Z\" fill=\"currentColor\"/>\n</svg>",
  "clock": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10.9 9.5C10.6 10 10 10.2 9.5 9.9L7.5 8.9C7.2 8.7 7 8.4 7 8V5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5V7.4L10.5 8.1C11 8.4 11.1 9 10.9 9.5ZM15 8C15 11.9 11.9 15 8 15C4.1 15 1 11.9 1 8C1 4.1 4.1 1 8 1C11.9 1 15 4.1 15 8ZM13 8C13 5.2 10.8 3 8 3C5.2 3 3 5.2 3 8C3 10.8 5.2 13 8 13C10.8 13 13 10.8 13 8Z\" fill=\"currentColor\"/>\n</svg>",
  "close": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12.6 2L8 6.6L3.4 2L2 3.4L6.6 8L2 12.6L3.4 14L8 9.4L12.6 14L14 12.6L9.4 8L14 3.4L12.6 2Z\" fill=\"currentColor\"/>\n</svg>",
  "closed-captions-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 3H4C2.34 3 1 4.34 1 6V10C1 11.66 2.34 13 4 13H12C13.66 13 15 11.66 15 10V6C15 4.34 13.66 3 12 3ZM5.5 9C5.78 9 6 8.78 6 8.5H7C7 9.33 6.33 10 5.5 10C4.67 10 4 9.33 4 8.5V7.5C4 6.67 4.67 6 5.5 6C6.33 6 7 6.67 7 7.5H6C6 7.22 5.78 7 5.5 7C5.22 7 5 7.22 5 7.5V8.5C5 8.78 5.22 9 5.5 9ZM10.5 9C10.78 9 11 8.78 11 8.5H12C12 9.33 11.33 10 10.5 10C9.67 10 9 9.33 9 8.5V7.5C9 6.67 9.67 6 10.5 6C11.33 6 12 6.67 12 7.5H11C11 7.22 10.78 7 10.5 7C10.22 7 10 7.22 10 7.5V8.5C10 8.78 10.22 9 10.5 9Z\" fill=\"currentColor\"/>\n</svg>",
  "closed-captions-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 3H4C2.34 3 1 4.34 1 6V10C1 11.66 2.34 13 4 13H12C13.66 13 15 11.66 15 10V6C15 4.34 13.66 3 12 3ZM13 10C13 10.55 12.55 11 12 11H4C3.45 11 3 10.55 3 10V6C3 5.45 3.45 5 4 5H12C12.55 5 13 5.45 13 6V10ZM6 7.5C6 7.22 5.78 7 5.5 7C5.22 7 5 7.22 5 7.5V8.5C5 8.78 5.22 9 5.5 9C5.78 9 6 8.78 6 8.5H7C7 9.33 6.33 10 5.5 10C4.67 10 4 9.33 4 8.5V7.5C4 6.67 4.67 6 5.5 6C6.33 6 7 6.67 7 7.5H6ZM11 7.5C11 7.22 10.78 7 10.5 7C10.22 7 10 7.22 10 7.5V8.5C10 8.78 10.22 9 10.5 9C10.78 9 11 8.78 11 8.5H12C12 9.33 11.33 10 10.5 10C9.67 10 9 9.33 9 8.5V7.5C9 6.67 9.67 6 10.5 6C11.33 6 12 6.67 12 7.5H11Z\" fill=\"currentColor\"/>\n</svg>",
  "comment": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 8H10V9H5V8ZM16 7.5C16 9.6 15 11.5 13.2 12.6L8 16V13H5.5C2.7 13 0 10.8 0 7.5C0 4.5 2.5 2 5.7 2H10.5C13.5 2 16 4.5 16 7.5ZM14 7.5C14 5.6 12.4 4 10.5 4H5.7C3.5 4 2 5.7 2 7.5C2 9.4 3.6 11 5.5 11H10V12.3L12.2 10.9C13.3 10.2 14 8.9 14 7.5ZM5 7H11V6H5V7Z\" fill=\"currentColor\"/>\n</svg>",
  "comment-off": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11 7H9.1L8.1 6H11V7ZM15 14.3L14.3 15L12.4 13.1L8 16V13H5.5C2.7 13 0 10.8 0 7.5C0 5.7 0.9 4.1 2.4 3.1L1 1.7L1.7 1L15 14.3ZM10.3 11L8.3 9H5V8H7.3L6.3 7H5V6H5.3L3.8 4.5C2.7 5.2 2 6.3 2 7.5C2 9.4 3.6 11 5.5 11H10.3ZM10.5 2H5.7C5.2 2 4.7 2.1 4.3 2.2L6.1 4H10.5C12.4 4 14 5.6 14 7.5V7.6C14 8.8 13.5 9.8 12.7 10.6L14.1 12C15.3 10.9 16 9.3 16 7.6V7.5C16 4.5 13.5 2 10.5 2Z\" fill=\"currentColor\"/>\n</svg>",
  "company": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M2 1V15H14V1H2ZM12 13H9V10H7V13H4V3H12V13ZM11 9H9V7H11V9ZM11 6H9V4H11V6ZM7 6H5V4H7V6ZM7 9H5V7H7V9Z\" fill=\"currentColor\"/>\n</svg>",
  "compose": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 2.5C15 2.9 14.8 3.2 14.6 3.5L9.1 9L6 10L7 6.9L12.4 1.5C12.7 1.1 13.1 1 13.5 1C13.9 1 14.3 1.1 14.6 1.4C14.9 1.7 15 2.1 15 2.5ZM12 11C12 11.6 11.6 12 11 12H5C4.4 12 4 11.6 4 11V5C4 4.4 4.4 4 5 4H8V2H5C3.3 2 2 3.3 2 5V11C2 12.7 3.3 14 5 14H11C12.7 14 14 12.7 14 11V8H12V11Z\" fill=\"currentColor\"/>\n</svg>",
  "connection-add": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M9 4C9 5.66 7.66 7 6 7C4.34 7 3 5.66 3 4C3 2.34 4.34 1 6 1C7.66 1 9 2.34 9 4ZM6.75 8H5.25C4.01 8 3 9.01 3 10.25V15H9V10.25C9 9.01 7.99 8 6.75 8ZM13 8V6H12V8H10V9H12V11H13V9H15V8H13Z\" fill=\"currentColor\"/>\n</svg>",
  "curly-braces": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 7V9C13.9 9 13 9.9 13 11V12C13 13.65 11.65 15 10 15H9V13H10C10.55 13 11 12.55 11 12V11C11 9.8 11.54 8.73 12.38 8C11.54 7.27 11 6.2 11 5V4C11 3.45 10.55 3 10 3H9V1H10C11.65 1 13 2.35 13 4V5C13 6.1 13.9 7 15 7ZM3 4V5C3 6.1 2.1 7 1 7V9C2.1 9 3 9.9 3 11V12C3 13.65 4.35 15 6 15H7V13H6C5.45 13 5 12.55 5 12V11C5 9.8 4.46 8.73 3.62 8C4.46 7.27 5 6.2 5 5V4C5 3.45 5.45 3 6 3H7V1H6C4.35 1 3 2.35 3 4Z\" fill=\"currentColor\"/>\n</svg>",
  "dashboard": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M13 5H10V12H13V5ZM3 5H9V8H3V5ZM3 9V12H9V9H3ZM1 5V4C1 3.93 1 3.86 1.01 3.8C1.11 2.79 1.96 2 3 2H13C14.1 2 15 2.9 15 4V12C15 13.1 14.1 14 13 14H3C1.9 14 1 13.1 1 12V5Z\" fill=\"currentColor\"/>\n</svg>",
  "document": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10 1H3V15H13V4L10 1ZM5 13V3H8V6H11V13H5Z\" fill=\"currentColor\"/>\n</svg>",
  "document-copy": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 3L11 0H4V2H1V16H12V13H14V3ZM10 14H3V4H4V13H10V14ZM12 11H6V2H9V5H12V11Z\" fill=\"currentColor\"/>\n</svg>",
  "document-search": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M0 1H11V5.78C10.84 5.76 10.67 5.75 10.5 5.75C7.88 5.75 5.75 7.88 5.75 10.5C5.75 12.59 7.1 14.36 8.98 15H0V1ZM9 5H2V4H9V5ZM5 7H2V6H5V7ZM10.5 14C11.1 14 11.67 13.85 12.17 13.58L14.3 15.71C14.69 16.1 15.32 16.1 15.71 15.71C16.1 15.32 16.1 14.69 15.71 14.3L13.58 12.17C13.85 11.67 14 11.11 14 10.5C14 8.57 12.43 7 10.5 7C8.57 7 7 8.57 7 10.5C7 12.43 8.57 14 10.5 14ZM10.5 12.5C11.6 12.5 12.5 11.6 12.5 10.5C12.5 9.4 11.6 8.5 10.5 8.5C9.4 8.5 8.5 9.4 8.5 10.5C8.5 11.6 9.4 12.5 10.5 12.5Z\" fill=\"currentColor\"/>\n</svg>",
  "download": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 10V12C14 13.7 12.7 15 11 15H5C3.3 15 2 13.7 2 12V10H4V12C4 12.6 4.4 13 5 13H11C11.6 13 12 12.6 12 12V10H14ZM12 8.1V5.7L9 7.8V1H7V7.8L4 5.7V8.1L8 11L12 8.1Z\" fill=\"currentColor\"/>\n</svg>",
  "edit": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.1 1.9C13.6 1.3 12.8 1 12 1C11.2 1 10.5 1.3 9.9 1.9L2.9 8.9L1 15L7.2 13L14.1 6C14.7 5.5 15 4.7 15 4C15 3.2 14.7 2.5 14.1 1.9ZM5.8 11.6L4.5 10.3L9.6 5L11 6.4L5.8 11.6Z\" fill=\"currentColor\"/>\n</svg>",
  "envelope": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M1 3V10C1 11.66 2.34 13 4 13H12C13.66 13 15 11.66 15 10V3H1ZM13 5V5.39L8 7.89L3 5.39V5H13ZM12 11H4C3.45 11 3 10.55 3 10V6.52L8 9L13 6.52V10C13 10.55 12.55 11 12 11Z\" fill=\"currentColor\"/>\n</svg>",
  "envelope-open": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1L1 4.47V11C1 12.66 2.34 14 4 14H12C13.66 14 15 12.66 15 11V4.47L8 1ZM13 11C13 11.55 12.55 12 12 12H4C3.45 12 3 11.55 3 11V6.51L8 9L13 6.51V11Z\" fill=\"currentColor\"/>\n</svg>",
  "embed": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.03 2H8.92L4.98 14H7.09L11.03 2ZM2.8 4H5.24L2.44 8L5.24 12H2.8L0.41 8.57L0 8L0.4 7.43L2.8 4ZM10.75 12H13.19L15.59 8.57L15.99 8L15.59 7.43L13.19 4H10.75L13.55 8L10.75 12Z\" fill=\"currentColor\"/>\n</svg>",
  "emoji": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8ZM8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM11.4641 8.5C11.113 9.10807 10.6081 9.61302 10 9.96409C9.39195 10.3152 8.70218 10.5 8.00004 10.5C7.2979 10.5 6.60813 10.3152 6.00005 9.96413C5.39198 9.61307 4.88702 9.10814 4.53594 8.50007L3.23692 9.2501C3.71966 10.0862 4.41397 10.7805 5.25008 11.2632C6.08618 11.7459 7.03462 12 8.00006 12C8.9655 12 9.91393 11.7459 10.75 11.2631C11.5861 10.7804 12.2804 10.0861 12.7631 9.25L11.4641 8.5ZM6.75 6C6.75 6.69036 6.19036 7.25 5.5 7.25C4.80964 7.25 4.25 6.69036 4.25 6C4.25 5.30964 4.80964 4.75 5.5 4.75C6.19036 4.75 6.75 5.30964 6.75 6ZM10.5 7.25C11.1904 7.25 11.75 6.69036 11.75 6C11.75 5.30964 11.1904 4.75 10.5 4.75C9.80964 4.75 9.25 5.30964 9.25 6C9.25 6.69036 9.80964 7.25 10.5 7.25Z\" fill=\"currentColor\"/>\n</svg>",
  "fast-forward": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 8L7 2V6.29L2 2V14L7 9.71V14L14 8Z\" fill=\"currentColor\"/>\n</svg>",
  "filter": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 4H6.72C6.37 4.6 5.74 5 5 5C4.26 5 3.62 4.6 3.28 4H1V2H3.28C3.63 1.4 4.26 1 5 1C5.74 1 6.38 1.4 6.72 2H15V4ZM15 12H6.72C6.37 11.4 5.74 11 5 11C4.26 11 3.62 11.4 3.28 12H1V14H3.28C3.63 14.6 4.26 15 5 15C5.74 15 6.38 14.6 6.72 14H15V12ZM15 7H12.72C12.37 6.4 11.74 6 11 6C10.26 6 9.62 6.4 9.28 7H1V9H9.28C9.63 9.6 10.26 10 11 10C11.74 10 12.38 9.6 12.72 9H15V7Z\" fill=\"currentColor\"/>\n</svg>",
  "folder": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M1 7H15V12C15 13.1 14.1 14 13 14H3C1.9 14 1 13.1 1 12V7ZM8 4L7 2H1V6H15V4H8Z\" fill=\"currentColor\"/>\n</svg>",
  "format-font": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.91 11.28L16 6H14.89L13.92 6.87C13.77 6.43 13.26 6 12.38 6C10.36 6 9.01 8.07 9.01 10.49C9.01 12.04 9.74 13 10.84 13C11.81 13 12.63 12.33 12.99 11.1C12.97 11.18 12.91 11.57 12.91 11.64C12.81 12.56 13.19 12.99 13.97 12.99C14.75 12.99 15.49 12.61 15.85 12.1L15.91 11.76C15.74 11.9 15.5 11.99 15.28 11.99C14.97 11.99 14.83 11.78 14.92 11.29L14.91 11.28ZM13.03 10.48C12.79 11.49 12.3 12.07 11.8 12.07C11.35 12.07 11.09 11.69 11.09 10.72C11.09 9.06 11.7 6.65 12.96 6.65C13.37 6.65 13.64 6.88 13.72 7.15L13.04 10.48H13.03ZM5.41 3H3.16L0 13H1.96L2.65 10.57H5.86L6.55 13H8.58L5.41 3ZM4.23 4.91H4.27L5.43 9H3.07L4.23 4.91Z\" fill=\"currentColor\"/>\n</svg>",
  "fullscreen-enter": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M3 2H6V4H3V6H1V2H3ZM13 2H10V4H13V6H15V2H13ZM3 10H1V14H6V12H3V10ZM13 12H10V14H15V10H13V12Z\" fill=\"currentColor\"/>\n</svg>",
  "fullscreen-exit": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4 2H6V6H1V4H4V2ZM12 4V2H10V6H15V4H12ZM1 12H4V14H6V10H1V12ZM10 11V14H12V12H15V10H10V11Z\" fill=\"currentColor\"/>\n</svg>",
  "g2": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.01001 1C4.14001 1 1.01001 4.13 1.01001 7.99C1.01001 11.85 4.14001 14.98 8.00001 14.98C11.86 14.98 14.99 11.85 14.99 7.99C14.99 4.13 11.87 1 8.01001 1ZM9.23001 6.77C9.23001 6.46 9.29001 6.21 9.41001 6.01C9.53001 5.81 9.75001 5.63 10.05 5.48L10.19 5.41C10.44 5.28 10.5 5.18 10.5 5.05C10.5 4.9 10.37 4.78 10.15 4.78C9.89001 4.78 9.70001 4.91 9.57001 5.18L9.22001 4.83C9.30001 4.67 9.42001 4.54 9.58001 4.44C9.75001 4.34 9.93001 4.28 10.12 4.28C10.37 4.28 10.59 4.34 10.76 4.48C10.94 4.61 11.03 4.8 11.03 5.03C11.03 5.4 10.82 5.63 10.43 5.83L10.21 5.94C9.98001 6.06 9.86001 6.16 9.83001 6.35H11.02V6.84H9.21001V6.76L9.23001 6.77ZM8.08001 11.99C5.87001 11.99 4.08001 10.2 4.08001 7.99C4.08001 5.78 5.87001 3.99 8.08001 3.99C8.35001 3.99 8.61001 4.02 8.86001 4.07L8.08001 5.71C6.82001 5.71 5.80001 6.73 5.80001 7.99C5.80001 9.25 6.82001 10.27 8.08001 10.27C8.65001 10.27 9.17001 10.06 9.57001 9.72L10.44 11.22C9.78001 11.7 8.97001 11.99 8.09001 11.99H8.08001ZM10.88 10.85L9.89001 9.14H7.91001L8.90001 7.43H10.88L11.87 9.14L10.88 10.85Z\" fill=\"currentColor\"/>\n</svg>",
  "gallery-view": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5.5 9C6.32843 9 7 9.67157 7 10.5V13.5C7 14.3284 6.32843 15 5.5 15H2.5C1.67157 15 1 14.3284 1 13.5V10.5C1 9.67157 1.67157 9 2.5 9H5.5ZM13.5 9C14.3284 9 15 9.67157 15 10.5V13.5C15 14.3284 14.3284 15 13.5 15H10.5C9.67157 15 9 14.3284 9 13.5V10.5C9 9.67157 9.67157 9 10.5 9H13.5ZM2.5 13.5H5.5V10.5H2.5V13.5ZM10.5 13.5H13.5V10.5H10.5V13.5ZM5.5 1C6.32843 1 7 1.67157 7 2.5V5.5C7 6.32843 6.32843 7 5.5 7H2.5C1.67157 7 1 6.32843 1 5.5V2.5C1 1.67157 1.67157 1 2.5 1H5.5ZM13.5 1C14.3284 1 15 1.67157 15 2.5V5.5C15 6.32843 14.3284 7 13.5 7H10.5C9.67157 7 9 6.32843 9 5.5V2.5C9 1.67157 9.67157 1 10.5 1H13.5ZM2.5 5.5H5.5V2.5H2.5V5.5ZM10.5 5.5H13.5V2.5H10.5V5.5Z\" fill=\"currentColor\"/>\n</svg>",
  "gif": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 6V7H14V9H12V12H10V4H15V6H12ZM7 12H9V4H7V12ZM1 6V10C1 11.1 1.9 12 3 12C3.39 12 3.74 11.99 4.63 11.26L5 12H6V8H4V10H3V6H6V4H3C1.9 4 1 4.9 1 6Z\" fill=\"currentColor\"/>\n</svg>",
  "gift": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 4V7H9V4H7V7H2V4H5.47C4.65 3.99 4 3.32 4 2.5C4 1.68 4.67 1 5.5 1C5.9 1 6.26 1.16 6.52 1.41L8 3L9.48 1.41C9.75 1.16 10.11 1 10.5 1C11.33 1 12 1.67 12 2.5C12 3.33 11.34 3.98 10.53 4H14ZM7 8H3V12C3 13.1 3.9 14 5 14H7V8ZM9 8V14H11C12.1 14 13 13.1 13 12V8H9Z\" fill=\"currentColor\"/>\n</svg>",
  "globe-americas": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM3 8C3 6.88 3.39 5.85 4.01 5.01L4.56 5.56C4.84 5.84 5 6.22 5 6.62V7.69C5 7.89 5.08 8.08 5.22 8.22L5.78 8.78C5.92 8.92 6.11 9 6.31 9H7V9.69C7 9.89 7.08 10.08 7.22 10.22L7.78 10.78C7.92 10.92 8 11.11 8 11.31V13C5.24 13 3 10.76 3 8ZM9.24 12.83L11.2 10.38C11.38 10.15 11.42 9.84 11.29 9.58L10.71 8.42C10.58 8.16 10.32 8 10.04 8H7V7.81C7 7.62 7.11 7.45 7.28 7.36L7.67 7.17C7.88 7.06 8.13 7.06 8.34 7.17L9 7.5L9.38 6.8C9.46 6.65 9.5 6.49 9.5 6.32V5.47C9.5 5.27 9.58 5.09 9.71 4.95L10.78 3.86C12.12 4.75 13 6.27 13 8C13 10.33 11.4 12.27 9.24 12.83Z\" fill=\"currentColor\"/>\n</svg>",
  "globe-language": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C4.14 1 1 4.14 1 8C1 11.86 4.14 15 8 15C11.86 15 15 11.86 15 8C15 4.14 11.86 1 8 1ZM9.58 11C9.27 12 8.83 12.7 8.38 12.96C8.25 13.03 8.13 13.07 8 13.07C7.87 13.07 7.75 13.03 7.62 12.96C7.17 12.7 6.73 11.99 6.42 11C6.32 10.69 6.24 10.36 6.17 10H9.82C9.75 10.36 9.67 10.69 9.57 11H9.58ZM6.05 9C6.02 8.68 6.01 8.35 6.01 8C6.01 7.65 6.03 7.32 6.05 7H9.96C9.99 7.32 10 7.65 10 8C10 8.35 9.98 8.68 9.96 9H6.05ZM3.01 8C3.01 7.66 3.05 7.32 3.11 7H5.05C5.02 7.32 5.01 7.66 5.01 8C5.01 8.34 5.02 8.68 5.05 9H3.11C3.04 8.68 3.01 8.34 3.01 8ZM6.43 5C6.74 4 7.18 3.3 7.63 3.04C7.76 2.97 7.88 2.92 8.01 2.92C8.14 2.92 8.26 2.96 8.39 3.04C8.84 3.3 9.28 4.01 9.59 5C9.69 5.31 9.77 5.64 9.84 6H6.19C6.26 5.64 6.34 5.31 6.44 5H6.43ZM10.96 7H12.9C12.97 7.32 13 7.66 13 8C13 8.34 12.96 8.68 12.9 9H10.96C10.99 8.68 11 8.34 11 8C11 7.66 10.99 7.32 10.96 7ZM11.98 5C12.21 5.31 12.42 5.64 12.58 6H10.84C10.78 5.65 10.71 5.31 10.62 5C10.45 4.39 10.23 3.85 9.97 3.41C10.77 3.76 11.45 4.31 11.97 5H11.98ZM6.04 3.41C5.78 3.86 5.56 4.39 5.39 5C5.3 5.31 5.23 5.65 5.17 6H3.43C3.59 5.64 3.8 5.31 4.03 5C4.55 4.31 5.23 3.75 6.03 3.41H6.04ZM4.04 11C3.81 10.69 3.6 10.36 3.44 10H5.18C5.24 10.35 5.31 10.69 5.4 11C5.57 11.61 5.79 12.15 6.05 12.59C5.25 12.24 4.57 11.69 4.05 11H4.04ZM9.98 12.59C10.24 12.14 10.46 11.61 10.63 11C10.72 10.69 10.79 10.35 10.85 10H12.59C12.43 10.36 12.22 10.69 11.99 11C11.47 11.69 10.79 12.25 9.99 12.59H9.98Z\" fill=\"currentColor\"/>\n</svg>",
  "group": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10 8.5V14H6V8.5C6 7.67 6.67 7 7.5 7H8.5C9.33 7 10 7.67 10 8.5ZM12.75 8H12.25C11.56 8 11 8.56 11 9.25V14H14V9.25C14 8.56 13.44 8 12.75 8ZM8 2C6.9 2 6 2.9 6 4C6 5.1 6.9 6 8 6C9.1 6 10 5.1 10 4C10 2.9 9.1 2 8 2ZM12.5 7C13.33 7 14 6.33 14 5.5C14 4.67 13.33 4 12.5 4C11.67 4 11 4.67 11 5.5C11 6.33 11.67 7 12.5 7ZM3.75 8H3.25C2.56 8 2 8.56 2 9.25V14H5V9.25C5 8.56 4.44 8 3.75 8ZM3.5 4C2.67 4 2 4.67 2 5.5C2 6.33 2.67 7 3.5 7C4.33 7 5 6.33 5 5.5C5 4.67 4.33 4 3.5 4Z\" fill=\"currentColor\"/>\n</svg>",
  "hashtag": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6.65 11H8.65L8.32 14H10.32L10.65 11H14V9H10.87L11.12 7H13.99V5H11.34L11.67 2H9.67L9.34 5H7.34L7.67 2H5.67L5.34 5H2V7H5.13L4.88 9H2V11H4.65L4.32 14H6.32L6.65 11ZM7.12 7H9.12L8.87 9H6.87L7.12 7Z\" fill=\"currentColor\"/>\n</svg>",
  "image": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 2H4C2.35 2 1 3.35 1 5V11C1 12.65 2.35 14 4 14H12C13.65 14 15 12.65 15 11V5C15 3.35 13.65 2 12 2ZM13 11L11 9L9.5 10.5L6 7L3 10V5C3 4.45 3.45 4 4 4H12C12.55 4 13 4.45 13 5V11ZM12 6.5C12 7.32 11.33 8 10.5 8C9.67 8 9 7.32 9 6.5C9 5.68 9.67 5 10.5 5C11.33 5 12 5.67 12 6.5Z\" fill=\"currentColor\"/>\n</svg>",
  "image-square": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5 2C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V11C2 11.7956 2.31607 12.5587 2.87868 13.1213C3.44129 13.6839 4.20435 14 5 14H11C11.7956 14 12.5587 13.6839 13.1213 13.1213C13.6839 12.5587 14 11.7956 14 11V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2H5ZM11 4H5C4.73478 4 4.48043 4.10536 4.29289 4.29289C4.10536 4.48043 4 4.73478 4 5V9.5L6 7.5L9 10.5L10.5 9L12 10.5V5C12 4.73478 11.8946 4.48043 11.7071 4.29289C11.5196 4.10536 11.2652 4 11 4Z\" fill=\"currentColor\"/>\n<path d=\"M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8Z\" fill=\"currentColor\"/>\n</svg>",
  "import-export": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16 15H0V13H16V15ZM8 3.85V6.29L11 4.15V10H13V4.15L16 6.29V3.85L12 1L8 3.85ZM8 9.15V6.71L5 8.85V3H3V8.85L0 6.71V9.15L4 12L8 9.15Z\" fill=\"currentColor\"/>\n</svg>",
  "in-common": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11 3C9.91815 3 8.86548 3.35089 8 4C7.25715 3.44287 6.37384 3.1036 5.44903 3.02021C4.52422 2.93682 3.59446 3.1126 2.76393 3.52787C1.9334 3.94313 1.23492 4.58147 0.746746 5.37135C0.258573 6.16123 0 7.07144 0 8C0 8.92856 0.258573 9.83878 0.746746 10.6287C1.23492 11.4185 1.9334 12.0569 2.76393 12.4721C3.59446 12.8874 4.52422 13.0632 5.44903 12.9798C6.37384 12.8964 7.25715 12.5571 8 12C8.63381 12.4754 9.3715 12.7933 10.1523 12.9276C10.9331 13.0619 11.7346 13.0088 12.4908 12.7726C13.2471 12.5363 13.9363 12.1238 14.5018 11.5689C15.0673 11.0141 15.4929 10.3327 15.7434 9.58114C15.994 8.82954 16.0623 8.02916 15.9428 7.24596C15.8233 6.46276 15.5195 5.71917 15.0562 5.07645C14.593 4.43374 13.9836 3.9103 13.2784 3.54929C12.5732 3.18827 11.7923 3 11 3ZM2 8C2.00099 7.45584 2.14997 6.9222 2.43099 6.45622C2.712 5.99023 3.11447 5.60946 3.59529 5.35466C4.07611 5.09987 4.61718 4.98065 5.16056 5.00978C5.70394 5.0389 6.22917 5.21527 6.68 5.52C6.22803 6.27558 5.98934 7.13956 5.98934 8.02C5.98934 8.90045 6.22803 9.76442 6.68 10.52C6.18003 10.8431 5.59522 11.0102 5 11C4.20435 11 3.44129 10.6839 2.87868 10.1213C2.31607 9.55871 2 8.79565 2 8ZM11 11C10.4006 10.9984 9.81548 10.8173 9.32 10.48C9.77197 9.72442 10.0107 8.86045 10.0107 7.98C10.0107 7.09956 9.77197 6.23558 9.32 5.48C9.71001 5.22824 10.1531 5.07042 10.6145 5.01896C11.0758 4.9675 11.5428 5.02381 11.9787 5.18345C12.4146 5.34309 12.8075 5.60171 13.1265 5.93896C13.4455 6.27621 13.6819 6.68288 13.8171 7.12699C13.9522 7.57109 13.9825 8.04049 13.9054 8.49827C13.8284 8.95605 13.6462 9.3897 13.3731 9.76512C13.1001 10.1405 12.7436 10.4474 12.3318 10.6617C11.92 10.876 11.4641 10.9918 11 11Z\" fill=\"currentColor\"/>\n</svg>",
  "job": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 8.99V12C15 13.1 14.1 14 13 14H3C1.9 14 1 13.1 1 12V8.99C1.42 9.31 1.94 9.5 2.5 9.5H13.5C14.07 9.5 14.58 9.3 15 8.99ZM1 7V4H4V3C4 1.9 4.9 1 6 1H10C11.1 1 12 1.9 12 3V4H15V7C15 7.83 14.33 8.5 13.5 8.5H2.5C1.67 8.5 1 7.83 1 7ZM6 4H10V3.5C10 3.22 9.78 3 9.5 3H6.5C6.22 3 6 3.22 6 3.5V4Z\" fill=\"currentColor\"/>\n</svg>",
  "keyboard-down": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M2 2V9H14V2H2ZM0.667 0C0.490101 0 0.320447 0.070273 0.19536 0.19536C0.070273 0.320447 0 0.490101 0 0.667L0 10.333C0 10.701 0.298 11 0.667 11H15.333C15.5099 11 15.6796 10.9297 15.8046 10.8046C15.9297 10.6796 16 10.5099 16 10.333V0.667C16 0.490101 15.9297 0.320447 15.8046 0.19536C15.6796 0.070273 15.5099 0 15.333 0L0.667 0ZM6 3H4V5H6V3ZM5 8V6H3V8H5ZM13 6V8H11V6H13ZM9 3H7V5H9V3ZM10 3H12V5H10V3ZM10 6H6V8H10V6ZM5 14.029V11.629L8 13.6L11 11.629V14.029L8 16L5 14.029Z\" fill=\"currentColor\"/>\n</svg>",
  "keyboard-up": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8 0L11 1.971V4.371L8 2.4L5 4.371V1.971L8 0ZM2 7V14H14V7H2ZM0.667 5C0.490101 5 0.320447 5.07027 0.19536 5.19536C0.070273 5.32045 0 5.4901 0 5.667L0 15.333C0 15.701 0.298 16 0.667 16H15.333C15.5099 16 15.6796 15.9297 15.8046 15.8046C15.9297 15.6796 16 15.5099 16 15.333V5.667C16 5.4901 15.9297 5.32045 15.8046 5.19536C15.6796 5.07027 15.5099 5 15.333 5H0.667ZM6 10V8H4V10H6ZM5 13V11H3V13H5ZM13 11V13H11V11H13ZM9 10V8H7V10H9ZM10 10V8H12V10H10ZM10 11H6V13H10V11Z\" fill=\"currentColor\"/>\n</svg>",
  "lightbulb": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M9.29749 2.70898L9.81671 1.44974C9.97647 1.06997 10.4158 0.89008 10.7952 1.04998C11.1747 1.20989 11.3544 1.64962 11.1946 2.02939L10.6754 3.28863C10.5556 3.57846 10.276 3.74836 9.98646 3.74836C9.88661 3.74836 9.79674 3.72837 9.69689 3.68839C9.31746 3.52849 9.13773 3.08875 9.29749 2.70898ZM12.9819 6.74655C13.0818 6.74655 13.1717 6.72656 13.2715 6.68658L14.5296 6.1669C14.909 6.00699 15.0888 5.56726 14.939 5.18749C14.7792 4.80772 14.3399 4.62783 13.9605 4.77774L12.7024 5.29742C12.3229 5.45733 12.1432 5.89706 12.293 6.27683C12.4128 6.56666 12.6924 6.73655 12.9819 6.73655V6.74655ZM5.28353 3.28863C5.40335 3.57846 5.68293 3.74836 5.97249 3.74836C6.07234 3.74836 6.16221 3.72837 6.26206 3.68839C6.64149 3.52849 6.82122 3.08875 6.66146 2.70898L6.14224 1.44974C5.98248 1.06997 5.54314 0.89008 5.16371 1.04998C4.78428 1.20989 4.60455 1.64962 4.76431 2.02939L5.28353 3.28863ZM2.71739 9.30501L1.45929 9.82469C1.07986 9.9846 0.900127 10.4243 1.0499 10.8041C1.16972 11.0939 1.4493 11.2638 1.73886 11.2638C1.83871 11.2638 1.92858 11.2438 2.02843 11.2039L3.28654 10.6842C3.66597 10.5243 3.84569 10.0845 3.69592 9.70477C3.53616 9.32499 3.10681 9.1451 2.71739 9.29501V9.30501ZM11.4842 7.9958C11.4842 9.08514 10.985 10.0645 10.1961 10.7042C9.76679 11.0739 9.59704 11.6036 9.52715 11.9934H6.44179C6.37189 11.6136 6.21213 11.0939 5.80275 10.7241L5.78278 10.7042C4.99397 10.0645 4.49472 9.08514 4.49472 7.9958C4.49472 6.06696 6.06236 4.4979 7.98946 4.4979C9.91656 4.4979 11.4842 6.06696 11.4842 7.9958ZM9.58706 7.9958C9.58706 7.11633 8.86814 6.39676 7.98946 6.39676C7.11078 6.39676 6.39186 7.11633 6.39186 7.9958C6.39186 8.47551 6.60155 8.92524 6.98098 9.23505H6.99096L7.0309 9.27502C7.48023 9.67478 7.77978 10.1245 7.98946 10.5742C8.19914 10.1145 8.50868 9.6448 8.97797 9.25504C9.37737 8.92524 9.58706 8.47551 9.58706 7.9958ZM14.5196 9.8147L13.2615 9.29501C12.8821 9.13511 12.4428 9.315 12.283 9.70477C12.1232 10.0945 12.303 10.5243 12.6924 10.6842L13.9505 11.2039C14.0404 11.2438 14.1402 11.2638 14.2401 11.2638C14.5296 11.2638 14.8092 11.0939 14.929 10.8041C15.0888 10.4243 14.909 9.9846 14.5196 9.82469V9.8147ZM3.28654 5.30742L2.02843 4.78773C1.649 4.62783 1.20966 4.81771 1.0499 5.19748C0.890142 5.57725 1.06987 6.01699 1.45929 6.17689L2.71739 6.69658C2.80726 6.73656 2.90711 6.75654 3.00696 6.75654C3.29652 6.75654 3.5761 6.58665 3.69592 6.29682C3.85568 5.91705 3.67595 5.47731 3.28654 5.31741V5.30742ZM6.49171 13.4925C6.49171 14.322 7.16071 14.9916 7.98946 14.9916C8.81821 14.9916 9.48721 14.322 9.48721 13.4925V12.9928H6.49171V13.4925Z\" fill=\"currentColor\"/>\n</svg>",
  "lightbulb-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11.484 7.99599C11.484 9.08599 10.985 10.065 10.196 10.704C9.76599 11.074 9.59699 11.604 9.52699 11.994H6.44199C6.37199 11.614 6.21199 11.094 5.80199 10.724L5.78199 10.704C5.37919 10.3771 5.05457 9.96424 4.83189 9.4957C4.60921 9.02716 4.4941 8.51475 4.49499 7.99599C4.49552 7.06912 4.86368 6.1803 5.5187 5.52453C6.17372 4.86875 7.06212 4.49958 7.98899 4.49799C8.91603 4.49931 9.80469 4.86837 10.4599 5.52417C11.1152 6.17997 11.4835 7.06894 11.484 7.99599ZM12.982 6.74699C13.082 6.74699 13.172 6.72699 13.272 6.68699L14.53 6.16699C14.91 6.00699 15.089 5.56699 14.939 5.18699C14.8611 5.00477 14.7154 4.86005 14.5326 4.78351C14.3498 4.70697 14.1445 4.70463 13.96 4.77699L12.702 5.29699C12.5201 5.37542 12.3757 5.52147 12.2994 5.70431C12.2231 5.88715 12.2208 6.09249 12.293 6.27699C12.413 6.56699 12.693 6.73699 12.982 6.73699V6.74699ZM14.52 9.81499L13.262 9.29499C13.1709 9.25687 13.0731 9.23725 12.9743 9.23727C12.8756 9.23729 12.7778 9.25695 12.6867 9.2951C12.5956 9.33325 12.513 9.38914 12.4437 9.4595C12.3744 9.52987 12.3197 9.61332 12.283 9.70499C12.123 10.095 12.303 10.525 12.693 10.685L13.951 11.204C14.0415 11.2424 14.1387 11.2625 14.237 11.2632C14.3353 11.2638 14.4328 11.245 14.5238 11.2078C14.6148 11.1706 14.6975 11.1158 14.7672 11.0465C14.837 10.9772 14.8923 10.8948 14.93 10.804C14.9681 10.7128 14.9878 10.6149 14.9878 10.5161C14.9877 10.4173 14.9681 10.3194 14.93 10.2282C14.8918 10.1371 14.8359 10.0544 14.7655 9.98497C14.6952 9.91557 14.6117 9.86085 14.52 9.82399V9.81499ZM6.49199 13.492C6.49199 13.8893 6.64981 14.2703 6.93074 14.5512C7.21167 14.8322 7.59269 14.99 7.98999 14.99C8.38728 14.99 8.76831 14.8322 9.04924 14.5512C9.33016 14.2703 9.48799 13.8893 9.48799 13.492V12.992H6.49099L6.49199 13.492ZM9.29699 2.70899L9.81699 1.44899C9.89839 1.27305 10.0449 1.13559 10.2257 1.06557C10.4065 0.995551 10.6074 0.99845 10.786 1.07365C10.9647 1.14886 11.1072 1.29049 11.1835 1.46871C11.2598 1.64692 11.2639 1.84779 11.195 2.02899L10.675 3.28899C10.6373 3.37965 10.582 3.46197 10.5124 3.53119C10.4427 3.60042 10.3601 3.6552 10.2692 3.69237C10.1783 3.72954 10.0809 3.74838 9.98274 3.7478C9.88455 3.74722 9.78743 3.72723 9.69699 3.68899C9.51426 3.61175 9.36958 3.46526 9.29461 3.28159C9.21964 3.09792 9.2205 2.89203 9.29699 2.70899ZM5.28399 3.28899C5.32171 3.37965 5.37698 3.46197 5.44663 3.53119C5.51627 3.60042 5.59892 3.6552 5.68981 3.69237C5.7807 3.72954 5.87804 3.74838 5.97624 3.7478C6.07443 3.74722 6.17155 3.72723 6.26199 3.68899C6.64199 3.52899 6.82199 3.08899 6.66199 2.70899L6.14199 1.44899C6.06059 1.27305 5.91406 1.13559 5.73329 1.06557C5.55252 0.995551 5.35163 0.99845 5.17295 1.07365C4.99428 1.14886 4.85178 1.29049 4.77549 1.46871C4.6992 1.64692 4.69507 1.84779 4.76399 2.02899L5.28399 3.28899ZM3.28699 5.30699L2.02799 4.78699C1.84385 4.71253 1.63775 4.71384 1.45457 4.79063C1.2714 4.86742 1.12598 5.01348 1.04999 5.19699C0.889989 5.57699 1.06999 6.01699 1.45999 6.17699L2.71699 6.69699C2.80749 6.73539 2.90469 6.7555 3.003 6.75616C3.1013 6.75682 3.19877 6.73801 3.28977 6.70083C3.38078 6.66365 3.46353 6.60882 3.53324 6.53951C3.60296 6.4702 3.65827 6.38777 3.69599 6.29699C3.73412 6.2058 3.75376 6.10795 3.75375 6.00911C3.75375 5.91027 3.7341 5.81242 3.69595 5.72124C3.6578 5.63006 3.60192 5.54737 3.53154 5.47797C3.46116 5.40857 3.3777 5.35385 3.28599 5.31699L3.28699 5.30699ZM2.71699 9.30499L1.45899 9.82499C1.07899 9.98499 0.899989 10.425 1.04899 10.805C1.08679 10.8958 1.14221 10.9782 1.21204 11.0475C1.28188 11.1168 1.36474 11.1716 1.45585 11.2087C1.54696 11.2458 1.64452 11.2645 1.74289 11.2637C1.84126 11.2629 1.9385 11.2426 2.02899 11.204L3.28699 10.684C3.66599 10.524 3.84599 10.084 3.69599 9.70399C3.61877 9.52128 3.47301 9.37611 3.28998 9.29965C3.10695 9.22318 2.90124 9.22151 2.71699 9.29499V9.30499Z\" fill=\"currentColor\"/>\n</svg>",
  "link": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.76999 11.03C7.97999 11.03 7.19999 10.73 6.59999 10.14C6.20999 9.75 6.20999 9.12 6.59999 8.72001C6.98999 8.33001 7.61999 8.33001 8.00999 8.72001C8.42999 9.14001 9.10999 9.14001 9.52999 8.72001L12.52 5.74C12.82 5.44 12.99 5.03 12.99 4.6C12.99 4.17 12.82 3.76 12.52 3.46001C11.91 2.85001 10.92 2.85001 10.31 3.46001L9.91999 3.85C9.52999 4.24001 8.88999 4.24001 8.50999 3.85C8.11999 3.46 8.11999 2.82 8.50999 2.43L8.89999 2.04C10.29 0.660005 12.54 0.660005 13.93 2.04C14.61 2.72 14.99 3.63 14.99 4.6C14.99 5.57 14.61 6.48 13.93 7.16L10.94 10.14C10.34 10.74 9.54999 11.03 8.76999 11.03ZM7.08999 13.97L7.47999 13.58C7.86999 13.19 7.86999 12.56 7.47999 12.17C7.08999 11.78 6.45999 11.78 6.06999 12.17L5.67999 12.56C5.06999 13.17 4.07999 13.17 3.46999 12.56C3.16999 12.26 2.99999 11.85 2.99999 11.42C2.99999 10.99 3.16999 10.58 3.46999 10.28L6.46999 7.3C6.88999 6.88 7.56999 6.88 7.98999 7.3C8.37999 7.69 9.00999 7.69 9.39999 7.3C9.78999 6.91001 9.78999 6.27 9.39999 5.88C8.19999 4.69 6.24999 4.69 5.04999 5.88L2.04999 8.86C1.35999 9.54 0.98999 10.45 0.98999 11.42C0.98999 12.39 1.36999 13.3 2.04999 13.98C2.73999 14.67 3.64999 15.01 4.55999 15.01C5.46999 15.01 6.37999 14.67 7.06999 13.98L7.08999 13.97Z\" fill=\"currentColor\"/>\n</svg>",
  "link-external": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M16 1V7H14V4.4L8.4 10L7 8.6L12.6 3H10V1H16ZM12 11C12 11.6 11.6 12 11 12H6C5.4 12 5 11.6 5 11V6C5 5.4 5.4 5 6 5H8V3H6C4.3 3 3 4.3 3 6V11C3 12.7 4.3 14 6 14H11C12.7 14 14 12.7 14 11V9H12V11Z\" fill=\"currentColor\"/>\n</svg>",
  "linked-in-bug-influencer": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 0H2C1.45 0 1 0.45 1 1V16L4 14H14C14.55 14 15 13.55 15 13V1C15 0.45 14.55 0 14 0ZM5 12H3V5H5V12ZM4 4.2C3.34 4.2 2.75 3.63 2.75 3C2.75 2.37 3.34 1.8 4 1.8C4.66 1.8 5.25 2.37 5.25 3C5.25 3.63 4.66 4.2 4 4.2ZM13 12H11V8.73C11 7.94 10.82 6.8 9.66 6.8C8.48 6.8 8 7.84 8 8.73V12H6V5H7.85V6.01H7.89C8.28 5.44 9.03 4.8 10.14 4.8C12.27 4.8 13 6.09 13 8.29V12Z\" fill=\"currentColor\"/>\n</svg>",
  "linked-in-bug": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 2V14C15 14.6 14.6 15 14 15H2C1.4 15 1 14.6 1 14V2C1 1.4 1.4 1 2 1H14C14.6 1 15 1.4 15 2ZM5 6H3V13H5V6ZM5.2 4C5.2 3.4 4.6 2.8 4 2.8C3.3 2.8 2.8 3.4 2.8 4C2.8 4.6 3.3 5.2 4 5.2C4.7 5.2 5.2 4.6 5.2 4ZM13 9.3C13 7.1 12.3 5.8 10.1 5.8C9 5.8 8.3 6.4 7.9 7V6H6V13H8V9.7C8 8.8 8.5 7.8 9.7 7.8C10.9 7.8 11 8.9 11 9.7V13H13V9.3Z\" fill=\"currentColor\"/>\n</svg>",
  "location-marker": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C5.24 1 3 3.24 3 6C3 6.89 3.24 7.73 3.64 8.45C3.65 8.46 8 16 8 16C8 16 12.35 8.45 12.36 8.45C12.76 7.73 13 6.89 13 6C13 3.24 10.76 1 8 1ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z\" fill=\"currentColor\"/>\n</svg>",
  "locked": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 6V5C12 2.8 10.2 1 8 1C5.8 1 4 2.8 4 5V6C2.9 6 2 6.9 2 8V13C2 14.1 2.9 15 4 15H12C13.1 15 14 14.1 14 13V8C14 6.9 13.1 6 12 6ZM9 12H7V9H9V12ZM6 6V5C6 3.9 6.9 3 8 3C9.1 3 10 3.9 10 5V6H6Z\" fill=\"currentColor\"/>\n</svg>",
  "magic-wand": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 4.18C13.3491 4.42 12.0584 5.71 11.8183 7.36C11.5782 5.71 10.2875 4.42 8.63659 4.18C10.2875 3.94 11.5782 2.65 11.8183 1C12.0584 2.65 13.3491 3.94 15 4.18ZM11.8183 7.99C11.6282 9.31 10.5976 10.34 9.27693 10.53C10.5976 10.72 11.6282 11.75 11.8183 13.07C12.0084 11.75 13.0389 10.72 14.3597 10.53C13.0389 10.34 12.0084 9.31 11.8183 7.99ZM5.46489 1.64C5.27479 2.96 4.24424 3.99 2.92353 4.18C4.24424 4.37 5.27479 5.4 5.46489 6.72C5.65499 5.4 6.68555 4.37 8.00625 4.18C6.68555 3.99 5.65499 2.96 5.46489 1.64ZM9.60711 8.53L3.56387 14.56C3.27372 14.85 2.88351 15 2.50331 15C2.1231 15 1.73289 14.85 1.44274 14.56C0.852421 13.97 0.852421 13.02 1.44274 12.44L7.47597 6.41C7.76612 6.12 8.15633 5.97 8.53654 5.97C8.91674 5.97 9.30695 6.12 9.59711 6.41C10.1874 7 10.1874 7.95 9.59711 8.53H9.60711ZM9.04681 7.47C9.04681 7.39 9.0268 7.24 8.89673 7.12C8.76666 6.99 8.61658 6.97 8.54654 6.97C8.4765 6.97 8.31642 6.99 8.19635 7.12L6.93568 8.38L7.64606 9.09L8.90673 7.83C9.03681 7.7 9.05682 7.55 9.05682 7.48H9.04681V7.47Z\" fill=\"currentColor\"/>\n</svg>",
  "marketplace": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M1 5L3.5 2H12.5L15 5C15 6.38 13.769 7.5 12.25 7.5C11.394 7.5 10.63 7.144 10.125 6.587C9.621 7.144 8.856 7.5 8 7.5C7.144 7.5 6.38 7.144 5.875 6.587C5.371 7.144 4.606 7.5 3.75 7.5C2.231 7.5 1 6.38 1 5ZM2 14V8.094C2.53 8.354 3.13 8.5 3.75 8.5C4.50261 8.5027 5.24017 8.28925 5.875 7.885C6.50983 8.28925 7.24739 8.5027 8 8.5C8.75261 8.5027 9.49017 8.28925 10.125 7.885C10.7598 8.28925 11.4974 8.5027 12.25 8.5C12.87 8.5 13.47 8.355 14 8.094V14C14 14.2652 13.8946 14.5196 13.7071 14.7071C13.5196 14.8946 13.2652 15 13 15H7V10H4V15H3C2.73478 15 2.48043 14.8946 2.29289 14.7071C2.10536 14.5196 2 14.2652 2 14ZM12 10H9V13H12V10Z\" fill=\"currentColor\"/>\n</svg>",
  "maximize": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 6.6L6.6 8L3 4.4V7H1V1H7V3H4.4L8 6.6ZM13 9V11.6L9.4 8L8 9.4L11.6 13H9V15H15V9H13Z\" fill=\"currentColor\"/>\n</svg>",
  "mention": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M7.995 1C4.13776 1 1 3.82 1 8C1 12.18 4.13776 15 7.995 15C9.63383 15 10.863 14.57 11.4925 14.19V12.67C10.783 13.08 9.62384 13.6 7.995 13.6C4.90721 13.6 2.399 11.41 2.399 8C2.399 4.59 4.90721 2.4 7.995 2.4C11.5325 2.4 13.591 4.45 13.591 7.86C13.591 9.16 13.1513 10.1 12.4518 10.1C11.8223 10.1 11.4925 9.7 11.4925 8.99V4.64H10.0935V5.22C9.50393 4.78 8.78444 4.5 7.995 4.5C6.06638 4.5 4.4975 6.07 4.4975 8C4.4975 9.93 6.06638 11.5 7.995 11.5C8.9743 11.5 9.85368 11.09 10.4932 10.45C10.833 11.1 11.5125 11.5 12.4618 11.5C13.631 11.5 15 10.44 15 7.86C15 3.67 12.3119 1 8.005 1H7.995ZM7.995 10.1C6.83583 10.1 5.8965 9.16 5.8965 8C5.8965 6.84 6.83583 5.9 7.995 5.9C9.15418 5.9 10.0935 6.84 10.0935 8C10.0935 9.16 9.15418 10.1 7.995 10.1Z\" fill=\"currentColor\"/>\n</svg>",
  "mention-off": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M3.36 13.35C4.6 14.4 6.22 15 8 15C9.64 15 10.87 14.57 11.5 14.19V12.67C10.79 13.08 9.63 13.6 8 13.6C6.61 13.6 5.34 13.16 4.36 12.36L5.91 10.81C6.49 11.25 7.22 11.51 8 11.51C8.98 11.51 9.86 11.1 10.5 10.46C10.84 11.11 11.52 11.51 12.47 11.51C13.64 11.51 15.01 10.45 15.01 7.87C15.01 5.99 14.47 4.41 13.48 3.25L14.99 1.74L14.28 1.03L1.02 14.27L1.73 14.98L3.36 13.35ZM12.47 4.24L11.49 5.22V9C11.49 9.71 11.82 10.11 12.45 10.11C13.15 10.11 13.59 9.17 13.59 7.87C13.59 6.39 13.2 5.16 12.47 4.25V4.24ZM9.79 6.91L6.91 9.79C7.23 9.98 7.6 10.09 8 10.09C9.16 10.09 10.1 9.15 10.1 7.99C10.1 7.59 9.99 7.22 9.8 6.9L9.79 6.91ZM2.05 11.83L3.07 10.81C2.64 10.01 2.4 9.07 2.4 8C2.4 4.59 4.91 2.4 8 2.4C9.12 2.4 10.09 2.6 10.89 2.99L11.93 1.95C10.86 1.33 9.54 1 8.01 1H8C4.14 1 1 3.82 1 8C1 9.46 1.38 10.76 2.05 11.83ZM4.7 9.18L5.9 7.98C5.9 6.83 6.84 5.91 7.98 5.9L9.17 4.71C8.8 4.57 8.41 4.5 8 4.5C6.07 4.5 4.5 6.07 4.5 8C4.5 8.41 4.57 8.81 4.7 9.18Z\" fill=\"currentColor\"/>\n</svg>",
  "messages": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10.5 2H5.736C2.491 2 0 4.531 0 7.5C0 10.762 2.698 13 5.5 13H8V16L13.248 12.621C14.963 11.517 16 9.616 16 7.576V7.5C16 4.462 13.538 2 10.5 2ZM5 8.5C4.448 8.5 4 8.052 4 7.5C4 6.948 4.448 6.5 5 6.5C5.552 6.5 6 6.948 6 7.5C6 8.052 5.552 8.5 5 8.5ZM8 8.5C7.448 8.5 7 8.052 7 7.5C7 6.948 7.448 6.5 8 6.5C8.552 6.5 9 6.948 9 7.5C9 8.052 8.552 8.5 8 8.5ZM11 8.5C10.448 8.5 10 8.052 10 7.5C10 6.948 10.448 6.5 11 6.5C11.552 6.5 12 6.948 12 7.5C12 8.052 11.552 8.5 11 8.5Z\" fill=\"currentColor\"/>\n</svg>",
  "microphone-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10.1213 9.12132C9.55871 9.68393 8.79565 10 8 10C7.20435 10 6.44129 9.68393 5.87868 9.12132C5.31607 8.55871 5 7.79565 5 7V4C5 3.20435 5.31607 2.44129 5.87868 1.87868C6.44129 1.31607 7.20435 1 8 1C8.79565 1 9.55871 1.31607 10.1213 1.87868C10.6839 2.44129 11 3.20435 11 4V7C11 7.79565 10.6839 8.55871 10.1213 9.12132Z\" fill=\"currentColor\"/>\n<path d=\"M12 7V6H13V7C13.0002 8.15265 12.6022 9.26999 11.8733 10.1629C11.1444 11.0558 10.1294 11.6695 9 11.9V13H11V15H5V13H7V11.9C5.87064 11.6695 4.8556 11.0558 4.12669 10.1629C3.39778 9.26999 2.99977 8.15265 3 7V6H4V7C4 8.06087 4.42143 9.07828 5.17157 9.82843C5.92172 10.5786 6.93913 11 8 11C9.06087 11 10.0783 10.5786 10.8284 9.82843C11.5786 9.07828 12 8.06087 12 7Z\" fill=\"currentColor\"/>\n</svg>",
  "microphone-off": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M9 11.9V13H11V15H5V13H7V11.9C4.72 11.44 3 9.42 3 7V6H4V7C4 9.21 5.79 11 8 11C8.66 11 9.28 10.82 9.83 10.54L9.08 9.79C8.75 9.92 8.38 10 8 10C6.34 10 5 8.66 5 7V5.71L1 1.71L1.71 1L15 14.29L14.29 15L10.56 11.27C10.09 11.56 9.57 11.78 9 11.9ZM13 7V6H12V7C12 7.82 11.74 8.56 11.31 9.19L12.04 9.92C12.64 9.1 13 8.09 13 7ZM11 7V4C11 2.34 9.66 1 8 1C6.68 1 5.57 1.86 5.17 3.05L10.59 8.47C10.84 8.03 11 7.54 11 7Z\" fill=\"currentColor\"/>\n</svg>",
  "minimize": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 1H7V7H1V5H3.6L0 1.4L1.4 0L5 3.6V1ZM12.4 11H15V9H9V15H11V12.4L14.6 16L16 14.6L12.4 11Z\" fill=\"currentColor\"/>\n</svg>",
  "newspaper": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13 4V12H3V4H13ZM15 2H1V12C1 13.1 1.9 14 3 14H13C14.1 14 15 13.1 15 12V2ZM12 5H4V7H12V5ZM7 8H4V11H7V8ZM12 8H8V9H12V8ZM12 10H8V11H12V10Z\" fill=\"currentColor\"/>\n</svg>",
  "org-chart": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11 6V5H9V11H11V10H15V14H11V13H9C7.9 13 7 12.1 7 11V9H5V10H1V6H5V7H7V5C7 3.9 7.9 3 9 3H11V2H15V6H11Z\" fill=\"currentColor\"/>\n</svg>",
  "overflow-android": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6.5 3C6.5 2.2 7.2 1.5 8 1.5C8.8 1.5 9.5 2.2 9.5 3C9.5 3.8 8.8 4.5 8 4.5C7.2 4.5 6.5 3.8 6.5 3ZM8 11.5C7.2 11.5 6.5 12.2 6.5 13C6.5 13.8 7.2 14.5 8 14.5C8.8 14.5 9.5 13.8 9.5 13C9.5 12.2 8.8 11.5 8 11.5ZM8 6.5C7.2 6.5 6.5 7.2 6.5 8C6.5 8.8 7.2 9.5 8 9.5C8.8 9.5 9.5 8.8 9.5 8C9.5 7.2 8.8 6.5 8 6.5Z\" fill=\"currentColor\"/>\n</svg>",
  "overflow-web-ios": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M3 9.5C2.2 9.5 1.5 8.8 1.5 8C1.5 7.2 2.2 6.5 3 6.5C3.8 6.5 4.5 7.2 4.5 8C4.5 8.8 3.8 9.5 3 9.5ZM11.5 8C11.5 8.8 12.2 9.5 13 9.5C13.8 9.5 14.5 8.8 14.5 8C14.5 7.2 13.8 6.5 13 6.5C12.2 6.5 11.5 7.2 11.5 8ZM6.5 8C6.5 8.8 7.2 9.5 8 9.5C8.8 9.5 9.5 8.8 9.5 8C9.5 7.2 8.8 6.5 8 6.5C7.2 6.5 6.5 7.2 6.5 8Z\" fill=\"currentColor\"/>\n</svg>",
  "pause": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M3 2H6V14H3V2ZM10 2V14H13V2H10Z\" fill=\"currentColor\"/>\n</svg>",
  "phone-handset": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.6982 13.1453L13.4282 14.4148C12.8582 14.9845 11.9882 15.1545 11.2382 14.8446C8.87816 13.905 6.82816 12.5655 5.12816 10.8661C3.42816 9.16681 2.08816 7.11761 1.14816 4.75853C0.848156 4.00882 1.00816 3.13916 1.58816 2.56938L2.86816 1.28988C3.25816 0.900036 3.89816 0.900036 4.27816 1.28988L6.09816 3.10917C6.48816 3.49902 6.48816 4.13877 6.09816 4.51862L4.94816 5.66817C6.24816 7.93729 8.05816 9.74658 10.3382 11.0461L11.4782 9.90652C11.8682 9.51667 12.5082 9.51667 12.8882 9.90652L14.7082 11.7258C15.0982 12.1157 15.0982 12.7454 14.7082 13.1353L14.6982 13.1453Z\" fill=\"currentColor\"/>\n</svg>",
  "phone-missed-call": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.71 13.15L13.44 14.42C12.87 14.99 12 15.16 11.25 14.85C8.89 13.91 6.84 12.57 5.14 10.87C3.44 9.17 2.1 7.12 1.16 4.76C0.859997 4.01 1.02 3.14 1.6 2.57L2.88 1.29C3.27 0.899998 3.91 0.899998 4.29 1.29L6.11 3.11C6.5 3.5 6.5 4.14 6.11 4.52L4.96 5.67C6.26 7.94 8.07 9.75 10.35 11.05L11.49 9.91C11.88 9.52 12.52 9.52 12.9 9.91L14.72 11.73C15.11 12.12 15.11 12.75 14.72 13.14L14.71 13.15ZM15 1.71L14.29 0.999998L12.5 2.79L10.71 0.999998L10 1.71L11.79 3.5L10 5.29L10.71 6L12.5 4.21L14.29 6L15 5.29L13.21 3.5L15 1.71Z\" fill=\"currentColor\"/>\n</svg>",
  "people": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 11.75V15H9V11.75C9 10.78 9.78 10 10.75 10H12.25C13.22 10 14 10.78 14 11.75ZM11.5 9C12.88 9 14 7.88 14 6.5C14 5.12 12.88 4 11.5 4C10.12 4 9 5.12 9 6.5C9 7.88 10.12 9 11.5 9ZM5 1C3.34 1 2 2.34 2 4C2 5.66 3.34 7 5 7C6.66 7 8 5.66 8 4C8 2.34 6.66 1 5 1ZM5.75 8H4.25C3.01 8 2 9.01 2 10.25V15H8V10.25C8 9.01 6.99 8 5.75 8Z\" fill=\"currentColor\"/>\n</svg>",
  "person": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 4C5 2.34 6.34 1 8 1C9.66 1 11 2.34 11 4C11 5.66 9.66 7 8 7C6.34 7 5 5.66 5 4ZM8.75 8H7.25C6.01 8 5 9.01 5 10.25V15H11V10.25C11 9.01 9.99 8 8.75 8Z\" fill=\"currentColor\"/>\n</svg>",
  "pin-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13.12 7.72L12 6.6V3H13V1H3V3H4V6.6L2.88 7.72C2.31723 8.28207 2.0007 9.04462 2 9.84V11H7V14L8 16L9 14V11H14V9.84C13.9993 9.04462 13.6828 8.28207 13.12 7.72Z\" fill=\"currentColor\"/>\n</svg>",
  "pin-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13.12 7.72L12 6.6V3H13V1H3V3H4V6.6L2.88 7.72C2.31723 8.28207 2.0007 9.04462 2 9.84V11H7V14L8 16L9 14V11H14V9.84C13.9993 9.04462 13.6828 8.28207 13.12 7.72ZM4.43 9L6 7.43V3H10V7.43L11.57 9H4.43Z\" fill=\"currentColor\"/>\n</svg>",
  "placeholder": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11 2H5C3.3 2 2 3.3 2 5V11C2 12.7 3.3 14 5 14H11C12.7 14 14 12.7 14 11V5C14 3.3 12.7 2 11 2ZM12 5V11C12 11.1 12 11.2 12 11.2L8.7 8L12 4.8C12 4.8 12 4.9 12 5ZM11 4C11.1 4 11.2 4 11.2 4L8 7.3L4.8 4C4.8 4 4.9 4 5 4H11ZM4 11.2C4 11.1 4 11 4 11V5C4 4.9 4 4.8 4 4.8L7.3 8L4 11.2ZM5 12C4.9 12 4.8 12 4.8 12L8 8.7L11.2 11.9C11.1 11.9 11 11.9 11 11.9H5V12Z\" fill=\"currentColor\"/>\n</svg>",
  "play": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4 14V2L14 8L4 14Z\" fill=\"currentColor\"/>\n</svg>",
  "popular-content": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12.8915 9.33C12.8915 9.33 12.9515 9.29 12.9914 9.27V12C12.9914 13.65 11.6424 15 9.99358 15H3.99786C2.34904 15 1 13.65 1 12V6C1 4.7 1.8394 3.6 2.99857 3.18V4.48V11.99C2.99857 12.54 3.44825 12.99 3.99786 12.99H9.99358C10.5432 12.99 10.9929 12.54 10.9929 11.99V10.54L11.3726 10.3L12.4918 9.58C12.6217 9.49 12.7616 9.41 12.8915 9.33ZM14.99 4.49C14.99 5.42 14.6702 6.35 14.1006 7.09C13.7909 7.5 13.4011 7.8 12.9914 8.08C12.6517 8.31 12.3019 8.52 11.9522 8.74C11.6324 8.95 11.3126 9.15 10.9929 9.36L9.99358 10V8H7.4354C5.83655 8 4.30764 6.76 4.05782 5C4.03783 4.83 4.00785 4.67 4.00785 4.49C4.00785 3.96 4.14775 3.46 4.36759 3C4.93719 1.84 6.13633 1 7.5853 1H11.5625C13.4611 1 15 2.59 15 4.49H14.99ZM11.9921 5H5.99643V6H11.9921V5ZM12.9914 3H5.99643V4H12.9914V3Z\" fill=\"currentColor\"/>\n</svg>",
  "question": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM8 12.2C7.3 12.2 6.8 11.6 6.8 11C6.8 10.4 7.3 9.8 8 9.8C8.7 9.8 9.2 10.4 9.2 11C9.2 11.6 8.7 12.2 8 12.2ZM8.8 9H7V8.1L7.9 7.6C8.6 7.2 9 6.9 9 6.6C9 6.2 8.6 6 8 6C7 6 5.8 6.4 5 6.9V4.8C5.9 4.4 6.9 4 8.1 4C10.1 4 11 5 11 6.4C11 7.3 10.5 8.2 8.8 9Z\" fill=\"currentColor\"/>\n</svg>",
  "quote": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.2795 7.93L10.1465 12.86L8.99571 11.9L11.4775 8.95C10.0765 8.7 8.99571 7.47 8.99571 6C8.99571 4.35 10.3467 3 11.9979 3C13.649 3 15 4.35 15 6C15 6.74 14.7198 7.41 14.2695 7.93H14.2795ZM7.00429 6C7.00429 4.35 5.65332 3 4.00214 3C2.35097 3 1 4.35 1 6C1 7.47 2.08077 8.7 3.48177 8.95L1 11.9L2.15082 12.86L6.28377 7.94C6.7341 7.41 7.0143 6.74 7.0143 6H7.00429Z\" fill=\"currentColor\"/>\n</svg>",
  "radar-dish": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 8H14C14 4.69 11.31 2 8 2V1C11.86 1 15 4.14 15 8ZM11 8H12C12 5.79 10.21 4 8 4V5C9.65 5 11 6.35 11 8ZM9 8C9 7.45 8.55 7 8 7C7.72 7 7.47 7.11 7.29 7.29L3.05 3.05C1.78 4.32 1 6.07 1 8C1 11.87 4.13 15 8 15C9.93 15 11.68 14.22 12.95 12.95L8.71 8.71C8.89 8.53 9 8.28 9 8Z\" fill=\"currentColor\"/>\n</svg>",
  "radar-screen": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 13C5.24 13 3 10.76 3 8.00001C3 5.24001 5.24 3.00001 8 3.00001C9.02 3.00001 9.96 3.31001 10.75 3.83001L9.28 5.30001C8.89 5.11001 8.46 5.00001 7.99 5.00001C6.33 5.00001 4.99 6.34001 4.99 8.00001C4.99 9.66001 6.33 11 7.99 11C9.65 11 10.99 9.66001 10.99 8.00001C10.99 7.54001 10.88 7.11001 10.69 6.71001L14.71 2.71001C15.1 2.32001 15.1 1.69001 14.71 1.30001C14.32 0.910007 13.69 0.910007 13.3 1.30001L12.19 2.41001C11.02 1.54001 9.58 1.01001 8 1.01001C4.13 1.00001 1 4.13001 1 8.00001C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8.00001H13C13 10.76 10.76 13 8 13ZM8 9.00001C7.45 9.00001 7 8.55001 7 8.00001C7 7.45001 7.45 7.00001 8 7.00001C8.55 7.00001 9 7.45001 9 8.00001C9 8.55001 8.55 9.00001 8 9.00001Z\" fill=\"currentColor\"/>\n</svg>",
  "rearrange-horizontal": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M9.23255 2.11619L10.6468 0.701977L14.8894 4.94462L10.6468 9.18726L9.23255 7.77305L11.071 5.93457L1.98985 5.93455L1.98987 3.95465L11.071 3.95467L9.23255 2.11619Z\" fill=\"currentColor\"/>\n<path d=\"M6.65686 14.0785L5.24264 15.4927L1 11.2501L5.24264 7.00744L6.65686 8.42165L4.81838 10.2601L13.8996 10.2602L13.8995 12.2401L4.81838 12.24L6.65686 14.0785Z\" fill=\"currentColor\"/>\n</svg>",
  "refresh": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 8C14 8.7 13.87 9.37 13.65 10H11.44C11.78 9.41 12 8.73 12 8C12 5.79 10.21 4 8 4V6L5 3L8 0V2C11.31 2 14 4.69 14 8ZM8 12C5.79 12 4 10.21 4 8C4 7.27 4.21 6.59 4.56 6H2.35C2.13 6.63 2 7.3 2 8C2 11.31 4.69 14 8 14V16L11 13L8 10V12Z\" fill=\"currentColor\"/>\n</svg>",
  "remove-connection": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 6.71L14.29 6L12.5 7.79L10.71 6L10 6.71L11.79 8.5L10 10.29L10.71 11L12.5 9.21L14.29 11L15 10.29L13.21 8.5L15 6.71Z\" fill=\"currentColor\"/>\n<path d=\"M6 7C7.65685 7 9 5.65685 9 4C9 2.34315 7.65685 1 6 1C4.34315 1 3 2.34315 3 4C3 5.65685 4.34315 7 6 7Z\" fill=\"currentColor\"/>\n<path d=\"M6.75 8H5.25C4.01 8 3 9.01 3 10.25V15H9V10.25C9 9.01 7.99 8 6.75 8Z\" fill=\"currentColor\"/>\n</svg>",
  "reply": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4.6 3H7L4.2 7H10.4C13 7 15 9.2 15 11.7C15 12.2 14.9 12.6 14.8 13.1L14.5 14H12.4L12.9 12.4C13 12.2 13 11.9 13 11.7C13 10.2 11.9 9 10.4 9H4.2L7 13H4.6L1 8L4.6 3Z\" fill=\"currentColor\"/>\n</svg>",
  "report": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13 2.44V9.35L11.8 9.8C11.45 9.93 11.08 10 10.71 10C10.34 10 9.98 9.93 9.62 9.8L7.8 9.11C7.44 8.98 7.09 8.91 6.71 8.91C6.35 8.91 5.97 8.98 5.62 9.11L5 9.35V15H3V1H5V2.43L5.63 2.2C5.99 2.06 6.34 2 6.71 2C7.07 2 7.46 2.07 7.8 2.2L9.63 2.89C9.98 3.02 10.35 3.09 10.72 3.09C11.09 3.09 11.45 3.02 11.81 2.89L13 2.44Z\" fill=\"currentColor\"/>\n</svg>",
  "repost": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4 10H2V5C2 3.34 3.34 2 5 2H8.85L7.42 0H9.86L12 3L9.86 6H7.42L8.85 4H5C4.45 4 4 4.45 4 5V10ZM12 6V11C12 11.55 11.55 12 11 12H7.15L8.58 10H6.14L4 13L6.14 16H8.58L7.15 14H11C12.66 14 14 12.66 14 11V6H12Z\" fill=\"currentColor\"/>\n</svg>",
  "responsive": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 8C14 11.31 11.31 14 8 14C5.39 14 3.18 12.33 2.35 10C2.35 10 2.35 10 2.35 9.99C2.24 9.69 2.16 9.38 2.1 9.06C2.1 9.03 2.1 9 2.09 8.97C2.04 8.65 2 8.33 2 8C2 7.71 2.03 7.42 2.07 7.14C2.07 7.08 2.09 7.02 2.1 6.97C2.15 6.69 2.21 6.42 2.3 6.15C2.3 6.13 2.31 6.11 2.32 6.1C2.41 5.83 2.52 5.57 2.64 5.32C2.64 5.3 2.66 5.28 2.67 5.27C2.81 5.01 2.96 4.75 3.13 4.51C4.02 3.26 5.38 2.38 6.95 2.1C6.97 2.1 6.99 2.1 7.02 2.09C7.34 2.04 7.67 2 8.01 2V0L11.01 3L8.01 6V4C7.78 4 7.55 4.03 7.33 4.07C7.24 4.09 7.14 4.11 7.05 4.13C6.95 4.16 6.85 4.19 6.75 4.22C6.49 4.31 6.24 4.42 6 4.56C5.59 4.8 5.24 5.1 4.94 5.46C4.9 5.51 4.85 5.56 4.81 5.62C4.74 5.72 4.67 5.82 4.6 5.92C4.52 6.04 4.45 6.17 4.39 6.3C4.35 6.38 4.31 6.47 4.28 6.56C4.21 6.73 4.16 6.91 4.11 7.1C4.09 7.16 4.08 7.23 4.07 7.3C4.03 7.53 4 7.77 4 8.01C4 8.25 4.03 8.47 4.07 8.69C4.09 8.78 4.11 8.88 4.13 8.97C4.15 9.07 4.19 9.17 4.22 9.26C4.31 9.52 4.42 9.77 4.56 10.01C5.25 11.2 6.53 12.01 8 12.01C10.21 12.01 12 10.22 12 8.01H14V8ZM8.01 8.02L6.91 6.92L5.5 8.34L8.17 11.01L13 5.01H10.43L8.01 8.03V8.02Z\" fill=\"currentColor\"/>\n</svg>",
  "rss": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 13C5 14.1 4.1 15 3 15C1.9 15 1 14.1 1 13C1 11.9 1.9 11 3 11C4.1 11 5 11.9 5 13ZM1 1V3C7.62 3 13 8.38 13 15H15C15 7.28 8.72 1 1 1ZM1 6V8C4.86 8 8 11.14 8 15H10C10 10.04 5.96 6 1 6Z\" fill=\"currentColor\"/>\n</svg>",
  "salary": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M1 2V12H15V2H1ZM11.42 10H4.58C4.47392 9.6341 4.2712 9.30353 3.99316 9.04309C3.71513 8.78265 3.37204 8.60199 3 8.52002V5.52002C3.37204 5.43805 3.71513 5.25727 3.99316 4.99683C4.2712 4.73639 4.47392 4.40593 4.58 4.04004H11.42C11.5261 4.40593 11.7288 4.73639 12.0068 4.99683C12.2849 5.25727 12.628 5.43805 13 5.52002V8.52002C12.628 8.60199 12.2849 8.78265 12.0068 9.04309C11.7288 9.30353 11.5261 9.6341 11.42 10Z\" fill=\"currentColor\"/>\n<path d=\"M8.03 9C8.9965 9 9.78 8.10457 9.78 7C9.78 5.89543 8.9965 5 8.03 5C7.0635 5 6.28 5.89543 6.28 7C6.28 8.10457 7.0635 9 8.03 9Z\" fill=\"currentColor\"/>\n<path d=\"M15 13H1V14H15V13Z\" fill=\"currentColor\"/>\n</svg>",
  "scan-qr-code": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4 4H7V7H4V4ZM2 10H1V15H6V14H2V10ZM14 14H10V15H15V10H14V14ZM2 2H6V1H1V6H2V2ZM10 1V2H14V6H15V1H10ZM4 12H7V9H4V12ZM12 4H9V7H12V4ZM9 9V11H11V9H9ZM12 12V11H11V12H12Z\" fill=\"currentColor\"/>\n</svg>",
  "school": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 5C8.55 5 9 5.45 9 6C9 6.55 8.55 7 8 7C7.45 7 7 6.55 7 6C7 5.45 7.45 5 8 5ZM15 5V14H1V5H4V4L8 1L12 4V5H15ZM4 7H3V12H4V7ZM10 5L8 3.5L6 5V12H7V9H9V12H10V5ZM13 7H12V12H13V7Z\" fill=\"currentColor\"/>\n</svg>",
  "search": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.6 12.4L11.3 9.1C11.7 8.4 12 7.5 12 6.5C12 3.5 9.5 1 6.5 1C3.5 1 1 3.5 1 6.5C1 9.5 3.5 12 6.5 12C7.5 12 8.4 11.7 9.2 11.3L12.5 14.6C12.8 14.9 13.2 15 13.6 15C14 15 14.4 14.9 14.7 14.6C15 14.3 15.1 13.9 15.1 13.5C15 13.1 14.9 12.7 14.6 12.4ZM3 6.5C3 4.6 4.6 3 6.5 3C8.4 3 10 4.6 10 6.5C10 8.4 8.4 10 6.5 10C4.6 10 3 8.4 3 6.5Z\" fill=\"currentColor\"/>\n</svg>",
  "send": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M1 15L3.25 9.25L10 8L3.25 6.75L1 1L15 8L1 15Z\" fill=\"currentColor\"/>\n</svg>",
  "send-privately": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 2L0 6.67L5 9.31L10.67 5.33L6.7 11L9.33 16L14 2Z\" fill=\"currentColor\"/>\n</svg>",
  "server-sync": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M1 2H12V6H1V2ZM2 3H5V4H2V3ZM1 7H9.67C8.65 7.82 8 9.09 8 10.5C8 10.67 8 10.84 8.03 11H1V7ZM2 8H5V9H2V8ZM15 7.75L13 6V7.04C12.84 7.02 12.67 7 12.5 7C10.57 7 9 8.57 9 10.5C9 10.67 9.01 10.84 9.04 11H10.05C10.02 10.84 10 10.67 10 10.5C10 9.12 11.12 8 12.5 8C12.67 8 12.84 8.02 13 8.05V9.5L15 7.75ZM15.96 10C15.98 10.16 16 10.33 16 10.5C16 12.43 14.43 14 12.5 14C12.33 14 12.16 13.99 12 13.96V15L10 13.25L12 11.5V12.95C12.16 12.98 12.33 13 12.5 13C13.88 13 15 11.88 15 10.5C15 10.33 14.98 10.16 14.95 10H15.96Z\" fill=\"currentColor\"/>\n</svg>",
  "services": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 4C15 3.19 14.72 2.45 14.13 1.86C13.54 1.27 12.81 1 12.04 1C11.27 1 10.53 1.29 9.95 1.86L2.96 8.86L1 15L7.19 12.98L14.13 6.04C14.69 5.48 15 4.74 15 4ZM5.77 11.57L4.43 10.23L9.65 5.01L10.99 6.35L5.77 11.57ZM3.07 7.29L1 5.22L5.22 1L7.29 3.07L3.07 7.29ZM12.92 8.7L15 10.78L10.78 15L8.7 12.92L12.92 8.7Z\" fill=\"currentColor\"/>\n</svg>",
  "settings": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6.03 1L3.02 2.76L3.95 5.2L3.59 5.83L1 6.22V9.74L3.55 10.13L3.93 10.78L3 13.22L6 14.98L7.6 12.95H8.36L9.97 15L12.99 13.24L12.05 10.82L12.42 10.17L15 9.78V6.26L12.42 5.87L12.06 5.24L13.02 2.78L10 1.02L8.37 3.08H7.66L6.03 1ZM8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6Z\" fill=\"currentColor\"/>\n</svg>",
  "share-android": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 11C11.6 11 11.3 11.1 11 11.3L5.09999 8L11 4.7C11.3 4.9 11.6 5 12 5C13.1 5 14 4.1 14 3C14 1.9 13.1 1 12 1C10.9 1 9.99999 1.9 9.99999 3L3.99999 6.3C3.69999 6.1 3.39999 6 2.99999 6C1.89999 6 0.999994 6.9 0.999994 8H0.899994H0.999994C0.999994 9.1 1.89999 10 2.99999 10C3.39999 10 3.69999 9.9 3.99999 9.7L9.99999 13C9.99999 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11.9 13.1 11 12 11Z\" fill=\"currentColor\"/>\n</svg>",
  "share-ios": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11 6V8C11.55 8 12 8.45 12 9V12C12 12.55 11.55 13 11 13H5C4.45 13 4 12.55 4 12V9C4 8.45 4.45 8 5 8V6C3.34 6 2 7.34 2 9V12C2 13.66 3.34 15 5 15H11C12.66 15 14 13.66 14 12V9C14 7.34 12.66 6 11 6Z\" fill=\"currentColor\"/>\n<path d=\"M7 11H9V3L12 5V2.62L8 0L4 2.62V5L7 3V11Z\" fill=\"currentColor\"/>\n</svg>",
  "share-linked-in": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M11.4 3H9L11.8 7H5.6C3 7 1 9.2 1 11.7C1 12.2 1.1 12.6 1.2 13.1L1.5 14H3.6L3.1 12.4C3 12.2 3 11.9 3 11.7C3 10.2 4.1 9 5.6 9H11.8L9 13H11.4L15 8L11.4 3Z\" fill=\"currentColor\"/>\n</svg>",
  "shield": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 0L1 2.49V7C1 10.62 3.24 13.41 7.14 14.71L7.99 15L8.87 14.71C12.77 13.4 15 10.62 15 7V2.49L8 0ZM8 12.89L7.78 12.81C5.6 12.08 3 10.52 3 6.99V3.89L8 2.11V12.89Z\" fill=\"currentColor\"/>\n</svg>",
  "signal-ai": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M15 7.99C15 8.38 14.7202 8.69 14.3505 8.73C11.4126 9.05 9.06424 11.41 8.73448 14.35C8.6945 14.72 8.37473 15 8.005 15H7.995C7.62527 15 7.3055 14.72 7.26553 14.35C6.94575 11.41 4.58744 9.06 1.64954 8.73C1.2798 8.69 1 8.37 1 8C1 7.61 1.2798 7.3 1.64954 7.26C4.58744 6.94 6.93576 4.58 7.25553 1.65C7.2955 1.28 7.61527 1 7.98501 1H8.005C8.37473 1 8.6945 1.28 8.73448 1.65C9.05425 4.59 11.4126 6.94 14.3505 7.27C14.7202 7.31 15 7.63 15 8V7.99Z\" fill=\"currentColor\"/>\n</svg>",
  "signal-ai-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 0.5C8.60337 0.5 9.12042 0.930983 9.22949 1.52441L9.23926 1.57715L9.24121 1.5957C9.53562 4.29328 11.7007 6.46806 14.4043 6.7627L14.4209 6.76465L14.4717 6.77344C15.0665 6.87875 15.5 7.39596 15.5 8C15.5 8.60404 15.0665 9.12125 14.4717 9.22656L14.4209 9.23535L14.4043 9.2373C11.7007 9.53194 9.53562 11.7067 9.24121 14.4043L9.23926 14.4229L9.22949 14.4756C9.12042 15.069 8.60337 15.5 8 15.5C7.39663 15.5 6.87958 15.069 6.77051 14.4756L6.76074 14.4229L6.75879 14.4043C6.46438 11.7067 4.29928 9.53194 1.5957 9.2373L1.5791 9.23535L1.52832 9.22656C0.933528 9.12125 0.5 8.60404 0.5 8C0.5 7.39596 0.933527 6.87875 1.52832 6.77344L1.5791 6.76465L1.5957 6.7627C4.29928 6.46806 6.46438 4.29328 6.75879 1.5957L6.76074 1.57715L6.77051 1.52441C6.87958 0.930984 7.39663 0.5 8 0.5ZM8 4.3877C7.23381 5.95252 5.96054 7.2302 4.39551 8C5.96054 8.7698 7.23381 10.0475 8 11.6123C8.7662 10.0475 10.0395 8.7698 11.6045 8C10.0395 7.2302 8.7662 5.95252 8 4.3877Z\" fill=\"currentColor\"/>\n</svg>",
  "signal-caution": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.4 6.6L9.4 1.6C9 1.2 8.5 1 8 1C7.5 1 7 1.2 6.6 1.6L1.6 6.6C1.2 7 1 7.5 1 8C1 8.5 1.2 9 1.6 9.4L6.6 14.4C7 14.8 7.5 15 8 15C8.5 15 9 14.8 9.4 14.4L14.4 9.4C14.8 9 15 8.5 15 8C15 7.5 14.8 7 14.4 6.6ZM7 4H9V9H7V4ZM8 12.2C7.3 12.2 6.8 11.6 6.8 11C6.8 10.4 7.3 9.8 8 9.8C8.7 9.8 9.2 10.4 9.2 11C9.2 11.6 8.7 12.2 8 12.2Z\" fill=\"currentColor\"/>\n</svg>",
  "signal-error": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10.8 1H5.2L1 5.2V10.8L5.2 15H10.8L15 10.8V5.2L10.8 1ZM12 9H4V7H12V9Z\" fill=\"currentColor\"/>\n</svg>",
  "signal-notice": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H12C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2ZM9 10V12H7.5C6.7 12 6 11.3 6 10.5C6 10.3 6 10.1 6.1 10L7.2 7H9.3L8.2 10H9ZM9 6.2C8.3 6.2 7.8 5.7 7.8 5C7.8 4.3 8.4 3.7 9 3.7C9.6 3.7 10.2 4.3 10.2 5C10.2 5.7 9.7 6.2 9 6.2Z\" fill=\"currentColor\"/>\n</svg>",
  "signal-success": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM7.4 12L4.3 8.9L5.6 7.6L7.1 9L9.7 5H12L7.4 12Z\" fill=\"currentColor\"/>\n</svg>",
  "slides": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4 2C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V4C14 3.46957 13.7893 2.96086 13.4142 2.58579C13.0391 2.21071 12.5304 2 12 2H4ZM4 4H12V12H4V4ZM0 4H1V12H0V4ZM15 4H16V12H15V4Z\" fill=\"currentColor\"/>\n</svg>",
  "signal-success-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M3 8C3 5.2 5.2 3 8 3C10.8 3 13 5.2 13 8C13 10.8 10.8 13 8 13C5.2 13 3 10.8 3 8ZM1 8C1 4.1 4.1 1 8 1C11.9 1 15 4.1 15 8C15 11.9 11.9 15 8 15C4.1 15 1 11.9 1 8ZM7.4 12L4.3 8.9L5.6 7.6L7.1 9L9.7 5H12L7.4 12Z\" fill=\"currentColor\"/>\n</svg>",
  "skills": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12.67 2H3.33L1 6L8 14L15 6L12.67 2ZM8.01 4H11.52L12.39 5.5H3.61L4.49 4H8.02H8.01ZM4.1 6.5H11.91L8.01 10.96L4.11 6.5H4.1Z\" fill=\"currentColor\"/>\n</svg>",
  "skip-back": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 1V6.8L13 2V14L5 9.2V15H3V1H5Z\" fill=\"currentColor\"/>\n</svg>",
  "skip-forward": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13 1V15H11V9.2L3 14V2L11 6.8V1H13Z\" fill=\"currentColor\"/>\n</svg>",
  "sort": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13 7L8 3.5L3 7V4.6L8 1L13 4.6V7ZM3 11.4L8 15L13 11.4V9L8 12.5L3 9V11.4Z\" fill=\"currentColor\"/>\n</svg>",
  "sort-down": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M3 11.4L8 15L13 11.4V9L8 12.5L3 9V11.4Z\" fill=\"currentColor\"/>\n<path opacity=\"0.25\" d=\"M13 4.6L8 1L3 4.6V7L8 3.5L13 7V4.6Z\" fill=\"currentColor\"/>\n</svg>",
  "sort-up": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path opacity=\"0.25\" d=\"M3 11.4L8 15L13 11.4V9L8 12.5L3 9V11.4Z\" fill=\"currentColor\"/>\n<path d=\"M13 4.6L8 1L3 4.6V7L8 3.5L13 7V4.6Z\" fill=\"currentColor\"/>\n</svg>",
  "star-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.00001 0.5L10.3 5.1L15.4 5.8L11.7 9.4L12.6 14.5L8.00001 12.1L3.50001 14.5L4.40001 9.4L0.700012 5.8L5.80001 5.1L8.00001 0.5Z\" fill=\"currentColor\"/>\n</svg>",
  "star-half": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.93998 6.94L11.05 7.25L9.51998 8.74L9.87998 10.84L7.99998 9.85V5.03L8.93998 6.94ZM5.72998 5.11L0.669983 5.85L4.33998 9.44L3.46998 14.5L7.99998 12.11L12.53 14.5L11.66 9.43L15.33 5.84L10.26 5.1L7.99998 0.5L5.72998 5.11Z\" fill=\"currentColor\"/>\n</svg>",
  "star-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.90001 6.9L11 7.2L9.50001 8.7L9.90001 10.8L8.00001 9.8L6.10001 10.8L6.50001 8.7L5.00001 7.2L7.10001 6.9L8.00001 5L8.90001 6.9ZM5.70001 5.1L0.700012 5.8L4.40001 9.4L3.50001 14.5L8.00001 12.1L12.5 14.5L11.6 9.4L15.3 5.8L10.2 5.1L8.00001 0.5L5.70001 5.1Z\" fill=\"currentColor\"/>\n</svg>",
  "starburst": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14.6907 8.63545C14.9002 8.48535 15 8.24517 15 8.005C15 7.76483 14.9002 7.53467 14.6907 7.37455L13.6429 6.58399C13.3835 6.38385 13.2737 6.0336 13.3735 5.71337L13.7826 4.44246C13.9423 3.9421 13.593 3.42173 13.0841 3.42173H11.747C11.4277 3.42173 11.1483 3.20157 11.0485 2.89135L10.6294 1.53038C10.5296 1.20014 10.2302 1 9.93086 1C9.78118 1 9.6315 1.05004 9.4918 1.15011L8.43407 1.97069C8.17463 2.17084 7.8154 2.17084 7.55595 1.97069L6.49822 1.15011C6.3685 1.05004 6.20884 1 6.05916 1C5.74982 1 5.46044 1.20014 5.36066 1.53038L4.94155 2.89135C4.84177 3.21158 4.56237 3.42173 4.24305 3.42173H2.90592C2.39701 3.42173 2.04775 3.9421 2.20741 4.44246L2.62651 5.71337C2.73628 6.0336 2.62651 6.39385 2.35709 6.594L1.30934 7.37455C1.10976 7.52466 1 7.76483 1 7.995C1 8.23517 1.09979 8.46533 1.30934 8.62545L2.35709 9.41601C2.61654 9.61615 2.7263 9.9664 2.62651 10.2866L2.21739 11.5475C2.05773 12.0479 2.40699 12.5683 2.91589 12.5683H4.24305C4.56237 12.5683 4.84177 12.7884 4.94155 13.1086L5.35068 14.4596C5.45046 14.7999 5.7598 15 6.05916 15C6.20884 15 6.35852 14.95 6.48824 14.8499L7.55595 14.0293C7.8154 13.8292 8.17463 13.8292 8.43407 14.0293L9.50178 14.8499C9.6315 14.95 9.78118 15 9.93086 15C10.2402 15 10.5296 14.7999 10.6393 14.4596L11.0485 13.1086C11.1483 12.7884 11.4277 12.5683 11.747 12.5683H13.0841C13.583 12.5683 13.9423 12.0479 13.7826 11.5475L13.3635 10.2766C13.2537 9.9564 13.3635 9.59614 13.6329 9.396L14.6807 8.61544L14.6907 8.63545ZM10.0107 10.0064H6.01924V9.00572H10.0107V10.0064ZM11.0086 7.00429H5.02138V6.00357H11.0086V7.00429Z\" fill=\"currentColor\"/>\n</svg>",
  "sticky-note": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 10V2H2V12C2 13.1 2.9 14 4 14H10V10H14ZM4 5H12V6H4V5ZM8 8H4V7H8V8ZM11 11H14L11 14V11Z\" fill=\"currentColor\"/>\n</svg>",
  "stop": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M13 3H3V13H13V3Z\" fill=\"currentColor\"/>\n</svg>",
  "subtract": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 7H2V9H14V7Z\" fill=\"currentColor\"/>\n</svg>",
  "tag": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.9992 2H7.99769L1.58523 8.40754C0.804925 9.18724 0.804925 10.4567 1.58523 11.2364L4.75645 14.4152C5.53675 15.1949 6.80723 15.1949 7.58753 14.4152L14 8.00769V3.99923C14 2.89965 13.0997 2 11.9992 2ZM10.4987 6.99808C9.66833 6.99808 8.99808 6.32834 8.99808 5.49865C8.99808 4.66897 9.66833 3.99923 10.4987 3.99923C11.329 3.99923 11.9992 4.66897 11.9992 5.49865C11.9992 6.32834 11.329 6.99808 10.4987 6.99808Z\" fill=\"currentColor\"/>\n</svg>",
  "templates": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H12C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2ZM8 12H4V9H8V12ZM6 8C4.9 8 4 7.1 4 6C4 4.9 4.9 4 6 4C7.1 4 8 4.9 8 6C8 7.1 7.1 8 6 8ZM12 12H9V4H12V12Z\" fill=\"currentColor\"/>\n</svg>",
  "test": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4.13001 12L6.46001 9H9.53001L11.86 12H4.13001ZM14.81 12.56C14.76 12.82 14.67 13.08 14.55 13.32C14.49 13.44 14.42 13.56 14.35 13.67C14.13 14.01 13.84 14.3 13.49 14.52C13.26 14.67 13.01 14.79 12.73 14.87C12.46 14.95 12.16 15 11.85 15H4.13001C3.19001 15 2.41001 14.6 1.88001 13.99C1.70001 13.79 1.55001 13.56 1.44001 13.32C1.26001 12.96 1.16001 12.56 1.13001 12.16C1.11001 11.75 1.17001 11.34 1.32001 10.94C1.42001 10.67 1.57001 10.41 1.76001 10.17L2.66001 9.01L4.99001 6.01V3C4.44001 3 3.99001 2.55 3.99001 2C3.99001 1.45 4.44001 1 4.99001 1H10.99C11.54 1 11.99 1.45 11.99 2C11.99 2.55 11.54 3 10.99 3V6L13.32 9L14.22 10.16C14.79 10.9 14.96 11.76 14.8 12.56H14.81ZM12.65 11.39L10.79 9L9.41001 7.23L8.99001 6.69V3H6.99001V6.69L6.57001 7.23L5.19001 9L3.33001 11.39C2.98001 11.83 3.14001 12.27 3.22001 12.44C3.30001 12.61 3.56001 13 4.12001 13H11.85C12.41 13 12.67 12.61 12.75 12.44C12.83 12.27 12.99 11.83 12.64 11.39H12.65Z\" fill=\"currentColor\"/>\n</svg>",
  "text-align-center": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 3H2V1H14V3ZM12 5H4V7H12V5ZM14 9H2V11H14V9ZM12 13H4V15H12V13Z\" fill=\"currentColor\"/>\n</svg>",
  "text-align-left": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 3H2V1H14V3ZM10 5H2V7H10V5ZM14 9H2V11H14V9ZM10 13H2V15H10V13Z\" fill=\"currentColor\"/>\n</svg>",
  "text-align-right": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M2 3H14V1H2V3ZM6 5H14V7H6V5ZM2 9H14V11H2V9ZM6 13H14V15H6V13Z\" fill=\"currentColor\"/>\n</svg>",
  "text-bold": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 7.68C12.7 7.27 13.25 6.37 13.25 5.03V4.97C13.25 2.12 10.8 1 9.01 1H2V3H3V13H2V15H9.39C12.81 15 14 12.71 14 11.12V10.87C14 9.45 13 8 12 7.68ZM6 3H8.45C9.42 3 10.25 4 10.25 4.88V5.13C10.25 5.96 9.42 7 8.45 7H6V3ZM11 11.12C11 12.14 10 13 9.25 13H6V9H9C10 9 11 9.73 11 10.88V11.13V11.12Z\" fill=\"currentColor\"/>\n</svg>",
  "text-bulleted-list": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 3C5 3.83 4.33 4.5 3.5 4.5C2.67 4.5 2 3.83 2 3C2 2.17 2.67 1.5 3.5 1.5C4.33 1.5 5 2.17 5 3ZM3.5 6.5C2.67 6.5 2 7.17 2 8C2 8.83 2.67 9.5 3.5 9.5C4.33 9.5 5 8.83 5 8C5 7.17 4.33 6.5 3.5 6.5ZM3.5 11.5C2.67 11.5 2 12.17 2 13C2 13.83 2.67 14.5 3.5 14.5C4.33 14.5 5 13.83 5 13C5 12.17 4.33 11.5 3.5 11.5ZM7 2V4H14V2H7ZM7 9H14V7H7V9ZM7 14H14V12H7V14Z\" fill=\"currentColor\"/>\n</svg>",
  "text-italic": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10.34 3L7.72 13H9.86L9.34 15H3L3.52 13H5.64L8.27 3H6.15L6.67 1H13L12.48 3H10.34Z\" fill=\"currentColor\"/>\n</svg>",
  "text-numbered-list": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 2V4H7V2H14ZM14 7V9H7V7H14ZM7 14H14V12H7V14ZM4 5V1L2 1.9V3L3 2.55V5H2V6H5V5H4ZM4.56 12.68C4.84 12.36 5 11.95 5 11.45C5 10.64 4.33 9.98 3.41 10C2.62 10.02 2 10.69 2 11.48V12H3V11.5C3 11.22 3.22 11 3.5 11C3.78 11 4 11.22 4 11.5C4 11.67 3.91 11.92 3.79 12.04L2 14.08V15H5V14H3.41L4.57 12.68H4.56Z\" fill=\"currentColor\"/>\n</svg>",
  "text-underline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M2 14H14V15H2V14ZM13 1H10V3H11V8C11 9.35 10.12 10.99 8 11C5.88 10.99 5 9.35 5 8V3H6V1H2V3H3V8C3 10.39 4.58 13 8 13C11.42 13 13 10.39 13 8V3H14V1H13Z\" fill=\"currentColor\"/>\n</svg>",
  "thumbs-down-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12.6 9L9.7 11.9C9.1 12.6 8.6 13.3 8.3 14.2L8 15.2C7.8 15.7 7.4 16 7 16C6.4 16 6 15.6 6 15V14C6 13.4 6.1 12.8 6.3 12.2L7 10H2.4C1.6 9.9 1 9.3 1 8.5C1 8 1.3 7.6 1.6 7.3C1.3 7.1 1 6.6 1 6.1C1 5.5 1.4 5 1.9 4.8C1.8 4.5 1.8 4.3 1.8 4C1.8 3.3 2.4 2.7 3.1 2.6V2.5C3 1.7 3.6 1 4.4 1H9.2C10.1 1 10.9 1.2 11.7 1.6L12.6 2H14V9H12.6Z\" fill=\"currentColor\"/>\n</svg>",
  "thumbs-down-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 9V2H12.7L11.7 1.6C10.9 1.2 10.1 1 9.2 1H4.4C3.6 1 3 1.7 3 2.5V2.6C2.3 2.7 1.8 3.3 1.8 4C1.8 4.3 1.9 4.5 2 4.7C1.4 5 1 5.5 1 6.1C1 6.6 1.3 7 1.6 7.3C1.3 7.6 1 8 1 8.5C1 9.3 1.6 9.9 2.4 10H5.6L5.3 10.9C5.1 11.5 5 12.2 5 12.8V14C4.9 15.1 5.9 16 7 16C7.9 16 8.7 15.5 9 14.6L9.2 14.1C9.5 13.2 10 12.3 10.7 11.5L12.9 9H14ZM12 7.2L9.2 10.2C8.4 11.1 7.7 12.2 7.3 13.4L7.1 13.9C7.1 13.9 7.1 14 7 14C7 14 6.9 14 6.9 13.9V12.7C6.9 12.3 7 11.8 7.1 11.4L8.3 8H3.4C3.2 8 3 7.8 3.1 7.6L3.5 7L3.2 6.4C3 6.1 3.1 5.8 3.3 5.7L3.7 5.3L3.6 4.7C3.6 4.4 3.7 4.2 3.9 4.1L4.4 3.9L4.5 3.4C4.6 3.2 4.9 3 5.1 3H9.2C9.7 3 10.3 3.1 10.8 3.4L12 3.9V7.2Z\" fill=\"currentColor\"/>\n</svg>",
  "thumbs-up-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12.6 7L9.7 4.1C9.1 3.4 8.6 2.6 8.3 1.8L8 0.7C7.8 0.3 7.4 0 7 0C6.4 0 6 0.4 6 1V2C6 2.6 6.1 3.2 6.3 3.8L7 6H2.4C1.6 6.1 1 6.7 1 7.5C1 8 1.3 8.4 1.6 8.7C1.3 8.9 1 9.4 1 9.9C1 10.5 1.4 11 1.9 11.3C1.8 11.5 1.7 11.8 1.7 12C1.7 12.7 2.3 13.3 3 13.4V13.5C3 14.3 3.6 15 4.4 15H9.2C10.1 15 10.9 14.8 11.7 14.4L12.6 14H14V7H12.6Z\" fill=\"currentColor\"/>\n</svg>",
  "thumbs-up-outline": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12.9 7L10.7 4.4C10 3.7 9.5 2.8 9.2 1.9L9 1.4C8.7 0.5 7.9 0 7 0C5.9 0 4.9 0.9 4.9 2.1V3.3C4.9 3.9 5 4.6 5.2 5.2L5.5 6H2.4C1.6 6.1 1 6.7 1 7.5C1 8 1.3 8.4 1.6 8.7C1.3 8.9 1 9.4 1 9.9C1 10.5 1.4 11 1.9 11.3C1.8 11.5 1.7 11.8 1.7 12C1.7 12.7 2.3 13.3 3 13.4V13.5C3 14.3 3.6 15 4.4 15H9.2C10.1 15 10.9 14.8 11.7 14.4L12.7 14H14V7H12.9ZM12 12.1L10.8 12.6C10.3 12.8 9.8 13 9.2 13H5.1C4.9 13 4.6 12.8 4.6 12.6L4.5 12.1L4 11.9C3.8 11.8 3.6 11.5 3.7 11.3L3.8 10.7L3.4 10.3C3.1 10.2 3 9.9 3.2 9.6L3.5 9L3.1 8.4C3 8.2 3.2 8 3.4 8H8.3L7.1 4.5C7 4.1 6.9 3.7 6.9 3.2V2.1C6.9 2 7 2 7 2C7 2 7.1 2 7.1 2.1L7.3 2.6C7.7 3.8 8.4 4.8 9.2 5.8L12 8.8V12.1Z\" fill=\"currentColor\"/>\n</svg>",
  "trash": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M3 13C3 14.1 3.9 15 5 15H11C12.1 15 13 14.1 13 13V5H3V13ZM9 7H10V12H9V7ZM6 7H7V12H6V7ZM14 3V4H2V3C2 2.45 2.45 2 3 2H6C6 1.45 6.45 1 7 1H9C9.55 1 10 1.45 10 2H13C13.55 2 14 2.45 14 3Z\" fill=\"currentColor\"/>\n</svg>",
  "trending": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M9 3V5H11.6L8 8.6L6 6.6L1 11.6L2.4 13L6 9.4L8 11.4L13 6.4V9H15V3H9Z\" fill=\"currentColor\"/>\n</svg>",
  "trophy": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 2V1H4V2H1V6C1 7.65 2.35 9 4 9H4.55C5.08 9.91 5.95 10.59 7 10.86V13H5V15H11V13H9V10.86C10.04 10.59 10.92 9.91 11.45 9H12C13.65 9 15 7.65 15 6V2H12ZM3 6V4H4V7C3.45 7 3 6.55 3 6ZM12 7V4H13V6C13 6.55 12.55 7 12 7Z\" fill=\"currentColor\"/>\n</svg>",
  "unarchive": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M4 5.5L1.5 3L4 0.5V2H6C7.66 2 9 3.34 9 5V11H7V5C7 4.45 6.55 4 6 4H4V5.5ZM11 5V7H12V12C12 12.55 11.55 13 11 13H5C4.45 13 4 12.55 4 12V7H2V12C2 13.66 3.34 15 5 15H11C12.66 15 14 13.66 14 12V5H11Z\" fill=\"currentColor\"/>\n</svg>",
  "unblock": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 1C4.13 1 1 4.13 1 8C1 11.87 4.13 15 8 15C11.87 15 15 11.87 15 8C15 4.13 11.87 1 8 1ZM8 13C6.98 13 6.04 12.69 5.25 12.17L7.3 10.12L5.89 8.71L3.84 10.76C3.32 9.97 3.01 9.02 3.01 8.01C3.01 5.25 5.25 3.01 8.01 3.01C9.03 3.01 9.97 3.32 10.76 3.84L8.71 5.89L10.12 7.3L12.17 5.25C12.69 6.04 13 6.99 13 8C13 10.76 10.76 13 8 13Z\" fill=\"currentColor\"/>\n</svg>",
  "undo": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 8C14 11.31 11.31 14 8 14C4.69 14 2 11.31 2 8C2 7.3 2.14 6.63 2.36 6H4.57C4.22 6.59 4 7.26 4 8C4 10.21 5.79 12 8 12C10.21 12 12 10.21 12 8C12 5.79 10.21 4 8 4V6L5 3L8 0V2C11.31 2 14 4.69 14 8Z\" fill=\"currentColor\"/>\n</svg>",
  "unlocked": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M12 6H6V4C6 2.9 6.9 2 8 2C9.1 2 10 2.9 10 4H12C12 1.8 10.2 0 8 0C5.8 0 4 1.8 4 4V6C2.9 6 2 6.9 2 8V13C2 14.1 2.9 15 4 15H12C13.1 15 14 14.1 14 13V8C14 6.9 13.1 6 12 6ZM9 12H7V9H9V12Z\" fill=\"currentColor\"/>\n</svg>",
  "verified": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 15L7.14 14.71C3.24 13.41 1 10.62 1 7V2.49L8 0L15 2.49V7C15 10.62 12.77 13.41 8.87 14.71L8 15ZM3 3.9V7C3 10.53 5.6 12.09 7.78 12.82L8.01 12.9L8.24 12.82C10.01 12.23 13 10.71 13 7V3.9L8 2.11L3 3.9ZM9.43 5L7.01 8.02L5.91 6.92L4.5 8.34L7.17 11.01L12 5.01H9.43V5Z\" fill=\"currentColor\"/>\n</svg>",
  "verified-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 0L1 2.49V7C1 10.62 3.24 13.41 7.14 14.71L8 15L8.87 14.71C12.77 13.4 15 10.62 15 7V2.49L8 0ZM7.17 11L4.5 8.33L5.91 6.91L7.01 8.01L9.43 4.99H12L7.17 10.99V11Z\" fill=\"currentColor\"/>\n</svg>",
  "upload": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 10V12C14 13.66 12.66 15 11 15H5C3.34 15 2 13.66 2 12V10H4V12C4 12.55 4.45 13 5 13H11C11.55 13 12 12.55 12 12V10H14ZM4 3.85V6.29L7 4.15V11H9V4.15L12 6.29V3.85L8 1L4 3.85Z\" fill=\"currentColor\"/>\n</svg>",
  "video-camera": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M3 3H11V13H3C1.9 13 1 12.1 1 11V5C1 3.9 1.9 3 3 3ZM13.5 4L12 4.75V11.25L13.5 12H15V4H13.5Z\" fill=\"currentColor\"/>\n</svg>",
  "video-conference": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M1 5V11C1 12.1 1.9 13 3 13H11V3H3C1.9 3 1 3.9 1 5ZM5 5H7V7H9V9H7V11H5V9H3V7H5V5ZM15 4V12H13.5L12 11.2V4.8L13.5 4H15Z\" fill=\"currentColor\"/>\n</svg>",
  "video-inset": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6 14H4C2.35 14 1 12.65 1 11V5C1 3.35 2.35 2 4 2H12C13.65 2 15 3.35 15 5V6H13V5C13 4.45 12.55 4 12 4H4C3.45 4 3 4.45 3 5V11C3 11.55 3.45 12 4 12H6V14ZM15 12V10C15 8.9 14.1 8 13 8H10C8.9 8 8 8.9 8 10V12C8 13.1 8.9 14 10 14H13C14.1 14 15 13.1 15 12Z\" fill=\"currentColor\"/>\n</svg>",
  "video-square": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M4 2C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V4C14 3.46957 13.7893 2.96086 13.4142 2.58579C13.0391 2.21071 12.5304 2 12 2H4ZM6 5V11L11 8L6 5Z\" fill=\"currentColor\"/>\n</svg>",
  "visibility": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8 3C4.4 3 1.5 4.9 0 8C1.5 11.1 4.4 13 8 13C11.6 13 14.6 11.1 16 8C14.6 4.9 11.6 3 8 3ZM8 11C6.3 11 5 9.7 5 8C5 6.3 6.3 5 8 5C9.7 5 11 6.3 11 8C11 9.7 9.7 11 8 11ZM10 8C10 9.1 9.1 10 8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8Z\" fill=\"currentColor\"/>\n</svg>",
  "visibility-off": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M1 1.7L3.5 4.2C2 5.1 0.8 6.4 0 8C1.5 11.1 4.4 13 8 13C9.3 13 10.5 12.7 11.6 12.3L14.3 15L15 14.3L1.7 1L1 1.7ZM5.6 6.3L6.3 7C6.1 7.3 6 7.6 6 8C6 9.1 6.9 10 8 10C8.4 10 8.7 9.9 9 9.7L9.7 10.4C9.2 10.8 8.6 11 8 11C6.3 11 5 9.7 5 8C5 7.4 5.2 6.8 5.6 6.3ZM16 8C15.4 9.3 14.5 10.4 13.4 11.2L10.9 8.7C11 8.5 11 8.3 11 8C11 6.3 9.7 5 8 5C7.7 5 7.5 5 7.2 5.1L5.5 3.3C6.3 3.1 7.1 3 8 3C11.6 3 14.6 4.9 16 8ZM10 7.9L8.1 6C9.1 6.1 9.9 6.9 10 7.9Z\" fill=\"currentColor\"/>\n</svg>",
  "virtual-chat": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.5 16L6 15.71L9 14H13C14.1 14 15 13.1 15 12V2C15 0.9 14.1 0 13 0H3C1.9 0 1 0.9 1 2V12C1 13.1 1.9 14 3 14H4V16H5.5ZM8.01 12.26L6 13.41V12H3V2H13V12H8.47L8.01 12.26ZM6.8 10C6.8 10.6 7.3 11.2 8 11.2C8.7 11.2 9.2 10.6 9.2 10C9.2 9.4 8.7 8.8 8 8.8C7.3 8.8 6.8 9.4 6.8 10ZM7 8H8.8C10.5 7.2 11 6.3 11 5.4C11 4 10.1 3 8.1 3C6.9 3 5.9 3.4 5 3.8V5.9C5.8 5.4 7 5 8 5C8.6 5 9 5.2 9 5.6C9 5.9 8.6 6.2 7.9 6.6L7 7.1V8Z\" fill=\"currentColor\"/>\n</svg>",
  "virtual-chat-fill": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M3 0H13C14.1 0 15 0.9 15 2V12C15 13.1 14.1 14 13 14H9L5.5 16H4V14H3C1.9 14 1 13.1 1 12V2C1 0.9 1.9 0 3 0ZM6.8 10C6.8 10.6 7.3 11.2 8 11.2C8.7 11.2 9.2 10.6 9.2 10C9.2 9.4 8.7 8.8 8 8.8C7.3 8.8 6.8 9.4 6.8 10ZM7 7.1V8H8.8C10.5 7.2 11 6.3 11 5.4C11 4 10.1 3 8.1 3C6.9 3 5.9 3.4 5 3.8V5.9C5.8 5.4 7 5 8 5C8.6 5 9 5.2 9 5.6C9 5.9 8.6 6.2 7.9 6.6L7 7.1Z\" fill=\"currentColor\"/>\n</svg>",
  "volume-high": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 4L9 1V15L5 12H3C2.46957 12 1.96086 11.7893 1.58579 11.4142C1.21071 11.0391 1 10.5304 1 10V6C1 5.46957 1.21071 4.96086 1.58579 4.58579C1.96086 4.21071 2.46957 4 3 4H5ZM14 8C13.9986 9.59076 13.3655 11.1159 12.24 12.24L13 13C13.6501 12.35 14.1658 11.5783 14.5176 10.7289C14.8694 9.87962 15.0505 8.96931 15.0505 8.05C15.0505 7.13069 14.8694 6.22038 14.5176 5.37105C14.1658 4.52173 13.6501 3.75002 13 3.1L12.29 3.81C13.3851 4.92992 13.9988 6.43367 14 8ZM11 8C10.9993 8.79538 10.6828 9.55793 10.12 10.12L10.83 10.83C11.2019 10.4585 11.4969 10.0174 11.6982 9.53176C11.8995 9.04617 12.0031 8.52566 12.0031 8C12.0031 7.47434 11.8995 6.95383 11.6982 6.46824C11.4969 5.98265 11.2019 5.54149 10.83 5.17L10.12 5.88C10.6828 6.44207 10.9993 7.20462 11 8Z\" fill=\"currentColor\"/>\n</svg>",
  "volume-low": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 4L9 1V15L5 12H3C2.46957 12 1.96086 11.7893 1.58579 11.4142C1.21071 11.0391 1 10.5304 1 10V6C1 5.46957 1.21071 4.96086 1.58579 4.58579C1.96086 4.21071 2.46957 4 3 4H5Z\" fill=\"currentColor\"/>\n</svg>",
  "volume-medium": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M5 4L9 1V15L5 12H3C2.46957 12 1.96086 11.7893 1.58579 11.4142C1.21071 11.0391 1 10.5304 1 10V6C1 5.46957 1.21071 4.96086 1.58579 4.58579C1.96086 4.21071 2.46957 4 3 4H5ZM10.83 5.17L10.12 5.88C10.6818 6.4425 10.9974 7.205 10.9974 8C10.9974 8.795 10.6818 9.5575 10.12 10.12L10.83 10.83C11.2019 10.4585 11.4969 10.0174 11.6982 9.53176C11.8995 9.04617 12.0031 8.52566 12.0031 8C12.0031 7.47434 11.8995 6.95383 11.6982 6.46824C11.4969 5.98265 11.2019 5.54149 10.83 5.17Z\" fill=\"currentColor\"/>\n</svg>",
  "volume-mute": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M14 8C13.9986 6.40924 13.3655 4.88414 12.24 3.76L13 3.05C14.1267 4.17893 14.834 5.65877 15.005 7.24453C15.1759 8.8303 14.8002 10.4269 13.94 11.77L13.16 11C13.7024 10.0927 13.9924 9.05699 14 8ZM10.89 8.77L11.67 9.54C11.8828 9.05419 11.995 8.53034 12 8C12.0004 7.47456 11.8973 6.95418 11.6965 6.4686C11.4958 5.98302 11.2013 5.54175 10.83 5.17L10.12 5.88C10.6828 6.44207 10.9993 7.20462 11 8C10.9992 8.26052 10.9622 8.51967 10.89 8.77ZM9 6.88V1L5.64 3.52L9 6.88ZM12.58 11.88L11.15 10.45L10.44 9.74L9 8.29L4.71 4L1.71 1L1 1.71L3.29 4H3C2.46957 4 1.96086 4.21071 1.58579 4.58579C1.21071 4.96086 1 5.46957 1 6V10C1 10.5304 1.21071 11.0391 1.58579 11.4142C1.96086 11.7893 2.46957 12 3 12H5L9 15V9.71L14.29 15L15 14.29L13.29 12.58L12.58 11.88Z\" fill=\"currentColor\"/>\n</svg>",
  "whats-app": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M8.00195 0C12.4202 0 16.002 3.58172 16.002 8C16.002 12.4183 12.4202 16 8.00195 16C6.56093 15.9999 5.20814 15.6159 4.04004 14.9482L1.6748 15.5674L0 16.0049L0.457031 14.335L1.08984 12.0254C0.399601 10.8426 0.00195312 9.46691 0.00195312 8C0.00195312 3.58188 3.5839 0.000262011 8.00195 0ZM8.00195 2C4.68847 2.00026 2.00195 4.68645 2.00195 8C2.00195 9.22794 2.37102 10.3672 3.00293 11.3174L3.25488 11.6963L3.13477 12.1357L2.84473 13.1934L3.94336 12.9062L4.37012 12.7949L4.74121 13.0352C5.6803 13.6448 6.79845 13.9999 8.00195 14C11.3157 14 14.002 11.3137 14.002 8C14.002 4.68629 11.3157 2 8.00195 2ZM5.70117 4.38672C5.81597 4.39439 5.97689 4.34858 6.12988 4.71973C6.29051 5.1063 6.67202 6.04766 6.71875 6.14258C6.76467 6.23541 6.79559 6.34408 6.73438 6.47559C6.67314 6.59937 6.63482 6.68466 6.54297 6.79297C6.45122 6.90116 6.3439 7.0399 6.25977 7.125C6.16026 7.22558 6.06097 7.32709 6.17578 7.52051C6.28327 7.71442 6.66563 8.34042 7.23145 8.85059C7.95861 9.50047 8.57134 9.70989 8.7627 9.80273C8.95393 9.90321 9.06102 9.88727 9.17578 9.75586C9.2905 9.63217 9.64988 9.19951 9.78027 9.00586C9.91034 8.82026 10.0331 8.85125 10.209 8.91309C10.385 8.98271 11.3194 9.44621 11.5107 9.53906L11.5186 9.53125C11.7098 9.62405 11.8398 9.6708 11.8857 9.75586C11.9317 9.84096 11.9312 10.2202 11.7705 10.6689C11.6097 11.1175 10.8528 11.5277 10.4854 11.582C10.1562 11.6284 9.74242 11.6518 9.2832 11.5049C9.00768 11.4198 8.64783 11.3037 8.19629 11.1025C6.28429 10.2754 5.03706 8.3434 4.94336 8.20898C4.84385 8.0852 4.16211 7.17141 4.16211 6.22754C4.16228 5.28457 4.65183 4.82055 4.82812 4.62695C4.99652 4.43354 5.20386 4.38672 5.33398 4.38672H5.70117Z\" fill=\"currentColor\"/>\n</svg>"
} as const satisfies Record<IconName, string>;

const sizeClasses: Record<IconSize, string> = {
  small: "size-[var(--design-icon-size-small)]",
  medium: "size-[var(--design-icon-size-medium)]",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Icon({
  name,
  size = "small",
  label,
  className,
  ...props
}: IconProps) {
  return (
    <span
      {...props}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx(
        "inline-flex shrink-0 items-center justify-center [&_svg]:block [&_svg]:size-full",
        sizeClasses[size],
        className,
      )}
      dangerouslySetInnerHTML={{ __html: iconSvgByName[name] }}
    />
  );
}
