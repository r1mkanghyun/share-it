import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { FaUserCircle } from "react-icons/fa";
import "./UserInfoPage.css";

const UserInfoPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.log("로그인되지 않은 사용자입니다.");
        return;
      }

      // 사용자 정보 가져오기
      const userRef = ref(database, `users/${user.uid}`);
      try {
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          console.log("사용자 정보:", userSnapshot.val());
          setUserInfo(userSnapshot.val());
        } else {
          console.error("사용자 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 중 오류:", error);
      }

      // 게시글 가져오기
      const postsRef = query(ref(database, "posts"), orderByChild("userId"));
      try {
        const postsSnapshot = await get(postsRef);
        if (postsSnapshot.exists()) {
          const postsData = [];
          postsSnapshot.forEach((childSnapshot) => {
            const post = childSnapshot.val();
            console.log("데이터 확인:", post); // 게시글 데이터 디버깅
            if (post.userId === user.uid) {
              postsData.push({ id: childSnapshot.key, ...post });
            }
          });
          setUserPosts(postsData);
        } else {
          console.log("게시글이 없습니다.");
        }
      } catch (error) {
        console.error("게시글 가져오기 중 오류:", error);
      } finally {
        setLoading(false);
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
        <p>회원 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default UserInfoPage;
