import { getIncludeAnswers, setIncludeAnswers } from "../settings";

const checkbox = document.querySelector<HTMLInputElement>("#include-answers");
const status = document.querySelector<HTMLElement>("#status");

if (!checkbox || !status) {
  throw new Error("Missing settings controls");
}

async function initialize(): Promise<void> {
  try {
    checkbox!.checked = await getIncludeAnswers();
    checkbox!.disabled = false;
  } catch (error) {
    console.error("Failed to load settings", error);
    status!.textContent = "Could not load settings. Reload this page to try again.";
  }
}

checkbox.addEventListener("change", () => {
  const selected = checkbox.checked;
  checkbox.disabled = true;
  status.textContent = "Saving...";

  void setIncludeAnswers(selected)
    .then(() => {
      status.textContent = "Settings saved.";
    })
    .catch((error: unknown) => {
      console.error("Failed to save settings", error);
      checkbox.checked = !selected;
      status.textContent = "Could not save settings. Please try again.";
    })
    .finally(() => {
      checkbox.disabled = false;
    });
});

void initialize();
