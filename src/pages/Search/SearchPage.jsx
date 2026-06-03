import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import Pagination from '../../components/common/Pagination/Pagination';
import ClubCard from '../../components/club/ClubCard/ClubCard';
import './SearchPage.css';
import { useEffect } from 'react';
import { getClubs } from '../../api/clubApi';

const categories = ['전체', '학술', '체육', '공연·예술', '봉사', '취미·친목', '창업·취업', '어학', '기타'];

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [searchedKeyword, setSearchedKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isRecruiting, setIsRecruiting] = useState('전체');
  const [sort, setSort] = useState('인기순');
  const [schoolType, setSchoolType] = useState(() => {
    const type = searchParams.get('schoolType');
    if (type === 'internal') return '교내';
    if (type === 'external') return '외부';
    return '전체';
  });
  const [clubs, setClubs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setSearchedKeyword(keyword);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const result = await getClubs({
        keyword: searchedKeyword,
        categoryId: selectedCategory !== '전체' ? categories.indexOf(selectedCategory) : undefined,
        isRecruiting,
        schoolType,
        sort,
        page: currentPage,
        pageSize: 10
      });
      if (result.success) {
        setClubs(result.data.clubs);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedKeyword, selectedCategory, isRecruiting, schoolType, sort, currentPage]);

  return (
    <>
      <Header />
      <main className="search-page">

        {/* 검색창 */}
        <div className="search-bar">
          <div className="search-input-wrapper">
            <input
              className="search-input"
              type="text"
              placeholder="동아리 이름, 소개, 활동내용으로 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="search-btn" onClick={handleSearch}>검색</button>
          {searchedKeyword && (
            <span className="search-result">"{searchedKeyword}" 검색결과 ({clubs.length})개</span>
          )}
        </div>

        <div className="search-content">

          {/* 필터 패널 */}
          <aside className="filter-panel">
            <h3 className="filter-title">필터</h3>

            <div className="filter-section">
              <h4 className="filter-label">카테고리</h4>
              <div className="filter-options">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className={selectedCategory === cat ? 'filter-option-active' : 'filter-option'}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-label">모집 여부</h4>
              <div className="filter-options">
                {['전체', '모집중', '마감'].map((opt) => (
                  <span
                    key={opt}
                    className={isRecruiting === opt ? 'filter-option-active' : 'filter-option'}
                    onClick={() => setIsRecruiting(opt)}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-label">정렬 기준</h4>
              <div className="filter-options">
                {['인기순', '별점순', '이름순'].map((opt) => (
                  <span
                    key={opt}
                    className={sort === opt ? 'filter-option-active' : 'filter-option'}
                    onClick={() => setSort(opt)}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4 className="filter-label">학교</h4>
              <div className="filter-options">
                {['전체', '교내', '외부'].map((opt) => (
                  <span
                    key={opt}
                    className={schoolType === opt ? 'filter-option-active' : 'filter-option'}
                    onClick={() => setSchoolType(opt)}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* 동아리 목록 */}
          <section className="club-list">
            {loading ? (
              <p>로딩 중...</p>
            ) : clubs.length === 0 ? (
              <p>검색 결과가 없습니다.</p>
            ) : (
              clubs.map((club) => (
                <ClubCard
                  key={club.clubId}
                  club={club}
                  onEdit={null}
                  onOpenHistory={null}
                  editLabel=""
                  historyLabel=""
                />
              ))
            )}
          </section>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}