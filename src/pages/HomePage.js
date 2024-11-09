import React, { useEffect, useState } from 'react';
import { database } from '../firebase'; // Firebase Realtime Database 가져오기
import { ref, onValue } from 'firebase/database'; // 데이터베이스 관련 함수
import './HomePage.css'; // 메인 페이지 스타일

function HomePage() {
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [posts, setPosts] = useState([]); // 게시물 목록 상태

  // Firebase Realtime Database에서 최신 글 가져오기
  useEffect(() => {
    const postsRef = ref(database, 'posts');
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postsArray = Object.values(data);
        setPosts(postsArray.reverse()); // 최신 글 목록으로 정렬
      }
    });
  }, []);

  // 검색어에 따라 게시물 필터링
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="homepage-container">
      <h2>내 주변 물품 대여 검색</h2>
      <input
        type="text"
        placeholder="물품 검색"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <div className="posts-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div key={index} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </div>
          ))
        ) : (
          <p>게시글 없음</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
