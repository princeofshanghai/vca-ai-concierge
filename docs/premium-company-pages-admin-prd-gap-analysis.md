# Premium Company Pages Admin Agent: PRD Gap Analysis

Working product and design analysis for aligning the Premium Company Pages prototype with the admin-only MVP described in `VCA for PCP PRD .md`.

This document is intentionally a discussion artifact, not an implementation plan. No UI changes should be made until the product direction and open decisions below are reviewed.

## Executive Takeaway

The current prototype has strong foundations for an admin-facing Page intelligence agent: a persistent assistant entry point, contextual prompts, structured data cards, competitor comparisons, audience insights, follow-up turns, and response feedback.

The main issue is product coherence. The new PRD defines an admin-only analytics and decision-support agent, while the existing project narrative and several prototype surfaces still prioritize a two-sided visitor/admin VCA. The experience currently tells both stories at once.

The recommended direction is to make the admin agent the primary product spine and move the visitor agent, visitor-to-admin handoff, calendar setup, visitor knowledge configuration, and visitor outreach concepts out of the MVP story.

## Sources Reviewed

Primary inputs:

- External PRD: `VCA for PCP PRD .md`
- `PROJECT.md`
- `DESIGN.md`
- `docs/premium-company-pages.md`
- `docs/premium-company-pages-vca.md`
- Detailed Premium Company Pages VCA product, persona, demo, design-decision, response-formatting, taxonomy, and data-card documents
- Current Premium Company Pages admin routes and prototype implementation
- Live admin dashboard, Analytics, assistant, competitor insight, visitor analytics, and assistant settings surfaces

## What Is Already Strong

### UX foundations

- A persistent bottom-right assistant entry exists across admin surfaces.
- Contextual prompt CTAs are embedded in Analytics and the dashboard.
- The assistant supports free-text input, scripted follow-ups, threaded turns, and response feedback.
- Response cards already cover useful evidence jobs: snapshot, trend, comparison, conversion, audience, content, company, post, and person evidence.
- The Page admin shell gives the assistant credible product context instead of presenting it as an isolated chatbot demo.
- The existing anomaly, competitor, visitor, and leadership-report stories contain useful material for the admin MVP.

### Product foundations

- Rose Reynolds is a credible primary persona for organic Page performance.
- Velora provides a sufficiently specific enterprise scenario for making analytics and recommendations understandable.
- The existing data-card principle is strong: the assistant explains the meaning while cards structure the proof.
- Existing visitor-taxonomy guidance correctly encourages standardized demographic dimensions and cautions against treating Page views as proof of buying intent.

## Central Product Conflict

Two different product concepts are currently combined.

### Concept A: Admin Page intelligence agent

The new PRD defines an agent that helps authorized Page admins:

- compile Page performance reports,
- monitor competitors,
- understand visitors and audience patterns,
- receive proactive anomalies and recommendations,
- ask grounded questions about their Page.

### Concept B: Two-sided visitor/admin VCA

The existing project narrative also includes:

- a visitor-facing Page assistant,
- visitor knowledge sources and brand guardrails,
- visitor chat personalization,
- calendar connection,
- visitor-controlled outreach,
- enriched inbox messages and visitor conversation context.

Both concepts may be valuable, but they should not share equal weight in an admin-only MVP prototype. The second concept introduces a different customer problem, trust model, data model, permission model, and operational workflow.

## PRD-To-Prototype Comparison

| Area | New PRD direction | Current prototype | Decision needed |
| --- | --- | --- | --- |
| Product scope | Admin-only MVP | Mixes admin intelligence with visitor assistant setup and visitor handoff | Make admin intelligence the primary story and move visitor VCA out of MVP |
| Assistant opening | Greet the admin and reference the managed Page | Opens with a blank input, “Page assistant,” and three prompts | Choose conversation-first briefing or input-first utility |
| Proactive insight | Surface the top one or two important signals | Default dashboard prioritizes visitor assistant setup, Auto-Invite, and Follow Pages | Replace setup promotion with a meaningful Page signal |
| FAB peek | Anomaly-based proactive entry | Current default route shows the FAB without the anomaly peek | Define when and how the peek appears |
| Prompt placement | Content, Followers, and Competitors | Content, Visitors, Competitors, and Dashboard | Align the tab model with the three MVP jobs |
| Page-performance coverage | Followers, engagement, search appearances, and comparisons | Followers and Search appearances tabs are visually present but empty | Define minimum credible tab content for the prototype |
| Lead analysis | Mixes audience demographics and ranked visitor leads | Shows both aggregate audience insights and named visitors | Separate aggregate audience quality from person-level evidence |
| Settings | Authorized admins can turn the agent on or off, with persistence and confirmation | Admin toggle is on and disabled; visitor toggle is interactive | Create an admin-specific control model |
| Provenance | Every statistic exposes date range, source, and freshness | Date ranges appear in Analytics, but assistant responses rarely expose full provenance | Define a compact response provenance pattern |
| Memory and history | Threaded history and conversation memory | History is session-local and resets on close or navigation | Define personal, Page-level, and cross-session behavior |
| Unsupported requests | State limitation, provide nearest deep link, and log the request | Most unmatched free text receives a scripted prototype limitation | Design helpful unsupported, partial, stale, and failure states |
| Action boundary | No publishing, messaging, outreach, or cross-agent drafting | Includes draft-post and boost-oriented assistant paths | Remove or clearly label these as future concepts |

