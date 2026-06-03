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
              <ClubInfoSection 
                club={{
                  // 1. 기존 데이터 전달
                  ...state,
                  
                  // 2. 컴포넌트가 사용하는 이름과 데이터 구조를 강제로 맞춤 (안전하게!)
                  name: state?.name || '',
                  category: state?.category || '',
                  schoolName: state?.school || '외부',
                  description: state?.description || '',
                  activityContent: state?.activity || '',
                  oneLineIntro: state?.oneLineIntro || '',
                  
                  // 3. 링크 데이터 안전하게 객체로 변환 (reduce 사용 시 에러 방지)
                  links: Array.isArray(state?.links) 
                    ? state.links.reduce((acc, field) => {
                        if (field?.selectedValue && field?.url) {
                          acc[field.selectedValue] = field.url;
                        }
                        return acc;
                      }, {}) 
                    : {}
                }} 
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
            <StyledButton 
              variant="secondary" 
              onClick={() => navigate('/club/register', { state: state })} // 데이터 그대로 들고 이동
            >이전</StyledButton>
            <StyledButton onClick={() => navigate('/club/1')}>제출</StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubRegisterPreviewPage;