import { useState } from 'react';

import CategoryBadge from '../../common/Badge/CategoryBadge/CategoryBadge';
import RecruitStatusBadge from '../../common/Badge/RecruitStatusBadge/RecruitStatusBadge';
import StarRating from '../../common/StarRating/StarRating';
import FavoriteButton from '../../common/Button/FavoriteButton/FavoriteButton';

import './ClubCard.css';

function ClubImage({ imageUrl, title }) {
  const [failedImageUrl, setFailedImageUrl] = useState('');
  const shouldShowImage = imageUrl && failedImageUrl !== imageUrl;

  if (shouldShowImage) {
    return (
      <img
        className="club-card-image"
        src={imageUrl}
        onError={() => setFailedImageUrl(imageUrl)}
        alt={`${title} 이미지`}
      />
    );
  }

  return <div className="club-card-placeholder">IMAGE</div>;
}

function ClubCard({
  club = {},
  title,
  category,
  description,
  recruiting,
  rating,
  favoriteCount,
  imageUrl,
  categoryBadge,
  recruitStatusBadge,
  onEdit,
  onFavoriteToggle,
  isFavorite,
  isFavoriteLoading = false,
  editLabel = '수정하기',
  onClick,
}) {
  const cardTitle = title || club.clubName;
  const cardCategory = category || club.categoryName || '기타';
  const cardDescription =
    description ||
    club.briefDescription ||
    club.oneLineIntro ||
    club.description ||
    '동아리 소개가 아직 등록되지 않았습니다.';
  const isRecruiting = (() => {
    if (recruiting !== undefined) return recruiting;
    if (club.isRecruiting !== undefined) return club.isRecruiting;
    if (club.recruitStartAt && club.recruitEndAt) {
      const now = new Date();
      const start = new Date(club.recruitStartAt);
      const end = new Date(club.recruitEndAt);
      end.setHours(23, 59, 59, 999);
      return now >= start && now <= end;
    }
    return false;
  })();
  const cardRating =
    rating ??
    club.avgRating ??
    club.averageRating ??
    club.rating ??
    0;
  const cardFavoriteCount = favoriteCount ?? club.favoriteCount;
  const cardImageUrl =
    imageUrl ||
    club.profileImageUrl ||
    club.profileImage ||
    '';
  const cardIsFavorite = isFavorite ?? club.isFavorite ?? club.isLiked ?? false;

  return (
    <article className="club-card registered-club-card club-card--registered" 
    onClick={onClick}
    style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <ClubImage imageUrl={cardImageUrl} title={cardTitle} />

      <div className="registered-club-card-main">
        <div className="registered-club-card-badges">
          {categoryBadge || (
            <CategoryBadge>{cardCategory}</CategoryBadge>
          )}
          {recruitStatusBadge || (
            <RecruitStatusBadge status={isRecruiting ? '모집중' : '마감'} />
          )}
        </div>

        <h3>{cardTitle}</h3>
        <p>{cardDescription}</p>

        <div className="registered-club-card-meta">
          <StarRating value={cardRating} />
          <FavoriteButton
            count={cardFavoriteCount}
            isActive={cardIsFavorite}
            disabled={isFavoriteLoading}
            onClick={
              onFavoriteToggle
                ? (event) => {
                    event.stopPropagation();
                    onFavoriteToggle(club);
                  }
                : undefined
            }
            label={`${cardTitle} 찜 수`}
            showCount
          />
        </div>
      </div>

      {editLabel && (
        <div className="registered-club-card-actions">
          <button type="button" onClick={(e) => { e.stopPropagation(); onEdit?.(club); }}>
            {editLabel}
          </button>
        </div>
      )}
    </article>
  );
}

export default ClubCard;
