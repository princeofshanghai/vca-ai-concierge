# Visitor Loop

Source-of-truth narrative and dialogue for Stories 2 and 3 in the Premium Company Pages VCA executive demo.

Related docs:

- [Framing and personas](./framing-personas.md)
- [Admin demo stories](./admin-demo-stories.md)
- [Design decisions](./design-decisions.md)
- [Shared AI response formatting rules](./ai-response-formatting.md)
- [Executive demo outline](../vca-executive-demo-outline.md)

## Story 2: Visitor Experience

Cheri Sparks, VP of HR at a 12,000-person retail company, is quietly evaluating benefits platforms before the next open enrollment season.

She is managing three carriers across spreadsheets and an HRIS that breaks every October.

She finds Velora's LinkedIn Page. It looks credible, but she has seen polished vendor pages before.

Before she leaves, a subtle chat nudge appears. It is not a popup and not an interruption.

Nudge:

> See how Velora helps large HR teams manage benefits across multiple carriers.

Cheri opens the chat and asks the question that actually matters:

> What happens to our benefits enrollment if we switch platforms mid-year?

VCA gives a specific answer in Velora's voice. It does not deflect to "book a demo."

VCA then offers a warm handoff:

> Want to connect with Velora's team? I can send them a message with the context from our conversation - you will not have to explain any of this again.

Cheri sees a pre-filled LinkedIn message, edits one line, and sends.

Outcome:

- total time under three minutes,
- no form fill,
- no calendar booking,
- no forced sales funnel,
- Cheri stays in control of the message she sends.

## Visitor-Side Dialogue

Peek prompt:

> See how Velora helps large HR teams manage benefits across multiple carriers.

Cheri taps. Panel opens pre-loaded, without a generic greeting.

VCA:

> Velora is built for HR teams managing complex, multi-carrier benefits at scale. What's on your mind?

Cheri:

> What happens to our benefits enrollment if we switch platforms mid-year?

VCA:

> Mid-year transitions are one of the most common concerns we hear, and Velora is designed to handle them without disrupting active enrollments. Your existing employee elections are migrated directly into Velora before go-live, so no one needs to re-enroll. During the transition, your current carrier connections stay live in parallel until Velora's integrations are fully verified. Most teams are fully operational within 3-4 weeks. What's your current setup - how many carriers are you managing?

Cheri:

> Three carriers. We also have seasonal workers who enroll at different times of year.

VCA:

> That's exactly the kind of complexity Velora handles well. Seasonal and variable-schedule workers can be configured with separate enrollment windows, so they do not go through the standard open enrollment cycle. Your three carrier connections would be set up and tested in Velora before migration, so by the time you go live, everything is already verified. No surprises in October.
>
> Want me to connect you with Velora's team? I can send them a message with the context from our conversation, so you will not have to explain any of this again.

Cheri taps:

> Send message on my behalf.

## Pre-Filled Message

Editable draft shown to Cheri:

> Hi - I'm VP of HR at a 12,000-person retail company, currently managing benefits across 3 carriers. I have questions about mid-year platform migration and how Velora handles seasonal workers with variable enrollment windows. Open to a conversation if the timing makes sense.

Cheri changes:

> Open to a conversation if the timing makes sense.

to:

> Would love to connect.

Final sent message:

> Hi - I'm VP of HR at a 12,000-person retail company, currently managing benefits across 3 carriers. I have questions about mid-year platform migration and how Velora handles seasonal workers with variable enrollment windows. Would love to connect.

## Story 3: Admin Receives

Rose receives a useful notification, not only "you have a new message."

Notification:

> High-intent visitor: Cheri Sparks, VP of HR, 12,000-person retail company - asked about mid-year platform migration and seasonal worker enrollment. She sent you a message.

Dashboard lead card:

- **Cheri Sparks** - VP of HR
- Retail company
- 12,000 employees
- 2nd degree connection
- Asked about: mid-year migration, seasonal enrollment windows, multi-carrier setup
- Actions: **View message**, **Ask AI**

Inbox message:

> Hi - I'm VP of HR at a 12,000-person retail company, currently managing benefits across 3 carriers. I have questions about mid-year platform migration and how Velora handles seasonal workers with variable enrollment windows. Would love to connect.

## VCA Context Summary

By default, Rose sees Cheri's sent message plus a VCA context summary, not the full visitor transcript.

Context summary:

- Cheri appears to match Velora's target enterprise audience.
- She asked about mid-year platform migration.
- She has three carriers.
- She has seasonal workers with variable enrollment windows.
- She is evaluating before the next open enrollment season.

## AI-Drafted Reply

Editable reply:

> Hi Cheri - thanks for reaching out. Mid-year migrations with multi-carrier complexity are something we have done a lot, and seasonal enrollment windows are a feature we built specifically for situations like yours. Happy to walk you through how it works for a team your size. Are you free for a quick call this week?

## Story 2-3 Acceptance Criteria

- Cheri receives a useful answer before any handoff.
- The handoff is a warm LinkedIn message, not a form or calendar booking.
- Cheri edits and sends the message herself.
- Rose sees the sent message and VCA context summary by default.
- The demo does not imply full visitor transcripts are exposed by default.
