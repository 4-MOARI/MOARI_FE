import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sendVerificationCode,
  confirmVerificationCode,
  signup,
} from '../../api/authApi';
import './AuthPage.css';

const schools = [
  { schoolId: 1, name: '성신여자대학교', domain: 'sungshin.ac.kr' },
  { schoolId: 2, name: '서울대학교', domain: 'snu.ac.kr' },
  { schoolId: 3, name: '연세대학교', domain: 'yonsei.ac.kr' },
  { schoolId: 4, name: '고려대학교', domain: 'korea.ac.kr' },
  { schoolId: 5, name: '서강대학교', domain: 'sogang.ac.kr' },
  { schoolId: 6, name: '성균관대학교', domain: 'skku.edu' },
  { schoolId: 7, name: '한양대학교', domain: 'hanyang.ac.kr' },
  { schoolId: 8, name: '중앙대학교', domain: 'cau.ac.kr' },
  { schoolId: 9, name: '경희대학교', domain: 'khu.ac.kr' },
  { schoolId: 10, name: '한국외국어대학교', domain: 'hufs.ac.kr' },
  { schoolId: 11, name: '서울시립대학교', domain: 'uos.ac.kr' },
  { schoolId: 12, name: '이화여자대학교', domain: 'ewha.ac.kr' },
  { schoolId: 13, name: '숙명여자대학교', domain: 'sookmyung.ac.kr' },
];

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: '',
    userId: '',
    password: '',
    confirmPassword: '',
    schoolId: 1,
    email: '',
    code: '',
  });

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const selectedSchool = schools.find(
    (school) => school.schoolId === Number(form.schoolId)
  );

  const schoolDomain = selectedSchool?.domain || '';
  const fullEmail = form.email ? `${form.email}@${schoolDomain}` : '';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'email' || name === 'schoolId') {
      setIsEmailVerified(false);
      setMessage('');
    }
  };

  const handleSendCode = async () => {
    try {
      setErrorMessage('');
      setMessage('');

      if (!form.email) {
        setErrorMessage('학교 이메일 아이디를 입력해주세요.');
        return;
      }

      await sendVerificationCode(fullEmail, Number(form.schoolId));
      setMessage('인증번호가 발송되었습니다.');
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || '인증번호 발송 실패');
    }
  };

  const handleConfirmCode = async () => {
    try {
      setErrorMessage('');
      setMessage('');

      if (!form.code) {
        setErrorMessage('인증번호를 입력해주세요.');
        return;
      }

      await confirmVerificationCode(fullEmail, form.code);
      setIsEmailVerified(true);
      setMessage('이메일 인증이 완료되었습니다.');
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || '인증번호 확인 실패');
    }
  };

  const handleSignup = async () => {
    try {
      setErrorMessage('');
      setMessage('');

      if (!form.userName || !form.userId || !form.password || !form.email) {
        setErrorMessage('필수 입력값을 모두 입력해주세요.');
        return;
      }

      if (form.password !== form.confirmPassword) {
        setErrorMessage('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (!isEmailVerified) {
        setErrorMessage('학교 이메일 인증을 먼저 완료해주세요.');
        return;
      }

      await signup({
        userId: form.userId,
        userName: form.userName,
        password: form.password,
        email: fullEmail,
        schoolId: Number(form.schoolId),
      });

      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || '회원가입 실패');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-subtitle small">
          아이디, 비밀번호, 이메일, 학교 정보를 입력하고 인증하세요
        </p>

        <div className="signup-grid">
          <div className="signup-field">
            <label>이름 *</label>
            <input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="홍길동"
            />
          </div>

          <div className="signup-field">
            <label>아이디 *</label>
            <input
              name="userId"
              value={form.userId}
              onChange={handleChange}
              placeholder="hong_gildong"
            />
            {form.userId && (
              <p className="auth-success">사용 가능한 아이디입니다.</p>
            )}
          </div>

          <div className="signup-field">
            <label>비밀번호 *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <p className="password-rule">
              비밀번호 조건 ✓ 8자 이상 ✓ 영문 포함 ✓ 숫자 포함
            </p>
          </div>

          <div className="signup-field">
            <label>비밀번호 확인 *</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="auth-error left">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
        </div>

        <div className="school-field">
          <label>학교 선택 *</label>
          <select name="schoolId" value={form.schoolId} onChange={handleChange}>
            {schools.map((school) => (
              <option key={school.schoolId} value={school.schoolId}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <label>학교 이메일 *</label>
        <div className="email-row">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="학번 또는 이메일 아이디"
          />
          <span className="email-domain">@{schoolDomain}</span>
          <button type="button" onClick={handleSendCode}>
            학교 인증
          </button>
        </div>

        <label>인증번호</label>
        <div className="code-row">
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="6자리 입력"
          />
          <button type="button" onClick={handleConfirmCode}>
            확인
          </button>
        </div>

        {message && <p className="auth-success center">{message}</p>}
        {errorMessage && <p className="auth-error center">{errorMessage}</p>}

        <button
          type="button"
          className="auth-main-button signup-button"
          onClick={handleSignup}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}