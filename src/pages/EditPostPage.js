import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './EditPostPage.css';

const EditPostPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();

        // 작성자가 아니면 접근을 막음
        if (postData.userId !== auth.currentUser?.uid) {
          alert("수정 권한이 없습니다.");
          navigate(`/posts/${id}`);
          return;
        }

        setTitle(postData.title);
        setContent(postData.content);
      } else {
        console.log("No such document!");
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleUpdate = async () => {
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, {
      title,
      content,
    });
    navigate(`/posts/${id}`); // 수정 후 상세 페이지로 이동
  };

  return (
    <div className="edit-post-container">
      <h1>게시물 수정</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
      ></textarea>
      <button onClick={handleUpdate} className="update-button">수정 완료</button>
    </div>
  );
};

export default EditPostPage;
