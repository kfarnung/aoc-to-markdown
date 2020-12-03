import { runtime } from "webextension-polyfill";

runtime
  .sendMessage({
    action: "showPageAction",
  })
  .catch((err) =>
    console.error("Failed to send 'showPageAction' message", err)
  );
