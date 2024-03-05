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
      // For now, just put basic shit to emulate a response
      setTimeout(() => {
        // This is where the response from Google Gemini would be handled
        createChatBubble("Eppy's response will go here", false);
      }, 1000);
  
      // Clear the message input
      messageInput.value = '';
    }
  }
  
  // Attach the event listener to the send button
  document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener('click', handleSendButtonClick);
  });
  