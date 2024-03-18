chrome.runtime.onInstalled.addListener(() => {
  console.log("loaded background");
})

chrome.action.onClicked.addListener((tab) => {
  chrome.windows.getCurrent(async window => {
    chrome.sidePanel.open({
      windowId: window.id
    });
  });
});

// use chrome.action.runPopup()
// initialize the storage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
  if (request.action === 'open-sidepanel') {
    console.log("running side panel")
    
    chrome.windows.getCurrent(async window => {
      await chrome.sidePanel.open({
        windowId: window.id
      });
      sendResponse({opened : true});
    });
      
    return true
  }
});

function initializeStorage() {
  chrome.storage.local.set({ history : [] }).then(() => {
    console.log("Set chat history");
  });
  
  return 'storage initialized';
}