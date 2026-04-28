# LinkedIn Premium Concierge

Lightweight product brief for the Premium concierge workstream. Shared workspace rules live in [PROJECT.md](../PROJECT.md), and shared visual/component rules live in [DESIGN.md](../DESIGN.md).

Conversation behavior principles for writing prototype transcripts live in [premium-conversation-system-prompt.md](./premium-conversation-system-prompt.md).

## What This Is

The Premium concierge is a separate prototype from the LinkedIn Hiring / LTS concierge.

The intended real-world entry point is the LinkedIn Premium survey flow that members reach after clicking `Try LinkedIn Premium` on linkedin.com:

`https://www.linkedin.com/premium/survey/`

## Current Status

Premium has an early fake survey path, based on the current Figma direction for the Premium survey entry point.

The current prototype surface is intentionally limited to:

- a `/premium` survey-style prototype with two static question steps,
- a static plan comparison step with no plan-selection behavior,
- static survey options with lightweight local selection behavior on the question steps,
- shared primitives and visual tokens from the repo design system.

## Guardrails

- Do not reuse Hiring personas, routing tiers, sales handoff logic, onboarding requirements, or conversation copy.
- Do not invent additional Premium survey questions, recommendations, plan logic, or concierge conversation behavior yet.
- Reuse shared UI primitives and styling where useful, but keep Premium product assumptions in Premium-owned docs/routes/modules.
- Treat the concierge entry point as future work until the Premium flow is defined.

## Draft AI Concierge UX Plan

The Premium survey remains the structured decision path. The AI concierge appears as a persistent assistive layer that helps members interpret questions, resolve uncertainty, and understand the recommended plan. Its behavior should become more proactive as the system gains more signal from the member's survey responses.

### Survey vs. AI Concierge

The survey and AI concierge should not feel like two versions of the same intake flow.

- The survey is structured intake. It captures a small set of high-signal preferences in a fast, controlled way.
- The AI concierge is interpretation and confidence. It helps members understand what to pick, explains tradeoffs, answers questions, and turns messy intent into a clearer next step.

The concierge should not simply ask the same questions as the survey in chat form. Its value is strongest when it helps the member make sense of the survey, compare Premium options, and feel confident about a recommendation.

### Entry Pattern

The confirmed UI pattern is a floating action button in the bottom-right corner.

The AI concierge should appear throughout the Premium flow, but its posture should change by screen:

- Beginning survey screen: quiet and supportive. The concierge is available for help, but should not immediately recommend a plan before the member has provided meaningful input.
- Middle survey screens: more contextual. The concierge can use prior answers to help the member choose between options or clarify what an answer means.
- Plan comparison page: proactive and recommendation-oriented. By this point, the system has enough context to explain the recommended plan, compare alternatives, and answer purchase or trial questions.

### Cold Start Guidance

Avoid showing a hard plan recommendation immediately at the beginning of the survey. A cold recommendation can feel unsupported and may undermine the purpose of the survey.

The concierge should still avoid feeling blank or passive. Suggested posture by state:

- Before survey input: "I can help you pick the right Premium path."
- After early survey input: "I can help interpret your answers."
- On the plan comparison page: "Based on your responses, I can help explain the recommended plan."

This creates a progressive sense of intelligence: the concierge starts as a helper, becomes contextual as answers accumulate, and becomes a recommendation advisor once the member reaches the plan comparison page.

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

The next Premium concierge prototype should use static, read-only conversation flows to show how the AI behaves at different points in the Premium journey. These are **signal levels**, not user value tiers and not Hiring-style lead qualification.

- **Low signal** - the AI opens at the start of the survey with little context.
- **Medium signal** - the AI opens in the middle of the survey with some inferred or member-provided context.
- **High signal** - the AI opens on the plan comparison page with enough context to recommend a plan and explain tradeoffs.

The signal level changes how much context the AI starts with. It should not limit whether the member can reach a recommendation. In all three flows, the member can keep talking and the concierge can still arrive at a relevant Premium plan recommendation if the conversation provides enough signal.

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

**Low signal** starts broad. The AI knows only that Alex is considering Premium, so it should ask one high-value clarifying question, learn what Alex is trying to accomplish, and then move toward a recommendation if Alex provides enough context. The flow should not frame itself around helping Alex answer the first survey question.

**Medium signal** starts with partial context. The AI can assume Alex has already indicated a work or business-oriented need, then narrow the distinction between **Business** and **Business Suite**. It should use one clarifying turn to understand whether Alex mainly needs networking/research or a broader founder toolkit for customers, visibility, and hiring.

**High signal** starts on the plan comparison page. The AI can be more direct: recommend **Business Suite**, explain why Alex's founder context points beyond **Career** or **Business**, and compare the three plans using the current plan propositions.

### Static Review Prototype Pattern

Implementation can follow the same general static-review pattern used by the Hiring prototype:

- A review-menu option jumps to a specific flow.
- The Premium page opens with the AI concierge already open.
- The transcript is read-only.
- The composer stays disabled.
- The three menu labels are **Low signal**, **Medium signal**, and **High signal**.

Keep Premium transcript data, copy, and routing separate from Hiring-owned flow data.
