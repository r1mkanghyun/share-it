import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FaUserCircle, FaEdit, FaSignOutAlt, FaComments } from 'react-icons/fa'; // 채팅 아이콘 추가
import './Header.css';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
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
        {user ? (
          <>
            <FaEdit size={24} className="icon write-icon" onClick={() => navigate('/write')} />
            <FaComments size={24} className="icon chat-icon" onClick={() => navigate('/chatlist')} /> {/* 채팅 아이콘 */}
            <FaUserCircle size={24} className="icon user-icon" onClick={() => navigate('/user-info')} />
            <FaSignOutAlt size={24} className="icon logout-icon" onClick={handleLogout} />
          </>
        ) : (
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
