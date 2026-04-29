# Premium Concierge Approach

This note summarizes how to interpret the three PM-proposed Premium Concierge candidates from [premium-concierge-externalprd.md](./premium-concierge-externalprd.md) against the current prototype direction in [premium-concierge.md](./premium-concierge.md).

## Core Takeaway

The three candidates are not mutually exclusive. They can work together as one progressive experience.

The important constraint is that they should not all appear with equal weight at the same moment. If the bubble pushes a free trial, the chat opens with SKU cards, and the assistant immediately sells again, the experience risks feeling like a sales banner inside a chat surface.

The better direction is to treat the candidates as layers:

- **Candidate 3: Proactive Bubble Messaging** is the entry layer.
- **Candidate 2: Consultative Q&A + Guided Conversion** is the trust layer.
- **Candidate 1: Proactive SKU Recommendations** is the recommendation layer.

## Recommended Experience Model

The Premium concierge should move from light assistance to confident recommendation as signal increases.

1. The bubble uses a contextual hook to invite engagement.
2. The welcome message offers useful paths: pick a plan, compare plans, or understand the free trial.
3. Prompt chips make common questions easy to ask, with a free-trial chip available in every flow.
4. If the user asks about the free trial before there is enough signal, the assistant explains the trial but does not force a SKU card.
5. If the user has provided enough context, the assistant recommends a specific plan and can show the in-chat SKU card.
6. On the plan comparison page, the concierge can become more proactive because the system has enough context to explain and reinforce the recommendation.

## Key Pushback

Candidate 1 is risky if it becomes the first thing users see with little or no context.

A hard SKU recommendation at cold start can make the survey feel ornamental and the AI feel less intelligent. It may increase short-term visibility of trial CTAs, but it can weaken trust if the recommendation appears unsupported.

The stronger pattern is:

- **Low signal:** answer questions, clarify intent, and offer prompt chips.
- **High signal:** lead with a concise rationale, show the product card, and provide escape-hatch prompt chips.

## UX Implications

- The concierge should reduce uncertainty, not create another competing purchase path.
- The free trial should be visible, but not dominate every state.
- Prompt chips should reflect realistic user questions, such as plan comparison, mixed goals, recommendation rationale, and free-trial terms.
- The assistant should earn the right to recommend by connecting the plan to the user's goals.
- The survey remains the structured spine, but the concierge is not fundamentally a survey sidecar. In live mode, page context changes prompt chips more than the assistant's core posture.

## System Implications

- The experience needs a simple signal model, not a full sales-routing model.
- Prompt chips and scripted responses should remain Premium-owned, separate from Hiring concierge logic.
- Trial behavior should be contextual:
  - low signal: explain the trial and guide toward plan fit,
  - high signal: connect the trial to the recommended plan after the recommendation is shown.
- In-chat SKU cards should appear when there is enough signal to support a recommendation.
- Human sales handoff, RAG support, checkout links, and commerce flows should remain later-stage explorations, not required for this prototype pass.

## Working Position

The PM candidates are useful ingredients. The current signal-based Premium concierge direction is what makes them coherent.

The prototype should combine the candidates as a progressive system:

**entry hook -> helpful Q&A -> contextual recommendation -> escape hatches -> trial CTA**
