# LinkedIn Premium Company Pages

Product context brief for the Premium Company Pages workstream. Shared workspace rules live in [PROJECT.md](../PROJECT.md), and shared visual/component rules live in [DESIGN.md](../DESIGN.md).

This brief captures user-provided project context for prototype work. Pricing, rollout, roadmap, packaging, and privacy details should be re-verified before production-facing artifacts.

Related prototype artifacts:

- [VCA prototype spec](./premium-company-pages-vca.md)
- [VCA executive demo outline](./vca-executive-demo-outline.md)

## What This Is

LinkedIn Pages are free profiles for organizations to showcase their brand, posts, and updates.

**Premium Company Pages (PCP)** is a paid subscription layered on top of a LinkedIn Page. It helps the Page stand out, build credibility, understand who is engaging, and turn organic Page activity into clearer business context. Once a Page is subscribed, all admins on that Page get premium features.

PCP is distinct from LinkedIn Career Pages. Career Pages focus on employer branding and talent attraction. PCP focuses on business credibility, reach, audience intelligence, and organic Page performance for company Page admins.

This workstream is separate from:

- the LinkedIn Hiring / LTS concierge,
- the member-facing LinkedIn Premium survey concierge.

## Audience

For the current VCA prototype, the target PCP tier is **Plus / Pro** for mid-market and enterprise companies, skewing toward Enterprise 10K+.

Primary users are:

- social media and communications managers,
- brand and corporate communications teams,
- Page admins and super admins responsible for organic LinkedIn presence,
- marketing stakeholders who need to understand whether LinkedIn is reaching the right audience.

This prototype is not primarily a talent-team product, a sales-owned lead-routing product, or a paid media workflow. Talent attraction and employer branding belong to Career Pages. Pipeline ownership, paid demand generation, and ad optimization sit outside Rose's primary responsibility in this scenario.

## Jobs To Be Done

PCP helps companies use their LinkedIn Page to grow credibility, prove organic value, and understand what target audiences need from the Page.

Core jobs:

- Stand out versus competitors and build trust quickly.
- Grow reach, followers, and engagement with a clearer view of Page health.
- Help Page owners explain what LinkedIn is doing for the business beyond impressions.
- Show whether the right roles, industries, company sizes, and seniorities are paying attention.
- Surface unanswered visitor questions, objections, and content gaps.
- Recommend practical next actions for content, Page updates, and follow-up.

## Current Feature Set

Premium Company Pages may include:

- Page verification eligibility and badge,
- custom CTA button shown on the Page, in feed, and in search,
- `Who's visited my Page` visitor analytics, with visibility depending on member opt-in,
- auto-invite for content engagers,
- invite followers of similar Pages,
- custom testimonial,
- credibility highlights,
- dynamic cover images, including single-image or slideshow treatments,
- AI-powered post writing assistance,
- gold LinkedIn `in` logo signaling premium status.

## Pricing And Availability

User-provided context:

- `$99.99/month` per Page,
- `$839.88/year`, reflecting a 30% discount,
- controlled eligibility ramping,
- subscription applies at the Page level.

Current VCA prototype context:

- target PCP tier is Plus / Pro,
- audience skews mid-market and enterprise,
- the example company serves enterprise buyers.

Bundle tests may pair PCP with individual Premium SKUs such as Premium Business, Premium Career, or Sales Navigator. These bundles may use separate contracts and invoices, with independent cancellation.

## Ecosystem Fit

PCP is complementary to LinkedIn Marketing Solutions Ads and Boost.

Ads and Boost help drive paid reach. PCP increases the credibility, visibility, and interpretability of the Page once visitors arrive. For enterprise Page owners, PCP should help organic teams explain the quality of attention they are earning and identify where content or Page information should improve.

PCP is also distinct from Career Pages:

- PCP audience: brand, communications, social, and Page admin teams.
- PCP objective: credibility, organic audience intelligence, Page performance, visitor intent.
- Career Pages audience: talent and employer-branding teams.
- Career Pages objective: employer branding and talent attraction.

## VCA Relationship

VCA is a proposed net-new feature within PCP. It should be treated as additive to the current PCP feature set.

The simplest framing:

> PCP helps the Page stand out. VCA explains who is paying attention, what they need, and what the Page owner should do next.

PCP gets visitors to pause and trust the Page. VCA converts that attention into a useful conversation for the visitor and an intelligence signal for the admin: who engaged, what they asked, whether they match the target audience, and what action would improve the Page or content strategy.

## Prototype Direction

The current prototype direction is the VCA full-loop story documented in [premium-company-pages-vca.md](./premium-company-pages-vca.md).

The prototype should show:

1. A visitor lands on a Premium Company Page.
2. VCA uses LinkedIn-native context to personalize a subtle entry point.
3. The visitor gets a useful answer without a generic lead form or cold sales pitch.
4. VCA lets the visitor decide whether to identify herself or reach out.
5. The admin receives a defensible audience-intelligence signal with suggested Page, content, or follow-up actions.

## Guardrails

- Do not reuse Hiring personas, sales handoff logic, routing tiers, onboarding requirements, or conversation copy.
- Do not reuse member Premium survey steps, plan-selection logic, plan recommendations, or upsell behavior.
- Keep Premium Company Pages copy, routes, data, and assumptions in Premium Company Pages-owned modules.
- Reuse shared primitives, layout patterns, and design tokens where useful.
- Do not add a UI component library or state management library for this workstream unless explicitly requested.
- Treat VCA as a visionary executive prototype until product, privacy, and implementation details are finalized.

## UX Implications

- Visitor-side clarity matters: prominent CTA, credibility modules, dynamic covers, and premium trust cues should reduce the "scan-and-leave" problem before VCA appears.
- VCA should feel LinkedIn-native and useful, not like a generic chatbot layered onto a Page.
- The strongest VCA story is not a new chat surface. It is a subtle on-ramp into the existing LinkedIn Message tray.
- Admin workflows should stay lightweight: Page health, audience fit, visitor questions, content gaps, and actionable follow-ups.
- Admin insights should explain who visited, what they cared about, whether they are the right audience, and what the admin should do next.
- VCA should help Rose tell a better internal story about organic LinkedIn value without turning her into a sales development rep.
- Trust language matters because verification, visitor identity, and intent signals can imply more certainty than the system should claim.

## System Implications

- Keep future Premium Company Pages routes and data separate from Hiring and member Premium.
- Avoid global product constants for pricing, packaging, feature lists, or roadmap claims.
- If shared chat components are reused, product-specific prompts, labels, feature names, and routing should be passed from Premium Company Pages-owned modules.
- Do not introduce real commerce, entitlement, verification, analytics, scheduling, ads-integration, or privacy-sensitive identity logic unless prototype scope explicitly calls for it.
- Model VCA as scripted prototype data first: visitor identity, ICP match, conversation state, unanswered questions, audience patterns, suggested action, admin context strip, and optional suggested reply.
- Visitor analytics and identity visibility must respect member opt-in and LinkedIn privacy constraints.

## Open Questions

- What visitor identity fields can VCA use in a prototype while staying defensible within LinkedIn's privacy model?
- How should the prototype explain member opt-in limits without derailing the executive story?
- What Page and admin data should be simulated versus hidden?
- Which entry point should be the hero moment: Message button sparkle, inline nudge, or proactive visitor click?
- How much of VCA setup should be shown before the prototype becomes too operational?
- How should VCA balance open-ended AI with enterprise admins' need for controlled topics, approved messaging, and brand-safe guardrails?
- How should Ads/Boost be hinted as an ecosystem path without making VCA feel like a paid media upsell machine?
