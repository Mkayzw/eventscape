# First Deterministic Slice Tasks

## Task 1: Bootstrap minimal workspace

**Acceptance criteria:**
- [x] Root scripts install, test, type-check, and build with Bun 1.3.14.
- [x] Only `packages/simulation-core` is created.

**Verification:**
- [x] `bun run typecheck`
- [x] `bun run build`

**Dependencies:** None

**Files likely touched:** `package.json`, `tsconfig.json`, `packages/simulation-core/package.json`

**Estimated scope:** Small

## Task 2: Prove serialization and RNG

**Acceptance criteria:**
- [x] Canonical object-key order is stable.
- [x] Unknown non-JSON and non-finite values are rejected.
- [x] Named streams are repeatable and isolated.

**Verification:**
- [x] `bun test packages/simulation-core/src/canonical.test.ts packages/simulation-core/src/rng.test.ts`

**Dependencies:** Task 1

**Files likely touched:** four source/test files

**Estimated scope:** Medium

## Task 3: Implement P0 transition

**Acceptance criteria:**
- [x] Only feasible events are ranked.
- [x] P0 uses normalized current popularity and deterministic ties.
- [x] Attendance, capacity, popularity, and ties follow ADR-001 ordering.
- [x] Core invariants hold.

**Verification:**
- [x] Focused engine and policy tests pass.

**Dependencies:** Task 2

**Files likely touched:** model, policy, engine, and tests

**Estimated scope:** Medium

## Task 4: Implement metric dictionary v1

**Acceptance criteria:**
- [x] All four formulas match hand-calculated fixtures.
- [x] Undefined states return explicit reasons rather than zero.

**Verification:**
- [x] Focused metric tests pass.

**Dependencies:** Task 3

**Files likely touched:** metrics implementation and tests

**Estimated scope:** Small

## Task 5: Reproduce canonical run

**Acceptance criteria:**
- [x] Fixture seed and configuration produce a reviewed result.
- [x] Two executions have byte-identical normalized terminal state and metrics.
- [x] Manifest fingerprint excludes volatile metadata.

**Verification:**
- [x] `bun test`
- [x] `bun run typecheck`
- [x] `bun run build`

**Dependencies:** Tasks 3–4

**Files likely touched:** canonical fixture, run facade, tests

**Estimated scope:** Medium
