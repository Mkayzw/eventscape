# P0 Micro Scenario v1

This is the hand-reviewable canonical fixture defined by `ADR-001`.

## Inputs

- Seed: `20260912`
- Timestep count: `1`
- Recommendation-list length: `1`
- Tie-formation probability: `1`
- Tie increment: `0.25`
- Maximum tie weight: `1`
- Attendance probability: $\sigma(-0.5 + 1.5Q_e + b_u)$

Four available agents can attend either of two simultaneous, colocated events. E0 has popularity 3 and E1 has popularity 1. P0 exposes E0 to all four agents. E0 has capacity 2, so final attendance is capped at 2 using deterministic capacity priorities.

## Hand-calculated structural expectations

These expectations do not depend on the particular random winners:

- Exposures: E0 = 4, E1 = 0.
- Organizer exposure Gini: `0.5`.
- Final attendance is between 0 and 2 and never exceeds E0 capacity.
- E0 terminal popularity equals `3 + finalAttendance`.
- E1 terminal popularity remains `1`.
- If two agents attend, exactly one new undirected edge of weight `0.25` exists.
- Attendance rate equals `finalAttendance / 4`.
- If no edge forms, edge metrics are null with their documented reasons.

## Frozen v1 result

- Scientific fingerprint: `sha256:eedb84b436589cb3e178e529fa87c5ea3a98b9218cceefc100ab4d77b4c96c07`.
- Final attendees: A0 and A3 at E0.
- New tie: A0–A3 with weight `0.25`.
- Attendance rate: `0.5`.
- Organizer exposure Gini: `0.5`.
- Same-group edge proportion: `0`.
- Cross-group tie formation rate: `1`.

This result was reviewed against the transition rules before being frozen in the regression suite. It is a reproducibility fixture, not evidence for a research hypothesis.
