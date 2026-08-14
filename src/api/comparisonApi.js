import apiClient from "./axios";

export async function getComparisonData(clubIds) {
  const response = await apiClient.post("/comparison/analyze", {
    clubIds,
  });

  return response.data;
}