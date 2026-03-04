import React, { useEffect, useState } from "react";
import { fetchResumeSummary } from "../../services/resume";
import { fetchTrainingPlan } from "../../services/training";
import { fetchProgressOverview } from "../../services/progress";
import { fetchJobRecommendations } from "../../services/jobs";

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<any>(null);
  const [training, setTraining] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [jobs, setJobs] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, t, p, j] = await Promise.all([
          fetchResumeSummary(),
          fetchTrainingPlan(),
          fetchProgressOverview(),
          fetchJobRecommendations(),
        ]);
        setResume(r);
        setTraining(t);
        setProgress(p);
        setJobs(j);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="page-title">Career Analytics Overview</div>
      <div className="page-subtitle">
        Snapshot of your resume strength, skills, learning path, and outcomes.
      </div>

      {loading ? (
        <div>Loading dashboard...</div>
      ) : (
        <div className="card-grid">
          <div className="card">
            <div className="card-title">Resume Evaluation</div>
            {resume ? (
              <div className="stack-v">
                <div className="metric-number">{resume.overall_score}/100</div>
                <div className="chip-row">
                  {resume.strengths?.map((s: string) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>No resume insights yet.</div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Skill Gap & Training</div>
            {training && training.modules?.length > 0 ? (
              <div className="stack-v">
                <span className="pill">{training.target_role}</span>
                <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{training.summary}</span>
                <div className="chip-row">
                  {training.modules?.slice(0, 3).map((m: any) => (
                    <span key={m.title} className="chip">
                      {m.title}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>No training plan yet.</div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Quiz & Interview Performance</div>
            {progress ? (
              <div className="stack-v">
                <div>
                  <span className="badge">Quizzes</span>{" "}
                  <span className="metric-number">{progress.avg_quiz_score}</span>
                  <span style={{ fontSize: "0.8rem", color: "#9ca3af", marginLeft: 4 }}>
                    avg score across {progress.quizzes_taken} quizzes
                  </span>
                </div>
                <div>
                  <span className="badge">Interviews</span>{" "}
                  <span style={{ fontSize: "0.9rem" }}>
                    {progress.interviews_completed} sessions completed
                  </span>
                </div>
              </div>
            ) : (
              <div>No practice yet.</div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Job Recommendations</div>
            {jobs ? (
              <div className="stack-v">
                <span className="pill">Target: {jobs.target_role}</span>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {jobs.recommendations?.slice(0, 3).map((j: any) => (
                    <li key={j.id} style={{ fontSize: "0.85rem", marginBottom: 4 }}>
                      <strong>{j.title}</strong> at {j.company} · {j.location} ·{" "}
                      {j.match_score}% match
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>No recommendations yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

