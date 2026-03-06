import api from "./apiProduction";

export interface ResumeParseResult {
  filename: string;
  text_preview: string;
  detected_role: string;
  skills: string[];
  score: number;
}

export async function uploadResume(file: File): Promise<ResumeParseResult> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<ResumeParseResult>("/resume/parse", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function fetchResumeSummary() {
  const { data } = await api.get("/resume/summary");
  return data;
}

