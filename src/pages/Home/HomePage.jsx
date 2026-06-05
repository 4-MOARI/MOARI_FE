import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import CategoryFilterButton from '../../components/common/Button/FilterButton/CategoryFilterButton';
import RecruitStatusFilterButton from '../../components/common/Button/FilterButton/RecruitStatusFilterButton';
import ClubCardMain from '../../components/club/ClubCard/ClubCardMain';
import Pagination from '../../components/common/Pagination/Pagination';
import { getClubs } from '../../api/clubApi';
import { addFavoriteClub, deleteFavoriteClub } from '../../api/userApi';



const categories = ['전체', '학술', '체육', '공연·예술', '봉사', '취미·친목', '창업·취업', '어학', '기타'];
const statuses = ['전체', '모집중', '마감'];

  
const HomePage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [clubType, setClubType] = useState('internal');
  const [clubs, setClubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedStatus, setSelectedStatus] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteUpdatingIds, setFavoriteUpdatingIds] = useState(new Set());
  const itemsPerPage = 12;

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(keyword)}&schoolType=${clubType}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };
  
  useEffect(() => {
    const fetchHomeClubs = async () => {
      try {
        const result = await getClubs({
          schoolType: clubType === 'internal' ? '교내' : '외부',
          page: 1,
          pageSize: 100,
        });

        if (result.success) {
          const formattedClubs = (result.data.clubs || []).map((club) => ({
            id: club.clubId,
            clubId: club.clubId,
            name: club.clubName,
            clubName: club.clubName,
            oneLineIntro: club.briefDescription || club.description || '',
            briefDescription: club.briefDescription || club.description || '',
            description: club.description || club.briefDescription || '',
            category: club.categoryName,
            categoryName: club.categoryName,
            status:
              club.recruitStartAt && club.recruitEndAt
                ? '모집중'
                : '마감',
            recruitStartAt: club.recruitStartAt,
            recruitEndAt: club.recruitEndAt,
            type: club.schoolType,
            coverImageUrl: club.coverImageUrl,
            profileImageUrl: club.profileImageUrl,
            favoriteCount: club.favoriteCount,
            isFavorite: Boolean(club.isFavorite ?? club.isLiked ?? false),
            avgRating: club.avgRating,
          }));

          setClubs(formattedClubs);
        }
      } catch (error) {
        console.error('메인 동아리 목록 조회 실패:', error);
        setClubs([]);
      }
    };

    fetchHomeClubs();
  }, [clubType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus, clubType]);

  const filteredClubs = clubs.filter((club) => {
    const categoryMatch = selectedCategory === '전체' || club.category === selectedCategory;
    const statusMatch = selectedStatus === '전체' || club.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const totalPages = Math.max(Math.ceil(filteredClubs.length / itemsPerPage), 1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstItem, indexOfLastItem);

  const updateClubFavoriteState = (clubId, isFavorite, favoriteDelta) => {
    setClubs((prevClubs) =>
      prevClubs.map((club) => {
        const currentClubId = club.clubId ?? club.id;

        if (currentClubId !== clubId) return club;

        const currentCount = Number(club.favoriteCount || 0);

        return {
          ...club,
          isFavorite,
          favoriteCount: Math.max(currentCount + favoriteDelta, 0),
        };
      })
    );
  };

  const handleFavoriteToggle = async (club) => {
    const clubId = club.clubId ?? club.id;

    if (!clubId) {
      alert('동아리 정보를 확인할 수 없어 찜 처리에 실패했습니다.');
      return;
    }

    const nextIsFavorite = !club.isFavorite;
    const favoriteDelta = nextIsFavorite ? 1 : -1;

    setFavoriteUpdatingIds((prevIds) => new Set(prevIds).add(clubId));
    updateClubFavoriteState(clubId, nextIsFavorite, favoriteDelta);

    try {
      if (nextIsFavorite) {
        await addFavoriteClub(clubId);
      } else {
        await deleteFavoriteClub(clubId);
      }
    } catch (error) {
      const errorCode = error.response?.data?.error?.code || '';

      if (
        (nextIsFavorite && errorCode === 'FAVORITE_ALREADY_EXISTS') ||
        (!nextIsFavorite && errorCode === 'FAVORITE_NOT_FOUND')
      ) {
        return;
      }

      updateClubFavoriteState(clubId, !nextIsFavorite, -favoriteDelta);
      alert(error.response?.data?.error?.message || '찜 처리에 실패했습니다.');
    } finally {
      setFavoriteUpdatingIds((prevIds) => {
        const nextIds = new Set(prevIds);
        nextIds.delete(clubId);
        return nextIds;
      });
    }
  };

  return (
    <div>
      <Header showSwitch={true} clubType={clubType} setClubType={setClubType} />

      <div style={{ width: '100%', height: '180px', background: '#EEEDFE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ color: '#534AB7', fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
          {clubType === 'internal' ? '우리 학교 동아리를 한눈에' : '전국의 동아리를 한눈에'}
        </div>
        <div style={{ width: '520px', height: '50px', position: 'relative' }}>
          <input type="text" placeholder="동아리 이름, 소개, 활동내용으로 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleKeyDown} style={{ width: '100%', height: '100%', padding: '0 20px', borderRadius: '25px', border: 'none', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          <button onClick={handleSearch} style={{ width: '66px', height: '38px', position: 'absolute', right: '6px', top: '6px', background: '#534AB7', color: 'white', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>검색</button>
        </div>
      </div>

      <div style={{ width: '1280px', margin: '0 auto', padding: '40px 0' }}>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
          {categories.map((cat) => (
            <CategoryFilterButton key={cat} label={cat} isActive={selectedCategory === cat} onClick={() => setSelectedCategory(cat)} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
          {statuses.map((status) => (
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
                key={club.clubId ?? club.id}
                onClick={() => navigate(`/club/${club.clubId ?? club.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <ClubCardMain
                  club={club}
                  isFavorite={Boolean(club.isFavorite)}
                  isFavoriteLoading={favoriteUpdatingIds.has(club.clubId ?? club.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
