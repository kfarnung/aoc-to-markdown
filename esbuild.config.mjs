import * as esbuild from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));
const manifest = JSON.parse(readFileSync("./src/manifest.json", "utf-8"));

function generateManifest(browser) {
  const output = { ...manifest, version: pkg.version };

  if (browser === "chrome") {
    delete output.browser_specific_settings;
  } else if (browser === "firefox") {
    const serviceWorker = output.background.service_worker;
    output.background = { scripts: [serviceWorker] };
  }

  const dest = `addon/${browser}/manifest.json`;
  writeFileSync(dest, JSON.stringify(output, undefined, 2), "utf-8");
  console.log("Generated manifest:", dest);
}

function copyIcons(browser) {
  const dest = `addon/${browser}/icons`;
  mkdirSync(dest, { recursive: true });
  for (const file of readdirSync("src/icons")) {
    copyFileSync(`src/icons/${file}`, `${dest}/${file}`);
  }
}

function copyOptions(browser) {
  const dest = `addon/${browser}/options`;
  mkdirSync(dest, { recursive: true });
  copyFileSync("src/options/index.html", `${dest}/index.html`);
  copyFileSync("src/options/styles.css", `${dest}/styles.css`);
}

const browsers = ["chrome", "firefox"];

await Promise.all(
  browsers.map((browser) =>
    esbuild.build({
      entryPoints: {
        [`${browser}/background_scripts/index`]:
          "./src/background_scripts/index.ts",
        [`${browser}/content_scripts/index`]: "./src/content_scripts/index.ts",
        [`${browser}/options/index`]: "./src/options/index.ts",
      },
      bundle: true,
      outdir: "addon",
      minify: false,
      format: "iife",
    })
  )
);

for (const browser of browsers) {
  generateManifest(browser);
  copyIcons(browser);
  copyOptions(browser);
}

console.log("Build complete");
