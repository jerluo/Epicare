console.log("loaded background");
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['scripts/scrape.js']
    });
  });