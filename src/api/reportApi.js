// src/api/reportApi.js

import apiClient from './axios';

export const getReportSummary = async (clubId) => {
  const response = await apiClient.get(
    `/clubs/${clubId}/reports/summary`
  );

  return response.data.data;
};

export const createReport = async (
  clubId,
  reportData
) => {
  const response = await apiClient.post(
    `/clubs/${clubId}/reports`,
    reportData
  );

  return response.data.data;
};