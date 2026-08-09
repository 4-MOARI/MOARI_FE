import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { getClubDetail } from '../../../api/clubApi';
import { getFavoriteStatus } from '../../../api/userApi';
import { MOCK_CLUBS } from '../../../data/clubs';

import Header from "../../../components/common/Header/Header";

import ClubInfoSection from './ClubInfoSection';
import ReviewSection from '../Review/ReviewSection';

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [club, setClub] = useState(null);

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
        const [data, favoriteData] = await Promise.all([
          getClubDetail(clubId),
          getFavoriteStatus(clubId).catch(() => null),
        ]);

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
          </div>
        </div>
      </div>
    </>
  );
}