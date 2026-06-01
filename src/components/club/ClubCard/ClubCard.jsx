import StarRating from '../../common/StarRating/StarRating';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

import './ClubCard.css';

function RecruitStatusBadge({ isRecruiting }) {
  return (
    <span
      className={`club-card-status${isRecruiting ? ' recruiting' : ' closed'}`}
    >
      {isRecruiting ? '모집중' : '마감'}
    </span>
  );
}

function ClubImage({ imageUrl, title }) {
  if (imageUrl) {
    return (
      <img
        className="club-card-image"
        src={imageUrl}
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
  onOpenHistory,
  editLabel = '수정하기',
  historyLabel = '[수정 로그]',
}) {
  const cardTitle = title || club.clubName;
  const cardCategory = category || club.categoryName || '기타';
  const cardDescription =
    description || club.briefDescription || '동아리 소개가 아직 등록되지 않았습니다.';
  const isRecruiting = recruiting ?? club.isRecruiting;
  const cardRating = rating ?? club.averageRating;
  const cardFavoriteCount = favoriteCount ?? club.favoriteCount;
  const cardImageUrl = imageUrl || club.profileImageUrl || club.coverImageUrl;

  return (
    <article className="club-card club-card--registered">
      <ClubImage imageUrl={cardImageUrl} title={cardTitle} />

      <div className="club-card-main">
        <div className="club-card-badges">
          {categoryBadge || (
            <span className="club-card-category">
              {cardCategory}
            </span>
          )}
          {recruitStatusBadge || (
            <RecruitStatusBadge isRecruiting={isRecruiting} />
          )}
        </div>

        <h3>{cardTitle}</h3>
        <p>{cardDescription}</p>

        <div className="club-card-meta">
          <StarRating value={cardRating} />
          <FavoriteButton
            count={cardFavoriteCount}
            label={`${cardTitle} 찜 수`}
            showCount
          />
        </div>
      </div>

      <div className="club-card-actions">
        <button type="button" onClick={() => onEdit?.(club)}>
          {editLabel}
        </button>
        <button type="button" onClick={() => onOpenHistory?.(club)}>
          {historyLabel}
        </button>
      </div>
    </article>
  );
}

export default ClubCard;
