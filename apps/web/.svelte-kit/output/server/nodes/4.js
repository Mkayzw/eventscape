import * as server from '../entries/pages/lab/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/lab/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/lab/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.l5MUQ-0c.js","_app/immutable/chunks/DAmdPt79.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/K_RjVghU.js"];
export const stylesheets = ["_app/immutable/assets/ResultsView.DqvXLMoE.css","_app/immutable/assets/4.C_x_xbIs.css"];
export const fonts = [];
