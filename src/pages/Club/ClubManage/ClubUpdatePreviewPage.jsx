import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import StyledButton from '../../../components/common/Button/StyledButton';
// 상세 페이지의 UI를 재사용하기 위해 import 합니다.
import ClubInfoSection from '../ClubDetail/ClubInfoSection'; 

const ClubUpdatePreviewPage = () => {
  const navigate = useNavigate();
  const { clubId } = useParams();

  return (
    <div style={{ width: '100%', minHeight: '1400px', background: '#F8F8FB', paddingBottom: '100px', boxSizing: 'border-box' }}>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', alignItems: 'flex-start', width: '100%' }}>
        
        {/* 1. 왼쪽 사이드바 */}
        <div style={{ width: '260px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', padding: '32px', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>수정 단계</h2>
          <div style={{ padding: '10px 20px', color: '#7E8490', fontWeight: '700', marginBottom: '16px' }}>1 정보 작성</div>
          <div style={{ background: '#EEEDFE', padding: '10px 20px', borderRadius: '12px', color: '#534AB7', fontWeight: '700', boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.25)' }}>2 확인 및 제출</div>
        </div>

        {/* 2. 오른쪽 메인 미리보기 영역 */}
        <div style={{ width: '834px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', paddingBottom: '40px' }}>
          <div style={{ padding: '40px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#111827' }}>정보 확인</h1>
            
            {/* 실제 상세페이지 UI를 호출 */}
            <div style={{ width: '100%' }}>
              <ClubInfoSection />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
            <StyledButton variant="secondary" onClick={() => navigate(-1)}>이전</StyledButton>
            {/* 수정 완료 시 해당 동아리의 상세 페이지로 이동 (clubId 사용) */}
            <StyledButton onClick={() => navigate(`/club/${clubId}`)}>제출</StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubUpdatePreviewPage;