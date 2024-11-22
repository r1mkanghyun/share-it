import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, push } from "firebase/database";
import { database, auth } from "../firebase"; // Firebase Realtime Database 사용
import "./WritePage.css";

function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      alert("이미 제출 중입니다. 잠시만 기다려주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const user = auth.currentUser;
      if (!user) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      let imageBase64 = "";
      if (image) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (error) => {
            console.error("이미지 처리 중 오류:", error);
            reject(error);
          };
          reader.readAsDataURL(image);
        });
      }

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
    } catch (error) {
      console.error("게시물 저장 중 오류 발생:", error);
      alert("게시물 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "작성 중..." : "작성하기"}
        </button>
      </form>
    </div>
  );
}

export default WritePage;
