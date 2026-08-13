import apiClient from './axios';

export const getAiInterviewOptions = (clubId) => {
  return apiClient.get(`/clubs/${clubId}/ai-interview/options`);
};

export const createAiInterview = ({ clubId, questionCount }) => {
  return apiClient.post('/ai-interviews', { clubId, questionCount });
};

export const getAiInterview = (interviewId) => {
  return apiClient.get(`/ai-interviews/${interviewId}`);
};

export const submitAiInterviewAnswer = (interviewId, { turnId, answerText }) => {
  return apiClient.post(`/ai-interviews/${interviewId}/answers`, {
    turnId,
    answerText,
  });
};

export const endAiInterview = (interviewId) => {
  return apiClient.post(`/ai-interviews/${interviewId}/end`);
};

export const completeAiInterview = (interviewId) => {
  return apiClient.post(`/ai-interviews/${interviewId}/complete`);
};

export const getAiInterviewResult = (interviewId) => {
  return apiClient.get(`/ai-interviews/${interviewId}/result`);
};

export const getAiInterviewFeedback = (interviewId) => {
  return apiClient.get(`/ai-interviews/${interviewId}/feedback`);
};