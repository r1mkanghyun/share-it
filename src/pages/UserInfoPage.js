import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { ref, onValue, off } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // 사용자 아이콘 추가
import './UserInfoPage.css';

const UserInfoPage = ({ posts }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userPosts = posts.filter((post) => post.userId === auth.currentUser.uid);

  useEffect(() => {
    const fetchUserData = () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("로그인되지 않은 사용자입니다.");
        navigate('/login');
        return;
      }

      console.log("현재 로그인된 사용자 UID:", user.uid);

      // 사용자 정보 가져오기
      const userRef = ref(database, `users/${user.uid}`);
      const unsubscribeUserInfo = onValue(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            console.log("가져온 사용자 데이터:", snapshot.val());
            setUserInfo(snapshot.val());
          } else {
            console.error("사용자 정보를 찾을 수 없습니다.");
            setUserInfo(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("사용자 정보 가져오기 중 오류:", error);
        }
      );

      // 컴포넌트 언마운트 시 이벤트 리스너 해제
      return () => {
        off(userRef, 'value', unsubscribeUserInfo);
      };
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <p>회원 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="user-info-container">
      {userInfo ? (
        <>
          <div className="user-card">
            <div className="user-profile">
              <FaUserCircle size={80} className="user-avatar-icon" /> {/* 프로필 아이콘으로 대체 */}
              <h1>{userInfo.name || "이름 없음"}</h1>
              <p>이메일: {userInfo.email || "이메일 없음"}</p>
              <p>휴대폰 번호: {userInfo.phoneNumber || "전화번호 없음"}</p>
              <p>지역: {userInfo.location || "지역 정보 없음"}</p>
            </div>
          </div>

          <div className="user-posts">
            <h2>내가 작성한 글</h2>
            <div className="user-posts-list">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div key={post.id} className="user-post-item">
                    <h3>{post.title}</h3>
                    {post.imageBase64 && (
                      <img src={post.imageBase64} alt="물품 이미지" className="user-post-image" />
                    )}
                    <p>{post.content.slice(0, 100)}...</p>
                  </div>
                ))
              ) : (
                <p>작성된 글이 없습니다.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>회원 정보가 없습니다. Realtime Database에 사용자 정보를 추가해주세요.</p>
      )}
    </div>
  );
};

export default UserInfoPage;
