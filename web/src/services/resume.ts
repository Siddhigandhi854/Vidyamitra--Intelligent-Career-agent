import api from "./apiProduction";

export interface ResumeParseResult {
  filename: string;
  text_preview: string;
  detected_role: string;
  skills: string[];
  score: number;
}

export async function uploadResume(file: File): Promise<ResumeParseResult> {
  try {
    const form = new FormData();
    form.append("file", file);
    
    const url = '/resume/parse';
    const fullUrl = `https://vidyamitra-backend-uprd.onrender.com${url}`;
    console.log('🌐 Full resume upload URL:', fullUrl);
    
    const { data } = await api.post(url, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    console.log('✅ Resume upload response:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Resume upload failed:', error);
    throw error;
  }
}

export async function fetchResumeSummary() {
  try {
    const url = '/resume/summary';
    const fullUrl = `https://vidyamitra-backend-uprd.onrender.com${url}`;
    console.log('🌐 Full resume summary URL:', fullUrl);
    
    const { data } = await api.get(url);
    console.log('✅ Resume summary response:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Resume summary fetch failed:', error);
    throw error;
  }
}

