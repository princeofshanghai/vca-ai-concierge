# AI Response Formatting Rules

Use these rules when writing scripted PCP assistant responses. The goal is to keep responses conversational, but easier to scan than a single paragraph.

Language and tone guidance lives in [PCP Admin AI Response Voice Guide](./ai-response-voice-guide.md). Use the voice guide as the source of truth for word choice, clarity, confidence, and plain language.

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
Your Page is reaching more of the people Velora wants to reach this month.

64% of people who viewed your Page match Velora's target audience, up from 52% last month.

More of those visitors work in Human Resources, are director level or above, and come from companies with 10,001+ employees. This does not confirm buying intent, but it shows that the Page is reaching more of its intended audience.
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
- State observable facts directly.
- Use "may," "likely," or "appears" when interpreting behavior.
- Do not use "signals" as filler when the response can simply say what happened.
- Use LinkedIn taxonomy language for visitor demographics: job function, seniority, industry, company size, location.
