# Premium Company Pages VCA Prototype Spec

Product and design spec for **VCA (Virtual Chat Agent)**, a proposed AI-powered feature for LinkedIn Premium Company Pages.

Shared PCP context lives in [premium-company-pages.md](./premium-company-pages.md).

## What This Is

VCA is a proposed net-new feature inside Premium Company Pages. It adds an AI-assisted conversation layer to a Company Page for both:

- **Visitors** browsing the Page,
- **Admins** managing the Page.

VCA is not a generic chatbot. It is a LinkedIn-native intent layer that can use member identity, profile context, company data, and behavioral signals in ways an external website chat tool cannot.

## Core Insight

Most chat agents know nothing about who is talking to them.

LinkedIn's VCA can know useful context before the visitor types a single word: role, company size, industry, seniority, and likely fit for the Page admin's target customer.

This enables VCA to:

- pre-qualify visitors automatically,
- personalize the entry message,
- recommend the right next action based on intent,
- give the admin a context-rich signal instead of anonymous traffic.

## Prototype Thesis

PCP helps SMBs stand out and build credibility. VCA closes the gap between visitor interest and real action.

The prototype should prove:

- Cheri almost left the Page.
- VCA recognized that she matched Velora's ideal customer profile.
- VCA spoke to her specific situation.
- VCA answered her hardest evaluation question.
- VCA helped her send Ning a useful message.
- Ning received a warm, pre-qualified lead with enough context to reply quickly.

## Personas

### Admin: Ning Hu

Ning is the Founder and CEO of **Velora**, an invoicing and payments platform built for contractor teams and small agencies.

Company context:

- 25 employees,
- target customer is small agencies and contractor teams with 3-20 people,
- crowded competitive space including FreshBooks, QuickBooks, and Wave.

Ning is doing LinkedIn himself. He has no dedicated marketing coordinator. He checks the Page between customer calls and needs signal in seconds, not a dashboard that requires analysis.

Root JTBD:

> Build trust and credibility quickly with the right buyers, and convert Page interest into real conversations without spending hours doing it.

### Visitor: Cheri Sparks

Cheri is the Founder and Creative Director of a small creative production agency with roughly 8 people, mixing full-time teammates and rotating contractors.

Her reality:

- She runs creative and ops at the same time.
- Invoicing and contractor payment tracking happens late at night.
- Her old mix of Wave and spreadsheets worked when the company was smaller.
- With a rotating team, payments are late, contractors are frustrated, and clients are confused.

Cheri is skeptical but tired. She does not want a sales pitch. She wants to know in about 60 seconds whether Velora is actually built for her situation.

Root JTBD:

> Quickly evaluate whether Velora solves my specific contractor payment complexity without having to sit through a demo or talk to a salesperson.

## Two-Act Story

### Act 1: Visitor Experience

Cheri lands on Velora's LinkedIn Page from a post in her feed. She scans the Page, notices the premium credibility signals, and is about to leave.

A subtle inline nudge appears near the Page CTA:

> See how Velora helps agencies manage payments across contractor teams.

This is not a popup or a floating widget. It is a contextual on-page nudge. It speaks directly to Cheri because VCA has inferred that she matches Velora's target customer profile.

Cheri opens the existing Message tray in VCA mode and asks:

> If a client pays late, what happens to my contractor payments?

VCA gives a direct, specific answer in Velora's voice. It explains how Velora handles gaps between client payment timing and contractor payment obligations, including conditional payment schedules and less manual dependency tracking.

VCA then offers a contextual next step:

> Want to see how this would work for your team? I can send Ning a message on your behalf. I'll include the context from our conversation so he has everything he needs.

Cheri sees a pre-filled message drafted from the conversation:

> Hi Ning - I run a small creative agency with rotating contractors and I'm dealing with late client payments that cascade into late contractor payments. Sounds like Velora might solve this. Would love to learn more about how the conditional payment scheduling works.

She edits it lightly and sends.

