# Blank App Foundation

Minimal app scaffold built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, ESLint, and npm.

## Stack

- Next.js 16 with the App Router
- React 19
- TypeScript with `strict` mode
- Tailwind CSS 4
- ESLint
- `@/*` path alias mapped to `src/*`

## Scripts

Run the local development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Open [http://localhost:3000](http://localhost:3000) after starting the dev server.

## Structure

- `src/app` route segments, pages, and layouts
- `src/components` shared UI components
- `src/lib` framework-agnostic helpers
- `src/styles` global styling
- `PROJECT.md` product definition placeholder
- `DESIGN.md` design definition placeholder
- `AGENTS.md` collaboration guidance for coding agents

## Current State

- Neutral system-font foundation
- Minimal global styles
- Placeholder internal component gallery at `/internal/components`
- No business logic, state library, UI component library, or brand-specific tokens yet

## Next Steps

- Write `PROJECT.md` to define product scope, users, and flows.
- Write `DESIGN.md` to define visual direction and shared UI rules.
- Start adding app-specific components only after those two documents are in place.
