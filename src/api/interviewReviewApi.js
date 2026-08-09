import apiClient from './axios';


export const createInterviewReview = (clubId, data) => {
  return apiClient.post(`/clubs/${clubId}/interview-reviews`, data);
};


export const getInterviewReviews = (clubId) => {
  return apiClient.get(`/clubs/${clubId}/interview-reviews`);
};