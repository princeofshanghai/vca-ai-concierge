# PCP Data Card Decision Matrix And Specs

Operational guide for choosing and shaping Premium Company Pages VCA data cards.

This doc builds on [PCP Data Card Framework](./data-card-framework.md). The framework defines the philosophy. This doc defines the practical choice model: when to use each card, how much to show, and what belongs in the assistant response versus the card.

## Goal

Make data card choices feel calm and repeatable.

When a user asks a question, the designer should be able to answer:

1. What is the user really asking?
2. What is the shortest useful answer?
3. What proof does that answer need?
4. Which 1 to 2 cards best carry that proof?

## Default Rule

Default to 1 or 2 data cards per assistant answer.

Use 3 cards only when the user asks a broad summary question and each card adds a distinct kind of proof.

If an answer needs more than 3 cards, it probably wants a dashboard, side panel, or follow-up conversation instead of a single chat response.

## Card Jobs

| Card job | User question | What the card proves |
| --- | --- | --- |
| Snapshot | What is the current state? | The latest key numbers. |
| Trend | What changed over time? | The shape and timing of change. |
| Comparison | How do we compare? | Relative performance against a baseline or competitor. |
| Conversion | Where is attention dropping before action? | The path from views or visitors to a concrete next step. |
| Audience | Who is showing up? | Whether the right visitors are engaging. |
| Content | What drove the pattern? | Which posts or content themes explain performance. |

## Decision Matrix

| User asks | Assistant should answer | Default cards | Optional support | Avoid |
| --- | --- | --- | --- | --- |
| "How is my Page performing?" | Overall state plus the main issue or opportunity. | Snapshot + Trend or Comparison | Content, only if content explains the pattern. | Showing every metric available. |
| "What should I focus on next?" | The highest-leverage next move, grounded in the main performance gap. | Comparison + one content example | Draft/action follow-up. | Generic support tips without evidence. |
| "Why did follower growth drop?" | What changed and the likely cause. | Trend + Content | Comparison if competitors reveal the gap. | Audience avatars unless visitor quality is the cause. |
| "How do I compare to competitors?" | Where Velora is ahead or behind. | Comparison | Content if competitor content explains the gap. | A general performance snapshot unless needed for context. |
| "What kinds of visitors am I attracting?" | Audience quality and relevant segments. | Audience | Entity rail of people, if the next step is profile review. | Competitor or content cards. |
| "Is my Page reaching the right audience?" | Whether visitors match target segments. | Audience | Trend if audience fit changed over time. | General engagement metrics without audience context. |
| "What content is working?" | Which posts or themes are driving engagement. | Content | Snapshot if the user needs topline engagement first. | Competitor comparison unless the user asked why others are doing better. |
| "Why are post impressions down?" | Whether reach fell because of cadence, early engagement, or content mix. | Trend + Content | Boost recommendation only for content already showing strong engagement. | Treating boost as the default fix before explaining the drop. |
| "What should I post next?" | Recommendation based on evidence. | Content | Trend or Comparison if the recommendation depends on a change or gap. | Putting the recommendation inside the card. |
| "How can I get more custom button clicks?" | Whether the Page is turning attention into action, then what to adjust. | Conversion | Content if the recommendation depends on a specific post or theme. | Repeating the same metric sentence in both the response and the card. |
| "Why is a competitor gaining faster?" | The specific competitor pattern and implication. | Comparison + Content | Trend if timing matters. | A broad dashboard-style summary. |
| "Are these visitors worth following up with?" | Whether the visitors are relevant and why. | Audience | Entity/person cards or Insight cards. | Treating individual people as rows inside a general data card. |
| "What happened this week?" | A concise weekly synthesis. | Snapshot + Content | Comparison if there is a clear competitive change. | More than 3 cards in chat. |

## Card Specs

### Snapshot Card

Job: current state.

Use when the assistant needs to show the latest key numbers.

Required:

- title,
- timeframe or context,
- 1 to 3 metrics.
- one shared timeframe lens across rows.

Optional:

- delta per metric,
- short delta context such as "vs last month".

Forbidden:

