<<<<<<< HEAD
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ChatListPage = () => {
  const [chatId, setChatId] = useState("");
  const [chatRooms, setChatRooms] = useState(
    JSON.parse(localStorage.getItem("chatRooms")) || [] // 저장된 채팅방 목록
  );

  // 새로운 채팅방 추가
  const createChatRoom = () => {
    if (chatId.trim() && !chatRooms.includes(chatId)) {
      const updatedChatRooms = [...chatRooms, chatId];
      setChatRooms(updatedChatRooms);
      localStorage.setItem("chatRooms", JSON.stringify(updatedChatRooms)); // 채팅방 목록 저장
      setChatId("");
    }
  };
=======
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Firebase 인증과 Firestore DB 가져오기
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function ChatListPage() {
  const [user, setUser] = useState(null);
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  // 사용자가 로그인되었는지 확인
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Firestore에서 사용자가 참여한 채팅 목록 가져오기
  useEffect(() => {
    if (user) {
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('user1', '==', user.uid), where('user2', '==', user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map((doc) => {
          const data = doc.data();
          const chatPartner = data.user1 === user.uid ? data.user2Name : data.user1Name;
          return { id: doc.id, chatPartner };
        });
        setChatList(chats);
      });

      return () => unsubscribe();
    }
  }, [user]);
>>>>>>> parent of a802370 (241122-1)

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Chat Rooms</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="Enter chat room ID"
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "calc(100% - 100px)",
          }}
        />
        <button
          onClick={createChatRoom}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Add
        </button>
      </div>
      <ul>
<<<<<<< HEAD
        {chatRooms.map((room, idx) => (
          <li key={idx} style={{ margin: "10px 0" }}>
            <Link to={`/chat/${room}`} style={{ textDecoration: "none", color: "#007bff" }}>
              {room}
            </Link>
=======
        {chatList.map((chat) => (
          <li key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)}>
            {chat.chatPartner}와의 채팅
>>>>>>> parent of a802370 (241122-1)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatListPage;
