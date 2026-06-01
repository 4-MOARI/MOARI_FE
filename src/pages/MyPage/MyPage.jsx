import { useEffect, useState } from 'react';
import { Heart, Star, UserRound } from 'lucide-react';

import Header from '../../components/common/Header/Header';
import Pagination from '../../components/common/Pagination/Pagination';
import { getMyClubs, getMyProfile } from '../../api/userApi';
import './MyPage.css';

const LIMIT = 6;

const fallbackProfile = {
  userName: '홍길동',
  email: 'hong@korea.ac.kr',
  school: {
    schoolName: '성신여자대학교',
  },
};

function MyPageMenuItem({ children, active }) {
  return (
    <button className={`mypage-menu-item${active ? ' active' : ''}`}>
      {children}
    </button>
  );
}

function StatusBadge({ isRecruiting }) {
  return (
    <span className={`club-status${isRecruiting ? ' recruiting' : ' closed'}`}>
      {isRecruiting ? '모집중' : '마감'}
    </span>
  );
}

function Rating({ value }) {
  const rating = Number(value || 0);
  const filledCount = Math.round(rating);

  return (
    <span className="club-rating" aria-label={`평점 ${rating}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={13}
          fill={index < filledCount ? 'currentColor' : 'none'}
          strokeWidth={1.8}
        />
      ))}
      <span>({rating.toFixed(1)})</span>
    </span>
  );
}

function ClubImage({ club }) {
  const imageUrl = club.profileImageUrl || club.coverImageUrl;

  if (imageUrl) {
    return (
      <img
        className="club-card-image"
        src={imageUrl}
        alt={`${club.clubName} 이미지`}
      />
    );
  }

  return <div className="club-card-placeholder">IMAGE</div>;
}

function ClubCard({ club }) {
  return (
    <article className="my-club-card">
      <ClubImage club={club} />

      <div className="club-card-main">
        <div className="club-card-badges">
          <span className="club-category">{club.categoryName || '기타'}</span>
          <StatusBadge isRecruiting={club.isRecruiting} />
        </div>

        <h3>{club.clubName}</h3>
        <p>{club.briefDescription || '동아리 소개가 아직 등록되지 않았습니다.'}</p>

        <div className="club-card-meta">
          <Rating value={club.averageRating} />
          <span className="club-favorite-count">
            <Heart size={14} strokeWidth={1.8} />
            ({Number(club.favoriteCount || 0)})
          </span>
        </div>
      </div>

      <div className="club-card-actions">
        <button type="button">수정하기</button>
        <button type="button">[수정 로그]</button>
      </div>
    </article>
  );
}

function MyPage() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [clubs, setClubs] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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
            <MyPageMenuItem>찜한 동아리</MyPageMenuItem>
            <MyPageMenuItem>내가 쓴 리뷰</MyPageMenuItem>
            <MyPageMenuItem active>내가 등록한 동아리</MyPageMenuItem>
            <MyPageMenuItem>계정 설정</MyPageMenuItem>
          </nav>

          <div className="mypage-sidebar-footer">
            <button type="button">로그아웃</button>
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
                <ClubCard key={club.clubId} club={club} />
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
