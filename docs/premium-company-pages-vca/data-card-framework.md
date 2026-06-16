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

Audience row values should answer "of what?" without extra explanation. Prefer either a labeled value pair such as `Job function / Human Resources / 38%` when there is room, or a compact evidence sentence such as `38% Human Resources visitors` when the card is narrow.

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

For a broad question like "How is my Page performing?", default to two cards.

1. Snapshot card: current performance summary.
2. Trend or comparison card: the most important pattern.

Add a third card only when it materially changes the answer.

For example:

- Snapshot: Content engagement.
- Comparison: Follower growth gap.
- Optional Content: Top posts, only if the content pattern explains the gap.

The assistant response should connect the cards:

```text
Your Page is performing unevenly. Engagement is improving, but follower growth is trailing competitors. The biggest issue looks like posting cadence, not audience relevance.
```

The cards then show the proof.

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

For example, a card titled "Monthly summary" should use monthly values and monthly comparisons across its rows. Avoid mixing "vs last month", "vs last week", and "this week" in the same simple Snapshot card.

If mixed recency is intentional, label the card accordingly, such as "Current summary", and keep the mixed comparison language easy to scan.

## AI Response Vs Card

### AI Response Owns

- the answer,
- interpretation,
- why it matters,
- recommendation,
- caveat or confidence level,
- transitions between cards.

### Card Owns

- structured evidence,
- timeframe,
- metric values,
- deltas,
- rows,
- chart shape,
- compact labels,
- optional CTA to an existing LinkedIn surface.

Do not repeat every card row in the AI response. Use the response to tell the user what to notice.

## CTA Guidance

Most data cards should not need a CTA.

Add a CTA only when there is a clear destination in LinkedIn:

- View analytics,
- Go to Who's visited my Page,
- View post,
- View competitor Page.

If the CTA is really "what should I do next?", that belongs in the assistant response or a follow-up prompt, not inside the data card.

## Minimal Data Card Anatomy

Use this as the default mental model:

1. Title
2. Context or timeframe
3. Primary evidence
4. Optional compact supporting evidence
5. Optional CTA

No data card needs all five parts.

## UX Implications

- The conversation should feel answer-led, not dashboard-led.
- Cards should make the answer trustworthy, not force the user to decode the answer.
- Keep card count low so the assistant still feels like a guide.
- Prefer one focused card over one impressive but overloaded card.

## System Implications

- Create shared card anatomy before creating more variants.
- Prefer a shared data-card shell, header, row, metric, delta, and footer pattern.
- Avoid one-off mixed cards unless a scripted story truly needs them.
- Keep PCP data cards separate from entity cards and insight cards.
- Do not add new product logic, data sources, or design tokens for this framework.

## Open Questions

- Should data cards always use the AI-blue response border, or should they have a neutral mode for non-chat surfaces?
- Should data cards own their max width, or should they always fill the assistant response attachment width?
- Should `AudienceFit` stay a data card, or become a bridge pattern between data cards and entity/person evidence?
- What is the maximum number of cards allowed in a single assistant answer before the experience starts to feel like a dashboard?
