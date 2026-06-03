import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import StyledButton from '../../../components/common/Button/StyledButton';
// 기존 상세 페이지에서 사용하던 컴포넌트를 import 합니다.
import ClubInfoSection from '../ClubDetail/ClubInfoSection'; 
import { useLocation } from 'react-router-dom'; // 1. import 추가

const ClubRegisterPreviewPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // 2. 전달받은 state 받기
  
  // ★ 수정: 등록페이지에서 넘어온 URL 데이터를 UrlButton이 읽는 형태로 변환
  const linksFromUrlFields = Array.isArray(state?.urlFields)
    ? state.urlFields.reduce((acc, field) => {
        const url = field?.urlValue || field?.url;

        if (
          field?.selectedValue &&
          field.selectedValue !== 'URL' &&
          field.selectedValue !== '직접입력' &&
          url
        ) {
          acc[field.selectedValue.toLowerCase()] = url;
        }

        return acc;
      }, {})
    : {};

  // ★ 수정: ClubInfoSection에 넘길 최종 데이터
  const clubData = {
    ...state,
    name: state?.name || state?.clubName || '',
    category: state?.category || state?.categoryId || '',
    schoolName: state?.school || state?.schoolName || '외부',
    description: state?.description || '',
    activityContent: state?.activityContent || state?.activity || '',
    oneLineIntro: state?.oneLineIntro || state?.shortDescription || '',
    links: Object.keys(linksFromUrlFields).length > 0
      ? linksFromUrlFields
      : state?.links || {},
  };

  return (
    <div style={{ width: '100%', minHeight: '1400px', background: '#F8F8FB', paddingBottom: '100px', boxSizing: 'border-box' }}>
      <Header />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', alignItems: 'flex-start' }}>
        
        {/* 1. 왼쪽 사이드바 */}
        <div style={{ width: '260px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', padding: '32px', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>등록 단계</h2>
          <div style={{ padding: '10px 20px', color: '#7E8490', fontWeight: '700', marginBottom: '16px' }}>1 정보 작성</div>
          <div style={{ background: '#EEEDFE', padding: '10px 20px', borderRadius: '12px', color: '#534AB7', fontWeight: '700', boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.25)' }}>2 확인 및 제출</div>
        </div>

        {/* 2. 오른쪽 메인 미리보기 영역 */}
        <div style={{ width: '834px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', paddingBottom: '40px' }}>
          <div style={{ padding: '40px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#111827' }}>정보 확인</h1>

            {/* 상세페이지 미리보기 컴포넌트 호출 */}
            {/* ClubInfoSection이 props를 필요로 하지 않는다면 그대로 쓰시고, 만약 데이터를 요구한다면 data={...} 처럼 넘겨주어야 합니다. */}
            <div style={{ width: '100%' }}>
              <ClubInfoSection club={clubData} />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
            <StyledButton 
              variant="secondary" 
              onClick={() => navigate('/club/register', { state: clubData })} // 데이터 그대로 들고 이동
            >이전</StyledButton>
            <StyledButton
              onClick={() => {
                const newClubId = clubData.id || Date.now();

                const savedClubData = {
                  ...clubData,
                  id: newClubId,
                };

                // ★ 추가: 등록한 동아리 데이터를 localStorage에 저장
                localStorage.setItem(`club-${newClubId}`, JSON.stringify(savedClubData));

                // ★ 추가: 상세페이지로 이동하면서 등록 데이터 전달
                navigate(`/club/${newClubId}`, {
                  state: savedClubData,
                });
              }}
            >
              제출
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubRegisterPreviewPage;