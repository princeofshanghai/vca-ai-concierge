# Premium Company Pages VCA Prototype Spec

Product and design spec for **VCA (Virtual Chat Agent)**, a proposed AI-powered feature for LinkedIn Premium Company Pages.

Shared PCP context lives in [premium-company-pages.md](./premium-company-pages.md).

Detailed source docs:

- [Framing and personas](./premium-company-pages-vca/framing-personas.md)
- [Admin agent FAB](./premium-company-pages-vca/admin-agent-fab.md)
- [Admin demo stories](./premium-company-pages-vca/admin-demo-stories.md)
- [Visitor loop](./premium-company-pages-vca/visitor-loop.md)
- [Design decisions](./premium-company-pages-vca/design-decisions.md)
- [Admin AI response voice guide](./premium-company-pages-vca/ai-response-voice-guide.md)

## What This Is

VCA is a proposed net-new feature inside Premium Company Pages. It adds an AI-assisted conversation and intelligence layer to a Company Page for both:

- **Visitors** browsing the Page,
- **Admins** managing the Page.

VCA is not a generic website chatbot. It is a LinkedIn-native intent layer that can use professional context, Page activity, company data, and conversation signals in ways an external website chat tool cannot.

## Core Insight

The enterprise Page owner and the enterprise buyer are stuck on opposite sides of the same visibility gap.

> Rose cannot see who is there. Cheri will not identify herself.

Rose can see impressions, reactions, comments, follower growth, and website clicks, but she cannot easily tell whether the right people are paying attention or what questions they leave with unanswered.

Cheri can see polished vendor messaging, but she does not want to fill out a form before she knows whether Velora can handle her actual open enrollment complexity.

VCA resolves both sides:

- Cheri gets a low-friction way to self-qualify before entering a sales funnel.
- Rose gets pre-contextualized signal about who is engaging, what they care about, and what the Page should do next.

## Prototype Thesis

PCP helps the Page stand out. VCA explains who is paying attention, what they need, and what the Page owner should do next.

The prototype should prove:

- Cheri can get a specific answer without filling out a generic contact form.
- VCA can recognize that Cheri matches Velora's target enterprise audience.
- Cheri controls whether she identifies herself or sends a message.
- Rose can see that target buyers are engaging with the Page.
- Rose receives recommendations that turn analytics into action.
- The enterprise trust tension is visible: VCA is powerful, but admins need guardrails, approved topics, and brand-safe configuration before it goes live.

## Scenario Company

**Velora** is a benefits administration platform. It helps HR teams manage open enrollment, health plans, employee benefits, and carrier complexity in one place. It replaces spreadsheets, disconnected carrier portals, and brittle HRIS workarounds.

Prototype context:

- serves mid-size and large companies,
- target buyers are senior HR and benefits leaders,
- strongest story is enterprise open enrollment complexity,
- target PCP tier is Plus / Pro, skewing MM/ENT and Enterprise 10K+.

Detailed source: [Framing and personas](./premium-company-pages-vca/framing-personas.md).

## Personas

### Admin: Rose Reynolds

Rose is the Social Media & Communications Manager at **Velora**.

Role context:

- fully owns Velora's LinkedIn Page content, strategy, and performance,
- reports through brand and communications leadership,
- separate from demand generation, paid media, and sales development,
- not directly responsible for delivering leads to sales.

KPIs:

- follower growth,
- post engagement,
- reactions, comments, and reshares,
- social sentiment,
- website visits from LinkedIn.

Rose is putting real effort into the Page. She publishes content, tracks metrics, grows the following, and tries to make the Page feel credible. But when leadership asks what LinkedIn is actually doing for Velora, she has numbers without a clear story.

Root JTBD:

> Prove that Velora's organic LinkedIn presence is reaching the right enterprise audience, understand what that audience cares about, and know what to do next.

Rose's pain points:

- She can see impressions and engagement, but not whether the right people are paying attention.
- She does not know what target buyers wanted to understand but could not find on the Page.
- She manually pieces together fragmented analytics into leadership updates.
- Metrics tell her what happened, but not what to do.
- She needs recommendations that help her act without pretending she owns sales follow-up.

Detailed source: [Framing and personas](./premium-company-pages-vca/framing-personas.md#admin-persona-rose-reynolds).

### Visitor: Cheri Sparks

Cheri is the VP of HR at a 12,000-person retail company.

Her situation:

- She manages open enrollment across three carriers.
- Her team uses a mix of spreadsheets and an outdated HRIS.
- The process breaks every October.
- She is quietly evaluating modern benefits administration platforms before the next enrollment season.

Cheri is in research mode. She is a strong potential buyer, but she is not ready to enter a sales funnel.

Root JTBD:

> Quickly understand whether Velora can handle multi-carrier benefits complexity at enterprise scale before I spend political capital or invite a sales process.

Cheri's pain points:

- Generic vendor pages do not answer her specific questions.
- She wants to know whether Velora supports multi-carrier complexity at scale, not read broad marketing copy.
- Filling out a contact form feels like inviting a sequence of SDR calls before she is ready.
- She needs enough specifics to build an internal business case.
- She wants to self-qualify on her terms.

Detailed source: [Framing and personas](./premium-company-pages-vca/framing-personas.md#visitor-persona-cheri-sparks).

## Two-Act Story

Detailed visitor/admin handoff source: [Visitor loop](./premium-company-pages-vca/visitor-loop.md).

### Act 1: Visitor Experience

Cheri lands on Velora's LinkedIn Page from a post about open enrollment deadlines. She scans the Page, notices the premium credibility signals, and is evaluating whether Velora is credible enough to keep researching.

A subtle inline nudge appears near the Page CTA:

> See how Velora supports multi-carrier open enrollment at scale.

This is not a popup or a floating widget. It is a contextual Page nudge. It speaks directly to Cheri because VCA has inferred that she likely matches Velora's target audience: senior HR leadership at a large company.

Cheri opens the existing Message tray in VCA mode and asks a specific enterprise evaluation question, such as:

> What happens to our benefits enrollment if we switch platforms mid-year?

VCA gives a direct, specific answer in Velora's configured voice. It explains, within approved content boundaries, how Velora supports mid-year migration, multi-carrier setup, employee eligibility changes, seasonal workers, and enrollment status visibility.

VCA then offers a contextual next step without forcing a funnel:

> Want to connect with Velora's team? I can send them a message with the context from our conversation, so you will not have to explain this again.

Cheri can leave with the answer, save a summary, or choose to send a message. If she chooses to send, she sees a pre-filled draft:

> Hi - I'm VP of HR at a 12,000-person retail company, currently managing benefits across 3 carriers. I have questions about mid-year platform migration and how Velora handles seasonal workers with variable enrollment windows. Would love to connect.

She edits it lightly and sends.

The visitor outcome should feel fast, specific, and low-friction: no generic form, no calendar pressure, no cold sales pitch, and no loss of control.

### Act 2: Admin Experience

Later, Rose checks the Page admin experience. Instead of only seeing impressions, clicks, and engagement rates, she sees VCA intelligence layered onto Page activity.

The insight is not just "Cheri sent a message." The stronger admin payoff is:

- target-audience visitors are engaging with Velora's Page,
- senior HR leaders are asking about multi-carrier open enrollment,
- this question is not sufficiently answered on the Page,
- Rose has a recommended content or Page action.

Example VCA insights:

- "A VP of HR at a 10K+ retail company asked about multi-carrier open enrollment."
- "Most common visitor question this week: 'Do you support multi-carrier setups?' This is not answered clearly on your Page."
- "Your open enrollment deadline post drove 3 high-intent Page visits from HR leaders. Consider a follow-up post on multi-carrier readiness."
- "Follower growth slowed this week. Your last 2 posts had below-average engagement compared with benefits administration topics."

If Cheri sent a message, Rose can see the sent message and a concise context strip. If Cheri did not identify herself, Rose should still receive aggregated, privacy-safe pattern intelligence.

Rose's outcome should be:

> I can tell leadership LinkedIn is reaching the right audience, I know what that audience is trying to understand, and I have a recommended next action.

Detailed admin story source: [Admin demo stories](./premium-company-pages-vca/admin-demo-stories.md).

## Feature Architecture

Detailed architecture source: [Admin agent FAB](./premium-company-pages-vca/admin-agent-fab.md). Design positions live in [Design decisions](./premium-company-pages-vca/design-decisions.md).

### Principle: No New Visitor Surface

VCA does not introduce a third tray or a foreign chatbot pattern.

The architecture is:

> The nudge lives on the Page. The conversation happens inside the existing Message tray.

VCA is the on-ramp. The Message tray is the destination. On Premium Pages, the existing tray behaves differently by entering VCA mode.

### Visitor And Admin Consistency

Visitor and admin surfaces do not need to look visually identical. Each should match its context:

- visitor: public-facing Company Page and Message tray,
- admin: Page admin dashboard, analytics, recommendations, inbox, and setup/configuration.

The copy and signal should remain consistent across both sides, but the UI should not force visual parity.

### Privacy Stance

The admin should not receive a verbatim transcript of Cheri's private VCA conversation by default.

The safer prototype stance is:

- Cheri controls whether she sends a message or identifies herself.
- Rose sees a sent message only when Cheri chooses to send it.
- Rose can see aggregate or summarized VCA intelligence when privacy constraints allow it.
- Rose receives concise context such as audience fit, topic, unanswered question, and recommended action.
- The prototype avoids exposing full visitor-side transcripts to the admin.

This keeps the story useful while respecting privacy concerns around member conversations and identity signals.

Detailed decision: [Transcript and privacy stance](./premium-company-pages-vca/design-decisions.md#decision-transcript-and-privacy-stance).

### Enterprise Control Stance

Research context indicates that MM/ENT admins may be uncomfortable with unfettered AI generating messages on their brand's behalf. They may prefer controlled, structured conversation paths that feel closer to approved messaging or conversation ads than a fully open-ended agent.

This tension is intentional in the prototype. VCA should spark the discussion rather than hide it.

The admin setup/configuration flow should show how Rose can define:

- approved topics,
- off-limits topics,
- source knowledge,
- tone and voice,
- escalation or routing rules,
- what VCA can answer versus when it should suggest contacting Velora.

Detailed decision: [Open-ended AI vs controlled messaging](./premium-company-pages-vca/design-decisions.md#decision-open-ended-ai-vs-controlled-messaging).

## Visitor Entry Points

All entry points open the existing Message tray in VCA mode.

### Entry Point 1: Message Button

- The existing Message button in the Page CTA row gets a subtle AI signal.
- No new primary CTA button is added.
- Clicking Message opens the tray in VCA mode by default.
- Visitor can skip VCA and message directly from inside the tray.

### Entry Point 2: Inline Nudge

- Triggered by scroll depth, dwell time, or likely audience fit.
- Appears inline below the CTA row.
- Dismissable for the session.
- Personalized based on LinkedIn profile context when available and appropriate.

Example copy:

- Generic visitor: "Questions about what Velora offers?"
- HR leader: "See how Velora supports multi-carrier open enrollment at scale."
- Benefits operator: "Explore how Velora reduces benefits spreadsheet reconciliation."

This remains the hero LinkedIn-native moment.

### Entry Point 3: Direct Visitor Intent

- Visitor proactively clicks Message before any nudge appears.
- The AI signal remains a passive cue that VCA is active.
- The tray opens in VCA mode.

## Message Tray States

### State 1: Open / Greeting

- Same tray position and chrome as the existing Message tray.
- AI badge appears next to the company name in the tray header.
- VCA greets the visitor in the company's configured voice.
- A visible "Message directly" escape hatch lets visitors bypass VCA.

### State 2: Conversation

- Visitor asks questions.
- VCA responds using admin-configured knowledge such as services, proof points, FAQs, implementation details, and differentiators.
- VCA stays within approved topics and explains uncertainty when needed.
- VCA monitors conversation depth, language signals, and audience fit.
- Conversation should feel like messaging, not a chatbot form.

### State 3: Visitor-Controlled Next Step

VCA chooses the most appropriate next step based on intent and configured guardrails:

- Low intent: visit website, follow the Page, or read a relevant Page section.
- Medium intent: save a summary, view a case study, or explore a relevant FAQ.
- High intent: send a pre-filled message to the Page or configured owner.

For the hero story, Cheri is high fit and high specificity, but the next step should still feel optional. VCA can draft a message in the existing compose input with a label such as:

> Drafted from your conversation

The message lands in the existing Page inbox or configured routing destination with attached context.

### State 4: Post-Send Or Exit

- If Cheri sends a message, VCA confirms it was sent.
- If Cheri leaves without sending, VCA should still allow the session to end naturally.
- The tray returns to a natural resting state.
- The experience should not abruptly close.

## Action Spectrum

VCA should not always push toward the same outcome. It should make the next action feel earned.

| Visitor intent | Signal | VCA action |
|---|---|---|
| Low | Surface-level question, no clear fit | Follow the Page, visit website, or view a Page section |
| Medium | Specific question, some fit, no urgency | Offer a summary, FAQ, case study, or saved takeaway |
| High | Deep enterprise question, clear fit, evaluation language | Offer a pre-filled message or configured follow-up path |

VCA decision inputs:

- conversation depth,
- specificity of questions,
- visitor role, company size, industry, and audience fit,
- urgency and evaluation language,
- Page content gaps,
- admin-configured allowed actions.

Admin configuration sets the default preferred action. VCA may upgrade or downgrade from that default based on the conversation and guardrails.

## Admin Surfaces

VCA enriches existing admin surfaces instead of introducing a separate admin product.

Detailed demo source: [Admin demo stories](./premium-company-pages-vca/admin-demo-stories.md).

### Surface 1: Attention Digest

Rose's first admin touchpoint should earn attention by translating Page activity into a clear story.

The digest should separate:

- audience quality: who is engaging and whether they match Velora's target audience,
- unanswered questions: what visitors asked that the Page does not clearly answer,
- content recommendations: what Rose should post, update, or clarify next,
- optional direct messages: visitors who chose to identify themselves or reach out.

Example insight formats:

- "Your open enrollment deadline post drove 3 high-intent Page visits from HR leaders."
- "Most common visitor question: 'Do you support multi-carrier setups?' Add this to your Page or next post."
- "Benefits leaders from 10K+ companies are engaging, but your Page does not explain implementation timelines."

Every signal should include a suggested next action.

### Surface 2: Analytics Recommendation Layer

VCA does not replace Page analytics. It adds an interpretation and recommendation layer on top of them.

> Analytics tell Rose what happened. VCA tells Rose what to do.

VCA can synthesize across follower growth, post performance, visitor attributes, conversation topics, and competitor signals to recommend:

- a follow-up post,
- a Page FAQ update,
- a testimonial or proof point to feature,
- a topic to clarify,
- a leadership-ready summary of organic Page value.

### Surface 3: Inbox Thread

VCA-initiated messages land in the existing Page inbox or configured destination when a visitor chooses to send one.

The thread includes:

- Cheri's sent message as a normal inbox message,
- a VCA context strip with audience fit, company size, topic, and intent signal,
- optional suggested reply or routing guidance, depending on Rose's role and configuration.

Direct messages that bypass VCA should arrive as normal messages without enrichment.

### Surface 4: Setup And Guardrails

VCA configuration should feel like a lightweight setup flow, not a dense settings panel.

Rose can configure or review:

- voice and tone,
- approved topics,
- topics VCA should not answer,
- source knowledge such as services, FAQs, proof points, implementation details, and differentiators,
- default next action such as show FAQ, suggest message, visit website, or route to a configured owner,
- review and approval expectations before VCA goes live.

For the first prototype, configuration can be represented lightly, but it should be visible enough to pressure-test enterprise trust.

## LinkedIn-Native Differentiators

| Capability | What it enables |
|---|---|
| Member identity at visit time | VCA can understand role, company, seniority, industry, and likely audience fit before the first message |
| Audience fit signal | Rose can tell whether Velora is reaching target HR and benefits leaders, not just getting traffic |
| Conversation intelligence | VCA can reveal visitor questions, objections, and content gaps that standard Page metrics miss |
| Recommendation layer | Rose gets suggested content and Page actions instead of raw analytics alone |
| Visitor-controlled outreach | Cheri can get answers first and choose whether to identify herself or send a message |
| Ecosystem continuity | VCA-initiated messages and insights flow into existing LinkedIn Page admin and inbox contexts |

## Prototype Scope

The prototype should tell the full two-act story:

1. Scenario framing with Rose, Cheri, and Velora.
2. Premium Company Page credibility state for an enterprise benefits platform.
3. Visitor-side VCA dormant signal and personalized inline nudge.
4. Existing Message tray in VCA mode.
5. Cheri asks a mid-year benefits platform migration question.
6. VCA gives a specific, approved answer.
7. Cheri can leave, save a summary, or send a pre-filled message.
8. Rose sees audience-quality and unanswered-question intelligence.
9. Rose receives a recommended content, Page, or follow-up action.
10. Lightweight VCA configuration/guardrails representation.

Defer:

- exact nudge thresholds,
- real identity/analytics logic,
- real opt-in mechanics,
- real knowledge base ingestion,
- real inbox integration,
- real entitlement or billing,
- real enterprise approval workflow,
- exact legal/privacy language,
- full sales routing logic,
- monetization details beyond PCP inclusion.

## UX Notes

- The tone should feel grounded and shippable in the near term, not far-future.
- The inline nudge is the hero visitor moment.
- The Message tray should remain structurally familiar.
- The conversation should give a real answer, not deflect to sales.
- The handoff should be optional and visitor-controlled.
- The admin payoff should help Rose tell a leadership-ready story about organic LinkedIn value.
- Recommendations should feel operational, not magical: explain the signal and the suggested action.
- VCA should not make Rose feel responsible for a sales process she does not own.
- Enterprise trust requires visible guardrails around topics, tone, source knowledge, and escalation.
- LinkedIn Blue should remain the primary interactive color. Premium gold can signal PCP status but should not take over the interface.

## Open Questions

- What exact member data can be used for nudge personalization and admin context?
- How should member opt-in visibility be represented?
- What does Rose see when Cheri asks a question but does not send a message?
- What is the safest wording for "I can help draft a message with context"?
- Where should the "Message directly" escape hatch live?
- How structured should the VCA conversation be for enterprise admins to trust it?
- Which topics must be admin-approved before VCA can answer?
- How should recommendations distinguish between Page updates, content ideas, and sales follow-up?
- What should Cheri see after saving a summary or sending a message?
- How much dashboard aggregation should appear in the first prototype?
