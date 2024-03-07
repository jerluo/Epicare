console.log("scrape script loaded");

// Creating gemini process and its starter code
const express = require('express');
const app = express();
const port = 3000;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI);


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
