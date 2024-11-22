import React, { useState } from 'react';
import { ref, push } from 'firebase/database';
import { database } from '../firebase'; // db 대신 database로 변경
import './PostPage.css';


const PostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const postListRef = ref(database, 'posts/');
    push(postListRef, {
      title: title,
      content: content,
      timestamp: Date.now(),
    });
    setTitle('');
    setContent('');
  };

  return (
    <div className="post-container">
      <h1>글 작성</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          required
        />
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
};

export default PostPage;
