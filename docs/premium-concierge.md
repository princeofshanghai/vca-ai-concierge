# LinkedIn Premium Concierge

Lightweight product brief for the Premium concierge workstream. Shared workspace rules live in [PROJECT.md](../PROJECT.md), and shared visual/component rules live in [DESIGN.md](../DESIGN.md).

Conversation behavior principles for writing prototype transcripts live in [premium-conversation-system-prompt.md](./premium-conversation-system-prompt.md).

## What This Is

The Premium concierge is a separate prototype from the LinkedIn Hiring / LTS concierge.

The intended real-world entry point is the LinkedIn Premium survey flow that members reach after clicking `Try LinkedIn Premium` on linkedin.com:

`https://www.linkedin.com/premium/survey/`

## Current Status

Premium has an early fake survey path, based on the current Figma direction for the Premium survey entry point, plus a Premium-owned AI concierge prototype.

The current prototype surface is intentionally limited to:

- a `/premium` survey-style prototype with two static question steps,
- a static plan comparison step with no plan-selection behavior,
- static survey options with lightweight local selection behavior on the question steps,
- two live concierge review flows: **Low signal (live)** on `/premium` and **High signal (live)** on `/premium/live/high`,
- two static concierge review flows: **Low signal (static screen)** and **High signal (static screen)**,
- shared primitives and visual tokens from the repo design system.

## Guardrails

- Do not reuse Hiring personas, routing tiers, sales handoff logic, onboarding requirements, or conversation copy.
- Do not add checkout, sales handoff, RAG, account routing, or commerce behavior in this prototype pass.
- Reuse shared UI primitives and styling where useful, but keep Premium product assumptions in Premium-owned docs/routes/modules.
- Keep the concierge as a Premium advisor layer. It should help with plan confidence and decision support rather than becoming a second survey.

## Draft AI Concierge UX Plan

The Premium survey remains the structured decision path. The AI concierge appears as a persistent assistive layer that helps members resolve uncertainty, compare plans, understand the free trial, and gain confidence in a recommendation. Its behavior should become more proactive as the system gains stronger signal from member intent, whether that signal comes from survey answers, prior context, or the conversation itself.

### Survey vs. AI Concierge

The survey and AI concierge should not feel like two versions of the same intake flow.

- The survey is structured intake. It captures a small set of high-signal preferences in a fast, controlled way.
- The AI concierge is interpretation and confidence. It helps members understand what to pick, explains tradeoffs, answers questions, and turns messy intent into a clearer next step.

The concierge should not simply ask the same questions as the survey in chat form. Its value is strongest when it helps the member make sense of the survey, compare Premium options, and feel confident about a recommendation.

### Entry Pattern

The confirmed UI pattern is a floating action button in the bottom-right corner.

The AI concierge should appear throughout the Premium flow. In **Low signal (live)**, the core concierge posture stays broadly Premium-focused while prompt chips change by screen:

- Beginning survey screen: chips emphasize plan help, free trial, and Premium feature questions.
- Middle survey screens: chips emphasize mixed goals and career-versus-business comparison.
- Plan comparison page: chips emphasize trial terms, recommendation rationale, and Business-versus-Business Suite comparison.

The **High signal** review flows can open with a recommendation and product card because they represent a state where enough signal already exists.

### Cold Start Guidance

Avoid showing a hard plan recommendation immediately at the beginning of the survey. A cold recommendation can feel unsupported and may undermine the purpose of the survey.

The concierge should still avoid feeling blank or passive. Suggested posture by state:

- Before survey input: "I can help you pick the right Premium path."
- After early survey input: "I can help interpret your answers."
- On the plan comparison page: "Based on your responses, I can help explain the recommended plan."

This creates a progressive sense of intelligence: the concierge starts as a helper when signal is low, and becomes a recommendation advisor when signal is strong enough. The trigger is signal quality, not simply page location.

### Expected Concierge Jobs

The concierge should help with questions the structured survey cannot gracefully handle, such as:

- "Which option should I choose here?"
- "What is the difference between these Premium plans?"
- "I am job hunting but also trying to grow my network. What should I pick?"
- "Why are you recommending this plan?"
- "Is this worth it for me?"
- "What happens after the free trial?"

### Product Principle

The AI concierge should reduce uncertainty, not add another competing path.

For this prototype, the survey should remain the spine of the experience and the concierge should act as an assistive layer. A chat-first replacement for the survey may be explored later, but it introduces more complexity around pacing, reliability, input ambiguity, and recommendation trust.

## Signal-Based Conversation Flows

The Premium concierge prototype uses static, read-only conversation flows to show how the AI behaves with different levels of confidence. These are **signal levels**, not user value tiers and not Hiring-style lead qualification.

- **Low signal** - the AI opens at the start of the survey with little context.
- **High signal** - the AI opens on the plan comparison page with enough context to recommend a plan immediately.

The signal level changes how much context the AI starts with. Low signal should not block a recommendation forever; it means the concierge needs to earn the recommendation through conversation first.

The prototype exposes each signal level as both a live or static review surface where useful: live surfaces show animation, streaming, cards, and clickable prompt behavior; static screens are fixed transcripts for design review.

### Conversation Principle

The AI concierge should not teach the member how to fill out the survey. Avoid responses like "choose this option" or "click this answer." That makes the concierge feel subordinate to the survey UI.

Instead, the concierge should accomplish what the survey is intended to do in a more flexible, conversational way:

- understand the member's goal,
- clarify ambiguous intent,
- explain the relevant Premium options,
- recommend a plan when there is enough signal,
- explain why that plan is a better fit than the alternatives.

The survey remains visible in the prototype as the structured spine of the journey, but the AI conversation should demonstrate the future direction: natural-language intake, plan reasoning, and confidence-building.

### Working Transcript Persona

Use **Alex Kim** as the working transcript persona.

- Founder of a 10-person startup.
- Considering Premium to find customers, build visibility, and possibly hire later.
- Likely recommendation: **Business Suite**, because the current plan comparison page positions it around selling, marketing, and hiring in one tool.

Relevant Business Suite propositions from the prototype:

- Find new clients with daily prospect suggestions and exclusive client insights.
- Expand profile reach with monthly post boosts and 30 InMails per month.
- Get qualified applicants with monthly job promotions.

### Draft Flow Direction

**Low signal** starts broad. The AI knows only that Alex is considering Premium, so it should ask one high-value clarifying question, learn what Alex is trying to accomplish, then ask a focused hiring follow-up before recommending **Business Suite**. The flow should not frame itself around helping Alex answer the first survey question.

**High signal** starts on the plan comparison page. The AI can be more direct: use available LinkedIn context to explain why **Business Suite** looks relevant, immediately show the card, then provide escape-hatch prompts for included features, Business-versus-Business Suite comparison, and correcting the recommendation if it does not match Alex's intent. The live version should stream the rationale, animate the card, and keep the correction prompt interactive.

### Static Review Prototype Pattern

Implementation can follow the same general static-review pattern used by the Hiring prototype:

- A review-menu option jumps to a specific flow.
- The Premium page opens with the AI concierge already open.
- The transcript is read-only.
- The composer stays disabled.
- The two menu labels are **Low signal (static screen)** and **High signal (static screen)**.

Keep Premium transcript data, copy, and routing separate from Hiring-owned flow data.
