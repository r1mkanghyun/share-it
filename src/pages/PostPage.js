import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const postRef = collection(db, "posts");
      await addDoc(postRef, {
        title,
        content,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });

      setTitle("");
      setContent("");
      alert("게시글이 작성되었습니다!");
    } catch (error) {
      console.error("게시글 작성 실패:", error);
    }
  };

  const startChat = async (postAuthorId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const chatRef = collection(db, "chatting");
      const chatRoom = await addDoc(chatRef, {
        participants: [user.uid, postAuthorId],
        timestamp: serverTimestamp(),
      });

      navigate(`/chat/${chatRoom.id}`);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
    }
  };

  return (
    <div>
      <h1>글 작성</h1>
      <form onSubmit={handlePostSubmit}>
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

      {/* 샘플 버튼: 글 작성자와 채팅 */}
      <button onClick={() => startChat("postAuthorId")}>채팅하기</button>
    </div>
  );
};

export default PostPage;
