import { useState } from 'react';

import ReviewModal from './ReviewModal';

import './ReviewModal.css';

export default function ReviewSection() {

  // 모달 상태
  const [isModalOpen, setIsModalOpen]
    = useState(false);

  // 가짜 데이터
  const club = {
    id: 1,
    name: '알고리즘 연구회',
  };

  return (
    <div className="review-section">

      {/* 리뷰 작성 버튼 */}
      <button
        className="open-review-btn"
        onClick={() => setIsModalOpen(true)}
      >
        + 리뷰 작성하기
      </button>

      {/* 리뷰 모달 */}
      {
        isModalOpen && (
          <ReviewModal
            clubId={club.id}
            clubName={club.name}

            onClose={() =>
              setIsModalOpen(false)
            }
          />
        )
      }
    </div>
  );
}