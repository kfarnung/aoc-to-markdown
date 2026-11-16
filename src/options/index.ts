import { getIncludeAnswers, setIncludeAnswers } from "../settings";

const checkbox = document.querySelector<HTMLInputElement>("#include-answers");
const status = document.querySelector<HTMLElement>("#status");

if (!checkbox || !status) {
  throw new Error("Missing settings controls");
}

function updateStatus(message: string, state: "success" | "error" | "pending" | ""): void {
  status!.textContent = message;
  if (state) {
    status!.dataset.state = state;
  } else {
    delete status!.dataset.state;
  }
}

async function initialize(): Promise<void> {
  try {
    checkbox!.checked = await getIncludeAnswers();
    checkbox!.disabled = false;
  } catch (error) {
    console.error("Failed to load settings", error);
    updateStatus("Could not load settings. Reload this page to try again.", "error");
  }
}

checkbox.addEventListener("change", () => {
  const selected = checkbox.checked;
  checkbox.disabled = true;
  updateStatus("Saving your preference...", "pending");

  void setIncludeAnswers(selected)
    .then(() => {
      updateStatus("Preference saved.", "success");
    })
    .catch((error: unknown) => {
      console.error("Failed to save settings", error);
      checkbox.checked = !selected;
      updateStatus("Could not save your preference. Please try again.", "error");
    })
    .finally(() => {
      checkbox.disabled = false;
    });
});

void initialize();
