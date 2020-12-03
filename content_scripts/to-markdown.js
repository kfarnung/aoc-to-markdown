import { runtime } from "webextension-polyfill";
import { gfm } from "turndown-plugin-gfm";
import TurndownService from "turndown";

function stripHyphens(str) {
  const regex = /^--- (.+) ---$/;
  return str.replace(regex, (match, p1) => {
    return p1;
  });
}

function capturePage() {
  const newDoc = document.createDocumentFragment();
  const titleElement = document.createElement("h1");
  newDoc.appendChild(titleElement);

  const link = document.createElement("a");
  const href = window.location.origin + window.location.pathname;
  link.href = href;
  link.innerText = href;
  newDoc.appendChild(link);

  const descriptionHeader = document.createElement("h2");
  descriptionHeader.innerText = "Description";
  newDoc.appendChild(descriptionHeader);

  const articleElements = document.querySelectorAll("article");
  const articleElementsLength = articleElements.length;
  for (let index = 0; index < articleElementsLength; ++index) {
    const article = articleElements[index].cloneNode(true);
    const headingElement = article.querySelector("h2");
    let heading = stripHyphens(headingElement.innerText);

    if (index === 0) {
      titleElement.innerText = heading;
      heading = "Part One";
    }

    const newHeadingElement = document.createElement("h3");
    newHeadingElement.innerText = heading;
    headingElement.replaceWith(newHeadingElement);

    newDoc.appendChild(article);
  }

  const turndownService = new TurndownService({
    headingStyle: "atx",
  });
  turndownService.use(gfm);
  turndownService.keep(["span"]);

  return turndownService.turndown(newDoc).concat("\n");
}

runtime.onMessage.addListener((data) => {
  if (data.action === "capturePage") {
    const markdown = capturePage();
    return runtime
      .sendMessage({
        action: "saveAs",
        text: markdown,
      })
      .catch((err) => console.error("Failed to send 'saveAs' message", err));
  }
});
