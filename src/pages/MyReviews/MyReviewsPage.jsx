import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';

import Header from '../../components/common/Header/Header';
import Pagination from '../../components/common/Pagination/Pagination';
import ReviewCard from '../../components/club/ReviewCard/ReviewCard';
import { deleteReview } from '../../api/reviewApi';
import { getMyProfile, getMyReviews, removeAuthToken } from '../../api/userApi';
import '../MyPage/MyPage.css';
import './MyReviewsPage.css';

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

function MyReviewsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(fallbackProfile);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchMyReviews() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const [profileData, reviewsData] = await Promise.all([
          getMyProfile(),
          getMyReviews({
            page,
            limit: LIMIT,
          }),
        ]);

        if (!isMounted) {
          return;
        }

        setProfile(profileData || fallbackProfile);
        setReviews(reviewsData?.reviews || []);
        setPagination({
          totalCount: Number(reviewsData?.totalCount || 0),
          totalPages: Math.max(Number(reviewsData?.totalPages || 1), 1),
        });
      } catch {
        if (isMounted) {
          setErrorMessage('내가 쓴 리뷰를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMyReviews();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId || deletingReviewId) return;

    const shouldDelete = window.confirm('리뷰를 삭제하시겠습니까?');

    if (!shouldDelete) return;

    setDeletingReviewId(reviewId);
    setErrorMessage('');

    const removeReviewFromList = () => {
      const nextTotalCount = Math.max(pagination.totalCount - 1, 0);
      const nextTotalPages = Math.max(Math.ceil(nextTotalCount / LIMIT), 1);

      if (page > nextTotalPages) {
        setPage(nextTotalPages);
        return;
      }

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.reviewId !== reviewId)
      );
      setPagination({
        totalCount: nextTotalCount,
        totalPages: nextTotalPages,
      });
    };

    try {
      await deleteReview(reviewId);
      removeReviewFromList();
    } catch (error) {
      if (error.response?.status === 404) {
        removeReviewFromList();
        return;
      }

      setErrorMessage('리뷰 삭제에 실패했습니다.');
    } finally {
      setDeletingReviewId(null);
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
            <MenuItem onClick={() => navigate('/mypage/favorites')}>
              찜한 동아리
            </MenuItem>
            <MenuItem active>내가 쓴 리뷰</MenuItem>
            <MenuItem onClick={() => navigate('/mypage')}>
              내가 등록,수정한 동아리
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

        <section className="mypage-content my-reviews-content">
          <div className="mypage-content-header">
            <div>
              <h1>내가 쓴 리뷰</h1>
              <p>작성한 리뷰를 모아보고 필요한 내용을 빠르게 확인합니다.</p>
            </div>

            <span>총 {pagination.totalCount}개</span>
          </div>

          {isLoading && <div className="mypage-state">불러오는 중입니다.</div>}

          {!isLoading && errorMessage && (
            <div className="mypage-state error">{errorMessage}</div>
          )}

          {!isLoading && !errorMessage && reviews.length === 0 && (
            <div className="mypage-state">작성한 리뷰가 없습니다.</div>
          )}

          {!isLoading && !errorMessage && reviews.length > 0 && (
            <div className="my-review-list">
              {reviews.map((review) => (
                <article
                  className="my-review-item"
                  key={review.reviewId}
                >
                  <strong className="my-review-club-name">
                    {review.clubName}
                  </strong>
                  <ReviewCard
                    userId={review.userId}
                    rating={review.rating}
                    content={review.content}
                    createdAt={review.createdAt}
                    isMine
                    onDelete={() => handleDeleteReview(review.reviewId)}
                    isDeleting={deletingReviewId === review.reviewId}
                  />
                </article>
              ))}
            </div>
          )}

          <div className="mypage-guide">
            리뷰 작성과 삭제는 동아리 상세 페이지의 리뷰 섹션에서 관리합니다.
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

export default MyReviewsPage;
