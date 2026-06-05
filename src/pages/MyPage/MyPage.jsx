import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';

import ClubCard from '../../components/club/ClubCard/ClubCard';
import Header from '../../components/common/Header/Header';
import Pagination from '../../components/common/Pagination/Pagination';
import { getMyClubs, getMyProfile, removeAuthToken } from '../../api/userApi';
import './MyPage.css';

const LIMIT = 2;

const fallbackProfile = {
  userName: '홍길동',
  email: 'hong@korea.ac.kr',
  school: {
    schoolName: '성신여자대학교',
  },
};

function MyPageMenuItem({ children, active, onClick }) {
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

function MyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(fallbackProfile);
  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchMyPage() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [profileData, clubsData] = await Promise.all([
          getMyProfile(),
          getMyClubs({
            page,
            limit: LIMIT,
          }),
        ]);

        if (!isMounted) {
          return;
        }

        setProfile(profileData || fallbackProfile);
        setClubs(clubsData?.clubs || []);
        setPagination({
          totalCount: Number(clubsData?.totalCount || 0),
          totalPages: Math.max(Number(clubsData?.totalPages || 1), 1),
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('마이페이지 정보를 불러오지 못했습니다.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMyPage();

    return () => {
      isMounted = false;
    };
  }, [page]);

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
            <MyPageMenuItem onClick={() => navigate('/mypage/favorites')}>
              찜한 동아리
            </MyPageMenuItem>
            <MyPageMenuItem onClick={() => navigate('/mypage/reviews')}>내가 쓴 리뷰</MyPageMenuItem>
            <MyPageMenuItem active>내가 등록한 동아리</MyPageMenuItem>
            <MyPageMenuItem onClick={() => navigate('/mypage/account')}>
              계정 설정
            </MyPageMenuItem>
          </nav>

          <div className="mypage-sidebar-footer">
            <button type="button" onClick={handleLogout}>로그아웃</button>
            <p>문의 : moari_sswu@gmail.com</p>
          </div>
        </aside>

        <section className="mypage-content">
          <div className="mypage-content-header">
            <div>
              <h1>내가 등록한 동아리</h1>
              <p>관심 있는 동아리를 모아두고 모집 상태를 빠르게 확인합니다.</p>
            </div>

            <span>총 {pagination.totalCount}개</span>
          </div>

          {isLoading && <div className="mypage-state">불러오는 중입니다.</div>}

          {!isLoading && errorMessage && (
            <div className="mypage-state error">{errorMessage}</div>
          )}

          {!isLoading && !errorMessage && clubs.length === 0 && (
            <div className="mypage-state">등록한 동아리가 없습니다.</div>
          )}

          {!isLoading && !errorMessage && clubs.length > 0 && (
            <div className="my-club-list">
              {clubs.map((club) => (
                <ClubCard
                  key={club.clubId ?? club.id}
                  club={club}
                  onClick={() => navigate(`/club/${club.clubId ?? club.id}`)}
                  onEdit={() => navigate(`/club/update/${club.clubId ?? club.id}`)}
                />
              ))}
            </div>
          )}

          <div className="mypage-guide">
            내가 등록한 동아리를 수정할 수 있습니다.
          </div>

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </section>
      </main>
    </>
  );
}

export default MyPage;
