// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "netflixgpt-012.firebaseapp.com",
  projectId: "netflixgpt-012",
  storageBucket: "netflixgpt-012.firebasestorage.app",
  messagingSenderId: "396008892928",
  appId: "1:396008892928:web:d9026f459158125db5c6e5",
  measurementId: "G-6EZZN9THC0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

export const auth = getAuth();
