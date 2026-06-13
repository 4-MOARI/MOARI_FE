import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';

import Header from '../../components/common/Header/Header';
import {
  changeMyPassword,
  deleteMyAccount,
  getMyProfile,
  removeAuthToken,
  verifyMyPassword,
} from '../../api/userApi';
import '../MyPage/MyPage.css';
import './AccountSettingsPage.css';

const fallbackProfile = {
  userId: 'hong_gildong',
  userName: '홍길동',
  email: 'hong@korea.ac.kr',
  school: {
    schoolName: '성신여자대학교',
  },
  isVerified: true,
};

function MenuItem({ children, active, onClick }) {
  return (
    <button
      type="button"
      className={`mypage-menu-item${active ? ' active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function StatusBadge({ children, tone = 'disabled' }) {
  return (
    <span className={`account-status-badge ${tone}`}>
      {children}
    </span>
  );
}

function AccountInfoRow({
  label,
  value,
  action,
}) {
  return (
    <div className="account-info-row">
      <strong>{label}</strong>
      <span>{value}</span>
      <div>{action}</div>
    </div>
  );
}

function AccountSettingsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(fallbackProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordModalStep, setPasswordModalStep] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isPasswordModalOpen = passwordModalStep !== null;

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const openPasswordModal = () => {
    setPasswordModalStep('verify');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordVerified(false);
    setPasswordMessage('');
  };

  const closePasswordModal = () => {
    setPasswordModalStep(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordVerified(false);
    setPasswordMessage('');
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const profileData = await getMyProfile();

        if (isMounted) {
          setProfile({
            ...fallbackProfile,
            ...profileData,
          });
        }
      } catch {
        if (isMounted) {
          setErrorMessage('계정 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleVerifyPassword = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setIsPasswordVerified(false);

    if (!currentPassword.trim()) {
      setPasswordMessage('현재 비밀번호를 입력해주세요.');
      return;
    }

    setIsPasswordSubmitting(true);

    try {
      await verifyMyPassword(currentPassword);
      setIsPasswordVerified(true);
      setPasswordMessage('');
      setPasswordModalStep('change');
    } catch {
      setPasswordMessage('비밀번호가 일치하지 않습니다.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage('');

    if (!isPasswordVerified) {
      setPasswordMessage('현재 비밀번호 확인을 먼저 진행해주세요.');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 50) {
      setPasswordMessage('비밀번호 조건을 확인해주세요.');
      return;
    }

    if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setPasswordMessage('비밀번호 조건을 확인해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsPasswordSubmitting(true);

    try {
      await changeMyPassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordVerified(false);
      setPasswordModalStep(null);
      setPasswordMessage('비밀번호가 변경되었습니다.');
    } catch {
      setPasswordMessage('비밀번호 변경에 실패했습니다.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteMessage('');

    if (!window.confirm('계정을 탈퇴하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteMyAccount();
      setDeleteMessage(
        `회원탈퇴가 완료되었습니다. 등록 동아리 ${result.preservedClubCount || 0}개와 작성 리뷰는 보존됩니다.`
      );
    } catch {
      setDeleteMessage('회원탈퇴 처리에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const accountId = profile.userId || profile.email?.split('@')[0] || 'hong_gildong';

  return (
    <>
      <Header />

      <main className="mypage-screen">
        <aside className="mypage-sidebar">
          <div className="mypage-profile-icon">
            <UserRound size={38} strokeWidth={2} />
          </div>

          <strong>{profile.userName}</strong>
          <span>{profile.email}</span>
          <em>{profile.school?.schoolName}</em>

          <nav className="mypage-menu" aria-label="마이페이지 메뉴">
            <MenuItem onClick={() => navigate('/mypage/favorites')}>
              찜한 동아리
            </MenuItem>
            <MenuItem onClick={() => navigate('/mypage/reviews')}>내가 쓴 리뷰</MenuItem>
            <MenuItem onClick={() => navigate('/mypage')}>
              내가 등록,수정한 동아리
            </MenuItem>
            <MenuItem active>계정 설정</MenuItem>
          </nav>

          <div className="mypage-sidebar-footer">
            <button type="button" onClick={handleLogout}>로그아웃</button>
            <p>문의 : moari_sswu@gmail.com</p>
          </div>
        </aside>

        <section className="mypage-content account-settings-content">
          <div className="account-settings-header">
            <h1>계정 설정</h1>
            <p>개인정보와 학교 인증 상태를 확인하고 계정 정보를 관리합니다.</p>
          </div>

          {isLoading && <div className="mypage-state">불러오는 중입니다.</div>}

          {!isLoading && errorMessage && (
            <div className="mypage-state error">{errorMessage}</div>
          )}

          {!isLoading && !errorMessage && (
            <>
              <div className="account-info-list">
                <AccountInfoRow
                  label="아이디"
                  value={accountId}
                  action={<StatusBadge>변경 불가</StatusBadge>}
                />
                <AccountInfoRow
                  label="학교"
                  value={profile.school?.schoolName}
                  action={<StatusBadge>변경 불가</StatusBadge>}
                />
                <AccountInfoRow
                  label="이메일"
                  value={profile.email}
                  action={(
                    <StatusBadge tone="success">
                      {profile.isVerified === false ? '인증 필요' : '인증 완료'}
                    </StatusBadge>
                  )}
                />
                <AccountInfoRow
                  label="비밀번호"
                  value="••••••••"
                  action={(
                    <button
                      type="button"
                      className="account-change-button"
                      onClick={openPasswordModal}
                    >
                      변경
                    </button>
                  )}
                />
              </div>

              {!isPasswordModalOpen && passwordMessage && (
                <p className="account-message">{passwordMessage}</p>
              )}

              <section className="account-delete-box">
                <div>
                  <h2>탈퇴</h2>
                  <p>계정 삭제 시 찜 정보만 삭제되며, 등록한 동아리와 작성 리뷰는 보존됩니다.</p>
                  {deleteMessage && (
                    <p className="account-message danger">{deleteMessage}</p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                >
                  계정 탈퇴
                </button>
              </section>
            </>
          )}
        </section>
      </main>

      {isPasswordModalOpen && (
        <div
          className="password-modal-overlay"
          onClick={closePasswordModal}
        >
          {passwordModalStep === 'verify' && (
            <form
              className="password-modal"
              onClick={(event) => event.stopPropagation()}
              onSubmit={handleVerifyPassword}
            >
              <h2>비밀번호 변경</h2>

              <label className="password-modal-field">
                <span>현재 비밀번호</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                    setIsPasswordVerified(false);
                    setPasswordMessage('');
                  }}
                  autoFocus
                />
              </label>

              <p className="password-modal-message">
                {passwordMessage}
              </p>

              <button
                type="submit"
                className="password-modal-submit"
                disabled={isPasswordSubmitting}
              >
                확인
              </button>
            </form>
          )}

          {passwordModalStep === 'change' && (
            <form
              className="password-modal password-modal--large"
              onClick={(event) => event.stopPropagation()}
              onSubmit={handleChangePassword}
            >
              <h2>비밀번호 변경</h2>

              <label className="password-modal-field">
                <span>새 비밀번호</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setPasswordMessage('');
                  }}
                  autoFocus
                />
              </label>

              <label className="password-modal-field">
                <span>비밀번호 확인</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordMessage('');
                  }}
                />
              </label>

              <div className="password-modal-help-row">
                <span>비밀번호 조건  ✓ 8자 이상  ✓ 영문 포함  ✓ 숫자 포함</span>
                <p>{passwordMessage}</p>
              </div>

              <button
                type="submit"
                className="password-modal-submit"
                disabled={isPasswordSubmitting}
              >
                비밀번호 변경
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}

export default AccountSettingsPage;
