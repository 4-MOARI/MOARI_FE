import { create } from 'zustand';

const initialState = {
  interviewId: null,
  clubId: null,
  clubName: null,
  questionCount: null,
  currentQuestionIndex: 1,
  status: 'idle',
  currentQuestion: null,
  turns: [],
  result: null,
  feedback: null,
};

const useAiInterviewStore = create((set) => ({
  ...initialState,

  setInterview: ({ interviewId, clubId, clubName, questionCount, status, currentQuestionIndex, question }) =>
    set({
      interviewId,
      clubId,
      clubName,
      questionCount,
      status,
      currentQuestionIndex,
      currentQuestion: question,
      turns: [],
    }),

  hydrateFromInterview: ({ interviewId, clubId, clubName, questionCount, status, currentQuestionIndex, turns }) =>
    set({
      interviewId,
      clubId,
      clubName,
      questionCount,
      status,
      currentQuestionIndex,
      turns,
      currentQuestion: turns.find((t) => !t.answerText) ?? null,
    }),

  submitAnswerLocally: ({ answeredTurn, answerText, nextQuestion, isCompleted }) =>
    set((state) => ({
      turns: [...state.turns, { ...answeredTurn, answerText }],
      currentQuestion: isCompleted ? null : nextQuestion,
      currentQuestionIndex: isCompleted
        ? state.currentQuestionIndex
        : nextQuestion.questionIndex,
      status: isCompleted ? 'COMPLETED' : state.status,
    })),

  setStatus: (status) => set({ status }),

  setResult: (result) => set({ result }),
  setFeedback: (feedback) => set({ feedback }),

  reset: () => set(initialState),
}));

export default useAiInterviewStore;