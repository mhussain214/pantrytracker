// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore" 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPh_7wVypSja1WYwldUIKsqKdNvsBq-7E",
  authDomain: "inventory-project-app.firebaseapp.com",
  projectId: "inventory-project-app",
  storageBucket: "inventory-project-app.appspot.com",
  messagingSenderId: "696860790035",
  appId: "1:696860790035:web:2e3191cc7a9b991f055ee6",
  measurementId: "G-5XHP6ES44Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export  {firestore} 

