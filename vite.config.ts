import Typescript from "@rollup/plugin-typescript";
import Ttypescript from "ttypescript";
import { defineConfig } from "vite";
// import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
	plugins: [
		/* ...VitePluginNode({
			adapter: "koa",
			appPath: "./api/index.ts",
		}), */
		Typescript({
			typescript: Ttypescript,
		}),
	],
});
