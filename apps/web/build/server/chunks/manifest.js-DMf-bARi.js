const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CRlbw-3h.js",app:"_app/immutable/entry/app.CvXeKsmK.js",imports:["_app/immutable/entry/start.CRlbw-3h.js","_app/immutable/chunks/CDrB6o0V.js","_app/immutable/chunks/DAmdPt79.js","_app/immutable/entry/app.CvXeKsmK.js","_app/immutable/chunks/DAmdPt79.js","_app/immutable/chunks/xihTtKlq.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js-COAvvq4f.js')),
			__memo(() => import('./nodes/1.js-DHLQ_CCM.js')),
			__memo(() => import('./nodes/2.js-DfUmiU4E.js')),
			__memo(() => import('./nodes/3.js-DJVP6Lr9.js')),
			__memo(() => import('./nodes/4.js-cIZm_Bol.js')),
			__memo(() => import('./nodes/5.js-Rq7Dewmx.js')),
			__memo(() => import('./nodes/6.js-CT5mRln0.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about/model-card",
				pattern: /^\/about\/model-card\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/lab",
				pattern: /^\/lab\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/methodology",
				pattern: /^\/methodology\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/results",
				pattern: /^\/results\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export { manifest as m };
//# sourceMappingURL=manifest.js-DMf-bARi.js.map
