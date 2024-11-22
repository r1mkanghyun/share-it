const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let rooms = []; // 채팅방 목록

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // 채팅방 목록 요청 처리
  socket.on("get_rooms", () => {
    socket.emit("chat_rooms", rooms);
  });

  // 채팅방 생성
  socket.on("create_room", (roomName) => {
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
      io.emit("chat_rooms", rooms);
    }
  });

  // 클라이언트가 채팅 메시지를 보낼 때
  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    io.emit("receive_message", data); // 모든 클라이언트에 메시지 전송
  });

  // 클라이언트 연결 종료 처리
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// 서버 실행
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
