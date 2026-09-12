# Implementation Plan: First Deterministic EventScape Slice

## Overview

Build the smallest scientifically reviewable execution path: a strict in-memory canonical scenario under P0, deterministic named RNG streams, one timestep, four terminal metrics, and normalized reproduction output. Database, API, worker, and UI are deliberately deferred.

## Architecture Decisions

- Use Bun 1.3.14, strict TypeScript, Bun workspaces, and `bun:test`.
- Keep the initial implementation in `packages/simulation-core`; add no unused packages.
- Use xoshiro256** with SHA-256-derived named streams.
- Treat scientific fingerprints as identities of scientific inputs, not execution records.
- Follow `docs/decisions/ADR-001-first-executable-research-slice.md` as the executable contract.

## Task List

### Phase 1: Foundation

- [x] Task 1: Bootstrap the minimal Bun workspace and strict TypeScript package.
- [x] Task 2: Add failing tests for canonical serialization and named RNG determinism.
- [x] Task 3: Implement serialization, fingerprints, and RNG to satisfy the tests.

### Checkpoint: Deterministic foundation

- [x] Focused tests pass.
- [x] Type checking passes.

### Phase 2: Canonical run

- [x] Task 4: Add failing tests for P0 ordering, feasibility, and one-timestep invariants.
- [x] Task 5: Implement the canonical model and P0 transition.
- [x] Task 6: Add failing metric fixtures and implement the four v1 metrics.
- [x] Task 7: Add the canonical fixture and exact reproduction test.

### Checkpoint: Scientific core

- [x] Hand-calculated expectations pass.
- [x] Repeated runs have byte-identical normalized output.
- [x] Perturbing one RNG stream does not alter another.

### Phase 3: Review

- [x] Task 8: Run full tests, type checking, and build.
- [x] Task 9: Review correctness, scope, and documentation alignment.

### Checkpoint: Complete

- [x] No database, API, queue, or UI was introduced.
- [x] All first-slice acceptance criteria pass.
- [x] Ready to begin P1 only after reviewing the canonical output.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Golden output blesses an incorrect model | High | Use explicit hand-calculated fixtures before snapshot comparison |
| Random draws shift after refactors | High | Named streams and perturbation tests |
| Floating-point output varies | Medium | Pin Bun and canonicalize finite JSON numbers |
| Scope expands prematurely | Medium | Keep one package and exclude infrastructure explicitly |

## Open Questions

- Full population/event generator distributions and replication count remain Phase 0 research tasks.
- P1 formulas must be frozen before the first H1 pilot.
