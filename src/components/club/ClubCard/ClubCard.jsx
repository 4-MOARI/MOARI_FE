import { Heart, Star } from 'lucide-react';

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

function Rating({ value }) {
  const rating = Number(value || 0);
  const filledCount = Math.round(rating);

  return (
    <span className="club-card-rating" aria-label={`별점 ${rating}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={13}
          fill={index < filledCount ? 'currentColor' : 'none'}
          strokeWidth={1.8}
        />
      ))}
      <span>({rating.toFixed(1)})</span>
    </span>
  );
}

function ClubImage({ club }) {
  const imageUrl = club.profileImageUrl || club.coverImageUrl;

  if (imageUrl) {
    return (
      <img
        className="club-card-image"
        src={imageUrl}
        alt={`${club.clubName} 이미지`}
      />
    );
  }

  return <div className="club-card-placeholder">IMAGE</div>;
}

function ClubCard({
  club,
  categoryBadge,
  recruitStatusBadge,
  onEdit,
  onOpenHistory,
  editLabel = '수정하기',
  historyLabel = '[수정 로그]',
}) {
  return (
    <article className="club-card club-card--registered">
      <ClubImage club={club} />

      <div className="club-card-main">
        <div className="club-card-badges">
          {categoryBadge || (
            <span className="club-card-category">
              {club.categoryName || '기타'}
            </span>
          )}
          {recruitStatusBadge || (
            <RecruitStatusBadge isRecruiting={club.isRecruiting} />
          )}
        </div>

        <h3>{club.clubName}</h3>
        <p>
          {club.briefDescription ||
            '동아리 소개가 아직 등록되지 않았습니다.'}
        </p>

        <div className="club-card-meta">
          <Rating value={club.averageRating} />
          <span className="club-card-favorite-count">
            <Heart size={14} strokeWidth={1.8} />
            ({Number(club.favoriteCount || 0)})
          </span>
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
