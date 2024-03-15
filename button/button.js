// chatbot.js

// Function to open the chatbot
function openChatbot() {
  document.getElementById('chatbotContainer').style.display = 'block';
}

// Function to close the chatbot
function closeChatbot() {
  document.getElementById('chatbotContainer').style.display = 'none';
}

// Add event listener to the chatbot button
document.getElementById('chatbotButton').addEventListener('click', openChatbot);

// Add event listener to the close button
document.getElementById('closeChatbotButton').addEventListener('click', closeChatbot);
