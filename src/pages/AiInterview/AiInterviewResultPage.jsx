import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { completeAiInterview, getAiInterview, getAiInterviewResult } from '../../api/aiInterview';
import useAiInterviewStore from '../../store/useAiInterviewStore';
import './AiInterviewResultPage.css';

const STATUS_LABEL = {
  SUFFICIENT: '충분',
  NEEDS_IMPROVEMENT: '보완 필요',
};

export default function AiInterviewResultPage() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const store = useAiInterviewStore();

  const [result, setResult] = useState(null);
  const [clubId, setClubId] = useState(store.clubId ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let resultRes;

        try {
          resultRes = await getAiInterviewResult(Number(interviewId));
        } catch (resultError) {
          await completeAiInterview(Number(interviewId));
          resultRes = await getAiInterviewResult(Number(interviewId));
        }

        if (ignore) return;
        setResult(resultRes.data.data);
        store.setResult(resultRes.data.data);

        // clubId는 result 응답에 없어서, 없으면 interview 조회로 보충
        if (!clubId) {
          const interviewRes = await getAiInterview(Number(interviewId));
          if (!ignore) setClubId(interviewRes.data.data.clubId);
        }
      } catch (err) {
        if (!ignore) setError('결과를 불러오지 못했어요.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  if (isLoading) {
    return (
      <div className="ai-interview-result">
        <p className="ai-interview-result__status">불러오는 중이에요...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="ai-interview-result">
        <p className="ai-interview-result__status ai-interview-result__status--error">
          {error ?? '결과를 찾을 수 없어요.'}
        </p>
      </div>
    );
  }

  const sufficientItems = result.evaluationItems.filter((i) => i.status === 'SUFFICIENT');
  const needsImprovementItems = result.evaluationItems.filter(
    (i) => i.status === 'NEEDS_IMPROVEMENT'
  );

  return (
    <div className="ai-interview-result">
      <h1 className="ai-interview-result__title">AI 모의면접 결과</h1>
      <p className="ai-interview-result__subtitle">
        점수보다 답변에서 확인된 근거와 개선 방향을 중심으로 정리했어요.
      </p>

      <div className="ai-interview-result__grid">
        <div className="ai-interview-result__card">
          <h2 className="ai-interview-result__card-title">한눈에 보는 결과</h2>
          <p className="ai-interview-result__caption">답변에서 근거가 확인된 역량</p>
          <p className="ai-interview-result__ratio">
            {sufficientItems.length} / {result.evaluationItems.length}
          </p>
          <p className="ai-interview-result__caption">구체적인 행동 사례가 확인된 역량입니다.</p>

          {sufficientItems.length > 0 && (
            <div className="ai-interview-result__box ai-interview-result__box--good">
              <p className="ai-interview-result__box-title">잘 드러난 역량</p>
              <p className="ai-interview-result__box-heading">
                {sufficientItems.map((i) => i.label).join(' · ')}
              </p>
              {result.strengths[0] && (
                <p className="ai-interview-result__box-desc">{result.strengths[0]}</p>
              )}
            </div>
          )}

          {needsImprovementItems.length > 0 && (
            <div className="ai-interview-result__box ai-interview-result__box--bad">
              <p className="ai-interview-result__box-title">보완이 필요한 역량</p>
              <p className="ai-interview-result__box-heading">
                {needsImprovementItems.map((i) => i.label).join(' · ')}
              </p>
              {result.improvements[0] && (
                <p className="ai-interview-result__box-desc">{result.improvements[0]}</p>
              )}
            </div>
          )}

          <p className="ai-interview-result__note">※ 합격 확률은 예측하지 않습니다.</p>
        </div>

        <div className="ai-interview-result__card">
          <h2 className="ai-interview-result__card-title">항목별 분석</h2>
          <p className="ai-interview-result__caption">
            각 역량을 뒷받침하는 답변 근거가 확인됐는지를 보여줍니다.
          </p>

          <div className="ai-interview-result__items">
            {result.evaluationItems.map((item) => (
              <div key={item.key} className="ai-interview-result__item-row">
                <span className="ai-interview-result__item-label">{item.label}</span>
                <span
                  className={
                    item.status === 'SUFFICIENT'
                      ? 'ai-interview-result__tag ai-interview-result__tag--good'
                      : 'ai-interview-result__tag ai-interview-result__tag--bad'
                  }
                >
                  {STATUS_LABEL[item.status] ?? item.status}
                </span>
              </div>
            ))}
          </div>

          <p className="ai-interview-result__evidence-title">답변에서 확인된 근거</p>
          <p className="ai-interview-result__evidence-text">{result.overallSummary}</p>

          <div className="ai-interview-result__actions">
            <button
              type="button"
              className="ai-interview-result__btn ai-interview-result__btn--secondary"
              onClick={() => navigate(clubId ? `/club/${clubId}` : '/')}
            >
              동아리 상세로 돌아가기
            </button>
            <button
              type="button"
              className="ai-interview-result__btn ai-interview-result__btn--primary"
              onClick={() => navigate(`/ai-interview/${interviewId}/feedback`)}
            >
              질문별 상세 피드백 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
