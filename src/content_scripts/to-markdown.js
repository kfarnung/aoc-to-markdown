import { runtime } from "webextension-polyfill";
import { gfm } from "turndown-plugin-gfm";
import TurndownService from "turndown";

const descriptionTitle = "Description";
const partOneHeadingTitle = "Part One";

function stripHyphens(str) {
  const regex = /^--- (.+) ---$/;
  return str.replace(regex, (_match, p1) => {
    return p1;
  });
}

function generateMarkdown(doc) {
  const turndownService = new TurndownService({
    headingStyle: "atx",
  });

  // Use GitHub-flavored Markdown since that seems to be pretty feature-filled
  // and generates files that render well on GitHub.
  turndownService.use(gfm);

  // Special handling for emphasized code blocks (e.g.
  // `<code><em>1234<em></code>`). The default results in the underscores being
  // rendered (e.g. `_1234_`), but by inverting the tags it will emphasize the
  // code in the block (e.g. _`1234`_).
  turndownService.addRule("emphasizedCode", {
    filter: (node) =>
      node.nodeName == "CODE" &&
      node.childNodes.length == 1 &&
      node.firstChild.nodeName == "EM" &&
      node.firstChild.childNodes.length == 1 &&
      node.firstChild.firstChild.nodeType == Node.TEXT_NODE,
    replacement: (_content, node, options) =>
      `${options.emDelimiter}\`${node.innerText}\`${options.emDelimiter}`,
  });

  // Keep the spans which are used for alternate text in the puzzle description.
  turndownService.keep(["span"]);

  // Generate the document and append a newline.
  return turndownService.turndown(doc).concat("\n");
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
  descriptionHeader.innerText = descriptionTitle;
  newDoc.appendChild(descriptionHeader);

  const articleElements = document.querySelectorAll("article");
  const articleElementsLength = articleElements.length;
  for (let index = 0; index < articleElementsLength; ++index) {
    const article = articleElements[index].cloneNode(true);
    const headingElement = article.querySelector("h2");
    let heading = stripHyphens(headingElement.innerText);

    if (index === 0) {
      titleElement.innerText = heading;
      heading = partOneHeadingTitle;
    }

    const newHeadingElement = document.createElement("h3");
    newHeadingElement.innerText = heading;
    headingElement.replaceWith(newHeadingElement);

    newDoc.appendChild(article);
  }

  return generateMarkdown(newDoc);
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
