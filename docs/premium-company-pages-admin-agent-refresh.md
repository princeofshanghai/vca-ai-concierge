# Premium Company Pages Admin Agent Refresh

Status: Working UX source of truth

Prototype status: Not currently implemented. The former isolated V2 route has been removed.

Existing route: `/premium-company-pages/admin` remains unchanged

Primary source: `VCA for PCP PRD  (1).md`

## 1. Purpose

Refresh the AI experience for Premium Company Page admins without redesigning the surrounding admin product.

This is a scripted prototype. Its job is to show a clear, useful, and believable experience—not to prove the production system behind it.

Existing prompts, conversations, and in-chat cards are reference material, not requirements. Keep an existing idea only when it supports the refreshed experience.

The experience should show how the Page assistant:

1. notices what matters,
2. explains it clearly,
3. shows focused evidence,
4. helps the admin decide what to do next.

## 2. Product promise

> The Page assistant has already looked across the Page data and helps the admin understand what deserves attention.

## 3. Scope

### What can change

- Prompts shown on admin pages
- The proactive assistant preview and insight entry
- The assistant welcome and starter prompts
- Scripted user and assistant messages
- Follow-up prompts
- Cards shown inside the conversation
- In-chat navigation actions
- Empty, stable, unavailable, and unsupported response states

### What stays unchanged

- The existing admin route
- Global navigation and Page navigation
- Dashboard and Analytics page layouts
- Existing metrics, charts, tables, and Page content
- Messaging inbox tray
- Settings and other non-agent experiences
- The shared visual system and chat shell
- Rose, Velora, and the current prototype world

### What this prototype does not need

- A real AI model
- Production data or tool integrations
- Production memory, permissions, or telemetry
- Real alert jobs or background processing
- Real publishing, boosting, messaging, or outreach actions

The prototype may simulate these moments when they help explain the intended UX, but it should not imply that an out-of-scope action was completed.

## 4. PRD alignment

The refresh covers the three main Admin Agent jobs in the PRD:

1. **Page performance:** Explain what changed, why it matters, and what the admin should inspect next.
2. **Competitor monitoring:** Show meaningful differences in growth, posting, and content.
3. **Visitor insights:** Explain who is finding the Page and which observed activity deserves a closer look.

The prototype should also demonstrate:

- a bottom-right assistant available across the admin experience,
- a warm greeting that names the admin and Page,
- free-text input,
- one-click prompts on relevant pages,
- one proactive insight,
- multi-turn follow-up prompts,
- concise answers with focused evidence,
- a navigation action to the relevant Page view,
- a clear handoff to LinkedIn Page support when needed.

## 5. Experience boundaries

### Agent identity

- Internal product name: **Admin Agent**
- User-facing name: **Page assistant**
- Container: the existing VCA chat shell
- Human support identity: **LinkedIn Page support**

The Page assistant explains Page performance. LinkedIn Page support handles product or account help. The two should not sound like the same agent.

### Action boundary

The Page assistant may:

- explain,
- compare,
- recommend,
- show evidence,
- navigate the admin to an existing view.

It may not:

- draft or publish a post,
- boost a post,
- message a visitor,
- draft outreach,
- claim that a visitor is ready to buy.

## 6. Voice

The Page assistant sounds like a capable teammate who has already reviewed the data.

Use language that is:

- warm,
- clear,
- concise,
- specific,
- calm,
- practical.

### Writing rules

- Lead with the answer.
- Use everyday words.
- Keep the opening to one to three sentences.
- State what happened before explaining why.
- Make uncertainty clear.
- Recommend one practical next step.
- Avoid analytics jargon and promotional language.
- Do not repeat every value already shown in a card.

Prefer:

> You posted less often, which likely contributed to fewer people seeing your content.

Avoid:

> A decline in publishing cadence created a distribution challenge.

## 7. Prompt framework

This framework answers four stakeholder questions:

1. What prompts exist?
2. Where can they appear?
3. What makes them appear or disappear?
4. How many can appear at once?

