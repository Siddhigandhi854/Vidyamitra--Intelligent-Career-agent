import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextSimple";
import { LogOut, User, Settings, Bell } from 'lucide-react';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link ${isActive ? "nav-link-active" : ""}`;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if there's an error
      navigate("/login");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#f8fafc"
    }}>
      {/* Sidebar */}
      <aside style={{
        width: "280px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 15px rgba(0,0,0,0.1)"
      }}>
        {/* Logo */}
        <div style={{
          marginBottom: "3rem",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            VidyāMitra
          </h1>
          <p style={{
            fontSize: "0.9rem",
            opacity: 0.9,
            margin: 0
          }}>
            Your Career Agent
          </p>
        </div>

        {/* User Info */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "2rem",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <User style={{ width: "20px", height: "20px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                marginBottom: "0.25rem"
              }}>
                {user?.email || "User"}
              </div>
              <div style={{
                fontSize: "0.8rem",
                opacity: 0.8
              }}>
                Premium Plan
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          <div style={{ marginBottom: "2rem" }}>
            <div style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: "1rem",
              letterSpacing: "0.05em"
            }}>
              Overview
            </div>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                color: "white",
                textDecoration: "none",
                background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                transition: "all 0.3s ease",
                marginBottom: "0.5rem"
              })}
            >
              Dashboard
            </NavLink>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <div style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              textTransform: "uppercase",
              opacity: 0.7,
              marginBottom: "1rem",
              letterSpacing: "0.05em"
            }}>
              Career Journey
            </div>
            <NavLink
              to="/resume"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                color: "white",
                textDecoration: "none",
                background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                transition: "all 0.3s ease",
                marginBottom: "0.5rem"
              })}
            >
              Resume Analysis
            </NavLink>
            <NavLink
              to="/roles"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                color: "white",
                textDecoration: "none",
                background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                transition: "all 0.3s ease",
                marginBottom: "0.5rem"
              })}
            >
              Job Roles
            </NavLink>
            <NavLink
              to="/training"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                color: "white",
                textDecoration: "none",
                background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                transition: "all 0.3s ease",
                marginBottom: "0.5rem"
              })}
            >
              Training Plan
            </NavLink>
            <NavLink
              to="/quiz"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                color: "white",
                textDecoration: "none",
                background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                transition: "all 0.3s ease",
                marginBottom: "0.5rem"
              })}
            >
              Quiz Module
            </NavLink>
            <NavLink
              to="/interview"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                color: "white",
                textDecoration: "none",
                background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                transition: "all 0.3s ease",
                marginBottom: "0.5rem"
              })}
            >
              Mock Interview
            </NavLink>
            <NavLink
              to="/progress"
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                color: "white",
                textDecoration: "none",
                background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                transition: "all 0.3s ease",
                marginBottom: "0.5rem"
              })}
            >
              Progress
            </NavLink>
          </div>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "0.9rem",
            fontWeight: "500"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <LogOut style={{ width: "18px", height: "18px" }} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Top Bar */}
        <header style={{
          background: "white",
          padding: "1.5rem 2rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
        }}>
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem"
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                background: "#10b981",
                borderRadius: "50%"
              }} />
              <span style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#059669"
              }}>
                Live Career Coaching
              </span>
            </div>
            <p style={{
              fontSize: "0.875rem",
              color: "#64748b",
              margin: 0
            }}>
              AI-powered career guidance and professional development
            </p>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <button style={{
              padding: "0.5rem",
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Bell style={{ width: "18px", height: "18px", color: "#64748b" }} />
            </button>
            <button style={{
              padding: "0.5rem",
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Settings style={{ width: "18px", height: "18px", color: "#64748b" }} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={{
          flex: 1,
          padding: "2rem",
          overflow: "auto"
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

