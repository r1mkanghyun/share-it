<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, push } from "firebase/database";
import { database, auth } from "../firebase"; // Firebase Realtime Database 사용
import "./WritePage.css";
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './WritePage.css';
>>>>>>> parent of a802370 (241122-1)

function WritePage({ onPostSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [image, setImage] = useState(null);
<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지
=======
>>>>>>> parent of a802370 (241122-1)
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("로그인이 필요합니다.");
        navigate('/login');
        return;
      }

      console.log("사용자 인증 확인 완료:", user.uid);

      let imageBase64 = '';
      if (image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          imageBase64 = reader.result; // Base64 문자열이 저장됨
          console.log("Base64 이미지 준비 완료");

          const postData = {
            title,
            content,
            suggestedPrice,
            depositAmount,
            imageBase64, // Base64 인코딩 이미지 문자열
            userId: user.uid,
            createdAt: serverTimestamp(),
          };

          // Firestore에 데이터 저장
          await addDoc(collection(db, 'posts'), postData);
          console.log("게시물 Firestore에 저장 완료");
          navigate('/');
        };

        // 이미지 파일을 Base64로 변환
        reader.readAsDataURL(image);
      } else {
        // 이미지 없이 게시물 저장
        const postData = {
          title,
          content,
          suggestedPrice,
          depositAmount,
          imageBase64, // 빈 문자열 저장
          userId: user.uid,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'posts'), postData);
        navigate('/');
      }
<<<<<<< HEAD

      const newPost = {
        title,
        content,
        suggestedPrice,
        depositAmount,
        imageBase64,
        userId: user.uid,
        createdAt: Date.now(), // Realtime Database는 UNIX timestamp 사용
      };

      const postRef = ref(database, "posts"); // Firebase Realtime Database 경로 설정
      await push(postRef, newPost); // 데이터 저장
      console.log("게시글 저장 성공:", newPost);

      alert("게시물이 성공적으로 작성되었습니다!");
      navigate("/"); // 메인 페이지로 이동
=======
>>>>>>> parent of a802370 (241122-1)
    } catch (error) {
      console.error("게시물 저장 오류:", error);
      alert("게시물 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="write-page-container">
      <h1>글쓰기</h1>
      <form onSubmit={handleSubmit} className="write-form">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="제시금액"
          value={suggestedPrice}
          onChange={(e) => setSuggestedPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="보증금액"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="image-upload"
        />
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}

export default WritePage;
