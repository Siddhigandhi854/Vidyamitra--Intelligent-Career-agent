import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoginBasic: React.FC = () => {
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
      console.log('🔐 BASIC LOGIN ATTEMPT');
      
      // Direct API call - no complex auth
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

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText);
        return;
      }

      const data = await response.json();
      console.log('✅ LOGIN SUCCESS:', data);
      
      // Store in localStorage
      localStorage.setItem('vm_token', data.access_token);
      localStorage.setItem('vm_user_email', email);
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          
          {error && (
            <div style={{
              color: '#dc2626',
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#f8d7da',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
