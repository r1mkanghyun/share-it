import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './WritePage.css';

function WritePage({ onPostSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [image, setImage] = useState(null);
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

      let imageBase64 = '';
      if (image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          imageBase64 = reader.result;

          const postData = {
            title,
            content,
            suggestedPrice,
            depositAmount,
            imageBase64,
            userId: user.uid,
            createdAt: serverTimestamp(),
          };

          await addDoc(collection(db, 'posts'), postData);
          navigate('/');
        };

        reader.readAsDataURL(image);
      } else {
        const postData = {
          title,
          content,
          suggestedPrice,
          depositAmount,
          imageBase64,
          userId: user.uid,
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'posts'), postData);
        navigate('/');
      }
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
