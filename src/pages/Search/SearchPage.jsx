import { useState } from 'react';
<<<<<<< HEAD
import Header from '../../components/common/Header/Header';
import Pagination from '../../components/common/Pagination/Pagination';
import './SearchPage.css';
import { useSearchParams } from 'react-router-dom';

// 더미 데이터
const dummyClubs = [
  {
    clubId: 1,
    clubName: '알고리즘 연구회',
    briefDescription: '알고리즘 관련 활동과 스터디 정보를 확인할 수 있습니다.',
    categoryName: '학술',
    isRecruiting: true,
    avgRating: 4.6,
    favoriteCount: 20,
    schoolType: 'internal',
    coverImageUrl: null,
  },
  {
    clubId: 2,
    clubName: '풋살 클럽',
    briefDescription: '풋살을 즐기는 동아리입니다.',
    categoryName: '체육',
    isRecruiting: true,
    avgRating: 4.2,
    favoriteCount: 15,
    schoolType: 'internal',
    coverImageUrl: null,
  },
  {
    clubId: 3,
    clubName: '빛의 사진반',
    briefDescription: '사진 촬영과 편집을 배우는 동아리입니다.',
    categoryName: '공연·예술',
    isRecruiting: false,
    avgRating: 4.6,
    favoriteCount: 10,
    schoolType: 'external',
    coverImageUrl: null,
  },
];

const categories = ['전체', '학술', '체육', '공연·예술', '봉사', '취미·친목', '창업·취업', '어학', '기타'];

function StarRating({ rating }) {
  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'star-filled' : 'star-empty'}>★</span>
      ))}
      <span className="rating-text">({rating})</span>
    </span>
  );
}

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
  const totalPages = 5;

  const handleSearch = () => {
    setSearchedKeyword(keyword);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

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
            <span className="search-result">"{searchedKeyword}" 검색결과 ({dummyClubs.length})개</span>
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
            {dummyClubs.map((club) => (
              <div key={club.clubId} className="club-card">
                <div className="club-image">
                  {club.coverImageUrl ? (
                    <img src={club.coverImageUrl} alt={club.clubName} />
                  ) : (
                    <div className="image-placeholder">IMAGE</div>
                  )}
                </div>
                <div className="club-info">
                  <div className="club-badges">
                    <span className="category-badge">{club.categoryName}</span>
                    <span className={club.isRecruiting ? 'recruiting-badge' : 'closed-badge'}>
                      {club.isRecruiting ? '모집중' : '마감'}
                    </span>
                  </div>
                  <h3 className="club-name">{club.clubName}</h3>
                  <p className="club-desc">{club.briefDescription}</p>
                  <div className="club-footer">
                    <StarRating rating={club.avgRating} />
                    <span className="favorite-count">♡ ({club.favoriteCount})</span>
                  </div>
                </div>
              </div>
            ))}
          </section>

        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
=======
import Pagination from '../../components/common/Pagination/Pagination';

export default function SearchPage() {
    //디폹로 처음 들어가면 1페이지
  const [currentPage, setCurrentPage] = useState(1);
//임시로 5로 설정(나중에흠 currentPage, totalPages로관리해서 paginationdp props로 넘겨주면 됩니다)
  const totalPages = 5;

  return (
    <div>
      {/* 검색 결과 카드 목록 */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
>>>>>>> develop
  );
}