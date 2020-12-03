const fs = require("fs");

const version = process.env.npm_package_version;
if (!version) {
  throw new Error("No version was found");
}

const inputFile = process.argv[2];
if (!inputFile) {
  throw new Error("No input file provided");
}

const outputFile = process.argv[3];
if (!outputFile) {
  throw new Error("No output file provided");
}

const content = fs.readFileSync(inputFile, { encoding: "utf-8" });
const parsed = JSON.parse(content);

parsed["version"] = version;

const output = JSON.stringify(parsed, undefined, 2);
fs.writeFileSync(outputFile, output, { encoding: "utf-8" });

console.log("Generated manifest: ", outputFile);
