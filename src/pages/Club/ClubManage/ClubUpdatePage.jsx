// 동아리 수정페이지

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../components/common/Header/Header';
import RecruitStatusSection from '../../../components/club/RecruitStatusSection/RecruitStatusSection';


const ClubUpdatePage = () => {
  const navigate = useNavigate(); // 2. 여기 추가
  const { clubId } = useParams(); // 3. 여기 추가
  const [oneLineIntro, setOneLineIntro] = useState('');
  const [urlFields, setUrlFields] = useState([{ id: Date.now(), type: 'select', selectedValue: 'URL' , url: ''}]);
  const [isHovered, setIsHovered] = useState(false);


  //모집상태 관련state
  const [recruitInfo, setRecruitInfo]
  = useState({
    isRecruiting: false,
    recruitStartAt: null,
    recruitEndAt: null,
  });

  const [categoryId, setCategoryId]
  = useState('');
  const [description, setDescription]
  = useState('');
  const [activity, setActivity]
  = useState('');
 

  // [수정/추가] 이미지 상태 관리

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
    if (e.target.value.length <= 30) setOneLineIntro(e.target.value);
  };

  const addUrlField = () => {
    setUrlFields([...urlFields, { id: Date.now(), type: 'select', selectedValue: 'URL' , url: ''}]);
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



  //const schools = ["성신여자대학교", "외부"];
  const categories = ["전체", "학술", "체육", "공연·예술", "봉사", "취미·친목", "창업·취업", "어학", "기타"];

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
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>수정 단계</h2>
          <div style={{ background: '#EEEDFE', padding: '10px 20px', borderRadius: '12px', color: '#534AB7', fontWeight: '700', marginBottom: '16px', boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.25)' }}>1 정보 수정</div>
          <div style={{ padding: '10px 20px', color: '#7E8490', fontWeight: '700' }}>2 확인 및 제출</div>
        </div>

        {/* 오른쪽 메인 콘텐츠 */}
        <div style={{ width: '834px', background: 'white', boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.10)', borderRadius: '24px', paddingBottom: '40px' }}>
          
          <div style={{ padding: '40px', paddingBottom: '0' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: '#111827' }}>상세 정보 수정</h1>
            
            <div 
              onClick={() => coverInputRef.current.click()}
              style={{ width: '763px', height: '170px', background: coverImage ? `url(${coverImage}) center/cover` : '#EEEDFE', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', marginBottom: '20px', cursor: 'pointer' }}
            >
              {!coverImage && '+ 커버 이미지 업로드'}
              <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, setCoverImage)} />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
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
              {/*모집상태 */}
              <div style={{marginBottom: '40px'}}>
                <RecruitStatusSection
                  onChange={setRecruitInfo} />
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
              onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
              onClick={() => navigate(`/club/update/${clubId}/preview`)}
              style={{ width: '100px', height: '46px', background: isHovered ? '#6A62C7' : '#534AB7', color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', transition: 'background 0.3s ease', boxShadow: isHovered ? '0px 4px 12px rgba(83, 74, 183, 0.4)' : 'none' }}
            >다음</button>
          </div>
        </div>
      </div>
   </div>
  );
};
export default ClubUpdatePage;