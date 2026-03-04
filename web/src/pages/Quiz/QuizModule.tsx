import React, { useEffect, useState } from "react";
import { fetchQuizConfig, startQuiz, submitQuiz } from "../../services/quiz";
import { useNavigate } from "react-router-dom";

export const QuizModule: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [session, setSession] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await fetchQuizConfig();
      setConfig(data);
      setDomain(data.domains[0]);
      setDifficulty(data.difficulties[0]);
    };
    load();
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await startQuiz({ domain, difficulty, num_questions: 10 });
      setSession(data);
      setAnswers(new Array(data.questions.length).fill(-1));
      setActiveIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const data = await submitQuiz({ session_id: session.session_id, answers });
      setResult(data);
      
      // Redirect to progress page after successful quiz submission
      if (data && data.score !== undefined) {
        setTimeout(() => {
          navigate("/progress");
        }, 2000); // Redirect after 2 seconds
      }
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = session?.questions?.[activeIndex];

  return (
    <div>
      <div className="page-title">Skill Quiz</div>
      <div className="page-subtitle">
        Practice technical and career questions with instant scoring.
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="field">
          <label>Domain</label>
          <select
            className="select"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          >
            {config?.domains?.map((d: string) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Difficulty</label>
          <select
            className="select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {config?.difficulties?.map((d: string) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" type="button" onClick={handleStart} disabled={loading}>
          {loading ? "Preparing..." : "Start Quiz"}
        </button>
      </div>

      {session && currentQuestion && (
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div className="card-title">
            Question {activeIndex + 1} of {session.questions.length}
          </div>
          <div style={{ marginBottom: "0.75rem" }}>{currentQuestion.question}</div>
          <div className="stack-v">
            {currentQuestion.options.map((opt: string, idx: number) => (
              <label key={idx} style={{ display: "flex", gap: "0.5rem", fontSize: "0.9rem" }}>
                <input
                  type="radio"
                  name={`q-${currentQuestion.id}`}
                  checked={answers[activeIndex] === idx}
                  onChange={() => {
                    const next = [...answers];
                    next[activeIndex] = idx;
                    setAnswers(next);
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
          <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
            <button
              className="btn btn-ghost"
              type="button"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((i) => i - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              disabled={activeIndex === session.questions.length - 1}
              onClick={() => setActiveIndex((i) => i + 1)}
            >
              Next
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Scoring..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="card">
          <div className="card-title">Results</div>
          <div className="stack-v">
            <div>
              Score:{" "}
              <span className="metric-number">
                {result.score}/{result.total}
              </span>
            </div>
            <ul style={{ fontSize: "0.85rem", paddingLeft: "1rem" }}>
              {result.details?.map((d: string, idx: number) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

