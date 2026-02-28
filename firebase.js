// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);