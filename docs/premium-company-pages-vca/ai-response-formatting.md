# AI Response Formatting Rules

Use these rules when writing scripted PCP assistant responses. The goal is to keep responses conversational, but easier to scan than a single paragraph.

## Default Structure

- Use short paragraphs for insight explanations.
- Keep the opening sentence as the main takeaway.
- Use bullets only when the assistant is listing actions, options, or steps.
- Pair longer explanations with a response-system card when the data needs structure.

## Emphasis

- Bold the smallest meaningful signal, not the whole sentence.
- Good bold targets:
  - Metrics: **64%**
  - Deltas: **up from 52% last month**
  - Named segments: **Human Resources roles at Director+ seniority**
  - Thresholds or bands: **10,001+ employees**
- Avoid bolding more than two or three phrases in one paragraph.

## Paragraph Pattern

For insight-style responses, use three short paragraphs:

1. Main takeaway.
2. Evidence and source of signal.
3. Interpretation or why it matters.

Example:

```text
Your Page is reaching more relevant visitors this month.

64% of people who viewed your Page match Velora's target audience, up from 52% last month. That match is based on LinkedIn demographic signals like job function, seniority, industry, company size, and location.

The biggest shift is quality: more visitors are in Human Resources roles at Director+ seniority, and more are coming from companies with 10,001+ employees. That suggests your Page is reaching people who are more likely to evaluate Velora, not just browse it.
```

## When To Use Bullets

Use bullets when the response is action-oriented:

- Recommendations
- Next steps
- Comparison takeaways
- Draft outlines

Avoid bullets when the response is explaining a single insight. In those cases, paragraphs plus bolded signals feel more natural.

## Response Cards

- Let cards carry dense metrics, rows, comparisons, or entity previews.
- Do not repeat every card row in the text.
- The text should explain the meaning; the card should structure the proof.

## Tone

- Keep it clear and calm.
- Avoid overclaiming intent from page views alone.
- Prefer "suggests" or "signals" when interpreting behavior.
- Use LinkedIn taxonomy language for visitor demographics: job function, seniority, industry, company size, location.