## What Is Missing From The PRD

## 1. A Precise Primary User And Responsibility Boundary

“Mainly marketers” is too broad for interaction and data decisions.

The existing Rose persona is a social media and communications manager who owns organic Page content, performance, and reporting. She is not responsible for sales development, lead routing, or paid media.

Recommended primary job:

> Help me explain whether our organic LinkedIn presence is working, identify what changed, and decide what to do next without manually assembling multiple analytics views.

This matters because “visitor and lead triage” can turn the product into a sales workflow. The PRD should explicitly state which visitor actions belong to Rose and which belong to sales, demand generation, or other Page admins.

## 2. Canonical End-To-End Tasks

The PRD lists capabilities but does not define complete journeys. Each P0 task should specify:

1. Trigger or starting surface.
2. Admin intent.
3. Required context and defaults.
4. Tool or tools invoked.
5. Response and evidence structure.
6. Recommended next step.
7. Definition of task completion.

At minimum, the prototype needs canonical flows for:

- explaining a Page-performance change,
- producing a leadership-ready report,
- comparing performance with competitors,
- assessing audience quality or relevant visitors.

## 3. A Proactive-Insight Model

The PRD does not yet define:

- when the assistant peeks,
- whether the insight appears in the FAB, dashboard, relevant tab, or multiple surfaces,
- how competing anomalies are ranked,
- whether alerts persist across sessions,
- dismissal, snooze, read, or resolved behavior,
- how frequently the same insight can reappear,
- whether state is shared among multiple Page admins.

The interaction should distinguish:

- `Resting`: no important new signal.
- `Peeking`: one high-value anomaly or opportunity.
- `Open from peek`: direct explanation with no menu or generic greeting.
- `Open from cold start`: Page-aware greeting and directional tasks.
- `Open from a local CTA`: response oriented to the current Analytics context.

## 4. The Reporting Outcome

The core problem describes admins manually assembling reports, but the requirements stop at an in-chat summary.

The PRD should decide whether the reporting job includes:

- copy summary,
- export,
- download,
- share,
- save for later,
- regenerate with a different date range,
- switch between executive and detailed formats.

Without a portable output, the agent may explain performance without actually replacing the weekly reporting workflow.

## 5. The Visitor-Versus-Lead Boundary

The PRD combines two distinct layers:

### Aggregate audience intelligence

- job function,
- seniority,
- company size,
- industry,
- location,
- changes in audience composition,
- audience match against a Page-defined target.

### Person-level visitor or lead triage

- named people,
- profiles,
- behavioral history,
- consideration-stage labels,
- prioritization,
- recommended follow-up.

These layers require different privacy, permission, explanation, and confidence rules.

Recommended MVP stance:

- P0: aggregate audience quality and changes.
- Secondary evidence: named visitors only when identity is legitimately visible and the product can explain why.
- Do not label someone “high intent” from a Page view alone.
- Keep automated outreach and message drafting out of scope.

## 6. A Response Contract

“No more than three sentences per output” is too blunt for evidence-heavy questions.

A more useful contract is:

1. Opening answer: one to three concise sentences.
2. Evidence: one or two focused data cards.
3. Provenance: compact date, source, and freshness treatment.
4. Recommendation: one prioritized next action.
5. Follow-ups: two or three bounded prompts.

The opening should explain what the admin should notice. The cards should carry the dense proof without repeating every value in prose.

## 7. Confidence And Causality Rules

The agent needs language rules that distinguish:

- observed change,
- correlation,
- plausible explanation,
- verified cause,
- recommendation.

For example, a posting gap and follower decline may occur together, but that does not always prove the posting gap caused the decline. Responses should use calibrated language such as “the clearest pattern,” “likely contributed,” or “the data suggests” unless a causal model or experiment supports a stronger claim.

## 8. Safer Ambiguity Handling

“Clarify once, then act” may still produce the wrong answer if Page, competitor, date range, or metric remains unclear.

Recommended behavior:

> Ask one clarification when the missing information is required. Otherwise use a visible default, state the assumption, and let the admin change it.

Example:

> I used Velora and the last 30 complete days. You can change either if you meant a different Page or period.

