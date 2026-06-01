// src/api/axios.js

import axios from 'axios';

// 공용 axios 인스턴스
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT 자동 첨부
apiClient.interceptors.request.use(
  (config) => {

    // localStorage에 저장된 토큰 가져오기
    const token = localStorage.getItem('accessToken');

    // 토큰 있으면 Authorization 추가
    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;