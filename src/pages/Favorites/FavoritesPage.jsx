import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, UserRound } from 'lucide-react';

import Header from '../../components/common/Header/Header';
import Pagination from '../../components/common/Pagination/Pagination';
import {
  deleteFavoriteClub,
  getMyFavoriteClubs,
  getMyProfile,
  removeAuthToken,
} from '../../api/userApi';
import '../MyPage/MyPage.css';
import './FavoritesPage.css';

const LIMIT = 6;

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
          size={12}
          fill={index < filledCount ? 'currentColor' : 'none'}
          strokeWidth={1.7}
        />
      ))}
      <span>({rating.toFixed(1)})</span>
    </span>
  );
}

function FavoriteClubCard({ club, onOpen, onRemove, removingClubId }) {
  const imageUrl = club.profileImageUrl || club.coverImageUrl;
  const clubId = club.clubId ?? club.id;
  const isRemoving = removingClubId === clubId;

  return (
    <article
      className="favorite-card"
      onClick={() => onOpen(clubId)}
      style={{ cursor: 'pointer' }}
    >
      {imageUrl ? (
        <img
          className="favorite-card-image"
          src={imageUrl}
          alt={`${club.clubName} 이미지`}
        />
      ) : (
        <div className="favorite-card-image placeholder">IMG</div>
      )}

      <div className="favorite-card-body">
        <h3>{club.clubName}</h3>

        <div className="favorite-card-badges">
          <span className="club-category">{club.categoryName || '기타'}</span>
          <StatusBadge isRecruiting={club.isRecruiting} />
        </div>

        <div className="favorite-card-bottom">
          <Rating value={club.averageRating} />
          <button
            type="button"
            className="favorite-heart-button"
            aria-label={`${club.clubName} 찜 취소`}
            disabled={isRemoving}
            onClick={(event) => {
              event.stopPropagation();
              onRemove(clubId);
            }}
          >
            <Heart size={24} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
      </div>
    </article>
  );
}

function FavoritesPage() {
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
  const [removingClubId, setRemovingClubId] = useState(null);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchFavorites() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [profileData, favoritesData] = await Promise.all([
          getMyProfile(),
          getMyFavoriteClubs({
            page,
            limit: LIMIT,
          }),
        ]);

        if (!isMounted) {
          return;
        }

        setProfile(profileData || fallbackProfile);
        setClubs(favoritesData?.clubs || []);
        setPagination({
          totalCount: Number(favoritesData?.totalCount || 0),
          totalPages: Math.max(Number(favoritesData?.totalPages || 1), 1),
        });
      } catch {
        if (isMounted) {
          setErrorMessage('찜한 동아리를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchFavorites();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const handleRemoveFavorite = async (clubId) => {
    setRemovingClubId(clubId);
    setErrorMessage('');

    const removeClubFromList = () => {
      const nextTotalCount = Math.max(pagination.totalCount - 1, 0);
      const nextTotalPages = Math.max(Math.ceil(nextTotalCount / LIMIT), 1);

      if (page > nextTotalPages) {
        setPage(nextTotalPages);
        return;
      }

      setClubs((prevClubs) => (
        prevClubs.filter((club) => (club.clubId ?? club.id) !== clubId)
      ));
      setPagination({
        totalCount: nextTotalCount,
        totalPages: nextTotalPages,
      });
    };

    try {
      await deleteFavoriteClub(clubId);
      removeClubFromList();
    } catch (error) {
      if (
        error.response?.status === 404 ||
        error.response?.data?.error?.code === 'FAVORITE_NOT_FOUND'
      ) {
        removeClubFromList();
        return;
      }

      setErrorMessage('찜 취소에 실패했습니다.');
    } finally {
      setRemovingClubId(null);
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
            <MenuItem active>찜한 동아리</MenuItem>
            <MenuItem onClick={() => navigate('/mypage/reviews')}>내가 쓴 리뷰</MenuItem>
            <MenuItem onClick={() => navigate('/mypage')}>
              내가 등록한 동아리
            </MenuItem>
            <MenuItem onClick={() => navigate('/mypage/account')}>
              계정 설정
            </MenuItem>
          </nav>

          <div className="mypage-sidebar-footer">
            <button type="button" onClick={handleLogout}>로그아웃</button>
            <p>문의 : moari_sswu@gmail.com</p>
          </div>
        </aside>

        <section className="mypage-content favorites-content">
          <div className="mypage-content-header">
            <div>
              <h1>찜한 동아리</h1>
              <p>관심 있는 동아리를 모아두고 모집 상태를 빠르게 확인합니다.</p>
            </div>

            <span>총 {pagination.totalCount}개</span>
          </div>

          {isLoading && <div className="mypage-state">불러오는 중입니다.</div>}

          {!isLoading && errorMessage && (
            <div className="mypage-state error">{errorMessage}</div>
          )}

          {!isLoading && !errorMessage && clubs.length === 0 && (
            <div className="mypage-state">찜한 동아리가 없습니다.</div>
          )}

          {!isLoading && clubs.length > 0 && (
            <div className="favorite-card-grid">
              {clubs.map((club) => (
                <FavoriteClubCard
                  key={club.clubId ?? club.id}
                  club={club}
                  onOpen={(clubId) => navigate(`/club/${clubId}`)}
                  onRemove={handleRemoveFavorite}
                  removingClubId={removingClubId}
                />
              ))}
            </div>
          )}

          <div className="mypage-guide">
            상세 페이지의 하트 버튼으로 찜을 추가하거나 삭제할 수 있습니다.
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

export default FavoritesPage;
