const url = 'https://epicare.onrender.com/api';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // Check if the message is intended for this script
  if (message.target === 'popup') {
    // Handle the received data
    console.log(message.data)
    gemini(message.data, 'summary').then(data => {
      // This line creates the bolded font, increase font size, underlines and adds new lines after bullet points within the chat bubble
      // Create chat bubble with the modified (bolded) response
      createChatBubble(data.response, false);
    });    

    document.getElementById('summary-button').addEventListener('click', function () {
      console.log(message.data); //similar to when popup is recognized as message (same functionality)
      gemini("From these after visit notes, what should I know about my health? " + message.data, 'summary').then(data => {
          createChatBubble(data.response, false);
      });
    });
  }

  if (message.target === 'userHighlighted') {
    // Set the highlighted text in the textarea
    document.getElementById('message-input').value = message.text;
  }

  if (message.target === 'userStoppedHighlighting') {
    // Set the highlighted text in the textarea
    document.getElementById('message-input').value = '';
  }
});

document.getElementById('medical-advice-button').addEventListener('click', function () {
  console.log("Medical Advice button clicked"); 
  gemini("Can you explain what this means in a medical setting: " + document.getElementById('message-input').value.trim(), 'chat').then(data => {
      createChatBubble(data.response, false);
  });
});

function createChatBubble(message, isUserMessage, isLoading = false) {
  const chatMessage = document.createElement('div');
  chatMessage.classList.add('chat-message');

  const botProfileImg = document.createElement('img');
  // Adjusted condition to add profile image for bot messages and loading messages
  if (!isUserMessage || isLoading) {
    botProfileImg.src = "../images/botProfile.png"; // Make sure the path is correct
    botProfileImg.alt = "Profile Picture of Eppy the Chatbot";
    botProfileImg.classList.add('chat-profile');
    chatMessage.appendChild(botProfileImg); // Append the profile image to the chatMessage
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
    const boldedResponse = message.replace(/\*\*(.*?)\*\*/g, '<br><strong style="font-size: 20px;"><u>$1</u></strong>').replace(/- /g, '<br>- ');; 
    messageBubble.innerHTML = boldedResponse;
  }

  chatMessage.appendChild(messageBubble); // Append the message bubble to the chatMessage
  document.getElementById('chat-container').appendChild(chatMessage);
  
  // Scroll to the bottom of the chat container
  document.getElementById("chat-container").scrollTop = document.getElementById("chat-container").scrollHeight;
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

// increasing the input box height
input.addEventListener("keyup", function (event) {
  let style = window.getComputedStyle(input), 
    height = style.getPropertyValue('height'),
    width = style.getPropertyValue('width');
  
  let dHeight = ((input.value.length / (parseFloat(width) * 0.11))); // get number of lines
  
  console.log("height change test", input.value.length, width, height, dHeight);
  
  input.style.height = ((dHeight >= 1) ? (20 * dHeight.toFixed(0)) : (20 * dHeight.toFixed(2))) + "px";   
  

    // set minimum height to be 20 and max to be 80
  console.log("height changed --> ", style.getPropertyValue('height'));
});


function handleSendButtonClick() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();


  if (message) {
    createChatBubble(message, true);

    gemini(message, 'chat').then(data => {
      // Add a line break before each bold section
      chrome.runtime.sendMessage({action: "set-history", user: false, parts: data.response});
      createChatBubble(data.response, false);
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
  const history = response.history;

  // Initial welcome message
  createChatBubble("Hi there! I'm Eppy, and I'm here to answer any questions you may have about your health. Let's chat!", false);

  history.forEach(({ role, parts, visible }) => {
    const isUser = role === 'user';
    if (visible) {
      createChatBubble(parts, isUser);
    }
  });
});

async function gemini(message, operation) {
  const endpoint = url
  
  // Get current history
  const response = await chrome.runtime.sendMessage({action: "get-history"});
  const history = response.history

  // Show the loading message as a chat bubble
  toggleLoadingMessage(true);
  // Set to history user message if it's a chat
  if (operation === "chat") {
    chrome.runtime.sendMessage({action: "set-history", user: true, parts: message});
  } else {
    chrome.runtime.sendMessage({action: "set-history", user: true, parts: "ignore"});
  }
  
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
    chrome.runtime.sendMessage({action: "set-history", user: false, parts: data.response});
    return data;
    
  } catch (error) {
    console.error('Error:', error);
    return null;
    
  } finally {
    // Hide the loading message
    toggleLoadingMessage(false);
  }
}