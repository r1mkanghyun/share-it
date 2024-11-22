import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./PostPage.css";

const PostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      alert("이미 제출 중입니다. 잠시만 기다려주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const postListRef = ref(database, "posts/");
      const newPost = {
        title,
        content,
        userId: currentUser.uid, // 현재 사용자 UID 저장
        timestamp: Date.now(),
      };

      await push(postListRef, newPost);

      alert("게시글이 성공적으로 작성되었습니다!");
      setTitle(""); // 입력 필드 초기화
      setContent("");
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("게시글 저장 중 오류 발생:", error);
      alert("게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChat = (postAuthorId, postAuthorName) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (postAuthorId === currentUser.uid) {
      alert("본인과는 채팅할 수 없습니다.");
      return;
    }

    const chatId = [currentUser.uid, postAuthorId].sort().join("_");
    navigate(`/chat/${chatId}`, {
      state: {
        user1: currentUser.uid,
        user1Name: currentUser.displayName || "사용자",
        user2: postAuthorId,
        user2Name: postAuthorName || "상대방",
      },
    });
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "작성 중..." : "작성하기"}
        </button>
      </form>
    </div>
  );
};

export default PostPage;