The visitor outcome should feel fast, specific, and low-friction: no form fill, no calendar pressure, no cold sales pitch.

### Act 2: Admin Experience

Later that day, Ning receives a mobile notification:

> High-intent visitor: Cheri Sparks, Founder at an 8-person creative agency, asked about contractor payment timing. She sent you a message.

When Ning taps in, he sees:

- Cheri's LinkedIn profile context,
- a VCA context strip summarizing who she is, why she matches Velora's ICP, and what she asked about,
- the message Cheri chose to send,
- a suggested reply drafted by AI.

Ning can edit and send in roughly 45 seconds.

## Feature Architecture

### Principle: No New Surfaces

VCA does not introduce a third tray or a new UI pattern.

The architecture is:

> The nudge lives on the Page. The conversation happens inside the existing Message tray.

VCA is the on-ramp. The Message tray is the destination. On Premium Pages, the existing tray behaves differently by entering VCA mode.

### Visitor And Admin Consistency

Visitor and admin surfaces do not need to look visually identical. Each should match its context:

- visitor: public-facing Company Page and Message tray,
- admin: private notification, dashboard, and inbox surfaces.

The copy and signal should remain consistent across both sides, but the UI should not force visual parity.

### Privacy Stance

The admin should not receive a verbatim transcript of Cheri's private VCA conversation by default.

The safer prototype stance is:

- Cheri controls the message that is actually sent.
- Ning sees that sent message.
- Ning receives a concise VCA context strip summarizing fit, topic, and intent.
- The prototype avoids exposing the full visitor-side transcript to the admin.

This keeps the story useful while respecting privacy concerns around member conversations and identity signals.

## Visitor Entry Points

All entry points open the existing Message tray in VCA mode.

### Entry Point 1: Message Button

- The existing Message button in the Page CTA row gets a subtle sparkle signal.
- No new CTA button is added.
- Clicking Message opens the tray in VCA mode by default.
- Visitor can skip VCA and message directly from inside the tray.

### Entry Point 2: Inline Nudge

- Triggered by scroll depth, dwell time, or identity/ICP match.
- Appears inline below the CTA row.
- Dismissable for the session.
- Personalized based on LinkedIn profile context when available.

Example copy:

- Generic visitor: "Questions about what Velora offers?"
- ICP-matched visitor: "See how Velora helps agencies manage payments across contractor teams."

This is the hero LinkedIn-native moment.

### Entry Point 3: Direct Visitor Intent

- Visitor proactively clicks Message before any nudge appears.
- The sparkle remains a passive signal that VCA is active.
- The tray opens in VCA mode.

## Message Tray States

### State 1: Open / Greeting

- Same tray position and chrome as the existing Message tray.
- AI badge appears next to the company name in the tray header.
- VCA greets the visitor in the company's configured voice.
- A visible "Message directly" escape hatch lets visitors bypass VCA.

### State 2: Conversation

- Visitor asks questions.
- VCA responds using admin-configured knowledge: services, pricing, FAQs, differentiators.
- VCA monitors conversation depth, language signals, and ICP fit.
- Conversation should feel like messaging, not a chatbot form.

### State 3: Handoff

VCA chooses the most appropriate next step based on intent:

- Low intent: follow the Page or visit website.
- Medium intent: connect with Ning or follow the Page.
- High intent: send a pre-filled message to the Page.

For the hero story, Cheri is high intent. VCA drafts a message in the existing compose input with a label such as:

> Drafted from your conversation

The message lands in the existing Page inbox with attached context.

### State 4: Post-Send

- VCA confirms the message was sent.
- The tray returns to a natural resting state.
- The experience should not abruptly close.

## Action Spectrum

VCA should not always push toward the same outcome. It should make the next action feel earned.

| Visitor intent | Signal | VCA action |
|---|---|---|
| Low | One or two surface questions, no specifics | Follow the Page or visit website |
| Medium | Multiple questions, product specifics, comparison language | Connect with Ning or follow the Page |
| High | Deep specific questions, pain point articulation, fit language | Pre-filled message to the Page |

