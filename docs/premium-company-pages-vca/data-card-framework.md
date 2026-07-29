# PCP Data Card Framework

Working framework for Premium Company Pages VCA data cards.

The goal is to keep data cards simple, reusable, and easy to choose during scripted conversation design. A data card should not try to be the whole answer. The assistant response explains the meaning; the card shows the evidence.

Companion doc: [PCP Data Card Decision Matrix And Specs](./data-card-decision-matrix.md).

## Core Principle

One data card should prove one thing.

- The AI response gives the plain-language answer.
- The AI response explains why the evidence matters.
- The card structures the proof.
- The card should not need a paragraph inside it to make sense.
- When the card carries the exact values, the response should usually describe direction and meaning without repeating those values.

If a card needs metrics, avatars, a chart, comparison bars, a CTA, and explanatory copy, it is probably doing too many jobs.

## Card Jobs

Use data cards for five evidence jobs.

### 1. Snapshot

Answers: What is the current state?

Use for:

- page visitors,
- follower growth,
- impressions,
- reactions,
- comments,
- high-level engagement.

Good card contents:

- title,
- timeframe,
- 1 to 3 metrics,
- delta per metric when useful.

Avoid:

- avatars,
- content thumbnails,
- long interpretation,
- recommendations.

### 2. Trend

Answers: What changed over time?

Use for:

- follower growth over a month,
- page visits over recent weeks,
- engagement trend before and after a posting change.

Good card contents:

- title,
- timeframe,
- one chart,
- one annotation when the annotation is essential.

Avoid:

- multiple unrelated annotations,
- competitor rows,
- people lists,
- detailed recommendations.

### 3. Comparison

Answers: How do we compare?

Use for:

- Velora versus competitors,
- this month versus last month,
- one audience segment versus another when the comparison is the point.

Good card contents:

- title,
- comparison dimension,
- 2 to 4 rows,
- one value per row,
- optional row detail such as post count.
- the focal `You` row first, followed by comparison rows in descending value order.
- one optional related drill-down action in the card footer.

Avoid:

- embedding trend charts,
- embedding top content,
- turning every row into a full entity card.

### 4. Audience

Answers: Who is showing up?

Use for:

- audience fit,
- target-segment match,
- visitor demographics,
- relevant visitor groups.

Good card contents:

- title,
- one primary audience metric,
- 3 to 5 demographic rows,
- optional CTA to an existing LinkedIn audience surface.

Audience row values should answer "of what?" without extra explanation. Prefer either a labeled value pair such as `Industry / Retail / 26.8%` when there is room, or a compact evidence sentence such as `26.8% Retail visitors` when the card is narrow. Use exact LinkedIn taxonomy labels in structured UI, even when the conversational response uses a shorter collective phrase such as `three industries`.

Keep the component row count flexible. For a compact audience summary, three named groups are a useful default. Add a fourth `Other` row when it represents the complete remainder and helps the visible values reconcile to 100%. Document whether that row is a derived summary rollup or a native analytics category.

Use avatars only when the card is about people or audience quality. If the card is about page performance, content engagement, or competitor movement, avatars should usually live in a separate entity card or rail.

### 5. Content

Answers: Which content drove the pattern?

Use for:

- top posts,
- content resonance,
- post performance patterns,
- explaining why a performance change happened.

Good card contents:

- title,
- 2 to 4 content rows,
- thumbnail when useful,
- compact per-row metrics.

Avoid:

- full post-card behavior,
- social actions,
- long post analysis inside the card.

## Default Answer Pattern

For a broad starter question like "How is my Page performing?", default to one concise data card that proves the prioritized relationship.

Add one entity card only when a specific post, company, or person materially strengthens the explanation or recommendation.

For example:

- Data card: a `Summary` Metric card with current impressions, engagement rate, posts published, and their deltas.
- Optional entity card: the top Post that gives the admin a concrete example of what worked.

The assistant response should connect the cards:

```text
Overall, your content connected better with people who saw it, but reached fewer people this week. You posted less often, which likely contributed to the drop in impressions even as engagement improved. Try posting one more time this week about a topic that already worked, like the top post shown below.
```

The data card shows the exact proof. The entity card makes the recommendation concrete.

## Complexity Rules

