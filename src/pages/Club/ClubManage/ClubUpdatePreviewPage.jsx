import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // useLocation 추가
import Header from '../../../components/common/Header/Header';
import StyledButton from '../../../components/common/Button/StyledButton';
// 상세 페이지의 UI를 재사용하기 위해 import 합니다.
import ClubInfoSection from '../ClubDetail/ClubInfoSection'; 
import { MOCK_CLUBS } from "../../../data/clubs"; // 데이터 import
import { updateClub, uploadClubImage } from '../../../api/clubApi';

const ClubUpdatePreviewPage = () => {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const { state } = useLocation(); // 1. 수정 페이지에서 보낸 데이터 받기

  // ★ 수정: state가 있으면 state 사용, 없으면 MOCK 데이터 사용
  const rawClubData = state || MOCK_CLUBS.find(c => String(c.id) === String(clubId));

 
    // ★ 추가: urlFields를 ClubInfoSection이 읽는 links 객체로 변환
    const linksFromUrlFields = Array.isArray(rawClubData?.urlFields)
      ? rawClubData.urlFields.reduce((acc, field) => {
          if (field?.selectedValue && field?.urlValue) {
            acc[field.selectedValue.toLowerCase()] = field.urlValue;
          }
          return acc;
        }, {})
      : {};

    // ★ 수정: ClubInfoSection에 넘길 최종 데이터
    const clubData = {
      ...rawClubData,
      name: rawClubData?.name || rawClubData?.clubName || '',
      category: rawClubData?.category || rawClubData?.categoryId || '',
      activityContent: rawClubData?.activityContent || rawClubData?.activity || '',


      schoolType: rawClubData?.schoolType || '본인학교',
      schoolName:
        rawClubData?.schoolName ||
        rawClubData?.school ||
        (rawClubData?.schoolType === '외부' ? '외부' : '성신여자대학교'),

        
      links: Object.keys(linksFromUrlFields).length > 0
        ? linksFromUrlFields
        : rawClubData?.links || {},
    };

  const resolveImageUrl = async (file, fallbackUrl = null) => {
    if (file) {
      return uploadClubImage(file);
    }

    if (typeof fallbackUrl === 'string' && fallbackUrl.startsWith('blob:')) {
      return null;
    }

    return fallbackUrl || null;
  };

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
              <ClubInfoSection club={clubData} isPreview />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
            <StyledButton
              variant="secondary"
              // ★ 수정: 이전 버튼 클릭 시 수정페이지로 이동하면서 현재 프리뷰 데이터를 다시 전달
              onClick={() =>
                navigate(`/club/update/${clubId}`, {
                  state: clubData,
                })
              }
            >
              이전
            </StyledButton>
            {/* 수정 완료 시 해당 동아리의 상세 페이지로 이동 (clubId 사용) */}
            <StyledButton
              onClick={async () => {
              const categoryNameToId = {
                '학술': 1,
                '체육': 2,
                '공연·예술': 3,
                '봉사': 4,
                '취미·친목': 5,
                '창업·취업': 6,
                '어학': 7,
                '기타': 8,
              };
              const resolvedCategoryId =
                Number(clubData.categoryId) ||
                categoryNameToId[clubData.category] ||
                categoryNameToId[clubData.categoryId];

              const formatDateTimeForMySQL = (value) => {
                if (!value) return null;

                const date = value instanceof Date ? value : new Date(value);

                if (Number.isNaN(date.getTime())) return null;

                return date
                  .toISOString()
                  .replace('T', ' ')
                  .replace('.000Z', '')
                  .slice(0, 19);
              };

              const requestBody = {
                categoryId: resolvedCategoryId,
                briefDescription: clubData.oneLineIntro || clubData.briefDescription || null,
                description: clubData.description || null,
                activity: clubData.activityContent || clubData.activity || null,

                profileImageUrl: await resolveImageUrl(
                  clubData.profileImageFile,
                  clubData.profileImage || clubData.profileImageUrl
                ),
                coverImageUrl: await resolveImageUrl(
                  clubData.coverImageFile,
                  clubData.coverImage || clubData.coverImageUrl
                ),
                lastModifiedBy: 'test01',
                
                isRecruiting:
                  clubData.recruitInfo?.isRecruiting || clubData.status === '모집중'
                    ? '모집중'
                    : '마감',
                    
              recruitPeriod: {
                start: formatDateTimeForMySQL(
                  clubData.recruitInfo?.recruitStartAt ||
                  clubData.recruitStartAt
                ),
                end: formatDateTimeForMySQL(
                  clubData.recruitInfo?.recruitEndAt ||
                  clubData.recruitEndAt
                ),
              },
                links:
                  clubData.urlFields
                    ?.filter((field) => {
                      const url = field.urlValue || field.url;

                      return (
                        field.selectedValue &&
                        field.selectedValue !== 'URL' &&
                        url
                      );
                    })
                    .map((field) => {
                      const selectedValue = field.selectedValue;
                      const isCustom = selectedValue === '직접입력';

                      return {
                        linkType: isCustom ? '직접입력' : selectedValue,
                        linkTitle: isCustom
                          ? field.customLabel || 'Link'
                          : selectedValue,
                        linkUrl: field.urlValue || field.url,
                      };
                    }) || [],
              };

                try {
                  console.log('수정 요청 body:', requestBody);

                  const result = await updateClub(clubId, requestBody);

                  console.log('수정 성공 응답:', result);

                  navigate(`/club/${clubId}`, { replace: true });
                } catch (error) {
                  console.error('동아리 수정 실패:', error);
                  console.error('응답:', error.response?.data);
                  alert(error.response?.data?.error?.message || '동아리 수정에 실패했습니다.');
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

export default ClubUpdatePreviewPage;
