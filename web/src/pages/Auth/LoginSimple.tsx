import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginSimple: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 REAL LOGIN ATTEMPT');
      
      // Use real backend API
      const response = await fetch('https://vidyamitra-backend-uprd.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      console.log('🔐 LOGIN RESPONSE STATUS:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ LOGIN FAILED:', errorText);
        setError(errorText || 'Login failed');
        return;
      }

      const data = await response.json();
      console.log('✅ LOGIN SUCCESS:', data);
      
      // Store real token
      localStorage.setItem('vm_token', data.access_token);
      localStorage.setItem('vm_user_email', email);
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('❌ LOGIN ERROR:', err);
      setError(err.message || 'Login failed. Please try again.');
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
      padding: "2rem"
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
        padding: "3rem",
        width: "100%",
        maxWidth: "450px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "white",
            marginBottom: "0.5rem"
          }}>
            Welcome Back
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            Sign in to your VidyāMitra account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              color: "white",
              marginBottom: "0.5rem",
              fontSize: "0.9rem"
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "1rem"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              color: "white",
              marginBottom: "0.5rem",
              fontSize: "0.9rem"
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontSize: "1rem"
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: loading ? "rgba(255, 255, 255, 0.3)" : "white",
              color: "#667eea",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease"
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && (
            <div style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              color: "#ef4444",
              textAlign: "center",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}
        </form>

        <div style={{
          marginTop: "2rem",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.8)"
        }}>
          <p style={{ fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "white", textDecoration: "underline" }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
