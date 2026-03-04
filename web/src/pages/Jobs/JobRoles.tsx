import React, { useMemo, useState } from "react";
import { fetchJobRecommendations } from "../../services/jobs";

export const JobRoles: React.FC = () => {
  const [search, setSearch] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    const load = async () => {
      const data = await fetchJobRecommendations();
      setRoles(data.recommendations || []);
      setLoaded(true);
    };
    load();
  }, []);

  const filtered = useMemo(
    () =>
      roles.filter((r) =>
        `${r.title} ${r.company}`.toLowerCase().includes(search.toLowerCase())
      ),
    [roles, search]
  );

  const handleAddCustom = () => {
    if (!customRole.trim()) return;
    const newRole = {
      id: roles.length + 1,
      title: customRole.trim(),
      company: "Custom",
      location: "N/A",
      match_score: 0,
    };
    const next = [...roles, newRole];
    setRoles(next);
    setCustomRole("");
    localStorage.setItem("vm_custom_roles", JSON.stringify(next));
  };

  return (
    <div>
      <div className="page-title">Target Job Roles</div>
      <div className="page-subtitle">
        Explore suggested roles and define your own ideal target positions.
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="field">
          <label>Search roles</label>
          <input
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title or company..."
          />
        </div>

        <div className="field">
          <label>Create custom role</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              className="input"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="e.g. ML Engineer in edtech"
            />
            <button className="btn btn-primary" type="button" onClick={handleAddCustom}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recommended Roles</div>
        {!loaded ? (
          <div>Loading roles...</div>
        ) : filtered.length === 0 ? (
          <div>No roles match your filters yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.company}</td>
                  <td>{r.location}</td>
                  <td>{r.match_score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

