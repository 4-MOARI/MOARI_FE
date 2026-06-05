import { createReview } from '../../../api/reviewApi';
//(연동완)
import { useState } from 'react';
import './ReviewModal.css';

export default function ReviewModal({
    clubId,
    clubName,
    onClose,
    onSuccess,
}) {
  // 기본 별점 4점
  const [rating, setRating] = useState(4);

  // 리뷰 입력값 저장
  const [content, setContent] = useState('');

  //로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 리뷰 등록 버튼 클릭
  const handleSubmit = async () => {
    //빈 입력 방지
    if (!content.trim()) {
        alert('리뷰를 입력해주세요.');
        return;
    }
    try {
        setIsLoading(true);

        await createReview(
          clubId,
          {
            rating,
            content,
          }
        );

        alert('리뷰 등록 완료');

        onSuccess?.();

        //모달 달기
        onClose();
    } catch (error) {
        //console.error(error);

        //console.log(error.response);
        //console.log(error.response?.data);

        alert(
            error.response?.data?.message ||
            error.response?.data?.error?.message ||
            '리뷰 등록 실패');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    // 모달 뒤 회색 배경
    <div 
        className="review-overlay"
        onClick={onClose}>
      
      {/* 모달 본체 */}
      <div 
        className="review-modal"
        onClick={(e) => e.stopPropagation()}
        >

        {/* 제목 */}
        <h2 className="review-title">
          리뷰 작성
        </h2>

        {/* 동아리 이름 */}
        <p className="review-club-name">
          {clubName}
        </p>

        {/* 별점 */}
        <div className="review-stars">

          {/* 1~5 별 생성 */}
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              // 별 클릭 시 해당 점수로 변경
              onClick={() => setRating(star)}
              // 현재 rating 이하 별만 색 채움
              className={
                star <= rating
                  ? 'star filled'
                  : 'star empty'
              }
            >
              ★
            </span>
          ))}
        </div>

        

        {/* 리뷰 입력창 */}
        <textarea
          className="review-textarea"
          placeholder="리뷰를 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 하단 버튼 영역 */}
        <div className="review-buttons">

          {/* 취소 버튼 */}
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            취소
          </button>

          {/* 등록 버튼 */}
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {
                isLoading
                    ? '등록 중...'
                    : '등록'
            }
          </button>
        </div>

        
      </div>
    </div>
  );
}
