import { useEffect, useState } from 'react';
import { LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';

import Header from '../../components/common/Header/Header';
import {
  changeMyPassword,
  deleteMyAccount,
  getMyProfile,
  verifyMyPassword,
} from '../../api/userApi';
import '../MyPage/MyPage.css';
import './AccountSettingsPage.css';

const fallbackProfile = {
  userName: '홍길동',
  email: 'hong@korea.ac.kr',
  school: {
    schoolName: '성신여자대학교',
  },
};

function MenuItem({ children, active }) {
  return (
    <button className={`mypage-menu-item${active ? ' active' : ''}`}>
      {children}
    </button>
  );
}

function ReadonlyField({ label, value, helperText }) {
  return (
    <label className="account-field">
      <span>{label}</span>
      <input value={value || ''} readOnly />
      {helperText && <em>{helperText}</em>}
    </label>
  );
}

function AccountSettingsPage() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isDeleteChecked, setIsDeleteChecked] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const profileData = await getMyProfile();

        if (isMounted) {
          setProfile(profileData || fallbackProfile);
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
      setPasswordMessage('현재 비밀번호가 확인되었습니다.');
    } catch {
      setPasswordMessage('현재 비밀번호가 일치하지 않습니다.');
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
      setPasswordMessage('새 비밀번호는 8자 이상 50자 이하로 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('새 비밀번호 확인이 일치하지 않습니다.');
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
      setPasswordMessage('비밀번호가 변경되었습니다.');
    } catch {
      setPasswordMessage('비밀번호 변경에 실패했습니다.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteMessage('');

    if (!isDeleteChecked) {
      setDeleteMessage('회원탈퇴 안내를 확인해주세요.');
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteMyAccount();
      setDeleteMessage(
        `회원탈퇴가 완료되었습니다. 삭제된 등록 동아리 수: ${result.deletedClubCount || 0}개`
      );
    } catch {
      setDeleteMessage('회원탈퇴 처리에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

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
            <MenuItem>찜한 동아리</MenuItem>
            <MenuItem>내가 쓴 리뷰</MenuItem>
            <MenuItem>내가 등록한 동아리</MenuItem>
            <MenuItem active>계정 설정</MenuItem>
          </nav>

          <div className="mypage-sidebar-footer">
            <button type="button">로그아웃</button>
            <p>문의 : moari_sswu@gmail.com</p>
          </div>
        </aside>

        <section className="mypage-content account-settings-content">
          <div className="mypage-content-header">
            <div>
              <h1>계정 설정</h1>
              <p>내 계정 정보를 확인하고 비밀번호를 변경할 수 있습니다.</p>
            </div>

            <span>변경 불가</span>
          </div>

          {isLoading && <div className="mypage-state">불러오는 중입니다.</div>}

          {!isLoading && errorMessage && (
            <div className="mypage-state error">{errorMessage}</div>
          )}

          {!isLoading && !errorMessage && (
            <div className="account-settings-panel">
              <section className="account-section">
                <div className="account-section-title">
                  <ShieldCheck size={22} strokeWidth={2} />
                  <h2>기본 정보</h2>
                </div>

                <div className="account-field-grid">
                  <ReadonlyField
                    label="이름"
                    value={profile.userName}
                    helperText="가입 시 등록된 이름입니다."
                  />
                  <ReadonlyField
                    label="아이디"
                    value={profile.email}
                    helperText="아이디는 변경할 수 없습니다."
                  />
                  <ReadonlyField
                    label="학교"
                    value={profile.school?.schoolName}
                    helperText="학교는 변경할 수 없습니다."
                  />
                </div>
              </section>

              <section className="account-section">
                <div className="account-section-title">
                  <LockKeyhole size={22} strokeWidth={2} />
                  <h2>비밀번호 변경</h2>
                </div>

                <form className="account-password-form">
                  <label className="account-field">
                    <span>현재 비밀번호</span>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => {
                        setCurrentPassword(event.target.value);
                        setIsPasswordVerified(false);
                      }}
                      placeholder="현재 비밀번호 입력"
                    />
                  </label>

                  <button
                    type="button"
                    className="account-secondary-button"
                    disabled={isPasswordSubmitting}
                    onClick={handleVerifyPassword}
                  >
                    비밀번호 확인
                  </button>

                  <label className="account-field">
                    <span>새 비밀번호</span>
                    <input
                      type="password"
                      value={newPassword}
                      disabled={!isPasswordVerified}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="8자 이상 입력"
                    />
                  </label>

                  <label className="account-field">
                    <span>새 비밀번호 확인</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      disabled={!isPasswordVerified}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="새 비밀번호 재입력"
                    />
                  </label>

                  <button
                    type="button"
                    className="account-primary-button"
                    disabled={isPasswordSubmitting || !isPasswordVerified}
                    onClick={handleChangePassword}
                  >
                    변경하기
                  </button>
                </form>

                {passwordMessage && (
                  <p className="account-message">{passwordMessage}</p>
                )}
              </section>

              <section className="account-section danger">
                <h2>회원탈퇴</h2>
                <p>
                  회원탈퇴 시 내가 등록한 동아리와 계정 정보가 함께 삭제됩니다.
                </p>

                <label className="account-delete-check">
                  <input
                    type="checkbox"
                    checked={isDeleteChecked}
                    onChange={(event) => setIsDeleteChecked(event.target.checked)}
                  />
                  <span>안내 내용을 확인했습니다.</span>
                </label>

                <button
                  type="button"
                  className="account-danger-button"
                  disabled={isDeleting || !isDeleteChecked}
                  onClick={handleDeleteAccount}
                >
                  회원탈퇴
                </button>

                {deleteMessage && (
                  <p className="account-message danger">{deleteMessage}</p>
                )}
              </section>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default AccountSettingsPage;
