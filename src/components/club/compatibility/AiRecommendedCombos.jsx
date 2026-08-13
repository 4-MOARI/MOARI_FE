//AI추천 꿀조합 카드 2개짜리 그리드
import { CheckIcon, LightbulbIcon } from './Icons';
import StarRating from '../../common/StarRating/StarRating';
import './AiRecommendedCombos.css';

// combos: [{
//   title: string,
//   metrics: [{ label: string, score: number(0~5), desc: string }],
//   badgeColor?: string,
//   recommendScore: number(0~5),
//   recommendReason: string,
// }]
export default function AiRecommendedCombos({ combos }) {
  return (
    <div className="ai-combos-grid">
      {combos.map((combo, idx) => (
        <div className="ai-combo-card" key={combo.title ?? idx}>
          <div className="ai-combo-card__header">
            <CheckIcon size={24} />
            <h3 className="ai-combo-card__title">{combo.title}</h3>
          </div>

          <div className="ai-combo-card__metrics">
            {combo.metrics.map((m) => (
              <div className="ai-combo-card__metric-row" key={m.label}>
                <span className="ai-combo-card__metric-label">{m.label}</span>
                <span className="ai-combo-card__metric-value">
                  <StarRating score={m.score} color="#111827" size={13} /> ({m.desc})
                </span>
              </div>
            ))}
          </div>

          <div
            className="ai-combo-card__badge"
            style={{ background: combo.badgeColor || '#F59E0B' }}
          >
            병행 추천 <StarRating score={combo.recommendScore} color="#FFF" size={13} />
          </div>

          <p className="ai-combo-card__reason">
            <LightbulbIcon size={10} color="#EDB43A" />
            <span>추천이유: {combo.recommendReason}</span>
          </p>
        </div>
      ))}
    </div>
  );
}