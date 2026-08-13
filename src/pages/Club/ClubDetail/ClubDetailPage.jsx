import React, { useEffect, useState } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { getClubDetail } from '../../../api/clubApi';
import { getFavoriteStatus } from '../../../api/userApi';
import {
  getInterviewReviews,
} from '../../../api/interviewReviewApi';

import { MOCK_CLUBS } from '../../../data/clubs';

import Header from '../../../components/common/Header/Header';
import ClubInfoSection from './ClubInfoSection';
import ReviewSection from '../Review/ReviewSection';

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [club, setClub] = useState(null);
  const [interviewReviews, setInterviewReviews] = useState([]);

  useEffect(() => {
    const getFallbackClub = () => {
      if (location.state) {
        return location.state;
      }

      const savedClub = localStorage.getItem(
        `club-${clubId}`
      );

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
        const [data, favoriteData] =
          await Promise.all([
            getClubDetail(clubId),
            getFavoriteStatus(clubId).catch(
              () => null
            ),
          ]);

        if (!data) {
          throw new Error(
            'API 응답 데이터 없음'
          );
        }

        const formattedClub = {
          id: data.clubId,
          clubId: data.clubId,

          name: data.clubName,
          clubName: data.clubName,

          oneLineIntro:
            data.briefDescription,
          shortDescription:
            data.briefDescription,

          description: data.description,
          activityContent: data.activity,

          profileImageUrl:
            data.profileImageUrl,
          coverImageUrl:
            data.coverImageUrl,

          category: data.categoryName,
          categoryName:
            data.categoryName,

          schoolType: data.schoolType,

          schoolName:
            data.schoolName ||
            (
              data.schoolType === '외부' ||
              data.schoolType ===
                'external'
                ? '외부'
                : ''
            ),

          status: data.isRecruiting,
          isRecruiting:
            data.isRecruiting,

          recruitPeriod:
            data.recruitPeriod,

          recruitStartAt:
            data.recruitPeriod?.start,

          recruitEndAt:
            data.recruitPeriod?.end,

          warningMessage:
            data.warningMessage,

          displayWarning: Boolean(
            data.displayWarning
          ),

          yearsSinceUpdate:
            data.yearsSinceUpdate,

          updatedAt: data.updatedAt,

          favoriteCount:
            data.favoriteCount ??
            data.likeCount ??
            0,

          isFavorite: Boolean(
            favoriteData?.isFavorite ??
            data.isFavorite ??
            data.isLiked ??
            false
          ),

          links: Array.isArray(data.links)
            ? data.links.reduce(
                (acc, link) => {
                  const type =
                    link.type ||
                    link.linkType ||
                    link.title ||
                    link.linkTitle;

                  const url =
                    link.url ||
                    link.linkUrl;

                  if (type && url) {
                    acc[
                      String(
                        type
                      ).toLowerCase()
                    ] = url;
                  }

                  return acc;
                },
                {}
              )
            : {},
        };

        setClub(formattedClub);
      } catch (error) {
        console.error(
          'API 상세 조회 실패:',
          error
        );

        const fallbackClub =
          getFallbackClub();

        setClub(fallbackClub);
      }
    };

    const fetchInterviewReviews = async () => {
      try {
        const response =
          await getInterviewReviews(clubId);

        console.log(
          '면접 후기 전체 응답:',
          response
        );

        console.log(
          '면접 후기 데이터:',
          response?.data
        );

        console.log(
          '면접 후기 reviews:',
          response?.data?.data?.reviews
        );

        const reviews =
          response?.data?.data?.reviews ||
          [];

        setInterviewReviews(reviews);
      } catch (error) {
        console.error(
          '면접 후기 조회 실패:',
          error
        );

        setInterviewReviews([]);
      }
    };

    fetchClubDetail();
    fetchInterviewReviews();
  }, [clubId, location.state]);

  if (!club) {
    return (
      <div>
        데이터를 불러오는 중입니다...
      </div>
    );
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
    navigate(
      `/club/${clubId}/ai-interview`,
      {
        state: {
          clubName:
            club.clubName ||
            club.name,
        },
      }
    );
  };

  const difficultyLabel = {
    EASY: '쉬움',
    NORMAL: '보통',
    HARD: '어려움',
  };

  const atmosphereLabel = {
    COMFORTABLE: '편안했어요',
    NORMAL: '보통이었어요',
    PRESSURE: '압박 면접이었어요',
  };

  const durationLabel = {
    UNDER_10: '10분 이하',
    MIN_10_20: '10~20분',
    MIN_20_30: '20~30분',
    OVER_30: '30분 이상',
  };

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
          <ClubInfoSection club={club} />
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

            <button
              type="button"
              onClick={
                handleInterviewReview
              }
              style={{
                width: '100%',
                height: '44px',
                border:
                  '1px solid #574bc4',
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
              onClick={
                handleAiInterview
              }
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

            {interviewReviews.length >
              0 && (
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  flexDirection:
                    'column',
                  gap: '10px',
                }}
              >
                {interviewReviews
                  .slice(0, 2)
                  .map((review) => (
                    <div
                      key={
                        review.interviewReviewId
                      }
                      style={{
                        border:
                          '1px solid #dddddd',
                        borderRadius:
                          '14px',
                        padding: '14px',
                        background:
                          '#ffffff',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'center',
                          marginBottom:
                            '8px',
                        }}
                      >
                        <strong
                          style={{
                            fontSize:
                              '14px',
                          }}
                        >
                          {review.userName ||
                            '면접 후기'}
                        </strong>

                        {review.difficulty && (
                          <span
                            style={{
                              fontSize:
                                '12px',
                              fontWeight:
                                '700',
                              color:
                                '#574bc4',
                              background:
                                '#f1efff',
                              padding:
                                '4px 8px',
                              borderRadius:
                                '12px',
                            }}
                          >
                            {
                              difficultyLabel[
                                review
                                  .difficulty
                              ]
                            }
                          </span>
                        )}
                      </div>

                      {review.atmosphere && (
                        <div
                          style={{
                            fontSize:
                              '12px',
                            color:
                              '#666666',
                            marginBottom:
                              '6px',
                          }}
                        >
                          분위기:{' '}
                          {atmosphereLabel[
                            review
                              .atmosphere
                          ] ||
                            review.atmosphere}
                        </div>
                      )}

                      {review.duration && (
                        <div
                          style={{
                            fontSize:
                              '12px',
                            color:
                              '#666666',
                            marginBottom:
                              '8px',
                          }}
                        >
                          면접 시간:{' '}
                          {durationLabel[
                            review.duration
                          ] ||
                            review.duration}
                        </div>
                      )}

                      {Array.isArray(
                        review.questions
                      ) &&
                        review.questions
                          .length >
                          0 && (
                          <div
                            style={{
                              fontSize:
                                '13px',
                              color:
                                '#4f5563',
                              lineHeight:
                                '1.5',
                            }}
                          >
                            Q.{' '}
                            {
                              review
                                .questions[0]
                            }
                          </div>
                        )}

                      {review.tip && (
                        <div
                          style={{
                            marginTop:
                              '8px',
                            fontSize:
                              '12px',
                            color:
                              '#777777',
                            lineHeight:
                              '1.5',
                          }}
                        >
                          팁. {review.tip}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {interviewReviews.length ===
              0 && (
              <div
                style={{
                  marginTop: '16px',
                  textAlign: 'center',
                  color: '#999999',
                  fontSize: '13px',
                  padding: '8px 0',
                }}
              >
                아직 등록된 면접 후기가
                없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}