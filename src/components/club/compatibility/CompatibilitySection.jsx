
import { useEffect, useState } from 'react';
import AiRecommendedCombos, { AiComboSkeleton } from './AiRecommendedCombos';
import CustomCompatibilityPicker from './CustomCompatibilityPicker';
import CompatibilityReport from './CompatibilityReport';
import { analyzeCompatibility } from '../../../api/compatibilityApi';
import { LightbulbIcon } from './Icons';
import './CompatibilitySection.css';

const getClubId = (club) => club.clubId ?? club.id;
const getClubName = (club) => club.clubName ?? club.name ?? '이름 없음';

function toCombo(data) {
  if (!data) return null;
  return {
    title: `[AI 추천 최적 조합] ${data.selectedClubs.join(' + ')}`,
    metrics: [
      { label: '일정 충돌 여부', value: data.conflictScore, desc: data.conflictDesc },
      { label: '활동 시너지', value: data.synergyScore, desc: data.synergyDesc },
      { label: '병행 강도', value: data.intensityScore, desc: data.intensityDesc },
      { label: '예산 부담도', value: data.budgetScore, desc: data.budgetDesc },
    ],
    recommendScore: data.recommendationScore,
    recommendReason: data.recommendationReason,
  };
}

export default function CompatibilitySection({ clubs = [] }) {
  const [isAiOpen, setIsAiOpen] = useState(true);

  const [aiCombo, setAiCombo] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clubOptions = clubs.map((c) => ({
    id: getClubId(c),
    label: getClubName(c),
  }));

  useEffect(() => {
    const ids = clubOptions.map((c) => c.id).filter(Boolean);
    if (ids.length < 2 || ids.length > 4) return;

    let cancelled = false;

    (async () => {
      try {
        setAiLoading(true);
        setAiError(null);
        const res = await analyzeCompatibility(ids);
        if (cancelled) return;
        if (res.success) {
          setAiCombo(toCombo(res.data));
        } else {
          setAiError(res.error?.message || 'AI 추천 궁합 분석에 실패했습니다.');
        }
      } catch (err) {
        if (!cancelled) {
          setAiError(
            err.response?.data?.error?.message || 'AI 추천 궁합 분석 중 오류가 발생했습니다.'
          );
        }
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubs]);

  const toggleClub = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const handleAnalyze = async () => {
    if (selectedIds.length < 2 || selectedIds.length > 4) return;

    try {
      setLoading(true);
      setError(null);

      const res = await analyzeCompatibility(selectedIds);

      if (res.success) {
        setReport(res.data);
      } else {
        setError(res.error?.message || '궁합 분석에 실패했습니다.');
        setReport(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message || '궁합 분석 중 오류가 발생했습니다.'
      );
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="compat-section">
      <div className="compat-section__ai-header">
        <span className="compat-section__ai-title">
          <LightbulbIcon size={14} color="#EDB43A" />
          AI 추천 동아리 궁합 최적 조합 (2~4개 중 최적 조합 자동 선정)
        </span>

        <button
          type="button"
          className="compat-section__toggle-btn"
          onClick={() => setIsAiOpen((prev) => !prev)}
        >
          {isAiOpen ? '접기 ∧' : '펼치기 ∨'}
        </button>
      </div>

      {isAiOpen && (
        <>
          {aiLoading && (
            <div className="ai-combos-grid">
              <AiComboSkeleton />
            </div>
          )}
          {!aiLoading && aiError && <p className="compat-section__error">{aiError}</p>}
          {!aiLoading && !aiError && (
            <AiRecommendedCombos combos={aiCombo ? [aiCombo] : []} />
          )}
        </>
      )}

      <CustomCompatibilityPicker
        clubs={clubOptions}
        selectedIds={selectedIds}
        onToggle={toggleClub}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      {error && <p className="compat-section__error">{error}</p>}

      <CompatibilityReport data={report} loading={loading} />
    </section>
  );
}