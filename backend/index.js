const express = require('express')
const cors = require('cors')
const { GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold, } = require("@google/generative-ai");
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

    const summaryPrompt = "Can you summarize these notes in bullet points using a hephyn, so a common person can understand? Bold each main section:  "
    const chatPrompt = "You are chat bot named Eppy answering a question from a patient about a specific question pertaining to their health, answer succinctly and assume the patient does not have advanced medical knowledge : ";

    let response
    switch (operation) {
        case 'chat':
          response = await gemini(chatPrompt + message, history);
          break;
        case 'summary':
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
    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };
        
    const safetySettings = [
        {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    try {
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history,
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