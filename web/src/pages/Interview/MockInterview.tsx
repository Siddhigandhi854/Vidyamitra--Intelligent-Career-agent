import React, { useEffect, useState } from "react";
import { fetchInterviewSession, submitInterviewFeedback } from "../../services/interview";

// Type definitions for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  interface SpeechRecognitionEvent {
    results: any[];
  }
}

export const MockInterview: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchInterviewSession();
      setSession(data);
    };
    load();
  }, []);

  const startVoiceCapture = () => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Voice API not supported in this browser. You can type your responses manually in the notes area below, or try using Chrome/Edge for better voice support.");
      return;
    }
    
    try {
      setError(null);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          setNotes((prev) => `${prev}\nInterviewer: ${event.results[0][0].transcript}\nYou: ${transcript}`);
        }
      };
      
      rec.onerror = (event: any) => {
        setRecording(false);
        setError("Voice capture error. Please try typing your response manually.");
      };
      
      rec.onend = () => {
        setRecording(false);
      };
      
      setRecording(true);
      rec.start();
    } catch (error: any) {
      setError("Voice capture initialization failed. Please type your response manually.");
    }
  };

  const handleFeedback = async () => {
    if (!session) return;
    const data = await submitInterviewFeedback({ session_id: session.session_id, notes });
    setFeedback(data);
  };

  const firstRound = session?.rounds?.[0];

  return (
    <div>
      <div className="page-title">Mock Interview</div>
      <div className="page-subtitle">
        Practice multi-round interviews and capture your spoken responses for reflection.
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-title">Round prompts</div>
        {!session ? (
          <div>Preparing session...</div>
        ) : (
          <ul style={{ fontSize: "0.9rem", paddingLeft: "1.1rem" }}>
            {firstRound?.questions?.map((q: any) => (
              <li key={q.id}>{q.prompt}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-title">Your spoken / typed notes</div>
        <div className="field">
          <label>Transcript & notes</label>
          <textarea
            className="textarea"
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {error && <div className="error-text">{error}</div>}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={startVoiceCapture}
            disabled={recording}
          >
            {recording ? "Listening..." : "Capture voice"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={handleFeedback}>
            Get feedback
          </button>
        </div>
      </div>

      {feedback && (
        <div className="card">
          <div className="card-title">Coach feedback</div>
          <div className="stack-v">
            <div>
              Score: <span className="metric-number">{feedback.overall_score}</span>/100
            </div>
            <div>
              <strong>Strengths</strong>
              <ul style={{ fontSize: "0.85rem", paddingLeft: "1rem" }}>
                {feedback.strengths?.map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Improvements</strong>
              <ul style={{ fontSize: "0.85rem", paddingLeft: "1rem" }}>
                {feedback.improvements?.map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

