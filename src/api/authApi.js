import apiClient from './axios';

export const login = (userId, password) =>
  apiClient.post('/auth/login', { userId, password });

export const sendVerificationCode = (email, schoolId) =>
  apiClient.post('/auth/verify/send', { email, schoolId });

export const confirmVerificationCode = (email, code) =>
  apiClient.post('/auth/verify/confirm', { email, code });

export const signup = (data) =>
  apiClient.post('/auth/signup', data);

export const findId = (email) =>
  apiClient.post('/auth/find-id', { email });

export const sendPasswordCode = (email) =>
  apiClient.post('/auth/password/send', { email });

export const resetPassword = (data) =>
  apiClient.patch('/auth/password/reset', data);