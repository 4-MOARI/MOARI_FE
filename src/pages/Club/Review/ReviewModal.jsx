import { createReview } from '../../../api/reviewApi';
// (연동완)
import { useState } from 'react';
import DiscreteSlider from './DiscreteSlider';
import './ReviewModal.css';

// "이런 점이 좋았어요 / 특징이에요" 복수 선택 태그 목록
const TAG_OPTIONS = [
  { id: 1, name: '친목 많아요' },
  { id: 2, name: '개인적이에요' },
  { id: 3, name: '뒷풀이 잦아요' },
  { id: 4, name: '추가비용 있어요' },
  { id: 5, name: '소규모예요' },
  { id: 6, name: '체계적이에요' },
];

export default function ReviewModal({ clubId, clubName, onClose, onSuccess }) {
  // 기본 별점 4점
  const [rating, setRating] = useState(4);

  // 리뷰 입력값 저장
  const [content, setContent] = useState('');

  // 활동 강도 / 친목 비중 (1~5, 뚝뚝 끊기는 슬라이더)
  const [activityIntensity, setActivityIntensity] = useState(3);
  const [friendshipRatio, setFriendshipRatio] = useState(3);

  // 이런 점이 좋았어요 / 특징이에요 (복수 선택)
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  const toggleTag = (id) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  // 리뷰 등록 버튼 클릭
  const handleSubmit = async () => {
    // 빈 입력 방지
    if (!content.trim()) {
      alert('리뷰를 입력해주세요.');
      return;
    }
    // 최소 10자 이상 (플레이스홀더 안내와 동일한 조건)
    if (content.trim().length < 10) {
      alert('리뷰는 최소 10자 이상 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      const reviewData = {
        rating,
        content,
        activityRating: activityIntensity,
        sociabilityRating: friendshipRatio,
        keywordIds: selectedTagIds,
      };

      console.log('리뷰 등록 keywordIds =', selectedTagIds);
      console.log('리뷰 등록 keywordIds JSON =', JSON.stringify(selectedTagIds));

      await createReview(clubId, {
        rating,
        content,
        activityRating: activityIntensity,
        sociabilityRating: friendshipRatio,
        keywordIds: selectedTagIds,
      });

      alert('리뷰 등록 완료');

      onSuccess?.();

      // 모달 닫기
      onClose();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data?.error?.message ||
          '리뷰 등록 실패'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 모달 뒤 회색 배경
    <div className="review-overlay" onClick={onClose}>
      {/* 모달 본체 */}
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        {/* 제목 */}
        <h2 className="review-title">리뷰 작성</h2>

        {/* 동아리 이름 */}
        <p className="review-club-name">{clubName}</p>

        {/* 전체 만족도 + 활동 강도 / 친목 비중 */}
        <div className="review-top-row">
          {/* 전체 만족도 */}
          <div className="review-field">
            <p className="review-field-label">전체 만족도</p>
            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? 'star filled' : 'star empty'}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* 활동 강도 / 친목 비중 슬라이더 */}
          <div className="review-field review-field--sliders">
            <div className="review-slider-row">
              <p className="review-field-label">
                활동 강도 <span className="review-slider-value">{activityIntensity}</span>
              </p>
              <DiscreteSlider value={activityIntensity} onChange={setActivityIntensity} />
            </div>

            <div className="review-slider-row">
              <p className="review-field-label">
                친목 비중 <span className="review-slider-value">{friendshipRatio}</span>
              </p>
              <DiscreteSlider value={friendshipRatio} onChange={setFriendshipRatio} />
            </div>
          </div>
        </div>

        {/* 이런 점이 좋았어요 / 특징이에요 */}
        <div className="review-tags-section">
          <p className="review-tags-title">
            이런 점이 좋았어요 / 특징이에요{' '}
            <span className="review-tags-subtitle">(복수 선택)</span>
          </p>

          <div className="review-tags-grid">
            {TAG_OPTIONS.map((tag) => {
              const selected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  className={selected ? 'tag-chip tag-chip--selected' : 'tag-chip'}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 리뷰 입력창 */}
        <textarea
          className="review-textarea"
          placeholder="동아리 활동에 대한 솔직한 리뷰를 남겨주세요. (최소 10자 이상)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 하단 버튼 영역 */}
        <div className="review-buttons">
          {/* 취소 버튼 */}
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>

          {/* 등록 버튼 */}
          <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
