import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

export const RegisterWorking: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || success) return;
    
    // Basic validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError("All fields are required");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔐 REAL REGISTER ATTEMPT');
      
      // Use your local backend API with your real data
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });

      console.log('🔐 REGISTER RESPONSE STATUS:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ REGISTER FAILED:', errorText);
        setError(errorText || 'Registration failed');
        return;
      }

      const data = await response.json();
      console.log('✅ REGISTER SUCCESS:', data);
      
      // Store real token
      localStorage.setItem('vm_token', data.access_token);
      localStorage.setItem('vm_user_email', email);
      
      setSuccess(true);
      
      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err: any) {
      console.error('❌ REGISTER ERROR:', err);
      setError(err.message || 'Registration failed. Please try again.');
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
      padding: "1rem"
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",
        padding: "2.5rem",
        maxWidth: "420px",
        width: "100%",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{
            color: "white",
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "0.5rem"
          }}>
            VidyāMitra
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "1rem"
          }}>
            Your Intelligent Career Agent
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "0.5rem"
          }}>
            Create Account
          </h2>
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "0.95rem"
          }}>
            Join VidyāMitra and start your personalized career journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
              fontWeight: "500",
              marginBottom: "0.5rem"
            }}>
              Full Name
            </label>
            <div style={{ position: "relative" }}>
              <User style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                color: "rgba(255, 255, 255, 0.6)"
              }} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

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
                  outline: "none"
                }}
              />
            </div>
          </div>

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
                placeholder="Create a password"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none"
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
                  cursor: "pointer"
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
              fontWeight: "500",
              marginBottom: "0.5rem"
            }}>
              Confirm Password
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
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  outline: "none"
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer"
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: loading || success ? "rgba(255, 255, 255, 0.3)" : "white",
              color: "#667eea",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading || success ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              marginBottom: "1rem"
            }}
          >
            {loading ? "Creating Account..." : success ? "Account Created!" : "Create Account"}
          </button>

          {error && (
            <div style={{
              padding: "0.75rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              color: "#ef4444",
              textAlign: "center",
              fontSize: "0.9rem",
              marginBottom: "1rem"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: "0.75rem",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "8px",
              color: "#22c55e",
              textAlign: "center",
              fontSize: "0.9rem",
              marginBottom: "1rem"
            }}>
              Registration successful! Redirecting to dashboard...
            </div>
          )}
        </form>

        <div style={{
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.8)"
        }}>
          <p style={{ fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "white", textDecoration: "underline" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
