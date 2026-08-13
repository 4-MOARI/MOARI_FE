
import { LightbulbIcon } from './Icons';
import StarRating from '../../common/StarRating/StarRating';
import './CompatibilityReport.css';

export default function CompatibilityReport({ data, loading }) {
  if (loading) return <ReportSkeleton />;
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

  const isSevereConflict = conflictScore <= 2;
  const badgeColor = recommendationScore <= 2 ? '#DC2626' : '#534AB7';

  return (
    <div className="compat-report">
      <div className="compat-report__inner">
        <p className="compat-report__title">
          <LightbulbIcon size={14} color="#EDB43A" />
          <span>
            다중 조합 분석 리포트: [{selectedClubs.join(' + ')} ({selectedClubs.length}개 선택)]
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
          <span className="compat-report__value" title={conflictDesc}>
            <StarRating
              value={conflictScore}
              color={isSevereConflict ? '#EF4444' : '#111827'}
              size={14}
              showScore={false}
            />
            <span className="compat-report__value-desc" style={{ color: isSevereConflict ? '#EF4444' : '#111827' }}>
              ({conflictDesc})
            </span>
          </span>
          
        </div>

        <div className="compat-report__row">
          <span className="compat-report__label">활동 시너지</span>
          <span className="compat-report__value" title={synergyDesc}>
            <StarRating value={synergyScore} size={14} showScore={false} />
            <span className="compat-report__value-desc">({synergyDesc})</span>
          </span>
        </div>

        <div className="compat-report__row">
          <span className="compat-report__label">병행 강도</span>
          <span className="compat-report__value" title={intensityDesc}>
            <StarRating value={intensityScore} size={14} showScore={false} />
            <span className="compat-report__value-desc">({intensityDesc})</span>
          </span>
        </div>

        <div className="compat-report__row">
          <span className="compat-report__label">예산 부담도</span>
          <span className="compat-report__value" title={budgetDesc}>
            <StarRating value={budgetScore} size={14} showScore={false} />
            <span className="compat-report__value-desc">({budgetDesc})</span>
          </span>
        </div>

        <div className="compat-report__badge-row">
          <span className="compat-report__badge" style={{ '--badge-color': badgeColor }}>
            병행 추천: <StarRating value={recommendationScore} color={badgeColor} size={14} showScore={false} />
          </span>

          {/* cautionNote는 백엔드가 항상 채워서 내려주므로(없으면 "주의사항 없습니다.") 항상 노출 */}
          <span
            className="compat-report__caution"
            style={{ color: cautionNote === '주의사항 없습니다.' ? '#4b5563' : '#991b1b' }}
            title={`주의사항: ${cautionNote}`}
          >
            ⚠ 주의사항: {cautionNote}
          </span>
        </div>

        <p className="compat-report__comment" title={recommendationReason}>
          <LightbulbIcon size={10} color="#707070" />
          <span className="compat-report__comment-text">종합 분석 코멘트: {recommendationReason}</span>
        </p>
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="compat-report" aria-hidden="true">
      <div className="compat-report__inner">
        <div className="skeleton-block" style={{ width: '55%', height: 18, marginBottom: 4 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="compat-report__row" key={i}>
            <div className="skeleton-block" style={{ width: 140, height: 14, flexShrink: 0 }} />
            <div className="skeleton-block" style={{ width: '40%', height: 14 }} />
          </div>
        ))}
        <div className="skeleton-block" style={{ width: 141, height: 32, borderRadius: 16 }} />
      </div>
    </div>
  );
}