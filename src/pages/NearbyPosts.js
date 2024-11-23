import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 거리 (km)
};

const fetchNearbyPosts = async (latitude, longitude, radius) => {
  try {
    const postsRef = ref(database, "posts");
    const snapshot = await get(postsRef);

    if (snapshot.exists()) {
      const posts = [];
      snapshot.forEach((child) => {
        const post = child.val();
        const distance = calculateDistance(
          latitude,
          longitude,
          post.latitude,
          post.longitude
        );

        if (distance <= radius) {
          posts.push({ id: child.key, ...post, distance });
        }
      });

      return posts; // 반경 내 물품 데이터 반환
    } else {
      console.log("게시물이 없습니다.");
      return [];
    }
  } catch (error) {
    console.error("데이터 가져오기 오류:", error);
    return [];
  }
};

const NearbyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [radius, setRadius] = useState(5); // 기본 반경 5km
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const nearbyPosts = await fetchNearbyPosts(latitude, longitude, radius);
        setPosts(nearbyPosts);
        setLoading(false);
      },
      (error) => {
        console.error("위치 정보 가져오기 실패:", error);
        alert("위치 권한을 확인해주세요.");
        setLoading(false);
      }
    );
  }, [radius]);

  if (loading) {
    return <p>위치 정보를 불러오는 중입니다...</p>;
  }

  return (
    <div>
      <h1>내 주변 물품</h1>
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        placeholder="반경 (km)"
      />
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>거리: {post.distance.toFixed(2)} km</p>
            </div>
          ))
        ) : (
          <p>해당 반경 내에 물품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default NearbyPosts;
