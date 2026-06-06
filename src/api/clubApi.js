import apiClient from './axios';


// 크롤링 동아리 기본 정보 적재
export const crawlClub = async (requestBody) => {
  const response = await apiClient.post(
    '/crawl',
    requestBody
  );

  return response.data;
};


// 동아리 등록
export const createClub = async (requestBody) => {
  const response = await apiClient.post(
    '/register',
    requestBody
  );

  return response.data;
};

export const uploadClubImage = async (file) => {
  if (!(file instanceof File)) {
    throw new Error('업로드할 이미지 파일이 올바르지 않습니다.');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post(
    '/uploads/clubs/images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data.imageUrl;
};

// 동아리 상세조회
export const getClubDetail = async (clubId) => {
  const response = await apiClient.get(
    `/clubs/${clubId}`
  );

  return response.data.data;
};

// 동아리 목록 조회 (검색/필터/정렬)
export const getClubs = async ({
  keyword,
  categoryId,
  isRecruiting,
  schoolType,
  sort,
  page = 1,
  pageSize = 10,
} = {}) => {
  const params = { page, pageSize };

  if (keyword) params.keyword = keyword;
  if (categoryId) params.categoryId = categoryId;

  if (
    isRecruiting !== undefined &&
    isRecruiting !== '전체'
  ) {
    params.isRecruiting =
      isRecruiting === '모집중'
        ? 'true'
        : 'false';
  }

  if (
    schoolType &&
    schoolType !== '전체'
  ) {
    params.schoolType =
      schoolType === '교내'
        ? 'internal'
        : 'external';
  }

  if (sort) {
    if (sort === '인기순')
      params.sort = 'favoriteCount';
    else if (sort === '별점순')
      params.sort = 'rating';
    else if (sort === '이름순')
      params.sort = 'name';
  }

  const response = await apiClient.get(
    '/clubs',
    { params }
  );

  return response.data;
};

// 동아리 수정 로그 조회
export const getClubHistory = async (
  clubId,
  {
    page = 1,
    pageSize = 10,
  } = {}
) => {
  const response = await apiClient.get(
    `/clubs/${clubId}/history`,
    {
      params: {
        page,
        pageSize,
      },
    }
  );

  return response.data;
};

// 카테고리 목록 조회
export const getCategories = async () => {
  const response = await apiClient.get('/categories');

  return response.data.data.categories
};

// 동아리 수정
export const updateClub = async (clubId, requestBody) => {
  const response = await apiClient.patch(
    `/clubs/${clubId}/update`,
    requestBody
  );

  return response.data;

};
