import React, { useEffect, useState } from 'react';
import { MOCK_CLUBS } from "../../data/clubs"; //더미데이터
import { useNavigate } from 'react-router-dom'; // 동아리카드 연결
import Header from '../../components/common/Header/Header';
import apiClient from '../../api/axios';
import CategoryFilterButton from "../../components/common/Button/FilterButton/CategoryFilterButton";
import RecruitStatusFilterButton from "../../components/common/Button/FilterButton/RecruitStatusFilterButton";
import ClubCardMain from '../../components/club/ClubCard/ClubCardMain';
import Pagination from '../../components/common/Pagination/Pagination';

const HomePage = () => {
  const [clubType, setClubType] = useState('internal');

  const navigate = useNavigate(); // 동아리카드연결
  
  const [clubs, setClubs] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchClubs();
  }, [clubType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus, clubType]);

  const fetchClubs = async () => {
    try {
      const mockClubs = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `${clubType === 'internal' ? '교내' : '외부'} 동아리 ${i + 1}`,
        category: i % 2 === 0 ? '학술' : '체육',
        status: i % 3 === 0 ? '마감' : '모집중',
        type: i % 2 === 0 ? 'internal' : 'external'
      })).filter((club) => club.type === clubType);
      // [백엔드 연동 전] 더미 데이터(MOCK_CLUBS)를 사용하여 필터링
      // 실제 API 호출은 나중에 이 부분을 주석 처리하고 axios.get()으로 바꾸면 됩니다.
      const data = MOCK_CLUBS;

      // 여기서 'internal'을 '성신여자대학교'로, 'external'을 '외부'로 바꿔서 비교합니다.
      const filteredByType = data.filter((club) => {
        if (clubType === 'internal') {
          return club.affiliation === '성신여자대학교';
        } else {
          return club.affiliation === '외부';
        }
      });
      
      setClubs(filteredByType);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const categoryMatch = selectedCategory === '전체' || club.category === selectedCategory;
    const statusMatch = selectedStatus === '전체' || club.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <Header showSwitch={true} clubType={clubType} setClubType={setClubType} />
      
      <div style={{ width: '100%', height: '180px', background: '#EEEDFE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ color: '#534AB7', fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
          {clubType === 'internal' ? '우리 학교 동아리를 한 눈에' : '전국의 동아리를 한 눈에'}
        </div>
        <div style={{ width: '520px', height: '50px', position: 'relative' }}>
          <input type="text" placeholder="동아리 이름, 소개, 활동내용으로 검색" style={{ width: '100%', height: '100%', padding: '0 20px', borderRadius: '25px', border: 'none', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          <button style={{ width: '66px', height: '38px', position: 'absolute', right: '6px', top: '6px', background: '#534AB7', color: 'white', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>검색</button>
        </div>
      </div>
       
      <div style={{ width: '1280px', margin: '0 auto', padding: '40px 0' }}>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
          {['전체', '학술', '체육', '공연·예술', '봉사', '취미·친목', '창업·취업', '어학', '기타'].map((cat) => (
            <CategoryFilterButton key={cat} label={cat} isActive={selectedCategory === cat} onClick={() => setSelectedCategory(cat)} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
          {['전체', '모집중', '마감'].map((status) => (
            <RecruitStatusFilterButton key={status} status={status} isActive={selectedStatus === status} onClick={() => setSelectedStatus(status)} />
          ))}
        </div>

        <div style={{ color: '#6B7280', fontSize: '14px', fontWeight: '700', marginBottom: '20px' }}>
          총 {filteredClubs.length}개 동아리
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', paddingBottom: '40px', minHeight: '600px' }}>
          {currentClubs.length > 0 ? (
            currentClubs.map((club) => (
              <div 
                key={club.id} 
                onClick={() => navigate(`/club/${club.id}`)} 
                style={{ cursor: 'pointer' }}
              >
                <ClubCardMain club={club} />
              </div>
            ))
          ) : (
            <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '100px 0', color: '#6B7280' }}>
              조건에 맞는 동아리가 없습니다.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
          <Pagination 
            totalItems={filteredClubs.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;