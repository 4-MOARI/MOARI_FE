// 실제 백엔드 sourceType 값: 'CLUB_INFO' | 'GENERAL' | 'ANSWER_BASED'
// questionType 값: 'BASE' | 'FOLLOW_UP'
// ※ '면접 후기 기반' 질문은 아직 백엔드 미구현 (hasInterviewReviewData 항상 false)
export const getQuestionSourceLabel = (turn) => {
  if (turn.questionType === 'FOLLOW_UP') {
    return '이전 답변과 연결된 질문이에요.';
  }

  if (turn.sourceType === 'CLUB_INFO') {
    return '동아리 상세 페이지를 기반으로 생성된 질문이에요.';
  }

  return '일반 면접 질문이에요.';
};