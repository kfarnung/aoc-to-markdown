import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  action: {
    disable: vi.fn(),
    enable: vi.fn(),
    onClicked: { addListener: vi.fn() },
  },
  runtime: {
    lastError: undefined,
    onMessage: { addListener: vi.fn() },
    onInstalled: { addListener: vi.fn() },
    onStartup: { addListener: vi.fn() },
    openOptionsPage: vi.fn(),
  },
  contextMenus: {
    create: vi.fn(),
    removeAll: vi.fn(),
    onClicked: { addListener: vi.fn() },
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
}));

vi.mock("webextension-polyfill", () => mocks);

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  mocks.contextMenus.removeAll.mockResolvedValue(undefined);
  mocks.contextMenus.create.mockImplementation((_properties, callback) => {
    callback?.();
    return "open-settings";
  });
  mocks.runtime.openOptionsPage.mockResolvedValue(undefined);
});

describe("extension settings menu", () => {
  it("adds a toolbar action menu item that opens the options page", async () => {
    await import("../src/background_scripts");

    const onInstalled = mocks.runtime.onInstalled.addListener.mock.calls[0][0];
    onInstalled();
    await vi.waitFor(() => expect(mocks.contextMenus.create).toHaveBeenCalledOnce());

    expect(mocks.contextMenus.create).toHaveBeenCalledWith(
      {
        id: "open-settings",
        title: "Settings...",
        contexts: ["action"],
      },
      expect.any(Function),
    );

    const onMenuClicked = mocks.contextMenus.onClicked.addListener.mock.calls[0][0];
    onMenuClicked({ menuItemId: "open-settings" });
    await vi.waitFor(() => expect(mocks.runtime.openOptionsPage).toHaveBeenCalledOnce());
  });

  it("ignores other menu items", async () => {
    await import("../src/background_scripts");

    const onMenuClicked = mocks.contextMenus.onClicked.addListener.mock.calls[0][0];
    onMenuClicked({ menuItemId: "another-item" });

    expect(mocks.runtime.openOptionsPage).not.toHaveBeenCalled();
  });
});
