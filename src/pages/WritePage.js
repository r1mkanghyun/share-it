import React, { useState } from 'react';

function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 Firebase 또는 Realtime Database에 글을 업로드하는 로직을 추가합니다.
    console.log("Title:", title, "Content:", content);
  };

  return (
    <div className="write-page">
      <h1>글쓰기</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}

export default WritePage;
