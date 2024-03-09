const express = require('express')
const cors = require('cors')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

// Set up express app
const app = express()
const port = 3000

// configure cors
const corsOptions = {
    origin: 'chrome-extension://jjpaaigpmomkjelbgjoaobjfilgbkkbi'
}
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI);

app.use(express.json());

app.use((req, res, next) => {
    const allowedOrigins = ['chrome-extension://jjpaaigpmomkjelbgjoaobjfilgbkkbi'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post('/', async (req, res) => {
    console.log(req.body);
    const summary = await gemini(req.body.message, req.body.history);
    console.log(summary);
    res.json({response : summary});
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function gemini(message, history) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(message);
    const response = result.response.text();
    return response;
}