// Add this at the top of your script.js file
const GOOGLE_API_KEY = AIzaSyDGeU0PzB42yuYfzPa3AftB6BPokQaVGHc;

async function fetchResponse(message) {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GOOGLE_API_KEY}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Act as Kiyotaka Ayanokoji from Classroom of the Elite and respond to the following: ${message}`
                    }]
                }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error while processing your request.';
    }
}
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
            fetchResponse(message);
        }
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function fetchResponse(message) {
        // In a real implementation, you would send the message to your server
        // and get a response from the Gemini API. For this static example,
        // we'll simulate a response.
        const response = await simulateResponse(message);
        addMessageToChat('bot', response);
    }

    async function simulateResponse(message) {
        // This is a placeholder. In a real implementation, this would be
        // replaced with a call to your server, which would then use the Gemini API.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        return `This is a simulated response to: "${message}". In a real implementation, this would be Ayanokoji's response from the Gemini API.`;
    }
});