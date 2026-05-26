# LinkedIn Premium Company Pages

Product context brief for the Premium Company Pages concierge workstream. Shared workspace rules live in [PROJECT.md](../PROJECT.md), and shared visual/component rules live in [DESIGN.md](../DESIGN.md).

This brief captures user-provided project context for prototype work. Pricing, rollout, roadmap, and packaging details should be re-verified before being used in production-facing artifacts.

Related prototype artifacts:

- [User story](./premium-company-pages-user-story.md)
- [High-level flow](./premium-company-pages-high-level-flow.md)

## What This Is

**Premium Company Page** is a paid subscription for LinkedIn Pages that helps a business stand out and convert more LinkedIn members into clients by unlocking premium-only Page features.

Once a Page is subscribed, the premium features are usable by all Page admins.

This workstream is separate from:

- the LinkedIn Hiring / LTS concierge,
- the member-facing LinkedIn Premium survey concierge.

## Prototype Intent

The Premium Company Pages workstream is a visionary design prototype intended to help executives understand how an AI chat experience could work for Premium Company Pages.

The prototype should communicate the product opportunity and experience direction before the detailed flow, narrative, and design decisions are finalized.

The chosen prototype direction is the **full loop story**, with purchase intent as the recommended hero scenario:

1. A visitor arrives on a Premium Company Page with a specific intent.
2. The visitor-facing VCA understands the intent and guides the visitor toward the right next step.
3. The admin later sees the captured signal, outcome, and recommended follow-up in the Premium Company Page dashboard.
4. The admin-side agent turns that activity into insight, reporting, and next-best actions.

The executive narrative should show that the Page does not just look more credible. It starts to operate like an intelligent growth surface: the visitor gets help, the business captures intent, and the admin gets leverage.

## Audience

The target audience for the product is small to midsize businesses, typically fewer than 500 employees.

Primary users are:

- SMB owners,
- marketing generalists,
- Page admins and super admins managing a company presence on LinkedIn.

## Jobs To Be Done

The core job is to help businesses grow by acquiring customers and increasing revenue through their LinkedIn Page.

Sub-jobs include:

- create resonant content,
- reach the right audience,
- stand out from competitors,
- convert interest into inquiries.

For admins, the agentic job is to free them from manual, repetitive work so they can focus on higher-value creative and strategic decisions.

The recurring admin work includes:

- reporting,
- monitoring,
- community management,
- competitor tracking,
- visitor-intent review,
- employee amplification coordination.

## Key Features

Premium Company Pages may include:

- Page verification eligibility,
- gold LinkedIn `in` logo,
- dynamic cover images,
- auto-invite engaged members,
- invite followers of similar Pages,
- `Who's visited my Page`,
- custom CTA button,
- custom testimonial,
- credibility highlights,
- AI-powered post writing assistance.

## AI Experience Model

The Premium Company Pages vision has two connected AI layers:

- **Visitor-side VCA**: a customer-facing concierge on the Premium Company Page that helps visitors accomplish their goal.
- **Admin-side Page Agents**: agentic workflows inside the Premium Company Page dashboard that automate routine admin work and surface strategic recommendations.

The simplest way to explain the system:

> The VCA helps the visitor. The Page Agent helps the admin act on what happened.

## Full Loop Prototype Story

The prototype should prioritize a full-loop journey over a standalone chatbot demo.

Recommended story arc:

1. A visitor lands on a Premium Company Page.
2. The VCA identifies the visitor's likely intent.
3. The VCA guides the visitor to a relevant outcome, such as a lead form, scheduling path, support resource, or job application.
4. The admin dashboard shows what happened in plain language.
5. The admin-side agent explains why the visitor signal matters and recommends what to do next.

This story connects the product value across credibility, conversion, and admin productivity.

### Visitor-Side VCA Use Cases

The visitor-side VCA should understand intent and avoid dead ends.

Priority use cases:

| Persona | Intent | Desired VCA outcome | Priority |
|---|---|---|---|
| Page viewer | Evaluate a product with intent to buy | Understand the visitor's goal, answer questions, surface relevant messaging/resources, and route to a lead form or direct scheduling with a relevant employee. | P0 |
| Page viewer | Get product or service support | Attempt self-serve resolution, answer product or service questions, and surface relevant documentation or learn-more destinations. | P0 |
| Page viewer | Explore job opportunities | Identify career exploration intent, surface smart-matched open roles from the Page, and direct the visitor to the right application path. | P1 |

### Admin-Side Page Agent Use Cases

Admin-side agents should focus on high-frequency, pattern-based, lower-risk work where automation can create clear leverage.

Priority use cases:

| Admin job | Agent outcome | Priority |
|---|---|---|
| Page performance reporting | Analyze follower growth, post engagement, visitor demographics, content performance, and search discoverability; synthesize leadership-ready summaries. | P0 |
| Competitor and industry monitoring | Scan competitor Pages, flag meaningful shifts, identify gaps and opportunities, and deliver structured recommendations. | P0 |
| Visitor intelligence | Rank high-intent visitors, explain firmographic and behavioral signals, and show where visitor goals align with the company's objectives. | P0 |
| Employee amplification | Recommend shareable content, segment employees, generate tailored nudges, optimize timing, track participation, and feed performance back into future recommendations. | P1 |

