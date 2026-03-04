import React, { useState } from "react";
import { uploadResume } from "../../services/resume";

export const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = [".pdf", ".doc", ".docx", ".txt"];
    const ok = allowed.some((ext) => f.name.toLowerCase().endsWith(ext));
    if (!ok) {
      setError("Unsupported file type. Use PDF, DOC, DOCX, or TXT.");
      setFile(null);
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large. Max 5MB.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await uploadResume(file);
      setResult(data);
      localStorage.setItem("vm_last_role", data.detected_role);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to parse resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-title">Resume Evaluation</div>
      <div className="page-subtitle">
        Upload your resume to extract skills, infer a target role, and compute a baseline score.
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="field">
          <label>Resume file</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button
          className="btn btn-primary"
          disabled={!file || loading}
          onClick={handleUpload}
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>

      {result && (
        <div className="card-grid">
          <div className="card">
            <div className="card-title">Summary</div>
            <div className="stack-v">
              <span className="pill">{result.detected_role}</span>
              <span>
                Score: <span className="metric-number">{result.score}</span>/100
              </span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Detected Skills</div>
            <div className="chip-row">
              {result.skills?.map((s: string) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

