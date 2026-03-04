import api from "./api";

export async function fetchQuizConfig() {
  const { data } = await api.get("/quiz/config");
  return data;
}

export async function startQuiz(payload: {
  domain: string;
  difficulty: string;
  num_questions: number;
}) {
  const { data } = await api.post("/quiz/start", payload);
  return data;
}

export async function submitQuiz(payload: { session_id: string; answers: number[] }) {
  const { data } = await api.post("/quiz/submit", payload);
  return data;
}

