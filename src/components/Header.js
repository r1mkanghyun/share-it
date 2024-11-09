import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FaUserCircle, FaEdit, FaSignOutAlt } from 'react-icons/fa'; // 사용자, 글쓰기, 로그아웃 아이콘 추가
import './Header.css'; // 스타일 적용

function Header() {
  const [user, setUser] = useState(null); // 로그인된 사용자 상태 관리
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 사용자가 로그인되어 있으면 상태에 저장
    });

    return () => {
      unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">
          물품 대여 서비스
        </Link>
      </div>

      <div className="header-right">
        {user ? ( // 사용자가 로그인된 경우
          <>
            <FaEdit size={24} className="icon write-icon" onClick={() => navigate('/write')} /> {/* 글쓰기 아이콘 */}
            <FaUserCircle size={24} className="icon user-icon" onClick={() => navigate('/userinfo')} /> {/* 사용자 아이콘 */}
            <FaSignOutAlt size={24} className="icon logout-icon" onClick={handleLogout} /> {/* 로그아웃 아이콘 */}
          </>
        ) : ( // 사용자가 로그인되지 않은 경우
          <>
            <Link to="/login" className="header-item">
              로그인
            </Link>
            <Link to="/register" className="header-item">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