> The experience has a defined pool of prompts. It shows no more than one Page prompt based on what is true, useful, and relevant in the current context.

### 7.1 Prompt types and budgets

| Prompt type | Job | Budget |
| --- | --- | ---: |
| Starter | Begin a broad conversation from a cold open | 3 in the default fixture; 0–3 when data is unavailable |
| Page prompt | Explain something visible on the current Page | 0–1 per Page |
| Proactive insight | Surface the most important new change | 0–1 active |
| Follow-up | Help the admin understand, compare, or act | 2 by default; 3 when each has a distinct job |
| Free text | Let the admin ask in their own words | Always available |

These are limits, not quotas. A Page prompt or proactive insight appears only when it earns the space.

The default prototype fixture always supports all three starters. In an unavailable-state review, remove an unanswerable starter rather than inventing a replacement to fill the quota.

### 7.2 Shared appearance rules

A Page prompt is eligible only when all of the following are true:

1. The pattern is true in the prototype data.
2. The available evidence can answer the question clearly.
3. The answer adds meaning beyond what is already obvious on the Page.
4. The answer leads to a useful and allowed next step.
5. The Page prompt has not already been answered in the current prototype session.

A prompt does not appear when:

- the data is stable or inconclusive,
- there is not enough comparable information,
- the answer would merely repeat one visible metric,
- the relevant information uses a different Page or time range,
- the prompt was already answered,
- a higher-priority prompt owns the same space.

### 7.3 Selection order

When several prompts could appear:

1. A qualifying proactive insight wins on the Page it affects.
2. Otherwise, choose the highest-priority eligible Page prompt.
3. If no prompt qualifies, show no Page prompt.

When two Page prompts have the same priority, choose the one that:

1. explains the more important change,
2. connects information the admin would otherwise have to combine,
3. leads to the clearer next step,
4. is closest to the Page content currently in view.

### 7.4 Suppression and repetition

- Show no more than one contextual Page prompt on the entire Page.
- P1 is the only Dashboard entry. When it is not active, the Dashboard slot is empty.
- On Content, Visitors, or Competitors, a proactive insight replaces the Page prompt only when it relates to that Page.
- A small unread badge may remain on the assistant entry without removing an unrelated Page prompt.
- After a Page prompt is selected, hide it for the rest of the prototype session.
- After a proactive insight is opened or dismissed, do not show its preview again in that session.
- Do not repeat a follow-up that already appears as the current question.
- Do not prepend the welcome or starter prompts when the assistant opens from a Page prompt or proactive insight.

Page prompts are not dismissible. The proactive insight is the only Page-level AI entry with a dismiss action.

For any future prototype, a session begins when its isolated route loads. Closing or minimizing chat and moving among Dashboard and Analytics do not reset it. Leaving that route or refreshing it starts a new session.

### 7.5 Prompt writing rules

- Keep prompts short and natural.
- Ask for what is not already visible.
- Use the current Page and date range without repeating them.
- Do not state the answer inside the prompt.
- Avoid vague prompts such as “Tell me more.”
- Avoid several prompts that lead to the same answer.

Prefer:

> Why did follower growth slow?

Avoid:

> Follower growth slowed because we posted less. Tell me more.

## 8. Master prompt inventory

The existing Page information architecture remains unchanged.

The refresh uses the four surfaces that have meaningful prototype content: Dashboard, Content, Visitors, and Competitors.

The PRD also names Followers, but that Page does not yet have enough content to support a useful prompt. Follower-growth insights appear on Dashboard for now. Do not add a prompt to an empty Followers Page.

### 8.1 Cold-open and proactive entries

| ID | Type and location | Visible copy | Appears when | Hidden when |
| --- | --- | --- | --- | --- |
| S1 | Starter · Empty assistant | What needs my attention this week? | The assistant opens without a Page prompt or proactive insight | The assistant opened from another entry |
| S2 | Starter · Empty assistant | What are competitors doing differently? | Competitor information is available | The assistant opened from another entry |
| S3 | Starter · Empty assistant | What should I know about my Page visitors? | Visitor information is available | The assistant opened from another entry |
| P1 | Proactive · Dashboard, mirrored by the assistant entry | Follower growth slowed 11% this month. | New followers declined and the prototype has supporting content and competitor evidence | Opened, dismissed, already answered, or data no longer supports it |

