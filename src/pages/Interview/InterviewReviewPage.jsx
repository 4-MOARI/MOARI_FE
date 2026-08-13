import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import { createInterviewReview } from '../../api/interviewReviewApi';
import './InterviewReviewPage.css';

const competencyOptions = [
  { value: 'MOTIVATION', label: '지원 동기' },
  { value: 'TEAMWORK', label: '협업' },
  { value: 'PROJECT_EXPERIENCE', label: '프로젝트 경험' },
  { value: 'PROBLEM_SOLVING', label: '문제 해결' },
  { value: 'COMMUNICATION', label: '의사소통' },
  { value: 'RESPONSIBILITY', label: '책임감' },
  { value: 'ACTIVENESS', label: '적극성' },
  { value: 'LEADERSHIP', label: '리더십' },
  { value: 'MAJOR_KNOWLEDGE', label: '전공지식' },
  { value: 'CREATIVITY', label: '창의성' },
];

export default function InterviewReviewPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * 상세페이지에서 navigate 할 때 state로 clubName을 넘기면
   * 여기서 바로 표시할 수 있음.
   *
   * 예:
   * navigate(`/clubs/${clubId}/interview-review`, {
   *   state: { clubName: club.clubName }
   * });
   */
  const clubName = location.state?.clubName || '동아리';

  const [form, setForm] = useState({
    hasInterview: true,
    interviewMethod: '',
    interviewType: '',
    atmosphere: '',
    difficulty: '',
    duration: '',
    competencies: [],
    questions: [''],
    tip: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectValue = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleCompetency = (value) => {
    setForm((prev) => {
      const selected = prev.competencies.includes(value);

      return {
        ...prev,
        competencies: selected
          ? prev.competencies.filter((item) => item !== value)
          : [...prev.competencies, value],
      };
    });
  };

  const handleQuestionChange = (index, value) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      questions[index] = value;

      return {
        ...prev,
        questions,
      };
    });
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, ''],
    }));
  };

  const removeQuestion = (index) => {
    setForm((prev) => {
      if (prev.questions.length === 1) {
        return prev;
      }

      return {
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index),
      };
    });
  };

  const validateForm = () => {
    if (!form.hasInterview) {
      return true;
    }

    if (!form.interviewMethod) {
      setErrorMessage('면접 방식을 선택해주세요.');
      return false;
    }

    if (!form.interviewType) {
      setErrorMessage('면접 형태를 선택해주세요.');
      return false;
    }

    if (!form.atmosphere) {
      setErrorMessage('면접 분위기를 선택해주세요.');
      return false;
    }

    if (!form.difficulty) {
      setErrorMessage('면접 난이도를 선택해주세요.');
      return false;
    }

    if (!form.duration) {
      setErrorMessage('면접 시간을 선택해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const questions = form.questions
        .map((question) => question.trim())
        .filter(Boolean);

      const data = form.hasInterview
        ? {
            ...form,
            questions,
          }
        : {
            hasInterview: false,
            interviewMethod: null,
            interviewType: null,
            atmosphere: null,
            difficulty: null,
            duration: null,
            competencies: [],
            questions: [],
            tip: null,
          };

      await createInterviewReview(clubId, data);

      alert('면접 후기가 등록되었습니다.');

      navigate(`/clubs/${clubId}`);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          '면접 후기 등록에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="interview-review-page">
      <Header />

      <main className="interview-review-container">
        <div className="interview-review-heading">
          <h1>면접 후기 작성</h1>
          <p>
            실제 면접 경험을 공유해 다음 지원자에게 도움을 주세요.
          </p>
        </div>

        <section className="interview-review-card">
          {/* 동아리명 */}
          <div className="club-name-box">
            <span className="club-name-label">동아리</span>
            <strong>{clubName}</strong>
          </div>

          {/* 면접 여부 */}
          <div className="interview-section">
            <h2>면접 여부 *</h2>

            <div className="option-row">
              <button
                type="button"
                className={`option-button ${
                  form.hasInterview === true ? 'active' : ''
                }`}
                onClick={() => selectValue('hasInterview', true)}
              >
                면접 있음
              </button>

              <button
                type="button"
                className={`option-button ${
                  form.hasInterview === false ? 'active' : ''
                }`}
                onClick={() => selectValue('hasInterview', false)}
              >
                면접 없음
              </button>
            </div>
          </div>

          {form.hasInterview && (
            <>
              {/* 면접 방식 */}
              <div className="interview-section">
                <h2>면접 방식 *</h2>

                <div className="option-row">
                  {[
                    ['FACE_TO_FACE', '대면'],
                    ['ONLINE', '비대면'],
                    ['MIXED', '혼합'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`option-button ${
                        form.interviewMethod === value ? 'active' : ''
                      }`}
                      onClick={() =>
                        selectValue('interviewMethod', value)
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 면접 형태 */}
              <div className="interview-section">
                <h2>면접 형태 *</h2>

                <div className="option-row">
                  {[
                    ['INDIVIDUAL', '개인'],
                    ['GROUP', '그룹'],
                    ['MANY_TO_ONE', '다대일'],
                    ['MANY_TO_MANY', '다대다'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`option-button ${
                        form.interviewType === value ? 'active' : ''
                      }`}
                      onClick={() =>
                        selectValue('interviewType', value)
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 분위기 */}
              <div className="interview-section">
                <h2>면접 분위기 *</h2>

                <div className="option-row atmosphere-row">
                  {[
                    ['COMFORTABLE', '😊 편안했어요'],
                    ['NORMAL', '😐 보통이었어요'],
                    ['PRESSURE', '😨 압박 면접이었어요'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`option-button atmosphere-button ${
                        form.atmosphere === value ? 'active' : ''
                      }`}
                      onClick={() =>
                        selectValue('atmosphere', value)
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 난이도 */}
              <div className="interview-section">
                <h2>면접 난이도 *</h2>

                <div className="option-row">
                  {[
                    ['EASY', '쉬움'],
                    ['NORMAL', '보통'],
                    ['HARD', '어려움'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`option-button ${
                        form.difficulty === value ? 'active' : ''
                      }`}
                      onClick={() =>
                        selectValue('difficulty', value)
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 시간 */}
              <div className="interview-section">
                <h2>면접 시간 *</h2>

                <div className="option-row">
                  {[
                    ['UNDER_10', '10분 이하'],
                    ['MIN_10_20', '10~20분'],
                    ['MIN_20_30', '20~30분'],
                    ['OVER_30', '30분 이상'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`option-button ${
                        form.duration === value ? 'active' : ''
                      }`}
                      onClick={() =>
                        selectValue('duration', value)
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 역량 */}
              <div className="interview-section">
                <h2>
                  중요하게 본 역량
                  <span className="optional-text">복수 선택 가능</span>
                </h2>

                <div className="competency-grid">
                  {competencyOptions.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`competency-button ${
                        form.competencies.includes(item.value)
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        toggleCompetency(item.value)
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 질문 */}
              <div className="interview-section">
                <h2>
                  실제 면접 질문
                  <span className="optional-text">선택사항</span>
                </h2>

                <p className="section-description">
                  기억나는 실제 면접 질문을 입력해주세요.
                </p>

                <div className="question-list">
                  {form.questions.map((question, index) => (
                    <div
                      className="question-input-row"
                      key={index}
                    >
                      <input
                        type="text"
                        value={question}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            e.target.value
                          )
                        }
                        placeholder={
                          index === 0
                            ? '예) 지원 동기를 말해주세요.'
                            : '면접 질문을 입력해주세요.'
                        }
                      />

                      {form.questions.length > 1 && (
                        <button
                          type="button"
                          className="question-delete-button"
                          onClick={() =>
                            removeQuestion(index)
                          }
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="question-add-button"
                  onClick={addQuestion}
                >
                  + 질문 추가
                </button>
              </div>

              {/* 팁 */}
              <div className="interview-section">
                <h2>
                  면접 팁
                  <span className="optional-text">선택사항</span>
                </h2>

                <textarea
                  value={form.tip}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      tip: e.target.value,
                    }))
                  }
                  placeholder="예) 프로젝트 경험과 지원 동기를 구체적으로 준비하면 도움이 됩니다."
                />
              </div>
            </>
          )}

          {errorMessage && (
            <p className="interview-error">{errorMessage}</p>
          )}

          <div className="interview-button-row">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
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