import { mkdir, writeFile } from "node:fs/promises";
import {
  canonicalJson,
  canonicalResearchScenario,
  runComparativeExperiment,
} from "@eventscape/simulation-core";

const outputDirectory = process.env.ARTIFACT_DIR ?? "artifacts/canonical";
const result = runComparativeExperiment(canonicalResearchScenario);
await mkdir(outputDirectory, { recursive: true });
await writeFile(
  `${outputDirectory}/experiment.json`,
  `${canonicalJson(result)}\n`,
  "utf8",
);
await writeFile(
  `${outputDirectory}/summary.json`,
  `${JSON.stringify(result.summaries, null, 2)}\n`,
  "utf8",
);
console.log(
  JSON.stringify({
    level: "info",
    event: "canonical_experiment_completed",
    outputDirectory,
    runs: result.runs.length,
    classification: result.classification,
  }),
);
