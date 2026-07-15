---
version: "alpha"
name: VCA AI Concierge Prototypes
description: "Design system for the shared VCA AI concierge prototype workspace, reusable primitives, chat UI components, and responsive behavior requirements across separate product workstreams."
workstreams:
  shared:
    intent: "Shared design language and component foundation for all concierge prototypes."
    guidance: "Keep primitives product-neutral; pass product-specific labels, routes, and content from workstream-owned modules."
  hiring:
    name: "LTS Hiring Concierge"
    route: "/hiring/entry-lix-test"
    status: "Built prototype"
    guidance: "Hiring-specific marketing copy, personas, routing tiers, sales handoff logic, onboarding requirements, and conversation flows stay inside the Hiring workstream."
  premium:
    name: "Premium Concierge"
    route: "/premium"
    status: "Early prototype"
    guidance: "Premium survey steps, plan comparison content, signal logic, recommendations, and upsell behavior stay inside the Premium workstream."
  premium-company-pages:
    name: "Premium Company Pages"
    route: "/premium-company-pages"
    status: "Visionary prototype framing"
    audience: "Executive storytelling and design alignment"
    intent: "Explore how a LinkedIn-native VCA could turn Premium Company Page visitor interest into qualified admin action."
    guidance: "Keep this separate from member Premium and Hiring. Use the PCP overview and VCA spec as source of truth; keep behavior scripted and avoid real identity, analytics, inbox, monetization, scheduling, ads integration, or new branded design tokens unless explicitly scoped."
colors:
  action: "#0A66C2"
  action-hover: "#004182"
  action-active: "#004182"
  action-background-transparent-hover: "rgba(55, 143, 233, 0.1)"
  action-background-transparent-active: "rgba(55, 143, 233, 0.2)"
  action-focus-ring: "rgba(55, 143, 233, 0.08)"
  on-action: "#FFFFFF"
  checked: "#01754F"
  checked-hover: "#004C33"
  checked-active: "#004C33"
  on-checked: "#FFFFFF"
  on-checked-active: "rgba(255, 255, 255, 0.6)"
  background: "#FFFFFF"
  background-disabled: "rgba(140, 140, 140, 0.2)"
  background-neutral-soft: "#F4F2EE"
  surface-tint: "#EEF3FA"
  background-transparent-hover: "rgba(140, 140, 140, 0.1)"
  background-transparent-active: "rgba(140, 140, 140, 0.2)"
  overlay-dim: "rgba(0, 0, 0, 0.15)"
  scrim: "rgba(0, 0, 0, 0.6)"
  ai-background-soft: "#E8F3FF"
  ai-background-strong: "#D2E9FF"
  ai-border: "#AAD6FF"
  ai-icon: "#0A66C2"
  positive: "#01754F"
  positive-hover: "#004C33"
  positive-active: "#004C33"
  caution: "#AD4601"
  caution-hover: "#702F03"
  caution-active: "#702F03"
  new: "#0A66C2"
  tag-default-background: "rgba(140, 140, 140, 0.2)"
  tag-positive-background: "{colors.positive}"
  tag-negative-background: "#CB112D"
  tag-caution-background: "{colors.caution}"
  tag-neutral-background: "#56687A"
  tag-supportive-1-background: "#FDE2BC"
  tag-supportive-2-background: "#FFDFD6"
  tag-supportive-3-background: "#DAEBD1"
  tag-supportive-4-background: "#DDE7F1"
  tag-supportive-4-text: "#56687A"
  tag-supportive-5-background: "#D9E9EC"
  on-tag-strong: "#FFFFFF"
  entity-ghost-background: "#EAE6DF"
  entity-ghost-medium: "#9DB3C8"
  entity-ghost-strong: "#788FA5"
  entity-ghost-dark: "#56687A"
  border: "rgba(0, 0, 0, 0.75)"
  border-hover: "rgba(0, 0, 0, 0.9)"
  border-active: "rgba(0, 0, 0, 0.9)"
  border-subtle: "rgba(0, 0, 0, 0.3)"
  border-subtle-hover: "rgba(0, 0, 0, 0.45)"
  border-subtle-active: "rgba(0, 0, 0, 0.45)"
  border-faint: "rgba(140, 140, 140, 0.2)"
  border-faint-hover: "rgba(140, 140, 140, 0.3)"
  border-faint-active: "rgba(140, 140, 140, 0.4)"
  label: "rgba(0, 0, 0, 0.75)"
  label-disabled: "rgba(0, 0, 0, 0.3)"
  icon: "rgba(0, 0, 0, 0.75)"
  icon-hover: "rgba(0, 0, 0, 0.9)"
  icon-active: "rgba(0, 0, 0, 0.9)"
  icon-disabled: "rgba(0, 0, 0, 0.3)"
  text: "rgba(0, 0, 0, 0.9)"
  text-primary: "{colors.text}"
  text-hover: "rgba(0, 0, 0, 0.9)"
  text-active: "rgba(0, 0, 0, 0.9)"
  text-meta: "rgba(0, 0, 0, 0.6)"
  text-disabled: "rgba(0, 0, 0, 0.3)"
  negative: "#CB112D"
  negative-hover: "#8A0015"
  negative-active: "#8A0015"
  neutral-focus-ring: "rgba(0, 0, 0, 0.15)"
  premium-gradient-base-a: "#FDF0DE"
  premium-gradient-base-b: "#FDE2BC"
  premium-gradient-base-c: "#F9C982"
  premium-brand: "#F9C982"
  premium-button-background: "#F9C982"
  premium-button-background-hover: "#E9A53F"
  premium-button-background-active: "#C37D16"
  premium-button-label: "rgba(0, 0, 0, 0.9)"
  premium-icon: "rgba(0, 0, 0, 0.9)"
  premium-inbug: "#C37D16"
  premium-indicator: "#C37D16"
  premium-text-brand: "#C37D16"
typography:
  display-xl:
    fontFamily: System UI
    fontSize: 48px
    fontWeight: 600
    lineHeight: 54px
    letterSpacing: 0.36px
  display-md:
    fontFamily: System UI
    fontSize: 30px
    fontWeight: 600
    lineHeight: 33.75px
    letterSpacing: 0.36px
  heading-xl:
    fontFamily: System UI
    fontSize: 24px
    fontWeight: 600
    lineHeight: 30px
    letterSpacing: 0.36px
  heading-lg:
    fontFamily: System UI
    fontSize: 20px
    fontWeight: 600
    lineHeight: 25px
    letterSpacing: 0.38px
  heading-md:
    fontFamily: System UI
    fontSize: 16px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: -0.32px
  heading-sm:
    fontFamily: System UI
    fontSize: 18px
    fontWeight: 600
    lineHeight: 22.5px
    letterSpacing: -0.45px
  control-md:
    fontFamily: System UI
    fontSize: 16px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: -0.32px
  control-sm:
    fontFamily: System UI
    fontSize: 14px
    fontWeight: 600
    lineHeight: 17.5px
    letterSpacing: -0.15px
  body-md:
    fontFamily: System UI
    fontSize: 16px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: -0.32px
  body-md-open:
    fontFamily: System UI
    fontSize: 18px
    fontWeight: 400
    lineHeight: 27px
    letterSpacing: -0.45px
  body-sm:
    fontFamily: System UI
    fontSize: 14px
    fontWeight: 400
    lineHeight: 17.5px
    letterSpacing: -0.15px
  body-sm-open:
    fontFamily: System UI
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: -0.15px
  body-xs:
    fontFamily: System UI
    fontSize: 12px
    fontWeight: 400
    lineHeight: 15px
    letterSpacing: 0px
  supportive-s:
    fontFamily: System UI
    fontSize: 12px
    fontWeight: 400
    lineHeight: 15px
    letterSpacing: 0px
  supportive-s-strong:
    fontFamily: System UI
    fontSize: 12px
    fontWeight: 600
    lineHeight: 15px
    letterSpacing: 0px
  label-xs:
    fontFamily: System UI
    fontSize: 12px
    fontWeight: 600
    lineHeight: 15px
    letterSpacing: 0px
