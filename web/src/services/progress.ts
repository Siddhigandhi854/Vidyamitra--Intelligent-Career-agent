import api from "./apiProduction";

export async function fetchProgressOverview() {
  try {
    const url = '/progress/overview';
    console.log('🌐 Progress overview URL:', url);
    
    const { data } = await api.get(url);
    console.log('✅ Progress overview fetched:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Progress overview fetch failed:', error);
    throw error;
  }
}

export async function fetchProgressTimeline() {
  try {
    const url = '/progress/timeline';
    const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;
    console.log('🌐 Full progress timeline URL:', fullUrl);
    
    const { data } = await api.get(url);
    console.log('✅ Progress timeline fetched:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Progress timeline fetch failed:', error);
    throw error;
  }
}

