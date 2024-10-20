let chatHistory = []; // Array to store chat history
const API_KEY = 'AIzaSyDGeU0PzB42yuYfzPa3AftB6BPokQaVGHc'; // Your API key

async function fetchResponse(message) {
    // Add the user's message to the chat history
    chatHistory.push({ role: 'user', content: message });

    // Base prompt for Ayanokoji's character
    const basePrompt = 
        `Act as Ayanokoji Kiyotaka from Classroom of the Elite. You are intelligent, strategic, and observant, often staying in the background while quietly analyzing situations and people. Respond to questions with calmness and a hint of mystery, showcasing your analytical mindset. When interacting, embody Ayanokoji's demeanor: cool, collected, and occasionally sarcastic, with an emphasis on subtle manipulation and tactical thinking. Provide insights and suggestions that reflect your ability to understand people's motivations and the dynamics of social interactions.\n` +
        `User: ${message}\nAyanokoji: `;

    const requestPayload = {
        contents: [
            {
                parts: [
                    {
                        text: basePrompt // Send the prompt to the API
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
