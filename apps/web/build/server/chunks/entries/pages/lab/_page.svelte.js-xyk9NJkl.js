import { r as run, ag as escape_html, ai as attr } from '../../../chunks/server.js-BEhDu4ih.js';
import '../../../chunks/uneval.js-BBTAkNQv.js';

//#region src/routes/lab/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		const initialScenario = run(() => data.scenario);
		let agentCount = initialScenario.agentCount;
		let timesteps = initialScenario.timesteps;
		let homophily = initialScenario.homophily;
		let exploration = initialScenario.exploration;
		$$renderer.push(`<main><section class="section intro svelte-9xkyrc"><div class="eyebrow">Interactive laboratory</div><h1>Run a bounded experiment</h1><p class="lede">Adjust a small set of scientifically meaningful parameters. Inputs are validated by the API and all four policies receive matched seeds.</p></section> <section class="workspace svelte-9xkyrc"><form class="panel svelte-9xkyrc"><h2 class="svelte-9xkyrc">Scenario</h2> <label class="svelte-9xkyrc">Agents <output class="svelte-9xkyrc">${escape_html(agentCount)}</output><input${attr("value", agentCount)} type="range" min="20" max="200" step="10" class="svelte-9xkyrc"/></label> <label class="svelte-9xkyrc">Timesteps <output class="svelte-9xkyrc">${escape_html(timesteps)}</output><input${attr("value", timesteps)} type="range" min="4" max="80" step="4" class="svelte-9xkyrc"/></label> <label class="svelte-9xkyrc">Homophily <output class="svelte-9xkyrc">${escape_html(homophily.toFixed(2))}</output><input${attr("value", homophily)} type="range" min="0" max="1" step="0.05" class="svelte-9xkyrc"/></label> <label class="svelte-9xkyrc">Exploration <output class="svelte-9xkyrc">${escape_html(exploration.toFixed(2))}</output><input${attr("value", exploration)} type="range" min="0" max="0.8" step="0.05" class="svelte-9xkyrc"/></label> <button type="submit">Run 16 simulations</button> <p role="status" aria-live="polite" class="muted">${escape_html("Ready")}</p></form> <aside class="panel svelte-9xkyrc"><div class="eyebrow">Design</div><h2 class="svelte-9xkyrc">Matched comparison</h2><dl class="svelte-9xkyrc"><div class="svelte-9xkyrc"><dt>Policies</dt><dd class="svelte-9xkyrc">4</dd></div><div class="svelte-9xkyrc"><dt>Seeds</dt><dd class="svelte-9xkyrc">4</dd></div><div class="svelte-9xkyrc"><dt>Total runs</dt><dd class="svelte-9xkyrc">16</dd></div><div class="svelte-9xkyrc"><dt>Classification</dt><dd class="svelte-9xkyrc">Exploratory</dd></div></dl><p class="muted">This browser submits a synchronous bounded demonstration to the Elysia API. Production-scale batches use the worker artifact command.</p></aside></section> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></main>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-xyk9NJkl.js.map
