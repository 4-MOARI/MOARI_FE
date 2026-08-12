import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAiInterview, submitAiInterviewAnswer, endAiInterview } from '../../api/aiInterview';
import useAiInterviewStore from '../../store/useAiInterviewStore';
import ProgressSteps from '../../components/ai-interview/ProgressSteps';
import { getQuestionSourceLabel } from '../../components/ai-interview/questionSourceLabel';
import './AiInterviewSessionPage.css';

export default function AiInterviewSessionPage() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const store = useAiInterviewStore();
  const {
    clubId,
    questionCount,
    currentQuestionIndex,
    currentQuestion,
    turns,
    status,
  } = store;

  const [isLoading, setIsLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 새로고침/직접 진입 시 세션 상태 복원
  useEffect(() => {
    const numericId = Number(interviewId);

    if (store.interviewId === numericId) {
      setIsLoading(false);
      return;
    }

    let ignore = false;

    const hydrate = async () => {
      try {
        setIsLoading(true);
        const res = await getAiInterview(numericId);
        if (ignore) return;
        store.hydrateFromInterview(res.data.data);
      } catch (err) {
        if (!ignore) setError('면접 정보를 불러오지 못했어요.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    hydrate();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  // 이미 완료/종료된 세션이면 알맞은 곳으로 이동
  useEffect(() => {
    if (status === 'COMPLETED') {
      navigate(`/ai-interview/${interviewId}/result`, { replace: true });
    } else if (status === 'ENDED' && clubId) {
      navigate(`/club/${clubId}`, { replace: true });
    }
  }, [status, clubId, interviewId, navigate]);

  const handleSubmit = async () => {
    if (isSubmitting || !answerText.trim() || !currentQuestion) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await submitAiInterviewAnswer(Number(interviewId), {
        turnId: currentQuestion.turnId,
        answerText: answerText.trim(),
      });
      const { isCompleted, nextQuestion } = res.data.data;

      store.submitAnswerLocally({
        answeredTurn: currentQuestion,
        answerText: answerText.trim(),
        nextQuestion,
        isCompleted,
      });

      setAnswerText('');

      if (isCompleted) {
        navigate(`/ai-interview/${interviewId}/complete`);
      }
    } catch (err) {
      setError('답변 제출에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnd = async () => {
    const confirmed = window.confirm('면접을 종료할까요? 지금까지의 답변은 저장돼요.');
    if (!confirmed) return;

    try {
      await endAiInterview(Number(interviewId));
      navigate(clubId ? `/club/${clubId}` : '/');
    } catch (err) {
      setError('면접 종료에 실패했어요.');
    }
  };

  if (isLoading) {
    return (
      <div className="ai-interview-session">
        <p className="ai-interview-session__status">불러오는 중이에요...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="ai-interview-session">
        <p className="ai-interview-session__status ai-interview-session__status--error">
          {error ?? '진행할 질문을 찾을 수 없어요.'}
        </p>
      </div>
    );
  }

  const isFollowUp = currentQuestion.questionType === 'FOLLOW_UP';

  return (
    <div className="ai-interview-session">
      <h1 className="ai-interview-session__title">
        {isFollowUp ? '꼬리질문 · 근거 추적' : 'AI 모의면접'}
      </h1>
      <p className="ai-interview-session__subtitle">
        {isFollowUp
          ? '이전 답변에서 근거가 부족한 부분을 자연스럽게 다시 묻습니다.'
          : '질문과 답변이 위에서 아래로 이어지는 채팅형 면접입니다.'}
      </p>

      <div className="ai-interview-session__card">
        <div className="ai-interview-session__header">
          <span className="ai-interview-session__header-title">AI 모의면접</span>
          <button
            type="button"
            className="ai-interview-session__end-btn"
            onClick={handleEnd}
          >
            종료
          </button>
        </div>

        <ProgressSteps total={questionCount ?? 5} current={currentQuestionIndex ?? 1} />

        <div className="ai-interview-session__body">
          {!isFollowUp &&
            turns.map((turn) => (
              <div key={turn.turnId} className="ai-interview-session__turn">
                <p className="ai-interview-session__speaker">면접관 AI</p>
                <div className="ai-interview-session__bubble ai-interview-session__bubble--ai">
                  {turn.questionText}
                </div>
                <div className="ai-interview-session__badge">
                  {getQuestionSourceLabel(turn)}
                </div>

                {turn.answerText && (
                  <>
                    <p className="ai-interview-session__speaker ai-interview-session__speaker--me">나</p>
                    <div className="ai-interview-session__bubble ai-interview-session__bubble--me">
                      {turn.answerText}
                    </div>
                  </>
                )}
              </div>
            ))}

          <div className="ai-interview-session__turn">
            <p className="ai-interview-session__speaker">면접관 AI</p>
            <div className="ai-interview-session__bubble ai-interview-session__bubble--ai">
              {currentQuestion.questionText}
            </div>
            <div className="ai-interview-session__badge">
              {getQuestionSourceLabel(currentQuestion)}
            </div>

            {isFollowUp && (
              <div className="ai-interview-session__analysis">
                <p className="ai-interview-session__analysis-title">AI 분석 포인트</p>
                <ul>
                  <li>주도적 역할의 근거 확인</li>
                  <li>행동 이후 결과 확인</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {error && <p className="ai-interview-session__inline-error">{error}</p>}

        <div className="ai-interview-session__input-row">
          <input
            type="text"
            className="ai-interview-session__input"
            placeholder="답변을 입력해주세요."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="ai-interview-session__submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || !answerText.trim()}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}