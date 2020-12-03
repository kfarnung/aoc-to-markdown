import {
  downloads,
  runtime,
  pageAction,
  tabs as _tabs,
} from "webextension-polyfill";

function saveAs(text) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });

  return downloads.download({
    url: URL.createObjectURL(blob),
    filename: "README.md",
    saveAs: true,
  });
}

runtime.onMessage.addListener((data, sender) => {
  switch (data.action) {
    case "saveAs":
      saveAs(data.text).catch((err) => {
        console.error("Failed to save content", err);
      });
      break;

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
