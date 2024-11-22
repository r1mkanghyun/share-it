import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

const ChatPage = ({ chatId, otherUserId, otherUserName }) => {
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const chatMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(chatMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      senderId: currentUser.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    const chatRef = doc(db, 'chats', chatId);
    await setDoc(chatRef, {
      participants: [currentUser.uid, otherUserId], // 반드시 participants 추가
      user1: currentUser.uid,
      user1Name: currentUser.displayName,
      user2: otherUserId,
      user2Name: otherUserName,
    }, { merge: true });

    setNewMessage('');
  };

  return (
    <div>
      <h1>Chat with {otherUserName}</h1>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.senderId === currentUser.uid ? 'You' : otherUserName}</strong>: {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
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
};

export default ChatPage;
