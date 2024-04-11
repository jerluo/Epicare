const express = require('express')
const cors = require('cors')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

// Set up express app
const app = express()
const port = 3000

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI);

app.use(express.json());
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && origin.startsWith('chrome-extension://')) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.post('/api', async (req, res) => {    
    const { operation, message, history } = req.body;

    if (!message || !history) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const summaryPrompt = "Can you succinctly summarize these notes by bolding each section and explaining the details in bullet point? Here is the notes: "
    const chatPrompt = "You are chat bot named Eppy answering a question from a patient about a specific question pertaining to their health, answer succinctly and assume the patient is 5 : ";

    let response
    switch (operation) {
        case 'chat':
          const chatPrompt = "You are chat bot named Eppy answering a question from a patient about a specific question pertaining to their health, answer succinctly and assume the patient is 5 : ";
          response = await gemini(chatPrompt + message, history);
          break;
        case 'summary':
          const summaryPrompt = "Can you succinctly summarize these notes by bolding each section and explaining the details in bullet point? Here is the notes: ";
          response = await gemini(summaryPrompt + message, history);
          break;
        default:
          return res.status(400).json({ error: 'Invalid operation' });
    }

    return res.json({ response: response });
})
  
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})

async function gemini(message, history) {
    console.log("prompting gemini")
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    try {
        const chat = model.startChat({
            history: history,
        });
                
        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.log("message: " + error.message)        
        console.error("An error occurred:", error);
        return error.message;
        
    }
}