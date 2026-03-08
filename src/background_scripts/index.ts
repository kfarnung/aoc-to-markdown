import {
  action,
  runtime,
  tabs as _tabs,
  type Runtime,
} from "webextension-polyfill";

interface ExtensionMessage {
  action: string;
}

runtime.onMessage.addListener((data: unknown, sender: Runtime.MessageSender) => {
  const message = data as ExtensionMessage;
  switch (message.action) {
    case "showPageAction":
      if (sender.tab?.id !== undefined) {
        action.enable(sender.tab.id);
      }
      break;

    default:
      console.warn("Unknown action", message.action);
      break;
  }
});

runtime.onInstalled.addListener(() => {
  action.disable();
});

runtime.onStartup.addListener(() => {
  action.disable();
});

action.onClicked.addListener(() => {
  _tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      if (tabs[0]?.id !== undefined) {
        return _tabs.sendMessage(tabs[0].id, { action: "capturePage" });
      }
    })
    .catch((e: unknown) => {
      console.error("Failed to send 'capturePage' message", e);
    });
});