### Agent Suitability

Not every task should be fully automated.

- **Strong agent candidates**: repetitive, data-heavy tasks with clear success criteria. These can be fully automated.
- **Assist-mode candidates**: AI drafts or recommends, and the admin approves. Human judgment stays in the loop.
- **Weak agent candidates**: subjective or high-stakes decisions that should remain with the admin.

For the executive prototype, the experience should make this judgment visible through the interaction model: automate the grind, but keep strategic judgment with the admin.

## Pricing And Availability

User-provided context:

- `$99.99/month` per Page,
- `$839.88/year`, reflecting a 30% discount,
- gradual rollout,
- subscription must be initiated by a Page super admin.

## Product Strategy

### Differentiation From LMS Ads

LinkedIn Marketing Solutions ads drive scalable reach.

Premium Company Page improves Page credibility and conversion after that reach exists. This creates a paid path for SMBs that are not ready for ads yet, while still orienting them toward measurable business outcomes.

### Upsell Bridge To Ads

Premium Company Pages can create contextual moments that nudge admins toward Boost and LinkedIn Marketing Solutions products in FY26.

Possible prompt surfaces include:

- onboarding,
- feature usage,
- analytics moments.

### Bundling To Grow Wallet Share

A desktop bundle with individual Premium SKUs may reduce friction and improve retention.

Potential bundle examples include:

- Premium Business,
- Premium Career,
- Sales Navigator Core.

User-provided test context includes a 20% discount variant. Independent cancellation should preserve clarity for admins and buyers.

### Roadmap Direction

The longer-term roadmap may expand toward an Enterprise tier in FY26 with usage-based limits and advanced functionality.

The SMB value proposition should remain distinct from LinkedIn Career Pages.

## Trust And Credibility

Streamlined verification for paying Pages can help signal authenticity and credibility.

Verification should still be subject to review and should not be treated as guaranteed.

## Current Prototype Status

The workstream currently has only a placeholder entry route:

`/premium-company-pages`

The initial prototype direction is now the full loop story. Do not add final AI chat behavior, monetization flows, admin workflows, analytics claims, or branded design tokens until the specific story arc, data assumptions, and screen sequence are defined.

## Guardrails

- Do not reuse Hiring personas, sales handoff logic, routing tiers, onboarding requirements, or conversation copy.
- Do not reuse member Premium survey steps, plan-selection logic, plan recommendations, or upsell behavior.
- Keep Premium Company Pages copy, routes, data, and assumptions in Premium Company Pages-owned modules.
- Reuse shared primitives, layout patterns, and design tokens where useful.
- Treat this as an executive storytelling prototype until the product flow is defined.

## UX Implications

- The experience likely needs to make the business value clear quickly: credibility, reach, conversion, and confidence.
- The AI chat should eventually feel useful to a Page admin or owner, not like a generic chatbot layered onto a Page product.
- The executive prototype may need to show both vision and practical believability: what the AI helps with, what data it uses, and what action it drives.
- Trust language matters because verification and credibility features can imply endorsement if handled carelessly.
- The strongest story is likely a before/after loop: visitor intent is captured, interpreted, and converted into admin action.
- The prototype should avoid showing too many agent use cases at once. One hero journey can carry the executive narrative, with secondary use cases hinted through dashboard modules or navigation.
- Visitor-facing and admin-facing AI need different tones. The visitor VCA should be helpful and friction-reducing; the admin agent should be analytical, concise, and action-oriented.

## System Implications

- Keep future Premium Company Pages routes and data separate from Hiring and member Premium.
- Avoid global product constants for pricing, packaging, feature lists, or roadmap claims.
- If shared chat components are reused, product-specific prompts, labels, feature names, and routing should be passed from Premium Company Pages-owned modules.
- Do not introduce commerce, entitlement, verification, analytics, or ads-integration logic unless the prototype scope explicitly calls for it.
- Keep visitor-side VCA data separate from admin-side Page Agent data, even if the prototype visually connects them.
- Model the full loop as scripted prototype data first: visitor intent, VCA action, captured signal, admin insight, and recommended next action.
- Treat competitor monitoring, visitor intelligence, employee amplification, and ads prompts as simulated outputs unless a later project decision explicitly requires real integrations.

## Open Questions

- Who is the executive audience for the prototype?
- Is purchase intent the right final hero scenario, or should support/jobs appear as alternates in the stakeholder artifact?
- What company should the prototype use as the example Page?
- What moment does the visitor VCA enter: immediately on Page load, after intent is detected, or after the visitor clicks a prompt?
- What moment does the admin-side agent enter: daily summary, dashboard module, alert, analytics page, or chat panel?
- What company/page context should the AI appear to know?
- What action should the AI drive: better posts, more invites, stronger credibility, CTA optimization, ads upsell, or subscription purchase?
- How visionary should the prototype feel versus how close it should stay to plausible in-product behavior?
