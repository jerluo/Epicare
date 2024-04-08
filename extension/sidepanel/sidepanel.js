chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Check if the message is intended for this script
  if (message.target === 'popup') {
    // Handle the received data
    console.log(message.data)
    gemini("Can you succinctly summarize these notes by bolding each section and explaining the details in bullet point? Here is the notes:" + message.data).then(data => {
      // Add a line break before each bold section
      const boldedResponse = data.response.replace(/\*\*(.*?)\*\*/g, '<br><strong>$1</strong>');

      const formattedResponse = boldedResponse.replace(/<\/strong>/g, '</strong><br>');
      
      // Create chat bubble with the modified (bolded) response
      createChatBubble(formattedResponse, false);
    });
  }
});



// Function to decode HTML entities
function decodeHtmlEntities(html) {
    return html.replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#039;/g, "'")
               .replace(/&amp;/g, '&');
}

function createChatBubble(message, isUserMessage) {
  const chatMessage = document.createElement('div');
  chatMessage.classList.add('chat-message');
  chatMessage.classList.add(isUserMessage ? 'user-message' : 'eppy-message');

  const messageBubble = document.createElement('div');
  messageBubble.classList.add('message-bubble');

  // Set innerHTML instead of textContent to render HTML tags
  messageBubble.innerHTML = message;

  console.log(messageBubble);

  chatMessage.appendChild(messageBubble);
  document.getElementById('chat-container').appendChild(chatMessage);

  // Scroll to the bottom of the chat container
  let messages = document.getElementById("chat-container");
  messages.scrollTop = messages.scrollHeight;
}

// logic for adding "pressing enter" functionality to the input field
let input = document.getElementById("message-input");
input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("send-button").click();
  }
});


function handleSendButtonClick() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();


  if (message) {
    createChatBubble(message, true);

    const prompt = "You are chat bot named Eppy answering a question from a patient about a specific question pertaining to their health, answer succinctly and assume the patient is 5 : " + message;
    gemini(prompt).then(data => {
      // Add a line break before each bold section
      const boldedResponse = data.response.replace(/\*\*(.*?)\*\*/g, '<br><strong>$1</strong>');

      const formattedResponse = boldedResponse.replace(/<\/strong>/g, '</strong><br>');
      createChatBubble(formattedResponse, false);
    });

    // Clear the message input
    messageInput.value = '';
  }
}

// Attach the event listener to the send button
document.addEventListener('DOMContentLoaded', async () => {
  const sendButton = document.getElementById('send-button');
  sendButton.addEventListener('click', handleSendButtonClick);

  const response = await chrome.runtime.sendMessage({action: "get-history"});
  const history = response.history

  history.forEach(({ role, parts }) => {
    const isUser = role === 'user';
    createChatBubble(parts, isUser);
  });
});

async function gemini(message) {
  const url = 'https://epicare.onrender.com/api'
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        history: "test"
      })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null; // or handle the error appropriately
  }
}
