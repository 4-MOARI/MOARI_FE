import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAiInterviewOptions, createAiInterview } from '../../api/aiInterview';
import useAiInterviewStore from '../../store/useAiInterviewStore';
import './AiInterviewSetupPage.css';

export default function AiInterviewSetupPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const setInterview = useAiInterviewStore((state) => state.setInterview);

  const [options, setOptions] = useState(null);
  const [questionCount, setQuestionCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getAiInterviewOptions(clubId);
        const data = res.data.data;
        if (ignore) return;
        setOptions(data);
        setQuestionCount(data.defaultQuestionCount);
      } catch (err) {
        if (!ignore) setError('설정 정보를 불러오지 못했어요. 다시 시도해주세요.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchOptions();

    return () => {
      ignore = true;
    };
  }, [clubId]);

  const handleStart = async () => {
    if (isSubmitting || !questionCount) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await createAiInterview({
        clubId: Number(clubId),
        questionCount,
      });
      const interview = res.data.data;

      setInterview(interview);
      navigate(`/ai-interview/${interview.interviewId}`);
    } catch (err) {
      setError('면접을 시작하지 못했어요. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ai-interview-setup">
        <p className="ai-interview-setup__status">불러오는 중이에요...</p>
      </div>
    );
  }

  if (!options) {
    return (
      <div className="ai-interview-setup">
        <p className="ai-interview-setup__status ai-interview-setup__status--error">
          {error ?? '설정 정보를 불러오지 못했어요.'}
        </p>
      </div>
    );
  }

  return (
    <div className="ai-interview-setup">
      <h1 className="ai-interview-setup__title">AI 모의면접 설정</h1>
      <p className="ai-interview-setup__subtitle">
        질문 수와 면접 구성을 선택한 뒤 연습을 시작하세요.
      </p>

      <div className="ai-interview-setup__card">
        <section className="ai-interview-setup__section">
          <h2 className="ai-interview-setup__section-title">면접 대상</h2>
          <div className="ai-interview-setup__target">
            <p className="ai-interview-setup__target-name">{options.clubName}</p>
            <p className="ai-interview-setup__target-meta">
              {options.hasInterviewReviewData
                ? '면접 후기 데이터 반영됨'
                : '면접 후기 데이터 없음 · 동아리 정보 기반으로 질문이 생성돼요'}
            </p>
          </div>
        </section>

        <section className="ai-interview-setup__section">
          <h2 className="ai-interview-setup__section-title">질문 수</h2>
          <div className="ai-interview-setup__count-group">
            {options.questionCountOptions.map((count) => (
              <button
                key={count}
                type="button"
                className={
                  count === questionCount
                    ? 'ai-interview-setup__count-btn ai-interview-setup__count-btn--active'
                    : 'ai-interview-setup__count-btn'
                }
                onClick={() => setQuestionCount(count)}
              >
                {count}개
              </button>
            ))}
          </div>
        </section>

        {error && <p className="ai-interview-setup__inline-error">{error}</p>}

        <button
          type="button"
          className="ai-interview-setup__start-btn"
          onClick={handleStart}
          disabled={isSubmitting}
        >
          {isSubmitting ? '시작하는 중...' : '면접 연습 시작하기'}
        </button>
      </div>
    </div>
  );
}