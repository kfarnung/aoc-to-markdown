const fs = require("fs");

function generateManifest(inputFile, outputFile, version, browser) {
  const content = fs.readFileSync(inputFile, { encoding: "utf-8" });
  const parsed = JSON.parse(content);

  parsed["version"] = version;

  if (browser === "chrome") {
    delete parsed["browser_specific_settings"];
  } else if (browser === "firefox") {
    const serviceWorker = parsed["background"]["service_worker"];
    delete parsed["background"]["service_worker"];
    parsed["background"]["scripts"] = [serviceWorker];
  }

  const output = JSON.stringify(parsed, undefined, 2);
  fs.writeFileSync(outputFile, output, { encoding: "utf-8" });
  console.log("Generated manifest: ", outputFile);
}

const inputFile = './src/manifest.json';
const version = process.env.npm_package_version;
if (!version) {
  throw new Error("No version was found");
}

generateManifest(inputFile, './addon/chrome/manifest.json', version, "chrome");
generateManifest(inputFile, './addon/firefox/manifest.json', version, "firefox");
