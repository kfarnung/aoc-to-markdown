const gfm = require('turndown-plugin-gfm').gfm;
const TurndownService = require('turndown').default;

function stripHyphens (str) {
    const regex = /^--- (.+) ---$/;
    return str.replace(regex, (match, p1) => {
        return p1;
    });
}

const newDoc = document.createDocumentFragment();
const titleElement = document.createElement('h1');
newDoc.appendChild(titleElement);

const link = document.createElement('a');
link.href = window.location.href;
link.innerText = window.location.href;
newDoc.appendChild(link);

const descriptionHeader = document.createElement('h2');
descriptionHeader.innerText = 'Description';
newDoc.appendChild(descriptionHeader);

const articleElements = document.querySelectorAll('article');
const articleElementsLength = articleElements.length;
for (let index = 0; index < articleElementsLength; ++index) {
    const article = articleElements[index].cloneNode(true);
    const headingElement = article.querySelector('h2');
    let heading = stripHyphens(headingElement.innerText);

    if (index === 0) {
        titleElement.innerText = heading;
        heading = 'Part One';
    }

    const newHeadingElement = document.createElement('h3');
    newHeadingElement.innerText = heading;
    headingElement.replaceWith(newHeadingElement);

    newDoc.appendChild(article);
}

const turndownService = new TurndownService({
    headingStyle: 'atx'
});
turndownService.use(gfm);

const markdown = turndownService.turndown(newDoc).concat('\n');

browser.runtime.sendMessage({
    action: "saveAs",
    text: markdown,
});
