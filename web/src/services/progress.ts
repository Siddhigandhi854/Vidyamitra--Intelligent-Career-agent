import api from "./api";

export async function fetchProgressOverview() {
  const { data } = await api.get("/progress/overview");
  return data;
}

export async function fetchProgressTimeline() {
  const { data } = await api.get("/progress/timeline");
  return data;
}

