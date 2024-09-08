// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDlP61SzP_X-HfJn32smEEedmzWUQIWQlI",
  authDomain: "redvita-3a00a.firebaseapp.com",
  projectId: "redvita-3a00a",
  storageBucket: "redvita-3a00a.appspot.com",
  messagingSenderId: "200488716951",
  appId: "1:200488716951:web:c87501d50632bb7765f7d2",
  measurementId: "G-4F8J2PDHQH"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
export const db = getFirestore(app);

// Inicializa Auth con persistencia utilizando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
