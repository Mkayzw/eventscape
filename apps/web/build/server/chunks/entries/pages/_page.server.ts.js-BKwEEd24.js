import { r as runComparativeExperiment, c as canonicalResearchScenario } from '../../chunks/experiment.js-Cho-bakn.js';

//#region src/routes/+page.server.ts
function load() {
	return { result: runComparativeExperiment(canonicalResearchScenario) };
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

export { _page_server_ts as _ };
//# sourceMappingURL=_page.server.ts.js-BKwEEd24.js.map
