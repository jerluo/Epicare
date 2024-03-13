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

app.use(
    cors({
        origin: function (origin, callback) {
          // Allow requests with no origin (like mobile apps or curl requests)
          if (!origin) return callback(null, true);
    
          if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
      })
);

app.post('/api', cors(), async (req, res) => {
    console.log(req.body);
    
    const message = req.body.message
    const history = req.body.history
    if (message && history) {
        const summary = await gemini(message, history);
        console.log(summary);
        res.json({response : summary});
    }

    return res.send()
    
})
  
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})

async function gemini(message, history) {
    console.log("prompting gemini with ", message)
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(message);
    const response = result.response.text();
    return response;
}