import React, { useState, useRef, useEffect } from 'react';
import { getCategories } from '../../../api/clubApi';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import RecruitStatusSection from '../../../components/club/RecruitStatusSection/RecruitStatusSection';
import { crawlClub } from '../../../api/clubApi'; // 크롤링테스트


import StyledButton from '../../../components/common/Button/StyledButton'; // 버튼 컴포넌트

const ClubRegisterPage = () => {
  const navigate = useNavigate(); // 페이지 이동용

  // submit용 state
  const { state } = useLocation(); 

  const [categories, setCategories] = useState([
    { categoryId: 1, categoryName: "학술" },
    { categoryId: 2, categoryName: "체육" },
    { categoryId: 3, categoryName: "공연·예술" },
    { categoryId: 4, categoryName: "봉사" },
    { categoryId: 5, categoryName: "취미·친목" },
    { categoryId: 6, categoryName: "창업·취업" },
    { categoryId: 7, categoryName: "어학" },
    { categoryId: 8, categoryName: "기타" },
  ]);

  const [oneLineIntro, setOneLineIntro] = useState(
    state?.oneLineIntro || state?.shortDescription || ''
  );
  const [isHovered, setIsHovered] = useState(false);
  


  // 🔥 아예 처음 진입할 때(state가 없을 때)의 초기값 설정
  const [urlFields, setUrlFields] = useState(
    state?.urlFields ||
    (state?.links && typeof state.links === 'object'
      ? Object.entries(state.links).map(([key, url], index) => ({
          id: Date.now() + index,
          type: 'select',
          selectedValue: key.charAt(0).toUpperCase() + key.slice(1),
          url,
        }))
      : [{ id: Date.now(), type: 'select', selectedValue: 'URL', url: '' }])
  );
  const [recruitInfo, setRecruitInfo] = useState(state?.recruitInfo || {
      isRecruiting: false,
      recruitStartAt: null,
      recruitEndAt: null,
  });

  const [clubName, setClubName] = useState(state?.name || '');
  const [categoryId, setCategoryId] = useState(
    state?.categoryId || ''
  );
  const [schoolId, setSchoolId] = useState(state?.school || ''); // 수정됨
  const [description, setDescription] = useState(state?.description || ''); // 수정됨
  const [activity, setActivity] = useState(state?.activity || ''); // 수정됨
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

  const handleIntroChange = (e) => {
    if (e.target.value.length <= 30) setOneLineIntro(e.target.value);
  };

  const addUrlField = () => {
    setUrlFields([...urlFields, { id: Date.now(), type: 'select', selectedValue: 'URL', url:'' }]);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (error) {
        console.warn('카테고리 조회 실패 → 기본 카테고리 사용:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleNext = () => {
    if (!clubName || !categoryId || !schoolId) {
      alert("동아리명, 카테고리, 소속 학교는 필수 입력 사항입니다.");
      return;
    }
    navigate('/club/register/preview', { 
      state: { 
        name: clubName,            // 수정: 전달하는 키값 name
        category: categories.find((cat) => String(cat.categoryId) === String(categoryId))?.categoryName || '',
        categoryId: Number(categoryId),

        school: schoolId,
        schoolId: schoolId === '외부' ? null : 1,
        oneLineIntro, 
        description, 
        activity, 
        urlFields,

        links: urlFields.reduce((acc, field) => {
          const url = field.url || field.urlValue;

          if (
            field.selectedValue &&
            field.selectedValue !== 'URL' &&
            field.selectedValue !== '직접입력' &&
            url
          ) {
            acc[field.selectedValue.toLowerCase()] = url;
          }

          return acc;
        }, {}),
        
        recruitInfo: recruitInfo,
        coverImage, 
        profileImage 
      } 
    });
  };
  


  const schools = ["성신여자대학교", "외부"];
  const urlOptions = ["Web", "Instagram", "Discord", "Notion", "직접입력"];

  return (
    <div style={{ width: '100%', minHeight: '1400px', background: '#F8F8FB', paddingBottom: '100px', boxSizing: 'border-box' }}>
      <Header />
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', alignItems: 'flex-start', width: '100%' }}>
        
        {/* 왼쪽 사이드바 */}
        <div style={{ width: '260px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', padding: '32px', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>등록 단계</h2>
          <div style={{ background: '#EEEDFE', padding: '10px 20px', borderRadius: '12px', color: '#534AB7', fontWeight: '700', marginBottom: '16px', boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.25)' }}>1 정보 작성</div>
          <div style={{ padding: '10px 20px', color: '#7E8490', fontWeight: '700' }}>2 확인 및 제출</div>
        </div>
      
        {/* 오른쪽 메인 */}
        <div style={{ width: '834px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', paddingBottom: '40px' }}>
          <div style={{ padding: '40px', paddingBottom: '0' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#111827' }}>상세 정보 입력</h1>
            
            {/* 커버 이미지 */}
            <div 
              onClick={() => coverInputRef.current.click()}
              style={{ width: '763px', height: '170px', background: coverImage ? `url(${coverImage}) center/cover` : '#EEEDFE', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', marginBottom: '20px', cursor: 'pointer' }}
            >
              {!coverImage && '+ 커버 이미지 업로드'}
              <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, setCoverImage)} />
            </div>

            {/* 프로필 및 동아리명 */}
        
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                {/* [수정/추가] 프로필 이미지 영역 */}
                <div 
                  onClick={() => profileInputRef.current.click()}
                  style={{ width: '95px', height: '87px', background: profileImage ? `url(${profileImage}) center/cover` : '#EEEDFE', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '4px 4px 2px rgba(0, 0, 0, 0.25)', cursor: 'pointer' }}
                >
                  {!profileImage && '+ 프로필'}
                  <input type="file" ref={profileInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, setProfileImage)} />
                </div>
                <input type="text" value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder="* 동아리명 (필수)" style={{ width: '627px', height: '44px', padding: '0 20px', borderRadius: '10px', border: '1px solid #D1D5DB' }} />
              </div>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
                <div style={{ position: 'relative', width: '362px' }}>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: '100%', height: '44px', padding: '0 20px', borderRadius: '10px', border: '1px solid #D1D5DB', color: '#6B7280', backgroundColor: 'white', cursor: 'pointer', appearance: 'none' }}>
                    <option value="" disabled >* 카테고리 선택 (필수)</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  <div style={{ position: 'absolute', right: '20px', top: '15px', color: '#6B7280', pointerEvents: 'none' }}>▼</div>
                </div>
                <div style={{ position: 'relative', width: '362px' }}>
                  <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} style={{ width: '100%', height: '44px', padding: '0 20px', borderRadius: '10px', border: '1px solid #D1D5DB', color: '#6B7280', backgroundColor: 'white', cursor: 'pointer', appearance: 'none' }}>
                    <option value="" disabled >* 소속 선택 (필수)</option>
                    {schools.map((school) => <option key={school} value={school}>{school}</option>)}
                  </select>
                  <div style={{ position: 'absolute', right: '20px', top: '15px', color: '#6B7280', pointerEvents: 'none' }}>▼</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '25px' }}>
                <div style={{ position: 'relative' }}>
                  <textarea value={oneLineIntro} onChange={handleIntroChange} placeholder="동아리 한 줄 소개 (30자 제한)" style={{ width: '754px', height: '40px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', resize: 'none', boxSizing: 'border-box' }} />
                  <span style={{ position: 'absolute', right: '15px', bottom: '10px', fontSize: '12px', color: '#9CA3AF' }}>{oneLineIntro.length}/30</span>
                </div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="동아리 소개" style={{ width: '754px', height: '100px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                <textarea value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="활동내용" style={{ width: '754px', height: '150px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
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
                      <input type="text" placeholder="입력하세요" style={{ width: '120px', height: '44px', borderRadius: '10px', border: '1px solid #534AB7', padding: '0 10px' }} />
                    )} {/* URL 입력 */}
                    <input type="text" value={field.url} onChange={(e) => setUrlFields( urlFields.map(item => item.id === field.id ? { ...item, url: e.target.value,} : item ))} placeholder="URL을 입력하세요" style={{ width: '524px', height: '44px', padding: '0 15px', borderRadius: '10px', border: '1px solid #D1D5DB' }} />
                    <button onClick={() => removeUrlField(field.id)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #D1D5DB', cursor: 'pointer', background: 'white' }}>-</button>
                    {index === urlFields.length - 1 && (
                      <button onClick={addUrlField} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #534AB7', cursor: 'pointer', background: '#534AB7', color: 'white' }}>+</button>
                    )}
                  </div>
                ))}

              </div>
              {/* 모집 상태 */}
              <div style={{marginBottom: '40px'}}>
                <RecruitStatusSection 
                  onChange={setRecruitInfo}/>
              </div>
            </div>

           {/* 버튼 영역 (복구됨) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '40px' }}>
            <StyledButton onClick={handleNext}>다음</StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubRegisterPage;