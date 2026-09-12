# EventScape

A reproducible computational laboratory for studying how recommendation policies influence synthetic social exposure, event participation, provider concentration, and network formation.

> The included results are exploratory software demonstrations, not empirical findings about real populations.

## Deliverables

- SvelteKit research interface: landing narrative, result report, interactive laboratory, methodology, and model card.
- Elysia API with runtime validation, bounded experiments, security headers, and generated OpenAPI documentation.
- Deterministic simulation core with four policies and matched-seed comparisons.
- Independent artifact worker and JSON/CSV publication export.
- PostgreSQL/Prisma persistence contract.
- Publishable technical manuscript in `PUBLICATION.md`.

## Quick start

### Recommended: complete Docker stack

1. Optionally copy configuration: `cp .env.example .env`
2. Start PostgreSQL, run migrations and deterministic seed data, start the API, build/start the web app, and generate worker artifacts: `docker compose up --build`
3. Open the application at `http://localhost:5373`
4. Open API documentation at `http://localhost:3300/api/v1/openapi`

PostgreSQL data persists in the `eventscape-postgres` named volume. Worker artifacts persist in `eventscape-artifacts`. Stop services with `docker compose down`. To deliberately delete all local database and artifact data, use `docker compose down -v`.

The `db-init` service applies `prisma/migrations/20260912000000_initial/migration.sql` and executes `prisma/seed.ts`. Seeding is idempotent: it upserts the canonical scenario and updates or creates one canonical 32-run experiment.

### Native development

1. Install dependencies: `bun install`
2. Verify the complete project: `bun run verify`
3. Generate publication data: `bun run generate:results`
4. Start the API: `bun run dev:api`
5. In another terminal, start the web app: `bun run dev:web`
6. Open `http://localhost:5173`; API documentation is at `http://localhost:3000/api/v1/openapi`.

The prepared landing and results pages work without the API. The interactive laboratory requires the API.

## Commands

| Command | Purpose |
|---|---|
| `bun test` | Run scientific-core and API tests |
| `bun run typecheck` | Check TypeScript and Svelte |
| `bun run build` | Build declarations and the web application |
| `bun run verify` | Run all release gates |
| `bun run generate:results` | Write canonical JSON and CSV research artifacts |
| `bun run worker` | Write worker artifacts to `artifacts/canonical` |
| `bun run dev:api` | Start Elysia API on port 3000 |
| `bun run dev:web` | Start SvelteKit development server |
| `bun run container:up` | Build and start the complete Compose stack |
| `bun run container:down` | Stop the Compose stack without deleting data |
| `bun run db:seed` | Seed the configured PostgreSQL database |

## PostgreSQL persistence

The containerized API uses PostgreSQL through Prisma. Native API tests inject an in-memory repository so tests do not require infrastructure. Outside tests, setting `DATABASE_URL` activates `PrismaExperimentStore`; omitting it uses the in-memory fallback for lightweight local development.

## Scientific boundaries

Read `PUBLICATION.md`, `BRD.md`, `SYSTEM_DESIGN.md`, `research/metric-dictionary/v1.md`, and `apps/web/src/routes/about/model-card/+page.svelte` before interpreting results. Changes to the model equation, tie dynamics, policy semantics, metrics, random behavior, or reproduction format require a versioned ADR.

## Framework sources

- SvelteKit: https://svelte.dev/docs/kit/introduction
- Svelte 5: https://svelte.dev/docs/svelte/overview
- Elysia validation: https://elysiajs.com/essential/validation.html
- Elysia OpenAPI: https://elysiajs.com/plugins/openapi.html
- Prisma PostgreSQL: https://www.prisma.io/docs/orm/overview/databases/postgresql
- Prisma Client generation: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client
