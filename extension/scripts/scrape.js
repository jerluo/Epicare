console.log("scrape script loaded");

// checking for the element to see if it exists so it doesnt stop functioning.
const fmtConvElement = document.querySelector(".fmtConv");
if (fmtConvElement) {
    // Pull the text from the data that is scraped from the above line after arriving at the element. 
    const reportData = fmtConvElement.textContent;
    console.log(reportData);
} else {
    console.error("Element with class 'fmtConv' not found.");
}
try {
    alert('Inspect and look at console.');
} catch (error) {
    console.error("An error occurred:", error);
}