rounded:
  xs: 4px
  sm: 8px
  entity-square-md: 12px
  panel: 12px
  md: 16px
  lg: 24px
  xl: 32px
  round: 999px
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
  xxxl: 32px
  stack: 40px
  stack-lg: 48px
  card-padding: 24px
  panel-padding: 20px
  pill-padding-inline: 16px
  button-padding-inline: 24px
layout:
  viewport-min-width: 320px
  mobile-breakpoint-max: 767px
  tablet-breakpoint-min: 768px
  desktop-breakpoint-min: 1024px
  mobile-page-padding: 16px
  tablet-page-padding: 24px
  desktop-page-padding: 32px
  panel-collapsed-width: 400px
  panel-expanded-width: 1280px
  panel-collapsed-height: 908px
  panel-expanded-height: 928px
  panel-content-max: 600px
  side-panel-collapsed-surface-width: 896px
  side-panel-collapsed-chat-track: 3fr
  side-panel-collapsed-side-track: 5fr
  side-panel-expanded-surface-width: 1280px
  side-panel-expanded-chat-track: 3fr
  side-panel-expanded-side-track: 5fr
  schedule-collapsed-surface-width: "{layout.side-panel-collapsed-surface-width}"
  schedule-collapsed-chat-track: "{layout.side-panel-collapsed-chat-track}"
  schedule-collapsed-side-track: "{layout.side-panel-collapsed-side-track}"
  schedule-expanded-surface-width: "{layout.side-panel-expanded-surface-width}"
  schedule-expanded-chat-track: "{layout.side-panel-expanded-chat-track}"
  schedule-expanded-side-track: "{layout.side-panel-expanded-side-track}"
  chat-message-assistant-collapsed-max: "100%"
  chat-message-assistant-expanded-max: 600px
  confirmation-dialog-width: 336px
  mobile-panel-width: "100vw"
  mobile-panel-height: "100dvh"
  mobile-panel-rounded: 0px
  mobile-panel-inset: 0px
  panel-header-height: 64px
  composer-height: 56px
  composer-input-max-height: 144px
  composer-stop-action-height: 42px
  primary-action-height: 48px
  compact-action-height: 32px
  input-small-height: 28px
  input-large-height: 48px
  tag-small-height: 20px
  tag-medium-height: 24px
  ghost-icon-button-touch-height: 48px
  ghost-icon-button-small-width: 32px
  ghost-icon-button-medium-width: 48px
  ghost-icon-button-small-compact-width: 24px
  ghost-icon-button-medium-compact-width: 24px
  ghost-icon-button-small-state-size: 32px
  ghost-icon-button-medium-state-size: 40px
  entity-size-16: 16px
  entity-size-24: 24px
  entity-size-32: 32px
  entity-size-40: 40px
  entity-size-48: 48px
  entity-size-64: 64px
  entity-size-80: 80px
  entity-size-96: 96px
  entity-size-128: 128px
  entity-size-160: 160px
iconography:
  small:
    size: 16px
    color: currentColor
  medium:
    size: 24px
    color: currentColor
shadows:
  raised: "0px 0px 1px rgba(140, 140, 140, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.3)"
  raised-active: "0px 0px 1px rgba(140, 140, 140, 0.2), 0px 3px 9px rgba(0, 0, 0, 0.3)"
  raised-faint: "0px 0px 1px rgba(140, 140, 140, 0.2), 0px 4px 12px rgba(0, 0, 0, 0.15)"
  raised-faint-active: "0px 0px 1px rgba(140, 140, 140, 0.2), 0px 3px 9px rgba(0, 0, 0, 0.15)"
  raised-faint-upward: "0px 0px 1px rgba(140, 140, 140, 0.2), 0px -4px 12px rgba(0, 0, 0, 0.15)"
  raised-soft: "{shadows.raised-faint}"
  raised-soft-active: "{shadows.raised-faint-active}"
elevation:
  raised: "{shadows.raised}"
  raised-active: "{shadows.raised-active}"
  raised-faint: "{shadows.raised-faint}"
  raised-faint-active: "{shadows.raised-faint-active}"
  raised-soft: "{shadows.raised-soft}"
  raised-soft-active: "{shadows.raised-soft-active}"
motion:
  durations:
    instant: 0ms
    fast: 150ms
    base: 180ms
    moderate: 240ms
    slow: 320ms
  easing:
    standard: "cubic-bezier(0.2, 0, 0, 1)"
    emphasized: "cubic-bezier(0.2, 0, 0, 1)"
    exit: "cubic-bezier(0.4, 0, 1, 1)"
  distances:
    subtle-y: 4px
    message-y: 8px
    surface-y: 12px
  patterns:
    controls:
      duration: "{motion.durations.fast}"
      easing: "{motion.easing.standard}"
      properties:
        - color
        - background-color
        - border-color
        - box-shadow
      intent: "Use for hover, press, focus-visible, disabled, and compact control state changes."
    composer-shape:
      duration: "{motion.durations.fast}"
      easing: "{motion.easing.standard}"
      properties:
        - border-radius
        - padding
        - border-color
      intent: "Use when the composer changes between single-line and multiline states."
    message-enter:
      duration: "{motion.durations.base}"
      easing: "{motion.easing.standard}"
      translateY: "{motion.distances.message-y}"
      opacity:
        from: 0
        to: 1
      intent: "Use when user, assistant, or specialist messages appear in the thread."
    assistant-thinking:
      duration: "{motion.durations.slow}"
      easing: "{motion.easing.standard}"
      visual: "Text-only Thinking label with colors.ai-border sweeping across the text; do not use animated dots."
      intent: "Use for temporary AI thinking states before a simulated assistant response begins."
    assistant-response-stream:
      cadence: "Reveal assistant text in deterministic phrase-sized chunks at a fast cadence. Use only a subtle opacity resolve on each new phrase, keep punctuation pauses minimal, and increase chunk size for long responses so the simulation stays brief."
      intent: "Use for prototype-only simulated AI responses so the chat feels live without implying a real model call."
    panel-transition:
      duration: "{motion.durations.moderate}"
      easing: "{motion.easing.emphasized}"
      translateY: "{motion.distances.surface-y}"
      intent: "Use for opening, closing, expanding, or collapsing the chat panel."
    recommendation-enter:
      duration: "{motion.durations.moderate}"
      easing: "{motion.easing.standard}"
      translateY: "{motion.distances.subtle-y}"
      opacity:
        from: 0
        to: 1
      intent: "Use when a recommendation card or next-step surface appears after the conversation has enough context."
    route-transition:
      duration: "{motion.durations.moderate}"
      easing: "{motion.easing.standard}"
      translateY: "{motion.distances.subtle-y}"
      opacity:
        from: 0
        to: 1
      intent: "Use for future transitions between major prototype states, such as onboarding, chat, handoff, booking, and resources."
    reduced-motion:
      duration: "{motion.durations.instant}"
      easing: "{motion.easing.standard}"
      intent: "When reduced motion is preferred, remove translate and scale movement; keep only instant state changes or short opacity changes when needed for orientation."
