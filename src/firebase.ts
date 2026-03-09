// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7BqPHx9ItFyPcxqTLkTTr_aUDwJqKwoc",
  authDomain: "parking-sense-9a057.firebaseapp.com",
  projectId: "parking-sense-9a057",
  storageBucket: "parking-sense-9a057.firebasestorage.app",
  messagingSenderId: "1087445809124",
  appId: "1:1087445809124:web:13705f2f1c303c52b4f9f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);