For the default prototype fixture, all three starters are available and P1 is the one active proactive insight.

### 8.2 Page prompt pool

Only the first eligible prompt in each Page’s priority order appears.

| ID | Page | Priority | Visible copy | Appears when | Hidden when |
| --- | --- | ---: | --- | --- | --- |
| C1 | Content | 1 | Why are impressions down while engagement is up? | Impressions declined while reactions or comments stayed healthy | The cross-metric pattern is not true or already answered |
| C2 | Content | 2 | What do the top posts have in common? | Enough comparable posts share a meaningful pattern | C1 qualifies, the pattern is weak, or already answered |
| V1 | Visitors | 1 | How has my visitor mix changed? | Two comparable periods show a meaningful audience change | The periods are not comparable or already answered |
| V2 | Visitors | 2 | Which visitor groups engage most with my content? | Visitor and engager groups can be compared | V1 qualifies, the groups cannot be compared, or already answered |
| K1 | Competitors | 1 | Why are competitors gaining followers faster? | At least one competitor outpaced Velora and supporting content is available | The gap is not meaningful or already answered |
| K2 | Competitors | 2 | What do competitors’ top posts have in common? | Enough current competitor posts share a useful pattern | K1 qualifies, the pattern is weak, or already answered |

Search appearances, Leads, Newsletters, and Followers do not receive Page prompts in this refresh.

### 8.3 Default prototype state

The default route demonstrates a clear, deterministic set of choices:

| Surface | Default entry |
| --- | --- |
| Cold assistant | S1, S2, and S3 |
| Dashboard, first visit | P1 |
| Dashboard, after P1 is opened or dismissed | No Page prompt |
| Content | C1 |
| Visitors | V1 |
| Competitors | K1 |

C2, V2, and K2 are alternate eligible states. They can be shown in review fixtures without appearing beside the default prompt.

### 8.4 Canonical Page slots

Prompt placement does not move around based on which candidate wins.

| Page | Canonical slot | Eligible entry |
| --- | --- | --- |
| Dashboard | Existing performance-insight area near the top of the Dashboard | P1 only |
| Content | Directly below the Content highlights and before detailed content results | C1 or C2 |
| Visitors | Directly below the visitor highlights and before visitor details | V1 or V2 |
| Competitors | Directly below the competitor highlights and before the comparison results | K1 or K2 |

When no entry qualifies, leave the slot empty rather than filling it with a generic prompt.

## 9. Proactive insight framework

The proactive insight is the hero experience.

### Resting

The assistant entry is visible without asking for attention.

### Preview

Show one short and specific change:

> Follower growth slowed 11% this month.

The preview should feel useful, not alarming. Do not stack several previews.

The full inline preview appears once in the Dashboard performance-insight slot. The assistant entry mirrors it with an unread badge and the same one-line preview on hover or focus. Both open the same conversation; they are not two separate insights.

### Open

Selecting the preview opens directly to the insight. Do not show a generic welcome first.

The response includes:

1. a clear answer,
2. one or two evidence cards,
3. one navigation action,
4. two or three follow-up prompts.

### Opened

The preview is marked as seen. The insight remains in the conversation history for the prototype session.

### Dismissed

The preview disappears and does not return during the session. The regular Page prompt may take its place when eligible.

## 10. Conversation contract

Most responses follow this order:

1. **Answer:** What happened?
2. **Evidence:** What supports the answer?
3. **Meaning:** Why does it matter?
4. **Action:** Where should the admin look next?
5. **Follow-ups:** What is the most useful next question?

### Response limits

