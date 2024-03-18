console.log("scrape script loaded");

// Check if we are in notes tab
const fmtConvElement = document.querySelector(".fmtConv");
if (fmtConvElement) {
    const assistiveiconDiv = document.getElementById('assistiveicons');
    if (assistiveiconDiv) {
        // Create a container div
        const containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex'; // Ensure flex display for proper alignment
        containerDiv.style.alignItems = 'center'; // Center align items vertically
        containerDiv.style.justifyContent = 'flex-end'; // Align items to the right
        
        // Define the HTML for the new image
        const newImageHTML = '<img id="summarize" src="https://i.postimg.cc/d3R9ZbT4/bot-Profile.png" alt="Confused?" width="50" height="50" title="Click to summarize notes" style="cursor: pointer;">';
        // Insert the new image into the container div
        containerDiv.innerHTML = newImageHTML;
        
        // Insert the container div after the existing content of the assistiveiconDiv
        assistiveiconDiv.parentNode.insertBefore(containerDiv, assistiveiconDiv.nextSibling);
    }

    document.getElementById("summarize").addEventListener("click", async (e) => {
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
