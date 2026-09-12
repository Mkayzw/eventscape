import { ag as escape_html } from '../../chunks/server.js-BEhDu4ih.js';
import { R as ResultsView } from '../../chunks/ResultsView.js-D1Ibv9ES.js';
import '../../chunks/uneval.js-BBTAkNQv.js';

//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		$$renderer.push(`<main><section class="hero svelte-1uha8ag"><div class="eyebrow">Computational social science · Agent-based modelling</div> <h1>What does a recommendation system do to a social world?</h1> <p class="lede">EventScape makes the long-term effects of ranking policies visible.
      Synthetic people choose among events; co-attendance shapes social ties;
      those ties influence later exposure.</p> <div class="actions svelte-1uha8ag"><a class="button" href="/results">Inspect the evidence</a><a class="button secondary" href="/lab">Run the model</a></div></section> <section class="section question svelte-1uha8ag"><div><div class="eyebrow">Primary research question</div> <h2>Utility and integration are not the same outcome.</h2></div> <p class="svelte-1uha8ag">A ranking policy can feel relevant to individuals while concentrating
      attention among organizers and repeatedly exposing people to the same
      communities. EventScape keeps these outcomes separate, traceable, and
      reproducible.</p></section> <section class="section"><div class="eyebrow">Canonical demonstration</div> <h2>Four policies. Matched synthetic worlds.</h2> <p class="lede">The prepared result below executes ${escape_html(data.result.runs.length)} deterministic
      runs across popularity, relevance, social, and bridge-aware policies.</p> `);
		ResultsView($$renderer, { result: data.result });
		$$renderer.push(`<!----></section></main>`);
	});
}

export { _page as default };
//# sourceMappingURL=_page.svelte.js-BHUmlthu.js.map