- One primary conclusion
- One-to-three-sentence opening
- Zero to two evidence cards
- No more than three rows or items in a card
- One primary navigation action
- Two follow-ups by default
- Three follow-ups only when they offer distinct paths such as understand, compare, and act

The weekly briefing may include up to three separate findings. It should not turn unrelated findings into one causal story.

### Entry behavior

- Cold open: show the greeting and S1–S3.
- Page prompt: show the selected prompt as the user’s message, then answer it.
- Proactive insight: open directly to the answer without adding a fake user message.
- Follow-up: preserve the current conversation context.
- Free text: match an existing scripted intent when possible; otherwise give a short prototype limitation and keep the available prompts visible.

## 11. Rich UI card framework

Cards support the answer. They do not replace it.

The number of values in a card follows the evidence relationship—not a fixed visual template.

### 11.1 When to show zero, one, or two cards

| Card count | Use when |
| ---: | --- |
| 0 | The answer is simple, stable, unsupported, or does not benefit from structured evidence; unavailable answers also usually use no card |
| 1 | One evidence relationship is enough to support the conclusion |
| 2 | Two different evidence relationships are both necessary to support the same conclusion |

Never add a second card merely because more data is available. Additional detail belongs in a follow-up or on the destination Page.

An unavailable answer may use one card only when the card clearly distinguishes what is available from what is missing.

The card count refers to top-level evidence containers. A post-list or person-list card may contain several compact entity tiles; those tiles do not count as separate evidence cards.

### 11.2 Evidence jobs

| Evidence job | Question answered | Preferred pattern |
| --- | --- | --- |
| Change | What changed and when? | One metric with trend |
| Difference | How do periods, Pages, or groups compare? | Focused comparison |
| Makeup | Who or what makes up this audience? | One audience breakdown |
| Examples | Which posts or people support the explanation? | Short entity list |

Choose the evidence job before choosing a UI component.

### 11.3 Data density

| Pattern | Allowed content | Limit |
| --- | --- | --- |
| Metric with trend | One metric, current value, change, and time series or prior value | One metric |
| Comparison | Periods, Pages, or groups using the same measures | 2–3 rows; no more than 2 measures per row |
| Audience breakdown | Categories within one demographic dimension | Top 3 categories, with “Other” only when needed |
| Post or entity list | Items that all support the same pattern | Up to 3 items |
| Person list | People ranked by the same observable relevance rule | Up to 3 people |

A card may contain several values when their relationship creates the meaning.

Good:

> Velora: 420 new followers and 12 posts
>
> BrightBenefits: 1,280 new followers and 22 posts

These values belong together because they create one comparison.

Avoid combining unrelated values such as visitors, follower total, button clicks, competitor posts, and visitor seniority in one card.

### 11.4 Card anatomy

Every evidence card should contain only what it needs:

1. A short heading that names the evidence relationship
2. The values, rows, or entities that prove it
3. A clear time range or comparison basis
4. A compact source and freshness line when numbers are shown
5. An optional visual only when it helps identify an entity or pattern

The response owns the primary navigation action. Individual evidence cards should not compete with separate primary actions.

### 11.5 Card inclusion test

Before adding a card, row, or value, ask:

1. What conclusion does this prove?
2. Would removing it weaken the conclusion?
3. Does it use the same Page, time range, and comparison basis?
4. Is the relationship clear without studying the card?
5. Is the same information already stated elsewhere?

If there is no strong answer, remove it.

### 11.6 Shared card rules

- One card proves one relationship.
- Every value supports the same conclusion.
- Use cards for exact evidence and conversation text for meaning.
- Do not repeat every card value in the response.
- Avoid miniature dashboards.
- Avoid decorative cards.
- A person card explains observed activity, not buying intent.

### 11.7 Prompt-to-response and card map

