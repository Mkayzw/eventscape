import { t as canonicalResearchScenario } from "../../../chunks/experiment.js";
//#region src/routes/lab/+page.server.ts
function load() {
	return { scenario: canonicalResearchScenario };
}
//#endregion
export { load };
