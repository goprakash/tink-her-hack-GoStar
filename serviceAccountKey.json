// firebase.js

// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

// Import services you use
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCcT2SlfyhLYn-dumTpEYNIjtoXmjDB_Vo",
  authDomain: "gostar-b8ad9.firebaseapp.com",
  projectId: "gostar-b8ad9",
  storageBucket: "gostar-b8ad9.firebasestorage.app",
  messagingSenderId: "304884683419",
  appId: "1:304884683419:web:72b75569499dca01a56c3e",
  measurementId: "G-JH8NP71ZS6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ EXPORT them so other files can use
export { auth, db };