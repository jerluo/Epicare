console.log("scrape script loaded");

// Check if we are in notes tab
const fmtConvElement = document.querySelector(".fmtConv");
if (fmtConvElement) {
    const assistiveiconDiv = document.getElementById('assistiveicons');
    if (assistiveiconDiv) {
        document.querySelector('.assistiveicon').style.float = 'left';
        // Define the HTML for the new image
        const newImageHTML = ' <div id="summarize" style="display: inline width: 34px; height: 40px;"> <img src="https://i.postimg.cc/d3R9ZbT4/bot-Profile.png" alt="Confused?" width="34" height="38"title="Click to summarize notes"style="cursor: pointer;"> </div>'
        // Insert the new image after the existing content of the div
        assistiveiconDiv.insertAdjacentHTML('beforeend', newImageHTML);
    }

    document.querySelector("#summarize").addEventListener("click", async (e) => {
        // scrape and send over
        // Pull the text from the data that is scraped from the above line after arriving at the element. 
        const reportData = fmtConvElement.textContent;

        // Open the side panel
        await chrome.runtime.sendMessage({action: "open-sidepanel"});

        // Need to wait a little for listener in side panel to start (i know bad practice to just sleep but idc)
        // Then send data over
        setTimeout(() => {
            console.log("Delayed for 1 second.");
            console.log("sending to popup")
            chrome.runtime.sendMessage({ target: 'popup', data: reportData });
        }, 1000);
            
    })
} 
