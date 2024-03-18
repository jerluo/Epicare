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
    const message = req.body.message
    const history = req.body.history
    if (message && history) {
        const summary = await gemini(message, history);
        console.log(summary);
        res.json({response : summary});
    } else {
        res.sendStatus(400)
    }

    return res.send()
    
})
  
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})

async function gemini(message, history) {
    console.log("prompting gemini")
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    try {
        const result = await model.generateContent(message);
        const response = result.response.text();
        return response;
    } catch (error) {
        console.log("message: " + error.message)
        console.log("status" + error.status)
        if (error.status === 503) {
          return "Model overloaded, please try again later.";
        } else {
          console.error("An error occurred:", error);
          return "An error occurred while generating the response. Please try again later.";
        }
    }
}