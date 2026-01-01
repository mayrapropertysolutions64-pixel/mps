import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your fixed configuration from the screenshot
const firebaseConfig = {
  apiKey: "AIzaSyDQ9Z6N5wyWXY7opNgV53RfxVbeuYAgd84",
  authDomain: "mayra-7cf38.firebaseapp.com",
  projectId: "mayra-7cf38",
  storageBucket: "mayra-7cf38.firebasestorage.app",
  messagingSenderId: "975346995444",
  appId: "1:975346995444:web:7b06287a230e63ba164ea1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy };