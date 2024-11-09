import React, { useState } from 'react';
import { auth, database } from '../firebase'; // Firebase 설정에서 auth와 database 추가
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication의 함수 가져오기
import { ref, set } from 'firebase/database'; // Realtime Database의 ref와 set 함수 추가
import { useNavigate, Link } from 'react-router-dom';
import './GlobalStyles.css'; // Global 스타일 적용
import './RegisterPage.css'; // 페이지 별도 스타일 적용

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Firebase Authentication을 통한 회원가입
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // auth와 함께 사용
      const user = userCredential.user;

      // 회원가입 성공 후 Realtime Database에 사용자 정보 저장
      await set(ref(database, 'users/' + user.uid), {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        location: location, // 선택한 지역 저장
      });

      navigate('/'); // 회원가입 후 메인 페이지로 이동
    } catch (error) {
      console.error("회원가입 에러:", error.message); // 에러 메시지를 콘솔에 출력
      setErrorMessage(`회원가입에 실패했습니다: ${error.message}`); // 에러 메시지를 UI에 표시
    }
  };

  return (
    <div className="register-container">
      <h1>회원가입</h1>
      {errorMessage && <p className="error">{errorMessage}</p>} {/* 에러 메시지 표시 */}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="휴대폰 번호"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="location-select"
        >
          <option value="">선택</option> {/* 기본값으로 '선택' 표시 */}
          <option value="서울">서울</option>
          <option value="인천">인천</option>
          <option value="경기">경기</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
          <option value="광주">광주</option>
          <option value="대전">대전</option>
          <option value="울산">울산</option>
          <option value="세종">세종</option>
          <option value="강원">강원</option>
          <option value="충북">충북</option>
          <option value="충남">충남</option>
          <option value="전북">전북</option>
          <option value="전남">전남</option>
          <option value="경북">경북</option>
          <option value="경남">경남</option>
          <option value="제주">제주</option>
        </select>
        <button type="submit">회원가입</button>
      </form>
      <p>
        이미 계정이 있습니까? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
