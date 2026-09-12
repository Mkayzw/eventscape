import { describe, expect, test } from "bun:test";
import { canonicalJson } from "./canonical";
import { canonicalP0MicroScenario } from "./fixture";
import { runSimulation } from "./simulation";

describe("runSimulation", () => {
  test("executes the canonical P0 transition within invariants", () => {
    const result = runSimulation(canonicalP0MicroScenario);

    expect(result.state.exposures).toHaveLength(4);
    expect(
      result.state.exposures.every(({ eventIndex }) => eventIndex === 0),
    ).toBe(true);
    expect(result.state.attendance.length).toBeLessThanOrEqual(2);
    expect(result.state.events[0]?.popularity).toBe(
      3 + result.state.attendance.length,
    );
    expect(result.state.events[1]?.popularity).toBe(1);
    expect(
      result.state.ties.every(({ weight }) => weight >= 0 && weight <= 1),
    ).toBe(true);
  });

  test("reproduces normalized scientific output byte-for-byte", () => {
    const first = runSimulation(canonicalP0MicroScenario);
    const second = runSimulation(canonicalP0MicroScenario);

    expect(canonicalJson(first)).toBe(canonicalJson(second));
    expect(first.manifest.scientificFingerprint).toBe(
      second.manifest.scientificFingerprint,
    );
    expect(first.manifest.scientificFingerprint).toBe(
      "sha256:eedb84b436589cb3e178e529fa87c5ea3a98b9218cceefc100ab4d77b4c96c07",
    );
    expect(first.state.attendance).toEqual([
      { agentIndex: 0, eventIndex: 0 },
      { agentIndex: 3, eventIndex: 0 },
    ]);
    expect(first.state.ties).toEqual([
      { leftAgentIndex: 0, rightAgentIndex: 3, weight: 0.25 },
    ]);
    expect(first.metrics).toEqual({
      attendanceRate: { value: 0.5 },
      organizerExposureGini: { value: 0.5 },
      sameGroupEdgeProportion: { value: 0 },
      crossGroupTieFormationRate: { value: 1 },
    });
  });

  test("rejects malformed scientific configuration", () => {
    expect(() =>
      runSimulation({
        ...canonicalP0MicroScenario,
        configuration: {
          ...canonicalP0MicroScenario.configuration,
          tieIncrement: Number.NaN,
        },
      }),
    ).toThrow("tieIncrement");

    expect(() =>
      runSimulation({
        ...canonicalP0MicroScenario,
        configuration: {
          ...canonicalP0MicroScenario.configuration,
          agents: [
            canonicalP0MicroScenario.configuration.agents[0]!,
            canonicalP0MicroScenario.configuration.agents[0]!,
          ],
        },
      }),
    ).toThrow("agent IDs");

    expect(() =>
      runSimulation({
        ...canonicalP0MicroScenario,
        configuration: {
          ...canonicalP0MicroScenario.configuration,
          initialTies: [
            { leftAgentIndex: 0, rightAgentIndex: 99, weight: 0.25 },
          ],
        },
      }),
    ).toThrow("tie agent index");
  });

  test("accepts non-oversubscribed intents in agent order", () => {
    const withoutCompetition = {
      ...canonicalP0MicroScenario,
      configuration: {
        ...canonicalP0MicroScenario.configuration,
        events: canonicalP0MicroScenario.configuration.events.map((event) => ({
          ...event,
          capacity: 4,
        })),
      },
    } as const;

    const result = runSimulation(withoutCompetition);
    expect(result.state.attendance.map(({ agentIndex }) => agentIndex)).toEqual(
      [0, 1, 3],
    );
  });
});
