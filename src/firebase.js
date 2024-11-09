import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCurJbzvLlviNpQkWgbB_EjX38FXxYfyAQ",
  authDomain: "sharing-flatform.firebaseapp.com",
  databaseURL: "https://sharing-flatform-default-rtdb.firebaseio.com", // 올바른 URL 형식으로 수정
  projectId: "sharing-flatform",
  storageBucket: "sharing-flatform.appspot.com",
  messagingSenderId: "356849444218",
  appId: "1:356849444218:web:f7159b03e7c015ac0ea2c3"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 인증 및 데이터베이스 가져오기
export const auth = getAuth(app);
export const database = getDatabase(app);
