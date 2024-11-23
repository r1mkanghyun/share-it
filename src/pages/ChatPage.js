import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const ChatPage = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = collection(db, "chatting", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    const user = auth.currentUser;
    if (!user || !newMessage.trim()) return;

    try {
      const messagesRef = collection(db, "chatting", chatId, "messages");
      await addDoc(messagesRef, {
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  return (
    <div>
      <h1>채팅방</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>
            <strong>{msg.senderId === auth.currentUser.uid ? "나" : "상대방"}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>보내기</button>
    </div>
  );
};

export default ChatPage;
