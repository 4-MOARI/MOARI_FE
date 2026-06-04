// 동아리 수정페이지
import React, { useState, useRef, useEffect } from 'react'; // useEffect 추가
import Header from '../../../components/common/Header/Header';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import RecruitStatusSection from '../../../components/club/RecruitStatusSection/RecruitStatusSection';
import { getClubDetail } from '../../../api/clubApi';

const ClubUpdatePage = () => {
  const { clubId } = useParams(); // ★ ID 가져오기
  const navigate = useNavigate();

  const location = useLocation();
  // ★ 추가: 프리뷰페이지에서 이전 버튼으로 돌아올 때 받은 데이터
  const returnedData = location.state;

  useEffect(() => {
    if (returnedData) {
      setClubName(returnedData.clubName || returnedData.name || '');
      setOneLineIntro(returnedData.oneLineIntro || '');
      setDescription(returnedData.description || '');
      setActivity(returnedData.activity || returnedData.activityContent || '');
      setCategoryId(returnedData.categoryId || returnedData.category || '');
      setRecruitStatus(returnedData.recruitStatus || returnedData.status || '');
      setCoverImage(returnedData.coverImage || null);
      setProfileImage(returnedData.profileImage || null);

      setRecruitInfo(
        returnedData.recruitInfo || {
          isRecruiting: returnedData.status === '모집중',
          recruitStartAt: returnedData.recruitStartAt || null,
          recruitEndAt: returnedData.recruitEndAt || null,
        }
      );

      if (returnedData.urlFields && returnedData.urlFields.length > 0) {
        setUrlFields(returnedData.urlFields);
      }

      return;
    }

    const fetchClubDetailForUpdate = async () => {
      try {
        const data = await getClubDetail(clubId);

        setClubName(data.clubName || '');
        setOneLineIntro(data.briefDescription || '');
        setDescription(data.description || '');
        setActivity(data.activity || '');

        // 현재 select가 카테고리 이름 배열이므로 categoryName 사용
        setCategoryId(data.categoryName || '');

        setRecruitStatus(data.isRecruiting || '마감');

        setRecruitInfo({
          isRecruiting: data.isRecruiting === '모집중',
          recruitStartAt: data.recruitPeriod?.start || null,
          recruitEndAt: data.recruitPeriod?.end || null,
        });

        setCoverImage(data.coverImageUrl || null);
        setProfileImage(data.profileImageUrl || null);

        if (Array.isArray(data.links) && data.links.length > 0) {
          const restoredUrlFields = data.links.map((link, index) => ({
            id: Date.now() + index,
            type: 'select',
            selectedValue:
              link.type === 'homepage'
                ? 'Web'
                : link.type
                ? link.type.charAt(0).toUpperCase() + link.type.slice(1)
                : 'URL',
            urlValue: link.url || '',
          }));

          setUrlFields(restoredUrlFields);
        } else {
          setUrlFields([{ id: Date.now(), type: 'select', selectedValue: 'URL', urlValue: '' }]);
        }
      } catch (error) {
        console.error('수정 페이지 동아리 조회 실패:', error);
        alert('동아리 정보를 불러오지 못했습니다.');
      }
    };

    fetchClubDetailForUpdate();
  }, [clubId, returnedData]);


  // ★ 상태 선언 (데이터를 저장할 변수들)
  const [clubName, setClubName] = useState('');
  const [oneLineIntro, setOneLineIntro] = useState('');
  const [description, setDescription] = useState(''); // ★ 추가
  const [activity, setActivity] = useState('');       // ★ 추가
  const [categoryId, setCategoryId] = useState('');   // ★ 추가
  const [recruitStatus, setRecruitStatus] = useState(''); 
  const [recruitInfo, setRecruitInfo] = useState({
    isRecruiting: false,
    recruitStartAt: null,
    recruitEndAt: null,
  });
  const [urlFields, setUrlFields] = useState([{ id: Date.now(), type: 'select', selectedValue: 'URL' }]);
  const [isHovered, setIsHovered] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    }
  };

  const disabledStyle = {
    background: '#F9FAFB',
    color: '#9CA3AF',
    cursor: 'not-allowed',
    border: '1px solid #E5E7EB'
  };

  const handleIntroChange = (e) => {
    if (e.target.value.length <= 25) setOneLineIntro(e.target.value);
  };

  const addUrlField = () => {
    setUrlFields([...urlFields, { id: Date.now(), type: 'select', selectedValue: 'URL' }]);
  };

  const removeUrlField = (id) => {
    if (urlFields.length > 1) setUrlFields(urlFields.filter((field) => field.id !== id));
  };

  const handleTypeChange = (id, value) => {
    setUrlFields(urlFields.map(field => {
      if (field.id === id) {
        return value === '직접입력' ? { ...field, type: 'input', selectedValue: value } : { ...field, selectedValue: value };
      }
      return field;
    }));
  };

  // ★ 추가: URL 입력값을 urlFields state에 저장
  const handleUrlValueChange = (id, value) => {
    setUrlFields(
      urlFields.map((field) =>
        field.id === id ? { ...field, urlValue: value } : field
      )
    );
  };
  const categories = ["학술", "체육", "공연·예술", "봉사", "취미·친목", "창업·취업", "어학", "기타"];
  const urlOptions = ["Web", "Instagram", "Discord", "Notion", "직접입력"];

  return (
    <div style={{ width: '100%', minHeight: '1400px', background: '#F8F8FB', paddingBottom: '100px', boxSizing: 'border-box' }}>
      <Header />
      
      {/* 중앙 정렬 컨테이너 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '40px', 
        marginTop: '40px', 
        alignItems: 'flex-start',
        width: '100%' 
      }}>
        
        {/* 왼쪽 사이드바 */}
        <div style={{ 
          width: '260px', 
          background: 'white', 
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', 
          borderRadius: '24px', 
          padding: '32px', 
          boxSizing: 'border-box' 
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>등록 단계</h2>
          <div style={{ background: '#EEEDFE', padding: '10px 20px', borderRadius: '12px', color: '#534AB7', fontWeight: '700', marginBottom: '16px', boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.25)' }}>1 정보 수정</div>
          <div style={{ padding: '10px 20px', color: '#7E8490', fontWeight: '700' }}>2 확인 및 제출</div>
        </div>

        {/* 오른쪽 메인 콘텐츠 */}
        <div style={{ width: '834px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', paddingBottom: '40px' }}>
          
          <div style={{ padding: '40px', paddingBottom: '0' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#111827' }}>상세 정보 수정</h1>
            
            <div 
              onClick={() => coverInputRef.current.click()}
              style={{
                width: '763px',
                height: '170px',
                background: coverImage ? `url(${coverImage}) center/cover` : '#EEEDFE',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                marginBottom: '20px',
                cursor: 'pointer'
              }}
            >
              {!coverImage && '+ 커버 이미지 업로드'}

              {/* ★ 원래 파일 업로드 input 복구 */}
              <input
                type="file"
                ref={coverInputRef}
                hidden
                accept="image/*"
                onChange={(e) => handleFileChange(e, setCoverImage)}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
              <div 
                onClick={() => profileInputRef.current.click()}
                style={{ width: '95px', height: '87px', background: profileImage ? `url(${profileImage}) center/cover` : '#EEEDFE', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '4px 4px 2px rgba(0, 0, 0, 0.25)', cursor: 'pointer' }}
              >
                {!profileImage && '+ 프로필'}
                <input type="file" ref={profileInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, setProfileImage)} />
              </div>
              <input type="text" value={clubName} disabled style={{ ...disabledStyle, width: '627px', height: '44px', padding: '0 20px', borderRadius: '10px', border: '1px solid #D1D5DB' }} />
            </div>

            <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
              <div style={{ position: 'relative', width: '362px' }}>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: '100%', height: '44px', padding: '0 20px', borderRadius: '10px', border: '1px solid #D1D5DB', color: '#6B7280', backgroundColor: 'white', cursor: 'pointer', appearance: 'none' }}>
                  <option value="" disabled>카테고리 선택</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div style={{ position: 'absolute', right: '20px', top: '15px', color: '#6B7280', pointerEvents: 'none' }}>▼</div>
              </div>
              <div style={{ position: 'relative', width: '362px' }}>
                <select disabled style={{ ...disabledStyle, width: '100%', height: '44px', padding: '0 20px', borderRadius: '10px', border: '1px solid #D1D5DB', appearance: 'none' }}>
                  <option>성신여자대학교</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '25px' }}>
              <div style={{ position: 'relative' }}>
                <textarea value={oneLineIntro} onChange={handleIntroChange} placeholder="동아리 한 줄 소개 (25자 제한)" style={{ width: '754px', height: '40px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', resize: 'none', boxSizing: 'border-box' }} />
                <span style={{ position: 'absolute', right: '15px', bottom: '10px', fontSize: '12px', color: '#9CA3AF' }}>{oneLineIntro.length}/25</span>
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="동아리 소개" style={{ width: '754px', height: '100px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
              <textarea value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="활동내용"style={{ width: '754px', height: '150px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
              {urlFields.map((field, index) => (
                <div key={field.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {field.type === 'select' ? (
                    <div style={{ position: 'relative', width: '120px' }}>
                      <select 
                        value={field.selectedValue} 
                        onChange={(e) => handleTypeChange(field.id, e.target.value)} 
                        style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1px solid #D1D5DB', padding: '0 30px 0 10px', color: '#6B7280', cursor: 'pointer', appearance: 'none', backgroundColor: 'white' }}
                      >
                        <option value="URL" disabled>URL 타입</option>
                        {urlOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <div style={{ position: 'absolute', right: '10px', top: '15px', pointerEvents: 'none', color: '#6B7280', fontSize: '10px' }}>▼</div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="입력하세요"
                      value={field.customLabel || ''}
                      onChange={(e) =>
                        setUrlFields(
                          urlFields.map((item) =>
                            item.id === field.id
                              ? { ...item, customLabel: e.target.value }
                              : item
                          )
                        )
                      }
                      style={{ width: '120px', height: '44px', borderRadius: '10px', border: '1px solid #534AB7', padding: '0 10px' }}
                    />
                  )}
                    <input
                      type="text"
                      value={field.urlValue || ''}
                      onChange={(e) => handleUrlValueChange(field.id, e.target.value)}
                      placeholder="URL을 입력하세요"
                      style={{ width: '524px', height: '44px', padding: '0 15px', borderRadius: '10px', border: '1px solid #D1D5DB' }}
                    />
                  <button onClick={() => removeUrlField(field.id)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #D1D5DB', cursor: 'pointer', background: 'white' }}>-</button>
                  {index === urlFields.length - 1 && (
                    <button onClick={addUrlField} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #534AB7', cursor: 'pointer', background: '#534AB7', color: 'white' }}>+</button>
                  )}
                </div>
              ))}
            </div>

            {/* 모집 상태 */}
            <div style={{ marginBottom: '40px' }}>
              <RecruitStatusSection
                onChange={setRecruitInfo}
                initialValue={recruitInfo}
              />
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '40px' }}>
            <button 
              onClick={() =>
                navigate(`/club/update/${clubId}/preview`, {
                  state: {
                    clubName,
                    oneLineIntro,
                    description,
                    activity,
                    categoryId,
                    recruitStatus,

                    recruitInfo,
                      status: recruitInfo.isRecruiting ? '모집중' : '마감',
                      recruitStartAt: recruitInfo.recruitStartAt,
                      recruitEndAt: recruitInfo.recruitEndAt,

                    urlFields,
                    coverImage,
                    profileImage,

                    // ★ 추가: ClubInfoSection에서 읽을 수 있게 이름 맞춤
                    id: clubId,
                    name: clubName,
                    category: categoryId,
                    activityContent: activity,
                
                    links: urlFields.reduce((acc, field) => {
                      if (
                        field.selectedValue &&
                        field.selectedValue !== 'URL' &&
                        field.urlValue
                      ) {
                        // ★ 수정: UrlButton이 읽을 수 있게 web, instagram, discord, notion 소문자로 저장
                        acc[field.selectedValue.toLowerCase()] = field.urlValue;
                      }
                      return acc;
                    }, {}),
                  },
                })
              }
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
              style={{ 
                width: '100px', 
                height: '46px', 
                background: isHovered ? '#6A62C7' : '#534AB7', 
                color: 'white', 
                borderRadius: '10px', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: '700',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
                boxShadow: isHovered ? '0px 4px 12px rgba(83, 74, 183, 0.4)' : 'none'
              }}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubUpdatePage;