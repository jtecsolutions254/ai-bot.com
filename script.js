// Function to show the sign-up form
function showSignup() {
    document.getElementById('signup-container').style.display = 'block';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('forgot-password-container').style.display = 'none';
}

// Function to show the login form
function showLogin() {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('forgot-password-container').style.display = 'none';
}

// Function to show the forgot password form
function showForgotPassword() {
    document.getElementById('signup-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('forgot-password-container').style.display = 'block';
}

// Initialize to show the login form on page load
document.addEventListener('DOMContentLoaded', showLogin);

// Predefined answers and close-ended questions
const predefinedAnswers = {
    "hello": "Hi there! Welcome to the University of Embu. How can I help you today? Can I assist you with something specific?",
    "who are you": "I'm a chatbot designed to assist you. How can I help you today?",
    "what is your name": "I am your helpful assistant bot. Would you like to ask anything else?",
    "good morning": "Good morning! Don't forget to attend your classes. How can I assist you today?",
    "yes": "Great! Go ahead and ask, and I will assist you where I can.",
};

const synonymMap = {
    "hello": ["hi", "hey", "greetings"],
    "how are you": ["how's it going", "how do you do", "how are things"],
    "what is your name": ["who are you", "what are you called", "your name"],
    "bye": ["goodbye", "see you", "farewell"]
};

// Function to send a message
function sendMessage() {
    const input = document.getElementById('chat-input');
    const messageText = input.value.trim().toLowerCase();
    if (messageText === "") return;  // Prevent sending empty messages

    const messagesContainer = document.getElementById('chat-messages');
    
    // Create user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerText = messageText;
    messagesContainer.appendChild(userMessage);
    
    input.value = '';  // Clear input

    // Scroll smoothly to the bottom of the chat
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message typing-indicator';
    typingIndicator.innerText = 'I am thinking...';
    messagesContainer.appendChild(typingIndicator);

    // Simulate bot response after a delay
    setTimeout(() => {
        messagesContainer.removeChild(typingIndicator);

        const botMessageContainer = document.createElement('div');
        botMessageContainer.className = 'message bot-message';

        // Add bot's message
        const botMessageText = document.createElement('div');
        botMessageText.className = 'bot-message-text';
        botMessageText.innerText = generateBotResponse(messageText);
        botMessageContainer.appendChild(botMessageText);

        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerText = 'Copy';
        copyButton.addEventListener('click', () => copyText(botMessageText.innerText, copyButton));
        botMessageContainer.appendChild(copyButton);

        messagesContainer.appendChild(botMessageContainer);

        // Scroll smoothly to the bottom of the chat
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    }, 1000); // 1-second delay for typing simulation
}

// Function to copy bot's response and update the button text
function copyText(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        button.innerText = 'Copied!';
        button.disabled = true;

        setTimeout(() => {
            button.innerText = 'Copy';
            button.disabled = false;
        }, 2000); // Reset after 2 seconds
    });
}

// Function to compare user input with predefined questions
function findBestMatch(input, predefinedQuestions) {
    let bestMatch = null;
    let lowestDistance = Infinity;
    
    predefinedQuestions.forEach(question => {
        const distance = levenshtein(input.toLowerCase(), question.toLowerCase());
        if (distance < lowestDistance) {
            lowestDistance = distance;
            bestMatch = question;
        }
    });

    return lowestDistance <= 3 ? bestMatch : null; // Allow small typos
}

// Function to generate bot response
function generateBotResponse(userMessage) {
    // Check for fuzzy match
    const bestMatch = findBestMatch(userMessage, Object.keys(predefinedAnswers));

    if (bestMatch) {
        return predefinedAnswers[bestMatch];
    }

    // Check if message contains a synonym
    for (const key in synonymMap) {
        for (const synonym of synonymMap[key]) {
            if (userMessage.includes(synonym)) {
                return predefinedAnswers[key];
            }
        }
    }

    // Default response if no match
    return "I'm not sure I understand, but feel free to ask something else related to the University of Embu.";
}

// Levenshtein distance function to allow minor spelling mistakes
function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Event listener for Enter key to send message
document.getElementById('chat-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to handle user sign-up
async function signUp(event) {
    event.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (result.success) {
        alert("Sign-up successful! You can now log in.");
        showLogin(); // Redirect to login form
    } else {
        alert(result.message);
    }
}

// Function to handle user login
async function login(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (result.success) {
        localStorage.setItem('token', result.token); // Store JWT token or session info
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block'; // Display chatbot on successful login
    } else {
        alert(result.message);
    }
}

// Function to handle password reset
async function forgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('forgot-email').value;

    const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Password reset link sent to your email.');
        showLogin(); // Redirect to login after reset
    } else {
        alert(result.message);
    }
}

// Event listeners for sign-up, login, and forgot password forms
document.getElementById('signup-form').addEventListener('submit', signUp);
document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('forgot-password-form').addEventListener('submit', forgotPassword);
