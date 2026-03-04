import api from "./api";

export interface TrainingPlanRequest {
  current_role: string;
  target_role: string;
  experience_level: string;
  skills: string[];
  goals: string[];
  timeline: string;
}

export async function fetchTrainingPlan(targetRole?: string) {
  // Get user data from localStorage
  const inferredRole = localStorage.getItem("vm_last_role") || "Software Developer";
  const userEmail = localStorage.getItem("vm_user_email") || "testuser2";
  
  // Use provided target role or fallback to inferred role
  const finalTargetRole = targetRole || inferredRole;
  
  const request: TrainingPlanRequest = {
    current_role: inferredRole,
    target_role: finalTargetRole,
    experience_level: "mid",
    skills: ["Design Systems", "User Research", "Prototyping"],
    goals: ["Career advancement", "Skill enhancement"],
    timeline: "6 months"
  };

  try {
    const { data } = await api.post("/training/generate-plan", request);
    return data;
  } catch (error: any) {
    console.error("Training plan generation failed:", error);
    // Return fallback plan
    return {
      plan_id: `${userEmail}_fallback`,
      user_profile: {
        current_role: inferredRole,
        target_role: `Senior ${inferredRole}`,
        experience_level: "mid",
        skills: [],
        goals: [],
        timeline: "6 months"
      },
      modules: [
        {
          id: 1,
          title: "Foundation Skills",
          description: "Build fundamental knowledge",
          duration_weeks: 4,
          difficulty: "Beginner",
          skills_covered: [],
          resources: [],
          prerequisites: [],
          outcomes: []
        },
        {
          id: 2,
          title: "Intermediate Development",
          description: "Develop core skills",
          duration_weeks: 6,
          difficulty: "Intermediate",
          skills_covered: [],
          resources: [],
          prerequisites: [],
          outcomes: []
        }
      ],
      timeline_months: 6,
      estimated_hours: 120,
      success_metrics: [],
      next_steps: []
    };
  }
}

