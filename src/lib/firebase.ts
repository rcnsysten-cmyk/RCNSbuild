// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ6BK4G0cfsvNnxwtVcZqWWvmpY5H-4CU",
  authDomain: "mubuilds-68fe9.firebaseapp.com",
  projectId: "mubuilds-68fe9",
  storageBucket: "mubuilds-68fe9.firebasestorage.app",
  messagingSenderId: "33834178115",
  appId: "1:33834178115:web:e17f1a5baf60345270e6f6",
  measurementId: "G-345R2SKGFX"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
