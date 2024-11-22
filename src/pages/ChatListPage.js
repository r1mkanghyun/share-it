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
        {chatRooms.map((room, idx) => (
          <li key={idx} style={{ margin: "10px 0" }}>
            <Link to={`/chat/${room}`} style={{ textDecoration: "none", color: "#007bff" }}>
              {room}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatListPage;
