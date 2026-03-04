import api from "./api";

export interface InterviewStartRequest {
  job_role: string;
  difficulty: string;
}

export interface InterviewSessionResponse {
  session_id: string;
  rounds: any[];
}

export async function fetchInterviewSession() {
  try {
    // Send POST request to start interview session
    const request: InterviewStartRequest = {
      job_role: "Software Engineer", // Default role
      difficulty: "intermediate" // Default difficulty
    };
    
    const { data } = await api.post<InterviewSessionResponse>("/interview/session", request);
    return data;
  } catch (error: any) {
    console.error("Failed to fetch interview session:", error);
    // Return fallback session
    return {
      session_id: "fallback-session",
      rounds: [
        {
          round_number: 1,
          questions: [
            {
              id: 1,
              prompt: "Tell me about your experience with software development.",
              type: "experience"
            },
            {
              id: 2,
              prompt: "Describe a challenging project you've worked on.",
              type: "challenge"
            }
          ]
        }
      ]
    };
  }
}

export async function submitInterviewFeedback(payload: { session_id: string; notes: string }) {
  const { data } = await api.post("/interview/feedback", payload);
  return data;
}

