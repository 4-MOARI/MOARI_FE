import apiClient from './axios';

export async function analyzeCompatibility(clubIds) {
  if (!Array.isArray(clubIds) || clubIds.length < 2 || clubIds.length > 4) {
    return {
      success: false,
      data: null,
      error: {
        code: 'COMPATIBILITY_400',
        message: '비교할 동아리는 2개 이상 4개 이하로 선택해야 합니다.',
      },
    };
  }

  const response = await apiClient.post('/compatibility/analyze', {
    clubIds,
  });

  return response.data;
}