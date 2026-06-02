import apiClient from './axios';

// 동아리 목록 조회 (검색/필터/정렬)
export const getClubs = async ({ keyword, categoryId, isRecruiting, schoolType, sort, page = 1, pageSize = 10 } = {}) => {
  const params = { page, pageSize };

  if (keyword) params.keyword = keyword;
  if (categoryId) params.categoryId = categoryId;
  if (isRecruiting !== undefined && isRecruiting !== '전체') {
    params.isRecruiting = isRecruiting === '모집중' ? 'true' : 'false';
  }
  if (schoolType && schoolType !== '전체') {
    params.schoolType = schoolType === '교내' ? 'internal' : 'external';
  }
  if (sort) {
    if (sort === '인기순') params.sort = 'favoriteCount';
    else if (sort === '별점순') params.sort = 'rating';
    else if (sort === '이름순') params.sort = 'name';
  }

  const response = await apiClient.get('/clubs', { params });
  return response.data;
};

// 동아리 수정 로그 조회
export const getClubHistory = async (clubId, { page = 1, pageSize = 10 } = {}) => {
  const response = await apiClient.get(`/clubs/${clubId}/history`, {
    params: { page, pageSize }
  });
  return response.data;
};