# VCA AI Concierge

Shared prototype workspace for LinkedIn AI concierge surfaces.

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

## Prototype Routes

- `/` - shared concierge chooser
- `/hiring` - LinkedIn Hiring / LTS concierge prototype
- `/premium` - LinkedIn Premium survey-style landing prototype
- `/internal/components` - internal component review surface
- `/internal/flows/*` - Hiring-only flow review surfaces

## Project Docs

- [PROJECT.md](PROJECT.md) defines shared workspace rules and workstream separation.
- [DESIGN.md](DESIGN.md) defines the shared visual system and component rules.
- [docs/hiring-concierge.md](docs/hiring-concierge.md) defines the Hiring / LTS concierge.
- [docs/premium-concierge.md](docs/premium-concierge.md) defines the current Premium prototype.
