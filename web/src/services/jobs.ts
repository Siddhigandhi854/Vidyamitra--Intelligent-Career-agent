import api from "./apiProduction";

export async function fetchJobRecommendations() {
  try {
    const url = '/jobs/recommendations';
    console.log('🌐 Job recommendations URL:', url);
    
    const { data } = await api.get(url);
    console.log('✅ Job recommendations fetched:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Job recommendations fetch failed:', error);
    throw error;
  }
}

