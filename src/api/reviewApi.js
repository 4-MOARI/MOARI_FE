// src/api/reviewApi.js

import apiClient from './axios';

// 리뷰 등록
export const createReview = async ({
  clubId,
  rating,
  content,
}) => {
  const response = await apiClient.post(
    `/clubs/${clubId}/reviews`,
    {
      rating,
      content,
    }
  );

  return response.data;
};