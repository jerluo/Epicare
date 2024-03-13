chrome.runtime.onInstalled.addListener(() => {
  console.log("loaded background");
})

// use chrome.action.runPopup()
// initialize the storage
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension");
  if (request.action === 'runPopup') {
    console.log("running popup")
    const result = initializeStorage();
    chrome.window.open("popup/popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");

    //await chrome.action.setPopup({popup: 'popup/popup.html'});
    sendResponse({ result });
  }
});

function initializeStorage() {
  chrome.storage.local.set({ history : [] }).then(() => {
    console.log("Set chat history");
  });
  
  return 'storage initialized';
}