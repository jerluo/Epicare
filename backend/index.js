const express = require('express')
const app = express()
const port = 3000

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI);

app.use(express.json());

app.get('/', async (req, res) => {
    console.log(req.body);
    const summary = await gemini();
    console.log(summary);
    res.send(summary);
})
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function gemini() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent("what is epic systems?");
    const response = result.response.text();
    return response;
}