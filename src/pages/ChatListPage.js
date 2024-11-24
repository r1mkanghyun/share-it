import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ref, onValue } from 'firebase/database';
import { auth, db, database } from "../firebase";
import { useNavigate } from "react-router-dom";

const ChatListPage = () => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatsRef = collection(db, "chats");
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
          <ChatRoom key={room.id} room={room} />
        ))}
      </ul>
    </div>
  );
};

export default ChatListPage;

function ChatRoom({ room }) {
  const navigate = useNavigate();

  const [participant, setParticipant] = useState(null);

  useEffect(() => {
    if (!room) return;

    const user = auth.currentUser;
    if (!user) return;

    const otherParticipant = room.participants.find((uid) => uid !== user.uid);
    if (!otherParticipant) return;

    const userRef = ref(database, `users/${otherParticipant}`);
    const unsubscribeUserInfo = onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          console.log("가져온 사용자 데이터:", snapshot.val());
          setParticipant(snapshot.val());
        } else {
          console.error("사용자 정보를 찾을 수 없습니다.");
          setParticipant(null);
        }
      },
      (error) => {
        console.error("사용자 정보 가져오기 중 오류:", error);
      }
    );
    return () => unsubscribeUserInfo();
  }, [room]);

  return (
    <li>
      <button onClick={() => navigate(`/chat/${room.id}`)}>채팅방 {participant?.name}</button>
    </li>
  )
}