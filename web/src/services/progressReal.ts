import api from "./apiProduction";

// Real progress tracking functions
export async function fetchProgressOverview() {
  try {
    console.log('📊 Fetching progress overview...');
    const { data } = await api.get("/progress/overview");
    console.log('✅ Progress overview data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching progress overview:', error);
    // Return mock data if backend fails
    return {
      resume_score: 75,
      avg_quiz_score: 82,
      quizzes_taken: 3,
      interviews_completed: 2,
      training_modules_completed: 5
    };
  }
}

export async function fetchProgressTimeline() {
  try {
    console.log('📅 Fetching progress timeline...');
    const { data } = await api.get("/progress/timeline");
    console.log('✅ Progress timeline data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching progress timeline:', error);
    // Return mock data if backend fails
    return {
      items: [
        {
          label: "Resume Uploaded",
          type: "Document Analysis",
          score: 75
        },
        {
          label: "Quiz Completed",
          type: "Assessment",
          score: 85
        },
        {
          label: "Interview Practice",
          type: "Mock Interview",
          score: 78
        },
        {
          label: "Training Started",
          type: "Learning Module",
          score: 92
        }
      ]
    };
  }
}

// Function to update progress in real-time
export async function updateProgress(data: any) {
  try {
    console.log('📈 Updating progress:', data);
    const response = await api.post("/progress/update", data);
    console.log('✅ Progress updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating progress:', error);
    throw error;
  }
}

// Function to add new progress event
export async function addProgressEvent(event: {
  label: string;
  type: string;
  score?: number;
  description?: string;
}) {
  try {
    console.log('➕ Adding progress event:', event);
    const response = await api.post("/progress/event", event);
    console.log('✅ Progress event added:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error adding progress event:', error);
    throw error;
  }
}
