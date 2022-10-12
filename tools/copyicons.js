const fs = require("fs");

fs.mkdirSync("addon/chrome/icons", { recursive: true });
fs.mkdirSync("addon/firefox/icons", { recursive: true });

fs.readdirSync("icons").forEach((file) => {
  fs.copyFileSync(`icons/${file}`, `addon/chrome/icons/${file}`);
  fs.copyFileSync(`icons/${file}`, `addon/firefox/icons/${file}`);
});

console.log("Copied icons");
