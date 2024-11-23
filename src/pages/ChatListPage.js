import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const ChatListPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatsRef = collection(db, "chatting");
    const q = query(chatsRef, where("participants", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rooms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChatRooms(rooms);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>채팅 목록</h1>
      <ul>
        {chatRooms.map((room) => (
          <li key={room.id}>
            <button onClick={() => navigate(`/chat/${room.id}`)}>채팅방 {room.id}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatListPage;
