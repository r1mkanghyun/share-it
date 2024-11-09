import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postData);
    });

    return () => unsubscribe();
  }, []);

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
                {post.imageBase64 && (
                  <img src={post.imageBase64} alt="물품 이미지" className="post-image" />
                )}
                <div className="post-details">
                  <h3>{post.title}</h3>
                  <p>{post.content.slice(0, 50)}...</p>
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