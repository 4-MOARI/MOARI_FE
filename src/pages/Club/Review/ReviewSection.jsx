import { useEffect, useState } from 'react';
import {
  getClubReviews,
  deleteReview,
} from '../../../api/reviewApi';

import ReviewModal from "./ReviewModal";

import StarRating from '../../../components/common/StarRating/StarRating';

import ReviewCard from '../../../components/club/ReviewCard/ReviewCard';


import './ReviewSection.css';

function ReviewSection({ clubId, clubName }) {
    console.log("ReviewSection clubId =", clubId);
  const [reviews, setReviews] = useState([]);

  const [isModalOpen, setIsModalOpen]
  = useState(false);

  const [visibleCount, setVisibleCount] = useState(2);

  const [averageRating, setAverageRating] =
    useState(0);

  const fetchReviews = async () => {
      try {
        const data = await getClubReviews(clubId);

        setReviews(data.reviews);

        setAverageRating(data.averageRating);
      } catch (error) {
        console.error(
          '리뷰 조회 실패:',
          error
        );
      }
    };

  useEffect(() => {
    

    fetchReviews();
  }, [clubId]);

  const visibleReviews = reviews.slice(
    0,
    visibleCount
  );

  const handleDeleteReview = async (
  reviewId
) => {

  try {

    await deleteReview(reviewId);

    await fetchReviews();

  } catch (error) {

    console.error(
      '리뷰 삭제 실패:',
      error
    );

  }
};

  return (
    <section className="review-section">
      <h2 className="review-section-title">
        리뷰 및 별점
      </h2>

      <div className="review-score">
        <span className="review-score-value">
          {averageRating.toFixed(1)}
        </span>

        <StarRating
          value={averageRating}
          showScore={false}
          size={18}
        />
      </div>

      <button 
        className="review-write-button"
        onClick={() => setIsModalOpen(true)}>
        + 리뷰 작성하기
      </button>

      <div className="review-list">
        {/* {visibleReviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            userId={review.userId}
            rating={review.rating}
            content={review.content}
            createdAt={review.createdAt}
            isMine={review.isMine}
            onDelete={()=>
                handleDeleteReview(review.reviewId)
            }
          />
        ))} */}
        {visibleReviews.map((review) => {
  console.log("review =", review);

  return (
    <ReviewCard
      key={review.reviewId}
      userId={review.userId}
      rating={review.rating}
      content={review.content}
      createdAt={review.createdAt}
      isMine={review.isMine}
      onDelete={() =>
        handleDeleteReview(review.reviewId)
      }
    />
  );
})}
      </div>

      {visibleCount < reviews.length && (
        <button
          className="review-more-button"
          onClick={() =>
            setVisibleCount((prev) => prev + 5)
          }
        >
          리뷰 더보기 ▼ ( 총 {reviews.length}개 )
        </button>
      )}

      {isModalOpen && (
        <ReviewModal
            clubId={clubId}
            clubName={clubName}
            onClose={() =>
                setIsModalOpen(false)
            }
            onSuccess={fetchReviews}
        />
      )}
    </section>
  );
}

export default ReviewSection;

