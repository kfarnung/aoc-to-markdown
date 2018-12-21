const browser = require("webextension-polyfill");

function urlIsApplicable(url) {
    const regex = /^https:\/\/adventofcode.com\/\d{4}\/day\/\d{1,2}/;
    return regex.test(url);
}

function initializePageAction(tab) {
    if (urlIsApplicable(tab.url)) {
        browser.pageAction.show(tab.id);
    } else {
        browser.pageAction.hide(tab.id);
    }
}

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initializePageAction(tab);
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === "saveAs") {
        const blob = new Blob([message.text], { type: "text/plain;charset=utf-8" });

        browser.downloads.download({
            url: URL.createObjectURL(blob),
            filename: "README.md",
            saveAs: true,
        }).catch((e) => {
            console.error(e);
        });
    } else {
        console.warn(`Unknown action: ${message.action}`);
    }
});

browser.pageAction.onClicked.addListener(() => {
    browser.tabs.executeScript({file: "/content_scripts/index.js"})
        .catch((e) => {
            console.error(e);
        });
});

browser.tabs.query({}).then((tabs) => {
    for (const tab of tabs) {
        initializePageAction(tab);
    }
});
