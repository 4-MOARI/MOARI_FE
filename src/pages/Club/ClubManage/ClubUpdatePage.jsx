//동아리 수정페이지

import React, { useState, useRef } from 'react'; // [수정/추가] useRef 추가
import Header from '../../../components/common/Header/Header';

const ClubUpdatePage = () => {
  const [oneLineIntro, setOneLineIntro] = useState('');
  const [urlFields, setUrlFields] = useState([{ id: Date.now(), type: 'select', selectedValue: 'URL' }]);
  const [isHovered, setIsHovered] = useState(false);

  // [수정/추가] 이미지 상태 관리
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  
  // [수정/추가] 파일 입력을 위한 Ref
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // [수정/추가] 파일 변경 핸들러
  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    }
  };

  // 수정 불가 항목 스타일
  const disabledStyle = {
    background: '#F9FAFB',
    color: '#9CA3AF',
    cursor: 'not-allowed',
    border: '1px solid #E5E7EB'
  };

  const handleIntroChange = (e) => {
    if (e.target.value.length <= 30) setOneLineIntro(e.target.value);
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

  const categories = ["전체", "학술", "체육", "공연·예술", "봉사", "취미·친목", "창업·친업", "어학", "기타"];
  const schools = ["성신여자대학교", "외부"];
  const urlOptions = ["Web", "Instagram", "Discord", "Notion", "직접입력"];

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '1400px', 
      paddingBottom: '100px', // [수정] 이 한 줄만 추가하세요!
      background: '#F8F8FB', 
      position: 'relative', 
      boxSizing: 'border-box' // [추가] padding이 전체 크기에 포함되게 함
    }}>
      <Header />
      
       {/* 상세 페이지와 동일한 레이아웃 구조 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '40px 20px',    // 위쪽 40px 간격이 상단바와 본문의 여백입니다
        alignItems: 'flex-start' 
      }}>
        
        <div style={{ width: '260px', height: '800px', left: '58px', top: '86px', position: 'absolute', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', padding: '32px', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>등록 단계</h2>
          <div style={{ background: '#EEEDFE', padding: '10px 20px', borderRadius: '12px', color: '#534AB7', fontWeight: '700', marginBottom: '16px', boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.25)' }}>1 정보 수정</div>
          <div style={{ padding: '10px 20px', color: '#7E8490', fontWeight: '700' }}>2 확인 및 제출</div>
        </div>

        <div style={{ width: '834px', left: '388px', top: '86px', position: 'absolute' }}>
          <div style={{ width: '834px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', paddingBottom: '40px' }}>
            
            <div style={{ padding: '40px', paddingBottom: '0' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#111827' }}>상세 정보 수정</h1>
              
              {/* [수정/추가] 커버 이미지 영역 */}
              <div 
                onClick={() => coverInputRef.current.click()}
                style={{ width: '763px', height: '170px', background: coverImage ? `url(${coverImage}) center/cover` : '#EEEDFE', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', marginBottom: '20px', cursor: 'pointer' }}
              >
                {!coverImage && '+ 커버 이미지 업로드'}
                <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, setCoverImage)} />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                {/* [수정/추가] 프로필 이미지 영역 */}
                <div 
                  onClick={() => profileInputRef.current.click()}
                  style={{ width: '95px', height: '87px', background: profileImage ? `url(${profileImage}) center/cover` : '#EEEDFE', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '4px 4px 2px rgba(0, 0, 0, 0.25)', cursor: 'pointer' }}
                >
                  {!profileImage && '+ 프로필'}
                  <input type="file" ref={profileInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, setProfileImage)} />
                </div>
                <input type="text" value="알고리즘 연구회" disabled style={{ ...disabledStyle, width: '627px', height: '44px', padding: '0 20px', borderRadius: '10px', border: '1px solid #D1D5DB' }} />
              </div>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
                <div style={{ position: 'relative', width: '362px' }}>
                  <select style={{ width: '100%', height: '44px', padding: '0 20px', borderRadius: '10px', border: '1px solid #D1D5DB', color: '#6B7280', backgroundColor: 'white', cursor: 'pointer', appearance: 'none' }}>
                    <option value="" disabled selected>카테고리 선택</option>
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
                  <textarea value={oneLineIntro} onChange={handleIntroChange} placeholder="동아리 한 줄 소개 (30자 제한)" style={{ width: '754px', height: '40px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', resize: 'none', boxSizing: 'border-box' }} />
                  <span style={{ position: 'absolute', right: '15px', bottom: '10px', fontSize: '12px', color: '#9CA3AF' }}>{oneLineIntro.length}/30</span>
                </div>
                <textarea placeholder="동아리 소개" style={{ width: '754px', height: '100px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
                <textarea placeholder="활동내용" style={{ width: '754px', height: '150px', padding: '10px', borderRadius: '10px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
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
                    )}
                    <input type="text" placeholder="URL을 입력하세요" style={{ width: '524px', height: '44px', padding: '0 15px', borderRadius: '10px', border: '1px solid #D1D5DB' }} />
                    <button onClick={() => removeUrlField(field.id)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #D1D5DB', cursor: 'pointer', background: 'white' }}>-</button>
                    {index === urlFields.length - 1 && (
                      <button onClick={addUrlField} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #534AB7', cursor: 'pointer', background: '#534AB7', color: 'white' }}>+</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '40px' }}>
              <button 
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
    </div>
  );
};

export default ClubUpdatePage;