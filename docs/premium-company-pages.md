# LinkedIn Premium Company Pages

Product context brief for the Premium Company Pages workstream. Shared workspace rules live in [PROJECT.md](../PROJECT.md), and shared visual/component rules live in [DESIGN.md](../DESIGN.md).

This brief captures user-provided project context for prototype work. Pricing, rollout, roadmap, packaging, and privacy details should be re-verified before production-facing artifacts.

Related prototype artifact:

- [VCA prototype spec](./premium-company-pages-vca.md)

## What This Is

LinkedIn Pages are free profiles for organizations to showcase their brand, posts, and updates.

**Premium Company Pages (PCP)** is a paid subscription layered on top of a LinkedIn Page. It helps the Page stand out and convert visitor interest into business outcomes. Once a Page is subscribed, all admins on that Page get premium features.

PCP is distinct from LinkedIn Career Pages. Career Pages focus on employer branding and talent attraction. PCP focuses on business credibility, reach, conversion, and intent signals for company Page admins.

This workstream is separate from:

- the LinkedIn Hiring / LTS concierge,
- the member-facing LinkedIn Premium survey concierge.

## Audience

The target audience is SMB owners and marketing or generalist admins at companies with fewer than roughly 500 employees.

Primary users are:

- SMB founders and owners,
- marketing generalists,
- Page admins and super admins managing a company presence on LinkedIn.

This is not primarily a talent-team product. Talent attraction and employer branding belong to Career Pages.

## Jobs To Be Done

PCP helps businesses use their LinkedIn Page to grow customer trust, reach, and conversion.

Core jobs:

- Stand out versus competitors and build trust quickly.
- Grow reach and followers with lightweight tools when ads budgets are limited.
- Convert Page visitors into inquiries or actions.
- Surface usable visitor intent signals for admins.

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

Bundle tests may pair PCP with individual Premium SKUs such as Premium Business, Premium Career, or Sales Navigator. These bundles may use separate contracts and invoices, with independent cancellation.

## Ecosystem Fit

PCP is complementary to LinkedIn Marketing Solutions Ads and Boost.

Ads and Boost help drive reach. PCP increases the credibility and conversion potential of the Page once visitors arrive. This creates a paid growth path for SMBs that may not yet have large ads budgets while still orienting them toward measurable business outcomes.

PCP is also distinct from Career Pages:

- PCP audience: SMB owners, marketers, Page admins.
- PCP objective: credibility, customer conversion, visitor intent.
- Career Pages audience: talent and employer-branding teams.
- Career Pages objective: employer branding and talent attraction.

## VCA Relationship

VCA is a proposed net-new feature within PCP. It should be treated as additive to the current PCP feature set.

The simplest framing:

> PCP helps SMBs stand out and build credibility. VCA closes the gap between visitor interest and real action.

PCP gets visitors to pause and trust the Page. VCA converts that attention into a useful conversation, a context-rich next step for the visitor, and a qualified signal for the admin.

## Prototype Direction

The current prototype direction is the VCA full-loop story documented in [premium-company-pages-vca.md](./premium-company-pages-vca.md).

The prototype should show:

1. A visitor lands on a Premium Company Page.
2. VCA uses LinkedIn-native context to personalize a subtle entry point.
3. The visitor gets a useful answer without a generic lead form or cold sales pitch.
4. VCA helps the visitor send a pre-filled message to the Page/admin.
5. The admin receives the message with defensible context, intent signal, and a suggested reply.

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
- Admin workflows should stay lightweight: CTA/testimonial/credibility setup, auto-invite toggles, AI post drafts, visitor analytics, and actionable follow-ups.
- Admin insights should explain who visited, what they cared about, and what the admin should do next.
- Trust language matters because verification, visitor identity, and intent signals can imply more certainty than the system should claim.

## System Implications

- Keep future Premium Company Pages routes and data separate from Hiring and member Premium.
- Avoid global product constants for pricing, packaging, feature lists, or roadmap claims.
- If shared chat components are reused, product-specific prompts, labels, feature names, and routing should be passed from Premium Company Pages-owned modules.
- Do not introduce real commerce, entitlement, verification, analytics, scheduling, ads-integration, or privacy-sensitive identity logic unless prototype scope explicitly calls for it.
- Model VCA as scripted prototype data first: visitor identity, ICP match, conversation state, suggested action, admin context strip, and suggested reply.
- Visitor analytics and identity visibility must respect member opt-in and LinkedIn privacy constraints.

## Open Questions

- What visitor identity fields can VCA use in a prototype while staying defensible within LinkedIn's privacy model?
- How should the prototype explain member opt-in limits without derailing the executive story?
- What Page and admin data should be simulated versus hidden?
- Which entry point should be the hero moment: Message button sparkle, inline nudge, or proactive visitor click?
- How much of VCA setup should be shown before the prototype becomes too operational?
- How should Ads/Boost be hinted as an ecosystem path without making VCA feel like an upsell machine?
