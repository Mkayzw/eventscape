import { n as runComparativeExperiment, t as canonicalResearchScenario } from "../../chunks/experiment.js";
//#region src/routes/+page.server.ts
function load() {
	return { result: runComparativeExperiment(canonicalResearchScenario) };
}
//#endregion
export { load };
