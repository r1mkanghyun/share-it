import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';
import PostsListPage from './pages/PostsListPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';
import ChatPage from './pages/ChatPage';
import ChatListPage from './pages/ChatListPage';
import UserInfoPage from './pages/UserInfoPage';
import WritePage from './pages/WritePage';
import Header from './components/Header';

function App() {
  const [posts, setPosts] = useState([]);

  // 게시글 가져오기
  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async (postData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("로그인이 필요합니다.");
        return;
      }
      await addDoc(collection(db, 'posts'), {
        ...postData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("게시물 추가 오류:", error);
    }
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage posts={posts} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/posts" element={<PostsListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/edit-post/:id" element={<EditPostPage />} />
        <Route path="/chatlist" element={<ChatListPage />} /> {/* 채팅방 목록 */}
        <Route path="/chat/:chatId" element={<ChatPage />} /> {/* 채팅방 */}
        <Route path="/user-info" element={<UserInfoPage posts={posts} />} />
        <Route path="/write" element={<WritePage onPostSubmit={handlePostSubmit} />} />
      </Routes>
    </Router>
  );
}

export default App;
