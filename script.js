let chatHistory = []; // Array to store chat history
const API_KEY = 'AIzaSyDGeU0PzB42yuYfzPa3AftB6BPokQaVGHc'; // Your API key

async function fetchResponse(message) {
    // Check for specific messages to provide custom responses
    if (message.toLowerCase() === 'hi') {
        const response = 'Hello! How can I assist you today?';
        chatHistory.push({ role: 'ayanokoji', content: response }); // Add response to chat history
        return response;
    }

    // Add the user's message to the chat history
    chatHistory.push({ role: 'user', content: message });

    const requestPayload = {
        contents: [
            {
                parts: [
                    {
                        text: chatHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Ayanokoji'}: ${msg.content}`).join('\n') +
                        `\nAyanokoji: ` // This is where we prompt Ayanokoji for a response
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        });

        const data = await response.json();
        const ayanokojiReply = data.candidates[0].content.parts[0].text;

        // Add Ayanokoji's reply to the chat history
        chatHistory.push({ role: 'ayanokoji', content: ayanokojiReply });
        return ayanokojiReply;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error while processing your request.';
    }
}

// Event listeners for sending messages
document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            userInput.value = '';
            fetchResponse(message).then(response => {
                addMessageToChat('ayanokoji', response);
            });
        }
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }
});
