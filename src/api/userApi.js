import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

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
