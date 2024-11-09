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
  };

  return (
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
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button type="submit">보내기</button>
      </form>
    </div>
  );
}

export default ChatPage;
