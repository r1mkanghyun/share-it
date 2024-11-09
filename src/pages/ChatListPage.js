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

  return (
    <div>
      <h1>채팅 목록</h1>
      <ul>
        {chatList.map((chat) => (
          <li key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)}>
            {chat.chatPartner}와의 채팅
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatListPage;
