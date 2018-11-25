const path = require("path");

module.exports = {
    entry: {
        background_scripts: "./background_scripts/background.js",
        content_scripts: "./content_scripts/to-markdown.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name]/index.js"
    }
};
