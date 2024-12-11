// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNkhJjMkEgqKNA-tOQIMFcC-RpxSmQ6TA",
    authDomain: "typerivals-8d9ee.firebaseapp.com",
    projectId: "typerivals-8d9ee",
    storageBucket: "typerivals-8d9ee.firebasestorage.app",
    messagingSenderId: "290202233194",
    appId: "1:290202233194:web:6fc81973ed94cde7135d13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
