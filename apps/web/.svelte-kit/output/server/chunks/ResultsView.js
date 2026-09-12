import { i as ensure_array_like, n as attr_style, r as derived, t as attr_class, v as attr, y as escape_html } from "./server.js";
//#region src/lib/components/PolicyChart.svelte
function PolicyChart($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { summaries, metric, label } = $$props;
		const names = {
			popularity: "Popularity",
			relevance: "Relevance",
			social: "Social",
			"bridge-aware": "Bridge-aware"
		};
		const display = (value) => value === null ? "—" : value.toFixed(3);
		$$renderer.push(`<div class="chart svelte-1wahkc2" role="img"${attr("aria-label", `${label} by policy. ${summaries.map((s) => `${names[s.policy]} ${display(s.metrics[metric].mean)}`).join(", ")}.`)}><div class="axis-label svelte-1wahkc2">${escape_html(label)}</div> <!--[-->`);
		const each_array = ensure_array_like(summaries);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let summary = each_array[$$index];
			$$renderer.push(`<div class="row svelte-1wahkc2"><span>${escape_html(names[summary.policy])}</span> <div class="track svelte-1wahkc2" aria-hidden="true"><div${attr_class("bar svelte-1wahkc2", void 0, { "bridge": summary.policy === "bridge-aware" })}${attr_style(`width: ${(summary.metrics[metric].mean ?? 0) * 100}%`)}></div></div> <strong class="svelte-1wahkc2">${escape_html(display(summary.metrics[metric].mean))}</strong></div> <div class="interval svelte-1wahkc2">95% CI ${escape_html(display(summary.metrics[metric].lower95))}–${escape_html(display(summary.metrics[metric].upper95))} · n=${escape_html(summary.metrics[metric].validReplicationCount)}</div>`);
		}
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
//#region src/lib/components/ResultsView.svelte
function ResultsView($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { result } = $$props;
		const bridge = derived(() => result.summaries.find((summary) => summary.policy === "bridge-aware"));
		const popularity = derived(() => result.summaries.find((summary) => summary.policy === "popularity"));
		const relevance = derived(() => result.summaries.find((summary) => summary.policy === "relevance"));
		const display = (value) => value === null ? "—" : value.toFixed(3);
		$$renderer.push(`<div class="warning" role="note"><strong>Exploratory demonstration.</strong> ${escape_html(result.caveat)}</div> <section class="grid four summary svelte-1vjybh7" aria-label="Key results"><article class="panel"><div class="eyebrow">Replications</div> <div class="metric">${escape_html(result.seeds.length)}</div> <p class="svelte-1vjybh7">Matched seeds per policy</p></article> <article class="panel"><div class="eyebrow">Bridge attendance</div> <div class="metric">${escape_html(bridge().metrics.attendanceRate.mean === null ? "—" : `${(bridge().metrics.attendanceRate.mean * 100).toFixed(1)}%`)}</div> <p class="svelte-1vjybh7">Terminal attendance rate</p></article> <article class="panel"><div class="eyebrow">Exposure inequality</div> <div class="metric">${escape_html(display(bridge().metrics.exposureGini.mean))}</div> <p class="svelte-1vjybh7">Bridge-aware terminal Gini</p></article> <article class="panel"><div class="eyebrow">Catalog coverage</div> <div class="metric">${escape_html(bridge().metrics.catalogCoverage.mean === null ? "—" : `${(bridge().metrics.catalogCoverage.mean * 100).toFixed(0)}%`)}</div> <p class="svelte-1vjybh7">Events exposed at least once</p></article></section> <section class="grid two"><article class="panel svelte-1vjybh7"><h2 class="svelte-1vjybh7">Participation</h2> <p class="muted">Attendance remains visible alongside integration; no combined ethical
      score is used.</p> `);
		PolicyChart($$renderer, {
			summaries: result.summaries,
			metric: "attendanceRate",
			label: "Terminal attendance rate"
		});
		$$renderer.push(`<!----></article> <article class="panel svelte-1vjybh7"><h2 class="svelte-1vjybh7">Network concentration</h2> <p class="muted">Lower same-group edge share indicates greater mixing in this synthetic
      two-group model.</p> `);
		PolicyChart($$renderer, {
			summaries: result.summaries,
			metric: "sameGroupEdgeShare",
			label: "Same-group weighted edge share"
		});
		$$renderer.push(`<!----></article> <article class="panel svelte-1vjybh7"><h2 class="svelte-1vjybh7">Provider exposure</h2> <p class="muted">Lower organizer exposure Gini represents more evenly distributed
      recommendation exposure.</p> `);
		PolicyChart($$renderer, {
			summaries: result.summaries,
			metric: "exposureGini",
			label: "Organizer exposure Gini"
		});
		$$renderer.push(`<!----></article> <article class="panel svelte-1vjybh7"><h2 class="svelte-1vjybh7">Recommendation utility</h2> <p class="muted">Mean content relevance of selected events at the terminal timestep.</p> `);
		PolicyChart($$renderer, {
			summaries: result.summaries,
			metric: "meanRelevance",
			label: "Mean selected relevance"
		});
		$$renderer.push(`<!----></article></section> <section class="section"><div class="eyebrow">Complete evidence table</div> <h2>Terminal outcomes</h2> <div class="table-wrap" role="region" aria-label="Policy outcome table"><table><caption class="sr-only">Terminal policy metrics with ${escape_html(result.seeds.length)} matched seed replications</caption><thead><tr><th>Policy</th><th>Attendance</th><th>Relevance</th><th>Exposure Gini</th><th>Same-group edges</th><th>Cross-group ties</th><th>Coverage</th></tr></thead><tbody><!--[-->`);
		const each_array = ensure_array_like(result.summaries);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let summary = each_array[$$index];
			$$renderer.push(`<tr><th>${escape_html(summary.policy)}</th><td>${escape_html(display(summary.metrics.attendanceRate.mean))}</td><td>${escape_html(display(summary.metrics.meanRelevance.mean))}</td><td>${escape_html(display(summary.metrics.exposureGini.mean))}</td><td>${escape_html(display(summary.metrics.sameGroupEdgeShare.mean))}</td><td>${escape_html(display(summary.metrics.crossGroupTieRate.mean))} (n=${escape_html(summary.metrics.crossGroupTieRate.validReplicationCount)})</td><td>${escape_html(display(summary.metrics.catalogCoverage.mean))}</td></tr>`);
		}
		$$renderer.push(`<!--]--></tbody></table></div> <p class="muted">Reference comparisons: popularity exposure Gini ${escape_html(display(popularity().metrics.exposureGini.mean))}; relevance attendance ${escape_html(relevance().metrics.attendanceRate.mean === null ? "—" : `${(relevance().metrics.attendanceRate.mean * 100).toFixed(1)}%`)}.
    Intervals and run-level values are included in the JSON publication
    artifact.</p></section>`);
	});
}
//#endregion
export { ResultsView as t };
