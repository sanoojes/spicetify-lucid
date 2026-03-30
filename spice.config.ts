import { resolve } from "node:path";
import { defineConfig } from "@spicemod/creator";
import svgrPlugin from "esbuild-plugin-svgr";

// Learn more: https://gitlab.com/sanoojes/spicetify-creator
export default defineConfig({
  name: "Lucid",
  framework: "react",
  linter: "oxlint",
  template: "theme",
  packageManager: "bun",
  outDir: "dist",
  esbuildOptions: {
    tsconfig: "tsconfig.app.json",
    alias: {
      "@": resolve(__dirname, "src"),
      "@icons": resolve(__dirname, "assets/icons/"),
    },
    plugins: [svgrPlugin()],
  },
});
