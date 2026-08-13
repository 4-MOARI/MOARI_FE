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
  const recruitStartDate =
    club.recruitStartAt || club.recruitPeriod?.start;

  const recruitEndDate =
    club.recruitEndAt || club.recruitPeriod?.end;

  const getRecruitStatusByDate = (startDate, endDate) => {
    if (!startDate || !endDate) return '마감';

    const now = new Date();

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return '마감';
    }

    end.setHours(23, 59, 59, 999);

    return now >= start && now <= end
      ? '모집중'
      : '마감';
  };

  const statusToDisplay = getRecruitStatusByDate(
    recruitStartDate,
    recruitEndDate
  );
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
            <RecruitStatusBadge status={statusToDisplay} />
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
