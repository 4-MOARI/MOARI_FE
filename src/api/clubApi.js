import apiClient from './axios';

//동아리 등록
export const createClub = async (requestBody) => {
  const response = await apiClient.post(
    '/clubs/register',
    requestBody
  );

  return response.data;
};

//동아리 상세조회
export const getClubDetail = async (clubId) => {
  const response = await apiClient.get(
    `/clubs/${clubId}`
  );

  return response.data.data;
};

//동아리 수정