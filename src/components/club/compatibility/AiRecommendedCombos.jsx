//ai추천 꿀조합 1개
import { CheckIcon, LightbulbIcon } from './Icons';
import StarRating from '../../common/StarRating/StarRating';
import './AiRecommendedCombos.css';

export default function AiRecommendedCombos({ combos }) {
  return (
    <div className="ai-combos-grid">
      {combos.map((combo, idx) => (
        <div className="ai-combo-card" key={combo.title ?? idx}>
          <div className="ai-combo-card__header">
            <CheckIcon size={24} />
            <h3 className="ai-combo-card__title" title={combo.title}>
              {combo.title}
            </h3>
          </div>

          <div className="ai-combo-card__metrics">
            {combo.metrics.map((m) => (
              <div className="ai-combo-card__metric-row" key={m.label}>
                <span className="ai-combo-card__metric-label">{m.label}</span>
                <span className="ai-combo-card__metric-value">
                  <StarRating value={m.value} color="#111827" size={13} showScore={false} />
                  <span className="ai-combo-card__desc" title={m.desc}>
                    ({m.desc})
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div
            className="ai-combo-card__badge"
            style={{ background: combo.badgeColor  }}
          >
            병행 추천 <StarRating value={combo.recommendScore} color="#B45309" size={13} showScore={false} />
          </div>

          <p className="ai-combo-card__reason" title={combo.recommendReason}>
            <LightbulbIcon size={10} color="#EDB43A" />
            <span className="ai-combo-card__reason-text">추천이유: {combo.recommendReason}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

// AI 분석 로딩 중 보여줄 스켈레톤 카드
export function AiComboSkeleton() {
  return (
    <div className="ai-combo-card ai-combo-card--skeleton" aria-hidden="true">
      <div className="ai-combo-card__header">
        <div className="skeleton-block" style={{ width: 24, height: 24, borderRadius: '50%' }} />
        <div className="skeleton-block" style={{ width: '65%', height: 18 }} />
      </div>

      <div className="ai-combo-card__metrics">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="ai-combo-card__metric-row" key={i}>
            <div className="skeleton-block" style={{ width: 96, height: 14, flexShrink: 0 }} />
            <div className="skeleton-block" style={{ width: '60%', height: 14, marginLeft: 12 }} />
          </div>
        ))}
      </div>

      <div className="skeleton-block" style={{ width: 131, height: 28, borderRadius: 14, marginBottom: 14 }} />
      <div className="skeleton-block" style={{ width: '85%', height: 12 }} />
    </div>
  );
}
