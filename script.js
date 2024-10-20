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
        messageElement.classList.add('message', sender === 'You' ? 'user-message' : 'bot-message');

        // Create an image element for the profile picture
        const img = document.createElement('img');
        img.src = sender === 'user' ? 'images/user-profile.png' : 'profile.jpg'; // Add your image paths
        img.alt = sender === 'user' ? 'You' : 'Bot';

        // Append the image and message text
        messageElement.appendChild(img);
        messageElement.appendChild(document.createTextNode(message));
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function fetchResponse(message) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDGeU0PzB42yuYfzPa3AftB6BPokQaVGHc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            const botMessage = data.candidates[0].content.parts[0].text; // Adjust based on actual response structure
            addMessageToChat('bot', botMessage);
        } catch (error) {
            console.error('Error:', error);
            addMessageToChat('bot', 'Sorry, I encountered an error while processing your request.');
        }
    }
});
