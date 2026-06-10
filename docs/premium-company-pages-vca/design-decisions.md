# VCA Design Decisions

Source-of-truth design positions, tensions, and unresolved threads for the Premium Company Pages VCA executive demo.

Related docs:

- [Framing and personas](./framing-personas.md)
- [Admin agent FAB](./admin-agent-fab.md)
- [Visitor loop](./visitor-loop.md)
- [VCA prototype spec](../premium-company-pages-vca.md)

## Decision: Open-Ended AI Vs Controlled Messaging

Research context indicates that MM/ENT admins may be uncomfortable with unfettered AI generating messages on their brand's behalf.

They may prefer controlled, structured conversation paths that feel closer to approved messaging or conversation ads than a fully open-ended agent.

Design position:

- VCA remains intentionally agentic in the executive demo.
- The tension should be visible because it is leadership-review-worthy.
- The prototype should not pretend enterprise trust is already solved.
- The admin onboarding/configuration surface should later show approved topics, off-limits topics, source knowledge, tone, and escalation rules.

## Decision: Warm Handoff Vs Form Fill

The PRD buyer flow routes visitors through a structured form: full name, email, date/time for meeting scheduling, and goals summary.

This prototype deliberately diverges.

Design position:

- no form fill,
- no calendar booking,
- no SDR pipeline entry inside the visitor flow,
- Cheri reaches out through an editable, AI-drafted LinkedIn message.

Rationale:

- forcing a form at the moment of intent weakens the trust VCA just built,
- the warm handoff preserves Cheri's agency,
- a message she controls is more likely to be sent than a form that starts a sales process too early.

## Decision: Conversation-First FAB

The admin VCA open state leads with a greeting and directional prompts inside the conversation thread.

It should not open as a blank input box with generic capability chips below.

Design position:

- VCA should feel like an agent that has already been paying attention.
- A blank input-first pattern signals a general-purpose assistant.
- A conversation-first pattern supports the promise that VCA already has useful Page context.

## Decision: Transcript And Privacy Stance

Rose should not see the full visitor-side VCA transcript by default.

Design position:

- Cheri controls the message she sends.
- Rose sees Cheri's sent message.
- Rose sees a concise VCA context summary when privacy constraints allow it.
- The full transcript is not exposed by default.

This keeps the warm handoff useful while avoiding an overclaim about member privacy and conversation visibility.

## Open Thread: Admin Onboarding

Admin onboarding is not specified yet.

Future design work should use onboarding to pressure-test:

- approved VCA topics,
- off-limits topics,
- tone and voice,
- source knowledge,
- review/approval expectations,
- escalation and routing rules.

## Open Thread: Visual Identity

The VCA chat widget header direction is unresolved.

Future design work should clarify:

- whether the admin and visitor VCA agents share the same mark,
- how strongly the UI signals AI,
- how Premium gold is used without overpowering LinkedIn Blue,
- whether the visitor VCA should feel like Velora's assistant, LinkedIn's assistant, or a co-branded layer.

## Design Guardrails

- Keep the visitor experience low-friction.
- Keep the admin experience recommendation-led, not dashboard-heavy.
- Do not make Rose feel responsible for a sales process she does not own.
- Keep VCA LinkedIn-native by using professional context, existing Page surfaces, and existing inbox/message patterns.