| Entry | Answer focus | Evidence cards | Primary action |
| --- | --- | --- | --- |
| P1 | Follower growth slowed; posting frequency is the clearest difference to explore | Change: follower trend; Difference: Velora vs. BrightBenefits | View competitor comparison |
| S1 | The most important one to three Page changes this week | One card for the highest-priority finding | View the top finding |
| S2 or K1 | The clearest competitor growth, posting, or content difference | Difference: Page comparison; Examples: one post-list card with up to two competitor posts | View competitor comparison |
| S3 or V1 | The largest visitor groups and most meaningful change | Makeup: one audience dimension; Change: current vs. previous mix when needed | View visitor demographics |
| C1 | Impressions fell while engagement stayed healthy; lower publishing volume is the clearest pattern to explore | Difference: current vs. previous posting volume; Examples: one post-list card with up to two posts | View content performance |
| C2 | The one or two patterns shared by top posts | Examples: one post-list card with up to three posts | View top posts |
| V2 | Which aggregate visitor groups are overrepresented among engagers | Difference: visitors vs. engagers for one demographic dimension | View visitor demographics |
| K2 | The one or two patterns shared by top competitor posts | Examples: one post-list card with up to three competitor posts; Difference: format or cadence only when necessary | View competitor posts |

### 11.8 Follow-up inventory

| Entry | Follow-ups |
| --- | --- |
| P1 | Which posts drove the most follows? · What do their top posts have in common? · What should I focus on next? |
| S1 | Why did follower growth slow? · What are competitors doing differently? · What should I focus on next? |
| S2 | Why is follower growth different? · What do their top posts have in common? |
| K1 | What do their top posts have in common? · How does our content compare? |
| S3 | How has my visitor mix changed? · Which visitor groups engage most? |
| V1 | Which visitor groups engage most? · Which recent visitors deserve a closer look? |
| C1 | What do the top posts have in common? · How does this compare with competitors? |
| C2 | Which topics should I reuse? · How does this compare with competitors? |
| V2 | How has my visitor mix changed? · Which recent visitors deserve a closer look? |
| K2 | How does our content compare? · What should I focus on next? |

S1 follow-ups reflect the findings returned in the briefing. The table shows the default prototype fixture, where follower growth and competitor activity are the leading findings.

### 11.9 Follow-up response map

A selected follow-up creates another assistant response. It may include zero to two evidence cards and zero or one next prompt. The composer always remains available; the experience does not need to keep producing prompt chips indefinitely.

| Follow-up | Answer focus | Evidence | Primary action | Optional next prompt |
| --- | --- | --- | --- | --- |
| Why did follower growth slow? | Lower posting frequency is the clearest pattern to explore | Follower trend and Page comparison | View competitor comparison | What do their top posts have in common? |
| Which posts drove the most follows? | The two Velora posts with the most attributed follows | One post-list card with up to two posts | View top posts | What do these posts have in common? |
| What do these posts have in common? | The shared topic or format across the selected Velora posts | Keep the visible post-list card; add no duplicate card | View top posts | Which topics should I reuse? |
| What are competitors doing differently? | The clearest difference in growth, posting, or content | Page comparison and up to two competitor posts | View competitor comparison | What do their top posts have in common? |
| Why is follower growth different? | The follower and posting gap between Velora and the leading competitor | One focused comparison card | View competitor comparison | What do their top posts have in common? |
| What do their top posts have in common? | The shared topic, format, or structure across competitor posts | One post-list card with up to three posts | View competitor posts | How does our content compare? |
| How does our content compare? | The most meaningful difference between Velora and competitor content | One focused content comparison | View competitor comparison | Which topics should I reuse? |
| What should I focus on next? | One practical next step based on evidence already shown | Usually no new card | View content performance | None |
| How has my visitor mix changed? | The largest audience change across comparable periods | One audience-change card for one dimension | View visitor demographics | Which visitor groups engage most? |
| Which visitor groups engage most? | The group most overrepresented among engagers | One visitors-vs.-engagers comparison | View visitor demographics | Which recent visitors deserve a closer look? |
| Which recent visitors deserve a closer look? | Up to three visitors ranked by the same observable relevance rule | One person-list card with up to three people | View Page visitors | Why do these visitors stand out? |
| Why do these visitors stand out? | The observed activity and shared relevance rule behind the ranking | Keep the visible person-list card; add no duplicate card | View Page visitors | None |
| What do the top posts have in common? | The one or two patterns shared by Velora’s top posts | One post-list card with up to three posts | View top posts | Which topics should I reuse? |
| Which topics should I reuse? | One or two evidence-backed themes to revisit | Usually no new card when the supporting posts are already visible | View content performance | None |
| How does this compare with competitors? | The most relevant Page-versus-competitor difference for the current content question | One focused comparison card | View competitor comparison | What do their top posts have in common? |

