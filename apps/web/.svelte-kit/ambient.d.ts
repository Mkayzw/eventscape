
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const SVELTEKIT_FORK: string;
	export const NODE_ENV: string;
	export const npm_node_execpath: string;
	export const DEBIAN_FRONTEND: string;
	export const PATH: string;
	export const JOURNAL_STREAM: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_package_json: string;
	export const XDG_RUNTIME_DIR: string;
	export const FC_FONTATIONS: string;
	export const npm_execpath: string;
	export const npm_config_user_agent: string;
	export const XDG_SESSION_ID: string;
	export const XDG_VTNR: string;
	export const GIT_EDITOR: string;
	export const GIT_MERGE_AUTOEDIT: string;
	export const SHLVL: string;
	export const DISPLAY: string;
	export const XDG_DATA_DIRS: string;
	export const MANPAGER: string;
	export const LC_NUMERIC: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const XDG_SESSION_TYPE: string;
	export const LC_TELEPHONE: string;
	export const LC_PAPER: string;
	export const QT_QPA_PLATFORMTHEME: string;
	export const npm_lifecycle_event: string;
	export const LC_NAME: string;
	export const XCURSOR_THEME: string;
	export const MEMORY_PRESSURE_WATCH: string;
	export const MOTD_SHOWN: string;
	export const SYSTEMD_EXEC_PID: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const PWD: string;
	export const XCURSOR_SIZE: string;
	export const npm_config_local_prefix: string;
	export const DESKTOP_SESSION: string;
	export const LC_ADDRESS: string;
	export const MAIL: string;
	export const LC_MONETARY: string;
	export const COLORTERM: string;
	export const AI_AGENT: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XDG_SESSION_PATH: string;
	export const GDK_BACKEND: string;
	export const COPILOT_DEBUG_NONCE: string;
	export const NODE: string;
	export const LC_TIME: string;
	export const RUSTICL_ENABLE: string;
	export const __MISE_SESSION: string;
	export const INVOCATION_ID: string;
	export const TERM_PROGRAM: string;
	export const QT_WAYLAND_DISABLE_WINDOWDECORATION: string;
	export const NO_AT_BRIDGE: string;
	export const SHELL: string;
	export const VSSCRIPT_PATH: string;
	export const LOGNAME: string;
	export const npm_command: string;
	export const TERM_PROGRAM_VERSION: string;
	export const TERM: string;
	export const MANAGERPIDFDID: string;
	export const GRADLE_HOME: string;
	export const VSCODE_INJECTION: string;
	export const GIT_ASKPASS: string;
	export const MEMORY_PRESSURE_WRITE: string;
	export const VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
	export const HOME: string;
	export const LANG: string;
	export const MANROFFOPT: string;
	export const XDG_SEAT: string;
	export const npm_package_version: string;
	export const COPILOT_AGENT: string;
	export const npm_lifecycle_script: string;
	export const WAYLAND_DISPLAY: string;
	export const __MISE_DIFF: string;
	export const XDG_SEAT_PATH: string;
	export const _: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const NIRI_SOCKET: string;
	export const CHROME_DESKTOP: string;
	export const MISE_SHELL: string;
	export const QT_QPA_PLATFORM: string;
	export const LC_IDENTIFICATION: string;
	export const DEBUGINFOD_URLS: string;
	export const __MISE_ORIG_PATH: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const XDG_SESSION_CLASS: string;
	export const LC_MEASUREMENT: string;
	export const npm_package_name: string;
	export const VIRTUAL_ENV_DISABLE_PROMPT: string;
	export const USER: string;
	export const CUDA_DISABLE_PERF_BOOST: string;
	export const MANAGERPID: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const GIT_PAGER: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		SVELTEKIT_FORK: string;
		NODE_ENV: string;
		npm_node_execpath: string;
		DEBIAN_FRONTEND: string;
		PATH: string;
		JOURNAL_STREAM: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_package_json: string;
		XDG_RUNTIME_DIR: string;
		FC_FONTATIONS: string;
		npm_execpath: string;
		npm_config_user_agent: string;
		XDG_SESSION_ID: string;
		XDG_VTNR: string;
		GIT_EDITOR: string;
		GIT_MERGE_AUTOEDIT: string;
		SHLVL: string;
		DISPLAY: string;
		XDG_DATA_DIRS: string;
		MANPAGER: string;
		LC_NUMERIC: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		XDG_SESSION_TYPE: string;
		LC_TELEPHONE: string;
		LC_PAPER: string;
		QT_QPA_PLATFORMTHEME: string;
		npm_lifecycle_event: string;
		LC_NAME: string;
		XCURSOR_THEME: string;
		MEMORY_PRESSURE_WATCH: string;
		MOTD_SHOWN: string;
		SYSTEMD_EXEC_PID: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		PWD: string;
		XCURSOR_SIZE: string;
		npm_config_local_prefix: string;
		DESKTOP_SESSION: string;
		LC_ADDRESS: string;
		MAIL: string;
		LC_MONETARY: string;
		COLORTERM: string;
		AI_AGENT: string;
		XDG_SESSION_DESKTOP: string;
		XDG_SESSION_PATH: string;
		GDK_BACKEND: string;
		COPILOT_DEBUG_NONCE: string;
		NODE: string;
		LC_TIME: string;
		RUSTICL_ENABLE: string;
		__MISE_SESSION: string;
		INVOCATION_ID: string;
		TERM_PROGRAM: string;
		QT_WAYLAND_DISABLE_WINDOWDECORATION: string;
		NO_AT_BRIDGE: string;
		SHELL: string;
		VSSCRIPT_PATH: string;
		LOGNAME: string;
		npm_command: string;
		TERM_PROGRAM_VERSION: string;
		TERM: string;
		MANAGERPIDFDID: string;
		GRADLE_HOME: string;
		VSCODE_INJECTION: string;
		GIT_ASKPASS: string;
		MEMORY_PRESSURE_WRITE: string;
		VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
		HOME: string;
		LANG: string;
		MANROFFOPT: string;
		XDG_SEAT: string;
		npm_package_version: string;
		COPILOT_AGENT: string;
		npm_lifecycle_script: string;
		WAYLAND_DISPLAY: string;
		__MISE_DIFF: string;
		XDG_SEAT_PATH: string;
		_: string;
		XDG_CURRENT_DESKTOP: string;
		NIRI_SOCKET: string;
		CHROME_DESKTOP: string;
		MISE_SHELL: string;
		QT_QPA_PLATFORM: string;
		LC_IDENTIFICATION: string;
		DEBUGINFOD_URLS: string;
		__MISE_ORIG_PATH: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		XDG_SESSION_CLASS: string;
		LC_MEASUREMENT: string;
		npm_package_name: string;
		VIRTUAL_ENV_DISABLE_PROMPT: string;
		USER: string;
		CUDA_DISABLE_PERF_BOOST: string;
		MANAGERPID: string;
		VSCODE_GIT_IPC_HANDLE: string;
		GIT_PAGER: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
