import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  findId,
  sendPasswordCode,
  resetPassword,
} from '../../api/authApi';
import './AuthPage.css';

export default function FindAccountPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState('id');
  const [step, setStep] = useState('input');

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [maskedId, setMaskedId] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFindId = async () => {
    try {
      setErrorMessage('');
      const res = await findId(email);
      setMaskedId(res.data.data.maskedUserId);
      setStep('idResult');
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || '아이디 찾기 실패');
    }
  };

  const handleSendPasswordCode = async () => {
    try {
      setErrorMessage('');
      setMessage('');

      await sendPasswordCode(email);
      setMessage('인증번호가 발송되었습니다.');
      setStep('passwordCode');
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || '인증번호 발송 실패');
    }
  };

  const handleResetPassword = async () => {
    try {
      setErrorMessage('');

      await resetPassword({
        email,
        code,
        newPassword,
        confirmPassword,
      });

      setStep('passwordDone');
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || '비밀번호 변경 실패');
    }
  };

  const resetState = (nextTab) => {
    setTab(nextTab);
    setStep('input');
    setEmail('');
    setCode('');
    setMaskedId('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    setErrorMessage('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card find-card">
        <div className="tab-title">
          <button
            className={tab === 'id' ? 'active' : ''}
            onClick={() => resetState('id')}
          >
            아이디 찾기
          </button>
          <button
            className={tab === 'password' ? 'active' : ''}
            onClick={() => resetState('password')}
          >
            비밀번호 찾기
          </button>
        </div>

        {tab === 'id' && step === 'input' && (
          <div className="find-content">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="가입된 이메일"
            />
            <button className="small-main-button" onClick={handleFindId}>
              아이디 찾기
            </button>
          </div>
        )}

        {tab === 'id' && step === 'idResult' && (
          <div className="result-row">
            <div>
              <h3>아이디 찾기 결과</h3>
              <p>회원님의 아이디는 {maskedId} 입니다</p>
            </div>
            <button onClick={() => navigate('/login')}>로그인하러 가기</button>
          </div>
        )}

        {tab === 'password' && step === 'input' && (
          <div className="find-content">
            <label>이메일 인증</label>
            <div className="password-row">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="가입된 이메일"
              />
              <button onClick={handleSendPasswordCode}>인증</button>
            </div>
          </div>
        )}

        {tab === 'password' && step === 'passwordCode' && (
          <div className="find-content">
            <label>인증번호</label>
            <div className="password-row">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="6자리 입력"
              />
            </div>

            <label>새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="********"
            />

            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />

            <p className="password-rule">비밀번호 조건 ✓ 8자 이상 ✓ 영문 포함 ✓ 숫자 포함</p>

            <button className="small-main-button" onClick={handleResetPassword}>
              비밀번호 변경
            </button>
          </div>
        )}

        {tab === 'password' && step === 'passwordDone' && (
          <div className="done-content">
            <div className="check-icon">✓</div>
            <h2>비밀번호 재설정이 완료되었습니다.</h2>
            <button onClick={() => navigate('/login')}>로그인 하러 가기</button>
          </div>
        )}

        {message && <p className="auth-success center">{message}</p>}
        {errorMessage && <p className="auth-error center">{errorMessage}</p>}
      </div>
    </div>
  );
}