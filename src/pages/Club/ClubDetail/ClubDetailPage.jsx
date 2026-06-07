import { getClubDetail } from '../../../api/clubApi';
import { getFavoriteStatus } from '../../../api/userApi';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MOCK_CLUBS } from "../../../data/clubs"; //더미데이터
import Header from "../../../components/common/Header/Header";
import ClubInfoSection from './ClubInfoSection';
import ReviewSection from "../Review/ReviewSection";

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const location = useLocation();

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
        // ★ 1순위: API 상세 조회
        const [data, favoriteData] = await Promise.all([
          getClubDetail(clubId),
          getFavoriteStatus(clubId).catch(() => null),
        ]);

        if (!data) {
          throw new Error('API 응답 데이터 없음');
        }

        // ★ 백엔드 데이터 → 기존 ClubInfoSection용 데이터로 변환
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
            (data.schoolType === '외부' || data.schoolType === 'external' ? '외부' : ''),

          status: data.isRecruiting,
          isRecruiting: data.isRecruiting,
          recruitPeriod: data.recruitPeriod,
          recruitStartAt: data.recruitPeriod?.start,
          recruitEndAt: data.recruitPeriod?.end,
          warningMessage: data.
          warningMessage,
          displayWarning: data.displayWarning,
          favoriteCount: data.favoriteCount ?? data.likeCount ?? 0,
          isFavorite: Boolean(favoriteData?.isFavorite ?? data.isFavorite ?? data.isLiked ?? false),
          links: Array.isArray(data.links)
            ? data.links.reduce((acc, link) => {
                if (link?.type && link?.url) {
                  acc[link.type.toLowerCase()] = link.url;
                }
                return acc;
              }, {})
            : {},
        };

        setClub(formattedClub);
      } catch (error) {
        console.error('API 상세 조회 실패:', error);
        setClub(null);
      }
    };

    fetchClubDetail();
  }, [clubId, location.state]);


  if (!club) return <div>데이터를 불러오는 중입니다...</div>;

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 20px' }}>
        <div style={{ width: '760px' }}>
          <ClubInfoSection club={club}/>
        </div>
        <div>
          <ReviewSection clubId={clubId} clubName={club?.name} />
        </div>
      </div>
    </div>
  );
}
