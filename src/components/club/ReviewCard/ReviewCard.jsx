// import StarRating from '../../common/StarRating/StarRating';

// import './ReviewCard.css';

// function maskUserId(userId) {
//   if (!userId) return '';

//   if (userId.startsWith('deleted_')) {
//     return '알수없음';
//   }

//   if (userId.length <= 2) {
//     return `${userId[0]}*`;
//   }

//   if (userId.length <= 4) {
//     return `${userId.slice(0, 2)}**`;
//   }

//   return `${userId.slice(0, 2)}***${userId.slice(-2)}`;
// }

// function formatReviewDate(createdAt) {
//   if (!createdAt) return '';

//   const date = new Date(createdAt);

//   if (Number.isNaN(date.getTime())) return '';

//   const parts = new Intl.DateTimeFormat('ko-KR', {
//     timeZone: 'Asia/Seoul',
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false,
//   }).formatToParts(date);

//   const getPart = (type) => parts.find((part) => part.type === type)?.value || '';

//   return `${getPart('year')}.${getPart('month')}.${getPart('day')} ${getPart('hour')}:${getPart('minute')}`;
// }

// function ReviewCard({
//   userId,
//   rating,
//   content,
//   createdAt,
//   isMine = false,
//   onDelete,
//   isDeleting = false,
// }) {
//   return (
//     <div className="review-card">
//       {/* 상단 한 줄 */}
//       <div className="review-card-top">
//         <div className="review-user-rating">
//           <span className="review-user-id">
//             {maskUserId(userId)}
//           </span>

//           <StarRating
//             value={rating}
//             showScore={false}
//             size={13}
//           />
//         </div>

//         {isMine && (
//           <button
//             type="button"
//             className="review-delete-button"
//             onClick={onDelete}
//             disabled={isDeleting}
//           >
//             삭제
//           </button>
//         )}
//       </div>

//       {/* 리뷰 내용 */}
//       <p className="review-content">
//         {content}
//       </p>

//       {/* 날짜 */}
//       <span className="review-date">
//         {formatReviewDate(createdAt)}
//       </span>
//     </div>
//   );
// }

// export default ReviewCard;
import { useRef, useState } from 'react';
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

/** 활동 강도 / 친목 비중 게이지 바 (1~5점, hover 시 점수 표시) */
function RatingBar({ label, value, max = 5 }) {
  const [hover, setHover] = useState(false);

  if (value === null || value === undefined) return null;

  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="review-rating-bar-row">
      <span className="review-rating-bar-label">{label}</span>

      <div
        className="review-rating-bar-track"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="review-rating-bar-fill"
          style={{ width: `${percent}%` }}
        />

        {hover && (
          <span
            className="review-rating-bar-tooltip"
            style={{ left: `${percent}%` }}
          >
            {value}점
          </span>
        )}
      </div>
    </div>
  );
}

/** 키워드 뱃지 목록 (한 줄 초과 시 드래그로 좌우 슬라이드) */
function KeywordList({ keywords }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  if (!keywords || keywords.length === 0) return null;

  const handleMouseDown = (e) => {
    if (!trackRef.current) return;

    isDragging.current = true;
    trackRef.current.classList.add('dragging');
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeftStart.current = trackRef.current.scrollLeft;
  };

  const stopDragging = () => {
    isDragging.current = false;
    trackRef.current?.classList.remove('dragging');
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;

    e.preventDefault();

    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = x - startX.current;

    trackRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div
      className="review-keyword-list"
      ref={trackRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      {keywords.map((keyword) => (
        <span key={keyword.keywordId} className="review-keyword-badge">
          {keyword.keywordName}
        </span>
      ))}
    </div>
  );
}

function ReviewCard({
  userId,
  rating,
  content,
  createdAt,
  isMine = false,
  onDelete,
  isDeleting = false,
  activityRating,
  sociabilityRating,
  keywords = [],
}) {
  return (
    <div className="review-card">
      {/* 상단 한 줄 */}
      <div className="review-card-top">
        <span className="review-user-id">
          {maskUserId(userId)}
        </span>

        <div className="review-card-top-right">
          <div className="review-star-rating">
            <StarRating
              value={rating}
              showScore={false}
              size={13}
            />
          </div>

          {isMine && (
            <button
              type="button"
              className="review-delete-button"
              onClick={onDelete}
              disabled={isDeleting}
            >
              삭제
            </button>
          )}
        </div>
      </div>

      {/* 활동 강도 / 친목 비중 */}
      <div className="review-rating-bars">
        <RatingBar label="활동 강도" value={activityRating} />
        <RatingBar label="친목 비중" value={sociabilityRating} />
      </div>

      {/* 키워드 뱃지 */}
      <KeywordList keywords={keywords} />

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