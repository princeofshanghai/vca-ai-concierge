# VCA Executive Demo Outline

Concise executive demo hub for the Premium Company Pages VCA prototype.

For the clean product/design spec, read [Premium Company Pages VCA Prototype Spec](./premium-company-pages-vca.md).

For detailed source-of-truth components, read:

- [Framing and personas](./premium-company-pages-vca/framing-personas.md)
- [Admin agent FAB](./premium-company-pages-vca/admin-agent-fab.md)
- [Admin demo stories](./premium-company-pages-vca/admin-demo-stories.md)
- [Visitor loop](./premium-company-pages-vca/visitor-loop.md)
- [Design decisions](./premium-company-pages-vca/design-decisions.md)

## Executive Overview

VCA (Virtual Chat Agent) is a net-new agentic feature for LinkedIn Premium Company Pages Pro. It adds coordinated admin-facing and visitor-facing VCA experiences to a Company Page.

Target:

- PCP Pro,
- enterprise pilot,
- 10K+ employee companies,
- Q2FY27.

LinkedIn-native insight:

> Most platforms can tell you someone visited. LinkedIn can understand who they likely are - role, company, seniority, industry, company size, and professional intent - before they type a word.

## Demo Flow

### 1. Admin Agent: Peeking FAB Anomaly

Rose Reynolds opens the PCP dashboard and sees a single anomaly prompt above the persistent VCA FAB:

> Follower growth dropped this month - find out why.

She taps it. VCA opens directly to the insight, explains the likely cause, compares competitor activity, and recommends what Rose should do this week.

Detail: [Story 1A: The Anomaly](./premium-company-pages-vca/admin-demo-stories.md#story-1a-the-anomaly)

### 2. Admin Agent: Contextual Analytics Insight

Rose opens Analytics and sees a contextual callout:

> Website visits down 22% this month - may be linked to posting frequency.

She taps it. VCA opens already oriented to Analytics and explains the correlation between website visits, posting frequency, and above-average click-through rates.

Detail: [Story 1B: The Contextual Insight](./premium-company-pages-vca/admin-demo-stories.md#story-1b-the-contextual-insight)

### 3. Admin Agent: Leadership Report

Rose has a leadership meeting in an hour. She opens VCA from a cold start and selects:

> How is my page performing this month?

VCA synthesizes performance, visitors, and competitor context into a leadership-ready summary in under ninety seconds.

Detail: [Story 1C: The Leadership Report](./premium-company-pages-vca/admin-demo-stories.md#story-1c-the-leadership-report)

### 4. Visitor Loop: Cheri Self-Qualifies

Cheri Sparks, VP of HR at a 12,000-person retail company, lands on Velora's Page while evaluating benefits platforms.

She sees a subtle VCA nudge:

> See how Velora helps large HR teams manage benefits across multiple carriers.

Cheri asks what happens if her company switches benefits platforms mid-year. VCA gives a specific answer, then offers an editable warm LinkedIn message.

Detail: [Story 2: Visitor Experience](./premium-company-pages-vca/visitor-loop.md#story-2-visitor-experience)

### 5. Admin Receives: Warm Contextualized Conversation

Rose receives a high-intent visitor notification, Cheri's sent message, and a VCA context summary.

By default, Rose does not see the full visitor transcript. She sees Cheri's message plus a concise summary of fit, topic, and needs.

Detail: [Story 3: Admin Receives](./premium-company-pages-vca/visitor-loop.md#story-3-admin-receives)

## What This Demo Proves

- VCA surfaces what matters before Rose digs through dashboards.
- VCA translates Page analytics into recommendations.
- VCA helps Rose explain organic LinkedIn value to leadership.
- VCA lets Cheri self-qualify without filling out a form or entering a premature sales funnel.
- VCA preserves visitor agency through an editable LinkedIn message.
- VCA gives Rose qualified context only when Cheri chooses to reach out.

## Locked Design Positions

- Admin VCA uses a persistent FAB with resting, peeking, and open states.
- The admin open state is conversation-first, not blank-input-first.
- The visitor handoff is a warm LinkedIn message, not a form fill or calendar booking.
- Rose sees Cheri's sent message plus a VCA context summary by default, not the full transcript.
- Enterprise guardrails remain an intentional open design thread.

Detail: [Design decisions](./premium-company-pages-vca/design-decisions.md)
