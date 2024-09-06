// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvhEhghkjE63cZYTyP7jmVBGrrD4LGYvo",
  authDomain: "redvita-aacc5.firebaseapp.com",
  projectId: "redvita-aacc5",
  storageBucket: "redvita-aacc5.appspot.com",
  messagingSenderId: "1043375956627",
  appId: "1:1043375956627:web:6a0d0d148174d8c0f56366",
  measurementId: "G-PLBGX0VTX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);