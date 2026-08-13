//동아리 A?B?C?D 선택 + 궁합 보기 버튼
import { SearchIcon } from './Icons';
import './CustomCompatibilityPicker.css';

// clubs: [{ id, label }]
// selectedIds: number[]
export default function CustomCompatibilityPicker({
  clubs,
  selectedIds,
  onToggle,
  onAnalyze,
  loading,
}) {
  const canAnalyze = selectedIds.length >= 2 && selectedIds.length <= 4;

  return (
    <div className="custom-picker">
      <div className="custom-picker__title">
        <SearchIcon size={17} color="#0F172A" />
        <span>내가 직접 고르는 맞춤 궁합 (2 ~ 4개 선택)</span>
      </div>

      <div className="custom-picker__controls">
        <div className="custom-picker__clubs">
          {clubs.map((club) => {
            const selected = selectedIds.includes(club.id);
            return (
              <button
                key={club.id}
                type="button"
                className={selected ? 'club-chip club-chip--selected' : 'club-chip'}
                onClick={() => onToggle(club.id)}
              >
                {club.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="analyze-btn"
          disabled={!canAnalyze || loading}
          onClick={onAnalyze}
        >
          {loading ? '분석 중...' : '궁합보기'}
        </button>
      </div>
    </div>
  );
}