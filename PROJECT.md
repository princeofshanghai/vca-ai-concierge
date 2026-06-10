# Project

Shared product context for the AI Concierge prototype workspace.

This repo now supports multiple concierge workstreams that share the same design language and component foundation, but keep their user journeys, content, routing, and product assumptions separate.

## What This Is

**AI Concierge** is a shared prototype workspace for exploring concierge-style AI entry points across LinkedIn surfaces.

The shared layer includes:

- reusable UI primitives and chat shell patterns,
- the visual system documented in [DESIGN.md](DESIGN.md),
- review tooling for prototype surfaces,
- implementation conventions for the Next.js app.

The product-specific layer lives in dedicated briefs:

- [LinkedIn Hiring / LTS concierge](docs/hiring-concierge.md)
- [LinkedIn Premium concierge](docs/premium-concierge.md)
- [Premium Company Pages](docs/premium-company-pages.md)
- [Premium Company Pages VCA](docs/premium-company-pages-vca.md)

## Workstreams

### LTS Hiring Concierge

The current built prototype is the LinkedIn Hiring solutions concierge. It starts from a fake Hiring marketing page and replaces the `Contact sales` moment with a guide-first AI conversation.

Default entry route: `/hiring/entry-lix-test`

All-intents route: `/hiring`

Internal review flows currently remain under `/internal/flows/*` and are contextual to Hiring only.

### Premium Concierge

The Premium workstream is an early static prototype. Its intended entry point is the LinkedIn Premium survey flow visitors reach after clicking `Try LinkedIn Premium` on linkedin.com.

Entry route: `/premium`

For now, Premium has a fake survey path with static question steps and a static plan comparison page. Do not add concierge conversation logic, plan-selection logic, or product recommendations until the Premium brief and flow decisions are defined.

### Premium Company Pages

Premium Company Pages is a visionary design prototype for communicating to executives how a LinkedIn-native Virtual Chat Agent could turn Page visitor interest into audience intelligence, recommended admin action, and optional visitor-initiated outreach.

Entry route: `/premium-company-pages`

The current source of truth is the PCP product overview plus the VCA prototype spec. Prototype behavior should remain scripted and workstream-owned: no real entitlement, analytics, identity, inbox, monetization, scheduling, or ads integration logic unless explicitly scoped.

## Separation Rule

Product-specific assumptions must not leak across workstreams.

- Hiring copy, personas, routing tiers, sales handoff logic, onboarding requirements, and conversation flows belong only to the Hiring workstream.
- Premium survey steps, member motivations, plan logic, recommendations, and upsell content belong only to the Premium workstream.
- Premium Company Pages executive narrative, company-page admin workflows, AI chat behavior, value claims, monetization assumptions, and page-growth scenarios belong only to the Premium Company Pages workstream.
- Shared primitives and layout patterns may be reused, but product-specific data and copy should be passed in through product-owned routes or modules.
- The root route `/` is a neutral project chooser, not a product experience.

## Current Guardrails

- Keep the stack minimal.
- Do not add a UI component library or state management library unless explicitly requested.
- Do not add new product-specific flows or branded design tokens until the relevant product brief and design direction are defined.
- Use a default web system font stack unless [DESIGN.md](DESIGN.md) says otherwise.
- Preserve the `src/app` App Router structure and `@/*` path alias to `src/*`.

## UX Implications

- The chooser should feel like a simple prototype switchboard.
- Each workstream should have contextual navigation only for that workstream.
- Shared UI consistency should come from the component system and tokens, not from mixing product content.
- Placeholder workstreams should be visibly incomplete without implying working concierge behavior.

## System Implications

- Prefer product-owned route segments and data modules over global product constants.
- Keep shared components generic; avoid embedding Hiring or Premium assumptions in reusable primitives.
- If a shared component needs product-specific labels or links, pass them as props from the route/workstream.
- When framework behavior is uncertain, verify against current Next.js documentation before making changes.
