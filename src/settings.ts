import { storage } from "webextension-polyfill";

const includeAnswersKey = "includeAnswers";

export async function getIncludeAnswers(): Promise<boolean> {
  const settings = await storage.sync.get(includeAnswersKey);
  return settings[includeAnswersKey] === true;
}

export async function setIncludeAnswers(includeAnswers: boolean): Promise<void> {
  await storage.sync.set({ [includeAnswersKey]: includeAnswers });
}
