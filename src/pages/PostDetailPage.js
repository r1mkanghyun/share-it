import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase'; 
import './PostDetailPage.css'; // 추가된 CSS 파일

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const postRef = ref(database, `posts/${postId}`);
    onValue(postRef, (snapshot) => {
      setPost(snapshot.val());
    });
  }, [postId]);

  return (
    <div className="post-detail-container">
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </>
      ) : (
        <p>게시글을 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default PostDetailPage;
