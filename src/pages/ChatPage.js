import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Firebase 인증 가져오기
import { useNavigate } from 'react-router-dom';
import './ChatPage.css'; // 페이지 별도 스타일 적용

function ChatPage() {
  const [user, setUser] = useState(null); // 사용자 상태 저장
  const navigate = useNavigate();

  // 사용자가 로그인되었는지 확인
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // 로그인된 사용자 정보를 상태로 설정
      } else {
        navigate('/login'); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      }
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 이벤트 리스너 해제
  }, [navigate]);

  if (!user) {
    return <p>로딩 중...</p>; // 인증 확인 중일 때 로딩 메시지
  }

  return (
    <div className="chat-container">
      <h1>채팅</h1>
      <p>채팅 기능은 로그인한 사용자만 접근할 수 있습니다.</p>
      {/* 채팅 내용 추가 */}
    </div>
  );
}

export default ChatPage;
