import apiClient from './axios';

export const createInterviewReview = (clubId, data) => {
  return apiClient.post(
    `/clubs/${clubId}/interview-reviews`,
    data
  );
};

export const getInterviewReviews = (clubId) => {
  return apiClient.get(
    `/clubs/${clubId}/interview-reviews`
  );
};

export const getMyInterviewReviews = () => {
  return apiClient.get(
    '/users/me/interview-reviews'
  );
};

export const deleteInterviewReview = (interviewReviewId) => {
  return apiClient.delete(
    `/interview-reviews/${interviewReviewId}`
  );
};