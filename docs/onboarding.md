# Onboarding

Design spec for the screen that lives between the marketing site's "Contact sales" CTA and the AI Concierge chat thread. It captures the four required lead fields, then transitions into the first chat turn.

This file is a UX/flow spec, not an implementation guide. Reference [PROJECT.md](../PROJECT.md) for product context and persona, and [DESIGN.md](../DESIGN.md) for the token vocabulary used throughout.

## What this is

When a visitor on `business.linkedin.com/hire` clicks "Contact sales," the AI Concierge panel opens. The first thing inside the panel is the onboarding screen described here. Once the form is complete and submitted, the chat thread begins.

The screen has one job: capture the four required lead fields with as little friction as the constraints allow, while honoring the three project principles (heard not qualified, help first, every route is a good route).

## Required fields

These are non-negotiable. They come from downstream lead-capture requirements:

- First name
- Last name
- Work email (must be on a work domain, not a personal email provider)
- Company name

The form must always render. There is no "skip the form and route me to sales" escape hatch.

## Why LinkedIn auth does not skip the form

The dominant demo state is signed-in. LinkedIn auth gives us reliable identity (name, avatar) but does not give us reliable lead context:

- LinkedIn email is often a personal email, not a work email.
- LinkedIn company is often stale, missing, or mapped to an agency or parent entity.

Because the prototype requires a work email on a work domain and a confirmed company, the form must always appear, even after sign-in. Sign-in can prefill identity and email fields, but it never replaces the form or removes the work-domain requirement.

## Two demo states

The screen has two visual states. A future review-shell toggle will flip between them.

### Signed-in (dominant demo state)

- A slim identity strip sits between the welcome content and the form (avatar + LinkedIn email + "Not Jamie?" link).
- First name and Last name arrive prefilled from the LinkedIn profile (editable).
- Work email arrives prefilled from the LinkedIn profile even when it is a personal email. If it is personal, the field shows the work-domain warning and blocks submit.
- Company name stays empty unless the prefilled email is already a valid work-domain email that can safely derive a company.
- The "Not Jamie?" affordance lets the user dismiss the LinkedIn identity and complete the form manually if needed.

### Signed-out

- No identity strip.
- A "Continue with LinkedIn" button is offered as the fastest path.
- An "or" divider separates the LinkedIn CTA from the manual form.
- All four fields are empty.
- First name is focused on entry.

The two states share one welcome treatment (centered AI mark + headline + subcopy at the top of the panel body, on a subtly tinted background). The only meaningful differences are the identity strip (signed-in only), the LinkedIn CTA + divider (signed-out only), and the prefill state of the profile-backed fields.

## Layout

Inside the existing collapsed chat panel (`chat-panel-collapsed`, 432px wide, 780px tall).

While the onboarding screen is showing, the panel surface and chrome shift to a "welcome" treatment so the moment reads as a quiet introduction rather than an in-progress chat:

- The panel background uses a subtle vertical gradient from `colors.background` (white) at the top to `colors.surface-tint` at the bottom. The gradient covers the full panel including the header zone.
- The header keeps the close and expand controls, but its background and bottom divider become transparent. The AI mark is removed from the header and re-renders as a 32px centered mark above the welcome content.
- On submit, the panel's gradient fades to the default white surface, the header's divider re-appears, and the AI mark morphs into its header position. See "Transition into chat" for details.

Internal gutters use `spacing.xxl` (24px) on the left and right inside the panel body. Form area is therefore 384px wide.

Tokens used throughout:

