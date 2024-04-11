chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Check if the message is intended for this script
  if (message.target === 'popup') {
    // Handle the received data
    console.log(message.data)
    gemini(message.data, 'summary').then(data => {
      // This line creates the bolded font within the chat bubble
      const boldedResponse = data.response.replace(/\*\*(.*?)\*\*/g, '<br><strong style="font-size: 18px;"><u>$1</u></strong>');
      
      // This isn't needed for the new scrollable chatbubbles
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

function createChatBubble(message, isUserMessage, isLoading = false) {
  const chatMessage = document.createElement('div');
  chatMessage.classList.add('chat-message');

  const botProfileImg = document.createElement('img');
  if(!isUserMessage) {
    botProfileImg.src = "../images/botProfile.png";
    botProfileImg.alt = "Profile Picture of Eppy the Chatbot";
    botProfileImg.classList.add('chat-profile');
  }
  
  const messageBubble = document.createElement('div');
  messageBubble.classList.add('message-bubble');

  if (isLoading) {
    chatMessage.classList.add('loading-message');
    messageBubble.innerHTML = `
      <div class="typing-animation">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </div>`; // For animation, include three span elements
  } else {
    chatMessage.classList.add(isUserMessage ? 'user-message' : 'eppy-message');
    messageBubble.innerHTML = message;
  }

  
  if(!isUserMessage && !isLoading){
    document.getElementById('chat-container').appendChild(botProfileImg);
  }
  chatMessage.appendChild(messageBubble);
  document.getElementById('chat-container').appendChild(chatMessage);
  
  // Scroll to the bottom of the chat container
  document.getElementById("chat-container").scrollTop = chatMessage.offsetTop;
}




function toggleLoadingMessage(show) {
  const loadingBubbleExists = document.querySelector('.loading-message');
  if (show && !loadingBubbleExists) {
    createChatBubble('', false, true); // Pass true to indicate it's a loading message
  } else if (!show && loadingBubbleExists) {
    loadingBubbleExists.remove(); // Remove the loading message when not needed
  }
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

    gemini(message, 'chat').then(data => {
      // Add a line break before each bold section
      const boldedResponse = data.response.replace(/\*\*(.*?)\*\*/g, '<br><strong>$1</strong>');
      const formattedResponse = boldedResponse.replace(/<\/strong>/g, '</strong><br>');
      chrome.runtime.sendMessage({action: "set-history", user: false, parts: formattedResponse});
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

  // Initial welcome message
  createChatBubble("Hi there! I'm Eppy, and I'm here to answer any questions you may have about your health. Let's chat!", false);

  history.forEach(({ role, parts }) => {
    const isUser = role === 'user';
    createChatBubble(parts, isUser);
  });
});

async function gemini(message, operation) {
  const url = 'https://epicare.onrender.com/api';
  const endpoint = url
  
  // Get current history
  const response = await chrome.runtime.sendMessage({action: "get-history"});
  const history = response.history

  // Show the loading message as a chat bubble
  toggleLoadingMessage(true);
  // Set to history user message
  chrome.runtime.sendMessage({action: "set-history", user: true, parts: message});
  
  console.log("sending history: " + JSON.stringify(history))
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message, history: history, operation: operation })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error:', error);
    return null;
    
  } finally {
    // Hide the loading message
    toggleLoadingMessage(false);
  }
}
