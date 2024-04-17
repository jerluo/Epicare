# Epicare

Epicare is a Google Chrome Extension integrated with MyChart by Epic to simplify health information with AI. 

## Setup Guide

### Chrome Extension
Clone the repo, go to [chrome://extensions/](chrome://extensions/), click load unpacked on the top left of the page, and load Epicare/extension/ 

### Backend

Deploy your own backend from the Epicare/backend folder. Create a Google Gemini API key and add it to the environmental variables as GEMINI. 
```bash
export GEMINI="Your GEMINI API key"
npm install
node index.js
```
Go to Epicare/extension/sidepanel/sidepanel.js and change the url variable to your endpoint.

```javascript
const url = 'YOUR ENDPOINT';
```

## Usage

There are 3 main ways to use the extension -

1. Manually chat with Eppy, our AI assistant, by clicking on the extension icon to open a sideapanel.
2. Inside of MyChart after-visit notes, click on the Epicare icon on the page to summarize your notes for you.
3. With the Eppy sidepanel open, highlight unfamiliar words within MyChart to define and explain what they mean  

## What's Next

TODO

## Acknowledgements

Special thanks to our mentors from Epic - Tony Bomberg, Dan Wortmann, and Gabby Cottiero!\
And to our instructor and TA - Amber Field and Naman Gupta

Created at UW-Madison for CS639 Capstone Course by Brock Naidl, Jerry Luo, Laasya Adusumillli, Mary Kim, Neev Liberman