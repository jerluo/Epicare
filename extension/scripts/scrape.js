console.log("scrape script loaded");

// Creating gemini process and its starter code
const express = require('express');
const app = express();
const port = 3000;

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI);

app.use(express.json());

app.get('/', async (req, res) => {
    try {
	// Scraping website for data
        // const fmtConvElement = document.querySelector(".fmtConv");
        if(True) {
            // const reportData = fmtConvElement.textContent;
            const reportData = "What is the tallest building in the world?"
	    console.log(reportData);
	    
	    const result = await genAI.getGenerativeModel({model : "gemini-pro" }).generateContent(reportData);

	    const response = result.response.text();

	    console.log(response);

        } else {
            console.error("Element with class 'fmtConv' not found.");
	    res.status(404).send("Element not found")
        }

    } catch (error) {
        console.error("There was an error when generating your summary.", error);
	res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
