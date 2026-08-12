import { useState } from 'react';

import CategoryBadge from '../../common/Badge/CategoryBadge/CategoryBadge';
import RecruitStatusBadge from '../../common/Badge/RecruitStatusBadge/RecruitStatusBadge';

import './MatchingClubCard.css';

function ClubImage({ imageUrl, title }) {
  const [failedImageUrl, setFailedImageUrl] = useState('');

  const shouldShowImage =
    imageUrl && failedImageUrl !== imageUrl;

  if (shouldShowImage) {
    return (
      <img
        className="matching-club-card-image"
        src={imageUrl}
        onError={() => setFailedImageUrl(imageUrl)}
        alt={`${title} 이미지`}
      />
    );
  }

  return (
    <div className="matching-club-card-placeholder">
      image
    </div>
  );
}

function MatchingClubCard({
  club,
  selected,
  selectedColor,
  onToggle,
}) {
  const cardTitle = club.clubName || '동아리 이름 없음';
  const cardCategory = club.categoryName || '기타';

  const cardImageUrl =
    club.profileImageUrl ||
    club.profileImage ||
    '';

  const recruitStartDate =
    club.recruitStartAt || club.recruitPeriod?.start;

  const recruitEndDate =
    club.recruitEndAt || club.recruitPeriod?.end;

  const getRecruitStatusByDate = (startDate, endDate) => {
    if (!startDate || !endDate) return '마감';

    const now = new Date();

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return '마감';
    }

    end.setHours(23, 59, 59, 999);

    return now >= start && now <= end
      ? '모집중'
      : '마감';
  };

  const statusToDisplay = getRecruitStatusByDate(
    recruitStartDate,
    recruitEndDate
  );

  const handleClick = () => {
    onToggle?.(club.clubId);
  };

  return (
    <button
      type="button"
      className={`matching-club-card${
        selected ? ' matching-club-card--selected' : ''
      }`}
      onClick={handleClick}
      style={{
        '--matching-club-color': selectedColor,
      }}
    >
      <ClubImage
        imageUrl={cardImageUrl}
        title={cardTitle}
      />

      <div className="matching-club-card-main">
        <div className="matching-club-card-badges">
          <CategoryBadge>
            {cardCategory}
          </CategoryBadge>

          <RecruitStatusBadge
          status={statusToDisplay}
        />
        </div>

        <h3>{cardTitle}</h3>
      </div>

      <div
        className={`matching-club-card-check${
          selected
            ? ' matching-club-card-check--selected'
            : ''
        }`}
        aria-hidden="true"
      >
        {selected ? '✓' : ''}
      </div>
    </button>
  );
}

export default MatchingClubCard;