components:
  responsive-page:
    minViewportWidth: "{layout.viewport-min-width}"
    mobilePadding: "{layout.mobile-page-padding}"
    tabletPadding: "{layout.tablet-page-padding}"
    desktopPadding: "{layout.desktop-page-padding}"
  responsive-chat-panel-mobile:
    width: "{layout.mobile-panel-width}"
    height: "{layout.mobile-panel-height}"
    rounded: "{layout.mobile-panel-rounded}"
    inset: "{layout.mobile-panel-inset}"
    headerHeight: "{layout.panel-header-height}"
    composerMinHeight: "{layout.composer-height}"
  button-medium:
    typography: "{typography.control-md}"
    rounded: "{rounded.round}"
    height: 48px
    padding: "0 24px"
  button-small:
    typography: "{typography.control-sm}"
    rounded: "{rounded.round}"
    height: 32px
    padding: "0 12px"
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.on-action}"
  button-primary-active:
    backgroundColor: "{colors.action-active}"
    textColor: "{colors.on-action}"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.action}"
    borderColor: "{colors.action}"
  button-secondary-hover:
    backgroundColor: "{colors.action-background-transparent-hover}"
    textColor: "{colors.action-hover}"
    borderColor: "{colors.action-hover}"
    hoverBorderWidth: 2px
  button-secondary-active:
    backgroundColor: "{colors.action-background-transparent-active}"
    textColor: "{colors.action-active}"
    borderColor: "{colors.action-active}"
  button-tertiary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.label}"
    borderColor: "{colors.border}"
  button-tertiary-hover:
    backgroundColor: "{colors.background-transparent-hover}"
    textColor: "{colors.label-hover}"
    borderColor: "{colors.border-hover}"
    hoverBorderWidth: 2px
  button-tertiary-active:
    backgroundColor: "{colors.background-transparent-active}"
    textColor: "{colors.label-active}"
    borderColor: "{colors.border-active}"
  button-disabled:
    backgroundColor: "{colors.background-disabled}"
    textColor: "{colors.text-disabled}"
    borderColor: "transparent"
  confirmation-dialog:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    backdropColor: "{colors.scrim}"
    width: "{layout.confirmation-dialog-width}"
    rounded: "{rounded.sm}"
    borderColor: "{colors.border-faint}"
    shadow: "{shadows.raised}"
    headerTypography: "{typography.heading-lg}"
    bodyTypography: "{typography.body-sm-open}"
    headerPadding: "4px 4px 4px 24px"
    bodyPadding: "24px"
    footerPadding: "16px 24px"
    footerGap: "{spacing.sm}"
  pill-choice:
    touchHeight: 48px
    height: 32px
    typography: "{typography.control-sm}"
    rounded: "{rounded.md}"
    gap: "{spacing.xs}"
    padding: "4px 12px"
    backgroundColor: "{colors.background}"
    textColor: "{colors.label}"
    borderColor: "{colors.border-subtle}"
    hoverBackgroundColor: "{colors.background-transparent-hover}"
    hoverTextColor: "{colors.text-hover}"
    hoverBorderColor: "{colors.border}"
    hoverBorderWidth: 2px
    activeBackgroundColor: "{colors.background-transparent-active}"
    activeTextColor: "{colors.text-active}"
    activeBorderColor: "{colors.border-active}"
    checkedBackgroundColor: "{colors.checked}"
    checkedTextColor: "{colors.on-checked}"
    checkedHoverBackgroundColor: "{colors.checked-hover}"
    checkedActiveBackgroundColor: "{colors.checked-active}"
    checkedActiveTextColor: "{colors.on-checked-active}"
    disabledBackgroundColor: "{colors.background-disabled}"
    disabledTextColor: "{colors.label-disabled}"
  tag:
    smallHeight: "{layout.tag-small-height}"
    mediumHeight: "{layout.tag-medium-height}"
    smallTypography: "{typography.body-sm}"
    mediumTypography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: "0 8px"
    textColor: "{colors.label}"
    strongTextColor: "{colors.on-tag-strong}"
    defaultBackgroundColor: "{colors.tag-default-background}"
    positiveBackgroundColor: "{colors.tag-positive-background}"
    negativeBackgroundColor: "{colors.tag-negative-background}"
    cautionBackgroundColor: "{colors.tag-caution-background}"
    neutralBackgroundColor: "{colors.tag-neutral-background}"
    supportive1BackgroundColor: "{colors.tag-supportive-1-background}"
    supportive2BackgroundColor: "{colors.tag-supportive-2-background}"
    supportive3BackgroundColor: "{colors.tag-supportive-3-background}"
    supportive4BackgroundColor: "{colors.tag-supportive-4-background}"
    supportive4TextColor: "{colors.tag-supportive-4-text}"
    supportive5BackgroundColor: "{colors.tag-supportive-5-background}"
  badge:
    dotSmallSize: 8px
    dotLargeSize: 16px
    counterHeight: 16px
    counterMinWidth: 16px
    counterTypography: "{typography.supportive-s-strong}"
    rounded: "{rounded.round}"
    alertBackgroundColor: "{colors.negative}"
    newBackgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
  icon:
    smallSize: 16px
    mediumSize: 24px
    color: currentColor
  entity:
    ghostBackgroundColor: "{colors.entity-ghost-background}"
    ghostMediumColor: "{colors.entity-ghost-medium}"
    ghostStrongColor: "{colors.entity-ghost-strong}"
    ghostDarkColor: "{colors.entity-ghost-dark}"
    defaultSize: 40px
    sizes:
      - 16px
      - 24px
      - 32px
      - 40px
      - 48px
      - 64px
      - 80px
      - 96px
      - 128px
      - 160px
    circleRadius: "{rounded.round}"
    squareRadii:
      16px: "{rounded.xs}"
      24px: "{rounded.xs}"
      32px: "{rounded.xs}"
      40px: "{rounded.xs}"
      48px: "{rounded.sm}"
      64px: "{rounded.sm}"
      80px: "{rounded.sm}"
      96px: "{rounded.entity-square-md}"
      128px: "{rounded.md}"
      160px: "{rounded.lg}"
  button-icon-small:
    rounded: "{rounded.round}"
    height: 48px
    width: 32px
    stateSize: 32px
    iconSize: "{iconography.small}"
  button-icon-medium:
    rounded: "{rounded.round}"
    height: 48px
    width: 48px
    stateSize: 48px
    iconSize: "{iconography.medium}"
  ghost-icon-button-small:
    backgroundColor: "transparent"
    textColor: "{colors.text-meta}"
    rounded: "{rounded.round}"
    height: 48px
    width: 32px
    compactWidth: 24px
    stateSize: 32px
    iconSize: "{iconography.small}"
  ghost-icon-button-medium:
    backgroundColor: "transparent"
    textColor: "{colors.text-meta}"
    rounded: "{rounded.round}"
    height: 48px
    width: 48px
    compactWidth: 24px
    stateSize: 40px
    iconSize: "{iconography.small}"
  text-input-small:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    placeholderColor: "{colors.text-disabled}"
    labelColor: "{colors.label}"
    iconColor: "{colors.icon}"
    typography: "{typography.body-sm}"
    supportingTypography: "{typography.supportive-s}"
    rounded: "{rounded.xs}"
    height: 28px
    padding: "0 4px"
    borderColor: "{colors.border}"
    hoverBorderColor: "{colors.border-hover}"
    activeBorderColor: "{colors.border-active}"
    focusBorderColor: "{colors.border-active}"
    focusRingColor: "transparent"
  text-input-large:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    placeholderColor: "{colors.text-disabled}"
    labelColor: "{colors.label}"
    iconColor: "{colors.icon}"
    typography: "{typography.body-md}"
    supportingTypography: "{typography.supportive-s}"
    rounded: "{rounded.xs}"
    height: 48px
    padding: "0 12px"
    borderColor: "{colors.border}"
    hoverBorderColor: "{colors.border-hover}"
    activeBorderColor: "{colors.border-active}"
    focusBorderColor: "{colors.border-active}"
    focusRingColor: "transparent"
  text-input-error:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    supportingTextColor: "{colors.negative}"
    supportingTypography: "{typography.supportive-s-strong}"
    rounded: "{rounded.xs}"
    borderColor: "{colors.negative}"
    hoverBorderColor: "{colors.negative-hover}"
    activeBorderColor: "{colors.negative-active}"
    focusBorderColor: "{colors.negative-active}"
    focusRingColor: "transparent"
  text-input-disabled:
    backgroundColor: "{colors.background-disabled}"
    textColor: "{colors.text-disabled}"
    labelColor: "{colors.label-disabled}"
    iconColor: "{colors.icon-disabled}"
    supportingTextColor: "{colors.text-disabled}"
    rounded: "{rounded.xs}"
    borderColor: "transparent"
  chat-panel-collapsed:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    width: 400px
    height: 908px
    borderColor: "{colors.border-faint}"
    shadow: "{shadows.raised-faint}"
  chat-panel-expanded:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    width: 1280px
    height: 928px
    borderColor: "{colors.border-faint}"
    backdropColor: "{colors.overlay-dim}"
    shadow: "{shadows.raised-faint}"
  chat-header:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    height: 64px
    padding: "0 16px 0 24px"
    borderColor: "{colors.border-faint}"
    actionWidth: 48px
    actionGap: 0px
  chat-thread:
    maxWidth: 600px
    paddingInline: 24px
    timestampPadding: "20px 0 16px"
    itemGap: "{spacing.xxl}"
    relatedPromptGap: "{spacing.md}"
    attachedItemGap: "{spacing.sm}"
  chat-message-assistant:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.body-sm-open}"
    collapsedMaxWidth: "100%"
    expandedMaxWidth: 600px
    rowPadding: "0"
  chat-message-user:
    backgroundColor: "{colors.ai-background-strong}"
    textColor: "{colors.text}"
    typography: "{typography.body-sm-open}"
    rounded: "{rounded.md}"
    maxWidth: 392px
    padding: "20px"
    rowPadding: "0"
  chat-message-representative:
    backgroundColor: "{colors.background-neutral-soft}"
    textColor: "{colors.text}"
    typography: "{typography.body-sm-open}"
    rounded: "{rounded.md}"
    maxWidth: 392px
    padding: "20px"
    rowPadding: "0"
  recommendation-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    borderColor: "{colors.ai-border}"
    maxWidth: 344px
    padding: "20px"
  prompt:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    borderColor: "{colors.border-faint}"
    hoverBackgroundColor: "{colors.background-transparent-hover}"
    hoverBorderWidth: 2px
    activeBackgroundColor: "{colors.background-transparent-active}"
    focusRingColor: "{colors.neutral-focus-ring}"
    disabledBackgroundColor: "{colors.background-disabled}"
    disabledTextColor: "{colors.text-disabled}"
    maxWidth: 400px
    padding: "12px"
  chat-composer:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    placeholderColor: "{colors.text-disabled}"
    typography: "{typography.body-sm-open}"
    rounded: "{rounded.round}"
    multilineRounded: "{rounded.md}"
    minHeight: 56px
    maxWidth: 640px
    maxInputHeight: 144px
    shellPadding: "8px 24px 24px"
    padding: "4px 12px"
    multilinePadding: "8px 12px"
    borderColor: "{colors.border-subtle}"
    hoverBorderColor: "{colors.border-subtle-hover}"
    hoverBorderWidth: 1px
    activeBorderColor: "{colors.border-subtle-active}"
    focusBorderColor: "{colors.border-subtle-active}"
    focusRingWidth: 0px
    actionGap: "{spacing.sm}"
    actionSize: 32px
    stopActionHeight: 42px
