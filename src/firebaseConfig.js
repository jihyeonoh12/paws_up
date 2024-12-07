import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut  } from "firebase/auth";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCQav5LFpwMS9kmwrK2-oPeAuSSPxg255A",
    authDomain: "paws-up-a1046.firebaseapp.com",
    projectId: "paws-up-a1046",
    storageBucket: "paws-up-a1046.firebasestorage.app",
    messagingSenderId: "588782635620",
    appId: "1:588782635620:web:548723a67d6e8cb935ad71",
    measurementId: "G-HVR2K6QW9N"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);    

export { db, auth, onAuthStateChanged, signOut  };