## 9. Empty, Partial, Stale, And Failure States

The PRD needs behavior for:

- a Page without enough historical data,
- no configured competitors,
- low visitor volume or privacy thresholds,
- one tool succeeding while another fails,
- stale data,
- delayed competitor data,
- conflicting data ranges,
- an admin managing multiple Pages,
- insufficient permission or entitlement,
- unsupported questions unrelated to Page administration.

## 10. A Coherent Time Model

The tools accept weekly ranges, while the stories and prototype use weekly, monthly, last-30-days, month-over-month, and quarterly comparisons.

The PRD should define:

- supported preset and custom ranges,
- complete-period versus partial-period comparison,
- timezone,
- week start,
- month-over-month and year-over-year semantics,
- freshness expectations by data source.

## 11. Clearer Tool Boundaries

The Page Performance tool currently overlaps with content, visitors, followers, demographics, and search. Visitor Demographics does not fully support the promised lead-triage outcome. Competitor Snapshot accepts one competitor, while the product story describes scanning a configured set.

Before implementation, tools should be decomposed around stable evidence jobs rather than large product pages. For example:

- Page performance summary.
- Metric trend and comparison.
- Content performance ranking.
- Audience composition and change.
- Named visitor evidence, if permitted.
- Competitor set comparison.
- Competitor content patterns.
- Search appearance trends.
- Proactive insight retrieval.

## 12. Better Anomaly Quality Controls

A blanket plus-or-minus five percent threshold will create too many alerts and does not account for normal volatility.

An alert needs:

- minimum sample size,
- baseline window,
- seasonality or normal range,
- severity,
- confidence,
- novelty,
- deduplication,
- ranking against other alerts,
- evidence and explanation.

The prototype does not need a statistical implementation, but its mock logic should behave as though these controls exist.

## 13. A Resolved Architecture Constraint

“No net-new pipelines” conflicts with scheduled competitor scanning, anomaly jobs, rankings, memory, and near-real-time evaluation.

A more defensible statement may be:

> Reuse existing PCP and public Page data pipelines for source data. New orchestration, computed insight, alert, and evaluation jobs may be introduced without creating new source-of-truth analytics datasets.

## 14. Multi-Admin Behavior

The PRD should decide:

- whether the agent toggle is personal or Page-wide,
- which admin roles may change it,
- whether alert state is personal or shared,
- whether conversation history is private or visible to other admins,
- how the selected managed Page is resolved,
- whether configuration changes are audited.

## 15. Concrete Launch Gates

The success metrics mostly defer targets to the pilot. The MVP still needs minimum launch criteria for:

- grounded-stat accuracy,
- provenance coverage,
- correct tool selection,
- correct Page resolution,
- response latency,
- unsupported-request handling,
- privacy and authorization failures,
- successful completion of the canonical reporting, competitor, and audience tasks.

## 16. Telemetry Privacy And Governance

The telemetry proposal includes user messages, tool arguments, tool results, named visitors, responses, feedback, and judge outputs.

The PRD needs:

- retention rules,
- access controls,
- redaction,
- deletion behavior,
- permitted use for model or prompt improvement,
- treatment of named visitor information,
- judge calibration and human review.

## Important Pressure Tests

### The five-percent alert threshold will be noisy

Many ordinary metrics move by more than five percent week to week. A simple threshold could make the assistant feel alarmist and reduce trust.

### “Task completion without dashboard navigation” may be the wrong success definition

The PRD also requires deep links as a fallback and positions the assistant as an interpretation layer over Analytics. Opening the right dashboard view may be successful task completion, not failure.

A better metric could distinguish:

- answer completed in chat,
- answer plus intentional deep link,
- failed or abandoned task.

### “Top 60%” is ambiguous

It is unclear whether this means:

- categories that cumulatively represent 60% of the audience,
- the top 60% of available categories,
- categories above a 60% confidence threshold.

This should be defined before it becomes response logic.

### Provenance on every figure could overwhelm the conversation

Provenance is essential, but repeating source and freshness after every number would make the assistant difficult to scan. A per-card provenance footer or expandable “About this data” treatment may satisfy trust needs more effectively.

### Lead triage may move Rose into the wrong job

If Rose owns brand and organic Page strategy, named lead prioritization and follow-up recommendations may feel outside her responsibility. Aggregate audience quality and content implications are more consistent with her role.

## Recommended Admin-Only Prototype Spine

## Flow 1: Hero Anomaly To Action

Purpose: prove that the agent notices important changes and helps Rose act without dashboard digging.

1. Rose opens the Page admin dashboard.
2. A single FAB peek says follower growth slowed this month.
3. Rose opens it and receives the explanation immediately.
4. A trend card shows when the decline began.
5. Content evidence shows the change in posting cadence or performance.
6. A compact provenance treatment shows Page, date range, data source, and freshness.
7. Rose asks how competitors compare.
8. A comparison card shows the gap and the likely content or cadence pattern.
9. The agent recommends one action Rose can take manually.

Keep the recommendation within the MVP boundary. The agent can recommend a topic or workflow, but it should not publish, boost, message visitors, or hand off to a drafting agent.

## Flow 2: Leadership-Ready Page Report

Purpose: prove that the agent replaces manual analytics compilation.

Cold-start opening:

> Welcome back, Rose. Here’s what’s worth your attention on Velora’s Page.

Primary prompt:

> Summarize Page performance this month.

Response:

- one executive takeaway,
- one Page-performance snapshot,
- one audience-quality signal,
- one competitor benchmark,
- one prioritized recommendation,
- a portable action such as Copy summary or Export report.

## Flow 3: Audience Quality

Purpose: prove that the agent can interpret visitor data without overclaiming intent.

1. Rose opens Visitors or Followers Analytics.
2. She selects a contextual prompt asking whether the Page is reaching the right audience.
3. The assistant answers yes, no, or mixed.
4. An Audience card shows standardized job function, seniority, industry, company size, and location evidence.
5. The response explains that Page views signal relevance but do not prove buying intent.
6. If permitted, a separate person rail shows opted-in or otherwise visible visitors.
7. The agent deep-links to the full visitor surface instead of initiating outreach.

## Flow 4: Competitor Monitoring

Purpose: prove that the agent converts competitor scanning into a concise briefing.

1. Rose opens Competitors Analytics or asks from the assistant.
2. The agent compares the configured competitor set with Velora.
3. It identifies the most meaningful follower, cadence, content-format, or hiring signal.
4. It shows comparison evidence and one or two content examples.
5. It recommends what Rose should inspect or change next.

This flow can also be a follow-up branch from the anomaly story rather than a separate hero demo.

## What To Keep In The Main Prototype

- Rose and Velora.
- The Page admin shell.
- Persistent admin FAB.
- Resting, peeking, and open assistant states.
- Contextual Analytics prompts.
- Performance, trend, comparison, content, and audience cards.
- Response feedback.
- The follower-growth anomaly story.
- The competitor comparison story.
- The leadership-report story.
- Aggregate visitor and audience intelligence.

## What To Move Out Of The MVP Story

- Member or visitor VCA experience.
- Visitor assistant setup and knowledge sources.
- Visitor assistant color customization.
- Calendar connections.
- Cheri-to-Rose visitor handoff.
- Visitor transcript implications.
- AI-drafted outreach or replies.
- Draft-post generation and cross-agent handoff.
- Boost execution from the agent.
- “High intent” labels inferred from weak behavioral signals.

These concepts can remain documented as later-stage explorations, but they should not compete with the admin agent in the MVP prototype.

## Recommended Product Decisions

### Recommendation 1: Keep Rose As The Primary Persona

Keep her anchored in brand, social, organic Page strategy, and leadership reporting. Do not silently expand her into sales development.

### Recommendation 2: Make Aggregate Audience Intelligence P0

Treat person-level visitor evidence as secondary and permission-dependent. This produces a more defensible privacy posture and a clearer fit with Rose’s job.

### Recommendation 3: Use The Anomaly-To-Action Flow As The Hero

This demonstrates the uniquely agentic value: the system notices, explains, compares, and recommends before Rose manually assembles the answer.

### Recommendation 4: Make The Leadership Report The Second Major Flow

This most directly addresses the stated weekly reporting pain and provides an understandable productivity outcome.

### Recommendation 5: Treat The Agent As An Interpretation Layer, Not A Replacement Dashboard

The assistant should answer and recommend. Cards should provide focused proof. Existing Analytics remains the place for exploration and full detail.

## Discussion Questions Before UI Changes

1. Is Rose still the primary persona, with brand and organic Page ownership, or should the prototype target a broader performance marketer with lead responsibilities?
2. Should “Visitor & Lead Analysis” mean aggregate audience intelligence first, or is named individual lead ranking essential to the MVP?
3. Should the primary demo begin with a proactive anomaly, a weekly briefing, or a cold-start reporting request?
4. Does report completion require a portable output such as Copy, Export, or Share?
5. Is the admin-agent toggle personal to Rose or Page-wide for all authorized admins?
6. Should conversation history persist across navigation and sessions, and if so, is it private or Page-shared?
7. Which surface owns proactive insight: FAB peek, dashboard digest, contextual in-tab callout, or a coordinated combination?
8. Are named visitor identities and behavior signals approved for this prototype, or should the first pass stay aggregate?

## Proposed Next Step

Discuss and resolve the primary persona, visitor-versus-lead boundary, hero flow, reporting outcome, and proactive-entry model.

After those decisions, update the product source of truth and admin demo stories. Only then should the UI be changed.