---

## Overview
This design system describes the UI that is implemented now and the responsive behavior every UI surface must satisfy: the landing context, shared primitive controls, icons, entity placeholders, text inputs, choice pills, the chat panel shell, chat messages, prompts, recommendation card, and chat composer.

It should feel like quiet enterprise software with conversational edges. The interface is light, restrained, and LinkedIn-adjacent through blue, neutral text, crisp borders, compact typography, and practical spacing. It should not introduce future product surfaces, marketing treatments, premium states, booking flows, or other speculative experiences until those components exist.

The token frontmatter is the normative design contract. The Markdown body explains the intent behind those values so future implementation work can stay consistent without inventing new styling.

For any component library page work, read [docs/component-library-design.md](docs/component-library-design.md) first. Component library presentation rules belong there, and review-page styling should not bleed into the actual product components unless the component itself is intentionally being changed.

## Figma Implementation Guidance
Figma is the source of truth for global color, typography, spacing, radius, and elevation token values. The project keeps source-token layers in `src/styles/figma-colors.css`, `src/styles/figma-typography.css`, `src/styles/figma-dimensions.css`, and `src/styles/figma-elevation.css`, with app-friendly aliases in `src/styles/globals.css`; app aliases should map back to Figma variables or styles whenever a matching source token exists.

