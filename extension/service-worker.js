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
    
    getHistory().then((history) => {
      sendResponse({history : history})
    })

    return true
  }

  if (request.action === 'set-history') {
    console.log('setting new chat history')
    const person = request.user ? "user" : "model"
    const newHistory = 
      {
        "role": person,
        "parts": request.parts
      }

    getHistory().then((history) => {
      history.push(newHistory);
      chrome.storage.session.set({ history: history }).then(() => {
        console.log("History is set");
      });
    })

    return true
  }
});

async function getHistory() {
  const result = await chrome.storage.session.get(['history'])
   
  if (result.history) {
    console.log('History retrieved from session storage:', result.history);
    return result.history
  } 
  // Initialize history
  else {
    console.log('No history found in session storage');    
    return []
  }
  
}