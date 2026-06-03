import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // ★ 이 줄을 반드시 추가하세요!
import CategoryBadge from "../../../components/common/Badge/CategoryBadge/CategoryBadge";
import RecruitStatusBadge from "../../../components/common/Badge/RecruitStatusBadge/RecruitStatusBadge";
import UrlButton from "../../../components/common/Button/UrlButton/UrlButton";
import ReportSection from '../Report/ReportSection';

const ClubInfoSection = ({ club }) => {
  // useParams를 호출하기 전에 컴포넌트 내부에서 안전하게 사용합니다.
  const params = useParams();
  const clubId = params?.clubId;

  // club 데이터가 없으면 MOCK_CLUBS에서 찾고, 그것도 없으면 빈 객체를 반환합니다.
  const displayClub = club || (clubId ? MOCK_CLUBS.find(c => String(c.id) === String(clubId)) : {}) || {};

  const [isLiked, setIsLiked] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const statusToDisplay = displayClub.status || "마감";

  return (
    <div style={{ width: '760px', position: 'relative', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', padding: '32px', boxSizing: 'border-box', margin: '0 auto' }}>
      
      {/* 1. 커버 이미지 */}
      <div onClick={() => setModalImage('커버 이미지')} style={{ width: '696px', height: '170px', background: '#EEEDFE', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#534AB7', fontWeight: '700', cursor: 'pointer' }}>커버 이미지</div>
      
      {/* 2. 헤더 정보 */}
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div onClick={() => setModalImage('프로필 사진')} style={{ width: '87px', height: '87px', background: '#EEEDFE', borderRadius: '14px', boxShadow: '4px 4px 2px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#534AB7', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>프로필</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '700', margin: 0 }}>{displayClub.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CategoryBadge>{displayClub.category}</CategoryBadge>
              <RecruitStatusBadge status={statusToDisplay} />
              <span style={{ color: '#6B7280', fontSize: '13px' }}>{displayClub.schoolName || '외부'} · 찜 {displayClub.likeCount || 0}명</span>
              <button style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.5)', fontSize: '10px', cursor: 'pointer', textDecoration: 'underline' }}>[수정 로그]</button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 찜/수정 버튼 */}
      <div style={{ position: 'absolute', top: '223px', right: '32px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setIsLiked(!isLiked)} style={{ padding: '10px 20px', border: '1px solid #D4537E', borderRadius: '10px', color: isLiked ? 'white' : '#D4537E', background: isLiked ? '#D4537E' : 'white', fontWeight: '700', cursor: 'pointer', transition: '0.2s' }}>{isLiked ? '♥ 찜하기' : '♡ 찜하기'}</button>
        <button style={{ padding: '10px 20px', background: '#534AB7', borderRadius: '10px', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>수정하기</button>
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
      <div style={{ marginTop: '40px' }}>
        <ReportSection clubId={club?.id} />
      </div>
      
    </div>
  );
};

export default ClubInfoSection;