When implementing from Figma:

- Preserve the visual intent, interaction behavior, and reusable system decisions.
- Do not copy Figma-only frame nesting, auto-layout scaffolding, or canvas helper structure when simpler code layout is equivalent.
- Compare Figma styles against existing repo tokens before adding or renaming tokens.
- If Figma token names differ from repo token names, map them to the repo vocabulary unless the design direction intentionally changes the system.
- If Figma conflicts with current implementation, ask whether Figma or the built product should win before making non-obvious changes.
- Prefer updating shared tokens and primitives before applying product-specific overrides.

## Colors
The current palette is mostly white and neutral, with Figma's semantic action blue reserved for action and AI identity.

- **Action (`#0A66C2`)** is used for primary buttons, emphasized icon controls, links in controls, and the AI mark.
- **Action hover/active (`#004182`)** is used for hover and pressed blue-action states.
- **Background (`#FFFFFF`)** is the primary surface for the panel, composer, cards, and controls.
- **Overlay dim (`rgba(0, 0, 0, 0.15)`)** maps to Figma's `Background/color-background-overlay-a20` token and is used behind the expanded desktop chat panel so the conversation is foregrounded without turning into a modal takeover.
- **Scrim (`rgba(0, 0, 0, 0.6)`)** is reserved for true modal interruption, such as confirming a destructive or conversation-ending action.
- **AI background soft (`#E8F3FF`)** is Figma's soft AI surface token.
- **AI background strong (`#D2E9FF`)** is used for the pale blue member chat message surface.
- **Background neutral soft (`#F4F2EE`)** is used for specialist chat messages.
- **Tag colors** are reserved for non-interactive status and category labels. Positive and negative mirror existing semantic status colors; caution, neutral, and supportive accent backgrounds should not be reused for broader product surfaces without a new design-system decision.
- **Premium colors** are reserved for the existing Premium prototype surfaces and should not be reused for the core concierge or hiring surfaces.
- **Data visualization colors** are available as Figma source tokens and Tailwind color utilities for future chart or analytics components.
- **Entity ghost colors** are a warm neutral plus muted blue-grays used only for unloaded or placeholder identity imagery.
- **Text** is black at 90% opacity.
- **Text meta** is black at 60% opacity and is the only secondary/quiet text color.
- **Text disabled** is black at 30% opacity.
- **Label and icon** are black at 75% opacity for form-control chrome that should sit between primary text and meta text.
- **Border tokens** create most of the hierarchy. `border-faint` is used for panel chrome and light dividers; `border` and `border-hover` are used for stronger input states.
- **Negative (`#CB112D`)** is used for text input validation and error messaging.

Do not add accent palettes for concepts that are not implemented yet.

## Typography
The current system uses platform-native system UI to approximate the SF Pro Display and SF Pro Text styles in Figma. Figma typography styles are encoded in `src/styles/figma-typography.css`, while app aliases in `globals.css` preserve component-friendly names. The feel should be compact, clear, and product-led.

- Supportive and title styles are for compact UI text, such as buttons, labels, tags, controls, and metadata.
- Body and prose styles are for readable content, especially chat messages, helper copy, and longer explanatory text.
- Control text is semibold and intentionally denser than body/prose copy.
- Body copy uses regular weight with more open line heights for chat and message reading.
- Helper, counter, and timestamp text should stay small and quiet.
- Use the existing type scale before adding new sizes.
- Use `heading-lg` for compact dialog titles that need the 20px Figma confirmation-dialog scale without jumping to a full panel heading.

## Layout
The layout includes a marketing landing context and a focused chat panel with a narrow default state and a wider expanded state.

- The minimum supported viewport width is 320px.
- The collapsed panel is 400px wide.
- The expanded panel is 1280px wide on desktop, capped by the viewport so it keeps breathing room at narrow desktop widths.
- The collapsed panel height is capped at 908px; the expanded panel height is capped at 928px. Both must also cap to the available viewport height with page gutters.
- The header is 64px tall.
- The composer is at least 56px tall and grows only when the input wraps.
- Internal spacing follows the current 4/8/12/16/20/24/32 rhythm.
- Spacing and radius aliases map to Figma dimension tokens where equivalents exist. `rounded.xl` remains app-specific at 32px because the current Figma corner radius scale stops at 24px before `full`.

The component library and review surfaces may use the same tokens for demonstration, but they are not separate design-system products.

## Responsive Behavior
All UI and UX work must account for mobile and narrow screens before it is considered complete. Desktop fidelity is not enough for this prototype because the entry point is a public marketing surface and the chat is a primary conversion path.

- Design and implement every new surface for mobile, tablet, and desktop states, even when the first mock or component-library example is desktop-sized.
- At 767px wide and below, the chat experience should adapt to the viewport instead of preserving the 400px desktop panel width.
- On mobile, the chat panel should behave like a docked or full-screen surface using the available viewport height, with the header, scrollable thread, composer, and primary actions always reachable.
- Mobile layouts must avoid horizontal scrolling in core flows, including landing content, onboarding, chat, handoff, booking, and resource states.
- Primary CTAs such as Contact sales must remain visible and usable on narrow screens. Secondary content may stack, reorder, or reduce density to preserve the main path.
- Touch targets should preserve comfortable hit areas. Compact 32px icon surfaces should sit inside adequate touch targets when they are primary mobile controls.
- Text, buttons, chips, cards, and composer actions must wrap or stack before they overflow their containers.
- Respect mobile safe areas and dynamic viewport height so fixed or docked UI does not collide with browser chrome, home indicators, or the on-screen keyboard.

## Elevation & Depth
Depth is minimal. The chat panel is the only elevated product surface in the current implementation.

Shared elevation maps to the four VCA Figma elevation examples: `raised`, `raised-active`, `raised-faint`, and `raised-faint-active`; `raised-soft` remains a compatibility alias for the faint shadow. The chat shell uses `raised-faint`. The bottom-docked tray uses the same faint shadow ingredients with the y-offset inverted so the shadow casts upward. Cards, messages, inputs, and controls rely on borders, surface color, and spacing rather than additional shadows. Avoid adding new shadow levels until a built component requires them.

## Shapes
The shape language separates precise form controls from softer conversational surfaces.

- Buttons and icon action surfaces use Figma's round radius token.
- Text inputs use a tight 4px radius.
- Recommendation cards use a 16px radius.
- Chat panels use Figma's 12px panel radius; message bubbles use 16px and 32px radii so the chat surface feels approachable.
- The composer is pill-shaped when single-line and softens to a 28px radius when multiline.
- Entity circles are fully round. Entity squares use progressively larger radii as they scale, including a 12px intermediate radius for the 96px size.

Do not make every element equally rounded; the contrast between crisp inputs, pill controls, and soft chat surfaces is part of the current identity.

