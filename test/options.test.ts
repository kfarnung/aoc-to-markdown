import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
}));

vi.mock("webextension-polyfill", () => ({
  storage: { sync: { get: mocks.get, set: mocks.set } },
}));

beforeEach(() => {
  vi.resetModules();
  mocks.get.mockReset();
  mocks.set.mockReset();
  document.body.innerHTML = `
    <input id="include-answers" type="checkbox" disabled>
    <p id="status"></p>`;
});

async function openOptions() {
  await import("../src/options/index");
  return {
    checkbox: document.querySelector<HTMLInputElement>("#include-answers")!,
    status: document.querySelector<HTMLElement>("#status")!,
  };
}

describe("options", () => {
  it.each([undefined, "true", false])("defaults to off for %s", async (value) => {
    mocks.get.mockResolvedValue({ includeAnswers: value });
    const { checkbox } = await openOptions();
    await vi.waitFor(() => expect(checkbox.disabled).toBe(false));
    expect(checkbox.checked).toBe(false);
  });

  it("loads and saves the synced preference", async () => {
    mocks.get.mockResolvedValue({ includeAnswers: true });
    mocks.set.mockResolvedValue(undefined);
    const { checkbox, status } = await openOptions();
    await vi.waitFor(() => expect(checkbox.disabled).toBe(false));
    expect(checkbox.checked).toBe(true);

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change"));
    expect(checkbox.disabled).toBe(true);
    await vi.waitFor(() => expect(checkbox.disabled).toBe(false));
    expect(mocks.set).toHaveBeenCalledWith({ includeAnswers: false });
    expect(status.textContent).toBe("Preference saved.");
  });

  it("reports load failures without enabling the checkbox", async () => {
    mocks.get.mockRejectedValue(new Error("storage unavailable"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { checkbox, status } = await openOptions();
    await vi.waitFor(() => expect(status.textContent).toContain("Could not load"));
    expect(checkbox.disabled).toBe(true);
    error.mockRestore();
  });

  it("rolls back a failed save and allows retrying", async () => {
    mocks.get.mockResolvedValue({});
    mocks.set.mockRejectedValue(new Error("storage unavailable"));
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const { checkbox, status } = await openOptions();
    await vi.waitFor(() => expect(checkbox.disabled).toBe(false));
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(status.textContent).toContain("Could not save"));
    expect(checkbox.checked).toBe(false);
    expect(checkbox.disabled).toBe(false);
    error.mockRestore();
  });
});
