import apiClient from './axios';

/**
 * 리뷰 목록 조회
 */
export const getClubReviews = async (
  clubId
) => {

  const response = await apiClient.get(
    `/clubs/${clubId}/reviews`
  );

  return response.data;
};

/**
 * 리뷰 작성
 */
export const createReview = async (
  clubId,
  reviewData
) => {

  const response = await apiClient.post(
    `/clubs/${clubId}/reviews`,
    reviewData
  );

  return response.data;
};

/**
 * 리뷰 삭제
 */
export const deleteReview = async (
  reviewId
) => {

  const response = await apiClient.delete(
    `/reviews/${reviewId}`
  );

  return response.data;
};