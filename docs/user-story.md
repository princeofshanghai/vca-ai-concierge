# Premium Concierge User Story

## Persona

Alex Kim is a founder/operator at a 10-person startup.

Alex is considering LinkedIn Premium, but his goals are not cleanly one thing. He wants to find customers, build visibility, and may need to hire later. He is interested in the free trial because it lowers the risk of starting, but the trial does not answer his harder question: which plan is actually right for what he is trying to do?

Alex is useful as a prototype persona because he starts with ambiguous intent. He is not simply a job seeker, and he is not already certain he needs Business Suite. The experience needs to help him make sense of mixed goals before a recommendation can feel credible.

## User Story

Alex enters the Premium survey with curiosity but not certainty. He sees the 1-month free trial and wants to understand whether Premium is worth trying. At this point, the concierge should not immediately hard-sell a plan. It should act as a guide that helps Alex understand the free trial, compare paths, and clarify what Premium is supposed to help him accomplish.

As Alex shares more context, his needs become clearer. He is trying to build customer pipeline and visibility for his startup, while keeping future hiring in mind. That moves the conversation away from a Career-oriented recommendation and toward a more business-oriented plan comparison.

The concierge helps Alex compare Business and Business Suite in plain language. Business is useful for research, networking, profile credibility, and company insights. Business Suite becomes more relevant when the work spans finding customers, growing reach, and possibly hiring later.

By the end of the flow, Business Suite is recommended because it connects to Alex's stated goals: customer development, visibility, and possible hiring in one plan. The recommendation should feel earned because it follows from the context Alex provided, rather than appearing as a cold SKU push.

## Root JTBD

When I am considering Premium but my goals span business growth, visibility, and future hiring, help me understand the right plan and trial path so I can start with confidence instead of guessing.

## Design Insight

The free trial gets attention, but plan confidence drives action.

If the concierge recommends too early, it can feel like a sales banner inside a chat surface. If it first helps the member clarify intent, answer trial questions, and compare realistic alternatives, the same recommendation feels useful and credible.

## Experience Arc

1. Alex notices the free-trial hook and opens the concierge.
2. The concierge explains the trial without forcing a plan recommendation.
3. Alex shares that he has mixed goals.
4. The concierge clarifies that Career fits job seeking, while Business and Business Suite fit business growth.
5. Alex compares Business and Business Suite.
6. The concierge recommends Business Suite once the context supports it.
7. Alex can start the free trial with more confidence that he is testing the right plan.

## Prototype Framing

The live `/premium` prototype remains the interactive playground. The concierge stays broadly Premium-focused while the prompt chips change with page context.

The static **Low signal** flow shows the recommendation being earned through conversation. The static **High signal** flow shows the case where enough signal already exists, so the assistant can lead with a short rationale, show the Business Suite card immediately, and then provide escape-hatch prompts.
