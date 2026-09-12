import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.1Y3guPbm.js","_app/immutable/chunks/DAmdPt79.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/K_RjVghU.js"];
export const stylesheets = ["_app/immutable/assets/ResultsView.DqvXLMoE.css","_app/immutable/assets/2.D_A7NgFH.css"];
export const fonts = [];
