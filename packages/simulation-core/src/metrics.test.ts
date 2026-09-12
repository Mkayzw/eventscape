import { describe, expect, test } from "bun:test";
import { computeTerminalMetrics } from "./metrics";
import type { SimulationState } from "./types";

function state(overrides: Partial<SimulationState> = {}): SimulationState {
  return {
    timestep: 1,
    agents: [
      { id: "a0", group: 0, isAvailable: true, attendanceBias: 0 },
      { id: "a1", group: 0, isAvailable: true, attendanceBias: 0 },
      { id: "a2", group: 1, isAvailable: true, attendanceBias: 0 },
      { id: "a3", group: 1, isAvailable: true, attendanceBias: 0 },
    ],
    events: [
      {
        id: "e0",
        organizerId: "o0",
        isActive: true,
        capacity: 2,
        popularity: 5,
        quality: 0.8,
      },
      {
        id: "e1",
        organizerId: "o1",
        isActive: true,
        capacity: 2,
        popularity: 1,
        quality: 0.8,
      },
    ],
    exposures: [
      { agentIndex: 0, eventIndex: 0 },
      { agentIndex: 1, eventIndex: 0 },
      { agentIndex: 2, eventIndex: 0 },
      { agentIndex: 3, eventIndex: 0 },
    ],
    attendance: [
      { agentIndex: 0, eventIndex: 0 },
      { agentIndex: 1, eventIndex: 0 },
    ],
    ties: [{ leftAgentIndex: 0, rightAgentIndex: 1, weight: 0.25 }],
    newTieKeys: ["0:1"],
    eligibleAgentIndices: [0, 1, 2, 3],
    ...overrides,
  };
}

describe("computeTerminalMetrics", () => {
  test("matches hand-calculated attendance and exposure fixtures", () => {
    const metrics = computeTerminalMetrics(state());
    expect(metrics.attendanceRate).toEqual({ value: 0.5 });
    expect(metrics.organizerExposureGini).toEqual({ value: 0.5 });
    expect(metrics.sameGroupEdgeProportion).toEqual({ value: 1 });
    expect(metrics.crossGroupTieFormationRate).toEqual({ value: 0 });
  });

  test("reports explicit undefined reasons", () => {
    const metrics = computeTerminalMetrics(
      state({ ties: [], newTieKeys: [], eligibleAgentIndices: [] }),
    );
    expect(metrics.attendanceRate).toEqual({
      value: null,
      reason: "NO_ELIGIBLE_AGENTS",
    });
    expect(metrics.sameGroupEdgeProportion).toEqual({
      value: null,
      reason: "NO_EDGES",
    });
    expect(metrics.crossGroupTieFormationRate).toEqual({
      value: null,
      reason: "NO_NEW_EDGES",
    });
  });
});
