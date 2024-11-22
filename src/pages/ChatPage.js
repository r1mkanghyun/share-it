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
  };

  // 컴포넌트 마운트 시 메시지 로드
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem(chatId));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, [chatId]);

  return (
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
};

export default ChatPage;