## Motion
Motion should feel quiet, useful, and consultative. It should make the prototype feel responsive and help visitors understand what changed, without making the concierge feel theatrical or salesy.

- Use motion to acknowledge actions, preserve orientation, establish conversational rhythm, and clarify important next steps.
- Keep routine control feedback fast. Hover, press, focus, border, and background changes should feel immediate.
- Let messages enter with a short fade and slight upward movement so the thread feels alive without imitating a long typing performance.
- Use a subtle text-only thinking state before AI responses when simulated latency helps the conversation feel live.
- Stream simulated AI responses in fast phrase-sized chunks, with the message surface fading in once and each new phrase resolving from partially visible to fully visible without movement. Keep the timing deterministic, minimize punctuation pauses, and adapt chunk size so long prototype responses do not become slow. Treat an assistant answer and its attached prompts, feedback, or next-step surfaces as one response block so follow-up UI appears as a continuation rather than a separate layout jump.
- Give recommendation and next-step surfaces slightly more presence than routine messages because they mark a decision moment.
- Use panel and route transitions to maintain context when the experience opens, expands, collapses, or moves between major states.
- Avoid bounce, elastic overshoot, large scale pops, decorative sparkle loops, and long delays that slow a high-intent visitor down.
- Respect reduced-motion preferences by removing translate and scale movement; use instant state changes or brief opacity changes only when they preserve orientation.

## Components
### Buttons
Buttons exist in primary, secondary, and tertiary variants, with small and medium sizes. Primary buttons are filled blue. Secondary buttons are outlined blue. Tertiary buttons are neutral and subdued but still visibly interactive.

Hover and active states should use the current action-transparent or background-transparent tokens. Focus-visible states use rings; disabled and loading states use the disabled background and disabled text color.

Ghost buttons are separate quiet text actions for module footers and low-emphasis commands. They use a 48px touch target, small or medium control typography, transparent chrome by default, optional leading or trailing 16px icons, neutral label tokens by default, and action tokens when emphasized. Hover and active state layers use the existing transparent background tokens.

### Confirmation Dialog
Confirmation dialogs interrupt the flow only when the user is about to confirm a choice that changes or discards conversation state. They use the modal `scrim`, a 336px window, `rounded.sm`, `shadow-raised`, faint dividers, and compact `heading-lg` title typography. The component supports center and top alignment, with center as the default for most confirmations.

The dismiss X and Escape key close the confirmation only. The primary action confirms the choice, the secondary action returns the user to the prior flow, and an optional tertiary action may appear before them when the design requires a third lower-emphasis choice. Destructive or conversation-ending confirmation copy should be explicit about what will be cleared or ended.

### Pill
Choice pills are compact toggle controls for filtering or selecting lightweight options. They use a 48px touch target around a 32px pill surface, 12px horizontal padding, 4px inner gap, `typography.control-sm`, and `rounded.md`.

Unchecked pills use the standard background, label, and border-subtle tokens, with neutral hover and active state layers. Checked pills use the green checked tokens and white knockout text. Disabled pills use the shared disabled background and label-disabled text, regardless of checked state.

### Icon Buttons
Button icon and ghost icon button are separate primitives. Button icon carries primary, secondary, and tertiary button semantics in icon-only form. Ghost icon button is the quiet utility control used in the chat header and composer.

Header ghost icon buttons sit in adjacent 48px-wide action slots with no visible gap between state layers.

### Entity
Entities represent people, companies, and other identity objects. The current implementation supports ghost placeholders only: circular person placeholders and square company placeholders.

Entity sizes are 16, 24, 32, 40, 48, 64, 80, 96, 128, and 160px. Deprecated Figma sizes are intentionally excluded. Real images may replace the ghost artwork while preserving the same size and shape rules.

### Badge
Badges are tiny overlay indicators for new activity, alerts, and capped notification counts. They are not inline labels; use `Tag` for inline status copy. Alert badges use the negative token, new badges use the action token, and counters cap at `99+`.

### Presence Badge
Presence badges are compact availability indicators for people or live agents. `Active` uses the checked green token as a filled dot; `On mobile` uses the same checked token as a ring over the background surface. Sizes are `small`, `medium`, and `large`; use the smallest size that remains legible at the avatar size.

### Text Input
Text inputs come in small and large sizes. They use strong default borders, compact helper text, and restrained error messaging.

Hover darkens the border. Active, focused, and typing states use the same dark active border without adding a focus ring. Error hover, active, and focused states may darken to the negative-hover color.

Placeholder text uses the disabled text color so it reads clearly as a prompt rather than entered content. The composer follows the same rule.

### Chat Shell
The chat panel is a contained conversation surface. The header carries the title on the left and utility controls on the right; the blue AI mark is optional and should be deliberately enabled only when a prototype or library demo is evaluating that treatment. When the AI mark is enabled, the minimized tray should use the same AI mark size, title typography, and icon-to-title gap as the header so the identity does not change scale when the shell collapses. The shared tray defaults to compact height; persistent docked trays across LTS Hiring, Premium Survey, and component-library examples use the 64px header-height treatment with only the Open action while docked. Expand and Close remain available in the full header after the chat is opened. Docked tray unread status uses the large alert badge dot after the tray title or representative name, not as an icon overlay; only unread AI or live-agent messages should light this dot. Tray-style headers expose only the shell controls that are valid for the current shell mode: expand/collapse, dock to tray or restore from tray, and close. The body centers the thread within the panel content width.

When a live sales consultant has joined the conversation, the header identity changes from the AI mark and `Contact sales` title to the representative identity. Use a 32px circular entity with a small active presence badge over the lower-right edge, an 8px gap, and a single-line `heading-md` representative name; do not show the role in the chat shell header. The same representative identity should appear in the minimized tray when the tray shell is docked. Representative message metadata uses a 24px circular entity with the same small active presence badge treatment. Shell control behavior should stay consistent within a selected review shell as the conversation moves between default, docked, expanded, and handoff states.

The thread owns the shared horizontal content gutter. Message rows, prompt groups, cards, and other conversation items should align inside that gutter instead of adding their own panel-edge padding. Individual bubbles and cards own only their internal padding.

The thread owns the default vertical rhythm with a 24px gap between top-level conversation items. Centered timestamp divider rows use 16px of breathing room before the following message. Message rows do not carry vertical padding. Related prompt rows should be grouped with the message, card, or response that produced them using a 12px gap. Feedback controls, inline feedback, and reason panels should sit after the message or prompt row they rate using an 8px attached-item gap so they feel connected without becoming part of the message bubble.

The scrollable transcript should keep an 8px terminal inset before the composer boundary, so the newest message, card, prompt, or feedback control never rests directly against the composer divider when the thread is scrolled to the bottom.

When a visitor sends a typed message or selects a prompt, reposition the newest user message once so it sits near the top of the scrollable transcript. Reserve the remaining viewport beneath that message as a response runway. Thinking, streamed text, cards, prompts, feedback, and other response attachments should consume that runway without continuously changing the scroll position. If the response grows beyond the available runway, let it continue below the fold and expose the shared jump-to-latest affordance. Manual scrolling always takes precedence; do not resume automatic following while the same response is still growing.

