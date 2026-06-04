import StarRating from '../../common/StarRating/StarRating';

import './ReviewCard.css';

function maskUserId(userId) {
  if (!userId) return '';

  if (userId.startsWith('deleted_')) {
    return '알수없음';
  }

  if (userId.length <= 2) {
    return `${userId[0]}*`;
  }

  if (userId.length <= 4) {
    return `${userId.slice(0, 2)}**`;
  }

  return `${userId.slice(0, 2)}***${userId.slice(-2)}`;
}

function formatReviewDate(createdAt) {
  if (!createdAt) return '';

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return '';

  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const getPart = (type) => parts.find((part) => part.type === type)?.value || '';

  return `${getPart('year')}.${getPart('month')}.${getPart('day')} ${getPart('hour')}:${getPart('minute')}`;
}

function ReviewCard({
  userId,
  rating,
  content,
  createdAt,
  isMine = false,
  onDelete,
}) {
  return (
    <div className="review-card">
      {/* 상단 한 줄 */}
      <div className="review-card-top">
        <div className="review-user-rating">
          <span className="review-user-id">
            {maskUserId(userId)}
          </span>

          <StarRating
            value={rating}
            showScore={false}
            size={13}
          />
        </div>

        {isMine && (
          <button
            className="review-delete-button"
            onClick={onDelete}
          >
            삭제
          </button>
        )}
      </div>

      {/* 리뷰 내용 */}
      <p className="review-content">
        {content}
      </p>

      {/* 날짜 */}
      <span className="review-date">
        {formatReviewDate(createdAt)}
      </span>
    </div>
  );
}

export default ReviewCard;
