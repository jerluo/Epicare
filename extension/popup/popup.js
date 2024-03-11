chrome.storage.local.set({ history : [] }).then(() => {
  console.log("Set chat history");
});

function createChatBubble(message, isUserMessage) {
  const chatMessage = document.createElement('div');
  chatMessage.classList.add('chat-message');
  chatMessage.classList.add(isUserMessage ? 'user-message' : 'eppy-message');

  const messageBubble = document.createElement('div');
  messageBubble.classList.add('message-bubble');
  messageBubble.textContent = message;
  chatMessage.appendChild(messageBubble);
  document.getElementById('chat-container').appendChild(chatMessage);
}
  

function handleSendButtonClick() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value.trim();

  
  if (message) {
    createChatBubble(message, true);

    // TODO: Gemini API call????
    // For now, just put basic stuff to emulate a response
    gemini(message).then(data =>{
      createChatBubble(data.response, false); 
    });
    

    // Clear the message input
    messageInput.value = '';
  }
}
  
// Attach the event listener to the send button
document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('send-button');
  sendButton.addEventListener('click', handleSendButtonClick);
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
              history: ""
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