The response runway belongs to the scroll container, not to an individual message, response block, or attachment. It must not participate in the thread's top-level gap or alter the existing 8px and 12px attached-item spacing. Measure rendered content instead of estimating text or component height so the same behavior supports plain text, multiple paragraphs, cards, horizontal rails, asynchronously sized media, and side-panel history. Preserve the runway after a short response completes so the transcript does not snap back; recalculate it when a new user turn begins or the active transcript changes size.

Use one deliberate repositioning motion before the assistant response begins. Render the new user message at its natural position for a frame, then animate the transcript to the anchored position; do not let content or layout synchronization replace that animation with an immediate jump. The thinking state begins only after the anchor motion settles. Reduced-motion preferences should make that repositioning immediate. While a response is growing, expanding or collapsing the chat panel may recalculate the available runway, but it must not pull the viewport away from a position the user chose manually.

Collapsed and expanded panel widths are implemented, but expanded mode should still feel like a chat surface, not a dashboard. On desktop, expanded mode dims the page behind the panel and allows returning to the collapsed panel from the header control. On mobile, the panel already occupies the viewport, so the expanded/collapsed utility should not appear unless a distinct mobile expanded state is designed.

Hiring supports three review shells: `Tray (hidden)`, `Tray (persistent)`, and `Tray (hybrid)`. `Tray (persistent)` is the default review shell and starts from the persistent docked tray; it should not expose a close action in the docked tray or open panel, and its open panel header shows expand/collapse before dock. `Tray (hidden)` opens a bottom-attached tray-shaped panel instead of the legacy floating card; its header exposes expand/collapse and close. The legacy floating-card code path remains available internally, but it is not the current review picker option. `Tray (hybrid)` keeps the existing hybrid UX: it starts with no tray and no panel; after `Contact sales`, it opens the same right-side tray-style bottom-attached panel. Minimizing creates the compact bottom tray, and closing removes both the panel and tray.

The tray-first shell is bottom-docked on desktop. Its maximum height should preserve the 64px landing header plus an 8px gap, so the shell never covers the page header on shorter viewports. The chat panel itself should inherit the docked frame height in tray mode so the composer keeps its bottom padding inside the visible shell.

Premium supports two review shells: `Tray (hidden)`, which keeps the optional `Help me decide` floating action as the re-entry point, and `Tray (persistent)`, which replaces the FAB with a persistent docked `Help assistant` tray. Both Premium shells open as bottom-attached tray-shaped panels with rounded top corners and square bottom corners that meet the browser edge. `Tray (hidden)` does not dock; its header exposes only expand/collapse and close, and closing returns the FAB. `Tray (persistent)` should not expose a close action in the docked tray or open panel; visitors can only expand/collapse it or dock the panel back to the tray. In the Premium persistent header, expand/collapse appears before dock.

High-value scheduling may add a side panel in either collapsed or expanded chat states: the left panel preserves the chat context while the right panel carries the scheduling task on the light neutral background token. The chat header remains visible above both panels. The scheduling panel starts with a `Back to chat` affordance that closes the side panel and preserves the current chat state. When opened from collapsed chat, the wider two-panel surface stays right-aligned; only expanded chat centers the wider surface. The collapsed scheduling surface should be about 896px wide with a 3:5 chat-to-scheduler split, yielding about 336px of chat context at max width. The expanded scheduling surface should be about 1280px wide with the same 3:5 split, yielding about 480px of chat context at max width. Use the named schedule layout rule for these panes rather than ad hoc arbitrary grid strings. While the scheduler is open, the in-thread specialist card is passive context, not a second CTA. After booking, the side panel closes and the specialist card is replaced by a booked confirmation card with no manage-booking action.

### Messages
Assistant messages are plain text on the panel surface. User messages use the pale blue message surface. Specialist messages use the warm neutral message surface.

Assistant messages should use the available chat column in the collapsed panel so plain text does not look artificially narrow. In expanded mode, cap assistant text to a readable measure so the conversation still feels like chat rather than a full-width document.

Messages should keep readable line lengths and avoid stretching across the full expanded panel.

One user turn should produce one assistant response identity. Multiple paragraphs, emphasized passages, recommendation cards, data cards, prompts, and other supporting components may be segments of that response, but they must not become separate assistant messages unless a user action, speaker change, handoff, or other genuine conversational boundary occurs between them. Every completed conversational response receives one timestamp. User messages keep the timestamp below their bubble; assistant responses place their response footer after all explanatory text, cards, prompts, and other next actions.

Feedback eligibility follows the response's purpose rather than its position in the thread. A pure welcome or orientation message is not rateable, even when it is the first assistant message. A substantive answer, personalized insight, or recommendation is rateable even when it is the first assistant message, as in Premium's high-signal personalized recommendation. Completed rateable responses show one feedback control group beside the timestamp in the final response footer. Welcome, system, stopped, error, and human-representative responses show a timestamp without AI feedback. Do not infer these rules from the message index or from whether a user message already exists.

Prototype AI responses are deterministic and fake, but they should still follow the conversation rhythm: a brief text-only thinking state, then a quickly simulated assistant message. The thinking text may use `colors.ai-border` as a light-blue sweep across the label. Reveal phrase-sized chunks with a subtle inline opacity resolve and no movement. Do not imitate raw tokens, type characters individually, or extend the animation in proportion to every word; increase chunk size for long responses so the text simulation generally finishes in roughly 1.5 seconds or less. Voice simulation may reuse the same stable phrase chunks at a slower deterministic cadence to approximate speech, but it should not revert to word-by-word text animation. Attached prompts, feedback, and next-step UI should open inside the same response block after the text completes.

For responses that include structured components, stream the explanatory text first. Begin revealing the first meaningful component as soon as the text completes; the component's entrance animation provides the transition without an additional long pause. Additional semantic component groups may use a short stagger, while prompts and feedback appear last. Animate response-level groups rather than every metric, row, or child independently. Components that are taller than the available viewport continue below the fold without being centered or forced into view.

Stopping during thinking replaces the thinking state with neutral stopped feedback. Stopping during text streaming preserves the partial text and suppresses response components that have not appeared. Never remove a component that is already visible. Once the text is complete and the first structured component is visible, component entrance is presentation rather than ongoing generation and should not keep the composer in a stoppable response state.

Visual phrase streaming should not cause assistive technology to announce the response one chunk at a time. Keep the response busy while it is incomplete, then announce the completed or stopped response once.

### Recommendation Card
The recommendation card is a compact next-step surface with a heading, optional short supporting text, and one or two actions depending on the flow. It should feel like a practical next step inside the conversation, not a promotional card.

