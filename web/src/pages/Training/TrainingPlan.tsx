import React, { useEffect, useState } from "react";
import { fetchTrainingPlan } from "../../services/training";

export const TrainingPlan: React.FC = () => {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customRole, setCustomRole] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Available target roles
  const availableRoles = [
    "Software Engineer",
    "Data Scientist", 
    "Product Manager",
    "DevOps Engineer",
    "UI/UX Designer",
    "Project Manager",
    "Business Analyst",
    "Marketing Manager",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer"
  ];

  useEffect(() => {
    const load = async () => {
      const data = await fetchTrainingPlan(selectedRole || customRole);
      setPlan(data);
      setLoading(false);
    };
    load();
  }, [selectedRole, customRole]);

  const inferredRole = localStorage.getItem("vm_last_role");

  const handleRoleChange = (role: string) => {
    if (role === "Custom") {
      setShowCustomInput(true);
      setSelectedRole("");
    } else {
      setShowCustomInput(false);
      setCustomRole("");
      setSelectedRole(role);
      setLoading(true);
    }
  };

  const handleCustomRoleSubmit = () => {
    if (customRole.trim()) {
      setSelectedRole("");
      setLoading(true);
    }
  };

  return (
    <div>
      <div className="page-title">Training Planner</div>
      <div className="page-subtitle">
        Personalized learning path built from your resume, target roles, and skill gaps.
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="stack-v">
          <span className="badge">Target role</span>
          <div style={{ marginBottom: "1rem" }}>
            <select 
              className="field" 
              value={selectedRole || (inferredRole ? `Current: ${inferredRole}` : "Select a role")}
              onChange={(e) => handleRoleChange(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="" disabled>
                {inferredRole ? `Current: ${inferredRole}` : "Select a target role"}
              </option>
              {availableRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
              <option value="Custom">+ Add Custom Role</option>
            </select>
            
            {showCustomInput && (
              <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  className="field"
                  placeholder="Enter custom role..."
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  style={{ flex: 1, padding: "0.5rem" }}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleCustomRoleSubmit}
                  disabled={!customRole.trim()}
                >
                  Set
                </button>
              </div>
            )}
          </div>
          
          <span className="pill">
            {selectedRole || customRole || (inferredRole ? `Inferred from resume: ${inferredRole}` : plan?.target_role)}
          </span>
          <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{plan?.summary}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Modules</div>
        {loading ? (
          <div>Loading training plan...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plan?.modules?.map((m: any) => (
                <tr key={m.id}>
                  <td>{m.title}</td>
                  <td>{m.difficulty}</td>
                  <td>{m.duration_weeks} weeks</td>
                  <td>
                    <span className="pill">{m.completed ? "Done" : "Planned"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

