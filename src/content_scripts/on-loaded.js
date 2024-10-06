import { runtime } from "webextension-polyfill";

function showPageAction() {
  runtime.sendMessage({ action: "showPageAction" }).catch((err) => {
    console.error("Failed to send 'showPageAction' message", err);
  });
}

// Detect history navigation (back/forward)
window.addEventListener("pageshow", () => {
  showPageAction();
});

showPageAction();
