import React, { useState } from 'react';
import './ClubCardMain.css';
import CategoryBadge from '../../common/Badge/CategoryBadge/CategoryBadge';
import RecruitStatusBadge from '../../common/Badge/RecruitStatusBadge/RecruitStatusBadge';
import StarRating from '../../common/StarRating/StarRating';

const ClubCardMain = ({ club }) => {
  const [isLiked, setIsLiked] = useState(false);
  const toggleLike = (e) => {
    e.stopPropagation(); // ★ 핵심: 이벤트가 부모(카드 전체)로 퍼지는 것을 막음
    setIsLiked(!isLiked);
  };

  return (
    <article className="club-card-main">
      <div className="club-card-image-placeholder">IMAGE</div>
      
      <div className="club-card-badges">
        <CategoryBadge>{club.category}</CategoryBadge>
        <RecruitStatusBadge status={club.status} />
      </div>

      <h3>{club.name}</h3>
      <p className="club-card-description">
        {club.oneLineIntro || club.briefDescription || club.description || '동아리 소개가 아직 등록되지 않았습니다.'}
      </p>

      <div className="club-card-meta">
        <StarRating value={4.6} />
        
        <div 
          onClick={toggleLike}
          style={{ width: '24px', height: '21px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="24" height="21" viewBox="0 0 24 21" fill={isLiked ? "#D4537E" : "none"} stroke="#D4537E" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19.5L10.55 18.18C5.4 13.56 2 10.5 2 6.75C2 3.72 4.42 1.5 7.5 1.5C9.24 1.5 10.91 2.33 12 3.65C13.09 2.33 14.76 1.5 16.5 1.5C19.58 1.5 22 3.72 22 6.75C22 10.5 18.6 13.56 13.45 18.19L12 19.5Z" />
          </svg>
        </div>
      </div>
    </article>
  );
};

export default ClubCardMain;