import { Star } from 'lucide-react';

import './StarRating.css';

function StarRating({
  value = 0,
  size = 13,
  strokeWidth = 1.8,
  className = '',
  labelPrefix = '별점',
  showScore = true, //수정(평균 별점 안쓰는 카드에는 false처리하면 됨)
}) {
  const rating = Number(value || 0);
  const filledCount = Math.round(rating);

  return (
    <span
      className={`star-rating${className ? ` ${className}` : ''}`}
      aria-label={`${labelPrefix} ${rating}`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          fill={index < filledCount ? 'currentColor' : 'none'}
          strokeWidth={strokeWidth}
        />
      ))}
      {showScore && (
        <span className="start-rating-score"> 
          ({rating.toFixed(1)})
        </span>
      )}
    </span>
  );
}

export default StarRating;
