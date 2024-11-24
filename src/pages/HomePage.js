import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage({ posts }) {
  const [searchQuery, setSearchQuery] = useState('');

  // 검색어 필터링
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
          filteredPosts.map((post) => (
            <div key={post.id} className="post-item">
              <Link to={`/posts/${post.id}`} className="post-link">
                <div className="post-details">
                  <h3>{post.title}</h3>
                  <p>{post.content.slice(0, 30)}...</p>
                </div>
              </Link>
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
