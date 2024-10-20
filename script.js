const GOOGLE_API_KEY = 'AIzaSyDGeU0PzB42yuYfzPa3AftB6BPokQaVGHc'; // Your API key

document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    // Event listener for sending messages
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('user', message);  // Add user's message to chat
            userInput.value = '';               // Clear input field
            fetchResponse(message);             // Fetch the bot's response
        }
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;  // Scroll chat to the bottom
    }

    async function fetchResponse(message) {
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GOOGLE_API_KEY}`  // Include the API key in the request
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Act as Kiyotaka Ayanokoji from Classroom of the Elite and respond to the following: ${message}`
                        }]
                    }]
                })
            });

            // Check if the response is okay
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            const botResponse = data.candidates[0]?.content?.parts[0]?.text || 'No response from bot.';
            addMessageToChat('bot', botResponse);  // Add bot's response to chat
        } catch (error) {
            console.error('Error:', error);
            addMessageToChat('bot', 'Sorry, I encountered an error while processing your request.');
        }
    }
});
