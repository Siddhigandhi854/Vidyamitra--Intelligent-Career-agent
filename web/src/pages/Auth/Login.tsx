import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContextSimple";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      position: "relative"
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        opacity: 0.3
      }} />

      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        padding: "2.5rem",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        position: "relative",
        zIndex: 1
      }}>
        {/* Logo/Title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            color: "white",
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            VidyāMitra
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "1rem",
            fontWeight: "400",
            marginBottom: "0"
          }}>
            Your Intelligent Career Agent
          </p>
        </div>

        {/* Welcome message */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "0.5rem"
          }}>
            Welcome Back
          </h2>
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "0.95rem",
            lineHeight: "1.5"
          }}>
            Sign in to continue your personalized career journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
              fontWeight: "500",
              marginBottom: "0.5rem"
            }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                color: "rgba(255, 255, 255, 0.6)"
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
              fontWeight: "500",
              marginBottom: "0.5rem"
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                color: "rgba(255, 255, 255, 0.6)"
              }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "0.875rem 3rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  padding: "0.25rem"
                }}
              >
                {showPassword ? (
                  <EyeOff style={{ width: "20px", height: "20px" }} />
                ) : (
                  <Eye style={{ width: "20px", height: "20px" }} />
                )}
              </button>
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "8px",
              padding: "0.75rem",
              marginBottom: "1.5rem",
              color: "#6ee7b7",
              fontSize: "0.9rem"
            }}>
              {successMessage}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              padding: "0.75rem",
              marginBottom: "1.5rem",
              color: "#fca5a5",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}

          {/* Sign in button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading 
                ? "rgba(255, 255, 255, 0.3)" 
                : "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 15px 0 rgba(238, 90, 36, 0.3)"
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px 0 rgba(238, 90, 36, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px 0 rgba(238, 90, 36, 0.3)";
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight style={{ width: "20px", height: "20px" }} />
              </>
            )}
          </button>
        </form>

        {/* Sign up link */}
        <div style={{
          marginTop: "2rem",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "0.9rem"
        }}>
          New to VidyāMitra?{" "}
          <Link
            to="/register"
            style={{
              color: "white",
              fontWeight: "600",
              textDecoration: "none",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Create an account
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

