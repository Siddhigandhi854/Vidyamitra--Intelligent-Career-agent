import React, { useEffect, useState } from "react";
import { fetchProgressOverview, fetchProgressTimeline } from "../../services/progress";

export const ProgressOverview: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [o, t] = await Promise.all([
        fetchProgressOverview(),
        fetchProgressTimeline(),
      ]);
      setOverview(o);
      setTimeline(t.items || []);
    };
    load();
  }, []);

  return (
    <div>
      <div className="page-title">Progress Tracking</div>
      <div className="page-subtitle">
        Track your evolution across resume quality, quizzes, interviews, and learning modules.
      </div>

      <div className="card-grid" style={{ marginBottom: "1rem" }}>
        <div className="card">
          <div className="card-title">Resume</div>
          {overview && (
            <div className="metric-number">{overview.resume_score}/100</div>
          )}
        </div>
        <div className="card">
          <div className="card-title">Quizzes</div>
          {overview && (
            <div className="stack-v">
              <span className="metric-number">{overview.avg_quiz_score}</span>
              <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                across {overview.quizzes_taken} attempts
              </span>
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-title">Interviews & Training</div>
          {overview && (
            <div className="stack-v">
              <span>{overview.interviews_completed} interviews</span>
              <span>{overview.training_modules_completed} modules completed</span>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Timeline</div>
        {timeline.length === 0 ? (
          <div>No events yet.</div>
        ) : (
          <ul style={{ fontSize: "0.85rem", paddingLeft: "1rem" }}>
            {timeline.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong> – {item.type}
                {typeof item.score === "number" && ` · score ${item.score}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

