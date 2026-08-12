import { createReview } from '../../../api/reviewApi';
// (연동완)
import { useState } from 'react';
import DiscreteSlider from './DiscreteSlider';
import './ReviewModal.css';

// "이런 점이 좋았어요 / 특징이에요" 복수 선택 태그 목록
const TAG_OPTIONS = [
  '친목 많아요',
  '개인적이에요',
  '뒷풀이 잦아요',
  '추가비용 있어요',
  '소규모예요',
  '체계적이에요',
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
  const [selectedTags, setSelectedTags] = useState([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
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

      await createReview(clubId, {
        rating,
        content,
        activityIntensity,
        friendshipRatio,
        tags: selectedTags,
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
              <p className="review-field-label">활동 강도</p>
              <DiscreteSlider value={activityIntensity} onChange={setActivityIntensity} />
            </div>
            <div className="review-slider-row">
              <p className="review-field-label">친목 비중</p>
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
              const selected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={selected ? 'tag-chip tag-chip--selected' : 'tag-chip'}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
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
