import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';

import Header from '../../components/common/Header/Header';
import Pagination from '../../components/common/Pagination/Pagination';
import ReviewCard from '../../components/club/ReviewCard/ReviewCard';

import { deleteReview } from '../../api/reviewApi';

import {
  getMyProfile,
  getMyReviews,
  removeAuthToken,
} from '../../api/userApi';

import {
  getMyInterviewReviews,
  deleteInterviewReview,
} from '../../api/interviewReviewApi';

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

const METHOD_LABELS = {
  FACE_TO_FACE: '대면',
  ONLINE: '비대면',
  MIXED: '혼합',
};

const TYPE_LABELS = {
  INDIVIDUAL: '개인',
  GROUP: '그룹',
  MANY_TO_ONE: '다대일',
  MANY_TO_MANY: '다대다',
};

const ATMOSPHERE_LABELS = {
  COMFORTABLE: '편안함',
  NORMAL: '보통',
  PRESSURE: '압박 있음',
};

const DIFFICULTY_LABELS = {
  EASY: '쉬움',
  NORMAL: '보통',
  HARD: '어려움',
};

const DURATION_LABELS = {
  UNDER_10: '10분 이하',
  MIN_10_20: '10~20분',
  MIN_20_30: '20~30분',
  OVER_30: '30분 이상',
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

function InterviewTag({ children }) {
  if (!children) {
    return null;
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 10px',
        borderRadius: '999px',
        background: '#f0edff',
        color: '#574bc4',
        fontSize: '12px',
        fontWeight: '700',
      }}
    >
      {children}
    </span>
  );
}

function MyReviewsPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(fallbackProfile);
  const [reviewType, setReviewType] = useState('review');

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
  });

  const [interviewReviews, setInterviewReviews] = useState([]);
  const [interviewPage, setInterviewPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [interviewLoading, setInterviewLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [interviewErrorMessage, setInterviewErrorMessage] = useState('');

  const [deletingReviewId, setDeletingReviewId] = useState(null);
  const [
    deletingInterviewReviewId,
    setDeletingInterviewReviewId,
  ] = useState(null);

  const interviewTotalCount = interviewReviews.length;

  const interviewTotalPages = Math.max(
    Math.ceil(interviewTotalCount / LIMIT),
    1
  );

  const visibleInterviewReviews = useMemo(() => {
    const start = (interviewPage - 1) * LIMIT;
    const end = start + LIMIT;

    return interviewReviews.slice(start, end);
  }, [interviewReviews, interviewPage]);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

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

  useEffect(() => {
    let isMounted = true;

    async function fetchMyReviews() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const reviewsData = await getMyReviews({
          page,
          limit: LIMIT,
        });

        if (!isMounted) {
          return;
        }

        setReviews(reviewsData?.reviews || []);

        setPagination({
          totalCount: Number(
            reviewsData?.totalCount || 0
          ),
          totalPages: Math.max(
            Number(
              reviewsData?.totalPages || 1
            ),
            1
          ),
        });
      } catch {
        if (isMounted) {
          setErrorMessage(
            '내가 쓴 리뷰를 불러오지 못했습니다.'
          );
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

  useEffect(() => {
    let isMounted = true;

    async function fetchMyInterviewReviews() {
      setInterviewLoading(true);
      setInterviewErrorMessage('');

      try {
        const response =
          await getMyInterviewReviews();

        const data =
          response?.data?.data ??
          response?.data ??
          {};

        const reviewList =
          data?.reviews || [];

        if (!isMounted) {
          return;
        }

        setInterviewReviews(reviewList);

        const nextTotalPages = Math.max(
          Math.ceil(
            reviewList.length / LIMIT
          ),
          1
        );

        if (
          interviewPage >
          nextTotalPages
        ) {
          setInterviewPage(
            nextTotalPages
          );
        }
      } catch (error) {
        console.error(
          '내 면접 후기 조회 실패:',
          error
        );

        if (isMounted) {
          setInterviewReviews([]);
          setInterviewErrorMessage(
            '내가 쓴 면접 후기를 불러오지 못했습니다.'
          );
        }
      } finally {
        if (isMounted) {
          setInterviewLoading(false);
        }
      }
    }

    fetchMyInterviewReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteReview = async (
    reviewId
  ) => {
    if (
      !reviewId ||
      deletingReviewId
    ) {
      return;
    }

    const shouldDelete =
      window.confirm(
        '리뷰를 삭제하시겠습니까?'
      );

    if (!shouldDelete) {
      return;
    }

    setDeletingReviewId(reviewId);
    setErrorMessage('');

    const removeReviewFromList = () => {
      const nextTotalCount = Math.max(
        pagination.totalCount - 1,
        0
      );

      const nextTotalPages = Math.max(
        Math.ceil(
          nextTotalCount / LIMIT
        ),
        1
      );

      if (page > nextTotalPages) {
        setPage(nextTotalPages);
        return;
      }

      setReviews((prevReviews) =>
        prevReviews.filter(
          (review) =>
            review.reviewId !==
            reviewId
        )
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
      if (
        error.response?.status === 404
      ) {
        removeReviewFromList();
        return;
      }

      setErrorMessage(
        '리뷰 삭제에 실패했습니다.'
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleDeleteInterviewReview =
    async (interviewReviewId) => {
      if (
        !interviewReviewId ||
        deletingInterviewReviewId
      ) {
        return;
      }

      const shouldDelete =
        window.confirm(
          '면접 후기를 삭제하시겠습니까?'
        );

      if (!shouldDelete) {
        return;
      }

      setDeletingInterviewReviewId(
        interviewReviewId
      );

      setInterviewErrorMessage('');

      try {
        await deleteInterviewReview(
          interviewReviewId
        );

        const nextReviews =
          interviewReviews.filter(
            (review) =>
              review.interviewReviewId !==
              interviewReviewId
          );

        setInterviewReviews(
          nextReviews
        );

        const nextTotalPages =
          Math.max(
            Math.ceil(
              nextReviews.length /
                LIMIT
            ),
            1
          );

        if (
          interviewPage >
          nextTotalPages
        ) {
          setInterviewPage(
            nextTotalPages
          );
        }
      } catch (error) {
        if (
          error.response?.status ===
          404
        ) {
          setInterviewReviews(
            (prevReviews) =>
              prevReviews.filter(
                (review) =>
                  review.interviewReviewId !==
                  interviewReviewId
              )
          );

          return;
        }

        setInterviewErrorMessage(
          error.response?.data?.error
            ?.message ||
            '면접 후기 삭제에 실패했습니다.'
        );
      } finally {
        setDeletingInterviewReviewId(
          null
        );
      }
    };

  const currentTotalCount =
    reviewType === 'review'
      ? pagination.totalCount
      : interviewTotalCount;

  return (
    <>
      <Header />

      <main className="mypage-screen">
        <aside className="mypage-sidebar">
          <div className="mypage-profile-icon">
            <UserRound
              size={38}
              strokeWidth={2}
            />
          </div>

          <strong>
            {profile.userName}
          </strong>

          <span>
            {profile.email}
          </span>

          <em>
            {
              profile.school
                ?.schoolName
            }
          </em>

          <nav
            className="mypage-menu"
            aria-label="마이페이지 메뉴"
          >
            <MenuItem
              onClick={() =>
                navigate(
                  '/mypage/favorites'
                )
              }
            >
              찜한 동아리
            </MenuItem>

            <MenuItem active>
              내가 쓴 리뷰
            </MenuItem>

            <MenuItem
              onClick={() =>
                navigate('/mypage')
              }
            >
              내가 등록,수정한 동아리
            </MenuItem>

            <MenuItem
              onClick={() =>
                navigate(
                  '/mypage/recommendations'
                )
              }
            >
              맞춤 동아리
            </MenuItem>

            <MenuItem
              onClick={() =>
                navigate(
                  '/mypage/account'
                )
              }
            >
              계정 설정
            </MenuItem>
          </nav>

          <div className="mypage-sidebar-footer">
            <button
              type="button"
              onClick={handleLogout}
            >
              로그아웃
            </button>

            <p>
              문의 : moari_sswu@gmail.com
            </p>
          </div>
        </aside>

        <section className="mypage-content my-reviews-content">
          <div className="mypage-content-header">
            <div>
              <h1>
                내가 쓴 리뷰
              </h1>

              <p>
                작성한 리뷰와 면접 후기를
                모아보고 필요한 내용을
                빠르게 확인합니다.
              </p>
            </div>

            <span>
              총 {currentTotalCount}개
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '26px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setReviewType(
                  'review'
                );
              }}
              style={{
                minWidth: '110px',
                height: '40px',
                padding: '0 20px',
                border:
                  '1px solid #574bc4',
                borderRadius:
                  '999px',
                background:
                  reviewType ===
                  'review'
                    ? '#574bc4'
                    : '#ffffff',
                color:
                  reviewType ===
                  'review'
                    ? '#ffffff'
                    : '#574bc4',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              일반 리뷰
            </button>

            <button
              type="button"
              onClick={() => {
                setReviewType(
                  'interview'
                );
              }}
              style={{
                minWidth: '110px',
                height: '40px',
                padding: '0 20px',
                border:
                  '1px solid #574bc4',
                borderRadius:
                  '999px',
                background:
                  reviewType ===
                  'interview'
                    ? '#574bc4'
                    : '#ffffff',
                color:
                  reviewType ===
                  'interview'
                    ? '#ffffff'
                    : '#574bc4',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              면접 후기
            </button>
          </div>

          {reviewType === 'review' && (
            <>
              {isLoading && (
                <div className="mypage-state">
                  불러오는 중입니다.
                </div>
              )}

              {!isLoading &&
                errorMessage && (
                  <div className="mypage-state error">
                    {errorMessage}
                  </div>
                )}

              {!isLoading &&
                !errorMessage &&
                reviews.length ===
                  0 && (
                  <div className="mypage-state">
                    작성한 리뷰가
                    없습니다.
                  </div>
                )}

              {!isLoading &&
                !errorMessage &&
                reviews.length >
                  0 && (
                  <div className="my-review-list">
                    {reviews.map(
                      (review) => (
                        <article
                          className="my-review-item"
                          key={
                            review.reviewId
                          }
                        >
                          <strong className="my-review-club-name">
                            {
                              review.clubName
                            }
                          </strong>

                          <ReviewCard
                            userId={
                              review.userId
                            }
                            rating={
                              review.rating
                            }
                            content={
                              review.content
                            }
                            createdAt={
                              review.createdAt
                            }
                            isMine
                            onDelete={() =>
                              handleDeleteReview(
                                review.reviewId
                              )
                            }
                            isDeleting={
                              deletingReviewId ===
                              review.reviewId
                            }
                          />
                        </article>
                      )
                    )}
                  </div>
                )}

              <div className="mypage-guide">
                일반 리뷰는 동아리 상세
                페이지에서도 작성할 수
                있습니다.
              </div>

              <Pagination
                currentPage={page}
                totalPages={
                  pagination.totalPages
                }
                onPageChange={setPage}
              />
            </>
          )}

          {reviewType ===
            'interview' && (
            <>
              {interviewLoading && (
                <div className="mypage-state">
                  면접 후기를 불러오는
                  중입니다.
                </div>
              )}

              {!interviewLoading &&
                interviewErrorMessage && (
                  <div className="mypage-state error">
                    {
                      interviewErrorMessage
                    }
                  </div>
                )}

              {!interviewLoading &&
                !interviewErrorMessage &&
                interviewReviews.length ===
                  0 && (
                  <div className="mypage-state">
                    작성한 면접 후기가
                    없습니다.
                  </div>
                )}

              {!interviewLoading &&
                !interviewErrorMessage &&
                visibleInterviewReviews.length >
                  0 && (
                  <div className="my-review-list">
                    {visibleInterviewReviews.map(
                      (review) => (
                        <article
                          className="my-review-item"
                          key={
                            review.interviewReviewId
                          }
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              justifyContent:
                                'space-between',
                              alignItems:
                                'center',
                              gap: '12px',
                              marginBottom:
                                '14px',
                            }}
                          >
                            <strong className="my-review-club-name">
                              {
                                review.clubName
                              }
                            </strong>

                            <button
                              type="button"
                              disabled={
                                deletingInterviewReviewId ===
                                review.interviewReviewId
                              }
                              onClick={() =>
                                handleDeleteInterviewReview(
                                  review.interviewReviewId
                                )
                              }
                              style={{
                                flexShrink: 0,
                                padding:
                                  '7px 13px',
                                border:
                                  'none',
                                borderRadius:
                                  '8px',
                                background:
                                  '#ffe9e9',
                                color:
                                  '#e45252',
                                fontSize:
                                  '12px',
                                fontWeight:
                                  '700',
                                cursor:
                                  deletingInterviewReviewId ===
                                  review.interviewReviewId
                                    ? 'default'
                                    : 'pointer',
                                opacity:
                                  deletingInterviewReviewId ===
                                  review.interviewReviewId
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {deletingInterviewReviewId ===
                              review.interviewReviewId
                                ? '삭제 중...'
                                : '삭제'}
                            </button>
                          </div>

                          {review.hasInterview ? (
                            <>
                              <div
                                style={{
                                  display:
                                    'flex',
                                  flexWrap:
                                    'wrap',
                                  gap: '7px',
                                  marginBottom:
                                    '14px',
                                }}
                              >
                                <InterviewTag>
                                  {
                                    METHOD_LABELS[
                                      review
                                        .interviewMethod
                                    ]
                                  }
                                </InterviewTag>

                                <InterviewTag>
                                  {
                                    TYPE_LABELS[
                                      review
                                        .interviewType
                                    ]
                                  }
                                </InterviewTag>

                                <InterviewTag>
                                  {
                                    ATMOSPHERE_LABELS[
                                      review
                                        .atmosphere
                                    ]
                                  }
                                </InterviewTag>

                                <InterviewTag>
                                  {
                                    DIFFICULTY_LABELS[
                                      review
                                        .difficulty
                                    ]
                                  }
                                </InterviewTag>

                                <InterviewTag>
                                  {
                                    DURATION_LABELS[
                                      review
                                        .duration
                                    ]
                                  }
                                </InterviewTag>
                              </div>

                              {Array.isArray(
                                review.questions
                              ) &&
                                review
                                  .questions
                                  .length >
                                  0 && (
                                  <div
                                    style={{
                                      display:
                                        'flex',
                                      flexDirection:
                                        'column',
                                      gap: '7px',
                                      marginBottom:
                                        '12px',
                                    }}
                                  >
                                    {review.questions.map(
                                      (
                                        question,
                                        index
                                      ) => (
                                        <p
                                          key={`${review.interviewReviewId}-${index}`}
                                          style={{
                                            margin:
                                              0,
                                            color:
                                              '#333333',
                                            fontSize:
                                              '14px',
                                            fontWeight:
                                              index ===
                                              0
                                                ? '700'
                                                : '500',
                                            lineHeight:
                                              '1.5',
                                          }}
                                        >
                                          Q.{' '}
                                          {
                                            question
                                          }
                                        </p>
                                      )
                                    )}
                                  </div>
                                )}

                              {review.tip && (
                                <div
                                  style={{
                                    marginTop:
                                      '10px',
                                    padding:
                                      '12px 14px',
                                    borderRadius:
                                      '10px',
                                    background:
                                      '#f8f7ff',
                                    color:
                                      '#666666',
                                    fontSize:
                                      '13px',
                                    lineHeight:
                                      '1.6',
                                  }}
                                >
                                  <strong
                                    style={{
                                      color:
                                        '#574bc4',
                                    }}
                                  >
                                    면접 팁
                                  </strong>

                                  <div
                                    style={{
                                      marginTop:
                                        '4px',
                                    }}
                                  >
                                    {
                                      review.tip
                                    }
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <p
                              style={{
                                margin: 0,
                                color:
                                  '#777777',
                                fontSize:
                                  '14px',
                              }}
                            >
                              면접이 없는
                              동아리로
                              등록했습니다.
                            </p>
                          )}

                          <div
                            style={{
                              marginTop:
                                '14px',
                              color:
                                '#aaaaaa',
                              fontSize:
                                '12px',
                            }}
                          >
                            {review.createdAt
                              ? new Date(
                                  review.createdAt
                                ).toLocaleDateString(
                                  'ko-KR'
                                )
                              : ''}
                          </div>
                        </article>
                      )
                    )}
                  </div>
                )}

              <div className="mypage-guide">
                면접 후기 삭제는
                마이페이지에서만
                관리할 수 있습니다.
              </div>

              <Pagination
                currentPage={
                  interviewPage
                }
                totalPages={
                  interviewTotalPages
                }
                onPageChange={
                  setInterviewPage
                }
              />
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default MyReviewsPage;