import { mkdir, writeFile } from "node:fs/promises";
import {
  canonicalJson,
  canonicalResearchScenario,
  runComparativeExperiment,
} from "../packages/simulation-core/src/index";

const result = runComparativeExperiment(canonicalResearchScenario);
await mkdir("research/outputs", { recursive: true });
await writeFile(
  "research/outputs/canonical-experiment.json",
  `${canonicalJson(result)}\n`,
  "utf8",
);

const header =
  "policy,replications,attendance_rate,mean_relevance,exposure_gini,same_group_edge_share,cross_group_tie_rate,catalog_coverage";
const rows = result.summaries.map((summary) =>
  [
    summary.policy,
    summary.replicationCount,
    summary.metrics.attendanceRate.mean,
    summary.metrics.meanRelevance.mean,
    summary.metrics.exposureGini.mean,
    summary.metrics.sameGroupEdgeShare.mean,
    summary.metrics.crossGroupTieRate.mean ?? "",
    summary.metrics.catalogCoverage.mean,
  ].join(","),
);
await writeFile(
  "research/outputs/canonical-summary.csv",
  `${header}\n${rows.join("\n")}\n`,
  "utf8",
);
console.log(`Generated ${result.runs.length} runs in research/outputs`);
