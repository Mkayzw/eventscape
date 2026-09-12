# ADR-001: First Executable Research Slice

## Status

Accepted

## Date

2026-09-12

## Context

The approved product direction requires a deterministic agent-based laboratory, but the initial documents left several scientific and technical choices open. Building the API, database, worker, or interface before proving the model would spread unsettled semantics across the system.

## Decision

### Project identity

The project and repository name is **EventScape**. The name remains a research-platform label and does not imply an event marketplace.

### First implementation boundary

The first executable slice is a local, in-memory, test-driven run of one canonical scenario under the popularity policy (`P0`). It includes:

- strict configuration validation;
- canonical serialization and a SHA-256 scientific fingerprint;
- deterministic named random streams;
- candidate feasibility;
- popularity ranking;
- attendance choice;
- deterministic capacity resolution;
- popularity updates;
- tie creation and strengthening;
- terminal metrics; and
- a normalized scientific manifest.

It excludes PostgreSQL, Prisma, Elysia, the worker queue, checkpoint compression, SvelteKit, companion effects, and tie decay.

### Runtime and workspace

- Bun `1.3.14` is the reference runtime for this slice.
- TypeScript uses strict compiler settings.
- Bun workspaces are used without an additional monorepo orchestrator.
- `bun:test` is the test runner.
- The initial workspace contains only `packages/simulation-core`; packages are added when a concrete slice requires them.

### Randomness

- The generator is `xoshiro256**` with 64-bit `BigInt` state.
- A run seed is an unsigned 64-bit integer encoded as a decimal string at boundaries.
- Named stream state is initialized by hashing `eventscape:rng:v1\0<run-seed>\0<stream-name>` with SHA-256 and reading four consecutive unsigned 64-bit big-endian words.
- An all-zero state is invalid and is replaced by `(1, 0, 0, 0)`.
- Required streams in the first slice are `attendance`, `capacity-resolution`, `recommendation-tie-breaking`, and `tie-formation`.
- Initialization and event supply are explicit in the canonical fixture, so they consume no randomness in this slice.
- Floating samples are the upper 53 bits of the next 64-bit output divided by $2^{53}$, yielding values in $[0,1)$.
- Integer samples use rejection sampling to avoid modulo bias.

### Canonical scenario

The first fixture has four agents, two simultaneous events, one timestep, and no pre-existing ties.

| Agent | Group | Available | Topic affinities to E0/E1 | Attendance bias |
|---|---:|---|---|---:|
| A0 | 0 | yes | 0.9 / 0.2 | 0.0 |
| A1 | 0 | yes | 0.8 / 0.3 | 0.0 |
| A2 | 1 | yes | 0.2 / 0.9 | 0.0 |
| A3 | 1 | yes | 0.3 / 0.8 | 0.0 |

| Event | Organizer | Active | Capacity | Initial popularity | Quality |
|---|---|---|---:|---:|---:|
| E0 | O0 | yes | 2 | 3 | 0.8 |
| E1 | O1 | yes | 2 | 1 | 0.8 |

All agents are colocated, available in the single time window, and both events are feasible. `recommendationListLength = 1`. P0 therefore exposes E0 to every agent. The fixture seed is `20260912`.

### Timestep semantics

The order is fixed:

1. Select active events.
2. Generate feasible candidates.
3. Rank with P0 and expose the top item.
4. Sample independent attendance intent.
5. Resolve oversubscribed events with a deterministic random priority from the capacity stream; lower sampled priority wins and agent index breaks an exact tie.
6. Finalize attendance.
7. Increase event popularity by final attendance count.
8. For every unordered pair of co-attendees, create or strengthen an undirected tie.
9. Compute terminal metrics.

An event remains feasible before allocation when its configured capacity is greater than zero. Capacity is not reserved during recommendation.

### Attendance model

For the single displayed event:

$$
P(A_{u,e}=1)=\sigma(-0.5 + 1.5Q_e + b_u)
$$

where $Q_e$ is event quality, $b_u$ is the agent attendance bias, and $\sigma(x)=1/(1+e^{-x})$. Relevance, social influence, bridge utility, distance cost, companion effects, and tie decay are intentionally disabled in this P0 fixture. An agent with no displayed event does not attend.

### Popularity policy P0

For feasible event $e$:

