import {
  action,
  contextMenus,
  runtime,
  tabs as _tabs,
  type Runtime,
} from "webextension-polyfill";

const settingsMenuItemId = "open-settings";

interface ExtensionMessage {
  action: string;
}

function createSettingsMenu(): void {
  void contextMenus
    .removeAll()
    .then(() => {
      contextMenus.create(
        {
          id: settingsMenuItemId,
          title: "Settings...",
          contexts: ["action"],
        },
        () => {
          if (runtime.lastError) {
            console.error("Failed to create the Settings menu item", runtime.lastError);
          }
        },
      );
    })
    .catch((error: unknown) => {
      console.error("Failed to initialize the extension menu", error);
    });
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
  createSettingsMenu();
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

contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === settingsMenuItemId) {
    void runtime.openOptionsPage().catch((error: unknown) => {
      console.error("Failed to open extension settings", error);
    });
  }
});
