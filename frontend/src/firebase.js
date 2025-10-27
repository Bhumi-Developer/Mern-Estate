// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-9672c.firebaseapp.com",
  projectId: "mernestate-9672c",
  storageBucket: "mernestate-9672c.firebasestorage.app",
  messagingSenderId: "766400125049",
  appId: "1:766400125049:web:ac513023dc0cfe92881ca8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);