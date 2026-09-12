import * as server from '../entries/pages/results/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/results/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/results/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.D2hAF4tX.js","_app/immutable/chunks/DAmdPt79.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/K_RjVghU.js"];
export const stylesheets = ["_app/immutable/assets/ResultsView.DqvXLMoE.css","_app/immutable/assets/6.Dw1KWeul.css"];
export const fonts = [];
