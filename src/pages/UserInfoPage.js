import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { FaUserCircle } from "react-icons/fa"; // 사용자 아이콘
import "./UserInfoPage.css";

const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [userPosts, setUserPosts] = useState([]); // 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser; // 현재 로그인한 사용자
      if (!currentUser) {
        console.error("로그인되지 않은 사용자입니다.");
        return;
      }

      // 사용자 정보 가져오기
      try {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          setUserInfo(userSnapshot.val());
        } else {
          console.error("사용자 정보를 찾을 수 없습니다.");
        }

        // 게시글 가져오기
        const postsRef = query(
          ref(database, "posts"),
          orderByChild("userId"),
          equalTo(currentUser.uid) // 현재 사용자의 UID와 일치하는 게시글만 가져오기
        );

        const postsSnapshot = await get(postsRef);
        if (postsSnapshot.exists()) {
          const posts = [];
          postsSnapshot.forEach((childSnapshot) => {
            posts.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
          setUserPosts(posts);
        } else {
          console.log("작성된 글이 없습니다.");
        }
      } catch (error) {
        console.error("데이터 가져오기 중 오류 발생:", error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>회원 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div className="user-info-container">
      {userInfo ? (
        <>
          <div className="user-card">
            <div className="user-profile">
              <FaUserCircle size={80} className="user-avatar-icon" />
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
