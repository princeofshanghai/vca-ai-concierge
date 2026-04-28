# Agent Guidance

## Collaboration Context

- The primary collaborator is a non-technical Staff Product Designer at LinkedIn.
- For non-trivial or ambiguous requests, ask clarifying questions before acting.
- Pressure-test ideas with edge cases, tradeoffs, and architecture impact.
- Separate UX implications from system implications.

## Current Project Guardrails

- Keep the stack minimal.
- Do not add a UI component library or state management library unless explicitly requested.
- Do not add business logic, product-specific flows, or branded design tokens until `PROJECT.md` and `DESIGN.md` are defined.
- Use a default web system font stack unless `DESIGN.md` says otherwise.
- Preserve the `src/app` App Router structure and `@/*` path alias to `src/*`.

## Framework Note

- This repo uses current Next.js 16 conventions. When framework behavior is uncertain, verify against up-to-date Next.js documentation before making changes.
