# EventScape: A Reproducible Laboratory for Recommendation-Driven Social Dynamics

## Abstract

Recommendation systems influence more than immediate selection. Repeated rankings alter exposure, attendance, provider visibility, and opportunities for social contact. EventScape is an open computational laboratory for studying those longitudinal feedback loops in synthetic event-based social environments. The platform implements popularity, personal-relevance, social, and bridge-aware recommendation policies; deterministic named random streams; matched-seed experiments; network and provider outcomes; a validated HTTP API; and an accessible research interface. The included canonical experiment is explicitly an exploratory software demonstration rather than confirmatory empirical evidence. It shows how the platform exposes utility–integration trade-offs without collapsing them into a single score. This document describes the model, implementation, verification strategy, and protocol required for a later preregistered study.

## 1. Research question

Under what combinations of homophily, network structure, event supply, and exploration do recommendation policies increase or decrease social segregation without unacceptable loss of recommendation utility or participation?

The minimum confirmatory study evaluates:

- **H1:** popularity ranking increases organizer exposure concentration and terminal network assortativity relative to relevance ranking;
- **H2:** social ranking increases attendance and same-group co-attendance as initial homophily increases; and
- **H3:** bridge-aware ranking improves terminal weighted assortativity while attendance remains non-inferior to relevance ranking by a margin of 0.03.

The outputs included in this repository do **not** test these hypotheses confirmatorily. They validate the implementation and provide an auditable pilot.

## 2. Model

A population of synthetic agents has a group label, topic affinities, and exploration tendency. Synthetic events have an organizer, topic affinity, quality, popularity, and capacity. A sparse weighted network represents existing ties.

At every timestep:

1. feasible active events are identified;
2. the assigned policy ranks events;
3. agents select from the recommendation list;
4. attendance intention is sampled from a logistic utility model;
5. oversubscribed events use seeded deterministic allocation;
6. popularity is updated from finalized attendance; and
7. co-attendance may create or strengthen an undirected tie.

The comparative demonstration uses two synthetic groups and deliberately simplified supply. Group labels are experimental variables and must not be interpreted as demographic claims.

## 3. Policies

- **P0 Popularity:** normalized current popularity.
- **P1 Relevance:** topic affinity multiplied by event quality.
- **P2 Social:** relevance plus network-neighbor affinity evidence.
- **P3 Bridge-aware:** relevance plus expected mixed-attendance opportunity and organizer coverage, minus a popularity-concentration penalty. Mixed-attendance opportunity is highest when the attendance model predicts balanced participation from both synthetic groups.

The bridge-aware policy retains a relevance component; it does not recommend arbitrary irrelevant items solely to increase mixing.

## 4. Outcomes

The platform reports outcomes separately:

- attendance rate;
- mean selected-event relevance;
- organizer exposure Gini coefficient;
- weighted same-group edge share;
- new cross-group tie rate; and
- catalog coverage.

Independent seeded runs are the unit of replication. Prepared result intervals use normal-approximation 95% intervals across eight matched runs and are included for interface demonstration. A confirmatory release must replace pilot choices with a preregistered power analysis and approved interval procedure.

When a run forms no new ties, cross-group tie formation is undefined rather than zero. Aggregates exclude undefined values and report the valid replication count.

## 5. Reproducibility

The core runs on Bun 1.3.14 and TypeScript. Random behavior uses xoshiro256** with SHA-256-derived named streams. Scientific inputs are encoded with recursively sorted canonical JSON and identified by SHA-256. Tests freeze random vectors, transition invariants, metric fixtures, and exact canonical output.

Generate the publication artifacts with `bun run generate:results`. The command writes:

- `research/outputs/canonical-experiment.json` — complete run-level and aggregate output;
- `research/outputs/canonical-summary.csv` — tidy policy summary.

The API exposes OpenAPI documentation at `/api/v1/openapi`, and the web application embeds the same deterministic prepared experiment for offline review.

## 6. Platform architecture

EventScape is a modular Bun workspace:

- `packages/simulation-core` owns deterministic scientific behavior;
- `apps/api` exposes bounded Elysia endpoints with runtime validation;
- `apps/worker` creates reproducible artifact files independently of request handlers;
- `apps/web` provides a SvelteKit research narrative, interactive laboratory, result report, methodology, and model card;
- `prisma/schema.prisma` defines PostgreSQL persistence for scenarios and experiment records.

The current API uses an in-memory execution repository so the deliverable runs without infrastructure. The Prisma schema is the production persistence contract; connecting it requires `DATABASE_URL`, generation, and migration against PostgreSQL.

## 7. Verification

The test suite covers:

- canonical serialization and collision prevention;
- fixed RNG vectors and stream isolation;
- policy ordering and deterministic ties;
- strict scientific input validation;
- hand-calculated metric fixtures;
- exact canonical P0 reproduction;
- complete four-policy matched experiment determinism;
- API health, security headers, validated execution, and workload rejection.

The release gate is `bun run verify`.

## 8. Ethics and limitations

The model is a theory-building instrument, not a digital twin. It does not establish causal effects in real populations. “Integration” is operationalized using declared network and exposure measurements and is not a normative claim about assimilation. Bridge-aware ranking could reduce autonomy or impose unwanted exposure if transferred directly to a real service. Any deployment with real interaction logs or demographic variables requires independent ethics, privacy, fairness, and governance review.

## 9. Availability and citation

Suggested software citation:

> EventScape contributors (2026). *EventScape: A Reproducible Laboratory for Recommendation-Driven Social Dynamics*, version 0.2.0.

Before archival publication, add repository URL, authors, ORCIDs, license, release DOI, and the exact source revision to `CITATION.cff`.

## 10. References

The research baseline and DOI-linked bibliography are maintained in `BRD.md`. Principal foundations include Schelling (1971) on emergent segregation; Macedo, Marinho, and Santos (2015) on context-aware event recommendation; Kunaver and Požrl (2017) on recommender diversity; and recent surveys on popularity bias and recommender fairness.
