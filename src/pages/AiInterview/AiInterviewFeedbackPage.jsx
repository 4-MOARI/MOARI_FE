import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAiInterviewFeedback } from '../../api/aiInterview';
import useAiInterviewStore from '../../store/useAiInterviewStore';
import './AiInterviewFeedbackPage.css';

const STATUS_LABEL = {
  SUFFICIENT: '충분',
  NEEDS_IMPROVEMENT: '보완 필요',
};

export default function AiInterviewFeedbackPage() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const store = useAiInterviewStore();

  const [feedbacks, setFeedbacks] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const res = await getAiInterviewFeedback(Number(interviewId));
        if (ignore) return;
        setFeedbacks(res.data.data.feedbacks);
        store.setFeedback(res.data.data.feedbacks);
      } catch (err) {
        if (!ignore) setError('피드백을 불러오지 못했어요.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchFeedback();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  if (isLoading) {
    return (
      <div className="ai-interview-feedback">
        <p className="ai-interview-feedback__status">불러오는 중이에요...</p>
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="ai-interview-feedback">
        <p className="ai-interview-feedback__status ai-interview-feedback__status--error">
          {error ?? '피드백을 찾을 수 없어요.'}
        </p>
      </div>
    );
  }

  const selected = feedbacks[selectedIndex];

  return (
    <div className="ai-interview-feedback">
      <h1 className="ai-interview-feedback__title">질문별 상세 피드백</h1>
      <p className="ai-interview-feedback__subtitle">
        잘한 점, 빠진 내용, 답변 보완 방향을 질문별로 확인해보세요.
      </p>

      <div className="ai-interview-feedback__grid">
        <div className="ai-interview-feedback__list-card">
          <h2 className="ai-interview-feedback__list-title">질문 목록</h2>
          <div className="ai-interview-feedback__list">
            {feedbacks.map((fb, idx) => (
              <button
                key={fb.turnId}
                type="button"
                className={
                  idx === selectedIndex
                    ? 'ai-interview-feedback__list-item ai-interview-feedback__list-item--active'
                    : 'ai-interview-feedback__list-item'
                }
                onClick={() => setSelectedIndex(idx)}
              >
                <span>{fb.questionIndex}. 질문 {fb.questionIndex}</span>
                <span
                  className={
                    fb.status === 'SUFFICIENT'
                      ? 'ai-interview-feedback__tag ai-interview-feedback__tag--good'
                      : 'ai-interview-feedback__tag ai-interview-feedback__tag--bad'
                  }
                >
                  {STATUS_LABEL[fb.status] ?? fb.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="ai-interview-feedback__detail-card">
          <span className="ai-interview-feedback__badge">질문 {selected.questionIndex}</span>
          <h2 className="ai-interview-feedback__question">{selected.questionText}</h2>

          <p className="ai-interview-feedback__section-label">내 답변</p>
          <div className="ai-interview-feedback__answer-box">{selected.answerText}</div>

          <div className="ai-interview-feedback__points-grid">
            <div className="ai-interview-feedback__points-box ai-interview-feedback__points-box--good">
              <p className="ai-interview-feedback__points-title">잘한 점</p>
              {selected.goodPoints.map((point, i) => (
                <p key={i}>{point}</p>
              ))}
            </div>
            <div className="ai-interview-feedback__points-box ai-interview-feedback__points-box--bad">
              <p className="ai-interview-feedback__points-title">빠진 내용</p>
              {selected.missingPoints.map((point, i) => (
                <p key={i}>{point}</p>
              ))}
            </div>
          </div>

          <p className="ai-interview-feedback__section-label">답변 보완 방향</p>
          <div className="ai-interview-feedback__direction-box">
            {selected.improvementDirection}
          </div>

          <div className="ai-interview-feedback__nav">
            <button
              type="button"
              className="ai-interview-feedback__nav-btn"
              onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
              disabled={selectedIndex === 0}
            >
              이전 질문
            </button>
            <button
              type="button"
              className="ai-interview-feedback__nav-btn"
              onClick={() => navigate(`/ai-interview/${interviewId}/result`)}
            >
              모의 면접 결과로 돌아가기
            </button>
            <button
              type="button"
              className="ai-interview-feedback__nav-btn ai-interview-feedback__nav-btn--primary"
              onClick={() => setSelectedIndex((i) => Math.min(feedbacks.length - 1, i + 1))}
              disabled={selectedIndex === feedbacks.length - 1}
            >
              다음 질문
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}