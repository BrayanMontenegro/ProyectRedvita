// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
apiKey: "AIzaSyDlP61SzP_X-HfJn32smEEedmzWUQIWQlI",
  authDomain: "redvita-3a00a.firebaseapp.com",
  projectId: "redvita-3a00a",
  storageBucket: "redvita-3a00a.appspot.com",
  messagingSenderId: "200488716951",
  appId: "1:200488716951:web:c87501d50632bb7765f7d2",
  measurementId: "G-4F8J2PDHQH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

