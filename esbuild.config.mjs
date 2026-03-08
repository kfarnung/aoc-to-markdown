import * as esbuild from "esbuild";

const browsers = ["chrome", "firefox"];

for (const browser of browsers) {
  await esbuild.build({
    entryPoints: {
      [`${browser}/background_scripts/index`]:
        "./src/background_scripts/background.js",
      [`${browser}/content_scripts/index`]: "./src/content_scripts/index.js",
    },
    bundle: true,
    outdir: "addon",
    minify: false,
    format: "iife",
  });
}
