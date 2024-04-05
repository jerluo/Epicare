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

  if (request.action === 'get-history') {
    console.log("getting chat history")
    chrome.storage.session.get(['history'], function(result) {
      if (result.history) {
        console.log('History retrieved from session storage:', result.history);
        sendResponse({history : history})
      } 
      // Initialize history
      else {
        console.log('No history found in session storage');
        const history = [];
        history.push({
          "role": "model",
          "parts":"Hi there! I'm Eppy, and I'm here to answer any questions you may have about your health. Let's chat!"
        }) 
        console.log(history)
        sendResponse({history : history})
      }
    });
    return true
  }
});

async function getHistory() {
  

}