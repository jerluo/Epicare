console.log("scrape script loaded");

// Check if we are in notes tab
const fmtConvElement = document.querySelector(".fmtConv");
if (fmtConvElement) {
    const assistiveiconDiv = document.getElementById('assistiveicons');
    if (assistiveiconDiv) {
        document.querySelector('.assistiveicon').style.float = 'left';
        // Define the HTML for the new image
        const newImageHTML = ' <div id="summarize" style="display: inline width: 34px; height: 40px;"> <img src="https://i.postimg.cc/d3R9ZbT4/bot-Profile.png" alt="Confused?" width="34" height="38"title="Click to summarize notes"style="cursor: pointer;"> </div>';
        // Insert the new image after the existing content of the div
        assistiveiconDiv.insertAdjacentHTML('beforeend', newImageHTML);
    }
    
    
} 

document.querySelector("#summarize").addEventListener("click", async (e) => {
    // scrape and send over
    // Pull the text from the data that is scraped from the above line after arriving at the element. 
    const reportData = fmtConvElement.textContent;
    // Adding the prompt so easy to just plugin to AI
    const prompt = "Can you summarize the notes below: \n" + reportData;
    console.log(prompt);
    // Trying to send POST Request to backend in
    try {
        // Need to add backend endpoint
        const response = await fetch ('backend endpoint', {
            method: "POST",
            headers: {
                'Content-Type' : "application/json",

            },
            body: JSON.stringify({prompt}),
        });
        if (response.ok) {
            const result = await response.json();
            console.log("Summary: \n", result);
        } else {
            console.error('Error from backend', response.statusText);
        }
    } catch {
        console.error('Error during fetch:', error)

    }
})
