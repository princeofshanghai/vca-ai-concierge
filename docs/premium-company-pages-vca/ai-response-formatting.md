# AI Response Formatting Rules

Use these rules for all scripted PCP assistant responses, including admin and member/visitor experiences. The goal is to keep responses conversational, calm, and easy to scan without making the prose feel heavily formatted.

Admin language and tone guidance lives in [PCP Admin AI Response Voice Guide](./ai-response-voice-guide.md). Member/visitor responses follow the same plain-language formatting rules here while retaining the company-configured voice and visitor safeguards defined in the visitor experience spec.

## Default Structure

- Use short paragraphs for insight explanations.
- Keep the opening sentence as the main takeaway.
- Use bullets only when the assistant is listing actions, options, or steps.
- Pair longer explanations with a response-system card when the data needs structure.
- Do not use em dashes in assistant responses. Use a period, comma, or shorter sentence instead.

## Emphasis

- Use regular-weight prose by default.
- Do not automatically bold the opening assessment or recommendation.
- A short response paired with an evidence card should usually contain no bold text. The card already provides the visual hierarchy and concrete proof.
- Use bold only as a deliberate exception when one short phrase is the critical scan target and the same information is not already prominent in a card.
- Never bold a whole sentence or paragraph.
- Avoid highlighting several fragments throughout a response. When everything is emphasized, the response becomes harder to read.
- Keep links visually distinct as links rather than treating them as bold emphasis.

Practical defaults:

| Response type | Default emphasis |
| --- | --- |
| Short explanation with an evidence card | No bold text |
| Text-only answer with one critical fact | Up to one short bold phrase |
| Multi-part answer | Use headings or bullets for real structure; do not manufacture emphasis inside every item |

## Paragraph Pattern

For insight-style responses, use three short paragraphs:

1. Main takeaway.
2. Evidence and source of signal.
3. Interpretation or why it matters.

Example:

```text
Most of your Page visitors come from three industries: Retail, Hospitals and Health Care, and Technology, Information and Internet.

Together, they made up 63.3% of visitors over the last 30 days.

Retail is the largest group, and one of your stronger posts features a retail customer. This does not prove the post brought those visitors to your Page, but it gives you a useful topic to test again.

Try one more post for benefits teams in retail, then compare it with your broader posts.
```

## When To Use Bullets

Use bullets when the response is action-oriented:

- Recommendations
- Next steps
- Comparison takeaways
- Draft outlines

Avoid bullets when the response is explaining a single insight. In those cases, short regular-weight paragraphs should carry the story.

Use a numbered list when the steps must happen in sequence. Use regular bullets
for choices or items with equal priority.

Nested bullets are appropriate when one step contains a small set of choices,
such as choosing either a suggested audience or a custom audience. Keep nesting
to one level so the response remains easy to scan in the collapsed chat.

## Sources

Sources are optional rich-response content. Use them when an answer relies on
external documentation, policy, instructions, or a claim the user may want to
verify. Do not add Sources to analytics insights that are derived only from the
Page data already visible in the experience.

- Place Sources below the answer and above response feedback.
- Separate the block from the answer with the faint border token.
- Use `Sources` as the section title.
- Use the 12 px strong supportive token for the section title.
- Use the 12 px regular supportive token for source links.
- Underline the complete source title and let long titles wrap.
- Do not repeat the same source as an inline link in the answer.
- Keep the block optional; a rich response does not require a source.

## Response Cards

- Let cards carry dense metrics, rows, comparisons, or entity previews.
- Do not repeat every card row in the text.
- The text should explain the meaning; the card should structure the proof.
- When a data card immediately follows, prefer directional language in the response and let the card carry the exact values and deltas.
- Include an exact number in the response only when it is the answer, its magnitude is essential, or no card is needed.
- Introduce why a single entity appears in the response text rather than adding a visible title inside the entity card.
- When several entities appear, use one short group label outside the cards.

Example:

```text
Overall, your content connected better with people who saw it, but reached fewer people this week. You posted less often, which likely contributed to the drop in impressions even as engagement improved. Try posting one more time this week about a topic that already worked, like the top post shown below.
```

Then let a `Summary` Metric card show the current values and deltas, followed by the untitled Post entity with its natural `View post` action.

## Tone

- Keep it clear and calm.
- Avoid overclaiming intent from page views alone.
- State observable facts directly.
- Use "may," "likely," or "appears" when interpreting behavior.
- Do not use "signals" as filler when the response can simply say what happened.
- Use LinkedIn taxonomy language for visitor demographics: job function, seniority, industry, company size, location.
