import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, deleteDoc, collection, query, where, addDoc, getDocs } from 'firebase/firestore';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = docSnap.data();
        setPost(postData);

        const currentUser = auth.currentUser;
        setIsAuthor(currentUser && currentUser.uid === postData.userId);
      } else {
        console.log("No such document!");
      }
    };

    fetchPost();
  }, [id]);

  const handleChat = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !post) return;

    const userId = post.userId;
    const participants = [currentUser.uid, userId].sort();

    // 기존 채팅 방이 있는지 확인
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', '==', participants)
    );

    const querySnapshot = await getDocs(q);
    let chatId;

    if (querySnapshot.empty) {
      // 기존 채팅 방이 없으면 새로 생성
      const newChatRef = await addDoc(chatsRef, {
        participants,
        createdAt: new Date(),
      });
      chatId = newChatRef.id;
    } else {
      // 기존 채팅 방이 있으면 해당 채팅 방 ID 사용
      chatId = querySnapshot.docs[0].id;
    }

    navigate(`/chat/${chatId}`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말 이 게시물을 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, 'posts', id));
      navigate('/');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  if (!post) {
    return <p>게시글을 불러오는 중입니다...</p>;
  }

  return (
    <div className="post-detail-container">
      <h1 className="post-title">{post.title}</h1>
      {post.imageBase64 && <img src={post.imageBase64} alt="게시물 이미지" className="post-image" />}
      <div className="post-content">
        <p>{post.content}</p>
        <p><strong>제시금액:</strong> {post.suggestedPrice} 원</p>
        <p><strong>보증금액:</strong> {post.depositAmount} 원</p>
      </div>

      <div className="post-actions">
        {isAuthor ? (
          <>
            <button onClick={handleEdit} className="edit-button">수정</button>
            <button onClick={handleDelete} className="delete-button">삭제</button>
          </>
        ) : (
          <button onClick={handleChat} className="chat-button">채팅하기</button>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
