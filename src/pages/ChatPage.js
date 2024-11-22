<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { chatId } = useParams(); // URL에서 채팅방 ID 가져오기
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem(chatId)) || [] // 채팅방 메시지 로드
  );

  // 메시지 전송
  const sendMessage = () => {
    if (message.trim()) {
      const newMessages = [...messages, { text: message, timestamp: new Date().toISOString() }];
      setMessages(newMessages);
      localStorage.setItem(chatId, JSON.stringify(newMessages)); // 채팅방 메시지 저장
      setMessage("");
    }
=======
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import './ChatPage.css';

function ChatPage() {
  const { chatId } = useParams(); // URL에서 chatId를 가져옴
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // 특정 chatId의 메시지를 가져오기 위한 쿼리 설정
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, where("timestamp", ">=", 0));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(chatMessages);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      senderId: currentUser.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
>>>>>>> parent of a802370 (241122-1)
  };

  // 컴포넌트 마운트 시 메시지 로드
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem(chatId));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, [chatId]);

  return (
<<<<<<< HEAD
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Chat Room: {chatId}</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} style={{ margin: "10px 0" }}>
              <strong>{new Date(msg.timestamp).toLocaleTimeString()}:</strong> {msg.text}
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
=======
    <div className="chat-page-container">
      <h2>채팅</h2>
      <div className="messages-list">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.senderId === currentUser.uid ? 'sent' : 'received'}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
>>>>>>> parent of a802370 (241122-1)
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
