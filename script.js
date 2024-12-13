// scripts.js

import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

const apiKey = 'AIzaSyBZ9QKpBu02GN_n-rhE81oJ4f2w5p5vM1o';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

// Function to get random text from Gemini API
function getRandomText() {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: 'Generate random text for typing practice.'
                        }
                    ]
                }
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const randomText = data.candidates[0].content.parts[0].text;
            displayText(randomText);
        } else {
            console.error('Error fetching text');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to display the fetched random text
function displayText(text) {
    const textContainer = document.getElementById('words');
    textContainer.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        textContainer.appendChild(span);
    });
}

// Function to handle typing input
function handleTyping(event) {
    const input = event.target.value;
    const spans = document.querySelectorAll('#words span');

    spans.forEach((span, index) => {
        if (input[index] == null) {
            span.classList.remove('correct', 'error');
        } else if (input[index] === span.textContent) {
            span.classList.add('correct');
            span.classList.remove('error');
        } else {
            span.classList.add('error');
            span.classList.remove('correct');
        }
    });
}

document.getElementById('wordsInput').addEventListener('input', handleTyping);

// Function to handle user sign up
document.getElementById('signupButton').add