import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';

const ChatListPage = () => {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChatList(chats);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>채팅 목록</h1>
      <ul>
        {chatList.map((chat) => (
          <li
            key={chat.id}
            onClick={() =>
              navigate(`/chat/${chat.id}`, {
                state: { chatId: chat.id, otherUserId: chat.user2, otherUserName: chat.user2Name },
              })
            }
          >
            {chat.user2Name}와의 채팅
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatListPage;
