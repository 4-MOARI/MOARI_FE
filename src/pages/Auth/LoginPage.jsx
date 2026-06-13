import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import './AuthPage.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      setErrorMessage('');

      const res = await login(userId, password);

      localStorage.setItem('accessToken', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));

      navigate('/');
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error?.message || '아이디 혹은 비밀번호가 일치하지 않습니다.'
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card login-card">
        <h1 className="auth-logo">모아리</h1>
        <p className="auth-subtitle">학교 인증 동아리 정보 플랫폼</p>

        <div className="auth-notice">
          <strong>학교 이메일 인증 회원만 이용 가능</strong>
          <span>가입 시 학교 이메일 인증을 완료해주세요.</span>
        </div>

        <div className="auth-form">
          <label>아이디</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="hong_gildong"
          />

          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button
            type="button"
            className="auth-text-button"
            onClick={() => navigate('/find-account')}
          >
            아이디 혹은 비밀번호 찾기
          </button>

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button type="button" className="auth-main-button" onClick={handleLogin}>
            로그인
          </button>

          <p className="auth-bottom-text">
            계정이 없으신가요?{' '}
            <button type="button" onClick={() => navigate('/signup')}>
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}