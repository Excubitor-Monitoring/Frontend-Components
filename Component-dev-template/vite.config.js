import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({}),
      exclude: /Component\.svelte$/,
      emitCss: false,
    }),
    svelte({
      preprocess: sveltePreprocess({}),
      include: /Component\.svelte$/,
      compilerOptions: {
        customElement: true,
      },
      emitCss: false,
    }),
  ],
  build: {
    sourcemap: true,
    target: "modules",
    lib: {
      entry: "src/build.js",
      name: "<<name>>",
      fileName: "index",
    },
  },
});