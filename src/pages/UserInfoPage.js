import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { database, auth } from '../firebase'; // db 대신 database로 변경
import './UserInfoPage.css';

const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login'); // 로그인 안 된 상태라면 로그인 페이지로 이동
    } else {
      const userInfoRef = ref(database, `users/${user.uid}`);
      onValue(userInfoRef, (snapshot) => {
        setUserInfo(snapshot.val());
      });
    }
  }, [navigate]);

  return (
    <div className="user-info-container">
      {userInfo ? (
        <>
          <h1>{userInfo.name}</h1>
          <p>이메일: {userInfo.email}</p>
          <p>휴대폰 번호: {userInfo.phoneNumber}</p>
          <p>지역: {userInfo.location}</p>
        </>
      ) : (
        <p>회원 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default UserInfoPage;
