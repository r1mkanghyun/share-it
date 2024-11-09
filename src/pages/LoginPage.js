import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; // Link 컴포넌트 추가
import './LoginPage.css'; // 스타일 적용

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setErrorMessage('로그인에 실패했습니다.');
      console.error('로그인 에러:', error);
    }
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">로그인</button>
      </form>

      {/* 계정이 없습니까? 회원가입 링크 추가 */}
      <p className="signup-text">
        계정이 없습니까? <Link to="/register">회원가입</Link>
      </p>
    </div>
  );
}

export default LoginPage;