## 12. Canonical prototype journeys

These five review paths form three connected stories rather than five separate assistant experiences:

1. **Something changed:** Journeys 1, 3, and 4 connect Page performance, content, and competitors in one conversation.
2. **Brief me:** Journey 2 provides the weekly overview.
3. **Who is finding us:** Journey 5 covers visitors and audience changes.

### Journey 1: Proactive follower-growth insight

**Entry**

> Follower growth slowed 11% this month.

**Assistant answer**

> Velora added 420 followers this month, down 11%. You posted 12 times while BrightBenefits posted 22 times and added 1,280 followers, making posting frequency the clearest difference to explore.

**Evidence**

- Follower trend
- Velora and competitor posting comparison

**Action**

> View competitor comparison

**Follow-ups**

- Which posts drove the most follows?
- What do their top posts have in common?
- What should I focus on next?

### Journey 2: Weekly briefing

**Prompt**

> What needs my attention this week?

**Assistant behavior**

Share no more than three findings across Page performance, content, visitors, and competitors. Rank them by usefulness. Do not manufacture a problem when performance is stable.

**Action**

Open the view supporting the most important finding.

### Journey 3: Content diagnosis

**Prompt**

> Why are impressions down while engagement is up?

**Assistant answer**

> You posted less often, which likely contributed to fewer people seeing your content. The people who did see it still reacted and commented at a healthy rate.

**Evidence**

- Current and previous posting volume
- Two posts that support the pattern

**Action**

> View content performance

**Follow-ups**

- What do the top posts have in common?
- How does this compare with competitors?

### Journey 4: Competitor briefing

**Prompt**

> What are competitors doing differently?

**Assistant answer**

> BrightBenefits gained followers faster and posted more often than Velora. Its strongest posts use short, practical enrollment checklists tied to deadlines.

**Evidence**

- Follower growth and posting comparison
- Up to two representative competitor posts

**Action**

> View competitor comparison

**Follow-ups**

- Why is follower growth different?
- What do their top posts have in common?

### Journey 5: Visitor briefing

**Prompt**

> What should I know about my Page visitors?

**Assistant answer**

> Human Resources remains the largest visitor group, and more visitors now hold senior roles. This shows who is finding the Page; it does not confirm buying intent.

**Evidence**

- Visitor makeup
- Current and previous visitor mix

**Action**

> View visitor demographics

**Follow-ups**

- How has the visitor mix changed?
- Which visitor groups engage most?

## 13. Person-level visitor guidance

Named visitors may appear because the existing prototype already shows Page visitors.

When showing a person:

- explain the observed activity,
- say why it may be relevant,
- avoid intent scores,
- avoid labels such as “hot lead” or “ready to buy,”
- do not recommend outreach,
- navigate to the existing visitor view.

Prefer:

> Cheri returned to the Page and viewed two benefits-operations posts.

Avoid:

> Cheri is a high-intent lead who needs a reply.

## 14. Fake data rules

The prototype data is fictional, but the story must be consistent.

- Keep Rose and Velora.
- Use one time range within each answer and card.
- Weekly briefing: last seven complete days versus the previous seven.
- Analytics prompts: inherit the visible page range.
- Monthly insights: compare with the previous complete month.
- Never silently switch ranges.
- Show a compact source line when a response includes numbers.
- Do not combine separate demographic percentages as if they describe the same people.
- Do not claim a cause when the prototype only shows a pattern.
- Do not claim target-audience match unless the target audience is explicitly shown.

