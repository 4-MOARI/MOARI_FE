import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createInterviewReview } from '../../api/interviewReviewApi';
import './InterviewReviewPage.css';

const METHOD_OPTIONS = [
  { value: 'FACE_TO_FACE', label: '대면' },
  { value: 'ONLINE', label: '비대면' },
  { value: 'MIXED', label: '혼합' },
];

const TYPE_OPTIONS = [
  { value: 'INDIVIDUAL', label: '개인' },
  { value: 'GROUP', label: '그룹' },
  { value: 'MANY_TO_ONE', label: '다대일' },
  { value: 'MANY_TO_MANY', label: '다대다' },
];

const ATMOSPHERE_OPTIONS = [
  { value: 'COMFORTABLE', label: '😊 편안했어요' },
  { value: 'NORMAL', label: '😐 보통이었어요' },
  { value: 'PRESSURE', label: '😨 압박 면접이었어요' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'EASY', label: '쉬움' },
  { value: 'NORMAL', label: '보통' },
  { value: 'HARD', label: '어려움' },
];

const DURATION_OPTIONS = [
  { value: 'UNDER_10', label: '10분 미만' },
  { value: 'MIN_10_20', label: '10~20분' },
  { value: 'MIN_20_30', label: '20~30분' },
  { value: 'OVER_30', label: '30분 이상' },
];

const COMPETENCY_OPTIONS = [
  { value: 'MOTIVATION', label: '지원동기' },
  { value: 'TEAMWORK', label: '협업' },
  { value: 'PROJECT_EXPERIENCE', label: '프로젝트 경험' },
  { value: 'PROBLEM_SOLVING', label: '문제 해결' },
  { value: 'COMMUNICATION', label: '소통' },
  { value: 'RESPONSIBILITY', label: '책임감' },
  { value: 'ACTIVENESS', label: '적극성' },
  { value: 'LEADERSHIP', label: '리더십' },
  { value: 'MAJOR_KNOWLEDGE', label: '전공 지식' },
  { value: 'CREATIVITY', label: '창의성' },
];

export default function InterviewReviewPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const clubName = location.state?.clubName || '동아리';

  const [hasInterview, setHasInterview] = useState(true);
  const [interviewMethod, setInterviewMethod] = useState('FACE_TO_FACE');
  const [interviewType, setInterviewType] = useState('INDIVIDUAL');
  const [atmosphere, setAtmosphere] = useState('COMFORTABLE');
  const [difficulty, setDifficulty] = useState('NORMAL');
  const [duration, setDuration] = useState('MIN_10_20');
  const [competencies, setCompetencies] = useState([]);
  const [questions, setQuestions] = useState(['']);
  const [tip, setTip] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validQuestions = useMemo(
    () => questions.map((question) => question.trim()).filter(Boolean),
    [questions]
  );

  const toggleCompetency = (value) => {
    setCompetencies((prev) =>
      prev.includes(value)
        ? prev.filter((competency) => competency !== value)
        : [...prev, value]
    );
  };

  const updateQuestion = (index, value) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? value : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, '']);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) =>
      prev.length === 1
        ? ['']
        : prev.filter((_, questionIndex) => questionIndex !== index)
    );
  };

  const renderOptions = (options, selectedValue, onSelect, className = '') => (
    <div className="option-row">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`option-button ${className} ${
            selectedValue === option.value ? 'active' : ''
          }`}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (hasInterview && validQuestions.length === 0) {
      setError('면접에서 받은 질문을 1개 이상 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await createInterviewReview(Number(clubId), {
        hasInterview,
        interviewMethod: hasInterview ? interviewMethod : null,
        interviewType: hasInterview ? interviewType : null,
        atmosphere: hasInterview ? atmosphere : null,
        difficulty: hasInterview ? difficulty : null,
        duration: hasInterview ? duration : null,
        competencies: hasInterview ? competencies : [],
        questions: hasInterview ? validQuestions : [],
        tip: hasInterview ? tip.trim() || null : null,
      });

      alert('면접 후기가 등록되었습니다.');
      navigate(`/club/${clubId}`);
    } catch (submitError) {
      const message =
        submitError.response?.data?.error?.message ||
        '면접 후기 등록에 실패했습니다. 다시 시도해주세요.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="interview-review-page">
      <main className="interview-review-container">
        <div className="interview-review-heading">
          <h1>면접 후기 작성</h1>
          <p>실제 면접 경험을 공유해 다음 지원자에게 도움을 주세요.</p>
        </div>

        <section className="interview-review-card">
          <div className="club-name-box">
            <span className="club-name-label">동아리</span>
            <strong>{clubName}</strong>
          </div>

          <section className="interview-section">
            <h2>면접 여부 *</h2>
            <div className="option-row">
              <button
                type="button"
                className={`option-button ${hasInterview ? 'active' : ''}`}
                onClick={() => setHasInterview(true)}
              >
                면접 있음
              </button>
              <button
                type="button"
                className={`option-button ${!hasInterview ? 'active' : ''}`}
                onClick={() => setHasInterview(false)}
              >
                면접 없음
              </button>
            </div>
          </section>

          {hasInterview && (
            <>
              <section className="interview-section">
                <h2>면접 방식 *</h2>
                {renderOptions(METHOD_OPTIONS, interviewMethod, setInterviewMethod)}
              </section>

              <section className="interview-section">
                <h2>면접 형태 *</h2>
                {renderOptions(TYPE_OPTIONS, interviewType, setInterviewType)}
              </section>

              <section className="interview-section">
                <h2>면접 분위기 *</h2>
                {renderOptions(
                  ATMOSPHERE_OPTIONS,
                  atmosphere,
                  setAtmosphere,
                  'atmosphere-button'
                )}
              </section>

              <section className="interview-section">
                <h2>면접 난이도 *</h2>
                {renderOptions(DIFFICULTY_OPTIONS, difficulty, setDifficulty)}
              </section>

              <section className="interview-section">
                <h2>면접 시간 *</h2>
                {renderOptions(DURATION_OPTIONS, duration, setDuration)}
              </section>

              <section className="interview-section">
                <h2>
                  평가 역량
                  <span className="optional-text">복수 선택</span>
                </h2>
                <div className="competency-grid">
                  {COMPETENCY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`competency-button ${
                        competencies.includes(option.value) ? 'active' : ''
                      }`}
                      onClick={() => toggleCompetency(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="interview-section">
                <h2>받은 면접 질문 *</h2>
                <p className="section-description">기억나는 질문을 하나씩 입력해주세요.</p>
                <div className="question-list">
                  {questions.map((question, index) => (
                    <div className="question-input-row" key={`${index}-${questions.length}`}>
                      <input
                        value={question}
                        onChange={(event) => updateQuestion(index, event.target.value)}
                        placeholder="예: 우리 동아리에 지원한 이유는 무엇인가요?"
                      />
                      <button
                        type="button"
                        className="question-delete-button"
                        onClick={() => removeQuestion(index)}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="question-add-button" onClick={addQuestion}>
                  + 질문 추가
                </button>
              </section>

              <section className="interview-section">
                <h2>
                  면접 팁
                  <span className="optional-text">선택</span>
                </h2>
                <textarea
                  value={tip}
                  onChange={(event) => setTip(event.target.value)}
                  placeholder="면접 준비 팁이나 기억나는 분위기를 자유롭게 적어주세요."
                />
              </section>
            </>
          )}

          {error && <p className="interview-error">{error}</p>}

          <div className="interview-button-row">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(`/club/${clubId}`)}
            >
              취소
            </button>
            <button
              type="button"
              className="submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
