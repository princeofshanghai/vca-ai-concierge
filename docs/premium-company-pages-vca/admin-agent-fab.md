# Admin Agent FAB

Source-of-truth behavior for the admin-facing VCA floating action button in the Premium Company Pages executive demo.

Related docs:

- [Framing and personas](./framing-personas.md)
- [Admin demo stories](./admin-demo-stories.md)
- [Design decisions](./design-decisions.md)
- [Executive demo outline](../vca-executive-demo-outline.md)

## Purpose

The admin VCA agent should feel like it has already been watching Page performance and can surface what matters without Rose digging through dashboards.

It is accessible from a persistent FAB in the bottom right of every admin page.

## States

### Resting

- Button only.
- Always present on admin pages.
- No prompts visible.
- Used when VCA has nothing urgent or unusual to flag.

### Peeking

- A single anomaly-based prompt appears above the FAB.
- Only appears when VCA detects something worth flagging from existing PCP data.
- The presence of the prompt is the signal.
- If multiple anomalies exist, the biggest meaningful delta wins.

Example:

> Follower growth dropped this month - find out why.

### Open

- Opens the full VCA chat panel.
- Uses a conversation-first pattern instead of a blank input-first pattern.
- Cold-start copy:

> Welcome back, Rose. Here's what's worth your attention.

- Shows two to three directional prompts inside the conversation.
- Directional prompts cover the three main data domains: performance, competitive, and visitors.

## Prompt Logic

### Outside The FAB: Push

The peek prompt is pushed by VCA.

Rules:

- anomaly-based,
- one prompt only,
- visible without opening the panel,
- triggered by meaningful data change,
- absent when there is nothing worth flagging.

### Inside The FAB: Pull

Open-state prompts let Rose choose where to go.

Prompt domains:

- Page performance,
- competitive comparison,
- visitor and audience intelligence.

## Entry Points

### Cold Start

Rose opens the FAB with no prior context.

Behavior:

- panel opens with greeting,
- shows two to three directional prompts,
- Rose selects a prompt such as "How is my page performing this month?"

### Peek Tap

Rose taps an anomaly prompt.

Behavior:

- panel opens pre-loaded with VCA's first response,
- greeting is skipped,
- VCA goes straight to the insight.

### Inline Callout Tap

Rose taps a contextual callout on a specific admin page, such as Analytics.

Behavior:

- panel opens already oriented to that page,
- response references the local page context,
- same VCA agent, different context loaded.

## Demo Requirement

The executive demo should show all three entry points:

1. peeking FAB anomaly,
2. inline Analytics callout,
3. cold-start leadership report prompt.