- Colors: `colors.background` and the new `colors.surface-tint` for the welcome gradient, `colors.ai-icon` for the AI mark, plus the standard `colors.text` / `colors.text-meta` for type and `colors.border-faint` for the (chat phase) header divider.
- Spacing: `spacing.xxl` (24px) top form padding and left/right gutters, `spacing.xxxl` (32px) bottom form padding, `spacing.sm` (8px) headline-to-subcopy gap, `spacing.md` (12px) identity-strip internal gap, `spacing.lg` (16px) field-to-field gap, `spacing.xxxl` (32px) identity-strip-to-form gap, `spacing.stack` (40px) major section gap.
- Typography: `heading-xl` for the headline, `body-md-open` with `colors.text-meta` for the subcopy, `supportive-s` with `colors.text-meta` for the identity-strip email and the "or" divider, plus the `TextInput` and button primitives' built-in type.
- Layout: panel 432px wide, header 64px (existing), body 716px tall. AI mark sized to 32px in the welcome state and 24px in the chat header.
- Motion: `motion.patterns.controls` for the company auto-fill value fade-in, `motion.patterns.message-enter` for the first-chat bubble, and the View Transitions API (with `motion.duration.moderate` / `motion.easing.emphasized`) for the welcome-to-chat handoff and the AI-mark morph.

### Signed-in layout

```
┌─────────────────────────────────────────────┐  panel surface gradient
│                                      [×]    │  transparent header (64px)
│                  ✦                          │  AI mark, 32px, colors.ai-icon
│                                             │  spacing.stack (40px)
│                 Hire better                 │  heading-xl, colors.text
│                                             │  spacing.sm (8px)
│    Get personalized answers to your hiring  │  body-md-open
│      questions with our AI-powered chat     │  colors.text-meta
│                                             │  centered, max-w 320px
│                                             │  spacing.stack (40px)
│   ◯  jamie.chen@gmail.com      Not Jamie?   │  identity strip:
│                                             │  Entity size=24 + email + link
│                                             │  spacing.xxxl (32px)
│   First name                                │  TextInput size=large
│   ┌─────────────────────────────────────┐   │
│   │ Jamie                               │   │  prefilled, editable
│   └─────────────────────────────────────┘   │
│                                             │  spacing.lg (16px)
│   Last name                                 │
│   ┌─────────────────────────────────────┐   │
│   │ Chen                                │   │  prefilled, editable
│   └─────────────────────────────────────┘   │
│                                             │
│   Work email                                │
│   ┌─────────────────────────────────────┐   │
│   │ jamie.chen@gmail.com |              │   │  prefilled, focused
│   └─────────────────────────────────────┘   │
│   Use your work email so we can tailor...   │  error text
│                                             │
│   Company name                              │
│   ┌─────────────────────────────────────┐   │
│   │                                     │   │  empty, will auto-fill
│   └─────────────────────────────────────┘   │
│                                             │  spacing.stack (40px)
│   ┌─────────────────────────────────────┐   │
│   │             Start chat              │   │  button-primary medium
│   └─────────────────────────────────────┘   │
│                                             │  spacing.xxxl (32px)
└─────────────────────────────────────────────┘  gradient bottom: surface-tint
```

### Signed-out layout

```
┌─────────────────────────────────────────────┐  panel surface gradient
│                                      [×]    │  transparent header (64px)
│                  ✦                          │  AI mark, 32px, colors.ai-icon
│                                             │  spacing.stack (40px)
│                 Hire better                 │  heading-xl, colors.text
│                                             │  spacing.sm (8px)
│    Get personalized answers to your hiring  │  body-md-open
│      questions with our AI-powered chat     │  colors.text-meta
│                                             │  centered, max-w 320px
│                                             │  spacing.stack (40px)
│   ┌─────────────────────────────────────┐   │  button-primary medium
│   │  [in]  Continue with LinkedIn       │   │  with LinkedIn icon
│   └─────────────────────────────────────┘   │
│                                             │  spacing.lg (16px)
│   ──────────────  or  ──────────────        │  divider, supportive-s text-meta
│                                             │  spacing.lg (16px)
│   First name                                │
│   ┌─────────────────────────────────────┐   │
│   │ |                                   │   │  empty, focused
│   └─────────────────────────────────────┘   │
│                                             │  spacing.lg (16px)
│   Last name                                 │
│   ┌─────────────────────────────────────┐   │
│   │                                     │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   Work email                                │
│   ┌─────────────────────────────────────┐   │
│   │                                     │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   Company name                              │
│   ┌─────────────────────────────────────┐   │
│   │                                     │   │  auto-fills from email
│   └─────────────────────────────────────┘   │
│                                             │  spacing.stack (40px)
│   ┌─────────────────────────────────────┐   │
│   │             Start chat              │   │  button-primary medium
│   └─────────────────────────────────────┘   │
│                                             │  spacing.xxxl (32px)
└─────────────────────────────────────────────┘  gradient bottom: surface-tint
```

