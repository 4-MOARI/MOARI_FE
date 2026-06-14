import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import CategoryBadge from "../../../components/common/Badge/CategoryBadge/CategoryBadge";
import RecruitStatusBadge from "../../../components/common/Badge/RecruitStatusBadge/RecruitStatusBadge";
import UrlButton from "../../../components/common/Button/UrlButton/UrlButton";
import ReportSection from '../Report/ReportSection';
import { MOCK_CLUBS } from "../../../data/clubs";
import { addFavoriteClub, deleteFavoriteClub } from '../../../api/userApi';


const ClubInfoSection = ({ club, isPreview = false }) => {

  const params = useParams();
  const clubId = params?.clubId;
  const displayClub = club || (clubId ? MOCK_CLUBS.find(c => String(c.id) === String(clubId)) : {}) || {};

  const navigate = useNavigate();
  
  const [isLiked, setIsLiked] = useState(Boolean(displayClub.isFavorite));
  const [favoriteCount, setFavoriteCount] = useState(Number(displayClub.favoriteCount || displayClub.likeCount || 0));
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const recruitStartDate =
    displayClub.recruitStartAt || displayClub.recruitPeriod?.start;

  const recruitEndDate =
    displayClub.recruitEndAt || displayClub.recruitPeriod?.end;

  const getRecruitStatusByDate = (startDate, endDate) => {
    if (!startDate || !endDate) return '마감';

    const now = new Date();

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (now >= start && now <= end) {
      return '모집중';
    }

    return '마감';
  };

  const statusToDisplay = getRecruitStatusByDate(
    recruitStartDate,
    recruitEndDate
  );

  const [failedCoverImageUrl, setFailedCoverImageUrl] = useState('');
  const [failedProfileImageUrl, setFailedProfileImageUrl] = useState('');
  const coverImageUrl = displayClub.coverImageUrl || displayClub.coverImage;
  const profileImageUrl = displayClub.profileImageUrl || displayClub.profileImage;

  const schoolToDisplay =
    displayClub.schoolName ||
    (displayClub.schoolType === '외부' || displayClub.schoolType === 'external'
      ? '외부'
      : '소속 학교');
      
  const formatDate = (date) => {
    if (!date) return "미정";

    if (Array.isArray(date)) {
      const [year, month, day] = date;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    if (typeof date === "string") {
      return date.slice(0, 10);
    }

    return "미정";
  };

  useEffect(() => {
    setIsLiked(Boolean(displayClub.isFavorite));
    setFavoriteCount(Number(displayClub.favoriteCount || displayClub.likeCount || 0));
  }, [displayClub.isFavorite, displayClub.favoriteCount, displayClub.likeCount]);

  const handleFavoriteToggle = async () => {
    if (!clubId) {
      alert('동아리 정보를 확인할 수 없어 찜 처리에 실패했습니다.');
      return;
    }

    const nextIsLiked = !isLiked;
    const favoriteDelta = nextIsLiked ? 1 : -1;

    setIsFavoriteLoading(true);
    setIsLiked(nextIsLiked);
    setFavoriteCount((prevCount) => Math.max(Number(prevCount || 0) + favoriteDelta, 0));

    try {
      if (nextIsLiked) {
        await addFavoriteClub(clubId);
      } else {
        await deleteFavoriteClub(clubId);
      }
    } catch (error) {
      const errorCode = error.response?.data?.error?.code || '';

      if (
        (nextIsLiked && errorCode === 'FAVORITE_ALREADY_EXISTS') ||
        (!nextIsLiked && errorCode === 'FAVORITE_NOT_FOUND')
      ) {
        return;
      }

      setIsLiked(!nextIsLiked);
      setFavoriteCount((prevCount) => Math.max(Number(prevCount || 0) - favoriteDelta, 0));
      alert(error.response?.data?.error?.message || '찜 처리에 실패했습니다.');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <div style={{ width: '760px', position: 'relative', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', padding: '32px', boxSizing: 'border-box', margin: '0 auto' }}>
      
      {/* 1. 커버 이미지 */}
      <div onClick={() => setModalImage(coverImageUrl)} style={{ width: '696px', height: '170px', background: '#EEEDFE', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#534AB7', fontWeight: '700', cursor: 'pointer', overflow: 'hidden' }}>
        {coverImageUrl && failedCoverImageUrl !== coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={`${displayClub.name || displayClub.clubName} 커버 이미지`}
            onError={() => setFailedCoverImageUrl(coverImageUrl)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          '커버 이미지'
        )}
      </div>
      
      {/* 2. 헤더 정보 */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div onClick={() => setModalImage(profileImageUrl)} style={{ width: '87px', height: '87px', background: '#EEEDFE', borderRadius: '14px', boxShadow: '4px 4px 2px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#534AB7', fontWeight: '700', fontSize: '12px', cursor: 'pointer', overflow: 'hidden' }}>
            {profileImageUrl && failedProfileImageUrl !== profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={`${displayClub.name || displayClub.clubName} 프로필 이미지`}
                onError={() => setFailedProfileImageUrl(profileImageUrl)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              '프로필'
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '700', margin: 0 }}>{displayClub.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CategoryBadge>{displayClub.category}</CategoryBadge>

              <RecruitStatusBadge status={statusToDisplay} />

              {recruitStartDate && recruitEndDate && (
                <span
                  style={{
                    color: '#534AB7',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  {formatDate(recruitStartDate)} ~ {formatDate(recruitEndDate)}
                </span>
              )}

              <span style={{ color: '#6B7280', fontSize: '13px' }}>
                {schoolToDisplay} · 찜 {favoriteCount}명
              </span>

              <button
                onClick={
                  isPreview
                    ? undefined
                    : () => navigate(`/clubs/${displayClub.clubId || displayClub.id || clubId}/history`)
                }
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(0,0,0,0.5)',
                  fontSize: '10px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                [수정 로그]
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* 3. 찜/수정 버튼 */}
      <div style={{ position: 'absolute', top: '223px', right: '32px', display: 'flex', gap: '10px' }}>
        <button
          onClick={isPreview ? undefined : handleFavoriteToggle} disabled={isFavoriteLoading} style={{ padding: '10px 20px', border: '1px solid #D4537E', borderRadius: '10px', color: isLiked ? 'white' : '#D4537E', background: isLiked ? '#D4537E' : 'white', fontWeight: '700', cursor: isFavoriteLoading ? 'default' : 'pointer', transition: '0.2s', opacity: isFavoriteLoading ? 0.6 : 1 }}>{isLiked ? '♥ 찜하기' : '♡ 찜하기'}</button>
        <button 
            onClick={isPreview ? undefined : () => navigate(`/club/update/${clubId}`)} 
            style={{ padding: '10px 20px', background: '#534AB7', borderRadius: '10px', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}
          >
            수정하기
          </button>
      </div>

      {/* 4. 상세 내용 */}
      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>동아리 한 줄 소개</h3>
          {/* shortDescription 대신 oneLineIntro로 변경 */}
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
            {displayClub.oneLineIntro || displayClub.shortDescription}
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>동아리 소개</h3>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{displayClub.description}</p>
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>활동 내용</h3>
          <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap' }}>{displayClub.activityContent}</p>
        </div>
      
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>외부 링크</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* displayClub.links가 존재하고, 실제로 객체 타입인 경우에만 렌더링합니다 */}
            {displayClub.links && typeof displayClub.links === 'object' && Object.entries(displayClub.links).map(([key, url], index) => {
              if (!url) return null;
              return <UrlButton key={index} type={key} url={url} />;
            })}
          </div>
        </div>
      </div>

      {/* 5. 신고 수정해주세요! */}
      {/* <div style={{ marginTop: '40px', background: '#FCEBEB', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#A32D2D', fontSize: '13px', fontWeight: '700' }}>신고 3회 누적 동아리입니다. 정보 확인 후 이용하세요.</span>
        <button style={{ padding: '8px 16px', background: '#D45353', color: 'white', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>신고</button>
      </div> */}
      {displayClub.displayWarning && displayClub.warningMessage && (
        <div
          style={{
            marginTop: '40px',
            background: '#FFF4E5',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #FFD591',
          }}
        >
          <span
            style={{
              color: '#9A5B00',
              fontSize: '13px',
              fontWeight: '700',
              lineHeight: '1.5',
            }}
          >
            {displayClub.warningMessage}
          </span>
        </div>
      )}

      <div style={{ marginTop: displayClub.displayWarning ? '16px' : '40px' }}>
        {!isPreview && (
          <ReportSection clubId={displayClub.id || displayClub.clubId || clubId} />
        )}
      </div>
    </div>
  );
};

export default ClubInfoSection;
