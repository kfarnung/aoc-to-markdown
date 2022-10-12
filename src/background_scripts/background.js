import {
  action,
  downloads,
  runtime,
  tabs as _tabs,
} from "webextension-polyfill";

function saveAs(url) {
  return downloads.download({
    url,
    filename: "README.md",
    saveAs: true,
  });
}

runtime.onInstalled.addListener(() => {
  action.disable();
});

runtime.onMessage.addListener((data, sender) => {
  switch (data.action) {
    case "saveAs":
      saveAs(data.text).catch((err) => {
        console.error("Failed to save content", err);
      });
      break;

    case "showPageAction":
      action.enable(sender.tab.id);
      break;

    default:
      console.warn("Unknown action", data.action);
      break;
  }
});

action.onClicked.addListener(() => {
  _tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      return _tabs.sendMessage(tabs[0].id, { action: "capturePage" });
    })
    .catch((e) => {
      console.error("Failed to send 'capturePage' message", e);
    });
});
