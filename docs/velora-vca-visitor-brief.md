# Velora Consulting VCA — Visitor Side Prototype Brief

## What this is

This is a design brief for a vibe-coded prototype of the **visitor-facing VCA (Virtual Chat Assistant)** on a fictional LinkedIn Premium Company Page for **Velora Consulting** — a boutique product strategy and UX consultancy.

The prototype is a **visionary executive demo**, not a production build. The goal is to show a coherent, believable full-loop story: a visitor lands on Velora's LinkedIn Page, the VCA helps them evaluate the firm as a potential partner, and they convert (book a discovery call). The admin side of the story is out of scope for this prototype.

Do not start building yet. Read this brief fully and suggest a sequenced plan of what to build and in what order.

---

## Company and persona context

- **Company**: Velora Consulting
- **What they do**: Boutique product strategy and UX consultancy, 11–50 employees
- **Page admin / owner**: Skylar Truong, owner-founder who also moonlights as the company's marketer
- **Skylar's job**: Grow the business through LinkedIn without building a large marketing operation — turn Page visitors into qualified conversations
- **Visitor persona**: Mid-market SaaS or professional-services buyers evaluating consultancies as potential partners — typically a product leader, head of design, or founder at a 50–500 person company
- **Page features shown**: Gold LinkedIn `in` logo, verified badge, dynamic cover image, custom CTA, credibility highlights, client testimonial
- **Subscription**: LinkedIn Premium Company Pages ($99.99/month)

---

## Existing chat UI components — reuse where possible

We already have chat UI components scaffolded from previous VCA projects (LinkedIn Hiring concierge and LinkedIn Premium member survey). When building the panel and conversation UI, **reuse existing styles, tokens, and components where relevant** rather than inventing new ones. This includes:

- Message bubble styles (assistant and user)
- Suggested prompt chip styles
- Panel header pattern (avatar, name, subline, close button)
- Input row (text field + send button)
- Trust/footer bar
- General spacing, border-radius, and color tokens

Where components need to be extended or adapted for this use case (proof cards, action cards, confirmation card), build on top of the existing foundation — don't fork a parallel system. The goal is one coherent VCA design language across all LinkedIn assistant surfaces.

---

## Three entry points — all open the same panel

There are three distinct entry points on the Page. They are visually related (same icon, same color treatment) so the visitor learns the pattern. All three open the **same chat panel component**. Only the VCA's opening message changes based on which entry point was used.

### Entry point 1 — Primary (header)
- A dedicated **"Ask Velora"** button in the Page header, sitting alongside the existing "Follow" and "Book a call" buttons
- Skylar's custom CTA ("Book a call") stays as-is — the VCA gets its own separate button
- This is the highest-intent entry point — visitor is at the top of the Page and choosing to engage
- VCA opens with the standard suggested prompt chips

### Entry point 2 — Secondary (persistent anchor)
- A small pill anchored to the **right edge of the screen**, always visible as the visitor scrolls
- Appears after a few seconds of dwell time; disappears once the panel is open
- Could collapse to icon-only after the visitor scrolls past a certain depth
- VCA opens with the standard suggested prompt chips (same as primary, no specific context)
- Needs a dismiss state — once dismissed, stays gone for the session

### Entry point 3 — Tertiary (contextual inline nudges)
- Short nudge prompts **embedded within specific Page sections**, below the content of that section
- Each nudge is specific to the section it lives in and passes context to the VCA
- Examples:
  - Below Services section: *"Not sure which engagement type fits your situation? I can help."*
  - Below Client work / case studies: *"Curious if Velora has worked with companies like yours?"*
- VCA opens with a contextually specific opening message, not the generic chips

---

## Three chat panel UI options to prototype and experiment with

All three options use the **same internal panel design** (header, messages, chips, action cards, input). What differs is how the panel sits relative to the LinkedIn Page.

### Option A — Split page
- When triggered, the Page content shifts left (~60%) and the chat panel occupies the right ~40%, sliding in
- Page stays fully visible alongside the chat
- Most native-feeling but crushes LinkedIn's 3-column layout at real screen widths
- Best for storytelling; hardest to implement faithfully

### Option B — Right rail takeover
- The existing LinkedIn right sidebar fades out and the chat panel replaces it in the same column
- Main content column is completely untouched
- Feels most like a real LinkedIn design pattern
- Rail is narrower — panel design needs to be tight

