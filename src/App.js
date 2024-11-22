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
        <Route path="/chatlist" element={<ChatListPage />} />
        <Route path="/chat/:chatId" element={<ChatRoom />} />
        <Route path="/user-info" element={<UserInfoPage />} />
        <Route path="/write" element={<WritePage onPostSubmit={handlePostSubmit} />} />
      </Routes>
    </Router>
  );
}

// 1:1 채팅방 컴포넌트
const ChatRoom = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem(chatId)) || [] // 채팅방 ID 기반 메시지 로드
  );

  // 메시지 전송
  const sendMessage = () => {
    if (message.trim()) {
      const newMessages = [...messages, { text: message, timestamp: new Date().toISOString() }];
      setMessages(newMessages);
      localStorage.setItem(chatId, JSON.stringify(newMessages)); // 채팅방 데이터 저장
      setMessage('');
    }
  };

  // 컴포넌트 마운트 시 메시지 로드
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem(chatId));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, [chatId]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Chat Room: {chatId}</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} style={{ margin: '10px 0' }}>
              <strong>{new Date(msg.timestamp).toLocaleTimeString()}:</strong> {msg.text}
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
