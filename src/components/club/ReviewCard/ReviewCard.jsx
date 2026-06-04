import StarRating from '../../common/StarRating/StarRating';

import './ReviewCard.css';

function maskUserId(userId) {
  if (!userId) return '';

  if (userId.length <= 2) {
    return `${userId[0]}*`;
  }

  if (userId.length <= 4) {
    return `${userId.slice(0, 2)}**`;
  }

  return `${userId.slice(0, 2)}***${userId.slice(-2)}`;
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
        {new Date(createdAt)
            .toLocaleDateString('ko-KR')
            .replaceAll('.', '.')}
      </span>
    </div>
  );
}

export default ReviewCard;