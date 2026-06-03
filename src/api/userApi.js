import axios from 'axios';

export const AUTH_TOKEN_KEY = 'accessToken';
const LEGACY_AUTH_TOKEN_KEY = 'moariAccessToken';
const DEV_AUTH_TOKEN = import.meta.env.VITE_DEV_AUTH_TOKEN || '';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
});

apiClient.interceptors.request.use((config) => {
  const token = (import.meta.env.DEV ? DEV_AUTH_TOKEN : '') ||
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_AUTH_TOKEN_KEY);
}

export async function getMyProfile() {
  const response = await apiClient.get('/users/me');

  return response.data.data;
}

export async function getMyClubs({ page = 1, limit = 6 } = {}) {
  const response = await apiClient.get('/users/me/clubs', {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
}

export async function getMyFavoriteClubs({ page = 1, limit = 6 } = {}) {
  const response = await apiClient.get('/users/me/favorites', {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
}

export async function getMyReviews({ page = 1, limit = 6 } = {}) {
  const response = await apiClient.get('/users/me/reviews', {
    params: {
      page,
      limit,
    },
  });

  return response.data.data;
}

export async function deleteFavoriteClub(clubId) {
  const response = await apiClient.delete(`/clubs/${clubId}/favorites`);

  return response.data.data;
}

export async function verifyMyPassword(password) {
  const response = await apiClient.post('/users/me/password/verify', {
    password,
  });

  return response.data.data;
}

export async function changeMyPassword({
  currentPassword,
  newPassword,
}) {
  const response = await apiClient.patch('/users/me/password', {
    currentPassword,
    newPassword,
  });

  return response.data.data;
}

export async function deleteMyAccount() {
  const response = await apiClient.delete('/users/me');

  return response.data.data;
}
