import { a as head } from "../../chunks/server.js";
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("12qhfyh", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>EventScape — Recommendation-driven social dynamics</title>`);
		});
		$$renderer.push(`<meta name="description" content="A reproducible computational laboratory for studying recommendation policies and social integration."/>`);
	});
	$$renderer.push(`<header class="site-header svelte-12qhfyh"><a class="brand svelte-12qhfyh" href="/">EventScape <span class="svelte-12qhfyh">Research Laboratory</span></a> <nav aria-label="Primary navigation" class="svelte-12qhfyh"><a href="/results" class="svelte-12qhfyh">Results</a> <a href="/lab" class="svelte-12qhfyh">Run experiment</a> <a href="/methodology" class="svelte-12qhfyh">Methodology</a> <a href="/about/model-card" class="svelte-12qhfyh">Model card</a></nav></header> `);
	children($$renderer);
	$$renderer.push(`<!----> <footer class="svelte-12qhfyh"><div><strong>EventScape</strong><br/><span>Synthetic computational research platform</span></div> <div>Model v0.2 · Methods and limitations are public by default.</div></footer>`);
}
//#endregion
export { _layout as default };
