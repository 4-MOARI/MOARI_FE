import ReviewSection
from './Review/ReviewSection';

export default function ClubDetailPage() {

    const clubId =1;

  return (
    <div>

      {/* 상세페이지 리뷰 영역 */}
      <ReviewSection clubId={clubId} />

    </div>
  );
}