### Option C — Overlay drawer
- Full-height panel slides in from the right, overlaying the Page
- A subtle scrim dims the Page behind it
- Most design freedom — proper width, full height
- Easiest to build; slightly more modal-feeling than native
- **Recommended for prototyping first**, then frame as Option B in the narrative

---

## The visitor journey to prototype

This is the hero scenario: **Evaluate → Convert**

The visitor is a product leader at a mid-market SaaS company evaluating consultancies for a strategic engagement.

### Turn-by-turn flow

**Turn 1 — Opening state**

VCA message:
> "Hi! What brings you to Velora today?"

Below the message, three suggested prompt chips:
- "See if Velora is the right fit for us"
- "Learn about services and pricing"
- "Book a discovery call"

Visitor selects: **"See if Velora is the right fit for us"**

---

**Turn 2 — Qualify (conversational, not a form)**

VCA message:
> "Happy to help with that. What kind of company are you at — and what's the challenge you're trying to solve?"

Visitor types:
> "We're a B2B SaaS company, about 80 people. We need help with product strategy for a new market expansion."

---

**Turn 3 — Surface proof (specific to what they said)**

VCA message:
> "That's a strong fit for how Velora works. A lot of our engagements with SaaS companies start with exactly that — a focused strategy sprint ahead of a new market push. Here's a relevant example."

Followed by a **proof card** (distinct from a message bubble):
- Label: "Client story"
- Title: "How Velora helped a SaaS team define a wedge strategy for a new vertical"
- Body: "An 80-person B2B SaaS company engaged Velora for a 6-week product strategy sprint ahead of entering the healthcare vertical. Delivered a prioritized opportunity map and go-to-market narrative."
- Link: "See the full case study →"

---

**Turn 4 — Handle objection + earn the ask**

Visitor types:
> "What does an engagement like that actually cost? And how is Velora different from a bigger consultancy?"

VCA message:
> "A focused strategy sprint typically runs 4–8 weeks and is scoped as a fixed-fee engagement — most fall in the $25k–$60k range depending on scope and team involvement. On the boutique-vs-big question: Velora's work is done by senior practitioners, not handed off to juniors after the pitch. Skylar and the leads stay hands-on throughout. The fastest way to know if it's a fit is a 30-minute discovery call — no pitch, just a real conversation about your situation."

Followed by an **action card** (distinct styled component):
- Label: "Recommended next step"
- Title: "Book a 30-min discovery call"
- Subtitle: "With Skylar or a senior Velora strategist"
- CTA button: "Pick a time" (with calendar icon)

---

**Turn 5 — Booking confirmation (inline, no separate form)**

Visitor clicks "Pick a time" and selects a slot inline.

VCA shows a **confirmation card**:
- "You're booked — Thursday, Jun 5 at 10:00 AM PT"
- "I've shared a summary of what you're working on with Skylar so your call can get straight to the substance. Check your email for the invite."

The confirmation card uses a success/green treatment to distinguish it visually.

---

## Panel anatomy (consistent across all three layout options)

The internal panel always has the same structure:

1. **Header** — Velora logo/avatar, assistant name ("Velora Consulting"), subline ("Ask me anything about Velora"), close button (X)
2. **Message thread** — scrollable, alternating assistant and user bubbles
3. **Suggested prompt chips** — shown in the opening state; disappear once conversation starts
4. **Proof cards** — structured card component distinct from bubbles; used to surface case studies, client stories, or capability highlights
5. **Action cards** — distinct CTA component with label, title, subtitle, and button; used for the booking prompt
6. **Confirmation card** — green-tinted success state shown after booking
7. **Trust bar** — thin line above input: "Powered by Velora Consulting · Your data is private"
8. **Input area** — text input + send button; always visible

---

## Design principles to keep in mind

- The VCA should feel like it belongs to Velora Consulting, not like a generic LinkedIn chatbot
- The panel should feel premium and native — reuse existing VCA component foundations from Hiring and Premium concierge work
- Suggested prompts show intelligence — the VCA is already anticipating likely visitor intents
- Proof and action cards are visually distinct from message bubbles — they are structured UI components, not just text
- The booking confirmation should feel like the end of a conversation, not a handoff to a cold form — the context the visitor shared carries forward
- All three entry points should be visually related — same icon, same color — so the visitor learns the pattern quickly

---

## What to do next

Do not start building yet. Based on everything above, suggest:

1. A recommended build sequence (what to scaffold first, what to layer in)
2. Which panel option (A, B, or C) to start with and why
3. Any clarifying questions before you begin
4. Any assumptions you'd make about tech stack or tooling