Example source line:

> May 11–June 9 · Velora Page Analytics · Updated June 10

## 15. Supporting states

Stakeholders should be able to review the rules in each of these states.

### 15.1 Prototype state matrix

| State | What appears | Prompt and card behavior |
| --- | --- | --- |
| Cold assistant | Greeting, composer, S1, S2, and S3 | No answer cards until a prompt is selected |
| Page prompt eligible | The highest-priority eligible prompt | No other contextual prompt appears elsewhere on that Page |
| Several Page prompts eligible | Only the highest-priority prompt | Lower-priority prompts remain hidden |
| Proactive insight active | Full P1 preview on Dashboard; unread badge and one-line peek on the assistant entry | Both entries open the same insight; no evidence card appears until opened |
| Proactive insight opened | Direct answer, evidence, action, and follow-ups | No generic welcome; preview is marked seen |
| Proactive insight dismissed | No proactive preview | The Dashboard slot is empty; P1 does not return that session |
| Page prompt answered | Completed conversation in the assistant | The originating Page prompt stays hidden that session |
| Stable data | No Page prompt | Quiet assistant entry remains available |
| Not enough data | Short explanation | No evidence card that implies a conclusion |
| Data unavailable | Specific limitation and nearest useful destination | Use a card only if it clarifies available versus missing information |
| Unsupported request | Clear boundary and safe alternative | No decorative or unrelated evidence card |
| Support request | Offer or begin LinkedIn Page support handoff | Do not mix Admin Agent prompts into the support conversation |

### 15.2 Approved state language

#### Stable

> Page performance was generally stable. I did not find a change that needs immediate attention.

#### Not enough data

> There is not enough recent data to make a reliable comparison yet.

#### Unavailable

> I cannot compare competitors because no competitor Pages are selected.

#### Unsupported

> I cannot publish or message people, but I can show the relevant Page data and help you decide what to do next.

#### Support handoff

> I can connect you with LinkedIn Page support for help with your account or product settings.

## 16. Route isolation

The refresh is not currently implemented. Its former isolated V2 route has been removed.

If the refresh is rebuilt, use these implementation rules:

- Do not change `/premium-company-pages/admin`.
- Reuse the existing admin shell and Page content.
- Give the new route its own prompt, conversation, and card configuration so changes cannot leak into existing routes.
- Reuse existing chat and response components before creating new ones.
- Do not change shared component behavior solely for this prototype.
- Preserve responsive behavior on narrow screens.

## 17. Completion checklist

- The current admin route is unchanged.
- Only the AI interaction layer is refreshed.
- The assistant uses the Page assistant identity.
- The five canonical journeys work from entry to navigation.
- Every visible prompt has a clear job.
- Every prompt follows the inventory, eligibility, priority, and suppression rules.
- No Page shows more than one contextual prompt at a time.
- Each response leads with a concise answer.
- Cards provide focused evidence.
- Each card has a defined evidence job and follows the density limits.
- Every prompt uses the mapped response, cards, action, and follow-ups.
- Follow-ups move the conversation forward.
- Proactive insight behavior is demonstrated.
- Copy is warm, clear, and free of jargon.
- Fake data remains internally consistent.
- No flow publishes, boosts, messages, or drafts outreach.
- The inbox tray and non-agent UI remain unchanged.
- The experience works at desktop and narrow widths.

## 18. Confirmed decisions

- Use a separate route.
- Leave the current route untouched.
- Refresh prompts, conversations, proactive entries, and in-chat cards.
- Preserve the surrounding admin experience.
- Keep Rose, Velora, and the current visual language.
- Treat the Admin Agent as the Page assistant inside the VCA chat shell.
- Include proactive insights and follow-up prompts.
- Use Dashboard, Content, Visitors, and Competitors as the prompt surfaces.
- Leave Followers out until that page has enough content to support a useful prompt.
- Favor simplicity, concise responses, and warm language.
