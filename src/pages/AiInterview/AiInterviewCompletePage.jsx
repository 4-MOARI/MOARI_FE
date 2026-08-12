import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { completeAiInterview } from '../../api/aiInterview';
import './AiInterviewCompletePage.css';

export default function AiInterviewCompletePage() {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const complete = async () => {
      try {
        await completeAiInterview(Number(interviewId));
        if (!ignore) setIsDone(true);
      } catch (err) {
        if (!ignore) setError('결과 생성에 실패했어요. 다시 시도해주세요.');
      }
    };

    complete();

    return () => {
      ignore = true;
    };
  }, [interviewId]);

  return (
    <div className="ai-interview-complete">
      <h1 className="ai-interview-complete__title">면접이 완료됐어요</h1>
      <p className="ai-interview-complete__subtitle">
        {error ? '문제가 발생했어요.' : isDone ? '결과 생성이 완료되었습니다.' : '결과를 생성하고 있어요. 잠시만 기다려주세요.'}
      </p>

      <div className="ai-interview-complete__card">
        {error ? (
          <>
            <div className="ai-interview-complete__icon ai-interview-complete__icon--error">!</div>
            <p className="ai-interview-complete__message">{error}</p>
            <button
              type="button"
              className="ai-interview-complete__btn"
              onClick={() => window.location.reload()}
            >
              다시 시도하기
            </button>
          </>
        ) : !isDone ? (
          <>
            <div className="ai-interview-complete__spinner" />
            <p className="ai-interview-complete__message">AI 면접 결과를 생성하고 있어요</p>
            <p className="ai-interview-complete__hint">잠시만 기다려주세요.</p>
          </>
        ) : (
          <>
            <div className="ai-interview-complete__icon ai-interview-complete__icon--success">✓</div>
            <p className="ai-interview-complete__message">결과 생성이 완료되었습니다.</p>
            <p className="ai-interview-complete__hint">AI 모의면접 결과를 확인해보세요.</p>
            <button
              type="button"
              className="ai-interview-complete__btn"
              onClick={() => navigate(`/ai-interview/${interviewId}/result`)}
            >
              결과 확인하러 가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}