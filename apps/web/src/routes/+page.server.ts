import {
  canonicalResearchScenario,
  runComparativeExperiment,
} from "@eventscape/simulation-core";

export function load() {
  return { result: runComparativeExperiment(canonicalResearchScenario) };
}
