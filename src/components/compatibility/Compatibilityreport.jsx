//궁합 분석 결과 리포트
import { LightbulbIcon } from './Icons';
import StarRating from './StarRating';
import './CompatibilityReport.css';

// data: analyzeCompatibility() 응답의 data 필드
// {
//   selectedClubs, conflictScore, conflictDesc,
//   synergyScore, synergyDesc, intensityScore, intensityDesc,
//   budgetScore, budgetDesc, recommendationScore, recommendationReason, cautionNote,
// }
export default function CompatibilityReport({ data }) {
  if (!data) return null;

  const {
    selectedClubs,
    conflictScore,
    conflictDesc,
    synergyScore,
    synergyDesc,
    intensityScore,
    intensityDesc,
    budgetScore,
    budgetDesc,
    recommendationScore,
    recommendationReason,
    cautionNote,
  } = data;

  // 일정 충돌이 심한 경우(점수 낮음) 빨간색으로 강조
  const isSevereConflict = conflictScore <= 2;
  // 병행 추천 점수가 낮으면 배지도 위험 색으로 표시
  const badgeColor = recommendationScore <= 2 ? '#DC2626' : '#534AB7';

  return (
    <div className="compat-report">
      <div className="compat-report__inner">
        <p className="compat-report__title">
          <LightbulbIcon size={14} color="#EDB43A" />
          <span>
            다중 조합 분석 리포트: [{selectedClubs.join(' + ')} ({selectedClubs.length}개
            선택)]
          </span>
        </p>

        <div className="compat-report__row">
          <span className="compat-report__label">선택된 동아리 수</span>
          <span className="compat-report__value" style={{ color: '#7C3AED' }}>
            {selectedClubs.length}개 동아리 동시 병행 분석
          </span>
        </div>

        <div className="compat-report__row">
          <span className="compat-report__label">일정 충돌 여부</span>
          <span
            className="compat-report__value"
            style={{ color: isSevereConflict ? '#EF4444' : '#111827' }}
          >
            <StarRating
              score={conflictScore}
              color={isSevereConflict ? '#EF4444' : '#111827'}
              size={14}
            />{' '}
            ({conflictDesc})
          </span>
        </div>

        <div className="compat-report__row">
          <span className="compat-report__label">활동 시너지</span>
          <span className="compat-report__value">
            <StarRating score={synergyScore} size={14} /> ({synergyDesc})
          </span>
        </div>

        <div className="compat-report__row">
          <span className="compat-report__label">병행 강도 (주당 시간)</span>
          <span className="compat-report__value">
            <StarRating score={intensityScore} size={14} /> ({intensityDesc})
          </span>
        </div>

        <div className="compat-report__row">
          <span className="compat-report__label">예산 부담도</span>
          <span className="compat-report__value">
            <StarRating score={budgetScore} size={14} /> ({budgetDesc})
          </span>
        </div>

        <div className="compat-report__badge-row">
          <span className="compat-report__badge" style={{ background: badgeColor }}>
            병행 추천: <StarRating score={recommendationScore} color="#FFF" size={14} />
          </span>

          {cautionNote && (
            <span className="compat-report__caution">⚠ 주의사항: {cautionNote}</span>
          )}
        </div>

        <p className="compat-report__comment">
          <LightbulbIcon size={10} color="#707070" />
          <span>종합 분석 코멘트: {recommendationReason}</span>
        </p>
      </div>
    </div>
  );
}