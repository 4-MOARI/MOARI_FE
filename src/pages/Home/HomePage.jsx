import Header from '../../components/common/Header/Header';
import apiClient from '../../api/axios';
//등록/수정페이지 내 모집 상태 배지 실험용(곧 삭제 예정)

import RecruitStatusSection
  from '../../components/club/RecruitStatusSection/RecruitStatusSection';


import { useState, useEffect } from 'react';
// 테스트(+헤더 스위치 쪽 조정해봤습니다)
// src/pages/Home/HomePage.jsx

// 1. 경로를 정확하게 확인 (상대 경로)
import CategoryBadge from "../../components/common/Badge/CategoryBadge/CategoryBadge";
import RecruitStatusBadge from "../../components/common/Badge/RecruitStatusBadge/RecruitStatusBadge";

const HomePage = () => {
  const [clubType, setClubType] = useState('internal');
  const [clubs, setClubs] =useState([]);
  const [selectedStat, setSelectedStat]
  = useState('마감');

  const [isOpen, setIsOpen]
  = useState(false);

  useEffect(() => {
    fetchClubs();
  }, [clubType]);

  const fetchClubs = async () => {
    try {
      const response = await apiClient.get(
        `/clubs?schoolType=${clubType}`
      );

      setClubs(response.data.data.clubs);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header
        showSwitch={true}
        clubType={clubType}
        setClubType={setClubType}
      />
      {/* 2. 호출 확인 */}
      <h1>테스트 페이지</h1>

      <p>현재 선택 : {clubType} </p> 
      <CategoryBadge>학술</CategoryBadge>
     
      <RecruitStatusSection />


       
    </div>

    
  );
};

export default HomePage;