A data card can combine one primary thing and one supporting thing.

Good combinations:

- metric plus delta,
- metric plus trend,
- list plus small metrics,
- audience percentage plus segment rows,
- comparison row plus small detail.

Risky combinations:

- metric plus avatars plus chart plus CTA,
- trend plus competitor bars plus content list,
- audience segments plus people rail plus recommendation,
- any card that needs a paragraph of explanation inside the card.

When in doubt, split the evidence into two simple cards or move the interpretation into the assistant response.

## Timeframe Rule

A data card should generally use one primary timeframe lens.

Prefer a concise relative period in the visible UI, such as `Last 7 days`. The exact date range, comparison basis, source, timezone, and freshness may remain available through a compact provenance disclosure.

For standard seven-day starter cards:

- show `Last 7 days` below the title,
- show current values and deltas,
- do not show previous-period raw values by default,
- calculate deltas against the previous equivalent complete seven-day period,
- and do not repeat `vs previous 7 days` in the visible card.

Use metric-appropriate deltas. Prefer `2 fewer` for a small post-count change, a percentage for impressions, and percentage points for an engagement-rate change.

If mixed recency is intentional, label the card accordingly, such as "Current summary", and keep the mixed comparison language easy to scan.

## AI Response Vs Card

### AI Response Owns

- the answer,
- the overall assessment,
- the relationship the admin may otherwise miss,
- interpretation,
- why it matters,
- recommendation,
- caveat or confidence level,
- the introduction explaining why an entity appears,
- transitions between cards.

### Data Card Owns

- structured evidence,
- timeframe,
- metric values,
- deltas,
- rows,
- chart shape,
- compact labels,
- compact visible period,
- optional provenance disclosure.

Do not repeat every card row in the AI response. Use the response to tell the user what to notice.

### Entity Card Owns

- the familiar representation of one post, company, or person,
- object metadata,
- no more than one or two relevant metrics,
- and its natural inspection action, such as `View post`.

For a single entity, let the AI response introduce why it appears rather than adding a visible title inside the card. For several entities, use one short group label outside the cards.

A standalone entity card fills the available assistant response width, up to the shared content maximum. When several entity cards appear in a horizontal rail, each card uses its compact rail width instead.

## CTA Guidance

Data cards should not need a CTA by default. When a data card has one directly related drill-down destination, keep a single secondary navigation action inside the card footer rather than placing it as a detached response-level button.

Entity cards may keep their natural inspection CTA:

- `View post`
- `View profile`
- `View company`

Keep one primary navigation goal per response. If a card action is the intended destination, do not add a competing response-level CTA. If the response needs to navigate to full Analytics instead, use that destination and reconsider whether the card action is necessary.

## Minimal Data Card Anatomy

Use this as the default mental model:

1. Title
2. Simple visible period
3. Primary evidence
4. Optional compact supporting evidence
5. Optional provenance disclosure

No data card needs all five parts.

## UX Implications

- The conversation should feel answer-led, not dashboard-led.
- Cards should make the answer trustworthy, not force the user to decode the answer.
- Keep card count low so the assistant still feels like a guide.
- Prefer one focused card over one impressive but overloaded card.
- A generic visible title such as `Summary` is acceptable when the surrounding response supplies the meaning.
- Current values and deltas are usually enough; previous raw values belong in the full Analytics destination unless they are essential to comprehension.

## System Implications

- Create shared card anatomy before creating more variants.
- Prefer a shared data-card shell, header, row, metric, delta, and footer pattern.
- Support a shared context line such as `Last 7 days` beneath the card title.
- Keep exact dates and comparison calculations in the underlying card data even when the visible UI uses relative language.
- Avoid one-off mixed cards unless a scripted story truly needs them.
- Keep PCP data cards separate from entity cards and insight cards.
- Do not add new product logic, data sources, or design tokens for this framework.

## Open Questions

- Should data cards always use the AI-blue response border, or should they have a neutral mode for non-chat surfaces?
- Should data cards own their max width, or should they always fill the assistant response attachment width?
- Should `AudienceFit` stay a data card, or become a bridge pattern between data cards and entity/person evidence?
- Should provenance open in a tooltip, popover, or another compact disclosure pattern?
