import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { getClubDetail } from '../../../api/clubApi';
import { getFavoriteStatus } from '../../../api/userApi';
import { getInterviewReviews } from '../../../api/interviewReviewApi';
import { MOCK_CLUBS } from '../../../data/clubs';

import Header from "../../../components/common/Header/Header";

import ClubInfoSection from './ClubInfoSection';
import ReviewSection from '../Review/ReviewSection';

const DIFFICULTY_SCORES = {
  EASY: 2.0,
  NORMAL: 3.5,
  HARD: 5.0,
};

const METHOD_LABELS = {
  FACE_TO_FACE: '대면',
  OFFLINE: '대면',
  ONLINE: '비대면',
  MIXED: '혼합',
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

const maskUserName = (name = '') => {
  if (!name) return '익명';
  if (name.length <= 1) return `${name}**`;
  return `${name[0]}**`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [club, setClub] = useState(null);
  const [interviewReviews, setInterviewReviews] = useState([]);
  const [visibleInterviewReviewCount, setVisibleInterviewReviewCount] = useState(2);

  useEffect(() => {
    const getFallbackClub = () => {
      if (location.state) {
        return location.state;
      }

      const savedClub = localStorage.getItem(`club-${clubId}`);

      if (savedClub) {
        return JSON.parse(savedClub);
      }

      const foundClub = MOCK_CLUBS.find(
        (c) => String(c.id) === String(clubId)
      );

      return foundClub || null;
    };

    const fetchClubDetail = async () => {
      try {
        const data = await getClubDetail(clubId);
        const favoriteData = await getFavoriteStatus(clubId).catch(() => null);

        if (!data) {
          throw new Error('API 응답 데이터 없음');
        }


        const formattedClub = {
          id: data.clubId,
          clubId: data.clubId,

          name: data.clubName,
          clubName: data.clubName,

          oneLineIntro: data.briefDescription,
          shortDescription: data.briefDescription,

          description: data.description,
          activityContent: data.activity,
          profileImageUrl: data.profileImageUrl,
          coverImageUrl: data.coverImageUrl,

          category: data.categoryName,
          categoryName: data.categoryName,

          schoolType: data.schoolType,

          schoolName:
            data.schoolName ||
            (
              data.schoolType === '외부' ||
              data.schoolType === 'external'
                ? '외부'
                : ''
            ),

          status: data.isRecruiting,
          isRecruiting: data.isRecruiting,

          recruitPeriod: data.recruitPeriod,
          recruitStartAt: data.recruitPeriod?.start,
          recruitEndAt: data.recruitPeriod?.end,

          warningMessage: data.warningMessage,
          displayWarning: Boolean(data.displayWarning),
          yearsSinceUpdate: data.yearsSinceUpdate,
          updatedAt: data.updatedAt,

          favoriteCount: Number(data.favoriteCount || 0),

         isFavorite: Boolean(
          favoriteData?.isFavorite ??
          favoriteData?.data?.isFavorite ??
          data.isFavorite ??
          false
        ),

          links: Array.isArray(data.links)
            ? data.links.reduce((acc, link) => {
                const type =
                  link.type ||
                  link.linkType ||
                  link.title ||
                  link.linkTitle;

                const url =
                  link.url ||
                  link.linkUrl;

                if (type && url) {
                  acc[String(type).toLowerCase()] = url;
                }

                return acc;
              }, {})
            : {},
          schedules: Array.isArray(data.schedules)
            ? data.schedules
            : [],
        };

        console.log(
          '상세 GET 원본 data.links =',
          data.links
        );

        console.log(
          '상세 변환 후 formattedClub.links =',
          formattedClub.links
        );

        console.log(
          '상세 경고 원본 data =',
          {
            updatedAt: data.updatedAt,
            yearsSinceUpdate: data.yearsSinceUpdate,
            displayWarning: data.displayWarning,
            warningMessage: data.warningMessage,
          }
        );

        console.log(
          '상세 경고 변환 formattedClub =',
          {
            updatedAt: formattedClub.updatedAt,
            yearsSinceUpdate: formattedClub.yearsSinceUpdate,
            displayWarning: formattedClub.displayWarning,
            warningMessage: formattedClub.warningMessage,
          }
        );

        setClub(formattedClub);
      } catch (error) {
        console.error(
          'API 상세 조회 실패:',
          error
        );

        const fallbackClub = getFallbackClub();

        setClub(fallbackClub);
      }
    };

    fetchClubDetail();
  }, [clubId, location.state]);

  useEffect(() => {
    let ignore = false;

    const fetchInterviewReviews = async () => {
      try {
        const response = await getInterviewReviews(clubId);

        if (!ignore) {
          setInterviewReviews(response.data?.data?.reviews || []);
        }
      } catch (error) {
        if (!ignore) {
          setInterviewReviews([]);
        }
      }
    };

    fetchInterviewReviews();

    return () => {
      ignore = true;
    };
  }, [clubId]);

  if (!club) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  const handleInterviewReview = () => {
    navigate(
      `/club/${clubId}/interview-review`,
      {
        state: {
          clubName:
            club.clubName ||
            club.name,
        },
      }
    );
  };

  const handleAiInterview = () => {
    navigate(`/clubs/${clubId}/ai-interview/setup`);
  };

  const interviewDifficulty =
    interviewReviews.length > 0
      ? (
          interviewReviews.reduce(
            (sum, review) => sum + (DIFFICULTY_SCORES[review.difficulty] || 0),
            0
          ) / interviewReviews.length
        ).toFixed(1)
      : '0.0';

  const visibleInterviewReviews = interviewReviews.slice(0, visibleInterviewReviewCount);

  return (
    <>
      <Header />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '40px',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            width: '760px',
          }}
        >
          <ClubInfoSection
            club={club}
            onFavoriteChange={(isFavorite, favoriteCount) => {
              setClub((prev) => ({
                ...prev,
                isFavorite,
                favoriteCount,
              }));
            }}
          />
        </div>

        <div
          style={{
            width: '340px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <ReviewSection
            clubId={clubId}
            club={club}
          />

          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow:
                '0 4px 14px rgba(0, 0, 0, 0.12)',
            }}
          >
            <h2
              style={{
                margin: '0 0 18px',
                fontSize: '20px',
                fontWeight: '700',
              }}
            >
              면접 후기
            </h2>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  color: '#111827',
                  fontSize: '15px',
                  fontWeight: '800',
                }}
              >
                난이도
              </span>
              <strong
                style={{
                  color: '#111827',
                  fontSize: '44px',
                  fontWeight: '900',
                  lineHeight: 1,
                }}
              >
                {interviewDifficulty}
              </strong>
            </div>

            <button
              type="button"
              onClick={handleInterviewReview}
              style={{
                width: '100%',
                height: '44px',
                border: '1px solid #574bc4',
                borderRadius: '9px',
                background: '#ffffff',
                color: '#574bc4',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              + 면접 후기 작성하기
            </button>

            <button
              type="button"
              onClick={handleAiInterview}
              style={{
                width: '100%',
                height: '44px',
                marginTop: '10px',
                border: 'none',
                borderRadius: '9px',
                background: '#574bc4',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              AI 모의면접 시작하기
            </button>

            {visibleInterviewReviews.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxHeight: '300px',
                  marginTop: '12px',
                  paddingRight: '4px',
                  overflowY: 'auto',
                }}
              >
                {visibleInterviewReviews.map((review) => (
                  <div
                    key={review.interviewReviewId}
                    style={{
                      padding: '14px 16px',
                      border: '1px solid #dedee8',
                      borderRadius: '14px',
                      background: '#ffffff',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <strong
                        style={{
                          color: '#111827',
                          fontSize: '14px',
                          fontWeight: '800',
                        }}
                      >
                        {maskUserName(review.userName)}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '10px',
                      }}
                    >
                      {[
                        METHOD_LABELS[review.interviewMethod],
                        ATMOSPHERE_LABELS[review.atmosphere],
                        DIFFICULTY_LABELS[review.difficulty],
                      ]
                        .filter(Boolean)
                        .map((label) => (
                          <span
                            key={label}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '999px',
                              background: '#f0edff',
                              color: '#574bc4',
                              fontSize: '11px',
                              fontWeight: '800',
                            }}
                          >
                            {label}
                          </span>
                        ))}
                    </div>

                    {review.questions?.[0] && (
                      <p
                        style={{
                          margin: '0 0 6px',
                          color: '#111827',
                          fontSize: '13px',
                          fontWeight: '800',
                          lineHeight: 1.45,
                        }}
                      >
                        Q. {review.questions[0]}
                      </p>
                    )}

                    <p
                      style={{
                        display: '-webkit-box',
                        margin: '0 0 8px',
                        overflow: 'hidden',
                        color: '#6b7280',
                        fontSize: '13px',
                        lineHeight: 1.45,
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 4,
                      }}
                    >
                      {review.tip || review.questions?.slice(1).join(' / ') || '등록된 면접 팁은 없습니다.'}
                    </p>
                    <span
                      style={{
                        color: '#9ca3af',
                        fontSize: '12px',
                      }}
                    >
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {interviewReviews.length > visibleInterviewReviewCount && (
              <button
                type="button"
                onClick={() =>
                  setVisibleInterviewReviewCount((count) =>
                    Math.min(count + 3, interviewReviews.length)
                  )
                }
                style={{
                  width: '80%',
                  height: '38px',
                  margin: '16px auto 0',
                  display: 'block',
                  border: 'none',
                  borderRadius: '999px',
                  background: '#f0edff',
                  boxShadow: '0 3px 7px rgba(31, 24, 80, 0.18)',
                  color: '#574bc4',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                후기 더보기 ▼ (총 {interviewReviews.length}개)
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
