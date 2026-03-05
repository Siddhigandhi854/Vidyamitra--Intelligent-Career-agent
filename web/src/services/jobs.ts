import api from "./api";

export async function fetchJobRecommendations() {
  try {
    const url = '/jobs/recommendations';
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;
    console.log('🌐 Full job recommendations URL:', fullUrl);
    
    const { data } = await api.get(url);
    console.log('✅ Job recommendations fetched:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Job recommendations fetch failed:', error);
    throw error;
  }
}