$$
score(e)=\frac{popularity(e)}{\max(1,\max_{c \in C} popularity(c))}
$$

Cold-start popularity is zero. Equal scores are ordered by one deterministic tie-breaking sample per tied event, then event index.

### Tie update

Every unordered pair of final co-attendees receives one interaction opportunity. A tie forms when the `tie-formation` stream sample is less than `tieFormationProbability = 1` in the canonical fixture. The undirected edge weight is updated by:

$$
w_{ij,t+1}=\min(1, w_{ij,t}+0.25)
$$

Existing edges are strengthened by the same increment. Decay and removal are disabled.

### Initial metric dictionary

The first slice computes only metrics needed to validate the transition:

1. **Attendance rate** — final attendees divided by eligible agents; null only when there are no eligible agents.
2. **Organizer exposure Gini** — population Gini over exposure counts for every organizer with an active event; the all-zero case is `0`.
3. **Same-group edge proportion** — total weight of same-group edges divided by total edge weight; null with reason `NO_EDGES` when no edges exist.
4. **Cross-group tie formation rate** — newly created cross-group edges divided by all newly created edges; null with reason `NO_NEW_EDGES` when no edges are created.

Metrics observe state after tie updates. Weighted edge proportions use edge weights; the new-edge rate counts edges, not strengthening events.

### Reproduction semantics

- The **scientific fingerprint** is SHA-256 over canonical JSON containing `model`, `policy`, `configuration`, and `seed`.
- Canonical JSON recursively sorts object keys, preserves array order, rejects unknown/non-JSON values, and requires finite numbers.
- Display labels, execution IDs, timestamps, source revision, dependency lock hash, runtime diagnostics, and artifact locations are excluded from the scientific fingerprint.
- **Exact scientific reproduction** means the fingerprint, normalized terminal state, and normalized metrics are byte-identical after canonical serialization on the reference runtime.
- Execution manifests may contain volatile metadata later, but volatile metadata is not part of exact scientific comparison.
- A reproduction attempt is a new execution record that references the same scientific fingerprint; the fingerprint identifies scientific inputs, not a unique execution. Persistence semantics are deferred.

### Confirmatory-study operational definitions

These definitions close the research-design gate but are not all implemented in the first slice:

- **H1:** Compare P0 with P1 using matched scenario seeds. Primary outcomes are terminal organizer exposure Gini and weighted group assortativity; modularity is secondary. The estimand is the paired mean policy difference at the terminal timestep.
- **H2:** Compare P2 with P1 across three initial assortativity conditions. Primary outcomes are attendance rate and same-group co-attendance share. The estimand is the policy-by-initial-assortativity interaction. Companion recommendation is excluded from the confirmatory study and reserved for H5.
- **H3:** Compare P3 with P1. Attendance is non-inferior when the lower bound of the paired 95% confidence interval for `P3 - P1` is above `-0.03` attendance-rate points. Conditional on non-inferiority, weighted group assortativity is the primary integration outcome; organizer exposure Gini is secondary.
- Holm correction applies within each hypothesis’s confirmatory metric family. Failed, cancelled, or invariant-violating runs are excluded and reported; the matched block is excluded from paired analysis if any required policy run is missing.

Initial confirmatory factors are three homophily levels (`0`, `0.5`, `1`) and three initial-network conditions (random mixing, moderate homophily, strong homophily). Exact generator parameters and replication counts remain Phase 0 research artifacts and do not block the canonical P0 slice.

## Alternatives Considered

### Full-stack first slice

Rejected because scientific failures would be difficult to distinguish from HTTP, persistence, worker, or UI failures.

### A single global pseudorandom stream

Rejected because unrelated random draws would shift all subsequent model behavior.

### Math.random

Rejected because it has no stable seeded contract suitable for reproducible research.

### Byte-identical complete bundles as the only reproduction criterion

Rejected because timestamps, execution identifiers, and compression metadata are volatile and not scientific output.

## Consequences

- The first implementation is intentionally narrow and cannot yet test H1–H3.
- P1, P2, P3, experiment batching, APIs, persistence, and UI remain deferred.
- Scientific choices in this ADR require a superseding ADR and model or policy version change if altered after implementation.
- The canonical fixture provides a hand-reviewable oracle before larger stochastic scenarios are introduced.
