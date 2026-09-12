import { describe, expect, test } from "bun:test";
import { canonicalJson } from "./canonical";
import {
  canonicalResearchScenario,
  POLICY_IDS,
  runComparativeExperiment,
} from "./experiment";

describe("runComparativeExperiment", () => {
  test("runs every policy with matched seeds and bounded metrics", () => {
    const result = runComparativeExperiment(canonicalResearchScenario, [
      "11",
      "22",
    ]);
    expect(result.runs).toHaveLength(POLICY_IDS.length * 2);
    expect(result.summaries).toHaveLength(POLICY_IDS.length);
    for (const run of result.runs) {
      expect(run.timeline).toHaveLength(canonicalResearchScenario.timesteps);
      for (const value of Object.values(run.terminal).slice(1)) {
        if (value === null) continue;
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });

  test("is deterministic for the same scenario and seeds", () => {
    const first = runComparativeExperiment(canonicalResearchScenario, [
      "101",
      "202",
    ]);
    const second = runComparativeExperiment(canonicalResearchScenario, [
      "101",
      "202",
    ]);
    expect(canonicalJson(first)).toBe(canonicalJson(second));
  });

  test("labels generated findings as exploratory demonstrations", () => {
    const result = runComparativeExperiment(canonicalResearchScenario, ["101"]);
    expect(result.classification).toBe("EXPLORATORY_DEMONSTRATION");
    expect(result.caveat).toContain("not confirmatory empirical findings");
  });

  test("reports valid replication counts for nullable tie formation", () => {
    const result = runComparativeExperiment(canonicalResearchScenario, [
      "101",
      "202",
    ]);
    for (const summary of result.summaries) {
      expect(
        summary.metrics.crossGroupTieRate.validReplicationCount,
      ).toBeLessThanOrEqual(2);
      expect(summary.metrics.attendanceRate.validReplicationCount).toBe(2);
    }
  });
});
