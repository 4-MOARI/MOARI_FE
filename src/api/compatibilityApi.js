// 동아리 궁합 분석 API 연동 함수
// 실제 프로젝트에서는 reviewApi.js 처럼 이미 만들어둔 axios 인스턴스
// (baseURL, Authorization 헤더 인터셉터가 세팅된 것)를 그대로 가져와서 쓰면 됩니다.
// 예: import axiosInstance from './axiosInstance';
import axiosInstance from './axiosInstance';

/**
 * 선택한 동아리들(2~4개)의 궁합을 분석합니다.
 * POST /api/compatibility/analyze
 *
 * @param {number[]} clubIds - 비교할 동아리 ID 배열 (최소 2개, 최대 4개)
 * @returns {Promise<{success: boolean, data: object|null, error: {code:string, message:string}|null}>}
 */
export async function analyzeCompatibility(clubIds) {
  if (!Array.isArray(clubIds) || clubIds.length < 2 || clubIds.length > 4) {
    // 프론트에서 먼저 걸러서 불필요한 요청을 막습니다.
    return {
      success: false,
      data: null,
      error: {
        code: 'COMPATIBILITY_400',
        message: '비교할 동아리는 2개 이상 4개 이하로 선택해야 합니다.',
      },
    };
  }

  const response = await axiosInstance.post('/compatibility/analyze', {
    clubIds,
  });

  // 응답 형태 자체가 { success, data, error } 이므로 그대로 반환
  return response.data;
}