import api from "./api";

export async function fetchJobRecommendations() {
  const { data } = await api.get("/jobs/recommendations");
  return data;
}

