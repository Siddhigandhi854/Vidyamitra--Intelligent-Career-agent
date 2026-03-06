import api from "./apiProduction";

export async function fetchQuizConfig() {
  try {
    const url = '/quiz/config';
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;
    console.log('🌐 Full quiz config URL:', fullUrl);
    
    const { data } = await api.get(url);
    console.log('✅ Quiz config fetched:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Quiz config fetch failed:', error);
    throw error;
  }
}

export async function fetchResumeSummary() {
  try {
    const url = '/resume/summary';
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;
    console.log('🌐 Full resume summary URL:', fullUrl);
    
    const { data } = await api.get(url);
    console.log('✅ Resume summary fetched:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Resume summary fetch failed:', error);
    throw error;
  }
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
  try {
    const url = '/quiz/submit';
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;
    console.log('🌐 Full quiz submit URL:', fullUrl);
    
    const { data } = await api.post(url, payload);
    console.log('✅ Quiz submitted:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Quiz submit failed:', error);
    throw error;
  }
}

