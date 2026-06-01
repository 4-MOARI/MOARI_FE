import { useState } from 'react';
import CategoryBadge from '../components/common/Badge/CategoryBadge/CategoryBadge';
import RecruitStatusBadge from '../components/common/Badge/RecruitStatusBadge/RecruitStatusBadge';
import FilterButton from '../components/common/Button/FilterButton/FilterButton';

export default function TestPage() {
  const [selectedCat, setSelectedCat] = useState('학술');
  const [selectedStat, setSelectedStat] = useState('전체');

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1>전체 테스트 페이지</h1>

      {/* 1. 배지 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h3>1. 배지 (상태 표시용)</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* 카테고리 배지 */}
          <CategoryBadge>학술</CategoryBadge>
          <CategoryBadge>공연,예술</CategoryBadge>
          {/* 모집상태 배지 */}
          <RecruitStatusBadge status="모집중" />
          <RecruitStatusBadge status="마감" />
        </div>
      </section>

      {/* 2. 카테고리 필터링 테스트 */}
      <section style={{ marginBottom: '40px' }}>
        <h3>2. 카테고리 필터링</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['학술', '체육', '공연,예술'].map(cat => (
            <FilterButton 
              key={cat} 
              label={cat} 
              type="category" 
              isSelected={selectedCat === cat} 
              onClick={() => setSelectedCat(cat)} 
            />
          ))}
        </div>
      </section>

      {/* 3. 모집상태 필터링 */}
      <section style={{ marginBottom: '40px' }}>
        <h3>3. 모집상태 필터링 (등록/수정용 동일)</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['전체', '모집중', '마감'].map(stat => (
            <FilterButton 
              key={stat} 
              label={stat} 
              type="status" 
              isSelected={selectedStat === stat} 
              onClick={() => setSelectedStat(stat)} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}