## Identity strip (signed-in only)

A single horizontal row built from the existing `Entity` primitive ([src/components/primitives/entity.tsx](../src/components/primitives/entity.tsx)). Sits between the welcome content and the form. Quietly acknowledges the LinkedIn identity without becoming the visual anchor of the screen.

### Composition

- Left: `Entity` at `size={24}`, `shape="circle"`, `src` set to the LinkedIn avatar URL, `label` set to the full name (used as alt text). Falls back to the ghost person SVG if no `src`.
- 8px gap (`spacing.md`).
- Center: LinkedIn email in `typography.supportive-s`, `colors.text-meta`. Single line, truncates with ellipsis if it overflows. The email fills the available width between the avatar and the dismiss link.
- Right (aligned to the form gutter's right edge): "Not Jamie?" interactive label in `typography.supportive-s`, `colors.action`. Standard hover, press, and focus states use `motion.patterns.controls`.

The strip has no border, background, or container shape. It is an identity confirmation, not a card.

### Why no name

The avatar gives recognition for the user looking at their own account, and the LinkedIn-known first name still appears in the dismiss link ("Not Jamie?"). Showing the full name in the strip would also duplicate the prefilled First name and Last name fields directly below it, which adds visual weight without adding information.

### Why LinkedIn email is the only line of text

The email line reinforces the source of the profile-backed prefill:

- It acknowledges the user (recognition through their own LinkedIn email address).
- It self-explains the warning: a user looking at `jamie.chen@gmail.com` immediately understands why "Work email" is still asking for a work domain.
- It builds trust through transparency about what LinkedIn already gave us.

### "Not Jamie?" behavior

One click. No confirmation, no menu. The action is reversible by closing and reopening the panel.

On click:

1. The identity strip is removed.
2. First name and Last name fields clear (LinkedIn-sourced data is rejected).
3. Profile-sourced Work email clears. User-typed Work email stays.
4. Company name clears only if it was auto-filled from the profile-sourced email; user-typed Company name stays.
5. Focus moves to First name.
6. The screen now visually matches the signed-out state.

The internal state is `signed-in-but-dismissed`. The visual state is identical to plain signed-out. The review-shell toggle does not need to expose this third state.

The "Not Jamie?" affordance does not appear on the signed-out screen.

## Welcome content

A centered AI mark, headline, and subcopy. Identical in both demo states. Renders at the top of the panel body, immediately under the (transparent) header.

The three pieces stack vertically and are horizontally centered as a single block. The block is the visual anchor of the screen; everything below it (identity strip and form) is left-aligned to the form gutter to keep input rhythm legible.

### AI mark (centered)

The AI mark is the same `signal-ai` icon used in the chat header, rendered at 32px in `colors.ai-icon` directly above the headline. It sits about `spacing.xxl` (24px) below the top of the panel body.

This is the same DOM element (paired by `view-transition-name`) that becomes the header AI mark once the chat starts; see "Transition into chat" for the morph behavior.

### Headline

In `typography.heading-xl`, `colors.text`, weight 600. Centered:

> Hire better

A short action-oriented promise. It frames the chat as a way to improve the visitor's hiring decisions, not just complete a sales intake.

### Subcopy

In `typography.body-md-open`, `colors.text-meta`. Centered, capped at `max-width: 320px` so the line breaks shape into a calm three-line block:

> Get personalized answers to your hiring questions with our AI-powered chat

The subcopy explicitly says "AI-powered chat" so the visitor knows what they are about to talk to. It centers the interaction around personalized answers to hiring questions, which keeps the welcome screen focused on the visitor's intent rather than the product lineup.

The tone follows PROJECT.md's "consultative, not salesy" rule. It does not re-sell the product (the marketing page above the panel already did that) and does not promise sales contact in the welcome itself. The mention of AI in the subcopy is intentional: it sets the expectation that this is a chat with an AI, not a hand-off to a human, before the visitor types the first message.

## Surface treatment (welcome state only)

While the onboarding screen is showing, the panel surface and header chrome shift to a "welcome" treatment:

- **Panel background.** A subtle vertical gradient from `colors.background` (white) at the top of the panel to `colors.surface-tint` at the bottom. The gradient covers the full panel height including the header zone, so the welcome content reads as one continuous, gently tinted card rather than a header strip on top of a white form.
- **Header chrome.** The header keeps its layout and controls (close, expand) but its background and bottom divider become transparent. The AI mark is removed from the header in this state because the centered welcome AI mark is the canonical mark for the moment.

`colors.surface-tint` is a new design token introduced specifically for this treatment. It is intentionally near-white so the gradient is felt but never dominant.

When the user submits the form, the panel returns to its default white surface and the header divider re-appears. Both transitions are folded into the welcome-to-chat handoff (see "Transition into chat" below).

## "Continue with LinkedIn" CTA (signed-out only)

`button-primary` at the medium size (48px height, fully pill via `rounded.round`). Full width inside the form gutter (384px). LinkedIn "in" mark on the left of the label, white on `colors.action` background.

Label: **Continue with LinkedIn**.

Followed by a horizontal "or" divider in `colors.text-meta` and `typography.supportive-s`. The divider is a thin rule with the word "or" centered, breaking the rule visually. This is the standard pattern users recognize from OAuth-style auth flows.

### Why this pattern

- The signed-out screen exists in a LinkedIn product. Encouraging sign-in supports future personalization, returning visitor recognition, and conversation history that the prototype does not yet implement.
- The marketing page above the panel may not have given the user a chance to sign in. Inside the panel is the first place the concierge experience itself can offer it.
- The conventional "Continue with X / or / form" stack lets users pick a path without privileging one as the only correct choice.

### Click behavior (simulated sign-in)

In the prototype, sign-in is fake. The simulated sequence is:

1. Click triggers the button's loading state. The LinkedIn icon is replaced with the standard loading spinner. The label remains "Continue with LinkedIn." All inputs become non-interactive, but their values stay visible.
2. After ~600ms, the screen runs the existing `motion.patterns.route-transition` (240ms, emphasized easing, 12px translateY, opacity 0 → 1). The signed-out body fades and shifts up while the signed-in body fades in from below. Header and panel chrome stay put.
3. Total perceived delay from click to fully rendered signed-in form: ~840ms.
4. After the transition, focus lands on Work email. In the common demo case it is already filled with a personal LinkedIn email and shows the work-domain warning.

### Merge rules between manual data and LinkedIn data

If the user typed any data manually before clicking the LinkedIn button, the merge follows this rule of thumb: **LinkedIn owns identity, the user owns work context.**

| Field | Source after sign-in |
| --- | --- |
| First name | Replaced with LinkedIn value |
| Last name | Replaced with LinkedIn value |
| Work email | Keep whatever the user typed; otherwise prefill the LinkedIn email and validate it |
| Company name | Keep whatever the user typed; otherwise auto-fill only if the resulting email is a valid work-domain email |

If the user clicks "Not Jamie?" after sign-in, the inverse logic applies: LinkedIn-sourced fields clear, user-sourced fields persist.

## Form fields

Four fields, all using the existing `TextInput` primitive ([src/components/primitives/text-input.tsx](../src/components/primitives/text-input.tsx)) at `size="large"` with `trailingIcon={null}` (the primitive's default `trailingIcon="placeholder"` would otherwise render an icon button on every field).

Field-to-field gap: `spacing.lg` (16px).

The `required` prop is **not** passed for visual purposes. With all four fields required, asterisks add noise without conveying useful information. Required-ness is enforced through validation logic, not visual markers.

### First name

- `label="First name"`
- Signed-in: value set to LinkedIn first name (freely editable).
- Signed-out: empty, focused on entry.
- No helper text.
- Validation: must be non-empty.

### Last name

- `label="Last name"`
- Signed-in: value set to LinkedIn last name (freely editable).
- Signed-out: empty.
- No helper text.
- Validation: must be non-empty.

### Work email

- `label="Work email"`
- `type="email"`
- Placeholder: `name@company.com`
- Signed-in: prefilled with the LinkedIn email even when it is a personal email. Focused after the welcome content and identity strip are rendered.
- Signed-out: empty.

Validation states:

| State | Visual | `errorText` |
| --- | --- | --- |
| Empty | Neutral default | None |
| Invalid email format | `error={true}` | `Enter a valid email address.` |
| Valid format on a personal-email domain | `error={true}` | `Use your work email so we can tailor this to your company.` |
| Valid format on a work domain | Neutral | None |

The "Start chat" button is disabled while the email field is in any error state. This means a prefilled Gmail, Yahoo, Outlook, iCloud, or other personal email can be visible in the field, but the user still has to replace it with a work-domain email before continuing.

#### Personal-email blocklist

Treated as personal emails. Listed explicitly so the set is a content decision, not a code decision:

- gmail.com
- yahoo.com (and yahoo.co.uk, yahoo.fr, yahoo.de, etc.)
- outlook.com
- hotmail.com
- icloud.com
- me.com
- mac.com
- aol.com
- proton.me
- protonmail.com
- live.com
- msn.com

A production system would defer to a published list. For the demo, the above is sufficient.

### Company name

- `label="Company name"`
- Empty until a valid work email is entered.
- Auto-fills from the work email's domain (e.g., `jamie@northstarhealth.com` produces `Northstar Health`).
- The auto-filled value is freely editable. If the user manually edits the field, manual input takes precedence.
- `helperText="Auto-filled from your email"` is shown only when the value was derived from the email domain. If the user manually edits the field, the helper text disappears.
- Auto-fill animation uses `motion.patterns.controls` (180ms, standard easing) for the value fade-in.
- Validation: must be non-empty.

For the prototype, the email-domain-to-company-name mapping can be a small lookup table or a simple title-cased transformation of the domain root. The exact mapping is a content decision.

## Primary action ("Start chat")

`button-primary` at the medium size. Full width inside the form gutter.

Label: **Start chat**.

Disabled until all four fields are valid:

- First name and Last name are non-empty.
- Work email is on a work domain.
- Company name is non-empty.

On click, the panel transitions from the welcome surface into the chat thread (see "Transition into chat" below for the AI-mark morph and surface handoff). The chat thread renders with the first turn ready (see "Post-onboarding first chat" below).

## State machine

Three internal states, two visual states.

| Internal state | Visual | Notes |
| --- | --- | --- |
| `signed-out` | Signed-out layout | "Continue with LinkedIn" button is shown |
| `signed-in` | Signed-in layout | Identity strip and "Not Jamie?" affordance are shown; name fields prefilled |
| `signed-in-but-dismissed` | Signed-out layout | User explicitly rejected LinkedIn identity; visually identical to plain signed-out |

Transitions inside the panel:

- `signed-out` → `signed-in`: user clicks "Continue with LinkedIn." Loading beat, then route transition.
- `signed-in` → `signed-in-but-dismissed`: user clicks "Not Jamie?".

Transitions out of the panel:

- Any state → chat thread: user submits a complete form via "Start chat."
- Any state → closed panel: user clicks the close button in the header.

The review-shell toggle controls a single boolean for demo purposes: `isSignedIn`. It flips between the two visual states. The `signed-in-but-dismissed` state is a runtime branch, not a demo preset.

## Mock demo data

For the signed-in demo state, the following persona is loaded as if from LinkedIn. It aligns with the primary persona in [PROJECT.md](../PROJECT.md#primary-persona).

- Avatar: a placeholder circular image (or the `Entity` ghost person fallback).
- First name: `Jamie`
- Last name: `Chen`
- LinkedIn email: `jamie.chen@gmail.com`

The LinkedIn email is intentionally a personal address, to demonstrate the form's reason for existing. After form submission, the lead record reflects whatever the user actually entered (e.g., work email `jamie@northstarhealth.com`, company `Northstar Health`).

## Transition into chat

The handoff from welcome to chat is a single coordinated transition, not a hard cut. Three things happen together:

1. **AI mark morph.** The centered 32px AI mark glides from its welcome position to the top-left of the header at 24px. This is implemented with the browser's [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API): the same `view-transition-name` is applied to both the welcome AI mark and the header AI mark, so the browser captures both rects and animates position, size, and opacity for us.
2. **Surface handoff.** The panel background gradient fades back to flat `colors.background` and the header's bottom divider fades back in.
3. **Body crossfade.** The welcome content (headline, subcopy, identity strip, form, CTA) fades and ships out while the chat thread and composer fade in.

All three are animated with `motion.duration.moderate` and `motion.easing.emphasized` so the morph is felt as one motion rather than three independent ones.

### Reduced motion

If the user has `prefers-reduced-motion: reduce` set, the View Transitions animation is overridden to 0ms so the swap is instant. The same final state is reached; only the morph is removed.

### Browser fallback

If the browser does not support `document.startViewTransition` (older Safari versions, etc.), the panel falls back to a plain React state update. The welcome content is replaced by the chat thread without the morph. The end state is identical to the animated path.

## Post-onboarding first chat

When the user clicks "Start chat" with a valid form, the panel transitions into the chat thread. The composer is shown and focused. The thread starts with a subtle AI thinking state, then the first assistant message enters with `motion.patterns.message-enter` and streams in short word-sized chunks.

**Bubble**

> Hi Jamie. Tell me about hiring at Northstar Health and I'll help you figure out the right fit.

The bubble uses the existing assistant-message styling. The response is prototype-faked; no model call is made for this first turn.

## Simulated AI response rhythm

The prototype fakes the conversation rhythm that users expect from AI chat surfaces:

1. User submits a message.
2. The user message appears immediately with the standard message-enter fade.
3. A temporary text-only "Thinking" state appears in the assistant position, with a light-blue `colors.ai-border` sweep across the label.
4. After a short delay, the thinking state is replaced by the assistant response.
5. The assistant response streams in word-sized chunks, with slightly longer pauses after punctuation.

Subsequent assistant responses are deterministic prototype copy. They are meant to demonstrate interaction pacing, not real model reasoning. When `prefers-reduced-motion: reduce` is enabled, the prototype skips the thinking delay and text stream, then renders the complete assistant response immediately.

The persona's first name comes from the form's First name field. The company name comes from the form's Company name field.

The message folds the greeting, the help promise, and the open-ended ask into a single beat. This keeps the post-form moment from feeling staged across two animated bubbles, and it gives the user a clear next action (start typing) without a multi-bubble preamble.

The composer placeholder stays generic (e.g., "Reply...") rather than echoing the question above. The user's first reply is open text, not a chip set, per the project's tone guide on diagnostic turns.

## Mobile and narrow viewports

The layout is already a single-column stack at 384px content width. On a phone, the panel goes full-screen and the same stack works without modification.

- No horizontal overflow.
- No fixed-position controls that could become unreachable.
- The composer being absent from the onboarding screen means no docked input fighting for space.
- The "Continue with LinkedIn" button, "or" divider, form fields, and "Start chat" button are all full-width within the form gutter, so they scale predictably to narrower viewports.

## Out of scope

The following are intentionally not handled in the prototype. They are listed here so the design intent is documented for future work.

- **Real LinkedIn auth.** The "Continue with LinkedIn" button simulates sign-in instead of triggering an OAuth flow.
- **Cancel-on-LinkedIn.** If a user cancels a real OAuth flow on LinkedIn's screen, they should return to the signed-out screen with their typed data preserved.
- **Malformed or partial LinkedIn payload.** The prototype assumes the demo persona is loaded cleanly. Production would treat missing fields as missing and behave like signed-out for those fields.
- **Returning visitor recognition.** A user who completed onboarding once should not have to do it again on return. The prototype does not implement persistence; every panel open is a fresh session.
- **Email typo correction.** Suggestions like "did you mean `northstarhealth.com`?" are out of scope.
- **Company auto-fill at scale.** The prototype uses a small lookup or simple transformation. A production system would need a real domain-to-company mapping or a typed-input plus autocomplete pattern.