In scheduled specialist flows, the first recommendation card uses one CTA to start booking. After click, the same card transitions through a matching state, then a matched specialist state with the specialist entity and a single scheduling CTA. These match cards use a white surface with the AI border token across initial, matching, matched, scheduling, and booked states, so they read as lightweight system cards rather than blue message bubbles. The booked-card heading uses heading-md; the date uses body-sm; the contact delivery line uses body-sm with text-meta.

### Prompt
Prompts are compact buttons that let a visitor send a suggested message into the thread. They use body text rather than semibold control text because the label reads as the user's message, not a command.

The visible label may be shorter than the prompt that is sent, but the component should keep the full prompt available to assistive tech and hover affordances. Long labels truncate to preserve the compact chip-like shape.

### Composer
The composer is a rounded text area with an Add action on the left and microphone plus send/voice controls on the right. Every icon-only composer action uses the same styled tooltip above the control on pointer hover and keyboard focus; align edge tooltips inward so they do not overflow the composer. Tooltip copy names the current action and stays synchronized with the accessible label. The Add action is discoverable but out of scope: keep it focusable and use `Add attachment — not available in this prototype.` so the tooltip names the action without implying that it works.

The default composer border uses the subtle border token. Hover states use `border-subtle-hover`, while focused, typing, and multiline states use `border-subtle-active`. Do not add inset hover shadows that visually thicken the stroke. The placeholder uses `text-disabled`.

When the message no longer fits beside the actions, the actions move to a second row with Add on the left and microphone plus send on the right. While the assistant is thinking or streaming, the entire composer surface switches to a clickable stop-answering control. The stop mark uses `text-primary` for the square and animated indeterminate ring, while the label stays quieter in `text-meta`. If stopping happens before any text streams, replace the thinking row with neutral inline feedback that says `Response stopped.` If partial text has streamed, keep the partial response, mark it complete, and attach the same neutral inline feedback beneath it. Stopped responses should not append response follow-ups such as prompts, cards, or rating controls.

### Voice Mode
Voice mode replaces the text composer with a compact white pill that uses the same 56px `composer-height` as the single-line text composer. Keep three stable positions: the shared primary ButtonIcon on the left, an overlapping visitor-and-AI identity cluster in the center, and End voice on the right. The active participant always occupies the 36px foreground-left position; the inactive participant becomes approximately 24px and tucks behind-right with roughly 10px visibly covered by the foreground identity. When the turn changes, the visitor and AI exchange those positions using a short emphasized position-and-scale transition while the cluster width remains fixed. The left action uses the SDUI `arrow-up` icon while the visitor is speaking and can submit the utterance; it uses `microphone-fill` while the assistant is thinking or speaking and can be interrupted, as well as in non-actionable voice states. The left action and End voice action each use the same 32px compact control size; the foreground identity uses 36px with a subtle 40px halo without changing layout. Give both edge controls a comfortable horizontal inset from the pill border. The action remains visible in every voice state so the pill never shifts. It is disabled while waiting for speech, paused, or blocked; enabled as Finish speaking while the visitor is talking; briefly shows the ButtonIcon loading spinner while finalizing the utterance; and returns as Interrupt and speak while the assistant is thinking or speaking. Use the negative background token only while the assistant is actively speaking to emphasize that the microphone action will interrupt playback; keep the action blue while the assistant is still thinking.

Voice action tooltips follow the action or status represented by the current state: `Start speaking`, `Finish speaking`, `Interrupt and speak`, `Requesting microphone access`, `Preparing response`, `Microphone blocked`, or `Voice paused`. End voice uses `End voice mode`. Keep tooltips off the overlapping visitor and AI identities because they are status indicators rather than actions. Tooltips do not replace accessible button labels and do not introduce long-press behavior on touch devices.

Entering voice mode from the Hiring prototype requests microphone access from the visitor’s explicit Start voice action. While the browser permission prompt is unresolved, keep the voice pill visible, remove the active-speaker highlight, and show the microphone ButtonIcon loading state with the accessible label `Requesting microphone access`. The Chrome-first prototype uses browser speech recognition with interim results to populate the provisional user message. Component-library examples remain scripted so every voice state can be reviewed without microphone access.

Do not place transcripts, status labels, instructions, or a text input inside this control. Both center identities remain visible and exchange foreground and background positions to show the active speaker: the visitor moves forward while listening or speaking, and the AI moves forward once the utterance is committed, while the assistant is thinking, or while the assistant is speaking. Keep the blue-tinted circular highlight anchored behind the foreground-left participant rather than moving independently across the pill. Permission-requesting and paused states remove the highlight and use a neutral equal-size overlap; the blocked state brings the visitor forward for the microphone error without applying an active-speaker highlight. The center remains a status indicator rather than an additional action.

The thread remains the visual source of truth during voice mode. Show live recognition as one provisional user bubble in the thread, then finalize that same turn when the recognition service detects the end of the utterance or the visitor selects Finish speaking. Finish speaking should stop recognition while preserving the best transcript captured so far. Keep the loading handoff brief and prevent duplicate submission while it runs. Stream the visible assistant response in the thread while the corresponding concise spoken response plays. Interrupt and speak cancels the current assistant turn, preserves completed text, suppresses unrevealed attachments, and returns to listening. End voice aborts recognition, releases the microphone, stops audio, and returns to the standard text composer without removing completed conversation history.

For structured responses, speak a short framing sentence rather than reading every card field or control. Reveal the rich component beneath the completed assistant text using the normal response-attachment behavior. Components remain visually interactive, but the prototype must not imply that every component action can be controlled by speech.

Microphone access errors do not automatically exit voice mode. Permission denial uses the shared blocked-microphone banner; missing or unavailable hardware and unsupported speech recognition use the same banner structure with accurate concise copy. Remove the active-speaker highlight, add the negative microphone treatment to the visitor identity without listening motion, keep the microphone ButtonIcon visible but disabled, and keep End voice available. Talking while blocked produces no provisional transcript. Re-entering voice mode after the visitor changes browser settings requests access again.

When a visual task panel such as scheduling opens, suspend voice mode as a focused-task interlude: abort speech recognition, fully release the microphone stream, stop assistant audio, and hide the voice composer. Do not reserve composer space or expose End voice while the task panel is open because voice is inactive in this state. Preserve the conversation and paused voice-mode state internally, then reacquire the microphone and return to listening only when the visitor explicitly goes back to chat or completes the task. Closing the overall chat ends the voice session instead. Do not imply that spoken dates or form values are supported until the task panel is explicitly voice-addressable.

## Do's and Don'ts
- Do keep the current system mostly white, structured, and calm.
- Do use blue for clear action and brand utility, not broad decoration.
- Do preserve the difference between crisp text inputs and softer chat surfaces.
- Do account for mobile and narrow-screen behavior in every UI/UX change.
- Do remove tokens when they only describe unbuilt components or speculative future states.
- Don't introduce premium, booking, onboarding, or other experience-specific visual language until those components are implemented.
- Don't ship desktop-only surfaces, horizontal overflow, or unreachable fixed controls in the primary landing-to-chat path.
- Don't let review-shell or marketing styling become part of the product design contract.
