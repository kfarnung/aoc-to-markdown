import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  addListener: vi.fn(),
}));

vi.mock("webextension-polyfill", () => ({
  storage: { sync: { get: mocks.get } },
  runtime: { onMessage: { addListener: mocks.addListener } },
}));

import { capturePage, createMarkdown } from "../src/content_scripts/to-markdown";

const partOne = `
  <article class="day-desc">
    <h2>--- Day 1: Example ---</h2>
    <p>Example code: <code>123</code>.</p>
  </article>`;
const partTwo = `
  <article class="day-desc">
    <h2>--- Part Two ---</h2>
    <p>Another description.</p>
  </article>`;
const answerOne = "<p>Your puzzle answer was <code>111</code>.</p>";
const answerTwo = "<p>Your puzzle answer was <code>222</code>.</p>";

beforeEach(() => {
  document.body.innerHTML = "";
  mocks.get.mockReset();
});

describe("answer export", () => {
  it("preserves the existing output when disabled", () => {
    document.body.innerHTML = `<main>${partOne}${answerOne}${partTwo}${answerTwo}</main>`;
    const withAnswers = createMarkdown(false);
    document.body.innerHTML = `<main>${partOne}${partTwo}</main>`;

    expect(withAnswers).toBe(createMarkdown(false));
    expect(withAnswers).toContain("Example code: `123`.");
    expect(withAnswers).not.toContain("Your puzzle answer was");
  });

  it("places each original answer after its corresponding part", () => {
    document.body.innerHTML = `<main>${partOne}${answerOne}${partTwo}${answerTwo}</main>`;
    const markdown = createMarkdown(true);

    expect(markdown).toMatch(
      /### Part One[\s\S]*Your puzzle answer was `111`\.[\s\S]*### Part Two[\s\S]*Your puzzle answer was `222`\./,
    );
    expect(document.querySelectorAll("article h2")).toHaveLength(2);
  });

  it("handles partially solved and unsolved pages", () => {
    document.body.innerHTML = `<main>${partOne}${answerOne}${partTwo}<p>Submit an answer.</p></main>`;
    const partial = createMarkdown(true);
    expect(partial).toContain("Your puzzle answer was `111`.");
    expect(partial).not.toContain("Your puzzle answer was `222`.");

    document.body.innerHTML = `<main>${partOne}<p>Submit an answer.</p></main>`;
    expect(createMarkdown(true)).toBe(createMarkdown(false));
  });

  it("ignores unrelated paragraphs and preserves code formatting", () => {
    document.body.innerHTML = `<main>${partOne}<p>Not an answer: <code>999</code>.</p>${partTwo}<p>Your puzzle answer was <code>a\`b</code>.</p></main>`;
    const markdown = createMarkdown(true);
    expect(markdown).not.toContain("Not an answer");
    expect(markdown).toContain("Your puzzle answer was ``a`b``.");
    expect(markdown).not.toContain("999");
  });

  it("does not mistake a paragraph without a direct answer code for an answer", () => {
    document.body.innerHTML = `<main>${partOne}<p>Your puzzle answer was unknown.</p>${partTwo}<p>Your puzzle answer was <span><code>999</code></span>.</p></main>`;
    expect(createMarkdown(true)).toBe(createMarkdown(false));
  });

  it("reads the preference on each capture and fails safely if storage fails", async () => {
    document.body.innerHTML = `<main>${partOne}${answerOne}</main>`;
    const blobs: Blob[] = [];
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      blobs.push(blob as Blob);
      return "blob:test";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const alert = vi.fn();
    window.alert = alert;
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.get.mockResolvedValueOnce({ includeAnswers: true });
    await capturePage();
    expect(blobs).toHaveLength(1);
    expect(await blobs[0].text()).toContain("Your puzzle answer was `111`.");

    mocks.get.mockRejectedValueOnce(new Error("storage unavailable"));
    await capturePage();
    expect(blobs).toHaveLength(2);
    expect(await blobs[1].text()).not.toContain("Your puzzle answer was");
    expect(alert).toHaveBeenCalledOnce();
    expect(error).toHaveBeenCalledOnce();
    vi.restoreAllMocks();
  });
});
