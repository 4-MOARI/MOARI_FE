//최상위. 접기/펼치기 상태, 동아리 선택 상태, API 호출을 관리하고 아래 3개를 조립함

import { useState } from 'react';
import AiRecommendedCombos from './AiRecommendedCombos';
import CustomCompatibilityPicker from './CustomCompatibilityPicker';
import CompatibilityReport from './CompatibilityReport';
import { analyzeCompatibility } from '../../../api/compatibilityApi';
import { LightbulbIcon } from './Icons';
import './CompatibilitySection.css';

// TODO: AI 추천 꿀조합은 명세서에 별도 조회 API가 없어서 우선 예시 데이터를 사용합니다.
// 백엔드에 "AI 추천 궁합 꿀조합" 조회 API가 추가되면 이 부분을 useEffect + fetch로 교체하세요.
const DEFAULT_AI_COMBOS = [
  {
    title: '[2개 조합] A동아리 + C동아리',
    metrics: [
      { label: '일정 충돌 여부', score: 5, desc: '거의 없음' },
      { label: '활동 시너지', score: 4, desc: '학술 + 친목 균형' },
      { label: '병행 강도', score: 3, desc: '보통' },
      { label: '예산 부담도', score: 4, desc: '보통' },
    ],
    recommendScore: 5,
    recommendReason: '시간대 충돌이 없고 역량 성장에 최적입니다.',
  },
  {
    title: '[3개 조합] A + B + C 동아리',
    metrics: [
      { label: '일정 충돌 여부', score: 3, desc: '일부 겹침' },
      { label: '활동 시너지', score: 5, desc: '기획+학술+친목 극대화' },
      { label: '병행 강도', score: 5, desc: '높음' },
      { label: '예산 부담도', score: 3, desc: '높은 회비' },
    ],
    recommendScore: 4,
    recommendReason: '트리플 활동으로 스펙업에 좋으나 체력 안배 필수!',
  },
];

// TODO: 실제 서비스에서는 사용자가 가입/관심 등록한 동아리 목록을 props나 API로 받아와야 합니다.
const CLUB_OPTIONS = [
  { id: 1, label: '동아리 A' },
  { id: 2, label: '동아리 B' },
  { id: 3, label: '동아리 C' },
  { id: 4, label: '동아리 D' },
];

export default function CompatibilitySection() {
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleClub = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 4) return prev; // 최대 4개까지만 선택 가능
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
      {/* AI 추천 동아리 궁합 꿀조합 */}
      <div className="compat-section__ai-header">
        <span className="compat-section__ai-title">
          <LightbulbIcon size={14} color="#EDB43A" />
          AI 추천 동아리 궁합 꿀조합 (2~4개 병행 추천)
        </span>

        <button
          type="button"
          className="compat-section__toggle-btn"
          onClick={() => setIsAiOpen((prev) => !prev)}
        >
          {isAiOpen ? '접기 ∧' : '펼치기 ∨'}
        </button>
      </div>

      {isAiOpen && <AiRecommendedCombos combos={DEFAULT_AI_COMBOS} />}

      {/* 내가 직접 고르는 맞춤 궁합 */}
      <CustomCompatibilityPicker
        clubs={CLUB_OPTIONS}
        selectedIds={selectedIds}
        onToggle={toggleClub}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      {error && <p className="compat-section__error">{error}</p>}

      {/* 다중 조합 분석 리포트 */}
      <CompatibilityReport data={report} />
    </section>
  );
}