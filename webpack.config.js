const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    "chrome/background_scripts": ["./src/background_scripts/background.js"],
    "chrome/content_scripts": [
      "./src/content_scripts/on-loaded.js",
      "./src/content_scripts/to-markdown.js",
    ],
    "firefox/background_scripts": ["./src/background_scripts/background.js"],
    "firefox/content_scripts": [
      "./src/content_scripts/on-loaded.js",
      "./src/content_scripts/to-markdown.js",
    ],
  },
  output: {
    path: path.resolve(__dirname, "addon"),
    filename: "[name]/index.js",
  },
  optimization: {
    minimize: false,
  },
};
