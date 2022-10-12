import { runtime } from "webextension-polyfill";

console.log("Loaded!");

runtime
  .sendMessage({
    action: "showPageAction",
  })
  .catch((err) =>
    console.error("Failed to send 'showPageAction' message", err)
  );
