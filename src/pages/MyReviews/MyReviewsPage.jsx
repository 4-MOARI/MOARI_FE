import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';

import Header from '../../components/common/Header/Header';
import Pagination from '../../components/common/Pagination/Pagination';
import { getMyProfile } from '../../api/userApi';
import '../MyPage/MyPage.css';
import './MyReviewsPage.css';

const fallbackProfile = {
  userName: '홍길동',
  email: 'hong@korea.ac.kr',
  school: {
    schoolName: '성신여자대학교',
  },
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

function MyReviewsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(fallbackProfile);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const profileData = await getMyProfile();

        if (isMounted) {
          setProfile(profileData || fallbackProfile);
        }
      } catch {
        if (isMounted) {
          setProfile(fallbackProfile);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
            <MenuItem active>내가 쓴 리뷰</MenuItem>
            <MenuItem onClick={() => navigate('/mypage')}>
              내가 등록한 동아리
            </MenuItem>
            <MenuItem onClick={() => navigate('/mypage/account')}>
              계정 설정
            </MenuItem>
          </nav>

          <div className="mypage-sidebar-footer">
            <button type="button">로그아웃</button>
            <p>문의 : moari_sswu@gmail.com</p>
          </div>
        </aside>

        <section className="mypage-content my-reviews-content">
          <div className="mypage-content-header">
            <div>
              <h1>내가 쓴 리뷰</h1>
              <p>작성한 리뷰를 모아보고 필요한 내용을 빠르게 확인합니다.</p>
            </div>

            <span>총 0개</span>
          </div>

          <div className="mypage-state">
            내가 쓴 리뷰 목록 API 확정 후 연결 예정입니다.
          </div>

          <div className="mypage-guide">
            현재 머지된 리뷰 API는 동아리별 리뷰 조회/작성/삭제 기준입니다.
          </div>

          <Pagination
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
          />
        </section>
      </main>
    </>
  );
}

export default MyReviewsPage;
