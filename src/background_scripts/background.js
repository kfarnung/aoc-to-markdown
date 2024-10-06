import {
  downloads,
  runtime,
  pageAction,
  tabs as _tabs,
} from "webextension-polyfill";

runtime.onMessage.addListener((data, sender) => {
  switch (data.action) {
    case "showPageAction":
      pageAction.show(sender.tab.id);
      break;

    default:
      console.warn("Unknown action", data.action);
      break;
  }
});

pageAction.onClicked.addListener(() => {
  _tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      return _tabs.sendMessage(tabs[0].id, { action: "capturePage" });
    })
    .catch((e) => {
      console.error("Failed to send 'capturePage' message", e);
    });
});
