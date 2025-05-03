import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyADDMixYZgLvjSiTzjVxphJmVUc6nEGKWs",
  authDomain: "studygroupauth.firebaseapp.com",
  projectId: "studygroupauth",
  storageBucket: "studygroupauth.firebasestorage.app",
  messagingSenderId: "647956085453",
  appId: "1:647956085453:web:6b4e27d2ba83dffadc4784",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Export Firestore
export const getCurrentUserId = () =>{
  const user = auth.currentUser;
  return user? user.uid :null;
};