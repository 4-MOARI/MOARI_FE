import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import StyledButton from '../../../components/common/Button/StyledButton';
import ClubInfoSection from '../ClubDetail/ClubInfoSection'; 
import { useLocation } from 'react-router-dom';
import { createClub, uploadClubImage } from '../../../api/clubApi';

const ClubRegisterPreviewPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  
 
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

  const resolveImageUrl = async (file, fallbackUrl = '') => {
    if (file) {
      return uploadClubImage(file);
    }

    if (typeof fallbackUrl === 'string' && fallbackUrl.startsWith('blob:')) {
      return '';
    }

    return fallbackUrl || '';
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
              <ClubInfoSection club={clubData} isPreview />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
            <StyledButton 
              variant="secondary" 
              onClick={() => navigate('/club/register', { state: clubData })}
            >이전</StyledButton>
            <StyledButton
              onClick={async () => {
                try {
                  const requestBody = {
                  clubName: clubData.name,
                  categoryId: Number(clubData.categoryId),

                  schoolType:
                    clubData.schoolId === null ||
                    clubData.schoolId === 'external' ||
                    clubData.school === '외부' ||
                    clubData.schoolName === '외부'
                      ? '외부'
                      : '본인학교',

                  schoolId:
                    clubData.schoolId === null ||
                    clubData.schoolId === 'external' ||
                    clubData.school === '외부' ||
                    clubData.schoolName === '외부'
                      ? null
                      : Number(clubData.schoolId),

                  briefDescription: clubData.oneLineIntro || '',
                  description: clubData.description || '',
                  activity: clubData.activityContent || clubData.activity || '',

                  profileImageUrl: await resolveImageUrl(clubData.profileImageFile, clubData.profileImage),
                  coverImageUrl: await resolveImageUrl(clubData.coverImageFile, clubData.coverImage),

                  isRecruiting: clubData.status === '모집중' ? '모집중' : '마감',

                  recruitPeriod: {
                    start: clubData.recruitStartAt || clubData.recruitInfo?.recruitStartAt || null,
                    end: clubData.recruitEndAt || clubData.recruitInfo?.recruitEndAt || null,
                  },

                  links:
                    clubData.urlFields
                      ?.filter((field) => {
                        const url = field.url || field.urlValue;

                        return (
                          field.selectedValue &&
                          field.selectedValue !== 'URL' &&
                          field.selectedValue !== '직접입력' &&
                          url
                        );
                      })
                      .map((field) => ({
                        linkType: field.selectedValue.toLowerCase(),
                        linkUrl: field.url || field.urlValue,
                      })) || [],
                  };

                  const result = await createClub(requestBody);

                  console.log('동아리 등록 응답 전체 =', result);

                  const newClubId =
                    result?.clubId ||
                    result?.data?.clubId ||
                    result?.data?.data?.clubId;

                  console.log('이동할 newClubId =', newClubId);

                  if (!newClubId) {
                    alert('등록은 되었지만 동아리 ID를 받지 못했습니다.');
                    return;
                  }

                  navigate(`/club/${newClubId}`);
                } catch (error) {
                  console.error('동아리 등록 실패:', error);

                  const status = error.response?.status;
                  const message = error.response?.data?.error?.message;

                  alert(
                    status === 404
                      ? '이미지 업로드 API가 서버에 반영되지 않았습니다. 백엔드 develop 배포를 확인해주세요.'
                      : message || '동아리 등록에 실패했습니다.',
                  );
                }
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
