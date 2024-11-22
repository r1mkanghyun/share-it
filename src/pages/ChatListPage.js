import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

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
      const q = query(chatsRef, where('participants', 'array-contains', user.uid));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chats = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const otherUserId = data.participants.find((uid) => uid !== user.uid);
            
            // 상대방의 이름 가져오기
            const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
            const otherUserName = otherUserDoc.exists() ? otherUserDoc.data().name : '알 수 없음';

            return { id: doc.id, chatPartner: otherUserName };
          })
        );
        setChatList(chats);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div>
      <h1>채팅 목록</h1>
      <ul>
        {chatList.length > 0 ? (
          chatList.map((chat) => (
            <li key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)}>
              {chat.chatPartner}와의 채팅
            </li>
          ))
        ) : (
          <p>채팅 목록이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default ChatListPage;