- avatars,
- content thumbnails,
- charts,
- recommendations,
- long explanatory copy,
- mixed comparison windows like "vs last month", "vs last week", and "this week" in one simple Snapshot card,
- more than 3 primary metrics.

Good examples:

- "Content engagement"
- "Monthly summary"
- "Page performance"

Default shape:

```text
Title
Timeframe

Metric value  Metric value  Metric value
Metric label  Metric label  Metric label
Delta         Delta         Delta
```

Use a Snapshot card when the user needs orientation before deeper analysis.

### Trend Card

Job: change over time.

Use when the assistant needs to show the shape, timing, or direction of change.

Required:

- title,
- timeframe,
- one chart or trend line.

Optional:

- one annotation,
- one summary metric if the chart needs an anchor.

Forbidden:

- multiple unrelated annotations,
- competitor rows,
- content thumbnails,
- audience avatars,
- recommendations.

Good examples:

- "Follower growth"
- "Page visits"
- "Engagement trend"

Default shape:

```text
Title
Timeframe

Trend chart
Axis labels
```

Use `MetricWithTrend` only when one metric and its history belong together. If there are several metrics, use Snapshot plus Trend as separate cards.

### Comparison Card

Job: relative performance.

Use when the assistant needs to show Velora against a competitor, benchmark, or prior period.

Required:

- title,
- comparison dimension,
- 2 to 4 rows,
- one value per row.

Optional:

- tiny row detail, such as "22 posts",
- visual identity per row, such as company logo.

Forbidden:

- trend chart,
- content list,
- avatars unless comparing people is the entire point,
- recommendations.

Good examples:

- "Follower growth gap"
- "Posts published"
- "Competitor comparison"

Default shape:

```text
Title
Dimension

Row label       Bar/value
Row label       Bar/value
Row label       Bar/value
```

Use Comparison when the answer depends on relative position, not just absolute performance.

### Conversion Card

Job: action path.

Use when the assistant needs to show whether Page attention is turning into a concrete next step, such as custom button clicks.

Required:

- title,
- timeframe or context,
- one primary conversion rate or outcome,
- 2 to 4 path rows.

Optional:

- delta per row,
- compact detail per row,
- one computed summary such as "visitor-to-button click rate".

Forbidden:

- recommendations,
- content thumbnails,
- audience avatars,
- competitor rows,
- full setup instructions,
- more than one conversion goal in the same card.

Good examples:

- "Button conversion path"
- "Visitor-to-lead path"
- "Page action path"

Default shape:

```text
Title
Timeframe

Primary conversion rate
Label

Path row       Value / delta
Path row       Value / delta
Path row       Value / delta
```

Use Conversion when the answer is about a drop-off between attention and action. The assistant response should explain the likely cause and recommendation.

### Audience Card

Job: audience quality.

Use when the assistant needs to show who is showing up and whether those visitors match the target audience.

Required:

- title,
- one primary audience metric,
- 3 to 5 segment rows.

Optional:

- delta for the primary audience metric,
- CTA to an existing LinkedIn audience surface,
- a small avatar treatment only if the card is explicitly about visitor quality.
- compact evidence sentences when a detached right-side percentage would be unclear, such as "38% Human Resources visitors".

Forbidden:

- competitor bars,
- content thumbnails,
- trend chart unless audience fit over time is the whole answer,
- full people list,
- recommendation text.

Good examples:

- "Visitors"
- "Audience fit"
- "Target audience match"

Default shape:

```text
Title
Primary audience metric + label
Delta if useful

Segment row       Value
Segment row       Value
Segment row       Value

Optional CTA
```

If the response needs to show individual people, use a separate Entity card or person rail after the Audience card.

### Content Card

Job: content evidence.

Use when the assistant needs to show which posts or themes explain performance.

If the evidence is one concrete post object rather than a ranked list, use an Entity Post card as the content example instead of forcing it into a data card.

Required:

- title,
- 2 to 4 content rows,
- one compact metric set per row.

Optional:

- thumbnail,
- post meta,
- 1 to 2 metrics per row.

Forbidden:

- full post action controls,
- long post analysis,
- competitor bars,
- audience segments,
- recommendations.

Good examples:

- "Posts"
- "Top posts"
- "Content performance"

