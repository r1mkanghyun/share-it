import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyCurJbzvLlviNpQkWgbB_EjX38FXxYfyAQ",
  authDomain: "sharing-flatform.firebaseapp.com",
  databaseURL: "https://sharing-flatform-default-rtdb.firebaseio.com",
  projectId: "sharing-flatform",
  storageBucket: "sharing-flatform.appspot.com",
  messagingSenderId: "356849444218",
  appId: "1:356849444218:web:f7159b03e7c015ac0ea2c3"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
