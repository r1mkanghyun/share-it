import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';
import PostsListPage from './pages/PostsListPage';
import PostDetailPage from './pages/PostDetailPage';
import ChatPage from './pages/ChatPage';
import UserInfoPage from './pages/UserInfoPage'; // 회원 정보 페이지 추가
import WritePage from './pages/WritePage'; // 글쓰기 페이지 추가
import Header from './components/Header'; // Header 추가

function App() {
  return (
    <Router>
      <Header /> {/* 모든 페이지 상단에 공통 Header 추가 */}
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/posts" element={<PostsListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/user-info" element={<UserInfoPage />} /> {/* 회원 정보 페이지 라우팅 추가 */}
        <Route path="/write" element={<WritePage />} /> {/* 글쓰기 페이지 라우팅 추가 */}
      </Routes>
    </Router>
  );
}

export default App;