Default shape:

```text
Title

Thumbnail  Post title
           Meta
           Metric  Metric

Thumbnail  Post title
           Meta
           Metric  Metric
```

Use Content when the answer is about what is resonating or what caused a performance pattern.

## AI Response Vs Card

### Assistant Response Owns

- the direct answer,
- interpretation,
- why it matters,
- recommendation,
- uncertainty or caveat,
- transitions between cards.

### Data Card Owns

- structured proof,
- values,
- rows,
- deltas,
- timeframe,
- compact labels,
- chart or comparison shape,
- optional CTA to an existing LinkedIn surface.

Example:

```text
Your Page is performing unevenly. Engagement is improving, but follower growth is trailing competitors. The likely issue is posting cadence, not audience relevance.
```

Cards:

1. Snapshot: content engagement.
2. Comparison: follower growth gap.

The response tells the user what to notice. The cards make the answer credible.

## Mixed Evidence Rules

Use these rules when a card starts to feel overloaded.

| If you want to combine | Prefer |
| --- | --- |
| Metric + chart | MetricWithTrend, but only for one metric. |
| Metrics + avatars | Snapshot plus separate Audience or Entity card. |
| Audience segments + people | Audience card plus separate person rail. |
| Competitor bars + top posts | Comparison card plus Content card. |
| Content rows + recommendation | Content card plus recommendation in assistant text. |
| Trend + competitor comparison | Trend card plus Comparison card, unless one is only a small context line. |

## Response Playbooks

### Broad Performance

User asks: "How is my Page performing?"

Assistant response:

- answer in one sentence,
- name the main pattern,
- name why it matters.

Cards:

1. Snapshot for current state.
2. Trend or Comparison for the main pattern.
3. Optional Content if content explains the pattern.

### Growth Drop

User asks: "Why did follower growth drop?"

Assistant response:

- state the drop,
- identify the likely cause,
- suggest next action.

Cards:

1. Trend for the timing of the drop.
2. Content for posting cadence or content pattern.
3. Optional Comparison if competitors reveal the gap.

### Competitor Gap

User asks: "How do I compare to competitors?"

Assistant response:

- state who is ahead or behind,
- explain the likely driver,
- suggest what to inspect next.

Cards:

1. Comparison.
2. Optional Content if competitor content explains the difference.

### Audience Quality

User asks: "Am I reaching the right audience?"

Assistant response:

- answer yes, no, or mixed,
- name the strongest segment signal,
- caveat that views do not prove buying intent.

Cards:

1. Audience.
2. Optional person/entity rail if the next action is visitor review.

### Content Resonance

User asks: "What content is working?"

Assistant response:

- name the theme,
- explain why it likely resonates,
- suggest the next content move.

Cards:

1. Content.
2. Optional Snapshot if the user needs overall engagement context.

## Card Count Budget

| Count | Use when |
| --- | --- |
| 0 cards | The answer is simple, conversational, or advisory. |
| 1 card | The user asked a focused question. |
| 2 cards | The answer needs one claim plus one supporting proof point. |
| 3 cards | The user asked for a broad summary. |
| 4+ cards | Move to a dashboard, side panel, or staged follow-up. |

## CTA Rules

Most data cards should not have CTAs.

Use a CTA only when the card points to a real LinkedIn destination:

- View analytics,
- Go to Who's visited my Page,
- View post,
- View competitor Page.

Do not use a card CTA for "what should I do next?" Put that in the assistant response or follow-up prompts.

## Implementation Implications

When we translate this into components, the system should support:

- a shared data-card shell,
- shared title and context treatment,
- shared metric value and delta patterns,
- shared row spacing,
- shared optional footer/CTA treatment,
- clear constraints for each card job.

The implementation should not add new product logic, new data sources, new design tokens, a UI library, or state management.

## Open Decisions

- Should Data cards have a neutral shell mode for non-chat surfaces?
- Should all Data cards fill the response attachment width, or should some own a max width?
- Should `AudienceFit` remain one card type, or split into `AudienceSummary` and `AudienceSegments`?
- Should the component library preview show "recommended pairings" so conversation designers can see common card combinations?
