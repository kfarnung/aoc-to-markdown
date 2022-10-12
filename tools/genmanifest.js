const fs = require("fs");

const version = process.env.npm_package_version;
if (!version) {
  throw new Error("No version was found");
}

const inputFile = './src/manifest.json';
const chromeOutputFile = './addon/chrome/manifest.json';
const firefoxOutputFile = './addon/firefox/manifest.json';

const content = fs.readFileSync(inputFile, { encoding: "utf-8" });
const parsed = JSON.parse(content);

parsed["version"] = version;

const chromeOutput = JSON.stringify(parsed, undefined, 2);
fs.writeFileSync(chromeOutputFile, chromeOutput, { encoding: "utf-8" });
console.log("Generated manifest: ", chromeOutputFile);

// Firefox requires a different manifest structure
const serviceWorker = parsed["background"]["service_worker"];
delete parsed["background"]["service_worker"];
parsed["background"]["scripts"] = [serviceWorker];

const firfoxOutput = JSON.stringify(parsed, undefined, 2);
fs.writeFileSync(firefoxOutputFile, firfoxOutput, { encoding: "utf-8" });
console.log("Generated manifest: ", firefoxOutputFile);