VCA decision inputs:

- conversation depth,
- specificity of questions,
- visitor role, company size, and ICP match,
- urgency, pain-point language, and comparison language.

Admin configuration sets a default preferred action. VCA may upgrade or downgrade from that default based on the conversation.

## Admin Surfaces

VCA enriches existing admin surfaces instead of introducing a new admin tool.

### Surface 1: Mobile Notification

Ning's first touchpoint is a notification that earns attention by surfacing identity and intent context.

Format:

- visitor name,
- role,
- company size,
- what they asked about,
- direct link to the message.

Primary actions:

- View message,
- Dismiss.

### Surface 2: Dashboard Card

A VCA insights card slots into the existing Page admin dashboard.

It should separate:

- individual leads: urgent and actionable,
- aggregated patterns: periodic and strategic.

Example insights:

- "Cheri Sparks asked about contractor payment timing and sent a message."
- "3 visitors asked about contractor payment timing this week. Draft a post on this topic."
- "Most common unanswered question: 'Do you integrate with QuickBooks?' Add it to your Page FAQ."

Every signal should include a suggested next action.

### Surface 3: Inbox Thread

VCA-initiated messages land in the existing Page inbox.

The thread includes:

- a VCA context strip with ICP match, company size, topic, and intent signal,
- Cheri's sent message as a normal inbox message,
- an AI-suggested reply pre-filled in the compose area.

Direct messages that bypass VCA should arrive as normal messages without enrichment.

## VCA Configuration

Configuration should feel like a lightweight setup wizard, not a dense settings panel.

Ning can configure:

- voice and tone,
- source knowledge such as services, pricing, FAQs, and differentiators,
- primary default action such as message, follow, or connect.

For the first prototype, configuration can be represented lightly and does not need to be fully interactive.

## LinkedIn-Native Differentiators

| Capability | What it enables |
|---|---|
| Member identity at visit time | VCA can understand role, company, seniority, and industry before the first message |
| ICP matching | VCA can adjust tone and nudge copy based on likely customer fit |
| Pre-qualified lead delivery | Admin gets a LinkedIn profile-backed signal without a form fill |
| Opt-in intent signals | Aggregated patterns can be shown subject to member opt-in and privacy constraints |
| Ecosystem continuity | VCA-initiated messages flow into LinkedIn's existing inbox |

## Prototype Scope

The prototype should tell the full two-act story:

1. Scenario framing with Ning, Cheri, and Velora.
2. Premium Company Page credibility state.
3. Visitor-side VCA dormant signal and personalized inline nudge.
4. Existing Message tray in VCA mode.
5. Handoff through a pre-filled message.
6. Admin notification.
7. Admin dashboard signal.
8. Inbox thread with context strip and suggested reply.
9. Lightweight VCA configuration representation.

Defer:

- exact nudge thresholds,
- real identity/analytics logic,
- real opt-in mechanics,
- real knowledge base ingestion,
- real inbox integration,
- real entitlement or billing,
- support use cases,
- monetization details beyond PCP inclusion.

## UX Notes

- The tone should feel grounded and shippable in the near term, not far-future.
- The inline nudge is the hero visitor moment.
- The Message tray should remain structurally familiar.
- The conversation should give a real answer, not deflect to sales.
- The handoff should use the existing compose input, not a modal or special card.
- The admin payoff should make Ning feel like he did not have to work for the signal.
- LinkedIn Blue should remain the primary interactive color. Premium gold can signal PCP status but should not take over the interface.

## Open Questions

- What exact member data can be used for nudge personalization and admin context?
- How should member opt-in visibility be represented?
- What is the safest wording for "I will include context from our conversation"?
- Where should the "Message directly" escape hatch live?
- How should VCA explain uncertainty or inability to answer?
- How should intent signals be weighted across identity, behavior, and conversation language?
- What should Cheri see after sending the message?
- How much dashboard aggregation should appear in the first prototype?
