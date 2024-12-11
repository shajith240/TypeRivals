import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// Sign Up
document.getElementById('signupButton').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Signed Up Successfully!', userCredential.user);
            alert('Signed Up Successfully!');
            document.getElementById('logoutButton').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error Signing Up:', error);
            alert('Error Signing Up: ' + error.message);
        });
});

// Sign In
document.getElementById('loginButton').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Logged In Successfully!', userCredential.user);
            alert('Logged In Successfully!');
            document.getElementById('logoutButton').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error Logging In:', error);
            alert('Error Logging In: ' + error.message);
        });
});

// Sign Out
document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('Signed Out Successfully!');
            alert('Signed Out Successfully!');
            document.getElementById('logoutButton').style.display = 'none';
        })
        .catch((error) => {
            console.error('Error Signing Out:', error);
            alert('Error Signing Out: ' + error.message);
        });
});
